import {createNeonFacility} from './public-facility-models.js';
import * as THREE from 'three';
import {createPlacementContext} from './social-characters.js';
import {createDiscoveryPreview} from './discovery-previews.js';
import {createDiscoverySceneIcons} from './discovery-scene-icons.js';
import {COMMUNITY_FACILITIES} from './community-layout.js';

/** Authored timber props: every board remains individually editable. */
export function createDiscoveryScene({scene,camera,controls,renderer,terrain,generated,onOpen,ui,facilities=COMMUNITY_FACILITIES,obstacleCache,templates={}}){
  const placement=createPlacementContext({scene,terrain,generated,obstacleCache});
  const holder=generated||new THREE.Group();if(!generated){holder.name='Interactive woodland facilities';scene.add(holder);}
  const mats={wood:new THREE.MeshStandardMaterial({color:0x806044,roughness:1}),edge:new THREE.MeshStandardMaterial({color:0xb99b6f,roughness:1}),cream:new THREE.MeshStandardMaterial({color:0xf0e8ca,roughness:1}),green:new THREE.MeshStandardMaterial({color:0x6a8668,roughness:1}),orange:new THREE.MeshStandardMaterial({color:0xc58f54,roughness:1}),dark:new THREE.MeshStandardMaterial({color:0x37473e,roughness:1})};
  const moduleEnabled={accounts:true,'scene-video':true};
  const ray=new THREE.Raycaster(),pickables=[],audit={method:'13 support rays and projected body-band obstacle triangles, invariant WALKWAYS; facilities become companion obstacles before graph construction.',facilities:[]};
  function box(parent,name,x,y,z,w,h,d,mat=mats.wood){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.name=name;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function label(text,bg='#e8dfbf',fg='#466146'){
    if(typeof document==='undefined')return mats.cream;
    const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,256);ctx.strokeStyle=fg;ctx.lineWidth=5;ctx.strokeRect(15,15,482,226);ctx.fillStyle=fg;ctx.textAlign='center';ctx.font='bold 43px sans-serif';text.split('\n').forEach((line,i)=>ctx.fillText(line,256,110+i*57));const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshStandardMaterial({map:texture,roughness:1});
  }
  // Keep both facilities on the front (+Z) side of the cottage; never search behind it.
  function find(preferred,radius,used,footprint){
    const choices=[];if(terrain.theme&&terrain.theme!=='forest'){choices.push({x:preferred[0],z:preferred[1],d:0});for(let dz=-3;dz<=3;dz+=.3)for(let dx=-3;dx<=3;dx+=.3)choices.push({x:preferred[0]+dx,z:preferred[1]+dz,d:Math.hypot(dx,dz)});}else for(let z=-9;z<=9;z+=.3)for(let x=-27;x<=-4;x+=.3){if(x>0||z < -1.5)continue;choices.push({x,z,d:Math.hypot(x-preferred[0],z-preferred[1])});}choices.sort((a,b)=>a.d-b.d);
    for(const p of choices){
      if(terrain.facilitySpaceClear&&!terrain.facilitySpaceClear(p.x,p.z))continue;
      if(used.some(u=>Math.hypot(p.x-u.x,p.z-u.z)<radius+u.radius+.35))continue;
      if(!footprint){const check=placement.inspect(p.x,p.z,radius,used);if(check.ok)return {...p,y:check.y,radius};continue;}
      let ok=true,y=2.22;const [width,depth,centerZ]=footprint;
      for(let dz=-depth/2;dz<=depth/2+.01&&ok;dz+=.2)for(let dx=-width/2;dx<=width/2+.01;dx+=.2){const c=placement.inspect(p.x+dx,p.z+centerZ+dz,.12,[]);if(!c.ok){ok=false;break;}y=Math.max(y,c.y);}
      if(ok)return {...p,y,radius};
    }throw new Error('No supported, clear location for discovery facility');
  }
  const used=[];
  function register(group,kind,preferred,radius,footprint){const p=find(preferred,radius,used,footprint);used.push(p);group.position.set(p.x,p.y,p.z);group.name=kind==='accounts'?'Forest newspaper kiosk':'Creekside screening field';group.userData.layoutId='discovery-'+kind;group.traverse(o=>{o.userData.generatedProp=true;o.userData.discoveryKind=kind;});holder.add(group);group.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(group);audit.facilities.push({kind,position:group.position.toArray(),radius,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},support:true});pickables.push(group);return group;}
  const kiosk=new THREE.Group();
  for(const x of [-.69,.69])box(kiosk,'Timber rack upright',x,1.1,0,.12,2.2,.12);
  box(kiosk,'Newspaper rack back',0,1.13,.02,1.5,1.25,.12,mats.green);
  box(kiosk,'Newspaper shelf',0,.66,.18,1.64,.12,.56,mats.edge);
  box(kiosk,'Rack sloped canopy',0,2.25,0,1.9,.15,.8,mats.edge).rotation.x=-.1;
  box(kiosk,'Forest reading sign',0,2.03,.1,1.5,.23,.09,label('林间报刊'));
  const journals=['溪谷\n生活志','阿栗的\n漫游手册','慢慢\n来信'].map((name,i)=>box(kiosk,'Editable printed journal '+i,(i-1)*.46,1.15,.12,.4,.77,.075,label(name,['#d9e0c1','#e6c69b','#e9dfc9'][i])));
  box(kiosk,'Warm reading lamp',.58,1.72,.34,.2,.12,.19,new THREE.MeshStandardMaterial({color:0xffdb89,emissive:0xffb94e,emissiveIntensity:.7}));
  const lamp=new THREE.PointLight(0xffd58d,.8,3);lamp.position.set(.58,1.65,.45);kiosk.add(lamp);
  journals.forEach(j=>j.visible=false);
  const journalPreview=createDiscoveryPreview('accounts'),cinemaPreview=createDiscoveryPreview('scene-video');
  const journalSurface=new THREE.Mesh(new THREE.PlaneGeometry(1.48,1.16),new THREE.MeshBasicMaterial({map:journalPreview?.texture||null,color:journalPreview?0xffffff:0xfaf5df,toneMapped:false}));
  journalSurface.name='Compact public account page';journalSurface.position.set(0,1.27,.20);kiosk.add(journalSurface);
  for(const x of [-.77,.77])box(kiosk,'Reading surface frame',x,1.27,.18,.06,1.24,.06,mats.edge);
  for(const y of [.66,1.88])box(kiosk,'Reading surface rail',0,y,.18,1.6,.06,.06,mats.edge);
  kiosk.rotation.y=0;
  const cinema=new THREE.Group();
  for(const x of [-1.1,1.1]){box(cinema,'Projection frame post',x,1.85,0,.14,3.7,.14);box(cinema,'Projection frame foot',x,.08,.05,.5,.15,.8);}
  box(cinema,'Projection top beam',0,3.69,0,2.43,.17,.19,mats.edge);
  box(cinema,'Projection bottom beam',0,.55,0,2.43,.16,.19,mats.edge);
  box(cinema,'Cream screen backing',0,2.12,.005,2.07,2.95,.07,mats.dark);
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.64,2.91),new THREE.MeshBasicMaterial({color:0xf2e7c2}));screen.name='Shared-video portrait projection, 9:16';screen.position.set(0,2.12,.055);cinema.add(screen);
  screen.material=new THREE.MeshBasicMaterial({map:cinemaPreview?.texture||null,color:cinemaPreview?0xffffff:0xf2e7c2,toneMapped:false});
  box(cinema,'Projector base',.62,.24,1.12,.53,.45,.5,mats.wood);box(cinema,'Vintage projector',.62,.56,1.12,.45,.25,.4,mats.green);
  const lens=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,.16,12),mats.dark);lens.rotation.x=Math.PI/2;lens.position.set(.62,.55,.87);cinema.add(lens);
  for(const [x,z,c] of [[-.65,1.02,mats.orange],[-.06,1.38,mats.green]])box(cinema,'Hand stitched seat cushion',x,.1,z,.48,.18,.48,c);
  cinema.scale.setScalar(.82);
  function replaceShell(group,kind,surface){
    const source=templates[kind]||(terrain.theme==='cyber'?()=>createNeonFacility(kind):null);if(!source)return;
    const old=group.children.filter(child=>child!==surface),geometries=new Set(),materials=new Set();
    for(const child of old){child.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of [].concat(o.material||[]))materials.add(m);});group.remove(child);}
    geometries.forEach(g=>g.dispose());materials.forEach(m=>{if(m.map)m.map.dispose();m.dispose();});
    const model=typeof source==='function'?source():source.clone(true);group.add(model);
    const spec=model.userData.discoverySurface;
    if(spec){surface.geometry.dispose();surface.geometry=new THREE.PlaneGeometry(spec.width,spec.height);surface.position.fromArray(spec.position);surface.material.color.setHex(spec.tint);surface.material.transparent=true;surface.material.opacity=spec.opacity;surface.material.side=THREE.DoubleSide;surface.material.depthWrite=false;surface.userData.baseTint=spec.tint;group.userData.holographic=true;}
  }
  replaceShell(kiosk,'accounts',journalSurface);replaceShell(cinema,'scene-video',screen);
  const cinemaSpot=facilities.cinema;register(cinema,'scene-video',[cinemaSpot.x,cinemaSpot.z],1.3,[2.0,1.65,.48]);
  // Reserve the larger screen first, then stagger the journal beside the front path.
  const kioskSpot=facilities.kiosk;register(kiosk,'accounts',[kioskSpot.x,kioskSpot.z],1.1,[1.9,.9,.05]);
  let saved=null,transition=null,down=null,focusKind=null,focusedPose=null;
  const reduced=()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function surface(kind){
    const accounts=kind==='accounts',group=accounts?kiosk:cinema;
    group.updateWorldMatrix(true,false);
    const scale=group.getWorldScale(new THREE.Vector3());
    const plane=accounts?journalSurface:screen;
    return {position:group.localToWorld(plane.position.clone()),quaternion:group.getWorldQuaternion(new THREE.Quaternion()),width:plane.geometry.parameters.width*Math.abs(scale.x),height:plane.geometry.parameters.height*Math.abs(scale.y)};
  }
  function move(position,target,restore=false,duration=750){
    // Settling superseded callers keeps rapid switches and dismissals last-wins.
    transition?.resolve();
    return new Promise(resolve=>{transition={start:performance.now(),from:camera.position.clone(),targetFrom:controls.target.clone(),position:position.clone(),target:target.clone(),restore,duration,resolve};});
  }
  function focus(kind,{duration=750}={}){
    if(!saved)saved={position:camera.position.clone(),target:controls.target.clone(),enabled:controls.enabled,minDistance:controls.minDistance,enableDamping:controls.enableDamping};
    focusKind=kind==='accounts'?'accounts':'scene-video';
    const board=surface(focusKind),normal=new THREE.Vector3(0,0,1).applyQuaternion(board.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(board.quaternion);
    const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov)/2),aspect=Math.max(.2,camera.aspect);
    // Fit both axes: portrait displays keep the journal board inside the viewport.
    const distance=Math.max(board.height/(2*tan*.82),(board.width+.12)/(2*tan*aspect*.92));
    const target=board.position.clone(),position=target.clone().addScaledVector(normal,distance).addScaledVector(up,distance*.025);
    focusedPose={position,target};controls.enabled=false;controls.minDistance=.25;controls.enableDamping=false;
    return move(position,target,false,duration);
  }
  function restore({duration=480}={}){
    focusKind=null;focusedPose=null;
    if(!saved)return Promise.resolve();
    return move(saved.position,saved.target,true,duration);
  }
  function setBoardActive(kind,active){(kind==='accounts'?journalSurface:screen).visible=!active;}
  function setEmphasis(kind,value){const plane=kind==='accounts'?journalSurface:screen;plane.material.color.setHex(plane.userData.baseTint??0xffffff).multiplyScalar(1+Math.max(0,value)*.12);}
  function updatePreview(kind,id){if(!moduleEnabled[kind==='accounts'?'accounts':'scene-video'])return;return (kind==='accounts'?journalPreview:cinemaPreview)?.update(id);}
  function preview(kind){return (kind==='accounts'?journalPreview:cinemaPreview)?.data;}
  const sceneIcons=typeof document==='undefined'?null:createDiscoverySceneIcons({camera,groups:{accounts:kiosk,'scene-video':cinema},onOpen,preview,ui,isEnabled:kind=>moduleEnabled[kind],interactive:()=>!transition&&!focusKind&&controls.enabled});
  function pose(){return {position:camera.position.toArray(),target:controls.target.toArray(),enabled:controls.enabled};}
  function update(now){
    sceneIcons?.update();
    if(!document.hidden)for(const group of [kiosk,cinema])if(group.visible&&group.userData.holographic)group.traverse(o=>{const scan=o.userData.hologramScan;if(scan)o.position.y=THREE.MathUtils.lerp(scan.min,scan.max,reduced()?.5:(now/7000)%1);});
    if(transition){const current=transition,t=(reduced()?1:Math.min(1,(now-current.start)/Math.max(1,current.duration))),s=t*t*t*(t*(t*6-15)+10);camera.position.lerpVectors(current.from,current.position,s);controls.target.lerpVectors(current.targetFrom,current.target,s);camera.lookAt(controls.target);if(t===1){if(current.restore){controls.enabled=saved?.enabled??true;controls.minDistance=saved?.minDistance??6;controls.enableDamping=saved?.enableDamping??true;saved=null;}transition=null;current.resolve();}}
    else if(focusedPose){camera.position.copy(focusedPose.position);controls.target.copy(focusedPose.target);camera.lookAt(controls.target);}

  }
  function up(e){const p=down;down=null;if(!p||p.id!==e.pointerId||Math.hypot(e.clientX-p.x,e.clientY-p.y)>6)return;const rect=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(pickables.filter(g=>g.visible),true)[0];if(!hit)return;const obstacles=ray.intersectObjects(placement.occluders,false);if(obstacles[0]&&obstacles[0].distance<hit.distance-.05)return;const kind=hit.object.userData.discoveryKind;onOpen?.(kind);}
  const pointer=e=>{if(document.querySelector('dialog[open]'))return;if(e.button===0)down={x:e.clientX,y:e.clientY,id:e.pointerId};};renderer.domElement.addEventListener('pointerdown',pointer);renderer.domElement.addEventListener('pointerup',up);
  function screenPoint(kind){const group=kind==='accounts'?kiosk:cinema,plane=kind==='accounts'?journalSurface:screen;const p=group.localToWorld(plane.position.clone()).project(camera);const rect=renderer.domElement.getBoundingClientRect();return {x:rect.left+(p.x*.5+.5)*rect.width,y:rect.top+(-p.y*.5+.5)*rect.height};}
  function setModuleEnabled(kind,value){
    if(!(kind in moduleEnabled))return;moduleEnabled[kind]=!!value;const group=kind==='accounts'?kiosk:cinema;group.visible=!!value;group.userData.modDisabled=!value;sceneIcons?.update();
  }
  return {setModuleEnabled,isModuleEnabled:kind=>moduleEnabled[kind],get labelAnchors(){return sceneIcons?.anchors||[];},focus,restore,update,audit,kiosk,cinema,screenPoint,surface,setBoardActive,setEmphasis,updatePreview,preview,pose,get previewsReady(){return Promise.all([journalPreview?.ready,cinemaPreview?.ready]);},get focusKind(){return focusKind;},get isFocused(){return !!focusKind&&!transition;},get transitioning(){return !!transition;},dispose(){placement.dispose();transition?.resolve();transition=null;renderer.domElement.removeEventListener('pointerdown',pointer);renderer.domElement.removeEventListener('pointerup',up);sceneIcons?.dispose();journalPreview?.dispose();cinemaPreview?.dispose();kiosk.removeFromParent();cinema.removeFromParent();}};
}
