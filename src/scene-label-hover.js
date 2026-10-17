/** Track real model hits and their labels, including motion beneath a stationary pointer. */
export function createSceneLabelHover({canvas,selector,dataKey,pick}){
 let pointer=null,last=-Infinity,current=null;
 const move=e=>{pointer=e.pointerType==='touch'||e.buttons?null:{x:e.clientX,y:e.clientY};last=-Infinity;};
 const clear=()=>{pointer=null;current=null;};
 document.addEventListener('pointermove',move);document.addEventListener('pointerdown',clear);document.addEventListener('pointerleave',clear);window.addEventListener('blur',clear);
 return {get(now){
  if(!pointer)return null;if(now-last<80)return current;last=now;
  const target=document.elementFromPoint(pointer.x,pointer.y),label=target?.closest(selector);
  current=label?.dataset[dataKey]||(target===canvas?pick(pointer.x,pointer.y):null);return current;
 },clear,dispose(){document.removeEventListener('pointermove',move);document.removeEventListener('pointerdown',clear);document.removeEventListener('pointerleave',clear);window.removeEventListener('blur',clear);}};
}
