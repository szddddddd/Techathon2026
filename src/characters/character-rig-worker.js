import {buildRigWeights} from './character-rig-weights.js';
self.onmessage=({data})=>{try{const result=buildRigWeights(data.meshes,data.profile,{automatic:data.automatic});const transfer=result.meshes?.flatMap(m=>[m.skinIndex.buffer,m.skinWeight.buffer,m.witnesses.buffer])||[];self.postMessage({id:data.id,result},transfer);}catch(error){self.postMessage({id:data.id,error:error.message});}};
