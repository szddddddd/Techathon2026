import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as THREE from 'three';
import {loadGeometryGLB} from './glb-geometry.mjs';
import {placeRodinProps} from '../src/rodin-props.js';
import {buildTerrain,riverCenter} from '../src/terrain.js';
import {PLACEMENTS} from '../src/layout.js';

// node scripts/audit-bridge.mjs [--out validation/bridge-audit.json]
// Abutments entering the banks are deliberate. This audit checks channel clearance
// and whether the rising deck meets each bank, rather than rejecting that contact.
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),args=process.argv.slice(2);
const p=PLACEMENTS.find(p=>p.kind==='bridge'&&p.enabled!==false);if(!p)throw new Error('No bridge placement.');
const asset=await loadGeometryGLB(path.resolve(base,p.assetPath||'assets/rodin/bridge/scene.glb'));
const scene=new THREE.Scene(),terrain=buildTerrain(scene,{rodinBridge:true});
const root=placeRodinProps(scene,{bridge:asset}),bridge=root.children.find(o=>o.userData.layoutId===p.id);
if(!bridge)throw new Error('Browser placement builder did not create the bridge.');
scene.updateMatrixWorld(true);
const bounds=new THREE.Box3().setFromObject(bridge,true),meshes=[],meadows=[],ramps=[];
bridge.traverse(o=>{if(o.isMesh)meshes.push(o);});terrain.root.traverse(o=>{if(o.isMesh&&o.name.endsWith(' meadow'))meadows.push(o);if(o.isMesh&&o.userData.walkableBridgeTransition)ramps.push(o);});
const round=x=>+x.toFixed(5),vec=v=>v.toArray().map(round),ray=new THREE.Raycaster();
const z0=bounds.min.z-.15,z1=bounds.max.z+.15;
function channelPass(y,xOffset,direction){
  const intersections=[],steps=120;
  for(let i=0;i<steps;i++){
    const a=direction===1?i/steps:1-i/steps,b=direction===1?(i+1)/steps:1-(i+1)/steps;
    const za=THREE.MathUtils.lerp(z0,z1,a),zb=THREE.MathUtils.lerp(z0,z1,b);
    const start=new THREE.Vector3(riverCenter(za)+xOffset,y,za),end=new THREE.Vector3(riverCenter(zb)+xOffset,y,zb),delta=end.clone().sub(start);
    ray.set(start,delta.clone().normalize());ray.near=0;ray.far=delta.length()+1e-6;
    for(const hit of ray.intersectObjects([...meshes,...ramps],false))intersections.push(vec(hit.point));
  }
  return {y,xOffset,direction:direction===1?'upstream to downstream':'downstream to upstream',segments:steps,clear:intersections.length===0,intersectionCount:intersections.length,examples:intersections.slice(0,6)};
}
// Five x samples span the requested 1.2 m channel; all follow the actual river bend.
const channelChecks=[];for(const y of [.3,.7,1.2])for(const xOffset of [-.6,-.3,0,.3,.6])for(const direction of [1,-1])channelChecks.push(channelPass(y,xOffset,direction));
const overheadDiagnostics=[1.6,2].map(y=>channelPass(y,0,1));
const deckSamples=[],groundY=2.22,x0=bounds.min.x-.2,x1=bounds.max.x+.2,steps=Math.ceil((x1-x0)/.02),down=new THREE.Vector3(0,-1,0);
for(let i=0;i<=steps;i++){
  const x=THREE.MathUtils.lerp(x0,x1,i/steps);ray.set(new THREE.Vector3(x,bounds.max.y+1,p.z),down);ray.far=20;
  const deck=ray.intersectObjects(meshes,false)[0];const bank=ray.intersectObjects(meadows,false)[0],ramp=ray.intersectObjects(ramps,false)[0];
  deckSamples.push({x,deckY:deck?.point.y??null,bankY:bank?.point.y??null,rampY:ramp?.point.y??null,walkingY:Math.max(deck?.point.y??-Infinity,bank?.point.y??-Infinity,ramp?.point.y??-Infinity)});
}
const crossings=[];
for(let i=1;i<deckSamples.length;i++){
  const a=deckSamples[i-1],b=deckSamples[i];if(a.deckY===null||b.deckY===null)continue;
  if((a.deckY-groundY)*(b.deckY-groundY)>0)continue;
  const t=(groundY-a.deckY)/(b.deckY-a.deckY),x=THREE.MathUtils.lerp(a.x,b.x,Number.isFinite(t)?t:0);
  ray.set(new THREE.Vector3(x,groundY+1,p.z),down);ray.far=3;const support=ray.intersectObjects(meadows,false)[0];
  const side=x<riverCenter(p.z)?'west':'east';crossings.push({side,x:round(x),y:groundY,z:p.z,onBank:!!support&&Math.abs(support.point.y-groundY)<.01});
}
const supportedCrossings=crossings.filter(c=>c.onBank),west=supportedCrossings.find(c=>c.side==='west'),east=supportedCrossings.findLast(c=>c.side==='east');
const route=west&&east?deckSamples.filter(s=>s.x>=west.x-.15&&s.x<=east.x+.15):deckSamples;
const missingSurface=route.filter(s=>!Number.isFinite(s.walkingY)).map(s=>round(s.x));
let maxAdjacentStep=0;for(let i=1;i<route.length;i++)if(Number.isFinite(route[i].walkingY)&&Number.isFinite(route[i-1].walkingY))maxAdjacentStep=Math.max(maxAdjacentStep,Math.abs(route[i].walkingY-route[i-1].walkingY));
const deckContinuous=!!west&&!!east&&!missingSurface.length&&maxAdjacentStep<.15;
const channelClear=channelChecks.every(c=>c.clear),passed=channelClear&&deckContinuous;
const report={generatedAt:new Date().toISOString(),passed,placement:p,bounds:{min:vec(bounds.min),max:vec(bounds.max)},intentionalContact:'Bridge feet embedded in the bank are intentional abutment contact; overlap with bank volume is not a failure.',transitions:ramps.map(r=>({name:r.name,dimensions:r.userData.dimensions,bounds:{min:vec(new THREE.Box3().setFromObject(r,true).min),max:vec(new THREE.Box3().setFromObject(r,true).max)}})),channel:{method:'Exact bridge and transition triangle raycasts along 120 segments following riverCenter(z), each direction, at five lateral offsets and three requested heights. Finite samples do not certify untested coordinates.',zRange:[round(z0),round(z1)],forwardClear:channelChecks.filter(c=>c.direction==='upstream to downstream').every(c=>c.clear),reverseClear:channelChecks.filter(c=>c.direction==='downstream to upstream').every(c=>c.clear),checks:channelChecks,overheadDiagnostics},deck:{method:'Topmost bridge and meadow triangle raycast along x at bridge center z, spacing <= 0.02 m. A supported deck crossing of bank height 2.22 must exist at both banks; bank, deck and explicitly named transition union must have no gaps or sampled step over 0.15 m.',bankHeight:groundY,sampleCount:deckSamples.length,crossings,westContact:west??null,eastContact:east??null,missingSurfaceX:missingSurface,maxAdjacentHeightChange:round(maxAdjacentStep),westToEastContinuous:deckContinuous,eastToWestContinuous:deckContinuous,centerline:deckSamples.map(s=>({x:round(s.x),deckY:s.deckY===null?null:round(s.deckY),bankY:s.bankY===null?null:round(s.bankY),rampY:s.rampY===null?null:round(s.rampY),walkingY:Number.isFinite(s.walkingY)?round(s.walkingY):null}))}};
const outIndex=args.indexOf('--out');if(outIndex>=0){const dest=path.resolve(base,args[outIndex+1]);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed,channelForwardClear:report.channel.forwardClear,channelReverseClear:report.channel.reverseClear,failedChannelChecks:channelChecks.filter(c=>!c.clear),deckCrossings:crossings,deckWestToEastContinuous:deckContinuous,deckEastToWestContinuous:deckContinuous,maxAdjacentHeightChange:report.deck.maxAdjacentHeightChange,missingSurfaceX:missingSurface,overheadDiagnostics},null,2));
if(!passed)process.exitCode=1;
