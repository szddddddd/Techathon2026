import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import {chromium,baseURL} from './test-runtime.mjs';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {ASSET_NAMES,PLACEMENTS} from '../src/layout.js';
import {treeAssetPath,isTree} from '../src/tree-assets.js';
import {buildTerrain} from '../src/terrain.js';
import {placeRodinProps} from '../src/rodin-props.js';
import {buildValleyLandmarks} from '../src/valley-landmarks.js';
import {createPlacementContext} from '../src/social-characters.js';

const out='validation/scene-polish';await fs.mkdir(out,{recursive:true});
const assets=Object.fromEntries(await Promise.all(Object.keys(ASSET_NAMES).map(async k=>[k,await loadGeometryGLB(treeAssetPath(k))])));
const scene=new THREE.Scene(),terrain=buildTerrain(scene,{rodinBridge:true}),generated=placeRodinProps(scene,assets,terrain);
const landmarks=buildValleyLandmarks({scene,terrain,assets});
assert.equal(landmarks.root.getObjectByName('Valley viewing frame'),undefined);
assert.equal(landmarks.pickables.some(p=>p.userData.landmark==='terrace'),false);
const context=createPlacementContext({scene,terrain,generated});
// Both approaches remain passable by a complete character body, not just a point.
for(let x=13.5;x<=19;x+=.2)assert.ok(context.inspect(x,1.5,.5,[],{manual:true}).ok,`plaza approach ${x}`);
for(let z=-3;z>=-12;z-=.2)assert.ok(context.inspect(23,z,.63,[],{manual:true}).ok,`ramp ${z}`);
const trees=[...generated.children.filter(p=>isTree(p.userData.kind)),...landmarks.obstacles.filter(p=>p.userData.kind==='tree')];
const rootChecks=trees.map(tree=>{
  assert.ok(tree.userData.groundedRoots);tree.updateMatrixWorld(true);
  const b=new THREE.Box3().setFromObject(tree),height=b.max.y-b.min.y,v=new THREE.Vector3();let minGap=Infinity,rootSamples=0;
  tree.traverse(mesh=>{if(!mesh.isMesh)return;const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);if(v.y<b.min.y+height*.035){rootSamples++;minGap=Math.min(minGap,v.y-terrain.sample(v.x,v.z).height);}}});
  assert.ok(rootSamples>0);assert.ok(minGap<.025&&minGap>-.25,`${tree.name}: root foot contact ${minGap}`);
  return {id:tree.name,variant:tree.userData.treeVariant||tree.userData.kind,position:tree.position.toArray(),minGap,rootSamples};
});
assert.ok(!PLACEMENTS.some(p=>p.id==='tree-f'&&p.z> -1));
assert.ok(!landmarks.obstacles.some(p=>p.name==='Valley tree 18.4 -3'));
await fs.writeFile(out+'/geometry.json',JSON.stringify({checks:['frame and its hit area removed','plaza connection and ramp have full-body clearance','all 14 tree roots grounded','two road trees moved to right slope'],trees:rootChecks},null,2));

const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const ctx=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:out+'/raw',size:{width:1440,height:1000}}});
const page=await ctx.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(baseURL);await page.waitForFunction(()=>document.querySelector('#viewport').dataset.loaded==='true',null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.addFriend('tuantuan');});
 assert.equal(await page.locator('.valley-return').count(),0);
 const kinds=await page.locator('#viewport').getAttribute('data-rodin-kinds');assert.ok(kinds.includes('tree_birch')&&kinds.includes('tree_maple'));
 await page.screenshot({path:out+'/after-overview.jpg',quality:90});
 for(const [name,position,target] of [['plaza',[31,25,23],[20,3,-2]],['slope',[31,25,10],[22,4,-6]],['terrace',[26,13,-5],[21,5.5,-13.5]]]){
  await page.evaluate(({position,target})=>{__valley.view(position,target);__valley.finishCamera();},{position,target});await page.waitForTimeout(250);await page.screenshot({path:out+'/after-'+name+'.jpg',quality:90});
 }
 checks.push('both generated variants loaded in main scene; frame and return button absent');
 await page.evaluate(()=>{__valley.view([38,27,25],[17,3,-7]);__valley.finishCamera();});
 const pose=await page.evaluate(()=>__discoveryScene.pose());let samples=[];
 await page.mouse.move(700,450);await page.mouse.down({button:'right'});
 for(let i=1;i<=80;i++){
  await page.mouse.move(700-i*4,450+i*.9);await page.evaluate(()=>new Promise(requestAnimationFrame));samples.push(await page.evaluate(()=>__discoveryScene.pose()));
 }
 await page.mouse.up({button:'right'});await page.waitForTimeout(700);
 const maxHeightDrift=Math.max(...samples.map(s=>Math.abs(s.target[1]-pose.target[1])));
 assert.ok(maxHeightDrift<1e-5,`terrain must not pull pan up/down: ${maxHeightDrift}`);
 const offsets=samples.map(s=>s.position.map((v,i)=>v-s.target[i])),offset=pose.position.map((v,i)=>v-pose.target[i]);
 const maxOrbitDrift=Math.max(...offsets.map(p=>Math.hypot(...p.map((v,i)=>v-offset[i]))));assert.ok(maxOrbitDrift<.001);
 checks.push('right drag crosses terrain with fixed target height and unchanged view direction');
 await fs.writeFile(out+'/pan-samples.json',JSON.stringify({maxHeightDrift,maxOrbitDrift,samples},null,2));
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(300);await page.evaluate(()=>{__valley.view([44,44,38],[17,3,-3]);__valley.finishCamera();});await page.waitForTimeout(300);await page.screenshot({path:out+'/mobile.jpg',quality:90});
 checks.push('mobile scene fits without obsolete return control');
 await page.setViewportSize({width:900,height:900});
 for(const kind of ['tree_birch','tree_maple']){
  await page.goto(baseURL+'/asset-review.html?asset='+kind);await page.waitForFunction(k=>document.body.dataset.loaded===k,kind,{timeout:90000});
  for(const [view,theta] of [['front',.35],['back',3.5]]){await page.evaluate(theta=>__assetReview.view(theta,.35),theta);await page.waitForTimeout(150);await page.screenshot({path:out+'/'+kind+'-'+view+'.jpg',quality:90});}
 }
 checks.push('both Rodin trees visually captured front/back');assert.deepEqual(errors,[]);
 await fs.writeFile(out+'/browser.json',JSON.stringify({checks,errors},null,2));console.log({checks,treeCount:trees.length,maxHeightDrift,maxOrbitDrift,errors});
}finally{const video=page.video();await ctx.close();await video.saveAs(out+'/scene-polish.webm');await browser.close();}
