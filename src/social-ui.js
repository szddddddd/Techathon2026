import { FRIENDS, STATES } from './social-store.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time = value => new Date(value).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
const date = value => new Date(value).toLocaleDateString('zh-CN',{month:'long',day:'numeric'});
const STICKERS = [ ['🌼','送你一朵小花'], ['🐾','我来啦！'], ['☕','歇一会儿'], ['🌙','晚安好梦'], ['🫶','接住温柔'], ['🍀','好运发生'] ];
const EMOJI = ['😊','🥰','😂','🥹','🤔','😴','😭','✨','💛','🌿','🌈','👍'];

export function createSocialUI({store,characters}) {
  const root=document.createElement('div');root.id='social';document.body.append(root);
  root.innerHTML=`
    <div class="social-corner"><span class="seed-mark">❧</span><span>林间来信<small>朋友住在风景里</small></span></div>
    <div class="demo-badge"><i></i> 本地演示 <span id="demo-indicator">· 自动故事</span></div>
    <div id="friend-anchors"></div>
    <div id="first-invitation" class="invitation"><span class="invitation-icon">✉</span><h1>给风景，添一位朋友。</h1><p>从一次问好开始，让小小的溪谷热闹起来。</p><button class="primary" data-action="directory">认识第一位朋友 <span>↗</span></button></div>
    <nav class="social-dock"><button data-action="directory" class="dock-button"><span>♧</span> 好友 <b id="total-unread" hidden></b></button><button data-action="me" class="dock-button"><span>◉</span> 我</button></nav>
    <section id="directory" class="drawer paper" hidden aria-label="好友通讯录"><header><div><small>OUR LITTLE NEIGHBOURHOOD</small><h2>溪谷里的朋友</h2></div><button class="icon-button" data-action="close-directory" aria-label="关闭通讯录">×</button></header><p class="muted">每一次认识，都是风景的新一页。</p><label class="search">⌕ <input id="friend-search" placeholder="搜索昵称或演示 ID" aria-label="搜索好友"></label><div class="directory-tabs"><button data-action="directory-tab" data-tab="all" class="active">添加好友</button><button data-action="directory-tab" data-tab="added">我的朋友 <span id="friend-count"></span></button></div><div id="friend-list"></div></section>
    <section id="meeting" hidden aria-label="好友会客空间">
      <header class="meeting-title"><span id="meeting-avatar" class="avatar"></span><div><h2 id="meeting-name"></h2><p id="meeting-signature"></p></div><button class="icon-button" data-action="close-meeting" aria-label="返回溪谷">×</button></header>
      <nav class="mobile-tabs"><button data-action="meeting-tab" data-tab="chat" class="active">聊天</button><button data-action="meeting-tab" data-tab="memories">记忆</button></nav>
      <section class="chat-panel paper"><header><div><span class="tiny-dot"></span> 在这里，慢慢聊</div><small>本地模拟对话</small></header><div id="chat-messages" aria-live="polite" aria-label="聊天记录"></div><div id="chat-attachment" hidden></div><div id="chat-picker" hidden></div><form id="chat-form"><div class="composer-tools"><button type="button" data-action="emoji" aria-label="选择表情">☺</button><button type="button" data-action="stickers" aria-label="选择表情包">♧</button><button type="button" data-action="chat-image" aria-label="发送图片">▧</button><span>把今天说给他听</span></div><textarea id="chat-input" rows="2" maxlength="3000" placeholder="写一封很短的信…" aria-label="输入消息"></textarea><div class="composer-bottom"><small>Enter 发送 · Shift + Enter 换行</small><button class="primary" type="submit">发送 ↗</button></div></form></section>
      <section class="memory-panel"><header><div><small>PIECES OF A LIFE</small><h2>他的记忆微光</h2></div><span id="memory-count"></span></header><div id="memory-orbs"></div><div id="post-detail" class="paper" hidden></div></section>
    </section>
    <dialog id="social-dialog" class="paper"></dialog><dialog id="photo-dialog"><button class="icon-button" data-action="close-photo" aria-label="关闭大图">×</button><img alt="完整照片"></dialog>
    <input id="chat-file" type="file" accept="image/*" hidden><div id="social-toast" role="status"></div>`;
  const $=id=>root.querySelector('#'+id);
  let active=null,postId=null,ownPostId=null,directoryTab='all',picker=null,attachment=null,dialogKind=null,dialogOwner=null;
  let publishingFiles=[],publishKind=null,renderVersion=0,lastHeaderStamp=0,lastFriendSignature='',lastMessageSignature='',lastPostSignature='',scrollTimer,draftTimer,toastTimer,chatFileVersion=0,publishFileVersion=0,meetingEpoch=0;
  const anchorNodes=new Map();const messageWindows=new Map();const draftValues=new Map();const unreadArrival=new Map();
  const person=id=>id==='me'?store.state.profile:FRIENDS.find(f=>f.id===id)||{id,name:'林间朋友',emoji:'🌿',signature:''};
  const stateInfo=kind=>STATES.find(s=>s.id===kind)||{icon:'✨',label:kind||'此刻'};
  const chatVisible=()=>!!active&&!document.hidden&&(innerWidth>850||$('meeting').dataset.tab==='chat');
  const memoriesVisible=()=>!!active&&!document.hidden&&(innerWidth>850||$('meeting').dataset.tab==='memories');
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
    $('demo-indicator').textContent=store.state.settings.demoPaused?'· 故事已暂停':'· 自动故事';
    const signature=store.state.friends.join(',');if(signature!==lastFriendSignature){lastFriendSignature=signature;characters.sync(store.state.friends.map(person));renderDirectory();}
    for(const id of store.state.friends){const latest=store.state.messages.filter(m=>m.friendId===id&&m.senderId!=='me').at(-1);if(latest&&unreadArrival.get(id)?.id!==latest.id){if(unreadArrival.has(id))characters.pulse?.(id);unreadArrival.set(id,{id:latest.id,at:performance.now()});}}
    renderAnchors();
  }
  function renderAnchors(){
    for(const id of store.state.friends){let node=anchorNodes.get(id);if(!node){node=document.createElement('div');node.className='friend-anchor';node.dataset.friend=id;$('friend-anchors').append(node);anchorNodes.set(id,node);}
      const st=statusOf(id),info=st&&stateInfo(st.kind),messages=store.state.messages.filter(m=>m.friendId===id&&m.senderId!=='me'),last=messages.at(-1),n=unread(id);
      node.classList.toggle('has-unread',n>0);
      const fresh=postsOf(id).some(p=>p.createdAt>(store.state.seenPosts[id]||0));
      const html=`<div class="anchor-identity"><button class="anchor-name" data-action="open-friend" data-id="${id}">${esc(person(id).name)} ${fresh?'<i class="memory-spark"></i>':''}</button>${st?`<button class="status-badge" data-action="status" data-id="${id}" aria-label="查看${esc(person(id).name)}的${esc(info.label)}状态">${esc(info.icon)} <span>${esc(info.label)}</span></button>`:''}</div>${last?`<button class="head-message" data-action="open-friend" data-id="${id}">${last.type==='image'?`<img data-media="${esc(last.mediaId)}" alt="图片消息">`:last.type==='sticker'?`<span class="mini-sticker">${esc(last.text)}</span>`:esc(last.text||'分享了一段回忆')} ${n?`<b>${n}</b>`:''}</button><button class="unread-dot" data-action="open-friend" data-id="${id}" aria-label="${esc(person(id).name)}有${n}条未读" ${n?'':'hidden'}>${n}</button>`:''}`;
      if(node._html!==html){node._html=html;node.innerHTML=html;hydrate(node);}
    }
  }
  function captureDraft(){if(!active)return;draftValues.set(active,$('chat-input').value);const id=active,value=$('chat-input').value;attempt(()=>store.setDraft(id,value));attempt(()=>store.setScroll(id,$('chat-messages').scrollTop));}
  function originFor(id){const a=characters.getScreenAnchor(id);return a?{x:a.x,y:a.y}:{x:innerWidth/2,y:innerHeight/2};}
  async function openFriend(id){
    if(!store.state.friends.includes(id))return;meetingEpoch++;
    if(active!==id){captureDraft();attachment=null;$('chat-attachment').hidden=true;}
    const isNew=active!==id;active=id;postId=null;picker=null;$('chat-picker').hidden=true;$('directory').hidden=true;
    $('meeting').hidden=false;$('meeting').dataset.tab='chat';root.classList.add('in-meeting');
    $('meeting-avatar').textContent=person(id).emoji;$('meeting-name').textContent=person(id).name;$('meeting-signature').textContent=person(id).signature;
    $('chat-input').value=draftValues.get(id)??store.state.drafts[id]??'';
    $('memory-orbs').hidden=false;$('post-detail').hidden=true;
    characters.focus(id);if(isNew){const a=originFor(id);const panel=root.querySelector('.chat-panel'),box=panel.getBoundingClientRect();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)panel.animate([{opacity:0,transform:`translate(${a.x-box.left-box.width/2}px,${a.y-box.top-box.height/2}px) scale(.07)`},{opacity:1,transform:'translate(0,0) scale(1)'}],{duration:450,easing:'cubic-bezier(.2,.7,.2,1)'});}
    lastMessageSignature='';renderMessages(true);renderMemories();
    if(chatVisible())await attempt(()=>store.markRead(id));if(memoriesVisible())await attempt(()=>store.markPostsSeen(id));
  }
  function closeMeeting(){captureDraft();const id=active,epoch=++meetingEpoch,anchor=id&&originFor(id),panel=root.querySelector('.chat-panel');active=null;postId=null;attachment=null;root.classList.remove('in-meeting');characters.restore();if(anchor&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const box=panel.getBoundingClientRect();panel.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:`translate(${anchor.x-box.left-box.width/2}px,${anchor.y-box.top-box.height/2}px) scale(.08)`}],{duration:220,easing:'ease-in'});setTimeout(()=>{if(meetingEpoch===epoch)$('meeting').hidden=true;},220);}else $('meeting').hidden=true;}
  function renderMessages(restore=false){
    if(!active)return;const all=store.state.messages.filter(m=>m.friendId===active),limit=messageWindows.get(active)||80,messages=all.slice(-limit);
    const signature=active+'|'+messages.map(m=>m.id).join('|');if(signature===lastMessageSignature&&!restore)return;lastMessageSignature=signature;
    const feed=$('chat-messages'),nearEnd=feed.scrollHeight-feed.scrollTop-feed.clientHeight<90,oldScroll=feed.scrollTop,oldHeight=feed.scrollHeight;
    let previous=0;feed.innerHTML=(all.length>limit?'<button class="load-earlier" data-action="earlier">查看更早的消息</button>':'<div class="chat-day">每一次对话，都值得珍藏</div>')+messages.map(m=>{let stamp='';if(m.createdAt-previous>5*60*1000){stamp=`<div class="chat-time">${date(m.createdAt)} ${time(m.createdAt)}</div>`;previous=m.createdAt;}let content=esc(m.text);
      if(m.type==='image')content=photo(m.mediaId,'chat-photo');
      if(m.type==='sticker')content=`<div class="sticker-message"><span>${esc(m.text.split(' ')[0])}</span><small>${esc(m.text.split(' ').slice(1).join(' '))}</small></div>`;
      if(m.type==='moment'){const post=store.state.posts.find(p=>p.id===m.momentId);content=`<button class="shared-memory" data-action="post" data-id="${esc(m.momentId)}"><small>✧ 一段记忆</small>${esc(post?.text||'这段回忆暂不可用')}</button>`;}
      return stamp+`<div class="message ${m.senderId==='me'?'outgoing':'incoming'}" data-message="${esc(m.id)}">${avatar(m.senderId)}<div class="message-body ${m.type}">${content}</div></div>`;
    }).join('');hydrate(feed);
    const renderedFriend=active,generation=++renderVersion;requestAnimationFrame(()=>{if(active!==renderedFriend||generation!==renderVersion)return;if(restore){const saved=store.state.scrolls[renderedFriend];feed.scrollTop=saved??feed.scrollHeight;}else if(nearEnd)feed.scrollTop=feed.scrollHeight;else feed.scrollTop=oldScroll+Math.max(0,feed.scrollHeight-oldHeight);});
  }
  function renderMemories(){
    if(!active)return;const posts=postsOf(active);$('memory-count').textContent=`${posts.length} 段记忆`;
    root.querySelector('.memory-panel h2').textContent='他的记忆微光';
    $('memory-orbs').innerHTML=orbHTML(posts);hydrate($('memory-orbs'));
    if(postId&&!['own-post','my-memories'].includes(dialogKind))renderPost(postId);
  }
  function orbHTML(posts){return posts.map((p,i)=>`<button class="memory-orb-wrap" data-action="post" data-id="${esc(p.id)}" style="--orb-order:${i%6}" title="${esc(p.text.slice(0,80))}"><span class="memory-orb">${p.mediaIds.length?`<img data-media="${esc(p.mediaIds[0])}" alt="${esc(p.text.slice(0,40)||'记忆缩略图')}">`:`<span class="orb-text">❧<em>${esc(p.text.slice(0,34))}</em></span>`}<span class="orb-glint"></span></span><span class="orb-date">${date(p.createdAt)}</span><span class="orb-caption">${esc(p.text.slice(0,22))}</span></button>`).join('')||'<div class="empty-note">把今天留在这里，<br>它会成为明天的微光。</div>';}
  function postHTML(post,own=false){return `<div class="post-top"><button class="text-button" data-action="${own?'my-memories':'back-orbs'}">← 记忆微光</button><span>${date(post.createdAt)}</span></div><div class="profile-line">${profileLine(post.authorId)}</div><p class="post-text">${esc(post.text)}</p><div class="post-photos count-${post.mediaIds.length}">${post.mediaIds.map(id=>photo(id)).join('')}</div><div class="post-actions"><button class="${post.likes.includes('me')?'liked':''}" data-action="like" data-id="${esc(post.id)}">${post.likes.includes('me')?'♥':'♡'} ${post.likes.length} 喜欢</button>${!own?`<button data-action="share-post" data-id="${esc(post.id)}">✧ 聊聊这条</button>`:''}</div><div class="post-likes">${post.likes.length?post.likes.map(id=>`<span>${esc(person(id).emoji)} ${esc(person(id).name)}</span>`).join(''):'还没有人点赞，送出第一份喜欢吧。'}</div><div class="comments">${post.comments.map(c=>`<p><strong>${esc(person(c.authorId).name)}</strong> ${esc(c.text)}</p>`).join('')}</div><form class="comment-form" data-post="${esc(post.id)}"><input name="comment" value="${esc(commentDrafts.get(post.id)||'')}" maxlength="500" placeholder="留下一点温暖…" aria-label="评论内容" required><button class="secondary" type="submit">发送</button></form>`;}
  const commentDrafts=new Map();
  root.addEventListener('input',e=>{const form=e.target.closest('.comment-form');if(form)commentDrafts.set(form.dataset.post,e.target.value);});
  function renderPost(id){const post=store.state.posts.find(p=>p.id===id);if(!post)return toast('这段记忆暂不可用。');
    if(dialogKind==='my-memories'||dialogKind==='own-post'){ownPostId=id;dialogKind='own-post';$('social-dialog').innerHTML=`<button class="dialog-close icon-button" data-action="close-dialog" aria-label="关闭">×</button>${postHTML(post,true)}`;hydrate($('social-dialog'));return;}
    postId=id;$('memory-orbs').hidden=true;$('post-detail').hidden=false;$('post-detail').innerHTML=postHTML(post);hydrate($('post-detail'));root.querySelector('#meeting').dataset.tab='memories';
  }
  function dialog(html,kind){dialogKind=kind;const d=$('social-dialog');d.innerHTML=`<button class="dialog-close icon-button" data-action="close-dialog" aria-label="关闭弹窗">×</button>${html}`;if(!d.open)d.showModal();hydrate(d);}
  function showStatus(id){const st=statusOf(id);if(!st){toast('这个状态已经结束了。');return;}dialogOwner=id;const info=stateInfo(st.kind);dialog(`<div class="status-cover"><span>${esc(info.icon)}</span><small>此刻的心情</small><h2>${esc(info.label)}</h2></div><div class="profile-line">${profileLine(id)}</div><p class="status-text">${esc(st.text||'让心情在这里待一会儿。')}</p>${st.mediaId?photo(st.mediaId,'status-photo'):''}<p class="muted">${date(st.createdAt)} ${time(st.createdAt)} · 24 小时后消散</p>${id==='me'?'<button class="secondary" data-action="clear-status">结束这个状态</button>':''}`,'status');}
  function showMe(){const st=statusOf('me');dialog(`<small class="eyebrow">MY LITTLE CORNER</small><h2>我的林间角落</h2><div class="profile-line">${profileLine('me')}</div><form id="profile-form"><label>昵称<input name="name" value="${esc(store.state.profile.name)}" maxlength="24" required></label><label>个性签名<textarea name="signature" maxlength="100" rows="2">${esc(store.state.profile.signature)}</textarea></label><button class="secondary" type="submit">保存资料</button></form><div class="me-actions"><button data-action="publish-status">${st?esc(stateInfo(st.kind).icon):'☀'}<strong>${st?'更新状态':'发布状态'}</strong><small>让朋友知道此刻的你</small></button><button data-action="publish-post">✧<strong>留下一段记忆</strong><small>文字与照片，都会发光</small></button><button data-action="my-memories">◌<strong>我的记忆微光</strong><small>${postsOf('me').length} 条朋友圈</small></button>${st?'<button data-action="status" data-id="me">◉<strong>查看我的状态</strong><small>可以随时结束</small></button>':''}</div><div class="demo-controls"><div><strong>本地演示</strong><p>朋友的回复与更新来自预设故事。</p></div><button class="secondary" data-action="pause-demo">${store.state.settings.demoPaused?'继续故事':'暂停故事'}</button><button class="text-button" data-action="replay-demo">重播故事</button></div>`,'me');}
  function showPublish(kind){publishFileVersion++;publishKind=kind;publishingFiles=[];dialog(`<small class="eyebrow">${kind==='status'?'A FEELING, FOR TODAY':'A MEMORY, TO KEEP'}</small><h2>${kind==='status'?'此刻，你是什么心情？':'把今天变成一颗微光'}</h2><form id="publish-form">${kind==='status'?`<div class="state-options">${STATES.map((s,i)=>`<label><input type="radio" name="kind" value="${esc(s.id)}" ${i===0?'checked':''}><span>${esc(s.icon)} ${esc(s.label)}</span></label>`).join('')}</div>`:''}<textarea name="text" rows="4" maxlength="2000" placeholder="${kind==='status'?'记录此刻的心情…':'今天有什么值得记住？'}" aria-label="发布文案"></textarea><label class="upload-area">＋ ${kind==='status'?'添加一张照片':'添加照片（最多九张）'}<input id="publish-files" type="file" accept="image/*" ${kind==='post'?'multiple':''}></label><div id="publish-previews"></div><p class="muted">${kind==='status'?'24 小时后自动结束。':'只保存在当前浏览器。'} 每张图片不超过 10 MB。</p><button class="primary" type="submit">${kind==='status'?'就用这个状态':'发布这段记忆'} ↗</button></form>`,'publish');}
  function showOwnMemories(){ownPostId=null;dialog(`<small class="eyebrow">MY MEMORIES</small><h2>我的记忆微光</h2><div class="own-orbs">${orbHTML(postsOf('me'))}</div>`,'my-memories');}
  function showPicker(kind){picker=picker===kind?null:kind;const el=$('chat-picker');el.hidden=!picker;el.innerHTML=picker==='emoji'?`<div class="emoji-grid">${EMOJI.map(e=>`<button data-action="insert-emoji" data-value="${e}">${e}</button>`).join('')}</div>`:picker==='stickers'?`<div class="sticker-grid">${STICKERS.map(([e,t])=>`<button data-action="send-sticker" data-value="${e} ${t}"><span>${e}</span>${t}</button>`).join('')}</div>`:'';}
  async function send(payload){if(!active)return false;const id=active,submittedText=$('chat-input').value,submittedAttachment=attachment,isComposer=payload.type==='text'||payload.type==='image';if(isComposer)clearTimeout(draftTimer);const result=await attempt(async()=>{await store.sendMessage(id,payload);return true;});if(result){$('chat-picker').hidden=true;picker=null;if(id===active){if(isComposer&&$('chat-input').value===submittedText){$('chat-input').value='';draftValues.set(id,'');await attempt(()=>store.setDraft(id,''));}if(isComposer&&attachment===submittedAttachment){attachment=null;$('chat-attachment').hidden=true;}$('chat-messages').scrollTop=$('chat-messages').scrollHeight;}}return !!result;}
  root.addEventListener('click',async e=>{
    const button=e.target.closest('[data-action]');if(!button)return;const action=button.dataset.action,id=button.dataset.id;
    if(action==='directory'){$('directory').hidden=false;renderDirectory();}
    if(action==='close-directory')$('directory').hidden=true;
    if(action==='directory-tab'){directoryTab=button.dataset.tab;root.querySelectorAll('.directory-tabs button').forEach(b=>b.classList.toggle('active',b===button));renderDirectory();}
    if(action==='add-friend'){button.disabled=true;const ok=await attempt(async()=>{await store.addFriend(id);return true;});button.disabled=false;if(ok){renderDirectory();toast(`${person(id).name}来到溪谷了。`);}}
    if(action==='open-friend')openFriend(id);
    if(action==='close-meeting')closeMeeting();
    if(action==='status')showStatus(id);
    if(action==='me')showMe();
    if(action==='close-dialog')$('social-dialog').close();
    if(action==='close-photo')$('photo-dialog').close();
    if(action==='photo'){const url=await attempt(()=>store.mediaUrl(button.dataset.media));if(url){$('photo-dialog').querySelector('img').src=url;$('photo-dialog').showModal();}}
    if(action==='post')renderPost(id);
    if(action==='back-orbs'){postId=null;$('post-detail').hidden=true;$('memory-orbs').hidden=false;}
    if(action==='like'){const ok=await attempt(async()=>{await store.toggleLike(id);return true;});if(!ok)return;const current=root.querySelector('[data-action="like"][data-id="'+CSS.escape(id)+'"]');if(!current)return;current.animate([{transform:'scale(1)'},{transform:'scale(1.18)',color:'#c48660'},{transform:'scale(1)'}],{duration:350});const spark=document.createElement('span');spark.className='like-spark';spark.textContent='✦';current.append(spark);setTimeout(()=>spark.remove(),700);}
    if(action==='share-post'){const sent=await send({type:'moment',momentId:id,text:'想和你聊聊这段记忆'});if(!sent)return;$('meeting').dataset.tab='chat';toast('记忆已放进对话，接着说点什么吧。');$('chat-input').focus();}
    if(action==='emoji'||action==='stickers')showPicker(action);
    if(action==='insert-emoji'){const input=$('chat-input');input.setRangeText(button.dataset.value,input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new Event('input'));input.focus();}
    if(action==='send-sticker')await send({type:'sticker',text:button.dataset.value});
    if(action==='chat-image')$('chat-file').click();
    if(action==='remove-attachment'){attachment=null;$('chat-attachment').hidden=true;}
    if(action==='earlier'){messageWindows.set(active,(messageWindows.get(active)||80)+80);lastMessageSignature='';renderMessages();}
    if(action==='meeting-tab'){$('meeting').dataset.tab=button.dataset.tab;if(chatVisible())attempt(()=>store.markRead(active));if(memoriesVisible())attempt(()=>store.markPostsSeen(active));root.querySelectorAll('.mobile-tabs button').forEach(b=>b.classList.toggle('active',b===button));}
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
    if(form.id==='publish-form'){const fd=new FormData(form),text=String(fd.get('text')).trim();if(publishKind==='post'&&!text&&!publishingFiles.length)return toast('写一点文字，或添一张照片吧。');button.disabled=true;const ok=await attempt(async()=>{if(publishKind==='status')await store.publishStatus({kind:fd.get('kind'),text,mediaId:publishingFiles[0]});else await store.publishPost({text,mediaIds:publishingFiles});return true;});button.disabled=false;if(ok){toast(publishKind==='status'?'心情已挂在今天的枝头。':'新的记忆微光，已经点亮。');showMe();}}
  });
  $('friend-search').addEventListener('input',renderDirectory);
  $('chat-input').addEventListener('input',()=>{if(!active)return;const id=active,value=$('chat-input').value;draftValues.set(id,value);clearTimeout(draftTimer);draftTimer=setTimeout(()=>attempt(()=>store.setDraft(id,value)),250);});
  $('chat-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();$('chat-form').requestSubmit();}});
  $('chat-messages').addEventListener('scroll',()=>{if(!active)return;const id=active,value=$('chat-messages').scrollTop;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>attempt(()=>store.setScroll(id,value)),250);});
  $('chat-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;attachment=null;$('chat-attachment').hidden=true;const id=active,version=++chatFileVersion,media=await attempt(()=>store.importImage(file));e.target.value='';if(media&&active===id&&version===chatFileVersion){attachment=media;$('chat-attachment').hidden=false;$('chat-attachment').innerHTML=`<img data-media="${esc(media)}" alt="待发送图片"><span>图片准备好了</span><button class="icon-button" data-action="remove-attachment" aria-label="移除图片">×</button>`;hydrate($('chat-attachment'));}});
  root.addEventListener('change',async e=>{if(e.target.id!=='publish-files')return;const files=[...e.target.files],max=publishKind==='status'?1:9;if(files.length>max)return toast(`最多选择 ${max} 张照片。`);publishingFiles=[];$('publish-previews').innerHTML='';const version=++publishFileVersion,form=$('publish-form'),submit=form.querySelector('[type="submit"]');submit.disabled=true;const ids=[];let failed=false;for(const file of files){const id=await attempt(()=>store.importImage(file));if(!id){failed=true;break;}ids.push(id);}if(form.isConnected&&version===publishFileVersion){if(!failed){publishingFiles=ids;$('publish-previews').innerHTML=ids.map(id=>`<img data-media="${esc(id)}" alt="待发布照片">`).join('');hydrate($('publish-previews'));}submit.disabled=false;}});
  $('social-dialog').addEventListener('close',()=>{dialogKind=null;dialogOwner=null;});
  for(const id of ['social-dialog','photo-dialog'])$(id).addEventListener('click',e=>{if(e.target===$(id)){const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close();}});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('social-dialog').open&&!$('photo-dialog').open){if(!$('directory').hidden)$('directory').hidden=true;else if(active)closeMeeting();}});
  document.addEventListener('visibilitychange',()=>{if(chatVisible()&&unread(active))attempt(()=>store.markRead(active));});
  let expiryTimer=setInterval(()=>{renderAnchors();if(dialogKind==='status'&&!statusOf(dialogOwner)){$('social-dialog').close();toast('这个状态已结束。');}},30000);
  const unsubscribe=store.subscribe((state,event)=>{
    if(['draft','scroll'].some(s=>event?.type?.toLowerCase().includes(s)))return;
    renderSummary();if(active){renderMessages();const signature=JSON.stringify(postsOf(active));if(signature!==lastPostSignature){lastPostSignature=signature;renderMemories();}if(chatVisible()&&unread(active))attempt(()=>store.markRead(active));if(memoriesVisible()&&postsOf(active).some(p=>p.createdAt>(store.state.seenPosts[active]||0)))attempt(()=>store.markPostsSeen(active));}
    if(dialogKind==='own-post'&&ownPostId)renderPost(ownPostId);
    if(dialogKind==='status'&&statusOf(dialogOwner))showStatus(dialogOwner);
  });
  renderSummary();renderDirectory();
  function update(now){if(now-lastHeaderStamp<80)return;lastHeaderStamp=now;const anchors=characters.getAnchors(),placed=[];let expanded=0;
    for(const a of anchors){const node=anchorNodes.get(a.id);if(!node)continue;node.dataset.worldX=a.worldX?.toFixed(3);node.dataset.worldZ=a.worldZ?.toFixed(3);node.dataset.walking=String(!!a.walking);node.hidden=!a.visible;node.classList.toggle('selected',active===a.id);node.classList.toggle('occluded',!!a.occluded);const fresh=now-(unreadArrival.get(a.id)?.at||-Infinity)<8000;
      const show=(fresh&&expanded<3)||active===a.id;if(show)expanded++;node.classList.toggle('show-message',show);
      let x=Math.max(100,Math.min(innerWidth-100,a.x)),y=Math.max(90,Math.min(innerHeight-100,a.y));
      for(const p of placed)if(Math.abs(p.x-x)<145&&Math.abs(p.y-y)<40)x=Math.max(80,Math.min(innerWidth-80,x+(x<p.x?-1:1)*(148-Math.abs(p.x-x))));
      y=Math.max(70,y);placed.push({x,y});node.style.transform=`translate(${Math.round(x)}px,${Math.round(y)}px) translate(-50%,-100%)`;
    }
  }
  return {openFriend,update,closeMeeting,toast,get activeFriend(){return active;},dispose(){unsubscribe();clearInterval(expiryTimer);clearTimeout(draftTimer);clearTimeout(scrollTimer);root.remove();}};
}
