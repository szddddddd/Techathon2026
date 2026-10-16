import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath,pathToFileURL } from 'node:url';
import * as THREE from 'three';
import {loadGeometryGLB,worldVertices} from './glb-geometry.mjs';
import {buildTerrain} from '../src/terrain.js';
import {buildArchitecture} from '../src/architecture.js';
import {buildNature} from '../src/nature.js';
import {placeRodinProps} from '../src/rodin-props.js';

// Run: node scripts/audit-layout.mjs [--out report.json] [--placements] [--strict]
// --placements is retained as a compatibility alias; all modes use the browser builder.
// Box3 overlap is a conservative collision candidate, never proof of triangle penetration.
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),argv=process.argv.slice(2);
const flag=name=>argv.includes(name),option=name=>{const i=argv.indexOf(name);return i<0?null:argv[i+1];};
let placements=null,walkways=[];
try{const layout=await import(pathToFileURL(path.join(base,'src/layout.js')).href);placements=layout.PLACEMENTS;walkways=layout.WALKWAYS||[];}catch(error){if(error.code!=='ERR_MODULE_NOT_FOUND')throw error;}
if(flag('--placements')&&!Array.isArray(placements))throw new Error('--placements requires src/layout.js exporting PLACEMENTS.');
const names=placements?[...new Set(placements.filter(p=>p.enabled!==false).map(p=>p.kind))]:['cart','tree','rock','grass'];
const assets={},missing=[];
for(const kind of names){const specified=placements?.find(p=>p.kind===kind&&p.assetPath)?.assetPath;const filename=path.resolve(base,specified||`assets/rodin/${kind}/scene.glb`);try{assets[kind]=await loadGeometryGLB(filename);}catch(error){if(error.code==='ENOENT')missing.push({kind,file:filename});else throw error;}}
const scene=new THREE.Scene();const terrain=buildTerrain(scene,{rodinBridge:!!assets.bridge});
// Match main.js ordering: reservations must exist before authored flora are scattered.
const propRoot=placeRodinProps(scene,assets);
const architecture=buildArchitecture(scene,{rodin:true,expanded:!!assets.cottage});buildNature(scene,{rodin:true,expanded:!!assets.cottage});
scene.updateMatrixWorld(true);
const vector=v=>v.toArray().map(n=>+n.toFixed(4));const boxJSON=b=>({min:vector(b.min),max:vector(b.max),size:vector(b.getSize(new THREE.Vector3()))});
const entries=[];let sourceIndex=0;const rayMaterial=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
function entry(object,id,kind,source){
  const points=worldVertices(object);if(!points.length)return;
  const bounds=new THREE.Box3().setFromPoints(points),height=bounds.max.y-bounds.min.y;
  const meshBoxes=[],rayMeshes=[];object.traverse(m=>{if(m.isMesh){meshBoxes.push(new THREE.Box3().setFromObject(m,true));const copy=new THREE.Mesh(m.geometry,rayMaterial);copy.matrixWorld.copy(m.matrixWorld);copy.matrixAutoUpdate=false;rayMeshes.push(copy);}});
  const layers=[];
  if(kind==='tree'){
    // Detect the transition from a narrow lower bole to the wide crown from actual slices.
    // The current Rodin tree has foliage already at 30% height, not at 50%.
    const slices=Array.from({length:20},(_,i)=>new THREE.Box3().setFromPoints(points.filter(v=>v.y>=bounds.min.y+height*i/20&&v.y<bounds.min.y+height*(i+1)/20)));
    const widths=slices.map(b=>{const s=b.getSize(new THREE.Vector3());return Math.hypot(s.x,s.z);});
    const boleWidth=Math.min(...widths.slice(2,6).filter(w=>w>0));
    let crownStart=.50;for(let i=5;i<16;i++)if(widths[i]>boleWidth*2.4){crownStart=i/20;break;}
    const limits=[bounds.min.y,bounds.min.y+Math.min(.65,height*.09),bounds.min.y+height*crownStart,bounds.max.y+.001];
    for(let i=0;i<3;i++){const selected=points.filter(v=>v.y>=limits[i]&&v.y<=limits[i+1]);const box=new THREE.Box3().setFromPoints(selected);if(!box.isEmpty())layers.push({name:['roots','trunk','canopy'][i],box});}
  }
  entries.push({id,kind,source,object,points,bounds,layers,meshBoxes,rayMeshes});
}
if(propRoot){
  const inventory=propRoot.userData.inventory||[];
  propRoot.children.forEach((object,i)=>{const p=placements?.find(p=>p.id===(object.userData.layoutId||object.name))||inventory[i]||placements?.[i]||{};const kind=object.userData.kind||p.kind||object.name.match(/Rodin (\w+)/)?.[1]||'prop';entry(object,p.id||object.userData.layoutId||`${kind}-${i+1}`,kind,'rodin');});
}
for(const object of architecture.root.children){if(!object.isGroup)continue;const name=object.name;const kind=/cottage/i.test(name)?'cottage':/tent/i.test(name)?'tent':/campfire/i.test(name)?'campfire':/stump/i.test(name)?'stool':/barrel/i.test(name)?'barrel':/crate/i.test(name)?'crate':/chest/i.test(name)?'chest':/cart/i.test(name)?'cart':'architecture';entry(object,`native-${kind}-${++sourceIndex}`,kind,'authored');}
scene.traverse(object=>{if(object.name==='Stone bridge · complete arch vault')entry(object,'bridge','bridge','authored');if(object.name==='Layered moss and ivy escarpment')entry(object,'escarpment','cliff','authored');if(object.name==='Luminous blue crystal growth')entry(object,`crystal-${++sourceIndex}`,'crystal','authored');});

const collisions=[],canopyOverlaps=[],floraCollisions=[];
const isFlora=e=>['grass','fern_large'].includes(e.kind);
function overlap(a,b){if(!a.intersectsBox(b))return null;const box=a.clone().intersect(b),size=box.getSize(new THREE.Vector3());return Math.min(size.x,size.y,size.z)>.035?{box,size}:null;}
function sampledInteriorOverlap(a,b,box){
  const cast=new THREE.Raycaster(),union=a.bounds.clone().union(b.bounds),hits=[];let tested=0,oddSurfaceCounts=0;
  const axes=['x','y','z'];
  for(const axis of axes){const others=axes.filter(v=>v!==axis),direction=new THREE.Vector3();direction[axis]=1;
    for(let i=0;i<4;i++)for(let j=0;j<4;j++){
      const origin=box.getCenter(new THREE.Vector3());origin[axis]=union.min[axis]-.1;
      origin[others[0]]=THREE.MathUtils.lerp(box.min[others[0]],box.max[others[0]],(i+.5)/4);
      origin[others[1]]=THREE.MathUtils.lerp(box.min[others[1]],box.max[others[1]],(j+.5)/4);
      cast.set(origin,direction);cast.far=union.max[axis]-origin[axis]+.1;tested++;
      const intervals=e=>{const coordinates=cast.intersectObjects(e.rayMeshes,false).map(hit=>hit.point[axis]);const unique=coordinates.filter((v,k)=>!k||Math.abs(v-coordinates[k-1])>1e-5);if(unique.length%2)oddSurfaceCounts++;const result=[];for(let k=0;k+1<unique.length;k+=2)result.push([Math.max(unique[k],box.min[axis]),Math.min(unique[k+1],box.max[axis])]);return result;};
      const aa=intervals(a),bb=intervals(b);
      for(const x of aa)for(const y of bb){const lo=Math.max(x[0],y[0]),hi=Math.min(x[1],y[1]);if(hi-lo>.015){const point=origin.clone();point[axis]=(lo+hi)/2;hits.push({axis,point:vector(point),depth:+(hi-lo).toFixed(4)});}}
    }
  }
  return {testedRays:tested,overlapSamples:hits.length,examples:hits.slice(0,5),oddSurfaceCounts,interpretation:hits.length?'Sampled closed-surface interiors overlap':'No sampled interior overlap; unsampled intersections remain possible'};
}
for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
  const a=entries[i],b=entries[j];if(isFlora(a)&&isFlora(b))continue;
  if(!overlap(a.bounds,b.bounds))continue;
  const aa=a.layers.length?a.layers:[{name:'solid',box:a.bounds}],bb=b.layers.length?b.layers:[{name:'solid',box:b.bounds}];
  for(const x of aa)for(const y of bb){let o=overlap(x.box,y.box);if(!o)continue;const canopy=x.name==='canopy'||y.name==='canopy',flora=isFlora(a)||isFlora(b);
    // Soil contact is intentional, foliage intersecting rocks/buildings above soil is not.
    if(flora){const clipped=o.box.clone();clipped.min.y=Math.max(clipped.min.y,2.34);o=overlap(clipped,o.box);if(!o)continue;}
    if(!canopy){
      // Refine authored multipart objects: empty volume between a porch and roof is not solid.
      const aParts=a.source==='authored'?a.meshBoxes:[x.box],bParts=b.source==='authored'?b.meshBoxes:[y.box];
      if(!aParts.some(ab=>bParts.some(bc=>overlap(ab,bc))))continue;
    }
    const event={a:a.id,b:b.id,layers:[x.name,y.name],overlap:vector(o.size),box:boxJSON(o.box),status:canopy?'canopy overlap only':flora?'foliage-solid collision candidate':'AABB collision candidate'};
    if(canopy||flora){event.meshSampling=sampledInteriorOverlap(a,b,o.box);event.requiresAdjustment=event.meshSampling.overlapSamples>0&&!(a.kind==='tree'&&b.kind==='tree');}
    (canopy?canopyOverlaps:flora?floraCollisions:collisions).push(event);
  }
}
// Ground support is checked against the real meadow triangle meshes, not just an x/z rectangle.
const supportMeshes=[];terrain.root.traverse(o=>{if(o.isMesh&&(o.name.endsWith(' meadow')||o.name==='Deck paving slab'))supportMeshes.push(o);});
function convexHull(points){
  const unique=[...new Map(points.map(p=>[`${p.x.toFixed(4)},${p.z.toFixed(4)}`,p])).values()].sort((a,b)=>a.x-b.x||a.z-b.z);
  if(unique.length<3)return unique;const cross=(o,a,b)=>(a.x-o.x)*(b.z-o.z)-(a.z-o.z)*(b.x-o.x),lower=[],upper=[];
  for(const p of unique){while(lower.length>1&&cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();lower.push(p);}for(const p of unique.toReversed()){while(upper.length>1&&cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();upper.push(p);}lower.pop();upper.pop();return [...lower,...upper];
}
const ground=[],ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
for(const e of entries){if(['bridge','cliff','grass','fern_large'].includes(e.kind))continue;
  const size=e.bounds.getSize(new THREE.Vector3()),threshold=e.bounds.min.y+Math.max(.10,Math.min(.30,size.y*.08));
  const bottom=e.points.filter(p=>p.y<=threshold),hull=convexHull(bottom),samples=[...hull];
  for(let i=0;i<hull.length;i++)samples.push(hull[i].clone().add(hull[(i+1)%hull.length]).multiplyScalar(.5));
  if(hull.length)samples.push(hull.reduce((sum,p)=>sum.add(p),new THREE.Vector3()).multiplyScalar(1/hull.length));
  const unsupported=[];let maxGap=-Infinity,minGap=Infinity;
  for(const p of samples){ray.set(new THREE.Vector3(p.x,e.bounds.min.y+1,p.z),down);const hit=ray.intersectObjects(supportMeshes,false)[0];if(!hit){unsupported.push([+p.x.toFixed(3),+p.z.toFixed(3)]);continue;}const gap=e.bounds.min.y-hit.point.y;maxGap=Math.max(maxGap,gap);minGap=Math.min(minGap,gap);}
  const naturalEmbed=e.source==='authored'&&['crystal','rock'].includes(e.kind)&&minGap>=-size.y*.35;
  ground.push({id:e.id,samples:samples.length,unsupported:unsupported.length,unsupportedPoints:unsupported.slice(0,12),bottomGap:Number.isFinite(maxGap)?+maxGap.toFixed(4):null,penetration:Number.isFinite(minGap)?+minGap.toFixed(4):null,intentionalNaturalEmbed:naturalEmbed&&minGap<-.18,status:unsupported.length?'footprint extends off support':maxGap>.12?'floating':minGap<-.18&&!naturalEmbed?'deeply buried':'supported'});
}
// Test the declared walking corridors as pedestrian volumes, not center-point distances.
// Mesh vertices inside the corridor are direct surface evidence. A vertical ray grid also
// detects broad surfaces whose vertices all happen to lie outside a narrow corridor.
const walkwayChecks=[];
for(const walkway of walkways){
  const dx=walkway.x1-walkway.x0,dz=walkway.z1-walkway.z0,length=Math.hypot(dx,dz),half=walkway.width/2;
  const corridor=new THREE.Box3(new THREE.Vector3(Math.min(walkway.x0,walkway.x1)-half,2.30,Math.min(walkway.z0,walkway.z1)-half),new THREE.Vector3(Math.max(walkway.x0,walkway.x1)+half,4.22,Math.max(walkway.z0,walkway.z1)+half));
  const owner=walkway.owner||(/cottage.*entrance/.test(walkway.id)?'cottage':/tent.*entrance/.test(walkway.id)?'tent':null);
  function within(point,e){
    if(point.y<corridor.min.y||point.y>corridor.max.y)return false;
    const raw=((point.x-walkway.x0)*dx+(point.z-walkway.z0)*dz)/(length*length),t=Math.max(0,Math.min(1,raw));
    if(e.id===owner&&raw*length<=.5)return false; // Only the owner's first 0.5 m porch/threshold may touch.
    return Math.hypot(point.x-walkway.x0-t*dx,point.z-walkway.z0-t*dz)<half-.025;
  }
  const obstructions=[];
  for(const e of entries){
    if(e.kind==='bridge'||!overlap(e.bounds,corridor))continue;
    const examples=[];let evidence='mesh vertices inside pedestrian corridor',samples=0;
    for(const point of e.points){if(within(point,e)){samples++;if(examples.length<5)examples.push(vector(point));}}
    if(!samples){
      evidence='vertical mesh ray intersects pedestrian corridor';const cast=new THREE.Raycaster(),steps=Math.ceil(length/.20);
      for(let i=0;i<=steps;i++)for(let j=0;j<7;j++){
        const t=i/steps,lateral=(j/6*2-1)*half*.94,origin=new THREE.Vector3(walkway.x0+dx*t-dz/length*lateral,4.22,walkway.z0+dz*t+dx/length*lateral);
        cast.set(origin,new THREE.Vector3(0,-1,0));cast.far=1.92;
        const hit=cast.intersectObjects(e.rayMeshes,false).find(hit=>within(hit.point,e));if(hit){samples++;if(examples.length<5)examples.push(vector(hit.point));}
      }
    }
    if(samples)obstructions.push({id:e.id,kind:e.kind,evidence,samples,examples});
  }
  walkwayChecks.push({id:walkway.id,width:walkway.width,owner,ownerThresholdAllowance:.5,checkedHeight:[2.30,4.22],obstructions,status:obstructions.length?'obstructed':'clear in sampled mesh checks'});
}
const report={generatedAt:new Date().toISOString(),method:'Actual local GLB positions and node transforms; precise world Box3; authored mesh refinement; adaptive tree root/trunk/canopy slices; 48 grid rays along three axes with parity interiors for canopy/flora overlaps; bottom hull raycasts to meadow triangles; declared WALKWAYS mesh vertex and vertical ray clearance. AABB candidates remain conservative; no sampled intersection does not prove no intersection.',layoutSource:placements?'src/layout.js':'current placeRodinProps inventory',mode:'browser placement function',missingAssets:missing,landArea:terrain.root.userData.landArea,assets:Object.fromEntries(Object.entries(assets).map(([k,v])=>[k,{size:vector(v.size),bounds:boxJSON(v.bounds)}])),objects:entries.map(e=>({id:e.id,kind:e.kind,source:e.source,bounds:boxJSON(e.bounds),layers:e.layers.map(l=>({name:l.name,bounds:boxJSON(l.box)}))})),collisionCandidates:collisions,floraCollisions,canopyOverlaps,groundSupport:ground,walkwayChecks};
const output=option('--out');if(output){const dest=path.resolve(base,output);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({objects:entries.length,missingAssets:missing,collisionCandidates:collisions,floraCollisions,canopyOverlaps,walkwayChecks,unsupported:ground.filter(g=>g.status!=='supported'),report:output},null,2));
if(flag('--strict')&&(missing.length||collisions.length||floraCollisions.some(c=>c.requiresAdjustment)||canopyOverlaps.some(c=>c.requiresAdjustment)||ground.some(g=>g.status!=='supported')||walkwayChecks.some(w=>w.obstructions.length)))process.exitCode=1;
