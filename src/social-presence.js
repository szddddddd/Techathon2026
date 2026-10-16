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

/** The roster is independent from both the contact book and the actor cache. */
export function createPresenceController(){
  const entries=new Map();let generation=0;
  function reconcile({state,activeFriend=null,chatVisible=false,now=performance.now()}){
    const counts=unreadCounts(state),pinned=new Set(state.pinnedFriends||[]),friends=new Set(state.friends);
    for(const id of friends){
      const eligible=pinned.has(id)||((counts.get(id)||0)>0&&!(chatVisible&&activeFriend===id));
      let e=entries.get(id);
      if(!e&&eligible){e={id,alpha:0,from:0,start:now,phase:'entering',generation:++generation};entries.set(id,e);}
      if(!e)continue;
      const hold=activeFriend===id;
      e.chatting=activeFriend===id;e.eligible=eligible;e.unread=counts.get(id)||0;e.pinned=pinned.has(id);
      if(eligible||hold){
        e.leaveAt=null;
        if(e.phase==='leaving'){e.from=e.alpha;e.start=now;e.phase='entering';}
        else if(e.phase==='waiting')e.phase='present';
      }else if(e.phase!=='waiting'&&e.phase!=='leaving'){
        e.phase='waiting';e.leaveAt=now+1200;
      }
    }
    for(const [id,e] of entries)if(!friends.has(id)){e.phase='leaving';e.from=e.alpha;e.start=now;}
    return snapshot();
  }
  function update(now=performance.now(),reduced=false){
    for(const [id,e] of entries){
      if(e.phase==='waiting'&&now>=e.leaveAt){e.phase='leaving';e.from=e.alpha;e.start=now;}
      if(e.phase==='entering'){
        const t=Math.min(1,(now-e.start)/(reduced?100:650));e.alpha=e.from+(1-e.from)*t;
        if(t===1)e.phase='present';
      }else if(e.phase==='waiting')e.alpha=Math.min(1,e.alpha+1/20);
      else if(e.phase==='leaving'){
        const t=Math.min(1,(now-e.start)/(reduced?100:500));e.alpha=e.from*(1-t);
        if(t===1)entries.delete(id);
      }
    }
    return snapshot();
  }
  function snapshot(){return [...entries.values()].map(e=>({...e}));}
  return {reconcile,update,snapshot,clear:()=>entries.clear()};
}
