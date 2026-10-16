import assert from 'node:assert/strict';
import { petPayload, notificationItems } from '../src/pet-state.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { startPetBridge } = require('../desktop/pet-bridge.cjs');
const { validState, webPort } = require('../desktop/runtime-config.cjs');
const message = (id, extra={}) => ({id:String(id),friendId:'tuantuan',senderId:'tuantuan',read:true,type:'text',text:'hello',createdAt:Number(id),...extra});
const state={friends:['tuantuan','ali'],messages:[message(0,{read:false}),...Array.from({length:300},(_,i)=>message(i+1))]};
const payload=petPayload(state);
assert.equal(payload.unreadCount,1);assert.equal(payload.state.messages.length,301);
assert.equal(notificationItems(payload.state)[0].id,'0');assert.ok(validState(payload));
assert.deepEqual(notificationItems({...state,messages:[]}),[]);
assert.deepEqual(notificationItems({...state,friends:[]}),[]);
assert.equal(notificationItems({...state,messages:[message(2,{read:false}),message(1,{read:false})]})[0].id,'2');
for(const type of ['image','content','moment'])assert.ok(petPayload({...state,messages:[message(1,{type,text:'',read:false})]}).state.messages[0].text);
assert.equal(validState({...payload,unreadCount:-1}),false);
let accepted=0;
const bridge=await startPetBridge({root:process.cwd(),port:0,onState:()=>accepted++,onShow(){}});
const origin=`http://localhost:${webPort(process.cwd())}`;
const post=(client,body=payload)=>fetch(bridge.origin+'/api/state',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({client,...body})});
try {
 assert.equal((await post('first')).status,200);assert.equal((await post('second')).status,409);
 assert.equal((await post('first')).status,200);assert.equal(accepted,2);
 assert.equal((await post('first',{state:{friends:[],messages:[null]},unreadCount:0})).status,400);
 assert.equal((await fetch(bridge.origin+'/api/status',{headers:{Origin:'https://example.com'}})).status,403);
 assert.equal(bridge.openFriend('tuantuan'),true);
 const status=await (await fetch(bridge.origin+'/api/status?client=first',{headers:{Origin:origin}})).json();assert.equal(status.open.friendId,'tuantuan');
}finally{bridge.close();}
console.log('PASS: old unread retention, idle woods, latest source, media summaries, validation, client ownership and origin isolation');
