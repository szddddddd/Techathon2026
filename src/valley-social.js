import * as THREE from 'three';
import {FRIENDS} from './social-store.js';

/** Gathering owns temporary placements only; no IDB writes occur here. */
export function createValleySocial({landmarks,terrain,scene,camera,controls,canvas,characters,store,socialUI,reduced}){
  const panel=document.createElement('section');panel.className='valley-popover';panel.hidden=true;panel.setAttribute('aria-label','年轮广场');document.body.append(panel);
  const returnButton=document.createElement('button');returnButton.className='valley-return';returnButton.hidden=true;returnButton.textContent='← 返回原视角';document.body.append(returnButton);
  let pose=null,partyPose=null,transition=null,down=null,kind=null;
  const ray=new THREE.Raycaster();
  const reducedMotion=()=>typeof reduced==='boolean'?reduced:reduced?.matches;
  const snapshot=()=>({position:camera.position.clone(),target:controls.target.clone(),enabled:controls.enabled});
  function settleChat(){if(socialUI.activeFriend){socialUI.closeMeeting();characters.finishCamera();}}
  function move(destination){transition={start:performance.now(),from:snapshot(),to:destination};controls.enabled=false;}
  function render(){const ids=store?.state.friends||[];panel.innerHTML=`<span class="valley-eyebrow">在年轮之间，坐一会儿</span><h2>山谷会客厅</h2><p>${characters.gathering?'朋友正在广场做客。拖动只调整本次聚会的位置。':'让远处的朋友，来到同一片树荫下。'}</p><div class="valley-guests">${FRIENDS.filter(f=>ids.includes(f.id)).map(f=>`<span title="${f.name}">${f.emoji}<small>${f.name}</small></span>`).join('')||'<p>还没有朋友，从下方「好友」认识他们吧。</p>'}</div><button class="valley-invite">${characters.gathering?'结束聚会':'来广场坐坐'}</button><small class="valley-note">${characters.gathering?'结束后回到原位 · 聚会不保存':'叶片捎来邀请，朋友随时相聚'}</small>`;panel.querySelector('button').onclick=()=>characters.gathering?end():gather();}
  function open(which='plaza'){
    if(transition||!controls.enabled)return;settleChat();kind=which;if(!pose)pose=snapshot();
    if(which==='plaza'){panel.hidden=false;render();}
    else{panel.hidden=true;const mobile=innerWidth<700;move({position:new THREE.Vector3(mobile?36:23,mobile?30:17,mobile?-28:-17),target:new THREE.Vector3(-2,3,0),enabled:true});returnButton.hidden=false;}
  }
  function gather(){
    settleChat();const result=characters.beginGather();if(!result.ok){socialUI.toast(result.reason);return result;}
    if(!partyPose)partyPose=pose||snapshot();if(!pose)pose=partyPose;
    const mobile=innerWidth<700;move({position:new THREE.Vector3(mobile?29:31,mobile?29:19,mobile?31:23),target:new THREE.Vector3(21,3,1.5),enabled:true});returnButton.hidden=false;render();return result;
  }
  function end(){settleChat();if(!characters.endGather())return false;const original=partyPose;partyPose=null;pose=null;kind=null;panel.hidden=true;returnButton.hidden=true;if(original)move(original);return true;}
  function finishCamera(){if(!transition)return;const destination=transition.to;transition=null;camera.position.copy(destination.position);controls.target.copy(destination.target);camera.lookAt(controls.target);controls.enabled=destination.enabled;}
  function restoreView(){settleChat();panel.hidden=true;kind=null;returnButton.hidden=true;if(pose){const old=pose;pose=null;move(old);}}
  function update(now){
    if(transition){const t=reducedMotion()?1:Math.min(1,(now-transition.start)/750),s=t*t*(3-2*t);camera.position.lerpVectors(transition.from.position,transition.to.position,s);controls.target.lerpVectors(transition.from.target,transition.to.target,s);camera.lookAt(controls.target);if(t===1){controls.enabled=transition.to.enabled;transition=null;}}
    returnButton.hidden=!pose||!!socialUI.activeFriend||!!window.__discoveryBoards?.kind;
    if(!panel.hidden){const p=landmarks.lamp.position.clone().add(new THREE.Vector3(0,4.4,0)).project(camera);panel.style.left=`${Math.max(16,Math.min(innerWidth-panel.offsetWidth-16,(p.x*.5+.5)*innerWidth-144))}px`;panel.style.top=`${Math.max(16,Math.min(innerHeight-panel.offsetHeight-100,(.5-p.y*.5)*innerHeight))}px`;}
  }
  function pointerDown(e){if(e.button===0&&controls.enabled)down={x:e.clientX,y:e.clientY};else down=null;}
  function pointerUp(e){const p=down;down=null;if(!p||Math.hypot(e.clientX-p.x,e.clientY-p.y)>6||!controls.enabled)return;const rect=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),camera);const hit=ray.intersectObjects(landmarks.pickables,true)[0];if(!hit)return;const blockers=ray.intersectObjects(scene.children,true).filter(h=>h.object.isMesh&&!h.object.material.transparent);if(blockers[0]&&blockers[0].distance<hit.distance-.05)return;let o=hit.object;while(o&&!o.userData.landmark)o=o.parent;open(o?.userData.landmark);}
  const outside=e=>{if(!panel.hidden&&!panel.contains(e.target))panel.hidden=true;};
  const escape=e=>{if(e.key!=='Escape'||document.querySelector('dialog[open],#directory:not([hidden])')||socialUI.activeFriend||window.__discoveryBoards?.kind)return;if(!panel.hidden){panel.hidden=true;e.stopImmediatePropagation();}else if(pose){restoreView();e.stopImmediatePropagation();}};
  const unread=()=>{landmarks.updateUnread(new Set((store?.state.messages||[]).filter(m=>m.senderId!=='me'&&!m.read).map(m=>m.senderId)));if(!panel.hidden)render();};
  const unsubscribe=store?.subscribe(unread);unread();returnButton.onclick=restoreView;
  panel.addEventListener('pointerdown',e=>e.stopPropagation());canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointerup',pointerUp);document.addEventListener('pointerdown',outside);window.addEventListener('keydown',escape,true);
  return{open,gather,end,restoreView,finishCamera,update,view(position,target){settleChat();move({position:new THREE.Vector3(...position),target:new THREE.Vector3(...target),enabled:true});},sample:terrain.sample,area:terrain.root.userData.landArea,snapshot:()=>({leafIntensity:landmarks.leaves.map(l=>l.material.emissiveIntensity),gathering:characters.gathering,kind,transitioning:!!transition,pose:pose?{position:pose.position.toArray(),target:pose.target.toArray()}:null}),screenPoint(which='plaza'){const p=(which==='plaza'?landmarks.lamp:landmarks.frame).localToWorld(new THREE.Vector3(0,which==='plaza'?2.5:1,0)).project(camera);return{x:(p.x*.5+.5)*innerWidth,y:(.5-p.y*.5)*innerHeight};},dispose(){unsubscribe?.();panel.remove();returnButton.remove();canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointerup',pointerUp);document.removeEventListener('pointerdown',outside);window.removeEventListener('keydown',escape,true);}};
}
