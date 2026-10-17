import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {IDEAL_SOURCE,IDEAL_LAYOUT,IDEAL_GROUND,idealCanPlace,idealCamera} from '../src/ideal-layout.js';
import {buildIdealScene,applyIdealLegacyLayout} from '../src/ideal-scene.js';
import {createPlacementContext,pickCharacterSlots} from '../src/social-characters.js';

const bytes=await fs.readFile('assets/ideal-city/scene.glb');
const {scene:model}=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
applyIdealLegacyLayout(model);
const objects=[];model.traverse(o=>{if(o.userData.idealId)objects.push(o);});
assert.equal(objects.length,IDEAL_SOURCE.objects.length+4);assert.equal(IDEAL_LAYOUT.slots.length,9);
model.updateMatrixWorld(true);
for(const plot of IDEAL_LAYOUT.slots){const object=objects.find(o=>o.userData.idealId===plot.assetId),b=new T.Box3().setFromObject(object),c=b.getCenter(new T.Vector3());assert.ok(Math.abs(c.x*2-plot.x)<1e-4);assert.ok(Math.abs(c.z*2-plot.z)<1e-4);assert.ok(!idealCanPlace(plot.x,plot.z,.3));assert.ok(idealCanPlace(plot.entry.x,plot.entry.z,.3));}
const lowpoly=JSON.parse(await fs.readFile('assets/ideal-city/lowpoly/manifest.json','utf8'));
for(const p of lowpoly.placements.filter(p=>['colony-core','ring-road','orbital-station','island-base'].includes(p.asset))){const x=p.max[0]-p.min[0],z=p.max[2]-p.min[2];assert.ok(Math.max(x,z)/Math.min(x,z)<1.06,p.asset+' has balanced plan dimensions');}
assert.equal(idealCanPlace(100,100),false);assert.equal(idealCanPlace(0,0),false);
const scene=new T.Scene(),reduced={matches:true},terrain=buildIdealScene(scene,{assets:{model},reduced});
terrain.placementRoot=scene;const context=createPlacementContext({scene,terrain});
const friends=Array.from({length:9},(_,i)=>({id:'ideal-fixture-'+i,animal:'fox',radius:.55}));
const slots=pickCharacterSlots(context,friends,{spawnAreas:IDEAL_LAYOUT.spawnAreas});assert.equal(slots.length,9);
for(const p of slots){assert.ok(context.inspect(p.x,p.z,p.radius,[],{manual:true}).ok);assert.equal(p.y,IDEAL_GROUND);}
assert.equal(terrain.gatheringEnabled,false);assert.equal(terrain.landmarks.lamp,null);assert.deepEqual(terrain.landmarks.pickables,[]);assert.equal(terrain.root.getObjectByName('Ideal city gathering beacon'),undefined);assert.ok(!terrain.root.children.some(o=>o.geometry?.type==='CircleGeometry'),'Reception platform is removed');
terrain.activate();terrain.update(1,.1);assert.equal(terrain.snapshot().animationTime,0);reduced.matches=false;terrain.update(2,.1);assert.ok(terrain.snapshot().animationTime>0);terrain.suspend();const before=terrain.snapshot();terrain.update(3,.1);assert.deepEqual(terrain.snapshot(),before);
for(const [w,h] of [[1440,1000],[391,844]]){const config=idealCamera(w,h),camera=new T.PerspectiveCamera(37,w/h,.1,500);camera.position.fromArray(config.position);camera.lookAt(...config.target);camera.updateMatrixWorld();for(const p of [[0,39,0],[0,-17,0],[-33,2,0],[43,4,0],[0,2,33]]){const q=new T.Vector3(...p).project(camera);assert.ok(Math.abs(q.x)<.95&&Math.abs(q.y)<.9,'City framing at '+w+' '+p);}}
context.dispose();terrain.dispose();assert.equal(scene.children.length,0);
console.log('PASS: adopted geometry, nine original plots, nine friends, removed reception beacon/platform, island/building exclusion, pause/reduced motion, and desktop/mobile framing.');

