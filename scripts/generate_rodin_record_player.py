"""Generate a resumable woodland record player using the existing Rodin pipeline."""
import generate_rodin_assets as pipeline

if __name__ == '__main__':
    pipeline.main(specs={'record-player': {
        'faces': 18000,
        'prompt': ('Stylized hand-painted woodland diorama game asset, muted sage green and warm walnut, matte painted surfaces, elegant broad shapes, matching cozy forest cottages. No environment or pedestal. ') + (
            'One beautiful vintage portable vinyl record player on four short tapered wooden legs. '
            'Open walnut suitcase cabinet with softly rounded corners, warm honey wood edge trim, '
            'sage green felt interior in the open hinged lid. Large clearly visible black vinyl disc '
            'lying horizontally on the turntable with fine concentric grooves and a cream circular label. '
            'A delicate curved brass tonearm with a small cartridge rests over the edge of the disc. '
            'Front woven beige speaker grille, two small aged brass knobs, leather carrying handle, '
            'tiny brass hinges and latches. Compact elegant proportions, fully assembled grounded object. '
            'No horn, text or extra records.'
        )
    }}, records=pipeline.ROOT/'records'/'rodin-record-player')
