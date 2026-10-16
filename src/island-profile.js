import {CatmullRomCurve3,Vector3} from 'three';
import {riverCenter,riverHalfWidth,RIVER_END,RIVER_START} from './river-profile.js';

// Broad coastal bends are chipped into rock faces, shared by visuals and collision.
const mouth=side=>[riverCenter(RIVER_END)+side*riverHalfWidth(RIVER_END),RIVER_END];
const rear=[-1.4,-33.5];
function curve(points){
 const path=new CatmullRomCurve3(points.map(([x,z])=>new Vector3(x,0,z)),false,'centripetal');
 const count=Math.ceil(path.getLength()/2.6);
 return path.getSpacedPoints(count).map((p,i)=>{
  if(i===0||i===count)return [p.x,p.z];
  const tangent=path.getTangent(i/count),chip=.28*Math.sin(i*2.37)+.15*Math.cos(i*4.1);
  return [p.x-tangent.z*chip,p.z+tangent.x*chip];
 });
}
export const WEST_RIM=curve([mouth(-1),[-8,12],[-17,11],[-24,7],[-27,0],[-27,-11],[-24,-21],[-21,-29.5],[-12,-33],rear]);
export const EAST_RIM=curve([rear,[11,-33],[20,-29],[24,-21],[27,-11],[29.6,0],[28,8],[20,12],[11,12.3],mouth(1)]);
// Close the silhouette beneath the waterfall without moving its original lip.
export const ISLAND_OUTLINE=[...WEST_RIM,...EAST_RIM.slice(1)];
export const ISLAND_BOUNDS={minX:-28,maxX:30.5,minZ:-34,maxZ:13};
export function islandBanks(){
 const left=[],right=[],count=Math.ceil((RIVER_END-RIVER_START)/.45);
 for(let i=0;i<=count;i++){const z=RIVER_START+(RIVER_END-RIVER_START)*i/count;left.push([riverCenter(z)-riverHalfWidth(z),z]);right.push([riverCenter(z)+riverHalfWidth(z),z]);}
 const divide=[riverCenter(RIVER_START),RIVER_START-.65];
 return {west:[...left,...WEST_RIM.slice(1),divide],east:[...right.slice().reverse(),divide,...EAST_RIM.slice(0,-1)]};
}
