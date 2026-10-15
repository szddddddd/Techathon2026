import * as THREE from 'three';
import {PLACEMENTS,setReservedFootprints} from './layout.js';

export function createRecordPlayer({scene,camera,canvas,terrain,generated,ui,sound,onOpen,reduced}){
  const root=new THREE.Group();root.name='Camp record player';
  const tent=PLACEMENTS.find(p=>p.id==='tent');
  root.position.set(generated?tent.x+2.45:-.7,0,generated?tent.z+1.15:-1.2);
  root.position.y=terrain.sample(root.position.x,root.position.z).height;
  root.rotation.y=.15;scene.add(root);
  const body=new THREE.MeshStandardMaterial({color:0x6a3f2b,roughness:.7,flatShading:true}),wood=new THREE.MeshStandardMaterial({color:0x9b6540,roughness:.78,flatShading:true}),trim=new THREE.MeshStandardMaterial({color:0xd2a66c,roughness:.55,flatShading:true}),felt=new THREE.MeshStandardMaterial({color:0x31483e,roughness:.95}),vinyl=new THREE.MeshStandardMaterial({color:0x171c1a,roughness:.3,metalness:.12}),label=new THREE.MeshStandardMaterial({color:0xd19b52,roughness:.7}),brass=new THREE.MeshStandardMaterial({color:0xc7a45b,roughness:.35,metalness:.65}),speaker=new THREE.MeshStandardMaterial({color:0x202c28,roughness:.9});
  function mesh(geometry,material,x,y,z,parent=root){const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);object.castShadow=true;object.receiveShadow=true;object.userData.generatedProp=true;parent.add(object);return object;}
  function box(material,x,y,z,w,h,d,parent=root){return mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent);}
  // A small suitcase-style cabinet with rounded bevels, brass trim, and a hinged lid.
  box(body,0,.58,0,1.42,.72,1.08);box(wood,0,.95,0,1.5,.10,1.14);
  for(const x of [-.62,.62])for(const z of [-.43,.43])mesh(new THREE.CylinderGeometry(.055,.075,.72,8),brass,x,.58,z);
  box(trim,0,.25,-.56,1.25,.07,.045);box(trim,0,.25,.56,1.25,.07,.045);
  const deck=box(felt,0,1.02,.02,1.28,.035,.91);
  // Hinged lid, inner lining, and a readable front grille.
  box(body,0,1.43,-.43,1.42,.72,.10);box(wood,0,1.43,-.365,1.22,.54,.025);
  box(speaker,0,.58,.555,.72,.38,.035);
  for(let i=-3;i<=3;i++)for(let j=-2;j<=2;j++){const dot=mesh(new THREE.CylinderGeometry(.018,.018,.012,8),trim,i*.09,.58,.58+j*.075);dot.rotation.x=Math.PI/2;}
  const grille=mesh(new THREE.BoxGeometry(.78,.42,.018),speaker,0,.58,.58);grille.userData.generatedProp=true;
  for(const x of [-.47,.47]){const knob=mesh(new THREE.CylinderGeometry(.09,.09,.055,16),brass,x,.58,.61);knob.rotation.x=Math.PI/2;}
  const disc=new THREE.Group();disc.position.set(-.12,1.065,.08);root.add(disc);
  mesh(new THREE.CylinderGeometry(.38,.38,.035,48),vinyl,0,0,0,disc);
  for(const radius of [.11,.2,.29,.35]){const ring=mesh(new THREE.TorusGeometry(radius,.008,5,48),radius<.2?label:trim,0,.021,0,disc);ring.rotation.x=Math.PI/2;}
  mesh(new THREE.CylinderGeometry(.105,.105,.045,24),label,0,.025,0,disc);mesh(new THREE.CylinderGeometry(.027,.027,.055,16),brass,0,.05,0,disc);
  // Pivot, curved-looking segmented tonearm, and diamond cartridge.
  mesh(new THREE.CylinderGeometry(.075,.075,.08,16),brass,.43,1.08,.18);
  const armBase=mesh(new THREE.CylinderGeometry(.025,.025,.34,10),brass,.43,1.23,.18);armBase.rotation.z=-.72;
  const armTip=mesh(new THREE.CylinderGeometry(.022,.022,.28,10),brass,.30,1.35,.18);armTip.rotation.z=.35;
  box(trim,.20,1.27,.17,.14,.045,.10);mesh(new THREE.ConeGeometry(.04,.10,6),brass,.17,1.23,.18);
  box(trim,0,1.47,-.365,1.18,.045,.03);box(brass,0,1.79,-.38,.22,.06,.08);
  const handle=mesh(new THREE.CylinderGeometry(.04,.04,.22,10),brass,0,.24,-.62);handle.rotation.x=Math.PI/2;
  root.updateMatrixWorld(true);
  if(generated){const box=new THREE.Box3().setFromObject(root);setReservedFootprints([...generated.userData.inventory.map(p=>({minX:p.bounds.min[0],maxX:p.bounds.max[0],minZ:p.bounds.min[2],maxZ:p.bounds.max[2]})),{minX:box.min.x,maxX:box.max.x,minZ:box.min.z,maxZ:box.max.z}]);}
  const button=document.createElement('button');button.id='record-player-control';button.type='button';button.setAttribute('aria-label','唱片机：声音设置');button.textContent='♫ 唱片机';document.body.append(button);
  let locked=false,down=null;const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),point=new THREE.Vector3();
  const off=ui.subscribe(s=>{locked=!!s.main||!!s.modal;button.hidden=locked;});
  const open=()=>onOpen(button);button.addEventListener('click',open);
  const press=e=>{if(e.button===0)down={x:e.clientX,y:e.clientY};};
  const click=e=>{if(locked||!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);ray.setFromCamera(pointer,camera);if(ray.intersectObject(root,true).length)open();};
  canvas.addEventListener('pointerdown',press);canvas.addEventListener('click',click);
  return{root,update(now,dt){if(sound?.playing&&!reduced.matches)disc.rotation.y-=dt*.9;point.set(0,1.65,0);root.localToWorld(point).project(camera);const x=(point.x+1)*innerWidth/2,y=(1-point.y)*innerHeight/2;button.hidden=locked||point.z>1||point.z< -1||x<30||x>innerWidth-30||y<20||y>innerHeight-90;if(!button.hidden)button.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;button.dataset.playing=String(!!sound?.playing);},dispose(){off();button.remove();canvas.removeEventListener('pointerdown',press);canvas.removeEventListener('click',click);root.removeFromParent();}};
}
