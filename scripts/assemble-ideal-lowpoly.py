"""Assemble adopted Rodin parts onto the original Ideal City anchors.

Run with Blender --background --python scripts/assemble-ideal-lowpoly.py.
Original Blender scene and runtime fallback are preserved. Output is versioned.
"""
import bpy, json, math, hashlib, shutil
from pathlib import Path
from mathutils import Vector, Matrix

ROOT=Path.cwd(); RECORD=ROOT/'records/ideal-lowpoly-20261017'; OUT=ROOT/'assets/ideal-city/lowpoly'
OUT.mkdir(parents=True,exist_ok=True)
catalog=json.loads((RECORD/'catalog.json').read_text(encoding='utf8'))
source=json.loads((ROOT/'assets/ideal-city/manifest.json').read_text(encoding='utf8'))
bpy.ops.wm.read_factory_settings(use_empty=True)
templates={};adopted=[]

def bounds(objects):
    points=[o.matrix_world@Vector(v) for o in objects for v in o.bound_box]
    return Vector([min(p[i] for p in points) for i in range(3)]),Vector([max(p[i] for p in points) for i in range(3)])

for item in catalog['items']:
    key=item['id'];folder=RECORD/key;job=json.loads((folder/'job.json').read_text(encoding='utf8'))
    assert job['status']=='downloaded',key
    before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(folder/'raw.glb'))
    created=set(bpy.data.objects)-before;created_names=[o.name for o in created];meshes=[o for o in created if o.type=='MESH']
    bpy.ops.object.select_all(action='DESELECT')
    for o in meshes:o.select_set(True)
    bpy.context.view_layer.objects.active=meshes[0];bpy.ops.object.join();obj=meshes[0]
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    if key in ['airship-large','airship-medium','hover-car','cargo-ship','shuttle','service-building','bridge-tower']:
        obj.data.transform(Matrix.Rotation((math.pi/2 if key in ['hover-car','cargo-ship','shuttle'] else -math.pi/2),4,'Z'))
    # Keep the low-poly colour texture; remove photographic normal/metal maps.
    for material in obj.data.materials:
        material.name=key+' · matte cartoon'
        for node in material.node_tree.nodes:
            if node.type=='BSDF_PRINCIPLED':
                for name,value in [('Metallic',0),('Roughness',.88)]:
                    for link in list(node.inputs[name].links):material.node_tree.links.remove(link)
                    node.inputs[name].default_value=value
                for link in list(node.inputs['Normal'].links):material.node_tree.links.remove(link)
                for link in node.inputs['Base Color'].links:
                    if link.from_node.type=='TEX_IMAGE':
                        image=link.from_node.image
                        if max(image.size)>1024:
                            ratio=1024/max(image.size);image.scale(int(image.size[0]*ratio),int(image.size[1]*ratio))
                        if key=='island-base':
                            import numpy as np
                            pixels=np.empty(len(image.pixels),dtype=np.float32);image.pixels.foreach_get(pixels);pixels=pixels.reshape(-1,4)
                            green=(pixels[:,1]>pixels[:,0]*1.08)&(pixels[:,1]>pixels[:,2]*1.3)
                            shade=np.clip(pixels[green,1]/.6,.85,1.15)
                            pixels[green,:3]=np.array([.35,.47,.27])*shade[:,None]
                            image.pixels.foreach_set(pixels.ravel());image.update()
        material.diffuse_color=(.8,.85,.9,1)
    # Save a reusable standalone adopted asset with its original proportions.
    dest=OUT/key;dest.mkdir(exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(dest/'scene.glb'),export_format='GLB',use_selection=True,export_image_format='JPEG',export_jpeg_quality=88,export_extras=True)
    # Normalized source coordinates let each placement retain its exact anchor.
    lo,hi=bounds([obj]);center=(lo+hi)/2;size=hi-lo
    for v in obj.data.vertices:
        v.co=Vector([(v.co[i]-center[i])/size[i] for i in range(3)])
    obj.data.update();templates[key]=obj.data
    for name in created_names:
        o=bpy.data.objects.get(name)
        if o:bpy.data.objects.remove(o,do_unlink=True)
    shutil.copy2(folder/'image-prompt.txt',dest/'image-prompt.txt');shutil.copy2(folder/'rodin-prompt.txt',dest/'rodin-prompt.txt')
    record={**item,'generationId':job['generationId'],'settings':job['settings'],'referenceSha256':job['referenceSha256'],'rawSha256':job['modelSha256'],'adoption':'adopted; three-angle render inspected','style':'low-poly cartoon','optimization':'1024px base colour, matte material; normal/metal maps removed','sha256':hashlib.sha256((dest/'scene.glb').read_bytes()).hexdigest()}
    (dest/'manifest.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf8');adopted.append(record)

bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/ideal-city/scene.glb'))
original=[o.name for o in bpy.context.scene.objects];placements=[]
def native_box(worldlo,worldhi):
    return Vector((worldlo[0]/2,-worldhi[2]/2,(worldlo[1]-2.22)/2)),Vector((worldhi[0]/2,-worldlo[2]/2,(worldhi[1]-2.22)/2))
def place(key,name,lo,hi,props=None,remove=None):
    a,b=native_box(lo,hi);holder=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(holder)
    holder.location=(a+b)/2
    for k,v in (props or {}).items():holder[k]=v
    holder['rodinAsset']=key
    mesh=bpy.data.objects.new(name+' · Rodin geometry',templates[key]);bpy.context.collection.objects.link(mesh);mesh.parent=holder;mesh.scale=b-a
    for old in remove or []:
        if old.name in bpy.data.objects:bpy.data.objects.remove(old,do_unlink=True)
    placements.append({'asset':key,'name':name,'min':lo,'max':hi})
    return holder
def matching(prefix):return[bpy.data.objects[name] for name in original if name in bpy.data.objects and name.startswith(prefix)]
def replace(prefix,key,lo=None,hi=None,props=None):
    old=matching(prefix);assert old,prefix
    if lo is None:
        a,b=bounds(old);lo=[a.x*2,a.z*2+2.22,-b.y*2];hi=[b.x*2,b.z*2+2.22,-a.y*2]
    attrs={k:v for k,v in old[0].items() if k!='gltf2_animation_rest'};attrs.update(props or {})
    return place(key,prefix+' · Rodin',lo,hi,attrs,old)

# Nine shared social plots retain IDs, centres, footprint and height.
for p in source['groups']:
    key='office-tower' if p['slot'] in [0,1,2,3] else 'bridge-tower' if p['slot'] in [4,5] else 'service-building'
    replace(p['name'],key,[p['min'][0],2.22,p['min'][2]],p['max'])
replace('Low building 3','service-building')
replace('Colony ship','colony-core',[-7.1,2.22,-7.5],[7.1,39.03,3.7])
for i in [1,2]:replace('Ring road '+str(i),'ring-road')
replace('Central arrival terrace','landing-platform',[-7.5,4.8,1.3],[7.5,6.87,6.7])
for i,o in enumerate(matching('Arrival terrace')):
    a,b=bounds([o]);place('support-column','Arrival terrace support '+str(i),[a.x*2,2.22,-b.y*2],[b.x*2,6.62,-a.y*2],dict(o.items()),[o])
# The straight modules keep their road deck at the ring level; pillars meet land.
for side,lo,hi in [('west',[-25.7,2.22,-.63],[-14.3,5.08,.63]),('east',[16.1,2.22,-.855],[35.1,5.08,.855])]:
    old=[o for o in matching('Bridge') if (bounds([o])[0].x<0)==(side=='west')]
    place('straight-road','Bridge '+side,lo,hi,{'idealId':'bridge','idealCollection':'04_Roads'},old)
replace('Skywalk','skybridge',[6.4,5.8,-4.98],[14.4,9.12,-3.82])
replace('East port','orbital-station',[28.85,-3.6,-3.25],[42.35,7.1,3.25])
# Two distant islands stay outside the social/playable ground.
for o in list(bpy.context.scene.objects):
    if o.get('idealCollection')=='07_Environment':bpy.data.objects.remove(o,do_unlink=True)
for spec,key in zip(source['vehicles'],['airship-large','airship-medium','hover-car','cargo-ship']):
    replace(spec['name'],key,spec['min'],spec['max'])
# Shuttle sits on the new port; the four existing interactive flights are kept.
# The port remains clear for the large airship; no parked solitary shuttle.
# Island models are visual shells. Retain the authored walkable top unchanged.
island=matching('Main island')[0]
import bmesh
bm=bmesh.new();bm.from_mesh(island.data)
bmesh.ops.delete(bm,geom=[f for f in bm.faces if any(v.co.z<-.0001 for v in f.verts)],context='FACES')
bm.to_mesh(island.data);bm.free();island.data.update()
body=place('island-base','Rodin island rock shell',[-32.13,-16.24,-19.03],[32.23,2.18,19.07],{'idealId':'rodin-island-shell','idealCollection':'01_Island'})
shell=body.children[0];shell.data=shell.data.copy()
width=64.36;depth=38.10;cx=.05;cz=.02
def target_radius(angle):
    dx,dz=math.cos(angle),math.sin(angle);hits=[];poly=source['outline']
    for i,p in enumerate(poly):
        q=poly[(i+1)%len(poly)];ax,az=p[0]-cx,p[1]-cz;ex,ez=q[0]-p[0],q[1]-p[1];den=dx*ez-dz*ex
        if abs(den)<1e-8:continue
        t=(ax*ez-az*ex)/den;u=(ax*dz-az*dx)/den
        if t>0 and 0<=u<=1:hits.append(t)
    return min(hits) if hits else 1
# Constrain the rock shell inside the original rim; keep its topology and relief.
# The original flat cap covers generated grass details and remains the exact floor.
for v in shell.data.vertices:
    x=v.co.x*width;z=-v.co.y*depth;r=math.hypot(x,z);limit=target_radius(math.atan2(z,x))*.995
    if r>limit:v.co.x*=limit/r;v.co.y*=limit/r
shell.data.update()
for o in matching('Rock blade'):bpy.data.objects.remove(o,do_unlink=True)
replace('Engine','island-engines',[-20,-14.2,3],[21,-.3,15.5])

# The shared round-island layout expands depth without stretching houses or craft.
proportions=json.loads((ROOT/'src/scenes/ideal/ideal-proportions.json').read_text(encoding='utf8'))
depth_scale=proportions['depthScale']
for obj in list(bpy.context.scene.objects):
    if obj.parent:continue
    key=obj.get('rodinAsset');slot=obj.get('idealGroupSlot')
    if key:
        obj.location.y*=depth_scale
        if slot is not None and str(slot) in proportions['groupCenters']:
            x,z=proportions['groupCenters'][str(slot)];obj.location.x=x/2;obj.location.y=-z/2
        mesh=obj.children[0]
        if key in ['island-base','island-engines']:mesh.scale.y*=depth_scale
        if key=='ring-road':
            mesh.scale.y=mesh.scale.x;mesh.data=mesh.data.copy()
            width=proportions['roadWidth']/(mesh.scale.x*2)
            for v in mesh.data.vertices:
                radius=math.hypot(v.co.x,v.co.y)
                if radius>.001:
                    target=.5-(.501-radius)/(.501-.345)*width
                    v.co.x*=target/radius;v.co.y*=target/radius
            mesh.data.update()
        if obj.get('idealId')=='low-building-3':
            x,z=proportions['staticBuildingCenter'];obj.location.x=x/2;obj.location.y=-z/2
        if key=='colony-core':mesh.scale.x=mesh.scale.y=proportions['coreSquare']/2
        if key=='orbital-station':mesh.scale.x=mesh.scale.y=proportions['portSquare']/2
    elif obj.type=='MESH':
        a,b=bounds([obj]);center=(a+b)/2
        if obj.get('idealId')=='main-island':
            obj.location.y*=depth_scale
            for v in obj.data.vertices:v.co.y*=depth_scale
        else:obj.location.y+=center.y*(depth_scale-1)
    obj['idealLayoutVersion']=proportions['version']
# Preserve a grounded connection from the core to the relocated office tower.
for obj in bpy.context.scene.objects:
    if obj.get('rodinAsset')=='skybridge':
        obj.location.x=8.3/2;obj.location.y=5.6/2;obj.children[0].scale.x=4.0/2

bpy.context.view_layer.update()
for placement in placements:
    obj=bpy.data.objects.get(placement['name'])
    if obj:
        lo,hi=bounds([o for o in obj.children if o.type=='MESH'])
        placement['min']=[lo.x*2,lo.z*2+2.22,-hi.y*2];placement['max']=[hi.x*2,hi.z*2+2.22,-lo.y*2]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(OUT/'scene.glb'),export_format='GLB',use_selection=True,export_image_format='JPEG',export_jpeg_quality=88,export_extras=True,export_cameras=False,export_lights=False)
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'assembled.blend'))
(OUT/'manifest.json').write_text(json.dumps({'id':'ideal-lowpoly','provider':'Rodin Gen-2.5-Medium','style':'low-poly cartoon','assets':adopted,'placements':placements,'layoutTransform':proportions,'ground':'Original authored flat surface retained; generated island used as rock shell','sceneSha256':hashlib.sha256((OUT/'scene.glb').read_bytes()).hexdigest()},ensure_ascii=False,indent=2),encoding='utf8')
print('IDEAL_ASSEMBLED',len(adopted),'assets',len(placements),'placements',(OUT/'scene.glb').stat().st_size,'bytes')
