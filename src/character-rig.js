import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {createRigProfile,validateRigProfile,RIG_VERSION} from './character-rig-profile.js';
const templates=new Map(),diagnostics=new Map(),listeners=new Set();let worker,sequence=0,dbPromise;
const pending=new Map();
export const rigStatus=id=>diagnostics.get(id);
export function subscribeRigStatus(fn){listeners.add(fn);return()=>listeners.delete(fn);}
export function setRigStatus(id,value){diagnostics.set(id,value);for(const fn of listeners)fn(id,value);}
function database(){return dbPromise??=new Promise(resolve=>{if(!globalThis.indexedDB)return resolve(null);const request=indexedDB.open('forest-character-rigs',1);request.onupgradeneeded=()=>request.result.createObjectStore('rigs');request.onsuccess=()=>resolve(request.result);request.onerror=()=>resolve(null);});}
async function cacheGet(key){const db=await database();if(!db)return null;return new Promise(resolve=>{const req=db.transaction('rigs').objectStore('rigs').get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null);});}
async function cachePut(key,value){const db=await database();if(!db)return;await new Promise(resolve=>{const tx=db.transaction('rigs','readwrite');tx.objectStore('rigs').put(value,key);tx.oncomplete=tx.onerror=tx.onabort=()=>resolve();});}
async function invalidateRig(hash){await Promise.all([...templates].map(async([key,promise])=>{try{const template=await promise;if(template.userData.characterRig.hash===hash&&templates.get(key)===promise)templates.delete(key);}catch{}}));window.dispatchEvent(new CustomEvent('character-rig-corrected',{detail:{hash}}));}
const correctionChannel=typeof window!=='undefined'&&typeof BroadcastChannel!=='undefined'?new BroadcastChannel('forest-character-rig-corrections'):null;
if(correctionChannel)correctionChannel.onmessage=event=>{if(typeof event.data?.hash==='string')invalidateRig(event.data.hash);};
export async function saveRigCorrection(hash,profile){validateRigProfile(profile);await cachePut('correction:'+hash,profile);await invalidateRig(hash);correctionChannel?.postMessage({hash});}
export async function rigDigest(bytes){const hash=globalThis.crypto?.subtle?await crypto.subtle.digest('SHA-256',bytes):(await import('@noble/hashes/sha256')).sha256(new Uint8Array(bytes));return Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('');}
export function runRigWorker(meshes,profile,automatic=false){
 if(!worker){worker=new Worker(new URL('../dist/rig-worker.js',document.baseURI));worker.onmessage=({data})=>{const task=pending.get(data.id);if(!task)return;pending.delete(data.id);clearTimeout(task.timer);data.error?task.reject(Error(data.error)):task.resolve(data.result);};worker.onerror=()=>{for(const task of pending.values()){clearTimeout(task.timer);task.reject(Error('绑定计算失败，请在检查页校正。'));}pending.clear();worker.terminate();worker=null;};}
 return new Promise((resolve,reject)=>{const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(Error('绑定计算超时，请在检查页校正。'));},30000),copy=meshes.map(m=>({positions:m.positions.slice()}));pending.set(id,{resolve,reject,timer});worker.postMessage({id,meshes:copy,profile,automatic},copy.map(m=>m.positions.buffer));});
}
/** Bake only static node transforms; positions, topology and UVs are retained. */
export function normalizeRigModel(source){
 source.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(source,true),height=box.max.y-box.min.y;
 if(!Number.isFinite(height)||height<1e-5)throw Error('模型没有有效的完整身体尺寸。');
 const center=box.getCenter(new THREE.Vector3()),normalizer=new THREE.Matrix4().makeScale(1/height,1/height,1/height).multiply(new THREE.Matrix4().makeTranslation(-center.x,-box.min.y,-center.z)),root=new THREE.Group(),meshes=[];
 source.traverse(o=>{if(!o.isMesh)return;const geometry=o.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(normalizer,o.matrixWorld)),mesh=new THREE.Mesh(geometry,o.material);mesh.name=o.name;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);meshes.push({positions:geometry.attributes.position.array,source:o,mesh});});
 return{root,meshes,normalizer};
}
const alias={hips:['hips','pelvis'],spine:['spine','spine01'],chest:['spine1','spine2','chest','upperchest'],neck:['neck','neck1'],head:['head'],upperArmL:['leftarm','leftupperarm','upperarml'],forearmL:['leftforearm','leftlowerarm','lowerarml'],handL:['lefthand','handl'],upperArmR:['rightarm','rightupperarm','upperarmr'],forearmR:['rightforearm','rightlowerarm','lowerarmr'],handR:['righthand','handr'],thighL:['leftupleg','leftupperleg','thighl'],calfL:['leftleg','leftlowerleg','calfl'],footL:['leftfoot','footl'],toeL:['lefttoebase','lefttoes','toel'],thighR:['rightupleg','rightupperleg','thighr'],calfR:['rightleg','rightlowerleg','calfr'],footR:['rightfoot','footr'],toeR:['righttoebase','righttoes','toer']};
function existingRig(source,normalized){
 const skinned=[];source.traverse(o=>{if(o.isSkinnedMesh)skinned.push(o);});if(!skinned.length)return null;
 const skeleton=skinned[0].skeleton,bones={};for(const bone of skeleton.bones){const name=bone.name.toLowerCase().replace(/mixamorig\d*[:_]?/,'').replace(/[^a-z0-9]/g,'');for(const [role,names] of Object.entries(alias))if(names.includes(name)||name===role.toLowerCase())bones[role]=bone;}
 const required=['hips','spine','chest','neck','head',...['L','R'].flatMap(s=>['upperArm','forearm','hand','thigh','calf','foot'].map(n=>n+s))];if(required.some(n=>!bones[n]))return{status:'attention',diagnostics:{reason:'已有骨骼缺少可识别的完整双足关节映射。'}};
 const profile=createRigProfile('humanoid');for(const j of profile.joints){const b=bones[j.name];if(b)j.position=b.getWorldPosition(new THREE.Vector3()).applyMatrix4(normalized.normalizer).toArray();}
 for(const s of ['L','R'])if(!bones['toe'+s]){const foot=profile.joints.find(j=>j.name==='foot'+s);profile.joints.find(j=>j.name==='toe'+s).position=[foot.position[0],foot.position[1]-.02,foot.position[2]+.06];}
 profile.config.hips=profile.joints.find(j=>j.name==='hips').position[1];profile.config.ankle=profile.joints.find(j=>j.name==='footL').position[1];profile.config.center=[profile.joints[1].position[0],profile.joints[1].position[2]];profile.config.hipWidth=Math.abs(profile.joints.find(j=>j.name==='thighL').position[0]-profile.config.center[0]);
 const shoulder=profile.joints.find(j=>j.name==='upperArmL').position,elbow=profile.joints.find(j=>j.name==='forearmL').position;profile.config.shoulder=shoulder.slice();profile.config.elbow=elbow.slice();profile.config.hand=profile.joints.find(j=>j.name==='handL').position.slice();profile.config.tPose=Math.abs(shoulder[1]-elbow[1])<.045&&Math.abs(shoulder[0]-elbow[0])>.1;
 return{profile,bones,skeleton};
}
export async function prepareRigModel(source,{animal='custom',hash='',profile:correction=null,force=false}={}){
 const normalized=normalizeRigModel(source),{root,meshes}=normalized;
 const cachedCorrection=hash&&await cacheGet('correction:'+hash),stored=correction||(cachedCorrection?.version===RIG_VERSION?cachedCorrection:null);let profile=stored||createRigProfile(animal==='custom'?'humanoid':animal),result,imported;
 if(animal==='custom'&&!stored)imported=existingRig(source,normalized);
 if(imported?.status==='attention')result=imported;
 if(imported?.profile)profile=imported.profile;
 const key='rig:'+RIG_VERSION+':'+hash+':'+await rigDigest(new TextEncoder().encode(JSON.stringify(profile)));
 if(!result&&!force&&hash)result=await cacheGet(key);
 if(!result&&animal!=='custom'&&!stored&&!force){try{
  const response=await fetch(`assets/character-rigs/${animal}/rig.json`);if(!response.ok)throw Error();const meta=await response.json();if(meta.sourceHash!==hash||meta.version!==RIG_VERSION)throw Error();const bytes=await (await fetch(`assets/character-rigs/${animal}/weights.bin`)).arrayBuffer();
  result={...meta,status:'ready',meshes:meta.meshes.map(m=>({skinIndex:new Uint16Array(bytes.slice(m.skinIndex.offset,m.skinIndex.offset+m.skinIndex.length*2)),skinWeight:new Float32Array(bytes.slice(m.skinWeight.offset,m.skinWeight.offset+m.skinWeight.length*4)),witnesses:new Uint32Array(bytes.slice(m.witnesses.offset,m.witnesses.offset+m.witnesses.length*4))}))};
 }catch{/* Missing or stale prebake is recomputed using the same authored profile. */}}
 if(!result){try{result=await runRigWorker(meshes,profile,animal==='custom'&&!stored&&!imported);if(imported&&result.status==='ready'){
   const roles=new Map(Object.entries(imported.bones).map(([n,b])=>[b,n]));
   meshes.forEach(({source:o},i)=>{if(!o.isSkinnedMesh)throw Error('已有骨骼模型包含未绑定的身体网格，需要校正。');const si=o.geometry.attributes.skinIndex,sw=o.geometry.attributes.skinWeight;if(!si||!sw)throw Error('缺少蒙皮权重。');const target=result.meshes[i];for(let v=0;v<si.count;v++){const pairs=new Map();for(let k=0;k<4;k++){let bone=o.skeleton.bones[si.getComponent(v,k)];while(bone&&!roles.has(bone))bone=bone.parent;const name=roles.get(bone)||'hips',id=profile.joints.findIndex(j=>j.name===name);pairs.set(id,(pairs.get(id)||0)+sw.getComponent(v,k));}target.skinWeight.fill(0,v*4,v*4+4);let k=0;const sum=[...pairs.values()].reduce((a,b)=>a+b,0);if(sum<.99||sum>1.01)throw Error('原始蒙皮权重未归一化。');for(const [id,w] of pairs){target.skinIndex[v*4+k]=id;target.skinWeight[v*4+k]=w/sum;k++;}}});result.diagnostics.reason='复用已有骨骼关节与蒙皮权重';
  }if(hash)await cachePut(key,result);
 }catch(error){result={status:'attention',profile,diagnostics:{reason:error.message}};}}
 if(result.status==='ready'){
  const bones=result.profile.joints.map(j=>{const b=new THREE.Bone();b.name=j.name;return b;});
  result.profile.joints.forEach((j,i)=>{const parent=result.profile.joints.findIndex(p=>p.name===j.parent);bones[i].position.fromArray(j.position);if(parent>=0){bones[i].position.sub(new THREE.Vector3().fromArray(result.profile.joints[parent].position));bones[parent].add(bones[i]);}else root.add(bones[i]);});
  root.updateMatrixWorld(true);const skeleton=new THREE.Skeleton(bones);skeleton.calculateInverses();
  meshes.forEach(({mesh},i)=>{const data=result.meshes[i];if(data.skinIndex.length!==mesh.geometry.attributes.position.count*4)throw Error('蒙皮资源与模型顶点数量不一致。');mesh.geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(data.skinIndex,4));mesh.geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(data.skinWeight,4));mesh.geometry.userData.rigWitnesses=Array.from(data.witnesses);const skin=new THREE.SkinnedMesh(mesh.geometry,mesh.material);skin.name=mesh.name;skin.castShadow=skin.receiveShadow=true;root.remove(mesh);root.add(skin);skin.bind(skeleton,new THREE.Matrix4());skin.frustumCulled=false;});
 }
 root.userData.characterRig={status:result.status,hash,profileHash:await rigDigest(new TextEncoder().encode(JSON.stringify(result.profile||profile))),version:RIG_VERSION,profile:result.profile||profile,diagnostics:result.diagnostics};return root;
}
export function cloneRigModel(model){return cloneSkeleton(model);}
export async function loadRiggedCharacter(url,{animal='custom'}={}){
 const key=url+'|'+animal;if(!templates.has(key))templates.set(key,(async()=>{const response=await fetch(url);if(!response.ok)throw Error('角色模型加载失败');const bytes=await response.arrayBuffer(),hash=await rigDigest(bytes),source=await new GLTFLoader().parseAsync(bytes,new URL('.',new URL(url,document.baseURI)).href);return prepareRigModel(source.scene,{animal,hash});})().catch(error=>{templates.delete(key);throw error;}));
 return templates.get(key);
}

/** Only call after all instances of a replaced template have been detached. */
export function disposeRigTemplate(template){const resources=new Set();template.traverse(o=>{if(o.isSkinnedMesh)resources.add(o.skeleton);if(!o.isMesh)return;resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value);}});for(const resource of resources)resource.dispose();}
