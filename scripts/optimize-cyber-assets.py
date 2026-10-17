"""Retain original Rodin GLBs; resize embedded scene textures without changing geometry."""
import hashlib
import io
import json
import math
import struct
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'assets' / 'rodin-cyber'
results = []
selected = set(sys.argv[1:])
for folder in sorted(ROOT.iterdir()):
    if selected and folder.name not in selected:
        continue
    if not folder.is_dir() or not (folder / 'source.glb').exists():
        continue
    raw = (folder / 'source.glb').read_bytes()
    json_length = struct.unpack_from('<I', raw, 12)[0]
    doc = json.loads(raw[20:20 + json_length])
    binary_start = 20 + json_length + 8
    replacements = {}
    texture_sizes = []
    for image in doc.get('images', []):
        index = image['bufferView']
        view = doc['bufferViews'][index]
        start = binary_start + view.get('byteOffset', 0)
        bitmap = Image.open(io.BytesIO(raw[start:start + view['byteLength']]))
        original_size = bitmap.size
        bitmap.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        stream = io.BytesIO()
        diffuse = 'diffuse' in image.get('name', '').lower()
        if diffuse and bitmap.mode == 'RGB':
            bitmap.save(stream, 'JPEG', quality=93, subsampling=0, optimize=True)
            image['mimeType'] = 'image/jpeg'
        else:
            bitmap.save(stream, 'PNG', optimize=True)
        replacements[index] = stream.getvalue()
        texture_sizes.append({'name': image.get('name'), 'source': original_size, 'scene': bitmap.size})
    payload = bytearray()
    for index, view in enumerate(doc['bufferViews']):
        start = binary_start + view.get('byteOffset', 0)
        data = replacements.get(index, raw[start:start + view['byteLength']])
        payload.extend(b'\0' * (-len(payload) % 4))
        view['byteOffset'] = len(payload)
        view['byteLength'] = len(data)
        payload.extend(data)
    payload.extend(b'\0' * (-len(payload) % 4))
    doc['buffers'][0]['byteLength'] = len(payload)
    doc.setdefault('asset', {})['generator'] = 'Hyper3D Rodin; scene textures resized by optimize-cyber-assets.py'
    encoded = json.dumps(doc, separators=(',', ':')).encode('utf8')
    encoded += b' ' * (-len(encoded) % 4)
    result = struct.pack('<4sII', b'glTF', 2, 12 + 8 + len(encoded) + 8 + len(payload))
    result += struct.pack('<I4s', len(encoded), b'JSON') + encoded
    result += struct.pack('<I4s', len(payload), b'BIN\0') + payload
    (folder / 'scene.glb').write_bytes(result)
    manifest = json.loads((folder / 'manifest.json').read_text(encoding='utf8'))
    manifest.update({
        'sourceSha256': hashlib.sha256(raw).hexdigest(),
        'sceneSha256': hashlib.sha256(result).hexdigest(),
        'sourceBytes': len(raw), 'sceneBytes': len(result),
        'rotationY': manifest.get('rotationY', math.pi / 2 if folder.name == 'locomotive' else 0),
        'optimization': {'geometry': 'unchanged source mesh (approximately 30000 triangles)', 'textures': texture_sizes, 'diffuse': 'JPEG quality 93, no chroma subsampling', 'normalAndMetalRough': 'PNG'},
        'adoption': manifest.get('adoption', 'pending visual inspection'),
    })
    (folder / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    results.append({'id': folder.name, 'sourceBytes': len(raw), 'sceneBytes': len(result)})
    print(f'{folder.name}: {len(raw):,} -> {len(result):,} bytes')
(ROOT / ('optimization-' + '-'.join(sorted(selected)) + '.json' if selected else 'optimization.json')).write_text(json.dumps({'assets': results, 'sourceBytes': sum(r['sourceBytes'] for r in results), 'sceneBytes': sum(r['sceneBytes'] for r in results)}, indent=2) + '\n', encoding='utf8')
