import { FRIENDS, STATES } from './social-store.js';
import { getPublicPosts, getNewPublicPosts } from './social-feed.js';
import { getContent, getAccount, getCreator } from './discovery-catalog.js';
import { createAnchorLayout } from './social-anchor-layout.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time = value => new Date(value).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
const date = value => new Date(value).toLocaleDateString('zh-CN',{month:'long',day:'numeric'});
const STICKERS = [ ['🌼','送你一朵小花'], ['🐾','我来啦！'], ['☕','歇一会儿'], ['🌙','晚安好梦'], ['🫶','接住温柔'], ['🍀','好运发生'] ];
const EMOJI = ['😊','🥰','😂','🥹','🤔','😴','😭','✨','💛','🌿','🌈','👍'];

export function createSocialUI({store,characters,controls,onOpenContent=route=>window.__openDiscovery?.(route)}) {
  const root=document.createElement('div');root.id='social';document.body.append(root);
  root.innerHTML=`
    <div id="friend-anchors"></div>
    <div id="first-invitation" class="invitation"><span class="invitation-icon">✉</span><h1>给风景，添一位朋友。</h1><p>从一次问好开始，让小小的溪谷热闹起来。</p><button class="primary" data-action="directory">认识第一位朋友 <span>↗</span></button></div>
    <nav class="social-dock"><button data-action="directory" class="dock-button"><span>♧</span> 好友 <b id="total-unread" hidden></b></button><button data-action="public-moments" class="dock-button" aria-label="公共朋友圈"><span>▧</span> 朋友圈 <b id="public-feed-unread" hidden></b></button><button data-action="discover" class="dock-button"><span>✧</span> 发现</button><button data-action="me" class="dock-button"><span>◉</span> 我</button></nav>
    <section id="directory" class="drawer paper" hidden aria-label="好友通讯录"><header><div><small>OUR LITTLE NEIGHBOURHOOD</small><h2>溪谷里的朋友</h2></div></header><p class="muted">每一次认识，都是风景的新一页。</p><label class="search">⌕ <input id="friend-search" placeholder="搜索昵称或演示 ID" aria-label="搜索好友"></label><div class="directory-tabs"><button data-action="directory-tab" data-tab="all" class="active">添加好友</button><button data-action="directory-tab" data-tab="added">我的朋友 <span id="friend-count"></span></button></div><div id="friend-list"></div></section>
    <section id="meeting" hidden aria-label="好友会客空间" data-moments="closed">
      <div class="meeting-workspace">
        <aside class="meeting-friends paper" aria-label="好友列表"><header><small>LETTERS FROM THE WOODS</small><h2>好友</h2><button class="text-button" data-action="directory">＋ 添加好友</button></header><label class="meeting-search"><input id="meeting-search" aria-label="筛选会话好友" placeholder="搜索好友"></label><div id="meeting-friend-list"></div><p class="workspace-hint">点击窗外，回到溪谷</p></aside>
        <section class="chat-panel paper"><header class="meeting-title"><span id="meeting-avatar" class="avatar"></span><div><h2 id="meeting-name"></h2><p id="meeting-signature"></p></div><button id="moments-toggle" class="secondary" data-action="toggle-moments" aria-expanded="false" aria-controls="moments-panel">朋友圈 <span>↗</span></button></header><div id="chat-messages" aria-live="polite" aria-label="聊天记录"></div><div id="chat-attachment" hidden></div><div id="chat-picker" hidden></div><form id="chat-form"><div class="composer-tools"><button type="button" data-action="emoji" aria-label="选择表情">☺</button><button type="button" data-action="stickers" aria-label="选择表情包">♧</button><button type="button" data-action="chat-image" aria-label="发送图片">▧</button><span>把今天说给他听</span></div><textarea id="chat-input" rows="2" maxlength="3000" placeholder="发消息…" aria-label="输入消息"></textarea><div class="composer-bottom"><small>Enter 发送 · Shift + Enter 换行</small><button class="primary" type="submit">发送 ↗</button></div></form></section>
        <section id="moments-panel" class="memory-panel paper" hidden aria-label="好友朋友圈"><header class="moments-toolbar"><h2>朋友圈</h2><button class="text-button" data-action="toggle-moments">收起 →</button></header><div id="moments-feed"></div></section>
      </div>
    </section>
    <dialog id="social-dialog" class="paper"></dialog><dialog id="photo-dialog"><img alt="完整照片"></dialog><dialog id="content-share-dialog" class="paper" aria-label="分享文章或视频"></dialog>
    <input id="chat-file" type="file" accept="image/*" hidden><div id="social-toast" role="status"></div>`;
  const $=id=>root.querySelector('#'+id);
  let active=null,directoryTab='all',picker=null,attachment=null,dialogKind=null,dialogOwner=null;
  let publishingFiles=[],publishKind=null,renderVersion=0,lastFriendSignature='',lastMessageSignature='',lastPostSignature='',scrollTimer,draftTimer,toastTimer,chatFileVersion=0,publishFileVersion=0,momentsOpen=false,lastMeetingList='',publishReturn=null,lastPublicSignature='';
  const anchorNodes=new Map();const messageWindows=new Map();const draftValues=new Map();const unreadArrival=new Map();
  const anchorLayout=createAnchorLayout();let orbiting=false,lastCameraMotion=-Infinity,lastAnchorFrame=0;
  const orbitStart=()=>{orbiting=true;lastCameraMotion=performance.now();};
  const orbitEnd=()=>{orbiting=false;lastCameraMotion=performance.now();};
  const orbitChange=()=>{lastCameraMotion=performance.now();};
  controls?.addEventListener('start',orbitStart);controls?.addEventListener('end',orbitEnd);controls?.addEventListener('change',orbitChange);
  const anchorSizes=new ResizeObserver(entries=>{for(const entry of entries)entry.target._anchorWidth=entry.contentRect.width;});
  const person=id=>id==='me'?store.state.profile:FRIENDS.find(f=>f.id===id)||{id,name:'林间朋友',emoji:'🌿',signature:''};
  const stateInfo=kind=>STATES.find(s=>s.id===kind)||{icon:'✨',label:kind||'此刻'};
  const chatVisible=()=>!!active&&!document.hidden&&$('directory').hidden&&!document.querySelector('dialog[open]')&&(innerWidth>760||!momentsOpen);
  const memoriesVisible=()=>!!active&&momentsOpen&&!document.hidden&&$('directory').hidden&&!document.querySelector('dialog[open]');
  const statusOf=id=>{const s=store.state.statuses[id];return s&&s.expiresAt>Date.now()?s:null;};
  const postsOf=id=>store.state.posts.filter(p=>p.authorId===id).sort((a,b)=>b.createdAt-a.createdAt);
  const unread=id=>store.state.messages.filter(m=>m.friendId===id&&m.senderId!=='me'&&!m.read).length;
  const avatar=id=>`<span class="avatar" style="--friend-color:${esc(person(id).color||'#a9bc98')}">${esc(person(id).emoji||'🌱')}</span>`;
  function toast(message){$('social-toast').textContent=message;$('social-toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('social-toast').classList.remove('visible'),4000);}
  async function attempt(fn){try{return await fn();}catch(error){console.error(error);toast(error.message||'没有保存成功，请重试。');return null;}}
  async function hydrate(scope=root){for(const img of scope.querySelectorAll('img[data-media]')){const id=img.dataset.media;try{const url=await store.mediaUrl(id);if(img.isConnected&&img.dataset.media===id)img.src=url;}catch{img.alt='图片暂不可用';img.classList.add('unavailable');}}}
  function photo(mediaId,cls=''){return `<button type="button" class="photo-button ${cls}" data-action="photo" data-media="${esc(mediaId)}"><img data-media="${esc(mediaId)}" alt="动态图片" loading="lazy"></button>`;}
  function profileLine(id){return `${avatar(id)}<div><strong>${esc(person(id).name)}</strong><p>${esc(person(id).signature)}</p></div>`;}
  function renderDirectory(){
    const query=$('friend-search').value.trim().toLowerCase();
    const filtered=FRIENDS.filter(f=>(directoryTab==='all'||store.state.friends.includes(f.id))&&`${f.name} ${f.id} ${f.animal}`.toLowerCase().includes(query));
    $('friend-count').textContent=store.state.friends.length;
    $('friend-list').innerHTML=filtered.map(f=>{const added=store.state.friends.includes(f.id);return `<article class="friend-card" style="--friend-color:${esc(f.color)}"><div class="friend-portrait"><img src="assets/rodin-friends/${esc(f.animal)}/portrait.webp" alt="${esc(f.name)}的三维形象"><span>${esc(f.animal.toUpperCase())}</span></div><div class="friend-card-copy"><h3>${esc(f.name)}${added?'<i class="tiny-dot"></i>':''}</h3><p>${esc(f.signature)}</p><small>@${esc(f.id)}</small><button class="${added?'secondary':'primary'}" data-action="${added?'open-friend':'add-friend'}" data-id="${f.id}">${added?'去找他 ↗':'＋ 添加到溪谷'}</button></div></article>`;}).join('')||'<p class="empty-note">这里还没有找到朋友。试试别的名字吧。</p>';
  }
  function renderSummary(){
    $('first-invitation').hidden=store.state.friends.length>0;
    const count=store.state.friends.reduce((n,id)=>n+unread(id),0);$('total-unread').textContent=count;$('total-unread').hidden=!count;
    const newPosts=getNewPublicPosts(store.state).length;$('public-feed-unread').hidden=!newPosts;$('public-feed-unread').textContent=newPosts;$('public-feed-unread').setAttribute('aria-label',`${newPosts}条新动态`);
    const signature=store.state.friends.join(',');if(signature!==lastFriendSignature){lastFriendSignature=signature;characters.sync(store.state.friends.map(person));renderDirectory();}
    for(const id of store.state.friends){const latest=store.state.messages.filter(m=>m.friendId===id&&m.senderId!=='me').at(-1);if(latest&&unreadArrival.get(id)?.id!==latest.id){if(unreadArrival.has(id))characters.pulse?.(id);unreadArrival.set(id,{id:latest.id,at:performance.now()});}}
    renderAnchors();renderMeetingFriends();
  }
  function renderAnchors(){
    for(const id of store.state.friends){let node=anchorNodes.get(id);if(!node){node=document.createElement('div');node.className='friend-anchor';node.dataset.friend=id;$('friend-anchors').append(node);anchorNodes.set(id,node);anchorSizes.observe(node);}
      const st=statusOf(id),info=st&&stateInfo(st.kind),messages=store.state.messages.filter(m=>m.friendId===id&&m.senderId!=='me'),last=messages.at(-1),n=unread(id);
      node.classList.toggle('has-unread',n>0);
      const fresh=postsOf(id).some(p=>p.createdAt>(store.state.seenPosts[id]||0));
      const html=`<div class="anchor-identity"><button class="anchor-name" data-action="open-friend" data-id="${id}">${esc(person(id).name)} ${fresh?'<i class="memory-spark"></i>':''}</button>${st?`<button class="status-badge" data-action="status" data-id="${id}" aria-label="查看${esc(person(id).name)}的${esc(info.label)}状态">${esc(info.icon)} <span>${esc(info.label)}</span></button>`:''}</div>${last?`<button class="head-message" data-action="open-friend" data-id="${id}">${last.type==='image'?`<img data-media="${esc(last.mediaId)}" alt="图片消息">`:last.type==='sticker'?`<span class="mini-sticker">${esc(last.text)}</span>`:esc(last.text||'分享了一段回忆')} ${n?`<b>${n}</b>`:''}</button><button class="unread-dot" data-action="open-friend" data-id="${id}" aria-label="${esc(person(id).name)}有${n}条未读" ${n?'':'hidden'}>${n}</button>`:''}`;
      if(node._html!==html){node._html=html;node.innerHTML=html;hydrate(node);}
    }
  }
  function renderMeetingFriends(){
    const query=$('meeting-search').value.trim().toLowerCase();
    const ids=store.state.friends.filter(id=>(person(id).name+' '+id).toLowerCase().includes(query));
    const html=ids.map(id=>{const f=person(id),last=store.state.messages.filter(m=>m.friendId===id).at(-1),n=unread(id);return `<button class="meeting-friend ${active===id?'active':''}" data-action="open-friend" data-id="${esc(id)}" title="${esc(f.name)}">${avatar(id)}<span class="meeting-friend-copy"><strong>${esc(f.name)}</strong><p>${esc(last?(last.type==='image'?'[图片]':last.type==='sticker'?'[表情]':last.type==='moment'?'[朋友圈]':last.text):f.signature)}</p></span>${n?`<b class="meeting-unread">${n}</b>`:''}</button>`;}).join('')||'<p class="empty-note">没有找到好友</p>';
    if(html!==lastMeetingList){lastMeetingList=html;$('meeting-friend-list').innerHTML=html;}
  }
  function setMoments(open){
    momentsOpen=!!open;$('meeting').dataset.moments=open?'open':'closed';$('moments-panel').hidden=!open;
    $('moments-toggle').setAttribute('aria-expanded',String(!!open));$('moments-toggle').innerHTML=open?'朋友圈 <span>↙</span>':'朋友圈 <span>↗</span>';
    if(open){renderMemories();if(memoriesVisible())attempt(()=>store.markPostsSeen(active));}
    else if(chatVisible()&&unread(active))attempt(()=>store.markRead(active));
  }
  function captureDraft(){if(!active)return;draftValues.set(active,$('chat-input').value);const id=active,value=$('chat-input').value;attempt(()=>store.setDraft(id,value));attempt(()=>store.setScroll(id,$('chat-messages').scrollTop));}
  async function openFriend(id){
    if(!store.state.friends.includes(id))return;
    const isNew=active!==id,wasOpen=active!==null;
    if(isNew){captureDraft();attachment=null;$('chat-attachment').hidden=true;}
    active=id;picker=null;$('chat-picker').hidden=true;$('directory').hidden=true;
    $('meeting').hidden=false;root.classList.add('in-meeting');
    $('meeting-avatar').textContent=person(id).emoji;$('meeting-name').textContent=person(id).name;$('meeting-signature').textContent=person(id).signature;
    if(isNew)$('chat-input').value=draftValues.get(id)??store.state.drafts[id]??'';
    if(isNew||!wasOpen)setMoments(false);
    characters.focus(id);renderMeetingFriends();
    if(!wasOpen&&!matchMedia('(prefers-reduced-motion: reduce)').matches)$('meeting').querySelector('.meeting-workspace').animate([{opacity:0,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:320,easing:'ease-out'});
    lastMessageSignature='';lastPostSignature='';renderMessages(true);
    if(chatVisible())await attempt(()=>store.markRead(id));
  }
  function closeMeeting(){captureDraft();active=null;attachment=null;setMoments(false);$('meeting').hidden=true;root.classList.remove('in-meeting');characters.restore();}
  function renderMessages(restore=false){
    if(!active)return;const all=store.state.messages.filter(m=>m.friendId===active),limit=messageWindows.get(active)||80,messages=all.slice(-limit);
    const signature=active+'|'+messages.map(m=>m.id).join('|');if(signature===lastMessageSignature&&!restore)return;lastMessageSignature=signature;
    const feed=$('chat-messages'),nearEnd=feed.scrollHeight-feed.scrollTop-feed.clientHeight<90,oldScroll=feed.scrollTop,oldHeight=feed.scrollHeight;
    let previous=0;feed.innerHTML=(all.length>limit?'<button class="load-earlier" data-action="earlier">查看更早的消息</button>':'<div class="chat-day">每一次对话，都值得珍藏</div>')+messages.map(m=>{let stamp='';if(m.createdAt-previous>5*60*1000){stamp=`<div class="chat-time">${date(m.createdAt)} ${time(m.createdAt)}</div>`;previous=m.createdAt;}let content=esc(m.text);
      if(m.type==='image')content=photo(m.mediaId,'chat-photo');
      if(m.type==='sticker')content=`<div class="sticker-message"><span>${esc(m.text.split(' ')[0])}</span><small>${esc(m.text.split(' ').slice(1).join(' '))}</small></div>`;
      if(m.type==='moment'){const post=store.state.posts.find(p=>p.id===m.momentId);content=`<button class="shared-memory" data-action="post" data-id="${esc(m.momentId)}"><small>▧ 朋友圈</small>${esc(post?.text||'这条朋友圈暂不可用')}</button>`;}
      if(m.type==='content')content=contentCard(m.contentRef);
      return stamp+`<div class="message ${m.senderId==='me'?'outgoing':'incoming'}" data-message="${esc(m.id)}">${avatar(m.senderId)}<div class="message-body ${m.type}">${content}</div></div>`;
    }).join('');hydrate(feed);
    const renderedFriend=active,generation=++renderVersion;requestAnimationFrame(()=>{if(active!==renderedFriend||generation!==renderVersion)return;if(restore){const saved=store.state.scrolls[renderedFriend];feed.scrollTop=saved??feed.scrollHeight;}else if(nearEnd)feed.scrollTop=feed.scrollHeight;else feed.scrollTop=oldScroll+Math.max(0,feed.scrollHeight-oldHeight);});
  }
  function profileHTML(id){const f=person(id);return `<div class="moments-profile"><div class="moments-cover"><img src="assets/social/forest.svg" alt="林间封面"></div><div class="moments-identity"><h2>${esc(f.name)}</h2>${avatar(id)}</div><p class="moments-signature">${esc(f.signature)}</p></div>`;}
  function timelineHTML(id){return profileHTML(id)+`<div class="moments-timeline">${postsOf(id).map(post=>{const d=new Date(post.createdAt);return `<article class="moment-entry" data-post-id="${esc(post.id)}"><time class="moment-date" datetime="${d.toISOString()}"><strong>${String(d.getDate()).padStart(2,'0')}</strong><small>${d.getMonth()+1}月</small></time><div class="moment-content">${postHTML(post,id==='me',true)}</div></article>`;}).join('')||'<p class="empty-note">还没有朋友圈。<br>把生活的小事留在这里。</p>'}</div>`;}
  function publicFeedHTML(){return `<div class="public-moments-shell"><header class="public-moments-header"><div><small>OUR EVERYDAY STORIES</small><h2>朋友圈</h2><p>朋友们的生活，都在这里。</p></div><button class="primary" data-action="publish-post">＋ 发表</button></header><div class="public-moments-scroll"><div class="public-moments-intro"><div class="moments-cover"><img src="assets/social/forest.svg" alt="朋友圈封面"></div><div class="public-owner">${profileLine('me')}</div></div><div id="public-moments-list">${getPublicPosts(store.state).map(post=>`<article class="public-moment" data-post-id="${esc(post.id)}" data-author-id="${esc(post.authorId)}"><button class="public-moment-author" data-action="feed-author" data-id="${esc(post.authorId)}">${avatar(post.authorId)}<span><strong>${esc(person(post.authorId).name)}</strong><small>${esc(person(post.authorId).signature)}</small></span></button><div class="public-moment-body"><time class="public-moment-time" datetime="${new Date(post.createdAt).toISOString()}">${date(post.createdAt)} ${time(post.createdAt)}</time>${postHTML(post,post.authorId==='me',true)}</div></article>`).join('')||'<div class="empty-note">这里还很安静。<br>添加一位好友，或分享你的第一条朋友圈。</div>'}</div><p class="public-moments-end">每一件小事，都值得分享</p></div></div>`;}
  function markPublicSeen(){if(dialogKind!=='public-moments'||document.hidden||$('photo-dialog').open)return;const ids=[...new Set(getNewPublicPosts(store.state).map(p=>p.authorId))];for(const id of ids)attempt(()=>store.markPostsSeen(id));}
  function refreshPublicFeed(force=false){
    if(dialogKind!=='public-moments')return;
    const signature=JSON.stringify({profile:store.state.profile,posts:getPublicPosts(store.state)});if(!force&&signature===lastPublicSignature)return;lastPublicSignature=signature;
    const d=$('social-dialog'),feed=d.querySelector('.public-moments-scroll'),top=feed?.scrollTop||0,focused=document.activeElement,editing=d.contains(focused)&&focused.matches('.comment-form input'),post=editing?focused.closest('.comment-form').dataset.post:null,start=focused?.selectionStart,end=focused?.selectionEnd;
    d.innerHTML=publicFeedHTML();d.querySelector('.public-moments-scroll').scrollTop=top;hydrate(d);
    if(post){const input=d.querySelector(`.comment-form[data-post="${CSS.escape(post)}"] input`);if(input){input.focus({preventScroll:true});input.setSelectionRange(start,end);}}
  }
  function showPublicFeed(){publishReturn=null;dialog(publicFeedHTML(),'public-moments');lastPublicSignature=JSON.stringify({profile:store.state.profile,posts:getPublicPosts(store.state)});markPublicSeen();}
  function renderMemories(){
    if(!active||!momentsOpen)return;const feed=$('moments-feed'),scroll=feed.scrollTop;
    const focused=document.activeElement,editing=feed.contains(focused)&&focused.matches('input'),editingPost=editing?focused.closest('.comment-form')?.dataset.post:null,start=focused?.selectionStart,end=focused?.selectionEnd;
    feed.innerHTML=timelineHTML(active);feed.scrollTop=scroll;hydrate(feed);
    if(editingPost){const input=feed.querySelector(`.comment-form[data-post="${CSS.escape(editingPost)}"] input`);if(input){input.focus({preventScroll:true});input.setSelectionRange(start,end);}}
  }
  function postHTML(post,own=false,timeline=false){return (post.contentRef?contentCard(post.contentRef):'')+plainPostHTML(post,own,timeline);}
  function plainPostHTML(post,own=false,timeline=false){return `${timeline?'':`<div class="post-top"><span>${date(post.createdAt)}</span></div><div class="profile-line">${profileLine(post.authorId)}</div>`}<p class="post-text">${esc(post.text)}</p><div class="post-photos count-${post.mediaIds.length}">${post.mediaIds.map(id=>photo(id)).join('')}</div><div class="post-actions"><button class="${post.likes.includes('me')?'liked':''}" data-action="like" data-id="${esc(post.id)}">${post.likes.includes('me')?'♥':'♡'} ${post.likes.length} 喜欢</button>${!own?`<button data-action="share-post" data-id="${esc(post.id)}">✧ 聊聊这条</button>`:''}</div><div class="post-likes">${post.likes.length?post.likes.map(id=>`<span>${esc(person(id).emoji)} ${esc(person(id).name)}</span>`).join(''):'还没有人点赞，送出第一份喜欢吧。'}</div><div class="comments">${post.comments.map(c=>`<p><strong>${esc(person(c.authorId).name)}</strong> ${esc(c.text)}</p>`).join('')}</div><form class="comment-form" data-post="${esc(post.id)}"><input name="comment" value="${esc(commentDrafts.get(post.id)||'')}" maxlength="500" placeholder="留下一点温暖…" aria-label="评论内容" required><button class="secondary" type="submit">发送</button></form>`;}
  const commentDrafts=new Map();
  function contentCard(ref){
    const content=getContent(ref);
    if(!content)return '<p class="muted">这条内容暂不可用。</p>';
    const owner=ref.type==='article'?getAccount(content.accountId):getCreator(content.creatorId);
    return `<button class="content-share-card" data-action="open-content" data-content-type="${esc(ref.type)}" data-content-id="${esc(ref.id)}"><img src="${esc(content.cover||content.poster)}" alt="" loading="lazy"><span><small>${ref.type==='article'?'▤ 公众号文章':'▷ 视频号'} · ${esc(owner?.name)}</small><strong>${esc(content.title)}</strong><em>点击${ref.type==='article'?'阅读':'观看'} ↗</em></span></button>`;
  }
  let shareReference=null,shareMode='friend',shareResolve=null;
  function shareContent(ref){
    if(!getContent(ref)){toast('这条内容暂不可用。');return Promise.resolve(false);}
    shareResolve?.(false);shareReference={...ref};shareMode='friend';renderContentShare();
    const d=$('content-share-dialog');if(!d.open)d.showModal();
    return new Promise(resolve=>{shareResolve=resolve;});
  }
  function renderContentShare(){
    const d=$('content-share-dialog');
    d.innerHTML=`<small class="eyebrow">A GOOD STORY, SHARED</small><h2>把发现分享出去</h2>${contentCard(shareReference)}<div class="content-share-tabs"><button type="button" data-share-mode="friend" aria-pressed="${shareMode==='friend'}">发送给好友</button><button type="button" data-share-mode="post" aria-pressed="${shareMode==='post'}">分享到朋友圈</button></div><form id="content-share-form">${shareMode==='friend'?`<fieldset><legend>选择接收好友</legend>${store.state.friends.map(id=>`<label class="content-recipient"><input type="radio" name="friend" value="${esc(id)}" required>${avatar(id)}<span>${esc(person(id).name)}</span></label>`).join('')||'<p class="muted">还没有好友。添加好友后，就能把喜欢的内容送给他。</p>'}</fieldset>`:'<textarea name="text" rows="3" maxlength="2000" placeholder="说说为什么想分享…" aria-label="分享附言"></textarea>'}<p class="muted" role="status" id="content-share-result"></p><button class="primary" type="submit" ${shareMode==='friend'&&!store.state.friends.length?'disabled':''}>${shareMode==='friend'?'确认发送':'发布到朋友圈'} ↗</button></form><button class="text-button" type="button" data-share-back>← 返回内容</button>`;
  }
  $('content-share-dialog').addEventListener('click',e=>{
    const mode=e.target.closest('[data-share-mode]');if(mode){shareMode=mode.dataset.shareMode;renderContentShare();}
    if(e.target.closest('[data-share-back]'))$('content-share-dialog').close();
    if(e.target===$('content-share-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}
  });
  $('content-share-dialog').addEventListener('close',()=>{shareReference=null;shareResolve?.(false);shareResolve=null;syncVisibleRead();});
  $('content-share-dialog').addEventListener('submit',async e=>{
    e.preventDefault();e.stopPropagation();const form=e.target,button=form.querySelector('[type="submit"]');if(button.disabled||!shareReference)return;
    button.disabled=true;const ref={...shareReference},fd=new FormData(form),mode=shareMode;
    const ok=await attempt(async()=>{if(mode==='friend')await store.sendMessage(String(fd.get('friend')),{type:'content',contentRef:ref,text:getContent(ref).title});else await store.publishPost({text:String(fd.get('text')||''),mediaIds:[],contentRef:ref});return true;});
    if(ok){$('content-share-result').textContent=mode==='friend'?'已发送给选中的好友。':'已分享到朋友圈。';const done=shareResolve;shareResolve=null;done?.(true);setTimeout(()=>$('content-share-dialog').close(),650);}else button.disabled=false;
  });
  root.addEventListener('input',e=>{const form=e.target.closest('.comment-form');if(form)commentDrafts.set(form.dataset.post,e.target.value);});
  function renderPost(id){const post=store.state.posts.find(p=>p.id===id);if(!post)return toast('这条朋友圈暂不可用。');
    if(post.authorId==='me'){showOwnMemories();requestAnimationFrame(()=>$('social-dialog').querySelector(`[data-post-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'nearest'}));return;}
    if(!store.state.friends.includes(post.authorId))return;
    const show=()=>{setMoments(true);requestAnimationFrame(()=>$('moments-feed').querySelector(`[data-post-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));};
    if(active!==post.authorId)openFriend(post.authorId).then(show);else show();
  }
  function dialog(html,kind){dialogKind=kind;const d=$('social-dialog');d.classList.toggle('public-moments-dialog',kind==='public-moments');d.setAttribute('aria-label',kind==='public-moments'?'公共朋友圈':'林间来信弹窗');d.innerHTML=html;if(!d.open)d.showModal();hydrate(d);}
  function showStatus(id){const st=statusOf(id);if(!st){toast('这个状态已经结束了。');return;}dialogOwner=id;const info=stateInfo(st.kind);dialog(`<div class="status-cover"><span>${esc(info.icon)}</span><small>此刻的心情</small><h2>${esc(info.label)}</h2></div><div class="profile-line">${profileLine(id)}</div><p class="status-text">${esc(st.text||'让心情在这里待一会儿。')}</p>${st.mediaId?photo(st.mediaId,'status-photo'):''}<p class="muted">${date(st.createdAt)} ${time(st.createdAt)} · 24 小时后消散</p>${id==='me'?'<button class="secondary" data-action="clear-status">结束这个状态</button>':''}`,'status');}
  function showMe(){const st=statusOf('me');dialog(`<small class="eyebrow">MY LITTLE CORNER</small><h2>我的林间角落</h2><div class="profile-line">${profileLine('me')}</div><form id="profile-form"><label>昵称<input name="name" value="${esc(store.state.profile.name)}" maxlength="24" required></label><label>个性签名<textarea name="signature" maxlength="100" rows="2">${esc(store.state.profile.signature)}</textarea></label><button class="secondary" type="submit">保存资料</button></form><div class="me-actions"><button data-action="publish-status">${st?esc(stateInfo(st.kind).icon):'☀'}<strong>${st?'更新状态':'发布状态'}</strong><small>让朋友知道此刻的你</small></button><button data-action="publish-post">✧<strong>发布朋友圈</strong><small>文字与照片，都会发光</small></button><button data-action="my-memories">◌<strong>我的朋友圈</strong><small>${postsOf('me').length} 条朋友圈</small></button>${st?'<button data-action="status" data-id="me">◉<strong>查看我的状态</strong><small>可以随时结束</small></button>':''}</div><div class="content-library-links"><button data-action="content-library" data-kind="follows">♧ 我的关注</button><button data-action="content-library" data-kind="collections">◇ 我的收藏</button><button data-action="content-library" data-kind="history">◷ 最近浏览</button></div><div class="demo-controls"><div><strong>本地演示</strong><p>朋友的回复与更新来自预设故事。</p></div><button class="secondary" data-action="pause-demo">${store.state.settings.demoPaused?'继续故事':'暂停故事'}</button><button class="text-button" data-action="replay-demo">重播故事</button></div>`,'me');}
  function showPublish(kind){publishReturn=dialogKind==='public-moments'?'public-moments':null;publishFileVersion++;publishKind=kind;publishingFiles=[];dialog(`<small class="eyebrow">${kind==='status'?'A FEELING, FOR TODAY':'A MEMORY, TO KEEP'}</small><h2>${kind==='status'?'此刻，你是什么心情？':'分享今天的生活'}</h2><form id="publish-form">${kind==='status'?`<div class="state-options">${STATES.map((s,i)=>`<label><input type="radio" name="kind" value="${esc(s.id)}" ${i===0?'checked':''}><span>${esc(s.icon)} ${esc(s.label)}</span></label>`).join('')}</div>`:''}<textarea name="text" rows="4" maxlength="2000" placeholder="${kind==='status'?'记录此刻的心情…':'今天有什么值得记住？'}" aria-label="发布文案"></textarea><label class="upload-area">＋ ${kind==='status'?'添加一张照片':'添加照片（最多九张）'}<input id="publish-files" type="file" accept="image/*" ${kind==='post'?'multiple':''}></label><div id="publish-previews"></div><p class="muted">${kind==='status'?'24 小时后自动结束。':'只保存在当前浏览器。'} 每张图片不超过 10 MB。</p><button class="primary" type="submit">${kind==='status'?'就用这个状态':'发布朋友圈'} ↗</button></form>`,'publish');}
  function showOwnMemories(){dialog(`<div class="own-moments">${timelineHTML('me')}</div>`,'my-memories');}
  function showPicker(kind){picker=picker===kind?null:kind;const el=$('chat-picker');el.hidden=!picker;el.innerHTML=picker==='emoji'?`<div class="emoji-grid">${EMOJI.map(e=>`<button data-action="insert-emoji" data-value="${e}">${e}</button>`).join('')}</div>`:picker==='stickers'?`<div class="sticker-grid">${STICKERS.map(([e,t])=>`<button data-action="send-sticker" data-value="${e} ${t}"><span>${e}</span>${t}</button>`).join('')}</div>`:'';}
  async function send(payload){if(!active)return false;const id=active,submittedText=$('chat-input').value,submittedAttachment=attachment,isComposer=payload.type==='text'||payload.type==='image';if(isComposer)clearTimeout(draftTimer);const result=await attempt(async()=>{await store.sendMessage(id,payload);return true;});if(result){$('chat-picker').hidden=true;picker=null;if(id===active){if(isComposer&&$('chat-input').value===submittedText){$('chat-input').value='';draftValues.set(id,'');await attempt(()=>store.setDraft(id,''));}if(isComposer&&attachment===submittedAttachment){attachment=null;$('chat-attachment').hidden=true;}$('chat-messages').scrollTop=$('chat-messages').scrollHeight;}}return !!result;}
  root.addEventListener('click',async e=>{
    const button=e.target.closest('[data-action]');if(!button)return;const action=button.dataset.action,id=button.dataset.id;
    if(action==='public-moments')showPublicFeed();
    if(action==='discover')onOpenContent('discover');
    if(action==='open-content')onOpenContent({type:button.dataset.contentType,id:button.dataset.contentId});
    if(action==='content-library')onOpenContent(button.dataset.kind);
    if(action==='feed-author'){if(id==='me'){showOwnMemories();}else{$('social-dialog').close();await openFriend(id);setMoments(true);}}
    if(action==='directory'){$('directory').hidden=false;renderDirectory();}
    if(action==='directory-tab'){directoryTab=button.dataset.tab;root.querySelectorAll('.directory-tabs button').forEach(b=>b.classList.toggle('active',b===button));renderDirectory();}
    if(action==='add-friend'){button.disabled=true;const ok=await attempt(async()=>{await store.addFriend(id);return true;});button.disabled=false;if(ok){renderDirectory();toast(`${person(id).name}来到溪谷了。`);}}
    if(action==='open-friend')openFriend(id);
    if(action==='status')showStatus(id);
    if(action==='me')showMe();
    if(action==='photo'){const url=await attempt(()=>store.mediaUrl(button.dataset.media));if(url){$('photo-dialog').querySelector('img').src=url;$('photo-dialog').showModal();}}
    if(action==='post')renderPost(id);
    if(action==='toggle-moments')setMoments(!momentsOpen);
    if(action==='like'){const ok=await attempt(async()=>{await store.toggleLike(id);return true;});if(!ok)return;const current=($('social-dialog').open?$('social-dialog'):root).querySelector('[data-action="like"][data-id="'+CSS.escape(id)+'"]');if(!current)return;current.animate([{transform:'scale(1)'},{transform:'scale(1.18)',color:'#c48660'},{transform:'scale(1)'}],{duration:350});const spark=document.createElement('span');spark.className='like-spark';spark.textContent='✦';current.append(spark);setTimeout(()=>spark.remove(),700);}
    if(action==='share-post'){const post=store.state.posts.find(p=>p.id===id);if(!post||post.authorId==='me')return;if(dialogKind==='public-moments'){$('social-dialog').close();await openFriend(post.authorId);}const sent=await send({type:'moment',momentId:id,text:'想和你聊聊这段记忆'});if(!sent)return;if(innerWidth<=760)setMoments(false);toast('朋友圈已分享，可以接着聊。');$('chat-input').focus();}
    if(action==='emoji'||action==='stickers')showPicker(action);
    if(action==='insert-emoji'){const input=$('chat-input');input.setRangeText(button.dataset.value,input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new Event('input'));input.focus();}
    if(action==='send-sticker')await send({type:'sticker',text:button.dataset.value});
    if(action==='chat-image')$('chat-file').click();
    if(action==='remove-attachment'){attachment=null;$('chat-attachment').hidden=true;}
    if(action==='earlier'){messageWindows.set(active,(messageWindows.get(active)||80)+80);lastMessageSignature='';renderMessages();}
    if(action==='publish-status')showPublish('status');
    if(action==='publish-post')showPublish('post');
    if(action==='my-memories')showOwnMemories();
    if(action==='clear-status'){const ok=await attempt(async()=>{await store.clearStatus();return true;});if(ok)showMe();}
    if(action==='pause-demo'){await attempt(()=>store.setDemoPaused(!store.state.settings.demoPaused));showMe();}
    if(action==='replay-demo'){const ok=await attempt(async()=>{await store.restartDemo();return true;});if(ok)toast('故事从头开始，你的内容都会保留。');}
  });
  root.addEventListener('submit',async e=>{
    e.preventDefault();const form=e.target,button=form.querySelector('[type="submit"]');if(button?.disabled)return;
    if(form.id==='chat-form'){const text=$('chat-input').value.trim();if(!text&&!attachment)return;button.disabled=true;try{await send(attachment?{type:'image',mediaId:attachment,text}:{type:'text',text});}finally{button.disabled=false;}return;}
    if(form.classList.contains('comment-form')){const input=form.elements.comment;const text=input.value.trim();if(!text)return;button.disabled=true;const ok=await attempt(async()=>{commentDrafts.delete(form.dataset.post);try{await store.addComment(form.dataset.post,text);}catch(error){commentDrafts.set(form.dataset.post,text);throw error;}return true;});if(!ok)button.disabled=false;return;}
    if(form.id==='profile-form'){const fd=new FormData(form);const ok=await attempt(async()=>{await store.updateProfile({name:String(fd.get('name')).trim(),signature:String(fd.get('signature')).trim()});return true;});if(ok)toast('资料已保存。');return;}
    if(form.id==='publish-form'){const fd=new FormData(form),text=String(fd.get('text')).trim();if(publishKind==='post'&&!text&&!publishingFiles.length)return toast('写一点文字，或添一张照片吧。');button.disabled=true;const ok=await attempt(async()=>{if(publishKind==='status')await store.publishStatus({kind:fd.get('kind'),text,mediaId:publishingFiles[0]});else await store.publishPost({text,mediaIds:publishingFiles});return true;});button.disabled=false;if(ok){toast(publishKind==='status'?'心情已挂在今天的枝头。':'朋友圈已发布。');if(publishReturn==='public-moments')showPublicFeed();else showMe();}}
  });
  $('friend-search').addEventListener('input',renderDirectory);
  $('meeting-search').addEventListener('input',renderMeetingFriends);
  $('chat-input').addEventListener('input',()=>{if(!active)return;const id=active,value=$('chat-input').value;draftValues.set(id,value);clearTimeout(draftTimer);draftTimer=setTimeout(()=>attempt(()=>store.setDraft(id,value)),250);});
  $('chat-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();$('chat-form').requestSubmit();}});
  $('chat-messages').addEventListener('scroll',()=>{if(!active)return;const id=active,value=$('chat-messages').scrollTop;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>attempt(()=>store.setScroll(id,value)),250);});
  $('chat-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;attachment=null;$('chat-attachment').hidden=true;const id=active,version=++chatFileVersion,media=await attempt(()=>store.importImage(file));e.target.value='';if(media&&active===id&&version===chatFileVersion){attachment=media;$('chat-attachment').hidden=false;$('chat-attachment').innerHTML=`<img data-media="${esc(media)}" alt="待发送图片"><span>图片准备好了</span><button class="icon-button" data-action="remove-attachment" aria-label="移除图片">移除</button>`;hydrate($('chat-attachment'));}});
  root.addEventListener('change',async e=>{if(e.target.id!=='publish-files')return;const files=[...e.target.files],max=publishKind==='status'?1:9;if(files.length>max)return toast(`最多选择 ${max} 张照片。`);publishingFiles=[];$('publish-previews').innerHTML='';const version=++publishFileVersion,form=$('publish-form'),submit=form.querySelector('[type="submit"]');submit.disabled=true;const ids=[];let failed=false;for(const file of files){const id=await attempt(()=>store.importImage(file));if(!id){failed=true;break;}ids.push(id);}if(form.isConnected&&version===publishFileVersion){if(!failed){publishingFiles=ids;$('publish-previews').innerHTML=ids.map(id=>`<img data-media="${esc(id)}" alt="待发布照片">`).join('');hydrate($('publish-previews'));}submit.disabled=false;}});
  function syncVisibleRead(){markPublicSeen();if(chatVisible()&&unread(active))attempt(()=>store.markRead(active));if(memoriesVisible()&&postsOf(active).some(p=>p.createdAt>(store.state.seenPosts[active]||0)))attempt(()=>store.markPostsSeen(active));}
  $('social-dialog').addEventListener('close',()=>{dialogKind=null;dialogOwner=null;syncVisibleRead();});
  $('photo-dialog').addEventListener('close',syncVisibleRead);
  for(const id of ['social-dialog','photo-dialog'])$(id).addEventListener('click',e=>{if(e.target===$(id)){const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close();}});
  let outsideDown=null;
  document.addEventListener('pointerdown',e=>{outsideDown={x:e.clientX,y:e.clientY,target:e.target,active};});
  document.addEventListener('click',e=>{
    if(!outsideDown||Math.hypot(e.clientX-outsideDown.x,e.clientY-outsideDown.y)>6)return;
    if(document.querySelector('dialog[open]'))return;
    if(!$('directory').hidden){if(!e.target.closest('#directory,[data-action="directory"]')){$('directory').hidden=true;syncVisibleRead();}return;}
    if(active&&outsideDown.active&&!e.target.closest('.meeting-workspace,.social-dock,dialog,[data-action="open-friend"]'))closeMeeting();
    if(picker&&!e.target.closest('#chat-picker,[data-action="emoji"],[data-action="stickers"]')){$('chat-picker').hidden=true;picker=null;}
  });
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')&&!e.defaultPrevented){if(!$('directory').hidden)$('directory').hidden=true;else if(active)closeMeeting();}});
  document.addEventListener('visibilitychange',()=>{if(chatVisible()&&unread(active))attempt(()=>store.markRead(active));markPublicSeen();});
  let expiryTimer=setInterval(()=>{renderAnchors();if(dialogKind==='status'&&!statusOf(dialogOwner)){$('social-dialog').close();toast('这个状态已结束。');}},30000);
  const unsubscribe=store.subscribe((state,event)=>{
    if(['draft','scroll'].some(s=>event?.type?.toLowerCase().includes(s)))return;
    renderSummary();if(active){renderMessages();const signature=JSON.stringify(postsOf(active));if(signature!==lastPostSignature){lastPostSignature=signature;renderMemories();}if(chatVisible()&&unread(active))attempt(()=>store.markRead(active));if(memoriesVisible()&&postsOf(active).some(p=>p.createdAt>(store.state.seenPosts[active]||0)))attempt(()=>store.markPostsSeen(active));}
    if(dialogKind==='my-memories'&&['post','like','comment','profile'].includes(event?.type)){const d=$('social-dialog'),top=d.scrollTop;d.innerHTML=`<div class="own-moments">${timelineHTML('me')}</div>`;d.scrollTop=top;hydrate(d);}
    if(dialogKind==='public-moments'){refreshPublicFeed();markPublicSeen();}
    if(dialogKind==='status'&&statusOf(dialogOwner))showStatus(dialogOwner);
  });
  renderSummary();renderDirectory();
  function update(now){
    const dt=Math.min(.05,(now-lastAnchorFrame)/1000||1/60);lastAnchorFrame=now;
    const moving=orbiting||now-lastCameraMotion<180,anchors=characters.getAnchors();let expanded=0;
    root.classList.toggle('is-orbiting',orbiting);
    for(const a of anchors){
      const node=anchorNodes.get(a.id);if(!node)continue;
      node.dataset.worldX=a.worldX?.toFixed(3);node.dataset.worldZ=a.worldZ?.toFixed(3);node.dataset.walking=String(!!a.walking);node.hidden=!a.visible;
      node.classList.toggle('selected',active===a.id);
      if(node._occluded===undefined)node._occluded=!!a.occluded;
      if(!moving){
        if(node._occlusionCandidate!==!!a.occluded){node._occlusionCandidate=!!a.occluded;node._occlusionSince=now;}
        if(now-(node._occlusionSince||0)>200)node._occluded=!!a.occluded;
      }
      node.classList.toggle('occluded',node._occluded);
      const fresh=now-(unreadArrival.get(a.id)?.at||-Infinity)<8000;
      const show=(fresh&&expanded<3)||active===a.id;if(show)expanded++;
      if(!moving||node._showMessage===undefined)node._showMessage=show;
      node.classList.toggle('show-message',node._showMessage);
    }
    const positions=anchorLayout.update(anchors.map(a=>({...a,width:anchorNodes.get(a.id)?._anchorWidth||150})),{now,moving,width:innerWidth,height:innerHeight,dt});
    for(const p of positions){const node=anchorNodes.get(p.id);if(!node)continue;node.dataset.labelOffset=p.offset.toFixed(2);node.style.transform=`translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,0) translate(-50%,-100%)`;}
  }

  return {openFriend,update,closeMeeting,toast,shareContent,get activeFriend(){return active;},dispose(){controls?.removeEventListener('start',orbitStart);controls?.removeEventListener('end',orbitEnd);controls?.removeEventListener('change',orbitChange);anchorSizes.disconnect();anchorLayout.clear();unsubscribe();clearInterval(expiryTimer);clearTimeout(draftTimer);clearTimeout(scrollTimer);root.remove();}};
}
