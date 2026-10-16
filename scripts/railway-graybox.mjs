import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const folder='output/imagegen/railway-town';await fs.mkdir(folder,{recursive:true});
const code=await build({stdin:{resolveDir:process.cwd(),contents:`
import * as T from 'three';import {FUJI_LAYOUT as L} from './src/fuji-layout.js';import {FUJI_OUTLINE} from './src/fuji-profile.js';import {sampleRail,railLength,RAIL_START,RAIL_END,railOffset,STATION,CROSSING} from './src/fuji-railway.js';
const r=new T.WebGLRenderer({antialias:true});r.setSize(1536,1024);r.setClearColor(0xe6e8e5);document.body.append(r.domElement);const s=new T.Scene();s.add(new T.HemisphereLight(0xffffff,0x708274,2));const light=new T.DirectionalLight(0xfff3dc,3);light.position.set(-20,40,30);s.add(light);
function box(x,y,z,w,h,d,color,rotation=0){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:1}));m.position.set(x,y,z);m.rotation.y=rotation;s.add(m);}
const shape=new T.Shape(FUJI_OUTLINE.map(([x,z])=>new T.Vector2(x,-z)));const g=new T.ShapeGeometry(shape);g.rotateX(-Math.PI/2);s.add(new T.Mesh(g,new T.MeshStandardMaterial({color:0xc7ceb8,side:2})));
const m=new T.Mesh(new T.ConeGeometry(1,16.5,48),new T.MeshStandardMaterial({color:0xc3c8ca}));m.scale.set(18,1,11);m.position.set(2,8.25,-25.2);s.add(m);
L.slots.forEach((p,i)=>box(p.x,1.8,p.z,4,3.6,3.5,[0xdbb99a,0xa6c2c3,0xc4c1a5][Math.floor(i/3)],p.rotation));
for(const p of L.paths)for(let i=1;i<p.points.length;i++){const a=p.points[i-1],b=p.points[i];box((a[0]+b[0])/2,.03,(a[1]+b[1])/2,p.width,.06,Math.hypot(a[0]-b[0],a[1]-b[1]),0xe8e1cf,Math.atan2(b[0]-a[0],b[1]-a[1]));}
for(let d=RAIL_START;d<RAIL_END;d+=.35){const p=railOffset(d,0);box(p.x,.12,p.z,.4,.18,1.65,0x6b7777,p.rotation);}
const p=L.platform;box(p.x,.2,p.z,12,.4,1.5,0xd4baa0,p.rotation);const st=L.station;box(st.x,1.6,st.z,7.8,3.2,2.2,0xa0b7bf,st.rotation);
const c=railOffset(CROSSING.d,0);box(c.x,.22,c.z,3.8,.08,5,0xe6b16c,c.rotation);
const camera=new T.PerspectiveCamera(39,1.5,.1,300);window.draw=view=>{camera.position.set(...(view==='plan'?[0,92,-7]:[33,39,64]));camera.up.set(0,0,-1);if(view!=='plan')camera.up.set(0,1,0);camera.lookAt(0,0,-8);r.render(s,camera);};`},bundle:true,write:false,format:'iife'});
const browser=await chromium.launch({channel:'msedge',headless:true});try{const page=await browser.newPage({viewport:{width:1536,height:1024}});await page.setContent('<style>body{margin:0}</style>');await page.addScriptTag({content:code.outputFiles[0].text});for(const v of ['plan','overview']){await page.evaluate(v=>window.draw(v),v);await page.screenshot({path:`${folder}/graybox-${v}.png`});}}finally{await browser.close();}
