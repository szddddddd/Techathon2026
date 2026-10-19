const out=process.env.FUJI_VALIDATION_DIR||'.test-results/showa-town';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as T from 'three';
import {createSakuraPetals} from '../src/scenes/fuji/sakura-petals.js';
import {FUJI_LAYOUT as L} from '../src/scenes/fuji/fuji-layout.js';
import {boxContains,streetDistance} from '../src/scenes/fuji/fuji-streets.js';
import {projectRail} from '../src/scenes/fuji/fuji-railway.js';
import {fujiHeight} from '../src/scenes/fuji/fuji-profile.js';
const counts=Object.fromEntries(['north','south','backstreet'].map(k=>[k,L.slots.filter(p=>p.neighbourhood===k).length]));assert.deepEqual(counts,{north:4,south:3,backstreet:2});assert.equal(L.trees.length,22);assert.equal(new Set(L.trees.map(p=>p.id)).size,22);assert.ok(L.trees.some(p=>p.id===L.gatheringTreeId));
for(const tree of L.trees){assert.ok(projectRail(tree.x,tree.z).distance>1.5+tree.height*.4*tree.crownScale);assert.ok(L.paths.every(p=>streetDistance(tree.x,tree.z,p)>.49));}
for(const p of L.slots)for(const x of[-1,1])for(const z of[-1,1])assert.ok(fujiHeight(p.x+x*2.2*Math.cos(p.rotation)+z*1.9*Math.sin(p.rotation),p.z-x*2.2*Math.sin(p.rotation)+z*1.9*Math.cos(p.rotation))<=2.27,'Parcel is on level ground');
// Adversarial overhang: a canopy above a roof exercises the stop-height path,
// even though the authored street tree crowns intentionally avoid buildings.
const parent=new T.Group(),tree=new T.Mesh(new T.BoxGeometry(4,4,4),new T.MeshBasicMaterial());tree.position.set(0,8,0);tree.userData.treeId='over-roof';parent.add(tree);
const house={x:0,z:0,width:4,depth:3.5,rotation:0},layout={slots:[{...house,index:0}],shops:[],shrine:{...house,x:20},station:{...house,x:30},paths:[]},reduced={matches:false};
const petals=createSakuraPetals(parent,{trees:[tree],layout,reduced,groundHeight:()=>2.22,paving:()=>null});
assert.ok(petals.snapshot().roofStops>0);
for(const p of petals.particles)if(p.valid)for(const roof of petals.roofs)if(boxContains(roof,p.x,p.z,.65))assert.ok(p.floor>=roof.top);
petals.update(.05);const moving=petals.snapshot();assert.ok(moving.clock>0);reduced.matches=true;petals.update(.05);assert.equal(petals.snapshot().clock,moving.clock);assert.equal(petals.snapshot().airVisible,false);
reduced.matches=false;petals.suspend();petals.update(1);assert.equal(petals.snapshot().clock,moving.clock);petals.activate();petals.update(.05);assert.ok(petals.snapshot().clock>moving.clock);
petals.setEnabled(false);const off=petals.snapshot();petals.update(1);assert.equal(petals.snapshot().clock,off.clock);petals.dispose();assert.equal(petals.root.parent,null);
await fs.mkdir(out,{recursive:true});await fs.writeFile(`${out}/petals.json`,JSON.stringify({counts,trees:22,zones:Object.fromEntries(['rail','station','lane','shrine'].map(k=>[k,L.trees.filter(p=>p.zone===k).length])),stableGatheringTree:L.gatheringTreeId,roofEnvelopeStops:true,reducedFreeze:true,suspendFreeze:true,disabledFreeze:true,disposed:true},null,2));console.log('PASS: compact parcels, tree clearances, roof stops, reduced motion and lifecycle.');
