import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const folder=path.resolve('records/ideal-lowpoly-20261017'),out=path.resolve('.test-results/ideal-assets');await fs.mkdir(out,{recursive:true});
const catalog=JSON.parse(await fs.readFile(path.join(folder,'catalog.json'),'utf8'));
const source=`import * as T from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const r=new T.WebGLRenderer({antialias:true});r.setSize(360,400);r.setPixelRatio(1);r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.15;document.body.append(r.domElement);
const s=new T.Scene();s.background=new T.Color(0xe6eef4);s.add(new T.HemisphereLight(0xe5f2ff,0x8893a1,2));const light=new T.DirectionalLight(0xfff2e4,2.5);light.position.set(-3,6,5);s.add(light);const fill=new T.DirectionalLight(0xcde5ff,1);fill.position.set(4,2,-4);s.add(fill);const camera=new T.PerspectiveCamera(35,.9,.01,100);let current;
window.load=async(id)=>{if(current)s.remove(current);current=(await new GLTFLoader().loadAsync('/__review/model/'+id)).scene;current.traverse(o=>{if(o.isMesh){o.material.roughness=.88;o.material.metalness=0;o.material.normalMap=null;o.material.metalnessMap=null;o.material.roughnessMap=null;}});const box=new T.Box3().setFromObject(current),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());current.position.sub(center);const holder=new T.Group();holder.add(current);holder.scale.setScalar(2/Math.max(size.x,size.y,size.z));current=holder;s.add(current);return{size:size.toArray()};};
window.view=(a)=>{camera.position.set(Math.sin(a)*3.7,1.5,Math.cos(a)*3.7);camera.lookAt(0,0,0);r.render(s,camera);};window.ready=true;`;
const bundle=await build({stdin:{contents:source,resolveDir:process.cwd()},bundle:true,format:'iife',write:false});
const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:360,height:400}}),dimensions={};
await page.route('http://localhost:8080/__review/**',async route=>{const url=new URL(route.request().url());if(url.pathname==='/__review/'){return route.fulfill({contentType:'text/html',body:'<body style="margin:0"><script src="/__review/review.js"></script>'});}if(url.pathname==='/__review/review.js')return route.fulfill({contentType:'text/javascript',body:Buffer.from(bundle.outputFiles[0].contents)});const id=url.pathname.split('/').pop();if(!catalog.items.some(a=>a.id===id))return route.abort();return route.fulfill({contentType:'model/gltf-binary',body:await fs.readFile(path.join(folder,id,'raw.glb'))});});
try{await page.goto('http://localhost:8080/__review/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.ready);for(const item of catalog.items){try{await fs.access(path.join(folder,item.id,'raw.glb'));}catch{continue;}if(process.argv.includes('--new-only')){try{await fs.access(path.join(out,item.id+'-0.png'));continue;}catch{}}
 dimensions[item.id]=await page.evaluate(id=>window.load(id),item.id);for(let v=0;v<3;v++){await page.evaluate(a=>window.view(a),v*Math.PI*2/3+.25);await page.screenshot({path:path.join(out,item.id+'-'+v+'.png')});}console.log('Reviewed '+item.id);}
 await fs.writeFile(path.join(out,'dimensions.json'),JSON.stringify(dimensions,null,2));}finally{await browser.close();}
