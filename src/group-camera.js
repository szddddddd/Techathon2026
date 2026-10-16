import * as THREE from 'three';

/** One camera owner for scene group cards and the return to the original view. */
export function createGroupCamera({camera,controls,reduced}){
  let saved=null,tween=null,held=null,active=false,focus=null;
  const pose=()=>({position:camera.position.clone(),target:controls.target.clone()});
  function destination(){
    const target=focus.clone(),distance=innerWidth<700?18:13;
    return {target,position:target.clone().add(new THREE.Vector3(.35,.55,1).normalize().multiplyScalar(distance))};
  }
  function move(to,restore=false){tween={from:pose(),to,start:performance.now(),duration:reduced.matches?0:750,restore};controls.enabled=false;controls.enableDamping=false;}
  function update(now){
    if(!tween){if(active&&held){camera.position.copy(held.position);controls.target.copy(held.target);camera.lookAt(controls.target);}return;}
    const t=tween.duration?Math.min(1,(now-tween.start)/tween.duration):1,e=t*t*(3-2*t);
    camera.position.lerpVectors(tween.from.position,tween.to.position,e);controls.target.lerpVectors(tween.from.target,tween.to.target,e);camera.lookAt(controls.target);
    if(t===1){const restore=tween.restore;held=tween.to;tween=null;if(restore&&saved){controls.enabled=saved.enabled;controls.enableDamping=saved.damping;saved=null;}}
  }
  function close(immediate=false){active=false;if(!saved)return;move(saved,true);if(immediate){tween.duration=0;update(performance.now());}}
  const resize=()=>{if(active)move(destination());};window.addEventListener('resize',resize);
  return {open(point){if(!saved)saved={...pose(),enabled:controls.enabled,damping:controls.enableDamping};focus=point.clone();active=true;move(destination());},close,update,get active(){return active;},get busy(){return active||!!tween;},snapshot:()=>({active,transitioning:!!tween,position:camera.position.toArray(),target:controls.target.toArray()}),dispose(){close(true);window.removeEventListener('resize',resize);}};
}
