import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {buildTerrain} from '../src/terrain.js';
import {buildValleyLandmarks} from '../src/valley-landmarks.js';
import {createPlacementContext} from '../src/social-characters.js';
import {buildWalkingGraph} from '../src/companion-walk.js';
import {landAreaAudit,querySurface} from '../src/world-surface.js';
import {riverLevel,riverHalfWidth} from '../src/river-profile.js';

const assets={};for(const kind of ['rock','tree','grass','fern_large'])assets[kind]=await loadGeometryGLB(`assets/rodin/${kind}/scene.glb`);
const valleyAssets={};for(const kind of ['mountain_crag','mountain_ridge','letter_tree','curved_seat','wood_bench','stone_ring','notice_board','viewing_frame'])valleyAssets[kind]=await loadGeometryGLB(`assets/rodin-valley/${kind}/scene.glb`);
const scene=new THREE.Scene(),terrain=buildTerrain(scene,{rodinBridge:true,valleyAssets});buildValleyLandmarks({scene,terrain,assets,valleyAssets});const context=createPlacementContext({scene,terrain});
const area=landAreaAudit();assert.ok(area.ratio>=2.1&&area.ratio<=3);
const samples=[];
for(let z=0;z>=-13.5;z-=.1){const x=z<-11?23+(z+11)*.625:23,q=querySurface(x,z),check=context.inspect(x,z,.63,[],{manual:true});assert.ok(q.walkable,`ramp surface at ${z}`);assert.ok(check.ok,`full body support at ${z}: ${JSON.stringify(check)}`);samples.push(q);}
const maxSlope=Math.max(...samples.map(s=>Math.acos(s.normal.y)*180/Math.PI));assert.ok(maxSlope<=22.001);
for(const p of [[21,2],[21,-13.6],[22,-13.6]])assert.ok(querySurface(...p).walkable);
for(const p of [[-9,-18.6],[10.8,-19.8],[40,0],[0,0]])assert.equal(querySurface(...p).walkable,false);
assert.equal(context.inspect(21,2,.5,[],{manual:true}).ok,false,'lamp is a solid obstacle');
assert.equal(context.inspect(18.1,-14,.4,[],{manual:true}).ok,false,'raised rails block placement');
const graph=buildWalkingGraph(context,{x:23,z:-8,y:querySurface(23,-8).height,radius:.6,manualPlacement:true,placementRadius:.6});
assert.ok(graph.nodes.length>35);for(const a of graph.nodes)for(const i of a.links){const b=graph.nodes[i];assert.ok(Math.abs(a.y-b.y)/Math.hypot(a.x-b.x,a.z-b.z)<=Math.tan(22*Math.PI/180)+.03);}
// Independent ray samples check that the visual mesh agrees with the query.
scene.updateMatrixWorld(true);const ray=new THREE.Raycaster(),errors=[];
for(let z=-13.4;z<0;z+=.23){ray.set(new THREE.Vector3(23,25,z),new THREE.Vector3(0,-1,0));const hit=ray.intersectObjects(context.meadows,false)[0];assert.ok(hit);errors.push(Math.abs(hit.point.y-querySurface(23,z).height));}assert.ok(Math.max(...errors)<.045);
for(const z of [-11,-5,1.5,7,11])assert.equal(riverHalfWidth(z),.7*(4.9+Math.sin(z*.6)*.24));assert.equal(riverLevel(1.5),.22);assert.equal(riverLevel(7),-.07999999999999999);
const report={area,maxSlope,rampNodes:graph.nodes.length,maxVisualHeightError:Math.max(...errors),checks:['rear terrain expanded to support deeper mountains','continuous 22 degree supported ramp','terrace support','mountains and cliffs rejected','lamp and elevated rails collide','walk edges respect elevation','rendered terrain matches query','original river width and bridge level unchanged']};await fs.writeFile('validation/valley-geometry.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
