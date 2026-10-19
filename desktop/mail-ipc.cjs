const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {EncryptedMailStore, createMailService, publicError} = require('./mail-service.cjs');
const {PROVIDERS,providerOf}=require('./mail-providers.cjs');
const {createAgentProvider}=require('./agent-provider.cjs');
const {createMailAgentService}=require('./mail-agent-service.cjs');

function trustedFrame(event, window, file) {
  if(!window || window.isDestroyed() || event.sender!==window.webContents || event.senderFrame!==window.webContents.mainFrame)return false;
  try { const actual=new URL(event.senderFrame.url),expected=pathToFileURL(file);return actual.protocol==='file:' && actual.host===expected.host && actual.pathname===expected.pathname; } catch {return false;}
}

function setupMailIPC({app, BrowserWindow, ipcMain, safeStorage, getMainWindow, focusMain, agentComplete}) {
  let authWindow = null, pendingOpen = false, agent = null;
  const services=new Map();
  const mainFile = path.resolve(__dirname,'../src/pages/index.html'), authFile = path.join(__dirname,'mail-connect.html');
  function getService(provider='qqmail') {
    providerOf(provider);
    if(!services.has(provider))services.set(provider,createMailService({provider,store:new EncryptedMailStore(app.getPath('userData'),safeStorage,provider),onChange(){agent?.invalidate();const main=getMainWindow();if(main&&!main.isDestroyed())main.webContents.send('mail-changed');}}));
    return services.get(provider);
  }
  function aggregate() {
    const result={version:1,connections:[],contacts:[],conversations:[],messages:[],local:{},audit:[],actions:[],errors:{}};
    for(const provider of Object.keys(PROVIDERS)){const s=getService(provider).snapshot();for(const key of ['connections','conversations','messages','audit'])result[key].push(...s[key]);Object.assign(result.local,s.local);if(s.error)result.errors[provider]=s.error;}
    return result;
  }
  function configFor(id) {
    const config=Object.values(PROVIDERS).find(p=>p.id===id||typeof id==='string'&&id.startsWith(p.id+':'));
    if(!config)throw Object.assign(new Error('未找到此邮箱连接。'),{code:'INVALID_INPUT'});
    return config;
  }
  const reply = async fn => { try { return {ok:true,value:await fn()}; } catch (e) { const error=publicError(e); return {ok:false,error:{code:error.code,message:error.message}}; } };
  agent=createMailAgentService({getMailService:id=>getService(configFor(id).platform),complete:agentComplete||createAgentProvider().complete});
  const owners=new WeakSet();
  ipcMain.handle('agent-request',async(event,request)=>{
    if(!trustedFrame(event,getMainWindow(),mainFile))return {ok:false,error:{code:'IPC_DENIED',message:'此窗口不能调用邮箱 Agent。'}};
    if(!owners.has(event.sender)){
      owners.add(event.sender);
      event.sender.once('destroyed',()=>agent.clearAll());
      event.sender.on('did-start-navigation',(_event,_url,inPlace,isMainFrame)=>{if(isMainFrame&&!inPlace)agent.clearAll();});
    }
    try {
      if(!request||typeof request!=='object'||Array.isArray(request))throw Object.assign(new Error('Agent 请求无效。'),{code:'INVALID_INPUT'});
      let value;
      switch(request.operation){
        case 'status':value=agent.status();break;
        case 'run':value=await agent.run(request);break;
        case 'cancel':value=agent.cancel(request.runId);break;
        case 'clear':value=agent.clear(request.sessionId);break;
        default:throw Object.assign(new Error('不支持此 Agent 操作。'),{code:'UNSUPPORTED'});
      }
      return {ok:true,value};
    }catch(error){
      const known=['INVALID_INPUT','PERMISSION_DENIED','NOT_CONNECTED','BUSY','CANCELLED','REVOKED','UNSUPPORTED','VAULT_FAILED','VAULT_UNAVAILABLE','AGENT_CONFIG','AGENT_AUTH','AGENT_RATE_LIMIT','AGENT_NETWORK','AGENT_UNAVAILABLE','AGENT_OUTPUT','AGENT_TIMEOUT'];
      return {ok:false,error:known.includes(error?.code)?{code:error.code,message:error.message}:{code:'AGENT_UNAVAILABLE',message:'邮箱 Agent 暂时无法处理，请稍后重试。'}};
    }
  });
  function openConnect(provider='qqmail') {
    const config=providerOf(provider);
    if (authWindow && !authWindow.isDestroyed()) { authWindow.show(); authWindow.focus(); return; }
    authWindow = new BrowserWindow({title:`连接${config.name} · WeRoam`,width:470,height:760,resizable:false,autoHideMenuBar:true,show:false,parent:getMainWindow()||undefined,webPreferences:{preload:path.join(__dirname,'mail-preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true}});
    authWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
    authWindow.webContents.on('will-navigate',e=>e.preventDefault());
    authWindow.on('closed',()=>{authWindow=null;});
    authWindow.once('ready-to-show',()=>authWindow?.show());
    authWindow.loadFile(authFile,{query:{provider}});
  }
  ipcMain.handle('mail-request', (event, request) => reply(async()=>{
    if (!trustedFrame(event,getMainWindow(),mainFile)) throw new Error('IPC denied');
    if (!request || typeof request!=='object' || Array.isArray(request)) throw new Error('Invalid request');
    switch(request.operation) {
      case 'snapshot': return aggregate();
      case 'connect': openConnect(request.provider); return {opened:true};
      case 'sync': return getService(configFor(request.id||PROVIDERS.qqmail.id).platform).sync();
      case 'local': return getService(configFor(request.id).platform).setLocal(request.id,request.patch);
      case 'draft': return getService(configFor(request.id).platform).saveDraft(request.id,request.text,request.recipient);
      case 'agent-permissions': return getService(configFor(request.id).platform).setAgentPermissions(request.patch);
      case 'disconnect': return getService(configFor(request.id||PROVIDERS.qqmail.id).platform).disconnect();
      case 'open-webmail': return require('electron').shell.openExternal(configFor(request.id||PROVIDERS.qqmail.id).webmail);
      default: throw new Error('Unsupported operation');
    }
  }));
  ipcMain.handle('mail-authorize',(event,input)=>reply(async()=>{
    if (!trustedFrame(event,authWindow,authFile)) throw new Error('IPC denied');
    const result=await getService(input?.provider||'qqmail').connect(input);
    // Only the fixed local credential window can submit secrets, not the scene/Agent.
    return result;
  }));
  ipcMain.handle('mail-authorized-close',event=>reply(()=>{
    if (!trustedFrame(event,authWindow,authFile)) throw new Error('IPC denied');
    authWindow.close(); pendingOpen=true;focusMain();
    if(getMainWindow()&&!getMainWindow().isDestroyed())getMainWindow().webContents.send('mail-open-inbox');
  }));
  const ready=event=>{if(trustedFrame(event,getMainWindow(),mainFile)&&pendingOpen){pendingOpen=false;getMainWindow().webContents.send('mail-open-inbox');}};
  ipcMain.on('mail-ui-ready',ready);
  return {openConnect,close(){agent.close();for(const service of services.values())service.close();authWindow?.destroy();ipcMain.removeListener('mail-ui-ready',ready);ipcMain.removeHandler('mail-request');ipcMain.removeHandler('agent-request');ipcMain.removeHandler('mail-authorize');ipcMain.removeHandler('mail-authorized-close');}};
}
module.exports={setupMailIPC,trustedFrame};
