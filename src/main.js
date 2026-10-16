import {createCommunityGround,createGroupScene} from './group-scene.js';
import {createUIInteractions} from './ui-interactions.js';
import {loadValleyAssets} from './valley-assets.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildTerrain } from './terrain.js';
import { buildArchitecture } from './architecture.js';
import { buildNature } from './nature.js';
import { loadRodinProps, placeRodinProps } from './rodin-props.js';
import { createSocialStore, startDemo, FRIENDS } from './social-store.js';
import { createCharacters } from './social-characters.js';
import { createSocialUI } from './social-ui.js';
import { createDiscoveryScene } from './discovery-scene.js';
import { createDiscoveryUI } from './discovery-ui.js';
import { createContentPlayer } from './discovery-player.js';
import { createDiscoveryBoards } from './discovery-boards.js';
import { constrainCameraPan } from './camera-pan-bounds.js';
import {buildValleyLandmarks} from './valley-landmarks.js';
import {createValleySocial} from './valley-social.js';
import { createWebPet } from './web-pet.js';
import { petPayload } from './pet-state.js';
import {createSound,createSoundSettings} from './sound.js';
import {createRecordPlayer} from './record-player.js';
import {createSoundCamera} from './sound-camera.js';
import {createFreeRoam} from './free-roam.js';
import {freezeStaticTransforms} from './static-transforms.js';
import {PLACEMENTS} from './layout.js';
import {createGroupCamera} from './group-camera.js';

async function boot(){

const $=id=>document.getElementById(id);
const ui=createUIInteractions();window.__uiInteractions=ui;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x203a32);scene.fog=new THREE.FogExp2(0x203a32,innerWidth<700?.003:.0065);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const captureIndex=Number(new URLSearchParams(location.search).get('capture'))||0;
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:!!captureIndex});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.42;
$('viewport').append(renderer.domElement);
const camera=new THREE.PerspectiveCamera(37,innerWidth/innerHeight,.1,500);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=6;controls.maxDistance=240;controls.maxPolarAngle=Math.PI*.485;controls.minPolarAngle=.15;controls.autoRotateSpeed=.35;controls.target.set(0,2,0);controls.enablePan=true;
window.__cameraPanBounds=constrainCameraPan(controls,camera);
const hemi=new THREE.HemisphereLight(0xc7e3d2,0x3e5233,2.2);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe3a1,3.7);sun.position.set(-18,36,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-42,right:42,top:42,bottom:-42,near:1,far:110});sun.shadow.bias=-.0004;sun.shadow.normalBias=.045;sun.shadow.radius=3;scene.add(sun);
const rim=new THREE.DirectionalLight(0x9acbc5,1.2);rim.position.set(12,8,-15);scene.add(rim);
const undersideFill=new THREE.DirectionalLight(0x9bb6ad,.8);undersideFill.position.set(-12,-10,22);scene.add(undersideFill);
const [rodinAssets,valleyAssets]=await Promise.all([
 // Valley planting and river stones also use these shared sources. Keep review
 // tools' default full catalog, but avoid unused cart/barrel/outcrop downloads.
 loadRodinProps({kinds:[...PLACEMENTS.filter(p=>p.enabled!==false).map(p=>p.kind),'tree','tree_birch','tree_maple','rock','grass','fern_large']}).catch(error=>{console.warn('Local Rodin assets unavailable; retaining procedural props.',error);return null;}),
 new URLSearchParams(location.search).has('native-valley')?{}:loadValleyAssets()
]);
$('viewport').dataset.valleyAssets=Object.keys(valleyAssets).join(',');
const terrain=buildTerrain(scene,{rodinBridge:!!rodinAssets?.bridge,riverAssets:rodinAssets,valleyAssets,reduced});
const generated=rodinAssets?placeRodinProps(scene,rodinAssets,terrain):null;
const architecture=buildArchitecture(scene,{rodin:!!rodinAssets,expanded:true});const nature=buildNature(scene,{rodin:!!rodinAssets,expanded:true});
createCommunityGround(scene);
const obstacleCache=new WeakMap();
const discoveryScene=createDiscoveryScene({scene,camera,controls,renderer,terrain,generated,ui,obstacleCache,onOpen:kind=>window.__openSceneDiscovery?.(kind)});window.__discoveryScene=discoveryScene;
const landmarks=buildValleyLandmarks({scene,terrain,generated,assets:rodinAssets,valleyAssets});
let socialUI,store,groupBuildings;
const characters=await createCharacters({scene,camera,controls,renderer,terrain,generated,reduced,obstacleCache,pickOccluder:(x,y)=>groupBuildings?.hit(x,y)?.distance,onSelect:id=>socialUI?.openFriend(id),onPlace:(id,position)=>store?.setCharacterPosition(id,position),onPlacementError:message=>socialUI?.toast(message)});
store=captureIndex?null:await createSocialStore();
// Main-app placements are session-only; historical coordinates remain in storage.
window.__characterPlacement=characters.placement;
window.__river={...terrain.river,view(position,target){controls.enabled=false;camera.position.set(...position);controls.target.set(...target);camera.lookAt(controls.target);},stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles})};
const sound=captureIndex?null:createSound({store});
const soundCamera=createSoundCamera({camera,controls,getRoot:()=>recordPlayer.root,reduced});
const soundSettings=sound?createSoundSettings({sound,ui,onSceneOpen:async()=>{if(window.__freeRoam?.busy)await window.__freeRoam.exit();if(ui.state('sound')==='closed'||ui.state('sound')==='closing')return;valley.finishCamera();characters.finishCamera();for(const b of nature.butterflies||[])b.group.visible=false;soundCamera.open();},onSceneClose:immediate=>{for(const b of nature.butterflies||[])b.group.visible=true;soundCamera.close(immediate);}}):null;
window.__sound=sound;window.__soundCamera=soundCamera;
const recordPlayer=await createRecordPlayer({scene,camera,canvas:renderer.domElement,terrain,generated,ui,sound,reduced,onOpen:origin=>soundSettings?.open(origin,{scene:true})});
window.__recordPlayer=recordPlayer;
const groupCamera=createGroupCamera({camera,controls,reduced});window.__groupCamera=groupCamera;
socialUI=captureIndex?{update(){},activeFriend:null}:createSocialUI({store,characters,controls,ui,onGroupSceneClose:immediate=>groupCamera.close(immediate),onOpenSound:origin=>soundSettings.open(origin),onMountPet:container=>window.__webPet?.mount(container)});
if(!captureIndex){groupBuildings=await createGroupScene({scene,camera,canvas:renderer.domElement,controls,reduced,store,socialUI,ui,onFocus:async point=>{if(window.__freeRoam?.busy)await window.__freeRoam.exit();window.__discoveryBoards?.dismiss();valley.finishCamera();characters.restore({preserveCamera:true});characters.finishCamera();groupCamera.open(point);},obstacles:()=>discoveryScene.labelAnchors});window.__groupBuildings=groupBuildings;}
const valley=createValleySocial({landmarks,terrain,scene,camera,controls,canvas:renderer.domElement,characters,store,socialUI,reduced,ui});window.__valley=valley;
const focusFriend=characters.focus;characters.focus=async id=>{if(window.__freeRoam?.busy)await window.__freeRoam.exit();valley.finishCamera();return focusFriend(id);};
if(!captureIndex){
  window.__webPet=createWebPet({store,ui,onOpenFriend:id=>socialUI.openFriend(id)});
  function publishDesktopState(){
    if(!window.desktopMain)return;
    window.desktopMain.publishState(petPayload(store.state));
  }
  store.subscribe(()=>publishDesktopState());
  window.desktopMain?.onOpenFriend(id=>socialUI.openFriend(id));
  publishDesktopState();
  const player=createContentPlayer({store});
  let boards;
  const contentUI=createDiscoveryUI({store,player,ui,onShare:ref=>socialUI.shareContent(ref),onClose:()=>{},onRequestClose:()=>boards?.exit(),onNavigate:route=>{if(route.type==='article')discoveryScene.updatePreview('accounts',route.id);if(route.type==='video')discoveryScene.updatePreview('scene-video',route.id);},onScenePlay:async id=>{await boards.open('scene-video',{type:'video',id});}});
  boards=createDiscoveryBoards({camera,facilities:discoveryScene,contentUI,player,beforeFocus:async()=>{if(window.__freeRoam?.busy)await window.__freeRoam.exit();valley.finishCamera();if(socialUI.activeFriend){socialUI.closeMeeting();characters.finishCamera();}}});
  window.__openSceneDiscovery=async kind=>{if(window.__freeRoam?.busy)await window.__freeRoam.exit();return boards.open(kind);};
  window.__openDiscovery=(route,options)=>contentUI.open(route,options);
  window.__discoveryBoards=boards;
  window.__discoveryUI=contentUI;window.__contentPlayer=player;
}
if(captureIndex)characters.sync(FRIENDS);
window.__socialStore=store;window.__socialUI=socialUI;
const stressMode=new URLSearchParams(location.search).has('stress');
const demo=stressMode||captureIndex?null:startDemo(store,{getSceneParticipants:()=>({
  friends:characters.placement.snapshot().characters.filter(c=>!['leaving','waiting'].includes(c.presentation?.phase)).map(c=>c.id),
  groups:(groupBuildings?.snapshot().entries||[]).filter(g=>!['leaving','waiting'].includes(g.phase)).map(g=>g.id)
})});
if(stressMode){characters.sync([...FRIENDS,...FRIENDS.map(f=>({...f,id:f.id+'-stress'}))]);$('viewport').dataset.stressCharacters=String(characters.audit.slots.length);}
// Batch immutable meshes by material. Source still names and constructs every component.
const animated=new Set([...(architecture.flames||[])]);for(const b of nature.butterflies||[])b.group.traverse(o=>animated.add(o));
const buckets=new Map();scene.updateMatrixWorld(true);
scene.traverse(object=>{if(!object.isMesh||object.userData.riverOwned||object.userData.socialCharacter||object.userData.generatedProp||animated.has(object)||object.material.transparent||object.material.isShaderMaterial||Array.isArray(object.material)||object.name.includes('foam')||object.name.includes('filament'))return;const key=object.material.uuid+object.castShadow+object.receiveShadow; if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(object);});
for(const objects of buckets.values()){if(objects.length<8)continue;const geometries=objects.map(o=>{let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(o.matrixWorld);for(const key of Object.keys(g.attributes))if(!['position','normal','uv'].includes(key))g.deleteAttribute(key);if(!g.attributes.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));return g;});const combined=mergeGeometries(geometries,false);if(!combined)continue;const mesh=new THREE.Mesh(combined,objects[0].material);mesh.name='Batched detail · '+objects[0].name;mesh.castShadow=objects[0].castShadow;mesh.receiveShadow=objects[0].receiveShadow;scene.add(mesh);objects.forEach(o=>o.removeFromParent());geometries.forEach(g=>g.dispose());}
if(generated){$('viewport').dataset.rodinInstances=String(generated.userData.inventory.length);$('viewport').dataset.rodinKinds=Object.keys(rodinAssets).join(',');}
$('viewport').dataset.people='0';$('viewport').dataset.landArea=String(terrain.root.userData.landArea?.total||567.807833);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000),new THREE.MeshStandardMaterial({color:0x263f33,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-25;ground.receiveShadow=false;ground.name='Distant ground beneath floating island';scene.add(ground);
const flyCount=42,flyPositions=new Float32Array(flyCount*3),flySeed=[];for(let i=0;i<flyCount;i++){const a=(i*2.399),r=3+(i%9)*.8;flySeed.push([Math.cos(a)*r,2.6+(i%5)*.45,Math.sin(a)*r]);}
const flyGeo=new THREE.BufferGeometry();flyGeo.setAttribute('position',new THREE.BufferAttribute(flyPositions,3));const fireflies=new THREE.Points(flyGeo,new THREE.PointsMaterial({color:0xe6f5a3,size:.075,transparent:true,opacity:.75,depthWrite:false,sizeAttenuation:true}));fireflies.name='Floating firefly lights';fireflies.frustumCulled=false;scene.add(fireflies);
let clockTime=0,last=performance.now();
function resetCamera(){controls.target.set(0,0,-5);camera.position.set(40,36,66);if(innerWidth<700){camera.position.set(60,106,152);controls.target.set(0,0,-7);}controls.update();}
window.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,[contenteditable],dialog')||!controls.enabled)return;if(e.key==='Home'){resetCamera();e.preventDefault();}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key)&&!e.target.closest('button,input')){const offset=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')s.theta-=.12;if(e.key==='ArrowRight')s.theta+=.12;if(e.key==='ArrowUp')s.phi-=.08;if(e.key==='ArrowDown')s.phi+=.08;if(e.key==='+'||e.key==='=')s.radius*=.9;if(e.key==='-')s.radius*=1.1;s.phi=THREE.MathUtils.clamp(s.phi,.15,Math.PI*.485);s.radius=THREE.MathUtils.clamp(s.radius,6,240);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();e.preventDefault();}});
let wasMobile=innerWidth<700;window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();scene.fog.density=innerWidth<700?.003:.0065;renderer.setSize(innerWidth,innerHeight);if(wasMobile!==(innerWidth<700)&&!window.__discoveryBoards?.kind&&!window.__freeRoam?.busy&&!window.__groupCamera?.busy){wasMobile=innerWidth<700;resetCamera();if(socialUI.activeFriend)characters.focus(socialUI.activeFriend);}});
resetCamera();
const roam=captureIndex?null:createFreeRoam({camera,controls,canvas:renderer.domElement,ui});window.__freeRoam=roam;
const frozenTransforms=freezeStaticTransforms(scene,[characters.root,groupBuildings?.root,terrain.river.root,recordPlayer.root,...scene.children.filter(o=>o.userData.socialCharacter),...architecture.flames,...(nature.butterflies||[]).map(b=>b.group)]);
window.__renderPerformance={frozenTransforms,frames:0,preserveDrawingBuffer:renderer.getContext().getContextAttributes().preserveDrawingBuffer};
let fpsFrames=0,fpsStart=performance.now();
let frameId=null;
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&frameId===null){last=performance.now();fpsStart=last;fpsFrames=0;frameId=requestAnimationFrame(frame);}});
function frame(now){frameId=null;if(document.hidden&&!captureIndex)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!reduced.matches)clockTime+=dt;
  recordPlayer.update(now,dt);
  if(roam?.busy)roam.update(dt);else controls.update(dt);if(!stressMode)socialUI.prepareFrame?.(now);characters.update(now,dt);valley.update(now);socialUI.update(now);groupBuildings?.update(now);discoveryScene.update(now);window.__discoveryBoards?.update();terrain.river.update(clockTime,dt);
  for(let i=0;i<architecture.flames.length;i++){const flame=architecture.flames[i];flame.scale.y=.85+Math.sin(clockTime*7+i*1.6)*.16;flame.rotation.y=clockTime*.3+i;}
  if(architecture.lights?.[0])architecture.lights[0].intensity=2.5+Math.sin(clockTime*9)*.5;
  for(const b of nature.butterflies||[]){b.group.position.copy(b.origin);b.group.position.y+=Math.sin(clockTime*1.3+b.phase)*.25;b.group.position.x+=Math.sin(clockTime*.5+b.phase)*.35;for(let i=0;i<b.wings.length;i++)b.wings[i].rotation.y=(i?1:-1)*Math.sin(clockTime*9+b.phase)*.85;}
  for(let i=0;i<flyCount;i++){flyPositions[i*3]=flySeed[i][0]+Math.sin(clockTime*.4+i)*.3;flyPositions[i*3+1]=flySeed[i][1]+Math.sin(clockTime*.6+i)*.25;flyPositions[i*3+2]=flySeed[i][2]+Math.cos(clockTime*.3+i)*.2;}flyGeo.attributes.position.needsUpdate=true;
  soundCamera.update(now);if(groupCamera.active&&['closed','closing'].includes(ui.state('meeting'))&&['closed','closing'].includes(ui.state('group-queue')))groupCamera.close();groupCamera.update(now);
  renderer.render(scene,camera);window.__renderPerformance.frames++;fpsFrames++;if(now-fpsStart>3000){$('viewport').dataset.fps=(fpsFrames*1000/(now-fpsStart)).toFixed(1);fpsStart=now;fpsFrames=0;}frameId=requestAnimationFrame(frame);
}
renderer.render(scene,camera);$('viewport').dataset.loaded='true';frameId=requestAnimationFrame(frame);
if(captureIndex){
  renderer.setPixelRatio(1);renderer.setSize(540,960,false);renderer.shadowMap.type=THREE.PCFShadowMap;camera.aspect=540/960;camera.updateProjectionMatrix();controls.enabled=false;
  const views=[[-1.2,4.8,-2,-4.6,3.3,-6.9],[-4.6,4.6,11,-7.85,3.25,8.05],[-5,4.6,9,-8.5,3.2,5.45],[11,4.8,8,7.1,3.3,3.5],[-5,5.2,7,-8.5,3,1.5],[16,15,23,0,2.5,0]];
  function captureView(index){const v=views[(index-1)%views.length];camera.position.set(...v.slice(0,3));controls.target.set(...v.slice(3));camera.lookAt(controls.target);}
  captureView(captureIndex);
  const base64=blob=>new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(blob);});
  window.__capture={ready:true,audit:discoveryScene.audit,async record(index=captureIndex,duration=12000){captureView(index);await new Promise(r=>setTimeout(r,1000));const poster=renderer.domElement.toDataURL('image/jpeg',.88).split(',')[1];const stream=renderer.domElement.captureStream(24);const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:2200000});const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};const done=new Promise(resolve=>recorder.onstop=resolve);recorder.start(1000);await new Promise(resolve=>setTimeout(resolve,duration));recorder.stop();await done;stream.getTracks().forEach(t=>t.stop());return {video:await base64(new Blob(chunks,{type:mime})),poster,mime,duration};}};
  $('viewport').dataset.captureReady='true';
}
window.addEventListener('webglcontextlost',e=>{e.preventDefault();console.warn('WebGL context lost; reload to restore the scene.');});

}
boot().catch(error=>{console.error(error);const notice=document.createElement('div');notice.style.cssText='position:fixed;bottom:24px;left:24px;background:#fff8df;padding:20px;border-radius:14px;color:#354f40';notice.textContent='场景暂未完成加载：'+error.message;document.body.append(notice);});
