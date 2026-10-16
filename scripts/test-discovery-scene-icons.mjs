import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const out='validation/hyper3d';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
const stage=s=>page.waitForFunction(s=>__discoveryBoards.stage===s,s);
try{
 await page.goto(baseURL);await page.waitForFunction(()=>document.querySelector('#viewport').dataset.loaded==='true',null,{timeout:180000});
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialStore.addFriend('tuantuan');await __socialStore.setFriendPinned('tuantuan',true);});
 await page.evaluate(()=>__discoveryScene.previewsReady);
 const icons=page.locator('.scene-content-icon');assert.equal(await icons.count(),2);
 for(const b of await icons.all()){assert.ok(await b.isVisible());const r=await b.boundingBox();assert.ok(r.width>=44&&r.height>=44);}
 assert.match(await page.locator('[data-scene-content=accounts]').innerText(),/Hyper3D/);
 assert.equal(await page.evaluate(()=>__discoveryScene.preview('accounts').contentId),'hyper3d-rodin-workflow');
 await page.screenshot({path:out+'/scene-icons.jpg',quality:90});checks.push('two visible accessible scene icons and matching Hyper3D board preview');
 await page.getByRole('button',{name:'打开场景公众号',exact:true}).click();await stage('browsing');
 assert.equal(await page.locator('.scene-content-icon:visible').count(),0);
 assert.deepEqual(await page.evaluate(()=>__socialStore.state.discovery.accountFollows),['hyper3d']);
 assert.equal(await page.locator('.d-content-card').count(),3);assert.equal(await page.locator('.d-account-row').count(),1);
 for(const c of await page.locator('.d-content-card').all())assert.match(await c.innerText(),/Hyper3D/);
 await page.screenshot({path:out+'/subscriptions.jpg',quality:90});
 await page.locator('.d-content-card[data-id=hyper3d-rodin-workflow]').click();
 assert.equal(await page.locator('.d-source-note a').getAttribute('href'),'https://docs.hyper3d.ai/en/get-started/features');
 assert.match(await page.locator('.d-reading-author').innerText(),/官方资料摘编/);
 await page.screenshot({path:out+'/article.jpg',quality:90});checks.push('only Hyper3D subscription, three sourced articles and official original links');
 await page.keyboard.press('Escape');await stage('closed');await page.locator('#discovery-scene-icons').waitFor({state:'visible'});
 await page.getByRole('button',{name:'打开场景视频号',exact:true}).focus();await page.keyboard.press('Enter');await stage('browsing');
 await page.waitForFunction(()=>__contentPlayer.video.readyState>=3&&!__contentPlayer.video.paused);await page.screenshot({path:out+'/video.jpg',quality:90});
 await page.keyboard.press('Escape');await stage('closed');assert.equal(await page.locator(':focus').getAttribute('data-scene-content'),'scene-video');checks.push('icons enter existing scene transition; keyboard video entry and focus return work');
 // Migration replaces old subscription choices once, without losing collected archive content.
 await page.evaluate(async()=>{const req=indexedDB.open('forest-letters-social-v1',1);const db=await new Promise(r=>req.onsuccess=()=>r(req.result));await new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite'),s=tx.objectStore('state');s.get('main').onsuccess=e=>{const v=e.target.result;v.discovery.accountFollows=['valley','roam'];delete v.discovery.accountFeedVersion;v.discovery.collections=['article:article-1'];s.put(v,'main');};tx.oncomplete=resolve;tx.onerror=reject;});db.close();});
 await page.reload();await page.waitForFunction(()=>window.__discoveryUI,null,{timeout:180000});
 assert.deepEqual(await page.evaluate(()=>__socialStore.state.discovery.accountFollows),['hyper3d']);assert.ok(await page.evaluate(()=>__socialStore.state.discovery.collections.includes('article:article-1')));
 assert.ok(await page.evaluate(()=>__socialStore.state.pinnedFriends.includes('tuantuan')));checks.push('migration selects only Hyper3D, preserving archive collections and pinned Tuantuan');
 await page.setViewportSize({width:391,height:844});await page.waitForTimeout(300);
 for(const b of await icons.all()){const r=await b.boundingBox();assert.ok(r&&r.x>=0&&r.x+r.width<=391&&r.height>=44);}
 await page.screenshot({path:out+'/mobile-icons.jpg',quality:90});await page.getByRole('button',{name:'打开场景公众号',exact:true}).click();await stage('browsing');
 await page.screenshot({path:out+'/mobile-subscriptions.jpg',quality:90});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 checks.push('mobile icons keep safe bounds and 44px targets; Hyper3D feed fits');assert.deepEqual(errors,[]);
 await fs.writeFile(out+'/results.json',JSON.stringify({checks,errors},null,2));console.log({checks,errors});
}catch(e){await page.screenshot({path:out+'/failure.jpg'});throw e;}finally{await browser.close();}
