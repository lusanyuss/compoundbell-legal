import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
async function walk(dir) {
  const files = [];
  for (const name of await readdir(dir)) {
    const target = path.join(dir, name);
    if ((await stat(target)).isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}
const pages = (await walk(root)).filter(f => f.endsWith('.html'));
assert.equal(pages.length, 11);
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  assert(!/<script\b/i.test(html), `Unexpected script in ${file}`);
  assert(html.includes("script-src 'none'"));
  assert(html.includes('北京晓目标科技有限公司'));
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https:|mailto:)/.test(url)) continue;
    assert(!url.startsWith('/'), `Root-relative link breaks project Pages: ${url}`);
    const [pathname, anchor] = url.split('#');
    let target = pathname ? path.resolve(path.dirname(file), pathname) : file;
    assert(target === root || target.startsWith(root + path.sep));
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    const body = await readFile(target, 'utf8');
    if (anchor) assert(body.includes(`id="${anchor}"`), `Missing anchor ${url}`);
  }
}
console.log('Verified 11 bilingual pages, project-path links, assets and anchors; no scripts.');
