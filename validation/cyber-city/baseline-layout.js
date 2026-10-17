const slot=(x,z,rotation=0,index=0)=>({index,x,z,rotation,width:4.4,depth:3.8,entry:{x:x+Math.sin(rotation)*2.65,z:z+Math.cos(rotation)*2.65}});
const slots=[[-8,-11,0],[0,-13,0],[8,-10,0],[-17,-8,Math.PI/2],[-16,-1,Math.PI/2],[-17,7,Math.PI/2],[-8,12,Math.PI],[0,13,Math.PI],[8,12,Math.PI]].map((p,i)=>slot(...p,i));
const path=(id,width,points)=>({id,width,kind:'asphalt',points});
const ring=[[-11,-6],[-4,-7],[5,-6],[12,-4],[13,3],[11,8],[3,9],[-6,8],[-11,4],[-11,-6]];
export const CYBER_LAYOUT={height:2.22,slots,gatheringTreeId:'cyber-light-tree',gatheringCenter:{x:0,z:1},gatheringRadius:3.3,
 paths:[path('ring-main',2.4,ring),path('plaza-west',2.4,[[-11,1],[-3,1],[-1.7,3],[1.7,3],[3,1],[13,1]]),path('airport-main',2.4,[[13,1],[18,2],[18,7.8],[22,7.8]]),path('east-shops',2.4,[[13,-4],[18,-5],[21,-8]])],
 queue:{x:10.8,z:5.5},facilities:{kiosk:{x:15.7,z:-3.8,rotation:-.3},cinema:{x:-8.6,z:6.0,rotation:0}},recordPlayer:{x:17,z:-9.4},
 trees:[[-23,-12,4.1],[-22,1,3.8],[-23,11,4.6],[-12,16,4.2],[5,17,4],[14,13,4.4],[24,12,4.3],[25,-2,4],[16,-15,4.1],[6,-17,4.2],[-6,-18,3.7],[-14,-16,4.6]].map(([x,z,height],i)=>({x,z,height,id:'cyber-street-tree-'+i,variant:i%2,rotation:i*2.399})),
 shops:[{x:18,z:-12,type:'cafe',rotation:Math.PI/2,width:4.4,depth:3.8},{x:23.8,z:-8,type:'library',rotation:-Math.PI/2,width:4.4,depth:3.8},{x:24.3,z:-14,type:'music',rotation:Math.PI,width:4.4,depth:3.8}],
 towers:[{x:-14,z:-20,width:4,depth:3,height:11},{x:0,z:-20.5,width:4.2,depth:3,height:14},{x:13,z:-20,width:3.8,depth:3,height:10}],
 gardens:[{x:-5,z:-2,width:2.4,depth:1.2},{x:5,z:5,width:2.8,depth:1.2},{x:-20,z:15,width:2.2,depth:1.6},{x:18,z:11.7,width:2.7,depth:1.4}],
 benches:[{x:-4.6,z:3.7,rotation:-.65},{x:4.2,z:-1.7,rotation:2.4},{x:-10,z:15.1,rotation:0},{x:12,z:-12.7,rotation:1.57},{x:23.8,z:9.1,rotation:-1.57},{x:-21,z:4.7,rotation:1.57}],
 cars:[{x:-20.4,z:-3.1,rotation:.12,color:0xd4a2b3,width:1.1,depth:2.1},{x:15.1,z:10.7,rotation:1.55,color:0x8fbcc7,width:1.1,depth:2.1}],
 vending:[{x:-20,z:9.4,width:.72,depth:.6},{x:16,z:-7.2,width:.72,depth:.6},{x:19.4,z:10,width:.72,depth:.6}],
 dock:{x:22,z:4,rotation:0,width:5,depth:4,height:8},
 spawnAreas:[{minX:-10,maxX:-7,minZ:-4,maxZ:4},{minX:6,maxX:10,minZ:-4,maxZ:4},{minX:-4,maxX:3,minZ:6,maxZ:8},{minX:13,maxX:18,minZ:-1,maxZ:2}],
 bounds:{minX:-29,maxX:29,minZ:-24,maxZ:22},
};
function closest(p,points){let best=null,d=Infinity;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.z-a[1])*dz)/(dx*dx+dz*dz))),q=[a[0]+dx*t,a[1]+dz*t],n=Math.hypot(p.x-q[0],p.z-q[1]);if(n<d){d=n;best=q;}}return best;}
for(const p of slots)CYBER_LAYOUT.paths.push(path('door-'+p.index,1.8,[[p.entry.x,p.entry.z],closest(p.entry,ring)]));
CYBER_LAYOUT.paths.push(path('cafe-front',1.8,[[20.9,-12],[20.9,-8],[18,-5]]),path('music-front',1.8,[[24.3,-16.65],[20.9,-16.65],[20.9,-8]]));
export function inCyberBox(p,x,z,width=p.width,depth=p.depth,r=0){const c=Math.cos(p.rotation||0),s=Math.sin(p.rotation||0),dx=x-p.x,dz=z-p.z;return Math.abs(dx*c-dz*s)<width/2+r&&Math.abs(dx*s+dz*c)<depth/2+r;}
export const cyberPlotAt=(x,z,r=0)=>slots.findIndex(p=>inCyberBox(p,x,z,p.width,p.depth,r));
export function cyberStreetDistance(x,z){let best=Infinity;for(const p of CYBER_LAYOUT.paths)for(let i=1;i<p.points.length;i++){const a=p.points[i-1],b=p.points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));best=Math.min(best,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)-p.width/2);}return Math.min(best,Math.hypot(x,z-1)-4.1);}
export function cyberObstacleAt(x,z,r=0){
 for(const [key,kind] of [['shops','shop'],['towers','tower'],['cars','car'],['gardens','garden'],['vending','vending']])if(CYBER_LAYOUT[key].some(p=>inCyberBox(p,x,z,p.width,p.depth,r)))return kind;
 if(inCyberBox(CYBER_LAYOUT.dock,x,z,5,4,r))return'dock';
 if(CYBER_LAYOUT.trees.some(p=>Math.hypot(x-p.x,z-p.z)<.24+r))return'tree';
 if(Math.hypot(x,z-1)<.65+r)return'light-tree';
 if(CYBER_LAYOUT.edgePlanting?.some(p=>Math.hypot(x-p.x,z-p.z)<p.radius+r))return'edge-garden';
 if(CYBER_LAYOUT.lamps?.some(p=>Math.hypot(x-p.x,z-p.z)<.12+r))return'lamp';
 if(CYBER_LAYOUT.benches.some(p=>inCyberBox(p,x,z,1.7,.55,r)))return'bench';
 if(Math.hypot(x-CYBER_LAYOUT.queue.x,z-CYBER_LAYOUT.queue.z)<.4+r)return'queue-sign';
 return null;
}
export const cyberFacilitySpaceClear=(x,z)=>cyberStreetDistance(x,z)>.15;

CYBER_LAYOUT.lamps=[];for(let i=0;i<18;i++){const a=i/18*Math.PI*2,p={x:Math.cos(a)*12.6,z:1+Math.sin(a)*9.6};if(cyberPlotAt(p.x,p.z,.35)<0&&!cyberObstacleAt(p.x,p.z,.35)&&cyberStreetDistance(p.x,p.z)>.35)CYBER_LAYOUT.lamps.push(p);}

CYBER_LAYOUT.edgePlanting=[];for(let i=0;i<48;i++){const a=i/48*Math.PI*2,p={x:Math.cos(a)*26.5,z:Math.sin(a)*20.0,radius:.35+(i%3)*.1};if(cyberPlotAt(p.x,p.z,.65)<0&&!cyberObstacleAt(p.x,p.z,.65)&&cyberStreetDistance(p.x,p.z)>.8)CYBER_LAYOUT.edgePlanting.push(p);}
