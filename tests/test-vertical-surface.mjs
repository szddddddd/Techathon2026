import assert from 'node:assert/strict';
import * as T from 'three';
import {createVerticalSurfaceSampler} from '../src/scenes/shared/vertical-surface.js';
import {loadGeometryGLB} from '../scripts/glb-geometry.mjs';
import {createMountainGeometry} from '../src/scenes/forest/mountain-profile.js';

const loaded=await loadGeometryGLB('assets/rodin-mountain/scene.glb');
const fallback=new T.Mesh(createMountainGeometry(),new T.MeshBasicMaterial({side:T.DoubleSide}));
const report=[];
for(const root of [loaded.model,fallback]){
 root.updateWorldMatrix(true,true);const heightAt=createVerticalSurfaceSampler([root]);
 const ray=new T.Raycaster(),bounds=new T.Box3().setFromObject(root);let seed=2718,maxError=0;
 const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 // Include exact grid boundaries as well as reproducible random interior points.
 const points=Array.from({length:400},()=>[bounds.min.x-1+random()*(bounds.max.x-bounds.min.x+2),bounds.min.z-1+random()*(bounds.max.z-bounds.min.z+2)]);
 for(let x=-24;x<=24;x+=1.5)points.push([x,-15],[x,-24]);
 for(const [x,z] of points){
  ray.set(new T.Vector3(x,30,z),new T.Vector3(0,-1,0));const expected=ray.intersectObject(root,true)[0]?.point.y??-Infinity,actual=heightAt(x,z);
  if(expected===-Infinity)assert.equal(actual,expected);else{assert.ok(Number.isFinite(actual));maxError=Math.max(maxError,Math.abs(actual-expected));assert.ok(Math.abs(actual-expected)<1e-6,JSON.stringify({x,z,actual,expected}));}
 }
 report.push({source:root===fallback?'procedural':'GLB',samples:points.length,maxError});
}
// World transforms, draw ranges, material culling and stacked triangles.
for(const side of [T.FrontSide,T.BackSide,T.DoubleSide]){
 const mesh=new T.Mesh(new T.BoxGeometry(4,2,4),new T.MeshBasicMaterial({side}));mesh.position.set(2,7,-3);mesh.rotation.set(.2,.3,.1);mesh.scale.set(1.2,.8,1.1);mesh.geometry.setDrawRange(0,30);mesh.updateWorldMatrix(true,true);
 const at=createVerticalSurfaceSampler([mesh]),ray=new T.Raycaster();
 for(const [x,z] of [[2,-3],[1,-2],[0,-4],[5,-3]]){ray.set(new T.Vector3(x,30,z),new T.Vector3(0,-1,0));const expected=ray.intersectObject(mesh)[0]?.point.y??-Infinity,actual=at(x,z);assert.ok(actual===expected||Math.abs(actual-expected)<1e-6);}
}
console.log(JSON.stringify({checks:['exact downward triangle hits','GLB and procedural mountains','cell boundaries and misses','transforms, draw ranges and face culling'],report}));
