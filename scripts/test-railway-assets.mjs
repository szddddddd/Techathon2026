import {mkdir as ensureReportDirectory} from 'node:fs/promises';
await ensureReportDirectory('.test-results/railway-town',{recursive:true});
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as T from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {RAILWAY_ASSETS} from './railway-asset-catalog.mjs';
import {buildFujiScene} from '../src/fuji-scene.js';
import {createPlacementContext} from '../src/social-characters.js';
import {FUJI_LAYOUT as L,inFujiBox} from '../src/fuji-layout.js';
import {FUJI_CARRIAGE,projectRail,STATION,sampleRail} from '../src/fuji-railway.js';

const sizes={fuji:[36,16.5,24.6],sakura_a:[3.8,4.7,3.4],sakura_b:[3.8,4.7,3.4],locomotive:[3.8,2.1,1.25],carriage:[FUJI_CARRIAGE.length,FUJI_CARRIAGE.height,FUJI_CARRIAGE.width],station:[7.8,3.2,2.2],track:[3.48,.19,1.65],gate:[.65,2.5,.6]},assets={},bounds=[];
for(const key of [...RAILWAY_ASSETS.map(a=>a.key),'fuji','sakura_a','sakura_b']){
 const folder=key.startsWith('sakura')||key==='fuji'?key:'railway-'+key;
 const {model}=await loadGeometryGLB(`assets/rodin-fuji/${folder}/scene.glb`),manifest=JSON.parse(await fs.readFile(`assets/rodin-fuji/${folder}/manifest.json`));
 model.rotation.y=manifest.rotationY||0;model.updateMatrixWorld(true);const b=new T.Box3().setFromObject(model),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3()),d=sizes[key]||[4,4.2,3.5];model.position.sub(new T.Vector3(c.x,b.min.y,c.z));
 const holder=new T.Group();holder.add(model);holder.scale.setScalar(Math.min(d[0]/s.x,d[1]/s.y,d[2]/s.z));if(key==='fuji'||key==='track'||key==='carriage')holder.scale.set(d[0]/s.x,d[1]/s.y,d[2]/s.z);holder.updateMatrixWorld(true);assets[key]=holder;
 const size=new T.Box3().setFromObject(holder).getSize(new T.Vector3());bounds.push({key,size:size.toArray(),generationId:manifest.generationId});
 if(!sizes[key]){assert.ok(size.x<=4.001&&size.z<=3.501);for(const p of L.slots){for(const x of[-size.x/2,size.x/2])for(const z of[-size.z/2,size.z/2]){const px=p.x+x*Math.cos(p.rotation)+z*Math.sin(p.rotation),pz=p.z-x*Math.sin(p.rotation)+z*Math.cos(p.rotation);assert.ok(projectRail(px,pz).distance>1.5,'Building avoids railway: '+key);}}}
}
const scene=new T.Scene(),terrain=buildFujiScene(scene,{reduced:true,assets}),context=createPlacementContext({scene,terrain}),failures=[];let samples=0;
for(const path of L.paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.4);for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,z=a[1]+(b[1]-a[1])*j/n,r=context.inspect(x,z,.63,[],{walking:true});samples++;if(!r.ok)failures.push({path:path.id,x,z,...r});}}
const train=terrain.train.snapshot();assert.equal(train.assets.track,true);assert.equal(train.assets.gate,true);
for(let i=0;i<3;i++){const p=sampleRail(STATION.stop-i*FUJI_CARRIAGE.spacing),along=projectRail(p.x,p.z).d;assert.ok(Math.abs(along-STATION.center)+(i?FUJI_CARRIAGE.length/2:1.9)<STATION.length/2,'Whole stopped train fits platform');}
const report={bounds,walking:{samples,radius:.63,failures},wholeTrainFitsPlatform:true};await fs.writeFile('.test-results/railway-town/assets.json',JSON.stringify(report,null,2));console.log(JSON.stringify({samples,failures,assets:bounds.length}));assert.deepEqual(failures,[]);
