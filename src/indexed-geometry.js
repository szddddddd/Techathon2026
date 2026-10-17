import {Uint16BufferAttribute,Uint32BufferAttribute} from 'three';

/** Preserve GPU's indexed vertex cache when merging. Expanding an indexed mesh
 * repeats its positions, normals and UVs for every triangle for no visual gain. */
export function ensureIndexed(geometry){
 if(!geometry.index){const n=geometry.attributes.position.count,indices=n>65535?new Uint32Array(n):new Uint16Array(n);for(let i=0;i<n;i++)indices[i]=i;geometry.setIndex(new (n>65535?Uint32BufferAttribute:Uint16BufferAttribute)(indices,1));}
 return geometry;
}
