import {FRIENDS} from './social-store.js';

export function createWebPet({store,onOpenFriend}){
  const root=document.createElement('aside');root.id='web-pet';root.setAttribute('aria-label','溪谷桌宠');
  root.innerHTML=`<button id="pet-toggle" type="button" aria-expanded="false" aria-controls="pet-widget"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 4C9 3 4 8 5 14s10 8 13 0c1-3 0-6 1-10Z"/><path d="m7 18 8-9M10 14l-1-4m3 2 4 1"/></svg><span>桌宠</span><b hidden></b></button>
    <section id="pet-widget" hidden aria-label="森林桌宠小窗"><header id="pet-handle"><div><small>一小片森林，陪着你</small><h2>溪谷桌宠 <span aria-hidden="true">✧</span></h2></div><button type="button" id="pet-hide">收起</button></header><div class="pet-stage"><p id="pet-loading" role="status">正在唤醒小森林…</p></div><footer><p id="pet-summary" aria-live="polite"></p><div id="pet-friends" aria-label="桌宠好友"></div><button type="button" id="pet-native" hidden>放到 Windows 桌面 ↗</button><small>拖动顶部可移动 · 点击朋友聊聊天</small></footer></section>`;
  document.body.append(root);
  const $=id=>root.querySelector('#'+id),toggle=$('pet-toggle'),panel=$('pet-widget'),stage=root.querySelector('.pet-stage');
  let open=false,ready=false,frame=null,drag=null,outside=null,loadTimer,lastPayload='',position=null;
  try{const saved=JSON.parse(localStorage.getItem('forest-web-pet-position'));if(Number.isFinite(saved?.x)&&Number.isFinite(saved?.y))position=saved;}catch{}
  function place(){
    if(!open)return;
    const width=panel.offsetWidth,height=panel.offsetHeight,padding=12;
    const desired=position||{x:innerWidth-width-24,y:innerHeight-height-100};
    const x=Math.max(padding,Math.min(desired.x,innerWidth-width-padding)),y=Math.max(padding,Math.min(desired.y,innerHeight-height-padding));
    panel.style.left=`${x}px`;panel.style.top=`${y}px`;
    if(position)position={x,y};
  }
  function post(message){if(ready)frame.contentWindow.postMessage({channel:'forest-web-pet',...message},location.protocol==='file:'?'*':location.origin);}
  function payload(){const {friends,messages,profile,settings}=store.state;return{state:{friends,messages,profile},settings:{reminders:settings.petReminders!==false}};}
  function sync(){
    const data=payload(),unread=data.state.messages.filter(m=>m.senderId!=='me'&&!m.read&&data.state.friends.includes(m.friendId));
    const badge=toggle.querySelector('b');badge.hidden=!unread.length;badge.textContent=unread.length>99?'99+':unread.length;toggle.setAttribute('aria-label',`桌宠${unread.length?`，${unread.length}条未读消息`:''}`);
    $('pet-summary').textContent=unread.length?`${unread.length} 封来信，等你打开`:data.state.friends.length?'朋友们都在溪谷里，随时可以聊聊':'先认识一位朋友，让森林热闹起来';
    const buttons=data.state.friends.map(id=>{const friend=FRIENDS.find(f=>f.id===id);if(!friend)return '';const count=unread.filter(m=>m.friendId===id).length;return `<button type="button" data-pet-friend="${friend.id}" aria-label="和${friend.name}聊天${count?`，${count}条未读`:''}"><span>${friend.emoji}</span>${friend.name}${count?`<b>${count}</b>`:''}</button>`;}).join('');
    if($('pet-friends').innerHTML!==buttons)$('pet-friends').innerHTML=buttons;
    const signature=JSON.stringify(data);if(open&&ready&&signature!==lastPayload){lastPayload=signature;post({type:'state',payload:data});}
    if(open)place();
  }
  function load(){
    if(frame)return;
    frame=document.createElement('iframe');frame.title='可交互的三维森林桌宠';frame.src='pet.html?embedded=1';stage.append(frame);
    loadTimer=setTimeout(()=>{if(!ready){$('pet-loading').textContent='小森林没有唤醒，点击重试';$('pet-loading').dataset.retry='true';}},15000);
  }
  function setOpen(value){
    open=!!value;panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));root.classList.toggle('is-open',open);
    if(open){place();load();lastPayload='';sync();}post({type:'active',value:open&&!document.hidden});
  }
  function receive(event){
    const sameOrigin=location.protocol==='file:'?['null','file://'].includes(event.origin):event.origin===location.origin;
    if(event.source!==frame?.contentWindow||!sameOrigin||event.data?.channel!=='forest-web-pet')return;
    if(event.data.type==='ready'){ready=true;clearTimeout(loadTimer);$('pet-loading').hidden=true;lastPayload='';sync();post({type:'active',value:open&&!document.hidden});}
    if(event.data.type==='open-friend'&&store.state.friends.includes(event.data.id)){setOpen(false);onOpenFriend(event.data.id);}
    if(event.data.type==='dismiss'){setOpen(false);toggle.focus();}
  }
  toggle.addEventListener('click',()=>setOpen(!open));$('pet-hide').addEventListener('click',()=>{setOpen(false);toggle.focus();});
  $('pet-friends').addEventListener('click',e=>{const id=e.target.closest('[data-pet-friend]')?.dataset.petFriend;if(id){setOpen(false);onOpenFriend(id);}});
  $('pet-loading').addEventListener('click',()=>{if(!ready&&frame){frame.remove();frame=null;clearTimeout(loadTimer);$('pet-loading').textContent='正在唤醒小森林…';delete $('pet-loading').dataset.retry;load();}});
  if(window.desktopMain?.showPet){$('pet-native').hidden=false;$('pet-native').addEventListener('click',()=>window.desktopMain.showPet());}
  $('pet-handle').addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button'))return;const r=panel.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top};$('pet-handle').setPointerCapture(e.pointerId);e.preventDefault();});
  $('pet-handle').addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;position={x:drag.left+e.clientX-drag.x,y:drag.top+e.clientY-drag.y};place();});
  const endDrag=()=>{if(!drag)return;drag=null;try{localStorage.setItem('forest-web-pet-position',JSON.stringify(position));}catch{}};
  $('pet-handle').addEventListener('pointerup',endDrag);$('pet-handle').addEventListener('pointercancel',endDrag);$('pet-handle').addEventListener('lostpointercapture',endDrag);
  // A scene drag is not an outside click; it can continue with the pet visible.
  const outsideDown=e=>{outside={x:e.clientX,y:e.clientY};};
  const outsideClick=e=>{if(open&&outside&&!root.contains(e.target)&&Math.hypot(e.clientX-outside.x,e.clientY-outside.y)<6)setOpen(false);};
  const escape=e=>{if(e.key==='Escape'&&open&&!document.querySelector('dialog[open]')){setOpen(false);e.preventDefault();e.stopImmediatePropagation();toggle.focus();}};
  const visibility=()=>post({type:'active',value:open&&!document.hidden});
  document.addEventListener('pointerdown',outsideDown);document.addEventListener('click',outsideClick);window.addEventListener('message',receive);window.addEventListener('resize',place);window.addEventListener('keydown',escape,true);document.addEventListener('visibilitychange',visibility);
  const unsubscribe=store.subscribe(sync);sync();
  return{setOpen,get isOpen(){return open;},dispose(){unsubscribe();clearTimeout(loadTimer);root.remove();document.removeEventListener('pointerdown',outsideDown);document.removeEventListener('click',outsideClick);window.removeEventListener('message',receive);window.removeEventListener('resize',place);window.removeEventListener('keydown',escape,true);document.removeEventListener('visibilitychange',visibility);}};
}
