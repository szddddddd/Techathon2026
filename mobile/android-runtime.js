// Runs before the normal app bundle, only inside the offline Android package.
globalThis.__WEROAM_ANDROID__=true;
document.documentElement.dataset.platform='android';
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
