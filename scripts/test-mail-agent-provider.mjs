import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {serveStatic} from '../server/static-files.mjs';

const require=createRequire(import.meta.url);
const {createAgentProvider,ENDPOINT,MODEL}=require('../desktop/agent-provider.cjs');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const fakeKey='fixture-agent-key-not-a-real-credential';
const marker='PRIVATE_UPSTREAM_BODY_SHOULD_NEVER_ESCAPE';
const config=()=>({apiKey:fakeKey,endpoint:'https://unexpected.invalid',model:'unexpected'});
const messages=[{role:'user',content:'只回复 OK'}];
const jsonResponse=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
const valid={choices:[{message:{content:'OK'},finish_reason:'stop'}]};
async function rejectsSafe(promise,code){
  await assert.rejects(promise,error=>{
    assert.equal(error.code,code);
    assert.equal(error.message.includes(marker),false);
    assert.equal(error.message.includes(fakeKey),false);
    return true;
  });
}

let calls=0;
const provider=createAgentProvider({config,fetchImpl:async(url,options)=>{
  calls++;
  assert.equal(url,'https://genaiapi.shanghaitech.edu.cn/api/v1/start/chat/completions');
  assert.equal(url,ENDPOINT);assert.equal(MODEL,'deepseek-pro');
  assert.equal(options.method,'POST');assert.equal(options.redirect,'error');
  assert.equal(options.headers.Authorization,`Bearer ${fakeKey}`);
  assert.equal(options.headers['Content-Type'],'application/json');
  const payload=JSON.parse(options.body);
  assert.deepEqual(payload,{model:'deepseek-pro',messages,max_tokens:2000,stream:false});
  assert.equal(Object.hasOwn(options,'dispatcher'),false,'Do not install a TLS bypass dispatcher');
  return jsonResponse(valid);
}});
assert.deepEqual(provider.status(),{available:true,model:'deepseek-pro'});
assert.equal(await provider.complete(messages),'OK');assert.equal(calls,1);
assert.equal(createAgentProvider({config:()=>{throw new Error(marker);}}).status().available,false);

for(const [status,code] of [[401,'AGENT_AUTH'],[403,'AGENT_AUTH'],[429,'AGENT_RATE_LIMIT'],[500,'AGENT_UNAVAILABLE'],[302,'AGENT_UNAVAILABLE']]){
  let cancelled=false;
  const stream=new ReadableStream({start(controller){controller.enqueue(new TextEncoder().encode(marker));},cancel(){cancelled=true;}});
  const failure=createAgentProvider({config,fetchImpl:async()=>new Response(stream,{status})});
  await rejectsSafe(failure.complete(messages),code);assert.equal(cancelled,true,'Discard upstream failure bodies');
}
await rejectsSafe(createAgentProvider({config,fetchImpl:async()=>{throw new Error(marker);}}).complete(messages),'AGENT_NETWORK');
// redirect:error causes fetch to reject redirects; the boundary must keep that
// error generic rather than forwarding a request/body-containing exception.
await rejectsSafe(createAgentProvider({config,fetchImpl:async(_url,options)=>{
  assert.equal(options.redirect,'error');throw new TypeError(marker+' redirect');
}}).complete(messages),'AGENT_NETWORK');

for(const response of [
  ()=>new Response(marker+' {'),
  ()=>jsonResponse({choices:[{message:{content:marker},finish_reason:'length'}]}),
  ()=>jsonResponse({choices:[]}),
  ()=>jsonResponse({choices:[{message:{content:''}}]}),
  ()=>jsonResponse({choices:[{message:{content:{text:marker}}}]}),
  ()=>new Response('x'.repeat(262145)),
  ()=>new Response(new ReadableStream({start(controller){controller.error(new Error(marker));}})),
]){
  await rejectsSafe(createAgentProvider({config,fetchImpl:async()=>response()}).complete(messages),'AGENT_OUTPUT');
}
const controller=new AbortController();
const aborted=createAgentProvider({config,fetchImpl:(_url,{signal})=>new Promise((_resolve,reject)=>{
  signal.addEventListener('abort',()=>reject(new Error(marker)),{once:true});
})}).complete(messages,{signal:controller.signal});
controller.abort(Object.assign(new Error('已停止处理。'),{code:'CANCELLED'}));
await rejectsSafe(aborted,'CANCELLED');
const bodyController=new AbortController();
const abortedBody=createAgentProvider({config,fetchImpl:async()=>new Response(new ReadableStream({start(streamController){
  bodyController.signal.addEventListener('abort',()=>streamController.error(new Error(marker)),{once:true});
}}))}).complete(messages,{signal:bodyController.signal});
await new Promise(resolve=>setImmediate(resolve));
bodyController.abort(Object.assign(new Error('已停止处理。'),{code:'CANCELLED'}));
await rejectsSafe(abortedBody,'CANCELLED');
console.log('PASS: fixed provider contract, authentication, rate limits, redirect policy, safe errors, bounded output and cancellation (mock fetch only).');

// Never emit a real credential, including on an assertion failure. Assertions
// below compare booleans; filenames are the only diagnostic data allowed.
const privateRelative='.weroam-private/agent-config.cjs';
let privateConfig=null;
try{await fs.access(path.join(root,privateRelative));privateConfig=require(path.join(root,privateRelative));}catch(error){if(error.code!=='ENOENT')throw error;}
if(privateConfig)assert.equal(typeof privateConfig.apiKey==='string'&&privateConfig.apiKey.length>=16,true,'Private Agent credential is valid');
// Fresh checkouts can run all mock tests without obtaining a real credential.
const needle=Buffer.from(privateConfig?.apiKey||'synthetic-private-credential-sentinel');
const tracked=execFileSync('git',['ls-files','-z'],{cwd:root,maxBuffer:16*1024*1024}).toString('utf8').split('\0').filter(Boolean);
assert.equal(tracked.some(name=>name.startsWith('.weroam-private/')),false,'Private directory is not tracked');
const ignored=execFileSync('git',['check-ignore','--',privateRelative],{cwd:root}).toString('utf8').trim().replaceAll('\\','/');
assert.equal(ignored,privateRelative,'Private credential is Git-ignored');
const textFile=/\.(?:[cm]?js|jsx?|tsx?|json|html?|css|md|txt|ya?ml|xml|java|kt|kts|gradle|properties|ps1|cmd|bat|sh|toml|map|svg|lock|py|c|h|cpp)$/i;
let scanned=0;
for(const relative of tracked.filter(name=>textFile.test(name)||/^\.env(?:\.|$)|^\.gitignore$/.test(path.basename(name)))){
  let value;try{value=await fs.readFile(path.join(root,relative));}catch(error){if(error.code==='ENOENT')continue;throw error;}
  assert.equal(value.includes(needle),false,`Credential absent from tracked text: ${relative}`);scanned++;
}
async function scanDirectory(directory){
  let entries;try{entries=await fs.readdir(directory,{withFileTypes:true});}catch(error){if(error.code==='ENOENT')return;throw error;}
  for(const entry of entries){const file=path.join(directory,entry.name);if(entry.isDirectory())await scanDirectory(file);else if(textFile.test(entry.name)){
    assert.equal((await fs.readFile(file)).includes(needle),false,`Credential absent from frontend artifact: ${path.relative(root,file)}`);scanned++;
  }}
}
await scanDirectory(path.join(root,'dist'));
let manifest;
try{manifest=JSON.parse(await fs.readFile(path.join(root,'.cache/android-assets.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
if(manifest){
  assert.equal(Array.isArray(manifest.files),true);
  for(const file of manifest.files){
    assert.equal(typeof file.path,'string');
    assert.equal(/(?:^|\/)\.weroam-private(?:\/|$)|agent-config|(?:^|\/)desktop\//i.test(file.path),false,`Android allowlist excludes trusted configuration: ${file.path}`);
  }
  assert.equal(Buffer.from(JSON.stringify(manifest)).includes(needle),false,'Credential absent from Android manifest');
  await scanDirectory(path.join(root,'.cache/android-web'));
}
const server=http.createServer((request,response)=>serveStatic(request,response,root));
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try{
  for(const relative of ['/.weroam-private/agent-config.cjs','/%2eweroam-private/agent-config.cjs','/assets%2f..%2f.weroam-private/agent-config.cjs','/src%2f..%2f.weroam-private/agent-config.cjs','/dist%2f..%2f.weroam-private/agent-config.cjs','/desktop/agent-provider.cjs','/desktop/agent-config.example.cjs']){
    const result=await fetch(`http://127.0.0.1:${server.address().port}${relative}`);
    assert.equal(result.status,404,`Static server refuses ${relative}`);
    assert.equal(Buffer.from(await result.arrayBuffer()).includes(needle),false,'Static error response cannot contain credential');
  }
}finally{await new Promise(resolve=>server.close(resolve));needle.fill(0);}
console.log(`PASS: private Git exclusion, ${scanned} text/artifact checks, static HTTP 404 boundaries and ${manifest?'existing Android allowlist':'Android manifest not present; no APK rebuilt'}.`);
