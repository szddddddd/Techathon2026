import assert from 'node:assert/strict';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {prepareMailboxAsset,sceneResources,disposeSceneResources} from '../src/scene-assets.js';
import {createDayNightEnvironment} from '../src/day-night-environment.js';

const original=GLTFLoader.prototype.loadAsync;let attempts=0,resolve,reject;
GLTFLoader.prototype.loadAsync=()=>{attempts++;return new Promise((a,b)=>{resolve=a;reject=b;});};
try{
 const first=prepareMailboxAsset('forest'),second=prepareMailboxAsset('forest');
 assert.equal(attempts,1);assert.equal(first,second);
 reject(Error('offline'));await assert.rejects(first,/offline/);await assert.rejects(second,/offline/);
 const retry=prepareMailboxAsset('forest'),template=new T.Group(),mesh=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial());template.add(mesh);resolve({scene:template});
 assert.equal(await retry,template);assert.equal(await prepareMailboxAsset('forest'),template);assert.equal(attempts,2);
 const a=template.clone(true),b=template.clone(true);a.position.x=10;a.children[0].visible=false;
 assert.equal(b.position.x,0);assert.equal(b.children[0].visible,true);assert.equal(a.children[0].geometry,b.children[0].geometry);
 let geometryDisposals=0;mesh.geometry.addEventListener('dispose',()=>geometryDisposals++);disposeSceneResources(sceneResources(a));assert.equal(geometryDisposals,0,'Live instances must not dispose retained template geometry');
 const light=new T.SpotLight(),worldRoot=new T.Group();worldRoot.add(light);
 light.shadow.map=new T.WebGLRenderTarget(16,16);let targetDisposals=0;light.shadow.map.addEventListener('dispose',()=>targetDisposals++);
 disposeSceneResources(sceneResources(worldRoot));assert.equal(targetDisposals,1,'Scene-owned shadow render targets are released');
 console.log('PASS: concurrent mailbox loading, failed-load retry, shared resources, independent transforms and shadow-target disposal');
}finally{GLTFLoader.prototype.loadAsync=original;}

const scene=new T.Scene(),camera=new T.PerspectiveCamera(),renderer={},hemi=new T.HemisphereLight(),sun=new T.DirectionalLight(),rim=new T.DirectionalLight(),fill=new T.DirectionalLight(),ground=new T.Mesh(new T.PlaneGeometry(),new T.MeshStandardMaterial());
let applications=0;const world={id:'forest',setNightFactor(){applications++;}};
const environment=createDayNightEnvironment({scene,camera,renderer,hemi,sun,rim,fill,ground});
environment.apply(world,150);const position=sun.position.clone(),exposure=renderer.toneMappingExposure;
for(let i=0;i<120;i++)environment.apply(world,150);
assert.equal(applications,1);assert.ok(sun.position.equals(position));assert.equal(renderer.toneMappingExposure,exposure);
camera.position.x++;environment.apply(world,150);assert.equal(applications,2);
camera.rotation.y=.4;environment.apply(world,150);assert.equal(applications,3);
camera.aspect=.5;environment.apply(world,150);assert.equal(applications,4);
environment.apply(world,151);assert.equal(applications,5);assert.ok(!sun.position.equals(position));
environment.invalidate();environment.apply(world,151);assert.equal(applications,6);
environment.apply({...world,id:'fuji'},151);assert.equal(applications,7);
environment.dispose();ground.geometry.dispose();ground.material.dispose();
console.log('PASS: stationary manual time skips duplicate work; camera, aspect, automatic time, invalidation and scene changes still apply');
