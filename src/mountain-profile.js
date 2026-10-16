import * as THREE from 'three';
import {riverCenter,riverHalfWidth,riverLevel,sampleRiver,RIVER_START,RIVER_JOIN} from './river-profile.js';

export const MOUNTAIN_RANGE={center:{x:-1,z:-22},width:36,height:13.5,depth:14,base:1.4,minX:-19,maxX:17,minZ:-29,maxZ:-15};
const smooth=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b);
const gaussian=(x,z,cx,cz,rx,rz)=>Math.exp(-(((x-cx)/rx)**2)-((z-cz)/rz)**2);
export function channelInfluence(x,z){
  if(z<RIVER_START-1.2||z>RIVER_JOIN)return 0;
  const d=Math.abs(x-riverCenter(z)),w=riverHalfWidth(z);
  return (1-smooth(w,w+1.25,d))*smooth(RIVER_START-1.2,RIVER_START-.45,z);
}
export function channelBed(x,z){const u=THREE.MathUtils.clamp((x-riverCenter(z))/riverHalfWidth(z),-1,1);return sampleRiver(u,z).bedY-.045;}
export function mountainHeight(x,z){
  const p=MOUNTAIN_RANGE,dx=(x+1)/18,dz=(z+22)/7;
  if(Math.abs(dx)>=1||Math.abs(dz)>=1)return p.base;
  const edge=(1-smooth(.7,1,Math.abs(dx)))*(1-smooth(.7,1,Math.abs(dz)));
  const relief=Math.max(gaussian(x,z,-7,-22.8,6.8,4.8),.72*gaussian(x,z,8,-23.4,6,4.7),.88*gaussian(x,z,-1,-25,14,7));
  let height=p.base+p.height*relief*edge;

  // Broad shallow strata and an explicit rear saddle keep the spring enclosed.
  height+=.28*Math.sin(x*.7+z*.8)*edge+.14*Math.sin(z*1.7-x*.35)*edge;
  const strata=Math.floor((height-p.base)/1.7)*1.7+p.base;
  height=THREE.MathUtils.lerp(height,strata+1.7*smooth(.18,.82,(height-strata)/1.7),.4);
  if(z<-25.9&&z>-28.5)height=Math.max(height,(1.4+11.6*gaussian(x,z,-1.4,-26.8,6.4,1.5))*edge);
  const weight=channelInfluence(x,z);return THREE.MathUtils.lerp(height,Math.min(height,channelBed(x,z)),weight);
}
export function foothillHeight(x,z){
  if(z>=-10.9||x<-21||x>18)return 0;
  const front=1-smooth(-15,-10.9,z),side=1-smooth(16,21,Math.abs(x+1));
  return .45*front*side;
}
/** Shared authored dry-channel silhouette for references and load-failure fallback. */
export function createMountainGeometry(columns=144,rows=84){
  const p=MOUNTAIN_RANGE,positions=[],colors=[],uv=[],indices=[];
  for(let j=0;j<=rows;j++)for(let i=0;i<=columns;i++){
    const x=p.minX+i/columns*p.width,z=p.minZ+j/rows*p.depth,y=mountainHeight(x,z);positions.push(x,y,z);uv.push(i/columns,j/rows);
    const slope=Math.hypot(mountainHeight(x+.05,z)-mountainHeight(x-.05,z),mountainHeight(x,z+.05)-mountainHeight(x,z-.05))/.1;
    const color=new THREE.Color(slope>.65?'#8c998d':'#82986b').multiplyScalar(.94+.06*Math.sin(y*3.8+x*.2));colors.push(color.r,color.g,color.b);
  }
  for(let j=0;j<rows;j++)for(let i=0;i<columns;i++){const a=j*(columns+1)+i,b=a+columns+1;indices.push(a,b,a+1,a+1,b,b+1);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
