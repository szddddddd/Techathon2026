import assert from 'node:assert/strict';
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createPlacementTriangles} from '../src/placement-triangles.js';
import {accelerateStaticRaycast} from '../src/static-raycast.js';
import {instanceStaticScenery} from '../src/static-instances.js';
import {ensureIndexed} from '../src/indexed-geometry.js';

let seed=1234;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const source=[];
for(let i=0;i<12;i++){const mesh=new T.Mesh(i%2?new T.CylinderGeometry(.6,.9,3,12):new T.BoxGeometry(2,2,2));mesh.position.set((random()-.5)*14,1+random()*5,(random()-.5)*14);mesh.rotation.set(random(),random(),random());mesh.scale.set(.5+random(),.5+random(),.5+random());mesh.updateMatrixWorld(true);source.push(mesh);}
// Keep an independent, intentionally slow implementation of the original
// triangle clipping contract to catch thin walls, slopes and overhang mistakes.
const faces=[];for(const mesh of source){const p=mesh.geometry.attributes.position,ix=mesh.geometry.index;for(let i=0;i<(ix?.count??p.count);i+=3){const face=[0,1,2].map(k=>new T.Vector3().fromBufferAttribute(p,ix?ix.getX(i+k):i+k).applyMatrix4(mesh.matrixWorld));if(Math.max(...face.map(p=>p.y))>=2.25)faces.push(face);}}
function segment(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,n=dx*dx+dz*dz,t=n?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/n)):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
function near(x,z,radius,a,b,c){const cross=(a,b)=>(b.x-a.x)*(z-a.z)-(b.z-a.z)*(x-a.x),s=[cross(a,b),cross(b,c),cross(c,a)],area=(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);if(Math.abs(area)>1e-8&&(s.every(v=>v>=0)||s.every(v=>v<=0)))return true;return Math.min(segment(x,z,a,b),segment(x,z,b,c),segment(x,z,c,a))<radius;}
function reference(x,z,radius,low,high){for(const face of faces){let clipped=face;for(const [height,above]of[[low,true],[high,false]]){const next=[];for(let i=0;i<clipped.length;i++){const a=clipped[i],b=clipped[(i+1)%clipped.length],inside=above?a.y>=height:a.y<=height,other=above?b.y>=height:b.y<=height;if(inside)next.push(a);if(inside!==other)next.push(a.clone().lerp(b,(height-a.y)/(b.y-a.y)));}clipped=next;}for(let j=1;j+1<clipped.length;j++)if(near(x,z,radius,clipped[0],clipped[j],clipped[j+1]))return true;}return false;}
const packed=createPlacementTriangles(source);assert.equal(packed.length,faces.length);
for(let i=0;i<1800;i++){const x=(random()-.5)*20,z=(random()-.5)*20,r=.03+random(),low=1.8+random()*4,high=low+.1+random()*2.5;assert.equal(packed.intersects(x,z,r,low,high),reference(x,z,r,low,high),JSON.stringify({x,z,r,low,high}));}
assert.equal(createPlacementTriangles([]).intersects(0,0,1,2,4),false);
console.log('PASS: packed collision BVH matches 1800 independent exact height-clipped disk queries');

const g=new T.TorusKnotGeometry(2,.5,80,12),m=new T.MeshBasicMaterial({side:T.DoubleSide}),mesh=new T.Mesh(g,m);mesh.position.set(2,3,-1);mesh.rotation.set(.3,.7,.2);mesh.scale.set(1,.7,1.4);mesh.updateMatrixWorld();
const index=g.index.array.slice();accelerateStaticRaycast(mesh);assert.deepEqual(g.index.array,index);
for(let i=0;i<150;i++){const ray=new T.Raycaster(new T.Vector3((random()-.5)*12,random()*10,(random()-.5)*12),new T.Vector3(2,3,-1).sub(new T.Vector3((random()-.5)*3,2,4)).normalize());const expected=[];T.Mesh.prototype.raycast.call(mesh,ray,expected);const actual=[];mesh.raycast(ray,actual);const sort=(a,b)=>a.distance-b.distance;expected.sort(sort);actual.sort(sort);assert.equal(actual.length,expected.length);actual.forEach((hit,j)=>{assert.ok(Math.abs(hit.distance-expected[j].distance)<1e-8);assert.equal(hit.faceIndex,expected[j].faceIndex);});}
const oldTree=g.boundsTree;g.attributes.position.setX(0,5);g.attributes.position.needsUpdate=true;accelerateStaticRaycast(mesh);assert.notEqual(g.boundsTree,oldTree);
const skin=new T.SkinnedMesh(new T.BoxGeometry(),m);const skinRay=skin.raycast;accelerateStaticRaycast(skin);assert.equal(skin.raycast,skinRay);
console.log('PASS: indirect static ray BVH preserves triangle indices, all parity hits and animated-mesh isolation');

const root=new T.Group(),geometry=new T.BoxGeometry(),material=new T.MeshStandardMaterial(),objects=[];
root.position.set(3,2,-1);for(let i=0;i<5;i++){const mesh=new T.Mesh(geometry,material);mesh.position.set(i*3,0,0);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);objects.push(mesh);}
const dynamic=new T.Group();root.add(dynamic);for(let i=0;i<3;i++)dynamic.add(new T.Mesh(geometry,material));root.updateMatrixWorld(true);
const original=objects.map(o=>o.matrixWorld.clone()),report=instanceStaticScenery(root,[dynamic]),batch=root.children.find(o=>o.isInstancedMesh);root.updateMatrixWorld(true);
assert.equal(report.instances,5);assert.equal(report.savedDraws,4);assert.equal(batch.geometry,geometry);assert.equal(batch.material,material);assert.equal(batch.castShadow,true);assert.ok(objects.every(o=>!o.visible));assert.ok(dynamic.children.every(o=>o.visible));
for(let i=0;i<5;i++){const matrix=new T.Matrix4();batch.getMatrixAt(i,matrix);matrix.premultiply(batch.matrixWorld);matrix.elements.forEach((v,j)=>assert.ok(Math.abs(v-original[i].elements[j])<1e-6));const ray=new T.Raycaster(new T.Vector3(3+i*3,2,10),new T.Vector3(0,0,-1));assert.ok(ray.intersectObject(objects[i],false).length>0);assert.equal(ray.intersectObject(batch,false).length,0);}
const copies=[ensureIndexed(geometry.clone()),ensureIndexed(geometry.toNonIndexed())],merged=mergeGeometries(copies);assert.equal(merged.index.count,geometry.index.count*2);assert.equal(merged.attributes.position.count,geometry.attributes.position.count+geometry.index.count);
console.log('PASS: instances retain exact geometry/material/transforms/shadows and original picking; merging retains indexed vertices');
