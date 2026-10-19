const labels={auto:'自动',day:'白天',dusk:'黄昏',night:'夜晚',dawn:'黎明'};
const icons={day:'☀',dusk:'◒',night:'☾',dawn:'☀'};
export function createDayNightMenu({clock,ui}){
 const root=document.createElement('nav');root.id='day-night-control';root.setAttribute('aria-label','昼夜设置');
 root.innerHTML='<button id="day-night-toggle" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="day-night-menu"></button><div id="day-night-menu" role="menu" aria-label="选择时间" hidden>'+['auto','day','dusk','night'].map(mode=>`<button type="button" role="menuitemradio" data-time-mode="${mode}">${labels[mode]}${mode==='auto'?'<small>12 分钟一天</small>':''}</button>`).join('')+'</div><span class="scene-switcher-announcement" role="status"></span>';
 document.body.append(root);const toggle=root.querySelector('#day-night-toggle'),menu=root.querySelector('[role=menu]'),items=[...menu.querySelectorAll('button')],status=root.querySelector('[role=status]'),events=new AbortController();let busy=false,blocked=false,last='';
 const on=(target,type,fn)=>target.addEventListener(type,fn,{signal:events.signal});
 function open(value){menu.hidden=!value||busy||blocked;toggle.setAttribute('aria-expanded',String(!menu.hidden));}
 function render(){const s=clock.snapshot(),key=s.mode+s.phase+s.paused+busy+blocked;if(key===last)return;last=key;toggle.innerHTML=`<span aria-hidden="true">${icons[s.phase]}</span><span>${s.mode==='auto'?'自动':labels[s.mode]}</span>`;toggle.setAttribute('aria-label',`时间：${labels[s.phase]}，${s.mode==='auto'?'自动循环'+(s.paused?'已暂停':''): '手动模式'}，选择昼夜`);toggle.disabled=busy||blocked;for(const item of items){item.setAttribute('aria-checked',String(item.dataset.timeMode===s.mode));item.disabled=busy||blocked;}if(busy||blocked)open(false);}
 on(toggle,'click',()=>open(menu.hidden));
 for(const item of items)on(item,'click',()=>{clock.setMode(item.dataset.timeMode);render();open(false);toggle.focus({preventScroll:true});status.textContent='已选择'+labels[item.dataset.timeMode];});
 on(document,'pointerdown',e=>{if(!root.contains(e.target))open(false);});
 on(root,'focusout',e=>{if(!root.contains(e.relatedTarget))open(false);});
 on(root,'keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();open(false);toggle.focus();return;}if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key)||busy||blocked)return;e.preventDefault();e.stopPropagation();open(true);const i=items.indexOf(document.activeElement),n=e.key==='Home'?0:e.key==='End'?items.length-1:i<0?(e.key==='ArrowUp'?items.length-1:0):(i+(e.key==='ArrowUp'?-1:1)+items.length)%items.length;items[n].focus();});
 const unsubscribe=ui.subscribe(s=>{blocked=!!s.modal||!!s.main;render();});render();
 return{update:render,closeMenu(){open(false);},setBusy(value){busy=value;render();},dispose(){events.abort();unsubscribe();root.remove();}};
}
