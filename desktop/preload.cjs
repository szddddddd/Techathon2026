const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopPet', {
  onState(callback) { ipcRenderer.on('social-state', (_event, payload) => callback(payload)); },
  openMain(friendId) { ipcRenderer.send('pet-open-main', friendId || null); },
  readFriend(friendId) { ipcRenderer.send('pet-read-friend', friendId); },
  showMenu() { ipcRenderer.send('pet-context-menu'); },
  dragStart(x, y) { ipcRenderer.send('pet-drag-start', { x, y }); },
  drag(x, y) { ipcRenderer.send('pet-drag', { x, y }); },
  dragEnd() { ipcRenderer.send('pet-drag-end'); }
});
contextBridge.exposeInMainWorld('desktopMain', {
  publishState(payload) { ipcRenderer.send('social-state', payload); },
  onOpenFriend(callback) { ipcRenderer.on('open-friend', (_event, id) => callback(id)); }
});
