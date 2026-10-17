"""Inspect the adopted mesh surfaces, not only bounding rectangles."""
import bpy, json
from pathlib import Path
from mathutils.bvhtree import BVHTree
ROOT=Path.cwd();bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets/ideal-city/lowpoly/assembled.blend'))
def bvh(parent):
    vertices=[];polygons=[]
    for mesh in parent.children_recursive:
        if mesh.type!='MESH':continue
        offset=len(vertices);vertices.extend([mesh.matrix_world@v.co for v in mesh.data.vertices]);polygons.extend([tuple(offset+i for i in p.vertices) for p in mesh.data.polygons])
    return BVHTree.FromPolygons(vertices,polygons)
roads=[o for o in bpy.context.scene.objects if o.get('rodinAsset') in ['ring-road','straight-road']]
buildings=[o for o in bpy.context.scene.objects if o.get('idealGroupSlot') is not None or o.get('idealId')=='low-building-3']
road_trees=[(r,bvh(r)) for r in roads];collisions=[]
for b in buildings:
    tree=bvh(b)
    for road,r in road_trees:
        overlap=tree.overlap(r)
        if overlap:collisions.append({'building':b.name,'road':road.name,'intersections':len(overlap)})
result={'buildings':len(buildings),'roads':len(roads),'collisions':collisions}
(ROOT/'.test-results/ideal-assets/road-clearance.json').write_text(json.dumps(result,indent=2),encoding='utf8');print('ROAD_CLEARANCE',json.dumps(result))
assert not collisions,'Building and road meshes still intersect'
