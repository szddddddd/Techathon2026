import assert from 'node:assert/strict';
import {indexedDB} from 'fake-indexeddb';
import {createSocialStore} from '../src/social-store.js';
import {ACCOUNTS,ARTICLES,CREATORS,VIDEOS,getContent,getAccount,getCreator,validContentRef,contentCardHTML} from '../src/discovery-catalog.js';

assert.equal(ACCOUNTS.length,4);assert.equal(ARTICLES.length,12);assert.equal(CREATORS.length,5);assert.equal(VIDEOS.length,7);
assert.equal(new Set([...ARTICLES,...VIDEOS].map(item=>item.id)).size,19);
for(const article of ARTICLES){assert.ok(getAccount(article.accountId));if(article.accountId==='hyper3d'){assert.ok(article.sourceUrl.startsWith('https://docs.hyper3d.ai/'));assert.ok(article.blocks.some(b=>b.type==='paragraph'));continue;}assert.ok(article.blocks.filter(block=>block.type==='paragraph').reduce((sum,block)=>sum+block.text.length,0)>=450,`${article.id} must contain a complete article`);assert.ok(getContent({type:'video',id:article.videoId}));}
for(const video of VIDEOS){assert.ok(getCreator(video.creatorId));if(video.articleId)assert.ok(getContent({type:'article',id:video.articleId}));assert.ok(video.duration>0);}
const demo=getContent({type:'video',id:'video-hyper3d-agent-ready'});assert.equal(getCreator(demo.creatorId).name,'aaaaa');assert.equal(demo.duration,34.69);assert.equal(demo.objectFit,'contain');assert.match(demo.description,/#Hyper3D #AgentReady/);
assert.equal(validContentRef({type:'article',id:'video-1'}),false);
assert.equal(validContentRef({type:'post',id:'article-1'}),false);
assert.match(contentCardHTML({type:'article',id:'article-1'}),/data-action="open-content"/);
const dbName=`discovery-test-${Date.now()}`,options={indexedDB,dbName};
let store=await createSocialStore(options);
const article={type:'article',id:'article-1'},video={type:'video',id:'video-3'};
await store.addFriend('tuantuan');
await store.sendMessage('tuantuan',{type:'text',text:'before content extension'});
await store.setDraft('tuantuan','旧草稿不要改变');
const oldMessages=structuredClone(store.state.messages),oldPosts=structuredClone(store.state.posts);
await store.followContent('account','valley');await store.followContent('creator','xiaomian');
assert.deepEqual(store.state.discovery.accountFollows,['hyper3d','valley']);assert.deepEqual(store.state.discovery.creatorFollows,['xiaomian']);
assert.deepEqual(store.state.friends,['tuantuan'],'following content does not create animal friends');
await store.followContent('account','valley');assert.deepEqual(store.state.discovery.accountFollows,['hyper3d']);
await store.followContent('account','valley');
await store.toggleContentLike(article);await store.toggleContentCollection(video);
await store.addContentComment(article,'认真读完了，周末也想去溪边坐坐。');
await store.setContentProgress(article,1234);await store.setContentProgress(video,6.5);
await store.setReadingFont(20);await store.visitContent(article);await store.visitContent(video);await store.visitContent(article);
assert.equal(store.state.discovery.history.length,2);assert.equal(store.state.discovery.history[0].id,'article-1');
assert.equal(store.state.discovery.progress['article:article-1'],1234);assert.equal(store.state.discovery.progress['video:video-3'],6.5);
assert.deepEqual(store.state.messages,oldMessages);assert.deepEqual(store.state.posts,oldPosts);
const message=await store.sendMessage('tuantuan',{type:'content',contentRef:article});
const post=await store.publishPost({contentRef:video});
assert.deepEqual(message.contentRef,article);assert.deepEqual(post.contentRef,video);assert.equal(post.text,'');
await store.toggleLike(post.id);await store.addComment(post.id,'这条视频真好。');
await assert.rejects(store.sendMessage('ali',{type:'content',contentRef:video}),'explicit recipient must be an existing friend');
const count=store.state.messages.length,postCount=store.state.posts.length;
for(const invalid of [{type:'video',id:'missing'},{type:'article',id:'video-1'},null]){
  await assert.rejects(store.sendMessage('tuantuan',{type:'content',contentRef:invalid}));
  await assert.rejects(store.toggleContentLike(invalid));await assert.rejects(store.toggleContentCollection(invalid));await assert.rejects(store.visitContent(invalid));
}
await assert.rejects(store.publishPost({contentRef:{type:'video',id:'missing'}}));
await assert.rejects(store.followContent('friend','tuantuan'));await assert.rejects(store.followContent('account','missing'));
await assert.rejects(store.addContentComment(article,' '));await assert.rejects(store.setContentProgress(video,NaN));await assert.rejects(store.setContentProgress(video,-2));await assert.rejects(store.setReadingFont(40));
assert.equal(store.state.messages.length,count);assert.equal(store.state.posts.length,postCount);
const snapshot=structuredClone(store.state);store.dispose();store=await createSocialStore(options);
assert.deepEqual(store.state,snapshot,'content and all pre-existing social data survive reload');
await store.toggleContentLike(article);await store.toggleContentCollection(video);
assert.deepEqual(store.state.discovery.likes,[]);assert.deepEqual(store.state.discovery.collections,[]);
store.dispose();

// Reopen an actual old-shaped record without the discovery field.
const legacyName=`legacy-discovery-${Date.now()}`;
const old=structuredClone(snapshot);delete old.discovery;
const opening=indexedDB.open(legacyName,1);
opening.onupgradeneeded=()=>{opening.result.createObjectStore('state');opening.result.createObjectStore('media');};
const legacyDb=await new Promise((resolve,reject)=>{opening.onsuccess=()=>resolve(opening.result);opening.onerror=()=>reject(opening.error);});
await new Promise((resolve,reject)=>{const tx=legacyDb.transaction('state','readwrite');tx.objectStore('state').put(old,'main');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});legacyDb.close();
const migrated=await createSocialStore({indexedDB,dbName:legacyName});
for(const key of Object.keys(old))assert.deepEqual(migrated.state[key],old[key],`legacy ${key} preserved`);
assert.equal(migrated.state.discovery.fontSize,18);assert.deepEqual(migrated.state.discovery.accountFollows,['hyper3d']);
await migrated.followContent('creator','ali');await migrated.setContentProgress(video,1000);
assert.equal(migrated.state.discovery.progress['video:video-3'],12,'video progress cannot exceed clip duration');
migrated.dispose();
console.log('Discovery catalog/store tests passed: 9 original articles, 3 sourced Hyper3D summaries, 6 linked videos, content sharing, persistence, legacy migration, validation.');
