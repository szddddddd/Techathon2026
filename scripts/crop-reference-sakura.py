"""Cut the first two rows of the supplied 3 x 5 cherry-tree sheet, in reading order."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[1] / 'assets' / 'rodin-fuji'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('input', nargs='?', default=root / 'sakura-reference-six' / 'supplied-sheet.png')
args = parser.parse_args()
source = Path(args.input)
image = Image.open(source).convert('RGB')
if image.size != (1080, 1600):
    raise ValueError('This crop layout is for the supplied 1080 x 1600 sheet.')
archive = root / 'sakura-reference-six'
archive.mkdir(parents=True, exist_ok=True)
if source.resolve() != (archive / 'supplied-sheet.png').resolve():
    shutil.copyfile(source, archive / 'supplied-sheet.png')
items = []
contact = Image.new('RGB', (1080, 720), '#25222c')
draw = ImageDraw.Draw(contact)
for index in range(6):
    column, row = index % 3, index // 3
    box = (column * 360, row * 320, (column + 1) * 360, (row + 1) * 320)
    folder = root / f'sakura-reference-{index + 1:02d}'
    folder.mkdir(parents=True, exist_ok=True)
    crop = image.crop(box)
    crop.save(folder / 'crop.png')
    reference = ImageOps.pad(crop, (720, 720), method=Image.Resampling.LANCZOS,
                             color=(0, 0, 0), centering=(.5, .5))
    reference.save(folder / 'reference.png')
    items.append(dict(id=folder.name, order=index + 1, row=row + 1, column=column + 1,
                      cropBox=box, referenceSha256=hashlib.sha256((folder / 'reference.png').read_bytes()).hexdigest()))
    reference.thumbnail((350, 330))
    contact.paste(reference, (column * 360 + (360 - reference.width) // 2, row * 360))
    draw.text((column * 360 + 12, row * 360 + 337),
              f'0{index + 1} / row {row + 1}, col {column + 1}', fill='white')
contact.save(archive / 'six-crops.png')
(archive / 'crops.json').write_text(json.dumps(dict(
    source='supplied-sheet.png', sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(),
    sourceSize=image.size, order='left-to-right, top-to-bottom; first two rows only', items=items
), indent=2), encoding='utf8')
print('Cropped six trees; original pixels retained, references padded to 720 x 720.')
