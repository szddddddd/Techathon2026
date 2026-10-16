import {FUJI_VISUALS} from '../src/fuji-visuals.js';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
const out=process.env.FUJI_VALIDATION_DIR||'validation/dusk-sakura';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']}),errors=[];
const url=new URL(baseURL);url.searchParams.set('scene','fuji');
const ready=page=>page.waitForFunction(()=>window.__sceneTheme?.ready&&!__sceneTheme.switching,null,{timeout:180000});
const observe=page=>{page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/THREE|shader|WebGLProgram/.test(m.text()))errors.push(m.text());});};
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();observe(page);await page.goto(url.href);await ready(page);await page.evaluate(()=>__socialStore.setDemoPaused(true));
 const initial=await page.evaluate(()=>({audit:__sceneTheme.audit,scene:__sceneTheme.snapshot(),resources:__sceneTheme.resourceSnapshot()}));
 assert.equal(initial.audit.environment.exposure,1.28);assert.equal(initial.scene.trees.length,22);assert.deepEqual([...new Set(initial.scene.trees.map(t=>t.asset))].sort(),Object.values(FUJI_VISUALS.treeAssets).sort());assert.deepEqual(initial.audit.assetFallbacks,[]);
 const clock=initial.scene.petals.clock;await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>__sceneTheme.snapshot().petals.clock),clock);
 const visits=[];for(const id of['forest','fuji','forest','fuji']){await page.evaluate(id=>__sceneTheme.switch(id),id);await ready(page);await page.waitForFunction(()=>__groupBuildings.assets.loading.length===0);await page.waitForTimeout(250);const state=await page.evaluate(()=>({id:__sceneTheme.id,audit:__sceneTheme.audit,resources:__sceneTheme.resourceSnapshot()}));visits.push(state);assert.equal(state.resources.worldRoots,1);if(id==='forest')assert.deepEqual(state.audit.environment,{exposure:1.42,hemi:2.2,sun:3.7,rim:1.2,fill:.8});else assert.equal(state.audit.environment.exposure,1.28);}
 await fs.writeFile(out+'/switch-resources.json',JSON.stringify(visits.map(v=>({id:v.id,...v.resources})),null,2));console.log('Switch resources',JSON.stringify(visits.map(v=>({id:v.id,textures:v.resources.textures,geometries:v.resources.geometries}))));
 assert.ok(visits[3].resources.textures<=visits[1].resources.textures+1);assert.ok(visits[3].resources.geometries<=visits[1].resources.geometries+2);await context.close();
 const fallbackContext=await browser.newContext({viewport:{width:1200,height:850},reducedMotion:'reduce'}),fallback=await fallbackContext.newPage();observe(fallback);
 for(const id of Object.values(FUJI_VISUALS.treeAssets))await fallback.route('**/assets/rodin-fuji/'+id+'/scene.glb',route=>route.abort());
 await fallback.goto(url.href);await ready(fallback);await fallback.evaluate(()=>__socialStore.setDemoPaused(true));const fallbackState=await fallback.evaluate(()=>({audit:__sceneTheme.audit,scene:__sceneTheme.snapshot()}));assert.equal(fallbackState.audit.assetFallbacks.length,Object.keys(FUJI_VISUALS.treeAssets).length);assert.deepEqual([...new Set(fallbackState.scene.trees.map(t=>t.asset))].sort(),[...new Set(FUJI_VISUALS.treeFallbacks)].sort());assert.equal(fallbackState.scene.sakuraTrees,22);await fallback.screenshot({path:out+'/legacy-tree-fallback.png'});await fallbackContext.close();
 assert.deepEqual(errors,[]);const report={checks:['two curated references replace 13 former weeping trees; 9 spreading trees retain their previous model','reduced-motion petals frozen','forest lighting restored exactly','repeat Fuji entry does not accumulate textures/geometries','failed curated tree assets fall back to the previous tree styles'],initial,visits,fallback:fallbackState,errors};await fs.writeFile(out+'/visual-regression.json',JSON.stringify(report,null,2));console.log(JSON.stringify({checks:report.checks,errors}));
}finally{await browser.close();}
