"""Eight approved, resumable valley assets. RODIN_API_KEY stays in process memory."""
from pathlib import Path
import generate_rodin_assets as runner

ROOT = Path(__file__).resolve().parents[1]
STYLE = ('Stylized hand-painted fantasy woodland game asset, matching a warm miniature forest diorama. '
         'Muted sage and olive moss, desaturated grey-green stone, warm weathered oak. '
         'Broad crafted shapes, graceful asymmetry, clean silhouette, matte surfaces, restrained carved details. '
         'No photoreal noise, no black outlines, no characters, no surrounding environment, no pedestal. ')
SPECS = {
 'mountain_crag': {'faces':20000,'prompt':STYLE+'One large isolated natural mountain massif, taller than wide, with an asymmetric broken summit and three staggered rocky shoulders. Massive fractured grey-green rock faces, irregular horizontal geological strata and wide mossy ledges. Rounded weathered edges but strong faceted planes. Broad low base blending into terrain, complete volume from every side. A believable rugged mountain, NOT a cone, NOT a pile of small pebbles. No trees, buildings, snow, waterfall or ground slab.'},
 'mountain_ridge': {'faces':20000,'prompt':STYLE+'One isolated mountain ridge with one broad high off-center summit and two lower irregular buttresses. Wide asymmetrical silhouette, layered sedimentary grey sage rock, deep vertical fractures, stepped shelves with restrained olive moss. Height about equal to width, sloping broken shoulders, grounded broad base, complete back and sides. NOT a cone or a thin backdrop. No trees, buildings, snow, waterfall or ground slab.'},
 'letter_tree': {'faces':12000,'prompt':STYLE+'One handcrafted forest gathering lamp support, a slender gently twisting wooden tree trunk with FOUR clearly separated short upward branches ending in rounded empty attachment tips. Warm carved oak bark, subtle spiral wood grain, spreading short roots fitting a compact flat base. Small wooden letterbox built into the lower trunk. Height 4 metres, branch spread 1.6 metres. NO leaves, NO foliage, NO lamps, NO light bulbs: this is the wooden support only. No writing, no accessories, no surrounding ground.'},
 'curved_seat': {'faces':9000,'prompt':STYLE+'One low gently curved two-tier stone sitting step, a short 45-degree arc section. Pale warm limestone blocks with readable staggered masonry joints, rounded weathered corners and tiny moss-filled seams. Width 4 metres, depth .9 metres, maximum height .55 metres. Two continuous flat walkable horizontal levels. Low curved seating terrace, no backrest, no railing, no vegetation, no plinth, no extra objects.'},
 'wood_bench': {'faces':10000,'prompt':STYLE+'One inviting woodland bench, three broad warm oak seat planks, gently curved low timber backrest with a small carved leaf ornament at the center. Two sturdy grey-green stone support feet, rounded worn corners, tasteful visible wood grain, restrained moss at the stone bottoms. Width 2.5 metres, depth .6 metres, seat height .55 metres, overall height 1.05 metres. No trees, cushions, accessories, plants or ground slab.'},
 'stone_ring': {'faces':6000,'prompt':STYLE+'One very flat gently curved section of a forest stone path, seven pale limestone paving slabs arranged in a single contiguous shallow arc of 45 degrees. Distinct irregular slab edges, thin narrow moss seams, uneven natural shapes but a level top surface. Arc length 3 metres, radial depth .45 metres, thickness .08 metres. Low ground paving, NOT stairs, NOT a wall, NOT a circular disk. No plants, roots, soil block or extra objects.'},
 'notice_board': {'faces':12000,'prompt':STYLE+'One small freestanding forest notice board. Two sturdy weathered oak posts, warm timber frame around a rectangular flat dark sage wooden bulletin surface, small pitched wooden shingle canopy. Three plain cream paper sheets pinned neatly to the front with no writing. A small carved leaf at the top. Overall height 2 metres and width 1.3 metres, shallow depth .35 metres. Visible complete backside, flat feet. No legible text, no people, no ground slab, no surrounding props.'},
 'viewing_frame': {'faces':9000,'prompt':STYLE+'One low freestanding landscape viewing frame for a woodland viewpoint. Two warm weathered oak posts supporting an EMPTY wide rectangular aperture, smooth carved wood top beam with a small leaf relief, narrow bottom sill. Opening clearly empty and see-through, no glass, no panel. Overall width 2.2 metres and height 1.45 metres, depth .2 metres, flat feet. Subtle oak grain and rounded hand-hewn joints. No roof, text, landscape, stone foundation or extra objects.'},
}

if __name__ == '__main__':
 for spec in SPECS.values():
  assert len(spec['prompt']) <= 1024
 runner.ASSETS = ROOT/'assets'/'rodin-valley'
 try:
  runner.main(SPECS,ROOT/'records'/'rodin-valley')
 except Exception as error:
  print(type(error).__name__+': interrupted; use saved task records, never blindly resubmit.',flush=True)
  raise SystemExit(1)
