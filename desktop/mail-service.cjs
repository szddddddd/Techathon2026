// Trusted desktop-only connector. Never imported into the web/scene bundles.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {ImapFlow} = require('imapflow');
const iconv = require('iconv-lite');
const {convert} = require('html-to-text');
const {providerOf} = require('./mail-providers.cjs');

const ID = 'mail-qq-real', WEEK = 7 * 86400000, MAX_MESSAGES = 200, MAX_BODY = 262144;
const scopes = ['messages.read.metadata', 'messages.read.body', 'messages.search.local'];
const agentScopes = ['ai.process', 'ai.export.cloud'];
const empty = () => ({version: 1, account: null, credential: null, messages: [], local: {}, cursor: null, audit: [], agentPermissions: {'ai.process':false,'ai.export.cloud':false}, agentGrantVersion:0});
const failure = (code, message) => Object.assign(new Error(message), {code});
function publicError(error) {
  if(error?.code==='PROVIDER_BLOCKED'||/unsafe login/i.test(error?.responseText||''))return failure('PROVIDER_BLOCKED','邮箱拒绝了当前客户端登录。请在邮箱官方设置中检查客户端协议和安全验证；WeRoam 不会绕过平台限制。');
  if (['INVALID_INPUT','VAULT_UNAVAILABLE','VAULT_FAILED','CANCELLED','NOT_CONNECTED','BUSY','UNSUPPORTED','PERMISSION_DENIED'].includes(error?.code)) return error;
  if (error?.authenticationFailed || ['AUTH_FAILED','AUTHENTICATIONFAILED','AUTHENTICATION_FAILED','EAUTH'].includes(error?.code) || error?.responseStatus === 'NO' && /auth|login|password/i.test(error?.responseText || ''))
    return failure('AUTH_FAILED', '登录未通过。请检查邮箱地址、IMAP 开关和客户端授权码；不要使用邮箱登录密码。');
  return failure('MAIL_UNAVAILABLE', '邮箱暂时无法同步，请检查网络及 IMAP 设置后重试。原有收件内容已保留。');
}
function validateCredentials(input, provider='qqmail') {
  const config=providerOf(provider);
  if (!input || typeof input.account !== 'string' || typeof input.code !== 'string') throw failure('INVALID_INPUT', '请输入邮箱和客户端授权码。');
  const account = input.account.trim().toLowerCase(), code = input.code.replace(/\s/g, '');
  if (!/^[a-z0-9._+-]{1,64}$/.test(account.split('@')[0]) || account.split('@').length!==2 || account.split('@')[1]!==config.domain || !/^[a-zA-Z0-9]{12,128}$/.test(code)) throw failure('INVALID_INPUT', `请输入完整的 @${config.domain} 地址和客户端授权码。`);
  return {account, code};
}

class EncryptedMailStore {
  constructor(directory, safeStorage, provider='qqmail') { this.file = path.join(directory, providerOf(provider).file); this.safeStorage = safeStorage; this.aad=provider==='qqmail'?'weroam-mail-v1':`weroam-mail-v1:${provider}`; }
  available() { return !!this.safeStorage?.isEncryptionAvailable(); }
  load() {
    if (!this.available()) throw failure('VAULT_UNAVAILABLE', '系统加密不可用，不能保存真实邮箱。');
    if (!fs.existsSync(this.file)) return empty();
    let key;
    try {
      const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      if (raw.version !== 1) throw new Error('version');
      key = Buffer.from(this.safeStorage.decryptString(Buffer.from(raw.key, 'base64')), 'base64');
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(raw.iv, 'base64'));
      decipher.setAAD(Buffer.from(this.aad));
      decipher.setAuthTag(Buffer.from(raw.tag, 'base64'));
      const data = JSON.parse(Buffer.concat([decipher.update(Buffer.from(raw.data, 'base64')), decipher.final()]).toString('utf8'));
      if (data.version !== 1 || !Array.isArray(data.messages) || !data.local || !Array.isArray(data.audit)) throw new Error('schema');
      return data;
    } catch { throw failure('VAULT_FAILED', '邮箱缓存无法解密，请检查当前系统用户；未覆盖已有文件。'); }
    finally { key?.fill(0); }
  }
  save(data) {
    if (!this.available()) throw failure('VAULT_UNAVAILABLE', '系统加密不可用，未保存邮箱。');
    const key = crypto.randomBytes(32), iv = crypto.randomBytes(12);
    try {
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      cipher.setAAD(Buffer.from(this.aad));
      const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
      const wrapped = this.safeStorage.encryptString(key.toString('base64'));
      const value = {version:1,key:wrapped.toString('base64'),iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),data:encrypted.toString('base64')};
      fs.mkdirSync(path.dirname(this.file), {recursive:true});
      fs.writeFileSync(this.file + '.tmp', JSON.stringify(value), {mode:0o600});
      fs.renameSync(this.file + '.tmp', this.file);
    } catch { throw failure('VAULT_FAILED', '邮箱加密保存失败，本次操作未提交。'); }
    finally { key.fill(0); }
  }
  remove() { try { fs.rmSync(this.file, {force:true}); fs.rmSync(this.file + '.tmp', {force:true}); } catch { throw failure('VAULT_FAILED', '本地邮箱文件未能删除，请重试。'); } }
}

function flattenParts(node, result = []) {
  if (!node) return result;
  result.push(node);
  for (const child of node.childNodes || []) flattenParts(child, result);
  return result;
}
function textPart(structure) {
  const parts=[];
  function visit(p) {
    if(!p || p.disposition==='attachment' || p.dispositionParameters?.filename || p.parameters?.name || p.type==='message/rfc822')return;
    parts.push(p);for(const child of p.childNodes||[])visit(child);
  }
  visit(structure);
  return parts.find(p => p.type === 'text/plain') || parts.find(p => p.type === 'text/html');
}
function plainText(data, part) {
  let text = iconv.decode(data, iconv.encodingExists(part.parameters?.charset || 'utf-8') ? part.parameters?.charset || 'utf-8' : 'utf-8');
  if (part.type === 'text/html') text = convert(text, {wordwrap:false, selectors:[{selector:'img',format:'skip'},{selector:'a',options:{ignoreHref:true}},{selector:'style',format:'skip'},{selector:'script',format:'skip'}]});
  return text.replace(/\u0000/g, '').slice(0, 60000);
}

function createMailService({store, provider='qqmail', clientFactory = options => new ImapFlow(options), now = Date.now, onChange = () => {}}) {
  const config=providerOf(provider), ID=config.id;
  let state = null, initError = null, revision = 0, epoch = 0, active = null, busy = false, closed = false, status = 'connected', lastError = null;
  try { state = store.load(); if(state.account && state.account.split('@')[1]!==config.domain)throw failure('VAULT_FAILED','邮箱缓存与此连接类型不符，未覆盖已有文件。'); state.agentPermissions=Object.fromEntries(agentScopes.map(key=>[key,state.agentPermissions?.[key]===true]));state.agentGrantVersion=Number.isSafeInteger(state.agentGrantVersion)&&state.agentGrantVersion>=0?state.agentGrantVersion:0; } catch (e) { initError = publicError(e); state = empty(); }
  const record = (s, type, detail = {}) => { s.audit.push({type,connectionId:ID,at:now(),actor:'user',...detail}); s.audit = s.audit.slice(-100); };
  function snapshot() {
    const messages = state.messages.filter(m => m.createdAt >= now() - WEEK);
    const permissions={...Object.fromEntries(scopes.map(s=>[s,true])),'drafts.write.local':true,...state.agentPermissions};
    const capabilities={...Object.fromEntries([...scopes,'drafts.write.local',...agentScopes].map(s=>[s,{supported:true,method:agentScopes.includes(s)?'cloud-agent':'local'}])),'messages.send':{supported:false,reason:'请在原邮箱发送'},send:'unsupported'};
    const connections = state.account ? [{id:ID,platform:provider,label:state.account,accountLabel:state.account,status:busy?'syncing':status,revision,lastSyncAt:state.lastSyncAt,real:true,authMethod:'IMAP authorization code',permissions,sync:{error:lastError},limits:{days:7,maxMessages:MAX_MESSAGES},capabilities}] : [];
    return {version:1,connections,contacts:[],conversations:messages.map(m=>({id:m.threadId,connectionId:ID,title:m.subject,recipient:m.sender.address,updatedAt:m.createdAt,provenance:'email',provenanceLabel:'真实邮箱 · 只读'})),messages:structuredClone(messages),local:structuredClone(state.local),audit:structuredClone(state.audit),actions:[],error:initError?{code:initError.code,message:initError.message}:null};
  }
  function publish() { revision++; onChange(snapshot()); }
  function commit(next, invalidate = false) { store.save(next);if(invalidate)epoch++;state = next;publish(); }
  function ensure() { if (closed) throw failure('CANCELLED','连接已关闭。'); if (initError) throw initError; }
  async function receive(credentials) {
    ensure();
    if (busy) throw failure('BUSY', '正在同步，请稍候。');
    const fence = epoch; busy = true; lastError = null; publish();
    const client = clientFactory({host:config.host,port:993,secure:true,tls:{rejectUnauthorized:true,minVersion:'TLSv1.2'},auth:{user:credentials.account,pass:credentials.code},logger:false,logRaw:false,emitLogs:false,disableAutoIdle:true,disableCompression:true,connectionTimeout:15000,greetingTimeout:15000,socketTimeout:20000,maxLineLength:1048576,maxLiteralSize:1048576,maxResponseSize:2097152,clientInfo:{name:'WeRoam',version:'0.1.0-beta',vendor:'WeRoam','support-url':'https://github.com/szddddddd/Techathon2026'}});
    active = client; client.on('error', () => {});
    const timer = setTimeout(() => client.close(), 90000);
    const check = () => { if (closed || fence !== epoch) throw failure('CANCELLED', '连接已取消。'); };
    let lock;
    try {
      await client.connect(); check();
      lock = await client.getMailboxLock('INBOX', {readOnly:true}); check();
      if (!client.mailbox?.readOnly) throw failure('UNSUPPORTED','服务器未确认只读模式，已停止收取。');
      const validity = String(client.mailbox.uidValidity);
      const since = new Date(now() - WEEK);
      const ids = (await client.search({since}, {uid:true}) || []).sort((a,b)=>a-b).slice(-MAX_MESSAGES); check();
      const metadata = ids.length ? await client.fetchAll(ids.join(','), {uid:true,envelope:true,internalDate:true,flags:true,bodyStructure:true}, {uid:true}) : [];
      const sameAccount = state.account === credentials.account;
      const next = structuredClone(sameAccount ? state : empty()), same = sameAccount && next.cursor?.uidValidity === validity;
      const cached = new Map(same ? next.messages.map(m=>[m.uid,m]) : []);
      const messages = [];
      for (const item of metadata) {
        check();
        const date = +new Date(item.internalDate || item.envelope?.date || now());
        if (date < +since) continue;
        const id = `${ID}:${validity}:${item.uid}`, old = cached.get(item.uid), part = textPart(item.bodyStructure);
        let text = old?.text;
        if (text === undefined) {
          text = '（没有可读取的文本正文）';
          if (part) {
            const {content} = await client.download(item.uid, part.part || '1', {uid:true,maxBytes:MAX_BODY});
            const chunks = []; let size = 0;
            for await (const chunk of content) { check(); size += chunk.length; if (size > MAX_BODY) throw failure('UNSUPPORTED','邮件正文超过读取上限。'); chunks.push(chunk); }
            text = plainText(Buffer.concat(chunks), part) || '（空正文）';
            if (size >= MAX_BODY || text.length >= 60000) text += `\n（正文已截取，请在${config.name}查看完整内容）`;
          }
        }
        const from = item.envelope?.from?.[0] || {};
        messages.push({id,uid:item.uid,connectionId:ID,threadId:id,platformMessageId:`INBOX:${validity}:${item.uid}`,direction:'incoming',subject:String(item.envelope?.subject || '无主题').slice(0,500),sender:{name:String(from.name || from.address || '未知发件人').slice(0,320),address:String(from.address || '').slice(0,320)},createdAt:date,text,attachments:flattenParts(item.bodyStructure).filter(p=>p.disposition==='attachment'||p.dispositionParameters?.filename||p.parameters?.name).slice(0,30).map(p=>({name:String(p.dispositionParameters?.filename||p.parameters?.name||'附件').slice(0,300),size:p.size||0})),provenance:{kind:'email',label:'真实邮箱 · 只读',synthetic:false,acquiredAt:now()}});
        if (!same || !next.local[id]) next.local[id] = {read:!!item.flags?.has('\\Seen')};
      }
      check();
      const retained = new Set(messages.map(m=>m.id));
      next.local = Object.fromEntries(Object.entries(next.local).filter(([id])=>retained.has(id)));
      // A user may mark/read/pin while a body is downloading. Preserve those
      // newer local edits when the synchronized batch commits.
      if(sameAccount){
        for(const id of retained)if(state.local[id])next.local[id]=structuredClone(state.local[id]);
        // Permission changes and audit entries made during network awaits must
        // survive the sync commit, just like drafts/read/pin edits above.
        next.agentPermissions=structuredClone(state.agentPermissions);
        next.agentGrantVersion=state.agentGrantVersion;
        next.audit=structuredClone(state.audit);
      }
      next.account = credentials.account; next.credential = credentials.code; next.messages = messages;
      next.cursor = {mailbox:'INBOX',uidValidity:validity,lastUID:ids.at(-1)||0}; next.lastSyncAt = now();
      record(next, 'mail.synced', {count:messages.length}); status = 'connected';commit(next,!sameAccount);
      return {count:messages.length};
    } catch (e) {
      const error = fence !== epoch || closed ? failure('CANCELLED','连接已取消。') : publicError(e);
      if (fence === epoch && !closed) { lastError = {code:error.code,message:error.message}; if (error.code==='AUTH_FAILED') status = 'needs-auth'; }
      throw error;
    } finally {
      clearTimeout(timer); lock?.release(); client.close(); if (active === client) active = null; busy = false;
      if (!closed) publish();
    }
  }
  return {
    snapshot,
    connect(input) { return receive(validateCredentials(input,provider)); },
    sync() { ensure(); if (!state.account) throw failure('NOT_CONNECTED',`请先连接${config.name}。`); return receive({account:state.account,code:state.credential}); },
    setLocal(id, patch) {
      ensure(); if (!state.messages.some(m=>m.id===id)) throw failure('NOT_CONNECTED','邮件已不在当前同步范围。');
      if (!patch || !Object.keys(patch).length || Object.keys(patch).some(k=>!['read','pinned','todo'].includes(k)||typeof patch[k]!=='boolean')) throw failure('INVALID_INPUT','本地状态无效。');
      const next = structuredClone(state); next.local[id] = {...next.local[id],...patch}; commit(next);
    },
    setAgentPermissions(patch) {
      ensure();if(!state.account||status!=='connected')throw failure('NOT_CONNECTED','请先连接邮箱。');
      if(!patch||typeof patch!=='object'||Array.isArray(patch)||!Object.keys(patch).length||Object.keys(patch).some(key=>!agentScopes.includes(key)||typeof patch[key]!=='boolean'))throw failure('INVALID_INPUT','Agent 权限设置无效。');
      const next=structuredClone(state);
      if(Object.entries(patch).some(([key,value])=>next.agentPermissions[key]!==value)){
        Object.assign(next.agentPermissions,patch);next.agentGrantVersion++;
        record(next,'agent.permissions.changed');commit(next);
      }
      return structuredClone(next.agentPermissions);
    },
    saveDraft(id, text, recipient) {
      ensure();const message=state.messages.find(m=>m.threadId===id&&m.createdAt>=now()-WEEK);
      if(!state.account||!message)throw failure('NOT_CONNECTED','邮件已不在当前同步范围。');
      if(typeof text!=='string'||text.length>10000||recipient!==undefined&&(typeof recipient!=='string'||recipient.length>320||/[\r\n\u0000]/.test(recipient)))throw failure('INVALID_INPUT','草稿内容或收件人无效。');
      const draft={text,recipient:recipient===undefined?message.sender.address:recipient,updatedAt:now()};
      const next=structuredClone(state);next.local[id]={...next.local[id],draft};record(next,'agent.draft.saved');commit(next);return structuredClone(draft);
    },
    getAgentContext(threadIds) {
      ensure();if(!state.account||status!=='connected')throw failure('NOT_CONNECTED','邮箱未连接或需要重新登录。');
      if(!Array.isArray(threadIds)||!threadIds.length||threadIds.length>10||new Set(threadIds).size!==threadIds.length||threadIds.some(id=>typeof id!=='string'))throw failure('INVALID_INPUT','请选择 1–10 封邮件。');
      if(agentScopes.some(key=>state.agentPermissions[key]!==true))throw failure('PERMISSION_DENIED','请先允许 Agent 处理邮件并使用校内 AI。');
      const messages=threadIds.map(id=>{
        const m=state.messages.find(m=>m.threadId===id&&m.createdAt>=now()-WEEK);
        if(!m)throw failure('NOT_CONNECTED','所选邮件已不在当前同步范围。');
        return {id:m.id,threadId:m.threadId,subject:m.subject,sender:structuredClone(m.sender),createdAt:m.createdAt,text:m.text};
      });
      if(messages.reduce((length,m)=>length+m.text.length,0)>40000)throw failure('INVALID_INPUT','所选正文超过 40,000 字，请缩小范围。');
      const ordered=[...messages].sort((a,b)=>a.id.localeCompare(b.id));
      const scopeKey=crypto.createHash('sha256').update(JSON.stringify({connectionId:ID,account:state.account,epoch,grantVersion:state.agentGrantVersion,messages:ordered})).digest('hex');
      return {connectionId:ID,scopeKey,messages};
    },
    recordAgent(type, detail={}) {
      ensure();if(!state.account)throw failure('NOT_CONNECTED','邮箱已断开。');
      if(!['agent.started','agent.completed','agent.failed','agent.cancelled','agent.cleared'].includes(type)||!detail||typeof detail!=='object'||Array.isArray(detail)||Object.keys(detail).some(key=>!['count','result'].includes(key))||!Number.isInteger(detail.count)||detail.count<0||detail.count>10||!['success','error','cancelled','revoked','timeout','invalid-output'].includes(detail.result))throw failure('INVALID_INPUT','Agent 操作记录无效。');
      const next=structuredClone(state);record(next,type,{actor:'agent',count:detail.count,result:detail.result});commit(next);
    },
    disconnect() {
      // Invalidate in-flight work before deleting. A late IMAP response cannot restore data.
      epoch++; active?.close(); store.remove(); state = empty(); initError = null; status = 'connected'; lastError = null; publish();
    },
    close() { closed = true; epoch++; active?.close(); state = empty(); },
  };
}
module.exports = {EncryptedMailStore, createMailService, validateCredentials, publicError, ID};
