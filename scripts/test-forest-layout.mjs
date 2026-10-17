import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as T from 'three';
import {loadGeometryGLB,worldVertices} from './glb-geometry.mjs';
import {FOREST_TREES} from '../src/forest-layout.js';
import {PLACEMENTS} from '../src/layout.js';
import {COMMUNITY_TREES,COMMUNITY_WALKING_PATHS,groupPlotAt} from '../src/community-layout.js';
import {inWorld} from '../src/world-surface.js';
import {buildTerrain} from '../src/terrain.js';
import {placeRodinProps} from '../src/rodin-props.js';
import {isTree,treeAssetPath} from '../src/tree-assets.js';
import {buildNature} from '../src/nature.js';
import {buildValleyLandmarks} from '../src/valley-landmarks.js';
import {createPlacementContext} from '../src/social-characters.js';

assert.equal(FOREST_TREES.length,24);assert.equal(COMMUNITY_TREES.length,6);
assert.deepEqual(Object.fromEntries(['west','east','foothill'].map(r=>[r,FOREST_TREES.filter(p=>p.region===r).length])),{west:8,east:12,foothill:4});
assert.equal(PLACEMENTS.filter(p=>p.kind==='crystal').length,0);
assert.equal(PLACEMENTS.filter(p=>p.kind==='rock').length,2);
assert.equal(new Set(PLACEMENTS.map(p=>p.id)).size,PLACEMENTS.length);
for(const p of [...FOREST_TREES,...COMMUNITY_TREES]){
 assert.ok(inWorld(p.x,p.z),`tree supported at ${p.x},${p.z}`);
 assert.equal(groupPlotAt(p.x,p.z,.25),-1,`tree outside every building plot: ${JSON.stringify(p)}`);
}
const assets={};for(const kind of new Set(PLACEMENTS.map(p=>p.kind)))assets[kind]=await loadGeometryGLB(treeAssetPath(kind));
const valleyAssets={mountain_range:await loadGeometryGLB('assets/rodin-mountain/scene.glb')};
const reports=[];
for(const fallback of [false,true]){
 const scene=new T.Scene(),terrain=buildTerrain(scene,{rodinBridge:!fallback,valleyAssets});
 const generated=fallback?buildNature(scene,{expanded:true,terrain}).props:placeRodinProps(scene,assets,terrain);
 assert.ok(Array.isArray(generated.userData.inventory),'fallback retains the prop inventory used by other scene facilities');
 const landmarks=buildValleyLandmarks({scene,terrain,assets:fallback?null:assets,valleyAssets});
 assert.deepEqual(landmarks.lamp.position.toArray(),[21,2.22,2]);
 const trees=generated.children.filter(o=>isTree(o.userData.kind)),rocks=generated.children.filter(o=>o.userData.kind==='rock');
 assert.equal(trees.length,24);assert.equal(rocks.length,2);
 const context=createPlacementContext({scene,terrain,generated}),roots=[];
 for(const p of FOREST_TREES){
  const g=trees.find(o=>o.userData.layoutId===p.id);assert.ok(g,p.id);
  assert.equal(g.position.x,p.x);assert.equal(g.position.z,p.z);assert.ok(g.userData.groundedRoots);
  assert.ok(context.obstacles.some(o=>o.id===p.id),`${p.id} participates in collision`);
  const points=worldVertices(g).filter(v=>v.y<=terrain.sample(p.x,p.z).height+.15);
  const unsupported=points.filter(v=>!inWorld(v.x,v.z));
  const inPlot=points.filter(v=>groupPlotAt(v.x,v.z,.08)>=0);
  const submerged=points.filter(v=>v.y<terrain.sample(v.x,v.z).height-.12);
  roots.push({id:p.id,points:points.length,unsupported:unsupported.length,inBuildingPlot:inPlot.length,submerged:submerged.length});
  assert.ok(points.length>0,`${p.id} has roots at ground level`);
  assert.equal(unsupported.length,0,`${p.id} roots stay on the island`);
  assert.equal(inPlot.length,0,`${p.id} roots stay outside building plots`);
  assert.equal(submerged.length,0,`${p.id} roots follow the slope`);
 }
 let pathSamples=0;const failures=[];
 for(const path of COMMUNITY_WALKING_PATHS)for(let i=1;i<path.points.length;i++){
  const a=path.points[i-1],b=path.points[i],steps=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.2));
  for(let j=0;j<=steps;j++){
   const x=a[0]+(b[0]-a[0])*j/steps,z=a[1]+(b[1]-a[1])*j/steps;
   const result=context.inspect(x,z,.4,[],{manual:true});pathSamples++;
   if(!result.ok)failures.push({path:path.id,x,z,...result});
  }
 }
 // Probe the entire supported ramp and central lawn with the actual tree geometry.
 for(let x=13.5;x<=19;x+=.2)assert.ok(context.inspect(x,1.5,.5,[],{manual:true}).ok,`plaza approach clear at ${x}`);
 for(let z=0;z>=-13.4;z-=.2){const x=z<-11?23+(z+11)*.625:23;const result=context.inspect(x,z,.6,[],{manual:true});assert.ok(result.ok,`ramp clear at ${x},${z}: ${JSON.stringify(result)}`);}
 for(const [x,z] of [[11,0],[11,-3],[12,4],[19,2]])assert.ok(context.inspect(x,z,.4,[],{manual:true}).ok,`central activity space clear at ${x},${z}`);
 assert.equal(failures.length,0,JSON.stringify(failures.slice(0,8)));
 reports.push({fallback,forestTrees:trees.length,streetTrees:COMMUNITY_TREES.length,landRocks:rocks.length,pathSamples,roots,checks:['shared world coordinates','all roots supported and grounded','all nine building entrances and town paths clear','ramp and central lawn clear','tree collisions registered','golden lamp unchanged']});
}
const report={createdAt:new Date().toISOString(),reports};
await fs.mkdir('.test-results/forest-layout',{recursive:true});await fs.writeFile('.test-results/forest-layout/geometry.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
