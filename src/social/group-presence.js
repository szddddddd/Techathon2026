import {GROUP_CAPACITY} from '../scenes/shared/community-layout.js';
import {GROUP_TYPES,groupUnread} from './group-catalog.js';

/** Active groups occupy available buildings; overflow remains in the queue. */
export function createGroupPresence({theme='forest'}={}){
 const scenes=new Map();let serial=0,cachedState,cached;
 const current=()=>{if(!scenes.has(theme))scenes.set(theme,{entries:new Map(),queue:[],types:GROUP_TYPES.map(t=>t.id)});return scenes.get(theme);};
 function update({state,activeGroup},now=performance.now(),reduced=false){
  const s=current();
  if(cachedState!==state){
   const groups=state.groups.filter(g=>!g.leftAt),byId=new Map(groups.map(g=>[g.id,g]));
   const pins=(state.pinnedGroups||[]).filter(id=>byId.has(id)).slice(0,GROUP_CAPACITY),pinned=new Set(pins);
   const unread=new Map(groups.map(g=>[g.id,groupUnread(state,g.id)]));
   const first=new Map(groups.map(g=>[g.id,unread.get(g.id).reduce((time,m)=>Math.min(time,m.createdAt),Infinity)]));
   const waiting=groups.filter(g=>!pinned.has(g.id)).sort((a,b)=>Number(!!unread.get(b.id).length)-Number(!!unread.get(a.id).length)||first.get(a.id)-first.get(b.id)||a.id.localeCompare(b.id));
   cachedState=state;cached={byId,pins,pinned,unread,waiting};
  }
  const {byId,pins,pinned,unread,waiting}=cached;
  for(const [id,e]of s.entries){
   if(!byId.has(id)){s.entries.delete(id);continue;}
   s.types[e.slot]=byId.get(id).type;e.unread=unread.get(id).length;e.pinned=pinned.has(id);e.selected=id===activeGroup;
   // Reading does not detach the conversation from its visible building.
   e.releaseAt=null;
   if(e.phase==='entering'){const t=Math.min(1,(now-e.start)/(reduced?80:320));e.alpha=e.from+(1-e.from)*t;if(t===1)e.phase='present';}
   if(e.phase==='leaving'){const t=Math.min(1,(now-e.start)/(reduced?80:220));e.alpha=e.from*(1-t);if(t===1)s.entries.delete(id);}
  }
  function acquire(id,isPinned){
   if(s.entries.has(id))return;
   const used=new Map([...s.entries.values()].map(e=>[e.slot,e]));
   const saved=state.groupBuildingSlots?.[theme]?.[id];
   let slot=isPinned&&Number.isInteger(saved)&&saved>=0&&saved<GROUP_CAPACITY&&!used.has(saved)?saved:-1;
   if(slot<0){slot=s.types.findIndex((type,i)=>!used.has(i)&&type===byId.get(id).type);if(slot<0)slot=s.types.findIndex((_,i)=>!used.has(i));}
   if(slot<0&&isPinned){const victim=[...s.entries.values()].filter(e=>!pinned.has(e.id)).sort((a,b)=>b.enteredOrder-a.enteredOrder)[0];if(victim){slot=victim.slot;s.entries.delete(victim.id);}}
   if(slot<0)return;
   s.types[slot]=byId.get(id).type;
   s.entries.set(id,{id,slot,phase:'entering',alpha:0,from:0,start:now,releaseAt:null,enteredOrder:++serial,unread:unread.get(id).length,pinned:isPinned,selected:id===activeGroup});
  }
  for(const id of pins)acquire(id,true);
  for(const g of waiting)acquire(g.id,false);
  s.queue=waiting.filter(g=>!s.entries.has(g.id)).map(g=>g.id);
  return snapshot();
 }
 function snapshot(){const s=current();return{entries:[...s.entries.values()].map(e=>({...e})),queue:[...s.queue],buildings:s.types.map((type,slot)=>({slot,type,groupId:[...s.entries.values()].find(e=>e.slot===slot)?.id||null}))};}
 return{update,snapshot,setScene(next){theme=next;cachedState=null;cached=null;current();}};
}
