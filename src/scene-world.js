import {FUJI_VISUALS} from './fuji-visuals.js';
import {freezeStaticTransforms} from './static-transforms.js';
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {buildTerrain} from './terrain.js';
import {buildArchitecture} from './architecture.js';
import {buildNature} from './nature.js';
import {placeRodinProps} from './rodin-props.js';
import {setReservedFootprints} from './layout.js';
import {buildValleyLandmarks} from './valley-landmarks.js';
import {createCommunityGround} from './town-landscape.js';
import {GROUP_SLOTS,GROUP_QUEUE,COMMUNITY_FACILITIES} from './community-layout.js';
import {buildFujiScene} from './fuji-scene.js';
import {FUJI_LAYOUT} from './fuji-layout.js';
import {createDiscoveryScene} from './discovery-scene.js';
import {createRecordPlayer} from './record-player.js';
import {prepareSceneAssets,sceneResources,disposeSceneResources} from './scene-assets.js';

export const SCENE_REGISTRY={
 forest:{id:'forest',name:'林间来信',background:0x203a32,hemi:0xc7e3d2,ground:0x3e5233,sun:0xffe3a1,sunIntensity:3.7,layout:{slots:GROUP_SLOTS,queue:GROUP_QUEUE,facilities:COMMUNITY_FACILITIES},camera:{position:[40,36,66],target:[0,0,-5],mobile:[60,106,152],mobileTarget:[0,0,-7]}},
 fuji:{id:'fuji',name:'富士樱町',...FUJI_VISUALS.environment,layout:FUJI_LAYOUT,camera:{position:[33,33,64],target:[0,2,-5],mobile:[24,100,172],mobileTarget:[0,4,-7]}},
};
function batchForest(root,architecture,nature){
 const animated=new Set(architecture.flames||[]);for(const b of nature.butterflies||[])b.group.traverse(o=>animated.add(o));
 const buckets=new Map();root.updateMatrixWorld(true);
 root.traverse(o=>{if(!o.isMesh||o.userData.riverOwned||o.userData.generatedProp||animated.has(o)||Array.isArray(o.material)||o.material.vertexColors||o.material.transparent||o.material.isShaderMaterial||o.name.includes('foam')||o.name.includes('filament'))return;const key=o.material.uuid+o.castShadow+o.receiveShadow;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);});
 for(const objects of buckets.values()){
  if(objects.length<8)continue;const geometries=objects.map(o=>{let g=o.geometry.clone();if(g.index){const flat=g.toNonIndexed();g.dispose();g=flat;}g.applyMatrix4(o.matrixWorld);for(const key of Object.keys(g.attributes))if(!['position','normal','uv'].includes(key))g.deleteAttribute(key);if(!g.attributes.uv)g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));return g;});
  const combined=mergeGeometries(geometries);if(combined){const mesh=new T.Mesh(combined,objects[0].material);mesh.name='Batched scenery';mesh.castShadow=objects[0].castShadow;mesh.receiveShadow=objects[0].receiveShadow;root.add(mesh);objects.forEach(o=>o.removeFromParent());}geometries.forEach(g=>g.dispose());
 }
}
// Scene-owned DOM listens through an activation gate while the next world mounts.
function gatedUI(ui){let enabled=false,last={},callbacks=new Set();const off=ui.subscribe(s=>{last=s;for(const fn of callbacks)fn(enabled?s:{...s,main:'scene-loading'});});return{
 facade:{subscribe(fn){callbacks.add(fn);fn(enabled?last:{...last,main:'scene-loading'});return()=>callbacks.delete(fn);}},
 activate(value){enabled=value;for(const fn of callbacks)fn(enabled?last:{...last,main:'scene-loading'});},dispose(){off();callbacks.clear();},
};}
export async function prepareSceneWorld(id,{reduced}={}){
 const config=SCENE_REGISTRY[id];if(!config)throw Error('未知场景');
 const assets=await prepareSceneAssets(id),root=new T.Group();root.name='Scene world · '+id;root.userData.sceneWorld=id;
 const obstacleCache=new WeakMap();let frozenTransforms=0,background=null;
 if(config.backgroundTop&&typeof document!=='undefined'){const canvas=document.createElement('canvas');canvas.width=32;canvas.height=512;const context=canvas.getContext('2d'),gradient=context.createLinearGradient(0,0,0,512);gradient.addColorStop(0,'#'+config.backgroundTop.toString(16).padStart(6,'0'));gradient.addColorStop(.6,'#'+config.background.toString(16).padStart(6,'0'));gradient.addColorStop(1,'#'+config.backgroundBottom.toString(16).padStart(6,'0'));context.fillStyle=gradient;context.fillRect(0,0,32,512);background=new T.CanvasTexture(canvas);background.colorSpace=T.SRGBColorSpace;}

 let terrain,generated=null,architecture={flames:[],lights:[]},nature={butterflies:[]},landmarks,discovery,record,gate,active=false,disposed=false,unbatched,flies;
 try{
  if(id==='fuji'){terrain=buildFujiScene(root,{reduced,assets:assets.models});landmarks=terrain.landmarks;}
  else{
   terrain=buildTerrain(root,{rodinBridge:!!assets.props?.bridge,riverAssets:assets.props,valleyAssets:assets.valley,reduced});
   generated=placeRodinProps(root,assets.props,terrain);architecture=buildArchitecture(root,{rodin:true,expanded:true});
   nature=buildNature(root,{rodin:true,expanded:true,terrain,fallbackTrees:!assets.props.tree});
   if(nature.props.children.length){
    generated.add(...nature.props.children);generated.userData.inventory.push(...nature.props.userData.inventory);
    setReservedFootprints(generated.userData.inventory.map(({bounds:b})=>({minX:b.min[0],maxX:b.max[0],minZ:b.min[2],maxZ:b.max[2]})));
   }
   createCommunityGround(root);landmarks=buildValleyLandmarks({scene:root,terrain,generated,assets:assets.props,valleyAssets:assets.valley});
   const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(42*3),3));flies=new T.Points(g,new T.PointsMaterial({color:0xe6f5a3,size:.075,transparent:true,opacity:.75,depthWrite:false}));flies.name='Floating firefly lights';flies.frustumCulled=false;root.add(flies);
  }
  terrain.theme=id;terrain.placementRoot=root;root.updateMatrixWorld(true);unbatched=sceneResources(root);
 }catch(error){background?.dispose();disposeSceneResources(sceneResources(root));throw error;}
 return{
  id,config,background,root,terrain,generated,obstacleCache,get frozenTransforms(){return frozenTransforms;},architecture,nature,landmarks,assets,layout:config.layout,
  get discovery(){return discovery;},get record(){return record;},
  async mount({camera,controls,renderer,ui,sound,onDiscovery,onRecord}){
   gate=gatedUI(ui);
   try{
    discovery=createDiscoveryScene({scene:root,camera,controls,renderer,terrain,generated,onOpen:onDiscovery,ui:gate.facade,facilities:config.layout.facilities,obstacleCache});
    if(!generated)terrain.landmarkObstacles.push(discovery.kiosk,discovery.cinema);
    record=await createRecordPlayer({scene:root,camera,canvas:renderer.domElement,terrain,generated,ui:gate.facade,sound,reduced,onOpen:onRecord,position:config.layout.recordPlayer,modelTemplate:assets.recordModel,externalDisposal:true});
    terrain.landmarkObstacles.push(record.root);root.updateMatrixWorld(true);
   }catch(error){this.dispose();throw error;}
   return this;
  },
  activate(){active=true;root.visible=true;terrain.activate?.();gate?.activate(true);},
  suspend(){active=false;root.visible=false;terrain.suspend?.();gate?.activate(false);},
  finishBatch(){if(id==='forest')batchForest(root,architecture,nature);frozenTransforms=freezeStaticTransforms(root,[terrain.river?.root,terrain.train?.root,terrain.ferrisWheel?.root,terrain.petals?.root,record?.root,discovery?.kiosk,discovery?.cinema,...architecture.flames,...nature.butterflies.map(b=>b.group)]);},
  update(now,dt,time){
   if(!active||disposed)return;record?.update(now,dt);discovery?.update(now);terrain.river?.update(time,dt);terrain.update?.(time,dt);
   for(const [i,f] of architecture.flames.entries()){f.scale.y=.85+Math.sin(time*7+i*1.6)*.16;f.rotation.y=time*.3+i;}
   if(architecture.lights[0])architecture.lights[0].intensity=2.5+Math.sin(time*9)*.5;
   for(const b of nature.butterflies||[]){b.group.position.copy(b.origin);b.group.position.y+=Math.sin(time*1.3+b.phase)*.25;b.group.position.x+=Math.sin(time*.5+b.phase)*.35;b.wings.forEach((w,i)=>w.rotation.y=(i?1:-1)*Math.sin(time*9+b.phase)*.85);}
   if(flies){const p=flies.geometry.attributes.position;for(let i=0;i<42;i++){const a=i*2.399,r=3+i%9*.8;p.setXYZ(i,Math.cos(a)*r+Math.sin(time*.4+i)*.3,2.6+i%5*.45+Math.sin(time*.6+i)*.25,Math.sin(a)*r+Math.cos(time*.3+i)*.2);}p.needsUpdate=true;}
  },
  dispose(){if(disposed)return;disposed=true;active=false;background?.dispose();const resources=new Set([...unbatched||[],...sceneResources(root)]);discovery?.dispose();record?.dispose();gate?.dispose();terrain.dispose?.();root.removeFromParent();disposeSceneResources(resources);},
 };
}
