import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {EventEmitter} from 'node:events';
import {Readable} from 'node:stream';
import {withDesktopMail} from '../src/inbox/desktop-mail.js';
const require=createRequire(import.meta.url);
const {EncryptedMailStore,createMailService,validateCredentials,publicError}=require('../desktop/mail-service.cjs');
const {providerOf}=require('../desktop/mail-providers.cjs');
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'weroam-multi-mail-'));
const safe={isEncryptionAvailable:()=>true,encryptString:s=>Buffer.from(s),decryptString:b=>b.toString()};
const qqStore=new EncryptedMailStore(directory,safe),netStore=new EncryptedMailStore(directory,safe,'netease');
let signal;const options=[],calls=[];
class Client extends EventEmitter {
 constructor(config){super();this.config=config;this.mailbox={readOnly:true,uidValidity:5n};options.push(config);}
 async connect(){}
 async getMailboxLock(folder,scope){assert.equal(scope.readOnly,true);return {release(){}};}
 async search(){return [7];}
 async fetchAll(){return [{uid:7,internalDate:new Date(),flags:new Set(),envelope:{subject:'同一 UID 的测试',from:[{name:'好友',address:'test@example.invalid'}]},bodyStructure:{type:'text/plain',part:'1',parameters:{charset:'utf-8'}}}];}
 async download(){return {content:Readable.from([Buffer.from(this.config.host)])};}
 close(){}
}
const factory=o=>new Client(o),qq=createMailService({store:qqStore,clientFactory:factory}),net=createMailService({store:netStore,provider:'netease',clientFactory:factory});
try{
 assert.throws(()=>providerOf('https://evil.invalid'));assert.throws(()=>providerOf('__proto__'));
 assert.throws(()=>validateCredentials({account:'test@qq.com',code:'syntheticcode1234'},'netease'));
 assert.throws(()=>validateCredentials({account:'test@126.com',code:'syntheticcode1234'},'netease'),'126 is not claimed supported');
 await qq.connect({account:'test@qq.com',code:'syntheticcode1234'});const before=fs.readFileSync(qqStore.file);
 await net.connect({account:'test@163.com',code:'syntheticcode5678'});
 assert.deepEqual(fs.readFileSync(qqStore.file),before,'connecting 163 cannot overwrite existing QQ vault');
 assert.notEqual(qqStore.file,netStore.file);
 assert.equal(options[1].host,'imap.163.com');assert.equal(options[1].port,993);assert.equal(options[1].secure,true);assert.equal(options[1].tls.rejectUnauthorized,true);assert.equal(options[1].clientInfo.name,'WeRoam');
 assert.equal(qq.snapshot().messages[0].id,'mail-qq-real:5:7');assert.equal(net.snapshot().messages[0].id,'mail-netease-real:5:7');
 assert.ok(!JSON.stringify(net.snapshot()).includes('syntheticcode5678'));
 // Provider-bound authenticated encryption rejects a ciphertext copied to the other provider.
 const validNet=fs.readFileSync(netStore.file);fs.writeFileSync(netStore.file,before);assert.throws(()=>netStore.load(),e=>e.code==='VAULT_FAILED');fs.writeFileSync(netStore.file,validNet);
 const restored=createMailService({store:new EncryptedMailStore(directory,safe,'netease'),provider:'netease',clientFactory:factory});assert.equal(restored.snapshot().connections[0].platform,'netease');restored.close();
 function snapshot(){const a=qq.snapshot(),b=net.snapshot();return {...a,connections:[...a.connections,...b.connections],conversations:[...a.conversations,...b.conversations],messages:[...a.messages,...b.messages],local:{...a.local,...b.local},audit:[...a.audit,...b.audit]};}
 const demo={get snapshot(){return {connections:[],conversations:[],messages:[],contacts:[],local:{},audit:[],actions:[]};},list(){return [];},subscribe(){return()=>{};},close(){}};
 const bridge={onMailChanged(fn){signal=fn;return()=>{};},async mailRequest(r){calls.push(r);const service=r.id?.startsWith('mail-netease-real')?net:qq;switch(r.operation){case 'snapshot':return {ok:true,value:snapshot()};case 'sync':return {ok:true,value:await service.sync()};case 'local':service.setLocal(r.id,r.patch);return {ok:true};case 'disconnect':service.disconnect();signal();return {ok:true};case 'connect':case 'open-webmail':return {ok:true};default:return {ok:false};}}};
 const gateway=await withDesktopMail(demo,bridge);assert.equal(gateway.list().length,2);assert.equal(gateway.list({platform:'netease'}).length,1);assert.equal(gateway.list({platform:'qqmail'}).length,1);
 assert.equal(gateway.readThread('mail-netease-real:5:7').connection.label,'test@163.com');
 await gateway.mail.connect('netease');assert.equal(calls.at(-1).provider,'netease');
 await gateway.mail.openWebmail('mail-netease-real');assert.equal(calls.at(-1).id,'mail-netease-real');
 await gateway.sync('mail-netease-real');assert.equal(calls.findLast(r=>r.operation==='sync').id,'mail-netease-real');
 await gateway.setLocal('mail-netease-real:5:7',{read:true});assert.equal(gateway.list({platform:'netease'})[0].unread,0);assert.equal(gateway.list({platform:'qqmail'})[0].unread,1);
 await assert.rejects(gateway.summarize(['mail-netease-real:5:7']));await assert.rejects(gateway.proposeSend('mail-netease-real:5:7',{}));
 await gateway.disconnect('mail-netease-real');assert.equal(gateway.list().length,1);assert.equal(fs.existsSync(netStore.file),false);assert.deepEqual(fs.readFileSync(qqStore.file),before);assert.equal(gateway.list()[0].platform,'qqmail');gateway.close();
 assert.equal(publicError({responseText:'SELECT Unsafe Login'}).code,'PROVIDER_BLOCKED');
 console.log('PASS: QQ vault backward compatibility, 163 fixed TLS endpoint, provider-bound encryption, namespace collision prevention, independent sync/read/revoke, and read-only/Agent boundaries. Synthetic accounts only.');
}finally{qq.close();net.close();fs.rmSync(directory,{recursive:true,force:true});}
