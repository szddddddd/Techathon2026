import * as T from 'three';

// Static X/Z grid for repeated downward terrain rays. Each candidate still uses
// Three's exact triangle intersection and the source material's face culling.
export function createVerticalSurfaceSampler(objects){
  const cellSize=1.5,cells=new Map(),triangles=[],sides=[];
  const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
  const meshes=[];
  for(const root of objects){root.updateWorldMatrix(true,true);root.traverse(o=>{if(o.isMesh)meshes.push(o);});}
  // Keep the original ray semantics for dynamic or multi-material geometry.
  if(meshes.some(m=>m.isSkinnedMesh||m.morphTargetInfluences?.length||Array.isArray(m.material))){
    const ray=new T.Raycaster();return(x,z)=>{ray.set(new T.Vector3(x,30,z),new T.Vector3(0,-1,0));return ray.intersectObjects(objects,true)[0]?.point.y??-Infinity;};
  }
  for(const mesh of meshes){
    const geometry=mesh.geometry,position=geometry.attributes.position,index=geometry.index;
    const start=geometry.drawRange.start,end=Math.min(index?.count??position.count,start+geometry.drawRange.count);
    for(let i=start;i+2<end;i+=3){
      a.fromBufferAttribute(position,index?index.getX(i):i).applyMatrix4(mesh.matrixWorld);
      b.fromBufferAttribute(position,index?index.getX(i+1):i+1).applyMatrix4(mesh.matrixWorld);
      c.fromBufferAttribute(position,index?index.getX(i+2):i+2).applyMatrix4(mesh.matrixWorld);
      const id=sides.length;sides.push(mesh.material.side);triangles.push(...a.toArray(),...b.toArray(),...c.toArray());
      const minX=Math.floor(Math.min(a.x,b.x,c.x)/cellSize),maxX=Math.floor(Math.max(a.x,b.x,c.x)/cellSize);
      const minZ=Math.floor(Math.min(a.z,b.z,c.z)/cellSize),maxZ=Math.floor(Math.max(a.z,b.z,c.z)/cellSize);
      for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++){
        const key=x+','+z;let bucket=cells.get(key);if(!bucket)cells.set(key,bucket=[]);bucket.push(id);
      }
    }
  }
  const vertices=new Float64Array(triangles),ray=new T.Ray(new T.Vector3(),new T.Vector3(0,-1,0)),point=new T.Vector3();
  return(x,z)=>{
    const candidates=cells.get(Math.floor(x/cellSize)+','+Math.floor(z/cellSize));if(!candidates)return -Infinity;
    ray.origin.set(x,30,z);let highest=-Infinity;
    for(const id of candidates){
      a.fromArray(vertices,id*9);b.fromArray(vertices,id*9+3);c.fromArray(vertices,id*9+6);
      const hit=sides[id]===T.BackSide?ray.intersectTriangle(c,b,a,true,point):ray.intersectTriangle(a,b,c,sides[id]!==T.DoubleSide,point);
      if(hit)highest=Math.max(highest,hit.y);
    }
    return highest;
  };
}
