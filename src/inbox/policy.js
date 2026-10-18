import {randomUUID} from '../browser-id.js';
export const fail=(code,message)=>Object.assign(new Error(message),{code});
export function requirePermission(connection,permission,{actor='user',taskPermissions=null}={}){
  if(!['user','agent'].includes(actor))throw fail('INVALID_ACTOR','调用主体无效');
  if(!connection||connection.status==='disconnected'||connection.status==='revoked')throw fail('REVOKED','连接已撤销，请重新加载演示');
  if(!connection.capabilities?.[permission]?.supported)throw fail('UNSUPPORTED',connection.capabilities?.[permission]?.reason||'此来源不支持该操作');
  if(!connection.permissions?.[permission]||(taskPermissions&&!taskPermissions.includes(permission)))throw fail('PERMISSION_DENIED','尚未授权：'+permission);
}
export function canonical(value){
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
  return JSON.stringify(value);
}
export async function digest(value){
  const bytes=new TextEncoder().encode(canonical(value));
  const hash=globalThis.crypto?.subtle?await globalThis.crypto.subtle.digest('SHA-256',bytes):(await import('@noble/hashes/sha256')).sha256(bytes);
  return Array.from(new Uint8Array(hash),n=>n.toString(16).padStart(2,'0')).join('');
}
export const uid=prefix=>`${prefix}:${randomUUID()}`;
export function safeExternalURL(value,platformURL){
  if(!value)return '';
  let url;try{url=new URL(value);}catch{throw fail('INVALID_URL','请使用完整 HTTPS 链接');}
  const expected=new URL(platformURL);
  if(url.protocol!=='https:'||url.username||url.password||url.port||!(url.hostname===expected.hostname||url.hostname.endsWith('.'+expected.hostname.replace(/^www\./,''))))throw fail('INVALID_URL','仅接受所选平台的 HTTPS 链接');
  return url.href;
}
export function safeImage(value){
  if(!value)return null;
  const src=typeof value==='string'?value:value.dataUrl;
  if(typeof src!=='string'||src.length>3_000_000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(src))throw fail('INVALID_IMAGE','仅支持 2 MB 以内 PNG、JPEG、WebP 图片');
  return {id:uid('image'),type:'image',name:typeof value==='object'?String(value.name||'分享图片').slice(0,120):'分享图片',dataUrl:src};
}
