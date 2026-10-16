import * as THREE from 'three';

const smooth=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b);
export const RIVER_START=-25.5,RIVER_JOIN=-11.06,RIVER_END=11.06;
export const UPPER_CASCADES=[{z:-22.8,length:.55,drop:1},{z:-19.8,length:.65,drop:1.2},{z:-16.5,length:.5,drop:.8}];
const originalCenter=z=>.9+Math.sin(z*.36)*.68;
const centerKeys=[[-25.5,-1.4],[-23,-.4],[-20,1.8],[-17,-.6],[-14,1.05],[-11.06,originalCenter(-11.06)]];
export function riverCenter(z){
  if(z>=RIVER_JOIN)return originalCenter(z);if(z<=RIVER_START)return centerKeys[0][1];
  for(let i=1;i<centerKeys.length;i++)if(z<=centerKeys[i][0]){const [a,x]=centerKeys[i-1],[b,y]=centerKeys[i];return THREE.MathUtils.lerp(x,y,smooth(a,b,z));}
}
const originalWidth=z=>.7*(4.9+Math.sin(z*.6)*.24);
export const riverHalfWidth=z=>z>=RIVER_JOIN?originalWidth(z):THREE.MathUtils.lerp(.62,originalWidth(RIVER_JOIN),smooth(RIVER_START,RIVER_JOIN,z))+.3*Math.exp(-(((z-RIVER_START)/.85)**2));
export function riverLevel(z){
  if(z>=RIVER_JOIN)return .22+.16*(1-smooth(-10,-2,z))-.3*smooth(4.8,5.4,z);
  return 10.2-6.82*smooth(RIVER_START,RIVER_JOIN,z)-UPPER_CASCADES.reduce((sum,c)=>sum+c.drop*smooth(c.z-c.length/2,c.z+c.length/2,z),0);
}
export const riverDepth=(u,z)=>{const f=Math.pow(Math.max(0,1-u*u),1.6),lower=.17+.94*f+.05*Math.sin(z*.8)*(1-u*u),upper=.13+.32*f;return THREE.MathUtils.lerp(upper,lower,smooth(-17,RIVER_JOIN,z));};
export function sampleRiver(u,z){const y=riverLevel(z);return{x:riverCenter(z)+u*riverHalfWidth(z),y,z,depth:riverDepth(u,z),bedY:y-riverDepth(u,z)};}
export const riverWave=(x,z,time,u=0)=>.045*(Math.sin(z*2.1-time*1.15+x*1.3)*.65+Math.sin(z*3.6-time*1.8-x*2)*.35)*(1-Math.pow(Math.abs(u),6))*(1-smooth(10.55,RIVER_END,z));
