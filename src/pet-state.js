const TYPES = { image: '[图片]', sticker: '[表情包]', share: '[分享内容]', content: '[分享内容]', moment: '[朋友圈动态]', article: '[文章]', video: '[视频]' };

export function messageSummary(message) {
  return String(message.text || TYPES[message.type] || '有一条新消息').slice(0, 300);
}

export function notificationItems(state) {
  const allowed = new Set(state?.friends || []), latest = new Map();
  for (const message of state?.messages || []) {
    if (message.senderId === 'me' || message.read || !allowed.has(message.friendId)) continue;
    const previous = latest.get(message.friendId);
    if (!previous || message.createdAt >= previous.createdAt) latest.set(message.friendId, message);
  }
  return [...latest.values()].sort((a, b) => a.createdAt - b.createdAt).map(message => ({ ...message, text: messageSummary(message) }));
}

export function petNickname(name) {
  const chars=Array.from(String(name||'朋友'));
  return chars.length>5?chars.slice(0,5).join('')+'...':chars.join('');
}

export function petPayload(state) {
  const allowed = new Set(state.friends), messages = state.messages;
  const selected = new Map(messages.slice(-300).map(message => [message.id, message]));
  // Keep every unread source even when its latest unread predates bounded history.
  for (const message of notificationItems(state)) selected.set(message.id, message);
  return {
    state: { friends: state.friends, friendDetails: Object.fromEntries(state.friends.flatMap(id=>{
      const f=state.customFriends?.[id];if(!f)return [];
      const expected=`/api/avatar/assets/${f.jobId}/scene.glb`;
      return [[id,{name:String(f.name||'朋友').slice(0,80),modelUrl:f.modelUrl===expected&&/^[a-f0-9-]{36}$/.test(f.jobId||'')?expected:null}]];
    })), profile: state.profile, messages: [...selected.values()].map(({ id, friendId, senderId, read, type, text, createdAt }) => ({ id, friendId, senderId, read, type, text: messageSummary({ type, text }), createdAt })) },
    unreadCount: messages.filter(message => message.senderId !== 'me' && !message.read && allowed.has(message.friendId)).length
  };
}
