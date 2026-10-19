export function unreadCounts(state){
  const counts=new Map(state.friends.map(id=>[id,0]));
  for(const m of state.messages)if(!m.read&&m.senderId!=='me'&&counts.has(m.friendId))counts.set(m.friendId,counts.get(m.friendId)+1);
  return counts;
}

export function conversationIds(state){
  const last=new Map(),pinned=new Set(state.pinnedFriends||[]);
  for(const m of state.messages)last.set(m.friendId,Math.max(last.get(m.friendId)||0,m.createdAt));
  return [...state.friends].sort((a,b)=>Number(pinned.has(b))-Number(pinned.has(a))||(last.get(b)||0)-(last.get(a)||0)||state.friends.indexOf(a)-state.friends.indexOf(b));
}

export function unreadTier(n){return n>=20?4:n>=6?3:n>=2?2:n?1:0;}

export const FRIEND_SCENE_CAPACITY=9;
export function recentFriendIds(state){
  const last=new Map();for(const m of state.messages)last.set(m.friendId,Math.max(last.get(m.friendId)??-Infinity,m.createdAt));
  for(const id of state.friends){const f=state.customFriends?.[id];if(f?.externalContactId&&f.modelUrl)last.set(id,Math.max(last.get(id)||0,f.createdAt||0));}
  return state.friends.filter(id=>last.has(id)).sort((a,b)=>last.get(b)-last.get(a)||a.localeCompare(b));
}

/** Latest conversations stay in the forest after reading, independently of list pins. */
export function createPresenceController(){
  const entries=new Map();let generation=0,input=null;
  function reconcile({state,activeFriend=null,now=performance.now()}){
    input={state,activeFriend};
    const counts=unreadCounts(state),pinned=new Set(state.pinnedFriends||[]),wanted=recentFriendIds(state).slice(0,FRIEND_SCENE_CAPACITY),ids=new Set(wanted);
    for(const [id,e] of entries){
      e.chatting=activeFriend===id;e.eligible=ids.has(id);e.unread=counts.get(id)||0;e.pinned=pinned.has(id);
      if(e.eligible){if(e.phase==='leaving'){e.from=e.alpha;e.start=now;e.phase='entering';}}
      else if(e.phase!=='leaving'){e.phase='leaving';e.from=e.alpha;e.start=now;}
    }
    for(const id of wanted){
      if(entries.size>=FRIEND_SCENE_CAPACITY)break;if(entries.has(id))continue;
      entries.set(id,{id,alpha:0,from:0,start:now,phase:'entering',generation:++generation,chatting:activeFriend===id,eligible:true,unread:counts.get(id)||0,pinned:pinned.has(id)});
    }
    return snapshot();
  }
  function update(now=performance.now(),reduced=false){
    let changed=false;
    for(const [id,e] of entries){
      if(e.phase==='entering'){const t=Math.min(1,(now-e.start)/(reduced?100:650));e.alpha=e.from+(1-e.from)*t;if(t===1)e.phase='present';}
      else if(e.phase==='leaving'){const t=Math.min(1,(now-e.start)/(reduced?100:500));e.alpha=e.from*(1-t);if(t===1){entries.delete(id);changed=true;}}
    }
    if(changed&&input)reconcile({...input,now});
    return snapshot();
  }
  function snapshot(){return [...entries.values()].map(e=>({...e}));}
  return {reconcile,update,snapshot,clear(){entries.clear();input=null;}};
}
