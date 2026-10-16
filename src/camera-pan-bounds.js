import * as THREE from 'three';
import {WORLD_BOUNDS} from './world-surface.js';
/** Keep the orbit point over the expanded town, including its elevated places. */
export function constrainCameraPan(controls,camera){
  const center=new THREE.Vector3(5,2.22,-4),originalUpdate=controls.update.bind(controls),old=new THREE.Vector3(),correction=new THREE.Vector3();
  controls.maxTargetRadius=Infinity;
  // Pan on a fixed horizontal plane. Following terrain height or projecting onto
  // a concave bank outline makes the view snap when crossing a slope or inlet.
  controls.screenSpacePanning=false;
  const bounds={minX:WORLD_BOUNDS.minX+4,maxX:WORLD_BOUNDS.maxX-4,minZ:WORLD_BOUNDS.minZ+8,maxZ:WORLD_BOUNDS.maxZ-3};
  controls.update=(...args)=>{const result=originalUpdate(...args);if(controls.enabled){old.copy(controls.target);controls.target.x=THREE.MathUtils.clamp(old.x,bounds.minX,bounds.maxX);controls.target.z=THREE.MathUtils.clamp(old.z,bounds.minZ,bounds.maxZ);correction.subVectors(controls.target,old);if(correction.lengthSq()>0){camera.position.add(correction);camera.lookAt(controls.target);}}return result;};
  return{snapshot(){camera.updateMatrixWorld(true);return{enabled:controls.enabled,target:controls.target.toArray(),center:center.toArray(),bounds,offset:controls.target.distanceTo(center),limit:Math.hypot(bounds.maxX-center.x,bounds.minZ-center.z),projected:center.clone().project(camera).toArray()};},dispose(){controls.update=originalUpdate;}};
}
