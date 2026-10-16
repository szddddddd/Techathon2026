import {GROUP_CAPACITY} from './community-layout.js';
import {groupUnread} from './group-catalog.js';
/** Stable courtyard slots. Decisions happen on state changes; only fades advance per frame. */
export function createGroupPresence(){
 const entries=new Map();let state,active=null,visible=false,queue=[],lastState,lastActive,lastVisible;
 function eligible(){return (state.groups||[]).filter(g=>!g.leftAt&&(state.residentGroups.includes(g.id)||(groupUnread(state,g.id).length&&!(visible&&active===g.id&&!entries.has(g.id))))).sort((a,b)=>Number(state.residentGroups.includes(b.id))-Number(state.residentGroups.includes(a.id))||(groupUnread(state,a.id)[0]?.createdAt||a.createdAt)-(groupUnread(state,b.id)[0]?.createdAt||b.createdAt)||a.id.localeCompare(b.id));}
 function reconcile(input,now=performance.now()){
  state=input.state;active=input.activeGroup;visible=input.chatVisible;
  const wanted=eligible(),ids=new Set(wanted.map(g=>g.id));
  for(const [id,e] of entries){const valid=state.groups.some(g=>g.id===id&&!g.leftAt),hold=valid&&active===id;
   e.unread=groupUnread(state,id).length;e.resident=state.residentGroups.includes(id);e.selected=hold;
   if(valid&&(ids.has(id)||hold)&&(!e.evicted||e.resident||hold)){e.evicted=false;if(e.phase==='leaving'||e.phase==='waiting'){e.phase='entering';e.from=e.alpha;e.start=now;}}
   else if(e.phase!=='waiting'&&e.phase!=='leaving'){e.phase='waiting';e.start=now;}
  }
  // A new resident can displace an idle unread occupant, never the active chat.
  const awaitingResident=wanted.find(g=>state.residentGroups.includes(g.id)&&!entries.has(g.id));
  if(awaitingResident&&entries.size===GROUP_CAPACITY&&!Array.from(entries.values()).some(e=>e.phase==='leaving')){const victim=[...entries.values()].reverse().find(e=>!e.resident&&e.id!==active);if(victim){victim.phase='leaving';victim.from=victim.alpha;victim.start=now;victim.evicted=true;}}
  for(const g of wanted){if(entries.size>=GROUP_CAPACITY)break;if(entries.has(g.id))continue;const used=new Set([...entries.values()].map(e=>e.slot));let slot=0;while(used.has(slot))slot++;entries.set(g.id,{id:g.id,slot,phase:'entering',alpha:0,from:0,start:now,unread:groupUnread(state,g.id).length,resident:state.residentGroups.includes(g.id),selected:g.id===active});}
  queue=wanted.filter(g=>!entries.has(g.id)).map(g=>g.id);
 }
 function update(input,now=performance.now(),reduced=false){
  if(lastState!==input.state||lastActive!==input.activeGroup||lastVisible!==input.chatVisible){reconcile(input,now);lastState=input.state;lastActive=input.activeGroup;lastVisible=input.chatVisible;}
  let changed=false;
  for(const [id,e] of entries){
   if(e.phase==='waiting'&&now-e.start>=800){e.phase='leaving';e.from=e.alpha;e.start=now;}
   if(e.phase==='entering'){const t=Math.min(1,(now-e.start)/(reduced?80:500));e.alpha=e.from+(1-e.from)*t;if(t===1)e.phase='present';}
   if(e.phase==='leaving'){const t=Math.min(1,(now-e.start)/(reduced?80:450));e.alpha=e.from*(1-t);if(t===1){entries.delete(id);changed=true;}}
  }
  if(changed)reconcile(input,now);
  return snapshot();
 }
 const snapshot=()=>({entries:[...entries.values()].map(e=>({...e})),queue:[...queue]});return{update,snapshot};
}
