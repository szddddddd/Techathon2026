import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {buildTerrain} from '../src/terrain.js';
import {buildArchitecture} from '../src/architecture.js';
import {placeRodinProps} from '../src/rodin-props.js';
import {PLACEMENTS} from '../src/layout.js';
import {createPlacementContext,pickCharacterSlots,createCharacterPlaceholder,chooseCharacterView} from '../src/social-characters.js';
import {buildWalkingGraph,walkingRoute,canWalkStep} from '../src/companion-walk.js';
import {FRIENDS} from '../src/social-store.js';

const scene=new THREE.Scene(),assets={};
for(const kind of new Set(PLACEMENTS.map(p=>p.kind)))assets[kind]=await loadGeometryGLB(`assets/rodin/${kind}/scene.glb`);
const terrain=buildTerrain(scene,{rodinBridge:true}),generated=placeRodinProps(scene,assets);
buildArchitecture(scene,{rodin:true,expanded:true});scene.updateMatrixWorld(true);
const context=createPlacementContext({scene,terrain,generated});
const models=[],friends=[];
for(const friend of FRIENDS){
  const {animal,height}=friend;
  const fallbackSize=new THREE.Box3().setFromObject(createCharacterPlaceholder({})).getSize(new THREE.Vector3());
  let radius=Math.max(.35,Math.hypot(fallbackSize.x,fallbackSize.z)*height/fallbackSize.y/2),source='actual placeholder bounds',size=fallbackSize.toArray();
  try{const model=await loadGeometryGLB(friend.modelUrl);size=model.size.toArray();radius=Math.max(.35,Math.hypot(model.size.x,model.size.z)*height/model.size.y/2);source='actual generated GLB';}catch(error){if(error.code!=='ENOENT')throw error;}
  friends.push({...friend,radius});models.push({animal,source,size,radius,height});
}
const slots=pickCharacterSlots(context,friends);
const stressSlots=pickCharacterSlots(context,[...friends,...friends.map(f=>({...f,id:f.id+'-stress'}))]);
function verify(items){return items.map(s=>({...s,check:s.unplaced?{ok:false,reason:'no slot'}:context.inspect(s.x,s.z,s.radius,items.filter(p=>p.id!==s.id&&!p.unplaced),{walking:true})}));}
const focusViews=slots.filter(s=>!s.unplaced).map(s=>{const target=new THREE.Vector3(s.x,s.y+s.height*.58,s.z),view=chooseCharacterView(context,target,new THREE.Vector3(27,25.9,40).multiplyScalar(.85));return {id:s.id,target:target.toArray(),position:view.position.toArray(),angle:view.angle,visibleBodySamples:view.visibleSamples};});
const walking=slots.filter(s=>!s.unplaced).map(slot=>{const graph=buildWalkingGraph(context,slot),route=walkingRoute(graph,0),checks=[];let previous=graph.nodes[0];for(const index of route){const next=graph.nodes[index];for(let t=0;t<=1;t+=.1)checks.push(context.inspect(previous.x+(next.x-previous.x)*t,previous.z+(next.z-previous.z)*t,slot.radius,[],{walking:true}));previous=next;}return {id:slot.id,nodes:graph.nodes.length,routeLength:route.length,valid:route.length>0&&checks.every(c=>c.ok)};});
const crossingBlocked=!canWalkStep({x:-2,z:0},{x:2,z:0},.5,[{x:0,z:0,radius:.5}]);
if(!crossingBlocked||walking.some(w=>!w.valid))throw new Error('Walking route validation failed: '+JSON.stringify(walking));
console.log(JSON.stringify({walking,crossingBlocked}));
const report={createdAt:new Date().toISOString(),method:'Live terrain/prop builders; actual obstacle triangle projections clipped to character-height band; 13 ground ray samples; 0.35m prop buffer; 0.6m between rotating body-enclosing circles. Focus checks three body-level visibility rays against actual prop meshes.',models,walking,crossingBlocked,slots:verify(slots),eightCharacterStress:verify(stressSlots),focusViews,obstacles:context.obstacles.map(o=>({id:o.id,triangles:o.triangles.length}))};
const index=process.argv.indexOf('--out'),output=index>=0?process.argv[index+1]:'validation/social-character-placement.json';
await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2));
console.log(JSON.stringify({models,slots:report.slots,eightCharacterStress:report.eightCharacterStress,focusViews,output},null,2));
if([...report.slots,...report.eightCharacterStress].some(s=>!s.check.ok)||focusViews.some(v=>v.visibleBodySamples<3))process.exitCode=1;
