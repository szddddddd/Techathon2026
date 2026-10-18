// Real content stays in memory here; persistence belongs exclusively to the
// encrypted desktop store. Never write these rows into the demo IndexedDB.
export async function withDesktopMail(demo, bridge=globalThis.desktopMain) {
  if(!bridge?.mailRequest)return demo;
  const empty=()=>({connections:[],conversations:[],messages:[],contacts:[],local:{},actions:[],audit:[]});
  let mail=empty(),closed=false,refreshing=null,dirty=false;
  const listeners=new Set();
  const notify=()=>{for(const fn of listeners)fn();};
  async function request(operation,extra={}) {
    const result=await bridge.mailRequest({operation,...extra});
    if(!result?.ok)throw Object.assign(new Error(result?.error?.message||'桌面邮箱暂不可用。'),{code:result?.error?.code});
    return result.value;
  }
  function refresh() {
    dirty=true;
    if(refreshing)return refreshing;
    refreshing=(async()=>{while(dirty&&!closed){dirty=false;try{const next=await request('snapshot');if(!closed){mail=next;notify();}}catch(error){if(!closed){mail.error={message:error.message};notify();}}}})().finally(()=>{refreshing=null;});
    return refreshing;
  }
  const unsubscribe=bridge.onMailChanged?.(()=>{void refresh();});
  await refresh();
  const real=id=>typeof id==='string'&&['mail-qq-real','mail-netease-real'].some(prefix=>id===prefix||id.startsWith(prefix+':'));
  const gateway=Object.create(demo);
  Object.defineProperty(gateway,'snapshot',{get(){const base=demo.snapshot;return {...base,connections:[...base.connections,...mail.connections],conversations:[...base.conversations,...mail.conversations],messages:[...base.messages,...mail.messages],local:{...base.local,...mail.local},audit:[...base.audit,...mail.audit],mailError:mail.error,mailErrors:mail.errors||{}};}});
  gateway.mail={get error(){return mail.error;},async connect(provider='qqmail'){return request('connect',{provider});},async openWebmail(id){return request('open-webmail',{id});}};
  gateway.subscribe=fn=>{listeners.add(fn);const off=demo.subscribe(fn);return()=>{listeners.delete(fn);off();};};
  gateway.list=(options={})=>{
    const {query='',platform='all',filter='all'}=options,q=String(query).trim().toLocaleLowerCase();
    const rows=mail.messages.flatMap(m=>{
      const local=mail.local[m.id]||{},c=mail.connections.find(c=>c.id===m.connectionId);if(!c||platform!=='all'&&platform!==c.platform)return [];
      if(q&&!`${m.subject} ${m.sender.name} ${m.sender.address} ${m.text}`.toLocaleLowerCase().includes(q))return [];
      if(filter==='unread'&&local.read||filter==='todo'&&!local.todo||filter==='pinned'&&!local.pinned)return [];
      return [{id:m.threadId,title:m.subject,displayName:m.sender.name,senderName:m.sender.name,kind:'direct',synthetic:false,real:true,preview:`${m.subject} · ${m.text}`,updatedAt:m.createdAt,unread:local.read?0:1,pinned:!!local.pinned,todo:!!local.todo,platform:c.platform,accountLabel:c.label,connectionId:c.id,provenanceLabel:'真实邮箱 · 只读'}];
    });
    return [...demo.list(options),...rows].sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.updatedAt-a.updatedAt);
  };
  gateway.readThread=id=>{
    if(!real(id))return demo.readThread(id);
    const thread=mail.conversations.find(t=>t.id===id);if(!thread)throw new Error('邮件已移除或连接已断开。');
    return {thread:structuredClone(thread),connection:structuredClone(mail.connections.find(c=>c.id===thread.connectionId)),messages:structuredClone(mail.messages.filter(m=>m.threadId===id)),draft:null};
  };
  gateway.setLocal=async(id,patch)=>{if(!real(id))return demo.setLocal(id,patch);await request('local',{id,patch});await refresh();};
  gateway.sync=async(id,options)=>{if(!real(id))return demo.sync(id,options);const result=await request('sync',{id});await refresh();return result;};
  gateway.disconnect=async id=>{if(!real(id))return demo.disconnect(id);const result=await request('disconnect',{id});await refresh();return result;};
  for(const key of ['saveDraft','proposeSend','setPermissions'])gateway[key]=(id,...args)=>real(id)?Promise.reject(new Error('真实邮箱目前仅支持只读。')):demo[key](id,...args);
  gateway.summarize=ids=>{if(ids.some(real))return Promise.reject(new Error('真实邮件尚未授权给 Agent。'));return demo.summarize(ids);};
  gateway.close=()=>{closed=true;unsubscribe?.();listeners.clear();mail=empty();demo.close();};
  return gateway;
}
