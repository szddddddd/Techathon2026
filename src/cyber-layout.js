import {CITY_TOWERS,CITY_PODIUMS} from './cyber-city-layout.js';
const slot=(x,z,rotation=0,index=0)=>({index,x,z,rotation,width:4.4,depth:3.8,entry:{x:x+Math.sin(rotation)*2.65,z:z+Math.cos(rotation)*2.65}});
const slots=[[-8,-11,0],[0,-13,0],[8,-10,0],[-17,-8,Math.PI/2],[-16,-1,Math.PI/2],[-17,7,Math.PI/2],[-8,12,Math.PI],[0,13,Math.PI],[8,12,Math.PI]].map((p,i)=>slot(...p,i));
const path=(id,width,points)=>({id,width,kind:'asphalt',points});
const ring=[[-11,-6],[-4,-7],[5,-6],[12,-4],[13,3],[11,8],[3,9],[-6,8],[-11,4],[-11,-6]];
export const CYBER_LAYOUT={height:2.22,slots,gatheringTreeId:'cyber-light-tree',gatheringCenter:{x:1,z:6.5},gatheringRadius:3.1,
 paths:[path('ring-main',2.4,ring),path('plaza-west',2.4,[[-11,1],[-3,1],[-1.7,3],[1.7,3],[3,1],[13,1]]),path('airport-main',2.4,[[13,1],[18,2],[18,7.8],[22,7.8]]),path('east-shops',2.4,[[13,-4],[18,-5],[21,-8]])],
 queue:{x:10.8,z:5.5},facilities:{kiosk:{x:15.7,z:-3.8,rotation:-.3},cinema:{x:-8.6,z:6.0,rotation:0}},recordPlayer:{x:17,z:-9.4},
 trees:[[-23,-12,4.1],[-22,1,3.8],[-23,11,4.6],[-12,16,4.2],[5,17,4],[14,13,4.4],[24,12,4.3],[25,-2,4],[16,-15,4.1],[6,-17,4.2],[-6,-18,3.7],[-14,-16,4.6]].map(([x,z,height],i)=>({x,z,height,id:'cyber-street-tree-'+i,variant:i%2,rotation:i*2.399})),
 shops:[{x:18,z:-12,type:'cafe',rotation:Math.PI/2,width:4.4,depth:3.8},{x:23.8,z:-8,type:'library',rotation:-Math.PI/2,width:4.4,depth:3.8},{x:24.3,z:-14,type:'music',rotation:Math.PI,width:4.4,depth:3.8}],
 towers:CITY_TOWERS,podiums:CITY_PODIUMS,
 gardens:[{x:-22,z:-5,width:2.4,depth:1.2},{x:15,z:13,width:2.8,depth:1.2},{x:-20,z:15,width:2.2,depth:1.6},{x:18,z:11.7,width:2.7,depth:1.4}],
 benches:[{x:-4,z:17,rotation:0},{x:4,z:17,rotation:0},{x:-10,z:15.1,rotation:0},{x:12,z:-12.7,rotation:1.57},{x:23.8,z:9.1,rotation:-1.57},{x:-21,z:4.7,rotation:1.57}],
 cars:[{x:-20.4,z:-3.1,rotation:.12,color:0xc59a3e,width:1.1,depth:2.1},{x:15.1,z:10.7,rotation:1.55,color:0x536d83,width:1.1,depth:2.1}],
 vending:[{x:-20,z:9.4,width:.72,depth:.6},{x:16,z:-7.2,width:.72,depth:.6},{x:19.4,z:10,width:.72,depth:.6}],
 dock:{x:22,z:4,rotation:0,width:5,depth:4,height:8},
 spawnAreas:[{minX:-10,maxX:-7,minZ:-4,maxZ:4},{minX:6,maxX:10,minZ:-4,maxZ:4},{minX:-4,maxX:3,minZ:6,maxZ:8},{minX:13,maxX:18,minZ:-1,maxZ:2}],
 bounds:{minX:-29,maxX:29,minZ:-24,maxZ:22},
};
function closest(p,points){let best=null,d=Infinity;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.z-a[1])*dz)/(dx*dx+dz*dz))),q=[a[0]+dx*t,a[1]+dz*t],n=Math.hypot(p.x-q[0],p.z-q[1]);if(n<d){d=n;best=q;}}return best;}
export function inCyberBox(p,x,z,width=p.width,depth=p.depth,r=0){const c=Math.cos(p.rotation||0),s=Math.sin(p.rotation||0),dx=x-p.x,dz=z-p.z;return Math.abs(dx*c-dz*s)<width/2+r&&Math.abs(dx*s+dz*c)<depth/2+r;}
export const cyberPlotAt=(x,z,r=0)=>slots.findIndex(p=>inCyberBox(p,x,z,p.width,p.depth,r));
export function cyberStreetDistance(x,z){let best=Infinity;for(const p of CYBER_LAYOUT.paths)for(let i=1;i<p.points.length;i++){const a=p.points[i-1],b=p.points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));best=Math.min(best,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)-p.width/2);}return Math.min(best,Math.hypot(x-1,z-6.5)-3.4);}
export function cyberObstacleAt(x,z,r=0){
 for(const [key,kind] of [['shops','shop'],['towers','tower'],['podiums','podium'],['cars','car'],['gardens','garden'],['vending','vending']])if(CYBER_LAYOUT[key].some(p=>inCyberBox(p,x,z,p.width,p.depth,r)))return kind;
 if(inCyberBox(CYBER_LAYOUT.dock,x,z,5,4,r))return'dock';
 if(CYBER_LAYOUT.trees.some(p=>Math.hypot(x-p.x,z-p.z)<.24+r))return'tree';
 if(Math.hypot(x-1,z-6.5)<.65+r)return'light-tree';
 if(CYBER_LAYOUT.edgePlanting?.some(p=>Math.hypot(x-p.x,z-p.z)<p.radius+r))return'edge-garden';
 if(CYBER_LAYOUT.lamps?.some(p=>Math.hypot(x-p.x,z-p.z)<.12+r))return'lamp';
 if(CYBER_LAYOUT.benches.some(p=>inCyberBox(p,x,z,1.7,.55,r)))return'bench';
 if(Math.hypot(x-CYBER_LAYOUT.queue.x,z-CYBER_LAYOUT.queue.z)<.4+r)return'queue-sign';
 return null;
}
export const cyberFacilitySpaceClear=(x,z)=>cyberStreetDistance(x,z)>.15;

CYBER_LAYOUT.lamps=[];for(let i=0;i<18;i++){const a=i/18*Math.PI*2,p={x:Math.cos(a)*12.6,z:1+Math.sin(a)*9.6};if(cyberPlotAt(p.x,p.z,.35)<0&&!cyberObstacleAt(p.x,p.z,.35)&&cyberStreetDistance(p.x,p.z)>.35)CYBER_LAYOUT.lamps.push(p);}

CYBER_LAYOUT.edgePlanting=[];for(let i=0;i<48;i++){const a=i/48*Math.PI*2,p={x:Math.cos(a)*26.5,z:Math.sin(a)*20.0,radius:.35+(i%3)*.1};if(cyberPlotAt(p.x,p.z,.65)<0&&!cyberObstacleAt(p.x,p.z,.65)&&cyberStreetDistance(p.x,p.z)>.8)CYBER_LAYOUT.edgePlanting.push(p);}

// Build continuous streets around fixed group plots and new ground-level footprints.
CYBER_LAYOUT.paths=[];CYBER_LAYOUT.lamps=[];CYBER_LAYOUT.edgePlanting=[];
function groundClear(x,z,r){if(x<-27||x>27||z<-22||z>20)return false;return cyberPlotAt(x,z,r)<0&&!cyberObstacleAt(x,z,r);}
function route(a,b,r){const step=.25,key=(x,z)=>x+','+z,near=p=>[Math.round(p[0]/step),Math.round(p[1]/step)],start=near(a),end=near(b),open=[{p:start,g:0,f:0}],seen=new Map(),came=new Map();seen.set(key(...start),0);let result;
 for(let n=0;open.length&&n<60000;n++){open.sort((a,b)=>a.f-b.f);const q=open.shift(),k=key(...q.p);if(q.g!==seen.get(k))continue;if(Math.hypot(q.p[0]-end[0],q.p[1]-end[1])<1.5){result=q.p;break;}for(const [dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const p=[q.p[0]+dx,q.p[1]+dz],k2=key(...p),g=q.g+1;if(g>=(seen.get(k2)??Infinity)||!groundClear(p[0]*step,p[1]*step,r))continue;seen.set(k2,g);came.set(k2,q.p);open.push({p,g,f:g+Math.hypot(p[0]-end[0],p[1]-end[1])});}}
 if(!result)throw Error('No clear city street '+a+' -> '+b);const out=[b];for(let p=result;p;p=came.get(key(...p)))out.push([p[0]*step,p[1]*step]);out.push(a);out.reverse();return out.filter((p,i)=>!i||i===out.length-1||Math.abs((p[0]-out[i-1][0])*(out[i+1][1]-p[1])-(p[1]-out[i-1][1])*(out[i+1][0]-p[0]))>.0001);}
const nodes=[[-13,-8],[-7.75,-7.75],[1,-9],[7.5,-6.75],[14,0],[15,8],[6.5,8.5],[0,9.6],[-10,8],[-13,1],[-13,-8]];
for(let i=1;i<nodes.length;i++)CYBER_LAYOUT.paths.push(path('city-main-'+i,2.4,route(nodes[i-1],nodes[i],1.22)));
for(const p of slots){const a=[p.entry.x,p.entry.z],b=nodes.reduce((best,n)=>Math.hypot(n[0]-a[0],n[1]-a[1])<Math.hypot(best[0]-a[0],best[1]-a[1])?n:best);CYBER_LAYOUT.paths.push(path('door-'+p.index,1.8,route(a,b,.91)));}
for(const [id,a,b]of[['airport',[15,8],[22,7.8]],['shops',[14,0],[19.5,-5]],['plaza',[0,9.6],[1,9.5]],['canyon',[-1,1],[0,9.6]]])CYBER_LAYOUT.paths.push(path(id,2.4,route(a,b,1.22)));
CYBER_LAYOUT.spawnAreas=[{minX:-26,maxX:-21,minZ:-8,maxZ:12},{minX:17,maxX:26,minZ:9,maxZ:16},{minX:-20,maxX:20,minZ:16,maxZ:19},{minX:13,maxX:18,minZ:0,maxZ:8},{minX:-2,maxX:4,minZ:6,maxZ:9}];





for(const [x,z]of[[-14,4],[-13,-10],[-6,-9.3],[2,-10],[13,-7],[16,2],[16,7],[5,10],[-10,10],[-12,5],[19,7],[21,-4]])if(cyberPlotAt(x,z,.3)<0&&!cyberObstacleAt(x,z,.3)&&cyberStreetDistance(x,z)>.25)CYBER_LAYOUT.lamps.push({x,z});
