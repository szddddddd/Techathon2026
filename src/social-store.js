import {getContent,getAccount,getCreator,validContentRef} from './discovery-catalog.js';
// All visible social data is local. A mutation becomes visible only after IDB commits.
export const FRIENDS = [
  {id:'tuantuan',name:'团团',animal:'kangaroo',emoji:'🦘',color:'#eaba43',signature:'把小事过成好日子。',height:2.1},
  {id:'ali',name:'阿栗',animal:'fox',emoji:'🦊',color:'#c8794e',signature:'今天也想走远一点。',height:1.9},
  {id:'xiaomian',name:'小眠',animal:'rabbit',emoji:'🐰',color:'#b5c2a5',signature:'慢一点，也会抵达。',height:1.85},
  {id:'shanshan',name:'山山',animal:'bear',emoji:'🐻',color:'#aa8265',signature:'收集森林里的好天气。',height:2},
].map(friend=>({...friend,modelUrl:`assets/rodin-friends/${friend.animal}/scene.glb`}));

export const STATES = [
  {id:'happy',label:'开心',icon:'☀'}, {id:'emo',label:'emo',icon:'☁'},
  {id:'tired',label:'疲惫',icon:'☾'}, {id:'busy',label:'忙碌',icon:'⌛'},
  {id:'relax',label:'摸鱼',icon:'🐟'}, {id:'music',label:'听歌',icon:'♫'},
  {id:'exercise',label:'运动',icon:'↗'}, {id:'travel',label:'旅行',icon:'✈'},
];
const DAY=86400000;
const clone=value=>structuredClone(value);
const uid=()=>globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const assets=['forest','river','camp','sky'].map(name=>`assets/social/${name}.svg`);
const discoveryDefaults=()=>({accountFollows:[],creatorFollows:[],likes:[],collections:[],comments:{},progress:{},history:[],fontSize:18});
const fresh=()=>({version:1,profile:{id:'me',name:'林间旅人',signature:'在这里，遇见生活的小小回声。',emoji:'🌿'},friends:[],messages:[],groups:[],messagesByGroup:{},statuses:{},posts:[],drafts:{},scrolls:{},settings:{demoPaused:false,demoCursor:0,petReminders:true},seenPosts:{},events:[],discovery:discoveryDefaults()});
const requestValue=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
function transactionDone(tx){return new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('本地保存失败'));tx.onabort=()=>reject(tx.error||new Error('本地保存已中断'));});}
function storageError(error){const wrapped=new Error(error?.name==='QuotaExceededError'?'本地空间不足，请释放浏览器存储空间后重试。':'无法保存到此浏览器，请检查存储权限后重试。');wrapped.cause=error;return wrapped;}
function requireFriend(state,id){if(!state.friends.includes(id))throw new Error('请先添加这位好友。');}
function requirePerson(state,id){if(id!=='me')requireFriend(state,id);}
function textValue(value,max=4000){return String(value||'').trim().slice(0,max);}
function makeStatus(payload){if(!STATES.some(item=>item.id===payload.kind))throw new Error('请选择一个状态。');const now=Date.now();return {id:uid(),kind:payload.kind,text:textValue(payload.text,500),mediaId:payload.mediaId||null,createdAt:now,expiresAt:now+DAY};}
function requireContent(ref){if(!validContentRef(ref))throw new Error('这条内容暂时无法查看。');return {type:ref.type,id:ref.id};}
function contentKey(ref){const valid=requireContent(ref);return `${valid.type}:${valid.id}`;}
function makePost(payload,authorId,id=uid()){const text=textValue(payload.text),mediaIds=(payload.mediaIds||[]).slice(),contentRef=payload.contentRef?requireContent(payload.contentRef):null;if(mediaIds.length>9)throw new Error('朋友圈最多添加九张照片。');if(!text&&!mediaIds.length&&!contentRef)throw new Error('写一点内容或添加一张照片吧。');return {id,authorId,text,mediaIds,...(contentRef?{contentRef}:{}),createdAt:Date.now(),likes:[],comments:[]};}
function messagePayload(payload){const type=payload.type||'text';if(!['text','image','sticker','moment','content'].includes(type))throw new Error('不支持的消息类型。');const text=textValue(payload.text);if((type==='text'||type==='sticker')&&!text)throw new Error('消息不能为空。');if(type==='image'&&!payload.mediaId)throw new Error('请先选择图片。');if(type==='moment'&&!payload.momentId)throw new Error('这条回忆不存在。');return {type,text,mediaId:payload.mediaId||null,momentId:payload.momentId||null,...(type==='content'?{contentRef:requireContent(payload.contentRef)}:{})};}
function seedFriend(state,id){
  const index=FRIENDS.findIndex(friend=>friend.id===id),now=Date.now();
  const captions=[['今天的森林，比昨天又绿了一点。','桥边的水声，是最好的白噪音。','围着篝火坐一会儿，烦恼也慢慢变小了。','没有特别的事，只是想和你分享一片晴天。'],['背上小包，去找一条没走过的小路。','旅行的意义，也藏在停下来的时候。','我的露营清单：一盏灯，一杯茶，还有好朋友。','今天走得不远，但看见了很多。'],['叶子在发呆，我也在。','把今天调成静音，听听溪水。','困了就休息一下，世界会等你的。','如果快乐有颜色，大概是浅浅的绿。'],['认真收集每一束穿过树叶的光。','慢慢走，也能遇见很好的风景。','今天的任务：照看篝火，等待朋友。','愿你今晚睡一个暖暖的觉。']][index];
  for(let i=0;i<4;i++){
    const other=FRIENDS[(index+i+1)%4].id;
    state.posts.push({id:`seed-${id}-${i}`,authorId:id,text:captions[i],mediaIds:i===3?[]:[assets[(i+index)%4]],createdAt:now-i*DAY-3600000,likes:[other,...(i===0?[FRIENDS[(index+2)%4].id]:[])],comments:i===0?[{id:`seed-comment-${id}`,authorId:other,text:'下次一起去！',createdAt:now-1800000}]:[]});
  }
  state.statuses[id]=makeStatus({kind:['happy','travel','relax','music'][index],text:captions[0],mediaId:assets[index]});
}

export async function createSocialStore({dbName='forest-letters-social-v1',indexedDB:factory=globalThis.indexedDB}={}){
  if(!factory)throw new Error('此浏览器不支持本地存储，请使用现代浏览器打开。');
  const opening=factory.open(dbName,1);
  opening.onupgradeneeded=()=>{const db=opening.result;db.createObjectStore('state');db.createObjectStore('media');};
  const db=await new Promise((resolve,reject)=>{opening.onsuccess=()=>resolve(opening.result);opening.onerror=()=>reject(storageError(opening.error));opening.onblocked=()=>reject(new Error('请关闭其他旧版本页面，再刷新此页面。'));});
  db.onversionchange=()=>db.close();
  let initial;
  try{initial=await requestValue(db.transaction('state','readonly').objectStore('state').get('main'));}catch(error){db.close();throw storageError(error);}
  let state=initial?{...fresh(),...initial,settings:{...fresh().settings,...initial.settings},discovery:{...discoveryDefaults(),...initial.discovery}}:fresh();
  const listeners=new Set(),urls=new Map();let queue=Promise.resolve(),disposed=false;
  const emit=event=>{for(const fn of listeners){try{fn(state,event);}catch(error){console.error('Social subscriber failed',error);}}};
  function mutate(type,fn,details={}){
    const task=queue.then(async()=>{
      if(disposed)throw new Error('社交存储已关闭。');
      const next=clone(state),result=fn(next);
      if(result===false)return false;
      try{const tx=db.transaction('state','readwrite'),done=transactionDone(tx);tx.objectStore('state').put(next,'main');await done;}catch(error){throw storageError(error);}
      state=next;emit({type,...details});return result===undefined?true:result;
    });queue=task.catch(()=>{});return task;
  }
  const store={
    get state(){return state;},
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    addFriend(id){return mutate('friend-added',next=>{if(!FRIENDS.some(friend=>friend.id===id))throw new Error('未找到这位好友。');if(next.friends.includes(id))return false;next.friends.push(id);seedFriend(next,id);},{friendId:id});},
    setCharacterPosition(id,position){return mutate('character-position',next=>{requireFriend(next,id);if(!Number.isFinite(position?.x)||!Number.isFinite(position?.z)||Math.abs(position.x)>30||Math.abs(position.z)>30)throw new Error('无效的人物位置。');(next.characterPositions??={})[id]={x:position.x,z:position.z};},{friendId:id});},
    sendMessage(friendId,payload){return mutate('message-sent',next=>{requireFriend(next,friendId);const data=messagePayload(payload);if(data.type==='moment'&&!next.posts.some(post=>post.id===data.momentId))throw new Error('这条回忆不存在。');const message={id:uid(),friendId,senderId:'me',...data,createdAt:Date.now(),read:true};next.messages.push(message);return message;},{friendId,payload});},
    receiveMessage(friendId,payload,eventId){return mutate('message-received',next=>{requireFriend(next,friendId);if(eventId&&next.events.includes(eventId))return false;const message={id:eventId||uid(),friendId,senderId:friendId,...messagePayload(payload),createdAt:Date.now(),read:false};next.messages.push(message);if(eventId)next.events.push(eventId);return message;},{friendId,eventId});},
    markRead(friendId){return mutate('read',next=>{let changed=false;for(const message of next.messages)if(message.friendId===friendId&&!message.read){message.read=true;changed=true;}return changed;},{friendId});},
    setDraft(friendId,text){return mutate('draft',next=>{requireFriend(next,friendId);next.drafts[friendId]=String(text||'').slice(0,4000);},{friendId});},
    setScroll(friendId,value){return mutate('scroll',next=>{next.scrolls[friendId]=Math.max(0,Number(value)||0);},{friendId});},
    publishStatus(payload,authorId='me'){return mutate('status',next=>{requirePerson(next,authorId);next.statuses[authorId]=makeStatus(payload);},{authorId});},
    clearStatus(authorId='me'){return mutate('status',next=>{if(!next.statuses[authorId])return false;delete next.statuses[authorId];},{authorId});},
    publishPost(payload,authorId='me'){return mutate('post',next=>{requirePerson(next,authorId);const post=makePost(payload,authorId);next.posts.push(post);return post;},{authorId});},
    toggleLike(postId){return mutate('like',next=>{const post=next.posts.find(item=>item.id===postId);if(!post)throw new Error('这条回忆不存在。');post.likes=post.likes.includes('me')?post.likes.filter(id=>id!=='me'):[...post.likes,'me'];},{postId});},
    addComment(postId,text){return mutate('comment',next=>{const post=next.posts.find(item=>item.id===postId),value=textValue(text,1000);if(!post)throw new Error('这条回忆不存在。');if(!value)throw new Error('评论不能为空。');post.comments.push({id:uid(),authorId:'me',text:value,createdAt:Date.now()});},{postId});},
    markPostsSeen(friendId){return mutate('posts-seen',next=>{next.seenPosts[friendId]=Date.now();},{friendId});},
    updateProfile(payload){return mutate('profile',next=>{if(payload.name!==undefined){const name=textValue(payload.name,24);if(!name)throw new Error('昵称不能为空。');next.profile.name=name;}if(payload.signature!==undefined)next.profile.signature=textValue(payload.signature,100);});},
    setDemoPaused(value){return mutate('demo-paused',next=>{next.settings.demoPaused=!!value;});},
    restartDemo(){return mutate('demo-restart',next=>{next.settings.demoCursor=0;next.settings.demoPaused=false;});},
    followContent(kind,id){return mutate('discovery-follow',next=>{if(kind!=='account'&&kind!=='creator')throw new Error('不支持的关注类型。');if(!(kind==='account'?getAccount(id):getCreator(id)))throw new Error('这个账号不存在。');const field=kind==='account'?'accountFollows':'creatorFollows',list=next.discovery[field];next.discovery[field]=list.includes(id)?list.filter(value=>value!==id):[...list,id];},{kind,id});},
    toggleContentLike(ref){return mutate('discovery-like',next=>{const key=contentKey(ref),list=next.discovery.likes;next.discovery.likes=list.includes(key)?list.filter(value=>value!==key):[...list,key];},{ref});},
    toggleContentCollection(ref){return mutate('discovery-collection',next=>{const key=contentKey(ref),list=next.discovery.collections;next.discovery.collections=list.includes(key)?list.filter(value=>value!==key):[...list,key];},{ref});},
    addContentComment(ref,text){return mutate('discovery-comment',next=>{const key=contentKey(ref),value=textValue(text,1000);if(!value)throw new Error('评论不能为空。');const comment={id:uid(),authorId:'me',text:value,createdAt:Date.now()};(next.discovery.comments[key]??=[]).push(comment);return comment;},{ref});},
    setContentProgress(ref,value){return mutate('discovery-progress',next=>{const key=contentKey(ref),number=Number(value);if(!Number.isFinite(number)||number<0)throw new Error('无效的浏览进度。');const progress=ref.type==='video'?Math.min(number,getContent(ref).duration):number;if(next.discovery.progress[key]===progress)return false;next.discovery.progress[key]=progress;},{ref});},
    visitContent(ref){return mutate('discovery-visit',next=>{requireContent(ref);next.discovery.history=[{type:ref.type,id:ref.id,visitedAt:Date.now()},...next.discovery.history.filter(item=>item.type!==ref.type||item.id!==ref.id)].slice(0,100);},{ref});},
    setReadingFont(size){return mutate('discovery-font',next=>{const number=Number(size);if(!Number.isFinite(number)||number<14||number>26)throw new Error('字号应在 14–26 之间。');next.discovery.fontSize=number;});},
    demoEvent(friendId,cursor){return mutate('demo-event',next=>{
      requireFriend(next,friendId);const eventId=`ambient-${cursor}-${friendId}`;next.settings.demoCursor=cursor+1;
      if(next.events.includes(eventId))return;
      next.events.push(eventId);const kind=cursor%3;
      if(kind===0)next.messages.push({id:eventId,friendId,senderId:friendId,type:'text',text:['刚刚听见溪水的声音，突然想和你说声嗨。','今天有什么让你开心的小事吗？','我在这里，等你有空来坐一会儿。'][Math.floor(cursor/3)%3],mediaId:null,momentId:null,createdAt:Date.now(),read:false});
      if(kind===1)next.statuses[friendId]=makeStatus({kind:STATES[(cursor+2)%STATES.length].id,text:'给今天留一个小小的注脚。',mediaId:assets[cursor%4]});
      if(kind===2)next.posts.push(makePost({text:'又收集到一段想与你分享的时光。',mediaIds:[assets[cursor%4]]},friendId,eventId));
    },{friendId,cursor});},
    async importImage(file){
      if(!file||file.size>10*1024*1024)throw new Error('每张图片不能超过 10 MB。');
      if(!/^image\/(jpeg|png|webp|gif|avif|bmp)$/i.test(file.type))throw new Error('请选择 JPG、PNG、WebP、GIF、AVIF 或 BMP 图片。');
      let bitmap;
      try{bitmap=await createImageBitmap(file);}catch{throw new Error('无法读取这张图片，请换一张重试。');}
      const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.84));if(!blob)throw new Error('图片压缩失败，请重试。');
      const id=`media-${uid()}`;
      try{const tx=db.transaction('media','readwrite'),done=transactionDone(tx);tx.objectStore('media').put(blob,id);await done;}catch(error){throw storageError(error);}return id;
    },
    async mediaUrl(id){if(!id)return '';if(/^assets\/[a-zA-Z0-9_./-]+$/.test(id)&&!id.includes('..'))return id;if(urls.has(id))return urls.get(id);let blob;try{blob=await requestValue(db.transaction('media','readonly').objectStore('media').get(id));}catch(error){throw storageError(error);}if(!blob)throw new Error('这张本地图片暂时无法读取。');const url=URL.createObjectURL(blob);urls.set(id,url);return url;},
    dispose(){disposed=true;listeners.clear();for(const url of urls.values())URL.revokeObjectURL(url);urls.clear();queue.finally(()=>db.close());},
  };
  for(const [id,status] of Object.entries(state.statuses))if(status.expiresAt<=Date.now())await store.clearStatus(id);
  return store;
}

// Active-time timers do not produce a burst after a background tab resumes.
export function startDemo(store){
  let disposed=false,busy=false,last=performance.now(),ambientRemaining=60000;
  const pending=new Map();
  function schedule(key,friendId,payload,delay){if(!store.state.events.includes(key)&&!pending.has(key))pending.set(key,{key,friendId,payload,remaining:delay});}
  function greeting(id){schedule(`greeting-${id}`,id,{type:'text',text:`你好呀，我是${FRIENDS.find(friend=>friend.id===id)?.name||'你的朋友'}。很高兴在这片森林遇见你 🌿`},2000);}
  function scheduleReply(message){const index=FRIENDS.findIndex(friend=>friend.id===message.friendId);const texts=['收到你的来信啦！今天的阳光也分你一半。','记下了！下次一起去溪边走走吧。','嗯嗯，我在认真听。慢慢说，不着急。','看见你的消息，今天又多了一点温暖。'];const payload=message.type==='sticker'?{type:'sticker',text:['🌻','🦊','🐰','🐻'][index]}:message.type==='image'?{type:'text',text:'这张照片真好看，谢谢你把这一刻分享给我。'}:message.type==='moment'?{type:'text',text:'你也喜欢这段回忆呀！看到它，我又想起那天了。'}:{type:'text',text:texts[index]};schedule(`reply-${message.id}`,message.friendId,payload,1000+(message.createdAt%2001));}
  for(const id of store.state.friends)greeting(id);
  for(const message of store.state.messages)if(message.senderId==='me')scheduleReply(message);
  const unsubscribe=store.subscribe((state,event)=>{if(event.type==='friend-added')greeting(event.friendId);if(event.type==='message-sent'){const message=state.messages[state.messages.length-1];scheduleReply(message);}if(event.type==='demo-restart'){ambientRemaining=2000;for(const id of state.friends)greeting(id);}});
  async function tick(){
    const now=performance.now(),delta=Math.min(500,Math.max(0,now-last));last=now;
    if(disposed||busy)return;
    busy=true;
    try{
      for(const [id,status] of Object.entries(store.state.statuses))if(status.expiresAt<=Date.now())await store.clearStatus(id);
      if(globalThis.document?.hidden||store.state.settings.demoPaused)return;
      for(const item of pending.values()){item.remaining-=delta;if(item.remaining<=0){await store.receiveMessage(item.friendId,item.payload,item.key);pending.delete(item.key);break;}}
      if(store.state.friends.length){ambientRemaining-=delta;if(ambientRemaining<=0){const cursor=store.state.settings.demoCursor||0,id=store.state.friends[cursor%store.state.friends.length];await store.demoEvent(id,cursor);ambientRemaining=45000+((cursor*7919+15317)%30001);}}
    }catch(error){console.warn('Local demo paused after a storage failure',error);ambientRemaining=60000;}finally{busy=false;}
  }
  const timer=setInterval(tick,250);
  return {dispose(){disposed=true;clearInterval(timer);unsubscribe();pending.clear();}};
}
