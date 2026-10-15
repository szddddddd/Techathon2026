"""Resumable four-companion generation. API credentials stay in process memory."""
import argparse
import getpass
import hashlib
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT / 'records' / 'rodin-friends'
ASSETS = ROOT / 'assets' / 'rodin-friends'
API = 'https://api.hyper3d.com/api/v2'
STYLE = ('One friendly upright animal companion for a cozy miniature woodland game. '
         'Stylized hand-painted low-poly broad sculpted shapes, matte clay-like surfaces, '
         'soft rounded silhouette, restrained warm natural colors. Black oval expressive eyes, '
         'simple muzzle, short independent arms, two clearly separated feet flat on the same ground plane. '
         'Full body including ears and tail, relaxed standing pose, readable at small scale. '
         'No realistic fur strands, no environment, no pedestal, no text. ')
SPECS = {
    'kangaroo': {'prompt': STYLE + 'Reconstruct only the yellow Meituan Tuantuan kangaroo character in the reference. Preserve long rounded upright ears, black oval nose, white belly and pouch, thick curved tail behind, friendly proportions. Both feet planted. Remove the street and background.', 'image': ASSETS / 'reference' / 'kangaroo-input.png'},
    'fox': {'prompt': STYLE + 'A terracotta orange fox with cream muzzle and chest, triangular ears, dark brown paws, a large bushy cream-tipped tail, small olive canvas backpack with two straps. Gentle adventurous personality. Toy-like, same chunky silhouette family as a cute kangaroo mascot.'},
    'rabbit': {'prompt': STYLE + 'A cream white rabbit with long rounded upright ears, pink inner ears, tiny pink nose and round cotton tail. A simple muted sage green scarf around the neck with one short loose end. Gentle sleepy smile. Toy-like chunky rounded proportions.'},
    'bear': {'prompt': STYLE + 'A warm cocoa brown bear with small rounded ears, honey beige muzzle and belly, short round tail. A small terracotta leather crossbody satchel at one hip with a visible shoulder strap. Kindly quiet expression. Toy-like chunky rounded proportions.'},
}


def now():
    return datetime.now(timezone.utc).isoformat()


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf8')
    temp.replace(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--only', nargs='+', choices=list(SPECS), default=list(SPECS))
    args = parser.parse_args()
    key = os.environ.get('RODIN_API_KEY') or getpass.getpass('Rodin API token (runtime only): ')
    session = requests.Session()
    session.headers['Authorization'] = 'Bearer ' + key

    def request(endpoint, **kwargs):
        response = session.request('GET' if endpoint == 'check_balance' else 'POST', API + '/' + endpoint, timeout=(25, 150), **kwargs)
        data = response.json()
        if not response.ok or data.get('error'):
            raise RuntimeError(f'{endpoint}: HTTP {response.status_code} ' + str(data).replace(key, '[REDACTED]'))
        return data

    before = request('check_balance')
    if not (RECORDS / 'balance-before.json').exists():
        save(RECORDS / 'balance-before.json', {'at': now(), **before})
    print('Authenticated; credits:', before.get('balance'), flush=True)
    jobs = {}
    pending = []
    for name in args.only:
        path = RECORDS / (name + '.json')
        if path.exists():
            jobs[name] = json.loads(path.read_text(encoding='utf8'))
            if not jobs[name].get('submission', {}).get('uuid'):
                raise RuntimeError(name + ': ambiguous earlier submission; refusing to submit again')
        else:
            pending.append(name)
    if before.get('balance', 0) < len(pending) * .5:
        raise RuntimeError('Insufficient credits for selected jobs')
    deadline = time.monotonic() + 3600
    last_poll = {}
    while time.monotonic() < deadline:
        active = [name for name, record in jobs.items() if record['state'] not in ('downloaded', 'failed')]
        if pending and len(active) < 2:
            name = pending.pop(0)
            spec = SPECS[name]
            params = {'tier': 'Gen-2.5-Medium', 'mesh_mode': 'Raw', 'quality_override': '10000', 'geometry_file_format': 'glb', 'material': 'PBR', 'texture_mode': 'medium', 'seed': str(826 + list(SPECS).index(name)), 'prompt': spec['prompt']}
            assert len(params['prompt']) <= 1024
            record = {'name': name, 'provider': 'Hyper3D Rodin', 'state': 'submitting', 'started_at': now(), 'parameters': params}
            if spec.get('image'):
                record['input'] = {'path': str(spec['image'].relative_to(ROOT)).replace('\\', '/'), 'sha256': hashlib.sha256(spec['image'].read_bytes()).hexdigest()}
            save(RECORDS / (name + '.json'), record)
            files = [(k, (None, v)) for k, v in params.items()]
            if spec.get('image'):
                files.append(('images', (spec['image'].name, spec['image'].read_bytes(), 'image/png')))
            # Paid submission is never automatically retried, even on a timeout.
            response = request('rodin', files=files)
            if not response.get('uuid'):
                raise RuntimeError(name + ': missing task UUID')
            record.update(state='submitted', submission=response)
            jobs[name] = record
            save(RECORDS / (name + '.json'), record)
            print(name + ': accepted; consumed=' + str(response.get('consumed')), flush=True)
        for name, record in jobs.items():
            if record['state'] in ('downloaded', 'failed') or time.monotonic() - last_poll.get(name, 0) < 20:
                continue
            last_poll[name] = time.monotonic()
            status = request('status', json={'subscription_key': record['submission']['jobs']['subscription_key']})
            states = [job['status'] for job in status.get('jobs', [])]
            if states != record.get('states'):
                print(name + ': ' + str(states), flush=True)
            record.update(states=states, updated_at=now())
            save(RECORDS / (name + '.json'), record)
            if 'Failed' in states:
                record['state'] = 'failed'
                save(RECORDS / (name + '.json'), record)
                continue
            if not states or not all(state == 'Done' for state in states):
                continue
            downloads = request('download', json={'task_uuid': record['submission']['uuid']})
            out = ASSETS / name
            out.mkdir(parents=True, exist_ok=True)
            entries = []
            for item in downloads.get('list', []):
                target = out / Path(item['name']).name
                if target.suffix.lower() not in ('.glb', '.png', '.jpg', '.jpeg', '.webp'):
                    continue
                # Never forward the API authorization header to the asset host.
                for attempt in range(3):
                    try:
                        response = requests.get(item['url'], timeout=(25, 240))
                        response.raise_for_status()
                        break
                    except requests.RequestException:
                        if attempt == 2:
                            raise
                        time.sleep(3)
                target.write_bytes(response.content)
                if target.suffix.lower() == '.glb':
                    (out / 'scene.glb').write_bytes(response.content)
                entries.append({'file': str(target.relative_to(ROOT)).replace('\\', '/'), 'bytes': target.stat().st_size, 'sha256': hashlib.sha256(response.content).hexdigest()})
            if not any(entry['file'].endswith('.glb') for entry in entries):
                raise RuntimeError(name + ': no GLB result')
            record.update(state='downloaded', files=entries, completed_at=now())
            save(RECORDS / (name + '.json'), record)
            print(name + ': downloaded', flush=True)
        if not pending and all(record['state'] in ('downloaded', 'failed') for record in jobs.values()):
            break
        time.sleep(5)
    save(RECORDS / 'balance-after.json', {'at': now(), **request('check_balance')})
    records = {path.stem: json.loads(path.read_text(encoding='utf8')) for path in RECORDS.glob('*.json') if path.stem in SPECS}
    summary = {'assets': {name: {'state': record['state'], 'uuid': record.get('submission', {}).get('uuid'), 'consumed': record.get('submission', {}).get('consumed'), 'files': record.get('files', [])} for name, record in records.items()}, 'consumed': sum(record.get('submission', {}).get('consumed', 0) for record in records.values())}
    save(RECORDS / 'summary.json', summary)
    print('Selected jobs complete; total recorded credits:', summary['consumed'], flush=True)
    if any(record['state'] != 'downloaded' for record in jobs.values()):
        raise SystemExit(1)


if __name__ == '__main__':
    try:
        main()
    except requests.RequestException as error:
        print(type(error).__name__ + ': network failed; accepted tasks are resumable without resubmission', flush=True)
        raise SystemExit(1)
    except Exception as error:
        print(type(error).__name__ + ': ' + str(error), flush=True)
        raise SystemExit(1)
