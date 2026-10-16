import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const $ = id => document.getElementById(id);
import { ASSET_NAMES as originalNames } from './layout.js';
import {TREE_VARIANTS,treeAssetPath,lightTreeFoliage} from './tree-assets.js';
import {VALLEY_ASSET_NAMES} from './valley-assets.js';
const avatarJob=new URLSearchParams(location.search).get('avatar-job');
const validAvatarJob=/^[a-f0-9-]{36}$/.test(avatarJob||'');
const names={...originalNames,...VALLEY_ASSET_NAMES,...(validAvatarJob?{'generated-avatar':'新朋友的形象'}:{})};
if(validAvatarJob&&new URLSearchParams(location.search).has('embed'))document.documentElement.classList.add('avatar-embed');
const status = $('status');
const viewport = $('viewport');
let renderer;

function showError(message) {
  status.hidden = false;
  status.classList.add('error');
  $('status-text').textContent = message;
  $('retry').hidden = false;
}

function disposeObject(object) {
  if (!object) return;
  const geometries = new Set(), materials = new Set(), textures = new Set(), bitmaps = new Set();
  object.traverse(child => {
    if (child.geometry) geometries.add(child.geometry);
    for (const material of Array.isArray(child.material) ? child.material : child.material ? [child.material] : []) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
    if (child.skeleton) child.skeleton.dispose();
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
  textures.forEach(texture => {
    const data = texture.source?.data;
    for (const image of Array.isArray(data) ? data : [data]) if (image && typeof image.close === 'function') bitmaps.add(image);
    texture.dispose();
  });
  bitmaps.forEach(bitmap => bitmap.close());
  object.removeFromParent();
}

function boot() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.23;
  renderer.domElement.setAttribute('aria-label', '拖动旋转模型，滚轮缩放');
  renderer.domElement.tabIndex = 0;
  viewport.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#9cae9d');
  const camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, .01, 1000);
  camera.position.set(4, 3, 5);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = .075;
  controls.autoRotateSpeed = .65;
  controls.maxPolarAngle = Math.PI * .49;
  controls.minPolarAngle = .06;
  controls.enablePan = true;
  const hemi = new THREE.HemisphereLight(0xc7e3d2, 0x3e5233, 2);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe3a1, 3.7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -.0004;
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  const rim = new THREE.DirectionalLight(0x9acbc5, 1.2);
  scene.add(rim, rim.target);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#9cae9d', roughness: 1, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const loader = new GLTFLoader();
  let current = null, selected = 'cart', generation = 0, stopped = false, frameId = null;
  let radius = 1, center = new THREE.Vector3(0, .5, 0), previousTime = performance.now();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function fitCamera() {
    const vertical = THREE.MathUtils.degToRad(camera.fov);
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
    const distance = radius / Math.sin(Math.min(vertical, horizontal) / 2) * 1.28;
    controls.target.copy(center);
    camera.position.copy(center).add(new THREE.Vector3(1, .62, 1.4).normalize().multiplyScalar(distance));
    camera.near = Math.max(radius / 1000, .0001);
    camera.far = Math.max(distance * 30, radius * 100);
    camera.updateProjectionMatrix();
    controls.minDistance = radius * .5;
    controls.maxDistance = distance * 5;
    controls.update();
    controls.saveState();
  }

  function illuminate() {
    const lightTarget = center.clone();
    sun.position.copy(lightTarget).add(new THREE.Vector3(-1.1, 2.2, .8).multiplyScalar(radius * 2));
    sun.target.position.copy(lightTarget);
    sun.shadow.normalBias = radius * .003;
    const extent = radius * 2.2;
    Object.assign(sun.shadow.camera, { left: -extent, right: extent, top: extent, bottom: -extent, near: radius * .01, far: radius * 12 });
    sun.shadow.camera.updateProjectionMatrix();
    rim.position.copy(lightTarget).add(new THREE.Vector3(1.2, .8, -1.5).multiplyScalar(radius * 2));
    rim.target.position.copy(lightTarget);
    floor.scale.setScalar(radius * 200);
    floor.position.y = -radius * .002;
  }

  async function selectAsset(name) {
    if (!Object.hasOwn(names, name)) return;
    const request = ++generation;
    selected = name;
    delete document.body.dataset.loaded;
    delete viewport.dataset.loaded;
    viewport.setAttribute('aria-busy', 'true');
    status.hidden = false;
    status.classList.remove('error');
    $('retry').hidden = true;
    $('status-text').textContent = `正在加载${names[name]}…`;
    $('model-name').textContent = names[name];
    $('model-stats').textContent = '本地三维模型 · 正在加载';
    document.querySelectorAll('[data-asset]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.asset === name)));
    disposeObject(current);
    current = null;
    renderer.renderLists.dispose();
    let loaded = null;
    try {
      const gltf = await loader.loadAsync(name==='generated-avatar'?`/api/avatar/assets/${avatarJob}/scene.glb`:name==='mountain_range'?'./assets/rodin-mountain/scene.glb':Object.hasOwn(TREE_VARIANTS,name)?treeAssetPath(name):`./assets/${Object.hasOwn(VALLEY_ASSET_NAMES,name)?'rodin-valley':'rodin'}/${name}/scene.glb`);
      loaded = gltf.scene;
      if (request !== generation || stopped) { disposeObject(loaded); return; }
      let triangles = 0, meshCount = 0;
      loaded.traverse(child => {
        if (!child.isMesh) return;
        meshCount++;
        triangles += (child.geometry.index?.count ?? child.geometry.attributes.position?.count ?? 0) / 3;
        child.castShadow = true;
        child.receiveShadow = true;
        for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
          if(Object.hasOwn(TREE_VARIANTS,name)){material.color.multiply(new THREE.Color(0xf9fae9));if(material.map)material.map=lightTreeFoliage(material.map);}
          if ('roughness' in material) material.roughness = .95;
          if ('metalness' in material) material.metalness = 0;
          material.needsUpdate = true;
        }
      });
      const box = new THREE.Box3().setFromObject(loaded);
      if (box.isEmpty() || !Number.isFinite(box.max.length()) || meshCount === 0) throw new Error('Model contains no visible geometry');
      const originalCenter = box.getCenter(new THREE.Vector3());
      loaded.position.x -= originalCenter.x;
      loaded.position.z -= originalCenter.z;
      loaded.position.y -= box.min.y;
      loaded.updateMatrixWorld(true);
      const placedBox = new THREE.Box3().setFromObject(loaded);
      center = placedBox.getCenter(new THREE.Vector3());
      radius = Math.max(placedBox.getBoundingSphere(new THREE.Sphere()).radius, .001);
      current = loaded;
      scene.add(current);
      illuminate();
      fitCamera();
      renderer.render(scene, camera);
      document.body.dataset.loaded = name;
      viewport.dataset.loaded = name;
      viewport.setAttribute('aria-busy', 'false');
      $('model-stats').textContent = `${Object.hasOwn(TREE_VARIANTS,name)?'场景浅绿配色':'原始贴图'} · ${Math.round(triangles).toLocaleString('zh-CN')} 个三角面`;
      status.hidden = true;
    } catch (error) {
      if (loaded) disposeObject(loaded);
      if (request !== generation || stopped) return;
      current = null;
      viewport.setAttribute('aria-busy', 'false');
      $('model-stats').textContent = '模型暂时无法显示';
      showError(`${names[name]}加载失败。请确认本地模型文件完整，然后重试。`);
      console.error(`Unable to load local asset: ${name}`, error);
    }
  }

  for(const [key,label] of Object.entries(VALLEY_ASSET_NAMES)){const button=document.createElement('button');button.type='button';button.dataset.asset=key;button.setAttribute('aria-pressed','false');button.textContent=label;document.querySelector('nav').append(button);}
  document.querySelectorAll('[data-asset]').forEach(button => button.addEventListener('click', () => selectAsset(button.dataset.asset)));
  $('retry').addEventListener('click', () => selectAsset(selected));
  $('reset').addEventListener('click', fitCamera);
  $('rotate').addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    $('rotate').setAttribute('aria-pressed', String(controls.autoRotate));
  });
  renderer.domElement.addEventListener('keydown', event => {
    if (event.key === 'Home') { event.preventDefault(); fitCamera(); }
  });
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    if (current) fitCamera();
  });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    showError('三维画面已暂停，请刷新页面恢复。');
    $('retry').hidden = true;
  });
  function frame(now) {
    if (stopped) return;
    const delta = Math.min((now - previousTime) / 1000, .05);
    previousTime = now;
    controls.update(delta);
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(frame);
  }
  // Rotation is opt-in, including when reduced-motion preferences are enabled.
  controls.autoRotate = false;
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { controls.autoRotate = false; $('rotate').setAttribute('aria-pressed', 'false'); } });
  window.addEventListener('pagehide', () => {
    stopped = true;
    generation++;
    cancelAnimationFrame(frameId);
    disposeObject(current);
    disposeObject(floor);
    controls.dispose();
    sun.shadow.map?.dispose();
    renderer.dispose();
  }, { once: true });
  requestAnimationFrame(frame);
  window.__assetReview={view(theta=0,elevation=.4){const offset=new THREE.Vector3(Math.sin(theta)*Math.cos(elevation),Math.sin(elevation),Math.cos(theta)*Math.cos(elevation)).multiplyScalar(radius*3.3);camera.position.copy(center).add(offset);controls.target.copy(center);controls.update();},get bounds(){return current?new THREE.Box3().setFromObject(current):null;}};
  selectAsset(validAvatarJob?'generated-avatar':new URLSearchParams(location.search).get('asset') in names?new URLSearchParams(location.search).get('asset'):'cart');
}

try { boot(); }
catch (error) {
  console.error(error);
  showError('浏览器未能启动三维预览，请使用支持 WebGL 2 的浏览器打开。');
  $('retry').hidden = true;
}
