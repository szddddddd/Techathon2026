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
  return !!state && Array.isArray(state.friends) && state.friends.length <= 32 && state.friends.every(id => typeof id === 'string' && /^[\w-]{1,80}$/.test(id)) && Array.isArray(state.messages) && state.messages.length <= 1000 && state.messages.every(message => message && typeof message.id === 'string' && typeof message.friendId === 'string' && typeof message.senderId === 'string' && typeof message.read === 'boolean' && Number.isFinite(message.createdAt) && typeof message.text === 'string' && message.text.length <= 300) && Number.isSafeInteger(payload.unreadCount) && payload.unreadCount >= 0;
}
module.exports = { webPort, validState };
