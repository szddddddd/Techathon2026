// getRandomValues is available on HTTP LAN origins as well as secure origins.
export function randomUUID(){
 if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();
 const b=globalThis.crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;
 const h=Array.from(b,n=>n.toString(16).padStart(2,'0')).join('');
 return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
