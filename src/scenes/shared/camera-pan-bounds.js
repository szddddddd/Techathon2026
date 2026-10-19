import * as THREE from 'three';
import {WORLD_BOUNDS} from './world-surface.js';
/** Keep the orbit point over the expanded town, including its elevated places. */
export function constrainCameraPan(controls,camera,{getBounds=()=>WORLD_BOUNDS}={}){
  const center=new THREE.Vector3(5,2.22,-4),originalUpdate=controls.update.bind(controls),old=new THREE.Vector3(),correction=new THREE.Vector3();
  controls.maxTargetRadius=Infinity;
  // Pan on a fixed horizontal plane. Following terrain height or projecting onto
  // a concave bank outline makes the view snap when crossing a slope or inlet.
  controls.screenSpacePanning=false;
  const bounds={};
  function refreshBounds(){const b=getBounds();Object.assign(bounds,{minX:b.minX+4,maxX:b.maxX-4,minZ:b.minZ+8,maxZ:b.maxZ-3});}refreshBounds();
  controls.update=(...args)=>{refreshBounds();const result=originalUpdate(...args);if(controls.enabled){old.copy(controls.target);controls.target.x=THREE.MathUtils.clamp(old.x,bounds.minX,bounds.maxX);controls.target.z=THREE.MathUtils.clamp(old.z,bounds.minZ,bounds.maxZ);correction.subVectors(controls.target,old);if(correction.lengthSq()>0){camera.position.add(correction);camera.lookAt(controls.target);}}return result;};
  return{snapshot(){camera.updateMatrixWorld(true);return{enabled:controls.enabled,target:controls.target.toArray(),center:center.toArray(),bounds,offset:controls.target.distanceTo(center),limit:Math.hypot(bounds.maxX-center.x,bounds.minZ-center.z),projected:center.clone().project(camera).toArray()};},dispose(){controls.update=originalUpdate;}};
}
