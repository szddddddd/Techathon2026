import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {createSocialStore,FRIENDS,STATES,startDemo} from '../src/social-store.js';

// npm install --prefix <temp>/world-social-test --no-save --package-lock=false fake-indexeddb
let fake;
try{fake=await import('fake-indexeddb');}catch{
  fake=await import(pathToFileURL(path.join(process.env.TEMP||'/tmp','world-social-test/node_modules/fake-indexeddb/build/esm/index.js')).href);
}
const {indexedDB,IDBDatabase}=fake;
const dbName=`forest-test-${Date.now()}`,options={indexedDB,dbName};
let store=await createSocialStore(options);
assert.equal(store.state.friends.length,0);
assert.equal(FRIENDS.length,4);assert.equal(STATES.length,8);
assert.equal(await store.addFriend('tuantuan'),true);
assert.equal(await store.addFriend('tuantuan'),false);
assert.equal(store.state.posts.length,4);
assert.equal(store.state.friends.length,1);
assert.ok(store.state.statuses.tuantuan.expiresAt>Date.now());
await assert.rejects(store.addFriend('unknown'));
await assert.rejects(store.sendMessage('ali',{type:'text',text:'not a friend'}));
await assert.rejects(store.sendMessage('tuantuan',{type:'text',text:'   '}));

await Promise.all(Array.from({length:12},(_,i)=>store.sendMessage('tuantuan',{type:'text',text:`message ${i}`})));
assert.equal(store.state.messages.length,12,'queued commits must not overwrite messages');
assert.equal(new Set(store.state.messages.map(message=>message.id)).size,12);
await store.receiveMessage('tuantuan',{type:'text',text:'hello'},'test-receive');
await store.receiveMessage('tuantuan',{type:'text',text:'duplicate'},'test-receive');
assert.equal(store.state.messages.length,13);
assert.equal(store.state.messages.at(-1).read,false);
await store.markRead('tuantuan');
assert.ok(store.state.messages.every(message=>message.read));
await store.sendMessage('tuantuan',{type:'image',mediaId:'assets/social/forest.svg'});
await store.sendMessage('tuantuan',{type:'sticker',text:'🌻'});
await store.sendMessage('tuantuan',{type:'moment',momentId:'seed-tuantuan-0'});
await store.setDraft('tuantuan','unsent text');
await store.setScroll('tuantuan',123);
await store.updateProfile({name:'Test traveller',signature:'A saved signature'});
await store.publishStatus({kind:'happy',text:'saved status',mediaId:'assets/social/river.svg'});
await store.publishPost({text:'saved memory',mediaIds:['assets/social/camp.svg']});
const mine=store.state.posts.at(-1).id;
await store.toggleLike(mine);assert.deepEqual(store.state.posts.at(-1).likes,['me']);
await store.toggleLike(mine);assert.deepEqual(store.state.posts.at(-1).likes,[]);
await store.addComment(mine,'saved comment');
await assert.rejects(store.publishPost({text:''}));
await assert.rejects(store.publishPost({text:'too many',mediaIds:Array(10).fill('x')}));
await assert.rejects(store.publishStatus({kind:'invalid'}));
await assert.rejects(store.importImage({size:11*1024*1024,type:'image/png'}));
await assert.rejects(store.importImage({size:10,type:'text/html'}));
const oldCreateImageBitmap=globalThis.createImageBitmap;
let compressedSize;
globalThis.createImageBitmap=async()=>({width:3200,height:2400,close(){}});
globalThis.document={createElement:()=>({getContext:()=>({drawImage(){}}),toBlob(callback){compressedSize=[this.width,this.height];callback(new Blob(['saved compressed pixels'],{type:'image/webp'}));}})};
const mediaId=await store.importImage({size:100,type:'image/png'});
assert.deepEqual(compressedSize,[1600,1200],'uploaded images preserve aspect ratio and limit longest edge');
delete globalThis.document;globalThis.createImageBitmap=oldCreateImageBitmap;
assert.equal(await store.mediaUrl('assets/social/forest.svg'),'assets/social/forest.svg');
await assert.rejects(store.mediaUrl('assets/../private.svg'));
await store.markPostsSeen('tuantuan');
await store.setDemoPaused(true);
const beforeReload=structuredClone(store.state);
store.dispose();store=await createSocialStore(options);
assert.deepEqual(store.state,beforeReload,'all persisted entities and UI state survive reload');
const restoredMediaUrl=await store.mediaUrl(mediaId);
assert.equal(await (await fetch(restoredMediaUrl)).text(),'saved compressed pixels','uploaded media blobs survive reload');

const originalTransaction=IDBDatabase.prototype.transaction;
let rejectNextWrite=true;
IDBDatabase.prototype.transaction=function(names,mode,...args){
  const tx=originalTransaction.call(this,names,mode,...args);
  if(mode==='readwrite'&&rejectNextWrite){rejectNextWrite=false;const originalStore=tx.objectStore.bind(tx);tx.objectStore=name=>{const objectStore=originalStore(name),put=objectStore.put.bind(objectStore);objectStore.put=(...values)=>{const request=put(...values);tx.abort();return request;};return objectStore;};}
  return tx;
};
const beforeFailure=structuredClone(store.state);let emitted=false;const off=store.subscribe(()=>{emitted=true;});
await assert.rejects(store.sendMessage('tuantuan',{type:'text',text:'must not be visible'}));
IDBDatabase.prototype.transaction=originalTransaction;off();
assert.deepEqual(store.state,beforeFailure,'failed commit must not mutate visible state');
assert.equal(emitted,false,'failed commit must not notify a successful mutation');
await store.sendMessage('tuantuan',{type:'text',text:'queue recovers'});
await store.addFriend('ali');
await Promise.all([store.setDraft('tuantuan','first draft'),store.setDraft('ali','second draft'),store.receiveMessage('ali',{type:'text',text:'unread from another friend'},'ali-unread')]);
await store.markRead('tuantuan');
assert.equal(store.state.messages.find(message=>message.id==='ali-unread').read,false,'reading one conversation must preserve another friend unread');
assert.equal(store.state.drafts.tuantuan,'first draft');assert.equal(store.state.drafts.ali,'second draft');
const otherPost=store.state.posts.find(post=>post.authorId==='ali');
await store.addComment(otherPost.id,'on Ali only');
assert.equal(store.state.posts.find(post=>post.id===otherPost.id).comments.at(-1).text,'on Ali only');
assert.ok(!store.state.posts.filter(post=>post.authorId==='tuantuan').some(post=>post.comments.some(comment=>comment.text==='on Ali only')),'comment targets must be stable across friend switches');

await store.demoEvent('tuantuan',2);
const count=store.state.posts.length;
await store.restartDemo();await store.demoEvent('tuantuan',2);
assert.equal(store.state.posts.length,count,'replay must not duplicate past demo posts');
assert.ok(store.state.posts.some(post=>post.id===mine),'replay must preserve own posts');

// A deterministic clock exercises scheduling without waiting a full demo minute.
const realPerformance=globalThis.performance,realSetInterval=globalThis.setInterval,realClearInterval=globalThis.clearInterval;
let clock=0,tick;
Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>clock}});
globalThis.setInterval=fn=>{tick=fn;return 1;};globalThis.clearInterval=()=>{};
globalThis.document={hidden:false};
const demo=startDemo(store);
await store.setDemoPaused(true);const messagesBeforePause=store.state.messages.length;
for(let i=0;i<16;i++){clock+=250;await tick();}
assert.equal(store.state.messages.length,messagesBeforePause,'paused demo cannot send messages');
await store.setDemoPaused(false);globalThis.document.hidden=true;
for(let i=0;i<16;i++){clock+=250;await tick();}
assert.equal(store.state.messages.length,messagesBeforePause,'background demo cannot send messages');
globalThis.document.hidden=false;
for(let i=0;i<4;i++){clock+=250;await tick();}
assert.equal(store.state.events.includes('greeting-tuantuan'),false,'resume must not immediately flush elapsed background time');
for(let i=0;i<8;i++){clock+=250;await tick();}
assert.equal(store.state.events.includes('greeting-tuantuan'),true);
demo.dispose();globalThis.setInterval=realSetInterval;globalThis.clearInterval=realClearInterval;
Object.defineProperty(globalThis,'performance',{configurable:true,value:realPerformance});delete globalThis.document;
await store.publishStatus({kind:'tired',text:'will expire'});
store.dispose();
const realDateNow=Date.now;Date.now=()=>realDateNow()+86400001;
store=await createSocialStore(options);
assert.equal(store.state.statuses.me,undefined,'expired status must disappear after reload');
Date.now=realDateNow;store.dispose();

// Load a realistic history in one fixture transaction, then exercise public API
// operations on it. This avoids 500 full-state writes just to prepare the test.
const historyDB=await new Promise((resolve,reject)=>{const request=indexedDB.open(dbName,1);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
const historyTx=historyDB.transaction('state','readwrite'),historyObjectStore=historyTx.objectStore('state');
const historyReady=new Promise((resolve,reject)=>{historyTx.oncomplete=resolve;historyTx.onabort=()=>reject(historyTx.error);historyTx.onerror=()=>reject(historyTx.error);});
historyObjectStore.get('main').onsuccess=event=>{
  const saved=event.target.result;
  saved.messages.push(...Array.from({length:500},(_,i)=>({id:`history-${i}`,friendId:i%2?'ali':'tuantuan',senderId:i%2?'ali':'tuantuan',type:'text',text:`Saved historical message ${i}`,mediaId:null,momentId:null,createdAt:Date.now()-500000+i*1000,read:false})));
  historyObjectStore.put(saved,'main');
};
await historyReady;historyDB.close();
store=await createSocialStore(options);
const historical=()=>store.state.messages.filter(message=>/^history-\d+$/.test(message.id));
assert.equal(historical().length,500);
const contentBefore=structuredClone(store.state.posts),draftsBefore=structuredClone(store.state.drafts);
await Promise.all([
  store.markRead('tuantuan'),
  store.receiveMessage('ali',{type:'text',text:'arrives alongside read'},'history-concurrent'),
  store.setScroll('ali',9876),
]);
assert.equal(historical().filter(message=>message.friendId==='tuantuan'&&message.read).length,250);
assert.equal(historical().filter(message=>message.friendId==='ali'&&!message.read).length,250);
assert.equal(store.state.messages.find(message=>message.id==='history-concurrent').read,false);
assert.deepEqual(store.state.posts,contentBefore,'history updates must not overwrite posts or saved comments');
assert.deepEqual(store.state.drafts,draftsBefore,'history updates must preserve separate composer drafts');
const historyState=structuredClone(store.state);
store.dispose();store=await createSocialStore(options);
assert.deepEqual(store.state,historyState,'large-history read flags and per-friend scroll/drafts persist across reload');
assert.equal(store.state.scrolls.ali,9876);
assert.equal(store.state.drafts.tuantuan,'first draft');assert.equal(store.state.drafts.ali,'second draft');
store.dispose();
await new Promise((resolve,reject)=>{const request=indexedDB.deleteDatabase(dbName);request.onsuccess=resolve;request.onerror=reject;});
console.log('PASS: store persistence, duplicate prevention, queued writes, failed commit rollback, message types, statuses, posts, likes/comments, demo replay, background scheduling, 500-message history and per-friend isolation.');
