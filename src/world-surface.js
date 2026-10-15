// One source of truth for the town outline, editable elevations and walkable regions.
import {riverCenter,riverHalfWidth} from './river-profile.js';
export const WORLD_BOUNDS={minX:-17,maxX:29,minZ:-24,maxZ:11.2};
export const polygonArea=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1];},0))/2;
export function insidePolygon(p,x,z){let hit=false;for(let i=0,j=p.length-1;i<p.length;j=i++)if((p[i][1]>z)!==(p[j][1]>z)&&x<(p[j][0]-p[i][0])*(z-p[i][1])/(p[j][1]-p[i][1])+p[i][0])hit=!hit;return hit;}
export function bankOutlines(expanded=true){
  const l=[],r=[];for(let z=-11;z<=11;z++){l.push([riverCenter(z)-riverHalfWidth(z),z]);r.push([riverCenter(z)+riverHalfWidth(z),z]);}
  const west=[[-16,-10.7],[-12.5,-11.3],[-4.7,-11.1],...l,[-8.8,11.1],[-14.4,10.3],[-16.6,7.4],[-16.9,1.2],[-16.3,-6.8]];
  const east=[...r.slice().reverse(),[11.3,-11.4],[15.9,-9.4],[16.8,-4],[16.9,2],[15.9,8.3],[14.1,10.8],[10,11.2]];
  if(!expanded)return{west,east};
  const ul=[],ur=[];for(let z=-23;z<-11;z++){ul.push([riverCenter(z)-riverHalfWidth(z),z]);ur.push([riverCenter(z)+riverHalfWidth(z),z]);}
  return {west:[[-16,-10.7],[-15.5,-17],[-10,-23],[-4,-24],...ul,...l,...west.slice(-5)],east:[...r.slice().reverse(),...ur.slice().reverse(),[6,-24],[15,-23],[22,-17],[26,-9],[28.5,-2],[29,5],[26,10],[19,11.2],[14.1,10.8],[10,11.2]]};
}
const outlines=bankOutlines();
const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
function mountain(x,z,cx,cz,rx,rz,h){
  const a=Math.atan2((z-cz)/rz,(x-cx)/rx),r=Math.hypot((x-cx)/rx,(z-cz)/rz)/(1+.105*Math.sin(a*3+.7)+.055*Math.cos(a*5));
  const raw=h*Math.pow(Math.max(0,1-r),.9),tier=2.05,level=Math.floor(raw/tier),f=raw/tier-level;
  return tier*(level+smooth((f-.12)/.76));
}
export function surfaceHeight(x,z){
  const mountainY=Math.max(mountain(x,z,-9,-18.6,7.5,6.4,11.7),mountain(x,z,10.8,-19.8,6.8,5.4,13.6),mountain(x,z,18,-18.4,5.4,4.4,5.2));
  const q=Math.max(0,Math.min(9,-z-4)),rise=(q<.5?q*q:q>8.5?8.5-(9-q)*(9-q):q-.25)/8.5;
  const shelf=3.28*rise*smooth((x-15)/3)*(1-smooth((-z-16)/3));
  return 2.22+Math.max(mountainY,shelf);
}
export function inWorld(x,z){return Number.isFinite(x)&&Number.isFinite(z)&&(insidePolygon(outlines.west,x,z)||insidePolygon(outlines.east,x,z));}
export function querySurface(x,z){
  const height=surfaceHeight(x,z),e=.025,dx=(surfaceHeight(x+e,z)-surfaceHeight(x-e,z))/(2*e),dz=(surfaceHeight(x,z+e)-surfaceHeight(x,z-e))/(2*e),n=Math.hypot(dx,1,dz);
  let region='valley';if(x>16&&z>-5)region='plaza';if(x>=21&&x<=25.8&&z<=1&&z>-13)region='ramp';if(x>=18&&x<=25.8&&z<=-12&&z>=-15.8)region='terrace';if(z<-11&&region==='valley'||z<-16||x<21&&z<-5&&x>16&&region!=='terrace')region='mountain';
  const walkable=inWorld(x,z)&&region!=='mountain'&&Math.hypot(dx,dz)<=Math.tan(22*Math.PI/180)+1e-4;
  return {height,normal:{x:-dx/n,y:1/n,z:-dz/n},region,walkable};
}
export function landAreaAudit(){const old=bankOutlines(false),now=bankOutlines();const before=polygonArea(old.west)+polygonArea(old.east),after=polygonArea(now.west)+polygonArea(now.east);return{before,after,ratio:after/before,west:polygonArea(now.west),east:polygonArea(now.east)};}
