import {fujiPlotAt,fujiObstacleAt} from './fuji-layout.js';

import {COMPACT_FUJI_OUTLINE} from './fuji-island-outline.js';
export const FUJI_OUTLINE=COMPACT_FUJI_OUTLINE;
export const FUJI_BOUNDS={minX:Math.min(...FUJI_OUTLINE.map(p=>p[0])),maxX:Math.max(...FUJI_OUTLINE.map(p=>p[0])),minZ:Math.min(...FUJI_OUTLINE.map(p=>p[1])),maxZ:Math.max(...FUJI_OUTLINE.map(p=>p[1]))};
export const FUJI_AREA=Math.abs(FUJI_OUTLINE.reduce((sum,a,i)=>{const b=FUJI_OUTLINE[(i+1)%FUJI_OUTLINE.length];return sum+a[0]*b[1]-b[0]*a[1];},0))/2;
export {FUJI_RAIL} from './fuji-railway.js';
import {FUJI_RAIL,RAIL_FENCE,projectRail,CROSSING} from './fuji-railway.js';
// Compatibility only. New collision and rolling stock use the same measured curve.
export function fujiRailZ(x){let z=0;for(let i=0;i<3;i++)z=projectRail(x,z).z;return z;}
export const FUJI_MOUNTAIN={x:2,z:-25.2,height:16.5,radiusX:18,radiusZ:11};
export function inFujiWorld(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return false;
 let inside=false;for(let i=0,j=FUJI_OUTLINE.length-1;i<FUJI_OUTLINE.length;j=i++){
  const a=FUJI_OUTLINE[i],b=FUJI_OUTLINE[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }return inside;
}
export function fujiHeight(x,z){
 const m=FUJI_MOUNTAIN,dx=(x-m.x)/m.radiusX,dz=(z-m.z)/m.radiusZ,r=Math.hypot(dx,dz),angle=Math.atan2(dz,dx);
 // The broad volcanic skirt rises into one recognizable, gently truncated cone.
 const flank=Math.max(0,1-r),ridge=1+.035*Math.cos(angle*9)*Math.sin(Math.min(1,r)*Math.PI);
 return 2.22+m.height*Math.min(.94,Math.pow(flank,1.38)*ridge);
}
export function queryFujiSurface(x,z,{walking=false}={}){
 const height=fujiHeight(x,z),normal={x:0,y:1,z:0};
 if(!inFujiWorld(x,z))return{height,normal,region:'outside',walkable:false};
 const rail=projectRail(x,z);if(rail.distance<FUJI_RAIL.halfWidth+RAIL_FENCE.thickness/2)return{height:2.22,normal,region:'railway',walkable:walking&&Math.abs(rail.d-CROSSING.d)<CROSSING.width/2};
 if(height>2.27)return{height,normal,region:'fuji-mountain',walkable:false};
 if(fujiPlotAt(x,z)>=0)return{height,normal,region:'group-plot',walkable:false};
 const obstacle=fujiObstacleAt(x,z);if(obstacle)return{height,normal,region:'fuji-'+obstacle,walkable:false};
 return{height,normal,region:'sakura-town',walkable:true};
}
