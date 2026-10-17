import * as T from 'three';

export const FUJI_CARRIAGE={length:3,height:1.28,width:1.18,spacing:3.55,wheelRadius:.30,wheelOffset:.51};

// One measured curve drives track geometry, rolling stock and collision queries.
export const FUJI_RAIL={halfWidth:1.5,points:[[-26,-15],[-18,-12],[-10,-8],[-2,-4],[7,.5],[16,5],[27,9]],loopSeconds:70,stationSeconds:8};
const first=FUJI_RAIL.points[0],last=FUJI_RAIL.points.at(-1);
export const railCurve=new T.CatmullRomCurve3([[-40,-20.25],...FUJI_RAIL.points,[41,14.1]].map(([x,z])=>new T.Vector3(x,2.5,z)),false,'centripetal');
railCurve.arcLengthDivisions=2400;
export const railLength=railCurve.getLength();
export const sampleRail=d=>railCurve.getPointAt(T.MathUtils.clamp(d/railLength,0,1));
export const railTangent=d=>railCurve.getTangentAt(T.MathUtils.clamp(d/railLength,0,1));
const samples=Array.from({length:801},(_,i)=>({d:railLength*i/800,p:sampleRail(railLength*i/800)}));
export function projectRail(x,z){
 let best={distance:Infinity};
 // This route is a shallow, monotonic diagonal. Narrow the nearest sample
 // before projecting segments; no per-frame full-curve scan or raycasting.
 let lo=0,hi=samples.length-1;const sq=i=>(samples[i].p.x-x)**2+(samples[i].p.z-z)**2;
 while(hi-lo>8){const a=Math.floor(lo+(hi-lo)/3),b=Math.ceil(hi-(hi-lo)/3);if(sq(a)<sq(b))hi=b;else lo=a;}
 for(let i=Math.max(1,lo);i<=Math.min(samples.length-1,hi+1);i++){const a=samples[i-1],b=samples[i],dx=b.p.x-a.p.x,dz=b.p.z-a.p.z,u=T.MathUtils.clamp(((x-a.p.x)*dx+(z-a.p.z)*dz)/(dx*dx+dz*dz),0,1),px=a.p.x+dx*u,pz=a.p.z+dz*u,distance=Math.hypot(x-px,z-pz);if(distance<best.distance)best={distance,d:a.d+(b.d-a.d)*u,x:px,z:pz};}
 return best;
}
export const RAIL_START=projectRail(...first).d,RAIL_END=projectRail(...last).d;
export const CROSSING={d:projectRail(-6,-6).d,width:3.8,clearance:2.6};
export const STATION={center:projectRail(13,3.5).d,stop:projectRail(16.4,5.2).d,length:12};
// Two platform openings line up with the forward vestibule of each stopped coach.
// These are boarding apertures, not additional pedestrian crossings of the track.
export const PLATFORM_BOARDING=[1,2].map(coach=>({coach,d:STATION.stop-coach*FUJI_CARRIAGE.spacing+1,width:1.35}));
export function railOffset(d,offset){const p=sampleRail(d),t=railTangent(d);return{x:p.x-t.z*offset,z:p.z+t.x*offset,rotation:-Math.atan2(t.z,t.x)};}
export function inCrossing(x,z,padding=0){const p=projectRail(x,z);return Math.abs(p.d-CROSSING.d)<CROSSING.width/2+padding&&p.distance<CROSSING.clearance+padding;}

/** Shared barrier footprint and the sole pedestrian opening. */
export const RAIL_FENCE={offset:1.5,thickness:.14,height:.98,opening:CROSSING.width/2+.24};
export function railwayStepAllowed(from,to,radius=0){
 const length=Math.hypot(to.x-from.x,to.z-from.z),steps=Math.max(1,Math.ceil(length/.18));
 for(let i=0;i<=steps;i++){const t=i/steps,p=projectRail(from.x+(to.x-from.x)*t,from.z+(to.z-from.z)*t);
  if(p.distance<FUJI_RAIL.halfWidth+RAIL_FENCE.thickness/2+radius&&Math.abs(p.d-CROSSING.d)>CROSSING.width/2-radius)return false;
 }return true;
}
export function railwayFencePoint(d,side){
 // The platform already occupies the northern shoulder; keep the barrier on
 // its track-facing edge instead of placing it through the platform centre.
 const edge=Math.abs(d-STATION.center),blend=side<0?Math.max(0,Math.min(1,(7.6-edge)/1.8)):0;
 return {...railOffset(d,side*(RAIL_FENCE.offset-.52*blend)),base:2.22+.36*blend,height:RAIL_FENCE.height-.22*blend};
}
export function railwayFenceSections(){
 const sections=[];
 for(const side of[-1,1]){
  const gaps=[{d:CROSSING.d,width:RAIL_FENCE.opening*2},...(side<0?PLATFORM_BOARDING:[])].sort((a,b)=>a.d-b.d);
  let cursor=RAIL_START+2.4;const spans=[];
  for(const gap of gaps){spans.push([cursor,gap.d-gap.width/2]);cursor=gap.d+gap.width/2;}
  spans.push([cursor,RAIL_END-2.4]);
  for(const [start,end]of spans){
  const count=Math.ceil((end-start)/1.35),points=Array.from({length:count+1},(_,i)=>railwayFencePoint(start+(end-start)*i/count,side));sections.push({side,start,end,points});
  }
 }return sections;
}
