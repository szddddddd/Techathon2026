// Runs before the scene bundle so asset loading never exposes an unfinished scene.
(()=>{
 const themes={forest:['林间来信','#203a32','#f1f4e7'],fuji:['富士樱町','#bac9cf','#715b75'],ideal:['理想城','#78b7e4','#294f70']};
 const icons={forest:'<path d="m9 3-5 7h3l-4 6h12l-4-6h3L9 3Z" fill="currentColor" opacity=".8"/><path d="M9 16v5m8-15 4 6h-2l3 5h-7m3 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',fuji:'<path d="m2 20 8-15h4l8 15H2Z" fill="currentColor" opacity=".75"/><path d="m8 9 2-4h4l2 4-2-1-2 2-2-2-2 1Z" fill="#fff9f7"/><circle cx="19" cy="5" r="2.5" fill="#c8779d"/>'};
 icons.ideal='<path d="M9 20V8l2-6h3l2 6v12" fill="currentColor"/><path d="M3 18c0-2 4-3 9-3s9 1 9 3-4 3-9 3-9-1-9-3Z" fill="none" stroke="currentColor"/>';
 let id=new URLSearchParams(location.search).get('scene');if(!Object.hasOwn(themes,id)){try{id=localStorage.getItem('forest-letters-scene');}catch{}}if(!Object.hasOwn(themes,id))id='forest';
 const [name]=themes[id],el=document.getElementById('startup-loading');el.dataset.theme=id;
 el.innerHTML='<div class="scene-travel-content"><i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none">'+icons[id]+'</svg></i><span class="scene-travel-eyebrow">WeRoam · 正在准备你的风景</span><strong>'+name+'</strong><span class="scene-travel-progress" aria-hidden="true"></span><p class="scene-travel-detail">朋友与风景，即将相见</p></div>';
})();
