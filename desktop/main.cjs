const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen } = require('electron');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_SIZE = 200;
const SIZE_PRESETS = { small: 160, medium: 200, large: 280 };
let mainWindow;
let petWindow;
let tray;
let settings = { size: DEFAULT_SIZE, reminders: true, alwaysOnTop: true };
let petSize = DEFAULT_SIZE;
let petSizeChangeInProgress = false;
let latestState = { friends: [], messages: [], profile: null };
let unreadCount = 0;
let trayFlashTimer = null;
let trayFlashOn = false;

function createIcon(active = false) {
  const size = 32, fill = active ? [209, 175, 115, 255] : [83, 114, 91, 255], rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(size * 4 + 1); row[0] = 0;
    for (let x = 0; x < size; x++) {
      const dx = x - 16, dy = y - 16, rounded = Math.max(Math.abs(dx), Math.abs(dy)) < 14 && Math.hypot(Math.max(Math.abs(dx) - 10, 0), Math.max(Math.abs(dy) - 10, 0)) < 4;
      const leaf = Math.abs(dx) < 9 && dy > -8 && dy < 9 && Math.abs(dx) < (dy + 10) * .62;
      const trunk = Math.abs(dx) < 2 && dy >= 6;
      const pixel = row.subarray(1 + x * 4, 1 + x * 4 + 4);
      if (!rounded) pixel.set([0, 0, 0, 0]); else if (trunk) pixel.set([48, 76, 64, 255]); else if (leaf) pixel.set([230, 240, 207, 255]); else pixel.set(fill);
    }
    rows.push(row);
  }
  const raw = Buffer.concat(rows), header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6; header[10] = 0; header[11] = 0; header[12] = 0;
  // Use a tiny valid PNG assembled from scanlines; nativeImage accepts this RGBA buffer on Windows.
  const crc32 = data => { let crc = 0xffffffff; for (const value of data) { crc ^= value; for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; };
  const pngChunk = (type, data) => { const body = Buffer.concat([Buffer.from(type), data]), out = Buffer.alloc(data.length + 12); out.writeUInt32BE(data.length, 0); body.copy(out, 4); out.writeUInt32BE(crc32(body), body.length + 4); return out; };
  const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), pngChunk('IHDR', header), pngChunk('IDAT', zlib.deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0))]);
  const image = nativeImage.createFromBuffer(png);
  if (image.isEmpty()) throw new Error('Unable to decode the desktop tray PNG.');
  const icon = image.resize({ width: 16, height: 16 });
  if (icon.isEmpty()) throw new Error('Unable to resize the desktop tray icon.');
  return icon;
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
  try { require('node:fs').writeFileSync(path.join(app.getPath('userData'), 'pet-settings.json'), JSON.stringify(settings)); } catch (_) {}
}
function loadSettings() {
  try { settings = { ...settings, ...JSON.parse(require('node:fs').readFileSync(path.join(app.getPath('userData'), 'pet-settings.json'), 'utf8')) }; } catch (_) {}
}
function broadcast() {
  if (petWindow && !petWindow.isDestroyed()) petWindow.webContents.send('social-state', { state: latestState, unreadCount, settings });
  if (tray) tray.setToolTip(unreadCount ? `林间来信 · ${unreadCount} 条未读` : '林间来信');
  updateTrayFlash();
}
function focusMain(friendId) {
  if (!mainWindow || mainWindow.isDestroyed()) createMainWindow();
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show(); mainWindow.focus();
  if (friendId) mainWindow.webContents.send('open-friend', friendId);
}
function createMainWindow() {
  mainWindow = new BrowserWindow({ width: 1440, height: 920, minWidth: 900, minHeight: 650, show: false, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false } });
  mainWindow.loadFile(path.join(ROOT, 'index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('close', event => { if (!app.isQuitting) { event.preventDefault(); mainWindow.hide(); } });
}
function createPetWindow() {
  petSize = Math.max(120, Math.min(480, Number(settings.size) || DEFAULT_SIZE));
  const size = petSize;
  const display = screen.getPrimaryDisplay();
  const area = display.workArea;
  petWindow = new BrowserWindow({ width: size, height: size, useContentSize: true, x: area.x + area.width - size - 28, y: area.y + area.height - size - 28, frame: false, transparent: true, resizable: false, movable: true, skipTaskbar: true, alwaysOnTop: settings.alwaysOnTop, hasShadow: false, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false } });
  petWindow.loadFile(path.join(ROOT, 'pet.html'));
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
  petWindow.on('hide', () => tray?.setContextMenu(buildMenu()));
  petWindow.on('show', () => { tray?.setContextMenu(buildMenu()); broadcast(); });
  petWindow.on('closed', () => { petWindow = null; tray?.setContextMenu(buildMenu()); });
  petWindow.once('ready-to-show', () => { petWindow.showInactive(); broadcast(); });
}
function setPetSize(size) {
  petSize = Math.max(120, Math.min(480, Number(size) || DEFAULT_SIZE));
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
    { label: '打开林间来信', click: () => focusMain() },
    { label: petVisible ? '隐藏桌宠' : '显示桌宠', click: () => togglePet() },
    { type: 'separator' },
    { label: '桌宠大小', submenu: Object.entries(SIZE_PRESETS).map(([key, value]) => ({ label: `${key === 'small' ? '小' : key === 'medium' ? '中' : '大'} ${value} × ${value}`, type: 'radio', checked: settings.size === value, click: () => setPetSize(value) })) },
    { label: '收到消息时提醒', type: 'checkbox', checked: settings.reminders, click: item => { settings.reminders = item.checked; persistSettings(); broadcast(); } },
    { label: '始终置顶', type: 'checkbox', checked: settings.alwaysOnTop, click: item => { settings.alwaysOnTop = item.checked; persistSettings(); if (petWindow) petWindow.setAlwaysOnTop(item.checked, 'floating'); broadcast(); } },
    { type: 'separator' },
    { label: '退出', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
}
app.whenReady().then(() => {
  loadSettings();
  tray = new Tray(createIcon());
  tray.setContextMenu(buildMenu());
  tray.on('click', () => focusMain());
  createMainWindow(); createPetWindow();
  ipcMain.on('social-state', (_event, payload) => { latestState = payload.state || latestState; unreadCount = Number(payload.unreadCount) || 0; broadcast(); tray.setContextMenu(buildMenu()); });
  ipcMain.on('pet-open-main', (_event, friendId) => focusMain(friendId));
  ipcMain.on('pet-context-menu', () => { if (petWindow && !petWindow.isDestroyed()) buildMenu().popup({ window: petWindow }); });
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
  ipcMain.on('pet-read-friend', (_event, friendId) => { focusMain(friendId); });
});
app.on('window-all-closed', event => event.preventDefault());
app.on('before-quit', () => { app.isQuitting = true; });
