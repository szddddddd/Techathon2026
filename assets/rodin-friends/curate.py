"""Offline, reproducible tail corrections; source GLBs and texture bytes retained."""
from pathlib import Path
import hashlib
import json
import struct
import numpy as np

ROOT=Path(__file__).resolve().parents[2]
BASE=Path(__file__).resolve().parent

def ramp(value, low, high):
    t=np.clip((value-low)/(high-low),0,1)
    return t*t*(3-2*t)

def correct(name):
    source=BASE/name/'base_basic_pbr.glb'
    data=bytearray(source.read_bytes())
    json_length=struct.unpack_from('<I',data,12)[0]
    doc=json.loads(data[20:20+json_length])
    binary_start=28+json_length
    def array(index):
        acc=doc['accessors'][index];view=doc['bufferViews'][acc['bufferView']]
        dtype={5126:'<f4',5125:'<u4',5123:'<u2'}[acc['componentType']]
        n={'VEC3':3,'SCALAR':1,'VEC2':2,'VEC4':4}[acc['type']]
        size=np.dtype(dtype).itemsize
        return np.ndarray((acc['count'],n),dtype=dtype,buffer=data,offset=binary_start+view.get('byteOffset',0)+acc.get('byteOffset',0),strides=(view.get('byteStride',n*size),size))
    changed=0
    for mesh in doc['meshes']:
        for primitive in mesh['primitives']:
            pos=array(primitive['attributes']['POSITION']);original=pos.copy();x,y,z=original.T
            if name=='fox':
                # Absorb the unwanted left-side duplicate tail under the backpack.
                w=(1-ramp(x,-.10,.10))*(1-ramp(z,-.14,-.08))*np.clip(1-ramp(y,-.38,-.28)+ramp(-x,.35,.50),0,1)*(1-ramp(y,-.17,-.08))
                w=np.maximum(w,(1-ramp(x,-.48,-.38))*(1-ramp(z,-.20,-.14))*(1-ramp(y,-.10,-.02)))
                target=np.array([-.07,-.49,-.24])+(original-np.array([-.07,-.49,-.24]))*np.array([.08,.15,.10])
            elif name=='rabbit':
                w=(1-ramp(z,-.18,-.12))*(1-ramp(y,-.45,-.38))
                target=np.array([0,-.64,-.27])+(original-np.array([0,-.64,-.27]))*np.array([.30,.58,.65])
            else:
                w=(1-ramp(z,-.22,-.15))*(1-ramp(y,-.48,-.40))
                target=np.array([0,-.61,-.28])+(original-np.array([0,-.61,-.28]))*np.array([.22,.55,.60])
            pos[:]=original+(target-original)*w[:,None]
            changed+=int(np.count_nonzero(w>0))
            indices=array(primitive['indices']).reshape(-1,3)
            normals=np.zeros_like(pos)
            fn=np.cross(pos[indices[:,1]]-pos[indices[:,0]],pos[indices[:,2]]-pos[indices[:,0]])
            for column in range(3):np.add.at(normals,indices[:,column],fn)
            # Weld shading normals by original position, without touching UV seams.
            _,inverse=np.unique(np.round(original,6),axis=0,return_inverse=True)
            welded=np.zeros((inverse.max()+1,3));np.add.at(welded,inverse,normals);normals=welded[inverse]
            normals/=np.maximum(np.linalg.norm(normals,axis=1,keepdims=True),1e-12)
            if 'NORMAL' in primitive['attributes']:array(primitive['attributes']['NORMAL'])[:]=normals
            acc=doc['accessors'][primitive['attributes']['POSITION']];acc['min']=pos.min(axis=0).astype(float).tolist();acc['max']=pos.max(axis=0).astype(float).tolist()
    encoded=json.dumps(doc,separators=(',',':')).encode();encoded+=b' '*((-len(encoded))%4)
    binary=bytes(data[binary_start:]);result=struct.pack('<III',0x46546c67,2,28+len(encoded)+len(binary))+struct.pack('<II',len(encoded),0x4e4f534a)+encoded+struct.pack('<II',len(binary),0x004e4942)+binary
    output=BASE/name/'scene.glb';output.write_bytes(result)
    return {'name':name,'source':str(source.relative_to(ROOT)).replace('\\','/'),'output':str(output.relative_to(ROOT)).replace('\\','/'),'changedVertices':changed,'topology':'unchanged triangles and UVs; continuous weighted deformation; recomputed welded normals','source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'output_sha256':hashlib.sha256(result).hexdigest()}

if __name__=='__main__':
    report={'method':'Offline continuous tail deformation; original Rodin base_basic_pbr.glb files unmodified','assets':[correct(name) for name in ['fox','rabbit','bear']]}
    (ROOT/'records/rodin-friends/curation.json').write_text(json.dumps(report,indent=2),encoding='utf8')
    print(json.dumps(report,indent=2))
