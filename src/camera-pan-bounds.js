import * as THREE from 'three';
import {WORLD_BOUNDS,surfaceHeight,bankOutlines,insidePolygon} from './world-surface.js';
/** Keep the orbit point over the expanded town, including its elevated places. */
export function constrainCameraPan(controls,camera){
  const center=new THREE.Vector3(5,2.22,-4),originalUpdate=controls.update.bind(controls);
  controls.maxTargetRadius=Infinity;
  const outlines=bankOutlines();
  function supported(x,z){const poly=x<0?outlines.west:outlines.east;if(insidePolygon(poly,x,z)||Math.abs(x)<4)return{x,z};let best=null;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz))),px=a[0]+dx*t,pz=a[1]+dz*t,d=Math.hypot(px-x,pz-z);if(!best||d<best.d)best={x:px,z:pz,d};}const dx=(x<0?-9:15)-best.x,dz=-best.z,len=Math.hypot(dx,dz);return{x:best.x+dx/len*.8,z:best.z+dz/len*.8};}
  const bounds={minX:WORLD_BOUNDS.minX+4,maxX:WORLD_BOUNDS.maxX-4,minZ:WORLD_BOUNDS.minZ+8,maxZ:WORLD_BOUNDS.maxZ-3};
  controls.update=(...args)=>{const result=originalUpdate(...args);if(controls.enabled){const old=controls.target.clone(),x=THREE.MathUtils.clamp(old.x,bounds.minX,bounds.maxX),z=THREE.MathUtils.clamp(old.z,bounds.minZ,bounds.maxZ);const p=supported(x,z),floor=surfaceHeight(p.x,p.z);controls.target.set(p.x,THREE.MathUtils.clamp(old.y,floor+.1,floor+1.8),p.z);camera.position.add(controls.target.clone().sub(old));camera.lookAt(controls.target);}return result;};
  return{snapshot(){camera.updateMatrixWorld(true);return{enabled:controls.enabled,target:controls.target.toArray(),center:center.toArray(),bounds,offset:controls.target.distanceTo(center),limit:Math.hypot(bounds.maxX-center.x,bounds.minZ-center.z),projected:center.clone().project(camera).toArray()};},dispose(){controls.update=originalUpdate;}};
}
