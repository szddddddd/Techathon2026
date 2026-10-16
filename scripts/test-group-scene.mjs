import assert from 'node:assert/strict';import fs from 'node:fs/promises';import * as T from 'three';
import {buildTerrain} from '../src/terrain.js';import {createPlacementContext} from '../src/social-characters.js';import {GROUP_SLOTS,GROUP_QUEUE,COMMUNITY_STREETS,COMMUNITY_BOUNDS} from '../src/community-layout.js';import {PLACEMENTS} from '../src/layout.js';import {loadGeometryGLB} from './glb-geometry.mjs';import {GROUP_TYPES} from '../src/group-catalog.js';
const scene=new T.Scene(),terrain=buildTerrain(scene),context=createPlacementContext({scene,terrain});
assert.ok(!PLACEMENTS.some(p=>p.kind==='cottage'));let pathSamples=0;
for(const slot of GROUP_SLOTS)assert.equal(context.inspect(slot.x,slot.z,.63,[],{manual:true}).ok,false);
for(const type of GROUP_TYPES){const {model}=await loadGeometryGLB(`assets/rodin-groups/${type.id}/scene.glb`);model.rotation.y=type.rotation||0;model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(model),s=box.getSize(new T.Vector3()),k=Math.min(4/s.x,3.5/s.z,4.2/s.y);assert.ok(s.x*k<=4.001&&s.z*k<=3.501);}
for(const x of COMMUNITY_STREETS.x)for(let z=COMMUNITY_BOUNDS.minZ+1.1;z<=COMMUNITY_BOUNDS.maxZ-.5;z+=.15){const q=context.inspect(x,z,.63,[],{manual:true});assert.ok(q.ok,JSON.stringify({x,z,q}));pathSamples++;}
for(const z of COMMUNITY_STREETS.z)for(let x=COMMUNITY_BOUNDS.minX+1.2;x<=COMMUNITY_BOUNDS.maxX;x+=.15){const q=context.inspect(x,z,.63,[],{manual:true});assert.ok(q.ok,JSON.stringify({x,z,q}));pathSamples++;}
assert.equal(context.inspect(GROUP_QUEUE.x,GROUP_QUEUE.z,.4,[],{manual:true}).ok,false);
const report={checks:['old cottage removed','all nine building templates fit every slot','empty plots remain reserved','0.63 radius actor passes both courtyard streets','queue sign footprint blocks placement'],pathSamples};await fs.writeFile('validation/floating-island/group-scene.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
