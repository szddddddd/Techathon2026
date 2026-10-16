import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';

/** Reuse Codex's authenticated MCP connection; credentials never enter the web server. */
export class Hyper3dClient {
  constructor({cwd=process.cwd(),command=process.env.FOREST_CODEX_BIN||'codex'}={}){this.cwd=cwd;this.command=command;this.pending=new Map();this.sequence=0;}
  async start(){
    if(this.ready)return this.ready;
    this.ready=(async()=>{
      const args=['app-server','--stdio'];
      for(const name of ['blender','node_repl'])args.push('-c',`mcp_servers.${name}.enabled=false`);
      this.process=spawn(this.command,args,{cwd:this.cwd,windowsHide:true,stdio:['pipe','pipe','pipe']});
      this.process.stderr.on('data',()=>{}); // Provider/CLI logs may include authorization URLs.
      this.process.on('error',()=>this.fail(new Error('无法启动 Codex，请安装并配置 Hyper3D MCP。')));
      this.process.on('exit',()=>{this.fail(new Error('生成服务连接已关闭，请重试。'));this.ready=null;this.thread=null;});
      createInterface({input:this.process.stdout}).on('line',line=>{
        let message;try{message=JSON.parse(line);}catch{return;}
        const pending=this.pending.get(message.id);if(!pending)return;
        clearTimeout(pending.timer);this.pending.delete(message.id);
        if(message.error)pending.reject(new Error(message.error.message||'Hyper3D 工具调用失败。'));else pending.resolve(message.result);
      });
      await this.request('initialize',{clientInfo:{name:'forest_avatar_pipeline',version:'1.0.0'},capabilities:{experimentalApi:true}});
      this.process.stdin.write(JSON.stringify({method:'initialized'})+'\n');
      return true;
    })().catch(e=>{this.ready=null;throw e;});return this.ready;
  }
  fail(error){for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(error);}this.pending.clear();}
  request(method,params,timeout=120000){return new Promise((resolve,reject)=>{const id=++this.sequence,timer=setTimeout(()=>{this.pending.delete(id);reject(new Error('Hyper3D 连接超时。已提交的生成任务会保留，请查询任务进度。'));},timeout);this.pending.set(id,{resolve,reject,timer});this.process.stdin.write(JSON.stringify({id,method,params})+'\n');});}
  async tools(){await this.start();if(!this.thread){const r=await this.request('thread/start',{cwd:this.cwd,ephemeral:true,approvalPolicy:'never'});this.thread=r.thread.id;}const result=await this.request('mcpServerStatus/list',{threadId:this.thread,detail:'full'});const server=result.data?.find(s=>s.name==='hyper3d');if(!server)throw new Error('请先执行 codex mcp add hyper3d --url https://api.hyper3d.com/api/mcp 并完成 OAuth 登录。');this.inventory=server;return server;}
  async call(tool,args){
    await this.start();
    if(!this.thread){const r=await this.request('thread/start',{cwd:this.cwd,ephemeral:true,approvalPolicy:'never'});this.thread=r.thread.id;}
    const result=await this.request('mcpServer/tool/call',{threadId:this.thread,server:'hyper3d',tool,arguments:args},180000);
    if(result.isError)throw new Error('Hyper3D 返回了错误，请查看当前任务状态。');return result;
  }
  close(){this.process?.kill();this.fail(new Error('生成服务已停止。'));this.ready=null;}
}

export function resultData(result){
  if(result.structuredContent)return result.structuredContent;
  const parts=(result.content||[]).filter(p=>p.type==='text').map(p=>p.text);
  for(const text of parts){try{return JSON.parse(text);}catch{}}
  return {text:parts.join('\n')};
}
