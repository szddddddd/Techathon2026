import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as T from 'three';
import {createCrossingController} from '../src/fuji-crossing.js';
import {railOffset,projectRail,railTangent,CROSSING,STATION,RAIL_START,RAIL_END,railwayFenceSections,railwayStepAllowed,PLATFORM_BOARDING} from '../src/fuji-railway.js';
import {buildFujiScene} from '../src/fuji-scene.js';
import {createPlacementContext} from '../src/social-characters.js';
import {buildWalkingGraph} from '../src/companion-walk.js';
const gate=createCrossingController(),radius=.55;
for(const d of[RAIL_START+4,CROSSING.d-8,CROSSING.d+5,STATION.center,RAIL_END-4]){
 const a=railOffset(d,-4),b=railOffset(d,4);assert.equal(gate.canStep(a,b,radius),false,'Open gate never enables a crossing elsewhere');assert.equal(gate.canStep(b,a,radius),false);
}
const a=railOffset(CROSSING.d,-4),b=railOffset(CROSSING.d,4),center=railOffset(CROSSING.d,0);
assert.equal(gate.canStep(a,b,radius),true);assert.equal(gate.canStep(b,a,radius),true);
gate.update(CROSSING.d-13,.1);assert.equal(gate.canStep(a,b,radius),false,'Long steps cannot skip the closed waiting boundary');assert.equal(gate.canStep(a,railOffset(CROSSING.d+1,-4),radius),true,'Walking alongside a waiting line remains allowed');
gate.setResidents([{...center,radius}]);for(let i=0;i<40;i++)gate.update(CROSSING.d-5,.1);assert.equal(gate.snapshot().closure,0);assert.equal(gate.shouldHold(CROSSING.d-5),true);assert.equal(gate.canStep(center,a,radius),true);
gate.setResidents([]);for(let i=0;i<40;i++)gate.update(CROSSING.d-5,.1);assert.equal(gate.snapshot().state,'closed');assert.equal(gate.canStep(a,b,radius),false);
for(let i=0;i<20;i++)gate.update(CROSSING.d+12,.1);assert.equal(gate.canStep(a,b,radius),true);
const sections=railwayFenceSections();assert.equal(sections.length,6);for(const s of sections)for(const p of s.points){const rail=projectRail(p.x,p.z);assert.ok(Math.abs(rail.d-CROSSING.d)>CROSSING.width/2+.1);assert.ok(rail.distance>.89,'Partitions clear carriage and rail heads');}
for(const gap of PLATFORM_BOARDING){
 assert.ok(Math.abs(gap.d-STATION.center)+gap.width/2<STATION.length/2,'Boarding aperture stays inside platform');
 assert.ok(sections.filter(s=>s.side<0).every(s=>s.end<=gap.d-gap.width/2||s.start>=gap.d+gap.width/2),'No north fence panel spans a boarding opening');
 assert.ok(sections.some(s=>s.side>0&&s.start<gap.d&&s.end>gap.d),'Opposite fence stays closed');
 assert.equal(gate.canStep(railOffset(gap.d,-3),railOffset(gap.d,3),radius),false,'Boarding opening is not a second railway crossing');
}
const scene=new T.Scene(),terrain=buildFujiScene(scene,{reduced:true}),context=createPlacementContext({scene,terrain});assert.equal(context.inspect(center.x,center.z,radius,[],{manual:true}).ok,false);
const graph=buildWalkingGraph(context,{...a,y:2.22,radius:.45},{range:8.6,step:.4}),visited=new Set([0]),queue=[0];let crossingEdges=0;
for(let q=0;q<queue.length;q++){const i=queue[q];for(const j of graph.nodes[i].links){const x=graph.nodes[i],y=graph.nodes[j];assert.ok(railwayStepAllowed(x,y,.45));if(projectRail((x.x+y.x)/2,(x.z+y.z)/2).distance<1.5)crossingEdges++;if(!visited.has(j)){visited.add(j);queue.push(j);}}}
assert.ok([...visited].some(i=>Math.hypot(graph.nodes[i].x-b.x,graph.nodes[i].z-b.z)<.8),'Both street sides connect through the gate');assert.ok(crossingEdges>0);
const report={openGateElsewhereBlocked:true,openGatePassesBothDirections:true,longClosedStepBlocked:true,existingOccupantCanExit:true,trainWaitsForOccupants:true,reopensAfterTail:true,trackDropRejected:true,boardingOpenings:PLATFORM_BOARDING,fenceSections:sections.length,fencePanels:sections.reduce((n,s)=>n+s.points.length-1,0),walkingGraphNodes:graph.nodes.length,crossingEdges};await fs.mkdir('validation/railway-barriers',{recursive:true});await fs.writeFile('validation/railway-barriers/rules.json',JSON.stringify(report,null,2));console.log(report);
