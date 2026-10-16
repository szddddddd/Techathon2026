// One source of truth for the town outline, editable elevations and walkable regions.
import {riverCenter,riverHalfWidth} from './river-profile.js';
import {mountainHeight,foothillHeight} from './mountain-profile.js';
import {onTerraceExtension,terraceHeight} from './terrace-profile.js';
import {groupPlotAt,GROUP_QUEUE,communityBlend,inCommunity} from './community-layout.js';
import {islandBanks,ISLAND_BOUNDS} from './island-profile.js';
export const WORLD_BOUNDS=ISLAND_BOUNDS;
export const polygonArea=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1];},0))/2;
export function insidePolygon(p,x,z){let hit=false;for(let i=0,j=p.length-1;i<p.length;j=i++)if((p[i][1]>z)!==(p[j][1]>z)&&x<(p[j][0]-p[i][0])*(z-p[i][1])/(p[j][1]-p[i][1])+p[i][0])hit=!hit;return hit;}
export function bankOutlines(expanded=true){
  const l=[],r=[];for(let z=-11;z<=11;z++){l.push([riverCenter(z)-riverHalfWidth(z),z]);r.push([riverCenter(z)+riverHalfWidth(z),z]);}
  const west=[[-16,-10.7],[-12.5,-11.3],[-4.7,-11.1],...l,[-8.8,11.1],[-14.4,10.3],[-16.6,7.4],[-16.9,1.2],[-16.3,-6.8]];
  const east=[...r.slice().reverse(),[11.3,-11.4],[15.9,-9.4],[16.8,-4],[16.9,2],[15.9,8.3],[14.1,10.8],[10,11.2]];
  if(!expanded)return{west,east};
  return islandBanks();
}
const outlines=bankOutlines();
const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
export function surfaceHeight(x,z,{mountain=true}={}){
  const q=Math.max(0,Math.min(9,-z-4)),rise=(q<.5?q*q:q>8.5?8.5-(9-q)*(9-q):q-.25)/8.5;
  const shelf=3.28*rise*smooth((x-15)/3)*(1-smooth((-z-16)/3));
  const height=Math.max(2.22+Math.max(shelf,foothillHeight(x,z)),mountain?mountainHeight(x,z):0);return height+(2.22-height)*communityBlend(x,z);
}
export function inWorld(x,z){return Number.isFinite(x)&&Number.isFinite(z)&&(insidePolygon(outlines.west,x,z)||insidePolygon(outlines.east,x,z));}
export function querySurface(x,z){
  if(groupPlotAt(x,z)>=0||Math.hypot(x-GROUP_QUEUE.x,z-GROUP_QUEUE.z)<.42)return{height:2.22,normal:{x:0,y:1,z:0},region:'group-plot',walkable:false};
  if(inCommunity(x,z))return{height:2.22,normal:{x:0,y:1,z:0},region:'community',walkable:inWorld(x,z)};
  if(onTerraceExtension(x,z)){const dx=x>16&&x<20?-.35:0,n=Math.hypot(dx,1);return{height:terraceHeight(x),normal:{x:-dx/n,y:1/n,z:0},region:'terrace-extension',walkable:true};}
  const height=surfaceHeight(x,z),e=.025,dx=(surfaceHeight(x+e,z)-surfaceHeight(x-e,z))/(2*e),dz=(surfaceHeight(x,z+e)-surfaceHeight(x,z-e))/(2*e),n=Math.hypot(dx,1,dz);
  let region='valley';if(x>16&&z>-5)region='plaza';if(x>=21&&x<=25.8&&z<=1&&z>-13)region='ramp';if(x>=18&&x<=25.8&&z<=-12&&z>=-15.8)region='terrace';if(z<-11&&region==='valley'||z<-16||x<21&&z<-5&&x>16&&region!=='terrace')region='mountain';
  const walkable=inWorld(x,z)&&region!=='mountain'&&Math.hypot(dx,dz)<=Math.tan(22*Math.PI/180)+1e-4;
  return {height,normal:{x:-dx/n,y:1/n,z:-dz/n},region,walkable};
}
export function landAreaAudit(){const old=bankOutlines(false),now=bankOutlines();const before=polygonArea(old.west)+polygonArea(old.east),after=polygonArea(now.west)+polygonArea(now.east);return{before,after,ratio:after/before,west:polygonArea(now.west),east:polygonArea(now.east)};}
