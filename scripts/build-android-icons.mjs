import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PNG} from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = PNG.sync.read(await fs.readFile(path.join(root, 'assets/branding/weroam-icon.png')));
const {width, height, data} = source;
// The original artwork includes a rounded tile and an outer white margin.
// Separate its coloured mark from that neutral tile; fill enclosed highlights
// so the pale river inside the mark remains intact.
const outside = new Uint8Array(width * height);
const queue = new Uint32Array(width * height);
let head = 0, tail = 0;
function visit(x, y) {
  const p = y * width + x;
  if (outside[p]) return;
  const i = p * 4;
  if (Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]) >= 24) return;
  outside[p] = 1;
  queue[tail++] = p;
}
for (let x = 0; x < width; x++) { visit(x, 0); visit(x, height - 1); }
for (let y = 0; y < height; y++) { visit(0, y); visit(width - 1, y); }
while (head < tail) {
  const p = queue[head++], x = p % width, y = Math.floor(p / width);
  if (x) visit(x - 1, y);
  if (x + 1 < width) visit(x + 1, y);
  if (y) visit(x, y - 1);
  if (y + 1 < height) visit(x, y + 1);
}
for (let p = 0; p < outside.length; p++) if (outside[p]) data[p * 4 + 3] = 0;

function render(size, visibleDp, opaque) {
  const out = new PNG({width: size, height: size});
  // Android masks a 72dp viewport out of the 108dp adaptive layers.
  // Keep the mark inside it while letting a separate background reach every edge.
  const scale = size / visibleDp * 108 * 0.92 / width;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const sx = (x + 0.5 - size / 2) / scale + width / 2 - 0.5;
    const sy = (y + 0.5 - size / 2) / scale + height / 2 - 0.5;
    const x0 = Math.floor(sx), y0 = Math.floor(sy);
    let a = 0, rgb = [0, 0, 0];
    // Premultiplied bilinear sampling avoids a white fringe on transparent edges.
    for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) {
      const ix = x0 + dx, iy = y0 + dy;
      if (ix < 0 || ix >= width || iy < 0 || iy >= height) continue;
      const i = (iy * width + ix) * 4;
      const w = (dx ? sx - x0 : 1 - sx + x0) * (dy ? sy - y0 : 1 - sy + y0) * data[i + 3] / 255;
      a += w;
      for (let c = 0; c < 3; c++) rgb[c] += data[i + c] * w;
    }
    const o = (y * size + x) * 4;
    const bg = [243, 247, 252];
    for (let c = 0; c < 3; c++) out.data[o + c] = Math.round(opaque ? rgb[c] + bg[c] * (1 - a) : a ? rgb[c] / a : 0);
    out.data[o + 3] = opaque ? 255 : Math.round(a * 255);
  }
  return PNG.sync.write(out);
}
const res = path.join(root, 'android/app/src/main/res');
await fs.mkdir(path.join(res, 'drawable-nodpi'), {recursive: true});
await fs.writeFile(path.join(res, 'drawable-nodpi/ic_launcher_foreground.png'), render(432, 108, false));
await fs.writeFile(path.join(res, 'mipmap-xxxhdpi/ic_launcher.png'), render(192, 72, true));
console.log('Android launcher icons: transparent mark + edge-to-edge adaptive background.');
