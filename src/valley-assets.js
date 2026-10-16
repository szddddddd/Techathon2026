import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export const VALLEY_ASSET_NAMES={mountain_range:'山涧连绵山脉',letter_tree:'来信树灯',curved_seat:'弧形石坐阶',wood_bench:'林间长椅',stone_ring:'苔缝石环',notice_board:'森林告示牌',viewing_frame:'观景木框'};
export async function loadValleyAssets(){
  const loader=new GLTFLoader(),assets={};
  await Promise.all(Object.keys(VALLEY_ASSET_NAMES).filter(kind=>!['curved_seat','stone_ring','viewing_frame'].includes(kind)).map(async kind=>{
    try{const {scene:model}=await loader.loadAsync(kind==='mountain_range'?'assets/rodin-mountain/scene.glb':`assets/rodin-valley/${kind}/scene.glb`);
      model.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;const adapt=m=>{const copy=m.clone();copy.roughness=.94;copy.metalness=0;copy.envMapIntensity=.2;if(copy.normalScale)copy.normalScale.multiplyScalar(.55);if(copy.map){copy.map.colorSpace=THREE.SRGBColorSpace;copy.map.anisotropy=4;}return copy;};o.material=Array.isArray(o.material)?o.material.map(adapt):adapt(o.material);});
      assets[kind]={model};
    }catch(error){console.warn(`Valley asset ${kind} unavailable; retaining authored fallback.`);}
  }));return assets;
}

/** Fit once, share geometry/materials between instances, keep flat feet at y=0. */
export function valleyInstance(assets,kind,{width,height,depth,rotation=0}={}){
  const source=assets?.[kind];if(!source)return null;
  const root=new THREE.Group(),model=source.model.clone(true);model.rotation.y=rotation;model.updateMatrixWorld(true);
  const b=new THREE.Box3().setFromObject(model),size=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());model.position.sub(new THREE.Vector3(c.x,b.min.y,c.z));root.add(model);
  const scalar=height?height/size.y:width/size.x;root.scale.set(width?width/size.x:scalar,height?height/size.y:scalar,depth?depth/size.z:scalar);
  root.name='Rodin · '+VALLEY_ASSET_NAMES[kind];root.userData.rodinValley=kind;root.traverse(o=>{o.userData.generatedProp=true;});return root;
}
