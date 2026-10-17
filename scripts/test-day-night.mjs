import assert from 'node:assert/strict';
import {createDayNightClock,DAY_NIGHT_KEY,timePhase} from '../src/day-night-clock.js';
import * as T from 'three';
import {createEnvironmentSampler,createDayNightEnvironment} from '../src/day-night-environment.js';
import {createNightEffects} from '../src/day-night-effects.js';
import {freezeStaticTransforms} from '../src/static-transforms.js';
let memory=null,reduced=false,hidden=false;
const storage={getItem:()=>memory,setItem:(key,value)=>{assert.equal(key,DAY_NIGHT_KEY);memory=value;}};
const clock=createDayNightClock({storage,reduced:()=>reduced,hidden:()=>hidden});
assert.equal(clock.snapshot().seconds,150);clock.update(195);assert.equal(clock.snapshot().phase,'dusk');clock.update(45);assert.equal(clock.snapshot().phase,'night');clock.update(300);assert.equal(clock.snapshot().phase,'dawn');clock.update(30);assert.equal(clock.snapshot().seconds,0);
clock.update(720);assert.equal(clock.snapshot().seconds,0);assert.equal(timePhase(-1),'dawn');
clock.setMode('night');clock.update(1);assert.equal(clock.snapshot().transitioning,true);const mid=clock.snapshot().seconds;assert.ok(mid>0&&mid<540);clock.setMode('auto');clock.update(1);assert.equal(clock.snapshot().seconds,mid+1);
clock.setMode('night');clock.update(2);assert.equal(clock.snapshot().seconds,540);clock.update(40);assert.equal(clock.snapshot().seconds,540);
clock.setMode('day');hidden=true;clock.update(20);assert.equal(clock.snapshot().seconds,540);hidden=false;reduced=true;clock.update(.01);assert.equal(clock.snapshot().seconds,150);clock.setMode('night');assert.equal(clock.snapshot().seconds,540);
clock.setMode('auto');clock.update(100);assert.equal(clock.snapshot().seconds,540);reduced=false;clock.update(1);clock.save();assert.equal(createDayNightClock({storage}).snapshot().seconds,541);
clock.setMode('dusk');clock.update(.4);clock.save();const restored=createDayNightClock({storage});assert.equal(restored.snapshot().transitioning,true);restored.update(2);assert.equal(restored.snapshot().seconds,345);
assert.equal(clock.setMode('invalid'),false);clock.dispose();const old=clock.snapshot().seconds;clock.update(10);assert.equal(clock.snapshot().seconds,old);
for(const input of ['broken','null','{"version":1,"mode":"night","seconds":"bad"}']){memory=input;assert.equal(createDayNightClock({storage}).snapshot().mode,'auto');}
const sampler=createEnvironmentSampler();
for(const theme of ['forest','fuji','ideal'])for(const t of [0,30,330,360,390,690,720]){
 const a=sampler(theme,t-.0001),night=a.night,color=a.background.clone(),b=sampler(theme,t+.0001);assert.ok(Math.abs(b.night-night)<.0001);assert.ok(color.distanceTo?color.distanceTo(b.background)<.001:Math.abs(color.r-b.background.r)<.001);
}
sampler('forest',30);const dayRevision=sampler.revision;sampler('forest',299);assert.equal(sampler.revision,dayRevision);
sampler('forest',330);assert.ok(sampler.revision>dayRevision);const transitionRevision=sampler.revision;sampler('forest',331);assert.ok(sampler.revision>transitionRevision);
sampler('forest',450);const nightRevision=sampler.revision;sampler('forest',659);assert.equal(sampler.revision,nightRevision);
sampler('fuji',659);assert.ok(sampler.revision>nightRevision);assert.equal(sampler('forest',450).night,1);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,1.44,.1,500),renderer={},hemi=new T.HemisphereLight(),sun=new T.DirectionalLight(),rim=new T.DirectionalLight(),fill=new T.DirectionalLight(),ground=new T.Mesh(new T.PlaneGeometry(),new T.MeshStandardMaterial());
scene.fog=new T.FogExp2();const root=new T.Group();scene.add(root);const effects=createNightEffects(root,'forest');freezeStaticTransforms(root,[effects.root]);
const world={id:'forest',setNightFactor:effects.setNightFactor},environment=createDayNightEnvironment({scene,camera,renderer,hemi,sun,rim,fill,ground});
environment.apply(world,150);const sky=scene.background,skyVersion=sky.version,pixels=sky.image.data.slice();environment.apply(world,299);assert.equal(sky.version,skyVersion);assert.deepEqual(sky.image.data,pixels);
environment.apply(world,540);assert.equal(effects.snapshot().factor,1);assert.ok(sky.version>skyVersion);
camera.position.set(9,8,7);camera.rotation.set(.1,.2,.3);camera.aspect=.5;environment.apply(world,541);scene.updateMatrixWorld();
assert.deepEqual(effects.root.getWorldPosition(new T.Vector3()).toArray(),camera.position.toArray());assert.ok(effects.root.getWorldQuaternion(new T.Quaternion()).angleTo(camera.quaternion)<1e-7);assert.equal(effects.root.children[0].scale.x,.5);
const stableVersion=sky.version;camera.position.x=13;environment.apply(world,542);scene.updateMatrixWorld();assert.equal(effects.root.matrixWorld.elements[12],13);assert.equal(sky.version,stableVersion);
environment.apply({...world,id:'fuji'},542);assert.ok(sky.version>stableVersion);environment.dispose();
console.log('PASS: full cycle, midnight continuity, interrupted transitions, persistence, hidden/reduced pause and all palettes.');
console.log('PASS: constant palettes reuse exact pixels; scene changes invalidate the cache; dynamic stars track camera motion and resize with frozen scenery.');
