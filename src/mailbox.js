import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const labels={forest:'森林邮筒',fuji:'小町邮箱',ideal:'云端邮件终端'};
export async function createMailbox({scene,terrain,camera,canvas,ui,onFocus}){
 const theme=terrain.theme,model=(await new GLTFLoader().loadAsync(`assets/mailboxes/${theme}/scene.glb`)).scene;
 const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
 const height=theme==='ideal'?2.4:1.9,scale=height/size.y;
 model.position.sub(new T.Vector3(center.x,box.min.y,center.z));
 const holder=new T.Group();holder.scale.setScalar(scale);holder.add(model);
 const root=new T.Group();root.name=labels[theme];root.add(holder);
 const anchor=theme==='fuji'?{x:terrain.layout.station.x-5,z:terrain.layout.station.z+7}:theme==='ideal'?{x:3,z:18.7}:{x:-7,z:3};
 const radius=Math.max(size.x,size.z)*scale/2+.25;
 const obstacles=(terrain.landmarkObstacles||[]).map(o=>new T.Box3().setFromObject(o));
 const slots=terrain.layout?.slots||[];
 let placement;
 for(let ring=0;ring<12&&!placement;ring++)for(let i=0;i<(ring?16:1);i++){
  const a=i*Math.PI/8,x=anchor.x+Math.cos(a)*ring*.65,z=anchor.z+Math.sin(a)*ring*.65,surface=terrain.sample(x,z);
  if(!Number.isFinite(surface.height)||surface.walkable===false||terrain.canPlace&&!terrain.canPlace(x,z,radius))continue;
  if((terrain.layout?.trees||[]).some(t=>Math.hypot(x-t.x,z-t.z)<3.8+radius))continue;
  if(slots.some(s=>Math.abs(x-s.x)<(s.width||5)/2+radius&&Math.abs(z-s.z)<(s.depth||5)/2+radius))continue;
  const candidate=new T.Box3(new T.Vector3(x-radius,surface.height+.08,z-radius),new T.Vector3(x+radius,surface.height+height,z+radius));
  if(obstacles.some(b=>b.intersectsBox(candidate)))continue;
  placement={x,y:surface.height,z};break;
 }
 if(!placement)throw Error('找不到安全的邮箱放置位置：'+theme);
 root.position.set(placement.x,placement.y,placement.z);root.rotation.y=.15;
 model.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;o.userData.generatedProp=true;}});scene.add(root);root.updateMatrixWorld(true);
 const button=document.createElement('button');button.className='scene-entry-icon';button.type='button';button.style.cssText='position:fixed;z-index:12;margin:0';button.setAttribute('aria-label','聚焦'+labels[theme]);button.innerHTML=`<span class="scene-content-glyph"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg></span><span class="scene-content-copy"><strong>${labels[theme]}</strong><small>靠近看看</small></span>`;document.body.append(button);
 const target=()=>root.position.clone().add(new T.Vector3(0,height*.55,0));
 let locked=true;const unsubscribe=ui.subscribe(s=>{locked=!!(s.main||s.modal);button.hidden=locked;});
 const open=()=>{if(locked||!controlsAllowed())return;onFocus?.(target());};
 function controlsAllowed(){return !document.querySelector('dialog[open]');}
 button.addEventListener('click',open);let down=null;const ray=new T.Raycaster();
 const press=e=>{down=e.button===0?{x:e.clientX,y:e.clientY}:null;};
 const click=e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;down=null;if(!root.visible||locked)return;const r=canvas.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),camera);const hit=ray.intersectObject(scene,true).find(h=>h.object.isMesh&&h.object.visible);if(hit){let o=hit.object;while(o&&o!==root)o=o.parent;if(o===root)open();}};
 canvas.addEventListener('pointerdown',press);canvas.addEventListener('click',click);
 return{root,target,update(){const p=target().add(new T.Vector3(0,height*.65,0)).project(camera),r=canvas.getBoundingClientRect();button.hidden=!!locked||p.z>1||p.z< -1||Math.abs(p.x)>1||Math.abs(p.y)>1;button.style.transform=`translate(${r.left+(p.x+1)*r.width/2}px,${r.top+(1-p.y)*r.height/2}px) translate(-50%,-50%)`;},setActive(active){root.visible=active;button.hidden=!active;},dispose(){unsubscribe();button.remove();canvas.removeEventListener('pointerdown',press);canvas.removeEventListener('click',click);}};
}
