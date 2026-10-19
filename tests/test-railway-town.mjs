import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as T from 'three';
import {FUJI_CARRIAGE,STATION,CROSSING,sampleRail,RAIL_START,RAIL_END} from '../src/scenes/fuji/fuji-railway.js';
import {createCrossingController} from '../src/scenes/fuji/fuji-crossing.js';
import {createFujiTrain} from '../src/scenes/fuji/fuji-train.js';
import {buildFujiScene} from '../src/scenes/fuji/fuji-scene.js';
import {createJapaneseBuilding} from '../src/scenes/fuji/japanese-buildings.js';
import {FUJI_LAYOUT as L} from '../src/scenes/fuji/fuji-layout.js';
import {createPlacementContext} from '../src/characters/social-characters.js';

const train=createFujiTrain(new T.Group(),{reduced:false});let dwell=0,maxStep=0,maxGapError=0,wraps=0,previous=train.snapshot();const transitionSpeeds=[];
for(let i=0;i<7000;i++){
 train.update(i*.01,.01);const s=train.snapshot();if(s.stopped){dwell+=.01;assert.ok(Math.abs(s.trainX-sampleRail(STATION.stop).x)<.1);}
 const step=Math.hypot(s.trainX-previous.trainX,s.trainZ-previous.trainZ);if(step>1){wraps++;assert.ok(previous.distance>RAIL_END+8&&s.distance<RAIL_START-5,'Reset stays hidden behind the portals');}else maxStep=Math.max(maxStep,step);
 if(s.stopped!==previous.stopped)transitionSpeeds.push(step/.01);
 for(let j=1;j<3;j++)if(train.pickables[j].visible){const a=new T.Vector3(...s.carriagePositions[j-1]),b=new T.Vector3(...s.carriagePositions[j]);maxGapError=Math.max(maxGapError,Math.abs(a.distanceTo(b)-FUJI_CARRIAGE.spacing));}previous=s;
}
assert.ok(Math.abs(dwell-8)<.011);assert.equal(wraps,1);assert.ok(maxStep<.016);assert.ok(maxGapError<.025);assert.ok(transitionSpeeds.every(v=>v<.002));
const reduced={matches:true},frozen=createFujiTrain(new T.Group(),{reduced}),before=frozen.snapshot();assert.ok(Math.abs(before.trainX-sampleRail(STATION.stop).x)<.1);
for(let i=0;i<20;i++)frozen.update(i,.1);assert.equal(frozen.snapshot().distance,before.distance);assert.equal(frozen.snapshot().steamVisible,false);reduced.matches=false;frozen.update(1,.1);assert.ok(frozen.snapshot().distance>before.distance);assert.ok(frozen.snapshot().distance-before.distance<.01);
const scene=new T.Scene(),terrain=buildFujiScene(scene,{reduced:true}),context=createPlacementContext({scene,terrain,generated:null}),failures=[];let samples=0;
for(const p of L.paths)for(let i=1;i<p.points.length;i++){const[a,b]=[p.points[i-1],p.points[i]],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.4));for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,z=a[1]+(b[1]-a[1])*j/n,result=context.inspect(x,z,.63,[],{walking:true});samples++;if(!result.ok)failures.push({path:p.id,x,z,...result});}}
assert.deepEqual(failures,[]);
const gate=createCrossingController(),cross=sampleRail(CROSSING.d);
gate.setResidents([{x:cross.x,z:cross.z}]);gate.update(CROSSING.d-13,.1);
assert.equal(gate.snapshot().state,'warning');for(let i=0;i<100;i++)gate.update(CROSSING.d-5,.1);
assert.equal(gate.snapshot().closure,0,'Never lower a barrier on an occupied crossing');assert.equal(gate.shouldHold(CROSSING.d-5),true);
assert.equal(gate.canStep({x:cross.x-2,z:cross.z+4},{x:cross.x-1,z:cross.z+2}),false);
assert.equal(gate.canStep({x:cross.x,z:cross.z},{x:cross.x-.1,z:cross.z+.2}),true);
gate.setResidents([]);for(let i=0;i<35;i++)gate.update(CROSSING.d-5,.1);
assert.equal(gate.snapshot().state,'closed');assert.equal(gate.shouldHold(CROSSING.d-5),false);
for(let i=0;i<20;i++)gate.update(CROSSING.d+11,.1);assert.equal(gate.snapshot().state,'open');
gate.update(CROSSING.d-12,.1);gate.update(CROSSING.d,.1,true);assert.equal(gate.snapshot().state,'open');
assert.equal(terrain.sample(cross.x,cross.z).walkable,false,'Cannot place a character on a crossing');assert.equal(terrain.sample(cross.x,cross.z,{walking:true}).walkable,true);
const bounds=[];for(const type of['club','classroom','sport','lab','library','music','art','cafe','observatory']){const model=createJapaneseBuilding(type);model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3());assert.ok(size.x<=4.0001&&size.z<=3.5001&&size.y<=4.2001,type+' fits all shared plots');bounds.push({type,size:size.toArray(),minY:box.min.y});}
const report={crossing:{occupiedWarning:true,trainWaits:true,noNewEntry:true,exitAllowed:true,reopensAfterTail:true,reducedOpen:true},scope:'Procedural fallback geometry and shared layout. Loaded Rodin visuals and browser interactions are covered separately in browser.json and capture.json.',train:{samples:7000,cycleSeconds:70,dwellSeconds:dwell,easingSeconds:train.snapshot().easingSeconds,hiddenWraps:wraps,maxVisibleStepAt10ms:maxStep,maxCarriageGapError:maxGapError,transitionSpeeds,reducedParksAtStation:true,unreduceSmoothDeparture:true},walking:{samples,bodyRadius:.63,normalWalkingClearance:true,failures},fallbackBuildingBounds:bounds};
await fs.mkdir('.test-results/railway-town',{recursive:true});await fs.writeFile('.test-results/railway-town/geometry.json',JSON.stringify(report,null,2));console.log(JSON.stringify({train:report.train,walking:{samples,failures:failures.length}}));
