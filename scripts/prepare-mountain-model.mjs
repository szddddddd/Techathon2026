import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const processModel=process.argv.includes('--process'),out='validation/mountain-range';
const bundle=await build({stdin:{resolveDir:process.cwd(),contents:`
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {valleyInstance} from './src/valley-assets.js';
import {MOUNTAIN_RANGE,channelInfluence,channelBed,mountainHeight} from './src/mountain-profile.js';
import {riverCenter,riverHalfWidth,RIVER_START} from './src/river-profile.js';
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1400,1000);renderer.setClearColor('#d8dfce');renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.42;document.body.append(renderer.domElement);
const scene=new T.Scene();scene.add(new T.HemisphereLight(0xc7e3d2,0x3e5233,2.2));const sun=new T.DirectionalLight(0xffe3a1,3.7);sun.position.set(-18,36,18);scene.add(sun);const rim=new T.DirectionalLight(0x9acbc5,1.2);rim.position.set(12,8,-15);scene.add(rim);
const camera=new T.PerspectiveCamera(35,1.4,.1,200),source=(await new GLTFLoader().loadAsync('/assets/rodin-mountain/source.glb')).scene;
let model=valleyInstance({mountain_range:{model:source}},'mountain_range',MOUNTAIN_RANGE);model.position.set(-1,1.4,-22);scene.add(model);model.updateMatrixWorld(true);
window.modelView=which=>{const pos={front:[13,27,18],top:[-1,58,-21],west:[-39,20,-15],rear:[4,23,-57]}[which];camera.position.set(...pos);camera.lookAt(-1,6,-22);renderer.render(scene,camera);};
window.processMountain=async()=>{
 const prepared=new T.Group();prepared.name='Rodin mountain range · fitted ravine';let before=0,after=0,changed=0,maxCut=0,raised=0,maxLift=0;
 const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])*.5);
 model.traverse(mesh=>{if(!mesh.isMesh)return;let g=mesh.geometry.clone();g.applyMatrix4(mesh.matrixWorld);if(g.index){const original=g;g=g.toNonIndexed();original.dispose();}const p=g.attributes.position,uv=g.attributes.uv,vertices=[],tex=[],groups=[];
 const vertex=i=>[p.getX(i),p.getY(i),p.getZ(i),uv?.getX(i)||0,uv?.getY(i)||0];
 function emit(a,b,c,depth=0){
  const v=[a,b,c],edges=[[0,1,2],[1,2,0],[2,0,1]].map(e=>({e,d:Math.hypot(v[e[0]][0]-v[e[1]][0],v[e[0]][2]-v[e[1]][2])})).sort((a,b)=>b.d-a.d);
  const z=(a[2]+b[2]+c[2])/3,x=(a[0]+b[0]+c[0])/3,near=z>RIVER_START-1.8&&z<-14.9&&Math.abs(x-riverCenter(z))<riverHalfWidth(z)+3+edges[0].d;
  if(near&&edges[0].d>.42&&depth<7){const [i,j,k]=edges[0].e,m=midpoint(v[i],v[j]);emit(v[i],m,v[k],depth+1);emit(m,v[j],v[k],depth+1);return;}
  for(const q of v){const w=channelInfluence(q[0],q[2]),cap=channelBed(q[0],q[2]);let y=q[1];const rimWeight=T.MathUtils.smoothstep(q[2],-28.9,-27.8)*(1-T.MathUtils.smoothstep(q[2],-26.5,-26.05))*(1-T.MathUtils.smoothstep(Math.abs(q[0]+1.4),3.5,7))*T.MathUtils.smoothstep(y,2,5);if(rimWeight>0){const target=Math.max(y,mountainHeight(q[0],q[2]));const lifted=T.MathUtils.lerp(y,target,rimWeight);if(lifted>y+.001){raised++;maxLift=Math.max(maxLift,lifted-y);y=lifted;}}if(w>0&&y>cap){y=T.MathUtils.lerp(y,cap,w);changed++;maxCut=Math.max(maxCut,q[1]-y);}vertices.push(q[0],y,q[2]);tex.push(q[3],q[4]);}after++;
 }
 const sourceGroups=g.groups.length?g.groups:[{start:0,count:p.count,materialIndex:0}];
 for(const group of sourceGroups){const start=vertices.length/3;for(let i=group.start;i<group.start+group.count;i+=3){before++;emit(vertex(i),vertex(i+1),vertex(i+2));}groups.push({start,count:vertices.length/3-start,materialIndex:group.materialIndex});}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new T.Float32BufferAttribute(tex,2));for(const gr of groups)geo.addGroup(gr.start,gr.count,gr.materialIndex);geo.computeVertexNormals();
 const result=new T.Mesh(geo,mesh.material);result.name=mesh.name||'Fitted mountain stone';prepared.add(result);g.dispose();
 });
 model.removeFromParent();model=prepared;scene.add(model);model.updateMatrixWorld(true);
 const binary=await new GLTFExporter().parseAsync(model,{binary:true});const base64=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(new Blob([binary]));});
 return {base64,report:{beforeTriangles:before,afterTriangles:after,adjustedVertices:changed,maximumChannelCut:maxCut,rearRimAdjustedVertices:raised,maximumRearRimLift:maxLift,bounds:new T.Box3().setFromObject(model).getSize(new T.Vector3()).toArray(),operation:'World-coordinate fit; local adaptive subdivision, riverbed clearance and spring rear-rim closure; original GLB retained.'}};
};window.ready=true;modelView('front');
`},bundle:true,write:false,format:'esm'});
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1400,height:1000}});
try{
 await page.route('**/mountain-processing.html',route=>route.fulfill({contentType:'text/html',body:'<style>body{margin:0}</style>'}));await page.goto('http://localhost:8080/mountain-processing.html');await page.addScriptTag({type:'module',content:bundle.outputFiles[0].text});await page.waitForFunction(()=>window.ready,null,{timeout:120000});
 if(processModel){const result=await page.evaluate(()=>processMountain());const bytes=Buffer.from(result.base64,'base64');await fs.writeFile('assets/rodin-mountain/scene.pending.glb',bytes);await fs.rename('assets/rodin-mountain/scene.pending.glb','assets/rodin-mountain/scene.glb');await fs.writeFile(`${out}/model-preparation.json`,JSON.stringify(result.report,null,2));const manifest=JSON.parse(await fs.readFile('assets/rodin-mountain/manifest.json','utf8'));Object.assign(manifest,{sceneFile:'scene.glb',sceneSha256:crypto.createHash('sha256').update(bytes).digest('hex'),preparation:result.report});await fs.writeFile('assets/rodin-mountain/manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(result.report));}
 for(const v of ['front','top','west','rear']){await page.evaluate(v=>modelView(v),v);await page.screenshot({path:`${out}/${processModel?'prepared':'raw'}-${v}.jpg`,type:'jpeg',quality:92});}
}finally{await browser.close();}
