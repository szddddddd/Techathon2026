import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as T from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {buildTerrain} from '../src/terrain.js';
import {buildValleyLandmarks} from '../src/valley-landmarks.js';
import {createPlacementContext} from '../src/social-characters.js';
import {buildWalkingGraph} from '../src/companion-walk.js';
import {querySurface} from '../src/world-surface.js';
const out='.test-results/terrace-extension';await fs.mkdir(out,{recursive:true});
const mountain=await loadGeometryGLB('assets/rodin-mountain/scene.glb'),reports=[];
for(const fallback of [false,true]){
 const scene=new T.Scene(),terrain=buildTerrain(scene,{valleyAssets:fallback?{}:{mountain_range:mountain}});
 buildValleyLandmarks({scene,terrain});scene.updateMatrixWorld(true);const context=createPlacementContext({scene,terrain}),ray=new T.Raycaster(),points=[[21.2,-13.9],[19.8,-14.8],[17.4,-16.8],[15.6,-18.2],[13.6,-18.8]],checks=[];
 for(let i=1;i<points.length;i++)for(let j=0;j<=20;j++){
  const t=j/20,x=T.MathUtils.lerp(points[i-1][0],points[i][0],t),z=T.MathUtils.lerp(points[i-1][1],points[i][1],t),q=terrain.sample(x,z),support=context.inspect(x,z,.63,[],{manual:true});
  assert.ok(support.ok,JSON.stringify({fallback,x,z,support}));assert.equal(q.height,querySurface(x,z).height);
  ray.set(new T.Vector3(x,30,z),new T.Vector3(0,-1,0));const hit=ray.intersectObjects(context.meadows,false)[0];assert.ok(hit);const error=Math.abs(hit.point.y-q.height);assert.ok(error<.01,`rendered support error ${error}`);checks.push({x,z,height:q.height,error,slope:Math.acos(q.normal.y)*180/Math.PI});
 }
 const graph=buildWalkingGraph(context,{x:21.2,z:-13.9,y:5.5,radius:.63,manualPlacement:true,placementRadius:.63},{range:12,step:.4});
 assert.ok(graph.nodes.some(n=>Math.hypot(n.x-13.6,n.z+18.8)<.7),'old terrace reaches the mountain platform through supported walking edges');
 assert.equal(context.inspect(11.8,-18.8,.4,[],{manual:true}).ok,false,'outer rail blocks placements');
 reports.push({fallback,samples:checks.length,maxSlope:Math.max(...checks.map(p=>p.slope)),maxSurfaceError:Math.max(...checks.map(p=>p.error)),walkNodes:graph.nodes.length});
}
await fs.writeFile(out+'/geometry.json',JSON.stringify({reports,checks:['continuous full-body route from original terrace to mountain platform','visible deck and shared query agree','rails reject unsafe edge placement','generated mountain and fallback both supported']},null,2));console.log(JSON.stringify(reports));
