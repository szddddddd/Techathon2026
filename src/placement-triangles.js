import {Vector3} from 'three';

// Exact world-space doubles, not simplified collision hulls. A compact BVH
// replaces millions of Vector/Box/Array objects and scans only nearby faces.
export function createPlacementTriangles(meshes){
 const maximum=meshes.reduce((n,m)=>n+(m.geometry.index?.count??m.geometry.attributes.position.count)/3,0);
 let vertices=new Float64Array(maximum*9),bounds=new Float64Array(maximum*6),count=0;
 const a=new Vector3(),b=new Vector3(),c=new Vector3();
 for(const mesh of meshes){const p=mesh.geometry.attributes.position,index=mesh.geometry.index,n=index?.count??p.count;
  for(let i=0;i<n;i+=3){a.fromBufferAttribute(p,index?index.getX(i):i).applyMatrix4(mesh.matrixWorld);b.fromBufferAttribute(p,index?index.getX(i+1):i+1).applyMatrix4(mesh.matrixWorld);c.fromBufferAttribute(p,index?index.getX(i+2):i+2).applyMatrix4(mesh.matrixWorld);
   const maxY=Math.max(a.y,b.y,c.y);if(maxY<2.25)continue;
   vertices.set([a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z],count*9);
   bounds.set([Math.min(a.x,b.x,c.x),Math.max(a.x,b.x,c.x),Math.min(a.y,b.y,c.y),maxY,Math.min(a.z,b.z,c.z),Math.max(a.z,b.z,c.z)],count*6);count++;
  }
 }
 if(count<maximum*.75){vertices=vertices.slice(0,count*9);bounds=bounds.slice(0,count*6);}
 const order=Uint32Array.from({length:count},(_,i)=>i),capacity=Math.ceil(count/8)*4+1,boxes=new Float64Array(capacity*6),nodes=new Int32Array(capacity*4);let nodeCount=0;
 function build(start,end){
  const node=nodeCount++,o=node*6;boxes.set([Infinity,-Infinity,Infinity,-Infinity,Infinity,-Infinity],o);
  for(let i=start;i<end;i++){const t=order[i]*6;for(let d=0;d<6;d+=2){boxes[o+d]=Math.min(boxes[o+d],bounds[t+d]);boxes[o+d+1]=Math.max(boxes[o+d+1],bounds[t+d+1]);}}
  nodes[node*4+2]=start;nodes[node*4+3]=end;
  if(end-start>8){const axis=boxes[o+1]-boxes[o]>boxes[o+5]-boxes[o+4]?0:4;
   order.subarray(start,end).sort((a,b)=>bounds[a*6+axis]+bounds[a*6+axis+1]-bounds[b*6+axis]-bounds[b*6+axis+1]);
   const middle=(start+end)>>>1;nodes[node*4]=build(start,middle);nodes[node*4+1]=build(middle,end);
  }return node;
 }
 if(count)build(0,count);
 const stack=new Int32Array(nodeCount),scratchA=new Float64Array(24),scratchB=new Float64Array(24);
 function overlaps(array,o,x,z,r2,low,high){const dx=Math.max(array[o]-x,0,x-array[o+1]),dz=Math.max(array[o+4]-z,0,z-array[o+5]);return dx*dx+dz*dz<r2&&array[o+3]>=low&&array[o+2]<=high;}
 function clip(input,n,output,height,above){let size=0;for(let i=0;i<n;i++){const j=(i+1)%n,a=i*3,b=j*3,inside=above?input[a+1]>=height:input[a+1]<=height,other=above?input[b+1]>=height:input[b+1]<=height;
   if(inside){output.set(input.subarray(a,a+3),size*3);size++;}
   if(inside!==other){const t=(height-input[a+1])/(input[b+1]-input[a+1]);for(let k=0;k<3;k++)output[size*3+k]=input[a+k]+(input[b+k]-input[a+k])*t;size++;}
  }return size;
 }
 function distance2(x,z,ax,az,bx,bz){const dx=bx-ax,dz=bz-az,d=dx*dx+dz*dz,t=d?Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/d)):0,px=ax+t*dx-x,pz=az+t*dz-z;return px*px+pz*pz;}
 function triangleNear(x,z,r2,p,j,k){const ax=p[0],az=p[2],bx=p[j*3],bz=p[j*3+2],cx=p[k*3],cz=p[k*3+2];
  const ab=(bx-ax)*(z-az)-(bz-az)*(x-ax),bc=(cx-bx)*(z-bz)-(cz-bz)*(x-bx),ca=(ax-cx)*(z-cz)-(az-cz)*(x-cx),area=(bx-ax)*(cz-az)-(bz-az)*(cx-ax);
  if(Math.abs(area)>1e-8&&(ab>=0&&bc>=0&&ca>=0||ab<=0&&bc<=0&&ca<=0))return true;
  return Math.min(distance2(x,z,ax,az,bx,bz),distance2(x,z,bx,bz,cx,cz),distance2(x,z,cx,cz,ax,az))<r2;
 }
 return{length:count,bytes:vertices.byteLength+bounds.byteLength+order.byteLength+boxes.byteLength+nodes.byteLength,
  intersects(x,z,radius,low,high){if(!count)return false;const r2=radius*radius;let size=1;stack[0]=0;
   while(size){const node=stack[--size];if(!overlaps(boxes,node*6,x,z,r2,low,high))continue;
    if(nodes[node*4+1]){stack[size++]=nodes[node*4];stack[size++]=nodes[node*4+1];continue;}
    for(let i=nodes[node*4+2];i<nodes[node*4+3];i++){const face=order[i];if(!overlaps(bounds,face*6,x,z,r2,low,high))continue;
     scratchA.set(vertices.subarray(face*9,face*9+9));let n=clip(scratchA,3,scratchB,low,true);n=clip(scratchB,n,scratchA,high,false);
     for(let j=1;j+1<n;j++)if(triangleNear(x,z,r2,scratchA,j,j+1))return true;
    }
   }return false;
  },getBounds(target){if(count)target.min.set(boxes[0],boxes[4]),target.max.set(boxes[1],boxes[5]);return target;},
 };
}
