import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {_electron,outputPath} from './test-runtime.mjs';
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'weroam-mail-electron-')),root=process.cwd(),harness=outputPath('mail-electron-harness.cjs');
await fs.writeFile(harness,`
const {app,BrowserWindow,ipcMain,safeStorage}=require('electron');
const path=require('node:path');
app.setPath('userData',${JSON.stringify(directory)});
global.mailTestCreated=[];
class HiddenWindow extends BrowserWindow {constructor(options){super(options);global.mailTestCreated.push(this);}show(){} focus(){}}
app.whenReady().then(()=>{
  const main=new HiddenWindow({show:false,webPreferences:{preload:path.join(${JSON.stringify(root)},'desktop/preload.cjs'),contextIsolation:true,nodeIntegration:false}});
  global.mailTestMain=main;
  global.mailTestRequire=require;
  ipcMain.on('avatar-origin',event=>event.returnValue='');
  global.mailTest=require(path.join(${JSON.stringify(root)},'desktop/mail-ipc.cjs')).setupMailIPC({app,BrowserWindow:HiddenWindow,ipcMain,safeStorage,getMainWindow:()=>main,focusMain(){}});
  main.loadFile(path.join(${JSON.stringify(root)},'index.html'));
});
app.on('window-all-closed',()=>{});
`);
let app;
try{
 app=await _electron.launch({args:[harness],env:{...process.env,ELECTRON_ENABLE_LOGGING:'0'}});
 const page=await app.firstWindow();await page.waitForFunction(()=>window.desktopMain?.mailRequest);
 const result=await page.evaluate(()=>desktopMain.mailRequest({operation:'snapshot'}));assert.equal(result.ok,true);assert.equal(result.value.connections.length,0);
 assert.equal(await page.evaluate(()=>typeof desktopMain.authorize),'undefined');
 await page.evaluate(()=>history.replaceState(null,'','?scene=fuji'));
 assert.equal((await page.evaluate(()=>desktopMain.mailRequest({operation:'snapshot'}))).ok,true,'scene query changes must preserve trusted IPC');
 assert.equal((await page.evaluate(()=>desktopMain.mailRequest({operation:'send',text:'must not send'}))).ok,false);
 const vault=await app.evaluate(({safeStorage},root)=>{
  const fs=global.mailTestRequire('node:fs'),path=global.mailTestRequire('node:path');
  const {EncryptedMailStore}=global.mailTestRequire(path.join(root,'desktop/mail-service.cjs'));
  const store=new EncryptedMailStore(path.join(global.mailTestRequire('electron').app.getPath('userData'),'vault-test'),safeStorage);
  if(!safeStorage.isEncryptionAvailable())return {available:false};
  store.save({version:1,account:'synthetic@qq.com',credential:'synthetic-secret',messages:[],local:{},audit:[]});
  const encoded=fs.readFileSync(store.file,'utf8'),decoded=store.load();store.remove();
  return {available:true,encrypted:!encoded.includes('synthetic-secret')&&!encoded.includes('synthetic@qq.com'),roundTrip:decoded.credential==='synthetic-secret'};
 },root);
 assert.equal(vault.available,true);assert.equal(vault.encrypted,true);assert.equal(vault.roundTrip,true);
 const opened=app.waitForEvent('window');await page.evaluate(()=>desktopMain.mailRequest({operation:'connect',provider:'netease'}));const auth=await opened;
 await auth.waitForFunction(()=>window.mailAuthorization?.connect);
 assert.equal(await auth.evaluate(()=>typeof desktopMain),'undefined');
 assert.equal(await auth.locator('input[type=password]').count(),1);
 assert.equal(await auth.locator('[name=provider]').inputValue(),'netease');assert.match(await auth.locator('h1').innerText(),/163/);
 assert.equal(await auth.locator('[name=account]').getAttribute('placeholder'),'yourname@163.com');
 assert.match(await auth.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content'),/connect-src 'none'/);
 const invalid=await auth.evaluate(()=>mailAuthorization.connect({account:'x@gmail.com',code:'synthetic-secret'}));assert.equal(invalid.ok,false);assert.equal(invalid.error.code,'INVALID_INPUT');
 const denied=await app.evaluate(async({ipcMain})=>ipcMain._invokeHandlers.get('mail-authorize')({sender:global.mailTestMain.webContents,senderFrame:global.mailTestMain.webContents.mainFrame},{account:'synthetic@qq.com',code:'syntheticsecret'}));assert.equal(denied.ok,false,'main scene cannot submit credentials');
 await app.evaluate(async({BrowserWindow},file)=>{const window=global.mailTestCreated.find(w=>w!==global.mailTestMain);const capture=await window.webContents.capturePage(undefined,{stayHidden:true,stayAwake:true});global.mailTestRequire('node:fs').writeFileSync(file,capture.toPNG());},outputPath('mail-authorize-desktop.png'));
 console.log('PASS: Electron system encryption, fixed native authorization window/CSP, scene query handling, main-scene credential rejection, and unsupported send rejection. No real account used.');
}finally{await app?.close();await fs.rm(directory,{recursive:true,force:true});}
