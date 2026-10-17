import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {indexedDB} from 'fake-indexeddb';
import {createSocialStore} from '../src/social-store.js';
import {createFriendModels} from '../src/friend-models.js';
const avatar='data:image/webp;base64,'+(await fs.readFile('assets/rodin-friends/kangaroo/portrait.webp')).toString('base64');
const dbName='normal-add-'+crypto.randomUUID(),jobId=crypto.randomUUID(),checks=[];
let store=await createSocialStore({indexedDB,dbName});
let addedEvent;const unsubscribe=store.subscribe((state,event)=>{if(event.type==='friend-added')addedEvent=event;});
const id=await store.addAvatarContact({jobId,account:'woodland-friend',name:'新朋友',avatarUrl:avatar});
assert.equal(addedEvent.friendId,id);unsubscribe();
assert.equal(store.state.friends.includes(id),true);assert.equal(store.getFriend(id).modelUrl,null);assert.equal(store.state.pinnedFriends.includes(id),false);
await store.sendMessage(id,{text:'模型准备前就能聊天'});await store.setDraft(id,'等待期间的草稿');
await assert.rejects(()=>store.addAvatarContact({jobId:crypto.randomUUID(),account:'WOODLAND-FRIEND',name:'重复',avatarUrl:avatar}));
checks.push('contact saved and chat/draft available before any generation; normal default unpinned; account deduplication');
let calls=[],savedJob=null,failConnection=true;
const response=(status,data)=>({status,ok:status>=200&&status<300,json:async()=>data});
const fetcher=async(url,options={})=>{
 calls.push({url,options});assert.ok(store.state.friends.includes(id),'generation only happens after friendship exists');
 if(failConnection)throw new Error('offline');
 if(options.method==='POST'){
  const data=JSON.parse(options.body);assert.equal(data.requestId,jobId);assert.equal(data.autoContinue,true);assert.equal(data.pinned,false);assert.ok(data.avatarBase64);savedJob={id:jobId,phase:'model_processing'};return response(202,savedJob);
 }
 return savedJob?response(200,savedJob):response(404,{});
};
let models=createFriendModels({store,fetcher,interval:100000,document:null});await models.sync();assert.equal(store.getFriend(id).modelPhase,'waiting_connection');assert.equal(store.state.messages.length,1);
failConnection=false;await models.sync();assert.equal(store.getFriend(id).modelPhase,'model_processing');assert.equal(calls.filter(c=>c.options.method==='POST').length,1);models.dispose();store.dispose();
checks.push('offline image service never rolls back contact; retry discovers original ID before submitting');
store=await createSocialStore({indexedDB,dbName});models=createFriendModels({store,fetcher,interval:100000,document:null});await models.sync();assert.equal(calls.filter(c=>c.options.method==='POST').length,1);
await store.setFriendPinned(id,true);await store.receiveMessage(id,{text:'收到一封来信'});savedJob={id:jobId,phase:'ready',modelUrl:`/api/avatar/assets/${jobId}/scene.glb`,referenceUrl:`/api/avatar/assets/${jobId}/reference.img`};await models.sync();
assert.equal(store.getFriend(id).modelUrl,savedJob.modelUrl);assert.ok(store.state.pinnedFriends.includes(id));assert.equal(store.state.drafts[id],'等待期间的草稿');assert.equal(store.state.messages.filter(m=>!m.read).length,1);assert.equal(store.getFriend(id).avatarUrl,avatar);
await assert.rejects(()=>store.updateFriendModel(id,{id:crypto.randomUUID(),phase:'ready',modelUrl:savedJob.modelUrl}));await assert.rejects(()=>store.updateFriendModel(id,{id:jobId,phase:'ready',modelUrl:'https://example.invalid/model.glb'}));
const count=calls.length;await models.sync();assert.equal(calls.length,count);checks.push('refresh resumes original job without new paid submission; ready updates original friend in place and stops polling; avatar/chat/unread/pin preserved');
models.dispose();store.dispose();
const terminalStore=await createSocialStore({indexedDB,dbName:'terminal-'+crypto.randomUUID()}),terminalId=await terminalStore.addAvatarContact({jobId:crypto.randomUUID(),account:'paused-contact',name:'暂停的朋友',avatarUrl:avatar});
await terminalStore.updateFriendModel(terminalId,{id:terminalStore.getFriend(terminalId).jobId,phase:'attention',error:'uncertain'});
let invoked=0;const paused=createFriendModels({store:terminalStore,fetcher:async()=>{invoked++;throw new Error();},document:null});await paused.sync();await paused.retry(terminalId);assert.equal(invoked,0);await terminalStore.sendMessage(terminalId,{text:'仍然可以聊天'});paused.dispose();terminalStore.dispose();checks.push('ambiguous paid result remains paused, including retry click; friendship and messaging remain usable');
await fs.mkdir('.test-results/avatar-pipeline',{recursive:true});await fs.writeFile('.test-results/avatar-pipeline/friend-model-results.json',JSON.stringify({checks},null,2));console.log(JSON.stringify({checks},null,2));
