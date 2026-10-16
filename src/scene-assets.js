import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadRodinProps} from './rodin-props.js';
import {loadValleyAssets} from './valley-assets.js';
import {loadGroupTemplates} from './group-scene.js';
import {createJapaneseBuilding} from './japanese-buildings.js';
import {PLACEMENTS} from './layout.js';
import {isTree} from './tree-assets.js';
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
const dimensions={fuji:[36,16.5,24.6],sakura_a:[3.8,4.7,3.4],sakura_b:[3.8,4.7,3.4],locomotive:[3.8,2.1,1.25],carriage:[FUJI_CARRIAGE.length,FUJI_CARRIAGE.height,FUJI_CARRIAGE.width],station:[7.8,3.2,2.2],track:[3.48,.19,1.65],gate:[.65,2.5,.6]};
export async function prepareSceneAssets(id){
 if(cache.has(id))return cache.get(id);
 const request=(async()=>{
  recordCache||=new GLTFLoader().loadAsync('assets/rodin/record-player/scene.glb').then(g=>retain(g.scene)).catch(error=>{recordCache=null;throw error;});
  const recordModel=await recordCache;
  if(id==='forest'){
   const kinds=[...new Set([...PLACEMENTS.filter(p=>p.enabled!==false).map(p=>p.kind),'tree','tree_birch','tree_maple','rock','grass','fern_large'])];
   const [props,trees,valley,groups]=await Promise.all([
    loadRodinProps({kinds:kinds.filter(kind=>!isTree(kind))}),
    loadRodinProps({kinds:kinds.filter(isTree)}).catch(error=>{console.warn('Forest tree assets unavailable; using grounded procedural trees.',error);return{};}),
    new URLSearchParams(location.search).has('native-valley')?{}:loadValleyAssets(),loadGroupTemplates({onLoad:retain}),
   ]);
   Object.assign(props,trees);
   for(const p of [...Object.values(props),...Object.values(valley)])retain(p.model);
   Object.values(groups.templates).forEach(retain);return{props,valley,groups,recordModel,failures:groups.failures};
  }
  const models={},failures=[],loader=new GLTFLoader();
  await Promise.all([...Object.keys(dimensions),'club','classroom','sport','lab','library','music','art','cafe','observatory'].map(async key=>{
   try{
    const folder=['fuji','sakura_a','sakura_b'].includes(key)?key:'railway-'+key;
    const model=(await loader.loadAsync(`assets/rodin-fuji/${folder}/scene.glb`)).scene;
    const manifest=await fetch(`assets/rodin-fuji/${folder}/manifest.json`).then(r=>r.ok?r.json():{}).catch(()=>({}));
    model.rotation.y=manifest.rotationY??manifest.normalization?.rotationY??0;model.updateMatrixWorld(true);
    const b=new T.Box3().setFromObject(model),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3()),d=dimensions[key]||[4,4.2,3.5];
    if(!s.y)throw Error('Empty model');model.position.sub(new T.Vector3(c.x,b.min.y,c.z));
    const holder=new T.Group();holder.name='Rodin Fuji · '+key;holder.add(model);
    const scale=Math.min(d[0]/s.x,d[1]/s.y,d[2]/s.z);holder.scale.setScalar(scale);
    if(key==='fuji'||key==='track'||key==='carriage')holder.scale.set(d[0]/s.x,d[1]/s.y,d[2]/s.z);
    holder.traverse(o=>{o.userData.generatedProp=true;if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;
     for(const m of [].concat(o.material)){m.roughness=.94;m.metalness=0;if(m.map){m.map.colorSpace=T.SRGBColorSpace;m.map.anisotropy=4;}}
    });models[key]=retain(holder);
   }catch{failures.push(key);}
  }));
  const groups=await loadGroupTemplates({theme:'fuji',createTemplate:key=>models[key]||createJapaneseBuilding(key)});
  groups.failures=failures.filter(key=>!dimensions[key]);Object.values(groups.templates).forEach(retain);
  return{models,groups,recordModel,failures};
 })();cache.set(id,request);
 try{return await request;}catch(error){cache.delete(id);throw error;}
}
export const assetCacheSnapshot=()=>({themes:[...cache.keys()],sharedResources:shared.size});
