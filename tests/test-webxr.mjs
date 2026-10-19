import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import {build} from 'esbuild';
import {chromium,baseURL,outputPath} from './test-runtime.mjs';

const bundled=await build({stdin:{contents:"export {createWebXR} from './src/platform/webxr.js'; export * as T from 'three';",resolveDir:process.cwd()},bundle:true,format:'esm',write:false});
const server=http.createServer((req,res)=>{
  res.setHeader('Content-Type',req.url==='/module.js'?'text/javascript':'text/html');
  res.end(req.url==='/module.js'?bundled.outputFiles[0].contents:'<!doctype html><body><script type="module">import {createWebXR,T} from "/module.js";window.testAPI={createWebXR,T};</script>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
try{
  await page.goto(`http://localhost:${server.address().port}/?vr=1`);await page.waitForFunction(()=>window.testAPI);
  const result=await page.evaluate(async()=>{
    const {createWebXR,T}=testAPI,assert=(value,label)=>{if(!value)throw Error(label);},checks=[];
    let mode='ok',requests=0,current,guard=false,headX=.15;
    const controllers=[new T.Group(),new T.Group()];
    const xr={enabled:false,getController:i=>controllers[i],setReferenceSpaceType(){},setFoveation(v){assert(v===0,'no foveation quality reduction');},
      async setSession(s){if(mode==='setup-fail')throw Error('setup failure');current=s;},
      updateCamera(camera){camera.position.set(headX,1.62,.07);camera.quaternion.setFromEuler(new T.Euler(.1,.2,0,'YXZ'));camera.updateMatrixWorld(true);}
    };
    Object.defineProperty(navigator,'xr',{configurable:true,value:{isSessionSupported:async()=>true,async requestSession(type,options){requests++;assert(type==='immersive-vr'&&options.requiredFeatures.includes('local-floor'),'explicit immersive floor session');if(mode==='denied')throw Error('permission denied');const s=new EventTarget();s.end=async()=>{s.dispatchEvent(new Event('end'));};return s;}}});
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,1.4,.1,500);camera.position.set(30,29,55);camera.lookAt(0,0,-5);
    const position=camera.position.clone(),quaternion=camera.quaternion.clone();
    const controls={enabled:true,enableDamping:true,autoRotate:false,target:new T.Vector3(0,0,-5)};
    const vr=createWebXR({renderer:{xr},scene,camera,controls,beforeEnter(){if(guard)throw Error('close panel first');}});await vr.ready;
    mode='denied';try{await vr.enter();throw Error('unexpected success');}catch(e){assert(e.message==='permission denied','permission rejection');}
    assert(controls.enabled&&!vr.active&&scene.children.length===0,'rejected session leaves scene unchanged');checks.push('permission denial leaves camera and scene intact');
    guard=true;const before=requests;try{await vr.enter();}catch{}assert(requests===before,'busy UI never requests session');guard=false;
    mode='setup-fail';try{await vr.enter();}catch(e){assert(e.message==='setup failure','setup failure');}
    assert(!vr.active&&controls.enabled&&scene.children.length===0&&camera.position.equals(position),'setup failure cleanup');checks.push('setup failure and UI guard');
    mode='ok';let geometryDisposals=0,materialDisposals=0,textureDisposals=0;
    for(let i=0;i<5;i++){
      const a=vr.enter(),b=vr.enter();assert(await b===false,'double entry coalesces');assert(await a,'entry succeeds');
      assert(vr.active&&!controls.enabled&&document.documentElement.dataset.xr==='presenting','active state');
      const rig=camera.parent;rig.traverse(o=>{o.geometry?.addEventListener('dispose',()=>geometryDisposals++);o.material?.addEventListener('dispose',()=>materialDisposals++);if(o.material?.map)o.material.map.addEventListener('dispose',()=>textureDisposals++);});
      vr.update();camera.getWorldPosition(new T.Vector3());assert(camera.getWorldPosition(new T.Vector3()).distanceTo(position)<1e-7,'recenter keeps entry eye position');
      headX=.25;vr.update();assert(Math.abs(camera.getWorldPosition(new T.Vector3()).distanceTo(position)-rig.scale.x*.1)<1e-7,'physical head motion maps to world scale');assert(vr.viewCamera.position.distanceTo(camera.getWorldPosition(new T.Vector3()))<1e-7,'sky and lighting receive world-space view');headX=.15;vr.update();
      const panel=rig.children.find(o=>o.name==='WeRoam VR controls'),controller=controllers[0];
      controller.position.set(0,0,0);controller.quaternion.identity();
      const aim=x=>{const point=panel.localToWorld(new T.Vector3((x/1024-.5)*1.5, (.5-210/320)*(1.5*320/1024),0));rig.worldToLocal(point);controller.quaternion.setFromUnitVectors(new T.Vector3(0,0,-1),point.normalize());controller.updateMatrixWorld(true);};
      const oldScale=rig.scale.x,eye=camera.getWorldPosition(new T.Vector3());aim(140);controller.dispatchEvent({type:'selectstart'});
      assert(rig.scale.x>oldScale,'ray selects shrink action');assert(camera.getWorldPosition(new T.Vector3()).distanceTo(eye)<1e-7,'zoom anchored to tracked head');
      controller.dispatchEvent({type:'squeezestart'});assert(!panel.visible,'squeeze hides panel');controller.dispatchEvent({type:'squeezestart'});assert(panel.visible,'squeeze restores panel');
      await current.end();assert(camera.parent===null&&camera.position.equals(position)&&camera.quaternion.angleTo(quaternion)<1e-7,'system exit restores camera');
      assert(controls.enabled&&scene.children.length===0&&!vr.snapshot().resources,'all transient resources removed');
      assert(!controller._listeners.selectstart.length&&!controller._listeners.squeezestart.length,'controller listeners removed');
    }
    assert(textureDisposals===5&&geometryDisposals===15&&materialDisposals===15,'every transient GPU resource disposed (shared rays observed twice)');
    checks.push('five sessions: independent head tracking, controller ray selection, anchored zoom, squeeze, system exit, exact camera restoration, resource disposal');
    const pending=vr.enter();vr.dispose();assert(await pending===false,'dispose while permission is pending');assert(scene.children.length===0&&!vr.active,'late session is ended');
    checks.push('dispose while authorization pending');
    Object.defineProperty(navigator,'xr',{configurable:true,value:undefined});
    const unavailable=createWebXR({renderer:{xr},scene,camera,controls});assert(await unavailable.ready===false,'capability fallback');try{await unavailable.enter();throw Error('unexpected entry');}catch(e){assert(e.message.includes('PICO'),'unsupported explanation');}unavailable.dispose();
    checks.push('unsupported browser fallback');return {checks,geometryDisposals,materialDisposals,textureDisposals};
  });
  checks.push(result);
  for(const scene of ['forest','fuji','ideal']){
    await page.goto(`${baseURL}/?scene=${scene}&vr=1`);await page.waitForFunction(()=>window.__sceneTheme?.ready&&window.__webXR,null,{timeout:180000});
    const before=await page.evaluate(()=>({frames:__renderPerformance.frames,resources:__sceneTheme.resourceSnapshot(),vr:__webXR.snapshot()}));
    await page.waitForTimeout(250);
    assert.ok(await page.evaluate(n=>__renderPerformance.frames>n,before.frames),'normal animation loop advances');
    assert.equal(before.resources.worldRoots,1);await page.locator('#webxr-entry').click();
    await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>__sceneTheme.resourceSnapshot().controls.enabled),true);
    if(scene==='fuji'){await page.screenshot({path:outputPath('pico-browser-desktop.jpg'),type:'jpeg',quality:85});await page.setViewportSize({width:393,height:852});await page.waitForTimeout(200);await page.screenshot({path:outputPath('pico-browser-mobile.jpg'),type:'jpeg',quality:85});await page.setViewportSize({width:1280,height:900});}
    checks.push({scene,...before});
  }
  assert.deepEqual(errors,[]);await fs.writeFile(outputPath('webxr.json'),JSON.stringify({checks,errors,hardwareVerified:false},null,2));console.log(JSON.stringify({checks,errors},null,2));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
