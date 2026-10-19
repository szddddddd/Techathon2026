const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen } = require('electron');
const path = require('node:path');
const {ICON_PATH, createTrayIcons} = require('./tray-icons.cjs');
const { startPetBridge } = require('./pet-bridge.cjs');
const { validState } = require('./runtime-config.cjs');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..');
if(process.env.FOREST_PET_USER_DATA)app.setPath('userData',process.env.FOREST_PET_USER_DATA);
const petOnly = process.argv.some(value => value === '--pet-only' || /^forestletters:\/\/pet(?:[/?#]|$)/i.test(value));
const singleInstance = app.requestSingleInstanceLock();
if (!singleInstance) app.quit();
let webBridge, stateSaveTimer, mailIntegration;
const requestedMailProvider=argv=>argv.includes('--mail-provider=netease')?'netease':'qqmail';
app.on('second-instance', (_event,argv) => app.whenReady().then(() => {if(argv.includes('--mail-connect')){focusMain();mailIntegration?.openConnect(requestedMailProvider(argv));}else showDesktopPet();}));
const DEFAULT_SIZE = 200;
const SIZE_PRESETS = { small: 160, medium: 200, large: 280 };
const MINIMAL_SIZE_PRESETS = { small: 118, medium: 148, large: 188 };
let mainWindow;
let mainReady = false, pendingFriend = null;
function validFriend(id) { return id == null || (typeof id === 'string' && latestState.friends.includes(id)); }
function secureWindow(window) {
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
}
function saveJSON(name, value) {
  const target = path.join(app.getPath('userData'), name), temporary = target + '.tmp';
  try { fs.writeFileSync(temporary, JSON.stringify(value)); fs.renameSync(temporary, target); }
  catch (error) { console.error(`Unable to save ${name}: ${error.message}`); }
}
let petWindow;
let tray;
let settings = { size: DEFAULT_SIZE, sizeLevel: 'medium', reminders: true, alwaysOnTop: true, petMode: 'full' };
let petSize = DEFAULT_SIZE;
let petSizeChangeInProgress = false;
let latestState = { friends: [], messages: [], profile: null };
let unreadCount = 0;
let trayFlashTimer = null;
let trayFlashOn = false;

let trayIcons;
function createIcon(blank = false) {
  trayIcons ||= createTrayIcons(nativeImage);
  return blank ? trayIcons.blank : trayIcons.normal;
}
function updateTrayFlash() {
  if (!tray) return;
  if (unreadCount > 0) {
    if (!trayFlashTimer) trayFlashTimer = setInterval(() => { trayFlashOn = !trayFlashOn; tray.setImage(createIcon(trayFlashOn)); }, 650);
  } else if (trayFlashTimer) {
    clearInterval(trayFlashTimer); trayFlashTimer = null; trayFlashOn = false; tray.setImage(createIcon(false));
  }
}

function persistSettings() {
  saveJSON('pet-settings.json', settings);
}
function loadSettings() {
  try { settings = { ...settings, ...JSON.parse(require('node:fs').readFileSync(path.join(app.getPath('userData'), 'pet-settings.json'), 'utf8')) }; } catch (_) {}
}
function broadcast() {
  if (petWindow && !petWindow.isDestroyed()) petWindow.webContents.send('social-state', { state: latestState, unreadCount, settings });
  if (tray) tray.setToolTip(unreadCount ? `WeRoam · ${unreadCount} 条未读` : 'WeRoam');
  updateTrayFlash();
}
function syncPetVisibility() {
  tray?.setContextMenu(buildMenu());
  if(mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('pet-visibility',!!petWindow&&!petWindow.isDestroyed()&&petWindow.isVisible());
  webBridge?.visibilityChanged();
}
function showDesktopPet() {
  if (!tray) return;
  if (!petWindow || petWindow.isDestroyed()) createPetWindow();
  else { petWindow.showInactive();petWindow.setAlwaysOnTop(!!settings.alwaysOnTop,'floating'); }
  tray.setContextMenu(buildMenu());broadcast();
}
function persistSocialSnapshot() {
  saveJSON('pet-social-snapshot.json', {state:latestState,unreadCount});
}
function acceptWebState(payload) {
  const previousScene=latestState.sceneId;
  latestState=payload.state;unreadCount=Number(payload.unreadCount)||0;
  if(previousScene!==latestState.sceneId)tray?.setContextMenu(buildMenu());
  broadcast();clearTimeout(stateSaveTimer);stateSaveTimer=setTimeout(persistSocialSnapshot,500);
}
function focusMain(friendId) {
  if (webBridge?.openFriend(friendId)) return;
  if (!mainWindow || mainWindow.isDestroyed()) createMainWindow();
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show(); mainWindow.focus();
  if (friendId) { if (mainReady) mainWindow.webContents.send('open-friend', friendId); else pendingFriend = friendId; }
}
function createMainWindow() {
  mainReady = false;
  mainWindow = new BrowserWindow({ icon: ICON_PATH, width: 1440, height: 920, minWidth: 900, minHeight: 650, show: false, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false } });
  secureWindow(mainWindow);
  // Scene switches update history in place; only a new document invalidates IPC readiness.
  mainWindow.webContents.on('did-start-navigation', (_event, _url, isInPlace, isMainFrame) => { if(isMainFrame&&!isInPlace)mainReady = false; });
  mainWindow.loadFile(path.join(ROOT, 'src/pages/index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('close', event => { if (!app.isQuitting) { event.preventDefault(); mainWindow.hide(); } });
}
function createPetWindow() {
  const activePresets = settings.petMode === 'minimal' ? MINIMAL_SIZE_PRESETS : SIZE_PRESETS;
  settings.sizeLevel = settings.sizeLevel || sizeLevelFor(settings.size);
  settings.size = activePresets[settings.sizeLevel] || activePresets.medium;
  petSize = Math.max(100, Math.min(480, settings.size));
  const size = petSize;
  const display = screen.getPrimaryDisplay();
  const area = display.workArea;
  petWindow = new BrowserWindow({ icon: ICON_PATH, width: size, height: size, useContentSize: true, x: area.x + area.width - size - 28, y: area.y + area.height - size - 28, frame: false, transparent: true, backgroundColor: '#00000000', resizable: false, movable: true, skipTaskbar: true, alwaysOnTop: settings.alwaysOnTop, hasShadow: false, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false } });
  secureWindow(petWindow);
  petWindow.webContents.on('did-finish-load', broadcast);
  petWindow.loadURL(webBridge.origin + '/pet.html?mode=' + encodeURIComponent(settings.petMode) + '&scene=' + (['forest','fuji','ideal'].includes(latestState.sceneId) ? latestState.sceneId : 'forest'));
  petWindow.setAlwaysOnTop(!!settings.alwaysOnTop, 'floating');
  petWindow.on('will-resize', event => {
    if (!petSizeChangeInProgress) event.preventDefault();
  });
  petWindow.on('resize', () => {
    if (petWindow && !petWindow.isDestroyed() && !petSizeChangeInProgress) {
      const [width, height] = petWindow.getContentSize();
      if (width !== petSize || height !== petSize) petWindow.setContentSize(petSize, petSize, false);
    }
  });
  petWindow.on('hide', () => setImmediate(syncPetVisibility));
  petWindow.on('show', () => { setImmediate(syncPetVisibility); broadcast(); });
  petWindow.on('closed', () => { petWindow = null; syncPetVisibility(); });
  petWindow.once('ready-to-show', () => { petWindow.showInactive(); petWindow.setAlwaysOnTop(!!settings.alwaysOnTop, 'floating'); broadcast(); });
}
function sizeLevelFor(value) {
  for(const [level,preset] of Object.entries(SIZE_PRESETS)) if(preset === value) return level;
  for(const [level,preset] of Object.entries(MINIMAL_SIZE_PRESETS)) if(preset === value) return level;
  return 'medium';
}
function setPetMode(mode) {
  if(mode !== 'full' && mode !== 'minimal') return;
  settings.petMode = mode;
  const presets = mode === 'minimal' ? MINIMAL_SIZE_PRESETS : SIZE_PRESETS;
  settings.size = presets[settings.sizeLevel || sizeLevelFor(settings.size)] || presets.medium;
  persistSettings();
  if (petWindow && !petWindow.isDestroyed()) {
    petSizeChangeInProgress = true;
    petWindow.setContentSize(settings.size, settings.size);
    petWindow.loadURL(webBridge.origin + '/pet.html?mode=' + encodeURIComponent(mode) + '&scene=' + (['forest','fuji','ideal'].includes(latestState.sceneId) ? latestState.sceneId : 'forest'));
    setImmediate(() => { petSizeChangeInProgress = false; });
  }
  setPetSize(settings.size, settings.sizeLevel);
  broadcast();
}
function setPetSize(size, level = sizeLevelFor(Number(size))) {
  const presets = settings.petMode === 'minimal' ? MINIMAL_SIZE_PRESETS : SIZE_PRESETS;
  settings.sizeLevel = ['small','medium','large'].includes(level) ? level : sizeLevelFor(Number(size));
  petSize = Math.max(100, Math.min(480, Number(size) || presets[settings.sizeLevel] || presets.medium));
  settings.size = petSize; persistSettings();
  if (petWindow && !petWindow.isDestroyed()) {
    petSizeChangeInProgress = true;
    petWindow.setContentSize(petSize, petSize);
    setImmediate(() => { petSizeChangeInProgress = false; });
  }
  broadcast();
  tray?.setContextMenu(buildMenu());
}
function togglePet() {
  if (!petWindow || petWindow.isDestroyed()) { createPetWindow(); return; }
  if (petWindow.isVisible()) petWindow.hide(); else { petWindow.showInactive(); petWindow.setAlwaysOnTop(!!settings.alwaysOnTop, 'floating'); broadcast(); }
  tray?.setContextMenu(buildMenu());
}
function buildMenu() {
  const petVisible = !!petWindow && !petWindow.isDestroyed() && petWindow.isVisible();
  return Menu.buildFromTemplate([
    { label: '打开 WeRoam', click: () => focusMain() },
    { label: petVisible ? '隐藏桌宠' : '显示桌宠', click: () => togglePet() },
    { type: 'separator' },
    { label: '桌宠样式', submenu: [
      { label: '完整桌宠', type: 'radio', checked: settings.petMode !== 'minimal', click: () => setPetMode('full') },
      { label: latestState.sceneId === 'fuji' ? '极简桌宠 · 樱花与风铃' : '极简桌宠 · 一棵树与风铃', type: 'radio', checked: settings.petMode === 'minimal', click: () => setPetMode('minimal') }
    ] },
    { label: '桌宠大小', submenu: Object.entries(settings.petMode === 'minimal' ? MINIMAL_SIZE_PRESETS : SIZE_PRESETS).map(([key, value]) => ({ label: `${key === 'small' ? '小' : key === 'medium' ? '中' : '大'} ${value} × ${value}`, type: 'radio', checked: settings.sizeLevel === key || (!settings.sizeLevel && settings.size === value), click: () => setPetSize(value, key) })) },
    { label: '收到消息时提醒', type: 'checkbox', checked: settings.reminders, click: item => { settings.reminders = item.checked; persistSettings(); broadcast(); } },
    { label: '始终置顶', type: 'checkbox', checked: settings.alwaysOnTop, click: item => { settings.alwaysOnTop = item.checked; persistSettings(); if (petWindow) petWindow.setAlwaysOnTop(item.checked, 'floating'); broadcast(); } },
    { type: 'separator' },
    { label: '退出', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
}
if(singleInstance)app.whenReady().then(async () => {
  loadSettings();
  try { const data=JSON.parse(require('node:fs').readFileSync(path.join(app.getPath('userData'),'pet-social-snapshot.json'),'utf8'));if(Array.isArray(data.state?.friends)&&Array.isArray(data.state?.messages)){latestState=data.state;unreadCount=Number(data.unreadCount)||0;} } catch (_) {}
  try { webBridge=await startPetBridge({root:ROOT,dataRoot:app.isPackaged?app.getPath('userData'):ROOT,port:Number(process.env.FOREST_PET_PORT)||47831,onState:acceptWebState,onShow:showDesktopPet,onHide:()=>{petWindow?.hide();tray?.setContextMenu(buildMenu());},isVisible:()=>!!petWindow&&!petWindow.isDestroyed()&&petWindow.isVisible()}); }
  catch(error) { require('electron').dialog.showErrorBox('桌宠暂时无法启动',`本机桌宠连接未能建立：${error.message}`);app.quit();return; }
  tray = new Tray(createIcon());
  tray.setContextMenu(buildMenu());
  tray.on('click', () => focusMain());
  if(!petOnly)createMainWindow();createPetWindow();
  mailIntegration=require('./mail-ipc.cjs').setupMailIPC({app,configRoot:app.isPackaged?app.getPath('userData'):ROOT,BrowserWindow,ipcMain,safeStorage:require('electron').safeStorage,getMainWindow:()=>mainWindow,focusMain:()=>{if(!mainWindow||mainWindow.isDestroyed())createMainWindow();if(mainWindow.isMinimized())mainWindow.restore();mainWindow.show();mainWindow.focus();}});
  if(process.argv.includes('--mail-connect'))mailIntegration.openConnect(requestedMailProvider(process.argv));
  ipcMain.on('avatar-origin',event=>{if(event.sender===mainWindow?.webContents)event.returnValue=webBridge.origin;else event.returnValue='';});
  ipcMain.handle('avatar-request',async(event,{route,body}={})=>{
    if(event.sender!==mainWindow?.webContents||!/^jobs(?:\/[a-f0-9-]{36}(?:\/(?:retry|continue|cancel))?)?$/.test(route||''))throw new Error('不支持的形象请求。');
    const response=await fetch(webBridge.origin+'/api/avatar/'+route,body?{method:'POST',headers:{'Content-Type':'application/json','X-Forest-Avatar':'1'},body:JSON.stringify(body)}:{});
    return{status:response.status,data:await response.json()};
  });
  ipcMain.on('main-ready', event => {
    if (event.sender !== mainWindow?.webContents) return;
    mainReady = true;
    if (pendingFriend) { mainWindow.webContents.send('open-friend', pendingFriend); pendingFriend = null; }
  });
  ipcMain.on('social-state', (event, payload) => { if (event.sender !== mainWindow?.webContents || !validState(payload)) return; acceptWebState(payload); tray.setContextMenu(buildMenu()); });
  ipcMain.on('pet-open-main', (event, friendId) => { if (event.sender === petWindow?.webContents && validFriend(friendId)) focusMain(friendId); });
  ipcMain.handle('get-desktop-pet-visible', event => {
    if (event.sender !== mainWindow?.webContents) return false;
    return !!petWindow && !petWindow.isDestroyed() && petWindow.isVisible();
  });
  ipcMain.handle('set-desktop-pet-visible', (event, visible) => {
    if (event.sender !== mainWindow?.webContents || typeof visible !== 'boolean') return false;
    if (visible) showDesktopPet(); else { petWindow?.hide(); tray?.setContextMenu(buildMenu()); }
    return !!petWindow && !petWindow.isDestroyed() && petWindow.isVisible();
  });
  ipcMain.on('show-desktop-pet', event => { if (event.sender !== mainWindow?.webContents) return; if (!petWindow || petWindow.isDestroyed()) createPetWindow(); else petWindow.showInactive(); tray?.setContextMenu(buildMenu()); broadcast(); });
  ipcMain.on('pet-context-menu', event => { if (event.sender === petWindow?.webContents && !petWindow.isDestroyed()) buildMenu().popup({ window: petWindow }); });
  // Read cursor and window positions in the same DIP coordinate system. Moving a
  // window must not feed renderer-generated pointer coordinates back into itself.
  let dragTimer = null;
  function stopPetDrag() { clearInterval(dragTimer); dragTimer = null; }
  ipcMain.on('pet-drag-start', event => {
    if (!petWindow || petWindow.isDestroyed() || event.sender !== petWindow.webContents) return;
    stopPetDrag();
    const origin = screen.getCursorScreenPoint(), [startX, startY] = petWindow.getPosition();
    let moving = false, lastX = startX, lastY = startY;
    dragTimer = setInterval(() => {
      if (!petWindow || petWindow.isDestroyed() || !petWindow.isVisible()) { stopPetDrag(); return; }
      const cursor = screen.getCursorScreenPoint(), dx = cursor.x - origin.x, dy = cursor.y - origin.y;
      if (!moving && Math.hypot(dx, dy) < 4) return;
      moving = true;
      const x = Math.round(startX + dx), y = Math.round(startY + dy);
      if (x !== lastX || y !== lastY) { petWindow.setPosition(x, y, false); lastX = x; lastY = y; }
    }, 16);
  });
  ipcMain.on('pet-drag-end', event => { if (petWindow && event.sender === petWindow.webContents) stopPetDrag(); });
  petWindow.on('hide', stopPetDrag);
  petWindow.on('closed', stopPetDrag);
  app.on('before-quit', stopPetDrag);
  ipcMain.on('pet-read-friend', (event, friendId) => { if (event.sender === petWindow?.webContents && validFriend(friendId)) focusMain(friendId); });
});
app.on('window-all-closed', event => event.preventDefault());
app.on('before-quit', () => { app.isQuitting = true;mailIntegration?.close();clearTimeout(stateSaveTimer);if(webBridge){persistSocialSnapshot();webBridge.close();} });
