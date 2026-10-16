const terminal=new Set(['ready','attention','failed','cancelled']);

/** A friend exists before their model. Stable job IDs also deduplicate across tabs/reloads. */
export function createFriendModels({store,fetcher=fetch,interval=5000,document:doc=globalThis.document}={}){
  let timer,disposed=false;const inFlight=new Map();
  const pending=()=>Object.values(store.state.customFriends||{}).filter(f=>!f.modelUrl&&f.jobId&&!terminal.has(f.modelPhase));
  async function api(route,body){
    const response=await fetcher('/api/avatar/'+route,body?{method:'POST',headers:{'Content-Type':'application/json','X-Forest-Avatar':'1'},body:JSON.stringify(body)}:{});
    if(response.status===404)return null;
    if(!response.ok)throw new Error('形象暂时无法准备，稍后会继续。');
    return response.json();
  }
  async function sync(friend){
    try{
      let job=await api('jobs/'+friend.jobId);
      if(!job){
        const match=/^data:image\/(?:png|jpeg|webp);base64,(.+)$/.exec(friend.avatarUrl||'');
        if(!match)throw new Error('头像暂不可用。');
        job=await api('jobs',{requestId:friend.jobId,name:friend.name,avatarBase64:match[1],pinned:false,autoContinue:true});
        if(!job)throw new Error('形象服务暂不可用。');
      }
      if(!disposed)await store.updateFriendModel(friend.id,job);
    }catch{
      if(!disposed)await store.updateFriendModel(friend.id,{id:friend.jobId,phase:'waiting_connection',error:'形象稍后会继续准备，聊天不受影响。'});
    }
  }
  function update(id){
    if(inFlight.has(id))return inFlight.get(id);
    const friend=store.getFriend(id);if(!friend?.jobId)return Promise.resolve();
    const task=sync(friend).finally(()=>inFlight.delete(id));inFlight.set(id,task);return task;
  }
  async function tick(){
    clearTimeout(timer);if(disposed||doc?.hidden)return;
    await Promise.allSettled(pending().map(f=>update(f.id)));
    if(!disposed&&pending().length)timer=setTimeout(tick,interval);
  }
  const unsubscribe=store.subscribe((state,event)=>{if(event.type==='friend-added')wake();});
  const visibility=()=>{if(doc?.hidden)clearTimeout(timer);else wake();};doc?.addEventListener('visibilitychange',visibility);
  function wake(){clearTimeout(timer);if(!disposed)timer=setTimeout(tick,0);}
  wake();
  return{wake,async sync(){await tick();},async retry(id){
    const friend=store.getFriend(id);if(!friend||friend.modelPhase==='attention')return;
    if(friend.modelPhase==='failed'){
      const job=await api('jobs/'+friend.jobId+'/retry',{});if(job)await store.updateFriendModel(id,job);
    }
    wake();
  },dispose(){disposed=true;clearTimeout(timer);unsubscribe();doc?.removeEventListener('visibilitychange',visibility);}};
}
