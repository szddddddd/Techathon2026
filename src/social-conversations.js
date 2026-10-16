import {mixedConversations,conversationKey,conversationRef,groupOf,groupUnread} from './group-catalog.js';
import {groupAvatar} from './group-ui.js';
import {friendOf,friendAvatar,allFriends} from './social-store.js';
import {conversationIds,unreadCounts} from './social-presence.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stamp=t=>!t?'':new Date(t).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
export function createConversations({root,store,friends,ui,onError=console.error,onViewProfile=()=>{},onNewContact=()=>{},onCreateGroup=()=>{},onGroups=()=>{},onGroupInfo=()=>{}}){
  const directory=root.querySelector('#directory');let tab='messages',menuId=null,addQuery='',pressStart=null,longPress=null,suppressedUntil=0;
  directory.innerHTML='<header class="contacts-title"><div><small>LETTERS FROM THE WOODS</small><h2>消息</h2></div><button class="contacts-add" data-action="add-directory" aria-label="添加好友或发起群聊">＋</button><button class="ui-close" data-ui-close="directory" aria-label="关闭好友列表">×</button></header><label class="search">⌕ <input id="friend-search" placeholder="搜索好友、群聊或消息" aria-label="搜索好友"></label><div class="directory-tabs" role="tablist"><button role="tab" data-conversation-tab="messages" aria-selected="true">消息 <span id="friend-unread-count"></span></button><button role="tab" data-conversation-tab="contacts" aria-selected="false">通讯录 <span id="friend-count"></span></button></div><div id="friend-list" role="list" aria-label="好友会话"></div><p class="contacts-footnote">朋友与群聊，都住在风景里</p>';
  const menu=document.createElement('section');menu.id='friend-context-menu';menu.className='paper friend-context-menu';menu.hidden=true;menu.setAttribute('role','menu');menu.setAttribute('aria-label','好友选项');root.append(menu);
  const add=document.createElement('dialog');add.id='add-friends-dialog';add.className='paper';add.setAttribute('aria-label','添加好友');root.append(add);
  ui.register('friend-menu',{el:menu,kind:'popover',onClosed(){menuId=null;}});
  ui.register('add-friends',{el:add,kind:'child',modal:true});
  const person=key=>key.startsWith('group:')?groupOf(store.state,key.slice(6)):friendOf(store.state,key);
  function rows(ids,{compact=false,active=null}={}){
    const counts=unreadCounts(store.state),pins=new Set([...(store.state.pinnedFriends||[]),...(store.state.pinnedGroups||[]).map(id=>'group:'+id)]);
    return ids.map(id=>{const f=person(id);if(!f)return '';const ref=conversationRef(id),isGroup=ref.kind==='group',unread=isGroup?groupUnread(store.state,ref.id):[],last=(isGroup?store.state.messagesByGroup[ref.id]:store.state.messages.filter(m=>m.friendId===id)).at(-1),n=isGroup?unread.length:counts.get(id)||0,draft=store.state.drafts[id],pinned=pins.has(id),mention=unread.some(m=>m.mentionIds?.some(x=>x==='me'||x==='all'));
      const preview=(mention?'<em>[有人@我]</em> ':'')+(draft?`<em>[草稿]</em> ${esc(draft)}`:last?`${isGroup?esc(last.senderId==='me'?store.state.profile.name:friendOf(store.state,last.senderId)?.name||'成员')+'：':''}${esc(({image:'[图片]',sticker:'[表情]',moment:'[朋友圈]',content:'[分享]'}[last.type])||last.text)}`:esc(f.signature||'群聊已创建'));
      return `<article class="conversation-row ${pinned?'is-pinned':''} ${active===id?'active':''} ${compact?'is-compact':''}" data-friend-row="${id}" role="listitem"><button class="conversation-open" data-action="open-friend" data-id="${id}" aria-label="与${esc(f.name)}聊天${n?'，'+n+'条未读':''}"><span class="conversation-avatar">${isGroup?groupAvatar(store.state,f):`<img src="${esc(friendAvatar(f))}" alt="">`}${n?`<b class="conversation-unread">${n>99?'99+':n}</b>`:''}</span><span class="conversation-copy"><span class="conversation-top"><strong>${esc(f.name)}</strong><time>${stamp(last?.createdAt)}</time></span><span class="conversation-preview">${preview}</span></span>${pinned?'<span class="conversation-pin" aria-label="已置顶">⌃</span>':''}</button><button class="conversation-more" data-action="friend-menu" data-id="${id}" aria-label="${esc(f.name)}的更多选项" aria-haspopup="menu">···</button></article>`;
    }).join('')||'<p class="empty-note">还没有会话。<br>从通讯录认识一位朋友吧。</p>';
  }
  function render(){
    const query=directory.querySelector('#friend-search').value.trim().toLowerCase();
    const ids=(tab==='contacts'?[...store.state.friends].sort((a,b)=>person(a).name.localeCompare(person(b).name,'zh-CN')):mixedConversations(store.state).map(conversationKey)).filter(id=>{const f=person(id);return `${f.name} ${id} ${(id.startsWith('group:')?store.state.messagesByGroup[id.slice(6)]:store.state.messages.filter(m=>m.friendId===id)).at(-1)?.text||''}`.toLowerCase().includes(query);});
    directory.querySelector('#friend-list').innerHTML=(tab==='contacts'?`<button class="group-directory-entry" data-show-groups>群聊 <span>${store.state.groups.filter(g=>!g.leftAt).length}</span> ›</button>`:'')+rows(ids)+(tab==='messages'&&!ids.length?'<button class="group-directory-entry" data-show-groups>体验校园群聊 ›</button>':'');
    directory.querySelector('#friend-count').textContent=store.state.friends.length;if(add.open)renderAddResults();
    const n=[...unreadCounts(store.state).values()].reduce((a,b)=>a+b,0)+store.state.groups.filter(g=>!g.leftAt).reduce((sum,g)=>sum+groupUnread(store.state,g.id).length,0);directory.querySelector('#friend-unread-count').textContent=n||'';
    for(const b of directory.querySelectorAll('[role=tab]')){b.classList.toggle('active',b.dataset.conversationTab===tab);b.setAttribute('aria-selected',String(b.dataset.conversationTab===tab));}
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
    list.innerHTML=catalog.map(f=>`<button class="contact-search-result" data-contact-profile="${esc(f.id)}" aria-label="查看${esc(f.name)}的资料"><img src="${esc(friendAvatar(f))}" alt=""><span><strong>${esc(f.name)}</strong><small>账号：${esc(f.account||f.id)}</small></span>${store.state.friends.includes(f.id)?'<em>已添加</em>':'<b>›</b>'}</button>`).join('')||'<p class="contact-search-empty">没有找到这个联系人<br><small>可搜索本机已有资料，或录入联系人资料。</small></p>';
  }
  function showAdd(){
    add.innerHTML=`<header class="ui-titlebar"><span>添加朋友</span><button class="ui-close" data-ui-close="add-friends" aria-label="关闭添加好友">×</button></header><label class="contact-search"><span>⌕</span><input type="search" id="contact-search" aria-label="搜索联系人" placeholder="昵称 / 账号" value="${esc(addQuery)}"></label><div class="contact-search-results"></div><button class="contact-manual-entry" data-new-contact><span>＋</span><span>录入联系人资料<small>使用对方的昵称、账号和头像</small></span><b>›</b></button><p class="contact-local-note">当前搜索本机联系人资料</p>`;
    renderAddResults();ui.open('add-friends',{origin:ui.source()}).then(()=>add.querySelector('input')?.focus({preventScroll:true}));
  }
  add.addEventListener('input',e=>{if(e.target.id==='contact-search'){addQuery=e.target.value;renderAddResults();}});
  add.addEventListener('click',e=>{
    const result=e.target.closest('[data-contact-profile]');if(result)onViewProfile(person(result.dataset.contactProfile),()=>add.querySelector(`[data-contact-profile="${CSS.escape(result.dataset.contactProfile)}"]`));
    if(e.target.closest('[data-new-contact]'))onNewContact({account:/^[a-zA-Z0-9_.-]{3,64}$/.test(addQuery)?addQuery:'',origin:add.querySelector('[data-new-contact]')});
  });
  const click=async e=>{
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
  root.addEventListener('click',suppress,true);root.addEventListener('click',click);root.addEventListener('contextmenu',context);root.addEventListener('pointerdown',down);root.addEventListener('pointerup',cancel);root.addEventListener('pointercancel',cancel);root.addEventListener('pointermove',move);
  return {render,rows,showAdd,get menuFriend(){return menuId;},dispose(){cancel();root.removeEventListener('click',suppress,true);root.removeEventListener('click',click);root.removeEventListener('contextmenu',context);root.removeEventListener('pointerdown',down);root.removeEventListener('pointerup',cancel);root.removeEventListener('pointercancel',cancel);root.removeEventListener('pointermove',move);}};
}
