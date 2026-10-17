export const clone=value=>globalThis.structuredClone(value);
const peers=new WeakMap();
export function emptyState(){return {version:1,storageRevision:0,ownerId:'demo-local-owner',connections:[],contacts:[],conversations:[],messages:[],local:{},actions:[],audit:[],sync:{},approvals:{}};}
export async function openInboxStore({dbName,indexedDB}){
  if(!indexedDB)throw Object.assign(new Error('浏览器不支持 IndexedDB，无法保存演示消息'),{code:'STORAGE_UNAVAILABLE'});
  const db=await new Promise((resolve,reject)=>{
    const request=indexedDB.open(dbName,1);
    request.onupgradeneeded=()=>request.result.createObjectStore('state');
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(Object.assign(new Error('演示数据库正被其他窗口占用'),{code:'STORAGE_BLOCKED'}));
  });
  let closed=false;
  let names=peers.get(indexedDB);if(!names){names=new Map();peers.set(indexedDB,names);}
  let listeners=names.get(dbName);if(!listeners){listeners=new Set();names.set(dbName,listeners);}
  let observer=null;
  const notify=event=>observer?.(event);
  listeners.add(notify);
  const channel=typeof window!=='undefined'&&typeof BroadcastChannel!=='undefined'?new BroadcastChannel('weroam-inbox:'+dbName):null;
  if(channel)channel.onmessage=e=>{if(e.data?.type==='permissions-invalidated')notify(e.data);};
  const cleanup=()=>{listeners.delete(notify);if(!listeners.size)names.delete(dbName);channel?.close();};
  db.onversionchange=()=>{closed=true;cleanup();db.close();};
  const load=()=>new Promise((resolve,reject)=>{const tx=db.transaction('state','readonly');const r=tx.objectStore('state').get('demo');r.onsuccess=()=>resolve(r.result||emptyState());r.onerror=()=>reject(r.error);});
  const save=(state,{expectedRevision=0}={})=>new Promise((resolve,reject)=>{
    if(closed){reject(new Error('Inbox 已关闭'));return;}
    const tx=db.transaction('state','readwrite'),store=tx.objectStore('state'),read=store.get('demo');let conflict=null,invalidated=[];
    read.onsuccess=()=>{
      if((read.result?.storageRevision||0)!==expectedRevision){conflict=Object.assign(new Error('另一窗口已更新收件箱；已刷新，请重新操作'),{code:'STORAGE_CONFLICT'});tx.abort();return;}
      invalidated=(read.result?.connections||[]).filter(before=>{
        const after=state.connections.find(c=>c.id===before.id);
        return !after||['disconnected','revoked'].includes(after.status)&&!['disconnected','revoked'].includes(before.status)||Object.keys(before.permissions||{}).some(p=>before.permissions[p]&&!after.permissions[p]);
      }).map(c=>c.id);
      store.put({...clone(state),storageRevision:expectedRevision+1},'demo');
    };
    tx.oncomplete=()=>{
      if(invalidated.length){const event={type:'permissions-invalidated',connections:invalidated,storageRevision:expectedRevision+1};for(const listener of listeners)if(listener!==notify)listener(event);channel?.postMessage(event);}
      resolve(expectedRevision+1);
    };tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(conflict||tx.error||new Error('演示保存中断'));
  });
  return {state:await load(),save,load,watch(fn){observer=fn;},close(){closed=true;cleanup();db.close();}};
}
