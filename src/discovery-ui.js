import {ACCOUNTS,ARTICLES,JOURNAL_ACCOUNTS,JOURNAL_ARTICLES,CREATORS,VIDEOS,getContent,getAccount,getCreator} from './discovery-catalog.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stamp=value=>new Date(value).toLocaleDateString('zh-CN',{month:'long',day:'numeric'});
const key=ref=>`${ref.type}:${ref.id}`;
const time=value=>`${Math.floor((Number(value)||0)/60)}:${String(Math.floor((Number(value)||0)%60)).padStart(2,'0')}`;

export function createDiscoveryUI({store,ui,onShare=()=>{},onClose=()=>{},onScenePlay,onRequestClose=()=>{},onNavigate=()=>{},player}) {
  const shell=document.createElement('dialog');shell.id='discovery-dialog';shell.className='discovery-shell';shell.setAttribute('aria-label','林间发现');
  shell.innerHTML='<div class="discovery-window"><header class="discovery-top"></header><div class="discovery-body"></div><p class="discovery-toast" role="status" hidden></p></div>';
  document.body.append(shell);
  const windowNode=shell.querySelector('.discovery-window'),top=windowNode.querySelector('.discovery-top'),body=windowNode.querySelector('.discovery-body'),video=player.video;
  const layer=ui.register('discovery',{el:shell,surface:shell,kind:'main',nav:'discover',requestClose:()=>close(),onClose({immediate}){savePosition();if(!layer.externalMotion&&ownerNav==='discover'&&current)dockSession={current:structuredClone(current),stack:structuredClone(stack),search,articleTab,videoTab,personalTab,commentsOpen,wantPlay:!video.paused||player.wantsPlayback};player.pause();if(immediate&&sceneKind)window.__discoveryBoards?.dismiss();stage='closed';onClose();}});
  let stage='closed',sceneKind=null,playbackBlocked=false,resumeWanted=true;
  const sessions=new Map(),commentDrafts=new Map();let dockSession=null,ownerNav='discover',returnToOwner=null;
  let stack=[],current=null,commentsOpen=false,search='',articleTab='following',videoTab='recommend',personalTab='article',toastTimer,progressTimer,touchY=null,wheelTime=0,pointerStart=null,unsub,playbackRequested=false;
  const state=()=>store.state.discovery;
  const ref=()=>({type:current.type,id:current.id});
  const member=(list,item)=>(list||[]).includes(item);
  const owner=item=>item.accountId?getAccount(item.accountId):getCreator(item.creatorId);
  const avatar=item=>`<span class="discovery-avatar">${esc(item?.emoji||'🌿')}</span>`;
  const notice=message=>{const t=windowNode.querySelector('.discovery-toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,3500);};
  const run=async fn=>{try{await fn();}catch(error){notice(error.message||'暂时没有完成，请稍后再试。');}};
  const action=(label,act,attrs='',cls='')=>`<button type="button" class="${cls}" data-d-action="${act}" ${attrs}>${label}</button>`;
  const itemAttrs=item=>`data-type="${item.accountId?'article':'video'}" data-id="${esc(item.id)}"`;
  function savePosition(){if(current){current.scroll=body.scrollTop;current.context={search,articleTab,videoTab,personalTab,commentsOpen};if(current.type==='article')store.setContentProgress(ref(),body.scrollTop).catch(()=>{});}}
  function navigate(route,replace=false){
    savePosition();if(current&&!replace)stack.push({...current});
    current=typeof route==='string'?{type:route}: {...route};commentsOpen=false;search='';
    if(current.type==='video'){videoTab='recommend';playbackRequested=true;}
    if(current.type!=='video')player.pause();
    render();ui.transition(body);
    if(current.type==='article'||current.type==='video')store.visitContent(ref()).catch(error=>notice(error.message));
  }
  function back(){savePosition();if(stack.length){current=stack.pop();const context=current.context||{};search=context.search||'';articleTab=context.articleTab||articleTab;videoTab=context.videoTab||videoTab;personalTab=context.personalTab||personalTab;commentsOpen=!!context.commentsOpen;if(!['video','videos'].includes(current.type))player.pause();else playbackRequested=true;render();ui.transition(body,-1);}else if(ownerNav==='me'&&returnToOwner){const restore=returnToOwner;ui.close('discovery',{immediate:true,restoreFocus:false});restore();}else close();}
  function rememberSession(){
    savePosition();if(!sceneKind||!current)return;
    sessions.set(sceneKind,{current:structuredClone(current),stack:structuredClone(stack),search,articleTab,videoTab,personalTab,commentsOpen,wantPlay:playbackBlocked?resumeWanted:(!video.paused||player.wantsPlayback)});
  }
  function stopScene(){
    if(stage!=='closing')rememberSession();player.pause();sceneKind=null;ui.close('discovery',{immediate:true,restoreFocus:false});stage='closed';sceneKind=null;playbackBlocked=false;
    shell.removeAttribute('data-motion');windowNode.style.opacity='';windowNode.style.clipPath='';windowNode.inert=false;shell.style.removeProperty('--backdrop-alpha');
  }
  function close(){
    if(stage==='closed')return;
    if(sceneKind){onRequestClose();return;}
    return ui.close('discovery');
  }
  function detachScene(){
    if(!sceneKind)return;
    rememberSession();sceneKind=null;layer.externalMotion=false;playbackBlocked=false;stage='window';
    shell.removeAttribute('data-motion');windowNode.style.opacity='';windowNode.style.clipPath='';windowNode.inert=false;shell.style.removeProperty('--backdrop-alpha');
  }
  function normalizeRoute(route){if(route==='videos'){videoTab='recommend';return{type:'video',id:VIDEOS[0]?.id};}return route;}
  function prepareScene(kind,route){
    rememberSession();player.pause();ownerNav='discover';returnToOwner=null;ui.setNav('discovery','discover');sceneKind=kind;playbackBlocked=true;stage='opening';
    shell.dataset.motion='opening';shell.style.setProperty('--backdrop-alpha','0');windowNode.style.opacity='0';windowNode.inert=true;
    const saved=sessions.get(kind),requested=typeof route==='object'?route:null;
    if(saved&&(!requested||requested.id===saved.current.id)){
      ({search,articleTab,videoTab,personalTab,commentsOpen}=saved);current=structuredClone(saved.current);stack=structuredClone(saved.stack);resumeWanted=saved.wantPlay;render();
    }else{current=null;stack=[];resumeWanted=true;navigate(normalizeRoute(route||(kind==='accounts'?'accounts':'videos')));}
    layer.externalMotion=true;ui.open('discovery',{animate:false,focus:false});
    return shell.getBoundingClientRect();
  }
  function settleScene(){
    if(stage!=='opening')return;
    stage='window';playbackBlocked=false;shell.removeAttribute('data-motion');windowNode.style.opacity='';windowNode.style.clipPath='';windowNode.inert=false;shell.style.removeProperty('--backdrop-alpha');
    shell.focus({preventScroll:true});
    if(current?.type==='video')player.load(current.id,{autoplay:resumeWanted}).catch(showVideoError);
  }
  function startClosing(){resumeWanted=!video.paused||player.wantsPlayback;rememberSession();playbackBlocked=true;player.pause();stage='closing';shell.dataset.motion='closing';windowNode.inert=true;}
  function reveal(rect,alpha,backdrop){
    const r=windowNode.getBoundingClientRect();
    windowNode.style.clipPath=`inset(${Math.max(0,rect.top-r.top)}px ${Math.max(0,r.right-rect.left-rect.width)}px ${Math.max(0,r.bottom-rect.top-rect.height)}px ${Math.max(0,rect.left-r.left)}px round 5px)`;
    windowNode.style.opacity=String(alpha);shell.style.setProperty('--backdrop-alpha',String(backdrop));
  }
  function followButton(kind,id){const yes=member(state()[kind==='account'?'accountFollows':'creatorFollows'],id);return action(yes?'已关注':'＋ 关注','follow',`data-kind="${kind}" data-id="${esc(id)}" aria-pressed="${yes}"`,yes?'d-follow following':'d-follow');}
  function controls(content){const r={type:content.accountId?'article':'video',id:content.id},k=key(r),liked=member(state().likes,k),collected=member(state().collections,k);return `<div class="d-actions">${action(`${liked?'♥':'♡'} ${liked?'已喜欢':'喜欢'}`,'like',`data-type="${r.type}" data-id="${r.id}" aria-pressed="${liked}"`)}${action(`${collected?'★':'☆'} ${collected?'已收藏':'收藏'}`,'collect',`data-type="${r.type}" data-id="${r.id}" aria-pressed="${collected}"`)}${action('↗ 分享','share',`data-type="${r.type}" data-id="${r.id}"`)}</div>`;}
  function comments(r){const list=state().comments[key(r)]||[];return `<section class="d-comments"><h3>留言 <small>${list.length}</small></h3><div class="d-comment-list">${list.length?list.map(c=>`<article><span class="discovery-avatar">${c.authorId==='me'?esc(store.state.profile.emoji):'🌱'}</span><div><strong>${c.authorId==='me'?esc(store.state.profile.name):esc(CREATORS.find(x=>x.id===c.authorId)?.name||'林间读者')}</strong><p>${esc(c.text)}</p><small>${stamp(c.createdAt)}</small></div></article>`).join(''):'<p class="d-empty-small">还没有留言，留下一点你的感受吧。</p>'}</div><form data-d-form="comment" data-type="${r.type}" data-id="${r.id}"><label class="d-sr" for="d-comment-text">写留言</label><textarea id="d-comment-text" name="text" placeholder="写下这一刻的感受…" maxlength="1000" required>${esc(commentDrafts.get(key(r))||'')}</textarea><button class="d-primary">发表留言</button></form></section>`;}
  function card(item){const isVideo=!!item.creatorId,p=owner(item);return `<button class="d-content-card ${isVideo?'is-video':''}" data-d-action="open" ${itemAttrs(item)}><div class="d-card-cover"><img src="${esc(item.cover)}" alt="${esc(item.title)}" loading="lazy"><span class="d-content-kind">${isVideo?'▶ 视频':'▤ 图文'}</span>${isVideo?'<span class="d-play-mark">▶</span>':''}</div><div class="d-card-copy"><small>${esc(p?.name)} · ${esc(item.dateLabel||stamp(item.createdAt||item.publishedAt))}</small><h3>${esc(item.title)}</h3><p>${esc(item.summary||item.description)}</p></div></button>`;}
  function empty(title,copy='去推荐里看看，也许能遇到喜欢的内容。'){return `<div class="d-empty"><span>🍃</span><h3>${title}</h3><p>${copy}</p></div>`;}
  function discover(){return `<div class="d-discover"><p class="d-eyebrow">TAKE A LITTLE BREAK</p><h1>有些相遇，<br>从一页文字开始。</h1><p class="d-lead">读一封森林来信，看一段溪谷日常。<br>把值得停留的片刻，分享给想念的人。</p><div class="d-discover-entries"><button data-d-action="accounts"><img src="assets/discovery/video-1.jpg" alt="森林中的阅读时光"><div><small>THE FOREST JOURNAL</small><h2>公众号 <span>↗</span></h2><p>文字有回声，生活有来信</p></div></button><button data-d-action="videos"><img src="assets/discovery/video-5.jpg" alt="营地里的放映时光"><div><small>MOMENTS IN MOTION</small><h2>视频号 <span>↗</span></h2><p>看见朋友，也看见小小的日常</p></div></button></div><p class="d-local-label">Hyper3D 官方资料摘编 · 朋友的溪谷短片</p></div>`;}
  function articleList(){let list=JOURNAL_ARTICLES.filter(a=>(articleTab!=='following'||member(state().accountFollows,a.accountId))&&(articleTab!=='collections'||member(state().collections,`article:${a.id}`))&&`${a.title}${a.summary}${getAccount(a.accountId)?.name}`.toLowerCase().includes(search.toLowerCase()));if(articleTab==='following')list=list.slice().sort((a,b)=>(b.createdAt||b.publishedAt)-(a.createdAt||a.publishedAt));return `<div class="d-library"><aside class="d-subscriptions"><p class="d-eyebrow">FOREST JOURNALS</p><h2>订阅的来信</h2><p class="d-aside-note">给生活留一页空白。</p>${JOURNAL_ACCOUNTS.map(a=>`<div class="d-account-row">${action(`${avatar(a)}<span><strong>${esc(a.name)}</strong><small>${member(state().accountFollows,a.id)?'已订阅':'认识这份刊物'}</small></span>`,'open',`data-type="account" data-id="${a.id}"`)}</div>`).join('')}<div class="d-aside-bottom">关注后的文章<br>会安静地等在订阅页里。</div></aside><section class="d-article-list"><div class="d-list-tools"><div class="d-tabs">${[['following','订阅'],['recommend','推荐'],['collections','收藏']].map(([id,label])=>action(label,'article-tab',`data-id="${id}" aria-selected="${articleTab===id}"`)).join('')}</div><input class="d-search" type="search" placeholder="搜索文章或公众号" aria-label="搜索文章或公众号" value="${esc(search)}"></div><div class="d-card-list">${list.length?list.map(card).join(''):empty(search?'没有找到相关来信':'这里还没有来信')}</div></section></div>`;}
  function profile(kind,id){const p=kind==='account'?getAccount(id):getCreator(id);if(!p)return empty('暂时找不到这位作者');const items=(kind==='account'?ARTICLES:VIDEOS).filter(a=>(a.accountId||a.creatorId)===id);return `<section class="d-profile"><div class="d-profile-cover"><img src="${esc(p.cover)}" alt="${esc(p.name)}的主页封面"></div><div class="d-profile-identity">${avatar(p)}<div><small>${kind==='account'?'森林公众号':'森林视频作者'}</small><h1>${esc(p.name)}</h1><p>${esc(p.description||p.signature)}</p></div>${followButton(kind,id)}</div><div class="d-profile-content"><h2>${kind==='account'?'往期来信':'记录的片刻'} <small>${items.length}</small></h2><div class="${kind==='creator'?'d-video-grid':'d-card-list'}">${items.map(card).join('')}</div></div></section>`;}
  function articlePage(id){const a=getContent({type:'article',id});if(!a)return empty('这篇来信暂时找不到了');const account=getAccount(a.accountId),others=ARTICLES.filter(x=>x.accountId===a.accountId&&x.id!==id);return `<article class="d-reading" style="--reading-size:${state().fontSize||18}px"><p class="d-eyebrow">LETTERS FROM THE WOODS</p><h1>${esc(a.title)}</h1><div class="d-reading-author">${action(`${avatar(account)} ${esc(account?.name)}`,'open',`data-type="account" data-id="${a.accountId}"`)}<time>${esc(a.dateLabel||stamp(a.createdAt||a.publishedAt))}</time>${followButton('account',a.accountId)}</div><div class="d-reading-tools"><span>舒适阅读</span>${[16,18,20,22].map(n=>action(`${n}`,'font',`data-size="${n}" aria-pressed="${(state().fontSize||18)===n}"`)).join('')}</div><img class="d-reading-cover" src="${esc(a.cover)}" alt="${esc(a.title)}"><div class="d-prose">${a.blocks.map(b=>b.type==='heading'?`<h2>${esc(b.text)}</h2>`:b.type==='image'?`<figure><img src="${esc(b.src)}" alt="${esc(b.caption||a.title)}" loading="lazy">${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`:`<p>${esc(b.text)}</p>`).join('')}</div>${a.sourceUrl?`<p class="d-source-note">中文摘要 · ${esc(a.sourceTitle)}<br><a href="${esc(a.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看 Hyper3D 官方原文 ↗</a></p>`:'<p class="d-reading-end">— 谢谢你，为这封来信停留 —</p>'}${controls(a)}${a.videoId&&getContent({type:'video',id:a.videoId})?`<h2 class="d-section-title">让文字里的风景动起来</h2>${card(getContent({type:'video',id:a.videoId}))}`:''}${comments({type:'article',id})}<h2 class="d-section-title">继续翻一页</h2><div class="d-related">${others.map(card).join('')}</div></article>`;}
  function videoItems(){return VIDEOS.filter(v=>videoTab!=='following'||member(state().creatorFollows,v.creatorId)).filter(v=>videoTab!=='friends'||store.state.friends.includes(v.creatorId)||(v.friendLikes||v.likedBy||[]).some(id=>store.state.friends.includes(id)));}
  function videoPage(){let items=videoItems();if(!items.some(v=>v.id===current.id))current.id=items[0]?.id;const v=items.find(x=>x.id===current.id);return `<section class="d-video-page"><div class="d-video-tabs d-tabs">${[['recommend','推荐'],['following','关注'],['friends','朋友']].map(([id,label])=>action(label,'video-tab',`data-id="${id}" aria-selected="${videoTab===id}"`)).join('')}</div>${!v?empty(videoTab==='friends'?'朋友们还没有分享视频':'还没有关注的视频作者','切换到推荐，认识记录溪谷生活的朋友。'):`<div class="d-video-workspace ${commentsOpen?'with-comments':''}"><section class="d-watch"><div class="d-video-stage"><div class="d-video-mount"></div><div class="d-video-loading" hidden>正在等这一阵风…</div><div class="d-video-error" hidden><strong>视频暂时没有抵达</strong><p>请检查连接后重试，也可以先看其他片刻。</p>${action('重新加载','retry','', 'd-primary')}</div><button class="d-video-big-play" data-d-action="play" aria-label="播放视频" hidden>▶</button></div><div class="d-player-controls">${action('▶','play','aria-label="播放或暂停"')}<input type="range" class="d-video-seek" min="0" max="100" step=".1" value="0" aria-label="视频进度"><small class="d-video-time">0:00 / ${time(v.duration)}</small>${action('静音','mute','aria-label="切换静音"')}<input type="range" class="d-video-volume" min="0" max="1" step=".05" value="${video.muted?0:video.volume}" aria-label="音量"></div></section><aside class="d-video-info"><div class="d-video-author">${action(`${avatar(getCreator(v.creatorId))}<span>${esc(getCreator(v.creatorId)?.name)}</span>`,'open',`data-type="creator" data-id="${v.creatorId}"`)}${followButton('creator',v.creatorId)}</div><p class="d-video-date">${stamp(v.createdAt||v.publishedAt)}</p><h1>${esc(v.title)}</h1><p class="d-video-description" style="white-space:pre-line">${esc(v.description)}</p>${videoTab==='friends'?`<p class="d-friend-source">${store.state.friends.includes(v.creatorId)?'来自你的好友':(v.friendLikes||[]).filter(id=>store.state.friends.includes(id)).map(id=>getCreator(id)?.name).join('、')+' 喜欢过'}</p>`:''}${controls(v)}${action(`☏ 留言 ${(state().comments[`video:${v.id}`]||[]).length}`,'comments',`aria-expanded="${commentsOpen}"`,'d-comment-toggle')}${v.articleId? action('▤ 读读相关来信 →','open',`data-type="article" data-id="${v.articleId}"`,'d-article-link'):''}${onScenePlay&&!sceneKind?action('▻ 走近溪谷放映场','scene',`data-id="${v.id}"`,'d-article-link'):''}<div class="d-video-switch">${action('↑ 上一条','prev','aria-label="上一条视频"')}${action('↓ 下一条','next','aria-label="下一条视频"')}</div><small class="d-gesture-hint">上下滑动，看看下一个片刻</small></aside>${commentsOpen?`<aside class="d-video-comments">${action('收起留言 ↓','comments','','d-mobile-comment-close')}${comments({type:'video',id:v.id})}</aside>`:''}</div>`}</section>`;}
  function personalPage(type){const titles={follows:'我的关注',collections:'我的收藏',history:'最近浏览'};let contents='';if(type==='follows'){const ids=personalTab==='article'?state().accountFollows:state().creatorFollows,people=(personalTab==='article'?ACCOUNTS:CREATORS).filter(p=>ids.includes(p.id));contents=people.length?people.map(p=>`<div class="d-follow-card">${action(`${avatar(p)}<span><strong>${esc(p.name)}</strong><small>${esc(p.description||p.signature)}</small></span>`,'open',`data-type="${personalTab==='article'?'account':'creator'}" data-id="${p.id}"`)}${followButton(personalTab==='article'?'account':'creator',p.id)}</div>`).join(''):empty('还没有关注','去发现里，找一份喜欢的刊物或一位视频作者。');}else{const refs=type==='history'?state().history:state().collections.map(k=>{const [type,id]=k.split(':');return{type,id};});const items=refs.filter(r=>r.type===personalTab).map(getContent).filter(Boolean);contents=items.length?items.map(card).join(''):empty(type==='history'?'还没有留下足迹':'还没有收藏','遇到喜欢的文章或视频，点亮星星就能留在这里。');}return `<section class="d-personal"><p class="d-eyebrow">YOUR LITTLE FOREST</p><h1>${titles[type]}</h1><div class="d-tabs">${[['article','公众号 · 文章'],['video','视频号']].map(([id,label])=>action(label,'personal-tab',`data-id="${id}" aria-selected="${personalTab===id}"`)).join('')}</div><div class="d-personal-list">${contents}</div></section>`;}
  function render(){
    if(!current)return;
    const previousScroll=current.scroll??0,focus=windowNode.contains(document.activeElement)?document.activeElement:null,focusName=focus?.name,focusValue=focus?.value,selection=focus?.selectionStart,autoplay=playbackRequested||!video.paused;playbackRequested=false;
    const playerWasMounted=video.parentElement; if(playerWasMounted)video.remove();
    shell.dataset.page=current.type;shell.dataset.frame=sceneKind==='scene-video'||(!sceneKind&&['video','videos','creator'].includes(current.type))?'cinema':'journal';
    onNavigate(current);
    const titles={discover:'林间发现',accounts:'公众号',videos:'视频号',video:'视频号',article:'森林来信',account:'公众号主页',creator:'视频作者',follows:'我的关注',collections:'我的收藏',history:'最近浏览'};
    top.innerHTML=`${action('←','back','aria-label="返回"','d-back')}<div><strong>${titles[current.type]||'林间发现'}</strong><small>LETTERS FROM THE WOODS</small></div><span class="d-top-local">本地演示</span><button class="ui-close" data-d-action="close" aria-label="关闭发现">×</button>`;
    let page=current.type==='discover'?discover():current.type==='accounts'?articleList():['account','creator'].includes(current.type)?profile(current.type,current.id):current.type==='article'?articlePage(current.id):['video','videos'].includes(current.type)?videoPage():personalPage(current.type);
    body.innerHTML=page;
    if(['video','videos'].includes(current.type)&&current.id){const mount=body.querySelector('.d-video-mount');if(mount){mount.append(video);player.setSurface('ui');player.load(current.id,{autoplay:!playbackBlocked&&(autoplay||player.activeId!==current.id)}).then(()=>syncVideo()).catch(()=>showVideoError());}}else player.pause();
    if(current.type==='article')body.scrollTop=current.scroll??(Number(state().progress[`article:${current.id}`])||0);else body.scrollTop=previousScroll;
    if(focusName){const next=body.querySelector(`[name="${focusName}"]`);if(next){next.value=focusValue;next.focus({preventScroll:true});try{next.setSelectionRange(selection,selection);}catch{}}}
    syncVideo();
  }
  function showVideoError(){const box=body.querySelector('.d-video-error');if(box)box.hidden=false;const loading=body.querySelector('.d-video-loading');if(loading)loading.hidden=true;}
  function syncVideo(){const play=body.querySelector('.d-player-controls [data-d-action="play"]'),big=body.querySelector('.d-video-big-play'),mute=body.querySelector('[data-d-action="mute"]'),seek=body.querySelector('.d-video-seek'),counter=body.querySelector('.d-video-time'),loading=body.querySelector('.d-video-loading');if(play)play.textContent=video.paused?'▶':'Ⅱ';if(big)big.hidden=!video.paused||!!video.error;if(mute)mute.textContent=video.muted?'静音':'声音';if(seek)seek.value=Number.isFinite(video.duration)&&video.duration?video.currentTime/video.duration*100:0;if(counter)counter.textContent=`${time(video.currentTime)} / ${time(video.duration)}`;if(loading)loading.hidden=video.readyState>=3||video.paused;}
  function nextVideo(direction){const items=videoItems();if(!items.length)return;const index=items.findIndex(v=>v.id===current.id);current.id=items[(index+direction+items.length)%items.length].id;current.scroll=0;commentsOpen=false;playbackRequested=true;render();store.visitContent({type:'video',id:current.id}).catch(()=>{});}
  windowNode.addEventListener('click',event=>{
    const button=event.target.closest('[data-d-action]');if(!button)return;const a=button.dataset.dAction,r={type:button.dataset.type,id:button.dataset.id};
    if(a==='back')back();if(a==='close')close();if(a==='open')navigate(r);if(a==='accounts')navigate('accounts');if(a==='videos'){videoTab='recommend';navigate({type:'video',id:VIDEOS[0]?.id});}
    if(a==='follow')run(()=>store.followContent(button.dataset.kind,button.dataset.id));if(a==='like')run(()=>store.toggleContentLike(r));if(a==='collect')run(()=>store.toggleContentCollection(r));if(a==='share'){player.pause();run(()=>onShare(r));}
    if(a==='font')run(()=>store.setReadingFont(Number(button.dataset.size)));
    if(a==='article-tab'){articleTab=button.dataset.id;current.scroll=0;render();}
    if(a==='video-tab'){videoTab=button.dataset.id;current.id=videoItems()[0]?.id;commentsOpen=false;playbackRequested=true;render();}
    if(a==='personal-tab'){personalTab=button.dataset.id;current.scroll=0;render();}
    if(a==='play')run(()=>video.paused?player.play():player.pause());if(a==='mute'){video.muted=!video.muted;syncVideo();}
    if(a==='next')nextVideo(1);if(a==='prev')nextVideo(-1);if(a==='comments'){commentsOpen=!commentsOpen;current.scroll=body.scrollTop;render();}
    if(a==='retry'){const id=current.id;player.load(id,{autoplay:true,force:true}).then(()=>{const error=body.querySelector('.d-video-error');if(error&&current?.id===id)error.hidden=true;}).catch(showVideoError);}
    if(a==='scene')run(async()=>{await onScenePlay(button.dataset.id);});
  });
  windowNode.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};});
  shell.addEventListener('cancel',event=>{event.preventDefault();close();});
  windowNode.addEventListener('submit',event=>{const form=event.target;if(form.dataset.dForm!=='comment')return;event.preventDefault();run(async()=>{await store.addContentComment({type:form.dataset.type,id:form.dataset.id},new FormData(form).get('text'));commentDrafts.delete(`${form.dataset.type}:${form.dataset.id}`);const field=body.querySelector('[name="text"]');if(field)field.value='';notice('留言已留下');});});
  body.addEventListener('input',event=>{const target=event.target;if(target.id==='d-comment-text'&&current?.id)commentDrafts.set(key(ref()),target.value);if(target.classList.contains('d-search')){search=target.value;current.scroll=0;render();const field=body.querySelector('.d-search');field?.focus();field?.setSelectionRange(search.length,search.length);}if(target.classList.contains('d-video-seek')&&Number.isFinite(video.duration))video.currentTime=Number(target.value)/100*video.duration;if(target.classList.contains('d-video-volume')){video.volume=Number(target.value);video.muted=video.volume===0;syncVideo();}});
  body.addEventListener('scroll',()=>{if(!current)return;current.scroll=body.scrollTop;if(current.type==='article'){clearTimeout(progressTimer);progressTimer=setTimeout(()=>{if(current?.type==='article')store.setContentProgress(ref(),body.scrollTop).catch(()=>{});},400);}},{passive:true});
  body.addEventListener('wheel',e=>{if(!['video','videos'].includes(current?.type)||e.target.closest('.d-video-comments,.d-video-info')||Math.abs(e.deltaY)<24||Date.now()-wheelTime<900)return;e.preventDefault();wheelTime=Date.now();nextVideo(e.deltaY>0?1:-1);},{passive:false});
  body.addEventListener('touchstart',e=>{touchY=e.target.closest('.d-video-stage')?e.touches[0].clientY:null;},{passive:true});
  body.addEventListener('touchend',e=>{if(touchY!==null){const distance=touchY-e.changedTouches[0].clientY;if(Math.abs(distance)>65)nextVideo(distance>0?1:-1);touchY=null;}},{passive:true});
  const keyboard=e=>{if(stage==='closed'||e.target.closest('input,textarea')||!['video','videos'].includes(current?.type))return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();nextVideo(e.key==='ArrowDown'?1:-1);}};
  windowNode.addEventListener('keydown',keyboard);
  shell.addEventListener('pointerdown',event=>{if(event.target===shell)pointerStart={x:event.clientX,y:event.clientY};});
  shell.addEventListener('click',event=>{if(event.target===shell&&(!pointerStart||Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)<6))close();});
  ['timeupdate','play','pause','loadedmetadata','canplay','volumechange','waiting'].forEach(name=>video.addEventListener(name,syncVideo));video.addEventListener('error',showVideoError);
  unsub=store.subscribe((_,event)=>{if(stage==='closed'||!current)return;if(/progress|visit|history|draft|scroll|read/.test(event.type))return;if(event.type.startsWith('content-')||event.type.startsWith('discovery-')||event.type==='reading-font'){current.scroll=body.scrollTop;render();}});
  return {
    open(route='discover',options={}){
      const nextOwner=options.owner==='me'?'me':'discover';
      const resume=nextOwner==='discover'&&options.resume&&dockSession;
      const fresh=stage==='closed'||!!sceneKind||nextOwner!==ownerNav;
      if(sceneKind)window.__discoveryBoards?.dismiss();
      // Finalize the old workspace before publishing the new route/lifecycle.
      if(ui.state('discovery')!=='closed')ui.close('discovery',{immediate:true,restoreFocus:false});
      ownerNav=nextOwner;returnToOwner=options.onBack||null;
      sceneKind=null;playbackBlocked=false;layer.externalMotion=false;
      ui.setNav('discovery',ownerNav);
      ui.open('discovery',{origin:options.origin||ui.source()});
      stage='window';
      if(resume){({search,articleTab,videoTab,personalTab,commentsOpen}=dockSession);current=structuredClone(dockSession.current);stack=structuredClone(dockSession.stack);playbackRequested=dockSession.wantPlay;render();}else{if(fresh||nextOwner==='me'){stack=[];current=null;}navigate(normalizeRoute(route));}
    },
    prepareScene,settleScene,startClosing,reveal,stopScene,detachScene,dismissBoard:stopScene,
    get shell(){return shell;},get windowNode(){return windowNode;},
    back,
    get stage(){return stage;},
    close,
    get isOpen(){return stage!=='closed';},
    get route(){return current;},
    update(){if(stage!=='closed')syncVideo();},
    dispose(){stopScene();windowNode.remove();unsub?.();clearTimeout(toastTimer);clearTimeout(progressTimer);['timeupdate','play','pause','loadedmetadata','canplay','volumechange','waiting'].forEach(name=>video.removeEventListener(name,syncVideo));video.removeEventListener('error',showVideoError);shell.remove();},
  };
}
