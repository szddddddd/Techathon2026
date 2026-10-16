import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as T from 'three';
import {ISLAND_OUTLINE} from '../src/island-profile.js';
import {inWorld,surfaceHeight} from '../src/world-surface.js';
import {GROUP_SLOTS,COMMUNITY_RIVER_WALK_X,COMMUNITY_BOUNDS,plotPoint} from '../src/community-layout.js';
import {riverCenter,riverHalfWidth} from '../src/river-profile.js';
import {buildTerrain} from '../src/terrain.js';
import {createPlacementContext} from '../src/social-characters.js';
const scene=new T.Scene(),terrain=buildTerrain(scene),context=createPlacementContext({scene,terrain});scene.updateMatrixWorld(true);
const rock=terrain.root.getObjectByName('Continuous floating island rock');assert.ok(rock);
const bounds=new T.Box3().setFromObject(rock);assert.ok(bounds.min.y<=-17&&bounds.max.y>=2.2);
let shoreChecks=0,cornerChecks=0,pathChecks=0,minRiverClearance=Infinity;
const ray=new T.Raycaster();
for(const [x,z] of ISLAND_OUTLINE){
 if(Math.abs(x-riverCenter(z))<riverHalfWidth(z)+.2)continue;
 const p=new T.Vector2(x,z).lerp(new T.Vector2(0,-9),.025);
 assert.ok(inWorld(p.x,p.y));
 ray.set(new T.Vector3(p.x,30,p.y),new T.Vector3(0,-1,0));
 assert.ok(ray.intersectObjects(context.meadows,false).length,'meadow must meet its rock edge');shoreChecks++;
}
for(const slot of GROUP_SLOTS){
 for(const dx of [-2,2])for(const dz of [-1.75,1.75]){
  const {x,z}=plotPoint(slot,dx,dz);assert.ok(inWorld(x,z));assert.ok(Math.abs(surfaceHeight(x,z)-2.22)<1e-8);cornerChecks++;
 }
 for(let z=slot.z-1.75;z<=slot.z+1.75;z+=.1)minRiverClearance=Math.min(minRiverClearance,riverCenter(z)-riverHalfWidth(z)-(slot.x+2));
}
assert.ok(minRiverClearance>2,'buildings must leave a dry-bank corridor');
for(let z=COMMUNITY_BOUNDS.minZ+1;z<=.1;z+=.16){const q=context.inspect(COMMUNITY_RIVER_WALK_X,z,.63,[],{manual:true});assert.ok(q.ok,JSON.stringify({z,q}));pathChecks++;}
const position=rock.geometry.attributes.position;for(const n of position.array)assert.ok(Number.isFinite(n));
assert.equal(scene.getObjectByName('West rock body'),undefined);assert.equal(scene.getObjectByName('East rock body'),undefined);
const report={checks:['shared angular shoreline meets meadow','single tapered rock body with embedded hanging rock masses','all nine buildings remain level on dry land','riverside full-body passage','old slab extrusions removed'],shoreChecks,cornerChecks,pathChecks,minRiverClearance,rockTriangles:rock.geometry.index.count/3,bottom:bounds.min.y};
await fs.writeFile(process.env.FOREST_ISLAND_REPORT||'validation/floating-island/geometry.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
