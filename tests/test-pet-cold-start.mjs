import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { _electron, outputDir, outputPath } from './test-runtime.mjs';
const profile=await fs.mkdtemp(path.join(outputDir,'cold-pet-'));
await fs.writeFile(path.join(profile,'pet-social-snapshot.json'),JSON.stringify({state:{friends:['tuantuan'],messages:[{id:'cold',friendId:'tuantuan',senderId:'tuantuan',text:'cold start',type:'text',read:false,createdAt:1}]},unreadCount:1}));
const env={...process.env,FOREST_PET_USER_DATA:profile,FOREST_PET_PORT:'47833'};delete env.ELECTRON_RUN_AS_NODE;
const desktop=await _electron.launch({executablePath:path.resolve('node_modules/electron/dist/electron.exe'),args:['.','--pet-only'],env});
try {
 const pet=await desktop.firstWindow();await pet.waitForSelector('[data-friend=tuantuan]');
 const opened=desktop.waitForEvent('window');await pet.locator('[data-friend=tuantuan]').click();const main=await opened;
 await main.waitForFunction(()=>window.__socialStore,null,{timeout:180000});
 // Native main has its own IndexedDB; seed the saved friend's membership before requesting again.
 await main.evaluate(()=>__socialStore.addFriend('tuantuan'));
 await desktop.evaluate(({BrowserWindow,ipcMain})=>{const main=BrowserWindow.getAllWindows().find(w=>w.webContents.getURL().startsWith('file:')),pet=BrowserWindow.getAllWindows().find(w=>w.webContents.getURL().includes('/pet.html'));main.webContents.reload();ipcMain.emit('pet-open-main',{sender:pet.webContents},'tuantuan');});
 await main.waitForFunction(()=>window.__socialUI?.activeFriend==='tuantuan',null,{timeout:180000});
 await desktop.evaluate(({ipcMain,BrowserWindow})=>{const pet=BrowserWindow.getAllWindows().find(w=>w.webContents.getURL().includes('/pet.html'));ipcMain.emit('social-state',{sender:pet.webContents},{state:{friends:[],messages:[]},unreadCount:0});});
 await desktop.close();
 const saved=JSON.parse(await fs.readFile(path.join(profile,'pet-social-snapshot.json'),'utf8'));assert.deepEqual(saved.state.friends,['tuantuan']);
 await fs.writeFile(outputPath('pet-cold-start.json'),JSON.stringify({checks:['queued conversation survives renderer reload before ready','pet cannot publish main social state'],errors:[]},null,2));
 console.log('PASS: cold renderer conversation handshake and sender isolation');
}finally{await desktop.close().catch(()=>{});}
