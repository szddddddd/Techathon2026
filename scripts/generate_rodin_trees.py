"""Two approved woodland variants; credentials are requested at runtime only."""
from pathlib import Path
import generate_rodin_assets as runner

ROOT = Path(__file__).resolve().parents[1]
STYLE = runner.STYLE
SPECS = {
    'silver_birch': {'faces': 12000, 'prompt': STYLE + 'One graceful woodland birch tree, taller than wide. Two slender gently curved warm ivory and pale brown trunks with subtle bark markings, branching visibly beneath an airy crown. Five separated irregular rounded clusters of dusty sage green foliage arranged in staggered layers, small gaps between foliage masses. Soft sculpted low-poly leaf surfaces, no individual flat leaf cards. Short compact spreading roots at the foot, no grass base or ground slab. Complete freestanding tree with a distinct light vertical silhouette.'},
    'field_maple': {'faces': 14000, 'prompt': STYLE + 'One compact old field maple tree with a broad low asymmetrical umbrella crown. A short warm umber forked trunk, visible gently twisting branches and compact low roots. Seven broad rounded softly faceted foliage masses in muted olive green with restrained pale yellow-green tips. Crown is noticeably wider than tall, with an irregular stepped outline and visible small gaps between branches. Hand-painted soft color variation, no individual flat leaf cards, no grass base or ground slab. Complete freestanding tree.'},
}

if __name__ == '__main__':
    for spec in SPECS.values():
        assert len(spec['prompt']) <= 1024
    runner.ASSETS = ROOT / 'assets' / 'rodin-trees'
    runner.main(SPECS, ROOT / 'records' / 'rodin-trees')
