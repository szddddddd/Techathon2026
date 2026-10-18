// Runs before the normal app bundle, only inside the offline Android package.
globalThis.__WEROAM_ANDROID__=true;
document.documentElement.dataset.platform='android';
// Native transport owns the direct HTTPS generation pipeline and local assets.
const avatarRequests=new Map();let avatarSequence=0;
globalThis.__androidAvatarResult=(id,result)=>{const pending=avatarRequests.get(id);if(!pending)return;clearTimeout(pending.timer);avatarRequests.delete(id);pending.resolve(result);};
if(globalThis.AndroidAvatar)globalThis.androidAvatarRequest=(route,body)=>new Promise((resolve,reject)=>{
 const id=String(++avatarSequence),timer=setTimeout(()=>{avatarRequests.delete(id);reject(Error('生成服务连接超时，请检查手机网络。'));},300000);
 avatarRequests.set(id,{resolve,timer});AndroidAvatar.request(id,route,body===undefined?'':JSON.stringify(body));
});
globalThis.__weroamHandleBack=()=>{
  const ui=globalThis.__uiInteractions,main=ui?.activeMain;
  if(ui?.back()){
    if(main==='inbox-thread'&&['closing','closed'].includes(ui.state(main)))void ui.open('directory');
    return true;
  }
  const expanded=document.querySelector('#environment-controls[data-controls="expanded"],html[data-scene-controls="expanded"],#social[data-dock="expanded"]');
  if(expanded){document.getElementById('viewport')?.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));return true;}
  if(globalThis.__freeRoam?.busy){globalThis.__freeRoam.exit();return true;}
  return false;
};
