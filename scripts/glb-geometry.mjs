import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';

// Geometry-only glTF 2.0 reader for repeatable Node layout checks: no DOM, textures or GPU.
// Unsupported compression/skinning fails explicitly rather than silently producing fake bounds.
export async function loadGeometryGLB(filename) {
  const bytes=await fs.readFile(filename);
  if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2)throw new Error(`Not a glTF 2 GLB: ${filename}`);
  let json,bin;
  for(let offset=12;offset+8<=bytes.length;){
    const length=bytes.readUInt32LE(offset),type=bytes.readUInt32LE(offset+4),chunk=bytes.subarray(offset+8,offset+8+length);
    if(type===0x4e4f534a)json=JSON.parse(chunk.toString('utf8').trim());
    if(type===0x004e4942)bin=chunk;
    offset+=length+8;
  }
  if(!json)throw new Error(`Missing GLB JSON: ${filename}`);
  const buffers=await Promise.all((json.buffers||[]).map(async (b,i)=>{
    if(!b.uri){if(i===0&&bin)return bin;throw new Error(`Missing buffer ${i}`);}
    if(b.uri.startsWith('data:'))return Buffer.from(b.uri.slice(b.uri.indexOf(',')+1),'base64');
    return fs.readFile(path.resolve(path.dirname(filename),b.uri));
  }));
  const components={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16};
  const types={5120:[1,'getInt8'],5121:[1,'getUint8'],5122:[2,'getInt16'],5123:[2,'getUint16'],5125:[4,'getUint32'],5126:[4,'getFloat32']};
  function read(viewIndex,offset,count,itemSize,componentType,strideOverride){
    const view=json.bufferViews[viewIndex];if(!view)throw new Error(`Missing bufferView ${viewIndex}`);
    if(view.extensions?.EXT_meshopt_compression)throw new Error('Meshopt compressed geometry requires a decoder; audit aborted.');
    const source=buffers[view.buffer],data=new DataView(source.buffer,source.byteOffset,source.byteLength);
    const [size,method]=types[componentType]||[];if(!size)throw new Error(`Unsupported component type ${componentType}`);
    const output=new Float64Array(count*itemSize),start=(view.byteOffset||0)+offset,stride=strideOverride||view.byteStride||size*itemSize;
    for(let i=0;i<count;i++)for(let k=0;k<itemSize;k++)output[i*itemSize+k]=data[method](start+i*stride+k*size,true);
    return output;
  }
  function accessor(index){
    const a=json.accessors[index];if(!a)throw new Error(`Missing accessor ${index}`);
    const itemSize=components[a.type];let values=a.bufferView===undefined?new Float64Array(a.count*itemSize):read(a.bufferView,a.byteOffset||0,a.count,itemSize,a.componentType);
    if(a.sparse){const s=a.sparse,idx=read(s.indices.bufferView,s.indices.byteOffset||0,s.count,1,s.indices.componentType),v=read(s.values.bufferView,s.values.byteOffset||0,s.count,itemSize,a.componentType);for(let i=0;i<s.count;i++)for(let k=0;k<itemSize;k++)values[idx[i]*itemSize+k]=v[i*itemSize+k];}
    if(a.normalized&&a.componentType!==5126){const divisor={5120:127,5121:255,5122:32767,5123:65535,5125:4294967295}[a.componentType];values=values.map(v=>Math.max(-1,v/divisor));}
    return {values,itemSize,count:a.count};
  }
  const material=new THREE.MeshBasicMaterial({color:0xaaaaaa,side:THREE.DoubleSide});
  const meshSources=(json.meshes||[]).map((m,mi)=>{
    const group=new THREE.Group();group.name=m.name||`GLB mesh ${mi}`;
    for(const [pi,p] of m.primitives.entries()){
      if(p.extensions?.KHR_draco_mesh_compression)throw new Error('Draco compressed geometry requires a decoder; audit aborted.');
      if(p.mode!==undefined&&p.mode!==4)throw new Error(`Unsupported GLB primitive mode ${p.mode}`);
      if(p.targets?.length)throw new Error('Morph target geometry is not supported by the static audit.');
      const pos=accessor(p.attributes.POSITION),geometry=new THREE.BufferGeometry();
      geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos.values,pos.itemSize));
      if(p.indices!==undefined)geometry.setIndex(Array.from(accessor(p.indices).values));
      geometry.computeBoundingBox();const mesh=new THREE.Mesh(geometry,material);mesh.name=`${group.name} primitive ${pi}`;group.add(mesh);
    }return group;
  });
  const nodes=(json.nodes||[]).map((n,i)=>{
    if(n.skin!==undefined)throw new Error('Skinned geometry is not supported by the static audit.');
    const object=n.mesh===undefined?new THREE.Group():meshSources[n.mesh].clone(true);object.name=n.name||`GLB node ${i}`;
    if(n.matrix){object.matrix.fromArray(n.matrix);object.matrix.decompose(object.position,object.quaternion,object.scale);}
    else{if(n.translation)object.position.fromArray(n.translation);if(n.rotation)object.quaternion.fromArray(n.rotation);if(n.scale)object.scale.fromArray(n.scale);}
    return object;
  });
  (json.nodes||[]).forEach((n,i)=>(n.children||[]).forEach(j=>nodes[i].add(nodes[j])));
  const model=new THREE.Group();model.name=`Geometry-only ${path.basename(path.dirname(filename))}`;
  const scene=json.scenes?.[json.scene||0];
  if(scene)(scene.nodes||[]).forEach(i=>model.add(nodes[i]));else nodes.filter(n=>!n.parent).forEach(n=>model.add(n));
  model.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(model,true),size=bounds.getSize(new THREE.Vector3());
  if(bounds.isEmpty()||!Number.isFinite(size.y)||size.y<=0)throw new Error(`Invalid model bounds: ${filename}`);
  return {model,bounds,size,filename};
}

export function worldVertices(object) {
  object.updateWorldMatrix(true,true);const result=[],point=new THREE.Vector3();
  object.traverse(node=>{if(!node.isMesh||!node.geometry?.attributes.position)return;const a=node.geometry.attributes.position;for(let i=0;i<a.count;i++){point.fromBufferAttribute(a,i).applyMatrix4(node.matrixWorld);result.push(point.clone());}});
  return result;
}
