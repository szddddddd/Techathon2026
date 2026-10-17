import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createPlacementContext} from '../src/social-characters.js';
const scene=new THREE.Scene(),root=new THREE.Group(),owner=new THREE.Group();owner.userData.layoutId='discovery-accounts';
const mesh=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial());mesh.position.y=3.22;owner.add(mesh);scene.add(root,owner);
const terrain={root,theme:'fuji',walkways:[],landmarkObstacles:[owner],sample:()=>({height:2.22,walkable:true})},cache=new WeakMap();
const a=createPlacementContext({scene,terrain,obstacleCache:cache}),ray=new THREE.Raycaster(new THREE.Vector3(0,3.22,5),new THREE.Vector3(0,0,-1));
assert.equal(a.inspect(0,0,.2,[],{manual:true}).ok,false);assert.ok(ray.intersectObjects(a.occluders,false).length);
owner.visible=false;owner.userData.modDisabled=true;assert.equal(a.inspect(0,0,.2,[],{manual:true}).ok,true);assert.equal(ray.intersectObjects(a.occluders,false).length,0);
const b=createPlacementContext({scene,terrain,obstacleCache:cache});assert.equal(b.obstacles[0],a.obstacles[0]);assert.equal(b.inspect(0,0,.2,[],{manual:true}).ok,true);
owner.visible=true;owner.userData.modDisabled=false;assert.equal(b.inspect(0,0,.2,[],{manual:true}).ok,false);assert.ok(ray.intersectObjects(a.occluders,false).length);
for(let i=0;i<5;i++){owner.userData.modDisabled=true;assert.equal(a.inspect(0,0,.2,[],{manual:true}).ok,true);owner.userData.modDisabled=false;assert.equal(a.inspect(0,0,.2,[],{manual:true}).ok,false);}
assert.equal(a.obstacles.length,1);a.dispose();b.dispose();mesh.geometry.dispose();mesh.material.dispose();
console.log('PASS: hidden Mod facilities cease blocking placement and cached raycasts; re-enabling restores collision without resource reconstruction.');
