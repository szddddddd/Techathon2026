import {MODS,modById} from './catalog.js';
import {openModStore} from './store.js';
export const timerRemaining=(timer,now=Date.now())=>timer?.running?Math.max(0,timer.endAt-now):Math.max(0,timer?.remaining??(timer?.minutes||25)*60000);
export async function createModManager(options={}){
 const storage=await openModStore(options),listeners=new Set(),adapters=new Map(),loads=new Map();let state=await storage.load(),queue=Promise.resolve(),disposed=false,timeout;
 const channel=typeof window!=='undefined'&&globalThis.BroadcastChannel?new BroadcastChannel('weroam-mods-v1'):null;
 const enabled=id=>!!state.modules[id]?.installed&&!!state.modules[id]?.enabled;
 const emit=event=>{for(const fn of listeners)fn(state,event);};
 const serial=fn=>{const task=queue.then(()=>{if(disposed)throw Error('模块管理器已关闭');return fn();});queue=task.catch(()=>{});return task;};
 function schedule(){clearTimeout(timeout);if(!enabled('focus')||!state.data.focus?.running||disposed)return;timeout=setTimeout(()=>{void complete().catch(error=>emit({type:'error',error}));},Math.max(1,Math.min(2147483647,timerRemaining(state.data.focus))));}
 async function publish(next,event){const previous=state;state=next;for(const m of MODS)if(!!previous.modules[m.id]?.enabled!==enabled(m.id))await adapters.get(m.id)?.[enabled(m.id)?'enable':'disable']?.();schedule();emit(event);channel?.postMessage({revision:state.revision});}
 async function complete(){return serial(async()=>{let completed=false;const next=await storage.change(s=>{const t=s.data.focus;if(s.modules.focus?.enabled&&t?.running&&timerRemaining(t)===0){t.running=false;t.remaining=0;t.endAt=null;t.completedAt=Date.now();completed=true;}});await publish(next,{type:completed?'timer-complete':'data',id:'focus'});});}
 async function ensure(id){if(!modById(id))throw Error('模块不存在');if(!loads.has(id))loads.set(id,Promise.resolve().then(()=>adapters.get(id)?.load?.()).catch(error=>{loads.delete(id);throw error;}));return loads.get(id);}
 const api={get state(){return state;},enabled,available:()=>MODS.filter(m=>enabled(m.id)),subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
  register(id,adapter){if(!modById(id))throw Error('模块不存在');adapters.set(id,adapter);return()=>adapters.delete(id);},
  onUnavailable:null,beforeChange:null,
  async open(id,options={}){if(!enabled(id)){await api.onUnavailable?.(id,options);return false;}await ensure(id);if(!enabled(id)){await api.onUnavailable?.(id,options);return false;}await adapters.get(id)?.open?.(options);return true;},
  async change(id,action,value){if(['disable','uninstall'].includes(action))await api.beforeChange?.(id);return serial(async()=>{if(!modById(id)||!['install','enable','disable','uninstall','pin'].includes(action))throw Error('不支持的模块操作');const previous=structuredClone(state.modules[id]);
   const next=await storage.change(s=>{const r=s.modules[id];if(action==='install'){r.installed=true;r.enabled=true;}if(action==='enable'){if(!r.installed)throw Error('请先安装模块');r.enabled=true;}if(action==='disable')r.enabled=false;if(action==='uninstall'){r.installed=false;r.enabled=false;r.pinned=false;}if(action==='pin'){if(!r.installed||!r.enabled)throw Error('请先启用模块');r.pinned=!!value;}if(['disable','uninstall'].includes(action)&&id==='focus'&&s.data.focus){const t=s.data.focus;t.remaining=timerRemaining(t);t.running=false;t.endAt=null;}});
   try{await publish(next,{type:'modules',id,action});}catch(error){const rollback=await storage.change(s=>{s.modules[id]=previous;});state=rollback;schedule();emit({type:'modules',id,action:'rollback'});throw error;}
  });},
  updateData(id,fn){return serial(async()=>{if(!enabled(id))throw Error('请先启用模块');const next=await storage.change(s=>{if(!s.modules[id]?.enabled)throw Error('模块已停用');s.data[id]=fn(structuredClone(s.data[id]));});await publish(next,{type:'data',id});});},
  clearData(id){return serial(async()=>{if(!modById(id))throw Error('模块不存在');await adapters.get(id)?.close?.();const next=await storage.change(s=>{delete s.data[id];});await publish(next,{type:'data',id,cleared:true});});},
  flush:()=>queue,async dispose(){await queue;disposed=true;clearTimeout(timeout);channel?.close();for(const a of adapters.values())await a.dispose?.();listeners.clear();storage.close();},
  diagnostics:()=>({listeners:listeners.size,adapters:adapters.size,loaded:[...loads.keys()],timerScheduled:!!state.data.focus?.running&&enabled('focus')})
 };
 if(channel)channel.onmessage=()=>{void (async()=>{const next=await storage.load();if(next.revision<=state.revision)return;for(const m of MODS)if(enabled(m.id)&&!next.modules[m.id]?.enabled){try{await api.beforeChange?.(m.id);}catch(error){emit({type:'error',error});}}await serial(async()=>{const old=state;state=await storage.load();for(const m of MODS)if(!!old.modules[m.id]?.enabled!==enabled(m.id))await adapters.get(m.id)?.[enabled(m.id)?'enable':'disable']?.();schedule();emit({type:'modules',remote:true});});})().catch(error=>emit({type:'error',error}));};
 schedule();if(state.data.focus?.running&&timerRemaining(state.data.focus)===0)await complete();return api;
}
