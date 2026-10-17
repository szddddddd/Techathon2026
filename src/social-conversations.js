import {createDirectoryResize} from './directory-resize.js';
import {appIcon} from './inbox/icons.js';
import {mixedConversations,conversationKey,conversationRef,groupOf,groupUnread} from './group-catalog.js';
import {groupAvatar} from './group-ui.js';
import {friendOf,friendAvatar,allFriends} from './social-store.js';
import {conversationIds,unreadCounts} from './social-presence.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stamp=t=>!t?'':new Date(t).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
export function createConversations({root,store,friends,ui,onError=console.error,onViewProfile=()=>{},onNewContact=()=>{},onCreateGroup=()=>{},onGroups=()=>{},onGroupInfo=()=>{},onInboxChange=()=>{}}){
  const directory=root.querySelector('#directory');let tab='messages',menuId=null,addQuery='',pressStart=null,longPress=null,suppressedUntil=0;
  let inbox=null,inboxReady=null,inboxAttempt=0,disposed=false,platform='all',account='all',filter='all',contactPlatform='all',contactKind='friends';
  directory.innerHTML='<header class="contacts-title"><div><small>LETTERS FROM THE WOODS</small><h2>消息</h2></div><button class="contacts-add" data-action="add-directory" aria-label="添加好友或发起群聊">＋</button><button class="ui-close" data-ui-close="directory" aria-label="关闭好友列表">×</button></header><label class="search">⌕ <input id="friend-search" placeholder="搜索好友、群聊或消息" aria-label="搜索好友"></label><div class="directory-tabs" role="tablist"><button role="tab" data-conversation-tab="messages" aria-selected="true">消息 <span id="friend-unread-count"></span></button><button role="tab" data-conversation-tab="contacts" aria-selected="false">通讯录 <span id="friend-count"></span></button></div><div id="friend-list" role="list" aria-label="好友会话"></div><p class="contacts-footnote">朋友与群聊，都住在风景里</p>';
  directory.classList.add('universal-directory');
  directory.setAttribute('aria-label','统一收件箱与通讯录');
  directory.querySelector('.contacts-title small').textContent='WeRoam';
  directory.querySelector('.contacts-title h2').textContent='Universal Inbox';
  directory.querySelector('.contacts-footnote').textContent='本地演示';
  directory.querySelector('#friend-list').insertAdjacentHTML('beforebegin',`<div class="inbox-toolbar"><button type="button" class="inbox-primary" data-inbox-open="assistant">整理回复 <span aria-hidden="true">↗</span></button><button type="button" data-inbox-open="center">连接</button><details class="inbox-more"><summary aria-label="收件箱更多选项" title="更多">···</summary><div class="inbox-more-menu"><button type="button" data-inbox-open="demo">体验示例</button><button type="button" data-inbox-open="import">收录消息</button><button type="button" data-inbox-open="audit">操作记录</button><div class="inbox-filters"><label>账号<select class="inbox-account-filter" aria-label="筛选消息账号"><option value="all">全部账号</option><option value="native">本地聊天</option></select></label><label>状态<select class="inbox-state-filter" aria-label="筛选消息状态"><option value="all">全部消息</option><option value="unread">未读</option><option value="todo">待处理</option></select></label></div></div></details></div><nav class="inbox-platforms" aria-label="消息来源"><button type="button" data-inbox-platform="all" aria-pressed="true">全部</button><button type="button" data-inbox-platform="native" aria-label="本地聊天" title="本地聊天"><img src="assets/branding/weroam-icon.png" alt="WeRoam" width="28" height="28"></button>${['qqmail','wechat','qq','douyin','xiaohongshu'].map(id=>`<button type="button" data-inbox-platform="${id}" aria-label="${{qqmail:'QQ 邮箱',wechat:'微信',qq:'QQ',douyin:'抖音',xiaohongshu:'小红书'}[id]}">${appIcon(id)}</button>`).join('')}</nav><p class="inbox-list-notice" role="status">本地演示 · 尚无外部消息</p>`);
  const directoryResize=createDirectoryResize(directory);
  async function loadInbox(){
    if(disposed)return null;
    if(!inboxReady)inboxReady=(async()=>{
      const css=new URL('inbox.css',document.baseURI);css.searchParams.set('v',document.querySelector('meta[name="forest-version"]')?.content||'1');
      let styleReady=Promise.resolve();
      if(!document.querySelector('link[data-inbox-style]')){styleReady=new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href=css.href;link.dataset.inboxStyle='';link.onload=resolve;link.onerror=()=>{link.remove();reject(new Error('收件箱样式加载失败，请重试'));};document.head.append(link);});}
      const url=new URL('dist/inbox.js',document.baseURI);url.searchParams.set('v',document.querySelector('meta[name="forest-version"]')?.content||'1');
      url.searchParams.set('attempt',String(++inboxAttempt));
      const [{createInboxUI}]=await Promise.all([import(url.href),styleReady]);
      if(disposed)return null;
      const created=await createInboxUI({root,ui,onPrepareCharacter:prepareContactCharacter,onRemoveCharacter:c=>store.removeExternalContact(c.id),onViewCharacter:c=>{const f=Object.values(store.state.customFriends||{}).find(f=>f.externalContactId===c.id);if(f)onViewProfile(f);},getCharacter:c=>Object.values(store.state.customFriends||{}).find(f=>f.externalContactId===c.id),onChange(){render();onInboxChange();},onError});
      if(disposed){created.dispose();return null;}inbox=created;render();onInboxChange();return inbox;
    })().catch(error=>{inboxReady=null;if(!disposed){directory.querySelector('.inbox-list-notice').textContent='收件箱暂未加载，可重试；原有好友聊天仍可使用。';onError(error);}return null;});
    return inboxReady;
  }
  async function prepareContactCharacter(c){
    const id=await store.addAvatarContact({name:c.name,account:'inbox-'+c.characterJobId,signature:c.note,avatarUrl:c.avatarUrl,jobId:c.characterJobId,externalContactId:c.id,sourcePlatform:c.platform,sourceAccount:c.account});
    return store.getFriend(id);
  }
  function contactGroups(query){
    const groups=store.state.groups.filter(g=>!g.leftAt&&(contactPlatform==='all'||(g.sourcePlatform||'wechat')===contactPlatform)&&g.name.toLowerCase().includes(query));
    return groups.map(g=>`<article class="conversation-row inbox-contact-row" role="listitem" data-contact-group="${esc(g.id)}"><button class="conversation-open" data-action="open-friend" data-id="group:${esc(g.id)}"><span class="conversation-avatar">${groupAvatar(store.state,g)}</span><span class="conversation-copy"><strong>${esc(g.name)}${appIcon(g.sourcePlatform||'wechat')}</strong><small>${g.memberIds.length} 人 · 本地演示</small></span></button></article>`).join('')||'<div class="inbox-welcome"><h3>在这里找到你们的群</h3><button type="button" data-contacts-create-group>添加群聊</button></div>';
  }
  function contactRows(query){
    const external=(inbox?.gateway.snapshot.contacts||[]).filter(c=>(contactPlatform==='all'||c.platform===contactPlatform)&&`${c.name} ${c.account} ${c.note}`.toLowerCase().includes(query));
    const linked=new Set((inbox?.gateway.snapshot.contacts||[]).map(c=>c.id));
    const native=store.state.friends.map(id=>person(id)).filter(f=>!linked.has(f.externalContactId)&&(contactPlatform==='all'||(f.sourcePlatform||'native')===contactPlatform)&&`${f.name} ${f.sourceAccount||f.account||f.id}`.toLowerCase().includes(query));
    const result=[...native.map(f=>({name:f.name,html:`<article class="conversation-row inbox-contact-row" data-friend-row="${esc(f.id)}" role="listitem"><button class="conversation-open" data-action="open-friend" data-id="${esc(f.id)}"><span class="conversation-avatar"><img src="${esc(friendAvatar(f))}" alt=""></span><span class="conversation-copy"><strong>${esc(f.name)}${f.sourcePlatform?appIcon(f.sourcePlatform):''}</strong><small>${esc(f.sourceAccount||f.account||'WeRoam')}</small></span></button></article>`})),...external.map(c=>{const f=Object.values(store.state.customFriends||{}).find(f=>f.externalContactId===c.id);return {name:c.name,html:`<article class="conversation-row inbox-contact-row" data-contact-platform="${esc(c.platform)}" role="listitem"><button class="conversation-open" data-inbox-contact="${esc(c.id)}"><span class="conversation-avatar inbox-person-avatar">${c.avatarUrl?`<img src="${esc(c.avatarUrl)}" alt="">`:`<span aria-hidden="true">${esc(c.name[0])}</span>`}</span><span class="conversation-copy"><strong>${esc(c.name)}${appIcon(c.platform)}</strong><small>${esc(c.account||c.note||'待补充账号')}</small>${f?`<small>${f.modelUrl?'形象已就绪':'形象准备中'}</small>`:''}</span></button></article>`};})];
    return result.sort((a,b)=>a.name.localeCompare(b.name,'zh-CN')).map(r=>r.html).join('')||'<div class="inbox-welcome"><h3>把好友记在一起</h3><button type="button" data-inbox-contact-new>添加好友</button></div>';
  }
  const menu=document.createElement('section');menu.id='friend-context-menu';menu.className='paper friend-context-menu';menu.hidden=true;menu.setAttribute('role','menu');menu.setAttribute('aria-label','好友选项');root.append(menu);
  const add=document.createElement('dialog');add.id='add-friends-dialog';add.className='paper';add.setAttribute('aria-label','添加好友');root.append(add);
  ui.register('friend-menu',{el:menu,kind:'popover',onClosed(){menuId=null;}});
  ui.register('add-friends',{el:add,kind:'child',modal:true});
  const person=key=>key.startsWith('group:')?groupOf(store.state,key.slice(6)):friendOf(store.state,key);
  function rows(ids,{compact=false,active=null}={}){
    const counts=unreadCounts(store.state),pins=new Set([...(store.state.pinnedFriends||[]),...(store.state.pinnedGroups||[]).map(id=>'group:'+id)]);
    return ids.map(id=>{const f=person(id);if(!f)return '';const ref=conversationRef(id),isGroup=ref.kind==='group',unread=isGroup?groupUnread(store.state,ref.id):[],last=(isGroup?store.state.messagesByGroup[ref.id]:store.state.messages.filter(m=>m.friendId===id)).at(-1),n=isGroup?unread.length:counts.get(id)||0,draft=store.state.drafts[id],pinned=pins.has(id),mention=unread.some(m=>m.mentionIds?.some(x=>x==='me'||x==='all'));
      const preview=(mention?'<em>[有人@我]</em> ':'')+(draft?`<em>[草稿]</em> ${esc(draft)}`:last?`${isGroup?esc(last.senderId==='me'?store.state.profile.name:friendOf(store.state,last.senderId)?.name||'成员')+'：':''}${esc(({image:'[图片]',sticker:'[表情]',moment:'[朋友圈]',content:'[分享]'}[last.type])||last.text)}`:esc(f.signature||'群聊已创建'));
      return `<article class="conversation-row ${pinned?'is-pinned':''} ${active===id?'active':''} ${compact?'is-compact':''}" data-friend-row="${id}" role="listitem"><button class="conversation-open" data-action="open-friend" data-id="${id}" aria-label="与${esc(f.name)}聊天${n?'，'+n+'条未读':''}"><span class="conversation-avatar">${isGroup?groupAvatar(store.state,f):`<img src="${esc(friendAvatar(f))}" alt="">`}${n?`<b class="conversation-unread">${n>99?'99+':n}</b>`:''}</span><span class="conversation-copy"><span class="conversation-top"><strong>${esc(f.name)}${isGroup?appIcon(f.sourcePlatform||'wechat'):f.sourcePlatform?appIcon(f.sourcePlatform):''}</strong><time>${stamp(last?.createdAt)}</time></span><span class="conversation-preview">${preview}</span></span>${pinned?'<span class="conversation-pin" aria-label="已置顶">⌃</span>':''}</button><button class="conversation-more" data-action="friend-menu" data-id="${id}" aria-label="${esc(f.name)}的更多选项" aria-haspopup="menu">···</button></article>`;
    }).join('')||'<p class="empty-note">还没有会话。<br>从通讯录认识一位朋友吧。</p>';
  }
  function render(){
    const query=directory.querySelector('#friend-search').value.trim().toLowerCase();
    const ids=(tab==='contacts'?[...store.state.friends].sort((a,b)=>person(a).name.localeCompare(person(b).name,'zh-CN')):mixedConversations(store.state).map(conversationKey)).filter(id=>{const f=person(id);return `${f.name} ${id} ${(id.startsWith('group:')?store.state.messagesByGroup[id.slice(6)]:store.state.messages.filter(m=>m.friendId===id)).at(-1)?.text||''}`.toLowerCase().includes(query);});
    const accountSelect=directory.querySelector('.inbox-account-filter'),connections=inbox?.gateway.snapshot.connections.filter(c=>c.status==='connected')||[],accountOptions='<option value="all">全部账号</option><option value="native">本地聊天</option>'+connections.map(c=>`<option value="${esc(c.id)}">${esc(c.platform==='qqmail'?c.label:'本地收录 '+connections.indexOf(c))}</option>`).join('');
    if(accountSelect.innerHTML!==accountOptions){accountSelect.innerHTML=accountOptions;if(account!=='all'&&account!=='native'&&!connections.some(c=>c.id===account))account='all';accountSelect.value=account;}
    const counts=unreadCounts(store.state),pinnedNative=new Set([...(store.state.pinnedFriends||[]),...(store.state.pinnedGroups||[]).map(id=>'group:'+id)]);
    let projected=ids.map(id=>{const group=id.startsWith('group:'),messages=group?(store.state.messagesByGroup[id.slice(6)]||[]):store.state.messages.filter(m=>m.friendId===id),n=group?groupUnread(store.state,id.slice(6)).length:counts.get(id)||0;return{id,sourcePlatform:group?(groupOf(store.state,id.slice(6)).sourcePlatform||'wechat'):(store.getFriend(id)?.sourcePlatform||'native'),updatedAt:messages.at(-1)?.createdAt||0,pinned:pinnedNative.has(id),unread:n,todo:n>0||!!store.state.drafts[id],html:rows([id])};});
    if(tab==='messages'){
      const threadedContacts=new Set((inbox?.gateway.snapshot.contacts||[]).filter(c=>c.threadId).map(c=>c.id));
      projected=projected.filter(row=>!threadedContacts.has(store.getFriend(row.id)?.externalContactId));
      projected=projected.filter(row=>(platform==='all'||row.sourcePlatform===platform)&&(account==='all'||account==='native')&&(filter==='all'||(filter==='unread'?row.unread:row.todo)));
      if(inbox&&platform!=='native')projected.push(...inbox.gateway.list({query,platform,filter}).filter(row=>account==='all'||row.connectionId===account).map(row=>({...row,html:externalRow(row)})));
      projected.sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.updatedAt-a.updatedAt||a.id.localeCompare(b.id));
    }
    const empty=tab==='contacts'?'<p class="empty-note">还没有联系人。可通过右上角添加朋友。</p>':'<div class="inbox-welcome"><span aria-hidden="true">↗</span><h3>消息，在这里汇合。</h3><p>从六条示例开始。</p><button type="button" data-inbox-open="demo">开始体验</button></div>';
    directory.querySelector('#friend-list').innerHTML=tab==='contacts'?`<div class="inbox-contact-tabs"><button type="button" data-contact-kind="friends" aria-pressed="${contactKind==='friends'}">好友</button><button type="button" data-contact-kind="groups" aria-pressed="${contactKind==='groups'}">群聊</button></div>`+(contactKind==='friends'?contactRows(query):contactGroups(query)):(projected.map(row=>row.html).join('')||empty)+(tab==='messages'&&!ids.length&&(!inbox||inbox.gateway.list().length)?'<button class="group-directory-entry" data-show-groups>体验校园群聊 ›</button>':'');
    directory.querySelector('.inbox-toolbar').hidden=tab!=='messages';
    directory.querySelector('.contacts-title h2').textContent=tab==='contacts'?'通讯录':'Universal Inbox';
    directory.querySelector('#friend-search').placeholder=tab==='contacts'?'搜索昵称、账号或备注':'搜索好友、群聊或消息';
    directory.querySelector('[data-inbox-platform=native]').hidden=!store.state.friends.some(id=>!store.getFriend(id)?.sourcePlatform);
    const selectedPlatform=tab==='contacts'?contactPlatform:platform;
    for(const b of directory.querySelectorAll('[data-inbox-platform]'))b.setAttribute('aria-pressed',String(b.dataset.inboxPlatform===selectedPlatform));
    if(inbox){const connected=inbox.gateway.snapshot.connections.filter(c=>c.status==='connected').length;directory.querySelector('.inbox-list-notice').textContent=connected?'本地演示 · 未连接真实账号':'本地演示 · 尚无外部消息';}
    directory.querySelector('#friend-count').textContent=store.state.friends.filter(id=>!store.getFriend(id)?.externalContactId).length+(inbox?.gateway.snapshot.contacts?.length||0);if(add.open)renderAddResults();
    const n=[...unreadCounts(store.state).values()].reduce((a,b)=>a+b,0)+store.state.groups.filter(g=>!g.leftAt).reduce((sum,g)=>sum+groupUnread(store.state,g.id).length,0)+externalUnread();directory.querySelector('#friend-unread-count').textContent=n||'';
    for(const b of directory.querySelectorAll('[role=tab]')){b.classList.toggle('active',b.dataset.conversationTab===tab);b.setAttribute('aria-selected',String(b.dataset.conversationTab===tab));}
  }
  function externalUnread(){return inbox?inbox.gateway.list({filter:'unread'}).reduce((sum,row)=>sum+Number(row.unread||0),0):0;}
  function externalRow(row){
    const names={qqmail:'QQ 邮箱',wechat:'微信',qq:'QQ',douyin:'抖音',xiaohongshu:'小红书'};
    const provenance=row.provenanceLabel?.includes('用户提供')?'手动收录':'演示';
    const name=row.displayName||row.title;
    const portrait=row.avatarUrl||(row.synthetic?`assets/rodin-friends/${({qqmail:'kangaroo',wechat:'rabbit',qq:'bear',douyin:'fox',xiaohongshu:'rabbit'})[row.platform]}/portrait.webp`:null);
    const face=portrait?`<img src="${esc(portrait)}" alt="">`:`<span class="inbox-person-initial" aria-hidden="true">${esc(name[0])}</span>`;
    return `<article class="conversation-row inbox-external-row ${row.pinned?'is-pinned':''}" data-inbox-source="${esc(row.platform)}" role="listitem"><button type="button" class="conversation-open" data-inbox-thread="${esc(row.id)}" title="${esc(provenance+' · '+row.title)}" aria-label="打开${esc(name)}，${esc(names[row.platform]||row.platform)}，${provenance}，${row.unread||0}条未读"><span class="conversation-avatar inbox-message-avatar">${face}${row.unread?`<b class="conversation-unread">${row.unread>99?'99+':row.unread}</b>`:''}</span><span class="conversation-copy"><span class="conversation-top"><strong>${esc(name)}${appIcon(row.platform)}</strong><time>${stamp(row.updatedAt)}</time></span><span class="conversation-preview">${esc(row.preview)}</span></span>${row.pinned?'<span class="conversation-pin" aria-label="已置顶">⌃</span>':''}</button></article>`;
  }
  function showMenu(id,source,point){
    menuId=id;const ref=conversationRef(id),isGroup=ref.kind==='group',pinned=(isGroup?store.state.pinnedGroups:store.state.pinnedFriends||[]).includes(ref.id);
    menu.innerHTML=`<small>${esc(person(id)?.name)}</small><button role="menuitem" ${isGroup?'data-profile-group':'data-profile-friend'}="${id}">查看资料</button><button role="menuitem" data-pin-friend="${id}">${pinned?'取消置顶':'置顶聊天'}</button>`;
    const r=source.getBoundingClientRect();menu.style.left=Math.max(12,Math.min(innerWidth-190,point?.x??r.right-170))+'px';menu.style.top=Math.max(12,Math.min(innerHeight-130,point?.y??r.bottom+6))+'px';
    ui.open('friend-menu',{origin:()=>root.querySelector(`[data-action="friend-menu"][data-id="${id}"]`)}).then(()=>menu.querySelector('button')?.focus({preventScroll:true}));
  }
  function renderAddResults(){
    const list=add.querySelector('.contact-search-results');if(!list)return;
    const query=addQuery.trim().toLowerCase(),catalog=allFriends(store.state).filter(f=>`${f.name} ${f.account||f.id}`.toLowerCase().includes(query));
    list.innerHTML=catalog.map(f=>`<button class="contact-search-result" data-contact-profile="${esc(f.id)}" aria-label="查看${esc(f.name)}的资料"><img src="${esc(friendAvatar(f))}" alt=""><span><strong>${esc(f.name)}${f.sourcePlatform?appIcon(f.sourcePlatform):''}</strong><small>账号：${esc(f.account||f.id)}</small></span>${store.state.friends.includes(f.id)?'<em>已添加</em>':'<b>›</b>'}</button>`).join('')||'<p class="contact-search-empty">没有找到这个联系人<br><small>可搜索本机已有资料，或录入联系人资料。</small></p>';
  }
  function showAdd(){
    add.innerHTML=`<header class="ui-titlebar"><span>添加朋友</span><button class="ui-close" data-ui-close="add-friends" aria-label="关闭添加好友">×</button></header><label class="contact-search"><span>⌕</span><input type="search" id="contact-search" aria-label="搜索联系人" placeholder="昵称 / 账号" value="${esc(addQuery)}"></label><div class="contact-search-results"></div><button class="contact-manual-entry" data-new-contact><span>＋</span><span>录入联系人资料<small>使用对方的昵称、账号和头像</small></span><b>›</b></button><p class="contact-local-note">当前搜索本机联系人资料</p>`;
    renderAddResults();ui.open('add-friends',{origin:ui.source()}).then(()=>add.querySelector('input')?.focus({preventScroll:true}));
  }
  add.addEventListener('input',e=>{if(e.target.id==='contact-search'){addQuery=e.target.value;renderAddResults();}});
  add.addEventListener('click',e=>{
    const result=e.target.closest('[data-contact-profile]');if(result)onViewProfile(person(result.dataset.contactProfile),()=>add.querySelector(`[data-contact-profile="${CSS.escape(result.dataset.contactProfile)}"]`));
    if(e.target.closest('[data-new-contact]'))onNewContact({account:/^[\p{L}\p{N}_.-]{3,64}$/u.test(addQuery.trim())?addQuery.trim():'',origin:add.querySelector('[data-new-contact]')});
  });
  const click=async e=>{
    const source=e.target.closest('[data-inbox-platform]');if(source){if(tab==='contacts')contactPlatform=source.dataset.inboxPlatform;else platform=source.dataset.inboxPlatform;directory.querySelector('.inbox-more').open=false;render();return;}
    const kind=e.target.closest('[data-contact-kind]');if(kind){contactKind=kind.dataset.contactKind;render();return;}
    if(e.target.closest('[data-contacts-create-group]')){onCreateGroup(e.target.closest('button'));return;}
    if(tab==='contacts'&&contactKind==='groups'&&e.target.closest('[data-action="add-directory"]')){onCreateGroup(e.target.closest('button'));return;}
    const contact=e.target.closest('[data-inbox-contact]'),newContact=e.target.closest('[data-inbox-contact-new]');
    if(contact||newContact||(tab==='contacts'&&e.target.closest('[data-action="add-directory"]'))){const ready=await loadInbox();await ready?.openContact(contact||newContact||e.target,contact?.dataset.inboxContact||null,['all','native'].includes(contactPlatform)?'wechat':contactPlatform);return;}
    const inboxButton=e.target.closest('[data-inbox-open]'),thread=e.target.closest('[data-inbox-thread]');
    if(inboxButton||thread){directory.querySelector('.inbox-more').open=false;const ready=await loadInbox();if(!ready)return;try{if(thread)await ready.openThread(thread.dataset.inboxThread,thread);else{const method={demo:'openDemo',center:'openCenter',assistant:'openAssistant',import:'openImport',audit:'openAudit'}[inboxButton.dataset.inboxOpen];await ready[method]?.(inboxButton);}}catch(error){onError(error);}return;}
    const t=e.target.closest('[data-conversation-tab]');if(t){tab=t.dataset.conversationTab;render();ui.transition(directory.querySelector('#friend-list'));}
    const profile=e.target.closest('[data-profile-friend]');if(profile){const id=profile.dataset.profileFriend;ui.close('friend-menu',{immediate:true,restoreFocus:false});onViewProfile(person(id),()=>root.querySelector(`[data-action="friend-menu"][data-id="${CSS.escape(id)}"]`));}
    const b=e.target.closest('[data-action="friend-menu"]');if(b)showMenu(b.dataset.id,b);
    const pin=e.target.closest('[data-pin-friend]');if(pin){try{const ref=conversationRef(pin.dataset.pinFriend);if(ref.kind==='group')await store.setGroupPinned(ref.id,!store.state.pinnedGroups.includes(ref.id));else await store.setFriendPinned(ref.id,!(store.state.pinnedFriends||[]).includes(ref.id));await ui.close('friend-menu');}catch(error){onError(error);}}
    if(e.target.closest('[data-action="add-directory"]')){menu.innerHTML='<button role="menuitem" data-add-contact>添加好友</button><button role="menuitem" data-create-group>发起群聊</button>';const r=e.target.getBoundingClientRect();menu.style.left=Math.min(innerWidth-190,r.left-130)+'px';menu.style.top=r.bottom+8+'px';ui.open('friend-menu',{origin:e.target});}
    if(e.target.closest('[data-add-contact]')){ui.close('friend-menu',{immediate:true,restoreFocus:false});showAdd();}
    if(e.target.closest('[data-create-group]')){ui.close('friend-menu',{immediate:true,restoreFocus:false});onCreateGroup(directory.querySelector('.contacts-add'));}
    if(e.target.closest('[data-show-groups]'))onGroups(e.target.closest('button'));
    const group=e.target.closest('[data-profile-group]');if(group){ui.close('friend-menu',{immediate:true,restoreFocus:false});onGroupInfo(group.dataset.profileGroup.slice(6));}
  };
  const context=e=>{const row=e.target.closest('[data-friend-row]');if(!row)return;e.preventDefault();showMenu(row.dataset.friendRow,row,{x:e.clientX,y:e.clientY});};
  const cancel=()=>{clearTimeout(longPress);longPress=null;};
  const down=e=>{const row=e.target.closest('[data-friend-row]');if(!row||e.pointerType!=='touch')return;const {clientX:x,clientY:y}=e;cancel();pressStart={x,y};longPress=setTimeout(()=>{suppressedUntil=performance.now()+900;showMenu(row.dataset.friendRow,row,{x,y});},500);};
  const suppress=e=>{if(performance.now()<suppressedUntil&&e.target.closest('[data-friend-row]')){e.preventDefault();e.stopImmediatePropagation();}};
  const move=e=>{if(pressStart&&Math.hypot(e.clientX-pressStart.x,e.clientY-pressStart.y)>8){cancel();pressStart=null;}};
  const change=e=>{if(e.target.matches('.inbox-platform-filter')){platform=e.target.value;render();}if(e.target.matches('.inbox-account-filter')){account=e.target.value;render();}if(e.target.matches('.inbox-state-filter')){filter=e.target.value;render();}};
  directory.addEventListener('change',change);
  root.addEventListener('click',suppress,true);root.addEventListener('click',click);root.addEventListener('contextmenu',context);root.addEventListener('pointerdown',down);root.addEventListener('pointerup',cancel);root.addEventListener('pointercancel',cancel);root.addEventListener('pointermove',move);
  return {render,rows,showAdd,loadInbox,externalUnread,flush:()=>inbox?.flush?.(),get inbox(){return inbox;},get menuFriend(){return menuId;},dispose(){disposed=true;directoryResize.dispose();inbox?.dispose();cancel();directory.removeEventListener('change',change);root.removeEventListener('click',suppress,true);root.removeEventListener('click',click);root.removeEventListener('contextmenu',context);root.removeEventListener('pointerdown',down);root.removeEventListener('pointerup',cancel);root.removeEventListener('pointercancel',cancel);root.removeEventListener('pointermove',move);}};
}
