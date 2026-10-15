const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

// Keep the projected head position exact; only the small collision offset eases.
export function createAnchorLayout(){
  const states=new Map();let lastLayout=-Infinity,wasMoving=false;
  return {
    update(anchors,{now,moving,width,height,dt=1/60}){
      const ids=new Set(anchors.map(a=>a.id));for(const id of states.keys())if(!ids.has(id))states.delete(id);
      const items=anchors.filter(a=>a.visible).map(a=>{
        if(!states.has(a.id))states.set(a.id,{offset:0,target:0});
        const state=states.get(a.id),half=Math.min(width/2-8,(a.width||150)/2+10);
        return {...a,state,x:clamp(a.x,half,width-half),y:clamp(a.y,60,height-90)};
      });
      if(moving){
        // Reassigning a lane while orbiting reads as a sudden sideways jump.
        for(const item of items)item.state.target=item.state.offset;
      }else if(wasMoving||now-lastLayout>=120){
        lastLayout=now;const placed=[];
        for(const item of [...items].sort((a,b)=>a.id.localeCompare(b.id))){
          const crowded=items.some(other=>other!==item&&Math.abs(item.x-other.x)<((item.width||150)+(other.width||150))/2+24&&Math.abs(item.y-other.y)<100);
          const preferred=crowded?item.state.target:0;
          const candidates=[preferred,0,-38,38,-76,76,-114];let best=preferred,bestScore=Infinity;
          for(const candidate of candidates){
            const y=clamp(item.y+candidate,60,height-90),offset=y-item.y;
            const score=placed.reduce((sum,p)=>sum+(Math.abs(item.x-p.x)<((item.width||150)+p.width)/2+12?Math.max(0,34-Math.abs(y-p.y)):0),0);
            if(score<bestScore){bestScore=score;best=offset;}if(score===0)break;
          }
          item.state.target=best;placed.push({x:item.x,y:item.y+best,width:item.width||150});
        }
      }
      wasMoving=moving;
      const amount=1-Math.exp(-Math.min(.05,dt)/.12);
      return items.map(item=>{
        if(!moving)item.state.offset+=(item.state.target-item.state.offset)*amount;
        if(Math.abs(item.state.offset-item.state.target)<.02)item.state.offset=item.state.target;
        return {id:item.id,x:item.x,y:clamp(item.y+item.state.offset,60,height-90),offset:item.state.offset};
      });
    },
    clear(){states.clear();lastLayout=-Infinity;wasMoving=false;},
  };
}
