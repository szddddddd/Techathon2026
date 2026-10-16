import * as THREE from 'three';

export function createSoundCamera({camera,controls,getRoot,reduced}){
  let saved=null,tween=null,active=false,held=null;
  const pose=()=>({position:camera.position.clone(),target:controls.target.clone()});
  function destination(){
    const root=getRoot(),focus=root.position.clone().add(new THREE.Vector3(0,.75,0));
    // Orbit the viewing direction 60 degrees to reveal the opposite front corner.
    const direction=new THREE.Vector3(2.4,1.8,3.5).applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/3).normalize();
    const distance=innerWidth<700?4.6:3.9;
    const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize();
    const shift=innerWidth<700?new THREE.Vector3(0,-.65,0):right.multiplyScalar(distance*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect*.38);
    const target=focus.clone().add(shift);return{position:target.clone().addScaledVector(direction,distance),target};
  }
  function move(to,restore=false){tween={from:pose(),to,start:performance.now(),duration:reduced.matches?0:850,restore};controls.enabled=false;controls.enableDamping=false;}
  function update(now){if(!tween){if(active&&held){camera.position.copy(held.position);controls.target.copy(held.target);camera.lookAt(controls.target);}return;}const t=tween.duration?Math.min(1,(now-tween.start)/tween.duration):1,e=t*t*t*(t*(t*6-15)+10);camera.position.lerpVectors(tween.from.position,tween.to.position,e);controls.target.lerpVectors(tween.from.target,tween.to.target,e);camera.lookAt(controls.target);if(t===1){const restore=tween.restore;held=tween.to;tween=null;if(restore&&saved){controls.enabled=saved.enabled;controls.enableDamping=saved.damping;saved=null;}}}
  const resize=()=>{if(active)move(destination());};window.addEventListener('resize',resize);
  return{snapshot:()=>({position:camera.position.toArray(),target:controls.target.toArray(),active,transitioning:!!tween}),open(){if(!saved)saved={...pose(),enabled:controls.enabled,damping:controls.enableDamping};active=true;move(destination());},close(immediate=false){active=false;if(!saved)return;move(saved,true);if(immediate){tween.duration=0;update(performance.now());}},update,get active(){return active;},dispose(){this.close(true);window.removeEventListener('resize',resize);}};
}
