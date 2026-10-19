import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {EventEmitter} from 'node:events';
import {Readable} from 'node:stream';
import {createRequire} from 'node:module';
import {withDesktopMail} from '../src/inbox/desktop-mail.js';
const require=createRequire(import.meta.url);
const {EncryptedMailStore,createMailService,validateCredentials,ID}=require('../desktop/mail-service.cjs');
const {trustedFrame}=require('../desktop/mail-ipc.cjs');
const now=Date.now(),secret='testauthorizationcode',account='123456789@qq.com';
const safeStorage={isEncryptionAvailable:()=>true,encryptString:s=>Buffer.from(s),decryptString:b=>b.toString()};
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'weroam-mail-'));
const store=new EncryptedMailStore(directory,safeStorage);
let options,downloads=0,fail=false,readonly=true,validity='21',uids=[1,2],deferred=null,connectError=null;
const part={part:'1',type:'text/html',parameters:{charset:'utf-8'}};
class Client extends EventEmitter {
  constructor(config){super();options=config;this.mailbox={readOnly:readonly,uidValidity:BigInt(validity)};}
  async connect(){if(connectError)throw connectError;if(deferred)await deferred;}
  async getMailboxLock(name,config){assert.equal(name,'INBOX');assert.equal(config.readOnly,true);return {release(){}};}
  async search(query,config){assert.equal(config.uid,true);assert.ok(query.since instanceof Date);return uids;}
  async fetchAll(range,query,config){assert.equal(config.uid,true);assert.ok(!query.source,'must not download attachments/source');return range.split(',').map(Number).map(uid=>({uid,internalDate:new Date(now-uid*1000),envelope:{subject:`邮件 ${uid}`,from:[{name:'测试发件人',address:'friend@example.invalid'}]},flags:new Set(uid===1?['\\Seen']:[]),bodyStructure:{type:'multipart/mixed',childNodes:[{type:'message/rfc822',disposition:'attachment',dispositionParameters:{filename:'forward.eml'},childNodes:[{type:'text/plain',part:'2.1'}]},part,{type:'application/pdf',part:'3',disposition:'attachment',dispositionParameters:{filename:'资料.pdf'},size:123}]}}));}
  async download(uid,number,config){downloads++;assert.equal(number,'1');assert.equal(config.uid,true);assert.equal(config.maxBytes,262144);if(fail)throw new Error(secret);return {content:Readable.from([Buffer.from('<html><style>SECRETSTYLE</style><body>你好 <b>WeRoam</b><img src="https://tracker.invalid/1"><script>BAD_SCRIPT</script></body></html>')])};}
  close(){}
}
const service=createMailService({store,clientFactory:config=>new Client(config),now:()=>now});
try {
  assert.throws(()=>validateCredentials({account:'other@gmail.com',code:secret}));
  assert.throws(()=>validateCredentials({account,code:'password'}));
  await service.connect({account,code:secret});
  assert.equal(options.host,'imap.qq.com');assert.equal(options.port,993);assert.equal(options.secure,true);assert.equal(options.tls.rejectUnauthorized,true);assert.equal(options.logger,false);assert.equal(options.logRaw,false);
  let snapshot=service.snapshot();assert.equal(snapshot.messages.length,2);assert.ok(snapshot.messages[0].text.includes('你好 WeRoam'));assert.ok(!snapshot.messages[0].text.includes('BAD_SCRIPT'));assert.ok(!snapshot.messages[0].text.includes('tracker.invalid'));assert.equal(snapshot.messages[0].attachments.length,2);
  assert.ok(!JSON.stringify(snapshot).includes(secret));assert.equal(snapshot.connections[0].permissions['messages.send'],undefined);assert.equal(snapshot.connections[0].permissions['ai.process'],false);assert.equal(snapshot.connections[0].permissions['ai.export.cloud'],false);
  const ciphertext=fs.readFileSync(store.file,'utf8');assert.ok(!ciphertext.includes(secret));assert.ok(!ciphertext.includes(account));assert.ok(!ciphertext.includes('你好'));assert.equal(store.load().credential,secret);
  assert.equal(snapshot.local[snapshot.messages[0].id].read,true);assert.equal(snapshot.local[snapshot.messages[1].id].read,false);
  await service.sync();assert.equal(downloads,2,'unchanged UID bodies are reused');assert.equal(service.snapshot().messages.length,2);
  service.setLocal(snapshot.messages[1].id,{read:true,pinned:true});await service.sync();assert.equal(service.snapshot().local[snapshot.messages[1].id].read,true);
  assert.throws(()=>service.setLocal(snapshot.messages[0].id,{send:true}));
  const before=fs.readFileSync(store.file,'utf8');uids=[1,2,3];fail=true;
  await assert.rejects(service.sync(),e=>!e.message.includes(secret));assert.equal(fs.readFileSync(store.file,'utf8'),before,'failed batch must not commit content or cursor');assert.equal(service.snapshot().messages.length,2);
  fail=false;validity='22';await service.sync();snapshot=service.snapshot();assert.equal(snapshot.messages.length,3);assert.ok(snapshot.messages.every(m=>m.id.includes(':22:')));assert.ok(Object.keys(snapshot.local).every(id=>id.includes(':22:')));
  uids=Array.from({length:210},(_,i)=>i+1);await service.sync();assert.equal(service.snapshot().messages.length,200);
  connectError=Object.assign(new Error(secret),{authenticationFailed:true});await assert.rejects(service.sync(),e=>e.code==='AUTH_FAILED'&&!e.message.includes(secret));assert.equal(service.snapshot().connections[0].status,'needs-auth');connectError=null;
  let resume;deferred=new Promise(r=>resume=r);const pending=service.sync();service.disconnect();resume();await assert.rejects(pending,e=>e.code==='CANCELLED');deferred=null;assert.equal(service.snapshot().messages.length,0);assert.equal(fs.existsSync(store.file),false);
  readonly=false;await assert.rejects(service.connect({account,code:secret}),e=>e.code==='UNSUPPORTED');assert.equal(fs.existsSync(store.file),false);readonly=true;
  const blocked=new EncryptedMailStore(directory,{isEncryptionAvailable:()=>false});assert.throws(()=>blocked.save({}),e=>e.code==='VAULT_UNAVAILABLE');
  await service.connect({account,code:secret});const damaged=JSON.parse(fs.readFileSync(store.file,'utf8'));damaged.tag=Buffer.alloc(16).toString('base64');fs.writeFileSync(store.file,JSON.stringify(damaged));assert.throws(()=>store.load(),e=>e.code==='VAULT_FAILED');service.disconnect();

  const sender={},frame={url:new URL('../index.html',import.meta.url).href},window={isDestroyed:()=>false,webContents:sender};sender.mainFrame=frame;
  assert.equal(trustedFrame({sender,senderFrame:frame},window,path.resolve('index.html')),true);
  assert.equal(trustedFrame({sender,senderFrame:{url:frame.url}},window,path.resolve('index.html')),false,'child frame cannot impersonate main');
  assert.equal(trustedFrame({sender:{},senderFrame:frame},window,path.resolve('index.html')),false);

  await service.connect({account,code:secret});
  let listener,closed=false,wasRealStored=false;
  const demo={get snapshot(){return {connections:[],conversations:[],messages:[],contacts:[],local:{},actions:[],audit:[]};},list:()=>[],subscribe:()=>()=>{},close(){closed=true;},saveDraft(){wasRealStored=true;}};
  const bridge={async mailRequest({operation,id,patch,text,recipient}){if(operation==='snapshot')return {ok:true,value:service.snapshot()};if(operation==='local'){service.setLocal(id,patch);return {ok:true};}if(operation==='draft')return {ok:true,value:service.saveDraft(id,text,recipient)};if(operation==='disconnect'){service.disconnect();return {ok:true};}return {ok:false,error:{message:'unsupported'}};},onMailChanged(fn){listener=fn;return()=>{listener=null;};}};
  const gateway=await withDesktopMail(demo,bridge),id=gateway.list()[0].id;
  assert.equal(gateway.list().length,200);assert.equal(gateway.list({query:'WeRoam'}).length,200);assert.equal(gateway.list({platform:'qq'}).length,0);assert.equal(gateway.readThread(id).connection.real,true);
  await assert.rejects(gateway.proposeSend(id,{}));await gateway.saveDraft(id,'private');assert.equal(gateway.readThread(id).draft.text,'private');assert.equal(store.load().local[id].draft.text,'private');assert.equal(fs.readFileSync(store.file,'utf8').includes('private'),false,'real drafts are encrypted');await assert.rejects(gateway.summarize([id]));assert.equal(wasRealStored,false,'real email must never enter demo persistence');
  await gateway.setLocal(id,{read:true});assert.equal(gateway.list().find(m=>m.id===id).unread,0);
  await gateway.disconnect(ID);assert.equal(gateway.snapshot.messages.length,0);assert.throws(()=>gateway.readThread(id));gateway.close();assert.equal(closed,true);assert.equal(listener,null);
  console.log('PASS: read-only bounded IMAP, MIME/attachment isolation, UID dedup/reset, atomic encrypted cache, safe errors, cancellation/revoke, IPC frame checks, and demo/real/Agent isolation.');
} finally {service.close();fs.rmSync(directory,{recursive:true,force:true});}
