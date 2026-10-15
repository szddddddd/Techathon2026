// A small, validated walking graph around each friend's home. Edges are checked
// along their entire length, not only at the destination.
export function buildWalkingGraph(context,slot,{range=3.2,step=.4}={}){
  const nodes=[{x:slot.x,z:slot.z,y:slot.y,links:[]}],seen=new Map([['0,0',0]]),queue=[[0,0,0]],padding=.12;
  const radius=slot.placementRadius??slot.radius+padding;
  const safe=(x,z)=>context.inspect(x,z,radius,[],{walking:true,manual:!!slot.manualPlacement});
  if(!safe(slot.x,slot.z).ok)return {nodes,radius};
  for(let q=0;q<queue.length;q++){
    const [ix,iz,index]=queue[q];
    for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1]]){
      const nx=ix+dx,nz=iz+dz;if(Math.hypot(nx*step,nz*step)>range)continue;
      const key=`${nx},${nz}`;let next=seen.get(key);
      if(next===-1)continue;
      const x=slot.x+nx*step,z=slot.z+nz*step;
      if(next===undefined){const check=safe(x,z);if(!check.ok){seen.set(key,-1);continue;}next=nodes.length;seen.set(key,next);nodes.push({x,z,y:check.y,links:[]});queue.push([nx,nz,next]);}
      const a=nodes[index];let clear=Math.abs(nodes[next].y-a.y)<=Math.hypot(x-a.x,z-a.z)*Math.tan(22*Math.PI/180)+.025;
      for(let t=.25;t<1;t+=.25)if(!safe(a.x+(x-a.x)*t,a.z+(z-a.z)*t).ok){clear=false;break;}
      if(clear&&!a.links.includes(next)){a.links.push(next);nodes[next].links.push(index);}
    }
  }
  return {nodes,radius};
}

export function walkingRoute(graph,start,sequence=0){
  const {nodes}=graph,parents=new Map([[start,-1]]),queue=[start];
  for(let i=0;i<queue.length;i++)for(const next of nodes[queue[i]].links)if(!parents.has(next)){parents.set(next,queue[i]);queue.push(next);}
  const origin=nodes[start];const candidates=queue.filter(i=>i!==start).sort((a,b)=>Math.hypot(nodes[b].x-origin.x,nodes[b].z-origin.z)-Math.hypot(nodes[a].x-origin.x,nodes[a].z-origin.z));
  if(!candidates.length)return [];
  let end=candidates[(sequence*7)%Math.min(12,candidates.length)],route=[];
  while(end!==start){route.push(end);end=parents.get(end);}return route.reverse();
}

export function canWalkStep(position,next,radius,others,gap=.6){
  return others.every(other=>{
    const dx=next.x-position.x,dz=next.z-position.z,d=dx*dx+dz*dz;
    const t=d?Math.max(0,Math.min(1,((other.x-position.x)*dx+(other.z-position.z)*dz)/d)):0;
    return Math.hypot(position.x+dx*t-other.x,position.z+dz*t-other.z)>=radius+other.radius+gap;
  });
}
