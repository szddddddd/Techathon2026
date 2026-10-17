import {modIcon} from './mods/catalog.js';

/** Shared surface lifecycle. Scene camera timelines remain owned by their modules. */
export function createUIInteractions() {
  const layers = new Map(), listeners = new Set();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let order = 0, pointer = null, lastSource = null;
  const scrim = document.createElement('div');
  scrim.id = 'ui-scrim'; scrim.hidden = true; document.body.append(scrim);
  const visible = () => [...layers.values()].filter(l => l.state !== 'closed');
  const top = () => visible().sort((a,b) => b.order-a.order)[0];
  const rect = source => {
    if (typeof source === 'function') source = source();
    if (source instanceof Element) return source.isConnected && source.getClientRects().length ? source.getBoundingClientRect() : null;
    return source?.width ? source : null;
  };
  function sync() {
    const all = visible(), main = all.find(l => l.kind === 'main');
    scrim.hidden = !main;
    document.body.classList.toggle('ui-main-open', !!main);
    const viewport = document.getElementById('viewport');
    if (viewport) viewport.inert = !!main || all.some(l => l.modal);
    const state = {main: main?.nav || null, modal: all.some(l => l.modal), count: all.length};
    for (const listener of listeners) listener(state);
  }
  function register(id, config) {
    const layer = {id, state:'closed', order:0, token:0, ...config};
    layer.surface ||= layer.el;
    layer.el.dataset.uiState = 'closed';
    if(!layer.el.hasAttribute('role')&&!(layer.el instanceof HTMLDialogElement))layer.el.setAttribute('role',layer.kind==='main'||layer.kind==='popover'?'dialog':'region');
    if (!layer.el.hasAttribute('tabindex')) layer.el.tabIndex = -1;
    layers.set(id, layer);
    if (layer.el instanceof HTMLDialogElement) layer.el.addEventListener('cancel', e => {e.preventDefault(); requestClose(id);});
    return layer;
  }
  function originTransform(layer) {
    const from = rect(layer.origin), to = layer.surface.getBoundingClientRect();
    if (!from || !to.width || !to.height) return 'translateY(10px) scale(.96)';
    const scale = Math.max(.08, Math.min(.85, Math.max(from.width/to.width, from.height/to.height)));
    return `translate(${from.left+from.width/2-to.left-to.width/2}px,${from.top+from.height/2-to.top-to.height/2}px) scale(${scale})`;
  }
  async function motion(layer, opening, immediate = false) {
    const ticket = ++layer.token, surface = layer.surface;
    const current = layer.animation ? {transform:getComputedStyle(surface).transform, opacity:getComputedStyle(surface).opacity} : null;
    layer.animation?.cancel(); layer.animation = null;
    layer.contentAnimations?.forEach(a=>a.cancel());layer.contentAnimations=[];
    if (!immediate && !layer.externalMotion && !reduced.matches) {
      const small = {transform:!opening&&layer.origin&&!rect(layer.origin)?'none':originTransform(layer), opacity:0};
      const full = {transform:'translate(0,0) scale(1)', opacity:1};
      layer.animation = surface.animate([current || (opening ? small : full), opening ? full : small], {
        duration:opening ? 320 : 220, easing:opening ? 'cubic-bezier(.2,.8,.2,1)' : 'cubic-bezier(.4,0,.8,.2)', fill:'both'
      });
      if(opening&&!current)layer.contentAnimations=[...surface.children].filter(el=>!el.matches('.ui-titlebar,.ui-close')).map(el=>el.animate([{opacity:0,offset:0},{opacity:0,offset:.35},{opacity:1,offset:1}],{duration:320,fill:'both',easing:'ease-out'}));
      try { await layer.animation.finished; } catch { return false; }
    }
    if (ticket !== layer.token) return false;
    layer.animation?.cancel(); layer.animation = null;
    layer.contentAnimations?.forEach(a=>a.cancel());layer.contentAnimations=[];
    return true;
  }
  function focusSource(layer) {
    let source = typeof layer.origin === 'function' ? layer.origin() : layer.origin;
    if (!(source instanceof HTMLElement) || !source.isConnected || !source.getClientRects().length || source.closest('[hidden],[inert]')) source = layer.focusReturn;
    if (!(source instanceof HTMLElement) || !source.isConnected || !source.getClientRects().length) source = document.getElementById('dock-reveal');
    // Hover-only scene identities must be visible for the focus operation. Once
    // focused, :focus-within keeps the existing label expanded without moving it.
    const identity=source?.closest('.anchor-identity'),visibility=identity?.style.visibility;
    if(identity)identity.style.visibility='visible';
    source?.focus({preventScroll:true});
    if(identity)identity.style.visibility=visibility;
    if(source&&document.activeElement!==source)document.getElementById('dock-reveal')?.focus({preventScroll:true});
  }
  async function open(id, {origin, focus=true, animate=true} = {}) {
    const layer = layers.get(id); if (!layer) return;
    const wasOpen = layer.state === 'open' || layer.state === 'opening';
    if (layer.kind === 'main') for (const other of visible()) if (other !== layer) close(other.id, {immediate:true, restoreFocus:false});
    if (layer.kind === 'popover') for (const other of visible()) if (other.kind === 'popover' && other !== layer) close(other.id, {immediate:true, restoreFocus:false});
    if (!wasOpen) {layer.origin = origin || lastSource; layer.focusReturn = document.activeElement;layer.openPointer=pointer;}
    layer.order = ++order;
    layer.el.hidden = false; layer.el.inert = false;
    if (layer.el instanceof HTMLDialogElement && !layer.el.open) layer.modal ? layer.el.showModal() : layer.el.show();
    layer.state = 'opening'; layer.el.dataset.uiState = 'opening';
    layer.position?.(); sync();
    if (await motion(layer, true, !animate || wasOpen)) {
      layer.state = 'open'; layer.el.dataset.uiState = 'open';
      if (focus && top() === layer) layer.el.focus({preventScroll:true});
    }
  }
  async function close(id, {immediate=false, restoreFocus=true} = {}) {
    const layer = layers.get(id); if (!layer || layer.state === 'closed' || (layer.state === 'closing' && !immediate)) return;
    layer.state = 'closing'; layer.el.dataset.uiState = 'closing'; layer.el.inert = true;
    layer.onClose?.({immediate});
    // Synchronous finalization is important when replacing a workspace.
    const finish = () => {
      if (layer.el instanceof HTMLDialogElement && layer.el.open) layer.el.close();
      else layer.el.hidden = true;
      layer.el.inert = false; layer.state = 'closed'; layer.el.dataset.uiState = 'closed';
      layer.onClosed?.(); sync();
      if (restoreFocus) focusSource(layer);
    };
    if (immediate) {layer.token++;layer.animation?.cancel();layer.animation=null;layer.contentAnimations?.forEach(a=>a.cancel());finish();}
    else if (await motion(layer, false)) finish();
  }
  function requestClose(id, options) {
    const layer = layers.get(id); if (!layer || layer.state === 'closed') return;
    if (layer.requestClose) layer.requestClose(options); else close(id, options);
  }
  function dismissPopovers(options) {for (const l of visible()) if (l.kind === 'popover') close(l.id,options);}
  function transition(node, direction=1) {
    if (reduced.matches || !node || node.hidden) return;
    node.getAnimations().forEach(a=>a.cancel());
    return node.animate([{opacity:.25,transform:`translateX(${direction*12}px)`},{opacity:1,transform:'translateX(0)'}],{duration:180,easing:'ease-out'});
  }
  const down = e => {
    pointer = {x:e.clientX,y:e.clientY,inside:visible().filter(l=>l.el.contains(e.target)).map(l=>l.id)};
    const source=e.target.closest('button,a'); if(source) lastSource=source;
    if (e.target.closest('canvas')) dismissPopovers({restoreFocus:false});
  };
  const click = e => {
    if (!pointer || Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>6) return;
    const layer=top(); if (!layer || layer.state==='closing') return;
    if (e.target.closest('[data-ui-close]')) {requestClose(e.target.closest('[data-ui-close]').dataset.uiClose);return;}
    if(layer.openPointer===pointer)return;
    if(e.target===layer.el&&layer.el instanceof HTMLDialogElement){const r=layer.el.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){requestClose(layer.id);return;}}
    if (pointer.inside.includes(layer.id) || layer.el.contains(e.target) || e.target.closest('.social-dock,.dock-reveal,#web-pet')) return;
    let source=typeof layer.origin==='function'?layer.origin():layer.origin;
    if(source instanceof Element && source.contains(e.target))return;
    requestClose(layer.id);
  };
  const key = e => {
    if (e.key!=='Escape' || !top()) return;
    e.preventDefault(); e.stopImmediatePropagation(); requestClose(top().id);
  };
  const resize = () => {document.documentElement.style.setProperty('--ui-height',(visualViewport?.height||innerHeight)+'px');for(const l of visible()) {l.position?.();if(l.animation){l.token++;l.animation.cancel();l.animation=null;l.contentAnimations?.forEach(a=>a.cancel());if(l.state==='closing')close(l.id,{immediate:true});else {l.state='open';l.el.dataset.uiState='open';}}}};
  document.addEventListener('pointerdown',down,true);document.addEventListener('click',click);
  window.addEventListener('keydown',key,true);window.addEventListener('resize',resize);visualViewport?.addEventListener('resize',resize);
  return {register,open,close,requestClose,dismissPopovers,transition,rect,source:()=>lastSource,
    back(){const layer=top();if(!layer)return false;requestClose(layer.id);return true;},
    setNav(id,nav){const l=layers.get(id);if(l)l.nav=nav;sync();},
    get activeMain(){return visible().find(l=>l.kind==='main')?.id;},
    state:id=>layers.get(id)?.state,
    subscribe(fn){listeners.add(fn);sync();return()=>listeners.delete(fn);},
    dispose(){for(const l of layers.values()){l.token++;l.animation?.cancel();l.contentAnimations?.forEach(a=>a.cancel());}document.removeEventListener('pointerdown',down,true);document.removeEventListener('click',click);window.removeEventListener('keydown',key,true);window.removeEventListener('resize',resize);visualViewport?.removeEventListener('resize',resize);scrim.remove();listeners.clear();}
  };
}

export function createDock({root,ui}) {
  const dock=root.querySelector('.social-dock');dock.id='social-dock';dock.setAttribute('aria-label','主导航');
  const icons={directory:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/>','public-moments':'<circle cx="12" cy="12" r="3"/><path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8"/>',discover:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',me:'<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>'};
  for(const b of dock.querySelectorAll('[data-action]'))b.querySelector('span').innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[b.dataset.action]||''}</svg>`;
  for(const b of dock.querySelectorAll('[data-mod-entry], [data-action=workshop]'))b.querySelector('span').innerHTML=modIcon(b.dataset.modEntry||'workshop');
  const reveal=document.createElement('button');reveal.id='dock-reveal';reveal.className='dock-reveal';reveal.type='button';
  reveal.setAttribute('aria-label','展开主导航');reveal.setAttribute('aria-controls','social-dock');reveal.innerHTML='<span></span><i hidden></i>';
  root.append(reveal);
  const events=new AbortController(),on=(el,event,fn)=>el.addEventListener(event,fn,{signal:events.signal});
  let timer,hover=false,keyboard=false,touch=false,current={};
  const inside=el=>el instanceof Node&&(dock.contains(el)||reveal.contains(el));
  const focused=()=>keyboard&&inside(document.activeElement);
  function show(){clearTimeout(timer);root.dataset.dock='expanded';dock.inert=false;reveal.setAttribute('aria-expanded','true');schedule();}
  function hide(){if(hover||focused()||touch)return;root.dataset.dock='collapsed';dock.inert=true;reveal.setAttribute('aria-expanded','false');}
  function schedule(){clearTimeout(timer);if(!hover&&!focused()&&!touch)timer=setTimeout(hide,300);}
  const enter=e=>{if(e.pointerType!=='touch'){hover=true;show();}},leave=()=>{hover=false;schedule();};
  for(const node of [dock,reveal]){on(node,'pointerenter',enter);on(node,'pointerleave',leave);on(node,'focusin',()=>{if(keyboard)show();});on(node,'focusout',()=>queueMicrotask(schedule));}
  on(document,'keydown',e=>{if(['Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))keyboard=true;});
  on(document,'pointerdown',e=>{keyboard=false;touch=e.pointerType==='touch'&&inside(e.target);if(touch)show();else schedule();});
  on(document,'pointerleave',leave);
  on(reveal,'click',show);
  const unsub=ui.subscribe(state=>{current=state;dock.inert=state.modal||root.dataset.dock==='collapsed';reveal.inert=state.modal;
    for(const b of dock.querySelectorAll('[data-action]')){const selected=b.dataset.action===state.main;b.setAttribute('aria-current',selected?'page':'false');}
    schedule();
  });
  hide();
  return {show,unread(value){reveal.querySelector('i').hidden=!value;reveal.setAttribute('aria-label',value?'展开主导航，有未读内容':'展开主导航');},dispose(){clearTimeout(timer);events.abort();unsub();reveal.remove();}};
}
