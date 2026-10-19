import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import * as THREE from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {createRigProfile} from '../src/characters/character-rig-profile.js';
import {buildRigWeights} from '../src/characters/character-rig-weights.js';
for(const animal of ['kangaroo','fox','rabbit','bear']){
 const file=`assets/rodin-friends/${animal}/scene.glb`,{model,bounds,size}=await loadGeometryGLB(file),center=bounds.getCenter(new THREE.Vector3()),meshes=[];
 model.traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position,p=new THREE.Vector3(),positions=new Float32Array(a.count*3);for(let i=0;i<a.count;i++){p.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);p.set((p.x-center.x)/size.y,(p.y-bounds.min.y)/size.y,(p.z-center.z)/size.y).toArray(positions,i*3);}meshes.push({positions});});
 const profile=createRigProfile(animal),result=buildRigWeights(meshes,profile),chunks=[],layout=[];let offset=0;
 for(const mesh of result.meshes){const entry={};for(const key of ['skinIndex','skinWeight','witnesses']){const data=mesh[key],buffer=Buffer.from(data.buffer,data.byteOffset,data.byteLength);entry[key]={offset,length:data.length};chunks.push(buffer);offset+=buffer.length;}layout.push(entry);}
 const dir=`assets/character-rigs/${animal}`;await fs.mkdir(dir,{recursive:true});
 await fs.writeFile(dir+'/weights.bin',Buffer.concat(chunks));await fs.writeFile(dir+'/rig.json',JSON.stringify({version:result.version,sourceHash:crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),profile,diagnostics:result.diagnostics,meshes:layout},null,2));
 console.log(animal,JSON.stringify({bytes:offset,vertices:result.diagnostics.vertices,witnesses:result.meshes.map(m=>m.witnesses.length),joints:profile.joints.length}));
}
