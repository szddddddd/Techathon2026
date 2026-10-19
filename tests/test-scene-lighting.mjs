import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,baseURL} from './test-runtime.mjs';
await fs.mkdir('.test-results/scene-fixes',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGL|THREE/.test(m.text()))errors.push(m.text());});
for(const theme of ['forest','fuji','ideal']){await page.goto(baseURL+'/?scene='+theme);await page.waitForFunction(()=>window.__sceneTheme?.ready,null,{timeout:180000});
for(const mode of ['day','night']){await page.evaluate(m=>__dayNight.setMode(m),mode);await page.waitForTimeout(500);
if(theme==='forest')assert.equal(await page.evaluate(()=>{let n=0;__recordPlayer.root.parent.traverse(o=>{if(o.name==='Meadow color patch')n++;});return n;}),0);
if(theme==='fuji'){const light=await page.evaluate(()=>{const o=__recordPlayer.root.parent.getObjectByName('Night locomotive headlight');return {visible:o.visible,intensity:o.children.find(c=>c.isSpotLight).intensity,shadows:o.children.find(c=>c.isSpotLight).castShadow};});assert.equal(light.intensity,mode==='day'?0:32);assert.equal(light.visible,mode==='night');assert.equal(light.shadows,true);}
await page.screenshot({path:`.test-results/scene-fixes/${theme}-${mode}.png`});}
console.log('PASS '+theme+' day/night rendering without shader errors');}assert.deepEqual(errors,[]);}finally{await browser.close();}
