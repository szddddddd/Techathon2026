import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL,outputPath} from './test-runtime.mjs';
import {FOREST_TREES} from '../src/forest-layout.js';
import {GROUP_TYPES} from '../src/group-catalog.js';

const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),reports=[];
try{
 for(const fallback of [false,true]){
  const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  if(fallback)await page.route('**/rodin-trees/silver_birch/scene.glb',route=>route.abort());
  try{
   const url=new URL(baseURL);url.searchParams.set('scene','forest');
   await page.goto(url.href);await page.waitForFunction(()=>document.querySelector('#viewport')?.dataset.loaded==='true'||document.body.textContent.includes('场景暂未完成加载：'),null,{timeout:180000});
   assert.equal(await page.locator('#viewport').getAttribute('data-loaded'),'true',await page.locator('body').innerText());
   await page.evaluate(()=>__socialStore.setDemoPaused(true));
   const inventory=await page.evaluate(()=>{
    let scene=__river.root;while(scene.parent)scene=scene.parent;
    const forest=[],street=[],crystals=[],rocks=[];
    scene.traverse(o=>{
     if(/^(west|east|foothill)-\d+$/.test(o.userData.layoutId||''))forest.push({id:o.userData.layoutId,x:o.position.x,z:o.position.z,grounded:o.userData.groundedRoots,procedural:!!o.userData.proceduralTree});
     if(o.name.startsWith('Town street tree '))street.push(o.position.toArray());
     if(o.userData.kind==='crystal'||/crystal/i.test(o.name))crystals.push(o.name);
     if(o.userData.layoutId?.startsWith('valley-rock-'))rocks.push(o.userData.layoutId);
    });
    return{forest,street,crystals,rocks,proceduralTrees:forest.some(t=>t.procedural)};
   });
   assert.equal(inventory.proceduralTrees,fallback);assert.equal(inventory.forest.length,24);assert.equal(inventory.street.length,6);assert.equal(inventory.rocks.length,2);assert.deepEqual(inventory.crystals,[]);
   for(const p of FOREST_TREES){const actual=inventory.forest.find(t=>t.id===p.id);assert.ok(actual.grounded);assert.equal(actual.x,p.x);assert.equal(actual.z,p.z);}
   assert.equal(requests.some(url=>url.includes('/rodin/crystal/')),false);
   await page.evaluate(async()=>{for(const id of ['tuantuan','ali']){await __socialStore.addFriend(id);await __socialStore.receiveMessage(id,{text:'一起在林间散步'},'forest-check-'+id);}});
   await page.waitForFunction(()=>__characterPlacement.snapshot().characters.length===2);
   const label=fallback?'fallback':'normal';
   await page.screenshot({path:outputPath(`forest-${label}-desktop.jpg`),quality:90});
   if(!fallback){
    await page.evaluate(async types=>{for(const type of types){const group=await __socialStore.createGroup({name:type.name,type:type.id,memberIds:['tuantuan','ali']});await __socialStore.receiveGroupMessage(group.id,'ali',{text:'街区布局检查'});}},GROUP_TYPES);
    await page.waitForFunction(()=>__groupBuildings.snapshot().entries.length===9&&__groupBuildings.assets.loading.length===0&&__groupBuildings.assets.ready.length===9,null,{timeout:90000});
    await page.waitForTimeout(300);await page.screenshot({path:outputPath('forest-town-desktop.jpg'),quality:90});
   }
   await page.setViewportSize({width:391,height:844});await page.waitForTimeout(300);
   await page.screenshot({path:outputPath(`forest-${label}-mobile.jpg`),quality:90});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const party=await page.evaluate(()=>__valley.gather());assert.ok(party.ok);assert.equal(party.count,2);
   await page.waitForFunction(()=>!__valley.snapshot().transitioning);await page.waitForTimeout(400);
   await page.screenshot({path:outputPath(`forest-${label}-mobile-plaza.jpg`),quality:90});
   await page.evaluate(()=>__valley.end());await page.waitForFunction(()=>!__valley.snapshot().transitioning);
   await page.setViewportSize({width:1440,height:1000});
   for(const id of ['fuji','forest']){
    assert.equal(await page.evaluate(id=>__sceneTheme.switch(id),id),true);
    await page.waitForFunction(id=>__sceneTheme.id===id&&!__sceneTheme.switching,id,{timeout:180000});
    assert.equal(await page.evaluate(()=>__sceneTheme.resourceSnapshot().worldRoots),1);
    await page.screenshot({path:outputPath(`forest-${label}-return-${id}.jpg`),quality:90});
   }
   const returned=await page.evaluate(()=>{let root=__river.root;while(root.parent)root=root.parent;const trees=[];root.traverse(o=>{if(/^(west|east|foothill)-\d+$/.test(o.userData.layoutId||''))trees.push({id:o.userData.layoutId,x:o.position.x,z:o.position.z});});return trees;});
   assert.equal(returned.length,24);for(const p of FOREST_TREES){const tree=returned.find(t=>t.id===p.id);assert.equal(tree.x,p.x);assert.equal(tree.z,p.z);}
   assert.deepEqual(errors,[]);reports.push({fallback,inventory,checks:['24 forest trees and 6 street trees','shared coordinates after rendering and batching','roots grounded','2 decorative rocks and no crystals or crystal downloads','two companions spawn and gather','nine building types visible in normal mode','desktop and mobile screenshots','no horizontal overflow','forest to Fuji and back restores all trees with one live world'],errors});
  }finally{await context.close();}
 }
 await fs.writeFile(outputPath('forest-browser.json'),JSON.stringify({createdAt:new Date().toISOString(),reports},null,2));
 console.log(JSON.stringify(reports.map(({fallback,checks,errors})=>({fallback,checks,errors})),null,2));
}finally{await browser.close();}
