"""Execute the approved-in-session five-asset expansion plan. Runtime-only credentials."""
from pathlib import Path
from generate_rodin_assets import main, STYLE

SPECS={
 'cottage':{'faces':20000,'prompt':STYLE+'One complete small medieval forest timber-frame cottage. Ivory lime plaster walls, warm dark oak structural beams, steep terracotta red-orange shingle gable roof, small attached rear side wing with muted teal shingles. Front-facing wooden door under a small porch, shallow two-step stone entry, a few warm glass windows, simple stone chimney. Detailed but clean architectural geometry. Visible full cabin, complete back and sides, compact rectangular footprint, no surrounding trees, no plants, no fences, no ground terrain, no attached furniture or props.'},
 'tent':{'faces':12000,'prompt':STYLE+'One small medieval triangular camping tent, pitched A-frame, faded warm sage and cream linen canvas, delicate seams and broad fabric folds, two wooden end poles, open front doorway with rolled side flaps and dark empty interior. Compact footprint, short close-to-tent pegs, no long guy ropes, no campfire, no bed, no accessories, no surrounding ground. Sturdy readable proportions, symmetrical structure.'},
 'barrel':{'faces':5000,'prompt':STYLE+'One upright medieval oak storage barrel, bulging twelve wooden staves, three dark iron hoop bands, fitted round plank lid, subtle carved wood grain, warm weathered brown oak. Closed complete barrel standing flat, no contents, no spout, no extra objects.'},
 'crate':{'faces':5000,'prompt':STYLE+'One compact medieval closed wooden supply crate. Warm weathered oak planks, sturdy corner battens, one diagonal wooden brace across the front, dark small nail heads, broad clean planes and subtle hand-painted wood grain. Complete cube with closed top and flat bottom, no labels, no symbols, no contents, no extra objects.'},
 'chest':{'faces':9000,'prompt':STYLE+'One medieval treasure chest with a gently arched closed lid. Warm aged oak planks, restrained worn brass edge bindings and two curved brass straps, a centered brass lock plate with keyhole, small metal carrying handles at the sides. Hand-painted muted warm brown and antique brass, no gold coins, no jewels, no ornaments, no base, no other props. Complete coherent solid construction.'}
}

if __name__=='__main__':
 main(SPECS,Path(__file__).resolve().parents[1]/'records'/'rodin-expansion')
