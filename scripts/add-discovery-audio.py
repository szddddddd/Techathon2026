"""Add original, deterministic synthesized ambience; these are not field recordings.

The stream-copy video path preserves all original VP9 frames. Filtered noise
suggests leaves/water; clip 5 adds short generated crackles near its campfire.
Requires numpy and imageio_ffmpeg from the local Python runtime.
"""
from pathlib import Path
import json
import subprocess
import sys
import tempfile
import wave

import imageio_ffmpeg
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets' / 'discovery'
RATE = 48000
DURATION = 12
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def ambience(index):
    rng = np.random.default_rng(77150 + index)
    t = np.arange(RATE * DURATION) / RATE
    spectrum = np.fft.rfft(rng.normal(size=len(t)))
    frequency = np.fft.rfftfreq(len(t), 1 / RATE)
    # Soft broadband rustle without the harsh hiss of unfiltered white noise.
    shape = (frequency / (frequency + 180)) / np.sqrt(1 + frequency / 350)
    shape *= np.exp(-(frequency / 4300) ** 2)
    rustle = np.fft.irfft(spectrum * shape, len(t))
    rustle /= max(np.std(rustle), 1e-9)
    sway = .78 + .12 * np.sin(t * .73 + index) + .08 * np.sin(t * 1.7)
    sound = rustle * sway * (.022 if index in [3, 6] else .014)
    # A gentle, entirely generated two-note bird-like call in woodland clips.
    if index in [1, 2, 4]:
        for start in [2.1 + index * .22, 7.8 + index * .12]:
            phase_t = np.clip(t - start, 0, .21)
            envelope = np.where((t >= start) & (t <= start + .21), np.sin(phase_t / .21 * np.pi) ** 2, 0)
            sound += .016 * envelope * np.sin(2 * np.pi * (2250 * phase_t + 1300 * phase_t ** 2))
    if index == 5:
        for start in rng.uniform(.3, 11.5, 25):
            offset = max(0, int(start * RATE))
            length = min(int(RATE * .045), len(sound) - offset)
            sound[offset:offset + length] += rng.normal(size=length) * np.exp(-np.arange(length) / (RATE * .006)) * .06
    fade = np.minimum(np.minimum(t / .4, (DURATION - t) / .4), 1)
    sound *= np.maximum(fade, 0)
    # Slight stereo width, with a short delay rather than independent noise beds.
    stereo = np.column_stack([sound, .91 * np.roll(sound, 101)])
    return np.clip(stereo, -.7, .7)


def main():
    indices = [int(x) for x in sys.argv[1:]] or list(range(1, 7))
    results = []
    with tempfile.TemporaryDirectory(prefix='forest-original-audio-') as temporary:
        for index in indices:
            original = DEST / f'video-{index}.webm'
            wav_path = Path(temporary) / f'ambience-{index}.wav'
            audio = ambience(index)
            with wave.open(str(wav_path), 'wb') as output:
                output.setnchannels(2)
                output.setsampwidth(2)
                output.setframerate(RATE)
                output.writeframes((audio * 32767).astype('<i2').tobytes())
            muxed = original.with_name(f'video-{index}-audio.webm')
            subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(original), '-i', str(wav_path),
                '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'libopus', '-b:a', '64k',
                '-t', str(DURATION), '-metadata', 'comment=Original synthesized ambience; not a field recording', str(muxed)], check=True)
            muxed.replace(original)
            result = {'id': index, 'file': original.name, 'audio': 'Opus stereo, 48 kHz', 'durationSeconds': DURATION,
                'source': 'Original deterministic filtered noise, generated calls; clip 5 has generated fire crackles',
                'video': 'VP9 stream copy; original frames unchanged', 'peak': float(np.max(np.abs(audio))),
                'rms': float(np.sqrt(np.mean(audio ** 2)))}
            results.append(result)
            print(json.dumps(result))
    previous = []
    manifest = DEST / 'audio-provenance.json'
    if manifest.exists():
        previous = json.loads(manifest.read_text(encoding='utf-8')).get('clips', [])
    merged = {x['id']: x for x in previous}
    merged.update({x['id']: x for x in results})
    manifest.write_text(json.dumps({'description': 'Original synthesized sound design, not location audio. Initial playback is muted.',
        'script': 'scripts/add-discovery-audio.py', 'clips': list(merged.values())}, indent=2, ensure_ascii=False), encoding='utf-8')


if __name__ == '__main__':
    main()
