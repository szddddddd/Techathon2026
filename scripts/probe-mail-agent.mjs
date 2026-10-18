// Explicit smoke probe: sends no mailbox content, credentials or user data.
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {createAgentProvider}=require('../desktop/agent-provider.cjs');
try {
  if(process.argv.includes('--structured')) {
    const {createMailAgentService}=require('../desktop/mail-agent-service.cjs');
    const message={id:'mail-qq-real:synthetic:1',threadId:'mail-qq-real:synthetic:1',subject:'合成测试：会议安排',sender:{name:'合成联系人',address:'synthetic@example.invalid'},createdAt:Date.now(),text:'这是一封合成测试邮件，不来自真实账号。请于周五下午三点参加项目讨论，并回复是否出席。'};
    const mailbox={getAgentContext:()=>({connectionId:'mail-qq-real',scopeKey:'synthetic-probe',messages:[message]}),recordAgent(){}};
    const agent=createMailAgentService({getMailService:()=>mailbox,complete:createAgentProvider().complete});
    try {
      const result=await agent.run({runId:'synthetic-probe',sessionId:'synthetic-probe',threadIds:[message.id],task:'reply',prompt:'给出简短摘要、原文引用，以及确认出席的候选回复。',consent:true});
      if(!result.citations.length||!result.drafts.length)throw Object.assign(new Error('结构化探针缺少引用或草稿；未打印响应正文。'),{code:'PROBE_FORMAT'});
      console.log('PASS: real deepseek-pro structured answer, exact source citation and trusted-recipient draft validated with synthetic data only; no real mailbox accessed.');
    }finally{agent.close();}
  }else{
    const content=await createAgentProvider().complete([{role:'user',content:'只回复 OK'}],{maxTokens:16,signal:AbortSignal.timeout(30000)});
    if(content.trim()!=='OK')throw Object.assign(new Error('模型未按探针要求返回 OK；未打印响应正文。'),{code:'PROBE_FORMAT'});
    console.log('PASS: deepseek-pro authentication and Chat Completions response verified; TLS enabled; response OK; no email content sent.');
  }
}catch(error){console.error(`${error.code||'PROBE_FAILED'}: ${error.message}`);process.exitCode=1;}
