import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const {version} = JSON.parse(await fs.readFile('package.json', 'utf8'));
if (execFileSync('git', ['status', '--porcelain'], {encoding: 'utf8'}).trim()) {
  throw new Error('Commit the release sources before generating the release manifest.');
}
const folder = 'output/releases';
const apk = `WeRoam-${version}-android.apk`;
await fs.mkdir(folder, {recursive: true});
await fs.copyFile(path.join('downloads', apk), path.join(folder, apk));
const files = [];
for (const name of [`WeRoam-${version}-windows-x64-setup.exe`, apk]) {
  const file = path.join(folder, name), hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  files.push({name, bytes: (await fs.stat(file)).size, sha256: hash.digest('hex')});
}
const manifest = {version, tag: `v${version}`, commit: execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim(), files};
await fs.writeFile(path.join(folder, 'SHA256SUMS.txt'), files.map(f => `${f.sha256}  ${f.name}\n`).join(''));
await fs.writeFile(path.join(folder, 'release-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest, null, 2));
