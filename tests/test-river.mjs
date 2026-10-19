import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import {buildTerrain,riverCenter,riverHalfWidth} from '../src/scenes/forest/terrain.js';
import {riverLevel,riverDepth,riverWave,RIVER_END} from '../src/scenes/forest/river-profile.js';
import {loadGeometryGLB} from '../scripts/glb-geometry.mjs';
const scene=new THREE.Scene(),assets={};for(const kind of ['rock','grass','fern_large'])assets[kind]=await loadGeometryGLB(`assets/rodin/${kind}/scene.glb`);
const terrain=buildTerrain(scene,{rodinBridge:true,riverAssets:assets}),river=terrain.river;scene.updateMatrixWorld(true);
assert.equal(riverLevel(1.5),.22);assert.ok(Math.abs(riverLevel(7)+.08)<1e-8);
let minimumDepth=Infinity,maximumWave=0;
for(let z=-11;z<=11;z+=.13)for(let u=-1;u<=1;u+=.1){const p=river.sample(u,z);assert.ok(p.x>=river.bounds(z).left-1e-6&&p.x<=river.bounds(z).right+1e-6);assert.ok(p.bedY<p.y-.1);for(const t of [0,1,3,9]){const w=riverWave(p.x,z,t,u);minimumDepth=Math.min(minimumDepth,riverDepth(u,z)+w);maximumWave=Math.max(maximumWave,Math.abs(w));}assert.ok(Math.abs(riverLevel(z+.001)-riverLevel(z))<.001);}
assert.ok(minimumDepth>.1&&maximumWave<=.04501);assert.equal(river.audit.rodinRocks,10);
for(let u=-1;u<=1;u+=.1)for(const t of [0,1,9])assert.equal(Math.abs(riverWave(riverCenter(RIVER_END)+u*riverHalfWidth(RIVER_END),RIVER_END,t,u)),0,'wave surface joins static waterfall without an animated crack');
river.root.children.filter(o=>o.name==='Rodin river moss stone').forEach(o=>{o.updateWorldMatrix(true,true);const box=new THREE.Box3().setFromObject(o);for(let z=box.min.z;z<=box.max.z;z+=.1){assert.ok(box.min.x>=river.bounds(z).left-.04&&box.max.x<=river.bounds(z).right+.04,'GLB boulder stays inside original channel');}assert.ok(box.max.y<2.22,'river boulder cannot reach character meadow');});
const front=[];river.root.traverse(o=>{assert.ok(o.userData.riverOwned,'river excluded from static batching');if(o.name.startsWith('Curved foreground waterfall')){const p=o.geometry.attributes.position;for(let i=0;i<9;i++){assert.ok(Math.abs(p.getY(i)-riverLevel(RIVER_END))<1e-6);assert.ok(Math.abs(p.getZ(i)-RIVER_END)<1e-6);}front.push(o);}if(o.geometry?.attributes.position)for(const value of o.geometry.attributes.position.array)assert.ok(Number.isFinite(value));});assert.equal(front.length,5);
const island=terrain.root.getObjectByName('Continuous floating island rock'),rockBounds=new THREE.Box3().setFromObject(island),clearanceRay=new THREE.Raycaster();let clearanceSamples=0;
for(const fall of front){
 const p=fall.geometry.attributes.position;assert.ok(new THREE.Box3().setFromObject(fall).min.y<rockBounds.min.y-2,'water falls below the lowest rock roots');
 for(let j=9;j<p.count;j+=9){const v=new THREE.Vector3().fromBufferAttribute(p,j);clearanceRay.set(new THREE.Vector3(v.x,v.y,v.z+30),new THREE.Vector3(0,0,-1));const rock=clearanceRay.intersectObject(island)[0];assert.ok(!rock||rock.point.z<v.z-.01,'fall must remain outside the island rock');clearanceSamples++;}
}

river.update(0);const first=river.snapshot();river.update(4);assert.notDeepEqual(river.snapshot().foam,first.foam);
const still=buildTerrain(new THREE.Scene(),{rodinBridge:true,reduced:true});still.river.update(0);const initial=still.river.snapshot();still.river.update(50);assert.deepEqual(still.river.snapshot(),initial);assert.equal(still.river.audit.fallbackRocks,10);
const meadow=terrain.root.children.filter(o=>o.name.endsWith('translated bank')).map(g=>({name:g.name,x:g.position.x,y:g.children.find(o=>o.name.endsWith(' meadow')).position.y}));assert.deepEqual(meadow.map(m=>[m.x,m.y]),[[-1.5,2.22],[1.5,2.22]]);
const report={createdAt:new Date().toISOString(),...river.audit,minimumDepth,maximumWave,clearanceSamples,meadow,checks:['shared profile and continuous drop','bridge level unchanged','bed stays below waves','waterfall joins waterline exactly and clears island rock below its lowest roots','10 local GLB rocks','static-batch exclusion','reduced motion frozen','missing-asset fallback']};
river.dispose();assert.equal(river.root.parent,null);still.river.dispose();await fs.writeFile(process.env.FOREST_RIVER_REPORT||'.test-results/river-geometry.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
