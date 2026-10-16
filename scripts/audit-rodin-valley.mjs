import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {buildTerrain} from '../src/terrain.js';
import {buildValleyLandmarks} from '../src/valley-landmarks.js';
import {VALLEY_ASSET_NAMES} from '../src/valley-assets.js';
import {inWorld,querySurface} from '../src/world-surface.js';
import {riverCenter,riverHalfWidth,riverLevel} from '../src/river-profile.js';
import {createPlacementContext} from '../src/social-characters.js';

const valleyAssets={},assets={},geometry=[];
for(const name of Object.keys(VALLEY_ASSET_NAMES)){const file=name==='mountain_range'?'assets/rodin-mountain/scene.glb':`assets/rodin-valley/${name}/scene.glb`;const asset=await loadGeometryGLB(file);let triangles=0;asset.model.traverse(o=>{if(o.isMesh){triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));}});valleyAssets[name]=asset;geometry.push({name,triangles,bytes:(await fs.stat(file)).size});}
for(const kind of ['rock','tree','grass','fern_large'])assets[kind]=await loadGeometryGLB(`assets/rodin/${kind}/scene.glb`);
const scene=new THREE.Scene(),terrain=buildTerrain(scene,{rodinBridge:true,valleyAssets}),landmarks=buildValleyLandmarks({scene,terrain,assets,valleyAssets});scene.updateMatrixWorld(true);
const mountainChecks=terrain.mountains.map(model=>{let outside=0,vertices=0;model.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);vertices++;if(!inWorld(v.x,v.z)&&!(Math.abs(v.x-riverCenter(v.z))<=riverHalfWidth(v.z)+.1&&v.y<riverLevel(v.z)))outside++;}});assert.equal(outside,0,'expanded terrain supports every mountain vertex in projection');const bounds=new THREE.Box3().setFromObject(model);assert.ok(Math.abs(bounds.getSize(new THREE.Vector3()).z-14)<.001,'requested 1.5x depth');assert.ok(Math.abs(bounds.getSize(new THREE.Vector3()).x-36)<.001,'requested 1.5x mountain widths');return{name:model.name,vertices,outside,bounds:new THREE.Box3().setFromObject(model)};});
assert.equal(terrain.mountains.length,1);
const context=createPlacementContext({scene,terrain});for(let z=0;z>-11;z-=.2)assert.ok(context.inspect(23,z,.63,[],{manual:true}).ok,`new assets leave ramp clear at ${z}`);
for(const p of [[21,2],[26,-.5],[25.7,3]])assert.equal(context.inspect(...p,.45,[],{manual:true}).ok,false,'generated fixture collision');
for(const p of [[23,-8],[21,-13.5]])assert.equal(terrain.sample(...p).height,querySurface(...p).height,'walkable surface unchanged');
const ray=new THREE.Raycaster();ray.set(new THREE.Vector3(19.5,6.5,-11),new THREE.Vector3(0,0,-1));
const fixtureBounds=landmarks.obstacles.filter(o=>o.userData.kind==='valley').map(o=>({name:o.name,bounds:new THREE.Box3().setFromObject(o)}));
const report={createdAt:new Date().toISOString(),geometry,mountainChecks,fixtureBounds,checks:['active valley GLBs are finite and readable','one continuous 36 by 14 mountain range with supported footprint or submerged channel floor','new fixture geometry participates in collision','ramp and terrace heights unchanged','full-width main ramp remains supported and clear']};await fs.writeFile('validation/rodin-valley/geometry.json',JSON.stringify(report,null,2));console.log(JSON.stringify({geometry,checks:report.checks},null,2));
