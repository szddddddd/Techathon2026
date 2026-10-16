import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {buildTerrain} from '../src/terrain.js';
import {createPlacementContext} from '../src/social-characters.js';
import {riverCenter,riverHalfWidth,riverLevel,sampleRiver,riverWave,RIVER_START,RIVER_JOIN,UPPER_CASCADES} from '../src/river-profile.js';
import {MOUNTAIN_RANGE} from '../src/mountain-profile.js';
import {querySurface,inWorld} from '../src/world-surface.js';

const out='validation/mountain-range';await fs.mkdir(out,{recursive:true});const checks=[],model=await loadGeometryGLB('assets/rodin-mountain/scene.glb');
assert.equal(UPPER_CASCADES.length,3);assert.deepEqual(UPPER_CASCADES.map(c=>c.drop),[1,1.2,.8]);assert.equal(riverLevel(RIVER_START),10.2);
for(let z=RIVER_START;z<RIVER_JOIN;z+=.005)assert.ok(riverLevel(z+.005)<=riverLevel(z)+1e-7,'flow never goes uphill');
assert.ok(Math.abs(riverLevel(RIVER_JOIN-1e-5)-.38)<1e-7);assert.ok(Math.abs(riverCenter(RIVER_JOIN-1e-5)-riverCenter(RIVER_JOIN))<.0001);assert.ok(Math.abs(riverHalfWidth(RIVER_JOIN-1e-5)-riverHalfWidth(RIVER_JOIN))<.0001);
assert.equal(riverLevel(1.5),.22);assert.ok(Math.abs(riverLevel(7)+.08)<1e-8);checks.push('source 10.2; three specified short drops; downhill profile; continuous original river join and unchanged bridge/downstream levels');
const ray=new THREE.Raycaster(),reports=[];
for(const generated of [true,false]){
 const scene=new THREE.Scene(),terrain=buildTerrain(scene,{valleyAssets:generated?{mountain_range:model}:{},rodinBridge:true,reduced:true});scene.updateMatrixWorld(true);assert.equal(terrain.mountains.length,1);
 const mountains=terrain.mountains[0];let worst=-Infinity,count=0,outletBedOnly=0;const riverbed=terrain.river.root.getObjectByName('Sculpted sandy riverbed');
 for(let z=RIVER_START;z<=-15.02;z+=.075)for(const u of [-.98,-.8,-.4,0,.4,.8,.98]){
  const p=sampleRiver(u,z);ray.set(new THREE.Vector3(p.x,30,z),new THREE.Vector3(0,-1,0));const h=ray.intersectObject(mountains,true)[0];if(h){worst=Math.max(worst,h.point.y-p.y);assert.ok(h.point.y<p.y-.05,`${generated?'Rodin':'fallback'} intersects water at ${z}/${u}: ${h.point.y-p.y}`);}else{assert.ok(z>-16,'source and middle gorge must remain solid');outletBedOnly++;}const bedHit=ray.intersectObject(riverbed,true)[0];assert.ok(bedHit&&bedHit.point.y<p.y-.05,'continuous separate riverbed seals the outlet');assert.ok(!querySurface(p.x,z).walkable);count++;
 }
 ray.set(new THREE.Vector3(riverCenter(RIVER_START),30,RIVER_START-1.3),new THREE.Vector3(0,-1,0));const rim=ray.intersectObject(mountains,true)[0];assert.ok(rim.point.y>riverLevel(RIVER_START)+.6,'spring enclosed by rear ridge');
 const context=createPlacementContext({scene,terrain});for(const p of [[-7,-22],[1,-20],[8,-23],[-1.4,-25.5]])assert.equal(context.inspect(...p,.5,[],{manual:true}).ok,false,'mountain and water reject placement');
 for(let z=0;z>=-13.4;z-=.2){const p=querySurface(23,z);assert.ok(p.walkable);assert.ok(Math.acos(p.normal.y)*180/Math.PI<=22.001);}
 const water=terrain.river.root.getObjectByName('Lit translucent flowing creek'),bed=terrain.river.root.getObjectByName('Sculpted sandy riverbed');assert.ok(water&&bed);assert.equal(terrain.river.audit.mountainCascades,3);
 for(const object of [water,bed,...mountains.children])object.traverse(o=>{if(o.isMesh)for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));});
 terrain.river.update(1);const a=terrain.river.snapshot();terrain.river.update(20);assert.deepEqual(terrain.river.snapshot(),a);
 reports.push({mode:generated?'Rodin':'procedural fallback',sampleCount:count,outletBedOnlySamples:outletBedOnly,worstSurfaceMinusWater:worst,rearRimHeight:rim.point.y});terrain.river.dispose();
}
checks.push('generated and fallback channel clearance; enclosed spring; single mountain actor; mountain/river placement blocked; supported ramp at <=22 degrees; reduced-motion frozen');
const report={dimensions:MOUNTAIN_RANGE,reports,checks};await fs.writeFile(`${out}/geometry.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
