import {FUJI_VISUALS} from './fuji-visuals.js';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadRodinProps} from './rodin-props.js';
import {loadValleyAssets} from './valley-assets.js';
import {loadGroupTemplates} from './group-scene.js';
import {createJapaneseBuilding} from './japanese-buildings.js';
import {PLACEMENTS} from './layout.js';
import {FUJI_CARRIAGE} from './fuji-railway.js';

const cache=new Map(),shared=new Set();let recordCache;
export function sceneResources(root){const resources=new Set();root?.traverse(o=>{
 if(o.isInstancedMesh)resources.add(o);
 if(o.geometry)resources.add(o.geometry);
 for(const m of [...(Array.isArray(o.material)?o.material:o.material?[o.material]:[]),o.customDepthMaterial,o.customDistanceMaterial].filter(Boolean)){
  resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value);
 }
});return resources;}
export function disposeSceneResources(resources){for(const value of resources)if(!shared.has(value))value.dispose?.();}
const retain=root=>{for(const resource of sceneResources(root))shared.add(resource);return root;};
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
export async function prepareSceneAssets(id){
 if(cache.has(id))return cache.get(id);
 const request=(async()=>{
  recordCache||=new GLTFLoader().loadAsync('assets/rodin/record-player/scene.glb').then(g=>retain(g.scene)).catch(error=>{recordCache=null;throw error;});
  const recordModel=await recordCache;
  if(id==='forest'){
   const [props,valley,groups]=await Promise.all([loadRodinProps({kinds:[...PLACEMENTS.filter(p=>p.enabled!==false).map(p=>p.kind),'tree','tree_birch','tree_maple','rock','grass','fern_large']}),new URLSearchParams(location.search).has('native-valley')?{}:loadValleyAssets(),loadGroupTemplates({onLoad:retain})]);
   for(const p of [...Object.values(props),...Object.values(valley)])retain(p.model);
   Object.values(groups.templates).forEach(retain);return{props,valley,groups,recordModel,failures:groups.failures};
  }
  const models={},failures=[],fallbacks=[],loader=new GLTFLoader();
  await Promise.all([...Object.keys(dimensions),'club','classroom','sport','lab','library','music','art','cafe','observatory'].map(async key=>{
   try{
    let folder=FUJI_VISUALS.treeAssets[key]||(['fuji','sakura_a','sakura_b'].includes(key)?key:'railway-'+key),model;
    try{model=(await loader.loadAsync(`assets/rodin-fuji/${folder}/scene.glb`)).scene;}catch(error){if(!key.startsWith('sakura_'))throw error;const requested=folder,index=Object.keys(FUJI_VISUALS.treeAssets).indexOf(key);folder=FUJI_VISUALS.treeFallbacks[index];try{model=(await loader.loadAsync(`assets/rodin-fuji/${folder}/scene.glb`)).scene;}catch{folder=index===0?'sakura_a':'sakura_b';model=(await loader.loadAsync(`assets/rodin-fuji/${folder}/scene.glb`)).scene;}fallbacks.push({key,requested,used:folder});}
    const manifest=await fetch(`assets/rodin-fuji/${folder}/manifest.json`).then(r=>r.ok?r.json():{}).catch(()=>({}));
    const holder=normalizeSceneAsset(model,key,{rotation:manifest.rotationY??manifest.normalization?.rotationY??0,sourceFolder:folder});models[key]=retain(holder);
   }catch{failures.push(key);}
  }));
  const groups=await loadGroupTemplates({theme:'fuji',createTemplate:key=>models[key]||createJapaneseBuilding(key)});
  groups.failures=failures.filter(key=>!dimensions[key]);Object.values(groups.templates).forEach(retain);
  return{models,groups,recordModel,failures,fallbacks};
 })();cache.set(id,request);
 try{return await request;}catch(error){cache.delete(id);throw error;}
}
export const assetCacheSnapshot=()=>({themes:[...cache.keys()],sharedResources:shared.size});
