import fs from 'node:fs/promises';
import * as T from 'three';
import {FUJI_LAYOUT as L} from '../src/fuji-layout.js';
import {loadGeometryGLB,worldVertices} from './glb-geometry.mjs';
const points=[],circle=(x,z,r)=>{for(let i=0;i<12;i++){const a=i*Math.PI/6;points.push([x+Math.cos(a)*r,z+Math.sin(a)*r]);}};
const rect=(p,w,d,pad=.9)=>{for(const x of[-w/2,w/2])for(const z of[-d/2,d/2])circle(p.x+x*Math.cos(p.rotation||0)+z*Math.sin(p.rotation||0),p.z-x*Math.sin(p.rotation||0)+z*Math.cos(p.rotation||0),pad);};
for(const p of [...L.slots,...L.shops,L.shrine])rect(p,p.width??4,p.depth??3.5);
rect(L.station,7.8,2.2);rect(L.platform,12,1.5);
for(const path of L.paths)for(const[x,z]of path.points)circle(x,z,path.width/2+.85);
for(const tree of L.trees)circle(tree.x,tree.z,1.15);
for(const p of [...L.bamboo,...L.zenGardens,...L.benches,...L.cars,...Object.values(L.facilities),L.recordPlayer,L.queue,L.notice,...L.vending,...L.bicycles,...L.gardens,...L.planters,...L.lamps])circle(p.x,p.z,1.5);
circle(L.gatheringCenter.x,L.gatheringCenter.z,3.65);
// Portals terminate at the island edge; buried tunnel tails remain hidden.
circle(-25.2,-14.6,2.25);circle(26,8.7,2.25);
const {model,bounds,size}=await loadGeometryGLB('assets/rodin-fuji/fuji/scene.glb');
const c=bounds.getCenter(new T.Vector3());model.position.sub(new T.Vector3(c.x,bounds.min.y,c.z));const holder=new T.Group();holder.add(model);holder.scale.set(36/size.x,16.5/size.y,22/size.z);holder.position.set(2,2.22,-25.2);
function hull(input){const p=[...input].sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);const side=ps=>{const h=[];for(const p of ps){while(h.length>1&&cross(h.at(-2),h.at(-1),p)<=0)h.pop();h.push(p);}return h;};return [...side(p).slice(0,-1),...side(p.reverse()).slice(0,-1)];}
for(const [x,z]of hull(worldVertices(holder).map(p=>[p.x,p.z])))circle(x,z,.55);
let outline=hull(points);
// Offset every supporting edge outwards. Keep a grass margin around the entire
// occupied envelope, including trees and platform ends, rather than scaling props.
const border=1.1;
const lines=outline.map((a,i)=>{const b=outline[(i+1)%outline.length],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),nx=dz/length,nz=-dx/length;return{nx,nz,c:nx*a[0]+nz*a[1]+border};});
outline=lines.map((b,i)=>{const a=lines[(i+lines.length-1)%lines.length],det=a.nx*b.nz-b.nx*a.nz;return[(a.c*b.nz-b.c*a.nz)/det,(a.nx*b.c-b.nx*a.c)/det];});
// Simplify one vertex at a time: removing adjacent points simultaneously can cut
// across a whole convex shore and leave trees outside the resulting polygon.
while(outline.length>16){let best=-1,error=.045;for(let i=0;i<outline.length;i++){const a=outline[(i+outline.length-1)%outline.length],b=outline[i],c=outline[(i+1)%outline.length],d=Math.abs((c[0]-a[0])*(a[1]-b[1])-(a[0]-b[0])*(c[1]-a[1]))/Math.hypot(c[0]-a[0],c[1]-a[1]);if(d<error){best=i;error=d;}}if(best<0)break;outline.splice(best,1);}
outline=outline.map(p=>p.map(v=>+v.toFixed(3)));
const area=p=>Math.abs(p.reduce((sum,a,i)=>{const b=p[(i+1)%p.length];return sum+a[0]*b[1]-b[0]*a[1];},0))/2;
const old=[[-26,10],[-28,3],[-27.5,-10],[-24,-23],[-17,-32],[-6,-36],[7,-35],[19,-30],[26,-21],[29,-9],[30,3],[28,10],[18,13],[4,12.5],[-11,13],[-21,11.5]];
await fs.writeFile('src/fuji-island-outline.js','// Authored footprint envelope: mountain, town, paths and grounded props.\nexport const COMPACT_FUJI_OUTLINE='+JSON.stringify(outline)+';\n');
await fs.mkdir('validation/sakura-polish',{recursive:true});await fs.writeFile('validation/sakura-polish/island.json',JSON.stringify({oldArea:area(old),previousTrimmedArea:1993.6415045,borderExpansion:1.1,newArea:area(outline),reductionPercent:100*(1-area(outline)/area(old)),outline},null,2));console.log({oldArea:area(old),previousTrimmedArea:1993.6415045,borderExpansion:1.1,newArea:area(outline),reductionPercent:100*(1-area(outline)/area(old)),vertices:outline.length});
