import * as THREE from 'three';

const reasons={walkway:'这里要留作通路',campfire:'离篝火太近了','friend clearance':'离其他朋友太近了','no meadow support':'请放在有支撑的陆地上',obstacle:'这里有树木或设施','inside obstacle':'这里有建筑或设施'};

/** Own a gesture before OrbitControls sees it; a short click still opens chat. */
export function createCharacterDrag({scene,camera,controls,canvas,pick,inspect,onClick,onCommit,onPlaced,onError}){
  const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),-2.22);
  const marker=new THREE.Mesh(new THREE.RingGeometry(1,1.07,64),new THREE.MeshBasicMaterial({color:0xa7d58c,transparent:true,opacity:.95,side:THREE.DoubleSide,depthWrite:false}));
  marker.name='Character placement preview';marker.rotation.x=-Math.PI/2;marker.visible=false;marker.userData.socialCharacter=true;scene.add(marker);
  const hint=document.createElement('div');hint.id='character-drag-hint';hint.hidden=true;hint.setAttribute('role','status');hint.innerHTML='<strong></strong><span></span>';document.body.append(hint);
  canvas.title='单击人物聊天 · 按住人物拖动放置';
  let gesture=null,pending=false,lastResult=null,disposed=false,lastHover=0;
  function ground(x,y){const rect=canvas.getBoundingClientRect();camera.updateMatrixWorld(true);ray.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2),camera);return ray.ray.intersectPlane(plane,new THREE.Vector3());}
  function freeze(){if(!gesture)return;camera.position.copy(gesture.camera);controls.target.copy(gesture.target);camera.lookAt(controls.target);camera.updateMatrixWorld(true);}
  function down(e){
    // Extra touches cancel a placement; don't leave a captured first finger behind.
    if(gesture){cancel();e.stopImmediatePropagation();e.preventDefault();return;}
    if(e.button!==0||!controls.enabled||document.querySelector('dialog[open]')||pending)return;
    const record=pick(e.clientX,e.clientY);if(!record)return;
    const position=record.group.position.clone();plane.constant=-position.y;
    const start=ground(e.clientX,e.clientY);if(!start)return;
    gesture={id:e.pointerId,record,x:e.clientX,y:e.clientY,origin:position,camera:camera.position.clone(),target:controls.target.clone(),enabled:controls.enabled,damping:controls.enableDamping,offset:position.clone().sub(start),dragging:false,candidate:null};
    controls.enabled=false;record.placing=true;record.ring.visible=true;record.outline.visible=true;
    canvas.setPointerCapture(e.pointerId);e.stopImmediatePropagation();e.preventDefault();
  }
  function move(e){
    if(!gesture&&!e.buttons&&controls.enabled&&performance.now()-lastHover>70){lastHover=performance.now();canvas.style.cursor=pick(e.clientX,e.clientY)?'grab':'';}
    if(!gesture||gesture.id!==e.pointerId||pending)return;
    e.stopImmediatePropagation();e.preventDefault();freeze();
    if(!gesture.dragging&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)<7)return;
    gesture.dragging=true;canvas.classList.add('placing-character');canvas.style.cursor='grabbing';hint.hidden=false;
    const point=ground(e.clientX,e.clientY);const candidate=point?.add(gesture.offset),record=gesture.record;
    const check=candidate?inspect(record,candidate.x,candidate.z):{ok:false,reason:'no meadow support'};
    gesture.candidate=candidate?{x:candidate.x,z:candidate.z,...check}:check;
    if(check.ok)record.group.position.set(candidate.x,check.y+.16,candidate.z);
    else record.group.position.copy(gesture.origin).add(new THREE.Vector3(0,.16,0));
    marker.visible=!!candidate;marker.scale.setScalar(record.bodyRadius+.08);if(candidate)marker.position.set(candidate.x,(check.y??gesture.origin.y)+.035,candidate.z);marker.material.color.set(check.ok?0xa7d58c:0xd78b71);
    record.ring.material.color.set(check.ok?0xcce5ad:0xe9aa8e);
    hint.dataset.valid=String(check.ok);hint.querySelector('strong').textContent=check.ok?'松手，放在这里':reasons[check.reason]||'这里暂时放不下';hint.querySelector('span').textContent='Esc 取消 · 位置会自动保存';
  }
  function release(){
    const current=gesture;if(!current)return;
    // Flush old orbit damping without letting it move the restored camera.
    controls.enableDamping=false;controls.update();freeze();controls.enableDamping=current.damping;controls.enabled=current.enabled;
    current.record.placing=false;current.record.ring.visible=false;current.record.outline.visible=false;current.record.ring.material.color.set(0xffe3a0);
    current.record.group.updateMatrixWorld(true);
    gesture=null;marker.visible=false;hint.hidden=true;canvas.classList.remove('placing-character');canvas.style.cursor='';
    if(canvas.hasPointerCapture(current.id))canvas.releasePointerCapture(current.id);
  }
  async function up(e){
    if(!gesture||gesture.id!==e.pointerId||pending)return;
    e.stopImmediatePropagation();e.preventDefault();
    const current=gesture,{record}=current;
    if(!current.dragging){record.group.position.copy(current.origin);release();onClick?.(record.friend.id);return;}
    const point=current.candidate;
    const check=point?.ok?inspect(record,point.x,point.z):point;
    if(!check?.ok){record.group.position.copy(current.origin);lastResult={id:record.friend.id,ok:false,reason:check?.reason||'cancelled'};release();onError?.('这里放不下，已回到原位。');return;}
    pending=true;hint.querySelector('strong').textContent='正在安放…';
    try{
      await onCommit?.(record.friend.id,{x:point.x,z:point.z});
      if(disposed)return;
      record.group.position.set(point.x,check.y,point.z);onPlaced(record,{x:point.x,y:check.y,z:point.z});lastResult={id:record.friend.id,ok:true,x:point.x,y:check.y,z:point.z};
    }catch(error){record.group.position.copy(current.origin);lastResult={id:record.friend.id,ok:false,reason:'save failed'};onError?.(error.message||'位置没有保存成功，已回到原位。');}
    finally{pending=false;release();}
  }
  function cancel(){if(!gesture||pending)return;gesture.record.group.position.copy(gesture.origin);lastResult={id:gesture.record.friend.id,ok:false,reason:'cancelled'};release();}
  const cancelEvent=e=>{if(gesture&&(!e?.pointerId||e.pointerId===gesture.id)){cancel();e?.stopImmediatePropagation?.();}};
  const key=e=>{if(gesture&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();cancel();}};
  const visibility=()=>{if(document.hidden)cancel();};
  canvas.addEventListener('pointerdown',down,true);canvas.addEventListener('pointermove',move,true);canvas.addEventListener('pointerup',up,true);canvas.addEventListener('pointercancel',cancelEvent,true);canvas.addEventListener('lostpointercapture',cancelEvent,true);
  window.addEventListener('keydown',key,true);window.addEventListener('blur',cancel);window.addEventListener('resize',cancel);document.addEventListener('visibilitychange',visibility);
  return{update:freeze,get busy(){return!!gesture;},snapshot(){return{active:gesture?.record.friend.id||null,dragging:!!gesture?.dragging,pending,origin:gesture?.origin.toArray()||null,offset:gesture?.offset.toArray()||null,candidate:gesture?.candidate||null,lastResult};},dispose(){disposed=true;cancel();marker.removeFromParent();marker.geometry.dispose();marker.material.dispose();hint.remove();canvas.removeEventListener('pointerdown',down,true);canvas.removeEventListener('pointermove',move,true);canvas.removeEventListener('pointerup',up,true);canvas.removeEventListener('pointercancel',cancelEvent,true);canvas.removeEventListener('lostpointercapture',cancelEvent,true);window.removeEventListener('keydown',key,true);window.removeEventListener('blur',cancel);window.removeEventListener('resize',cancel);document.removeEventListener('visibilitychange',visibility);}};
}
