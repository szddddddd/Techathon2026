import {createNeonFacility} from '../scenes/shared/public-facility-models.js';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {PLACEMENTS,setReservedFootprints} from '../scenes/forest/layout.js';
import {createRecordMotion} from './record-motion.js';
import {createRecordArm} from './record-arm.js';

export async function createRecordPlayer({scene,camera,canvas,terrain,generated,ui,sound,onOpen,reduced,position,modelTemplate,externalDisposal=false,presentation={}}){
  const neon=terrain.theme==='ideal',title=presentation.title||(neon?'夜航音乐台':'唱片机');
  const root=new THREE.Group();root.name=neon?'Neon listening console':'Rodin woodland record player';
  const tent=PLACEMENTS.find(p=>p.id==='tent');
  root.position.set(position?.x??(generated?tent.x+2.45:-.7),0,position?.z??(generated?tent.z+1.15:-1.2));
  root.position.y=terrain.sample(root.position.x,root.position.z).height;
  root.rotation.y=.15;
  const model=neon&&!presentation.useModel?createNeonFacility('music'):modelTemplate?modelTemplate.clone(true):(await new GLTFLoader().loadAsync('assets/rodin/record-player/scene.glb')).scene;
  if(modelTemplate)model.traverse(o=>{if(o.isMesh)o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();});
  const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  if(!Number.isFinite(size.y)||size.y<=0)throw new Error('唱片机模型尺寸无效');
  // Preserve the authored proportions and ground the feet, like the other Rodin props.
  const scale=1.55/Math.max(size.x,size.y,size.z);
  model.position.sub(new THREE.Vector3(center.x,bounds.min.y,center.z));
  const holder=new THREE.Group();holder.scale.setScalar(scale);holder.add(model);root.add(holder);
  model.traverse(object=>{
    if(!object.isMesh)return;
    object.castShadow=true;object.receiveShadow=true;object.userData.generatedProp=true;
    for(const material of [].concat(object.material)){
      if(!neon&&material.isMeshStandardMaterial){material.roughness=Math.max(.7,material.roughness);material.metalness=Math.min(.25,material.metalness);material.envMapIntensity=.25;material.color.multiply(new THREE.Color(0xe0d1ae));}
      if(!neon&&material.normalScale)material.normalScale.multiplyScalar(.4);
      if(material.map){material.map.colorSpace=THREE.SRGBColorSpace;material.map.anisotropy=4;}
    }
  });
  const arm=neon?{update(){},snapshot:()=>({lift:0,velocity:0,triangles:0})}:createRecordArm(model);arm.update(0,false,true);
  // Rodin's single mesh has no separate platter. Fit a thin rotating surface below
  // the stationary cartridge/spindle, using measured coordinates in the source GLB.
  const disc=new THREE.Group();disc.visible=!neon;disc.name='Animated vinyl surface';disc.position.set(-.02,-.091,.04);model.add(disc);
  const artwork=document.createElement('canvas');artwork.width=artwork.height=1024;
  const ctx=artwork.getContext('2d');ctx.fillStyle='#171b19';ctx.fillRect(0,0,1024,1024);
  // Quiet concentric grooves; the center logo provides the rotation cue.
  ctx.strokeStyle='#30352e';ctx.lineWidth=.8;
  for(let r=178;r<505;r+=5){ctx.beginPath();ctx.arc(512,512,r,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle='#d8ceaa';ctx.beginPath();ctx.arc(512,512,159,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#9b8a60';ctx.lineWidth=2;ctx.beginPath();ctx.arc(512,512,141,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#657451';ctx.font='22px serif';ctx.textAlign='center';ctx.fillText('WOODLAND',512,435);ctx.font='15px serif';ctx.fillText('SIDE A · 33⅓ RPM',512,600);
  // Track logo is drawn into a separate canvas and swapped with the selected BGM.
  const trackLogo=document.createElement('canvas');trackLogo.width=trackLogo.height=160;const logoCtx=trackLogo.getContext('2d');
  function drawTrackLogo(kind){logoCtx.clearRect(0,0,160,160);logoCtx.fillStyle=kind==='spring'?'#ead5b1':'#c4cfaa';logoCtx.beginPath();logoCtx.arc(80,80,78,0,Math.PI*2);logoCtx.fill();logoCtx.strokeStyle='#52765b';logoCtx.lineWidth=4;logoCtx.stroke();logoCtx.fillStyle='#52765b';logoCtx.font='bold 48px serif';logoCtx.textAlign='center';logoCtx.textBaseline='middle';logoCtx.fillText(kind==='spring'?'♪':'♧',80,78);}
  function paintTrackLogo(){ctx.fillStyle='#d8ceaa';ctx.beginPath();ctx.arc(512,512,159,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#9b8a60';ctx.lineWidth=2;ctx.beginPath();ctx.arc(512,512,141,0,Math.PI*2);ctx.stroke();ctx.drawImage(trackLogo,432,432,160,160);}
  drawTrackLogo(sound?.track?.logo||'tree');paintTrackLogo();
  // Same pixel silhouette and palette as desktop/main.cjs createIcon(false).
  const logo=document.createElement('canvas');logo.width=logo.height=32;const icon=logo.getContext('2d'),pixels=icon.createImageData(32,32);
  for(let y=0;y<32;y++)for(let x=0;x<32;x++){const dx=x-16,dy=y-16,rounded=Math.max(Math.abs(dx),Math.abs(dy))<14&&Math.hypot(Math.max(Math.abs(dx)-10,0),Math.max(Math.abs(dy)-10,0))<4,leaf=Math.abs(dx)<9&&dy>-8&&dy<9&&Math.abs(dx)<(dy+10)*.62,trunk=Math.abs(dx)<2&&dy>=6;pixels.data.set(!rounded?[0,0,0,0]:trunk?[48,76,64,255]:leaf?[230,240,207,255]:[83,114,91,255],(y*32+x)*4);}icon.putImageData(pixels,0,0);
  const texture=new THREE.CanvasTexture(artwork);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
  const offSound=sound?.subscribe(()=>{drawTrackLogo(sound.track.logo);paintTrackLogo();texture.needsUpdate=true;});
  const surface=new THREE.Mesh(new THREE.RingGeometry(.027,.505,128),new THREE.MeshStandardMaterial({map:texture,roughness:.45,metalness:.08}));
  // RingGeometry's default UV range is based on its diameter in world units;
  // normalize it so the complete label and grooves fill the vinyl face.
  const positions=surface.geometry.attributes.position,uv=surface.geometry.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,positions.getX(i)/1.01+.5,positions.getY(i)/1.01+.5);
  surface.rotation.x=-Math.PI/2;surface.userData.generatedProp=true;surface.receiveShadow=true;disc.add(surface);
  const motion=createRecordMotion();
  scene.add(root);root.updateMatrixWorld(true);
  if(generated){const box=new THREE.Box3().setFromObject(root);setReservedFootprints([...generated.userData.inventory.map(p=>({minX:p.bounds.min[0],maxX:p.bounds.max[0],minZ:p.bounds.min[2],maxZ:p.bounds.max[2]})),{minX:box.min.x,maxX:box.max.x,minZ:box.min.z,maxZ:box.max.z}]);}
  const button=document.createElement('button');button.id='record-player-control';button.type='button';button.setAttribute('aria-label','唱片机：声音设置');button.className='scene-entry-icon';button.innerHTML='<span class="scene-content-glyph"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="12" r="7"/><circle cx="10" cy="12" r="2"/><path d="M20 5v10l-4 3M18 5h4"/></svg></span><span class="scene-content-copy"><strong>唱片机</strong><small>音乐与声音设置</small></span>';button.setAttribute('aria-label',title+'：声音设置');button.querySelector('strong').textContent=title;document.body.append(button);
  let locked=false,down=null,labelAnchor=null;const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),point=new THREE.Vector3();
  const off=ui.subscribe(s=>{locked=!!s.main||!!s.modal;button.hidden=locked;});
  const open=()=>onOpen(button);button.addEventListener('click',open);
  const press=e=>{down=e.button===0?{x:e.clientX,y:e.clientY}:null;};
  const click=e=>{const start=down;down=null;if(locked||!start||Math.hypot(e.clientX-start.x,e.clientY-start.y)>5)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);ray.setFromCamera(pointer,camera);if(ray.intersectObject(root,true).length)open();};
  canvas.addEventListener('pointerdown',press);canvas.addEventListener('click',click);
  return{root,get labelAnchor(){return labelAnchor;},motion:()=>({...motion.snapshot(),arm:arm.snapshot()}),update(now,dt){arm.update(dt,!!sound?.playing,!!reduced?.matches);disc.rotation.y=-motion.step(dt,!!sound?.playing,!!reduced?.matches);const playing=String(!!sound?.playing);if(button.dataset.playing!==playing)button.dataset.playing=playing;if(locked){if(!button.hidden)button.hidden=true;if(labelAnchor)labelAnchor.visible=false;return;}point.set(0,size.y*scale+.25,0);root.localToWorld(point).project(camera);const r=canvas.getBoundingClientRect(),x=r.left+(point.x+1)*r.width/2,y=r.top+(1-point.y)*r.height/2;button.hidden=locked||point.z>1||point.z< -1||x<30||x>innerWidth-30||y<20||y>innerHeight-90;labelAnchor={id:'reserved-record',x,y,width:button.matches(':hover,:focus-visible')?172:44,height:44,visible:!button.hidden,fixed:true};if(!button.hidden)button.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;},dispose(){offSound?.();off();button.remove();canvas.removeEventListener('pointerdown',press);canvas.removeEventListener('click',click);root.removeFromParent();if(externalDisposal)return;const geometries=new Set(),materials=new Set(),textures=new Set();model.traverse(o=>{if(!o.isMesh)return;geometries.add(o.geometry);for(const m of [].concat(o.material)){materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
