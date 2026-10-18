import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {serveStatic} from '../server/static-files.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.FOREST_LAN_PORT||8081);
const server=http.createServer(async(req,res)=>{
 try { await serveStatic(req,res,root); }
 catch { if(res.headersSent)res.destroy();else{res.writeHead(500);res.end();} }
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>server.close(()=>process.exit(0)));
server.listen(port,'0.0.0.0',()=>{
 console.log('LAN static preview only; local generation and mail services are not exposed.');
 for(const entries of Object.values(os.networkInterfaces()))for(const entry of entries||[])if(entry.family==='IPv4'&&!entry.internal)console.log(`http://${entry.address}:${port}/`);
});
