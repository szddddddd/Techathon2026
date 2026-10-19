import {CYBER_LAYOUT,cyberPlotAt,cyberObstacleAt} from './cyber-layout.js';
export const CYBER_OUTLINE=[[-25,-23],[-16,-24],[-7,-23.5],[2,-24],[12,-23.8],[22,-23],[27,-19],[28,-10],[29,1],[28,11],[24,19],[15,21],[6,22],[-4,21.5],[-14,22],[-24,19],[-28,12],[-29,2],[-28,-8],[-28,-17]];
export const CYBER_BOUNDS={minX:-29,maxX:29,minZ:-24,maxZ:22};
export const CYBER_AREA=Math.abs(CYBER_OUTLINE.reduce((s,a,i)=>{const b=CYBER_OUTLINE[(i+1)%CYBER_OUTLINE.length];return s+a[0]*b[1]-b[0]*a[1];},0))/2;
export function inCyberWorld(x,z){if(!Number.isFinite(x)||!Number.isFinite(z))return false;let yes=false;for(let i=0,j=CYBER_OUTLINE.length-1;i<CYBER_OUTLINE.length;j=i++){const a=CYBER_OUTLINE[i],b=CYBER_OUTLINE[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export const cyberHeight=()=>CYBER_LAYOUT.height;
export function queryCyberSurface(x,z){const normal={x:0,y:1,z:0},height=cyberHeight(x,z);let region='cyber-town',walkable=true;if(!inCyberWorld(x,z)){region='outside';walkable=false;}else if(cyberPlotAt(x,z)>=0){region='group-plot';walkable=false;}else{const obstacle=cyberObstacleAt(x,z);if(obstacle){region='cyber-'+obstacle;walkable=false;}}return{height,normal,region,walkable};}
export function cyberCanWalkStep(from,to,r=.22){const length=Math.hypot(to.x-from.x,to.z-from.z),steps=Math.max(1,Math.ceil(length/.2));for(let i=0;i<=steps;i++){const x=from.x+(to.x-from.x)*i/steps,z=from.z+(to.z-from.z)*i/steps;if(!queryCyberSurface(x,z).walkable||cyberPlotAt(x,z,r)>=0||cyberObstacleAt(x,z,r))return false;}return true;}
