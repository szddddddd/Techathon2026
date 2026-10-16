// Shared spatial plan. Coordinates and clearance zones drive both rendering and audits.
import {inCommunity,groupPlotAt} from './community-layout.js';
import {FOREST_TREES,FOREST_ROCKS} from './forest-layout.js';
export const ASSET_NAMES={cart:'推车',tree:'古树',tree_birch:'轻冠桦树',tree_maple:'阔冠枫树',rock:'苔石',grass:'草丛',cottage:'森林木屋',tent:'帆布帐篷',barrel:'橡木桶',crate:'补给木箱',chest:'宝箱',bridge:'石拱桥',outcrop:'苔藓假山',crystal:'蓝色晶簇',fern_large:'大蕨草'};
const item=(id,kind,x,z,size,rotation=0,axis='max',extra={})=>({id,kind,x,z,size,rotation,axis,...extra});
const legacyPlacements=[
  item('cottage','cottage',-6.5,-4.5,5.4),
  item('tent','tent',-10,4.6,3.35),
  item('cart','cart',-11.4,.5,3.8),
  item('barrel-a','barrel',-10.7,-3.4,1.25,0,'y'),
  item('barrel-b','barrel',-10.7,-5,1.1,.5,'y'),
  item('crate-a','crate',-10.7,-6.25,.95,.1),
  item('crate-b','crate',-12.4,4.3,1.05,.2),
  item('crate-c','crate',-8.4,6.95,.85,-.1),
  item('chest','chest',9.3,-11.6,1.95,.15),
  item('bridge','bridge',1.25,1.5,9.24,0,'x',{y:.5,height:3.8,depth:3.92,alignLongAxis:true}),
  ...[[-9.1,8.7,1.5,.2],[-3.4,6.8,2.1,1.1],[5.1,6.7,2.1,2.3],[10.8,.1,2.0,3.4],[5.3,-7.15,1.65,4],[-10.3,-8.9,1.3,.7],[-4.6,3.9,1.3,1.7],[7.6,4.3,1.6,2.7],[9.5,8,1.65,1.5]].map((p,i)=>item(`fern-${i}`,'fern_large',...p)),
  ...[[-12,2.6,.9],[-9.8,-9.3,.8],[-2.7,9.5,.8],[-2.4,7.4,.85],[7.1,9,.85],[10.7,6.3,.85],[13.8,3.7,.9],[12.2,-3.3,.9],[7.2,-8.6,.9],[-6.3,10,.7],[4.1,4.7,.95],[6.7,5.8,.9],[-5.1,5.5,.75],[-7.5,-8.9,.65],[5.5,-1.3,.75],[7.7,7.4,.8]].map((p,i)=>item(`grass-${i}`,'grass',...p,i*2.399,'y'))
].map(p=>p.kind==='bridge'?p:{...p,x:p.x+(p.x<1.25?-1.5:1.5)}).filter(p=>!['cottage','cart'].includes(p.kind)&&!inCommunity(p.x,p.z));
export const PLACEMENTS=[...legacyPlacements,...FOREST_TREES,...FOREST_ROCKS];
// Props reserve their actual measured footprints once loaded; these corridors are invariant.
export const WALKWAYS=[
  {id:'bridge approach',x0:-3.8,z0:1.5,x1:6,z1:1.5,width:1.8},
  {id:'community entrance',x0:-3.7,z0:-.8,x1:-3.7,z1:1.4,width:1.35},
  {id:'left meadow trail',x0:-5.2,z0:1.4,x1:-7.5,z1:8.8,width:1.2},
  {id:'tent entrance',x0:-10,z0:6.24,x1:-10,z1:7.3,width:1.1}
].map(w=>w.id==='bridge approach'?{...w,x0:w.x0-1.5,x1:w.x1+1.5,width:2.24}:{...w,x0:w.x0-1.5,x1:w.x1-1.5});
export function distanceToSegment(x,z,line){const dx=line.x1-line.x0,dz=line.z1-line.z0,t=Math.max(0,Math.min(1,((x-line.x0)*dx+(z-line.z0)*dz)/(dx*dx+dz*dz)));return Math.hypot(x-line.x0-t*dx,z-line.z0-t*dz);}
let footprints=[];
export function setReservedFootprints(value){footprints=value;}
export function isReserved(x,z,radius=0){
  if(inCommunity(x,z,radius)||groupPlotAt(x,z,radius)>=0)return true;
  if(WALKWAYS.some(line=>distanceToSegment(x,z,line)<line.width/2+radius+.15))return true;
  if(Math.hypot(x+8.5,z-1.5)<1.7+radius)return true;
  return footprints.some(b=>x>b.minX-radius-.15&&x<b.maxX+radius+.15&&z>b.minZ-radius-.15&&z<b.maxZ+radius+.15);
}
