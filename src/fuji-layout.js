import {railOffset,STATION,CROSSING,projectRail} from './fuji-railway.js';
import {connectTownStreets,arrangeStreetFurniture,streetDistance} from './fuji-streets.js';
const at=(d,n,extra={})=>({...railOffset(d,n),d,n,...extra});
const door=p=>({x:p.x+2.7*Math.sin(p.rotation),z:p.z+2.7*Math.cos(p.rotation)});
const slots=[at(31,-6.0,{neighbourhood:'north'}),at(43,-7.1,{neighbourhood:'north'}),at(49,-7.7,{neighbourhood:'north'}),at(55.5,-10.7,{neighbourhood:'north'}),
 at(49.5,-13.8,{neighbourhood:'backstreet',rotation:railOffset(49.5,0).rotation+Math.PI/2}),at(61,-14,{neighbourhood:'backstreet',rotation:railOffset(61,0).rotation+Math.PI/2}),
 at(30,6.8,{neighbourhood:'south'}),at(43,6.8,{neighbourhood:'south'}),at(49,7.2,{neighbourhood:'south'})
].map((p,index)=>{if(p.neighbourhood==='south')p.rotation+=Math.PI;return {...p,index,width:4.4,depth:3.8,entry:door(p)};});
const line=(id,width,points,kind='asphalt')=>({id,width,kind,points:points.map(([d,n])=>{const p=at(d,n);return[p.x,p.z];})});
const trees=[
 ...[[20,4.5,4],[23,-4.5,3.7],[29,3.9,3],[47,3.9,3],[64,4.4,3.5],[69,-4.5,3.5],[71,4.5,3.7]].map(p=>[...p,'rail']),
 ...[[57,7.6,3.6],[59,9.4,3.3],[63,8.3,3.7],[64,-9.6,3.5],[67,-11.2,4],[67,-7,3.5]].map(p=>[...p,'station']),
 ...[[34,-8.6,3.1],[39,8.8,3],[46,-9.4,3],[53,8.8,3.5],[27,9.5,3.2]].map(p=>[...p,'lane']),
 ...[[43,-13.5,3.7],[45,-16,3.4],[55,-18,4],[58,-19,4.4],[63,-18.5,4.7],[66,-16,3.9]].map(p=>[...p,'shrine'])
].map(([d,n,height,zone],index)=>at(d,n,{height,zone,id:index===22?'gathering-sakura':'sakura-'+index,variant:index%2,rotation:index*2.399}));
export const FUJI_LAYOUT={height:2.22,slots,trees,gatheringTreeId:'gathering-sakura',gatheringCenter:{x:24,z:-12.8},
 paths:[line('north-main',2.4,[[25,-3],[32,-3],[37,-3.8],[43,-3.8],[49,-4],[52,-4],[54,-7],[58,-7],[65,-7]]),line('south-main',2.4,[[23,3.8],[30,3.8],[37,3.8],[43,3.8],[49,4],[55,4.2]]),line('level-crossing',3.8,[[CROSSING.d,-3.8],[CROSSING.d,3.8]],'stone')],
 queue:at(38.4,6.7),facilities:{cinema:at(35,7.2),kiosk:at(64,-4.3)},recordPlayer:at(65,-11.6),
 station:{...railOffset(STATION.center,-3.5),width:7.8,depth:2.2},platform:{...railOffset(STATION.center,-1.65),width:12,depth:1.5},
 plazas:[{id:'station-square',...at(63,-7),rx:2,rz:1.4},{id:'sakura-plaza',x:24,z:-12.8,rx:3.3,rz:3.3}],
 gardens:[{id:'crossing-garden',...at(40,8.5),width:1.1,depth:.7},{id:'station-garden',...at(64,-9),width:1,depth:.7},{id:'backstreet-garden',...at(57,-17),width:1.2,depth:.8},{id:'tea-garden',...at(65,-13),width:1.1,depth:.7}],
 benches:[at(61.7,-20.2),at(65.7,-18.5,{rotation:Math.PI/2}),at(65,-6),at(37.8,9)],
 lamps:[at(32.8,-5.8),at(41,5.7),at(46,-5.6),at(51,5.6),at(58,-8.8),at(61,-16.7)],
 planters:[{...at(34,-5.9),width:.5,depth:.65},{...at(46,6.5),width:.5,depth:.65},{...at(59,-11.8),width:.5,depth:.65}],
 cars:[at(25,7.8,{id:'fuji-cream-car',width:1,depth:1.84,color:0xe5c185}),at(52.2,-8.9,{id:'fuji-blue-car',width:1,depth:1.84,color:0x8aaead})],parking:[],
 bounds:{minX:-26,maxX:28,minZ:-19,maxZ:12},
 shops:[at(24,7.3,{type:'library',rotation:railOffset(24,0).rotation+Math.PI}),at(55.5,7,{type:'art',rotation:railOffset(55.5,0).rotation+Math.PI}),at(61,-10,{type:'cafe'})],
 shrine:at(55.5,-16.7),bamboo:[at(53,-19.2),at(59,-20.5),at(66,-18.4)],
 zenGardens:[at(43,-15.3),at(40,11)],notice:at(63,-16.5),vending:[at(40,-5.8),at(40.8,-5.8)],bicycles:[at(34.5,8.8),at(63,-8.8)]
};
FUJI_LAYOUT.parking=FUJI_LAYOUT.cars.map(p=>({...p,width:1.5,depth:2.3}));
connectTownStreets(FUJI_LAYOUT);
arrangeStreetFurniture(FUJI_LAYOUT);
// Enlarge crowns in place; clamp horizontal growth beside roofs and the railway.
for(const tree of FUJI_LAYOUT.trees){tree.height*=1.3;let clearance=projectRail(tree.x,tree.z).distance-1.6;for(const p of [...slots,...FUJI_LAYOUT.shops,FUJI_LAYOUT.shrine,FUJI_LAYOUT.station]){const c=Math.cos(p.rotation||0),s=Math.sin(p.rotation||0),dx=tree.x-p.x,dz=tree.z-p.z;clearance=Math.min(clearance,Math.hypot(Math.max(0,Math.abs(dx*c-dz*s)-(p.width??4)/2),Math.max(0,Math.abs(dx*s+dz*c)-(p.depth??3.5)/2))-.12);}tree.crownScale=Math.max(.77,Math.min(1,clearance/(tree.height*.4)));}

{const [a,b]=FUJI_LAYOUT.paths.find(p=>p.id==='shrine-lane').points;FUJI_LAYOUT.torii={x:(a[0]+b[0])/2,z:(a[1]+b[1])/2,rotation:Math.atan2(b[0]-a[0],b[1]-a[1])};}
export const townStreetDistance=(x,z)=>Math.min(...FUJI_LAYOUT.paths.map(p=>streetDistance(x,z,p)));
export function townPavingAt(x,z){let kind=null;for(const p of FUJI_LAYOUT.paths)if(streetDistance(x,z,p)<=0&&(kind!=='stone'||p.kind==='stone'))kind=p.kind;return kind;}
export function facilitySpaceClear(x,z){return townStreetDistance(x,z)>.15&&!(Math.abs(projectRail(x,z).d-CROSSING.d)<3&&projectRail(x,z).distance<5);}
export function inFujiBox(p,x,z,width=p.width,depth=p.depth,radius=0){const c=Math.cos(p.rotation||0),s=Math.sin(p.rotation||0),dx=x-p.x,dz=z-p.z;return Math.abs(dx*c-dz*s)<width/2+radius&&Math.abs(dx*s+dz*c)<depth/2+radius;}
export const fujiPlotAt=(x,z,radius=0)=>slots.findIndex(p=>inFujiBox(p,x,z,p.width,p.depth,radius));
export function fujiObstacleAt(x,z,radius=0){
 for(const [key,kind] of [['cars','car'],['gardens','garden'],['planters','planter']])if(FUJI_LAYOUT[key].some(p=>inFujiBox(p,x,z,p.width,p.depth,radius)))return kind;
 if(FUJI_LAYOUT.trees.some(p=>Math.hypot(p.x-x,p.z-z)<.25+radius))return'tree';
 if(FUJI_LAYOUT.benches.some(p=>inFujiBox(p,x,z,1.6,.55,radius)))return'bench';
 if(FUJI_LAYOUT.lamps.some(p=>Math.hypot(p.x-x,p.z-z)<.3+radius))return'lamp';
 if(FUJI_LAYOUT.shops.some(p=>inFujiBox(p,x,z,4,3.5,radius)))return'shop';
 if(inFujiBox(FUJI_LAYOUT.station,x,z,7.8,2.2,radius))return'station';
 if(inFujiBox(FUJI_LAYOUT.shrine,x,z,4,3.5,radius))return'shrine';
 if(inFujiBox(FUJI_LAYOUT.recordPlayer,x,z,1.25,1.1,radius))return'record-player';
 if(Math.hypot(x-FUJI_LAYOUT.queue.x,z-FUJI_LAYOUT.queue.z)<.45+radius)return'queue-sign';
 return null;
}
