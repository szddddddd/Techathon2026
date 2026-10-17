// Deliberately no network, model, eval, instruction parser or execution tools.
export function summarizeMessages(thread,messages){
  const incoming=messages.filter(m=>m.direction==='incoming'),last=incoming.at(-1);
  const text=String(last?.text||'');
  const sentence=text.split(/[。\n]/).find(Boolean)||'暂时没有正文';
  return {threadId:thread.id,title:thread.title,summary:sentence.slice(0,180),citations:last?[{messageId:last.id,text:sentence.slice(0,120)}]:[],suggestedReply:'收到，谢谢你的消息。我会确认安排后再回复你。'};
}
