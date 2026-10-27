import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(await readFile(path.join(root, 'content.json'), 'utf8'));
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const email = 'lusanyuss@gmail.com';
const ids = ['privacy', 'terms', 'deletion', 'support'];
await mkdir(path.join(root, 'dist'), { recursive: true });
for (const asset of ['styles.css', 'bell.svg', 'alarm-review-api33.mp4']) {
  await copyFile(path.join(root, 'assets', asset), path.join(root, 'dist', asset));
}
await writeFile(path.join(root, 'dist/.nojekyll'), '');
for (const lang of ['zh', 'en']) {
  const t = content[lang];
  if (JSON.stringify(Object.keys(t).sort()) !== JSON.stringify(Object.keys(content.zh).sort())) throw Error('Locale keys differ');
  if (JSON.stringify(Object.keys(t.documents)) !== JSON.stringify(ids)) throw Error('Document keys differ');
  for (const id of ids) {
    if (t.documents[id].sections.map((s) => s.id).join() !== content.zh.documents[id].sections.map((s) => s.id).join()) throw Error('Section keys differ');
  }
  for (const id of ['index', ...ids]) {
    const isHub = id === 'index';
    const doc = isHub ? null : t.documents[id];
    const title = doc?.title ?? t.hub;
    const destination = isHub ? `${lang}/index.html` : `${lang}/${id}/index.html`;
    const base = isHub ? '../' : '../../';
    const other = `${base}${lang === 'zh' ? 'en' : 'zh'}/${isHub ? '' : `${id}/`}`;
    const local = (target) => isHub ? `${target}/` : `../${target}/`;
    const navigation = ids.map((key) => `<a ${key === id ? 'aria-current="page"' : ''} href="${esc(local(key))}">${esc(t.documents[key].title)}</a>`).join('');
    const sections = doc?.sections.map((section) => `<section id="${esc(section.id)}"><h2>${esc(section.title)}</h2>${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}${section.links?.map(([label, url]) => `<p><a href="${esc(url)}" ${url.startsWith('https:') ? 'rel="noreferrer"' : ''}>${esc(label)}<span aria-hidden="true"> ↗</span></a></p>`).join('') ?? ''}</section>`).join('');
    const body = isHub ? `<div class="facts">${t.facts.map(([label, detail], index) => `<section class="fact"><span class="number">0${index + 1}</span><h2>${esc(label)}</h2><p>${esc(detail)}</p></section>`).join('')}</div><div class="doc-grid">${ids.map((key, index) => `<a class="doc-card" href="${esc(local(key))}"><span class="eyebrow">0${index + 1}</span><h2>${esc(t.documents[key].title)}</h2><p>${esc(t.documents[key].description)}</p><span class="card-action">${esc(t.read)} <span aria-hidden="true">↗</span></span></a>`).join('')}</div>` : `<div class="reading-layout"><aside class="toc" aria-label="${esc(t.toc)}"><p class="eyebrow">${esc(t.toc)}</p>${doc.sections.map((section) => `<a href="#${esc(section.id)}">${esc(section.title)}</a>`).join('')}</aside><article class="document">${sections}<a class="back" href="#top">↑ ${lang === 'zh' ? '返回顶部' : 'Back to top'}</a></article></div>`;
    const html = `<!doctype html>
<html lang="${esc(t.lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self'; img-src 'self'; script-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>${esc(title)} · ${esc(t.brand)}</title><meta name="description" content="${esc(doc?.description ?? t.intro)}"><link rel="stylesheet" href="${base}styles.css"><link rel="icon" type="image/svg+xml" href="${base}bell.svg"><link rel="alternate" hreflang="${lang === 'zh' ? 'en' : 'zh-CN'}" href="${esc(other)}"></head>
<body id="top"><a class="skip" href="#main">${esc(t.skip)}</a><header class="site-header"><a class="brand" href="${isHub ? './' : '../'}"><img src="${base}bell.svg" alt="" width="36" height="36"><span>${esc(t.brand)}<small>${esc(t.tagline)}</small></span></a><a class="language" href="${esc(other)}" lang="${lang === 'zh' ? 'en' : 'zh-CN'}">${esc(t.otherLanguage)} <span aria-hidden="true">↗</span></a></header>
<main id="main"><div class="review-note" role="note"><span class="review-dot" aria-hidden="true"></span><div><strong>${esc(t.draft)}</strong><p>${esc(t.draftNote)}</p></div></div><nav class="document-nav" aria-label="${esc(t.hub)}">${navigation}</nav><div class="hero"><p class="eyebrow">COMPOUNDBELL / ${lang === 'zh' ? '清晰与信任' : 'CLARITY & TRUST'}</p><h1>${esc(title)}</h1><p class="lead">${esc(doc?.summary ?? t.intro)}</p><p class="meta">${esc(t.updated)}<span aria-hidden="true"> · </span>${esc(t.version)}</p></div>${body}<div class="contact-strip"><div><p class="eyebrow">${esc(t.contactLabel)}</p><a href="mailto:${email}">${email}</a><p>${esc(t.emailNote)}</p></div><a class="contact-button" href="mailto:${email}">${esc(t.contact)} <span aria-hidden="true">↗</span></a></div></main>
<footer><p>${esc(t.operatorLabel)}：<strong>${esc(t.operator)}</strong></p><p>${esc(t.scope)}</p><a href="${isHub ? './' : '../'}">${esc(t.home)}</a></footer></body></html>`;
    await mkdir(path.dirname(path.join(root, 'dist', destination)), { recursive: true });
    await writeFile(path.join(root, 'dist', destination), html);
  }
}
await copyFile(path.join(root, 'dist/zh/index.html'), path.join(root, 'dist/index.html'));
// The root page lives one directory above the localized hub.
const rootPage = (await readFile(path.join(root, 'dist/index.html'), 'utf8'))
  .replaceAll('href="../styles.css"', 'href="styles.css"').replaceAll('href="../bell.svg"', 'href="bell.svg"')
  .replaceAll('src="../bell.svg"', 'src="bell.svg"').replaceAll('href="../en/"', 'href="en/"')
  .replaceAll('href="./"', 'href="zh/"');
await writeFile(path.join(root, 'dist/index.html'), rootPage.replace(/href="(privacy|terms|deletion|support)\/"/g, 'href="zh/$1/"'));
await writeFile(path.join(root, 'dist/robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log('Built 11 bilingual static legal pages; no scripts or tracking dependencies.');
