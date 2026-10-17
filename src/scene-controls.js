/** Two independent hover controls; existing menus and form state stay intact. */
export function createSceneControls({ui,sceneSwitcher,timeMenu,root=document.documentElement}={}){
 const scene=document.getElementById('scene-switcher'),time=document.getElementById('day-night-control'),roam=document.getElementById('free-roam');
 const environment=document.createElement('aside');environment.id='environment-controls';environment.setAttribute('aria-label','昼夜与漫游');
 const content=document.createElement('div');content.id='environment-controls-content';content.append(time,roam);environment.append(content);document.body.append(environment);
 const events=new AbortController(),on=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
 let keyboard=false,blocked=false,disposed=false;
 const groups=[];
 function group({elements,revealId,label,host,key,closeMenu,ball=false}){
  const reveal=document.createElement('button');reveal.id=revealId;reveal.type='button';reveal.className='scene-controls-reveal';
  reveal.setAttribute('aria-label',label);reveal.setAttribute('aria-controls',elements.map(el=>el.id).join(' '));
  reveal.innerHTML=ball?'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M5 17h14M8 4v6m8 4v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>':'<span aria-hidden="true"></span>';
  (host===root?document.body:host).append(reveal);elements.forEach(el=>el.classList.add('scene-controls-item'));
  let timer,near=false,touch=false;
  const inside=el=>el instanceof Node&&(reveal.contains(el)||elements.some(item=>item.contains(el)));
  const pinned=()=>touch||keyboard&&inside(document.activeElement);
  function setExpanded(value){
   if(disposed)return;host.dataset[key]=value?'expanded':'collapsed';
   elements.forEach(el=>{el.inert=!value;});reveal.setAttribute('aria-expanded',String(value));
   if(!value)closeMenu?.();
  }
  function schedule(){clearTimeout(timer);if(!near&&!pinned())timer=setTimeout(()=>{if(!near&&!pinned())setExpanded(false);},300);}
  function show(){if(blocked)return;clearTimeout(timer);setExpanded(true);schedule();}
  on(document,'pointermove',e=>{
   if(e.pointerType==='touch')return;
   const next=inside(e.target);if(next===near)return;near=next;if(near)show();else schedule();
  });
  on(document,'pointerleave',()=>{near=false;schedule();});
  // Element boundary events also fire when the camera temporarily consumes
  // canvas pointermove events while returning from roam.
  for(const el of [reveal,...elements]){
   on(el,'pointerenter',e=>{if(e.pointerType!=='touch'){near=true;show();}});
   on(el,'pointerleave',e=>{if(!inside(e.relatedTarget)){near=false;schedule();}});
  }
  on(document,'pointerdown',e=>{keyboard=false;touch=e.pointerType==='touch'&&inside(e.target);if(touch)show();else schedule();});
  on(document,'focusin',e=>{
   if(!inside(e.target)||!keyboard)return;show();
   if(reveal===e.target)queueMicrotask(()=>{if(!disposed&&document.activeElement===reveal)elements[0].querySelector('button:not(:disabled)')?.focus({preventScroll:true});});
  });
  on(document,'focusout',()=>queueMicrotask(()=>{if(!disposed)schedule();}));
  on(reveal,'click',show);
  setExpanded(false);
  const api={show,block(value){reveal.disabled=value;if(value){near=false;touch=false;clearTimeout(timer);setExpanded(false);}else schedule();},dispose(){clearTimeout(timer);reveal.remove();delete host.dataset[key];elements.forEach(el=>{el.classList.remove('scene-controls-item');el.inert=false;});}};
  groups.push(api);return api;
 }
 on(document,'keydown',e=>{if(['Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))keyboard=true;});
 const sceneGroup=group({elements:[scene],revealId:'scene-controls-reveal',label:'展开场景选择',host:root,key:'sceneControls',closeMenu:()=>sceneSwitcher?.closeMenu()});
 group({elements:[content],revealId:'environment-controls-reveal',label:'展开昼夜与漫游',host:environment,key:'controls',closeMenu:()=>timeMenu?.closeMenu(),ball:true});
 const unsubscribe=ui.subscribe(state=>{blocked=!!state.modal;groups.forEach(item=>item.block(blocked));});
 return{show:sceneGroup.show,dispose(){disposed=true;groups.forEach(item=>item.dispose());events.abort();unsubscribe();document.body.append(time,roam);environment.remove();}};
}
