import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ASSET_NAMES, PLACEMENTS, setReservedFootprints } from './layout.js';
import {TREE_VARIANTS,isTree,treeAssetPath,groundTree,lightTreeFoliage} from './tree-assets.js';

/** Local, generated assets. API access is exclusively in the offline Python script. */
export async function loadRodinProps({kinds=Object.keys(ASSET_NAMES)}={}){
  const loader=new GLTFLoader();
  const entries=await Promise.all([...new Set(kinds)].filter(name=>name!=='cottage').map(async name=>{
    const gltf=await loader.loadAsync(treeAssetPath(name));
    const model=gltf.scene;
    model.name=`Rodin ${name} source`;
    model.traverse(object=>{
      if(!object.isMesh)return;
      object.castShadow=true;object.receiveShadow=true;
      const adapt=original=>{
        let material;
        if(original.isMeshStandardMaterial){material=original.clone();}
        else{material=new THREE.MeshStandardMaterial({map:original.map,color:original.color?.clone()||new THREE.Color('white'),transparent:original.transparent,opacity:original.opacity,alphaTest:original.alphaTest,side:original.side});}
        material.roughness=.95;material.metalness=0;
        if(material.normalScale)material.normalScale.multiplyScalar(.4);
        material.color.multiply(new THREE.Color(name==='fern_large'?0x90b487:name==='crystal'?0xd0edff:name==='grass'?0xc6d39d:Object.hasOwn(TREE_VARIANTS,name)?0xf9fae9:isTree(name)?0xd0d7b2:name==='rock'?0xd2d9bc:0xe0d1ae));
        if(Object.hasOwn(TREE_VARIANTS,name)&&material.map)material.map=lightTreeFoliage(material.map);
        if(material.map){material.map.colorSpace=THREE.SRGBColorSpace;material.map.anisotropy=4;}
        material.envMapIntensity=.25;
        return material;
      };
      object.material=Array.isArray(object.material)?object.material.map(adapt):adapt(object.material);
    });
    const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());
    if(!Number.isFinite(size.y)||size.y<.0001)throw new Error(`${name} has invalid model bounds`);
    return [name,{model,size,bounds}];
  }));
  return Object.fromEntries(entries);
}

export function placeRodinProps(scene,assets,terrain){
  const root=new THREE.Group();root.name='Rodin generated woodland props';scene.add(root);
  const inventory=[],footprints=[];
  for(const p of PLACEMENTS){
    if(p.enabled===false||!assets[p.kind])continue;
    const source=assets[p.kind],group=new THREE.Group(),object=source.model.clone(true);
    if(p.alignLongAxis&&source.size.z>source.size.x)object.rotateY(Math.PI/2);
    const bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
    object.position.sub(new THREE.Vector3(center.x,bounds.min.y,center.z));
    group.add(object);group.name=p.id;group.userData.layoutId=p.id;group.userData.kind=p.kind;
    const scalar=p.size/(p.axis==='max'?Math.max(size.x,size.y,size.z):size[p.axis||'y']);
    group.scale.setScalar(scalar);
    if(p.kind==='grass'){group.scale.x*=1.35;group.scale.z*=1.35;}
    if(p.height)group.scale.y=p.height/size.y;
    if(p.depth)group.scale.z=p.depth/size.z;
    group.rotation.y=p.rotation||0;group.position.set(p.x,p.y??(p.buried&&terrain?terrain.sample(p.x,p.z).height-p.size*.4:isTree(p.kind)&&terrain?terrain.sample(p.x,p.z).height:p.kind==='grass'?2.18:2.225),p.z);
    if(isTree(p.kind)&&terrain)groundTree(group,terrain.sample);
    group.traverse(o=>{o.userData.generatedProp=true;});root.add(group);group.updateMatrixWorld(true);
    const actual=new THREE.Box3().setFromObject(group);
    footprints.push({minX:actual.min.x,maxX:actual.max.x,minZ:actual.min.z,maxZ:actual.max.z});
    inventory.push({...p,bounds:{min:actual.min.toArray(),max:actual.max.toArray()}});
  }
  setReservedFootprints(footprints);root.userData.inventory=inventory;return root;
}
