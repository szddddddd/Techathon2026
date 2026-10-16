import * as THREE from 'three';

export const riverCenter=z=>.9+Math.sin(z*.36)*.68;
export const riverHalfWidth=z=>.7*(4.9+Math.sin(z*.6)*.24)*(z<-11.06?1-.55*THREE.MathUtils.smoothstep(-z,11.06,23):1);
export const RIVER_START=-28,RIVER_END=11.06;
const smooth=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b);
export const riverLevel=z=>.22+.16*(1-smooth(-10,-2,z))-.3*smooth(4.8,5.4,z)+(z<-11.06?1.6*smooth(11.06,23,-z):0);
export const riverDepth=(u,z)=>.17+.94*Math.pow(Math.max(0,1-u*u),1.6)+.05*Math.sin(z*.8)*(1-u*u);
export function sampleRiver(u,z){const y=riverLevel(z);return{x:riverCenter(z)+u*riverHalfWidth(z),y,z,depth:riverDepth(u,z),bedY:y-riverDepth(u,z)};}
export const riverWave=(x,z,time,u=0)=>.045*(Math.sin(z*2.1-time*1.15+x*1.3)*.65+Math.sin(z*3.6-time*1.8-x*2)*.35)*(1-Math.pow(Math.abs(u),6))*(1-smooth(10.55,RIVER_END,z));
