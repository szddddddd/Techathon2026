import assert from 'node:assert/strict';
import {indexedDB} from 'fake-indexeddb';
import {createModManager,timerRemaining} from '../src/mods/manager.js';
import {openModStore} from '../src/mods/store.js';
const dbName='mods-tests-'+Date.now(),options={dbName,indexedDB};
let m=await createModManager(options);let opened=0,unavailable=0,loads=0;
assert.deepEqual(m.available().map(m=>m.id),['moments','accounts','videos']);
m.onUnavailable=()=>unavailable++;
assert.equal(await m.open('notes'),false);assert.equal(unavailable,1);
m.register('notes',{load(){loads++;if(loads===1)throw Error('offline');},open(){opened++;}});
await m.change('notes','install');await assert.rejects(m.open('notes'),/offline/);await Promise.all([m.open('notes'),m.open('notes')]);assert.equal(loads,2);assert.equal(opened,2);
await m.change('notes','pin',true);await m.updateData('notes',()=>({items:[{id:'n1',text:'saved'}]}));
// Preparation can flush an editor through the same serialized storage without deadlock.
m.beforeChange=()=>m.updateData('notes',d=>({...d,flushed:true}));await m.change('notes','disable');assert.equal(m.state.data.notes.flushed,true);
assert.equal(await m.open('notes'),false);await assert.rejects(m.updateData('notes',()=>({})),/启用/);m.beforeChange=null;
await m.change('notes','uninstall');await m.dispose();m=await createModManager(options);assert.equal(m.enabled('notes'),false);assert.equal(m.state.data.notes.items[0].text,'saved');await m.change('notes','install');assert.equal(m.state.modules.notes.pinned,false);
await m.change('focus','install');await m.updateData('focus',()=>({minutes:25,running:true,endAt:Date.now()+10000,remaining:10000}));await m.change('focus','disable');assert.equal(m.state.data.focus.running,false);assert.ok(m.state.data.focus.remaining<=10000&&m.state.data.focus.remaining>0);assert.equal(m.diagnostics().timerScheduled,false);
await m.change('focus','enable');let completed=0;const unsub=m.subscribe((s,e)=>{if(e.type==='timer-complete')completed++;});await m.updateData('focus',()=>({minutes:25,running:true,endAt:Date.now()+25,remaining:25}));await new Promise(r=>setTimeout(r,70));await m.flush();assert.equal(completed,1);assert.equal(m.state.data.focus.remaining,0);assert.equal(timerRemaining(m.state.data.focus),0);unsub();
await m.clearData('notes');assert.equal(m.state.data.notes,undefined);await m.dispose();
// Failed commits leave the published state untouched, and independent writers serialize in IDB.
const bad=await createModManager({dbName:'failed-mods',indexedDB});
await assert.rejects(bad.updateData('notes',()=>({})));assert.equal(bad.enabled('notes'),false);await bad.dispose();
const a=await openModStore(options),b=await openModStore(options);await Promise.all([a.change(s=>{s.data.a='one';}),b.change(s=>{s.data.b='two';})]);assert.equal((await a.load()).data.a,'one');assert.equal((await b.load()).data.b,'two');
const before=await a.load();await assert.rejects(a.change(s=>{s.data.a='bad';throw Error('commit rejected');}),/commit rejected/);assert.deepEqual(await a.load(),before);a.close();b.close();
console.log('PASS: Mod defaults, unavailable guards, lazy retry, deduplicated loading, installation, pinning, editor flush, persistence, retained data, timer pause/completion, clearing, serialized writes and failed transaction rollback.');
