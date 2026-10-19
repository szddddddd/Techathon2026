import assert from 'node:assert/strict';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const recordURL='assets/rodin/record-player/scene.glb';
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
const model=()=>{const scene=new T.Group();scene.add(new T.Mesh(new T.BoxGeometry(2,3,1),new T.MeshStandardMaterial()));return{scene};};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const originalLoad=GLTFLoader.prototype.loadAsync,originalFetch=globalThis.fetch,originalLocation=globalThis.location,originalWarn=console.warn;
const unhandled=[];
const onUnhandled=error=>unhandled.push(error);
process.on('unhandledRejection',onUnhandled);
let calls,record,held,failed;
function reset(){calls=[];record=deferred();held=new Map();failed=new Set();}
GLTFLoader.prototype.loadAsync=function(url){
 calls.push(url);
 if(url===recordURL)return record.promise;
 if(failed.has(url))return Promise.reject(new Error('Unavailable: '+url));
 return held.get(url)?.promise||Promise.resolve(model());
};
globalThis.fetch=async url=>{calls.push(url);if(failed.has(url))throw Error('Manifest unavailable');return{ok:true,json:async()=>({rotationY:.25})};};
globalThis.location={search:''};
console.warn=()=>{};
let moduleIndex=0;
const fresh=()=>import(`../src/scenes/shared/scene-assets.js?loading-test=${++moduleIndex}`);
try{
 reset();
 const api=await fresh(),fujiURL='assets/rodin-fuji/fuji/scene.glb',mountain=deferred();held.set(fujiURL,mountain);
 const forest=api.prepareSceneAssets('forest'),fuji=api.prepareSceneAssets('fuji');
 const downloads=calls.filter(url=>url.endsWith('.glb')).length;
 const sameForest=api.prepareSceneAssets('forest');
 assert.equal(calls.filter(url=>url.endsWith('.glb')).length,downloads,'Concurrent scene callers reuse the in-flight bundle');
 assert.equal(calls.filter(url=>url===recordURL).length,1,'Forest and Fuji share one record download');
 assert.ok(calls.includes('assets/rodin/bridge/scene.glb'),'Forest GLBs start while the record is pending');
 assert.ok(calls.includes(fujiURL),'Fuji GLBs start while the record is pending');
 assert.ok(calls.includes('assets/rodin-fuji/fuji/manifest.json'),'Manifest starts while its GLB is pending');
 let finished=false;forest.then(()=>{finished=true;});await tick();assert.equal(finished,false,'Complete record content remains mandatory');
 const recordGLTF=model();record.resolve(recordGLTF);mountain.resolve(model());
 const [forestAssets,fujiAssets]=await Promise.all([forest,fuji]);
 assert.equal(await sameForest,forestAssets);
 assert.equal(forestAssets.recordModel,recordGLTF.scene);assert.equal(fujiAssets.recordModel,recordGLTF.scene);
 assert.equal(Object.keys(fujiAssets.models).length,18,'Every Fuji source remains in the bundle');
 assert.deepEqual(fujiAssets.failures,[]);assert.deepEqual(fujiAssets.fallbacks,[]);
 assert.equal(fujiAssets.models.station.children[0].rotation.y,.25,'Manifest normalization remains applied');
 assert.ok(forestAssets.props.bridge&&forestAssets.props.tree&&forestAssets.valley.mountain_range);
 assert.equal(await api.prepareSceneAssets('fuji'),fujiAssets,'Completed scenes reuse their full bundle');

 reset();const fallbackAPI=await fresh();
 for(const path of ['sakura-yoshino-v3','sakura-reference-03','sakura-weeping-v3r1','railway-gate'])failed.add(`assets/rodin-fuji/${path}/scene.glb`);
 failed.add('assets/rodin-fuji/railway-track/manifest.json');
 const fallbackRequest=fallbackAPI.prepareSceneAssets('fuji');record.resolve(model());
 const fallbackAssets=await fallbackRequest;
 assert.deepEqual(fallbackAssets.failures,['gate']);
 assert.equal(fallbackAssets.models.sakura_a.userData.treeAsset,'sakura_a');
 assert.equal(fallbackAssets.models.sakura_b.userData.treeAsset,'sakura_b');
 assert.ok(fallbackAssets.models.track,'Optional manifest failure retains the model');
 assert.deepEqual(fallbackAssets.fallbacks.map(({key,used})=>[key,used]).sort(),[['sakura_a','sakura_a'],['sakura_b','sakura_b']]);

 reset();const treeAPI=await fresh();failed.add('assets/rodin/tree/scene.glb');
 const treeRequest=treeAPI.prepareSceneAssets('forest');record.resolve(model());const treeAssets=await treeRequest;
 assert.ok(treeAssets.props.bridge);assert.equal(treeAssets.props.tree,undefined,'Tree failure still permits procedural tree fallback');

 reset();const retryAPI=await fresh();failed.add('assets/rodin/bridge/scene.glb');
 const broken=retryAPI.prepareSceneAssets('forest');
 await assert.rejects(broken,/Unavailable/);
 record.reject(new Error('Record unavailable after another asset failed'));
 await tick();
 assert.deepEqual(retryAPI.assetCacheSnapshot().themes,[],'Failed scene does not poison the cache');
 failed.clear();record=deferred();
 const retry=retryAPI.prepareSceneAssets('forest');record.resolve(model());
 assert.ok((await retry).props.bridge);assert.equal(calls.filter(url=>url===recordURL).length,2,'Failed record is retried');
 assert.equal(calls.filter(url=>url==='assets/rodin/bridge/scene.glb').length,2,'Failed scenery is evicted and downloaded again');

 reset();const retainedAPI=await fresh(),pendingBridge=deferred(),bridgeURL='assets/rodin/bridge/scene.glb';held.set(bridgeURL,pendingBridge);
 const firstAttempt=retainedAPI.prepareSceneAssets('forest'),sceneryDownloads=calls.filter(url=>url!==recordURL).length;
 record.reject(new Error('First record failure'));await assert.rejects(firstAttempt,/First record failure/);
 assert.deepEqual(retainedAPI.assetCacheSnapshot().themes,[],'Record failure invalidates the complete scene cache');
 record=deferred();const secondAttempt=retainedAPI.prepareSceneAssets('forest');
 assert.equal(calls.filter(url=>url!==recordURL).length,sceneryDownloads,'Retry reuses scenery that is still loading');
 const bridgeGLTF=model();pendingBridge.resolve(bridgeGLTF);await tick();
 const sceneryResources=retainedAPI.assetCacheSnapshot().sharedResources;assert.ok(sceneryResources>0,'Completed scenery is retained while record retry is pending');
 record.reject(new Error('Second record failure'));await assert.rejects(secondAttempt,/Second record failure/);
 assert.deepEqual(retainedAPI.assetCacheSnapshot().themes,[]);
 record=deferred();const thirdAttempt=retainedAPI.prepareSceneAssets('forest');
 assert.equal(calls.filter(url=>url!==recordURL).length,sceneryDownloads,'Retry also reuses successfully prepared scenery');
 assert.equal(retainedAPI.assetCacheSnapshot().sharedResources,sceneryResources,'Record failures do not accumulate retained scenery');
 record.resolve(model());const recovered=await thirdAttempt;
 assert.equal(recovered.props.bridge.model,bridgeGLTF.scene,'Successful recovery adopts the original in-flight model');
 assert.equal(calls.filter(url=>url===recordURL).length,3,'Only failed record downloads are retried');

 reset();const recordFailureAPI=await fresh(),late=deferred();held.set('assets/rodin/bridge/scene.glb',late);
 const recordFailure=recordFailureAPI.prepareSceneAssets('forest');record.reject(new Error('Record failed first'));
 await assert.rejects(recordFailure,/Record failed first/);late.reject(new Error('Late bridge failure'));await tick();
 assert.deepEqual(unhandled,[],'Parallel failures always have rejection handlers');
 console.log('PASS: forest/Fuji GLBs and manifests overlap, full content and fallbacks remain intact, shared downloads and failure retries are safe.');
}finally{
 GLTFLoader.prototype.loadAsync=originalLoad;globalThis.fetch=originalFetch;console.warn=originalWarn;
 if(originalLocation===undefined)delete globalThis.location;else globalThis.location=originalLocation;
 process.removeListener('unhandledRejection',onUnhandled);
}
