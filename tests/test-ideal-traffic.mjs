import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as T from 'three';
import {createIdealTrafficSchool,createIdealAirways,idealTrafficPose,idealAirshipPose} from '../src/scenes/ideal/ideal-traffic.js';
const manifest=JSON.parse(await fs.readFile('assets/ideal-city/lowpoly/manifest.json','utf8'));
const buildings=manifest.placements.filter(p=>['colony-core','office-tower','bridge-tower','service-building','orbital-station','skybridge'].includes(p.asset));
let minimumSpacing=Infinity,minimumBuildingDistance=Infinity;
for(let time=0;time<=216;time+=.5){
 const cars=Array.from({length:18},(_,i)=>idealTrafficPose(i,time));
 for(let i=0;i<cars.length;i++){const p=cars[i];for(const b of buildings){const distance=Math.hypot(...[p.x,p.y,p.z].map((n,k)=>Math.max(b.min[k]-n,0,n-b.max[k])));minimumBuildingDistance=Math.min(minimumBuildingDistance,distance);assert.ok(distance>1.1,'Vehicle body clearance at '+time+' / '+b.name);}
  for(let j=i+1;j<cars.length;j++){const q=cars[j],distance=Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z);minimumSpacing=Math.min(minimumSpacing,distance);assert.ok(distance>1.2,'Vehicle separation');}
 }
}
const model=new T.Mesh(new T.BoxGeometry(1.7,.4,.9),new T.MeshBasicMaterial());let compact=false;
const school=createIdealTrafficSchool(model,{compact:()=>compact});school.update(1);const before=school.snapshot();school.update(4);assert.notDeepEqual(school.snapshot().positions,before.positions);school.update(4,true);const frozen=school.snapshot();school.update(200,true);assert.deepEqual(school.snapshot(),frozen);compact=true;school.update(201);assert.equal(school.snapshot().count,10);assert.ok(school.pickables.every(m=>m.count===10));assert.equal(school.vehicle('school-25'),null);
const routes=createIdealAirways();assert.equal(routes.userData.routes.length,2);assert.ok(routes.children.every(o=>!o.userData.vehicleId));
await fs.writeFile('.test-results/ideal-assets/traffic.json',JSON.stringify({sampledSeconds:216,minimumSpacing,minimumBuildingDistance,desktopCount:18,mobileCount:10,airways:2},null,2));
for(const [time,phase] of [[0,'docked'],[15,'taking-off'],[40,'cruising'],[85,'landing'],[90,'docked']])assert.equal(idealAirshipPose(time).phase,phase);
for(const boundary of [10,20,80,90]){const a=idealAirshipPose(boundary-.001),b=idealAirshipPose(boundary+.001);assert.ok(Math.hypot(...a.position.map((n,i)=>n-b.position[i]))<.01,'Flight phase is continuous');assert.ok(Math.abs(a.yaw-b.yaw)<.01,'Heading remains continuous');}
assert.deepEqual(idealAirshipPose(42,true).position,idealAirshipPose(0).position);
for(let t=0;t<90;t+=.1){const p=idealAirshipPose(t),c=p.position,yaw=p.yaw;const ext=[Math.abs(Math.cos(yaw))*5.4+Math.abs(Math.sin(yaw))*2,1.945,Math.abs(Math.sin(yaw))*5.4+Math.abs(Math.cos(yaw))*2];for(const b of buildings)assert.ok(c.some((n,i)=>n+ext[i]<b.min[i]||n-ext[i]>b.max[i]),'Airship body avoids '+b.name+' at '+t);}
console.log('PASS: one school, vehicle clearance, mobile/reduced motion, two corridors, continuous take-off/cruise/landing and full-cycle airship clearance.');
