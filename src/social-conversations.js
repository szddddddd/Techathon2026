import {conversationIds,unreadCounts} from './social-presence.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stamp=t=>!t?'':new Date(t).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
export function createConversations({root,store,friends,ui,onError=console.error}){
  const directory=root.querySelector('#directory');let tab='messages',menuId=null,pressStart=null,longPress=null,suppressedUntil=0;
  directory.innerHTML='<header class="contacts-title"><div><small>LETTERS FROM THE WOODS</small><h2>好友</h2></div><button class="contacts-add" data-action="add-directory" aria-label="添加好友">＋</button><button class="ui-close" data-ui-close="directory" aria-label="关闭好友列表">×</button></header><label class="search">⌕ <input id="friend-search" placeholder="搜索好友或消息" aria-label="搜索好友"></label><div class="directory-tabs" role="tablist"><button role="tab" data-conversation-tab="messages" aria-selected="true">消息 <span id="friend-unread-count"></span></button><button role="tab" data-conversation-tab="contacts" aria-selected="false">通讯录 <span id="friend-count"></span></button></div><div id="friend-list" role="list" aria-label="好友会话"></div><p class="contacts-footnote">置顶朋友与未读来信，会出现在森林里</p>';
  const menu=document.createElement('section');menu.id='friend-context-menu';menu.className='paper friend-context-menu';menu.hidden=true;menu.setAttribute('role','menu');menu.setAttribute('aria-label','好友选项');root.append(menu);
  const add=document.createElement('dialog');add.id='add-friends-dialog';add.className='paper';add.setAttribute('aria-label','添加好友');root.append(add);
  ui.register('friend-menu',{el:menu,kind:'popover',onClosed(){menuId=null;}});
  ui.register('add-friends',{el:add,kind:'child',modal:true});
  const person=id=>friends.find(f=>f.id===id);
  function rows(ids,{compact=false,active=null}={}){
    const counts=unreadCounts(store.state),pins=new Set(store.state.pinnedFriends||[]);
    return ids.map(id=>{const f=person(id);if(!f)return '';const last=store.state.messages.filter(m=>m.friendId===id).at(-1),n=counts.get(id)||0,draft=store.state.drafts[id],pinned=pins.has(id);
      const preview=draft?`<em>[草稿]</em> ${esc(draft)}`:last?esc(({image:'[图片]',sticker:'[表情]',moment:'[朋友圈]',content:'[分享]'}[last.type])||last.text):esc(f.signature);
      return `<article class="conversation-row ${pinned?'is-pinned':''} ${active===id?'active':''} ${compact?'is-compact':''}" data-friend-row="${id}" role="listitem"><button class="conversation-open" data-action="open-friend" data-id="${id}" aria-label="与${esc(f.name)}聊天${n?'，'+n+'条未读':''}"><span class="conversation-avatar"><img src="assets/rodin-friends/${f.animal}/portrait.webp" alt="">${n?`<b class="conversation-unread">${n>99?'99+':n}</b>`:''}</span><span class="conversation-copy"><span class="conversation-top"><strong>${esc(f.name)}</strong><time>${stamp(last?.createdAt)}</time></span><span class="conversation-preview">${preview}</span></span>${pinned?'<span class="conversation-pin" aria-label="已置顶">⌃</span>':''}</button><button class="conversation-more" data-action="friend-menu" data-id="${id}" aria-label="${esc(f.name)}的更多选项" aria-haspopup="menu">···</button></article>`;
    }).join('')||'<p class="empty-note">还没有会话。<br>从通讯录认识一位朋友吧。</p>';
  }
  function render(){
    const query=directory.querySelector('#friend-search').value.trim().toLowerCase();
    const ids=(tab==='contacts'?[...store.state.friends].sort((a,b)=>person(a).name.localeCompare(person(b).name,'zh-CN')):conversationIds(store.state)).filter(id=>{const f=person(id);return `${f.name} ${id} ${store.state.messages.filter(m=>m.friendId===id).at(-1)?.text||''}`.toLowerCase().includes(query);});
    directory.querySelector('#friend-list').innerHTML=rows(ids);
    directory.querySelector('#friend-count').textContent=store.state.friends.length;
    const n=[...unreadCounts(store.state).values()].reduce((a,b)=>a+b,0);directory.querySelector('#friend-unread-count').textContent=n||'';
    for(const b of directory.querySelectorAll('[role=tab]')){b.classList.toggle('active',b.dataset.conversationTab===tab);b.setAttribute('aria-selected',String(b.dataset.conversationTab===tab));}
  }
  function showMenu(id,source,point){
    menuId=id;const pinned=(store.state.pinnedFriends||[]).includes(id);
    menu.innerHTML=`<small>${esc(person(id)?.name)}</small><button role="menuitem" data-pin-friend="${id}">${pinned?'取消置顶':'置顶聊天'}</button>`;
    const r=source.getBoundingClientRect();menu.style.left=Math.max(12,Math.min(innerWidth-190,point?.x??r.right-170))+'px';menu.style.top=Math.max(12,Math.min(innerHeight-130,point?.y??r.bottom+6))+'px';
    ui.open('friend-menu',{origin:()=>root.querySelector(`[data-action="friend-menu"][data-id="${id}"]`)}).then(()=>menu.querySelector('button')?.focus({preventScroll:true}));
  }
  function showAdd(){
    add.innerHTML='<header class="ui-titlebar"><span>认识森林里的朋友</span><button class="ui-close" data-ui-close="add-friends" aria-label="关闭添加好友">×</button></header><div class="add-friends-list">'+friends.map(f=>{const added=store.state.friends.includes(f.id);return `<article class="add-friend-row"><img src="assets/rodin-friends/${f.animal}/portrait.webp" alt="${esc(f.name)}"><span><strong>${esc(f.name)}</strong><p>${esc(f.signature)}</p><small>@${esc(f.id)}</small></span><button class="${added?'secondary':'primary'}" data-action="${added?'open-friend':'add-friend'}" data-id="${f.id}">${added?'聊天':'添加'}</button></article>`;}).join('')+'</div>';
    ui.open('add-friends',{origin:ui.source()});
  }
  const click=async e=>{
    const t=e.target.closest('[data-conversation-tab]');if(t){tab=t.dataset.conversationTab;render();ui.transition(directory.querySelector('#friend-list'));}
    const b=e.target.closest('[data-action="friend-menu"]');if(b)showMenu(b.dataset.id,b);
    const pin=e.target.closest('[data-pin-friend]');if(pin){try{await store.setFriendPinned(pin.dataset.pinFriend,!(store.state.pinnedFriends||[]).includes(pin.dataset.pinFriend));await ui.close('friend-menu');}catch(error){onError(error);}}
    if(e.target.closest('[data-action="add-directory"]'))showAdd();
  };
  const context=e=>{const row=e.target.closest('[data-friend-row]');if(!row)return;e.preventDefault();showMenu(row.dataset.friendRow,row,{x:e.clientX,y:e.clientY});};
  const cancel=()=>{clearTimeout(longPress);longPress=null;};
  const down=e=>{const row=e.target.closest('[data-friend-row]');if(!row||e.pointerType!=='touch')return;const {clientX:x,clientY:y}=e;cancel();pressStart={x,y};longPress=setTimeout(()=>{suppressedUntil=performance.now()+900;showMenu(row.dataset.friendRow,row,{x,y});},500);};
  const suppress=e=>{if(performance.now()<suppressedUntil&&e.target.closest('[data-friend-row]')){e.preventDefault();e.stopImmediatePropagation();}};
  const move=e=>{if(pressStart&&Math.hypot(e.clientX-pressStart.x,e.clientY-pressStart.y)>8){cancel();pressStart=null;}};
  root.addEventListener('click',suppress,true);root.addEventListener('click',click);root.addEventListener('contextmenu',context);root.addEventListener('pointerdown',down);root.addEventListener('pointerup',cancel);root.addEventListener('pointercancel',cancel);root.addEventListener('pointermove',move);
  return {render,rows,showAdd,get menuFriend(){return menuId;},dispose(){cancel();root.removeEventListener('click',suppress,true);root.removeEventListener('click',click);root.removeEventListener('contextmenu',context);root.removeEventListener('pointerdown',down);root.removeEventListener('pointerup',cancel);root.removeEventListener('pointercancel',cancel);root.removeEventListener('pointermove',move);}};
}
