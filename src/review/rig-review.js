import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {createRigFixture} from '../characters/character-rig-fixtures.js';
import * as THREE from 'three';
import {prepareRigModel,cloneRigModel,rigDigest,saveRigCorrection} from '../characters/character-rig.js';
import {validateRigProfile} from '../characters/character-rig-profile.js';
import {createCharacterActions} from '../characters/character-actions.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const $=id=>document.getElementById(id),stage=$('stage'),renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;stage.append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#e2e9d8');const camera=new THREE.PerspectiveCamera(32,1,.01,100),controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.52,0);
scene.add(new THREE.HemisphereLight(0xe8f3e5,0x6d7c5a,2.1));const sun=new THREE.DirectionalLight(0xfff1d8,2.8);sun.position.set(-3,5,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-2,right:2,top:2,bottom:-2,near:.1,far:20});scene.add(sun);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshStandardMaterial({color:0xd0dcb9,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.005;floor.receiveShadow=true;scene.add(floor);
let model,animal='kangaroo',ready=false,actions,holder,poseRoot,helper,source,hash,profile,clock=0,phase=0,last=performance.now(),pose;
const markers=['L','R'].map(()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.012,10,6),new THREE.MeshBasicMaterial({color:0x237cdb,depthTest:false}));m.renderOrder=10;scene.add(m);return m;});
function resize(){renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();
function view(name){camera.position.set(...({front:[0,.65,2.65],side:[2.65,.65,0],back:[0,.65,-2.65]}[name]));controls.target.set(0,.50,0);controls.update();}
for(const name of ['front','side','back'])$(name).onclick=()=>view(name);
function jointUI(){const joint=profile.joints.find(j=>j.name===$('joint').value);if(joint)['x','y','z'].forEach((axis,i)=>$('joint-'+axis).value=joint.position[i]);}
async function bind(correction){ready=false;const template=await prepareRigModel(source,{animal,hash,profile:correction,force:!!correction});
 if(holder){actions.dispose();holder.removeFromParent();helper.geometry.dispose();helper.material.dispose();helper.removeFromParent();model.traverse(o=>{if(o.isMesh)o.geometry.dispose();});}
 model=cloneRigModel(template);holder=new THREE.Group();poseRoot=new THREE.Group();poseRoot.add(model);holder.add(poseRoot);scene.add(holder);actions=createCharacterActions({body:model,poseRoot,holder,animal,height:1,id:'review-'+animal});helper=new THREE.SkeletonHelper(model);helper.material.depthTest=false;helper.renderOrder=9;scene.add(helper);profile=structuredClone(template.userData.characterRig.profile);$('joint').replaceChildren(...profile.joints.map(j=>{const o=document.createElement('option');o.value=o.textContent=j.name;return o;}));jointUI();$('weights').value=JSON.stringify(profile.overrides||[],null,2);clock=phase=0;ready=true;$('status').textContent=actions.ready?'骨骼已就绪':'骨骼待校正';$('diagnostics').textContent=JSON.stringify(template.userData.characterRig.diagnostics,null,2);
}
async function load(value){animal=value;ready=false;const bytes=await(await fetch('assets/rodin-friends/'+value+'/scene.glb')).arrayBuffer();hash=await rigDigest(bytes);source=(await new GLTFLoader().parseAsync(bytes,'')).scene;await bind();view('front');}
function guard(fn){return async()=>{try{await fn();}catch(e){$('status').textContent=e.message;console.error(e);}};}
$('animal').onchange=guard(()=>load($('animal').value));$('joint').onchange=jointUI;
$('rebind').onclick=guard(async()=>{profile.joints.find(j=>j.name===$('joint').value).position=['x','y','z'].map(a=>Number($('joint-'+a).value));validateRigProfile(profile);await bind(profile);});
$('apply-weights').onclick=guard(async()=>{profile.overrides=JSON.parse($('weights').value);await bind(profile);});
$('export-rig').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({hash,profile},null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=animal+'-rig.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('import-rig').onchange=guard(async()=>{const data=JSON.parse(await $('import-rig').files[0].text());if(data.hash&&data.hash!==hash)throw Error('配置与模型内容哈希不同');await bind(validateRigProfile(data.profile||data));});
$('save-rig').onclick=guard(async()=>{await saveRigCorrection(hash,profile);$('status').textContent='已保存；主场景中的此模型将原位更新';});
$('model-file').onchange=guard(async()=>{const bytes=await $('model-file').files[0].arrayBuffer();hash=await rigDigest(bytes);source=(await new GLTFLoader().parseAsync(bytes,'')).scene;animal='custom';await bind();});
$('state').onchange=()=>{clock=phase=0;actions?.reset();};
function step(dt){clock+=dt*1000;const state=$('state').value,moving=state==='walk'||state==='travel';phase+=moving?dt*.25*17:0;pose=actions.update({now:clock,dt,status:state&&state!=='walk'?{kind:state}:null,moving,phase,reduced:$('static').checked,canRest:true});helper.visible=$('bones').checked;markers.forEach((m,i)=>{m.visible=$('contacts').checked&&!!pose.contactPoints[i];if(m.visible)m.position.fromArray(pose.contactPoints[i].position);});}
renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min(.05,(now-last)/1000)*Number($('speed').value);last=now;if(ready&&dt>0)step(dt);controls.update();renderer.render(scene,camera);});
window.__rigReview={get ready(){return ready;},load,view,step,bind,renderFrame:()=>renderer.render(scene,camera),get pose(){return pose;},get profile(){return profile;},get model(){return model;},get actions(){return actions;},async fixture(object){animal='custom';source=object;hash='fixture-'+object.uuid;await bind();},get renderer(){return renderer;},createRigFixture,prepareRigModel,cloneRigModel,saveRigCorrection,rigDigest,get hash(){return hash;},async fixtureBytes(kind){return Array.from(new Uint8Array(await new GLTFExporter().parseAsync(createRigFixture(kind),{binary:true})));}};
load(animal).catch(e=>$('status').textContent=e.message);
