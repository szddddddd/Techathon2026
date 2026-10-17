import * as T from 'three';
import {ISLAND_OUTLINE} from './island-profile.js';
import {riverCenter,riverHalfWidth,riverLevel,riverDepth,RIVER_END} from './river-profile.js';

/** One fractured, tapering rock volume under both banks. */
export function createFloatingIsland(height){
 const rim=[];
 for(let i=0;i<ISLAND_OUTLINE.length;i++){
  const a=ISLAND_OUTLINE[i],b=ISLAND_OUTLINE[(i+1)%ISLAND_OUTLINE.length],steps=Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/2.8);
  for(let j=0;j<steps;j++)rim.push([T.MathUtils.lerp(a[0],b[0],j/steps),T.MathUtils.lerp(a[1],b[1],j/steps)]);
 }
 const positions=[],colors=[],indices=[],n=rim.length;
 const rings=[{s:1,lip:0},{s:.995,lip:.55},{s:.96,y:-1.2},{s:.9,y:-3.4},{s:.79,y:-6.0},{s:.62,y:-8.6},{s:.4,y:-11.2},{s:.14,y:-13.2}];
 for(let row=0;row<rings.length;row++)for(let i=0;i<n;i++){
  const [x,z]=rim[i],r=rings[row],angle=Math.atan2(z+9,x),w=riverHalfWidth(RIVER_END),u=(x-riverCenter(RIVER_END))/w;
  const mouth=(1-T.MathUtils.smoothstep(Math.abs(u),.94,1.02))*T.MathUtils.smoothstep(z,10.7,RIVER_END);
  const lip=T.MathUtils.lerp(height(x,z),riverLevel(RIVER_END)-riverDepth(T.MathUtils.clamp(u,-1,1),RIVER_END)-.12,mouth);
  const envelope=row>1?Math.sin(row/rings.length*Math.PI):0;
  const variation=(Math.sin(angle*3+.6)*1.1+Math.cos(angle*7+row*.4)*.55)*envelope;
  const wantedY=r.y===undefined?lip-r.lip:r.y+variation;
  const y=row?Math.min(wantedY,positions[((row-1)*n+i)*3+1]-.25):wantedY;
  const fracture=1+envelope*(.04*Math.sin(angle*7+row*.6)+.025*Math.cos(angle*11));
  positions.push(x*r.s*fracture+(1-r.s)*2,y,-9+(z+9)*r.s*fracture);
  const color=new T.Color(row===0?0x839c46:row===1?0x8d9770:row<4?0x8b9688:row<6?0x74887e:0x60766f);
  color.multiplyScalar(.94+.08*Math.sin(angle*8+row*.7));colors.push(color.r,color.g,color.b);
 }
 for(let row=0;row<rings.length-1;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n,c=a+n,d=b+n;indices.push(a,b,c,b,d,c);}
 const bottom=positions.length/3;positions.push(2,-14.25,-9);const c=new T.Color(0x5e776f);colors.push(c.r,c.g,c.b);
 for(let i=0;i<n;i++)indices.push((rings.length-1)*n+i,(rings.length-1)*n+(i+1)%n,bottom);
 // Keep the continuous sealed taper, without separate hanging rock spikes.
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,side:T.DoubleSide}));mesh.name='Continuous floating island rock';mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.floatingIsland=true;
 return mesh;
}
