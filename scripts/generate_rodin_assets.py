"""Generate four resumable scene props. Credentials are read at runtime, never saved."""
import getpass, hashlib, json, os, time
from pathlib import Path
from datetime import datetime, timezone
import requests

ROOT=Path(__file__).resolve().parents[1]
RECORDS=ROOT/'records'/'rodin'
ASSETS=ROOT/'assets'/'rodin'
API='https://api.hyper3d.com/api/v2'
STYLE=('Stylized hand-painted low-poly fantasy forest game asset, matching a cozy miniature woodland diorama. '
       'Muted olive and sage green, warm umber wood, moss green and desaturated gray stone. '
       'Readable elegant silhouette, crafted broad shapes, subtle painted color variation, matte surfaces, '
       'no photographic noise, no black outlines, no people, no animals, no environment, no pedestal. ')
SPECS={
 'cart': {'faces':16000,'prompt':STYLE+'One medieval wooden two-wheeled handcart. Warm weathered oak plank bed and slatted side walls, two large clearly separated spoked wooden wheels on one axle, iron tire bands, two long pull shafts pointing forward. A few burlap grain sacks and small crates inside. Both wheels stand on the ground. Complete believable structural assembly, no fused wheels.'},
 'tree': {'faces':18000,'prompt':STYLE+'One mature deciduous broadleaf oak tree. A thick gently twisting trunk with visible branching, low spreading roots, an airy asymmetrical crown with five large layered rounded masses of muted sage olive foliage. Clear branching silhouette under the crown, irregular foliage contour with sculpted leaf clusters, compact canopy, no ground slab.'},
 'rock': {'faces':4500,'prompt':STYLE+'One natural compact cluster of three weathered angular river boulders of different sizes. Chipped faceted gray-green stone, broad planes and fractures, soft olive moss covering the upper surfaces and a few tiny crevices. Asymmetrical silhouette, mostly horizontal, grounded flat bottom, no surrounding landscape.'},
 'grass': {'faces':2500,'prompt':STYLE+'One small dense tuft of woodland grass and fern leaves. Gracefully arching broad tapered grass blades, distinct separated curled fern fronds, olive sage green with pale yellow-green tips, a rich but simple asymmetric silhouette, thin clustered root base, no pot, no earth block, no flowers.'}
}
def save(path,obj):
 path.parent.mkdir(parents=True,exist_ok=True);temp=path.with_suffix('.tmp');temp.write_text(json.dumps(obj,ensure_ascii=False,indent=2),encoding='utf8');temp.replace(path)
def now():return datetime.now(timezone.utc).isoformat()
def main(specs=None, records=None):
 global SPECS, RECORDS
 if specs is not None:SPECS=specs
 if records is not None:RECORDS=records
 key=os.environ.get('RODIN_API_KEY') or getpass.getpass('Rodin API token (runtime only): ')
 session=requests.Session();session.headers['Authorization']='Bearer '+key
 def request(endpoint,**kw):
  response=session.request('GET' if endpoint=='check_balance' else 'POST',API+'/'+endpoint,timeout=(25,150),**kw)
  try:data=response.json()
  except ValueError:raise RuntimeError(f'{endpoint}: HTTP {response.status_code}, non-JSON response')
  if not response.ok or data.get('error'):raise RuntimeError(f'{endpoint}: HTTP {response.status_code} '+str(data).replace(key,'[REDACTED]'))
  return data
 balance=request('check_balance');
 if not (RECORDS/'balance-before.json').exists():save(RECORDS/'balance-before.json',{'at':now(),**balance})
 print('Authenticated. Available credits:',balance.get('balance'),flush=True)
 jobs={};pending=[]
 for name,spec in SPECS.items():
  path=RECORDS/(name+'.json')
  if path.exists():
   r=json.loads(path.read_text(encoding='utf8'));jobs[name]=r
   if not r.get('submission',{}).get('uuid'):raise RuntimeError(name+': previous ambiguous submission; inspect before retrying')
  else:pending.append(name)
 if balance.get('balance',0)<len(pending)*.5:raise RuntimeError('Not enough credits for planned base-tier jobs')
 deadline=time.monotonic()+2400
 while time.monotonic()<deadline:
  active=[n for n,r in jobs.items() if r['state'] not in ('downloaded','failed')]
  if pending and len(active)<2:
   name=pending.pop(0);spec=SPECS[name];params={'tier':'Gen-2.5-Medium','mesh_mode':'Raw','quality_override':str(spec['faces']),'geometry_file_format':'glb','material':'PBR','texture_mode':'medium','seed':str(428+list(SPECS).index(name)),'prompt':spec['prompt']}
   record={'name':name,'provider':'Hyper3D Rodin','state':'submitting','started_at':now(),'parameters':params}
   save(RECORDS/(name+'.json'),record)
   # Paid submissions are deliberately never retried after an ambiguous network failure.
   response=request('rodin',files={k:(None,v) for k,v in params.items()})
   if not response.get('uuid'):raise RuntimeError(name+': missing task UUID')
   record.update(state='submitted',submission=response);jobs[name]=record;save(RECORDS/(name+'.json'),record)
   print(name+': accepted; consumed='+str(response.get('consumed')),flush=True)
  for name,record in jobs.items():
   if record['state'] in ('downloaded','failed'):continue
   if time.monotonic()-record.get('_last_poll',0)<20:continue
   record['_last_poll']=time.monotonic()
   status=request('status',json={'subscription_key':record['submission']['jobs']['subscription_key']})
   states=[j['status'] for j in status.get('jobs',[])]
   if states!=record.get('states'):print(name+': '+str(states),flush=True)
   record['states']=states;record['updated_at']=now();save(RECORDS/(name+'.json'),{k:v for k,v in record.items() if not k.startswith('_')})
   if 'Failed' in states:
    record['state']='failed';save(RECORDS/(name+'.json'),record);continue
   if not states or not all(s=='Done' for s in states):continue
   downloads=request('download',json={'task_uuid':record['submission']['uuid']})
   out=ASSETS/name;out.mkdir(parents=True,exist_ok=True);entries=[]
   for item in downloads.get('list',[]):
    filename=Path(item['name']).name
    if not filename.lower().endswith(('.glb','.png','.jpg','.jpeg','.webp')):continue
    target=out/filename
    # Do not send the account Authorization header to signed asset hosts.
    for attempt in range(3):
     try:
      download_response=requests.get(item['url'],stream=True,timeout=(25,240));download_response.raise_for_status();break
     except requests.RequestException:
      if attempt==2:raise
      time.sleep(3)
    with download_response as r:
     r.raise_for_status()
     with target.open('wb') as f:
      for chunk in r.iter_content(1024*1024):f.write(chunk)
    if target.suffix.lower()=='.glb':(out/'scene.glb').write_bytes(target.read_bytes())
    entries.append({'file':str(target.relative_to(ROOT)).replace('\\','/'),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
   if not any(e['file'].lower().endswith('.glb') for e in entries):raise RuntimeError(name+': no GLB in result')
   record.update(state='downloaded',files=entries,completed_at=now());save(RECORDS/(name+'.json'),{k:v for k,v in record.items() if not k.startswith('_')});print(name+': downloaded '+str([(e['file'],e['bytes']) for e in entries]),flush=True)
  if not pending and all(r['state'] in ('downloaded','failed') for r in jobs.values()):break
  time.sleep(5)
 balance=request('check_balance');save(RECORDS/'balance-after.json',{'at':now(),**balance})
 summary={'assets':{n:{'state':r['state'],'uuid':r['submission']['uuid'],'consumed':r['submission'].get('consumed'),'files':r.get('files',[])} for n,r in jobs.items()},'consumed':sum(r['submission'].get('consumed',0) for r in jobs.values())};save(RECORDS/'summary.json',summary);print(json.dumps(summary),flush=True)
 if any(r['state']!='downloaded' for r in jobs.values()):raise SystemExit(1)
if __name__=='__main__':
 try:main()
 except requests.RequestException as error:print(type(error).__name__+': network request failed; saved tasks can be resumed without resubmission',flush=True);raise SystemExit(1)
 except Exception as error:print(type(error).__name__+': '+str(error),flush=True);raise SystemExit(1)
