import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {brotliDecompressSync,gunzipSync} from 'node:zlib';
import {serveStatic} from '../server/static-files.mjs';

await fs.mkdir('.test-results',{recursive:true});const root=await fs.mkdtemp(path.resolve('.test-results/http-cache-'));await fs.mkdir(path.join(root,'dist'));await fs.mkdir(path.join(root,'assets'));
const text='const fixture="'+('forest '.repeat(2000))+'";';
await fs.writeFile(path.join(root,'dist/world.js'),text);await fs.writeFile(path.join(root,'index.html'),'<title>Forest</title>');
await fs.writeFile(path.join(root,'assets/video.webm'),Buffer.from(Array.from({length:200},(_,i)=>i)));
const model=Buffer.alloc(2*1024*1024+37);for(let i=0;i<model.length;i++)model[i]=(i*31+Math.floor(i/65536))%256;
await fs.writeFile(path.join(root,'assets/model.glb'),model);
const server=http.createServer((req,res)=>serveStatic(req,res,root));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
function request(url,headers={},method='GET'){return new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port:server.address().port,path:url,headers,method},res=>{const data=[];res.on('data',d=>data.push(d));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(data)}));});req.on('error',reject);req.end();});}
try{
 const plain=await request('/dist/world.js');assert.equal(plain.status,200);assert.equal(plain.body.toString(),text);
 assert.equal((await request('/dist/world.js',{'If-None-Match':plain.headers.etag})).status,304);
 assert.equal((await request('/dist/world.js',{'If-Modified-Since':plain.headers['last-modified']})).status,304);
 assert.equal((await request('/dist/world.js',{'If-None-Match':'"stale"','If-Modified-Since':plain.headers['last-modified']})).status,200);
 for(const encoding of ['br','gzip']){
  const result=await request('/dist/world.js',{'Accept-Encoding':encoding});assert.equal(result.headers['content-encoding'],encoding);
  assert.equal((encoding==='br'?brotliDecompressSync:gunzipSync)(result.body).toString(),text);assert.ok(result.body.length<plain.body.length/4);
  assert.notEqual(result.headers.etag,plain.headers.etag);
  assert.equal((await request('/dist/world.js',{'Accept-Encoding':encoding,'If-None-Match':result.headers.etag})).status,304);
  const head=await request('/dist/world.js',{'Accept-Encoding':encoding},'HEAD');assert.equal(head.body.length,0);assert.equal(head.headers['content-length'],result.headers['content-length']);
 }
 assert.equal((await request('/dist/world.js',{'Accept-Encoding':'br;q=0,gzip;q=0'})).headers['content-encoding'],undefined);
 assert.equal((await request('/dist/world.js',{'Accept-Encoding':'br;q=0.5,gzip;q=1'})).headers['content-encoding'],'gzip');
 const partial=await request('/assets/video.webm',{Range:'bytes=10-19','Accept-Encoding':'br'});assert.equal(partial.status,206);assert.deepEqual([...partial.body],[10,11,12,13,14,15,16,17,18,19]);assert.equal(partial.headers['content-encoding'],undefined);
 assert.equal((await request('/assets/video.webm',{Range:'bytes=-5'})).body.length,5);
 assert.equal((await request('/assets/video.webm',{Range:'bytes=190-'})).body.length,10);
 assert.equal((await request('/assets/video.webm',{Range:'bytes=999-'})).status,416);
 assert.equal((await request('/assets/video.webm',{Range:'bytes=0-9','If-Range':'"stale"'})).status,200);
 const large=await request('/assets/model.glb');assert.equal(large.status,200);assert.deepEqual(large.body,model);
 const largeRange=await request('/assets/model.glb',{Range:'bytes=65530-1048601'});assert.equal(largeRange.status,206);assert.deepEqual(largeRange.body,model.subarray(65530,1048602));
 assert.equal((await request('/dist/world.js',{},'HEAD')).body.length,0);
 assert.equal((await request('/dist/world.js',{},'POST')).status,405);
 for(const url of ['/package.json','/.git/config','/assets/../../.git/config','/%ZZ','/src%5c..%5c.env'])assert.ok([400,404].includes((await request(url)).status),url);
 const edited=text.replace('forest','FOREST');await fs.writeFile(path.join(root,'dist/world.js'),edited);const future=new Date(Date.now()+2000);await fs.utimes(path.join(root,'dist/world.js'),future,future);
 const fresh=await request('/dist/world.js',{'Accept-Encoding':'br','If-None-Match':plain.headers.etag});assert.equal(fresh.status,200);assert.equal(brotliDecompressSync(fresh.body).toString(),edited);
 console.log('PASS: validators, fresh edits, encoding negotiation, compressed cache, HEAD, ranges, If-Range and static route restrictions.');
}finally{await new Promise(resolve=>server.close(resolve));}
