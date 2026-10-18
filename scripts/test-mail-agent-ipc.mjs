import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {EventEmitter} from 'node:events';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {createAgentProvider,ENDPOINT,MODEL}=require('../desktop/agent-provider.cjs');
const {EncryptedMailStore}=require('../desktop/mail-service.cjs');
const {setupMailIPC}=require('../desktop/mail-ipc.cjs');
const credential='MOCK-SECRET-ONLY-FOR-TESTS';
let options,endpoint;
const goodBody={choices:[{message:{content:'OK'},finish_reason:'stop'}]};
let fetchImpl=async(url,input)=>{endpoint=url;options=input;return new Response(JSON.stringify(goodBody));};
const provider=createAgentProvider({config:()=>({apiKey:credential}),fetchImpl:(...args)=>fetchImpl(...args)});
assert.equal(provider.status().available,true);
assert.equal(await provider.complete([{role:'user',content:'只回复 OK'}]),'OK');
assert.equal(endpoint,ENDPOINT);assert.equal(new URL(endpoint).protocol,'https:');assert.equal(options.redirect,'error');
assert.equal(options.headers.Authorization,`Bearer ${credential}`);assert.equal(options.rejectUnauthorized,undefined);assert.equal(options.dispatcher,undefined);
assert.deepEqual(JSON.parse(options.body),{model:MODEL,messages:[{role:'user',content:'只回复 OK'}],max_tokens:2000,stream:false});
for(const [status,code] of [[401,'AGENT_AUTH'],[403,'AGENT_AUTH'],[429,'AGENT_RATE_LIMIT'],[500,'AGENT_UNAVAILABLE']]){
  fetchImpl=async()=>new Response(credential,{status});
  await assert.rejects(provider.complete([]),error=>error.code===code&&!error.message.includes(credential));
}
fetchImpl=async()=>{throw new Error(credential);};await assert.rejects(provider.complete([]),error=>error.code==='AGENT_NETWORK'&&!error.message.includes(credential));
for(const body of [{choices:[]},{choices:[{message:{content:'partial'},finish_reason:'length'}]},'broken-json']){
  fetchImpl=async()=>new Response(typeof body==='string'?body:JSON.stringify(body));await assert.rejects(provider.complete([]),error=>error.code==='AGENT_OUTPUT');
}
const absent=createAgentProvider({config(){throw new Error(credential);}});assert.equal(absent.status().available,false);assert.ok(!JSON.stringify(absent.status()).includes(credential));

const directory=fs.mkdtempSync(path.join(os.tmpdir(),'weroam-agent-ipc-'));
const safeStorage={isEncryptionAvailable:()=>true,encryptString:s=>Buffer.from(s),decryptString:b=>b.toString()};
const id='mail-qq-real:1:1', text='仅分析这一封邮件。';
new EncryptedMailStore(directory,safeStorage).save({version:1,account:'123456789@qq.com',credential,messages:[{id,threadId:id,subject:'测试',sender:{name:'同事',address:'friend@example.invalid'},createdAt:Date.now(),text}],local:{},audit:[],cursor:null});
const handlers=new Map(),ipcMain=new EventEmitter();ipcMain.handle=(name,fn)=>handlers.set(name,fn);ipcMain.removeHandler=name=>handlers.delete(name);
const sender=new EventEmitter();sender.send=()=>{};sender.mainFrame={url:pathToFileURL(path.resolve('index.html')).href};
const main={isDestroyed:()=>false,webContents:sender};const trusted={sender,senderFrame:sender.mainFrame};
let calls=0,hold=false,release;
const complete=async(messages)=>{calls++;assert.ok(messages.at(-1).content.includes(text));assert.ok(!messages.at(-1).content.includes('RENDERER-INJECTED-BODY'));if(hold)await new Promise(r=>release=r);return JSON.stringify({answer:'已整理。',citations:[{messageId:id,text}],drafts:[]});};
const service=setupMailIPC({app:{getPath:()=>directory},BrowserWindow:class{},ipcMain,safeStorage,getMainWindow:()=>main,focusMain(){},agentComplete:complete});
const invoke=(request,event=trusted)=>handlers.get('agent-request')(event,request);
try {
  assert.equal((await invoke({operation:'status'})).value.available,true);
  for(const event of [{sender:{},senderFrame:sender.mainFrame},{sender,senderFrame:{url:sender.mainFrame.url}},{sender,senderFrame:{url:'https://attacker.invalid/'}}])assert.equal((await invoke({operation:'run'},event)).error.code,'IPC_DENIED');
  assert.equal(calls,0);
  const run={operation:'run',runId:'ipc-run',sessionId:'ipc-session',threadIds:[id],task:'summary',consent:true,messages:[{text:'RENDERER-INJECTED-BODY'}]};
  assert.equal((await invoke(run)).error.code,'PERMISSION_DENIED');assert.equal(calls,0);
  const grant=await handlers.get('mail-request')(trusted,{operation:'agent-permissions',id,patch:{'ai.process':true,'ai.export.cloud':true}});assert.equal(grant.ok,true);
  assert.equal((await invoke(run)).ok,true);assert.equal(calls,1);
  assert.equal((await invoke({operation:'fetch',url:'https://attacker.invalid/'})).error.code,'UNSUPPORTED');
  assert.equal((await invoke({operation:'run',...run,runId:'ipc-bad',task:'send'})).error.code,'INVALID_INPUT');assert.equal(calls,1);
  hold=true;const navigating=invoke({...run,runId:'ipc-navigation'});await new Promise(r=>setImmediate(r));sender.emit('did-start-navigation',{},'file:///replacement.html',false,true);
  assert.equal((await navigating).error.code,'CANCELLED');release();
  const destroyed=invoke({...run,runId:'ipc-destroyed'});await new Promise(r=>setImmediate(r));sender.emit('destroyed');assert.equal((await destroyed).error.code,'CANCELLED');release();
  service.close();assert.equal(handlers.has('agent-request'),false,'IPC handler removed on shutdown');
  console.log('PASS: fixed HTTPS provider, sanitized auth/rate/network/output failures, narrow trusted IPC, renderer body exclusion, grant denial, and navigation/destruction cancellation.');
} finally {service.close();fs.rmSync(directory,{recursive:true,force:true});}
