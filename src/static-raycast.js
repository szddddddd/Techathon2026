import {MeshBVH,acceleratedRaycast,CENTER} from 'three-mesh-bvh';

// Only static, ordinary meshes opt in. Skinned/morphed geometry keeps Three's
// original raycast. Indirect BVHs never reorder the rendered index or groups.
const prepared=new WeakMap();
export function accelerateStaticRaycast(mesh){
 const g=mesh.geometry,p=g?.attributes.position;
 if(!mesh.isMesh||mesh.isSkinnedMesh||mesh.isInstancedMesh||!p||g.morphAttributes.position?.length)return mesh;
 const signature=[p,p.version,g.index,g.index?.version];
 const previous=prepared.get(g);
 if(!previous||signature.some((v,i)=>v!==previous[i])){
  const count=g.index?.count??p.count;
  if(count>=192){g.boundsTree=new MeshBVH(g,{indirect:true,strategy:CENTER,targetLeafSize:12});prepared.set(g,[p,p.version,g.index,g.index?.version]);}
  else if(g.boundsTree){delete g.boundsTree;prepared.delete(g);}
 }
 if(g.boundsTree)mesh.raycast=acceleratedRaycast;
 return mesh;
}
