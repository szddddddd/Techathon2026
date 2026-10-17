/** Keep stored job URLs relative; resolve native file pages through their own loopback service. */
export function avatarURL(url){
  return globalThis.location?.protocol==='file:'&&globalThis.desktopMain?.avatarOrigin&&String(url).startsWith('/')?globalThis.desktopMain.avatarOrigin+url:url;
}
