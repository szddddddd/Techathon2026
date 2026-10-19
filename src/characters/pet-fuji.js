import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { normalizeSceneAsset } from '../scenes/shared/scene-assets.js';

// Reuses the same Rodin Fuji mountain and blossom trees as the main Fuji scene.
// The miniature only changes composition and scale; it does not replace the models.
export function createFujiPet({root,minimal=false}) {
  const loader=new GLTFLoader(),moving=[],owned=[];let disposed=false;
  const mat=(color,extra={})=>{const m=new THREE.MeshStandardMaterial({color,roughness:.85,...extra});owned.push(m);return m;};
  const bark=mat(0x705354),pink=[mat(0xf0afc8),mat(0xf8c7d7),mat(0xd985ab)],stone=mat(0x8d939e),cream=mat(0xffeac4);
  function mesh(geometry,material,position,parent=root){const m=new THREE.Mesh(geometry,material);m.position.set(...position);parent.add(m);owned.push(geometry);return m;}
  function branch(a,b,r,parent=root){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);const m=mesh(new THREE.CylinderGeometry(r*.65,r,delta.length(),7),bark,start.clone().add(end).multiplyScalar(.5),parent);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m;}
  function ball(position,scale,material,parent=root){const m=mesh(new THREE.SphereGeometry(1,12,8),material,position,parent);m.scale.set(...scale);return m;}
  const base=ball([0,-.16,0],[minimal?2.05:3.25,.22,minimal?.96:1.65],mat(0x979e86));base.name='Fuji moss island';
  ball([0,-.34,0],[minimal?1.95:3.1,.25,minimal?.9:1.55],stone);
  function addAsset(model,position,scale,name){if(disposed)return null;const holder=model.clone(true);holder.name=name;holder.position.set(...position);holder.scale.multiplyScalar(scale);holder.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});root.add(holder);return holder;}
  async function loadAsset(folder,key){try{const gltf=await loader.loadAsync(`assets/rodin-fuji/${folder}/scene.glb`);return normalizeSceneAsset(gltf.scene,key,{sourceFolder:folder});}catch(error){console.warn(`Fuji pet asset unavailable: ${folder}`,error);return null;}}
  async function loadLandscape(){
    const mountain=minimal?null:await loadAsset('fuji','fuji');
    if(mountain&&!disposed){const holder=addAsset(mountain,[.35,0,-.65],.16,'Mount Fuji · main scene asset');if(holder)moving.push({kind:'mountain',object:holder});}
    const treeFolders=['sakura-yoshino-v3','sakura-reference-03','sakura-reference-05'];
    const treeModels=await Promise.all(treeFolders.map(folder=>loadAsset(folder,'sakura_a')));
    if(disposed)return;
    const treeSpecs=minimal?[[-.95,0,-.1,.42,0]]:[[-2,0,.05,.43,0],[2.25,0,.05,.30,1]];
    treeSpecs.forEach(([x,y,z,s,i])=>{const model=treeModels[i%treeModels.length];if(!model)return;const tree=addAsset(model,[x,y,z],s,`Sakura tree · main scene asset ${i+1}`);if(tree)moving.push({kind:'crown',object:tree,phase:i});});
  }
  // Keep the station-scale details around the real assets so the silhouette reads in a small window.
  if(!minimal){
    const rail=mat(0x665c64),sleeper=mat(0x8c756e);for(const radius of [1,1.12]){const curve=new THREE.EllipseCurve(0,0,2.65*radius,1.13*radius);const points=curve.getPoints(100).map(p=>new THREE.Vector3(p.x,.08,p.y));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,true),100,.025,5,true),rail,[0,0,0]);}
    for(let i=0;i<44;i++){const a=i/44*Math.PI*2;const m=mesh(new THREE.BoxGeometry(.28,.04,.12),sleeper,[2.8*Math.cos(a),.04,1.2*Math.sin(a)]);m.rotation.y=-Math.atan2(1.2*Math.cos(a),-2.8*Math.sin(a));}
    const train=new THREE.Group();train.name='Sakura loop train';root.add(train);const teal=mat(0x426c66),dark=mat(0x38444c),gold=mat(0xd6ad68);mesh(new THREE.BoxGeometry(.8,.22,.34),teal,[0,.22,0],train);mesh(new THREE.CylinderGeometry(.16,.16,.44,12),teal,[.12,.43,0],train).rotation.z=Math.PI/2;mesh(new THREE.BoxGeometry(.28,.4,.37),teal,[-.25,.5,0],train);mesh(new THREE.BoxGeometry(.38,.06,.46),dark,[-.25,.73,0],train);for(const z of[-.192,.192])mesh(new THREE.BoxGeometry(.17,.18,.012),cream,[-.25,.57,z],train);mesh(new THREE.CylinderGeometry(.07,.05,.23,8),dark,[.27,.66,0],train);mesh(new THREE.SphereGeometry(.065,8,6),gold,[.42,.43,0],train);for(const x of[-.27,.2])for(const z of[-.19,.19]){const wheel=mesh(new THREE.CylinderGeometry(.1,.1,.04,10),dark,[x,.15,z],train);wheel.rotation.x=Math.PI/2;}moving.push({kind:'train',object:train});
  }else{
    branch([-.65,1.3,.25],[-.08,1.3,.5],.04);const bell=new THREE.Group();bell.name='Sakura glass furin';bell.position.set(-.12,1.3,.52);bell.scale.setScalar(.5);root.add(bell);mesh(new THREE.CylinderGeometry(.012,.012,.22,5),bark,[0,-.11,0],bell);const dome=mesh(new THREE.SphereGeometry(.23,20,12,0,Math.PI*2,0,Math.PI*.57),mat(0xb8dfe8,{transparent:true,opacity:.8,side:THREE.DoubleSide,roughness:.25}),[0,-.42,0],bell);dome.name='Glass wind bell';const ring=mesh(new THREE.TorusGeometry(.225,.018,6,24),pink[0],[0,-.47,0],bell);ring.rotation.x=Math.PI/2;mesh(new THREE.CylinderGeometry(.012,.012,.5,5),bark,[0,-.65,0],bell);mesh(new THREE.BoxGeometry(.15,.34,.018),cream,[0,-.98,0],bell);mesh(new THREE.BoxGeometry(.025,.19,.022),pink[2],[0,-.97,.012],bell);moving.push({kind:'bell',object:bell});
  }
  const petals=new THREE.Group();petals.name='Drifting sakura petals';root.add(petals);for(let i=0;i<(minimal?7:15);i++){const p=ball([0,0,0],[.045,.018,.075],pink[i%3],petals);moving.push({kind:'petal',object:p,phase:i*.719});}
  if(typeof document!=='undefined')document.documentElement.dataset.petFujiAssets='loading';
  void loadLandscape().then(()=>{if(!disposed&&typeof document!=='undefined')document.documentElement.dataset.petFujiAssets='ready';}).catch(()=>{if(!disposed&&typeof document!=='undefined')document.documentElement.dataset.petFujiAssets='error';});
  return {update(t,reduced){for(const item of moving){const o=item.object;if(item.kind==='crown')o.rotation.z=reduced?0:Math.sin(t*1.1+item.phase)*.045;if(item.kind==='bell')o.rotation.z=reduced?0:Math.sin(t*1.6)*.09;if(item.kind==='train'){const a=t*.22+.65;o.position.set(2.8*Math.cos(a),.02,1.2*Math.sin(a));o.rotation.y=-Math.atan2(1.2*Math.cos(a),-2.8*Math.sin(a));}if(item.kind==='petal'){const p=item.phase,fall=(t*.16+p)%1;o.position.set((minimal?-1.1:-1.9)+Math.sin(p*9)*.7+fall*1.4,2.5-fall*2.35,Math.cos(p*7)*.65+.4);o.rotation.set(p+t*.7,p+t*.5,fall*4);}}},dispose(){disposed=true;for(const m of owned)m.dispose?.();}};
}
