(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const places = [
    { name: '林间驿站', title: '歇脚处，<br>炊烟正暖', description: '木轮停在门前，故事留在檐下。<br>远行的人，总能在这里找到一盏灯。', x: 303, y: 152 },
    { name: '旅人的营火', title: '把故事<br>留给篝火', description: '火星轻轻跃起，茶水渐渐温热。<br>今晚不问归途，只听森林说话。', x: 462, y: 193 },
    { name: '苔石古桥', title: '一座桥，<br>两岸风光', description: '石缝长出新绿，溪水流过旧时光。<br>停一停，听见水声里的远方。', x: 644, y: 239 },
    { name: '蓝晶秘境', title: '山岩间<br>藏着星光', description: '晶石在藤蔓深处泛起微蓝。<br>也许，那是森林尚未说出的秘密。', x: 832, y: 194 },
    { name: '溪畔邂逅', title: '沿着溪流，<br>偶遇同路人', description: '有人在等一阵风，有人在等一个故事。<br>而相遇，是旅途最温柔的礼物。', x: 749, y: 445 }
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { selected: -1, visited: new Set(), paused: false, immersive: false, sound: false, motion: !reduced.matches, particles: true, volume: .4 };
  try { const saved = JSON.parse(localStorage.getItem('forest-preferences') || '{}'); for (const key of ['motion', 'particles', 'volume']) if (typeof saved[key] === typeof state[key]) state[key] = saved[key]; } catch (_) {}
  if (reduced.matches) state.motion = false;
  const save = () => { try { localStorage.setItem('forest-preferences', JSON.stringify({ motion: state.motion, particles: state.particles, volume: state.volume })); } catch (_) {} };
  let width = 0, height = 0, dpr = 1, rect = { x: 0, y: 0, w: 0, h: 0 };
  let zoom = 1.035, targetZoom = 1.035, focusX = .5, focusY = .5, targetFocusX = .5, targetFocusY = .5;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const canvas = $('scene');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  const image = new Image();
  let program, uniforms, ready = false, ambient;
  const ambientCanvas = $('ambient');
  if (window.ForestAmbient) ambient = new window.ForestAmbient(ambientCanvas);

  function compile(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  function setupGL() {
    if (!gl) { canvas.hidden = true; return; }
    const vertex = compile(gl.VERTEX_SHADER, 'attribute vec2 position; varying vec2 uv; void main(){ uv=vec2((position.x+1.0)*.5,(1.0-position.y)*.5); gl_Position=vec4(position,0.,1.); }');
    const fragment = compile(gl.FRAGMENT_SHADER, `precision mediump float;
      varying vec2 uv; uniform sampler2D picture; uniform sampler2D field; uniform vec2 resolution; uniform vec4 frame; uniform vec2 pointer; uniform float time;
      void main(){
        vec2 p=(uv*resolution-frame.xy)/frame.zw;
        vec4 mask=texture2D(field,clamp(p,0.001,0.999));
        p+=pointer*vec2(.010,.007)*(mask.r-.34);
        float water=mask.g;
        p.x+=water*(sin(p.y*165.-time*.85)+sin(p.y*91.+time*.55+p.x*60.))*.00085;
        p.y+=water*sin(p.x*110.-time*.6)*.00045;
        vec3 color=texture2D(picture,clamp(p,.001,.999)).rgb;
        float shimmer=sin(p.y*290.+p.x*130.-time*1.8)*sin(p.y*110.-time*.8);
        color+=water*max(shimmer,0.)*.024;
        color*=vec3(.98,1.01,.98);
        gl_FragColor=vec4(color,1.);
      }`);
    program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    uniforms = Object.fromEntries(['picture','field','resolution','frame','pointer','time'].map(key => [key, gl.getUniformLocation(program,key)]));
    function texture(source, unit) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, gl.createTexture()); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source); }
    texture(image,0);
    const mask = document.createElement('canvas'); mask.width=1024; mask.height=572;
    const c=mask.getContext('2d'); const gradient=c.createLinearGradient(0,0,0,572); gradient.addColorStop(0,'rgb(30,0,0)'); gradient.addColorStop(.45,'rgb(105,0,0)'); gradient.addColorStop(1,'rgb(245,0,0)'); c.fillStyle=gradient; c.fillRect(0,0,1024,572);
    function shape(points, color) { c.fillStyle=color; c.beginPath(); points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.closePath(); c.fill(); }
    shape([[0,0],[209,0],[178,91],[114,143],[99,283],[186,385],[115,453],[0,502]],'rgb(220,0,0)');
    shape([[1024,0],[950,0],[942,116],[977,185],[934,298],[952,375],[1024,414]],'rgb(215,0,0)');
    shape([[616,0],[701,0],[690,41],[670,71],[645,84],[667,100],[638,116],[608,135],[591,157],[601,180],[631,204],[586,213],[561,185],[545,163],[543,144],[562,117],[605,94],[625,67],[608,49],[627,29]],'rgb(80,250,0)');
    shape([[615,280],[680,278],[703,307],[696,328],[718,347],[742,355],[757,389],[733,420],[725,449],[691,474],[669,506],[655,542],[658,572],[431,572],[460,538],[490,500],[518,475],[526,443],[556,411],[579,390],[598,359],[620,339],[624,316]],'rgb(160,250,0)');
    // A soft mask avoids seams around banks; red records approximate painted depth.
    const soft=document.createElement('canvas');soft.width=1024;soft.height=572;const sc=soft.getContext('2d');sc.filter='blur(4px)';sc.drawImage(mask,0,0);texture(soft,1);
    gl.uniform1i(uniforms.picture,0);gl.uniform1i(uniforms.field,1);ready=true;
  }
  image.onload = () => { try { setupGL(); } catch(error) { console.warn('Scene uses its static fallback:', error); canvas.hidden=true; } resize(); };
  image.src = window.FOREST_IMAGE || 'background.jpg';
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); ready=false; canvas.hidden=true; });
  canvas.addEventListener('webglcontextrestored', () => { setupGL(); canvas.hidden=false; resize(); });

  function resize() {
    width=window.innerWidth;height=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ambientCanvas.width=Math.round(width*dpr);ambientCanvas.height=Math.round(height*dpr);ambientCanvas.getContext('2d').setTransform(dpr,0,0,dpr,0,0);
    if(gl) gl.viewport(0,0,canvas.width,canvas.height);
    updateRect();
  }
  function updateRect() {
    const scale=Math.max(width/1024,height/572)*zoom;
    rect.w=1024*scale;rect.h=572*scale;
    rect.x=Math.max(width-rect.w,Math.min(0,width*(state.selected<0?.5:.62)-focusX*rect.w));
    rect.y=Math.max(height-rect.h,Math.min(0,height*(state.selected<0?.5:.42)-focusY*rect.h));
    if(ambient) ambient.setViewport({width,height,imageX:rect.x,imageY:rect.y,imageWidth:rect.w,imageHeight:rect.h});
    if(!ready){const fallback=document.querySelector('.scene-fallback');fallback.style.backgroundSize=`${rect.w}px ${rect.h}px`;fallback.style.backgroundPosition=`${rect.x}px ${rect.y}px`;}
    places.forEach((place,i)=>{const button=hotspotButtons[i];const x=rect.x+place.x/1024*rect.w,y=rect.y+place.y/572*rect.h;button.style.left=`${x}px`;button.style.top=`${y}px`;button.tabIndex=x>17&&x<width-17&&y>17&&y<height-17?0:-1;});
  }
  const hotspotButtons=places.map((place,i)=>{
    const button=document.createElement('button');button.className='hotspot';button.setAttribute('aria-label',`探索${place.name}`);button.innerHTML=`<span class="hotspot-ring"></span><span class="hotspot-label">${place.name}</span>`;button.onclick=()=>selectPlace(i);$('hotspots').append(button);
    const mapButton=document.createElement('button');mapButton.className='map-point';mapButton.style.left=`${place.x/1024*100}%`;mapButton.style.top=`${place.y/572*100}%`;mapButton.textContent=`${String(i+1).padStart(2,'0')} ${place.name}`;mapButton.onclick=()=>{$('map-dialog').close();selectPlace(i);};$('map-points').append(mapButton);
    const dot=document.createElement('i');$('discovery-dots').append(dot);return button;
  });
  function selectPlace(i) {
    state.selected=(i+places.length)%places.length;const place=places[state.selected];const fresh=!state.visited.has(state.selected);state.visited.add(state.selected);
    targetZoom=1.25;targetFocusX=place.x/1024;targetFocusY=place.y/572;
    $('place-title').innerHTML=place.title;$('place-description').innerHTML=place.description;$('explore-label').textContent='下一处风景';$('back').hidden=false;
    document.querySelector('.intro .eyebrow b').textContent=`${String(state.selected+1).padStart(2,'0')} / 05`;
    $('discovered').textContent=String(state.visited.size).padStart(2,'0');
    hotspotButtons.forEach((button,j)=>{button.classList.toggle('active',j===state.selected);button.classList.toggle('visited',state.visited.has(j));button.setAttribute('aria-pressed',String(j===state.selected));$('discovery-dots').children[j].classList.toggle('found',state.visited.has(j));});
    if(fresh) toast(state.visited.size===5?'已收集溪谷的五处风景 · 愿宁静与你同行':`发现一处风景 · ${place.name}`);
  }
  function resetView() { state.selected=-1;targetZoom=1.035;targetFocusX=targetFocusY=.5;$('place-title').innerHTML='风停在<br>翡翠溪谷';$('place-description').innerHTML='越过石桥，循着溪水的声音。<br>在世界的喧嚣之外，找到一小片宁静。';$('explore-label').textContent='开始漫游';$('back').hidden=true;document.querySelector('.intro .eyebrow b').textContent='01 / 05';hotspotButtons.forEach(button=>{button.classList.remove('active');button.setAttribute('aria-pressed','false');}); }
  $('explore').onclick=()=>selectPlace(state.selected+1);$('back').onclick=resetView;
  let toastTimer;
  function toast(message) { $('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3500); }
  for(const [button,dialog] of [['map-open','map-dialog'],['minimap-open','map-dialog'],['settings-open','settings-dialog']]) $(button).onclick=()=>$(dialog).showModal();
  document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>$(button.dataset.close).close());
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}}));
  $('motion').checked=state.motion;$('particles').checked=state.particles;$('volume').value=Math.round(state.volume*100);
  $('motion').onchange=()=>{state.motion=$('motion').checked;save();};$('particles').onchange=()=>{state.particles=$('particles').checked;save();};
  $('pause').onclick=()=>{state.paused=!state.paused;$('pause').setAttribute('aria-pressed',String(state.paused));$('pause-label').textContent=state.paused?'继续时光':'暂停时光';$('pause-icon').innerHTML=state.paused?'<path d="m8 4 11 8-11 8V4Z"/>':'<path d="M9 5v14m6-14v14"/>';toast(state.paused?'时光已暂停，风景为你停留':'风又吹过了溪谷');};
  function immerse(value) { state.immersive=value;$('world').classList.toggle('immersed',value);$('immersive').setAttribute('aria-pressed',String(value));document.querySelectorAll('.ui,.hotspots').forEach(element=>element.inert=value);$('exit-immersive').hidden=!value;$(value?'exit-immersive':'immersive').focus({preventScroll:true}); }
  $('immersive').onclick=()=>immerse(true);$('exit-immersive').onclick=()=>immerse(false);
  window.addEventListener('keydown',event=>{if(document.querySelector('dialog[open]'))return;if(event.key==='Escape'){if(state.immersive)immerse(false);else if(state.selected>=0)resetView();}if(!state.immersive&&!/INPUT|BUTTON/.test(document.activeElement.tagName)){if(event.key==='ArrowRight')selectPlace(state.selected+1);if(event.key==='ArrowLeft')selectPlace(state.selected<0?4:state.selected-1);}});
  window.addEventListener('pointermove',event=>{pointer.targetX=(event.clientX/width-.5)*2;pointer.targetY=(event.clientY/height-.5)*2;},{passive:true});
  document.addEventListener('pointerleave',()=>{pointer.targetX=pointer.targetY=0;});
  window.addEventListener('resize',resize);

  let audioContext, master;
  function createAudio() {
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('Web Audio unavailable');audioContext=new Audio();master=audioContext.createGain();master.gain.value=0;master.connect(audioContext.destination);
    const buffer=audioContext.createBuffer(2,audioContext.sampleRate*6,audioContext.sampleRate);
    for(let channel=0;channel<2;channel++){const samples=buffer.getChannelData(channel);let low=0;for(let i=0;i<samples.length;i++){low=(low+.035*(Math.random()*2-1))/1.035;samples[i]=low*3.4+(Math.random()*2-1)*.025;}}
    const source=audioContext.createBufferSource();source.buffer=buffer;source.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1700;source.connect(filter);filter.connect(master);source.start();
    const wind=audioContext.createOscillator();wind.frequency.value=.12;const sway=audioContext.createGain();sway.gain.value=230;wind.connect(sway);sway.connect(filter.frequency);wind.start();
    // A quiet, occasional bird phrase, synthesized locally without remote media.
    for(let n=0;n<3;n++){const bird=audioContext.createOscillator();bird.type='sine';bird.frequency.value=1700+n*410;const envelope=audioContext.createGain();envelope.gain.value=0;bird.connect(envelope);envelope.connect(master);bird.start();const start=audioContext.currentTime+5+n*2.2;for(let t=start;t<start+1800;t+=19+n*6){envelope.gain.setValueAtTime(0,t);envelope.gain.linearRampToValueAtTime(.027,t+.06);envelope.gain.exponentialRampToValueAtTime(.0001,t+.4);bird.frequency.setValueAtTime(1700+n*410,t);bird.frequency.exponentialRampToValueAtTime(2400+n*350,t+.2);}}
  }
  let soundPending=false;
  $('sound').onclick=async()=>{if(soundPending)return;soundPending=true;try{if(!audioContext)createAudio();await audioContext.resume();state.sound=!state.sound;master.gain.setTargetAtTime(state.sound?state.volume:0,audioContext.currentTime,.4);$('sound').setAttribute('aria-pressed',String(state.sound));$('sound-state').textContent=state.sound?'开':'关';$('sound').title=state.sound?'关闭环境音':'开启环境音';}catch(error){toast('当前浏览器无法播放环境音');console.warn(error);}finally{soundPending=false;}};
  $('volume').oninput=()=>{state.volume=Number($('volume').value)/100;if(master&&state.sound)master.gain.setTargetAtTime(state.volume,audioContext.currentTime,.1);save();};
  document.addEventListener('visibilitychange',()=>{if(audioContext){if(document.hidden)audioContext.suspend().catch(()=>{});else if(state.sound)audioContext.resume().catch(()=>{});}});
  window.addEventListener('pagehide',()=>{if(audioContext)audioContext.suspend().catch(()=>{});});
  window.addEventListener('pageshow',()=>{if(audioContext&&state.sound)audioContext.resume().catch(()=>{});});
  let lastTime=0, time=0;
  function frame(now) {
    const delta=Math.min((now-lastTime)/1000,.05)||0;lastTime=now;
    if(!state.paused&&!reduced.matches)time+=delta;
    const ease=reduced.matches?1:1-Math.exp(-delta*4);
    zoom+=(targetZoom-zoom)*ease;focusX+=(targetFocusX-focusX)*ease;focusY+=(targetFocusY-focusY)*ease;
    if(!state.paused){pointer.x+=((state.motion&&!reduced.matches?pointer.targetX:0)-pointer.x)*ease;pointer.y+=((state.motion&&!reduced.matches?pointer.targetY:0)-pointer.y)*ease;}
    updateRect();
    if(ready){gl.uniform2f(uniforms.resolution,width,height);gl.uniform4f(uniforms.frame,rect.x,rect.y,rect.w,rect.h);gl.uniform2f(uniforms.pointer,pointer.x,pointer.y);gl.uniform1f(uniforms.time,time);gl.drawArrays(gl.TRIANGLES,0,6);}
    if(ambient){ambientCanvas.style.visibility=state.particles?'visible':'hidden';ambient.setOptions({paused:state.paused,reducedMotion:reduced.matches,quality:width<700?'low':'high'});if(state.particles)ambient.render(now,pointer.x*5,pointer.y*3);}
    requestAnimationFrame(frame);
  }
  resize();requestAnimationFrame(frame);
})();
