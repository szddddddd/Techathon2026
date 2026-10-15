import fs from 'node:fs/promises';
import * as THREE from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {buildTerrain} from '../src/terrain.js';
import {buildArchitecture} from '../src/architecture.js';
import {placeRodinProps} from '../src/rodin-props.js';
import {PLACEMENTS} from '../src/layout.js';
import {createDiscoveryScene} from '../src/discovery-scene.js';
import {createPlacementContext,pickCharacterSlots} from '../src/social-characters.js';
import {buildWalkingGraph,walkingRoute} from '../src/companion-walk.js';
import {FRIENDS} from '../src/social-store.js';

const scene=new THREE.Scene(),assets={};
for(const kind of new Set(PLACEMENTS.map(p=>p.kind)))assets[kind]=await loadGeometryGLB(`assets/rodin/${kind}/scene.glb`);
const terrain=buildTerrain(scene,{rodinBridge:true}),generated=placeRodinProps(scene,assets);
buildArchitecture(scene,{rodin:true,expanded:true});
const props=[...generated.children];
const discovery=createDiscoveryScene({scene,camera:new THREE.PerspectiveCamera(),controls:{},renderer:{domElement:{addEventListener(){}}},terrain,generated});
const context=createPlacementContext({scene,terrain,generated}),friends=[];
for(const friend of FRIENDS){const model=await loadGeometryGLB(friend.modelUrl);friends.push({...friend,radius:Math.hypot(model.size.x,model.size.z)*friend.height/model.size.y/2});}
const verify=count=>pickCharacterSlots(context,count===8?[...friends,...friends.map(f=>({...f,id:f.id+'-stress'}))]:friends).map(slot=>{
  if(slot.unplaced)return {...slot,valid:false};
  const graph=buildWalkingGraph(context,slot),route=walkingRoute(graph,0),checks=[];let previous=graph.nodes[0];
  for(const index of route){const next=graph.nodes[index];for(let t=0;t<=1;t+=.1)checks.push(context.inspect(previous.x+(next.x-previous.x)*t,previous.z+(next.z-previous.z)*t,slot.radius,[],{walking:true}));previous=next;}
  return {...slot,nodes:graph.nodes.length,routeLength:route.length,valid:route.length>0&&checks.every(c=>c.ok)};
});
const report={createdAt:new Date().toISOString(),...discovery.audit,bboxIntersections:discovery.audit.facilities.map(f=>{
  const box=new THREE.Box3(new THREE.Vector3(...f.bounds.min),new THREE.Vector3(...f.bounds.max));
  return {kind:f.kind,intersections:props.filter(p=>new THREE.Box3().setFromObject(p).intersectsBox(box)).map(p=>p.name)};
}),four:verify(4),eight:verify(8)};
await fs.mkdir('validation',{recursive:true});await fs.writeFile('validation/discovery-placement.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(report.bboxIntersections.some(x=>x.intersections.length)||[...report.four,...report.eight].some(x=>!x.valid))process.exitCode=1;
