/** Scene framing bridge; all inbox content and persistence belong to Universal Inbox. */
export function createMailboxInbox({ui,onOpen,onClose,loadInbox}){
 const panels=['directory','inbox-thread','inbox-center','inbox-agent','inbox-import','inbox-audit','inbox-demo','inbox-approval','inbox-contact','add-friends'];
 let active=false,opening=false,ticket=0;
 const related=()=>panels.some(id=>['opening','open'].includes(ui.state(id)));
 function finish(immediate=false){if(!active)return;active=false;document.body.classList.remove('mailbox-scene-open');onClose(immediate);}
 function close(immediate=false){ticket++;opening=false;for(const id of [...panels].reverse())ui.close(id,{immediate:true,restoreFocus:false});finish(immediate);}
 const offEscape=ui.onEscape(()=>{if(!active&&!opening)return false;close();return true;});
 const off=ui.subscribe(()=>{queueMicrotask(()=>{if(active&&!opening&&!related())finish();});});
 return{async open(){if(active||opening)return;const id=++ticket;opening=true;try{const inbox=await loadInbox();if(!inbox||id!==ticket)return;active=true;document.body.classList.add('mailbox-scene-open');onOpen();await ui.open('directory');if(id!==ticket)return;if(!related())finish();}finally{if(id===ticket){opening=false;if(active&&!related())finish();}}},close,dispose(){close(true);off();offEscape();}};
}
