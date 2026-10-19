import * as T from 'three';

/** Render copies share the exact buffers/material, originals remain for picking
 * and collision. Dynamic subtrees, transparent surfaces and mirrored transforms
 * stay on the ordinary path. No mesh simplification or distance hiding. */
export function instanceStaticScenery(root,dynamicRoots=[]){
 if(root.userData.staticInstances)return root.userData.staticInstances;
 const excluded=new Set();for(const node of dynamicRoots)node?.traverse(o=>excluded.add(o));
 root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),buckets=new Map();
 root.traverse(o=>{
  if(!o.isMesh||o.isSkinnedMesh||o.isInstancedMesh||o.children.length||excluded.has(o)||o.userData.collisionProxy||o.geometry.morphAttributes.position?.length)return;
  for(let p=o;p&&p!==root;p=p.parent)if(!p.visible)return;
  const m=o.material;if(Array.isArray(m)||m.transparent||m.opacity<1||m.alphaHash||m.isShaderMaterial||o.matrixWorld.determinant()<=0||o.onBeforeRender!==T.Object3D.prototype.onBeforeRender)return;
  const key=[o.geometry.uuid,m.uuid,o.castShadow,o.receiveShadow,o.layers.mask,o.renderOrder].join('|');
  if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);
 });
 const report={meshes:0,batches:0,instances:0,savedDraws:0};
 for(const meshes of buckets.values()){
  if(meshes.length<3)continue;
  const first=meshes[0],instances=new T.InstancedMesh(first.geometry,first.material,meshes.length);
  instances.name='Shared static scenery instances';instances.castShadow=first.castShadow;instances.receiveShadow=first.receiveShadow;instances.layers.mask=first.layers.mask;instances.renderOrder=first.renderOrder;
  meshes.forEach((mesh,i)=>{instances.setMatrixAt(i,new T.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));mesh.visible=false;mesh.userData.renderInstanced=true;});
  // Pickers keep original mesh identities and world matrices. The render-only
  // proxy must not create duplicate hits or replace a landmark click target.
  instances.raycast=()=>{};instances.computeBoundingBox();instances.computeBoundingSphere();root.add(instances);
  report.meshes+=meshes.length;report.batches++;report.instances+=meshes.length;report.savedDraws+=meshes.length-1;
 }
 root.userData.staticInstances=report;return report;
}
