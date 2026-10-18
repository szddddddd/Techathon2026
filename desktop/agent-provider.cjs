// Trusted desktop module. Never import this file into a renderer bundle.
const path = require('node:path');
const ENDPOINT = 'https://genaiapi.shanghaitech.edu.cn/api/v1/start/chat/completions';
const MODEL = 'deepseek-pro';
const CONFIG_FILE = path.resolve(__dirname, '../.weroam-private/agent-config.cjs');
const failure = (code, message) => Object.assign(new Error(message), {code});

function readConfig() {
  try {
    const value = require(CONFIG_FILE);
    if (typeof value.apiKey !== 'string' || !/^[A-Za-z0-9._-]{16,256}$/.test(value.apiKey)) throw new Error('invalid');
    return {apiKey:value.apiKey};
  } catch { throw failure('AGENT_CONFIG', '邮箱 Agent 尚未配置，请检查本机私有配置。'); }
}

function createAgentProvider({fetchImpl=globalThis.fetch, config=readConfig}={}) {
  function status() {
    try { config(); return {available:true,model:MODEL}; }
    catch { return {available:false,model:MODEL,message:'邮箱 Agent 尚未配置。'}; }
  }
  async function complete(messages, {signal, maxTokens=2000}={}) {
    const {apiKey} = config();
    let response;
    try {
      response = await fetchImpl(ENDPOINT, {
        method:'POST', redirect:'error', signal,
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey}`},
        body:JSON.stringify({model:MODEL,messages,max_tokens:maxTokens,stream:false})
      });
    } catch {
      if (signal?.aborted) throw signal.reason || failure('CANCELLED','已停止处理。');
      throw failure('AGENT_NETWORK','校内 AI 暂时无法连接，请稍后重试。');
    }
    if (!response.ok) {
      // Do not log or return the upstream body: it may echo request content.
      await response.body?.cancel();
      if ([401,403].includes(response.status)) throw failure('AGENT_AUTH','校内 AI 认证未通过，请检查私有配置中的密钥。');
      if (response.status===429) throw failure('AGENT_RATE_LIMIT','校内 AI 请求较多，请稍后再试。');
      throw failure('AGENT_UNAVAILABLE','校内 AI 暂时不可用，请稍后重试。');
    }
    let bytes=0, chunks=[];
    try {
      for await (const chunk of response.body) {
        bytes += chunk.byteLength;
        if (bytes>262144) { await response.body.cancel().catch(()=>{}); throw new Error('limit'); }
        chunks.push(Buffer.from(chunk));
      }
      const data=JSON.parse(Buffer.concat(chunks).toString('utf8'));
      const content=data?.choices?.[0]?.message?.content;
      if (data?.choices?.[0]?.finish_reason==='length' || typeof content!=='string' || !content.trim()) throw new Error('format');
      return content;
    } catch {
      if (signal?.aborted) throw signal.reason || failure('CANCELLED','已停止处理。');
      throw failure('AGENT_OUTPUT','校内 AI 返回内容不完整，请缩小范围后重试。');
    } finally { chunks=[]; }
  }
  complete.status=status;
  return {status,complete};
}
module.exports={createAgentProvider,ENDPOINT,MODEL};
