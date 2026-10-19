import * as THREE from 'three';

export const TREE_VARIANTS={tree_birch:'silver_birch',tree_maple:'field_maple'};
export const isTree=kind=>kind==='tree'||Object.hasOwn(TREE_VARIANTS,kind);
export const treeAssetPath=kind=>Object.hasOwn(TREE_VARIANTS,kind)?`assets/rodin-trees/${TREE_VARIANTS[kind]}/scene.glb`:`assets/rodin/${kind}/scene.glb`;
const foliageMaps=new WeakMap();

/** Lift the generated olive foliage into the scene's pale sage palette, retaining bark. */
export function lightTreeFoliage(map){
  if(!map?.image)return map;if(foliageMaps.has(map))return foliageMaps.get(map);
  const canvas=document.createElement('canvas');canvas.width=map.image.width;canvas.height=map.image.height;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(map.image,0,0);
  const image=ctx.getImageData(0,0,canvas.width,canvas.height),p=image.data;
  for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],leaf=THREE.MathUtils.smoothstep(g/Math.max(1,r),.84,.98)*THREE.MathUtils.smoothstep(g/Math.max(1,b),1.01,1.14),amount=leaf*.60;
    p[i]=r+(184-r)*amount;p[i+1]=g+(198-g)*amount;p[i+2]=b+(145-b)*amount;
  }
  ctx.putImageData(image,0,0);const texture=map.clone();texture.image=canvas;texture.needsUpdate=true;foliageMaps.set(map,texture);return texture;
}

/** Conform only the roots to the actual slope; keep trunks upright. One-time edit. */
export function groundTree(group,sample){
  group.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(group),height=bounds.max.y-bounds.min.y,base=group.position.y;
  const point=new THREE.Vector3(),inverse=new THREE.Matrix4();
  group.traverse(mesh=>{
    if(!mesh.isMesh)return;
    const geometry=mesh.geometry.clone(),positions=geometry.attributes.position;
    inverse.copy(mesh.matrixWorld).invert();
    for(let i=0;i<positions.count;i++){
      point.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld);
      const h=(point.y-bounds.min.y)/height,weight=1-THREE.MathUtils.smoothstep(h,.035,.18);
      if(weight<=0)continue;
      point.y+=(sample(point.x,point.z).height-base-.045)*weight;
      point.applyMatrix4(inverse);positions.setXYZ(i,point.x,point.y,point.z);
    }
    positions.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();mesh.geometry=geometry;
  });
  group.userData.groundedRoots=true;
}
