import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const FRIEND_META = {
  tuantuan: { name: '团团', emoji: '🦘', color: 0xeaba43, position: [-.55, 0] },
  ali: { name: '阿栗', emoji: '🦊', color: 0xc8794e, position: [.55, 0] },
  xiaomian: { name: '小眠', emoji: '🐰', color: 0xb5c2a5, position: [-.25, .08] },
  shanshan: { name: '山山', emoji: '🐻', color: 0xaa8265, position: [.3, .08] }
};
const embedded = new URLSearchParams(location.search).has('embedded') && parent !== window;
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
let settings = { reminders: true };
let dragStart = null;
let dragged = false;
let dragFrame = 0;
let latestPointer = null;
let clickedFriend = null;

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
  for (let i = 0; i < 3; i++) add(new THREE.Mesh(new THREE.IcosahedronGeometry(.72 * scale, 1), material([0x467351, 0x5e8751, tint][i])), [Math.cos(i * 2.1) * .38 * scale, (1.22 + i * .25) * scale, Math.sin(i * 2.1) * .26 * scale], group);
}
function buildWoods() {
  const ground = add(new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), material(0x688753)), [0, -.12, 0]); ground.scale.set(3.25, .26, 1.65);
  const soil = add(new THREE.Mesh(new THREE.SphereGeometry(1, 18, 9), material(0x647367)), [0, -.3, 0]); soil.scale.set(3.05, .35, 1.5);
  tree(-2.15, -.15, 1.7, 0x86a355);
  tree(2.45, .95, .62, 0x467351);
  const stone = add(new THREE.Mesh(new THREE.DodecahedronGeometry(.86, 1), material(0x788777)), [0, .58, .55]); stone.scale.set(1.18, .62, .86); stone.rotation.set(.08, .35, -.05);
  const mossCap = add(new THREE.Mesh(new THREE.SphereGeometry(.58, 10, 5), material(0x91b65d)), [-.12, .96, .52]); mossCap.scale.set(1.05, .16, .72); mossCap.rotation.z = -.08;
  [[.95, .13, .8], [1.3, .12, .58], [.7, .12, .98]].forEach((position, index) => { const pebble = add(new THREE.Mesh(new THREE.DodecahedronGeometry(.12 + index * .025, 0), material(0x98a18e)), position); pebble.scale.y = .55; });
  const leafMaterial = material(0x76965b, { side: THREE.DoubleSide });
  const bladeGeometry = new THREE.ConeGeometry(.075, .48, 3);
  [[-2.55, .45], [-1.45, .85], [2.1, .4], [1.65, -.65], [-.9, -1.05]].forEach(([x, z], index) => {
    for (let i = 0; i < 5; i++) {
      const angle = i * 2.399 + index;
      const blade = add(new THREE.Mesh(bladeGeometry, leafMaterial), [x + Math.cos(angle) * .12, .23, z + Math.sin(angle) * .12]);
      blade.rotation.set(Math.cos(angle) * .24, angle, Math.sin(angle) * .3);
      blade.scale.y = .6 + (i % 3) * .22;
    }
  });
  const stemMaterial = material(0x4c7855), petalMaterial = material(0xa7dce3), flowerCenter = material(0xe9d394);
  [[-1.65, .55], [1.8, .6], [2.25, -.35], [-1.15, -.7]].forEach(([x, z], index) => {
    const y = .42 + index % 2 * .12;
    add(new THREE.Mesh(new THREE.CylinderGeometry(.018, .025, y, 5), stemMaterial), [x, y * .5 + .06, z]);
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      const petal = add(new THREE.Mesh(new THREE.SphereGeometry(.09, 6, 4), petalMaterial), [x + Math.cos(angle) * .11, y + Math.sin(angle) * .11, z + .03]);
      petal.scale.set(.8, 1.15, .4); petal.rotation.z = -angle;
    }
    add(new THREE.Mesh(new THREE.SphereGeometry(.045, 6, 4), flowerCenter), [x, y, z + .07]);
  });
  const log = add(new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .82, 9), material(0x82735a)), [-1.15, .23, -.45]);
  log.rotation.z = Math.PI / 2; log.rotation.y = -.35;
  const cut = add(new THREE.Mesh(new THREE.CircleGeometry(.14, 9), material(0xc4b58d)), [-.765, .23, -.31]);
  cut.rotation.y = Math.PI / 2 - .35;
  function butterfly(x, y, z, scale, color, phase) {
    const group = new THREE.Group(); group.position.set(x, y, z); root.add(group);
    const wingMaterial = material(color, { emissive: color, emissiveIntensity: .25, side: THREE.DoubleSide });
    const wingGeometry = new THREE.SphereGeometry(1, 8, 4);
    const left = add(new THREE.Mesh(wingGeometry, wingMaterial), [-.18, 0, 0], group); left.scale.set(.22 * scale, .06 * scale, .34 * scale);
    const right = add(new THREE.Mesh(wingGeometry, wingMaterial.clone()), [.18, 0, 0], group); right.scale.set(.22 * scale, .06 * scale, .34 * scale);
    const body = add(new THREE.Mesh(new THREE.CapsuleGeometry(.035 * scale, .22 * scale, 3, 5), material(0x4f695b)), [0, 0, .03], group); body.rotation.x = Math.PI / 2;
    animated.push({ type: 'butterfly', group, left, right, phase, origin: group.position.clone() });
  }
  butterfly(-.72, 2.28, .15, 1.2, 0x9de8d0, .4);
  butterfly(1.42, 1.82, .34, .9, 0xe3ed9b, 2.6);
  // Keep the miniature silhouette clear: butterflies provide the ambient motion.
}
function resize() { renderer.setSize(innerWidth, innerHeight, false); const aspect=innerWidth/innerHeight; camera.left = -4*aspect; camera.right = 4*aspect; camera.top = 4; camera.bottom = -4; camera.updateProjectionMatrix(); }
function clearNotice(id) { const record = notificationRecords.get(id); if (!record) return; record.model?.removeFromParent(); record.node.remove(); notificationRecords.delete(id); }
async function loadRole(friendId, record, index) {
  const meta = FRIEND_META[friendId];
  if (!meta) return;
  try {
    let source = modelCache.get(friendId);
    const animal = friendId === 'tuantuan' ? 'kangaroo' : friendId === 'ali' ? 'fox' : friendId === 'xiaomian' ? 'rabbit' : 'bear';
    if (!source) { source = (await loader.loadAsync(`assets/rodin-friends/${animal}/scene.glb`)).scene; modelCache.set(friendId, source); }
    let model = source.clone(true); const box = new THREE.Box3().setFromObject(model); const size = box.getSize(new THREE.Vector3());
    const scale = 1.45 / Math.max(size.y, .01);
    model.scale.setScalar(scale);
    model.position.set(-(box.min.x + box.max.x) * .5 * scale, -box.min.y * scale, -(box.min.z + box.max.z) * .5 * scale);
    const holder = new THREE.Group(); holder.add(model); model = holder;
    model.position.set((index - 1) * 1.55, .25, 1.1);
    model.traverse(object => { if (object.isMesh) { object.castShadow = true; object.material = Array.isArray(object.material) ? object.material.map(value => value.clone()) : object.material.clone(); } });
    if (notificationRecords.get(friendId) !== record) return;
    model.position.x = (record.index - 1) * 1.55;
    foreground.add(model); record.model = model;
    const role = record.node.querySelector('.role'); role.textContent = ''; role.dataset.model = friendId; role.style.background = 'transparent';
  } catch (_) {}
}
function renderNotifications(items) {
  const visible = settings.reminders ? items.slice(0, 3) : [];
  const wanted = new Set(visible.map(item => item.friendId));
  for (const id of [...notificationRecords.keys()]) if (!wanted.has(id)) clearNotice(id);
  visible.forEach((item, index) => {
    const meta = FRIEND_META[item.friendId] || { name: '朋友', emoji: '🌿' };
    let record = notificationRecords.get(item.friendId);
    if (!record) {
      const node = document.createElement('div'); node.className = 'notice-role'; node.style.left = `${index * 32}%`; node.style.right = 'auto'; node.style.width = '34%';
      node.innerHTML = `<div class="role" title="打开${meta.name}会话">${meta.emoji}</div>`;
      const label = document.createElement('div'); label.className = 'notice'; label.textContent = `${meta.name}：${item.text || '有一条新消息'}`; node.append(label); notices.append(node);
      node.dataset.friend = item.friendId;
      record = { node, model: null, index }; notificationRecords.set(item.friendId, record); loadRole(item.friendId, record, index);
    }
    record.index = index;
    record.node.style.left = `${index * 32}%`;
    if (record.model) record.model.position.x = (index - 1) * 1.55;
    record.node.querySelector('.notice').textContent = meta.name;
    record.node.title = `${meta.name}：${item.text || '有一条新消息'}`;
  });
}
function messageItems(payload) {
  const state = payload?.state || { friends: [], messages: [] };
  const allowed = new Set(state.friends || []);
  const latest = new Map();
  for (const message of state.messages || []) if (message.senderId !== 'me' && !message.read && allowed.has(message.friendId)) latest.set(message.friendId, message);
  const items=[...latest.values()].sort((a, b) => a.createdAt - b.createdAt);
  if(embedded&&!items.length&&state.friends?.length)items.push({friendId:state.friends[0],text:'陪你在森林里歇一会儿',idle:true});
  return items;
}
if (bridge) bridge.onState(payload => { settings = { ...settings, ...(payload.settings || {}) }; renderNotifications(messageItems(payload)); });
viewport.addEventListener('click', () => { if (!dragged) bridge?.openMain?.(clickedFriend); dragged = false; });
viewport.addEventListener('contextmenu', event => { event.preventDefault(); bridge?.showMenu?.(); });
viewport.addEventListener('pointerdown', event => { if (event.button !== 0) return; clickedFriend = event.target.closest('[data-friend]')?.dataset.friend || null; viewport.setPointerCapture(event.pointerId); dragStart = { x: event.screenX, y: event.screenY }; dragged = false; latestPointer = null; bridge?.dragStart?.(event.screenX, event.screenY); });
viewport.addEventListener('pointermove', event => {
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
buildWoods(); resize(); window.addEventListener('resize', resize);
let start = performance.now(), frameId=0;
function requestFrame(){if(!frameId&&!document.hidden&&active)frameId=requestAnimationFrame(frame);}
document.addEventListener('visibilitychange',requestFrame);
if(embedded)sendParent({type:'ready'});
function frame(now) { frameId=0;if(document.hidden||!active)return; const t = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : (now - start) / 1000; for (const item of animated) { if (item.type === 'fire') item.object.scale.setScalar(.9 + Math.sin(t * 7) * .1); if (item.type === 'mote') { item.object.position.x = item.origin.x + Math.sin(t * .35 + item.phase) * .06; item.object.position.y = item.origin.y + Math.sin(t * .8 + item.phase) * .08; } if (item.type === 'butterfly') { item.group.position.y = item.origin.y + Math.sin(t * .7 + item.phase) * .08; item.group.position.x = item.origin.x + Math.sin(t * .45 + item.phase) * .12; item.left.rotation.z = .18 + Math.sin(t * 8 + item.phase) * .3; item.right.rotation.z = -.18 - Math.sin(t * 8 + item.phase) * .3; } } for (const record of notificationRecords.values()) if (record.model) { record.model.position.y = .25 + Math.max(0, Math.sin(t * 5.4)) * .55; record.model.rotation.y = Math.sin(t * 1.3) * .08; } if (!dragStart) root.rotation.y = Math.sin(t * .25) * .025; renderer.clear(); renderer.render(scene, camera); renderer.clearDepth(); renderer.render(foreground, camera); requestFrame(); }
requestFrame();
