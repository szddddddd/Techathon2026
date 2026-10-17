import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {serveStatic} from '../server/static-files.mjs';
const root=path.resolve('.cache/android-web'),out=path.resolve('.test-results/android');
await fs.mkdir(out,{recursive:true});
const inventory=JSON.parse(await fs.readFile('.cache/android-assets.json','utf8'));
for(const f of inventory.files){
 assert.ok(!/(?:\.forest-avatar-data|hyper3d-config|\.env|node_modules|weroam-slides|desktop\/|server\/|\.blend$)/.test(f.path));
 assert.equal(createHash('sha256').update(await fs.readFile(path.join(root,f.path))).digest('hex'),f.sha256);
 if(f.path.startsWith('assets/'))assert.deepEqual(await fs.readFile(path.join(root,f.path)),await fs.readFile(f.path));
}
const server=http.createServer(async(req,res)=>{
 // The Android host also serves mobile/*, outside the desktop static allowlist.
 if(req.url.startsWith('/mobile/')){const file=req.url.split('?')[0];if(!['/mobile/android.css','/mobile/android-runtime.js'].includes(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',file.endsWith('.css')?'text/css':'text/javascript');res.end(await fs.readFile(path.join(root,file)));return;}
 await serveStatic(req,res,root);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const context=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],egress=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
await context.route('**/*',route=>{if(new URL(route.request().url()).origin===origin)return route.continue();egress.push(route.request().url());return route.abort();});
const ready=id=>page.waitForFunction(id=>window.__sceneTheme?.ready&&__sceneTheme.id===id&&!__sceneTheme.switching,id,{timeout:180000});
try{
 await page.goto(origin+'/?inbox=1');await ready('forest');
 await page.waitForFunction(()=>window.__socialUI?.inbox);
 assert.equal(await page.evaluate(()=>window.__WEROAM_ANDROID__),true);
 await page.evaluate(async()=>{await __socialStore.setDemoPaused(true);await __socialUI.inbox.gateway.loadDemo();});
 await page.locator('[data-inbox-thread="external:demo:qqmail:thread-1"]').tap();
 await page.waitForFunction(()=>__uiInteractions.state('inbox-thread')==='open');
 await page.locator('#inbox-thread [name=reply]').fill('手机上写下的草稿');
 assert.equal(await page.evaluate(()=>__weroamHandleBack()),true);
 await page.waitForFunction(()=>__uiInteractions.state('inbox-thread')==='closed');
 await page.locator('[data-inbox-thread="external:demo:qqmail:thread-1"]').tap();
 await page.waitForFunction(()=>__uiInteractions.state('inbox-thread')==='open');
 assert.equal(await page.locator('#inbox-thread textarea').inputValue(),'手机上写下的草稿');
 await page.screenshot({path:out+'/inbox.jpg',type:'jpeg',quality:87});
 await page.evaluate(()=>__weroamHandleBack());
 await page.waitForFunction(()=>__uiInteractions.state('inbox-thread')==='closed');
 if(await page.locator('#directory').isVisible())await page.evaluate(()=>__weroamHandleBack());
 for(const id of ['forest','fuji','ideal']){
  await page.evaluate(id=>__sceneTheme.switch(id),id);await ready(id);
  assert.equal(await page.locator('#viewport').getAttribute('data-loaded'),'true');
  await page.screenshot({path:out+`/${id}.jpg`,type:'jpeg',quality:87});
 }
 await page.locator('#dock-reveal').tap();await page.locator('.social-dock [data-action=directory]').tap();
 await page.waitForFunction(()=>__uiInteractions.state('directory')==='open');
 await page.locator('[data-conversation-tab=contacts]').tap();await page.locator('#directory .contacts-add').tap();
 await page.waitForFunction(()=>__uiInteractions.state('inbox-contact')==='open');
 assert.match(await page.locator('#inbox-contact .inbox-caption').textContent(),/暂未接入/);
 await page.locator('#inbox-contact [name=name]').fill('手机测试好友');await page.locator('#inbox-contact [name=account]').fill('mobile-demo');
 await page.locator('#inbox-contact [name=avatar]').setInputFiles('assets/rodin-friends/rabbit/portrait.webp');await page.locator('.inbox-contact-photo img').waitFor();
 await page.locator('#inbox-contact [type=submit]').tap();await page.waitForFunction(()=>__uiInteractions.state('inbox-contact')==='closed');
 assert.ok(await page.evaluate(()=>Object.values(__socialStore.state.customFriends).some(f=>f.name==='手机测试好友')));
 await page.setViewportSize({width:393,height:400});
 assert.ok(await page.locator('#directory').evaluate(e=>{const r=e.getBoundingClientRect();return r.y>=0&&r.bottom<=innerHeight+1;}));
 await page.setViewportSize({width:852,height:393});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.setViewportSize({width:393,height:852});await page.reload();await ready('ideal');
 assert.ok(await page.evaluate(()=>Object.values(__socialStore.state.customFriends).some(f=>f.name==='手机测试好友')));
 assert.deepEqual(errors,[]);assert.deepEqual(egress,[]);assert.deepEqual(missing,[]);
 await fs.writeFile(out+'/results.json',JSON.stringify({ok:true,assets:inventory.files.length,bytes:inventory.bytes,scenes:3,errors,egress,missing,evidence:'Packaged assets in a touch browser, not an Android device acceptance test.'},null,2));
 console.log('PASS: byte-identical assets, offline three scenes, touch inbox, back/draft, avatar upload without network, rotation/keyboard viewport and persistence');
}finally{await context.close();await browser.close();await new Promise(r=>server.close(r));}
