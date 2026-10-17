const paths={
 moments:'<circle cx="12" cy="12" r="3"/><path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8"/>',
 accounts:'<path d="M4 4h7v16H4zM11 6h9v14h-9M6 8h3m-3 4h3m4-2h5m-5 4h5"/>',
 videos:'<rect x="3" y="4" width="18" height="16" rx="4"/><path d="m10 8 6 4-6 4Z"/>',
 notes:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8m-8 4h5"/>',
 focus:'<circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2M9 2h6m-3 0v3m6 1 2-2"/>',
 workshop:'<path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>'
};
export const modIcon=id=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[id]||paths.workshop}</svg>`;
export const MODS=Object.freeze([
 {id:'moments',name:'朋友圈',description:'分享朋友们的日常',color:'#edf5ed',accent:'#348054',preview:'assets/discovery/video-1.jpg',capabilities:['好友动态','发表与互动','本地照片'],bundled:true},
 {id:'accounts',name:'公众号',description:'留一点时间给阅读',color:'#edf2fb',accent:'#3979be',preview:'assets/discovery/video-2.jpg',capabilities:['本地文章','订阅与收藏','阅读进度'],bundled:true},
 {id:'videos',name:'视频号',description:'看见生活的每个片刻',color:'#fff1e8',accent:'#bd7338',preview:'assets/discovery/video-5.jpg',capabilities:['本地视频','关注与留言','播放进度'],bundled:true},
 {id:'notes',name:'便签',description:'随手记下一个好点子',color:'#fff7da',accent:'#a58124',capabilities:['本地便签存储']},
 {id:'focus',name:'专注计时',description:'给此刻一段专注时间',color:'#f0edfa',accent:'#7a60ad',capabilities:['本地计时存储','应用内完成提示']}
].map(m=>Object.freeze({...m,version:'0.1.0',author:'WeRoam',source:'随应用提供'})));
export const modById=id=>MODS.find(m=>m.id===id);
export const routeMod=route=>['video','videos','creator'].includes(typeof route==='string'?route:route?.type)?'videos':'accounts';
