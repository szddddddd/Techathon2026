import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {serveStatic} from '../server/static-files.mjs';
import bridge from '../desktop/pet-bridge.cjs';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const pages = ['index.html', 'pet.html', 'asset-review.html', 'rig-review.html', 'data-transfer.html'];
const resources = new Set();
const desktopPages = ['index.html', 'pet.html', 'asset-review.html'];
const desktopResources = new Set();
for (const page of pages) {
  const html = await fs.readFile(path.join(root, 'src/pages', page), 'utf8');
  for (const [, resource] of html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)) {
    const url = new URL(resource, 'http://localhost/').pathname;
    resources.add(url);
    if (desktopPages.includes(page)) desktopResources.add(url);
  }
}

let modules = 0;
async function checkModules(dir) {
  for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await checkModules(file); continue; }
    if (!entry.name.endsWith('.js')) continue;
    modules++;
    const source = await fs.readFile(file, 'utf8');
    for (const [, specifier] of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)["'](\.[^"']+)["']/g)) {
      await fs.access(path.resolve(path.dirname(file), specifier));
    }
    // Inbox and Workshop load their styles only when opened.
    for (const [, resource] of source.matchAll(/new URL\(["']([^"']+\.css)(?:\?[^"']*)?["']/g)) {
      const url = new URL(resource, 'http://localhost/').pathname;
      resources.add(url);
      desktopResources.add(url);
    }
  }
}
await checkModules(path.join(root, 'src'));
assert.ok(resources.has('/src/styles/inbox.css'));
assert.ok(resources.has('/src/styles/workshop.css'));

const server = http.createServer((req, res) => serveStatic(req, res, root));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let pet;
try {
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const resource of [...pages.map(page => '/' + page), ...resources]) {
    const response = await fetch(origin + resource, {method: 'HEAD'});
    assert.equal(response.status, 200, `Web route: ${resource}`);
    if (/\.css$/.test(resource)) assert.match(response.headers.get('content-type'), /text\/css/);
    if (/\.js$/.test(resource)) assert.match(response.headers.get('content-type'), /javascript/);
  }
  pet = await bridge.startPetBridge({root, port: 0, onState() {}, onShow() {}});
  for (const resource of [...desktopPages.map(page => '/' + page), ...desktopResources]) {
    assert.equal((await fetch(pet.origin + resource, {method: 'HEAD'})).status, 200, `Desktop route: ${resource}`);
  }
  for (const resource of ['/.forest-avatar-data/hyper3d-config.json', '/.weroam-private/agent-config.cjs', '/config/hyper3d-config.example.json', '/package.json']) {
    for (const base of [origin, pet.origin]) {
      assert.equal((await fetch(base + resource, {method: 'HEAD'})).status, 404, `Non-runtime route: ${resource}`);
    }
  }
  console.log(`PASS: ${modules} source modules resolve; ${pages.length} entry pages and ${resources.size} resources load through Web/desktop static routes; private/config routes remain closed.`);
} finally {
  pet?.close();
  await new Promise(resolve => server.close(resolve));
}
