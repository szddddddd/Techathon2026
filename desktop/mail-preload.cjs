const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('mailAuthorization',{
  connect: input=>ipcRenderer.invoke('mail-authorize',input),
  close: ()=>ipcRenderer.invoke('mail-authorized-close'),
});
