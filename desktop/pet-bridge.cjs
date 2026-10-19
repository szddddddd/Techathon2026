const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { webPort, validState } = require('./runtime-config.cjs');
const {pathToFileURL}=require('node:url');

// Loopback only. Only this project's web origin can exchange social state.
function startPetBridge({ root, port = 47831, onState, onShow, onHide = () => {}, isVisible = () => false }) {
  let avatarApi;
  let avatarReady;
  const getAvatarApi=()=>avatarReady??=import(pathToFileURL(path.join(root,'server/avatar-api.mjs')).href).then(({createAvatarApi})=>{avatarApi=createAvatarApi({root,port:server.address().port,allowFileAssets:true});return avatarApi;});
  let server, currentClient = null, pendingOpen = null, lastSeen = 0, sequence = 0;
  const configuredPort = webPort(root);
  const origins = new Set([`http://localhost:${configuredPort}`, `http://127.0.0.1:${configuredPort}`]);
  const instance = require('node:crypto').randomUUID();
  const listeners = new Set();
  const visibility = () => ({visible:!!isVisible()});
  function visibilityChanged(){
    const data = `data: ${JSON.stringify(visibility())}\n\n`;
    for(const response of listeners) response.write(data);
  }
  const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.glb':'model/gltf-binary','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.webm':'video/webm','.json':'application/json'};
  const reply = (res, status, data) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(data)); };
  return new Promise((resolve, reject) => {
    server = http.createServer(async (req, res) => {
      const url = new URL(req.url, 'http://127.0.0.1');
      if(url.pathname.startsWith('/api/avatar/')){
        // Native file pages may read generated assets, never issue credentialed API mutations.
        if(req.method==='GET'&&/^\/api\/avatar\/assets\/[a-f0-9-]{36}\/(avatar\.img|reference\.img|scene\.glb)$/.test(url.pathname)&&req.headers.origin==='null')res.setHeader('Access-Control-Allow-Origin','null');
        try{await (await getAvatarApi()).handle(req,res);}catch{reply(res,503,{error:'形象服务暂不可用。'});}return;}
      if (url.pathname.startsWith('/api/')) {
        if (!origins.has(req.headers.origin)) return reply(res, 403, {error:'origin denied'});
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Private-Network','true');
        if (req.method === 'OPTIONS') { res.writeHead(204);res.end();return; }
        if (url.pathname === '/api/visibility' && req.method === 'GET') {
          res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});
          listeners.add(res);res.write(`data: ${JSON.stringify(visibility())}\n\n`);
          const heartbeat=setInterval(()=>res.write(': keepalive\n\n'),15000);
          res.on('close',()=>{clearInterval(heartbeat);listeners.delete(res);});return;
        }
        if (url.pathname === '/api/status' && req.method === 'GET') {
          const client = url.searchParams.get('client');
          if (client && client === currentClient) lastSeen = Date.now();
          return reply(res, 200, {online:true,instance,visible:!!isVisible(),open:client === currentClient ? pendingOpen : null});
        }
        if (req.method !== 'POST') return reply(res, 405, {error:'method not allowed'});
        let raw = '', size = 0;
        try {
          for await (const chunk of req) { size += chunk.length;if(size > 1024*1024) { reply(res,413,{error:'payload too large'});return; }raw += chunk; }
          const data = JSON.parse(raw || '{}');
          if (url.pathname === '/api/state') {
            if (typeof data.client !== 'string' || !/^[\w-]{1,80}$/.test(data.client) || !validState(data)) return reply(res,400,{error:'invalid state'});
            if(currentClient && currentClient !== data.client && Date.now()-lastSeen < 8000) return reply(res,409,{error:'another client is active'});
            if(currentClient !== data.client)pendingOpen=null;
            currentClient=data.client;lastSeen=Date.now();onState(data);
          } else if (url.pathname === '/api/show') onShow();
          else if (url.pathname === '/api/hide') onHide();
           else if (url.pathname === '/api/ack') { if(data.client===currentClient && data.sequence===pendingOpen?.sequence)pendingOpen=null; }
          else return reply(res,404,{error:'not found'});
          return reply(res,200,{ok:true,instance});
        } catch { return reply(res,400,{error:'invalid request'}); }
      }
      // Serve runtime assets so GLB fetches work in native Chromium too.
      let requested;
      try { requested=decodeURIComponent(url.pathname); } catch { res.writeHead(400);res.end();return; }
      if(requested==='/')requested='/index.html';
      if(!/^\/(assets\/|dist\/|(?:index|pet|asset-review)\.html$|src\/startup\.js$|src\/styles\/[a-z0-9-]+\.css$)/i.test(requested)||requested.includes('..')||requested.includes('\\')){res.writeHead(404);res.end();return;}
      const file=path.resolve(root,'.'+requested);
      if(!file.startsWith(path.resolve(root)+path.sep)){res.writeHead(404);res.end();return;}
      try { const stat=await fs.promises.stat(file);if(!stat.isFile())throw new Error();res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':stat.size});fs.createReadStream(file).pipe(res); }
      catch { res.writeHead(404);res.end(); }
    });
    server.once('error',reject);
    server.listen(port,'127.0.0.1',()=>resolve({
      origin:`http://127.0.0.1:${server.address().port}`,
      openFriend(friendId){if(Date.now()-lastSeen>8000||!currentClient)return false;pendingOpen={friendId:friendId||null,sequence:++sequence};return true;},
      visibilityChanged,
      close(){avatarApi?.close();for(const response of listeners)response.end();listeners.clear();server.close();},
    }));
  });
}
module.exports={startPetBridge};
