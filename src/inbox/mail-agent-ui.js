import {appIcon} from './icons.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uuid=()=>crypto.randomUUID();
const allowed=(connection,key)=>!!connection?.permissions?.[key];

/** Desktop-only presentation. Permission and content checks also run in the trusted process. */
export function createMailAgentUI({panel,gateway,state,chrome,open,onCitation,onAdopt,toast}) {
  let sessionId=null,activeRun=null,epoch=0,opened=false,disposed=false,selectionSignature='',available=false;
  const events=new AbortController();
  const selected=()=>[...panel.querySelectorAll('[name=mailAgentSource]:checked')].map(input=>input.value);
  const rows=()=>gateway.list().filter(row=>row.real);
  const feedback=text=>{const node=panel.querySelector('[data-mail-agent-feedback]');if(node)node.textContent=text;};
  function fingerprint(ids=selected()) {
    return JSON.stringify(ids.map(id=>{try{const result=gateway.readThread(id),c=result.connection;return [id,c?.id,c?.status==='syncing'?'connected':c?.status,allowed(c,'messages.read.body'),allowed(c,'ai.process'),allowed(c,'ai.export.cloud'),result.messages.map(m=>[m.id,m.text,m.body,m.subject,m.sender,m.createdAt])];}catch{return [id,'removed'];}}));
  }
  function controls() {
    const pending=!!activeRun;
    panel.querySelectorAll('[data-mail-agent-task],[data-mail-agent-submit]').forEach(button=>button.disabled=pending||!available);
    const cancel=panel.querySelector('[data-mail-agent-cancel]');if(cancel)cancel.hidden=!pending;
    panel.querySelector('[data-mail-agent-count]').textContent=`${selected().length} / 10`;
  }
  async function cancel() {
    const run=activeRun;activeRun=null;epoch++;
    if(run)await gateway.agent.cancel(run).catch(()=>{});
    if(opened)controls();
  }
  function clearResults(message='') {
    const old=sessionId;sessionId=uuid();
    void cancel();
    if(old)void gateway.agent.clear(old).catch(()=>{});
    panel.querySelector('[data-mail-agent-chat]')?.replaceChildren();
    const consent=panel.querySelector('[name=mailAgentConsent]');if(consent)consent.checked=false;
    feedback(message);
  }
  function renderGrants() {
    const ids=new Set(selected().map(id=>rows().find(row=>row.id===id)?.connectionId).filter(Boolean));
    const container=panel.querySelector('[data-mail-agent-grants]');
    container.innerHTML=[...ids].map(id=>{
      const c=state().connections.find(c=>c.id===id);
      return `<fieldset class="mail-agent-grant"><legend>${esc(c?.label||c?.accountLabel||'邮箱')}</legend><label class="inbox-option"><input type="checkbox" data-mail-agent-scope="ai.process" data-connection="${esc(id)}" ${allowed(c,'ai.process')?'checked':''}>允许 Agent 处理</label><label class="inbox-option"><input type="checkbox" data-mail-agent-scope="ai.export.cloud" data-connection="${esc(id)}" ${allowed(c,'ai.export.cloud')?'checked':''}>允许发送给校内 AI</label></fieldset>`;
    }).join('');
  }
  function renderSources(keep=selected()) {
    const checked=new Set(keep),container=panel.querySelector('[data-mail-agent-sources]');
    container.innerHTML=rows().map(row=>`<label><input type="checkbox" name="mailAgentSource" value="${esc(row.id)}" ${checked.has(row.id)?'checked':''}>${appIcon(row.platform)}<span><strong>${esc(row.title||row.displayName)}</strong><small>${esc(row.displayName||'')} · ${esc(row.accountLabel||'')}</small></span></label>`).join('')||'<p class="inbox-empty">连接邮箱并收取邮件后，在这里选择。</p>';
    renderGrants();selectionSignature=fingerprint();controls();
  }
  function addMessage(kind,text) {
    const article=document.createElement('article');article.className=`mail-agent-message is-${kind}`;
    const title=document.createElement('small');title.textContent=kind==='user'?'你':'WeRoam Agent';
    const body=document.createElement('p');body.textContent=text;article.append(title,body);
    panel.querySelector('[data-mail-agent-chat]').append(article);return article;
  }
  async function run(task,prompt) {
    if(activeRun)return;
    const ids=selected();
    if(!ids.length||ids.length>10){feedback('请选择 1–10 封邮件。');return;}
    if(!panel.querySelector('[name=mailAgentConsent]').checked){feedback('请允许校内 AI 处理本次所选邮件。');return;}
    try{for(const id of ids){const result=gateway.readThread(id);if(!allowed(result.connection,'ai.process')||!allowed(result.connection,'ai.export.cloud')){feedback('请先开启所选邮箱的两项 Agent 权限。');return;}}}catch(error){feedback(error.message||'所选邮件已不可用，请重新选择。');return;}
    if(task==='ask'&&!prompt.trim()){feedback('写下你想了解的问题。');panel.querySelector('[name=mailAgentPrompt]').focus();return;}
    const defaults={summary:'总结所选邮件',todos:'提取所选邮件中的待办',reply:'为所选邮件写回复草稿'};
    const runId=uuid(),runEpoch=++epoch,signature=fingerprint(),runSession=sessionId;activeRun=runId;
    addMessage('user',prompt.trim()||defaults[task]||'整理邮件');feedback('正在处理…');controls();
    panel.querySelector('[name=mailAgentPrompt]').value='';
    panel.querySelector('[name=mailAgentConsent]').checked=false;
    try{
      const result=await gateway.agent.run({runId,sessionId:runSession,threadIds:ids,task,prompt:prompt.trim(),consent:true});
      if(!opened||disposed||runEpoch!==epoch||runSession!==sessionId||signature!==fingerprint())return;
      const article=addMessage('assistant',result.answer||'已完成。');
      if(result.citations?.length){const citations=document.createElement('div');citations.className='mail-agent-citations';for(const citation of result.citations){const button=document.createElement('button');button.type='button';button.className='inbox-citation';button.textContent=citation.text||'查看原邮件';button.addEventListener('click',event=>{event.stopPropagation();Promise.resolve(onCitation(citation,button)).catch(error=>toast(error.message||'原邮件不可读取'));});citations.append(button);}article.append(citations);}
      for(const draft of result.drafts||[]){const block=document.createElement('blockquote');block.textContent=draft.text;const button=document.createElement('button');button.type='button';button.textContent='采用草稿';button.addEventListener('click',event=>{event.stopPropagation();button.disabled=true;Promise.resolve(onAdopt(draft,button)).catch(error=>toast(error.message||'草稿未保存')).finally(()=>button.disabled=false);});article.append(block,button);}
      panel.querySelector('.inbox-agent-selection').open=false;feedback('已完成 · 草稿尚未发送');
      article.scrollIntoView({block:'nearest'});
    }catch(error){if(opened&&runEpoch===epoch)feedback(error.message||'处理未完成，请重试。');}
    finally{if(activeRun===runId)activeRun=null;if(opened)controls();}
  }
  panel.addEventListener('change',event=>{
    const source=event.target.closest('[name=mailAgentSource]');
    if(source){if(selected().length>10){source.checked=false;feedback('每次最多选择 10 封邮件。');return;}clearResults();renderGrants();selectionSignature=fingerprint();controls();}
    const scope=event.target.closest('[data-mail-agent-scope]');
    if(scope){scope.disabled=true;const next=scope.checked;clearResults('正在保存权限…');gateway.setPermissions(scope.dataset.connection,{[scope.dataset.mailAgentScope]:next}).then(()=>{selectionSignature=fingerprint();feedback('权限已更新');}).catch(error=>{scope.checked=!next;feedback(error.message||'权限未保存');}).finally(()=>scope.disabled=false);}
  },{signal:events.signal});
  panel.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.mailAgentTask)void run(button.dataset.mailAgentTask,panel.querySelector('[name=mailAgentPrompt]').value);
    if(button.hasAttribute('data-mail-agent-cancel'))void cancel().then(()=>feedback('已取消'));
    if(button.hasAttribute('data-mail-agent-clear'))clearResults('对话已清空');
  },{signal:events.signal});
  panel.addEventListener('submit',event=>{if(!event.target.matches('[data-mail-agent-form]'))return;event.preventDefault();void run('ask',panel.querySelector('[name=mailAgentPrompt]').value);},{signal:events.signal});
  return {
    async open(origin,{threadIds=[]}={}) {
      if(opened){if(threadIds.length){clearResults();renderSources(threadIds);}return open('inbox-agent',origin);}
      opened=true;sessionId=uuid();available=false;panel.classList.add('has-mail-agent');
      panel.innerHTML=chrome('邮箱 Agent','inbox-agent')+`<div class="mail-agent-body"><div class="inbox-scroll mail-agent-scroll"><details class="inbox-agent-selection" open><summary>选择邮件 <span data-mail-agent-count>0 / 10</span></summary><fieldset class="inbox-agent-sources" data-mail-agent-sources><legend class="inbox-sr-only">选择本次处理的邮件</legend></fieldset><div data-mail-agent-grants></div></details><div class="mail-agent-chat" data-mail-agent-chat aria-live="polite"></div></div><form class="mail-agent-composer" data-mail-agent-form><label class="inbox-sr-only" for="mail-agent-prompt">向邮箱 Agent 提问</label><textarea id="mail-agent-prompt" name="mailAgentPrompt" rows="2" maxlength="2000" placeholder="问问邮件，或让 Agent 帮你分类…"></textarea><label class="inbox-option mail-agent-consent"><input type="checkbox" name="mailAgentConsent">允许校内 AI 处理本次所选邮件</label><div class="mail-agent-tools"><button type="button" data-mail-agent-task="summary">摘要</button><button type="button" data-mail-agent-task="todos">待办</button><button type="button" data-mail-agent-task="reply">写回复</button><button type="submit" class="inbox-primary" data-mail-agent-submit>提问 ↗</button><button type="button" data-mail-agent-cancel hidden>取消</button><button type="button" data-mail-agent-clear>清空</button></div><p class="inbox-feedback" data-mail-agent-feedback role="status"></p></form></div>`;
      renderSources(threadIds);await open('inbox-agent',origin);feedback('正在检查连接…');const current=sessionId;
      try{const status=await gateway.agent.status();if(opened&&sessionId===current){available=!!status.available;feedback(available?'仅处理所选邮件 · 不会发送':'Agent 暂未配置，请检查本机配置。');controls();}}catch(error){if(opened&&sessionId===current)feedback(error.message||'Agent 暂不可用');}
    },
    refresh() {
      if(!opened)return;
      const ids=selected(),next=fingerprint(ids);
      if(selectionSignature!==next){clearResults('邮件或权限已变化，请重新确认。');renderSources(ids);return;}
      const options=[...panel.querySelectorAll('[name=mailAgentSource]')].map(x=>x.value);
      if(JSON.stringify(options)!==JSON.stringify(rows().map(row=>row.id)))renderSources(ids);
    },
    close() {if(!opened)return;opened=false;const old=sessionId;sessionId=null;void cancel();if(old)void gateway.agent.clear(old).catch(()=>{});panel.replaceChildren();panel.classList.remove('has-mail-agent');selectionSignature='';},
    dispose(){this.close();disposed=true;events.abort();},
  };
}
