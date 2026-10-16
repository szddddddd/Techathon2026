export const GROUP_TYPES=[
 {id:'club',name:'社团',building:'社团会馆',color:0xc8a56b,description:'Asymmetric warm timber clubhouse, pitched sage roof, welcoming porch and colorful small pennant flags.'},
 {id:'classroom',name:'班级',building:'小教室',color:0xe2cf93,description:'Sunny small school classroom, cream plaster walls, orderly large window panes, low pitched terracotta roof and a blank entrance chalkboard.'},
 {id:'sport',name:'运动',building:'体育馆',color:0x82b4a4,description:'Compact sports gymnasium, broad rounded barrel roof, wide front entrance, subtle basketball emblem and tall side windows.'},
 {id:'lab',rotation:Math.PI/2,name:'科研',building:'实验室',color:0x98bbca,description:'Woodland research laboratory, geometric stepped roof, teal glass skylight, pale stone walls and a small flask emblem at the entrance.'},
 {id:'library',name:'读书',building:'图书馆',color:0xc9b18a,description:'A miniature woodland library with a tall central book-shaped entrance tower, two low side wings, a broad shallow green roof, a large round reading window and carved open-book emblem. Distinct stepped silhouette, warmly lit reading windows.'},
 {id:'music',name:'音乐',building:'音乐厅',color:0xb89bba,description:'A small woodland concert hall with a single continuous closed fan-shaped roof sweeping upward at the rear, roof edges physically joined to full-height side and rear walls, no floating panels or air gaps, curved front colonnade, lavender accents, broad glazed entrance and a sculpted musical note emblem. Low broad auditorium silhouette, not a house with a gable roof.'},
 {id:'art',name:'艺术',building:'美术工坊',color:0xd39e7f,description:'An artists atelier with two offset studio volumes, distinctive sawtooth north-light roof and three teal glass skylight strips, warm peach plaster, timber frames, a palette-shaped wall emblem and generous studio windows. Angular asymmetric industrial cottage silhouette.'},
 {id:'cafe',name:'休闲',building:'咖啡馆',color:0xd7b48b,description:'A cozy woodland cafe with a rounded corner turret and low conical roof, caramel timber storefront, sage-and-cream striped canvas awning, a small cup-shaped sign above the doorway and curved panoramic windows. Welcoming rounded silhouette, no loose furniture outside the footprint.'},
 {id:'observatory',name:'天文',building:'天文台',color:0x92adbd,description:'A miniature astronomical observatory with a round pale stone drum, large muted blue hemispherical dome, a narrow open roof slit and short tilted telescope, plus a small rectangular entrance annex. Clearly circular dome silhouette, subtle brass star details, no tall tower.'},
];
export const groupOf=(state,id)=>state.groups?.find(g=>g.id===id&&!g.leftAt);
export const groupUnread=(state,id)=>(state.messagesByGroup?.[id]||[]).filter(m=>!m.read&&m.senderId!=='me');
export const conversationKey=ref=>ref.kind==='group'?'group:'+ref.id:ref.id;
export const conversationRef=key=>key.startsWith('group:')?{kind:'group',id:key.slice(6)}:{kind:'friend',id:key};
export function mixedConversations(state){
 const items=[...state.friends.map(id=>({kind:'friend',id})),...(state.groups||[]).filter(g=>!g.leftAt).map(g=>({kind:'group',id:g.id}))];
 const last=r=>r.kind==='group'?(state.messagesByGroup[r.id]||[]).at(-1)?.createdAt||groupOf(state,r.id)?.createdAt||0:state.messages.filter(m=>m.friendId===r.id).at(-1)?.createdAt||0;
 const pin=r=>(r.kind==='group'?state.pinnedGroups:state.pinnedFriends)?.includes(r.id)||false;
 return items.sort((a,b)=>Number(pin(b))-Number(pin(a))||last(b)-last(a)||conversationKey(a).localeCompare(conversationKey(b)));
}
