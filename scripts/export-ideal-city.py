"""Export the adopted editable Ideal City scene for the web. No rendering or regeneration."""
import bpy, json, hashlib, argparse, sys
from pathlib import Path
from mathutils import Vector

parser=argparse.ArgumentParser()
parser.add_argument('--source',required=True)
parser.add_argument('--out',required=True)
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:])
source=Path(args.source).resolve(); out=Path(args.out).resolve();out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(source))
scale=2; ground=2.22
def point(p): return [round(p.x*scale,6),round(p.z*scale+ground,6),round(-p.y*scale,6)]
objects=[];outline=[];groups=[];vehicles=[]
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.context.scene.objects:
    if obj.type!='MESH' or obj.name.startswith('Sky |') or any(c.name=='08_Studio' for c in obj.users_collection):continue
    obj.select_set(True)
    name=obj.name
    key=name.split(' |')[0].lower().replace(' ','-')
    obj['idealId']=key
    obj['idealCollection']=obj.users_collection[0].name
    bounds=[point(obj.matrix_world@Vector(c)) for c in obj.bound_box]
    lo=[min(p[i] for p in bounds) for i in range(3)]
    hi=[max(p[i] for p in bounds) for i in range(3)]
    record={'id':key,'name':name,'min':lo,'max':hi,'collection':obj.users_collection[0].name}
    objects.append(record)
    if name.startswith('Main island'):
        verts=[obj.matrix_world@v.co for v in obj.data.vertices]
        outline=[[round(v.x*scale,6),round(-v.y*scale,6)] for v in verts if abs(v.z)<.00001]
    if name.startswith('Building ') or name.startswith(('Low building 0 |','Low building 1 |','Low building 2 |')):
        obj['idealGroupSlot']=len(groups)
        groups.append({**record,'slot':len(groups),'x':round((lo[0]+hi[0])/2,6),'z':round((lo[2]+hi[2])/2,6),'width':hi[0]-lo[0],'depth':hi[2]-lo[2],'height':hi[1]-ground})
    if obj.users_collection[0].name=='06_Aircraft':
        obj['idealVehicle']=key
        vehicles.append({**record,'center':[(lo[i]+hi[i])/2 for i in range(3)]})
assert len(groups)==9 and len(outline)==22
bpy.ops.export_scene.gltf(filepath=str(out/'scene.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_cameras=False,export_lights=False,export_yup=True)
manifest={'id':'ideal','name':'理想城','provider':'Authored Blender geometry','scale':scale,'ground':ground,'source':'source.blend','sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sceneSha256':hashlib.sha256((out/'scene.glb').read_bytes()).hexdigest(),'outline':outline,'groups':groups,'vehicles':vehicles,'objects':objects}
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('IDEAL_EXPORT',json.dumps({'meshes':len(objects),'groups':len(groups),'vehicles':len(vehicles),'bytes':(out/'scene.glb').stat().st_size}))
