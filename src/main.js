import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildTerrain, riverCenter } from './terrain.js';
import { buildArchitecture } from './architecture.js';
import { buildNature } from './nature.js';
import { loadRodinProps, placeRodinProps } from './rodin-props.js';
import { createSocialStore, startDemo, FRIENDS } from './social-store.js';
import { createCharacters } from './social-characters.js';
import { createSocialUI } from './social-ui.js';

async function boot(){

const $=id=>document.getElementById(id);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x203a32);scene.fog=new THREE.FogExp2(0x203a32,innerWidth<700?.0055:.013);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.23;
$('viewport').append(renderer.domElement);
const camera=new THREE.PerspectiveCamera(37,innerWidth/innerHeight,.1,500);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=6;controls.maxDistance=105;controls.maxPolarAngle=Math.PI*.485;controls.minPolarAngle=.15;controls.autoRotateSpeed=.35;controls.target.set(0,2,0);controls.enablePan=true;
const hemi=new THREE.HemisphereLight(0xc7e3d2,0x3e5233,2.0);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe3a1,3.7);sun.position.set(-11,22,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:65});sun.shadow.bias=-.0004;sun.shadow.normalBias=.045;sun.shadow.radius=3;scene.add(sun);
const rim=new THREE.DirectionalLight(0x9acbc5,1.2);rim.position.set(12,8,-15);scene.add(rim);
let rodinAssets=null;try{rodinAssets=await loadRodinProps();}catch(error){console.warn('Local Rodin assets unavailable; retaining procedural props.',error);}
const terrain=buildTerrain(scene,{rodinBridge:!!rodinAssets?.bridge});
const generated=rodinAssets?placeRodinProps(scene,rodinAssets):null;
const architecture=buildArchitecture(scene,{rodin:!!rodinAssets,expanded:!!rodinAssets?.cottage});const nature=buildNature(scene,{rodin:!!rodinAssets,expanded:!!rodinAssets?.cottage});
let socialUI;
const characters=await createCharacters({scene,camera,controls,renderer,terrain,generated,reduced,onSelect:id=>socialUI?.openFriend(id)});
const store=await createSocialStore();
socialUI=createSocialUI({store,characters});
const stressMode=new URLSearchParams(location.search).has('stress');
const demo=stressMode?null:startDemo(store);
if(stressMode){characters.sync([...FRIENDS,...FRIENDS.map(f=>({...f,id:f.id+'-stress'}))]);$('viewport').dataset.stressCharacters=String(characters.audit.slots.length);}
// Batch immutable meshes by material. Source still names and constructs every component.
const animated=new Set([...(architecture.flames||[])]);for(const b of nature.butterflies||[])b.group.traverse(o=>animated.add(o));
const buckets=new Map();scene.updateMatrixWorld(true);
scene.traverse(object=>{if(!object.isMesh||object.userData.socialCharacter||object.userData.generatedProp||animated.has(object)||object.material.transparent||object.material.isShaderMaterial||Array.isArray(object.material)||object.name.includes('foam')||object.name.includes('filament'))return;const key=object.material.uuid+object.castShadow+object.receiveShadow; if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(object);});
for(const objects of buckets.values()){if(objects.length<8)continue;const geometries=objects.map(o=>{let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(o.matrixWorld);for(const key of Object.keys(g.attributes))if(!['position','normal','uv'].includes(key))g.deleteAttribute(key);if(!g.attributes.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));return g;});const combined=mergeGeometries(geometries,false);if(!combined)continue;const mesh=new THREE.Mesh(combined,objects[0].material);mesh.name='Batched detail · '+objects[0].name;mesh.castShadow=objects[0].castShadow;mesh.receiveShadow=objects[0].receiveShadow;scene.add(mesh);objects.forEach(o=>o.removeFromParent());geometries.forEach(g=>g.dispose());}
if(generated){$('viewport').dataset.rodinInstances=String(generated.userData.inventory.length);$('viewport').dataset.rodinKinds=Object.keys(rodinAssets).join(',');}
$('viewport').dataset.people='0';$('viewport').dataset.landArea=String(terrain.root.userData.landArea?.total||567.807833);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000),new THREE.MeshStandardMaterial({color:0x263f33,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-3.07;ground.receiveShadow=true;ground.name='Matte forest display ground';scene.add(ground);
const flyCount=42,flyPositions=new Float32Array(flyCount*3),flySeed=[];for(let i=0;i<flyCount;i++){const a=(i*2.399),r=3+(i%9)*.8;flySeed.push([Math.cos(a)*r,2.6+(i%5)*.45,Math.sin(a)*r]);}
const flyGeo=new THREE.BufferGeometry();flyGeo.setAttribute('position',new THREE.BufferAttribute(flyPositions,3));const fireflies=new THREE.Points(flyGeo,new THREE.PointsMaterial({color:0xe6f5a3,size:.075,transparent:true,opacity:.75,depthWrite:false,sizeAttenuation:true}));fireflies.name='Floating firefly lights';fireflies.frustumCulled=false;scene.add(fireflies);
let clockTime=0,last=performance.now();
function resetCamera(){controls.target.set(0,2.1,0);camera.position.set(27,28,40);if(innerWidth<700)camera.position.sub(controls.target).multiplyScalar(1.95).add(controls.target);controls.update();}
window.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,[contenteditable],dialog')||!controls.enabled)return;if(e.key==='Home'){resetCamera();e.preventDefault();}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key)&&!e.target.closest('button,input')){const offset=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')s.theta-=.12;if(e.key==='ArrowRight')s.theta+=.12;if(e.key==='ArrowUp')s.phi-=.08;if(e.key==='ArrowDown')s.phi+=.08;if(e.key==='+'||e.key==='=')s.radius*=.9;if(e.key==='-')s.radius*=1.1;s.phi=THREE.MathUtils.clamp(s.phi,.15,Math.PI*.485);s.radius=THREE.MathUtils.clamp(s.radius,6,105);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();e.preventDefault();}});
let wasMobile=innerWidth<700;window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();scene.fog.density=innerWidth<700?.0055:.013;renderer.setSize(innerWidth,innerHeight);if(wasMobile!==(innerWidth<700)){wasMobile=innerWidth<700;resetCamera();if(socialUI.activeFriend)characters.focus(socialUI.activeFriend);}});
resetCamera();
let fpsFrames=0,fpsStart=performance.now();
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!reduced.matches)clockTime+=dt;
  controls.update(dt);characters.update(now,dt);socialUI.update(now);terrain.waterUniforms.uTime.value=clockTime;
  for(const fall of terrain.falls)fall.position.y=-((clockTime*1.3+fall.userData.phase)%2.8);
  for(const ripple of terrain.ripples){const z=((ripple.userData.originZ+11+clockTime*.26)%22)-11;ripple.position.z=z;ripple.position.x=riverCenter(z)+ripple.userData.xOffset;}
  for(let i=0;i<architecture.flames.length;i++){const flame=architecture.flames[i];flame.scale.y=.85+Math.sin(clockTime*7+i*1.6)*.16;flame.rotation.y=clockTime*.3+i;}
  if(architecture.lights?.[0])architecture.lights[0].intensity=2.5+Math.sin(clockTime*9)*.5;
  for(const b of nature.butterflies||[]){b.group.position.copy(b.origin);b.group.position.y+=Math.sin(clockTime*1.3+b.phase)*.25;b.group.position.x+=Math.sin(clockTime*.5+b.phase)*.35;for(let i=0;i<b.wings.length;i++)b.wings[i].rotation.y=(i?1:-1)*Math.sin(clockTime*9+b.phase)*.85;}
  for(let i=0;i<flyCount;i++){flyPositions[i*3]=flySeed[i][0]+Math.sin(clockTime*.4+i)*.3;flyPositions[i*3+1]=flySeed[i][1]+Math.sin(clockTime*.6+i)*.25;flyPositions[i*3+2]=flySeed[i][2]+Math.cos(clockTime*.3+i)*.2;}flyGeo.attributes.position.needsUpdate=true;
  renderer.render(scene,camera);fpsFrames++;if(now-fpsStart>3000){$('viewport').dataset.fps=(fpsFrames*1000/(now-fpsStart)).toFixed(1);fpsStart=now;fpsFrames=0;}requestAnimationFrame(frame);
}
renderer.render(scene,camera);$('viewport').dataset.loaded='true';requestAnimationFrame(frame);
window.addEventListener('webglcontextlost',e=>{e.preventDefault();console.warn('WebGL context lost; reload to restore the scene.');});

}
boot().catch(error=>{console.error(error);const notice=document.createElement('div');notice.style.cssText='position:fixed;bottom:24px;left:24px;background:#fff8df;padding:20px;border-radius:14px;color:#354f40';notice.textContent='场景暂未完成加载：'+error.message;document.body.append(notice);});
