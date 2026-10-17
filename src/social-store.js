import {SCENE_THEMES} from './scene-theme.js';
import {inWorld} from './world-surface.js';
import {groupStoreMethods} from './group-store.js';
import {getContent,getAccount,getCreator,validContentRef} from './discovery-catalog.js';
// All visible social data is local. A mutation becomes visible only after IDB commits.
export const FRIENDS = [
  {id:'tuantuan',name:'团团',animal:'kangaroo',emoji:'🦘',color:'#eaba43',signature:'把小事过成好日子。',height:2.1},
  {id:'ali',name:'阿栗',animal:'fox',emoji:'🦊',color:'#c8794e',signature:'今天也想走远一点。',height:1.9},
  {id:'xiaomian',name:'小眠',animal:'rabbit',emoji:'🐰',color:'#b5c2a5',signature:'慢一点，也会抵达。',height:1.85},
  {id:'shanshan',name:'山山',animal:'bear',emoji:'🐻',color:'#aa8265',signature:'收集森林里的好天气。',height:2},
].map(friend=>({...friend,modelUrl:`assets/rodin-friends/${friend.animal}/scene.glb`}));
export const friendOf=(state,id)=>FRIENDS.find(f=>f.id===id)||state.customFriends?.[id]||null;
export const allFriends=state=>[...FRIENDS,...Object.values(state.customFriends||{})];
export const friendAvatar=friend=>friend?.avatarUrl||`assets/rodin-friends/${friend?.animal||'bear'}/portrait.webp`;

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
const discoveryDefaults=()=>({accountFollows:['hyper3d'],accountFeedVersion:1,creatorFollows:[],likes:[],collections:[],comments:{},progress:{},history:[],fontSize:18});
const fresh=()=>({version:1,profile:{id:'me',name:'林间旅人',signature:'在这里，遇见生活的小小回声。',emoji:'🌿'},friends:[],pinnedFriends:[],messages:[],groups:[],pinnedGroups:[],groupBuildingSlots:Object.fromEntries(Object.keys(SCENE_THEMES).map(id=>[id,{}])),residentGroups:[],conversationAttachments:{},messagesByGroup:{},statuses:{},posts:[],drafts:{},scrolls:{},settings:{demoPaused:false,demoCursor:0,petReminders:true},seenPosts:{},events:[],discovery:discoveryDefaults()});
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
    ...groupStoreMethods({mutate,person:friendOf,payload:messagePayload}),
    get state(){return state;},
    flush(){return queue;},
    getFriend(id){return friendOf(state,id);},
    addAvatarContact(profile){return mutate('friend-added',next=>{
      const account=String(profile.account||'').trim(),name=String(profile.name||'').trim();
      if(!/^[a-zA-Z0-9_.-]{3,64}$/.test(account)||!name||! /^[a-f0-9-]{36}$/.test(profile.jobId||''))throw new Error('请填写昵称和有效账号（3–64 位字母、数字、点、下划线或短横线）。');
      if(allFriends(next).some(f=>(f.account||f.id).toLowerCase()===account.toLowerCase()))throw new Error('这个账号已经在联系人中。');
      const avatarUrl=String(profile.avatarUrl||'');if(!/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/]+=*$/.test(avatarUrl)||avatarUrl.length>8*1024*1024)throw new Error('请选择有效的好友头像。');
      const id=`avatar-${profile.jobId}`;
      (next.customFriends??={})[id]={id,account,name:name.slice(0,40),signature:String(profile.signature||'').trim().slice(0,100),animal:'custom',emoji:'🌱',color:'#a7b98d',height:1.85,avatarUrl,jobId:profile.jobId,modelUrl:null,modelPhase:'queued',modelError:''};
      next.friends.push(id);return id;
    },{friendId:`avatar-${profile.jobId}`});},
    updateFriendModel(id,job){return mutate('friend-model',next=>{
      requireFriend(next,id);const friend=next.customFriends?.[id];if(!friend||job.id!==friend.jobId)throw new Error('形象任务与好友不匹配。');
      if(friend.modelPhase==='ready'&&job.phase!=='ready')return false;
      const base=`/api/avatar/assets/${friend.jobId}/`;
      if(job.phase==='ready'&&job.modelUrl!==base+'scene.glb')throw new Error('形象模型地址无效。');
      const patch={modelPhase:String(job.phase),modelError:String(job.error||'').slice(0,300)};
      if(job.phase==='ready'){patch.modelUrl=job.modelUrl;if(job.referenceUrl===base+'reference.img')patch.portraitUrl=job.referenceUrl;}
      if(Object.entries(patch).every(([k,v])=>friend[k]===v))return false;Object.assign(friend,patch);
    },{friendId:id});},
    addGeneratedFriend(profile){return mutate('friend-added',next=>{
      const id=`avatar-${profile.jobId}`,base=`/api/avatar/assets/${profile.jobId}/`;
      if(!/^[a-f0-9-]{36}$/.test(profile.jobId||'')||profile.modelUrl!==base+'scene.glb'||profile.avatarUrl!==base+'avatar.img'||!String(profile.name||'').trim())throw new Error('生成好友资料无效。');
      if(next.friends.includes(id))return false;
      (next.customFriends??={})[id]={id,name:String(profile.name).trim().slice(0,40),animal:'custom',emoji:'🌱',color:'#a7b98d',height:1.85,signature:'从一张头像，走进这片森林。',avatarUrl:profile.avatarUrl,portraitUrl:profile.referenceUrl,modelUrl:profile.modelUrl,jobId:profile.jobId};
      next.friends.push(id);if(profile.pinned!==false)next.pinnedFriends.push(id);
    },{friendId:`avatar-${profile.jobId}`});},
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    addFriend(id){return mutate('friend-added',next=>{if(!FRIENDS.some(friend=>friend.id===id))throw new Error('未找到这位好友。');if(next.friends.includes(id))return false;next.friends.push(id);seedFriend(next,id);},{friendId:id});},
    setFriendPinned(id,pinned){return mutate('friend-pinned',next=>{requireFriend(next,id);const ids=new Set(next.pinnedFriends||[]);if(pinned)ids.add(id);else ids.delete(id);next.pinnedFriends=[...ids];},{friendId:id});},
    setCharacterPosition(id,position){return mutate('character-position',next=>{requireFriend(next,id);if(!inWorld(position?.x,position?.z))throw new Error('无效的人物位置。');(next.characterPositions??={})[id]={x:position.x,z:position.z};},{friendId:id});},
    sendMessage(friendId,payload){return mutate('message-sent',next=>{requireFriend(next,friendId);const data=messagePayload(payload);if(data.type==='moment'&&!next.posts.some(post=>post.id===data.momentId))throw new Error('这条回忆不存在。');const message={id:uid(),friendId,senderId:'me',...data,createdAt:Date.now(),read:true};next.messages.push(message);return message;},{friendId,payload});},
    receiveMessage(friendId,payload,eventId){return mutate('message-received',next=>{requireFriend(next,friendId);if(eventId&&next.events.includes(eventId))return false;const message={id:eventId||uid(),friendId,senderId:friendId,...messagePayload(payload),createdAt:Date.now(),read:false};next.messages.push(message);if(eventId)next.events.push(eventId);return message;},{friendId,eventId});},
    markRead(friendId,ids=null){return mutate('read',next=>{let changed=false;for(const message of next.messages)if(message.friendId===friendId&&!message.read&&(!ids||ids.includes(message.id))){message.read=true;changed=true;}return changed;},{friendId});},
    setDraft(friendId,text){return mutate('draft',next=>{requireFriend(next,friendId);next.drafts[friendId]=String(text||'').slice(0,4000);},{friendId});},
    setScroll(friendId,value){return mutate('scroll',next=>{next.scrolls[friendId]=Math.max(0,Number(value)||0);},{friendId});},
    publishStatus(payload,authorId='me'){return mutate('status',next=>{requirePerson(next,authorId);next.statuses[authorId]=makeStatus(payload);},{authorId});},
    clearStatus(authorId='me'){return mutate('status',next=>{if(!next.statuses[authorId])return false;delete next.statuses[authorId];},{authorId});},
    publishPost(payload,authorId='me'){return mutate('post',next=>{requirePerson(next,authorId);const post=makePost(payload,authorId);next.posts.push(post);return post;},{authorId});},
    toggleLike(postId){return mutate('like',next=>{const post=next.posts.find(item=>item.id===postId);if(!post)throw new Error('这条回忆不存在。');post.likes=post.likes.includes('me')?post.likes.filter(id=>id!=='me'):[...post.likes,'me'];},{postId});},
    addComment(postId,text){return mutate('comment',next=>{const post=next.posts.find(item=>item.id===postId),value=textValue(text,1000);if(!post)throw new Error('这条回忆不存在。');if(!value)throw new Error('评论不能为空。');post.comments.push({id:uid(),authorId:'me',text:value,createdAt:Date.now()});},{postId});},
    markPostsSeen(friendId){return mutate('posts-seen',next=>{next.seenPosts[friendId]=Date.now();},{friendId});},
    updateProfile(payload){return mutate('profile',next=>{if(payload.name!==undefined){const name=textValue(payload.name,24);if(!name)throw new Error('昵称不能为空。');next.profile.name=name;}if(payload.signature!==undefined)next.profile.signature=textValue(payload.signature,100);});},
    setSoundEnabled(kind,value){return mutate('sound-settings',next=>{if(!['music','effects'].includes(kind)||typeof value!=='boolean')throw new Error('无效的声音设置。');next.settings[kind==='music'?'musicEnabled':'effectsEnabled']=value;});},
    selectMusicTrack(id){return mutate('sound-settings',next=>{if(!['forest','spring'].includes(id))throw new Error('未知的背景音乐。');next.settings.musicTrack=id;next.settings.musicEnabled=true;});},
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
  // One-time switch to the requested Hyper3D subscription; keep saved content and shares.
  if(initial?.discovery?.accountFeedVersion!==1)await mutate('discovery-subscriptions',next=>{next.discovery.accountFollows=['hyper3d'];next.discovery.accountFeedVersion=1;});
  await mutate('group-building-migration',next=>{
    const valid=new Set(next.groups.filter(g=>!g.leftAt).map(g=>g.id));
    next.pinnedGroups=[...new Set(next.pinnedGroups||[])].filter(id=>valid.has(id)).slice(0,9);
    next.groupBuildingSlots=Object.fromEntries(Object.keys(SCENE_THEMES).map(theme=>{const used=new Set();return[theme,Object.fromEntries(next.pinnedGroups.flatMap(id=>{const slot=next.groupBuildingSlots?.[theme]?.[id];if(!Number.isInteger(slot)||slot<0||slot>=9||used.has(slot))return[];used.add(slot);return[[id,slot]];}))];}));
    if(initial&&JSON.stringify([initial.pinnedGroups,initial.groupBuildingSlots])===JSON.stringify([next.pinnedGroups,next.groupBuildingSlots]))return false;
  });
  for(const [id,status] of Object.entries(state.statuses))if(status.expiresAt<=Date.now())await store.clearStatus(id);
  return store;
}

// Active-time timers do not produce a burst after a background tab resumes.
const CHATTY_FRIENDS={
  tuantuan:{interval:[16000,28000],texts:['刚刚看到一片很像小船的叶子，想拿给你看。','你现在在忙什么呀？我在广场晒太阳。','今天也要记得喝水，我已经替你提醒自己了 🌿','想邀请你去桥边走走，不赶时间的那种。','我发现森林里又长出了一簇小花！','没有什么大事，就是想找你说说话。']},
  ali:{interval:[22000,36000],texts:['刚沿着山路走了一圈，风景很好。','下次想走远一点，你愿意一起吗？','我在整理小背包，带些什么好呢？','溪边有一条没走过的小路，先记在我的地图上。','走到树荫下休息了，顺便给你写封信。','你有没有特别想去的地方？']},
  xiaomian:{interval:[30000,48000],texts:['刚刚发了一会儿呆……现在来看看你。','这里很安静，分你一点安静的时间。','忙的话晚点回我也没关系。','我在听叶子和风说话，好像有点困了。','今天有没有好好休息呀？','给你留了一个树荫下的位置，慢慢来。']},
  shanshan:{interval:[24000,40000],texts:['篝火照看好了，等你有空来坐坐。','刚收集到一束很好看的光，想分享给你。','今天有什么值得记下的小事吗？','我在广场附近，随时可以找我。','走累了就停一会儿吧，我陪你。','森林里的天气很好，希望你那里也是。']},
};

export function startDemo(store,{random=Math.random,getSceneParticipants=()=>({friends:[],groups:[]})}={}){
  let disposed=false,busy=false,last=performance.now(),remaining=10000;
  const cursors=new Map(),replies=[];
  const pick=items=>items[Math.min(items.length-1,Math.floor(Math.max(0,random())*items.length))];
  const unsubscribe=store.subscribe((state,event)=>{
    if(event.type==='demo-restart'){remaining=10000;last=performance.now();replies.length=0;}
    if(event.type==='message-sent')replies.push({friendId:event.friendId,remaining:1000+Math.max(0,Math.min(1,random()))*2000,at:performance.now()});
  });
  async function tick(){
    const now=performance.now(),delta=Math.min(500,Math.max(0,now-last));last=now;
    if(disposed||busy)return;
    busy=true;
    try{
      for(const [id,status] of Object.entries(store.state.statuses))if(status.expiresAt<=Date.now())await store.clearStatus(id);
      if(globalThis.document?.hidden||store.state.settings.demoPaused)return;
      for(const reply of [...replies]){
        reply.remaining-=Math.min(delta,Math.max(0,now-reply.at));reply.at=now;
        if(reply.remaining>0)continue;
        replies.splice(replies.indexOf(reply),1);
        if(store.state.friends.includes(reply.friendId))await store.receiveMessage(reply.friendId,{type:'text',text:pick(['收到啦，很高兴听你说这些。','嗯嗯，我在听，接着聊吧。','好呀，等会儿一起去森林里走走？','看到你的消息，心情都变好了 🌿','我也这么想，慢慢说，我陪着你。','刚刚在发呆，现在来陪你聊天。'])});
      }
      remaining-=delta;if(remaining>0)return;
      // One global slot, never a per-friend/group timer or catch-up burst.
      remaining=10000;
      const state=store.state;
      // A group already on stage must not starve friends whose unread message would summon them.
      const friends=state.friends.filter(id=>friendOf(state,id)?.modelUrl);
      const groups=state.groups.filter(g=>!g.leftAt&&g.memberIds.some(id=>id!=='me'));
      const candidates=[...friends.map(id=>({kind:'friend',id})),...groups.map(g=>({kind:'group',id:g.id,group:g}))];
      if(!candidates.length)return;
      const selected=candidates[Math.min(candidates.length-1,Math.floor(Math.max(0,random())*candidates.length))];
      const key=selected.kind+':'+selected.id,index=cursors.get(key)||0;
      if(selected.kind==='friend'){
        const texts=(CHATTY_FRIENDS[selected.id]||CHATTY_FRIENDS.shanshan).texts;
        await store.receiveMessage(selected.id,{type:'text',text:texts[index%texts.length]},`proactive-${uid()}`);
      }else{
        const members=selected.group.memberIds.filter(id=>id!=='me'),sender=members[Math.min(members.length-1,Math.floor(Math.max(0,random())*members.length))];
        await store.receiveGroupMessage(selected.id,sender,{text:['大家有空时来聊聊今天的安排。','刚有个新想法，想听听大家的意见。','把小小的进展分享给大家 🌿'][index%3]});
      }
      cursors.set(key,index+1);
    }catch(error){console.warn('Local demo paused after a storage failure',error);remaining=10000;}finally{busy=false;}
  }
  const timer=setInterval(tick,250);
  return {dispose(){disposed=true;clearInterval(timer);unsubscribe();cursors.clear();replies.length=0;}};
}
