import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {buildTerrain} from '../src/terrain.js';
import {buildArchitecture} from '../src/architecture.js';
import {placeRodinProps} from '../src/rodin-props.js';
import {PLACEMENTS} from '../src/layout.js';
import {createDiscoveryScene} from '../src/discovery-scene.js';
import {createPlacementContext,characterBodyRadius} from '../src/social-characters.js';
import {buildWalkingGraph,walkingRoute} from '../src/companion-walk.js';
const scene=new THREE.Scene(),assets={};
for(const kind of new Set(PLACEMENTS.map(p=>p.kind)))assets[kind]=await loadGeometryGLB(`assets/rodin/${kind}/scene.glb`);
const terrain=buildTerrain(scene,{rodinBridge:true}),generated=placeRodinProps(scene,assets);
buildArchitecture(scene,{rodin:true,expanded:true});
createDiscoveryScene({scene,camera:new THREE.PerspectiveCamera(),controls:{},renderer:{domElement:{addEventListener(){}}},terrain,generated});
const context=createPlacementContext({scene,terrain,generated});
const fox=await loadGeometryGLB('assets/rodin-friends/fox/scene.glb');
const fullRadius=Math.hypot(fox.size.x,fox.size.z)*1.9/fox.size.y/2,body=characterBodyRadius(fullRadius);
let total=0,before=0,after=0;const gained={},examples=[];
for(let z=-9.5;z<=10;z+=.75)for(let x=-16;x<=16;x+=.75){
 total++;const old=context.inspect(x,z,fullRadius+.12),next=context.inspect(x,z,body,[],{manual:true});before+=Number(old.ok);after+=Number(next.ok);
 if(old.ok)assert.ok(next.ok,'previously valid land must remain valid');
 if(!old.ok&&next.ok){gained[old.reason]=(gained[old.reason]||0)+1;if(examples.length<12)examples.push({x,z,previously:old.reason});}
}
assert.ok(after>before*1.5,'meaningfully expands the available area');assert.ok(gained.walkway>0,'paths can be used');
for(const [name,x,z] of [['river',0,0],['cottage interior',-8,-4.5],['campfire',-8.5,1.5],['outside terrain',25,20]])assert.equal(context.inspect(x,z,body,[],{manual:true}).ok,false,name);
assert.equal(context.inspect(-5,-3,body,[{x:-5,z:-3,radius:body}],{manual:true}).ok,false,'overlapping friend remains blocked');
// A newly available position must support an actual walking route as well.
let routeExample;
for(const point of examples){const graph=buildWalkingGraph(context,{...point,y:2.22,radius:fullRadius,placementRadius:body,manualPlacement:true});const route=walkingRoute(graph,0);if(route.length){routeExample={...point,nodes:graph.nodes.length,route:route.length};break;}}
assert.ok(routeExample,'relaxed placement supports walking around new homes');
const report={createdAt:new Date().toISOString(),gridStep:.75,total,before,after,gain:after/before,fullRadius,bodyRadius:body,newlyAllowedByPreviousReason:gained,examples,routeExample,checks:['paths usable','river, cliff, cottage and campfire blocked','friend overlap blocked','formerly accepted positions retained','walking uses placement clearance']};
await fs.writeFile('validation/placement-clearance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
