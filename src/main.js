import {createGroupCamera} from './group-camera.js';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createUIInteractions} from './ui-interactions.js';
import {createSocialStore,startDemo,FRIENDS} from './social-store.js';
import {createCharacters} from './social-characters.js';
import {createSocialUI} from './social-ui.js';
import {createGroupScene} from './group-scene.js';
import {createDiscoveryUI} from './discovery-ui.js';
import {createContentPlayer} from './discovery-player.js';
import {createDiscoveryBoards} from './discovery-boards.js';
import {createValleySocial} from './valley-social.js';
import {createWebPet} from './web-pet.js';
import {petPayload} from './pet-state.js';
import {createSound,createSoundSettings} from './sound.js';
import {createSoundCamera} from './sound-camera.js';
import {createFreeRoam} from './free-roam.js';
import {constrainCameraPan} from './camera-pan-bounds.js';
import {readSceneTheme,SCENE_STORAGE_KEY} from './scene-theme.js';
import {createSceneSwitcher,sceneIcon} from './scene-switcher.js';
import {SCENE_REGISTRY,prepareSceneWorld} from './scene-world.js';
import {assetCacheSnapshot} from './scene-assets.js';
import {createTrainFollow} from './train-follow.js';

const $=id=>document.getElementById(id);
function curtain(title,{sceneId='forest'}={}){
 const notice=document.createElement('section');notice.className='scene-travel';notice.dataset.destination=sceneId;notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');
 notice.innerHTML=`<div class="scene-travel-content"><i aria-hidden="true">${sceneIcon(sceneId)}</i><span class="scene-travel-eyebrow">正在切换场景</span><strong></strong><span class="scene-travel-progress" aria-hidden="true"></span><span class="scene-travel-detail">风景正在准备，请稍候</span></div>`;
 notice.querySelector('strong').textContent=title;document.body.append(notice);return notice;
}
async function boot(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),captureIndex=Number(new URLSearchParams(location.search).get('capture'))||0,stress=new URLSearchParams(location.search).has('stress');
 const ui=createUIInteractions();window.__uiInteractions=ui;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,innerWidth/innerHeight,.1,500);
 const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:!!captureIndex});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.42;$('viewport').append(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);Object.assign(controls,{enableDamping:true,dampingFactor:.065,minDistance:6,maxDistance:240,maxPolarAngle:Math.PI*.485,minPolarAngle:.15,autoRotateSpeed:.35,enablePan:true});
 const hemi=new T.HemisphereLight(0xc7e3d2,0x3e5233,2.2),sun=new T.DirectionalLight(0xffe3a1,3.7),rim=new T.DirectionalLight(0x9acbc5,1.2),fill=new T.DirectionalLight(0x9bb6ad,.8);
 sun.position.set(-18,36,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-42,right:42,top:42,bottom:-42,near:1,far:110});sun.shadow.bias=-.0004;sun.shadow.normalBias=.045;sun.shadow.radius=3;rim.position.set(12,8,-15);fill.position.set(-12,-10,22);scene.add(hemi,sun,rim,fill);
 const ground=new T.Mesh(new T.PlaneGeometry(1000,1000),new T.MeshStandardMaterial({color:0x263f33,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-25;ground.name='Distant ground beneath floating island';scene.add(ground);
 const store=captureIndex?null:await createSocialStore(),sound=store?createSound({store}):null;
 let world=await prepareSceneWorld(readSceneTheme(),{reduced}),characters,socialUI,groupBuildings,valley,boards,trainFollow,roam,switching=false,committing=false,switchCount=0,clockTime=0,sceneSwitcher;
 const groupCamera=createGroupCamera({camera,controls,reduced});window.__groupCamera=groupCamera;
 const cameraPoses=new Map();let uiState={};ui.subscribe(s=>uiState=s);
 const soundCamera=createSoundCamera({camera,controls,getRoot:()=>world.record.root,reduced});window.__sound=sound;window.__soundCamera=soundCamera;
 const soundSettings=sound?createSoundSettings({sound,ui,onSceneOpen:async()=>{if(roam?.busy)await roam.exit();if(ui.state('sound')==='closed'||ui.state('sound')==='closing')return;groupCamera.close(true);trainFollow?.exit({immediate:true});valley.finishCamera();characters.finishCamera();soundCamera.open();},onSceneClose:immediate=>soundCamera.close(immediate)}):null;
 const mountOptions={camera,controls,renderer,ui,sound,onDiscovery:kind=>window.__openSceneDiscovery?.(kind),onRecord:origin=>soundSettings?.open(origin,{scene:true})};
 await world.mount(mountOptions);scene.add(world.root);
 function applyEnvironment(){const c=world.config;const city=world.id==='cyber';controls.maxDistance=city?420:240;sun.position.set(...(city?[-38,85,30]:[-18,36,18]));Object.assign(sun.shadow.camera,{left:city?-70:-42,right:city?70:42,top:city?70:42,bottom:city?-70:-42,far:city?220:110});sun.shadow.camera.updateProjectionMatrix();sun.target.position.set(0,city?15:0,0);sun.target.updateMatrixWorld();scene.background=world.background||new T.Color(c.background);renderer.toneMappingExposure=c.exposure??1.42;hemi.intensity=c.hemiIntensity??2.2;rim.color.setHex(c.rim??0x9acbc5);rim.intensity=c.rimIntensity??1.2;fill.color.setHex(c.fill??0x9bb6ad);fill.intensity=c.fillIntensity??.8;scene.fog=new T.FogExp2(c.background,innerWidth<700?(c.mobileFogDensity??c.fogDensity):c.fogDensity);hemi.color.setHex(c.hemi);hemi.groundColor.setHex(c.ground);sun.color.setHex(c.sun);sun.intensity=c.sunIntensity;ground.visible=!!c.backdropGround;ground.material.color.setHex(c.backdropGround?0x263f33:c.background);document.documentElement.dataset.scene=world.id;$('viewport').dataset.scene=world.id;$('viewport').setAttribute('aria-label',c.ariaLabel);}
 let resetTween=null;
 const cancelReset=()=>{resetTween=null;};
 controls.addEventListener('start',cancelReset);
 window.addEventListener('pointerdown',cancelReset,true);
 function updateReset(now){
  if(!resetTween)return;
  if(switching||roam?.busy||trainFollow?.busy||groupCamera.busy||uiState.main||uiState.modal||!controls.enabled){cancelReset();return;}
  const a=resetTween,t=Math.min(1,(now-a.start)/750),e=t*t*(3-2*t);
  controls.target.lerpVectors(a.target,a.toTarget,e);
  const orbit=new T.Spherical(T.MathUtils.lerp(a.from.radius,a.to.radius,e),T.MathUtils.lerp(a.from.phi,a.to.phi,e),a.from.theta+a.angle*e);
  camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(orbit));camera.lookAt(controls.target);
  if(t===1){camera.position.copy(a.toPosition);controls.target.copy(a.toTarget);cancelReset();}
 }
 function smoothResetCamera(){
  if(reduced.matches){resetCamera();return;}
  const c=world.config.cameraFor?.(innerWidth,innerHeight)||world.config.camera,mobile=innerWidth<700,toPosition=new T.Vector3().fromArray(mobile?c.mobile:c.position),toTarget=new T.Vector3().fromArray(mobile?c.mobileTarget:c.target);
  const position=camera.position.clone(),target=controls.target.clone(),damping=controls.enableDamping;
  controls.enableDamping=false;controls.update();camera.position.copy(position);controls.target.copy(target);controls.update();controls.enableDamping=damping;
  const from=new T.Spherical().setFromVector3(position.clone().sub(target)),to=new T.Spherical().setFromVector3(toPosition.clone().sub(toTarget));
  resetTween={start:performance.now(),target,toTarget,toPosition,from,to,angle:Math.atan2(Math.sin(to.theta-from.theta),Math.cos(to.theta-from.theta))};
 }
 const resetCamera=()=>{cancelReset();const c=world.config.cameraFor?.(innerWidth,innerHeight)||world.config.camera,mobile=innerWidth<700,damping=controls.enableDamping;controls.enableDamping=false;controls.update();camera.position.fromArray(mobile?c.mobile:c.position);controls.target.fromArray(mobile?c.mobileTarget:c.target);controls.enabled=true;controls.update();controls.enableDamping=damping;};
 applyEnvironment();resetCamera();window.__cameraPanBounds=constrainCameraPan(controls,camera,{getBounds:()=>world.terrain.bounds});
 characters=await createCharacters({scene,camera,controls,renderer,terrain:world.terrain,generated:world.generated,obstacleCache:world.obstacleCache,reduced,pickOccluder:(x,y)=>groupBuildings?.hit(x,y)?.distance,onSelect:id=>socialUI?.openFriend(id),onPlace:(id,position)=>store?.setCharacterPosition(id,position),onPlacementError:message=>socialUI?.toast(message)});
 socialUI=captureIndex?{update(){},activeFriend:null}:createSocialUI({store,characters,controls,ui,onGroupSceneClose:immediate=>groupCamera.close(immediate),getAnchorObstacles:()=>[],onOpenSound:origin=>soundSettings.open(origin),onMountPet:container=>window.__webPet?.mount(container)});
 if(store)groupBuildings=await createGroupScene({scene,camera,canvas:renderer.domElement,controls,reduced,store,socialUI,ui,theme:world.id,templates:world.assets.groups,isOccluded:point=>world.terrain.isOccluded?.(camera,point)||false,slots:world.layout.slots,queue:world.layout.queue,onFocus:async point=>{if(!world.config.groupFocus)return;if(roam?.busy)await roam.exit();boards?.dismiss();valley.finishCamera();characters.restore({preserveCamera:true});characters.finishCamera();groupCamera.open(point);},obstacles:()=>world.discovery.labelAnchors});
 const player=store?createContentPlayer({store}):null;
 const contentUI=store?createDiscoveryUI({store,player,ui,onShare:ref=>socialUI.shareContent(ref),onClose:()=>{},onRequestClose:()=>boards?.exit(),onNavigate:route=>{if(route.type==='article')world.discovery.updatePreview('accounts',route.id);if(route.type==='video')world.discovery.updatePreview('scene-video',route.id);},onScenePlay:id=>boards.open('scene-video',{type:'video',id})}):null;
 function connectSceneControllers(){
  valley=createValleySocial({landmarks:world.landmarks,terrain:world.terrain,scene,camera,controls,canvas:renderer.domElement,characters,store,socialUI,reduced,ui});
  trainFollow=(world.terrain.train||world.terrain.airship)?createTrainFollow({train:world.terrain.train||world.terrain.airship,presentation:world.terrain.airship?.presentation,camera,controls,canvas:renderer.domElement,ui,reduced,beforeOpen:async()=>{if(roam?.busy)await roam.exit();valley.finishCamera();characters.finishCamera();}}):null;
  if(store)boards=createDiscoveryBoards({camera,facilities:world.discovery,contentUI,player,beforeFocus:async()=>{if(roam?.busy)await roam.exit();groupCamera.close(true);trainFollow?.exit({immediate:true});valley.finishCamera();if(socialUI.activeFriend){socialUI.closeMeeting();characters.finishCamera();}}});
  window.__valley=valley;window.__discoveryBoards=boards;window.__discoveryScene=world.discovery;window.__recordPlayer=world.record;window.__trainFollow=trainFollow;window.__vehicleFollow=trainFollow;
  window.__river={...world.terrain.river,view(position,target){controls.enabled=false;camera.position.set(...position);controls.target.set(...target);camera.lookAt(controls.target);},stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles})};
 }
 connectSceneControllers();world.finishBatch();world.activate();
 const focusFriend=characters.focus;characters.focus=async id=>{if(roam?.busy)await roam.exit();groupCamera.close(true);trainFollow?.exit({immediate:true});valley.finishCamera();return focusFriend(id);};
 window.__socialStore=store;window.__socialUI=socialUI;window.__groupBuildings=groupBuildings;window.__characterPlacement=characters.placement;window.__discoveryUI=contentUI;window.__contentPlayer=player;
 window.__openSceneDiscovery=async kind=>{if(roam?.busy)await roam.exit();return boards.open(kind);};window.__openDiscovery=(route,options)=>contentUI?.open(route,options);
 function publishPetScene(){if(store){window.desktopMain?.publishState(petPayload(store.state,world.id));void window.__webPet?.sync();}}
  if(store){window.__webPet=createWebPet({store,ui,getSceneId:()=>world.id,onOpenFriend:id=>socialUI.openFriend(id)});store.subscribe(publishPetScene);window.desktopMain?.onOpenFriend(id=>socialUI.openFriend(id));publishPetScene();}
 if(captureIndex)characters.sync(FRIENDS);if(stress)characters.sync([...FRIENDS,...FRIENDS.map(f=>({...f,id:f.id+'-stress'}))]);
 const demo=stress||!store?null:startDemo(store,{getSceneParticipants:()=>({friends:characters.placement.snapshot().characters.filter(c=>!['leaving','waiting'].includes(c.presentation?.phase)).map(c=>c.id),groups:(groupBuildings?.snapshot().entries||[]).filter(g=>!['leaving','waiting'].includes(g.phase)).map(g=>g.id)})});
 roam=store?createFreeRoam({camera,controls,canvas:renderer.domElement,ui}):null;window.__freeRoam=roam;
 const snapshotPose=()=>({position:camera.position.clone(),target:controls.target.clone()});
 async function switchScene(id){
  if(switching)return false;if(id===world.id)return true;if(!SCENE_REGISTRY[id])throw Error('未知场景');if(uiState.modal)throw Error('请先完成当前窗口操作。');
  cancelReset();switching=true;document.documentElement.dataset.sceneTransition='true';sceneSwitcher?.setBusy(true,id);const loading=curtain(SCENE_REGISTRY[id].name,{sceneId:id});let candidate=null,canvasMotion=null,old=world,rebound=false,controllersReleased=false,oldReleased=false;
  async function fadeCanvas(from,to){
   canvasMotion?.cancel();canvasMotion=renderer.domElement.animate([{opacity:from},{opacity:to}],{duration:reduced.matches?50:110,easing:'ease-in-out',fill:'forwards'});
   await canvasMotion.finished;renderer.domElement.style.opacity=String(to);canvasMotion.cancel();canvasMotion=null;
  }
  try{
   candidate=await prepareSceneWorld(id,{reduced});if(uiState.modal)throw Error('请先完成当前窗口操作。');if(!characters.cancelPlacement())throw Error('请等待人物安放完成。');
   if(roam?.busy)await roam.exit();groupCamera.close(true);trainFollow?.exit({immediate:true});valley.finishCamera();characters.finishCamera();
   socialUI.setSceneTransition(true);await socialUI.saveSessionDraft();
   await candidate.mount(mountOptions);scene.add(candidate.root);candidate.root.visible=false;
   if(uiState.modal)throw Error('请先完成当前窗口操作。');
   await fadeCanvas(1,0);
   if(boards?.kind){contentUI.detachScene();boards.dismiss();old.discovery.update(performance.now()+10);}
   committing=true;characters.suspend(true);groupBuildings.suspend(true);controls.enabled=false;
   cameraPoses.set(old.id,snapshotPose());const nextPose=cameraPoses.get(id);
   if(nextPose){camera.position.copy(nextPose.position);controls.target.copy(nextPose.target);}else{const c=candidate.config.camera;camera.position.fromArray(innerWidth<700?c.mobile:c.position);controls.target.fromArray(innerWidth<700?c.mobileTarget:c.target);}camera.lookAt(controls.target);camera.updateMatrixWorld(true);
   characters.setScene({scene,terrain:candidate.terrain,generated:candidate.generated,obstacleCache:candidate.obstacleCache});rebound=true;
   groupBuildings.setScene({scene,slots:candidate.layout.slots,queue:candidate.layout.queue,templates:candidate.assets.groups,theme:id});
   boards?.dismiss();boards?.dispose();trainFollow?.dispose();ui.close('valley',{immediate:true,restoreFocus:false});valley.dispose();soundCamera.close(true);controllersReleased=true;
   old.suspend();world=candidate;connectSceneControllers();candidate.finishBatch();candidate.activate();applyEnvironment();
   characters.suspend(false);groupBuildings.suspend(false);controls.enabled=true;
   socialUI.prepareFrame?.(performance.now());characters.update(performance.now(),0);groupBuildings.update(performance.now());world.update(performance.now(),0,clockTime);renderer.render(scene,camera);
   try{localStorage.setItem(SCENE_STORAGE_KEY,id);}catch{}const url=new URL(location.href);url.searchParams.set('scene',id);history.replaceState(null,'',url.href);
   old.dispose();oldReleased=true;renderer.renderLists.dispose();switchCount++;
   committing=false;socialUI.setSceneTransition(false);
   sceneSwitcher?.setCurrent(id);await fadeCanvas(0,1);return true;
  }catch(error){
   if(!oldReleased){
    if(world!==old){boards?.dispose();trainFollow?.dispose();ui.close('valley',{immediate:true,restoreFocus:false});valley.dispose();}
    if(rebound){characters.setScene({scene,terrain:old.terrain,generated:old.generated,obstacleCache:old.obstacleCache});groupBuildings.setScene({scene,slots:old.layout.slots,queue:old.layout.queue,templates:old.assets.groups,theme:old.id});}
    candidate?.dispose();world=old;if(controllersReleased)connectSceneControllers();applyEnvironment();
    const pose=cameraPoses.get(old.id);if(pose){camera.position.copy(pose.position);controls.target.copy(pose.target);}old.activate();
   }throw error;
  }finally{publishPetScene();loading.remove();delete document.documentElement.dataset.sceneTransition;canvasMotion?.cancel();renderer.domElement.style.removeProperty('opacity');committing=false;switching=false;sceneSwitcher?.setCurrent(world.id);sceneSwitcher?.setBusy(false);characters.suspend(false);groupBuildings?.suspend(false);socialUI.setSceneTransition(false);controls.enabled=true;}
 }
 if(store)sceneSwitcher=createSceneSwitcher({current:world.id,onSwitch:switchScene,ui,reduced});
 window.__sceneTheme={get id(){return world.id;},ready:true,get switching(){return switching;},get audit(){return{environment:{exposure:renderer.toneMappingExposure,hemi:hemi.intensity,sun:sun.intensity,rim:rim.intensity,fill:fill.intensity},river:world.id==='forest',terrace:world.id==='forest',...world.terrain.audit,assetFailures:world.assets.failures,assetFallbacks:world.assets.fallbacks||[]};},snapshot:()=>world.terrain.snapshot?.()||{theme:'forest'},setPetalsEnabled:value=>world.terrain.petals?.setEnabled(value),switch:switchScene,resourceSnapshot:()=>({switches:switchCount,controls:{enabled:controls.enabled,enableDamping:controls.enableDamping,minDistance:controls.minDistance},...renderer.info.memory,worldRoots:scene.children.filter(o=>o.userData.sceneWorld).length,assetCache:assetCacheSnapshot(),characters:characters.getSceneState(),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles})};
 try{localStorage.setItem(SCENE_STORAGE_KEY,world.id);}catch{}
 window.__renderPerformance={get frozenTransforms(){return world.frozenTransforms;},frames:0,preserveDrawingBuffer:renderer.getContext().getContextAttributes().preserveDrawingBuffer};
 let last=performance.now(),fpsFrames=0,fpsStart=last,frameId=null;
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&frameId===null){last=performance.now();fpsStart=last;fpsFrames=0;frameId=requestAnimationFrame(frame);}});
 function frame(now){frameId=null;if(document.hidden&&!captureIndex)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!reduced.matches&&!document.hidden)clockTime+=dt;
  if(!committing){if(roam?.busy)roam.update(dt);else if(!trainFollow?.busy){if(resetTween)updateReset(now);else controls.update(dt);}if(!stress)socialUI.prepareFrame?.(now);characters.update(now,dt);valley.update(now);socialUI.update(now);groupBuildings?.update(now);world.update(now,document.hidden?0:dt,clockTime);if(world.terrain.updateView){let target=null;const ref=socialUI.activeConversation;if(socialUI.chatVisible&&ref?.kind==='group'){const entry=groupBuildings.snapshot().entries.find(e=>e.id===ref.id);if(entry){const p=world.layout.slots[entry.slot];target=new T.Vector3(p.x,5,p.z);}}else if(socialUI.activeFriend){const p=characters.getSceneState().positions[socialUI.activeFriend];if(p)target=new T.Vector3(p.x,4,p.z);}else if(characters.gathering){const p=world.layout.gatheringCenter;target=new T.Vector3(p.x,4,p.z);}world.terrain.updateView(camera,target,now,dt);}boards?.update(now);soundCamera.update(now);trainFollow?.update(now,dt);if(groupCamera.active&&['closed','closing'].includes(ui.state('meeting'))&&['closed','closing'].includes(ui.state('group-queue')))groupCamera.close();groupCamera.update(now);}
  renderer.render(scene,camera);window.__renderPerformance.frames++;fpsFrames++;if(now-fpsStart>3000){$('viewport').dataset.fps=(fpsFrames*1000/(now-fpsStart)).toFixed(1);fpsFrames=0;fpsStart=now;}frameId=requestAnimationFrame(frame);
 }
 let wasMobile=innerWidth<700;
 window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(wasMobile!==(innerWidth<700)&&!boards?.kind&&!roam?.busy&&!groupCamera.busy){wasMobile=innerWidth<700;cameraPoses.clear();resetCamera();}});
 window.addEventListener('keydown',e=>{if(e.defaultPrevented||e.target.closest('input,textarea,select,[contenteditable],dialog')||!controls.enabled)return;if(e.key==='Escape'){if(e.repeat||switching||roam?.busy||trainFollow?.busy||groupCamera.busy||uiState.main||uiState.modal)return;smoothResetCamera();e.preventDefault();return;}if(e.key==='Home'){resetCamera();e.preventDefault();}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key)&&!e.target.closest('button,input')){cancelReset();const s=new T.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(e.key==='ArrowLeft')s.theta-=.12;if(e.key==='ArrowRight')s.theta+=.12;if(e.key==='ArrowUp')s.phi-=.08;if(e.key==='ArrowDown')s.phi+=.08;if(['+','='].includes(e.key))s.radius*=.9;if(e.key==='-')s.radius*=1.1;s.phi=T.MathUtils.clamp(s.phi,.15,Math.PI*.485);s.radius=T.MathUtils.clamp(s.radius,6,controls.maxDistance);camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(s));controls.update();e.preventDefault();}});
 $('viewport').dataset.loaded='true';$('viewport').dataset.people='0';$('viewport').dataset.landArea=String(world.terrain.root.userData.landArea?.total||0);renderer.render(scene,camera);frameId=requestAnimationFrame(frame);
 window.addEventListener('webglcontextlost',e=>{e.preventDefault();console.warn('WebGL context lost; reload to restore the scene.');});
 if(captureIndex){
  renderer.setPixelRatio(1);renderer.setSize(540,960,false);camera.aspect=540/960;camera.updateProjectionMatrix();controls.enabled=false;
  const views=[[-1.2,4.8,-2,-4.6,3.3,-6.9],[-4.6,4.6,11,-7.85,3.25,8.05],[-5,4.6,9,-8.5,3.2,5.45],[11,4.8,8,7.1,3.3,3.5],[-5,5.2,7,-8.5,3.2,1.5],[16,15,23,0,2.5,0]],view=index=>{const v=views[(index-1)%views.length];camera.position.set(...v.slice(0,3));controls.target.set(...v.slice(3));camera.lookAt(controls.target);};view(captureIndex);
  const base64=blob=>new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(blob);});
  window.__capture={ready:true,audit:world.discovery.audit,async record(index=captureIndex,duration=12000){view(index);await new Promise(r=>setTimeout(r,1000));const poster=renderer.domElement.toDataURL('image/jpeg',.88).split(',')[1],stream=renderer.domElement.captureStream(24),mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t)),recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:2200000}),chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};const done=new Promise(resolve=>recorder.onstop=resolve);recorder.start(1000);await new Promise(r=>setTimeout(r,duration));recorder.stop();await done;stream.getTracks().forEach(t=>t.stop());return{video:await base64(new Blob(chunks,{type:mime})),poster,mime,duration};}};$('viewport').dataset.captureReady='true';
 }
}
boot().catch(error=>{console.error(error);const notice=curtain('这处风景暂时没能加载');notice.dataset.failed='true';notice.querySelector('span:last-of-type').textContent='请重试，或先返回林间来信。';for(const[label,action]of[['重新加载',()=>location.reload()],['返回林间来信',()=>{try{localStorage.setItem(SCENE_STORAGE_KEY,'forest');}catch{}const url=new URL(location.href);url.searchParams.set('scene','forest');location.assign(url.href);}]]){const b=document.createElement('button');b.textContent=label;b.onclick=action;notice.append(b);}});
