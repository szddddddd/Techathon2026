import * as THREE from 'three';

/** Collision-free spectator camera. Orbit pose is restored on every exit path. */
export function createFreeRoam({camera,controls,canvas,ui}) {
  const root=document.createElement('aside');root.id='free-roam';
  root.innerHTML='<button id="roam-toggle" type="button" role="switch" aria-checked="false" aria-describedby="roam-help">漫游 <i aria-hidden="true"></i></button><p id="roam-help" role="status" hidden></p>';
  document.body.append(root);
  const button=root.querySelector('button'),help=root.querySelector('p');
  const keys=new Set(),angles=new THREE.Euler(0,0,0,'YXZ'),direction=new THREE.Vector3(),right=new THREE.Vector3(),motion=new THREE.Vector3();
  const movement=new Set(['KeyW','KeyA','KeyS','KeyD','Space','ShiftLeft','ShiftRight','ControlLeft','ControlRight']);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let active=false,saved=null,returning=null,drag=null,blocked=false,disposed=false,lockPending=false;
  function hint(){help.textContent=document.pointerLockElement===canvas?'WASD 水平移动 · 空格上升 · Shift 下降 · Ctrl 加速 · Esc 退出':'WASD 水平移动 · 按住画面拖动转向（点击锁定鼠标）· 空格上升 · Shift 下降 · Ctrl 加速 · Esc 退出';}
  function finishReturn(){
    if(!returning)return;
    const done=returning.resolve;
    camera.position.copy(saved.position);camera.quaternion.copy(saved.quaternion);controls.target.copy(saved.target);
    controls.enabled=saved.enabled;controls.enableDamping=saved.damping;controls.autoRotate=saved.autoRotate;
    saved=null;returning=null;button.disabled=blocked;help.hidden=true;document.body.classList.remove('is-roaming');done();
  }
  function exit(){
    if(returning)return returning.promise;
    if(!active)return Promise.resolve();
    active=false;keys.clear();drag=null;
    let resolve;const promise=new Promise(done=>{resolve=done;});
    returning={position:camera.position.clone(),quaternion:camera.quaternion.clone(),elapsed:0,resolve,promise};
    if(document.pointerLockElement===canvas)document.exitPointerLock();
    button.setAttribute('aria-checked','false');button.disabled=true;help.textContent='正在返回原来的视角…';
    if(reduced.matches)finishReturn();
    return promise;
  }
  function enter(){
    if(active||returning||blocked||!controls.enabled)return false;
    // Consume remaining orbit inertia before taking ownership, then never update OrbitControls in flight.
    const damping=controls.enableDamping;controls.enableDamping=false;controls.update();
    saved={position:camera.position.clone(),quaternion:camera.quaternion.clone(),target:controls.target.clone(),enabled:controls.enabled,damping,autoRotate:controls.autoRotate};
    controls.enabled=false;controls.autoRotate=false;active=true;angles.setFromQuaternion(camera.quaternion,'YXZ');
    keys.clear();button.setAttribute('aria-checked','true');help.hidden=false;hint();document.body.classList.add('is-roaming');
    canvas.focus({preventScroll:true});return true;
  }
  function lock(){
    if(!canvas.requestPointerLock||lockPending)return;
    lockPending=true;
    try{Promise.resolve(canvas.requestPointerLock()).catch(()=>{}).finally(()=>{lockPending=false;if(disposed||!active){if(document.pointerLockElement===canvas)document.exitPointerLock();}});}catch{lockPending=false;}
  }
  function keydown(e){
    if(!active)return;
    if(e.code==='Escape'||e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();exit();return;}
    if(e.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;
    if(movement.has(e.code)){keys.add(e.code);e.preventDefault();e.stopImmediatePropagation();}
  }
  const keyup=e=>{keys.delete(e.code);};
  function down(e){if(!active)return;e.stopImmediatePropagation();e.preventDefault();if(e.button===0){drag={id:e.pointerId,x:e.clientX,y:e.clientY,distance:0};canvas.setPointerCapture?.(e.pointerId);}}
  function move(e){
    if(!active)return;
    const locked=document.pointerLockElement===canvas;if(!locked&&!drag)return;
    e.stopImmediatePropagation();
    const dx=locked?e.movementX:e.clientX-drag.x,dy=locked?e.movementY:e.clientY-drag.y;
    if(drag){drag.x=e.clientX;drag.y=e.clientY;drag.distance+=Math.abs(dx)+Math.abs(dy);}
    angles.y-=dx*.002;angles.x=THREE.MathUtils.clamp(angles.x-dy*.002,-Math.PI/2+.01,Math.PI/2-.01);camera.quaternion.setFromEuler(angles);
  }
  function up(e){if(!active)return;e.stopImmediatePropagation();if(drag&&e.button===0){const click=drag.distance<5;drag=null;if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(click)lock();}}
  function suppress(e){if(active||returning){e.preventDefault();e.stopImmediatePropagation();}}
  function lockchange(){if(!active){if(document.pointerLockElement===canvas)document.exitPointerLock();return;}if(document.pointerLockElement!==canvas)exit();else hint();}
  const blur=()=>{keys.clear();drag=null;};
  const visibility=()=>{if(document.hidden)exit();};
  const toggle=()=>active?exit():enter();button.addEventListener('click',toggle);
  window.addEventListener('keydown',keydown,true);window.addEventListener('keyup',keyup,true);window.addEventListener('blur',blur);
  // Window capture runs before the canvas's character drag, ray picks and orbit handlers.
  const leaveForUI=e=>{if(active&&e.target!==canvas&&!root.contains(e.target))exit();};
  window.addEventListener('pointerdown',leaveForUI,true);
  const canvasOnly=fn=>e=>{if(e.target!==canvas)return;if(returning){e.preventDefault();e.stopImmediatePropagation();return;}fn(e);};
  const handlers={pointerdown:canvasOnly(down),pointermove:canvasOnly(move),pointerup:canvasOnly(up),click:canvasOnly(suppress),dblclick:canvasOnly(suppress),wheel:canvasOnly(suppress),contextmenu:canvasOnly(suppress),pointercancel:canvasOnly(blur)};
  for(const [name,fn] of Object.entries(handlers))window.addEventListener(name,fn,{capture:true,passive:false});
  document.addEventListener('pointerlockchange',lockchange);document.addEventListener('visibilitychange',visibility);
  const unsubscribe=ui.subscribe(state=>{blocked=state.count>0;if(blocked)exit();button.disabled=blocked||!!returning;});
  return {get active(){return active;},get busy(){return active||!!returning;},enter,exit,
    update(dt){
      if(returning){
        returning.elapsed+=Math.min(dt,.05);const t=Math.min(1,returning.elapsed/.85),s=t*t*t*(t*(t*6-15)+10);
        camera.position.lerpVectors(returning.position,saved.position,s);camera.quaternion.slerpQuaternions(returning.quaternion,saved.quaternion,s);
        if(t===1)finishReturn();return;
      }
      if(!active)return;controls.enabled=false;
      // Yaw-only basis keeps WASD horizontal even when looking straight up or down.
      direction.set(-Math.sin(angles.y),0,-Math.cos(angles.y));right.set(Math.cos(angles.y),0,-Math.sin(angles.y));motion.set(0,0,0);
      motion.addScaledVector(direction,Number(keys.has('KeyW'))-Number(keys.has('KeyS')));motion.addScaledVector(right,Number(keys.has('KeyD'))-Number(keys.has('KeyA')));
      motion.y+=Number(keys.has('Space'))-Number(keys.has('ShiftLeft')||keys.has('ShiftRight'));
      if(motion.lengthSq())camera.position.addScaledVector(motion.normalize(),Math.min(dt,.05)*(keys.has('ControlLeft')||keys.has('ControlRight')?24:8));
    },
    snapshot:()=>({active,returning:!!returning,position:camera.position.toArray(),quaternion:camera.quaternion.toArray(),target:controls.target.toArray(),orbitEnabled:controls.enabled,locked:document.pointerLockElement===canvas}),
    dispose(){exit();finishReturn();disposed=true;unsubscribe();root.remove();window.removeEventListener('keydown',keydown,true);window.removeEventListener('keyup',keyup,true);window.removeEventListener('blur',blur);window.removeEventListener('pointerdown',leaveForUI,true);for(const [name,fn] of Object.entries(handlers))window.removeEventListener(name,fn,true);document.removeEventListener('pointerlockchange',lockchange);document.removeEventListener('visibilitychange',visibility);}
  };
}
