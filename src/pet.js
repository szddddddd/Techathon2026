import {createIdealPet} from './pet-ideal.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { notificationItems, petNickname } from './pet-state.js';
import { createFujiPet } from './pet-fuji.js';

const FRIEND_META = {
  tuantuan: { name: '团团', emoji: '🦘', color: 0xeaba43, position: [-.55, 0] },
  ali: { name: '阿栗', emoji: '🦊', color: 0xc8794e, position: [.55, 0] },
  xiaomian: { name: '小眠', emoji: '🐰', color: 0xb5c2a5, position: [-.25, .08] },
  shanshan: { name: '山山', emoji: '🐻', color: 0xaa8265, position: [.3, .08] }
};
const query = new URLSearchParams(location.search);
const minimalMode = query.get('mode') === 'minimal';
document.documentElement.dataset.petMode = minimalMode ? 'minimal' : 'full';
const embedded = query.has('embedded') && parent !== window;
const parentOrigin = location.protocol === 'file:' ? '*' : location.origin;
const sendParent = message => parent.postMessage({channel:'forest-web-pet',...message}, parentOrigin);
let embeddedState;
const bridge = embedded ? {
  onState(callback){embeddedState=callback;},
  openMain(id){if(id)sendParent({type:'open-friend',id});},
} : window.desktopPet;
let active = !embedded;
if(embedded)window.addEventListener('message',event=>{
  const sameOrigin=location.protocol==='file:'?['null','file://'].includes(event.origin):event.origin===location.origin;
  if(event.source!==parent||!sameOrigin||event.data?.channel!=='forest-web-pet')return;
  if(event.data.type==='state')embeddedState?.(event.data.payload);
  if(event.data.type==='active'){active=!!event.data.value;if(active)requestFrame();}
});
if(embedded)window.addEventListener('keydown',event=>{if(event.key==='Escape'){sendParent({type:'dismiss'});event.preventDefault();}});
const $ = id => document.getElementById(id);
const viewport = $('pet-viewport');
const canvas = $('pet-canvas');
const notices = $('pet-notices');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setClearColor(0, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, .1, 100);
camera.position.set(0, 3.5, 8); camera.lookAt(0, 1.3, 0);
scene.add(new THREE.HemisphereLight(0xd8ead0, 0x34513e, 2.4));
const sun = new THREE.DirectionalLight(0xffe3a1, 3); sun.position.set(-3, 6, 4); scene.add(sun);
const root = new THREE.Group(); scene.add(root);
const foreground = new THREE.Scene();
foreground.add(new THREE.HemisphereLight(0xd8ead0, 0x34513e, 2.4));
const roleLight = new THREE.DirectionalLight(0xffe3a1, 3); roleLight.position.copy(sun.position); foreground.add(roleLight);
renderer.autoClear = false;
const animated = [];
const notificationRecords = new Map();
const loader = new GLTFLoader();
const modelCache = new Map();
let friendDetails = {};
function friendMeta(id){
  const detail=friendDetails[id];
  if(FRIEND_META[id])return FRIEND_META[id];
  const modelUrl=id.startsWith('avatar-')&&/^[a-f0-9-]{36}$/.test(id.slice(7))&&detail?.modelUrl===`/api/avatar/assets/${id.slice(7)}/scene.glb`?detail.modelUrl:null;
  return {name:petNickname(detail?.name),emoji:modelUrl?'':'🌿',modelUrl};
}
let settings = { reminders: true };
let dragStart = null;
let dragged = false;
let dragFrame = 0;
let latestPointer = null;
let clickedFriend = null;
let hoveredFriend = null, nearby = false, presence = 0, lastFrame = performance.now();
let lantern, lanternLight, lanternGroup, signalUntil = 0;
const pointer = new THREE.Vector2(10,10);
const windPoint = new THREE.Vector3();
function localWind(object, radius, dt, reduced) {
  object.getWorldPosition(windPoint).project(camera);
  const dx = windPoint.x - pointer.x, dy = windPoint.y - pointer.y;
  const distance = Math.hypot(dx,dy);
  const influence = nearby && !dragStart && !reduced ? Math.max(0,1-distance/radius) : 0;
  const targetX = dx / Math.max(.08,distance) * influence;
  const targetY = dy / Math.max(.08,distance) * influence;
  const wind = object.userData.pointerWind ||= new THREE.Vector2();
  const velocity = object.userData.windVelocity ||= new THREE.Vector2();
  if (reduced) { wind.set(0,0); velocity.set(0,0); }
  else {
    // Substeps keep the soft spring stable across slow frames.
    const step = dt / 3;
    for (let i=0;i<3;i++) {
      velocity.x += ((targetX-wind.x)*38-velocity.x*8)*step;
      velocity.y += ((targetY-wind.y)*38-velocity.y*8)*step;
      wind.addScaledVector(velocity,step);
    }
  }
  return wind;
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const smooth = value => value * value * (3 - 2 * value);
const slots = minimalMode ? [{x:.85,y:.12,z:.75,scale:1.125}] : [{x:0,y:.22,z:1.35,scale:1}, {x:-1.65,y:.28,z:.65,scale:.86}, {x:1.65,y:.28,z:.65,scale:.86}];
function setPhase(record, phase) {
  record.phase = phase; record.phaseStart = performance.now(); record.node.dataset.phase = phase;
}
function revealLetter(record, now = performance.now()) {
  record.letterUntil = now + 4200;
  signalUntil = now + 1000;
}

function material(color, extra = {}) { return new THREE.MeshStandardMaterial({ color, roughness: .9, flatShading: true, ...extra }); }
function add(object, materialOrPosition, positionOrParent, parent = root) {
  const mesh = object.isObject3D ? object : new THREE.Mesh(object, materialOrPosition);
  const position = object.isObject3D ? materialOrPosition : positionOrParent;
  const target = object.isObject3D ? positionOrParent || root : parent;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  target.add(mesh);
  return mesh;
}
function tree(x, z, scale, tint) {
  const group = new THREE.Group(); group.position.set(x, 0, z); root.add(group);
  add(new THREE.CylinderGeometry(.12 * scale, .22 * scale, 1.25 * scale, 7), material(0x685c43), [0, .63 * scale, 0], group);
  for (let i = 0; i < 3; i++) {
    const crown = add(new THREE.Mesh(new THREE.IcosahedronGeometry(.72 * scale, 1), material([0x467351, 0x5e8751, tint][i])), [Math.cos(i * 2.1) * .38 * scale, (1.22 + i * .25) * scale, Math.sin(i * 2.1) * .26 * scale], group);
    animated.push({type:'crown',object:crown,phase:x+i,origin:crown.position.clone()});
  }
}
function buildWoods() {
  if(minimalMode){
    const ground=add(new THREE.Mesh(new THREE.SphereGeometry(1,20,10),material(0x688753)),[0,-.12,0]);ground.scale.set(2.05,.15,.96);
    tree(-.95,-.1,1.25,0x86a355);
    // Hang in front of and below the crown, rather than inside the foliage.
    const brass=material(0xe3be66,{metalness:.25,roughness:.5});
    const branch=add(new THREE.CylinderGeometry(.035,.055,.82,7),material(0x685c43),[-.55,1.28,.38]);branch.rotation.z=-Math.PI/2;
    const bellGroup=new THREE.Group();bellGroup.name='Minimal hanging wind chime';bellGroup.position.set(-.17,1.28,.55);root.add(bellGroup);
    add(new THREE.CylinderGeometry(.018,.018,.23,6),material(0x6d5b3d),[0,-.115,0],bellGroup);
    // Closed shell profile: rounded crown, flared lip and recessed inner wall.
    // The mouth stays open; both wall surfaces have real thickness.
    const bellProfile=[
      [0,.11],[.045,.108],[.085,.092],[.12,.066],[.143,.032],
      [.156,-.012],[.164,-.057],[.178,-.094],[.196,-.117],
      [.209,-.123],[.213,-.136],[.205,-.147],[.189,-.148],
      [.175,-.128],[.157,-.107],[.143,-.07],[.135,-.021],
      [.121,.022],[.103,.054],[.075,.078],[.04,.09],[0,.09]
    ].map(([r,y])=>new THREE.Vector2(r,y));
    const bellShade=add(new THREE.LatheGeometry(bellProfile.reverse(),24),material(0x87ceeb,{roughness:.55,metalness:.08,flatShading:false}),[0,-.31,0],bellGroup);
    bellShade.name='Sky blue hollow bell shade';
    for(const [x,length] of [[-.17,.35],[0,.46],[.17,.38]])add(new THREE.CylinderGeometry(.035,.035,length,8),brass,[x,-.46-length/2,0],bellGroup);
    add(new THREE.SphereGeometry(.055,8,6),material(0x9b7841),[0,-.64,.055],bellGroup);
    add(new THREE.BoxGeometry(.13,.22,.025),material(0xa7c7b0,{side:THREE.DoubleSide}),[0,-.99,0],bellGroup);
    animated.push({type:'bell',object:bellGroup,phase:1});
    return;
  }
  const ground = add(new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), material(0x688753)), [0, -.12, 0]); ground.scale.set(3.25, .26, 1.65);
  const soil = add(new THREE.Mesh(new THREE.SphereGeometry(1, 18, 9), material(0x647367)), [0, -.3, 0]); soil.scale.set(3.05, .35, 1.5);
  tree(-2.15, -.15, 1.7, 0x86a355);
  tree(2.45, .95, .62, 0x467351);
  const stone = add(new THREE.Mesh(new THREE.DodecahedronGeometry(.86, 1), material(0x788777)), [0, .58, .55]); stone.scale.set(1.18, .62, .86); stone.rotation.set(.08, .35, -.05);
  const mossCap = add(new THREE.Mesh(new THREE.SphereGeometry(.58, 10, 5), material(0x91b65d)), [-.12, .96, .52]); mossCap.scale.set(1.05, .16, .72); mossCap.rotation.z = -.08;
  [[.95, .13, .8], [1.3, .12, .58], [.7, .12, .98]].forEach((position, index) => { const pebble = add(new THREE.Mesh(new THREE.DodecahedronGeometry(.12 + index * .025, 0), material(0x98a18e)), position); pebble.scale.y = .55; });
  const leafMaterial = material(0x76965b, { side: THREE.DoubleSide });
  const bladeGeometry = new THREE.ConeGeometry(.09, .7, 3);
  bladeGeometry.translate(0,.35,0);
  [[-2.55, .8], [-1.45, 1.15], [2.1, 1.05], [1.65, -.65], [-.9, -1.05]].forEach(([x, z], index) => {
    for (let i = 0; i < 5; i++) {
      const angle = i * 2.399 + index;
      const blade = add(new THREE.Mesh(bladeGeometry, leafMaterial), [x + Math.cos(angle) * .12, .06, z + Math.sin(angle) * .12]);
      blade.rotation.set(Math.cos(angle) * .24, angle, Math.sin(angle) * .3);
      blade.scale.y = .6 + (i % 3) * .22;
      animated.push({type:'grass',object:blade,phase:angle+index,rest:blade.rotation.z});
    }
  });
  const stemMaterial = material(0x4c7855), petalMaterial = material(0xa7dce3), flowerCenter = material(0xe9d394);
  [[-1.65, .55], [1.8, .6], [2.25, -.35], [-1.15, -.7]].forEach(([x, z], index) => {
    const y = .42 + index % 2 * .12;
    const flower = new THREE.Group(); flower.position.set(x,.06,z); root.add(flower);
    animated.push({type:'flower',object:flower,phase:index});
    add(new THREE.Mesh(new THREE.CylinderGeometry(.018, .025, y, 5), stemMaterial), [0, y * .5, 0],flower);
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      const petal = add(new THREE.Mesh(new THREE.SphereGeometry(.09, 6, 4), petalMaterial), [Math.cos(angle) * .11, y + Math.sin(angle) * .11, .03],flower);
      petal.scale.set(.8, 1.15, .4); petal.rotation.z = -angle;
    }
    add(new THREE.Mesh(new THREE.SphereGeometry(.045, 6, 4), flowerCenter), [0, y, .07],flower);
  });
  const log = add(new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .82, 9), material(0x82735a)), [-1.15, .23, -.45]);
  log.rotation.z = Math.PI / 2; log.rotation.y = -.35;
  const cut = add(new THREE.Mesh(new THREE.CircleGeometry(.14, 9), material(0xc4b58d)), [-.765, .23, -.31]);
  cut.rotation.y = Math.PI / 2 - .35;
  function butterfly(x, y, z, scale, color, phase) {
    const group = new THREE.Group(); group.position.set(x, y, z); root.add(group);
    const wingMaterial = material(color, { emissive: color, emissiveIntensity: .25, side: THREE.DoubleSide });
    const wingGeometry = new THREE.SphereGeometry(1, 8, 4);
    const left = add(new THREE.Mesh(wingGeometry, wingMaterial), [-.18 * scale, 0, 0], group); left.scale.set(.22 * scale, .06 * scale, .34 * scale);
    const right = add(new THREE.Mesh(wingGeometry, wingMaterial.clone()), [.18 * scale, 0, 0], group); right.scale.set(.22 * scale, .06 * scale, .34 * scale);
    const body = add(new THREE.Mesh(new THREE.CapsuleGeometry(.035 * scale, .22 * scale, 3, 5), material(0x4f695b)), [0, 0, .03], group); body.rotation.x = Math.PI / 2;
    animated.push({ type: 'butterfly', group, left, right, phase, origin: group.position.clone(), escape:0, safeAfter:0 });
  }
  butterfly(.94, 1.36, .1, .55, 0x73bfe8, .4);
  // A hanging lantern reads clearly even in the smallest transparent window.
  add(new THREE.CylinderGeometry(.045,.065,2.15,7),material(0x685c43),[2.15,1.12,-.15]);
  const arm = add(new THREE.CylinderGeometry(.045,.045,.66,7),material(0x685c43),[1.86,2.19,-.15]); arm.rotation.z = Math.PI/2;
  lanternGroup = new THREE.Group(); lanternGroup.position.set(1.57,2.18,-.15); root.add(lanternGroup);
  const frameMaterial = material(0x735a36);
  add(new THREE.CylinderGeometry(.025,.025,.18,6),frameMaterial,[0,-.09,0],lanternGroup);
  add(new THREE.CylinderGeometry(.2,.31,.14,6),frameMaterial,[0,-.23,0],lanternGroup);
  lantern = add(new THREE.CylinderGeometry(.22,.25,.39,6),material(0xffd56d,{emissive:0xffbc36,emissiveIntensity:1}),[0,-.49,0],lanternGroup);
  add(new THREE.CylinderGeometry(.29,.24,.1,6),frameMaterial,[0,-.73,0],lanternGroup);
  for(const x of [-.19,.19])add(new THREE.CylinderGeometry(.025,.025,.43,5),frameMaterial,[x,-.49,.15],lanternGroup);
  lanternLight = new THREE.PointLight(0xffcf68,1.2,4.5); lanternLight.position.set(1.57,1.69,.15); root.add(lanternLight);
}
let currentTheme=null,fujiPet=null;
function setTheme(id){
  const next=['forest','fuji','ideal'].includes(id)?id:'forest';if(next===currentTheme)return;
  const geometries=new Set(),materials=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of [].concat(o.material))materials.add(m);});
  root.clear();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();
  animated.length=0;lantern=lanternLight=lanternGroup=null;fujiPet?.dispose?.();fujiPet=null;currentTheme=next;
  if(next==='fuji')fujiPet=createFujiPet({root,minimal:minimalMode});else if(next==='ideal')fujiPet=createIdealPet({root,minimal:minimalMode});else buildWoods();
  document.documentElement.dataset.petScene=next;document.documentElement.dataset.petFujiAssets=next==='fuji'?'loading':'ready';viewport.setAttribute('aria-label',`${next==='ideal'?'理想城':next==='fuji'?'富士樱町':'林间来信'}${minimalMode?'极简':''}桌宠`);
}
function resize() { renderer.setSize(innerWidth, innerHeight, false); const aspect=innerWidth/innerHeight; camera.left = -4*aspect; camera.right = 4*aspect; camera.top = 4; camera.bottom = -4; camera.updateProjectionMatrix(); }
function disposeRole(model) {
  model?.removeFromParent();
  const materials = new Set();
  model?.traverse(object => { if (object.isMesh) for (const value of [].concat(object.material)) materials.add(value); });
  for (const value of materials) value.dispose();
}
function clearNotice(id) { const record = notificationRecords.get(id); if (!record) return; disposeRole(record.model); record.node.remove(); notificationRecords.delete(id); }
async function loadRole(friendId, record, index) {
  const meta = friendMeta(friendId);
  if (!FRIEND_META[friendId]&&!meta.modelUrl)return;
  const animal = friendId === 'tuantuan' ? 'kangaroo' : friendId === 'ali' ? 'fox' : friendId === 'xiaomian' ? 'rabbit' : 'bear';
  const url=meta.modelUrl||`assets/rodin-friends/${animal}/scene.glb`;
  record.loadingUrl=url;
  try {
    let source = modelCache.get(url);
    if (!source) { source = (await loader.loadAsync(url)).scene; modelCache.set(url, source); }
    let model = source.clone(true); const box = new THREE.Box3().setFromObject(model); const size = box.getSize(new THREE.Vector3());
    const scale = 1.45 / Math.max(size.y, .01);
    model.scale.setScalar(scale);
    model.position.set(-(box.min.x + box.max.x) * .5 * scale, -box.min.y * scale, -(box.min.z + box.max.z) * .5 * scale);
    const holder = new THREE.Group(); holder.add(model); model = holder;
    model.position.set((index - 1) * 1.55, .25, 1.1);
    model.traverse(object => { if (object.isMesh) { object.castShadow = true; object.material = Array.isArray(object.material) ? object.material.map(value => value.clone()) : object.material.clone(); } });
    if (notificationRecords.get(friendId) !== record || record.loadingUrl!==url) { disposeRole(model); return; }
    model.position.copy(record.position);
    disposeRole(record.model);foreground.add(model); record.model = model;record.loadedUrl=url;
    record.materials = new Map();
    model.traverse(object => { if (object.isMesh) for (const value of [].concat(object.material)) record.materials.set(value, {opacity:value.opacity,transparent:value.transparent}); });
    record.opacity = -1;
    if (record.phase === 'entering') setPhase(record, 'entering');
    const role = record.node.querySelector('.role'); role.textContent = ''; role.dataset.model = friendId; role.style.background = 'transparent';
  } catch (_) {if(record.loadingUrl===url){record.loadingUrl=null;record.node.dataset.modelError='true';}}
}
function renderNotifications(items) {
  const visible = settings.reminders ? items.slice(0, minimalMode ? 1 : 3) : [];
  const wanted = new Set(visible.map(item => item.friendId));
  for (const [id, record] of notificationRecords) if (!wanted.has(id)) {
    if (!settings.reminders || reducedMotion.matches) clearNotice(id);
    else if (record.phase !== 'leaving') setPhase(record, 'leaving');
  }
  visible.forEach((item, index) => {
    const meta = friendMeta(item.friendId);
    let record = notificationRecords.get(item.friendId);
    if (!record) {
      const node = document.createElement('button'); node.type = 'button'; node.className = 'notice-role';
      node.innerHTML = `<span class="role" aria-hidden="true">${meta.emoji}</span><span class="notice"></span>`;
      node.dataset.friend = item.friendId;
      if(!minimalMode){
      const tag = document.createElement('span'); tag.className = 'friend-tag'; tag.textContent = meta.name; node.append(tag);
      const letter = document.createElement('span'); letter.className = 'letter';
      const sender = document.createElement('strong'); sender.textContent = meta.name;
      const summary = document.createElement('span'); summary.className = 'summary'; letter.append(sender, summary); node.append(letter);
      }
      notices.append(node);
      record = { node, model:null, index, position:new THREE.Vector3(slots[index].x, slots[index].y, slots[index].z), scale:slots[index].scale, messageId:null, letterUntil:0, acknowledgedAt:0 };
      notificationRecords.set(item.friendId, record); setPhase(record, 'entering'); loadRole(item.friendId, record, index);
    } else if (record.phase === 'leaving') setPhase(record, 'entering');
    if (record.messageId !== item.id || record.text !== item.text) { revealLetter(record); record.acknowledgedAt = 0; delete record.node.dataset.acknowledged; }
    record.messageId = item.id; record.text = item.text; record.index = index;
    record.node.dataset.slot = String(index);
    record.node.querySelector('.notice').textContent = meta.name;
    if(meta.modelUrl&&record.loadingUrl!==meta.modelUrl)loadRole(item.friendId,record,index);
    if(!minimalMode){record.node.querySelector('.friend-tag').textContent=meta.name;record.node.querySelector('.letter strong').textContent=meta.name;}
    if(!minimalMode){
      record.node.querySelector('.summary').textContent = item.text || '有一条新消息';
      record.node.title = `${meta.name}：${item.text || '有一条新消息'}`;
    }
    record.node.setAttribute('aria-label', minimalMode ? `打开${meta.name}会话` : `打开${meta.name}会话：${item.text || '有一条新消息'}`);
  });
}
function messageItems(payload) { return notificationItems(payload?.state); }
if (bridge) bridge.onState(payload => { settings = { ...settings, ...(payload.settings || {}) };friendDetails=payload.state?.friendDetails||{}; setTheme(payload.state?.sceneId); renderNotifications(messageItems(payload)); });
const roleRaycaster=new THREE.Raycaster();
function friendAt(event){
  const domId=event.target.closest('[data-friend]')?.dataset.friend;if(domId)return domId;
  const rect=canvas.getBoundingClientRect();roleRaycaster.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,1-(event.clientY-rect.top)/rect.height*2),camera);
  foreground.updateMatrixWorld(true);
  const candidates=[...notificationRecords].filter(([,r])=>r.model&&r.phase!=='leaving');
  const hits=roleRaycaster.intersectObjects(candidates.map(([,r])=>r.model),true);
  for(const hit of hits)for(const [id,r]of candidates){let o=hit.object;while(o){if(o===r.model)return id;o=o.parent;}}
  return null;
}
viewport.addEventListener('click', event => {
  if (!dragged) {
    const id = clickedFriend || friendAt(event);
    const record = notificationRecords.get(id);
    if (record?.phase === 'leaving') return;
    if (record) { record.acknowledgedAt = performance.now(); record.letterUntil = 0; record.node.dataset.acknowledged = 'true'; }
    bridge?.openMain?.(id);
  }
  dragged = false;
});
viewport.addEventListener('pointerenter', () => { nearby = true; });
viewport.addEventListener('pointerleave', () => { nearby = false; hoveredFriend = null; });
viewport.addEventListener('pointerover', event => { hoveredFriend = event.target.closest('[data-friend]')?.dataset.friend || null; });
notices.addEventListener('focusin', event => { hoveredFriend = event.target.closest('[data-friend]')?.dataset.friend || null; });
notices.addEventListener('focusout', () => { hoveredFriend = null; });
viewport.addEventListener('contextmenu', event => { event.preventDefault(); bridge?.showMenu?.(); });
viewport.addEventListener('pointerdown', event => { if (event.button !== 0) return; clickedFriend = friendAt(event); (event.target.closest('[data-friend]')||viewport).setPointerCapture(event.pointerId); dragStart = { x: event.screenX, y: event.screenY }; dragged = false; latestPointer = null; bridge?.dragStart?.(event.screenX, event.screenY); });
viewport.addEventListener('pointermove', event => {
  pointer.set(event.clientX / innerWidth * 2 - 1,1 - event.clientY / innerHeight * 2);
  if (!dragStart || event.buttons !== 1) return;
  if (!dragged && Math.hypot(event.screenX - dragStart.x, event.screenY - dragStart.y) < 4) return;
  dragged = true;
  viewport.classList.add('dragging');
  latestPointer = { x: event.screenX, y: event.screenY };
  if (!dragFrame) dragFrame = requestAnimationFrame(() => { dragFrame = 0; if (latestPointer) bridge?.drag?.(latestPointer.x, latestPointer.y); });
});
function endDrag() {
  if (latestPointer) bridge?.drag?.(latestPointer.x, latestPointer.y);
  if (dragFrame) cancelAnimationFrame(dragFrame);
  dragFrame = 0; dragStart = null; latestPointer = null;
  viewport.classList.remove('dragging');
  bridge?.dragEnd?.();
}
viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);
viewport.addEventListener('lostpointercapture', () => { if (dragStart) endDrag(); });
window.addEventListener('blur', endDrag);
setTheme(query.get('scene')); resize(); window.addEventListener('resize', resize);
let start = performance.now(), frameId=0;
function requestFrame(){if(!frameId&&!document.hidden&&active)frameId=requestAnimationFrame(frame);}
document.addEventListener('visibilitychange',requestFrame);
if(embedded)sendParent({type:'ready'});
function frame(now) {
  frameId = 0;
  if (document.hidden || !active) return;
  const reduced = reducedMotion.matches, t = reduced ? 0 : (now - start) / 1000;
  const dt = Math.min((now - lastFrame) / 1000, .05); lastFrame = now;
  fujiPet?.update(t,reduced);
  const blend = reduced ? 1 : 1 - Math.exp(-dt * 9);
  presence += ((nearby || hoveredFriend ? 1 : 0) - presence) * blend;
  const signal = !reduced && now < signalUntil ? Math.sin((1 - (signalUntil - now) / 1000) * Math.PI) : 0;
  if(lantern && lanternLight && lanternGroup){
    lantern.material.emissiveIntensity = 1 + presence * 1.8 + signal * 3;
    lanternLight.intensity = 1.2 + presence * 2.4 + signal * 4;
    const lampWind = localWind(lantern, .32, dt, reduced);
    lanternGroup.rotation.z = reduced ? 0 : Math.sin(t * 1.4) * .035 + signal * .08 - lampWind.x * .17;
    lanternGroup.rotation.x = reduced ? 0 : lampWind.y * .09;
  }
  scene.updateMatrixWorld(true);
  for (const item of animated) {
    const breeze = localWind(item.object || item.group, item.type === 'crown' ? .65 : .28, dt, reduced);
    if (item.type === 'crown') {
      const wind = Math.sin(t * 1.05 + item.phase * .45);
      item.object.rotation.z = reduced ? 0 : wind * .042 - breeze.x * .055;
      item.object.position.x = item.origin.x + (reduced ? 0 : wind * .07 + breeze.x * .12);
      item.object.position.y = item.origin.y + (reduced ? 0 : Math.sin(t * 1.2 + item.phase) * .025 + breeze.y * .035);
    }
    if (item.type === 'grass') {
      item.object.rotation.z = item.rest + (reduced ? 0 : Math.sin(t * 1.9 + item.phase * .35) * .2 + signal * .12 - breeze.x * .14);
    }
    if (item.type === 'flower') {
      item.object.rotation.z = reduced ? 0 : Math.sin(t * 1.3 + item.phase) * .035 - breeze.x * .12;
      item.object.rotation.x = reduced ? 0 : breeze.y * .08;
    }
    if (item.type === 'bell') {
      item.object.rotation.z = reduced ? 0 : Math.sin(t * 1.7 + item.phase) * .08;
      item.object.rotation.x = reduced ? 0 : Math.cos(t * 1.25 + item.phase) * .035;
    }
    if (item.type === 'butterfly') {
      const home = item.origin.clone().project(camera);
      const current = item.group.position.clone().project(camera);
      const atHome = Math.hypot(home.x-pointer.x,home.y-pointer.y) < .21;
      const atButterfly = Math.hypot(current.x-pointer.x,current.y-pointer.y) < .1;
      const startled = nearby && !dragStart && (item.escape > .5 ? atHome || atButterfly : atButterfly);
      if (startled) item.safeAfter = now + 4000;
      const away = now < item.safeAfter;
      item.escape = reduced ? (away ? 1 : 0) : THREE.MathUtils.clamp(item.escape + dt * (away ? 1 / 1.4 : -1 / 2.2),0,1);
      const retreat = smooth(item.escape);
      item.group.traverse(object => { if(object.isMesh) { object.material.transparent = true; object.material.opacity = 1-retreat; } });
      // Orthographic projection needs a little size change to convey flight into depth.
      item.group.scale.setScalar(1 - retreat * .38);
      item.group.position.y = item.origin.y + (reduced ? 0 : Math.sin(t * .85 + item.phase) * .15 + Math.sin(t * 1.7) * .035);
      item.group.position.x = item.origin.x + (reduced ? 0 : Math.sin(t * .55 + item.phase) * .25);
      item.group.position.z = item.origin.z + (reduced ? 0 : Math.sin(t * .8) * .18 - item.escape * 1.35);
      item.group.rotation.set(reduced ? 0 : Math.sin(t * .85) * .28 - retreat * .32,reduced ? 0 : Math.cos(t * .55 + item.phase) * .5,reduced ? 0 : -Math.cos(t * .55 + item.phase) * .22);
      item.left.rotation.z = .18 + (reduced ? 0 : Math.sin(t * 8 + item.phase) * .3);
      item.right.rotation.z = -.18 - (reduced ? 0 : Math.sin(t * 8 + item.phase) * .3);
    }
  }
  // Only one letter is expanded; the model and its hit target share the same projection.
  const records = [...notificationRecords.values()];
  const letterRecord = records.find(r => r.node.dataset.friend === hoveredFriend && r.phase !== 'leaving' && !r.acknowledgedAt)
    || records.filter(r => r.phase !== 'leaving' && !r.acknowledgedAt && now < r.letterUntil).sort((a,b) => b.letterUntil - a.letterUntil)[0];
  for (const [id, record] of notificationRecords) {
    const elapsed = now - record.phaseStart;
    if (record.phase === 'leaving' && (reduced || elapsed >= 680)) { clearNotice(id); continue; }
    const entering = record.phase === 'entering', leaving = record.phase === 'leaving';
    const progress = reduced ? 1 : Math.min(1, Math.max(0, (elapsed - (entering ? 80 + record.index * 60 : 0)) / (entering ? 920 : 680)));
    const ease = smooth(progress);
    const visibility = leaving ? 1 - smooth(Math.max(0,(progress - .45) / .55)) : entering ? smooth(Math.min(1,progress / .28)) : 1;
    if (entering && progress === 1) setPhase(record, 'idle');
    const slot = slots[record.index];
    record.position.lerp(new THREE.Vector3(slot.x,slot.y,slot.z), blend);
    record.scale += (slot.scale - record.scale) * blend;
    const position = record.position.clone();
    if(currentTheme==='fuji'&&!minimalMode)position.y-=1.45*record.scale/3;
    const direction = minimalMode || record.index === 1 ? -1 : 1;
    let turn = 0, lean = 0, squash = 0;
    if (!reduced && entering) {
      const travel = 1 - Math.pow(1 - progress,3);
      position.x += direction * .72 * (1 - travel);
      position.z -= .9 * (1 - travel);
      position.y += Math.sin(progress * Math.PI) * .16 + Math.sin(progress * Math.PI * 4) * .055 * (1 - progress);
      turn = direction * (-.65 * (1 - ease) + Math.sin(progress * Math.PI * 2) * .16);
      lean = direction * Math.sin(progress * Math.PI * 3) * .07 * (1 - progress);
      squash = Math.sin(progress * Math.PI * 4) * .055 * (1 - progress);
    } else if (!reduced && leaving) {
      const retreat = smooth(Math.max(0,(progress - .2) / .8));
      position.x += direction * .7 * retreat;
      position.z -= 1.05 * retreat;
      position.y += Math.sin(progress * Math.PI * 3) * .065 * Math.sin(progress * Math.PI);
      turn = direction * smooth(Math.min(1,progress / .5)) * 1.15;
      lean = -direction * Math.sin(progress * Math.PI) * .08;
    }
    const ack = record.acknowledgedAt && !reduced ? Math.max(0, 1 - (now - record.acknowledgedAt) / 450) : 0;
    if (record.acknowledgedAt && now - record.acknowledgedAt > 1200) { record.acknowledgedAt = 0; delete record.node.dataset.acknowledged; }
    const hover = hoveredFriend === id;
    if (record.model) {
      record.model.position.copy(position);
      record.model.scale.set(record.scale * (1 + squash * .45),record.scale * (1 - squash),record.scale * (1 + squash * .45));
      record.model.rotation.y = turn + (hover ? .2 : 0) + (reduced ? 0 : Math.sin(t * .8 + record.index) * (hoveredFriend && !hover ? .012 : .035)) + ack * .28;
      record.model.rotation.z = lean - ack * .075;
      if (record.opacity !== visibility) {
        for (const [value, original] of record.materials) {
          const transparent = original.transparent || visibility < 1;
          if (value.transparent !== transparent) { value.transparent = transparent; value.needsUpdate = true; }
          value.opacity = original.opacity * visibility;
        }
        record.opacity = visibility;
      }
    }
    const foot = position.clone().project(camera);
    const head = position.clone().add(new THREE.Vector3(0,1.6 * record.scale,0)).project(camera);
    record.node.style.left = `${(foot.x + 1) * 50}%`;
    record.node.style.top = `${(1 - head.y) * 50}%`;
    record.node.style.height = `${Math.max(12,(head.y - foot.y) * 50)}%`;
    record.node.style.setProperty('--visibility', String(visibility));
    record.node.style.zIndex = String(record.index === 0 ? 3 : 2);
    record.node.dataset.letter = String(!minimalMode && record === letterRecord && visibility > .9);
    record.node.dataset.hovered = String(hover);
    record.node.tabIndex = record.phase === 'leaving' ? -1 : 0;
  }
  root.rotation.y = 0;
  renderer.clear(); renderer.render(scene, camera); renderer.clearDepth(); renderer.render(foreground, camera);
  requestFrame();
}
requestFrame();
