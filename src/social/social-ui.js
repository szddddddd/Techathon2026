import {MODS,modIcon} from '../mods/catalog.js';
import {appIcon} from '../inbox/icons.js';
import {createSceneLabelHover} from '../ui/scene-label-hover.js';
import {createGroupUI,groupAvatar} from './group-ui.js';
import {groupOf,groupUnread,mixedConversations,conversationKey,conversationRef} from './group-catalog.js';
import {createFriendModels} from '../characters/friend-models.js';
import {createAvatarFriendUI} from '../ui/avatar-friend-ui.js';
import {createConversations} from './social-conversations.js';
import {createPresenceController,conversationIds,unreadTier} from './social-presence.js';
import {createDock} from '../ui/ui-interactions.js';
import { FRIENDS, STATES, friendOf, friendAvatar } from './social-store.js';
import { getPublicPosts, getNewPublicPosts } from './social-feed.js';
import { getContent, getAccount, getCreator } from '../discovery/discovery-catalog.js';
import { createAnchorLayout } from './social-anchor-layout.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time = value => new Date(value).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
const date = value => new Date(value).toLocaleDateString('zh-CN',{month:'long',day:'numeric'});
const STICKERS = [ ['🌼','送你一朵小花'], ['🐾','我来啦！'], ['☕','歇一会儿'], ['🌙','晚安好梦'], ['🫶','接住温柔'], ['🍀','好运发生'] ];
const EMOJI = ['😊','🥰','😂','🥹','🤔','😴','😭','✨','💛','🌿','🌈','👍'];

export function createSocialUI({store,characters,controls,ui,mods,onOpenWorkshop=()=>{},onOpenSound=()=>{},onMountPet=()=>{},getAnchorObstacles=()=>[],onGroupSceneClose=()=>{},onOpenContent=(route,options)=>window.__openDiscovery?.(route,options)}) {
  const root=document.createElement('div');root.id='social';document.body.append(root);
  root.innerHTML=`
    <div id="friend-anchors"></div>
    <div id="first-invitation" class="invitation"><span class="invitation-icon">✉</span><h1>给风景，添一位朋友。</h1><p>从一次问好开始，让小小的溪谷热闹起来。</p><button class="primary" data-action="directory">认识第一位朋友 <span>↗</span></button></div>
    <nav class="social-dock"><button data-action="directory" class="dock-button"><span>♧</span> 消息 <b id="total-unread" hidden></b></button><div class="dock-mods" aria-label="已固定模块"><button data-action="mod-moments" data-mod-entry="moments" class="dock-button"><span>▧</span> 朋友圈<b id="public-feed-unread" hidden></b></button><button data-action="mod-accounts" data-mod-entry="accounts" class="dock-button"><span>▤</span> 公众号</button><button data-action="mod-videos" data-mod-entry="videos" class="dock-button"><span>▷</span> 视频号</button><button data-action="mod-notes" data-mod-entry="notes" class="dock-button"><span>▱</span> 便签</button><button data-action="mod-focus" data-mod-entry="focus" class="dock-button"><span>◷</span> 专注计时</button></div><button data-action="workshop" class="dock-button"><span>◇</span> 创意工坊</button><button data-action="me" class="dock-button"><span>◉</span> 我</button></nav>
    <section id="directory" class="drawer paper" hidden aria-label="好友通讯录"><button class="ui-close" data-ui-close="directory" aria-label="关闭好友通讯录">×</button><header><div><small>OUR LITTLE NEIGHBOURHOOD</small><h2>溪谷里的朋友</h2></div></header><p class="muted">每一次认识，都是风景的新一页。</p><label class="search">⌕ <input id="friend-search" placeholder="搜索昵称或演示 ID" aria-label="搜索好友"></label><div class="directory-tabs"><button data-action="directory-tab" data-tab="all" class="active">添加好友</button><button data-action="directory-tab" data-tab="added">我的朋友 <span id="friend-count"></span></button></div><div id="friend-list"></div></section>
    <section id="meeting" hidden aria-label="好友会客空间" data-moments="closed">
      <div class="meeting-workspace">
        <aside class="meeting-friends paper" aria-label="好友列表"><header><small>LETTERS FROM THE WOODS</small><h2>消息</h2><button class="text-button" data-action="directory">全部会话</button></header><label class="meeting-search"><input id="meeting-search" aria-label="筛选会话好友" placeholder="搜索好友或群聊"></label><div id="meeting-friend-list"></div><p class="workspace-hint">点击窗外，回到溪谷</p></aside>
        <section class="chat-panel paper"><header class="meeting-title"><button class="chat-back" type="button" data-action="directory" aria-label="返回消息列表">←</button><button type="button" id="meeting-avatar" class="avatar" data-action="active-friend-profile" aria-label="查看好友资料"></button><div><h2 id="meeting-name"></h2><p id="meeting-signature"></p></div><button id="moments-toggle" class="secondary" data-action="toggle-moments" aria-expanded="false" aria-controls="moments-panel">朋友圈 <span>↗</span></button><button class="ui-close meeting-close" data-ui-close="meeting" aria-label="关闭聊天">×</button></header><div id="chat-messages" aria-live="polite" aria-label="聊天记录"></div><div id="chat-attachment" hidden></div><div id="chat-picker" hidden></div><form id="chat-form"><div class="composer-tools"><button type="button" data-action="emoji" aria-label="选择表情">☺</button><button type="button" data-action="stickers" aria-label="选择表情包">♧</button><button type="button" data-action="chat-image" aria-label="发送图片">▧</button><button type="button" data-action="mention" id="mention-button" hidden aria-label="提及群成员">@</button><span>把今天说给朋友听</span></div><textarea id="chat-input" rows="2" maxlength="3000" placeholder="发消息…" aria-label="输入消息"></textarea><div class="composer-bottom"><small>Enter 发送 · Shift + Enter 换行</small><button class="primary" type="submit">发送 ↗</button></div></form></section>
        <section id="moments-panel" class="memory-panel paper" hidden aria-label="好友朋友圈"><header class="moments-toolbar"><h2>朋友圈</h2><button class="text-button" data-action="toggle-moments">收起 →</button></header><div id="moments-feed"></div></section>
      </div>
    </section>
    <dialog id="settings-dialog" class="paper" aria-label="设置"><header class="ui-titlebar"><button class="ui-back" data-ui-close="settings" aria-label="返回我">←</button><span>设置</span><button class="ui-close" data-ui-close="settings" aria-label="关闭设置">×</button></header><small class="eyebrow">MAKE YOURSELF AT HOME</small><h2>设置</h2><div class="settings-list"><button class="settings-sound" data-action="sound-settings"><span>♫ 声音设置</span><span aria-hidden="true">›</span></button>${globalThis.AndroidAvatar?.openSettings?'<button class="settings-sound" data-action="avatar-service-settings"><span>模型服务配置</span><span aria-hidden="true">›</span></button>':''}<div id="settings-pet-slot"></div>${/^https?:$/.test(location.protocol)?'<a class="settings-sound" href="data-transfer.html">本地数据导出／导入 ›</a>':''}</div></dialog><dialog id="social-dialog" class="paper"></dialog><dialog id="compose-dialog" class="paper" aria-label="发布内容"></dialog><section id="status-popover" class="paper" hidden role="dialog" aria-label="好友状态"></section><dialog id="photo-dialog" aria-label="图片预览"><button class="ui-close" data-ui-close="photo" aria-label="关闭图片">×</button><img alt="完整照片"></dialog><dialog id="content-share-dialog" class="paper" aria-label="分享文章或视频"></dialog>
    <input id="chat-file" type="file" accept="image/*" hidden><div id="social-toast" role="status" popover="manual"></div>`;
  const $=id=>root.querySelector('#'+id);
  let active=null,closingFriend=null,directoryTab='all',picker=null,attachment=null,dialogKind=null,dialogOwner=null,sceneTransition=false;
  let publishingFiles=[],publishKind=null,renderVersion=0,lastFriendSignature='',lastMessageSignature='',lastPostSignature='',scrollTimer,draftTimer,toastTimer,chatFileVersion=0,publishFileVersion=0,momentsOpen=false,lastMeetingList='',publishReturn=null,lastPublicSignature='';
  const dock=createDock({root,ui});
  const presence=createPresenceController();
  const friendModels=createFriendModels({store});
  const avatarFriends=createAvatarFriendUI({store,ui,models:friendModels,onComplete:name=>toast('已添加 '+name+'，现在可以发消息了。'),onChat:id=>{ui.close('add-friends',{immediate:true,restoreFocus:false});openFriend(id);}});
  let groups;
  const conversations=createConversations({root,store,friends:FRIENDS,ui,onInboxChange:()=>renderInboxSummary(),onViewProfile:(friend,origin)=>avatarFriends.open(friend,{origin}),onNewContact:options=>avatarFriends.open(null,options),onError:error=>toast(error?.message||String(error)),onCreateGroup:origin=>groups.openCreate(origin),onGroups:origin=>groups.openQueue(null,origin),onGroupInfo:id=>openConversation({kind:'group',id}).then(()=>groups.showInfo(id,$('moments-toggle')))});
  groups=createGroupUI({root,store,ui,onOpen:openConversation,onCloseChat:closeMeeting,onError:toast,onMember:(friend,origin)=>avatarFriends.open(friend,{origin})});
  let actionSource=null,statusOwner=null,statusOrigin=null;
  const formDrafts=new Map(),publishDrafts=new Map(),viewScrolls=new Map();
  const chrome=(title,id,back=false)=>`<header class="ui-titlebar">${back?`<button class="ui-back" data-ui-close="${id}" aria-label="返回">←</button>`:''}<span>${title}</span><button class="ui-close" data-ui-close="${id}" aria-label="关闭${title}">×</button></header>`;
  function saveFormDrafts(){
    for(const form of root.querySelectorAll('#profile-form,#publish-form')){
      if(form.id==='publish-form'&&ui.state('compose')==='closed')continue;
      const key=form.dataset.draftKey||form.id;
      const values={};for(const field of form.elements)if(field.name&&field.type!=='file'&&(field.type!=='radio'||field.checked))values[field.name]=field.value;
      formDrafts.set(key,values);
    }
    if(publishKind&&$('publish-form')&&ui.state('compose')!=='closed')publishDrafts.set(publishKind,[...publishingFiles]);
    if(dialogKind)viewScrolls.set(dialogKind,$('social-dialog').querySelector('.public-moments-scroll')?.scrollTop||$('social-dialog').scrollTop);
  }
  function restoreFormDrafts(d,key){const values=formDrafts.get(key);if(!values)return;for(const field of d.querySelectorAll('input,textarea'))if(field.name in values){if(field.type==='radio')field.checked=field.value===values[field.name];else if(field.type!=='file')field.value=values[field.name];}}
  ui.register('directory',{el:$('directory'),kind:'main',nav:'directory'});
  ui.register('meeting',{el:$('meeting'),surface:root.querySelector('.meeting-workspace'),kind:'main',nav:'directory',onClose(){captureDraft();closingFriend=active;active=null;attachment=null;groups.closeInfo();root.classList.remove('in-meeting');characters.restore();onGroupSceneClose();},onClosed(){closingFriend=null;}});
  ui.register('social',{el:$('social-dialog'),kind:'main',nav:'me',onClose:saveFormDrafts,onClosed(){dialogKind=null;dialogOwner=null;syncVisibleRead();}});
  ui.register('settings',{el:$('settings-dialog'),kind:'child',modal:true});
  ui.register('compose',{el:$('compose-dialog'),kind:'child',modal:true,onClose:saveFormDrafts});
  ui.register('photo',{el:$('photo-dialog'),kind:'child',modal:true,onClosed:syncVisibleRead});
  ui.register('share',{el:$('content-share-dialog'),kind:'child',modal:true,onClose:saveShareDraft,onClosed(){shareReference=null;shareResolve?.(false);shareResolve=null;syncVisibleRead();}});
  ui.register('status',{el:$('status-popover'),kind:'popover',position:positionStatus,onClosed(){const source=typeof statusOrigin==='function'?statusOrigin():statusOrigin;source?.setAttribute('aria-expanded','false');statusOwner=null;statusOrigin=null;}});
  function closeStatus(options){return ui.close('status',options);}
  function positionStatus(){
    const d=$('status-popover'),v=visualViewport,w=v?.width||innerWidth,h=v?.height||innerHeight,oy=v?.offsetTop||0;
    const r=ui.rect(statusOrigin),mobile=w<=760;
    d.style.maxHeight=Math.max(100,h-170)+'px';
    const width=d.offsetWidth,height=d.offsetHeight;
    const left=mobile?(w-width)/2:Math.max(16,Math.min(w-width-16,(r?.left||w/2)+(r?.width||0)/2-width/2));
    const below=(r?.bottom||h/2)+12,above=(r?.top||h/2)-height-12;
    const top=mobile?oy+h-height-82:Math.max(16,Math.min(h-height-24,above>=16?above:below));
    d.style.left=left+'px';d.style.top=top+'px';
  }
  function showDirectory(){renderDirectory();ui.open('directory',{origin:actionSource});conversations.loadInbox();}
  const anchorNodes=new Map();const messageWindows=new Map();const draftValues=new Map();const unreadArrival=new Map();
  const hover=createSceneLabelHover({canvas:document.querySelector('#viewport canvas'),selector:'.friend-anchor',dataKey:'friend',pick:(x,y)=>characters.placement.pick(x,y)});
  const anchorLayout=createAnchorLayout();let orbiting=false,lastCameraMotion=-Infinity,lastAnchorFrame=0;
  const orbitStart=()=>{closeStatus({restoreFocus:false});orbiting=true;lastCameraMotion=performance.now();};
  const orbitEnd=()=>{orbiting=false;lastCameraMotion=performance.now();};
  const orbitChange=()=>{lastCameraMotion=performance.now();};
  controls?.addEventListener('start',orbitStart);controls?.addEventListener('end',orbitEnd);controls?.addEventListener('change',orbitChange);
  const anchorSizes=new ResizeObserver(entries=>{for(const entry of entries){entry.target._anchorWidth=entry.contentRect.width;entry.target._anchorHeight=entry.contentRect.height;}});
  const person=id=>id?.startsWith('group:')?({...groupOf(store.state,id.slice(6)),emoji:'▦',signature:'群聊'}):id==='me'?store.state.profile:friendOf(store.state,id)||{id,name:'林间朋友',emoji:'🌿',signature:''};
  const stateInfo=kind=>STATES.find(s=>s.id===kind)||{icon:'✨',label:kind||'此刻'};
  const chatVisible=()=>!sceneTransition&&!!active&&!document.hidden&&$('directory').hidden&&!document.querySelector('dialog[open]')&&(innerWidth>760||!momentsOpen)&&(innerWidth>=1100||ui.state('group-info')==='closed');
  const memoriesVisible=()=>!!active&&!active.startsWith('group:')&&momentsOpen&&!document.hidden&&$('directory').hidden&&!document.querySelector('dialog[open]');
  const statusOf=id=>{const s=store.state.statuses[id];return s&&s.expiresAt>Date.now()?s:null;};
  const postsOf=id=>store.state.posts.filter(p=>p.authorId===id).sort((a,b)=>b.createdAt-a.createdAt);
  const unread=id=>id?.startsWith('group:')?groupUnread(store.state,id.slice(6)).length:store.state.messages.filter(m=>m.friendId===id&&m.senderId!=='me'&&!m.read).length;
  const avatar=id=>`<span class="avatar" style="--friend-color:${esc(person(id).color||'#a9bc98')}">${person(id).avatarUrl?`<img src="${esc(friendAvatar(person(id)))}" alt="">`:esc(person(id).emoji||'🌱')}</span>`;
  function toast(message){
    const node=$('social-toast');node.textContent=message;
    // A modal dialog's backdrop blurs ordinary page layers regardless of z-index.
    if(node.showPopover){if(node.matches(':popover-open'))node.hidePopover();node.showPopover();}
    node.classList.add('visible');clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>{node.classList.remove('visible');if(node.matches(':popover-open'))node.hidePopover();},4000);
  }
  async function attempt(fn){try{return await fn();}catch(error){console.error(error);toast(error.message||'没有保存成功，请重试。');return null;}}
  async function hydrate(scope=root){for(const img of scope.querySelectorAll('img[data-media]')){const id=img.dataset.media;try{const url=await store.mediaUrl(id);if(img.isConnected&&img.dataset.media===id){img.onerror=()=>{img.alt='图片暂不可用';img.classList.add('unavailable');};img.src=url;}}catch{img.alt='图片暂不可用';img.classList.add('unavailable');}}}
  function photo(mediaId,cls=''){return `<button type="button" class="photo-button ${cls}" data-action="photo" data-media="${esc(mediaId)}"><img data-media="${esc(mediaId)}" alt="动态图片" loading="lazy"></button>`;}
  function profileLine(id){return `${avatar(id)}<div><strong>${esc(person(id).name)}</strong><p>${esc(person(id).signature)}</p></div>`;}
  function renderDirectory(){conversations.render();}
  function renderInboxSummary(){
    $('first-invitation').hidden=store.state.friends.length>0||store.state.groups.some(g=>!g.leftAt)||!!conversations.inbox?.gateway.list().length;
    const count=store.state.friends.reduce((n,id)=>n+unread(id),0)+store.state.groups.filter(g=>!g.leftAt).reduce((n,g)=>n+groupUnread(store.state,g.id).length,0)+conversations.externalUnread();$('total-unread').textContent=count;$('total-unread').hidden=!count;
    const newPosts=(!mods||mods.enabled('moments'))?getNewPublicPosts(store.state).length:0;$('public-feed-unread').hidden=!newPosts;$('public-feed-unread').textContent=newPosts;$('public-feed-unread').setAttribute('aria-label',`${newPosts}条新动态`);dock.unread(count+newPosts);
  }
  function renderSummary(){
    renderInboxSummary();
    const signature=store.state.friends.join(',');if(signature!==lastFriendSignature){lastFriendSignature=signature;renderDirectory();}
    for(const id of store.state.friends){const latest=store.state.messages.filter(m=>m.friendId===id&&m.senderId!=='me').at(-1);if(latest&&unreadArrival.get(id)?.id!==latest.id){if(unreadArrival.has(id))characters.pulse?.(id);unreadArrival.set(id,{id:latest.id,at:performance.now()-Math.max(0,Date.now()-latest.createdAt)});}}
    characters.setSocialState(store.state);renderDirectory();renderAnchors();renderMeetingFriends();
  }
  function renderAnchors(){
    const currentFriends=new Set(store.state.friends);for(const [id,node] of anchorNodes)if(!currentFriends.has(id)){anchorSizes.unobserve(node);node.remove();anchorNodes.delete(id);unreadArrival.delete(id);messageWindows.delete(id);draftValues.delete(id);}
    for(const id of store.state.friends){let node=anchorNodes.get(id);if(!node){node=document.createElement('div');node.className='friend-anchor';node.hidden=true;node.dataset.friend=id;$('friend-anchors').append(node);anchorNodes.set(id,node);anchorSizes.observe(node);}
      const st=statusOf(id),info=st&&stateInfo(st.kind),messages=store.state.messages.filter(m=>m.friendId===id&&m.senderId!=='me'),last=messages.at(-1),n=unread(id);
      node.classList.toggle('has-unread',n>0);
      const fresh=(!mods||mods.enabled('moments'))&&postsOf(id).some(p=>p.createdAt>(store.state.seenPosts[id]||0));
      const tier=unreadTier(n);node.dataset.unreadTier=tier;
      const html=`<div class="anchor-identity"><button class="anchor-name" data-action="open-friend" data-id="${id}">${person(id).sourcePlatform?appIcon(person(id).sourcePlatform):''}${esc(person(id).name)} ${fresh?'<i class="memory-spark"></i>':''}${(store.state.pinnedFriends||[]).includes(id)?'<i class="anchor-pin" aria-label="置顶好友">⌃</i>':''}</button>${st?`<button class="status-badge" data-action="status" data-id="${id}" aria-label="查看${esc(person(id).name)}的${esc(info.label)}状态">${esc(info.icon)} <span>${esc(info.label)}</span></button>`:''}</div><div class="unread-visual" ${n?'':'hidden'}><button class="letter-stack" data-action="open-friend" data-id="${id}" aria-label="${esc(person(id).name)}有${n}条未读来信">${Array.from({length:tier},(_,i)=>`<i style="--letter:${i}"></i>`).join('')}</button><button class="unread-dot" data-action="open-friend" data-id="${id}" aria-label="${esc(person(id).name)}有${n}条未读">${n>99?'99+':n}</button></div>${last&&n?`<button class="head-message" data-action="open-friend" data-id="${id}">${esc(last.type==='image'?'[图片]':last.type==='sticker'?'[表情]':last.text||'分享了一段回忆')}</button>`:''}`;

      if(node._html!==html){const arrival=n>(node._unreadCount||0),oldVisual=!n&&(node._unreadCount||0)>0?node.querySelector('.unread-visual'):null,oldTop=oldVisual?.offsetTop,clearing=oldVisual?.cloneNode(true);node._html=html;node.innerHTML=html;hydrate(node);if(clearing&&!matchMedia('(prefers-reduced-motion: reduce)').matches){clearing.style.cssText='position:absolute;left:50%;translate:-50% 0;pointer-events:none;top:'+oldTop+'px';clearing.classList.add('is-clearing');node.append(clearing);clearing.animate([{opacity:1},{opacity:0,transform:'translateY(-4px) scale(.88)'}],{duration:220,easing:'ease-out'}).finished.then(()=>clearing.remove());}if(arrival&&!matchMedia('(prefers-reduced-motion: reduce)').matches)node.querySelector('.unread-visual')?.animate([{transform:'scale(1)'},{transform:'translateY(-3px) scale(1.08)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});node._unreadCount=n;}
    }
  }
  function renderMeetingFriends(){
    const query=$('meeting-search').value.trim().toLowerCase();
    const ids=mixedConversations(store.state).map(conversationKey).filter(id=>(person(id).name+' '+id).toLowerCase().includes(query));
    const html=conversations.rows(ids,{compact:true,active});
    if(html!==lastMeetingList){lastMeetingList=html;$('meeting-friend-list').innerHTML=html;}
  }
  function setMoments(open){
    if(open&&!active?.startsWith('group:')&&mods&&!mods.enabled('moments')){mods.onUnavailable?.('moments',{origin:actionSource});return;}
    if(active?.startsWith('group:')){momentsOpen=false;$('moments-panel').hidden=true;$('meeting').dataset.moments='closed';$('moments-toggle').textContent='群资料 ···';if(open)groups.showInfo(active.slice(6),$('moments-toggle'));return;}
    momentsOpen=!!open;$('meeting').dataset.moments=open?'open':'closed';$('moments-panel').hidden=!open;
    $('moments-toggle').setAttribute('aria-expanded',String(!!open));$('moments-toggle').innerHTML=open?'朋友圈 <span>↙</span>':'朋友圈 <span>↗</span>';
    ui.transition(open?$('moments-panel'):root.querySelector('.chat-panel'),open?1:-1);
    if(open){renderMemories();if(memoriesVisible())attempt(()=>store.markPostsSeen(active));}
    else markVisibleRead();
  }
  function captureDraft(){if(!active||(active.startsWith('group:')&&!groupOf(store.state,active.slice(6))))return;draftValues.set(active,$('chat-input').value);const id=active,value=$('chat-input').value;attempt(()=>store.setConversationDraft(conversationRef(id),value));attempt(()=>store.setScroll(id,$('chat-messages').scrollTop));attempt(()=>store.setConversationAttachment(conversationRef(id),attachment));}
  async function saveSessionDraft(){
    await conversations.flush();
    clearTimeout(draftTimer);
    if(active&&(!active.startsWith('group:')||groupOf(store.state,active.slice(6)))){
      const id=active,ref=conversationRef(id),value=$('chat-input').value;
      draftValues.set(id,value);
      await store.setConversationDraft(ref,value);
      await store.setScroll(id,$('chat-messages').scrollTop);
      await store.setConversationAttachment(ref,attachment);
    }
    await store.flush();
  }
  async function openFriend(id,options={}){const friend=store.getFriend(id),contact=friend?.externalContactId&&conversations.inbox?.gateway.snapshot.contacts?.find(c=>c.id===friend.externalContactId);if(contact?.threadId)return conversations.inbox.openThread(contact.threadId,options.origin);return openConversation(conversationRef(id),options);}
  function renderChatTitle(){if(!active)return;const group=active.startsWith('group:')?groupOf(store.state,active.slice(6)):null;
    $('meeting-avatar').innerHTML=group?groupAvatar(store.state,group):person(active).avatarUrl?`<img src="${esc(friendAvatar(person(active)))}" alt="">`:esc(person(active).emoji);
    $('meeting-name').textContent=group?`${group.name}（${group.memberIds.length}）`:person(active).name;$('meeting-signature').textContent=group?(group.notice||'朋友们在这里相聚'):person(active).signature;if(group)$('meeting-name').insertAdjacentHTML('beforeend',appIcon(group.sourcePlatform||'wechat'));else if(person(active).sourcePlatform)$('meeting-name').insertAdjacentHTML('beforeend',appIcon(person(active).sourcePlatform));
    $('moments-toggle').hidden=!group&&!!mods&&!mods.enabled('moments');$('moments-toggle').textContent=group?'群资料 ···':'朋友圈 ↗';$('mention-button').hidden=!group;
  }
  function renderAttachment(){const box=$('chat-attachment');box.hidden=!attachment;if(attachment){box.innerHTML=`<img data-media="${esc(attachment)}" alt="待发送图片"><span>图片准备好了</span><button class="icon-button" data-action="remove-attachment" aria-label="移除图片">移除</button>`;hydrate(box);}}
  async function openConversation(ref,options={}){
    const id=conversationKey(ref),group=ref.kind==='group'?groupOf(store.state,ref.id):null;
    if(ref.kind==='group'?!group:!store.state.friends.includes(ref.id))return;
    const isNew=active!==id,wasOpen=active!==null;
    if(isNew){captureDraft();groups.closeInfo();attachment=store.state.conversationAttachments?.[id]||null;renderAttachment();}
    let origin=options.origin||root.querySelector(`[data-friend-row="${CSS.escape(id)}"] button`)||document.querySelector(`[data-group="${CSS.escape(ref.id)}"]`)||root.querySelector(`.friend-anchor[data-friend="${CSS.escape(id)}"] .anchor-name`)||root.querySelector('[data-action="directory"]');
    if(origin instanceof Element&&origin.closest('[data-friend-row]'))origin=()=>root.querySelector(`[data-friend-row="${CSS.escape(id)}"] button`)||root.querySelector('[data-action="directory"]');
    ui.open('meeting',{origin});active=id;picker=null;ui.close('picker',{immediate:true,restoreFocus:false});root.classList.add('in-meeting');renderChatTitle();
    if(isNew)$('chat-input').value=draftValues.get(id)??store.state.drafts[id]??'';
    if(isNew||!wasOpen)setMoments(false);
    if(group){characters.restore({preserveCamera:true});}else {onGroupSceneClose(true);characters.focus(id);}
    renderMeetingFriends();lastMessageSignature='';lastPostSignature='';renderMessages(true);
    // Opening a conversation acknowledges its entire backlog, including unloaded history.
    const unread=group?(store.state.messagesByGroup[ref.id]||[]):store.state.messages.filter(m=>m.friendId===ref.id);
    const ids=unread.filter(m=>!m.read&&m.senderId!=='me').map(m=>m.id);
    if(ids.length)await attempt(()=>group?store.markGroupRead(ref.id,ids):store.markRead(ref.id,ids));
  }
  let marking=false;
  async function markVisibleRead(){
    if(marking||!chatVisible()||!active)return;const id=active,ref=conversationRef(id),feed=$('chat-messages'),bounds=feed.getBoundingClientRect();if(!bounds.height)return;
    const all=ref.kind==='group'?store.state.messagesByGroup[ref.id]:store.state.messages.filter(m=>m.friendId===id),unreadIds=new Set(all.filter(m=>!m.read&&m.senderId!=='me').map(m=>m.id));
    const ids=[...feed.querySelectorAll('[data-message]')].filter(el=>{if(!unreadIds.has(el.dataset.message))return false;const r=el.getBoundingClientRect();return r.bottom>bounds.top+4&&r.top<bounds.bottom-4;}).map(el=>el.dataset.message);
    if(!ids.length)return;marking=true;let marked=false;try{marked=await attempt(()=>ref.kind==='group'?store.markGroupRead(ref.id,ids):store.markRead(id,ids));}finally{marking=false;if(marked||active!==id)requestAnimationFrame(markVisibleRead);}
  }
  function closeMeeting(options={}){return ui.close('meeting',options);}
  function renderMessages(restore=false){
    if(!active)return;const all=active.startsWith('group:')?(store.state.messagesByGroup[active.slice(6)]||[]):store.state.messages.filter(m=>m.friendId===active),limit=messageWindows.get(active)||80,messages=all.slice(-limit);
    const signature=active+'|'+messages.map(m=>m.id).join('|');if(signature===lastMessageSignature&&!restore)return;lastMessageSignature=signature;
    const feed=$('chat-messages'),nearEnd=feed.scrollHeight-feed.scrollTop-feed.clientHeight<90,oldScroll=feed.scrollTop,oldHeight=feed.scrollHeight;
    let previous=0;feed.innerHTML=(all.length>limit?'<button class="load-earlier" data-action="earlier">查看更早的消息</button>':'<div class="chat-day">每一次对话，都值得珍藏</div>')+messages.map(m=>{let stamp='';if(m.createdAt-previous>5*60*1000){stamp=`<div class="chat-time">${date(m.createdAt)} ${time(m.createdAt)}</div>`;previous=m.createdAt;}let content=esc(m.text);
      if(m.type==='image')content=photo(m.mediaId,'chat-photo');
      if(m.type==='sticker')content=`<div class="sticker-message"><span>${esc(m.text.split(' ')[0])}</span><small>${esc(m.text.split(' ').slice(1).join(' '))}</small></div>`;
      if(m.type==='moment'){const post=store.state.posts.find(p=>p.id===m.momentId);content=`<button class="shared-memory" data-action="post" data-id="${esc(m.momentId)}"><small>▧ 朋友圈</small>${esc(post?.text||'这条朋友圈暂不可用')}</button>`;}
      if(m.type==='content')content=contentCard(m.contentRef);
      return stamp+`<div class="message ${m.senderId==='me'?'outgoing':'incoming'}" data-message="${esc(m.id)}">${avatar(m.senderId)}<div class="message-body ${m.type}">${active.startsWith('group:')&&m.senderId!=='me'?`<small class="group-sender">${esc(person(m.senderId).name)}</small>`:''}${content}</div></div>`;
    }).join('');hydrate(feed);
    const renderedFriend=active,generation=++renderVersion;requestAnimationFrame(()=>{if(active!==renderedFriend||generation!==renderVersion)return;if(restore){feed.scrollTop=feed.scrollHeight;}else if(nearEnd)feed.scrollTop=feed.scrollHeight;else feed.scrollTop=oldScroll;markVisibleRead();});
  }
  function profileHTML(id){const f=person(id);return `<div class="moments-profile"><div class="moments-cover"><img src="assets/social/forest.svg" alt="林间封面"></div><div class="moments-identity"><h2>${esc(f.name)}</h2>${avatar(id)}</div><p class="moments-signature">${esc(f.signature)}</p></div>`;}
  function timelineHTML(id){return profileHTML(id)+`<div class="moments-timeline">${postsOf(id).map(post=>{const d=new Date(post.createdAt);return `<article class="moment-entry" data-post-id="${esc(post.id)}"><time class="moment-date" datetime="${d.toISOString()}"><strong>${String(d.getDate()).padStart(2,'0')}</strong><small>${d.getMonth()+1}月</small></time><div class="moment-content">${postHTML(post,id==='me',true)}</div></article>`;}).join('')||'<p class="empty-note">还没有朋友圈。<br>把生活的小事留在这里。</p>'}</div>`;}
  function publicFeedHTML(){return `<div class="public-moments-shell"><header class="public-moments-header"><div><small>OUR EVERYDAY STORIES</small><h2>朋友圈</h2><p>朋友们的生活，都在这里。</p></div><button class="primary" data-action="publish-post">＋ 发表</button></header><div class="public-moments-scroll"><div class="public-moments-intro"><div class="moments-cover"><img src="assets/social/forest.svg" alt="朋友圈封面"></div><div class="public-owner">${profileLine('me')}</div></div><div id="public-moments-list">${getPublicPosts(store.state).map(post=>`<article class="public-moment" data-post-id="${esc(post.id)}" data-author-id="${esc(post.authorId)}"><button class="public-moment-author" data-action="feed-author" data-id="${esc(post.authorId)}">${avatar(post.authorId)}<span><strong>${esc(person(post.authorId).name)}</strong><small>${esc(person(post.authorId).signature)}</small></span></button><div class="public-moment-body"><time class="public-moment-time" datetime="${new Date(post.createdAt).toISOString()}">${date(post.createdAt)} ${time(post.createdAt)}</time>${postHTML(post,post.authorId==='me',true)}</div></article>`).join('')||'<div class="empty-note">这里还很安静。<br>添加一位好友，或分享你的第一条朋友圈。</div>'}</div><p class="public-moments-end">每一件小事，都值得分享</p></div></div>`;}
  function markPublicSeen(){if(dialogKind!=='public-moments'||document.hidden||$('photo-dialog').open)return;const ids=[...new Set(getNewPublicPosts(store.state).map(p=>p.authorId))];for(const id of ids)attempt(()=>store.markPostsSeen(id));}
  function refreshPublicFeed(force=false){
    if(dialogKind!=='public-moments')return;
    const signature=JSON.stringify({profile:store.state.profile,posts:getPublicPosts(store.state)});if(!force&&signature===lastPublicSignature)return;lastPublicSignature=signature;
    const d=$('social-dialog'),feed=d.querySelector('.public-moments-scroll'),top=feed?.scrollTop||0,focused=document.activeElement,editing=d.contains(focused)&&focused.matches('.comment-form input'),post=editing?focused.closest('.comment-form').dataset.post:null,start=focused?.selectionStart,end=focused?.selectionEnd;
    d.innerHTML=chrome('朋友圈','social')+publicFeedHTML();d.querySelector('.public-moments-scroll').scrollTop=top;hydrate(d);
    if(post){const input=d.querySelector(`.comment-form[data-post="${CSS.escape(post)}"] input`);if(input){input.focus({preventScroll:true});input.setSelectionRange(start,end);}}
  }
  function showPublicFeed(){publishReturn=null;dialog(publicFeedHTML(),'public-moments');lastPublicSignature=JSON.stringify({profile:store.state.profile,posts:getPublicPosts(store.state)});markPublicSeen();}
  function renderMemories(){
    if(!active||!momentsOpen)return;const feed=$('moments-feed'),scroll=feed.scrollTop;
    const focused=document.activeElement,editing=feed.contains(focused)&&focused.matches('input'),editingPost=editing?focused.closest('.comment-form')?.dataset.post:null,start=focused?.selectionStart,end=focused?.selectionEnd;
    feed.innerHTML=timelineHTML(active);feed.scrollTop=scroll;hydrate(feed);
    if(editingPost){const input=feed.querySelector(`.comment-form[data-post="${CSS.escape(editingPost)}"] input`);if(input){input.focus({preventScroll:true});input.setSelectionRange(start,end);}}
  }
  function postHTML(post,own=false,timeline=false){return (post.contentRef?contentCard(post.contentRef):'')+plainPostHTML(post,own,timeline);}
  function plainPostHTML(post,own=false,timeline=false){return `${timeline?'':`<div class="post-top"><span>${date(post.createdAt)}</span></div><div class="profile-line">${profileLine(post.authorId)}</div>`}<p class="post-text">${esc(post.text)}</p><div class="post-photos count-${post.mediaIds.length}">${post.mediaIds.map(id=>photo(id)).join('')}</div><div class="post-actions"><button class="${post.likes.includes('me')?'liked':''}" data-action="like" data-id="${esc(post.id)}">${post.likes.includes('me')?'♥':'♡'} ${post.likes.length} 喜欢</button>${!own?`<button data-action="share-post" data-id="${esc(post.id)}">✧ 聊聊这条</button>`:''}</div><div class="post-likes">${post.likes.length?post.likes.map(id=>`<span>${esc(person(id).emoji)} ${esc(person(id).name)}</span>`).join(''):'还没有人点赞，送出第一份喜欢吧。'}</div><div class="comments">${post.comments.map(c=>`<p><strong>${esc(person(c.authorId).name)}</strong> ${esc(c.text)}</p>`).join('')}</div><form class="comment-form" data-post="${esc(post.id)}"><input name="comment" value="${esc(commentDrafts.get(post.id)||'')}" maxlength="500" placeholder="留下一点温暖…" aria-label="评论内容" required><button class="secondary" type="submit">发送</button></form>`;}
  const commentDrafts=new Map();
  function contentCard(ref){
    const content=getContent(ref);
    if(!content)return '<p class="muted">这条内容暂不可用。</p>';
    const owner=ref.type==='article'?getAccount(content.accountId):getCreator(content.creatorId);
    return `<button class="content-share-card" data-action="open-content" data-content-type="${esc(ref.type)}" data-content-id="${esc(ref.id)}"><img src="${esc(content.cover||content.poster)}" alt="" loading="lazy"><span><small>${ref.type==='article'?'▤ 公众号文章':'▷ 视频号'} · ${esc(owner?.name)}</small><strong>${esc(content.title)}</strong><em>点击${ref.type==='article'?'阅读':'观看'} ↗</em></span></button>`;
  }
  let shareReference=null,shareMode='friend',shareResolve=null,shareCloseTimer;const shareDrafts=new Map();
  const shareKey=()=>shareReference?shareReference.type+':'+shareReference.id:null;
  function saveShareDraft(){const key=shareKey(),form=$('content-share-form');if(!key||!form)return;const old=shareDrafts.get(key)||{};const fd=new FormData(form);shareDrafts.set(key,{...old,mode:shareMode,...Object.fromEntries(fd)});}
  function shareContent(ref){
    if(mods&&!mods.enabled(ref.type==='video'?'videos':'accounts')){mods.onUnavailable?.(ref.type==='video'?'videos':'accounts');return Promise.resolve(false);}
    if(!getContent(ref)){toast('这条内容暂不可用。');return Promise.resolve(false);}
    saveShareDraft();clearTimeout(shareCloseTimer);shareResolve?.(false);shareReference={...ref};shareMode=shareDrafts.get(shareKey())?.mode||'friend';if(mods&&!mods.enabled('moments'))shareMode='friend';renderContentShare();
    ui.open('share',{origin:ui.source()});
    return new Promise(resolve=>{shareResolve=resolve;});
  }
  function renderContentShare(){
    const d=$('content-share-dialog');
    d.innerHTML=chrome('分享发现','share',true)+`<small class="eyebrow">A GOOD STORY, SHARED</small><h2>把发现分享出去</h2>${contentCard(shareReference)}<div class="content-share-tabs"><button type="button" data-share-mode="friend" aria-pressed="${shareMode==='friend'}">发送给会话</button><button type="button" data-share-mode="post" ${mods&&!mods.enabled('moments')?'hidden':''} aria-pressed="${shareMode==='post'}">分享到朋友圈</button></div><form id="content-share-form">${shareMode==='friend'?`<fieldset><legend>选择好友或群聊</legend>${mixedConversations(store.state).map(conversationKey).map(id=>`<label class="content-recipient"><input type="radio" name="friend" value="${esc(id)}" required>${id.startsWith('group:')?groupAvatar(store.state,groupOf(store.state,id.slice(6))):avatar(id)}<span>${esc(person(id).name)}</span></label>`).join('')||'<p class="muted">还没有好友。添加好友后，就能把喜欢的内容送给他。</p>'}</fieldset>`:'<textarea name="text" rows="3" maxlength="2000" placeholder="说说为什么想分享…" aria-label="分享附言"></textarea>'}<p class="muted" role="status" id="content-share-result"></p><button class="primary" type="submit" ${shareMode==='friend'&&!mixedConversations(store.state).length?'disabled':''}>${shareMode==='friend'?'确认发送':'发布到朋友圈'} ↗</button></form><button class="text-button" type="button" data-share-back>← 返回内容</button>`;
    const draft=shareDrafts.get(shareKey());if(draft)for(const field of d.querySelectorAll('input,textarea'))if(field.name in draft){if(field.type==='radio')field.checked=field.value===draft[field.name];else field.value=draft[field.name];}
  }
  $('content-share-dialog').addEventListener('input',saveShareDraft);
  $('content-share-dialog').addEventListener('change',saveShareDraft);
  $('content-share-dialog').addEventListener('click',e=>{
    const mode=e.target.closest('[data-share-mode]');if(mode){saveShareDraft();shareMode=mode.dataset.shareMode;renderContentShare();}
    if(e.target.closest('[data-share-back]'))ui.close('share');
    if(e.target===$('content-share-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)ui.close('share');}
  });

  $('content-share-dialog').addEventListener('submit',async e=>{
    e.preventDefault();e.stopPropagation();const form=e.target,button=form.querySelector('[type="submit"]');if(button.disabled||!shareReference)return;
    button.disabled=true;const ref={...shareReference},fd=new FormData(form),mode=shareMode;
    const ok=await attempt(async()=>{if(mods&&(!mods.enabled(ref.type==='video'?'videos':'accounts')||mode==='post'&&!mods.enabled('moments')))throw Error('模块已停用');if(mode==='friend')await sendConversation(conversationRef(String(fd.get('friend'))),{type:'content',contentRef:ref,text:getContent(ref).title});else await store.publishPost({text:String(fd.get('text')||''),mediaIds:[],contentRef:ref});return true;});
    if(ok){$('content-share-result').textContent=mode==='friend'?'已发送给选中的会话。':'已分享到朋友圈。';const done=shareResolve;shareResolve=null;done?.(true);shareCloseTimer=setTimeout(()=>{const key=shareKey();ui.close('share').then(()=>shareDrafts.delete(key));},650);}else button.disabled=false;
  });
  root.addEventListener('input',e=>{const form=e.target.closest('.comment-form');if(form)commentDrafts.set(form.dataset.post,e.target.value);});
  function renderPost(id){const post=store.state.posts.find(p=>p.id===id);if(!post)return toast('这条朋友圈暂不可用。');
    if(post.authorId==='me'){showOwnMemories();requestAnimationFrame(()=>$('social-dialog').querySelector(`[data-post-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'nearest'}));return;}
    if(!store.state.friends.includes(post.authorId))return;
    const show=()=>{setMoments(true);requestAnimationFrame(()=>$('moments-feed').querySelector(`[data-post-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));};
    if(active!==post.authorId)openFriend(post.authorId).then(show);else show();
  }
  function dialog(html,kind){
    if(kind!=='publish')saveFormDrafts();const child=kind==='publish'||kind==='profile',d=$(child?'compose-dialog':'social-dialog');
    const replacing=!child&&ui.state('social')==='open';
    if(!child)dialogKind=kind;
    d.classList.toggle('public-moments-dialog',kind==='public-moments');
    const title=kind==='public-moments'?'朋友圈':kind==='me'?'我的林间角落':kind==='publish'?'记录此刻':kind==='profile'?'编辑资料':'我的朋友圈';
    d.setAttribute('aria-label',kind==='public-moments'?'公共朋友圈':title);
    queueMicrotask(refreshMods);
    d.innerHTML=chrome(title,child?'compose':'social',child)+html;if(kind==='my-memories')d.querySelector('.ui-titlebar').insertAdjacentHTML('afterbegin','<button class="ui-back" data-action="me" aria-label="返回我的角落">←</button>');
    if(!child)ui.setNav('social',kind==='public-moments'?'mod-moments':'me');
    ui.open(child?'compose':'social',{origin:actionSource});if(replacing)ui.transition(d);
    if(!child){const feed=d.querySelector('.public-moments-scroll')||d;feed.scrollTop=viewScrolls.get(kind)||0;}
    restoreFormDrafts(d,kind==='publish'?'publish-'+publishKind:'profile-form');hydrate(d);
  }
  function showStatus(id,origin,refresh=false){
    const st=statusOf(id);if(!st){toast('这个状态已经结束了。');closeStatus();return;}
    if(!refresh&&statusOwner===id&&['open','opening'].includes(ui.state('status'))){closeStatus();return;}
    statusOwner=id;statusOrigin=origin||statusOrigin||actionSource;const trigger=typeof statusOrigin==='function'?statusOrigin():statusOrigin;trigger?.setAttribute('aria-expanded','true');trigger?.setAttribute('aria-controls','status-popover');
    const info=stateInfo(st.kind),d=$('status-popover');
    d.innerHTML=chrome(person(id).name+' · 此刻','status')+`<div class="status-cover"><span>${esc(info.icon)}</span><div><small>此刻的心情</small><h2>${esc(info.label)}</h2></div></div><div class="profile-line">${profileLine(id)}</div><p class="status-text">${esc(st.text||'让心情在这里待一会儿。')}</p>${st.mediaId?photo(st.mediaId,'status-photo'):''}<p class="muted">${date(st.createdAt)} ${time(st.createdAt)} · 24 小时后消散</p>${id==='me'?'<button class="secondary" data-action="clear-status">结束这个状态</button>':''}`;
    if(!refresh)ui.open('status',{origin:statusOrigin});else positionStatus();hydrate(d);
  }
  function showMe(){const st=statusOf('me');dialog(`<small class="eyebrow">MY LITTLE CORNER</small><h2>我的林间角落</h2><div class="profile-line">${profileLine('me')}</div><button class="secondary edit-profile" data-action="edit-profile">编辑资料</button><div class="me-actions"><button data-action="publish-status">${st?esc(stateInfo(st.kind).icon):'☀'}<strong>${st?'更新状态':'发布状态'}</strong><small>让朋友知道此刻的你</small></button><button data-action="publish-post">✧<strong>发布朋友圈</strong><small>文字与照片，都会发光</small></button><button data-action="my-memories">◌<strong>我的朋友圈</strong><small>${postsOf('me').length} 条朋友圈</small></button>${st?'<button data-action="status" data-id="me">◉<strong>查看我的状态</strong><small>可以随时结束</small></button>':''}</div><div class="content-library-links"><button data-action="settings">⚙ 设置</button><button data-action="content-library" data-kind="follows">♧ 我的关注</button><button data-action="content-library" data-kind="collections">◇ 我的收藏</button><button data-action="content-library" data-kind="history">◷ 最近浏览</button></div><div class="demo-controls"><div><strong>本地演示</strong><p>朋友的回复与更新来自预设故事。</p></div><button class="secondary" data-action="pause-demo">${store.state.settings.demoPaused?'继续故事':'暂停故事'}</button><button class="text-button" data-action="replay-demo">重播故事</button></div>`,'me');}
  function refreshMods(){
    const enabled=id=>!mods||mods.enabled(id);
    for(const m of MODS){const b=root.querySelector(`[data-mod-entry="${m.id}"]`);if(b)b.hidden=!!mods&&(!mods.enabled(m.id)||!mods.state.modules[m.id].pinned);}
    for(const b of root.querySelectorAll('[data-action="publish-post"],[data-action="my-memories"],[data-share-mode="post"]'))b.hidden=!enabled('moments');
    for(const b of root.querySelectorAll('[data-action="content-library"]'))b.hidden=!enabled('accounts')&&!enabled('videos');
    $('moments-toggle').hidden=!active?.startsWith('group:')&&!enabled('moments');
    if(!enabled('moments')&&momentsOpen)setMoments(false);
    renderInboxSummary();renderAnchors();
  }
  async function prepareModDisable(id){
    saveFormDrafts();saveShareDraft();
    if(id==='moments'){
      if(momentsOpen)setMoments(false);
      if(['public-moments','my-memories'].includes(dialogKind))await ui.close('social',{immediate:true,restoreFocus:false});
      if(publishKind==='post'&&ui.state('compose')!=='closed')await ui.close('compose',{immediate:true,restoreFocus:false});
      if(shareMode==='post'&&ui.state('share')!=='closed')await ui.close('share',{immediate:true,restoreFocus:false});
    }
    if(['accounts','videos'].includes(id)&&shareReference?.type===(id==='accounts'?'article':'video'))await ui.close('share',{immediate:true,restoreFocus:false});
  }
  function showProfileEditor(){dialog(`<form id="profile-form"><label>昵称<input name="name" value="${esc(store.state.profile.name)}" maxlength="24" required></label><label>个性签名<textarea name="signature" maxlength="100" rows="2">${esc(store.state.profile.signature)}</textarea></label><button class="secondary" type="submit">保存资料</button></form>`,'profile');}
  function showPublish(kind){if(kind==='post'&&mods&&!mods.enabled('moments'))return mods.onUnavailable('moments');publishReturn=dialogKind==='public-moments'?'public-moments':null;saveFormDrafts();publishFileVersion++;publishKind=kind;publishingFiles=publishDrafts.get(kind)||[];dialog(`<small class="eyebrow">${kind==='status'?'A FEELING, FOR TODAY':'A MEMORY, TO KEEP'}</small><h2>${kind==='status'?'此刻，你是什么心情？':'分享今天的生活'}</h2><form id="publish-form" data-draft-key="publish-${kind}">${kind==='status'?`<div class="state-options">${STATES.map((s,i)=>`<label><input type="radio" name="kind" value="${esc(s.id)}" ${i===0?'checked':''}><span>${esc(s.icon)} ${esc(s.label)}</span></label>`).join('')}</div>`:''}<textarea name="text" rows="4" maxlength="2000" placeholder="${kind==='status'?'记录此刻的心情…':'今天有什么值得记住？'}" aria-label="发布文案"></textarea><label class="upload-area">＋ ${kind==='status'?'添加一张照片':'添加照片（最多九张）'}<input id="publish-files" type="file" accept="image/*" ${kind==='post'?'multiple':''}></label><div id="publish-previews">${publishingFiles.map(id=>`<img data-media="${esc(id)}" alt="待发布照片">`).join('')}</div><p class="muted">${kind==='status'?'24 小时后自动结束。':'只保存在当前浏览器。'} 每张图片不超过 10 MB。</p><button class="primary" type="submit">${kind==='status'?'就用这个状态':'发布朋友圈'} ↗</button></form>`,'publish');}
  function showOwnMemories(){if(mods&&!mods.enabled('moments'))return mods.onUnavailable('moments');dialog(`<div class="own-moments">${timelineHTML('me')}</div>`,'my-memories');}
  function showPicker(kind){picker=picker===kind?null:kind;const el=$('chat-picker');if(!picker){ui.close('picker');return;}el.innerHTML=picker==='emoji'?`<div class="emoji-grid">${EMOJI.map(e=>`<button data-action="insert-emoji" data-value="${e}">${e}</button>`).join('')}</div>`:picker==='stickers'?`<div class="sticker-grid">${STICKERS.map(([e,t])=>`<button data-action="send-sticker" data-value="${e} ${t}"><span>${e}</span>${t}</button>`).join('')}</div>`:'';if(picker)ui.open('picker',{origin:actionSource,focus:false});else ui.close('picker');}
  function sendConversation(ref,payload){if(ref.kind==='friend')return store.sendMessage(ref.id,payload);const g=groupOf(store.state,ref.id),mentions=(g?.memberIds||[]).filter(id=>payload.text?.includes('@'+person(id).name));if(payload.text?.includes('@所有人'))mentions.push('all');return store.sendGroupMessage(ref.id,{...payload,mentionIds:mentions});}
  async function send(payload){if(!active)return false;const id=active,submittedText=$('chat-input').value,submittedAttachment=attachment,isComposer=payload.type==='text'||payload.type==='image';if(isComposer)clearTimeout(draftTimer);const result=await attempt(async()=>{await sendConversation(conversationRef(id),payload);return true;});if(result){ui.close('picker');picker=null;if(id===active){if(isComposer&&$('chat-input').value===submittedText){$('chat-input').value='';draftValues.set(id,'');await attempt(()=>store.setConversationDraft(conversationRef(id),''));}if(isComposer&&attachment===submittedAttachment){attachment=null;$('chat-attachment').hidden=true;await attempt(()=>store.setConversationAttachment(conversationRef(id),null));}$('chat-messages').scrollTop=$('chat-messages').scrollHeight;}}return !!result;}
  root.addEventListener('click',async e=>{
    const button=e.target.closest('[data-action]');if(!button)return;const action=button.dataset.action,id=button.dataset.id;actionSource=button;
    if(action==='workshop')return onOpenWorkshop(button);
    if(action?.startsWith('mod-'))return attempt(()=>mods.open(action.slice(4),{origin:button}));
    const momentsActions=['public-moments','post','feed-author','like','share-post','publish-post','my-memories'];
    if(mods&&momentsActions.includes(action)&&!mods.enabled('moments'))return mods.onUnavailable('moments',{origin:button});
    if(action==='public-moments')return mods?attempt(()=>mods.open('moments',{origin:button})):showPublicFeed();
    if(action==='discover')return onOpenWorkshop(button);
    if(action==='open-content')onOpenContent({type:button.dataset.contentType,id:button.dataset.contentId});
    if(action==='content-library')onOpenContent(button.dataset.kind,{owner:'me',origin:button,onBack:()=>showMe()});
    if(action==='feed-author'){if(id==='me'){showOwnMemories();}else{ui.close('social',{immediate:true,restoreFocus:false});await openFriend(id);setMoments(true);}}
    if(action==='directory')showDirectory();
    if(action==='directory-tab'){directoryTab=button.dataset.tab;root.querySelectorAll('.directory-tabs button').forEach(b=>b.classList.toggle('active',b===button));renderDirectory();}
    if(action==='add-friend'){button.disabled=true;const ok=await attempt(async()=>{await store.addFriend(id);return true;});button.disabled=false;if(ok){renderDirectory();toast(`已添加${person(id).name}，有新消息后会按最近联系顺序来到森林。`);conversations.showAdd();}}
    if(action==='open-friend')openFriend(id,{origin:button});
    if(action==='active-friend-profile'&&active){if(active.startsWith('group:'))groups.showInfo(active.slice(6),button);else avatarFriends.open(person(active),{origin:button});}
    if(action==='status')showStatus(id,button.closest('.friend-anchor')?()=>root.querySelector(`.friend-anchor[data-friend="${CSS.escape(id)}"] .status-badge`):button);
    if(action==='settings'){onMountPet($('settings-pet-slot'));ui.open('settings',{origin:button});}
    if(action==='sound-settings')onOpenSound(button);
    if(action==='avatar-service-settings')globalThis.AndroidAvatar?.openSettings();
    if(action==='me')showMe();if(action==='edit-profile')showProfileEditor();
    if(action==='photo'){if(button.querySelector('img.unavailable'))return toast('图片暂不可用，请稍后再试。');const url=await attempt(()=>store.mediaUrl(button.dataset.media));if(url){$('photo-dialog').querySelector('img').src=url;ui.open('photo',{origin:button});}}
    if(action==='post')renderPost(id);
    if(action==='toggle-moments')setMoments(!momentsOpen);
    if(action==='like'){const ok=await attempt(async()=>{await store.toggleLike(id);return true;});if(!ok)return;const current=($('social-dialog').open?$('social-dialog'):root).querySelector('[data-action="like"][data-id="'+CSS.escape(id)+'"]');if(!current)return;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)current.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:160});const spark=document.createElement('span');spark.className='like-spark';spark.textContent='✦';current.append(spark);setTimeout(()=>spark.remove(),700);}
    if(action==='share-post'){const post=store.state.posts.find(p=>p.id===id);if(!post||post.authorId==='me')return;if(dialogKind==='public-moments'){ui.close('social',{immediate:true,restoreFocus:false});await openFriend(post.authorId);}const sent=await send({type:'moment',momentId:id,text:'想和你聊聊这段记忆'});if(!sent)return;if(innerWidth<=760)setMoments(false);toast('朋友圈已分享，可以接着聊。');$('chat-input').focus();}
    if(action==='emoji'||action==='stickers')showPicker(action);
    if(action==='insert-emoji'){const input=$('chat-input');input.setRangeText(button.dataset.value,input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new Event('input'));input.focus();}
    if(action==='send-sticker')await send({type:'sticker',text:button.dataset.value});
    if(action==='chat-image')$('chat-file').click();
    if(action==='remove-attachment'){attachment=null;$('chat-attachment').hidden=true;attempt(()=>store.setConversationAttachment(conversationRef(active),null));}
    if(action==='mention'&&active?.startsWith('group:')){const g=groupOf(store.state,active.slice(6));$('chat-picker').innerHTML=['all',...g.memberIds].map(id=>`<button data-action="insert-emoji" data-value="@${esc(id==='all'?'所有人':person(id).name)} ">@${esc(id==='all'?'所有人':person(id).name)}</button>`).join('');ui.open('picker',{origin:button});}
    if(action==='earlier'){messageWindows.set(active,(messageWindows.get(active)||80)+80);lastMessageSignature='';renderMessages();}
    if(action==='publish-status')showPublish('status');
    if(action==='publish-post')showPublish('post');
    if(action==='my-memories')showOwnMemories();
    if(action==='clear-status'){const ok=await attempt(async()=>{await store.clearStatus();return true;});if(ok){closeStatus();showMe();}}
    if(action==='pause-demo'){await attempt(()=>store.setDemoPaused(!store.state.settings.demoPaused));showMe();}
    if(action==='replay-demo'){const ok=await attempt(async()=>{await store.restartDemo();return true;});if(ok)toast('故事从头开始，你的内容都会保留。');}
  });
  root.addEventListener('submit',async e=>{
    e.preventDefault();const form=e.target,button=form.querySelector('[type="submit"]');if(button?.disabled)return;
    if(form.id==='chat-form'){const text=$('chat-input').value.trim();if(!text&&!attachment)return;button.disabled=true;try{await send(attachment?{type:'image',mediaId:attachment,text}:{type:'text',text});}finally{button.disabled=false;}return;}
    if(form.classList.contains('comment-form')){const input=form.elements.comment;const text=input.value.trim();if(!text)return;button.disabled=true;const ok=await attempt(async()=>{commentDrafts.delete(form.dataset.post);try{await store.addComment(form.dataset.post,text);}catch(error){commentDrafts.set(form.dataset.post,text);throw error;}return true;});if(!ok)button.disabled=false;return;}
    if(form.id==='profile-form'){const fd=new FormData(form);const ok=await attempt(async()=>{await store.updateProfile({name:String(fd.get('name')).trim(),signature:String(fd.get('signature')).trim()});return true;});if(ok){await ui.close('compose');formDrafts.delete('profile-form');showMe();toast('资料已保存。');}return;}
    if(form.id==='publish-form'){if(publishKind==='post'&&mods&&!mods.enabled('moments'))return toast('朋友圈已停用，草稿已保留');const fd=new FormData(form),text=String(fd.get('text')).trim();if(publishKind==='post'&&!text&&!publishingFiles.length)return toast('写一点文字，或添一张照片吧。');button.disabled=true;const ok=await attempt(async()=>{if(publishKind==='status')await store.publishStatus({kind:fd.get('kind'),text,mediaId:publishingFiles[0]});else await store.publishPost({text,mediaIds:publishingFiles});return true;});button.disabled=false;if(ok){formDrafts.delete('publish-'+publishKind);publishDrafts.delete(publishKind);publishingFiles=[];form.reset();ui.close('compose',{immediate:true,restoreFocus:false});formDrafts.delete('publish-'+publishKind);publishDrafts.delete(publishKind);toast(publishKind==='status'?'心情已挂在今天的枝头。':'朋友圈已发布。');if(publishReturn==='public-moments')showPublicFeed();else showMe();}}
  });
  $('friend-search').addEventListener('input',renderDirectory);
  $('meeting-search').addEventListener('input',renderMeetingFriends);
  $('chat-input').addEventListener('input',()=>{if(!active)return;const id=active,value=$('chat-input').value;draftValues.set(id,value);clearTimeout(draftTimer);draftTimer=setTimeout(()=>attempt(()=>store.setConversationDraft(conversationRef(id),value)),250);});
  $('chat-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();$('chat-form').requestSubmit();}});
  $('chat-messages').addEventListener('scroll',()=>{if(!active)return;const id=active,value=$('chat-messages').scrollTop;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>attempt(()=>store.setScroll(id,value)),250);requestAnimationFrame(markVisibleRead);});
  $('chat-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;attachment=null;$('chat-attachment').hidden=true;const id=active,version=++chatFileVersion,media=await attempt(()=>store.importImage(file));e.target.value='';if(media&&active===id&&version===chatFileVersion){attachment=media;attempt(()=>store.setConversationAttachment(conversationRef(id),media));$('chat-attachment').hidden=false;$('chat-attachment').innerHTML=`<img data-media="${esc(media)}" alt="待发送图片"><span>图片准备好了</span><button class="icon-button" data-action="remove-attachment" aria-label="移除图片">移除</button>`;hydrate($('chat-attachment'));}});
  root.addEventListener('change',async e=>{if(e.target.id!=='publish-files')return;const files=[...e.target.files],max=publishKind==='status'?1:9;if(files.length>max)return toast(`最多选择 ${max} 张照片。`);publishingFiles=[];$('publish-previews').innerHTML='';const version=++publishFileVersion,form=$('publish-form'),submit=form.querySelector('[type="submit"]');submit.disabled=true;const ids=[];let failed=false;for(const file of files){const id=await attempt(()=>store.importImage(file));if(!id){failed=true;break;}ids.push(id);}if(form.isConnected&&version===publishFileVersion){if(!failed){publishingFiles=ids;$('publish-previews').innerHTML=ids.map(id=>`<img data-media="${esc(id)}" alt="待发布照片">`).join('');hydrate($('publish-previews'));}submit.disabled=false;}});
  function syncVisibleRead(){markPublicSeen();markVisibleRead();if(memoriesVisible()&&postsOf(active).some(p=>p.createdAt>(store.state.seenPosts[active]||0)))attempt(()=>store.markPostsSeen(active));}
  $('photo-dialog').addEventListener('close',syncVisibleRead);
  document.addEventListener('visibilitychange',()=>{markVisibleRead();markPublicSeen();});
  let expiryTimer=setInterval(()=>{renderAnchors();if(statusOwner&&!statusOf(statusOwner)){closeStatus();toast('这个状态已结束。');}},30000);
  const unsubscribe=store.subscribe((state,event)=>{
    if(event?.type==='attachment')return;if(event?.type==='draft'){renderDirectory();renderMeetingFriends();return;}if(event?.type==='scroll')return;
    renderSummary();if(active&&!active.startsWith('group:')&&!state.friends.includes(active)){closeMeeting();return;}if(active?.startsWith('group:')&&!groupOf(state,active.slice(6))){closeMeeting();return;}if(active){if(event?.type==='group-updated')renderChatTitle();renderMessages();const signature=JSON.stringify(postsOf(active));if(signature!==lastPostSignature){lastPostSignature=signature;renderMemories();}markVisibleRead();if(memoriesVisible()&&postsOf(active).some(p=>p.createdAt>(store.state.seenPosts[active]||0)))attempt(()=>store.markPostsSeen(active));}
    if(dialogKind==='my-memories'&&['post','like','comment','profile'].includes(event?.type)){const d=$('social-dialog'),top=d.scrollTop;d.innerHTML=chrome('我的朋友圈','social')+`<div class="own-moments">${timelineHTML('me')}</div>`;d.scrollTop=top;hydrate(d);}
    if(dialogKind==='public-moments'){refreshPublicFeed();markPublicSeen();}
    if(statusOwner&&statusOf(statusOwner))showStatus(statusOwner,null,true);
  });
  ui.register('picker',{el:$('chat-picker'),kind:'popover',onClosed(){picker=null;}});
  renderSummary();renderDirectory();
  let presenceState=null,presenceContext='',presenceFriends=[];
  function prepareFrame(now){const occupant=active||closingFriend,context=occupant+'|'+chatVisible();if(presenceState!==store.state)presenceFriends=store.state.friends.map(person);if(presenceState!==store.state||presenceContext!==context){presenceState=store.state;presenceContext=context;presence.reconcile({state:store.state,activeFriend:occupant,chatVisible:chatVisible(),now});}const entries=presence.update(now,matchMedia('(prefers-reduced-motion: reduce)').matches);characters.setPresence(entries,presenceFriends);}
  function update(now){
    if(statusOwner&&statusOrigin){const source=typeof statusOrigin==='function'?statusOrigin():statusOrigin;if(!source?.isConnected||source.closest('[hidden]'))closeStatus();}
    const dt=Math.min(.05,(now-lastAnchorFrame)/1000||1/60);lastAnchorFrame=now;
    const moving=orbiting||now-lastCameraMotion<180,anchors=characters.getAnchors();
    for(const [id,node]of anchorNodes)if(!anchors.some(a=>a.id===id)&&!node.hidden)node.hidden=true;
    root.classList.toggle('is-orbiting',orbiting);
    for(const a of anchors){
      const node=anchorNodes.get(a.id);if(!node)continue;
      for(const [key,value]of [['worldX',a.worldX?.toFixed(3)],['worldZ',a.worldZ?.toFixed(3)],['walking',String(!!a.walking)],['presence',a.phase||'present']])if(node.dataset[key]!==value)node.dataset[key]=value;
      if(node.hidden===a.visible)node.hidden=!a.visible;const opacity=String(a.alpha??1);if(node.style.opacity!==opacity)node.style.opacity=opacity;
      node.classList.toggle('selected',active===a.id);
      if(node._occluded===undefined)node._occluded=!!a.occluded;
      if(!moving){
        if(node._occlusionCandidate!==!!a.occluded){node._occlusionCandidate=!!a.occluded;node._occlusionSince=now;}
        if(now-(node._occlusionSince||0)>200)node._occluded=!!a.occluded;
      }
      node.classList.toggle('occluded',node._occluded);
      const fresh=now-(unreadArrival.get(a.id)?.at??-Infinity)<3000;
      node.classList.toggle('show-message',fresh&&node.classList.contains('has-unread'));
      node.classList.toggle('is-hovered',!sceneTransition&&!orbiting&&controls.enabled&&hover.get(now)===a.id);
    }
    const measured=anchors.map(a=>{const node=anchorNodes.get(a.id),height=node?._anchorHeight||36;return{...a,width:node?._anchorWidth||150,height};});const positions=anchorLayout.update(measured,{now,moving,width:innerWidth,height:innerHeight,dt});
    for(const p of positions){const node=anchorNodes.get(p.id);if(!node)continue;const a=anchors.find(a=>a.id===p.id),offset=`${((a?.headY??p.y)-p.y+40).toFixed(2)}px`,labelOffset=p.offset.toFixed(2),transform=`translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,0) translate(-50%,-100%)`;if(node._identityOffset!==offset){node.style.setProperty('--identity-offset',offset);node._identityOffset=offset;}if(node.dataset.labelOffset!==labelOffset)node.dataset.labelOffset=labelOffset;if(node._anchorTransform!==transform){node.style.transform=transform;node._anchorTransform=transform;}}
  }

  refreshMods();
  return {openInbox:showDirectory,openModMoments:()=>showPublicFeed(),refreshMods,prepareModDisable,openFriend,update,prepareFrame,saveSessionDraft,loadInbox:()=>conversations.loadInbox(),get inbox(){return conversations.inbox;},setSceneTransition:value=>{sceneTransition=!!value;if(value)closeStatus({immediate:true,restoreFocus:false});},get presence(){return presence.snapshot();},closeMeeting,toast,shareContent,get activeFriend(){return active&&!active.startsWith('group:')?active:null;},get activeConversation(){return active||closingFriend?conversationRef(active||closingFriend):null;},get chatVisible(){return chatVisible();},openConversation,openGroupQueue:(ids,origin)=>groups.openQueue(ids,origin),refreshGroupQueue:()=>groups.refreshQueue(),openCreateGroup:origin=>groups.openCreate(origin),dispose(){hover.dispose();groups.dispose();presence.clear();friendModels.dispose();avatarFriends.dispose();conversations.dispose();dock.dispose();controls?.removeEventListener('start',orbitStart);controls?.removeEventListener('end',orbitEnd);controls?.removeEventListener('change',orbitChange);anchorSizes.disconnect();anchorLayout.clear();unsubscribe();clearInterval(expiryTimer);clearTimeout(draftTimer);clearTimeout(scrollTimer);root.remove();}};
}
