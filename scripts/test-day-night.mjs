import assert from 'node:assert/strict';
import {createDayNightClock,DAY_NIGHT_KEY,timePhase} from '../src/day-night-clock.js';
import {createEnvironmentSampler} from '../src/day-night-environment.js';
let memory=null,reduced=false,hidden=false;
const storage={getItem:()=>memory,setItem:(key,value)=>{assert.equal(key,DAY_NIGHT_KEY);memory=value;}};
const clock=createDayNightClock({storage,reduced:()=>reduced,hidden:()=>hidden});
assert.equal(clock.snapshot().seconds,150);clock.update(150);assert.equal(clock.snapshot().phase,'dusk');clock.update(120);assert.equal(clock.snapshot().phase,'night');clock.update(240);assert.equal(clock.snapshot().phase,'dawn');clock.update(60);assert.equal(clock.snapshot().seconds,0);
clock.update(720);assert.equal(clock.snapshot().seconds,0);assert.equal(timePhase(-1),'dawn');
clock.setMode('night');clock.update(1);assert.equal(clock.snapshot().transitioning,true);const mid=clock.snapshot().seconds;assert.ok(mid>0&&mid<540);clock.setMode('auto');clock.update(1);assert.equal(clock.snapshot().seconds,mid+1);
clock.setMode('night');clock.update(2);assert.equal(clock.snapshot().seconds,540);clock.update(40);assert.equal(clock.snapshot().seconds,540);
clock.setMode('day');hidden=true;clock.update(20);assert.equal(clock.snapshot().seconds,540);hidden=false;reduced=true;clock.update(.01);assert.equal(clock.snapshot().seconds,150);clock.setMode('night');assert.equal(clock.snapshot().seconds,540);
clock.setMode('auto');clock.update(100);assert.equal(clock.snapshot().seconds,540);reduced=false;clock.update(1);clock.save();assert.equal(createDayNightClock({storage}).snapshot().seconds,541);
clock.setMode('dusk');clock.update(.4);clock.save();const restored=createDayNightClock({storage});assert.equal(restored.snapshot().transitioning,true);restored.update(2);assert.equal(restored.snapshot().seconds,360);
assert.equal(clock.setMode('invalid'),false);clock.dispose();const old=clock.snapshot().seconds;clock.update(10);assert.equal(clock.snapshot().seconds,old);
for(const input of ['broken','null','{"version":1,"mode":"night","seconds":"bad"}']){memory=input;assert.equal(createDayNightClock({storage}).snapshot().mode,'auto');}
const sampler=createEnvironmentSampler();
for(const theme of ['forest','fuji','ideal'])for(const t of [0,300,360,420,660,690,720]){
 const a=sampler(theme,t-.0001),night=a.night,color=a.background.clone(),b=sampler(theme,t+.0001);assert.ok(Math.abs(b.night-night)<.0001);assert.ok(color.distanceTo?color.distanceTo(b.background)<.001:Math.abs(color.r-b.background.r)<.001);
}
console.log('PASS: full cycle, midnight continuity, interrupted transitions, persistence, hidden/reduced pause and all palettes.');
