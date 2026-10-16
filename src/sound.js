export const MUSIC_TRACKS=[{id:'forest',title:'森林混音带',src:'assets/audio/forest-mixtape.mp3',logo:'tree'},{id:'spring',title:'春弦',src:'assets/audio/spring-strings.mp3',logo:'spring'}];
export function createSound({store}){
  const selected=()=>MUSIC_TRACKS.find(t=>t.id===store.state.settings.musicTrack)||MUSIC_TRACKS[0];
  let loadedTrack=selected().id,revision=0,fadeToken=0,fadeTimer=null;
  const music=new Audio(selected().src);music.loop=true;music.volume=0;music.preload='none';
  const fadeDuration=420;
  function fadeTo(target,{pause=false}={}){const token=++fadeToken,from=music.volume,start=performance.now();clearTimeout(fadeTimer);const tick=()=>{if(token!==fadeToken)return;const p=Math.min(1,(performance.now()-start)/fadeDuration),e=p*p*(3-2*p);music.volume=from+(target-from)*e;if(p<1)fadeTimer=requestAnimationFrame(tick);else if(pause)music.pause();};tick();}
  let unlocked=false,disposed=false,context,lastEffect=0,status='等待首次操作',playingVideo=null;
  const listeners=new Set();
  const enabled=kind=>store.state.settings[kind==='music'?'musicEnabled':'effectsEnabled']!==false;
  const emit=()=>{for(const listener of listeners)listener();};
  function blocked(){return document.hidden||!!playingVideo&&!playingVideo.paused&&!playingVideo.ended;}
  async function apply(){
    if(disposed)return;
    const ticket=++revision;
    if(loadedTrack!==selected().id){fadeTo(0,{pause:true});music.src=selected().src;loadedTrack=selected().id;music.load();}
    if(!enabled('music')||blocked()){fadeTo(0,{pause:true});status=enabled('music')?'已暂停':'已关闭';emit();return;}
    if(!unlocked){status='首次点击后播放';emit();return;}
    try{await music.play();if(ticket!==revision)return;if(disposed||!enabled('music')||blocked()){fadeTo(0,{pause:true});return;}fadeTo(.28);status=`正在播放 · ${selected().title}`;}
    catch(error){if(ticket!==revision)return;status=error.name==='NotAllowedError'?'点击开关以开始播放':'音乐暂时无法播放，请关闭后重试';}
    emit();
  }
  function effect(message=false){
    if(!unlocked||!enabled('effects')||document.hidden||performance.now()-lastEffect<100)return;
    lastEffect=performance.now();
    try{
      context ||= new AudioContext();context.resume().catch(()=>{});
      const oscillator=context.createOscillator(),gain=context.createGain(),now=context.currentTime;
      oscillator.type='sine';oscillator.frequency.setValueAtTime(message?660:440,now);oscillator.frequency.exponentialRampToValueAtTime(message?880:330,now+.11);
      gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(message ? .045 : .025,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+.18);
      oscillator.connect(gain).connect(context.destination);oscillator.start(now);oscillator.stop(now+.2);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
    }catch{}
  }
  function gesture(event){
    if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
    if(!unlocked){unlocked=true;apply();}
    if(event.target.closest('button')&&!event.target.closest('[data-sound]'))effect();
  }
  const visibility=()=>apply();
  const media=event=>{if(event.target instanceof HTMLVideoElement){if(event.type==='play')playingVideo=event.target;else if(playingVideo===event.target)playingVideo=null;apply();}};
  document.addEventListener('pointerdown',gesture,true);document.addEventListener('keydown',gesture,true);document.addEventListener('visibilitychange',visibility);
  for(const type of ['play','pause','ended'])document.addEventListener(type,media,true);
  music.addEventListener('error',()=>{status='音乐暂时无法播放，请关闭后重试';emit();});
  const unsubscribe=store.subscribe((_,event)=>{if(event.type==='sound-settings')apply();if(event.type==='message-received')effect(true);});
  return{music,enabled,get track(){return selected();},async select(id){unlocked=true;await store.selectMusicTrack(id);},get status(){return status;},get playing(){return !music.paused;},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    async set(kind,value){unlocked=true;await store.setSoundEnabled(kind,value);await apply();if(kind==='effects'&&value)effect();},
    dispose(){disposed=true;cancelAnimationFrame(fadeTimer);music.pause();music.removeAttribute('src');music.load();context?.close();unsubscribe();listeners.clear();document.removeEventListener('pointerdown',gesture,true);document.removeEventListener('keydown',gesture,true);document.removeEventListener('visibilitychange',visibility);for(const type of ['play','pause','ended'])document.removeEventListener(type,media,true);}
  };
}

export function createSoundSettings({sound,ui,onSceneOpen=()=>{},onSceneClose=()=>{}}){
  let sceneMode=false;
  const root=document.createElement('div');root.id='sound-settings-root';
  root.innerHTML='<dialog id="sound-settings" aria-label="声音设置"><header><button type="button" data-ui-close="sound" aria-label="返回">←</button><h2>声音设置</h2><button type="button" data-ui-close="sound" aria-label="关闭声音设置">×</button></header><p class="sound-eyebrow">WOODLAND MIXTAPES</p><p class="sound-intro">让音乐留在林间，也可以只听安静。</p><section class="sound-library" aria-label="候选背景音乐"><h3>挑一张唱片</h3><div class="sound-tracks"></div><p class="sound-library-note">你的林间唱片收藏 · 2 张</p></section><label class="sound-row"><span><strong>背景音乐</strong><small id="sound-current-track">森林混音带 · 循环播放</small></span><input type="checkbox" role="switch" data-sound="music" aria-label="背景音乐"></label><label class="sound-row"><span><strong>音效</strong><small>按钮轻响与好友来信提示</small></span><input type="checkbox" role="switch" data-sound="effects" aria-label="音效"></label><p id="sound-playback-status" role="status"></p></dialog>';
  root.querySelector('.sound-tracks').innerHTML=MUSIC_TRACKS.map(t=>`<button type="button" class="sound-track" aria-pressed="false" data-track="${t.id}"><span class="sound-album" aria-hidden="true">♧</span><span><strong>${t.title}</strong><small>林间的陪伴 · 循环播放</small></span><span class="sound-selected">播放</span></button>`).join('');
  document.body.append(root);const dialog=root.querySelector('dialog');
  ui.register('sound',{el:dialog,kind:'child',modal:true,onClose({immediate}){if(sceneMode)onSceneClose(immediate);sceneMode=false;document.body.classList.remove('sound-scene-open');}});
  const refresh=()=>{for(const button of root.querySelectorAll('[data-track]')){const chosen=button.dataset.track===sound.track.id;button.setAttribute('aria-pressed',String(chosen));button.querySelector('.sound-selected').textContent=chosen?'已选':'播放';}root.querySelector('#sound-current-track').textContent=sound.track.title+' · 循环播放';for(const input of root.querySelectorAll('[data-sound]'))input.checked=sound.enabled(input.dataset.sound);root.querySelector('#sound-playback-status').textContent=sound.status;};
  const off=sound.subscribe(refresh);refresh();
  root.addEventListener('change',async event=>{const input=event.target;if(!input.matches('[data-sound]'))return;input.disabled=true;try{await sound.set(input.dataset.sound,input.checked);}catch{refresh();root.querySelector('#sound-playback-status').textContent='设置未能保存，请重试。';}finally{input.disabled=false;}});
  root.querySelector('.sound-tracks').addEventListener('click',async event=>{const button=event.target.closest('[data-track]');if(!button)return;try{await sound.select(button.dataset.track);refresh();}catch{root.querySelector('#sound-playback-status').textContent='音乐未能开启，请重试。';}});
  return{open(origin,{scene=false}={}){sceneMode=scene;dialog.dataset.scene=String(scene);document.body.classList.toggle('sound-scene-open',scene);refresh();ui.open('sound',{origin});if(scene)onSceneOpen();},dispose(){off();ui.close('sound',{immediate:true});root.remove();}};
}
