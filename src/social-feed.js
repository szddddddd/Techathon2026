// A public timeline contains the local user's posts and their current friends only.
// Filtering first ensures sorting cannot reorder the store's persisted array.
export function getPublicPosts(state) {
  const friends = new Set(state.friends);
  return state.posts
    .filter(post => post.authorId === 'me' || friends.has(post.authorId))
    .sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id));
}

export function getNewPublicPosts(state) {
  return getPublicPosts(state).filter(post =>
    post.authorId !== 'me' && post.createdAt > (state.seenPosts[post.authorId] || 0));
}
