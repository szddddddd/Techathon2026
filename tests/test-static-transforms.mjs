import assert from 'node:assert/strict';
import * as T from 'three';
import {freezeStaticTransforms} from '../src/rendering/static-transforms.js';
const scene=new T.Scene(),fixed=new T.Group(),animated=new T.Group();scene.add(fixed);fixed.add(animated);fixed.position.set(3,2,1);
const rock=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial());rock.position.x=4;fixed.add(rock);
const actor=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial());animated.add(actor);
freezeStaticTransforms(scene,[animated]);assert.equal(scene.matrixAutoUpdate,false);assert.equal(rock.matrixAutoUpdate,false);assert.equal(animated.matrixAutoUpdate,true);
const before=new T.Vector3();rock.getWorldPosition(before);assert.deepEqual(before.toArray(),[7,2,1]);
animated.position.x=6;actor.position.y=5;scene.updateMatrixWorld();assert.deepEqual(actor.getWorldPosition(new T.Vector3()).toArray(),[9,7,1]);assert.deepEqual(rock.getWorldPosition(new T.Vector3()).toArray(),before.toArray());
const late=new T.Object3D();late.position.z=8;animated.add(late);scene.updateMatrixWorld();assert.deepEqual(late.getWorldPosition(new T.Vector3()).toArray(),[9,2,9]);
// The renderer's Scene must keep its identity matrix stable, otherwise its
// automatic local update forces every frozen world matrix to multiply again.
const renderScene=new T.Scene();renderScene.matrixAutoUpdate=false;
const world=new T.Group(),animatedRoot=new T.Group(),fixedMesh=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial()),siblingActor=new T.Object3D();
world.position.x=2;fixedMesh.position.x=3;world.add(fixedMesh,animatedRoot);renderScene.add(world,siblingActor);freezeStaticTransforms(world,[animatedRoot]);
let fixedMultiplications=0;const multiply=fixedMesh.matrixWorld.multiplyMatrices;
fixedMesh.matrixWorld.multiplyMatrices=function(...args){fixedMultiplications++;return multiply.apply(this,args);};
renderScene.updateMatrixWorld();fixedMultiplications=0;
for(let i=0;i<10;i++){siblingActor.position.x=i;animatedRoot.position.y=i;renderScene.updateMatrixWorld();}
assert.equal(fixedMultiplications,0);assert.equal(fixedMesh.matrixWorld.elements[12],5);assert.equal(siblingActor.matrixWorld.elements[12],9);assert.equal(animatedRoot.matrixWorld.elements[13],9);
const lateActor=new T.Object3D();lateActor.position.z=7;animatedRoot.add(lateActor);renderScene.updateMatrixWorld();assert.equal(lateActor.matrixWorld.elements[14],7);assert.equal(fixedMultiplications,0);
renderScene.updateMatrixWorld(true);assert.equal(fixedMultiplications,1);assert.equal(fixedMesh.matrixWorld.elements[12],5);
const movingParent=new T.Group();movingParent.position.x=11;renderScene.add(movingParent);movingParent.add(world);renderScene.updateMatrixWorld();assert.equal(fixedMesh.matrixWorld.elements[12],16);assert.equal(lateActor.matrixWorld.elements[12],13);
console.log('PASS: immutable world transforms remain exact; animated descendants and later actors still update.');
console.log('PASS: stable Scene skips frozen world multiplications while sibling actors, forced refresh and reparenting retain correct matrices.');
