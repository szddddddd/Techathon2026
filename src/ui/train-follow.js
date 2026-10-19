import * as THREE from 'three';
import {FUJI_LAYOUT} from '../scenes/fuji/fuji-layout.js';

/** One camera owner driven by the application's frame loop. */
export function createTrainFollow({train,camera,controls,canvas,ui,reduced=false,beforeOpen,presentation={}}={}){
 const station=document.createElement('button');station.id='train-station-control';station.type='button';station.className='train-station-control';station.setAttribute('aria-label','樱町车站，随列车看风景');
 station.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z"/><path d="M6 11h12M9 5V3h6v2M8 17l-2 4m10-4 2 4M8 20h8"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></svg><span>樱町车站</span>';
 const back=document.createElement('button');back.id='train-follow-exit';back.type='button';back.className='train-follow-exit';back.hidden=true;back.innerHTML='<span aria-hidden="true">↩</span> 回到街区';back.setAttribute('aria-label','退出列车视角，回到街区');
 if(presentation.title)station.querySelector('span').textContent=presentation.title;if(presentation.icon)station.querySelector('svg').outerHTML=presentation.icon;station.setAttribute('aria-label',presentation.ariaLabel||`${presentation.title||'樱町车站'}，随行看风景`);if(presentation.exitLabel){back.textContent='↩ '+presentation.exitLabel;back.setAttribute('aria-label',presentation.exitLabel);}
 document.body.append(station,back);
 const ray=new THREE.Raycaster(),events=new AbortController();
 let active=false,preparing=false,blocked=false,disposed=false,saved=null,transition=null,gesture=null,sequence=0,cancelling=false,projected=null,returning=null,canvasRect=canvas.getBoundingClientRect();
 const isReduced=()=>typeof reduced==='boolean'?reduced:!!reduced?.matches;
 const listen=(node,name,fn,options={})=>node.addEventListener(name,fn,{...options,signal:events.signal});
 const stationTarget=()=>{const v=typeof presentation.stationTarget==='function'?presentation.stationTarget():presentation.stationTarget||train.stationTarget;return v?.isVector3?v.clone():new THREE.Vector3(v?.x??FUJI_LAYOUT.station.x,v?.y??4.75,v?.z??FUJI_LAYOUT.station.z);};
 function pose(){
  const target=isReduced()?(train.staticTarget?.()||stationTarget()):(train.followTarget?.()||train.getTarget()).clone();
  const forward=new THREE.Vector3(1,0,0);if(!isReduced()&&train.pickables?.[0])forward.applyQuaternion(train.pickables[0].getWorldQuaternion(new THREE.Quaternion()));forward.y=0;forward.normalize();
  if(!isReduced()){target.addScaledVector(forward,presentation.camera?.targetForward??-2.4);target.x=THREE.MathUtils.clamp(target.x,presentation.camera?.minX??-22,presentation.camera?.maxX??22);}
  const side=new THREE.Vector3(-forward.z,0,forward.x);if(side.z<0)side.negate();
  const position=target.clone().addScaledVector(forward,presentation.camera?.forward??9).addScaledVector(side,presentation.camera?.side??10).add(new THREE.Vector3(0,presentation.camera?.height??18,0));return{target,position:presentation.resolveCamera?.(target,position)||position};
 }
 function finishReturn(){
  if(!saved)return;const resolve=returning?.resolve;
  camera.position.copy(saved.position);camera.quaternion.copy(saved.quaternion);controls.target.copy(saved.target);controls.enabled=blocked?false:saved.enabled;controls.enableDamping=saved.damping;controls.autoRotate=saved.autoRotate;
  if(saved.view?.enabled)camera.setViewOffset(saved.view.fullWidth,saved.view.fullHeight,saved.view.offsetX,saved.view.offsetY,saved.view.width,saved.view.height);else if(camera.view?.enabled)camera.clearViewOffset();
  saved=null;returning=null;transition=null;resolve?.();
 }
 function exit({immediate=false}={}){
  sequence++;preparing=false;gesture=null;station.disabled=false;
  if(returning){if(immediate)finishReturn();return returning?.promise||Promise.resolve();}
  if(!active)return Promise.resolve();
  active=false;back.hidden=true;station.setAttribute('aria-pressed','false');
  let resolve;const promise=new Promise(done=>resolve=done);returning={position:camera.position.clone(),target:controls.target.clone(),quaternion:camera.quaternion.clone(),elapsed:0,promise,resolve};transition=null;
  if(immediate||isReduced())finishReturn();return promise;
 }
 async function enter(){
  if(disposed||blocked||active||preparing||returning)return;
  const token=++sequence;preparing=true;station.disabled=true;
  try{
   await beforeOpen?.();if(disposed||token!==sequence||blocked)return;
   const damping=controls.enableDamping;controls.enableDamping=false;controls.update();
   saved={position:camera.position.clone(),quaternion:camera.quaternion.clone(),target:controls.target.clone(),enabled:controls.enabled,damping,autoRotate:controls.autoRotate,view:camera.view?{...camera.view}:null};
   if(camera.view?.enabled)camera.clearViewOffset();controls.enabled=false;controls.autoRotate=false;
   active=true;transition={position:camera.position.clone(),target:controls.target.clone(),elapsed:0};back.hidden=false;station.setAttribute('aria-pressed','true');
   if(isReduced()){const desired=pose();camera.position.copy(desired.position);controls.target.copy(desired.target);camera.lookAt(desired.target);transition=null;}
  }catch{station.title='暂时无法切换视角，请再试一次';}
  finally{if(token===sequence){preparing=false;station.disabled=false;}}
 }
 function hit(x,y){
  if(!train?.pickables?.length)return false;const r=canvas.getBoundingClientRect();camera.updateMatrixWorld(true);ray.setFromCamera(new THREE.Vector2((x-r.left)/r.width*2-1,1-(y-r.top)/r.height*2),camera);
  return ray.intersectObjects(train.pickables,true).find(h=>h.object.visible&&!(presentation.isOccluded?.(camera,h.point))&&(train.containsVisiblePoint?.(h.point)??true));
 }
 function down(e){
  if(e.target!==canvas)return;
  if(active||returning){exit({immediate:true});gesture=null;return;}
  gesture=!blocked&&!preparing&&controls.enabled&&e.button===0&&hit(e.clientX,e.clientY)?{id:e.pointerId,x:e.clientX,y:e.clientY,moved:false}:null;
 }
 function move(e){if(gesture&&gesture.id===e.pointerId&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>6)gesture.moved=true;}
 function up(e){
  const start=gesture;gesture=null;if(!start||start.id!==e.pointerId||start.moved||Math.hypot(e.clientX-start.x,e.clientY-start.y)>6||blocked||!hit(e.clientX,e.clientY))return;
  // Complete OrbitControls' pointer lifecycle before consuming the train click.
  cancelling=true;canvas.dispatchEvent(new PointerEvent('pointercancel',{pointerId:e.pointerId,pointerType:e.pointerType}));cancelling=false;
  train.selectHit?.(hit(e.clientX,e.clientY));e.preventDefault();e.stopImmediatePropagation();void enter();
 }
 listen(station,'click',()=>{train.selectDefault?.();void enter();});listen(back,'click',()=>void exit());
 listen(window,'resize',()=>{canvasRect=canvas.getBoundingClientRect();});
 listen(window,'pointerdown',down,{capture:true});listen(window,'pointermove',move,{capture:true});listen(window,'pointerup',up,{capture:true});
 listen(window,'pointercancel',()=>{if(!cancelling)gesture=null;},{capture:true});
 listen(window,'wheel',e=>{if(e.target===canvas&&(active||returning))exit({immediate:true});},{capture:true,passive:true});
 listen(window,'keydown',e=>{if(e.key==='Escape'&&(active||returning||preparing)){e.preventDefault();e.stopImmediatePropagation();void exit();}},{capture:true});
 const unsubscribe=ui?.subscribe(state=>{blocked=!!state.main||!!state.modal;if(blocked)exit({immediate:true});station.hidden=blocked||active||!!returning;back.hidden=blocked||!active;});
 function update(now,dt=0){
  if(disposed)return;
  camera.updateMatrixWorld(true);const rect=canvasRect,point=stationTarget().project(camera),x=rect.left+(point.x*.5+.5)*rect.width,y=rect.top+(.5-point.y*.5)*rect.height;
  projected={x,y,visible:point.z>-1&&point.z<1&&x>=24&&x<=innerWidth-24&&y>=80&&y<=innerHeight-110};
  station.hidden=blocked||active||!!returning||!projected.visible;if(!station.hidden)station.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;
  if(returning){returning.elapsed+=Math.min(.05,dt);const t=isReduced()?1:Math.min(1,returning.elapsed/.5),s=t*t*(3-2*t);camera.position.lerpVectors(returning.position,saved.position,s);controls.target.lerpVectors(returning.target,saved.target,s);camera.quaternion.slerpQuaternions(returning.quaternion,saved.quaternion,s);if(t===1)finishReturn();return;}
  if(!active)return;controls.enabled=false;const desired=pose();
  if(transition){transition.elapsed+=Math.min(.05,dt);const t=isReduced()?1:Math.min(1,transition.elapsed/.75),s=t*t*t*(t*(t*6-15)+10);camera.position.lerpVectors(transition.position,desired.position,s);controls.target.lerpVectors(transition.target,desired.target,s);if(t===1)transition=null;}
  else{const amount=isReduced()?1:1-Math.exp(-Math.min(.05,dt)*4);camera.position.lerp(desired.position,amount);controls.target.lerp(desired.target,amount);}
  if(presentation.resolveCamera)camera.position.copy(presentation.resolveCamera(controls.target,camera.position));camera.lookAt(controls.target);
 }
 function screenPoint(){camera.updateMatrixWorld(true);const p=train.getTarget().clone().project(camera);return{x:canvasRect.left+(p.x*.5+.5)*canvasRect.width,y:canvasRect.top+(.5-p.y*.5)*canvasRect.height,visible:p.z>-1&&p.z<1&&Math.abs(p.x)<1&&Math.abs(p.y)<1};}
 return{get labelAnchor(){return projected?{...projected,id:'reserved-station',width:44,height:44,visible:projected.visible&&!station.hidden,fixed:true}:null;},update,enter,exit,get busy(){return active||preparing||!!returning;},snapshot:()=>({active,preparing,returning:!!returning,blocked,reduced:isReduced(),position:camera.position.toArray(),target:controls.target.toArray(),savedPosition:saved?.position.toArray()||null}),screenPoint,dispose(){if(disposed)return;exit({immediate:true});disposed=true;events.abort();unsubscribe?.();station.remove();back.remove();}};
}
