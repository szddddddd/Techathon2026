import {openInboxStore,clone,emptyState} from './store.js';
import {PERMISSIONS,platformOf} from './catalog.js';
import {makeConnection,fixtureContact} from './fixtures.js';
import {createDemoConnector} from './connectors.js';
import {requirePermission,fail,digest,uid,safeExternalURL,safeImage} from './policy.js';
import {summarizeMessages} from './agent.js';

const active=c=>c&&c.status!=='disconnected'&&c.status!=='revoked';
const has=(c,p)=>active(c)&&Boolean(c.capabilities?.[p]?.supported&&c.permissions?.[p]);
const text=(value,max=20_000)=>{if(typeof value!=='string'||value.length>max)throw fail('INVALID_INPUT','内容格式或长度不正确');return value.trim();};
const loc=(s,id)=>s.local[id]||(s.local[id]={read:false,pinned:false,todo:true,draft:null});
const actionBinding=a=>({connectionId:a.connectionId,threadId:a.threadId,actor:a.actor,command:a.command,revision:a.revision});

/** Demo only. No credentials, external requests or real-send adapters exist here. */
export async function createInboxGateway({dbName='weroam-inbox-demo-v1',indexedDB=globalThis.indexedDB,now=Date.now}={}){
  if(typeof dbName!=='string'||!dbName||dbName.length>200)throw fail('INVALID_INPUT','演示数据库名称无效');
  const repository=await openInboxStore({dbName,indexedDB});
  let state=repository.state,queue=Promise.resolve(),closed=false,epoch=0;
  state.contacts ??= state.connections.filter(c=>c.status==='connected'&&state.conversations.some(t=>t.id===`external:${c.id}:thread-1`)).map(fixtureContact);
  const listeners=new Set(),fences=new Map(),blockedConnections=new Set();
  function visibleConnection(c){return blockedConnections.has(c?.id)?{...c,permissions:Object.fromEntries(Object.keys(c.permissions).map(p=>[p,false])),pendingRefresh:true}:c;}
  function audit(s,type,connectionId='',detail={}){
    // All detail values are controlled metadata; never body/recipient/credentials.
    s.audit.push({id:uid('audit'),type,connectionId,at:now(),...detail});
    if(s.audit.length>500)s.audit.splice(0,s.audit.length-500);
  }
  function connection(s,id){const c=s.connections.find(c=>c.id===id);if(!c)throw fail('NOT_FOUND','未找到连接');return c;}
  function thread(s,id){const t=s.conversations.find(t=>t.id===id);if(!t)throw fail('NOT_FOUND','未找到会话');return t;}
  function ensure(){if(closed)throw fail('CLOSED','收件箱已关闭');}
  function capture(id){return {epoch,revision:fences.get(id)||0};}
  function assertFence(id,fence){if(epoch!==fence.epoch||(fences.get(id)||0)!==fence.revision)throw fail('REVOKED','权限已变更或连接已撤销');}
  function invalidateFence(id){fences.set(id,(fences.get(id)||0)+1);}
  function publicMessage(m,c){
    const body=has(c,'messages.read.body'),attachments=has(c,'attachments.read');
    return {...clone(m),text:body?m.text:'[正文权限未授权]',attachments:attachments?clone(m.attachments):[],bodyRestricted:!body,attachmentsRestricted:!attachments};
  }
  function projection(){
    const s=clone(state);delete s.approvals;delete s.storageRevision;
    s.connections=s.connections.map(c=>({...visibleConnection(c),sync:clone(s.sync[c.id]||{})}));
    const visible=new Set(s.connections.filter(c=>has(c,'messages.read.metadata')).map(c=>c.id));
    s.contacts=(s.contacts||[]).filter(c=>!c.connectionId||visible.has(c.connectionId));
    s.conversations=s.conversations.filter(t=>visible.has(t.connectionId));
    s.messages=s.messages.filter(m=>visible.has(m.connectionId)).map(m=>publicMessage(m,connection(state,m.connectionId)));
    for(const [id,l] of Object.entries(s.local)){
      const t=state.conversations.find(t=>t.id===id),c=t&&state.connections.find(c=>c.id===t.connectionId);
      if(!t||!visible.has(t.connectionId)){delete s.local[id];continue;}
      if(!has(c,'messages.read.body'))l.draft=null;
    }
    s.actions=s.actions.map(a=>{const c=visibleConnection(state.connections.find(c=>c.id===a.connectionId));if(!has(c,'messages.read.metadata')||!has(c,'messages.read.body')){a.command={recipient:'',text:'[正文权限未授权]',attachments:[]};}return a;});
    return s;
  }
  function emit(){const view=projection();for(const fn of listeners){try{fn(clone(view));}catch(error){console.error('Inbox subscription failed',error?.name||'Error');}}}
  repository.watch(event=>{
    if(closed||!Array.isArray(event?.connections)||(event.storageRevision||0)<=(state.storageRevision||0))return;
    for(const id of event.connections)blockedConnections.add(id);
    epoch++;emit();
    queue=queue.then(async()=>{if(closed)return;state=await repository.load();blockedConnections.clear();emit();}).catch(()=>{});
  });
  function mutate(operation){
    const task=queue.then(async()=>{
      ensure();const next=clone(state),expectedRevision=state.storageRevision||0,result=await operation(next);ensure();
      try{next.storageRevision=await repository.save(next,{expectedRevision});}catch(error){if(error.code==='STORAGE_CONFLICT'){state=await repository.load();emit();}throw error;}
      state=next;emit();return clone(result);
    });
    queue=task.catch(()=>{});return task;
  }
  function invalidateActions(s,id,reason){
    for(const a of s.actions)if(a.connectionId===id&&['proposed','approved'].includes(a.status)){a.status='cancelled';a.reason=reason;}
    for(const [key,a] of Object.entries(s.approvals))if(a.connectionId===id)delete s.approvals[key];
  }
  function purgeConnection(s,id,status='disconnected'){
    const c=connection(s,id);c.status=status;c.revision++;c.lastSyncAt=null;
    for(const k of Object.keys(c.permissions))c.permissions[k]=false;
    const removed=new Set(s.conversations.filter(t=>t.connectionId===id).map(t=>t.id));
    s.contacts=(s.contacts||[]).filter(c=>c.connectionId!==id);
    s.conversations=s.conversations.filter(t=>t.connectionId!==id);s.messages=s.messages.filter(m=>m.connectionId!==id);
    for(const tid of removed)delete s.local[tid];delete s.sync[id];
    invalidateActions(s,id,'连接已撤销');
    for(const a of s.actions)if(a.connectionId===id){a.command={recipient:'',text:'',attachments:[]};delete a.digest;}
    audit(s,'connection.disconnected',id,{remoteRevoked:false});
  }
  async function pullInto(s,c,scenario,fence){
    const previous=s.sync[c.id]||{},connector=createDemoConnector(c,{now});
    const batch=await connector.pull(previous.cursor,{seedAt:c.createdAt},null,{scenario});assertFence(c.id,fence);
    let added=0;
    for(const t of batch.conversations){const index=s.conversations.findIndex(x=>x.id===t.id);if(index<0){s.conversations.push(t);loc(s,t.id);}else s.conversations[index]={...s.conversations[index],...t,updatedAt:Math.max(s.conversations[index].updatedAt,t.updatedAt)};}
    for(const m of batch.upserts){
      const index=s.messages.findIndex(x=>x.id===m.id&&x.connectionId===c.id);
      if(index<0){
        const latest=s.messages.filter(x=>x.threadId===m.threadId&&x.direction==='incoming').reduce((a,b)=>Math.max(a,b.createdAt),-Infinity);
        s.messages.push(m);added++;
        if(m.direction==='incoming'&&m.createdAt>=latest){loc(s,m.threadId).read=false;loc(s,m.threadId).todo=true;}
      }else{
        const existing=s.messages[index];
        if((m.sourceVersion??0)<(existing.sourceVersion??0)||(m.updatedAt??m.createdAt)<(existing.updatedAt??existing.createdAt))continue;
        s.messages[index]=m;
      }
      const t=s.conversations.find(t=>t.id===m.threadId);if(t)t.updatedAt=Math.max(t.updatedAt,m.createdAt);
    }
    for(const id of batch.tombstones)s.messages=s.messages.filter(m=>!(m.connectionId===c.id&&m.platformMessageId===id));
    s.messages.sort((a,b)=>a.createdAt-b.createdAt||a.id.localeCompare(b.id));
    c.lastSyncAt=now();c.status='connected';
    s.sync[c.id]={status:'ok',cursor:batch.nextCursor,lastSuccessAt:now(),attempts:0,nextRetryAt:null,...(previous.nextSendScenario?{nextSendScenario:previous.nextSendScenario}:{})};
    audit(s,'sync.completed',c.id,{added});
    if(batch.cursorReset)audit(s,'sync.cursor-reset',c.id);
    return {status:'ok',added,total:s.messages.filter(m=>m.connectionId===c.id).length,cursor:batch.nextCursor};
  }
  const gateway={
    get snapshot(){ensure();return projection();},
    subscribe(fn){ensure();if(typeof fn!=='function')throw fail('INVALID_INPUT','订阅回调无效');listeners.add(fn);return ()=>listeners.delete(fn);},
    close(){closed=true;epoch++;listeners.clear();queue.then(()=>repository.close(),()=>repository.close());},
    list({query='',platform='all',filter='all'}={}){
      ensure();const q=String(query).trim().toLocaleLowerCase();
      return state.conversations.flatMap(t=>{
        const c=visibleConnection(state.connections.find(c=>c.id===t.connectionId));if(!has(c,'messages.read.metadata')||(platform!=='all'&&c.platform!==platform))return [];
        const l=state.local[t.id]||{},messages=state.messages.filter(m=>m.threadId===t.id),last=messages.at(-1);
        if(q&&!has(c,'messages.search.local'))return [];
        const body=has(c,'messages.read.body'),searchable=[t.title,...(body?messages.map(m=>m.text):[])].join(' ').toLocaleLowerCase();
        if(q&&!searchable.includes(q))return [];
        if(filter==='unread'&&l.read)return [];if(filter==='todo'&&!l.todo)return [];if(filter==='pinned'&&!l.pinned)return [];
        const contact=(state.contacts||[]).find(c=>c.threadId===t.id),sender=messages.findLast(m=>m.direction==='incoming')?.sender;
        const senderName=typeof sender==='string'?sender.replace(/\s*<[^>]*>/g,'').trim():sender?.name||sender?.address||'';
        const kind=t.kind||(c.platform==='qq'&&t.platformThreadId==='thread-1'?'group':'direct');
        const displayName=kind==='group'?t.title.split(' · ')[0]:contact?.name||(senderName==='手动收录'?t.title:senderName)||t.title;
        const preview=body?(l.draft?.text?'[草稿] '+l.draft.text:last?.text||'暂无消息'):'[正文权限未授权]';
        return [{id:t.id,title:t.title,displayName,senderName,kind,avatarUrl:contact?.avatarUrl||null,synthetic:!!last?.provenance?.synthetic,preview,updatedAt:t.updatedAt,unread:l.read?0:messages.filter(m=>m.direction==='incoming').length,pinned:Boolean(l.pinned),todo:Boolean(l.todo),platform:c.platform,accountLabel:c.label,provenanceLabel:t.provenanceLabel,connectionId:c.id}];
      }).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.updatedAt-a.updatedAt).map(clone);
    },
    readThread(id){
      ensure();const t=thread(state,id),c=visibleConnection(connection(state,t.connectionId));requirePermission(c,'messages.read.metadata');
      return {thread:clone(t),connection:clone(c),messages:state.messages.filter(m=>m.threadId===id).map(m=>publicMessage(m,c)),draft:has(c,'messages.read.body')?clone(state.local[id]?.draft||null):null};
    },
    loadDemo({allowSend=false,allowAI=false}={}){
      epoch++;return mutate(async s=>{
        Object.assign(s,emptyState());
        for(const platform of ['qqmail','wechat','qq','douyin','xiaohongshu']){
          const c=makeConnection(platform,{allowSend,allowAI,now:now()});s.connections.push(c);
          await pullInto(s,c,'normal',capture(c.id));s.contacts.push(fixtureContact(c));
        }
        audit(s,'demo.loaded');return {connections:s.connections.length,conversations:s.conversations.length};
      });
    },
    saveContact(input){input=clone(input);return mutate(s=>{
      if(!['qqmail','wechat','qq','douyin','xiaohongshu'].includes(input?.platform))throw fail('INVALID_INPUT','请选择来源软件');
      const name=text(input.name,80),account=text(input.account||'',160),note=text(input.note||'',500);
      if(!name)throw fail('INVALID_INPUT','请填写好友昵称');
      s.contacts ||= [];
      const existing=input.id?s.contacts.find(c=>c.id===input.id):null;
      if(input.id&&!existing)throw fail('NOT_FOUND','好友记录已移除');
      if(existing?.connectionId&&!has(visibleConnection(s.connections.find(c=>c.id===existing.connectionId)),'messages.read.metadata'))throw fail('PERMISSION_DENIED','来源不可访问');
      if(account&&s.contacts.some(c=>c.id!==existing?.id&&c.platform===input.platform&&c.account.toLowerCase()===account.toLowerCase()))throw fail('INVALID_INPUT','该软件账号已记录');
      const avatarUrl=input.avatarUrl===undefined?(existing?.avatarUrl||''):String(input.avatarUrl);
      if(avatarUrl&&(!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(avatarUrl)||avatarUrl.length>8*1024*1024))throw fail('INVALID_INPUT','请选择有效头像');
      if(existing?.avatarUrl&&avatarUrl!==existing.avatarUrl)throw fail('INVALID_INPUT','已生成的好友请保留原头像');
      const characterJobId=existing?.characterJobId||(avatarUrl?crypto.randomUUID():null);
      const contact={id:existing?.id||uid('contact'),platform:input.platform,name,account,note,avatarUrl,characterJobId,provenance:existing?.provenance||'manual',updatedAt:now()};
      if(existing&&existing.platform===input.platform)Object.assign(contact,{connectionId:existing.connectionId,threadId:existing.threadId});
      if(existing)s.contacts[s.contacts.indexOf(existing)]=contact;else s.contacts.push(contact);
      return contact;
    });},
    removeContact(id){return mutate(s=>{const contact=(s.contacts||[]).find(c=>c.id===id);if(!contact)throw fail('NOT_FOUND','好友记录已移除');s.contacts=s.contacts.filter(c=>c.id!==id);return {removed:true};});},
    reset(){epoch++;return mutate(s=>{Object.assign(s,emptyState());return {reset:true};});},
    setPermissions(connectionId,patch){
      if(!patch||typeof patch!=='object'||Array.isArray(patch))return Promise.reject(fail('INVALID_INPUT','权限设置无效'));
      for(const [key,value] of Object.entries(patch))if(!Object.hasOwn(PERMISSIONS,key)||typeof value!=='boolean')return Promise.reject(fail('INVALID_INPUT','权限设置无效'));
      patch=clone(patch);
      invalidateFence(connectionId);
      return mutate(s=>{
        const c=connection(s,connectionId);if(!active(c))throw fail('REVOKED','连接已撤销');
        for(const [key,value] of Object.entries(patch))if(value&&!c.capabilities[key]?.supported)throw fail('UNSUPPORTED',c.capabilities[key]?.reason||'不支持此权限');
        Object.assign(c.permissions,patch);c.revision++;invalidateActions(s,c.id,'权限已变更');
        audit(s,'permissions.changed',c.id,{permissions:Object.keys(patch)});return c;
      });
    },
    setLocal(id,patch){
      if(!patch||typeof patch!=='object'||Array.isArray(patch))return Promise.reject(fail('INVALID_INPUT','本地状态设置无效'));
      patch=clone(patch);return mutate(s=>{
      const t=thread(s,id);requirePermission(connection(s,t.connectionId),'messages.read.metadata');
      for(const k of Object.keys(patch))if(!['read','pinned','todo'].includes(k)||typeof patch[k]!=='boolean')throw fail('INVALID_INPUT','本地状态设置无效');
      Object.assign(loc(s,id),patch);return s.local[id];
    });},
    saveDraft(id,value,recipient){return mutate(s=>{
      const t=thread(s,id),c=connection(s,t.connectionId);requirePermission(c,'drafts.write.local');requirePermission(c,'messages.read.body');
      loc(s,id).draft={text:text(value),recipient:recipient===undefined?t.recipient:text(recipient,320),updatedAt:now()};
      for(const a of s.actions)if(a.threadId===id&&['proposed','approved'].includes(a.status)){a.status='cancelled';a.reason='草稿已编辑，需重新确认';for(const [key,approval] of Object.entries(s.approvals))if(approval.actionId===a.id)delete s.approvals[key];}
      return s.local[id].draft;
    });},
    importManual(input){input=clone(input);return mutate(s=>{
      if(!['wechat','qq','douyin','xiaohongshu'].includes(input?.platform))throw fail('UNSUPPORTED','请选择手动收录的社交平台');
      const title=text(input.title,200),body=text(input.text||'');if(!title||(!body&&!input.image&&!input.url))throw fail('INVALID_INPUT','请填写标题与消息、链接或图片');
      const url=safeExternalURL(input.url,platformOf(input.platform).url),image=safeImage(input.image);
      let c=s.connections.find(c=>c.id==='demo:'+input.platform);
      if(!c){c=makeConnection(input.platform,{now:now()});s.connections.push(c);}else if(!active(c))throw fail('REVOKED','来源已撤销，请先重新加载演示');
      const id=uid('external:manual'),at=now(),t={id,connectionId:c.id,ownerId:s.ownerId,platformThreadId:id,title,recipient:'',participants:[],updatedAt:at,provenance:'manual',provenanceLabel:'手动收录 · 用户提供',sourceURL:url};
      s.conversations.push(t);s.messages.push({id:uid('manual-message'),platformMessageId:id,connectionId:c.id,threadId:id,ownerId:s.ownerId,direction:'incoming',sender:'手动收录',createdAt:at,text:body,bodyType:'text',attachments:image?[image]:[],remoteState:{},provenance:{kind:'manual',label:'手动收录 · 用户提供',synthetic:false,acquiredAt:at,completeness:'用户提供的片段',sourceURL:url}});loc(s,id);
      audit(s,'manual.imported',c.id,{hasImage:Boolean(image),hasLink:Boolean(url)});return t;
    });},
    summarize(ids){return mutate(s=>{
      if(!Array.isArray(ids)||!ids.length||ids.length>50)throw fail('INVALID_INPUT','请选择 1–50 个会话');
      // Caller explicitly selects the task scope; nothing in message text changes it.
      const results=[...new Set(ids)].map(id=>{
        const t=thread(s,id),c=connection(s,t.connectionId);
        for(const p of ['messages.read.metadata','messages.read.body','ai.process'])requirePermission(c,p,{actor:'agent',taskPermissions:['messages.read.metadata','messages.read.body','ai.process']});
        return summarizeMessages(t,s.messages.filter(m=>m.threadId===id));
      });
      audit(s,'agent.summarized','',{count:results.length});return results;
    });},
    proposeSend(id,command,actor='user'){
      command=clone(command);
      const t=state.conversations.find(t=>t.id===id),fence=capture(t?.connectionId);
      return mutate(async s=>{
        const t=thread(s,id),c=connection(s,t.connectionId);requirePermission(c,'messages.send',{actor,taskPermissions:['messages.send']});requirePermission(c,'messages.read.metadata',{actor});requirePermission(c,'messages.read.body',{actor});
        if(actor==='agent')requirePermission(c,'ai.process',{actor});
        if(c.platform!=='qqmail'||t.provenance!=='demo')throw fail('UNSUPPORTED','此来源请回原应用发送');
        const recipient=text(command?.recipient||t.recipient||'',320),body=text(command?.text||'');
        if(!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(recipient)||!body)throw fail('INVALID_INPUT','请填写有效收件人与回复正文');
        if(!Array.isArray(command?.attachments||[])||(command.attachments||[]).length)throw fail('UNSUPPORTED','首版模拟发送不发送附件');
        const a={id:uid('action'),threadId:id,connectionId:c.id,actor,command:{recipient,text:body,attachments:[]},revision:c.revision,status:'proposed',createdAt:now()};
        a.digest=await digest(actionBinding(a));assertFence(c.id,fence);s.actions.push(a);audit(s,'send.proposed',c.id,{actionId:a.id,actor});return a;
      });
    },
    approve(actionId,actor='user'){return mutate(async s=>{
      if(actor!=='user')throw fail('PERMISSION_DENIED','仅用户本人可批准发送');
      const a=s.actions.find(a=>a.id===actionId);if(!a||a.status!=='proposed')throw fail('APPROVAL_INVALID','该操作已变更、失效或处理');
      const c=connection(s,a.connectionId),fence=capture(c.id);requirePermission(c,'messages.send');
      if(c.revision!==a.revision||await digest(actionBinding(a))!==a.digest)throw fail('APPROVAL_INVALID','内容或权限已改变');assertFence(c.id,fence);
      const approvalId=uid('approval');s.approvals[approvalId]={id:approvalId,actionId:a.id,connectionId:c.id,actor:a.actor,digest:a.digest,revision:c.revision,expiresAt:now()+300_000,used:false};a.status='approved';
      audit(s,'send.approved',c.id,{actionId:a.id});return approvalId;
    });},
    execute(actionId,approvalId){
      const existing=state.actions.find(a=>a.id===actionId),fence=capture(existing?.connectionId);
      return mutate(async s=>{
        const a=s.actions.find(a=>a.id===actionId),approval=s.approvals[approvalId];
        if(!approvalId)throw fail('APPROVAL_REQUIRED','发送必须先逐次确认');
        if(!a||!approval||approval.actionId!==actionId||approval.used||a.status!=='approved')throw fail('APPROVAL_INVALID','缺少有效的一次性批准');
        const c=connection(s,a.connectionId);requirePermission(c,'messages.send',{actor:a.actor});requirePermission(c,'messages.read.body',{actor:a.actor});if(a.actor==='agent')requirePermission(c,'ai.process',{actor:a.actor});
        if(approval.expiresAt<=now()||approval.revision!==c.revision||a.revision!==c.revision||approval.actor!==a.actor||approval.digest!==await digest(actionBinding(a)))throw fail('APPROVAL_INVALID','批准已过期或内容、权限已改变');
        assertFence(c.id,fence);approval.used=true;
        const connector=createDemoConnector(c,{now}),scenario=s.sync[c.id]?.nextSendScenario;
        const receipt=await connector.execute(a.command,{approvalId,actionId,scenario});assertFence(c.id,fence);
        a.status=receipt.status;a.receipt=receipt;a.executedAt=now();if(s.sync[c.id])delete s.sync[c.id].nextSendScenario;
        if(a.status==='sent'){
          const t=thread(s,a.threadId),at=now();s.messages.push({id:uid('mock-sent'),platformMessageId:receipt.platformMessageId,connectionId:c.id,threadId:t.id,ownerId:s.ownerId,direction:'outgoing',sender:c.label,recipient:a.command.recipient,createdAt:at,text:a.command.text,bodyType:'text',attachments:[],remoteState:{delivery:'simulated'},provenance:{kind:'demo',label:'模拟发送 · 未向外部平台发送',synthetic:true,acquiredAt:at,completeness:'模拟正文'}});t.updatedAt=at;loc(s,t.id).draft=null;loc(s,t.id).read=true;loc(s,t.id).todo=false;
        }
        audit(s,'send.'+a.status,c.id,{actionId:a.id});return a;
      });
    },
    deny(actionId){return mutate(s=>{
      const a=s.actions.find(a=>a.id===actionId);if(!a||!['proposed','approved'].includes(a.status))throw fail('APPROVAL_INVALID','该操作已处理');
      a.status='denied';for(const [key,p] of Object.entries(s.approvals))if(p.actionId===a.id)delete s.approvals[key];audit(s,'send.denied',a.connectionId,{actionId:a.id});return a;
    });},
    disconnect(connectionId){invalidateFence(connectionId);return mutate(s=>{purgeConnection(s,connectionId);return {disconnected:true,remoteRevoked:false};});},
    async sync(connectionId,{scenario='normal'}={}){
      if(!['normal','repeat','out-of-order','offline','revoked','unknown-send','new-message','tombstone','cursor-invalid'].includes(scenario))throw fail('INVALID_INPUT','未知同步演示情景');
      const fence=capture(connectionId);
      const result=await mutate(async s=>{
        const c=connection(s,connectionId);requirePermission(c,'messages.read.metadata');requirePermission(c,'messages.read.body');
        try{
          if(scenario==='unknown-send'){
            s.sync[c.id]||={};s.sync[c.id].nextSendScenario='unknown-send';audit(s,'demo.unknown-send.armed',c.id);return {status:'ok',armed:true};
          }
          return await pullInto(s,c,scenario,fence);
        }catch(error){
          if(error.code==='REVOKED'&&scenario==='revoked'){purgeConnection(s,c.id,'revoked');return {error:{code:'REVOKED',message:'模拟平台授权已失效'}};}
          if(error.code==='REVOKED')throw error;
          const previous=s.sync[c.id]||{},attempts=(previous.attempts||0)+1;
          const delay=Math.min(60_000,1000*2**Math.min(attempts,6))*(0.8+Math.random()*0.4);
          s.sync[c.id]={...previous,status:'error',errorCode:error.code||'SYNC_FAILED',attempts,nextRetryAt:now()+Math.round(delay)};
          audit(s,'sync.failed',c.id,{code:error.code||'SYNC_FAILED'});return {error:{code:error.code||'SYNC_FAILED',message:error.message}};
        }
      });
      if(result.error)throw fail(result.error.code,result.error.message);return result;
    },
  };
  return gateway;
}
