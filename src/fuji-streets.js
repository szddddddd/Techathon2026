import {projectRail,CROSSING} from './fuji-railway.js';

export function closestStreet(x,z,path){
 let best={distance:Infinity};for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1))),px=a[0]+dx*u,pz=a[1]+dz*u,distance=Math.hypot(x-px,z-pz);if(distance<best.distance)best={x:px,z:pz,distance};}return best;
}
export const streetDistance=(x,z,path)=>closestStreet(x,z,path).distance-path.width/2;
export function boxContains(p,x,z,pad=0){const c=Math.cos(p.rotation||0),s=Math.sin(p.rotation||0),dx=x-p.x,dz=z-p.z;return Math.abs(dx*c-dz*s)<(p.width??4)/2+pad&&Math.abs(dx*s+dz*c)<(p.depth??3.5)/2+pad;}

/** A small startup-only grid connects entrances; rendered roads and navigation
 * then consume the exact same polylines. No search runs in the frame loop. */
export function connectTownStreets(layout){
 const buildings=[...layout.slots,...layout.shops,layout.shrine,layout.station];
 const safe=(x,z)=>{const rail=projectRail(x,z);return x>-26&&x<28&&z>-19&&z<11.7&&Math.hypot((x-2)/18,(z+25.2)/11)>1.02&&!buildings.some(p=>boxContains(p,x,z,p.index!==undefined?.76:1.04))&&(rail.distance>2.25||Math.abs(rail.d-CROSSING.d)<1.1);};
 const lineSafe=(a,b)=>{const n=Math.max(1,Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.18));for(let i=0;i<=n;i++)if(!safe(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;return true;};
 const entries=[...layout.slots.map(p=>({id:'fuji-door-'+p.index,...p.entry})),...layout.shops.map((p,i)=>({id:'shop-door-'+i,x:p.x+2.9*Math.sin(p.rotation),z:p.z+2.9*Math.cos(p.rotation)})),{id:'shrine-lane',x:layout.shrine.x+2.9*Math.sin(layout.shrine.rotation),z:layout.shrine.z+2.9*Math.cos(layout.shrine.rotation)},{id:'station-entry',x:layout.station.x-2.3*Math.sin(layout.station.rotation),z:layout.station.z-2.3*Math.cos(layout.station.rotation)}];
 entries.push({id:'garden-lane',x:layout.gatheringCenter.x+2.3,z:layout.gatheringCenter.z});
 const cache=new Map(),step=.4;
 for(const entry of entries){
  const nearest=p=>layout.paths.map(path=>closestStreet(p.x,p.z,path)).sort((a,b)=>a.distance-b.distance)[0];
  const direct=nearest(entry);let points;
  if(lineSafe(entry,direct))points=[[entry.x,entry.z],[direct.x,direct.z]];
  else{
   const open=[{...entry,key:'start',g:0,f:direct.distance,parent:null}],cost=new Map([['start',0]]);let found;
   for(let count=0;open.length&&count<14000;count++){
    open.sort((a,b)=>b.f-a.f);const p=open.pop();if(p.g!==cost.get(p.key))continue;const goal=nearest(p);
    if(goal.distance<.7&&lineSafe(p,goal)){found={...goal,parent:p};break;}
    const ix=Math.round(p.x/step),iz=Math.round(p.z/step);
    for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
     const x=(ix+dx)*step,z=(iz+dz)*step,key=(ix+dx)+','+(iz+dz);let ok=cache.get(key);if(ok===undefined){ok=safe(x,z);cache.set(key,ok);}if(!ok||!lineSafe(p,{x,z}))continue;
     const g=p.g+Math.hypot(x-p.x,z-p.z);if(g>=(cost.get(key)??Infinity))continue;cost.set(key,g);open.push({x,z,key,g,f:g+nearest({x,z}).distance,parent:p});
    }
   }
   if(!found)throw Error('No walkable street connection for '+entry.id);
   const chain=[];for(let p=found;p;p=p.parent)chain.push(p);chain.reverse();const simplified=[chain[0]];
   for(let i=0;i<chain.length-1;){let j=chain.length-1;while(j>i+1&&!lineSafe(chain[i],chain[j]))j--;simplified.push(chain[j]);i=j;}points=simplified.map(p=>[p.x,p.z]);
  }
  if(Math.hypot(points[0][0]-points.at(-1)[0],points[0][1]-points.at(-1)[1])>.04)layout.paths.push({id:entry.id,width:1.6,kind:'stone',points});
 }
}

/** Deterministic furnishing layout, evaluated once alongside the street plan. */
export function arrangeStreetFurniture(layout){
 const buildings=[...layout.slots,...layout.shops,layout.shrine,layout.station],used=[{...layout.gatheringCenter,radius:2.1}];
 for(const key of['cars','facilities','recordPlayer','queue','vending','bicycles','benches','gardens','lamps','planters','trees','zenGardens','notice','bamboo']){
  const values=Array.isArray(layout[key])?layout[key]:key==='facilities'?Object.values(layout[key]):[layout[key]];
  for(const p of values){
   if(p.id===layout.gatheringTreeId){Object.assign(p,layout.gatheringCenter);continue;}
   const radius=key==='trees'?p.height*.4:key==='bamboo'?1.25:key==='notice'?1.05:key==='facilities'?1.35:key==='gardens'?Math.hypot(p.width,p.depth)/2:key==='cars'?1.1:key==='bicycles'?1.15:key==='benches'?.95:key==='zenGardens'?1.3:.55;
   const choices=[];for(let dx=-8;dx<=8;dx+=.4)for(let dz=-8;dz<=8;dz+=.4)choices.push({x:p.x+dx,z:p.z+dz,d:Math.hypot(dx,dz)});choices.push({...p,d:0});choices.sort((a,b)=>a.d-b.d);
   const next=choices.find(c=>{
    if(c.x< -25||c.x>Math.min(27,29+(c.z+9)*.3)||c.z< -18.5||c.z>11||Math.hypot((c.x-2)/18,(c.z+25.2)/11)<1.03)return false;
    const rail=projectRail(c.x,c.z);if(rail.distance<1.5+radius||Math.abs(rail.d-CROSSING.d)<3+radius&&rail.distance<5)return false;
    if(buildings.some(b=>boxContains(b,c.x,c.z,radius+.15)))return false;
    const streetClearance=key==='trees'?.5:radius+.2;
    if(layout.paths.some(path=>streetDistance(c.x,c.z,path)<streetClearance))return false;
    return !used.some(o=>Math.hypot(c.x-o.x,c.z-o.z)<(key==='trees'&&o.tree?1.8:radius+o.radius+.2));
   });
   if(!next)throw Error('No street-side space for '+key+' '+(p.id||''));
   p.x=next.x;p.z=next.z;used.push({x:p.x,z:p.z,radius:key==='trees'?.4:radius,tree:key==='trees'});
  }
 }
 layout.parking=layout.cars.map(p=>({...p,width:1.5,depth:2.3}));
}
