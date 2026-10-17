import {fail} from './policy.js';
import {fixtureBatch} from './fixtures.js';
export function createDemoConnector(connection,{now=Date.now}={}){
  return {
    describe(){return {platform:connection.platform,identityKind:connection.identityKind,authMethod:connection.authMethod,capabilities:connection.capabilities,evidence:'demo'};},
    async connect(){return {status:'connected',credentials:null};},
    async completeAuth(){return {status:'connected',credentials:null};},
    async refresh(){throw fail('UNSUPPORTED','模拟来源不使用令牌');},
    async pull(cursor,scope,signal,{scenario='normal'}={}){
      if(signal?.aborted)throw fail('REVOKED','同步已取消');
      if(scenario==='offline')throw fail('OFFLINE','模拟网络中断，可稍后重试');
      if(scenario==='revoked')throw fail('REVOKED','模拟平台授权失效');
      const batch=fixtureBatch(connection,scope?.seedAt??now());
      if(scenario==='out-of-order'){
        batch.messages.reverse();
        if(batch.messages[0])batch.messages.push({...batch.messages[0],sourceVersion:0,text:'这是较旧的消息版本，不应覆盖最新正文。'});
      }
      if(scenario==='repeat')batch.messages=[...batch.messages,...batch.messages];
      let tombstones=[];
      if(scenario==='new-message'){
        const original=batch.messages[0];
        if(original)batch.messages.push({...original,id:connection.id+':new-message',platformMessageId:'new-message',createdAt:now(),text:'新增演示消息：请确认刚更新的安排。'});
      }
      if(scenario==='tombstone'){tombstones=batch.messages[0]?[batch.messages[0].platformMessageId]:[];batch.messages=batch.messages.slice(1);}
      return {...batch,upserts:batch.messages,tombstones,nextCursor:batch.nextCursor,cursorReset:scenario==='cursor-invalid'};
    },
    async search(){throw fail('UNSUPPORTED','此演示只提供本地搜索');},
    async execute(command,grant){
      if(connection.platform!=='qqmail')throw fail('UNSUPPORTED','请回原应用发送');
      if(!grant?.approvalId)throw fail('APPROVAL_REQUIRED','发送必须人工确认');
      return grant.scenario==='unknown-send'?{status:'unknown',reason:'模拟平台已接收但回执丢失；请核对，未自动重试'}:{status:'sent',platformMessageId:'mock-'+grant.actionId,acceptedAt:now(),delivery:'simulated'};
    },
    async disconnect(){return {localDisconnected:true,remoteRevoked:false};},
  };
}
