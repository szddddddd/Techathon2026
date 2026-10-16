import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {chromium} from 'playwright';
await fs.mkdir('assets/rodin-mountain/reference',{recursive:true});
const bundle=await build({stdin:{resolveDir:process.cwd(),contents:`
import * as T from 'three';
import {createMountainGeometry} from './src/mountain-profile.js';
import {riverCenter,riverHalfWidth,RIVER_START} from './src/river-profile.js';
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1400,1000);renderer.setClearColor('#ecefe4');renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;document.body.append(renderer.domElement);
const scene=new T.Scene(),geometry=createMountainGeometry(120,72),c=geometry.attributes.color,p=geometry.attributes.position;
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);if(z>=RIVER_START&&Math.abs(x-riverCenter(z))<riverHalfWidth(z)+.15){const color=new T.Color('#8e9e92');c.setXYZ(i,color.r,color.g,color.b);}}
scene.add(new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,side:T.DoubleSide})));
scene.add(new T.HemisphereLight(0xe6efdf,0x747b63,1.7));const sun=new T.DirectionalLight(0xffefcd,2);sun.position.set(-20,35,20);scene.add(sun);
const camera=new T.PerspectiveCamera(35,1.4,.1,200);window.referenceView=(which)=>{camera.position.set(...(which==='top'?[-1,56,-21]:which==='rear'?[4,23,-57]:[13,28,20]));camera.lookAt(-1,5,-22);renderer.render(scene,camera);};referenceView('front');
`},bundle:true,write:false,format:'iife'});
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1400,height:1000}});
try{await page.setContent('<style>body{margin:0}</style>');await page.addScriptTag({content:bundle.outputFiles[0].text});for(const v of ['front','top','rear']){await page.evaluate(v=>referenceView(v),v);await page.screenshot({path:`assets/rodin-mountain/reference/${v}.png`});}}finally{await browser.close();}
