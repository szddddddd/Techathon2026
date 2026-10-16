import {petPayload} from './pet-state.js';
export function createWebPet({store,ui,onOpenFriend,getSceneId=()=> 'forest',bridgeOrigin='http://127.0.0.1:47831',launchProtocol=()=>{location.href='forestletters://pet';},onNotice=()=>{}}){

  const root=document.createElement('aside');root.id='web-pet';root.setAttribute('aria-label','Windows 桌宠');
  root.innerHTML=`<button id="pet-toggle" type="button" role="switch" aria-checked="false" title="打开桌宠"><span>♧ 桌宠</span><i class="pet-switch" aria-hidden="true"></i></button><p id="pet-launch-status" role="status" hidden></p>`;
  // Keep a single live control mounted inside Settings; never expose a scene shortcut.
  root.hidden=true;document.body.append(root);
  const toggle=root.querySelector('#pet-toggle'),notice=root.querySelector('#pet-launch-status');
  let client;try{client=sessionStorage.getItem('forest-desktop-client');if(!client){client=crypto.randomUUID();sessionStorage.setItem('forest-desktop-client',client);}}catch{client=crypto.randomUUID();}
  let online=false,visible=false,instance=null,lastSignature='',launching=false,disposed=false,noticeTimer,syncTimer,polling=false,lastOpen=0;
  async function request(route,data,timeout=800){
    const response=await fetch(bridgeOrigin+'/api/'+route,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json'}:undefined,body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(timeout)});
    if(!response.ok)throw new Error('桌宠连接暂不可用');return response.json();
  }
  function say(text){notice.textContent=text;notice.hidden=false;ui?.transition(notice);clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{notice.hidden=true;},6500);}
  function payload(){return {client,...petPayload(store.state,getSceneId())};}
  function badge(){toggle.setAttribute('aria-checked',String(visible));toggle.title=visible?'关闭桌宠':'打开桌宠';toggle.setAttribute('aria-label',`桌宠${visible?'已打开':'已关闭'}`);}
  let visibilityRevision=0,visibilityStream=null;
  function receiveVisibility(value){
    if(disposed||typeof value!=='boolean')return;
    visibilityRevision++;visible=value;badge();
  }
  const offVisibility=window.desktopMain?.onPetVisible?.(receiveVisibility);
  function subscribeVisibility(){
    if(disposed||window.desktopMain||visibilityStream)return;
    visibilityStream=new EventSource(bridgeOrigin+'/api/visibility');
    visibilityStream.onmessage=event=>{try{receiveVisibility(JSON.parse(event.data).visible);}catch{}};
  }
  async function sync(){
    if(disposed||!online||window.desktopMain)return;
    const data=payload(),signature=JSON.stringify(data);if(lastSignature===signature)return;
    try{await request('state',data);lastSignature=signature;}catch{online=false;lastSignature='';}
  }
  async function setVisible(value){
    if(window.desktopMain?.setPetVisible)visible=await window.desktopMain.setPetVisible(value);
    else{await request(value?'show':'hide',{});visible=!!(await request('status')).visible;}
    if(!disposed)badge();
  }
  async function poll(){
    if(disposed||polling||launching)return;
    polling=true;const revision=visibilityRevision;
    try{
      if(window.desktopMain?.getPetVisible){const value=await window.desktopMain.getPetVisible();online=true;if(revision===visibilityRevision)visible=value;}
      else{
        const status=await request('status?client='+encodeURIComponent(client));online=true;if(revision===visibilityRevision)visible=!!status.visible;subscribeVisibility();
        if(instance!==status.instance){instance=status.instance;lastSignature='';lastOpen=0;}
        await sync();
        if(status.open&&status.open.sequence>lastOpen){lastOpen=status.open.sequence;window.focus();if(store.state.friends.includes(status.open.friendId))await onOpenFriend(status.open.friendId);await request('ack',{client,sequence:lastOpen});}
      }
    }catch{online=false;visible=false;lastSignature='';}finally{polling=false;if(!disposed)badge();}
  }
  async function launch(){
    if(launching||disposed)return;launching=true;toggle.disabled=true;
    try{
      if(window.desktopMain?.setPetVisible){await setVisible(true);return;}
      try{await request('status',undefined,350);online=true;await sync();await setVisible(true);return;}catch{}
      say('正在唤出 Windows 桌宠，请确认浏览器的「打开应用」提示');launchProtocol();
      let connected=false;
      for(let i=0;i<18&&!disposed;i++){
        await new Promise(resolve=>setTimeout(resolve,750));if(disposed)break;
        try{await request('status');online=true;await sync();await setVisible(true);connected=true;break;}catch{}
      }
      if(connected)say('桌宠已打开');else if(!disposed)say('尚未连接到桌宠。首次使用请运行项目中的 npm run desktop:install，然后再点击桌宠。');
    }catch(error){say('桌宠未能打开，请重试。');onNotice(error.message);}finally{launching=false;if(!disposed){toggle.disabled=false;badge();}}
  }
  async function change(){
    if(launching||polling)return;
    launching=true;toggle.disabled=true;
    // Read native visibility at click time so tray changes cannot invert the action.
    try{visible=window.desktopMain?.getPetVisible?await window.desktopMain.getPetVisible():!!(await request('status')).visible;}catch{visible=false;}
    if(disposed)return;
    if(!visible){launching=false;return launch();}
    try{await setVisible(false);}catch(error){say('桌宠未能关闭，请重试。');onNotice(error.message);}finally{launching=false;if(!disposed){toggle.disabled=false;badge();}}
  }
  toggle.addEventListener('click',change);
  const unsubscribe=store.subscribe(()=>{badge();clearTimeout(syncTimer);syncTimer=setTimeout(sync,100);});
  badge();poll();const interval=setInterval(poll,1500);
  return{launch,sync,mount(container){container.append(root);root.hidden=false;},get connected(){return online;},dispose(){disposed=true;offVisibility?.();visibilityStream?.close();unsubscribe();clearInterval(interval);clearTimeout(noticeTimer);clearTimeout(syncTimer);root.remove();}};
}
