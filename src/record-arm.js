import * as THREE from 'three';

// Measured in the archived Rodin GLB's authoring coordinates. Lift only the
// elevated tonearm triangles; retain the turntable, spindle and cabinet.
export function createRecordArm(model){
  const pivot=new THREE.Group();pivot.name='Animated Rodin tonearm';
  pivot.position.set(.56,-.095,-.09);
  const sources=[];model.traverse(o=>{if(o.isMesh)sources.push(o);});
  let triangles=0;
  for(const mesh of sources){
    const geometry=mesh.geometry,index=geometry.index,position=geometry.attributes.position;
    const moving=[],fixed=[];
    for(let i=0;i<(index?.count||position.count);i+=3){
      const ids=[0,1,2].map(k=>index?index.getX(i+k):i+k);
      const x=ids.reduce((n,id)=>n+position.getX(id),0)/3,y=ids.reduce((n,id)=>n+position.getY(id),0)/3,z=ids.reduce((n,id)=>n+position.getZ(id),0)/3;
      const arm=x>.16&&x<.69&&z>-.19&&z<.43&&y>-.102&&y<.05;
      (arm?moving:fixed).push(...ids);
    }
    if(!moving.length)continue;
    const armGeometry=geometry.clone();armGeometry.setIndex(moving);armGeometry.translate(-pivot.position.x,-pivot.position.y,-pivot.position.z);armGeometry.computeBoundingSphere();
    const arm=new THREE.Mesh(armGeometry,mesh.material);arm.castShadow=true;arm.receiveShadow=true;arm.userData.generatedProp=true;pivot.add(arm);
    // Object3D.clone shares geometry with the cached model and other scenes.
    // Split only this instance so later scene entries retain the original arm.
    const fixedGeometry=geometry.clone();fixedGeometry.setIndex(fixed);fixedGeometry.computeBoundingSphere();mesh.geometry=fixedGeometry;triangles+=moving.length/3;
  }
  model.add(pivot);
  const axis=new THREE.Vector3(-.43,0,-.34).normalize();
  let lift=.23,velocity=0;
  return {update(dt,playing,reduced){
    const target=playing?0:.23;
    if(reduced){lift=target;velocity=0;}else{
      dt=Math.min(Math.max(dt||0,0),.1);const omega=4,error=lift-target,b=velocity+omega*error,e=Math.exp(-omega*dt);
      lift=target+(error+b*dt)*e;velocity=(velocity-omega*b*dt)*e;
      if(Math.abs(lift-target)<.0001&&Math.abs(velocity)<.0005){lift=target;velocity=0;}
    }
    pivot.quaternion.setFromAxisAngle(axis,lift);
  },snapshot:()=>({lift,velocity,triangles})};
}
