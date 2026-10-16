export const SCENE_THEMES=Object.freeze({
 forest:{id:'forest',name:'林间来信',background:0x203a32},
 fuji:{id:'fuji',name:'富士樱町',background:0xbac9cf},
});
export const SCENE_STORAGE_KEY='forest-letters-scene';
export function readSceneTheme(){
 if(typeof location==='undefined')return 'forest';
 const requested=new URLSearchParams(location.search).get('scene');
 if(Object.hasOwn(SCENE_THEMES,requested))return requested;
 try{const saved=localStorage.getItem(SCENE_STORAGE_KEY);if(Object.hasOwn(SCENE_THEMES,saved))return saved;}catch{}
 return 'forest';
}
