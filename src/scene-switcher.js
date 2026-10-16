const SCENES = [
  {id:'forest',name:'林间来信',detail:'山涧 · 森林 · 花园街区',icon:'<path d="m12 3-6 8h3l-4 6h6v4h2v-4h6l-4-6h3Z"/>',art:'<rect width="240" height="118" fill="#dce8d4"/><circle cx="188" cy="24" r="15" fill="#f7e9ad"/><path d="M0 79 42 38 72 65 125 17 167 61 201 47 240 77V118H0Z" fill="#a4b69b"/><path d="m104 50 31 1-3 23 30 16-15 28H82l39-29-23-17Z" fill="#a8d3cb"/><path d="M0 95q42-22 87 4l-5 19H0m151-16q38-25 89-14v30h-93" fill="#91ad76"/><g fill="#557f63"><path d="m32 50-17 30h9l-15 21h46L40 80h9Z"/><path d="m203 55-16 27h8l-13 20h42l-13-20h8Z"/></g><path d="M56 97V79h23v18Z" fill="#e9d5ae"/><path d="m51 80 17-14 17 14Z" fill="#93795c"/><path d="M165 105V88h18v17Z" fill="#e7d8b8"/><path d="m160 89 14-11 15 11Z" fill="#718c78"/>'},
  {id:'fuji',name:'富士樱町',detail:'富士山 · 樱花 · 蒸汽列车',icon:'<path d="m2 20 8-15h4l8 15H2Z"/><path d="m7 11 3 2 2-3 2 3 3-2"/>',art:'<rect width="240" height="118" fill="#e5ebef"/><circle cx="189" cy="25" r="14" fill="#f5dbbc"/><path d="m54 104 58-83h21l62 83Z" fill="#9caeb6"/><path d="m93 49 19-28h21l20 28-13-5-9 8-10-9-10 8-8-6Z" fill="#fffdf3"/><path d="M0 90q58-11 108 5t132-3v26H0Z" fill="#bbbf98"/><path d="M0 108H240M0 113H240" stroke="#95816e" stroke-width="2"/><g stroke="#95816e" stroke-width="2"><path d="m12 106 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10m18-10 3 10"/></g><path d="M33 97V57m171 40V56" stroke="#927c6b" stroke-width="4"/><g fill="#edb5bf"><circle cx="24" cy="59" r="17"/><circle cx="43" cy="57" r="18"/><circle cx="34" cy="42" r="15"/><circle cx="194" cy="56" r="17"/><circle cx="215" cy="57" r="17"/><circle cx="205" cy="41" r="16"/></g><path d="M64 104V86h26v18m66 0V84h25v20" fill="#eddec5"/><path d="m59 87 18-12 18 12m56 1 18-13 17 13" fill="#657375"/><path d="M108 104V93h21v-8h10v19Zm33-10h20v10h-20Z" fill="#546a65"/><g fill="#fff9ed" opacity=".8"><circle cx="131" cy="78" r="5"/><circle cx="138" cy="69" r="7"/></g>'},
];

/** A small, source-anchored scene chooser. Scene persistence belongs to its caller. */
export function createSceneSwitcher({current='forest',onSwitch,ui,reduced=false}={}) {
  const root=document.createElement('nav');
  root.id='scene-switcher';root.setAttribute('aria-label','切换场景');
  root.innerHTML=`<button class="scene-switcher-toggle" type="button" aria-expanded="false" aria-controls="scene-switcher-panel" aria-haspopup="dialog"><svg class="scene-switcher-icon" viewBox="0 0 24 24" aria-hidden="true"></svg><span class="scene-switcher-name"></span><svg class="scene-switcher-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button><section id="scene-switcher-panel" class="scene-switcher-panel" aria-label="选择一处风景" hidden><header><span>换一处风景</span><small>让生活，换个背景</small></header><div class="scene-switcher-options">${SCENES.map(s=>`<button class="scene-switcher-card" data-scene="${s.id}" type="button" aria-pressed="false"><svg class="scene-switcher-preview" viewBox="0 0 240 118" aria-hidden="true">${s.art}</svg><span class="scene-switcher-card-body"><strong>${s.name}</strong><small>${s.detail}</small><span class="scene-switcher-selected" aria-hidden="true">✓</span></span></button>`).join('')}</div><p class="scene-switcher-status" role="status" aria-live="polite" hidden></p></section>`;
  document.body.append(root);
  const toggle=root.querySelector('.scene-switcher-toggle'),panel=root.querySelector('.scene-switcher-panel'),status=root.querySelector('.scene-switcher-status');
  const choices=[...root.querySelectorAll('[data-scene]')],events=new AbortController();
  let scene=SCENES.some(s=>s.id===current)?current:'forest',busy=false,disposed=false,hovered=false,timer,expanded=false,suppressFocus=false;
  const reducedMotion=()=>typeof reduced==='boolean'?reduced:!!reduced?.matches;
  const listen=(el,event,fn,options={})=>el.addEventListener(event,fn,{...options,signal:events.signal});
  function render() {
    const selected=SCENES.find(s=>s.id===scene);
    toggle.querySelector('.scene-switcher-icon').innerHTML=selected.icon;
    toggle.querySelector('.scene-switcher-name').textContent=selected.name;
    toggle.setAttribute('aria-label',`当前场景：${selected.name}，切换场景`);
    for(const b of choices){b.setAttribute('aria-pressed',String(b.dataset.scene===scene));b.disabled=busy;}
    root.dataset.busy=String(busy);panel.setAttribute('aria-busy',String(busy));
  }
  function schedule() {
    clearTimeout(timer);
    if(!hovered&&!root.contains(document.activeElement)&&!busy)timer=setTimeout(()=>close(false),2500);
  }
  function syncClosed(){expanded=false;toggle.setAttribute('aria-expanded','false');root.dataset.expanded='false';clearTimeout(timer);}
  function close(restore=false) {
    if(!expanded)return;
    syncClosed();suppressFocus=true;
    if(ui)Promise.resolve(ui.close('scene-switcher',{restoreFocus:restore})).finally(()=>{suppressFocus=false;});
    else {panel.hidden=true;panel.inert=false;if(restore)toggle.focus({preventScroll:true});suppressFocus=false;}
  }
  function open({keyboard=false}={}) {
    if(disposed||root.inert)return;
    clearTimeout(timer);
    if(!expanded){expanded=true;root.dataset.expanded='true';toggle.setAttribute('aria-expanded','true');
      if(ui)ui.open('scene-switcher',{origin:toggle,focus:false,animate:!reducedMotion()});else panel.hidden=false;
    }
    if(keyboard)choices.find(b=>b.dataset.scene===scene)?.focus({preventScroll:true});
    schedule();
  }
  if(ui)ui.register('scene-switcher',{el:panel,kind:'popover',onClose:syncClosed,requestClose:options=>close(options?.restoreFocus!==false)});
  const unsubscribe=ui?.subscribe(state=>{root.inert=!!state.modal;if(state.modal)close(false);});
  listen(root,'pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;open();}});
  listen(root,'pointerleave',()=>{hovered=false;schedule();});
  listen(root,'focusin',()=>{if(!suppressFocus)open();});
  listen(root,'focusout',()=>queueMicrotask(schedule));
  listen(toggle,'click',()=>open());
  listen(root,'keydown',e=>{
    if(e.key==='Escape'&&expanded){e.preventDefault();e.stopPropagation();close(true);return;}
    if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
    e.preventDefault();open();const index=choices.indexOf(document.activeElement);
    let next=e.key==='Home'?0:e.key==='End'?choices.length-1:index<0?choices.findIndex(b=>b.dataset.scene===scene):(index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+choices.length)%choices.length;
    choices[next]?.focus({preventScroll:true});
  });
  if(!ui)listen(document,'pointerdown',e=>{if(!root.contains(e.target))close(false);});
  for(const button of choices)listen(button,'click',async()=>{
    const id=button.dataset.scene;if(busy)return;if(id===scene){close(true);return;}
    setBusy(true);status.hidden=false;status.textContent=`正在前往${SCENES.find(s=>s.id===id).name}…`;status.dataset.error='false';
    try {await onSwitch?.(id);if(disposed)return;scene=id;setBusy(false);status.hidden=true;render();close(true);}
    catch {if(disposed)return;setBusy(false);status.hidden=false;status.dataset.error='true';status.textContent='这次没能抵达，再点一次场景试试。';open();}
  });
  function setBusy(value){busy=!!value;render();if(busy)clearTimeout(timer);else schedule();}
  render();
  return {setBusy,dispose(){disposed=true;clearTimeout(timer);unsubscribe?.();events.abort();if(ui)ui.close('scene-switcher',{immediate:true,restoreFocus:false});root.remove();}};
}
