const SCENES = [
  {id:'forest',name:'林间来信',art:'<rect width="240" height="118" fill="#dce8d4"/><circle cx="188" cy="24" r="15" fill="#f7e9ad"/><path d="M0 79 42 38 72 65 125 17 167 61 201 47 240 77V118H0Z" fill="#a4b69b"/><path d="m104 50 31 1-3 23 30 16-15 28H82l39-29-23-17Z" fill="#a8d3cb"/><path d="M0 95q42-22 87 4l-5 19H0m151-16q38-25 89-14v30h-93" fill="#91ad76"/><g fill="#557f63"><path d="m32 50-17 30h9l-15 21h46L40 80h9Z"/><path d="m203 55-16 27h8l-13 20h42l-13-20h8Z"/></g><path d="M56 97V79h23v18Z" fill="#e9d5ae"/><path d="m51 80 17-14 17 14Z" fill="#93795c"/><path d="M165 105V88h18v17Z" fill="#e7d8b8"/><path d="m160 89 14-11 15 11Z" fill="#718c78"/>'},
  {id:'fuji',name:'富士樱町',art:'<rect width="240" height="118" fill="#e5ebef"/><circle cx="189" cy="25" r="14" fill="#f5dbbc"/><path d="m54 104 58-83h21l62 83Z" fill="#9caeb6"/><path d="m93 49 19-28h21l20 28-13-5-9 8-10-9-10 8-8-6Z" fill="#fffdf3"/><path d="M0 90q58-11 108 5t132-3v26H0Z" fill="#bbbf98"/><path d="M0 108H240M0 113H240" stroke="#95816e" stroke-width="2"/><g stroke="#95816e" stroke-width="2"><path d="m12 106 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10"/></g><path d="M33 97V57m171 40V56" stroke="#927c6b" stroke-width="4"/><g fill="#edb5bf"><circle cx="24" cy="59" r="17"/><circle cx="43" cy="57" r="18"/><circle cx="34" cy="42" r="15"/><circle cx="194" cy="56" r="17"/><circle cx="215" cy="57" r="17"/><circle cx="205" cy="41" r="16"/></g><path d="M64 104V86h26v18m66 0V84h25v20" fill="#eddec5"/><path d="m59 87 18-12 18 12m56 1 18-13 17 13" fill="#657375"/><path d="M108 104V93h21v-8h10v19Zm33-10h20v10h-20Z" fill="#546a65"/><g fill="#fff9ed" opacity=".8"><circle cx="131" cy="78" r="5"/><circle cx="138" cy="69" r="7"/></g>'},
];

const ICONS={
 forest:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 3-5 7h3l-4 6h12l-4-6h3L9 3Z" fill="currentColor" opacity=".8"/><path d="M9 16v5m8-15 4 6h-2l3 5h-7m3 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 fuji:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m2 20 8-15h4l8 15H2Z" fill="currentColor" opacity=".75"/><path d="m8 9 2-4h4l2 4-2-1-2 2-2-2-2 1Z" fill="#fff9f7"/><circle cx="19" cy="5" r="2.5" fill="#c8779d"/></svg>'
};
export const sceneIcon=id=>ICONS[id]||ICONS.forest;

/** One glass button; activating it slides its caption to the next scene. */
export function createSceneSwitcher({current='forest',onSwitch,ui,reduced=false}={}){
 const root=document.createElement('nav');root.id='scene-switcher';root.setAttribute('aria-label','场景切换');
 root.innerHTML=`<div class="scene-switcher-track"><div class="scene-switcher-scenery" aria-hidden="true">${SCENES.map(s=>`<svg class="scene-switcher-atmosphere scene-switcher-atmosphere-${s.id}" viewBox="0 0 240 118" preserveAspectRatio="xMidYMid slice">${s.art}</svg>`).join('')}</div><button class="scene-switcher-option" type="button" title="点击切换场景"><span class="scene-switcher-caption"><span class="scene-switcher-icon" aria-hidden="true"></span><span class="scene-switcher-name"></span></span></button></div><span class="scene-switcher-announcement" role="status" aria-live="polite" aria-atomic="true"></span>`;
 document.body.append(root);
 const track=root.querySelector('.scene-switcher-track'),button=root.querySelector('button'),caption=root.querySelector('.scene-switcher-caption'),name=root.querySelector('.scene-switcher-name'),icon=root.querySelector('.scene-switcher-icon'),status=root.querySelector('[role=status]'),events=new AbortController();
 let scene=SCENES.some(s=>s.id===current)?current:'forest',pending=null,busy=false,blocked=false,disposed=false,errorTimer,displayTarget=null,motion=null,motionVersion=0,press=null,expanded=true,near=false,keyboardFocus=false,foldTimer,bounds,lastInput='keyboard';
 const index=id=>SCENES.findIndex(s=>s.id===id);
 const listen=(el,event,fn,options={})=>el.addEventListener(event,fn,{...options,signal:events.signal});
 const reducedMotion=()=>typeof reduced==='boolean'?reduced:!!reduced?.matches;
 function measure(){bounds=root.getBoundingClientRect();}
 function label(){const shown=SCENES.find(s=>s.id===(pending||scene)),next=SCENES[1-index(shown.id)];button.setAttribute('aria-label',expanded?`${shown.name}，点击切换到${next.name}`:`${shown.name}，展开场景切换`);button.title=expanded?'点击切换场景':'展开场景切换';}
 function expand(value){if(disposed)return;expanded=value;root.dataset.expanded=String(value);label();if(reducedMotion())measure();}
 function scheduleFold(delay=900){clearTimeout(foldTimer);if(!busy&&!near&&!keyboardFocus)foldTimer=setTimeout(()=>{if(!busy&&!near&&!keyboardFocus)expand(false);},delay);}
 function wake(){clearTimeout(foldTimer);expand(true);}
 listen(window,'pointermove',e=>{if(e.pointerType==='touch'||e.buttons||!bounds)return;const next=e.clientX>=bounds.left-28&&e.clientX<=bounds.right+28&&e.clientY>=bounds.top-24&&e.clientY<=bounds.bottom+28;if(next===near)return;near=next;if(near)wake();else scheduleFold();},{passive:true});
 listen(window,'pointerdown',()=>{lastInput='pointer';keyboardFocus=false;},{capture:true,passive:true});
 listen(window,'keydown',e=>{if(e.key==='Tab')lastInput='keyboard';});
 listen(root,'focusin',()=>{if(lastInput==='keyboard'){keyboardFocus=true;wake();}});
 listen(root,'focusout',e=>{if(!root.contains(e.relatedTarget)){keyboardFocus=false;scheduleFold();}});
 listen(root,'transitionend',e=>{if(e.target===root&&e.propertyName==='width')measure();});
 listen(window,'resize',()=>{near=false;measure();scheduleFold();});
 listen(root,'pointerenter',e=>{if(e.pointerType!=='touch'&&!e.buttons){near=true;wake();}});
 listen(window,'pointerout',e=>{if(!e.relatedTarget&&e.pointerType!=='touch'){near=false;scheduleFold();}});
 function paint(id){name.textContent=SCENES.find(s=>s.id===id).name;icon.innerHTML=sceneIcon(id);}
 async function show(id){
  if(displayTarget===id)return;
  const prior=displayTarget,version=++motionVersion;displayTarget=id;root.dataset.shown=id;motion?.cancel();
  if(!prior){paint(id);return;}
  const distance=reducedMotion()?0:(index(id)>index(prior)?-28:28);
  try{
   motion=caption.animate([{transform:'translateX(0)',opacity:1},{transform:`translateX(${distance}px)`,opacity:0}],{duration:reducedMotion()?60:120,easing:'ease-in',fill:'forwards'});await motion.finished;
   if(disposed||version!==motionVersion)return;
   paint(id);motion.cancel();
   motion=caption.animate([{transform:`translateX(${-distance}px)`,opacity:0},{transform:'translateX(0)',opacity:1}],{duration:reducedMotion()?60:200,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});await motion.finished;
   if(version===motionVersion){motion.cancel();motion=null;}
  }catch{/* Replaced by a newer scene, reduced-motion change, or disposal. */}
 }
 function render(){
  root.dataset.current=scene;root.dataset.busy=String(busy);root.dataset.disabled=String(blocked);track.setAttribute('aria-busy',String(busy));
  const shown=SCENES.find(s=>s.id===(pending||scene));void show(shown.id);button.dataset.scene=shown.id;label();button.disabled=busy||blocked;
 }
 function setCurrent(id){if(!SCENES.some(s=>s.id===id)||disposed)return;scene=id;if(!busy)pending=null;render();}
 function setBusy(value,target){
  if(disposed)return;busy=!!value;if(busy&&SCENES.some(s=>s.id===target))pending=target;if(!busy)pending=null;if(busy)wake();else scheduleFold();
  render();status.textContent=busy?`正在前往${SCENES.find(s=>s.id===(pending||scene)).name}`:`当前场景：${SCENES.find(s=>s.id===scene).name}`;
 }
 async function choose(id){
  if(disposed||busy||blocked||id===scene)return;
  const restoreFocus=root.contains(document.activeElement);clearTimeout(errorTimer);delete root.dataset.error;setBusy(true,id);
  try{const result=await onSwitch?.(id);if(disposed)return;if(result!==false)setCurrent(id);}
  catch{if(disposed)return;root.dataset.error=id;status.textContent='场景切换失败，保留原场景。可再次点击重试。';errorTimer=setTimeout(()=>{delete root.dataset.error;},2000);}
  finally{if(!disposed){const failed=!!root.dataset.error,message=status.textContent;setBusy(false);if(failed)status.textContent=message;if(restoreFocus)button.focus({preventScroll:true});}}
 }
 listen(button,'pointerdown',e=>{e.stopPropagation();press={x:e.clientX,y:e.clientY,moved:false,collapsed:!expanded};});
 listen(button,'pointermove',e=>{e.stopPropagation();if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>6)press.moved=true;});
 listen(button,'pointerup',e=>e.stopPropagation());
 listen(button,'pointercancel',()=>{press={moved:true};});
 listen(button,'click',e=>{e.stopPropagation();const moved=press?.moved,collapsed=press?.collapsed;press=null;if(e.detail>0&&moved)return;if(collapsed||!expanded){wake();scheduleFold(2500);return;}void choose(SCENES[1-index(scene)].id);});
 listen(root,'keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();if(busy||blocked)return;keyboardFocus=true;lastInput='keyboard';wake();void choose(SCENES[['ArrowLeft','Home'].includes(e.key)?0:1].id);
 });
 listen(window,'blur',()=>{press={moved:true};near=false;keyboardFocus=false;scheduleFold();});
 const unsubscribe=ui?.subscribe(state=>{blocked=!!state.modal;render();});
 function syncMotion(){root.dataset.reduced=String(reducedMotion());if(motion&&reducedMotion()){motionVersion++;motion.cancel();motion=null;paint(displayTarget);}}
 if(typeof reduced!=='boolean'&&reduced?.addEventListener)listen(reduced,'change',syncMotion);
 syncMotion();expand(true);render();measure();scheduleFold(1500);
 return{setCurrent,setBusy,dispose(){if(disposed)return;disposed=true;motionVersion++;motion?.cancel();clearTimeout(errorTimer);clearTimeout(foldTimer);unsubscribe?.();events.abort();root.remove();}};
}
