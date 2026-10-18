import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import config from '../desktop/runtime-config.cjs';
import {createAvatarApi} from '../server/avatar-api.mjs';
import {serveStatic} from '../server/static-files.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=config.webPort(root);
const avatarApi=createAvatarApi({root,port});
const server=http.createServer(async(req,res)=>{
 if(await avatarApi.handle(req,res))return;
 await serveStatic(req,res,root);
});
server.on('error',error=>{console.error(`Cannot start http://localhost:${port}/: ${error.message}`);process.exitCode=1;});
server.on('close',()=>avatarApi.close());
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>server.close(()=>process.exit(0)));
server.listen(port,'127.0.0.1',()=>console.log(`WeRoam: http://localhost:${port}/ (Ctrl+C to stop)`));
