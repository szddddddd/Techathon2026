import {GROUP_CAPACITY} from './community-layout.js';
import {groupUnread,recentGroups} from './group-catalog.js';
/** The latest nine conversations stay after reading; retained groups keep their slots. */
export function createGroupPresence(){
 const entries=new Map();let queue=[],lastState,lastActive;
 function reconcile(input,now){
  const {state,activeGroup}=input,ranked=recentGroups(state),wanted=ranked.slice(0,GROUP_CAPACITY),ids=new Set(wanted.map(g=>g.id));
  for(const [id,e] of entries){
   e.unread=groupUnread(state,id).length;e.selected=id===activeGroup;
   if(ids.has(id)){if(e.phase==='leaving'){e.phase='entering';e.from=e.alpha;e.start=now;}}
   else if(e.phase!=='leaving'){e.phase='leaving';e.from=e.alpha;e.start=now;}
  }
  for(const g of wanted){
   if(entries.size>=GROUP_CAPACITY)break;if(entries.has(g.id))continue;
   const used=new Set([...entries.values()].map(e=>e.slot));let slot=0;while(used.has(slot))slot++;
   entries.set(g.id,{id:g.id,slot,phase:'entering',alpha:0,from:0,start:now,unread:groupUnread(state,g.id).length,selected:g.id===activeGroup});
  }
  queue=ranked.slice(GROUP_CAPACITY).map(g=>g.id);
 }
 function update(input,now=performance.now(),reduced=false){
  if(lastState!==input.state||lastActive!==input.activeGroup){reconcile(input,now);lastState=input.state;lastActive=input.activeGroup;}
  let changed=false;
  for(const [id,e] of entries){
   if(e.phase==='entering'){const t=Math.min(1,(now-e.start)/(reduced?80:500));e.alpha=e.from+(1-e.from)*t;if(t===1)e.phase='present';}
   if(e.phase==='leaving'){const t=Math.min(1,(now-e.start)/(reduced?80:450));e.alpha=e.from*(1-t);if(t===1){entries.delete(id);changed=true;}}
  }
  if(changed)reconcile(input,now);
  return snapshot();
 }
 const snapshot=()=>({entries:[...entries.values()].map(e=>({...e})),queue:[...queue]});return{update,snapshot};
}
