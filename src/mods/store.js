import {MODS} from './catalog.js';
export const freshMods=()=>({version:1,revision:0,modules:Object.fromEntries(MODS.map(m=>[m.id,{installed:!!m.bundled,enabled:!!m.bundled,pinned:!!m.bundled}])),data:{}});
/** One read/modify/write transaction prevents notes and module settings losing each other. */
export async function openModStore({dbName='weroam-workshop-v1',indexedDB=globalThis.indexedDB}={}){
 if(!indexedDB)throw Error('无法保存模块，请检查浏览器存储权限');
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open(dbName,1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('模块存储正在升级，请关闭其他窗口后重试'));});
 let closed=false;db.onversionchange=()=>{closed=true;db.close();};
 const load=()=>new Promise((resolve,reject)=>{const tx=db.transaction('state','readonly'),r=tx.objectStore('state').get('mods');r.onsuccess=()=>resolve(r.result||freshMods());r.onerror=()=>reject(r.error);});
 const change=fn=>new Promise((resolve,reject)=>{if(closed)return reject(Error('模块存储已关闭'));const tx=db.transaction('state','readwrite'),s=tx.objectStore('state'),r=s.get('mods');let next,error;
  r.onsuccess=()=>{try{next=structuredClone(r.result||freshMods());fn(next);next.revision++;s.put(next,'mods');}catch(e){error=e;tx.abort();}};
  tx.oncomplete=()=>resolve(next);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(error||tx.error||Error('模块未保存，请重试'));});
 return{load,change,close(){closed=true;db.close();}};
}
