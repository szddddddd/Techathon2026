import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {_electron,outputPath} from './test-runtime.mjs';
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'weroam-agent-desktop-'));
const root=process.cwd(),harness=outputPath('mail-agent-desktop-harness.cjs');
await fs.writeFile(harness,`
const {app,BrowserWindow,ipcMain,safeStorage}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const root=${JSON.stringify(root)};
app.setPath('userData',${JSON.stringify(directory)});
global.agentTest={calls:0,fs};
app.whenReady().then(()=>{
  const {EncryptedMailStore}=require(path.join(root,'desktop/mail-service.cjs'));
  const store=new EncryptedMailStore(app.getPath('userData'),safeStorage);
  const id='mail-qq-real:synthetic:1';
  if(!fs.existsSync(store.file))store.save({version:1,account:'synthetic@qq.com',credential:'synthetic-local-only',messages:[{id,threadId:id,connectionId:'mail-qq-real',subject:'合成会议',sender:{name:'合成同事',address:'synthetic@example.invalid'},createdAt:Date.now(),text:'周五下午三点讨论。',attachments:[],provenance:{kind:'email'}}],local:{},audit:[]});
  const main=new BrowserWindow({show:false,webPreferences:{preload:path.join(root,'desktop/preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  ipcMain.on('avatar-origin',event=>event.returnValue='');
  global.agentTest.main=main;global.agentTest.store=store;
  global.agentTest.integration=require(path.join(root,'desktop/mail-ipc.cjs')).setupMailIPC({app,BrowserWindow,ipcMain,safeStorage,getMainWindow:()=>main,focusMain(){},agentComplete:async messages=>{global.agentTest.calls++;const data=JSON.parse(messages.at(-1).content);if(data.emails.length!==1||data.emails[0].id!==id||JSON.stringify(data).includes('synthetic-local-only'))throw new Error('scope');return JSON.stringify({answer:'周五有讨论。',citations:[{messageId:id,text:'周五下午三点讨论。'}],drafts:[{threadId:id,text:'收到，准时参加。'}]});}});
  main.loadFile(path.join(root,'index.html'));
});
app.on('window-all-closed',()=>{});
`);
let app;
const id='mail-qq-real:synthetic:1';
try {
  app=await _electron.launch({args:[harness],env:{...process.env,ELECTRON_ENABLE_LOGGING:'0'}});
  let page=await app.firstWindow();await page.waitForFunction(()=>window.desktopMain?.agentRequest);
  assert.equal(await page.evaluate(()=>typeof window.require),'undefined');
  const request={operation:'run',runId:'electron-denied',sessionId:'electron-agent',threadIds:[id],task:'reply',prompt:'',consent:true};
  assert.equal((await page.evaluate(r=>desktopMain.agentRequest(r),request)).error.code,'PERMISSION_DENIED');
  assert.equal(await app.evaluate(()=>global.agentTest.calls),0);
  assert.equal((await page.evaluate(id=>desktopMain.mailRequest({operation:'agent-permissions',id,patch:{'ai.process':true,'ai.export.cloud':true}}),id)).ok,true);
  const result=await page.evaluate(r=>desktopMain.agentRequest({...r,runId:'electron-valid'}),request);
  assert.equal(result.ok,true);assert.equal(result.value.drafts[0].recipient,'synthetic@example.invalid');assert.equal(result.value.citations[0].messageId,id);
  assert.equal((await page.evaluate(({id,text})=>desktopMain.mailRequest({operation:'draft',id,text}),{id,text:result.value.drafts[0].text})).ok,true);
  const encrypted=await app.evaluate(()=>{const content=global.agentTest.fs.readFileSync(global.agentTest.store.file,'utf8');return !['收到，准时参加。','synthetic-local-only','synthetic@qq.com'].some(value=>content.includes(value));});
  assert.equal(encrypted,true);
  const denied=await app.evaluate(async({ipcMain,BrowserWindow})=>{
    const foreign=new BrowserWindow({show:false,webPreferences:{contextIsolation:true,nodeIntegration:false}});
    await foreign.loadURL('about:blank');
    const value=await ipcMain._invokeHandlers.get('agent-request')({sender:foreign.webContents,senderFrame:foreign.webContents.mainFrame},{operation:'status'});
    foreign.destroy();return value;
  });assert.equal(denied.error.code,'IPC_DENIED');
  await app.close();app=null;
  app=await _electron.launch({args:[harness],env:{...process.env,ELECTRON_ENABLE_LOGGING:'0'}});
  page=await app.firstWindow();await page.waitForFunction(()=>window.desktopMain?.agentRequest);
  const restored=(await page.evaluate(()=>desktopMain.mailRequest({operation:'snapshot'}))).value;
  assert.equal(restored.connections[0].permissions['ai.export.cloud'],true);assert.equal(restored.local[id].draft.text,'收到，准时参加。');
  assert.equal((await page.evaluate(()=>desktopMain.mailRequest({operation:'send'}))).ok,false);
  assert.equal((await page.evaluate(()=>desktopMain.agentRequest({operation:'clear',sessionId:'electron-agent'}))).ok,true);
  assert.equal((await page.evaluate(()=>desktopMain.mailRequest({operation:'disconnect',id:'mail-qq-real'}))).ok,true);
  const empty=(await page.evaluate(()=>desktopMain.mailRequest({operation:'snapshot'}))).value;assert.equal(empty.connections.length,0);assert.deepEqual(empty.local,{});
  console.log('PASS: genuine Electron preload/IPC, default-deny, scoped model call, real safeStorage encrypted drafts/grants across restart, foreign-window rejection and disconnect cleanup; synthetic data only.');
}finally{await app?.close();await fs.rm(directory,{recursive:true,force:true});}
