import sharp from 'sharp';
// Resize embedded textures before decoding on the phone, preserving geometry and buffer offsets.
export async function mobileGLB(input,limit=512){
 if(input.readUInt32LE(0)!==0x46546c67)throw Error('Invalid GLB');
 const length=input.readUInt32LE(12),json=JSON.parse(input.subarray(20,20+length).toString()),binStart=20+length;
 if(!json.images?.length)return {data:input,before:0,after:0};
 const bin=input.subarray(binStart+8,binStart+8+input.readUInt32LE(binStart)),parts=[bin];let offset=bin.length,before=0,after=0;
 for(const image of json.images){if(image.bufferView===undefined||!['image/png','image/jpeg','image/webp'].includes(image.mimeType))continue;
 const view=json.bufferViews[image.bufferView],bytes=bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength),meta=await sharp(bytes).metadata();before+=(meta.width||0)*(meta.height||0)*4;
 if(Math.max(meta.width||0,meta.height||0)<=limit){after+=(meta.width||0)*(meta.height||0)*4;continue;}
 const result=await sharp(bytes).resize({width:limit,height:limit,fit:'inside',withoutEnlargement:true}).png().toBuffer({resolveWithObject:true});after+=result.info.width*result.info.height*4;
 const pad=(4-offset%4)%4;if(pad){parts.push(Buffer.alloc(pad));offset+=pad;}
 image.bufferView=json.bufferViews.length;image.mimeType='image/png';json.bufferViews.push({buffer:0,byteOffset:offset,byteLength:result.data.length});parts.push(result.data);offset+=result.data.length;
 }
 if(before===after)return {data:input,before,after};
 const combined=Buffer.concat(parts),usedImages=new Set(json.images.map(i=>i.bufferView)),originalImageViews=new Set(JSON.parse(input.subarray(20,20+length).toString()).images.map(i=>i.bufferView));const compact=[];let size=0;
 for(let index=0;index<json.bufferViews.length;index++){const view=json.bufferViews[index];const pad=(4-size%4)%4;if(pad){compact.push(Buffer.alloc(pad));size+=pad;}const obsolete=originalImageViews.has(index)&&!usedImages.has(index);const bytes=obsolete?Buffer.alloc(4):combined.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);view.byteOffset=size;view.byteLength=bytes.length;compact.push(bytes);size+=bytes.length;}
 json.buffers[0].byteLength=size;const raw=Buffer.from(JSON.stringify(json)),j=Buffer.concat([raw,Buffer.alloc((4-raw.length%4)%4,32)]),b=Buffer.concat([...compact,Buffer.alloc((4-size%4)%4)]),header=Buffer.alloc(20),bh=Buffer.alloc(8);
 header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+j.length+b.length,8);header.writeUInt32LE(j.length,12);header.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(b.length,0);bh.writeUInt32LE(0x004e4942,4);
 return {data:Buffer.concat([header,j,bh,b]),before,after};
}
