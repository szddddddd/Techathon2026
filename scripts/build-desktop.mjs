import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (process.platform !== 'win32') throw new Error('Build the Windows installer on Windows.');
process.chdir(root);
// ICO supports a PNG payload; retain the project artwork without a new image source.
const png = await sharp('assets/branding/weroam-icon.png').resize(256, 256).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
await fs.mkdir('.cache', {recursive: true});
await fs.writeFile('.cache/release-icon.ico', Buffer.concat([header, png]));
const require = createRequire(import.meta.url);
let cli;
try { cli = require.resolve('electron-builder/cli.js'); }
catch {
  // An isolated tool install also works while the development Electron is running.
  cli = createRequire(path.join(root, '.cache/release-tools/package.json')).resolve('electron-builder/cli.js');
}
await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [cli, '--config', 'config/electron-builder.cjs', '--win', '--x64', '--publish', 'never'], {
    cwd: root, stdio: 'inherit', windowsHide: true,
    env: {...process.env, CSC_IDENTITY_AUTO_DISCOVERY: 'false'},
  });
  child.once('error', reject);
  child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Desktop packaging exited with ${code}.`)));
});
