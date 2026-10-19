import * as THREE from 'three';

const icons={accounts:'<rect x="4" y="4" width="16" height="17" rx="3"/><path d="M8 8h8M8 12h8M8 16h5M9 4v17"/>','scene-video':'<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>'};

/** Screen-sized controls follow the real boards; the existing scene transition owns opening. */
export function createDiscoverySceneIcons({camera,groups,onOpen,preview,ui,isEnabled=()=>true,interactive=()=>true}){
  const root=document.createElement('div');root.id='discovery-scene-icons';root.setAttribute('aria-label','场景内容入口');document.body.append(root);
  let locked=false,focusOnReturn=null,anchors=[];const unsubscribe=ui?.subscribe(s=>{locked=!!s.main||!!s.modal;root.hidden=locked||!interactive();});
  const entries=Object.entries(groups).map(([kind,group])=>{
    const button=document.createElement('button');button.type='button';button.className='scene-content-icon scene-entry-icon';button.dataset.sceneContent=kind;
    const name=kind==='accounts'?'公众号':'视频号';button.setAttribute('aria-label',`打开场景${name}`);
    button.innerHTML=`<span class="scene-content-glyph"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[kind]}</svg></span><span class="scene-content-copy"><strong>${name}${kind==='accounts'?' · Hyper3D':''}</strong><small></small></span>`;
    button.addEventListener('click',()=>{focusOnReturn=button;onOpen(kind);});root.append(button);
    const point=new THREE.Vector3();let previous='';
    return {kind,group,button,point,name,get previous(){return previous;},set previous(v){previous=v;}};
  });
  function update(){
    root.hidden=locked||!interactive();if(root.hidden){anchors=[];return;}
    const visible=[];
    for(const e of entries){
      e.point.set(0,e.kind==='accounts'?2.7:4.1,0);e.group.localToWorld(e.point).project(camera);
      const x=(e.point.x*.5+.5)*innerWidth,y=(.5-e.point.y*.5)*innerHeight;
      e.button.hidden=!isEnabled(e.kind)||e.point.z< -1||e.point.z>1||x<8||x>innerWidth-8||y<8||y>innerHeight-50;
      if(e.button.hidden)continue;
      const title=preview(e.kind)?.title||'';if(e.previous!==title){e.button.querySelector('small').textContent=title;e.previous=title;}
      // Reserve the expanded footprint even at rest: hover must never move its own hit target.
      const width=172;
      visible.push({entry:e,width,x,y});
    }
    // Each entrance stays on its projected world point; labels never displace each other or social anchors.
    if(focusOnReturn&&!focusOnReturn.hidden){focusOnReturn.focus({preventScroll:true});focusOnReturn=null;}
    anchors=visible.map(({entry:e,width,x,y})=>({id:'discovery-'+e.kind,x,y,width,height:44,visible:true,fixed:true}));
    for(const {entry:e,x,y} of visible){const transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;if(e.button.style.transform!==transform)e.button.style.transform=transform;}
  }
  return{update,get anchors(){return anchors;},dispose(){unsubscribe?.();root.remove();}};
}
