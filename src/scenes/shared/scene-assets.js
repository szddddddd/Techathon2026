import {prepareNightWindowMasks} from './night-window-masks.js';
import {FUJI_VISUALS} from '../fuji/fuji-visuals.js';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadRodinProps} from '../forest/rodin-props.js';
import {loadValleyAssets} from '../forest/valley-assets.js';
import {loadGroupTemplates} from '../../social/group-scene.js';
import {createJapaneseBuilding} from '../fuji/japanese-buildings.js';
import {PLACEMENTS} from '../forest/layout.js';
import {isTree} from '../forest/tree-assets.js';
import {FUJI_CARRIAGE} from '../fuji/fuji-railway.js';
import {loadIdealAssets} from '../ideal/ideal-scene.js';

const cache=new Map(),sceneryCache=new Map(),mailboxCache=new Map(),shared=new Set();let recordCache;
export function sceneResources(root){const resources=new Set();root?.traverse(o=>{
 if(o.isInstancedMesh)resources.add(o);
 if(o.isLight&&o.shadow)resources.add(o.shadow);
 if(o.geometry)resources.add(o.geometry);
 for(const m of [...(Array.isArray(o.material)?o.material:o.material?[o.material]:[]),o.customDepthMaterial,o.customDistanceMaterial].filter(Boolean)){
  resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value);
 }
});return resources;}
export function disposeSceneResources(resources){for(const value of resources)if(!shared.has(value))value.dispose?.();}
const retain=root=>{for(const resource of sceneResources(root))shared.add(resource);return root;};
// Cache immutable templates, not live scene instances. Failed requests can retry.
export function prepareMailboxAsset(id){
 if(!['forest','fuji','ideal'].includes(id))return Promise.reject(Error('未知场景'));
 if(!mailboxCache.has(id))mailboxCache.set(id,new GLTFLoader().loadAsync(`assets/mailboxes/${id}/scene.glb`).then(g=>retain(g.scene)).catch(error=>{mailboxCache.delete(id);throw error;}));
 return mailboxCache.get(id);
}
const dimensions={fuji:[36,16.5,24.6],sakura_a:[3.8,4.7,3.4],sakura_b:[3.8,4.7,3.4],sakura_c:[3.8,4.7,3.4],locomotive:[3.8,2.1,1.25],carriage:[FUJI_CARRIAGE.length,FUJI_CARRIAGE.height,FUJI_CARRIAGE.width],station:[7.8,3.2,2.2],track:[3.48,.19,1.65],gate:[.65,2.5,.6]};
export function normalizeSceneAsset(model,key,{rotation=0,sourceFolder=key}={}){
    model.rotation.y=rotation;model.updateMatrixWorld(true);
    const b=new T.Box3().setFromObject(model),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3()),d=dimensions[key]||[4,4.2,3.5];
    if(!s.y)throw Error('Empty model');
    if(key.startsWith('sakura_')){const base=new T.Box3(),point=new T.Vector3();model.traverse(o=>{if(!o.isMesh)return;const positions=o.geometry.attributes.position;for(let i=0;i<positions.count;i++){point.fromBufferAttribute(positions,i).applyMatrix4(o.matrixWorld);if(point.y<b.min.y+s.y*.035)base.expandByPoint(point);}});if(!base.isEmpty()){const foot=base.getCenter(new T.Vector3());c.x=foot.x;c.z=foot.z;}}
    model.position.sub(new T.Vector3(c.x,b.min.y,c.z));
    const holder=new T.Group();holder.name='Rodin Fuji · '+key;holder.add(model);
    const scale=Math.min(d[0]/s.x,d[1]/s.y,d[2]/s.z);holder.scale.setScalar(key.startsWith('sakura_')?4.7/s.y:scale);
    if(key==='fuji'||key==='track'||key==='carriage')holder.scale.set(d[0]/s.x,d[1]/s.y,d[2]/s.z);
    if(key.startsWith('sakura_')){holder.updateMatrixWorld(true);let radius=0;const point=new T.Vector3();holder.traverse(o=>{if(!o.isMesh)return;const positions=o.geometry.attributes.position;for(let i=0;i<positions.count;i++){point.fromBufferAttribute(positions,i).applyMatrix4(o.matrixWorld);radius=Math.max(radius,Math.hypot(point.x,point.z));}});holder.userData.treeRadius=radius;holder.userData.treeAsset=sourceFolder;}
    holder.traverse(o=>{o.userData.generatedProp=true;if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;
     for(const m of [].concat(o.material)){m.roughness=.94;m.metalness=0;if(m.map){m.map.colorSpace=T.SRGBColorSpace;m.map.anisotropy=4;}}
    });return holder;
}
async function loadBuildingAssets(theme){
 const loader=new GLTFLoader(),buildings={};
 await Promise.all(['notes','focus'].map(async mod=>{try{const folder=`assets/buildings/${theme}/${mod}`,g=await loader.loadAsync(folder+'/scene.glb'),model=g.scene;model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());model.position.sub(new T.Vector3(center.x,box.min.y,center.z));const target=mod==='notes'?[2.2,2.8,2.2]:[2.8,3.1,2.8];model.scale.setScalar(Math.min(target[0]/size.x,target[1]/size.y,target[2]/size.z));const holder=new T.Group();holder.name=`${theme} building ${mod}`;holder.add(model);holder.userData.buildingKey=`${theme}:${mod}`;holder.userData.moduleId=mod;holder.userData.theme=theme;holder.userData.footprint=Math.max(target[0],target[2])*.54;model.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;o.userData.generatedProp=true;}});buildings[`${theme}:${mod}`]=retain(holder);}catch(error){console.warn('Building asset unavailable',theme,mod,error.message);}}));return buildings;
}
export async function prepareSceneAssets(id){
 if(cache.has(id))return cache.get(id);
 const request=(async()=>{
  if(id==='ideal'){const a=await loadIdealAssets(retain);a.buildings=await loadBuildingAssets(id);return a;}
  if(!['forest','fuji'].includes(id))throw Error('Unknown scene assets: '+id);
  recordCache||=new GLTFLoader().loadAsync('assets/rodin/record-player/scene.glb').then(g=>retain(g.scene)).catch(error=>{recordCache=null;throw error;});
  // Start independent asset work before awaiting the shared record player. Attach
  // both rejection handlers together so an early failure never goes unhandled.
  // A record-player failure must not discard successfully prepared scenery or
  // duplicate its still-running downloads and retained resources on retry.
  let assetsRequest=sceneryCache.get(id);
  if(!assetsRequest){assetsRequest=(async()=>{
  if(id==='forest'){
   const kinds=[...new Set([...PLACEMENTS.filter(p=>p.enabled!==false).map(p=>p.kind),'tree','tree_birch','tree_maple','rock','grass','fern_large'])];
   const [props,trees,valley,groups]=await Promise.all([
    loadRodinProps({kinds:kinds.filter(kind=>!isTree(kind))}),
    loadRodinProps({kinds:kinds.filter(isTree)}).catch(error=>{console.warn('Forest tree assets unavailable; using grounded procedural trees.',error);return{};}),
    new URLSearchParams(location.search).has('native-valley')?{}:loadValleyAssets(),loadGroupTemplates({onLoad:retain}),
   ]);
   Object.assign(props,trees);
   for(const p of [...Object.values(props),...Object.values(valley)])retain(p.model);
   for(const [key,model] of Object.entries(groups.templates)){prepareNightWindowMasks(model,key);retain(model);}return{props,valley,groups,failures:groups.failures};
  }
  const models={},failures=[],fallbacks=[],loader=new GLTFLoader();
  const loadFolder=async folder=>{
   const [gltf,manifest]=await Promise.all([
    loader.loadAsync(`assets/rodin-fuji/${folder}/scene.glb`),
    fetch(`assets/rodin-fuji/${folder}/manifest.json`).then(r=>r.ok?r.json():{}).catch(()=>({})),
   ]);
   return{model:gltf.scene,manifest};
  };
  await Promise.all([...Object.keys(dimensions),'club','classroom','sport','lab','library','music','art','cafe','observatory'].map(async key=>{
   try{
    let folder=FUJI_VISUALS.treeAssets[key]||(['fuji','sakura_a','sakura_b'].includes(key)?key:'railway-'+key),loaded;
    try{loaded=await loadFolder(folder);}catch(error){if(!key.startsWith('sakura_'))throw error;const requested=folder,index=Object.keys(FUJI_VISUALS.treeAssets).indexOf(key);folder=FUJI_VISUALS.treeFallbacks[index];try{loaded=await loadFolder(folder);}catch{folder=index===0?'sakura_a':'sakura_b';loaded=await loadFolder(folder);}fallbacks.push({key,requested,used:folder});}
    const {model,manifest}=loaded;
    const holder=normalizeSceneAsset(model,key,{rotation:manifest.rotationY??manifest.normalization?.rotationY??0,sourceFolder:folder});models[key]=retain(holder);
   }catch{failures.push(key);}
  }));
  const groups=await loadGroupTemplates({theme:'fuji',createTemplate:key=>models[key]||createJapaneseBuilding(key)});
  groups.failures=failures.filter(key=>!dimensions[key]);for(const [key,model] of Object.entries(groups.templates)){prepareNightWindowMasks(model,key);retain(model);}
  return{models,groups,failures,fallbacks};
  })().catch(error=>{sceneryCache.delete(id);throw error;});sceneryCache.set(id,assetsRequest);}
  const [recordModel,assets]=await Promise.all([recordCache,assetsRequest]);
  return{...assets,buildings:await loadBuildingAssets(id),recordModel};
 })();cache.set(id,request);
 try{return await request;}catch(error){cache.delete(id);throw error;}
}
export const assetCacheSnapshot=()=>({themes:[...cache.keys()],mailboxes:[...mailboxCache.keys()],sharedResources:shared.size});

// Keep CPU templates for fast revisits, but stop retaining the GPU allocations
// for every previously visited world on memory-constrained phones. dispose()
// preserves source buffers/images; Three uploads them again if revisited.
export function releaseInactiveAssetGPU(activeScene){
 const active=sceneResources(activeScene);let released=0;
 for(const resource of shared)if(!active.has(resource)){resource.dispose?.();released++;}
 return released;
}
