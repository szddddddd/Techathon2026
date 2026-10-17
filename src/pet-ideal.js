import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/** The desktop miniature uses the same authored city asset as the web scene. */
export function createIdealPet({root,minimal=false}){
 let disposed=false,model;
 const release=object=>{const resources=new Set();object.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of [].concat(o.material||[])){resources.add(m);for(const v of Object.values(m))if(v?.isTexture)resources.add(v);}});resources.forEach(r=>r.dispose());};
 const loader=new GLTFLoader();
 const ready=loader.loadAsync('assets/ideal-city/lowpoly/scene.glb').catch(()=>loader.loadAsync('assets/ideal-city/scene.glb')).then(g=>{
  model=g.scene;if(disposed){release(model);return;}const remove=[];model.traverse(o=>{if(o.userData.idealCollection==='07_Environment'||o.userData.idealCollection==='06_Aircraft')remove.push(o);if(o.isMesh)o.castShadow=o.receiveShadow=true;});
  // Hide shared mesh resources rather than discarding them before disposal.
  remove.forEach(o=>o.visible=false);model.scale.setScalar(minimal?.105:.16);model.position.set(-.2,0,-.65);root.add(model);
 }).catch(()=>{});
 return{ready,update(){},dispose(){disposed=true;if(model){model.removeFromParent();release(model);model=null;}}};
}
