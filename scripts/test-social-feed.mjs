import assert from 'node:assert/strict';
import {getPublicPosts, getNewPublicPosts} from '../src/social-feed.js';

const friends = ['tuantuan', 'ali', 'xiaomian', 'shanshan'];
const post = (id, authorId, createdAt) => ({id, authorId, createdAt, likes:[], comments:[]});
const state = {
  friends,
  posts: [
    post('old-ali', 'ali', 50),
    post('stranger', 'stranger', 999),
    post('tie-b', 'tuantuan', 100),
    post('own', 'me', 200),
    post('tie-a', 'ali', 100),
    post('rabbit', 'xiaomian', 80),
    post('bear', 'shanshan', 90),
  ],
  seenPosts: {tuantuan:100, ali:50},
};
const before = structuredClone(state);
const publicPosts = getPublicPosts(state);
assert.deepEqual(publicPosts.map(item => item.id), ['own', 'tie-a', 'tie-b', 'bear', 'rabbit', 'old-ali']);
assert.ok(!publicPosts.some(item => item.authorId === 'stranger'), 'unadded people stay outside the timeline');
assert.ok(publicPosts.some(item => item.authorId === 'me'), 'own posts are included');
assert.deepEqual([...new Set(publicPosts.filter(item => item.authorId !== 'me').map(item => item.authorId))].sort(), [...friends].sort(), 'all four friends contribute');
assert.notStrictEqual(publicPosts, state.posts);
assert.deepEqual(state, before, 'queries cannot change store arrays, dates or read marks');

assert.deepEqual(getNewPublicPosts(state).map(item => item.id), ['tie-a', 'bear', 'rabbit'], 'new posts exclude own, strangers and timestamps at the read boundary');
const seenAli = structuredClone(state);
seenAli.seenPosts.ali = 100;
assert.deepEqual(getNewPublicPosts(seenAli).map(item => item.id), ['bear', 'rabbit'], 'reading one friend does not clear another friend');
assert.deepEqual(getNewPublicPosts(state).map(item => item.id), ['tie-a', 'bear', 'rabbit'], 'querying the updated copy cannot mutate the original read state');
assert.deepEqual(getPublicPosts({...state, friends:[]}).map(item => item.id), ['own'], 'without friends only own posts remain');
assert.deepEqual(getNewPublicPosts({...state, friends:[]}), []);
assert.deepEqual(getPublicPosts({friends:[], posts:[], seenPosts:{}}), []);
assert.deepEqual(state, before);
console.log('Public feed query tests passed.');
