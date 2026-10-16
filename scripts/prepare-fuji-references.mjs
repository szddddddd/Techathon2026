import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {chromium} from 'playwright';
import {FUJI_ASSETS} from './fuji-asset-catalog.mjs';

// Authored primitive massing guides, not downloaded or generated model references.
function createSpecial(T,asset,createJapaneseBuilding){
  const root=new T.Group(),m=c=>new T.MeshStandardMaterial({color:c,roughness:.88,flatShading:true});
  const wood=m(0x96725a),pink=[m(0xf1bdcd),m(0xf8dce4),m(0xe8a8bf)],sage=m(0x647d70),dark=m(0x455c58),cream=m(0xf0dfb7),brass=m(0xc6ad69),glass=m(0xb2d4d1);
  const add=(geo,mat,x,y,z)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);root.add(o);return o;};
  const box=(mat,x,y,z,w,h,d)=>add(new T.BoxGeometry(w,h,d),mat,x,y,z);
  const branch=(a,b,r)=>{a=new T.Vector3(...a);b=new T.Vector3(...b);const o=add(new T.CylinderGeometry(r*.65,r,a.distanceTo(b),9),wood,0,0,0);o.position.copy(a).lerp(b,.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.sub(a).normalize());};
  if(asset.id==='fuji'){
    const pos=[],col=[],R=64,rings=15,base=new T.Color();
    const v=(i,j)=>{const a=i/R*Math.PI*2,t=j/rings,r=17*(1-t)*(.87+.13*(1-t));const h=16*Math.pow(t,1.12);return [Math.cos(a)*r,h,Math.sin(a)*r*.735];};
    for(let j=0;j<rings;j++)for(let i=0;i<R;i++){const a=i/R*Math.PI*2,snow=j/rings>.68+.035*Math.sin(a*7);base.setHex(snow?0xf3f0e9:j<3?0xa5b28c:0x9aafb7).multiplyScalar(.94+.055*Math.sin(i*.9+j));for(const p of[v(i,j),v(i,j+1),v(i+1,j),v(i+1,j),v(i,j+1),v(i+1,j+1)]){pos.push(...p);col.push(base.r,base.g,base.b);}}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.computeVertexNormals();add(g,new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true}),0,0,0);
  }else if(asset.kind==='tree'){
    const weeping=asset.id==='sakura_b';branch([0,0,0],[weeping?.38:-.12,2.8,0],.21);
    const clusters=weeping?[[-1.2,3.3,.1,1.0],[.9,3.5,.5,1.0],[.2,4,-.5,1.1],[-.8,3.8,-.7,.92],[1.6,2.9,-.2,.7],[-1.55,2.6,.1,.7],[.5,2.8,1.2,.7]]:[[-1.1,3.4,.1,1.08],[.95,3.55,.3,1.1],[0,4,-.6,1.18],[.1,3.7,.95,1.04],[-.65,4,.1,1],[.9,4,-.4,.85]];
    clusters.forEach(([x,y,z,r],i)=>{branch([.1,1.8,0],[x,y-.3,z],.1);const o=add(new T.IcosahedronGeometry(r,2),pink[i%3],x,y,z);o.scale.y=weeping?1.2:.78;if(weeping)for(let k=0;k<3;k++){const leaf=add(new T.IcosahedronGeometry(.32,1),pink[(i+k)%3],x+(k-1)*.3,y-.8,z+.2);leaf.scale.y=1.7;}});
  }else if(asset.id==='station'){
    const station=createJapaneseBuilding('classroom');station.scale.set(1.65,1.05,1);root.add(station);
    box(wood,0,2.15,1.75,5.8,.14,1.2);for(const x of[-2.5,-1.2,1.2,2.5])box(wood,x,1.07,2.18,.1,2.14,.1);
    box(cream,0,2.66,1.68,2,.38,.08);
  }else if(asset.id==='locomotive'){
    box(dark,0,.18,0,1.7,.35,5.1);const boiler=add(new T.CylinderGeometry(.65,.65,2.75,20),sage,0,1.02,.73);boiler.rotation.x=Math.PI/2;
    const face=add(new T.CylinderGeometry(.66,.66,.1,20),dark,0,1.02,2.15);face.rotation.x=Math.PI/2;
    box(sage,0,1.05,-1.55,1.7,1.8,1.5);box(dark,0,2.04,-1.55,1.95,.18,1.78);
    for(const s of[-1,1])box(glass,s*.86,1.4,-1.48,.025,.7,1.05);
    add(new T.CylinderGeometry(.24,.18,.65,12),dark,0,1.94,1.55);add(new T.CylinderGeometry(.3,.3,.12,12),brass,0,2.28,1.55);add(new T.SphereGeometry(.25,12,8),brass,0,1.7,.05);
    const lamp=add(new T.CylinderGeometry(.19,.19,.15,12),cream,0,1.4,2.3);lamp.rotation.x=Math.PI/2;
    box(m(0xba6c57),0,.4,2.57,1.8,.2,.15);for(const s of[-1,1])box(brass,s*.69,1.16,.66,.04,.04,2.65);
  }else{
    box(sage,0,.45,0,1.8,.9,4.7);box(cream,0,1.3,0,1.8,.8,4.7);box(dark,0,1.94,0,1.98,.22,4.92);
    for(const s of[-1,1])for(let i=0;i<6;i++){box(wood,s*.91,1.31,-1.92+i*.77,.025,.73,.58);box(glass,s*.93,1.31,-1.92+i*.77,.02,.59,.45);}
    for(const s of[-1,1]){box(wood,0,.95,s*2.36,.7,1.5,.025);box(glass,0,1.31,s*2.39,.52,.65,.025);}
  }
  if(asset.kind==='train')root.rotation.y=Math.PI/2;
  return root;
}

const bundle=await build({stdin:{resolveDir:process.cwd(),contents:`import * as T from 'three';import {createJapaneseBuilding} from './src/japanese-buildings.js';const createSpecial=${createSpecial.toString()};const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1000,900);renderer.setClearColor('#edf0e8');renderer.outputColorSpace=T.SRGBColorSpace;document.body.append(renderer.domElement);const scene=new T.Scene();scene.add(new T.HemisphereLight(0xfffaf0,0x9ba68b,2.4));const sun=new T.DirectionalLight(0xffefd6,2.4);sun.position.set(-6,10,8);scene.add(sun);const camera=new T.PerspectiveCamera(32,1000/900,.1,200);let model;window.show=(asset,rear)=>{if(model){model.removeFromParent();model.traverse(o=>{if(o.isMesh)o.geometry.dispose();});}model=asset.kind==='building'?createJapaneseBuilding(asset.id):createSpecial(T,asset,createJapaneseBuilding);scene.add(model);const bounds=new T.Box3().setFromObject(model),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3()),radius=size.length()*.5;const dir=new T.Vector3(rear?-.8:.8,asset.kind==='mountain'?.52:.56,rear?-1.2:1.2).normalize();camera.position.copy(center).addScaledVector(dir,radius/Math.sin(T.MathUtils.degToRad(16))*1.06);camera.lookAt(center);renderer.render(scene,camera);};`},bundle:true,write:false,format:'iife'});
const selected=process.argv.slice(2),assets=FUJI_ASSETS.filter(a=>!selected.length||selected.includes(a.id));
const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1000,height:900}});
try{await page.setContent('<style>body{margin:0}</style>');await page.addScriptTag({content:bundle.outputFiles[0].text});for(const asset of assets){const folder=`assets/rodin-fuji/${asset.id}`;await fs.mkdir(folder,{recursive:true});await fs.writeFile(`${folder}/prompt.txt`,asset.prompt+'\n');for(const rear of[false,true]){await page.evaluate(({asset,rear})=>window.show(asset,rear),{asset,rear});await page.screenshot({path:`${folder}/reference-${rear?'rear':'front'}.png`});}console.log(`${asset.id}: authored front and rear references prepared`);}}finally{await browser.close();}
