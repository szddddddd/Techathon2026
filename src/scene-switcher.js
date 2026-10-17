import {SCENE_THEMES} from './scene-theme.js';
const SCENES = [
  {id:'forest',name:'林间来信',art:'<rect width="240" height="118" fill="#dce8d4"/><circle cx="188" cy="24" r="15" fill="#f7e9ad"/><path d="M0 79 42 38 72 65 125 17 167 61 201 47 240 77V118H0Z" fill="#a4b69b"/><path d="m104 50 31 1-3 23 30 16-15 28H82l39-29-23-17Z" fill="#a8d3cb"/><path d="M0 95q42-22 87 4l-5 19H0m151-16q38-25 89-14v30h-93" fill="#91ad76"/><g fill="#557f63"><path d="m32 50-17 30h9l-15 21h46L40 80h9Z"/><path d="m203 55-16 27h8l-13 20h42l-13-20h8Z"/></g><path d="M56 97V79h23v18Z" fill="#e9d5ae"/><path d="m51 80 17-14 17 14Z" fill="#93795c"/><path d="M165 105V88h18v17Z" fill="#e7d8b8"/><path d="m160 89 14-11 15 11Z" fill="#718c78"/>'},
  {id:'fuji',name:'富士樱町',art:'<rect width="240" height="118" fill="#e5ebef"/><circle cx="189" cy="25" r="14" fill="#f5dbbc"/><path d="m54 104 58-83h21l62 83Z" fill="#9caeb6"/><path d="m93 49 19-28h21l20 28-13-5-9 8-10-9-10 8-8-6Z" fill="#fffdf3"/><path d="M0 90q58-11 108 5t132-3v26H0Z" fill="#bbbf98"/><path d="M0 108H240M0 113H240" stroke="#95816e" stroke-width="2"/><g stroke="#95816e" stroke-width="2"><path d="m12 106 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10"/></g><path d="M33 97V57m171 40V56" stroke="#927c6b" stroke-width="4"/><g fill="#edb5bf"><circle cx="24" cy="59" r="17"/><circle cx="43" cy="57" r="18"/><circle cx="34" cy="42" r="15"/><circle cx="194" cy="56" r="17"/><circle cx="215" cy="57" r="17"/><circle cx="205" cy="41" r="16"/></g><path d="M64 104V86h26v18m66 0V84h25v20" fill="#eddec5"/><path d="m59 87 18-12 18 12m56 1 18-13 17 13" fill="#657375"/><path d="M108 104V93h21v-8h10v19Zm33-10h20v10h-20Z" fill="#546a65"/><g fill="#fff9ed" opacity=".8"><circle cx="131" cy="78" r="5"/><circle cx="138" cy="69" r="7"/></g>'},
];

SCENES.push({id:'ideal',name:SCENE_THEMES.ideal.name});
const ICONS={
 forest:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 3-5 7h3l-4 6h12l-4-6h3L9 3Z" fill="currentColor" opacity=".8"/><path d="M9 16v5m8-15 4 6h-2l3 5h-7m3 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 fuji:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m2 20 8-15h4l8 15H2Z" fill="currentColor" opacity=".75"/><path d="m8 9 2-4h4l2 4-2-1-2 2-2-2-2 1Z" fill="#fff9f7"/><circle cx="19" cy="5" r="2.5" fill="#c8779d"/></svg>'
};
ICONS.ideal='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 20V8l2-6h3l2 6v12" fill="currentColor" opacity=".75"/><path d="M3 18c0-2 4-3 9-3s9 1 9 3-4 3-9 3-9-1-9-3Zm3-4v-4m12 4v-4M12 7v9" stroke="currentColor" stroke-width="1.5"/></svg>';
export const sceneIcon=id=>ICONS[id]||ICONS.forest;

/** Direct scene selection with hover, click and keyboard access. */
export function createSceneSwitcher({current='forest',onSwitch,ui,reduced=false}={}){
 const root=document.createElement('nav');root.id='scene-switcher';root.setAttribute('aria-label','场景切换');root.dataset.expanded='true';
 root.innerHTML='<div class="scene-switcher-track"><button class="scene-switcher-option" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="scene-theme-menu"><span class="scene-switcher-caption"></span></button></div><div id="scene-theme-menu" role="menu" aria-label="选择主题" hidden>'+SCENES.map(s=>'<button type="button" role="menuitemradio" data-scene="'+s.id+'"><span class="scene-switcher-icon">'+sceneIcon(s.id)+'</span>'+s.name+'</button>').join('')+'</div><span class="scene-switcher-announcement" role="status"></span>';
 document.body.append(root);const button=root.querySelector('.scene-switcher-option'),menu=root.querySelector('[role=menu]'),items=[...menu.querySelectorAll('button')],status=root.querySelector('[role=status]'),events=new AbortController();let scene=current,busy=false,blocked=false,disposed=false,timer;
 const listen=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
 function open(value){clearTimeout(timer);menu.hidden=!value||busy||blocked;button.setAttribute('aria-expanded',String(!menu.hidden));}
 function render(){root.dataset.shown=scene;root.dataset.current=scene;root.dataset.busy=String(busy);button.disabled=busy||blocked;button.querySelector('span').innerHTML='<span class="scene-switcher-icon">'+sceneIcon(scene)+'</span><span>'+SCENE_THEMES[scene].name+'</span><small aria-hidden="true">⌄</small>';button.setAttribute('aria-label',SCENE_THEMES[scene].name+'，选择主题');for(const item of items){item.setAttribute('aria-checked',String(item.dataset.scene===scene));item.disabled=busy||blocked;}if(busy||blocked)open(false);}
 function setCurrent(id){if(SCENE_THEMES[id]&&!disposed){scene=id;render();}}
 function setBusy(value){busy=!!value;render();}
 async function choose(id){if(busy||blocked||disposed)return;open(false);if(id===scene)return;setBusy(true);status.textContent='正在前往'+SCENE_THEMES[id].name;try{if(await onSwitch?.(id)!==false)setCurrent(id);status.textContent='当前场景：'+SCENE_THEMES[scene].name;}catch{status.textContent='切换失败，请重试。';}finally{if(!disposed){setBusy(false);button.focus({preventScroll:true});}}}
 listen(root,'pointerenter',e=>{if(e.pointerType!=='touch')open(true);});listen(root,'pointerleave',()=>{timer=setTimeout(()=>open(false),180);});
 listen(button,'click',()=>open(true));for(const item of items)listen(item,'click',()=>choose(item.dataset.scene));
 listen(document,'pointerdown',e=>{if(!root.contains(e.target))open(false);});listen(root,'focusout',e=>{if(!root.contains(e.relatedTarget))open(false);});
 listen(root,'keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();open(false);button.focus();return;}if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key)||busy||blocked)return;e.preventDefault();e.stopPropagation();open(true);const i=items.indexOf(document.activeElement),n=e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowUp'?-1:1)+items.length)%items.length;items[n].focus();});
 const unsubscribe=ui?.subscribe(state=>{blocked=!!state.modal;render();});render();
 return{setCurrent,setBusy,dispose(){disposed=true;clearTimeout(timer);unsubscribe?.();events.abort();root.remove();}};
}
