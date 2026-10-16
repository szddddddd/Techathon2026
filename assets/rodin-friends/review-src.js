import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const names = new URLSearchParams(location.search).get('only')?.split(',') || ['kangaroo','fox','rabbit','bear'];
const poses = [['正面',0,3.4],['背面',Math.PI,3.4]];
const renderer = new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(440,440);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const loader=new GLTFLoader();let loaded=0;
for(const name of names){
 try{
 const gltf=await loader.loadAsync(name+'/scene.glb');
 const bounds=new THREE.Box3().setFromObject(gltf.scene),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
 gltf.scene.position.sub(new THREE.Vector3(center.x,bounds.min.y,center.z));
 const group=new THREE.Group();group.add(gltf.scene);group.scale.setScalar(2/size.y);
 for(const [label,angle,r] of poses){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#e8eadf');scene.add(group);
 scene.add(new THREE.HemisphereLight('#fff8e8','#657057',2));const sun=new THREE.DirectionalLight('#fff5df',3);sun.position.set(-3,5,4);scene.add(sun);const fill=new THREE.DirectionalLight('#e3f3ff',1);fill.position.set(3,2,-3);scene.add(fill);
 const ground=new THREE.Mesh(new THREE.CircleGeometry(1.1,48),new THREE.MeshStandardMaterial({color:'#c8d1b7',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.002;scene.add(ground);
 const camera=new THREE.PerspectiveCamera(40,1,.01,100);camera.position.set(Math.sin(angle)*r,1.4,Math.cos(angle)*r);camera.lookAt(0,1,0);renderer.render(scene,camera);
 const article=document.createElement('article'),canvas=document.createElement('canvas');canvas.width=440;canvas.height=440;canvas.getContext('2d').drawImage(renderer.domElement,0,0);article.append(canvas);const h=document.createElement('h3');h.textContent=name+' · '+label;article.append(h);document.querySelector('main').append(article);
 }
 loaded++;document.querySelector('#status').textContent=`${loaded}/${names.length} 已加载 · 正反面，未旋转原始模型`;
 }catch(error){document.querySelector('#status').textContent=name+': '+error.message;console.error(error);}
}
document.body.dataset.complete=String(loaded===names.length);
renderer.dispose();
