import assert from 'node:assert/strict';import fs from 'node:fs/promises';import * as T from 'three';
import {buildTerrain} from '../src/scenes/forest/terrain.js';import {createPlacementContext} from '../src/characters/social-characters.js';import {GROUP_SLOTS,GROUP_QUEUE,COMMUNITY_WALKING_PATHS as COMMUNITY_PATHS,COMMUNITY_GARDENS,COMMUNITY_BENCHES,COMMUNITY_TREES,COMMUNITY_LAMPS,plotPoint} from '../src/scenes/shared/community-layout.js';import {PLACEMENTS} from '../src/scenes/forest/layout.js';import {loadGeometryGLB} from '../scripts/glb-geometry.mjs';import {GROUP_TYPES} from '../src/social/group-catalog.js';
const scene=new T.Scene(),terrain=buildTerrain(scene),context=createPlacementContext({scene,terrain});let pathSamples=0,templateChecks=0;
assert.ok(!PLACEMENTS.some(p=>p.kind==='cottage'));
const box=p=>{const corners=[[-p.width/2,-p.depth/2],[-p.width/2,p.depth/2],[p.width/2,-p.depth/2],[p.width/2,p.depth/2]].map(([x,z])=>plotPoint(p,x,z));return new T.Box2().setFromPoints(corners.map(p=>new T.Vector2(p.x,p.z)));};
for(const [i,p] of GROUP_SLOTS.entries()){
 assert.equal(context.inspect(p.x,p.z,.63,[],{manual:true}).ok,false);
 assert.ok(context.inspect(p.entry.x,p.entry.z,.63,[],{manual:true}).ok,'walkable front door '+i);
 for(const other of GROUP_SLOTS.slice(i+1))assert.equal(box(p).intersectsBox(box(other)),false,'separate building plots');
 for(const garden of COMMUNITY_GARDENS)assert.equal(box(p).intersectsBox(box({...garden,rotation:0})),false,'garden '+garden.id+' clear of building '+i);
}
for(const type of GROUP_TYPES){
 const {model}=await loadGeometryGLB(`assets/rodin-groups/${type.id}/scene.glb`);model.rotation.y=type.rotation||0;model.updateMatrixWorld(true);const b=new T.Box3().setFromObject(model),s=b.getSize(new T.Vector3()),k=Math.min(4/s.x,3.5/s.z,4.2/s.y);
 for(const p of GROUP_SLOTS){assert.ok(s.x*k<p.width&&s.z*k<p.depth&&s.y*k<=4.201);templateChecks++;}
}
for(const path of COMMUNITY_PATHS)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],count=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.15));for(let j=0;j<=count;j++){const x=a[0]+(b[0]-a[0])*j/count,z=a[1]+(b[1]-a[1])*j/count,q=context.inspect(x,z,.63,[],{manual:true});assert.ok(q.ok,JSON.stringify({path:path.id,x,z,q}));pathSamples++;}}
for(const p of [...COMMUNITY_GARDENS,...COMMUNITY_BENCHES,...COMMUNITY_TREES,...COMMUNITY_LAMPS,GROUP_QUEUE])assert.equal(context.inspect(p.x,p.z,.25,[],{manual:true}).ok,false);
const report={checks:['nine rotated plots stay separate and fit every template','all entrances meet walking streets','continuous main lane, branches, riverside and civic loop','empty plots and gardens remain protected','benches, trees, lamps and queue sign reject placement'],pathSamples,templateChecks};await fs.mkdir('.test-results/riverside-town',{recursive:true});await fs.writeFile('.test-results/riverside-town/geometry.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
