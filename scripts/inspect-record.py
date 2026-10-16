import json,struct,io
import numpy as np
from PIL import Image
b=open('assets/rodin/record-player/scene.glb','rb').read(); n=struct.unpack_from('<I',b,12)[0]; j=json.loads(b[20:20+n]); raw=b[28+n:]
def arr(i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];return np.frombuffer(raw,dtype={5126:'<f4',5125:'<u4'}[a['componentType']],count=a['count']*{'VEC3':3,'VEC2':2,'SCALAR':1}[a['type']],offset=v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(a['count'],-1)
p=arr(0);uv=arr(2);im=j['images'][0];v=j['bufferViews'][im['bufferView']];tex=Image.open(io.BytesIO(raw[v['byteOffset']:v['byteOffset']+v['byteLength']])).convert('RGB');pixels=np.array(tex);c=pixels[np.minimum((uv[:,1]*tex.height).astype(int),tex.height-1),np.minimum((uv[:,0]*tex.width).astype(int),tex.width-1)]
for y in np.arange(-.5,.61,.1):
 q=p[(p[:,1]>=y)&(p[:,1]<y+.1)&(c.max(axis=1)<65)];print(round(y,2),len(q),q.min(axis=0).tolist() if len(q) else '',q.max(axis=0).tolist() if len(q) else '')
np.savez('records/rodin-record-player/geometry-analysis.npz',p=p,c=c,uv=uv)
