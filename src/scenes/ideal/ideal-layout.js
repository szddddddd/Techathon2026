import {IDEAL_CITY_PLAN} from './ideal-city-plan.js';
import manifest from '../../../assets/ideal-city/manifest.json' with {type:'json'};
import proportions from './ideal-proportions.json' with {type:'json'};
export const IDEAL_PROPORTIONS=proportions;
const depth=proportions.depthScale;
const groupFor=id=>manifest.groups.find(g=>g.id===id);
const centerFor=p=>IDEAL_CITY_PLAN.groups[p.slot]?.slice(0,2)||proportions.groupCenters[p.slot]||[p.x,p.z*depth];
function remapBox(p){
 if(p.collection==='02_ColonyShip'){const half=proportions.coreSquare/2,z=-1.9*depth;return{...p,min:[-half,p.min[1],z-half],max:[half,p.max[1],z+half]};}
 const group=groupFor(p.id),cx=(p.min[0]+p.max[0])/2,cz=(p.min[2]+p.max[2])/2;
 const [x,z]=group?centerFor(group):p.id==='low-building-3'?[IDEAL_CITY_PLAN.staticBuilding.x,IDEAL_CITY_PLAN.staticBuilding.z]:[cx,cz*depth];
 const factor=['01_Island','02_ColonyShip','04_Roads'].includes(p.collection)&&!p.id.startsWith('garden-')?depth:1;
 const scale=group?IDEAL_CITY_PLAN.groups[group.slot][2]:p.id==='low-building-3'?IDEAL_CITY_PLAN.staticBuilding.scale:1;
 if(scale!==1)return{...p,width:p.width*scale,depth:p.depth*scale,height:p.height*scale,min:[x-(p.max[0]-p.min[0])*scale/2,manifest.ground,z-(p.max[2]-p.min[2])*scale/2],max:[x+(p.max[0]-p.min[0])*scale/2,manifest.ground+(p.max[1]-manifest.ground)*scale,z+(p.max[2]-p.min[2])*scale/2]};
 return{...p,min:[x-(p.max[0]-p.min[0])/2,p.min[1],z-(p.max[2]-p.min[2])*factor/2],max:[x+(p.max[0]-p.min[0])/2,p.max[1],z+(p.max[2]-p.min[2])*factor/2]};
}
export const IDEAL_SOURCE={...manifest,objects:manifest.objects.map(remapBox),groups:manifest.groups.map(p=>{const [x,z]=centerFor(p);return{...remapBox(p),x,z};}),vehicles:manifest.vehicles.map(p=>({...remapBox(p),center:[p.center[0],p.center[1],p.center[2]*depth]}))};
export const IDEAL_GROUND=manifest.ground;
export const IDEAL_OUTLINE=manifest.outline.map(([x,z])=>[x,z*depth]);
export const IDEAL_SLOTS=IDEAL_SOURCE.groups.map((p,index)=>({index,x:p.x,y:IDEAL_GROUND,z:p.z,rotation:0,width:p.width,depth:p.depth,height:p.height,assetId:p.id,entry:{x:p.x,z:p.z+p.depth/2+1.1}}));
const boxes=IDEAL_SOURCE.objects.filter(p=>!manifest.groups.some(g=>g.id===p.id)&&p.collection!=='07_Environment'&&p.collection!=='04_Roads'&&p.min[1]<=IDEAL_GROUND+.5&&p.max[1]>IDEAL_GROUND+.25);
boxes.push(...IDEAL_CITY_PLAN.satellites.map(p=>({id:p.id,min:[p.x-p.width/2,IDEAL_GROUND,p.z-p.depth/2],max:[p.x+p.width/2,IDEAL_GROUND+p.height,p.z+p.depth/2]})));
export const IDEAL_LAYOUT={height:IDEAL_GROUND,slots:IDEAL_SLOTS,queue:{x:5,y:IDEAL_GROUND,z:7*depth},gatheringTreeId:'ideal-beacon',gatheringCenter:{x:0,z:10*depth},gatheringRadius:2.6,facilities:{kiosk:{x:18,z:-7},cinema:{x:-18,z:8}},recordPlayer:{x:-3,z:11*depth},spawnAreas:[{minX:-22,maxX:-10,minZ:6*depth,maxZ:10*depth},{minX:-7,maxX:6,minZ:6*depth,maxZ:13*depth},{minX:16,maxX:25,minZ:5*depth,maxZ:9*depth},{minX:-24,maxX:24,minZ:-14*depth,maxZ:-11*depth}],bounds:{minX:Math.min(...IDEAL_OUTLINE.map(p=>p[0])),maxX:Math.max(...IDEAL_OUTLINE.map(p=>p[0])),minZ:Math.min(...IDEAL_OUTLINE.map(p=>p[1])),maxZ:Math.max(...IDEAL_OUTLINE.map(p=>p[1]))},paths:[]};
export function inIdealWorld(x,z){let inside=false;for(let i=0,j=IDEAL_OUTLINE.length-1;i<IDEAL_OUTLINE.length;j=i++){const a=IDEAL_OUTLINE[i],b=IDEAL_OUTLINE[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export const idealPlotAt=(x,z,r=0)=>IDEAL_SLOTS.findIndex(p=>Math.abs(x-p.x)<p.width/2+r&&Math.abs(z-p.z)<p.depth/2+r);
export function idealObstacleAt(x,z,r=0){return boxes.find(p=>x>p.min[0]-r&&x<p.max[0]+r&&z>p.min[2]-r&&z<p.max[2]+r);}
export function queryIdealSurface(x,z){const outside=!inIdealWorld(x,z),plot=idealPlotAt(x,z)>=0,obstacle=idealObstacleAt(x,z);return{height:IDEAL_GROUND,normal:{x:0,y:1,z:0},region:outside?'outside':plot?'group-plot':obstacle?'ideal-building':'ideal-meadow',walkable:!outside&&!plot&&!obstacle};}
export function idealCanPlace(x,z,r=.3){for(let i=0;i<13;i++){const a=i*Math.PI/6,rr=i?r+.06:0;if(!queryIdealSurface(x+Math.cos(a)*rr,z+Math.sin(a)*rr).walkable)return false;}return true;}
export function idealCanWalkStep(a,b,r=.3){const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.25));for(let i=0;i<=n;i++)if(!idealCanPlace(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n,r))return false;return true;}
export function idealCamera(width=1440,height=1000){const ratio=width/height,distance=Math.max(116,92/(2*Math.tan(37*Math.PI/360)*ratio));const position=[3+distance*.18,10+distance*.31,distance*.94],target=[3,10,0];return{position,target,mobile:position,mobileTarget:target};}
