// Scene-local AABBs are independent of the render meshes and remain live after batching.
export function buildingBlocks(terrain,x,z,radius=0){
 for(const b of terrain.buildingColliders?.values()||[]){
  const dx=Math.max(b.minX-x,0,x-b.maxX),dz=Math.max(b.minZ-z,0,z-b.maxZ);
  if(dx*dx+dz*dz<=(radius+.08)**2)return true;
 }
 return false;
}
export function buildingBlocksStep(terrain,from,to,radius=0){
 // Segment against radius-expanded rectangles prevents crossing a thin box in one step.
 for(const b of terrain.buildingColliders?.values()||[]){
  let lo=0,hi=1;const pad=radius+.08;
  for(const [a,d,min,max] of [[from.x,to.x-from.x,b.minX-pad,b.maxX+pad],[from.z,to.z-from.z,b.minZ-pad,b.maxZ+pad]]){
   if(Math.abs(d)<1e-10){if(a<min||a>max){hi=-1;break;}continue;}
   const t1=(min-a)/d,t2=(max-a)/d;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));
  }
  if(lo<=hi)return true;
 }
 return false;
}
