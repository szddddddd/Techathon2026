import assert from 'node:assert/strict';
import * as T from 'three';
import {pickCharacterSlots,createPlacementContext} from '../src/social-characters.js';
import {createDiscoveryScene} from '../src/discovery-scene.js';
import {createNeonFacility} from '../src/public-facility-models.js';
import {SCENE_THEMES} from '../src/scene-theme.js';

assert.equal(SCENE_THEMES.cyber.name,'霓虹云港');
const scene=new T.Scene(),root=new T.Group();scene.add(root);
const terrain={theme:'cyber',root,walkways:[],sample:()=>({height:2.22,walkable:true,region:'town'})};
const context=createPlacementContext({scene,terrain});
assert.ok(context.inspect(-8.5,1.5,.4,[],{manual:true}).ok,'cyber does not inherit the forest campfire');
terrain.theme='forest';assert.equal(context.inspect(-8.5,1.5,.4,[],{manual:true}).reason,'campfire');terrain.theme='cyber';
const slots=pickCharacterSlots(context,[{id:'friend',animal:'fox'}],{spawnAreas:[{minX:40,maxX:44,minZ:30,maxZ:34}]});
assert.ok(!slots[0].unplaced&&slots[0].x>=40&&slots[0].z>=30,'injected spawn area works beyond forest limits');
context.dispose();
for(const kind of ['accounts','scene-video','music']){const model=createNeonFacility(kind),bounds=new T.Box3().setFromObject(model);assert.ok(!bounds.isEmpty());assert.ok(bounds.min.y>=-.001);}
const facility=createDiscoveryScene({scene,camera:new T.PerspectiveCamera(),controls:{},renderer:{domElement:{addEventListener(){},removeEventListener(){}}},terrain,facilities:{kiosk:{x:35,z:35},cinema:{x:40,z:35}}});
assert.equal(facility.kiosk.position.x,35);assert.equal(facility.cinema.position.x,40);
assert.ok(facility.kiosk.getObjectByName('Information terminal body'));assert.ok(facility.cinema.getObjectByName('Holographic display backing'));
assert.ok(facility.kiosk.getObjectByName('Compact public account page'),'live preview survives shell replacement');
facility.dispose();
console.log('Third-scene contracts: metadata, custom spawn, forest exclusion, facility anchors and live previews passed.');
