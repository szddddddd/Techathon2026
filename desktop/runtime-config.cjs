const fs = require('node:fs');
const path = require('node:path');
function webPort(root) {
  let saved;
  try { saved = JSON.parse(fs.readFileSync(path.join(root, '.forest-runtime.json'), 'utf8').replace(/^\uFEFF/, '')).webPort; } catch {}
  const value = Number(process.env.FOREST_WEB_PORT || saved || 8080);
  if (!Number.isInteger(value) || value < 1 || value > 65535) throw new Error('Invalid FOREST_WEB_PORT');
  return value;
}
function validState(payload) {
  const state = payload?.state;
  const details=state?.friendDetails;
  const validDetails=details===undefined||(details&&typeof details==='object'&&!Array.isArray(details)&&Object.keys(details).length<=32&&Object.entries(details).every(([id,f])=>state.friends?.includes(id)&&f&&typeof f.name==='string'&&f.name.length<=80&&(f.modelUrl===null||(id.startsWith('avatar-')&&/^[a-f0-9-]{36}$/.test(id.slice(7))&&f.modelUrl===`/api/avatar/assets/${id.slice(7)}/scene.glb`))));
  return !!state && (state.sceneId === undefined || ['forest','fuji','ideal'].includes(state.sceneId)) && validDetails && Array.isArray(state.friends) && state.friends.length <= 32 && state.friends.every(id => typeof id === 'string' && /^[\w-]{1,80}$/.test(id)) && Array.isArray(state.messages) && state.messages.length <= 1000 && state.messages.every(message => message && typeof message.id === 'string' && typeof message.friendId === 'string' && typeof message.senderId === 'string' && typeof message.read === 'boolean' && Number.isFinite(message.createdAt) && typeof message.text === 'string' && message.text.length <= 300) && Number.isSafeInteger(payload.unreadCount) && payload.unreadCount >= 0;
}
module.exports = { webPort, validState };
