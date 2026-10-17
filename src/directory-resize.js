/** Two edge grips resize the directory without moving its opposite edge. */
export function createDirectoryResize(panel){
  const events=new AbortController();let drag=null,preferred=null;
  const height=()=>Math.min(innerHeight,globalThis.visualViewport?.height||innerHeight);
  const limits=()=>({max:Math.max(120,height()-24),min:Math.min(440,Math.max(120,height()-24))});
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function apply(top,size){const {min,max}=limits();size=clamp(size,min,max);top=clamp(top,12,Math.max(12,height()-12-size));panel.style.height=size+'px';panel.style.top=top+'px';panel.style.translate='-50% 0';for(const g of grips){g.setAttribute('aria-valuenow',Math.round(size));g.setAttribute('aria-valuemin',Math.round(min));g.setAttribute('aria-valuemax',Math.round(max));}}
  const grips=['top','bottom'].map(edge=>{const g=document.createElement('div');g.className='directory-resize-grip';g.dataset.resizeEdge=edge;g.tabIndex=0;g.setAttribute('role','separator');g.setAttribute('aria-orientation','horizontal');g.setAttribute('aria-label',edge==='top'?'拖动顶部调整通讯录高度':'拖动底部调整通讯录高度');panel.append(g);return g;});
  function resize(edge,dy,rect){const {min,max}=limits();let top=rect.top,bottom=rect.bottom;if(edge==='top')top=clamp(top+dy,Math.max(12,bottom-max),bottom-min);else bottom=clamp(bottom+dy,top+min,Math.min(height()-12,top+max));preferred=bottom-top;apply(top,preferred);}
  for(const grip of grips){
    grip.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();drag={id:e.pointerId,y:e.clientY,edge:grip.dataset.resizeEdge,rect:panel.getBoundingClientRect()};grip.setPointerCapture(e.pointerId);panel.classList.add('is-resizing');},{signal:events.signal});
    grip.addEventListener('pointermove',e=>{if(drag?.id!==e.pointerId)return;e.preventDefault();resize(drag.edge,e.clientY-drag.y,drag.rect);},{signal:events.signal});
    const end=()=>{drag=null;panel.classList.remove('is-resizing');};
    for(const type of ['pointerup','pointercancel','lostpointercapture'])grip.addEventListener(type,end,{signal:events.signal});
    grip.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const rect=panel.getBoundingClientRect();if(e.key==='Home'||e.key==='End'){preferred=limits()[e.key==='Home'?'min':'max'];apply(rect.top,preferred);}else resize(grip.dataset.resizeEdge,e.key==='ArrowUp'?-24:24,rect);},{signal:events.signal});
  }
  const viewport=()=>{if(preferred!==null){const rect=panel.getBoundingClientRect();apply(rect.top,preferred);}};
  window.addEventListener('resize',viewport,{signal:events.signal});globalThis.visualViewport?.addEventListener('resize',viewport,{signal:events.signal});
  return {dispose(){events.abort();grips.forEach(g=>g.remove());}};
}
