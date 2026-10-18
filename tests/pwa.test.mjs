import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'path';

const root = path.resolve(import.meta.dirname, '..');
const skipDirs = new Set(['.git', 'node_modules', 'test-results', 'playwright-report', 'includes']);

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function pngSize(file) {
  const buf = fs.readFileSync(file);
  assert.equal(buf.subarray(1, 4).toString(), 'PNG', `${file} must be PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function count(haystack, needle) {
  let n = 0;
  let from = 0;
  while (true) {
    const at = haystack.indexOf(needle, from);
    if (at === -1) return n;
    n += 1;
    from = at + needle.length;
  }
}

function visibleCopy(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

test('web app manifest is installable as AI FUSION', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.name, 'AI FUSION');
  assert.equal(manifest.short_name, 'AI FUSION');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.scope, '/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#0e0b1f');
  assert.equal(manifest.background_color, '#0e0b1f');
  assert.equal(manifest.lang, 'en-GB');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 4);

  const byPurpose = {};
  for (const icon of manifest.icons) {
    assert.equal(icon.src.startsWith('/img/brand/'), true, icon.src);
    assert.equal(icon.type, 'image/png');
    const abs = path.join(root, icon.src.replace(/^\//, ''));
    assert.equal(fs.existsSync(abs), true, `missing icon ${icon.src}`);
    const size = pngSize(abs);
    const expected = parseInt(icon.sizes, 10);
    assert.equal(size.width, expected, `${icon.src} width`);
    assert.equal(size.height, expected, `${icon.src} height`);
    byPurpose[icon.purpose] = byPurpose[icon.purpose] || [];
    byPurpose[icon.purpose].push(icon.sizes);
  }
  assert.ok(byPurpose.any.includes('192x192'));
  assert.ok(byPurpose.any.includes('512x512'));
  assert.ok(byPurpose.maskable && byPurpose.maskable.includes('192x192'));
  assert.ok(byPurpose.maskable.includes('512x512'));
});

test('service worker uses a versioned cache and leaves GHL and POSTs alone', () => {
  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const cacheVersion = sw.match(/CACHE_VERSION\s*=\s*"aifa-pwa-v(\d+)"/);
  assert.ok(cacheVersion && Number(cacheVersion[1]) >= 1, 'service worker must use a versioned cache name');
  assert.ok(sw.includes('caches.delete'), 'old caches must be cleaned up');
  assert.ok(sw.includes('request.method !== "GET"'), 'must skip non-GET including form POSTs');
  assert.ok(sw.includes('sameOrigin') || sw.includes('self.location.origin'));
  assert.ok(sw.includes('link.aifusionautomations.com'), 'must document GHL as out of scope');
  assert.ok(sw.includes('request.mode === "navigate"'), 'HTML should be network-first via navigate');
  assert.ok(sw.includes('caches.match(request)'));
  assert.ok(sw.includes('/offline.html'));
  assert.ok(sw.includes('pathname.indexOf("/api/")'), 'same-origin API must not be cached');
  assert.equal(sw.includes('beforeinstallprompt'), false);
});

test('pwa.js registers /sw.js at scope /', () => {
  const registrar = fs.readFileSync(path.join(root, 'js/pwa.js'), 'utf8');
  assert.ok(registrar.includes('register("/sw.js"'));
  assert.ok(registrar.includes('scope: "/"'));
  assert.equal(registrar.includes('beforeinstallprompt'), false);
});

test('host config sends no-cache for sw.js only', () => {
  const headers = fs.readFileSync(path.join(root, '_headers'), 'utf8');
  assert.match(headers, /^\/sw\.js\s*$/m);
  assert.match(headers, /Cache-Control:\s*no-cache/i);
  assert.match(headers, /Service-Worker-Allowed:\s*\//i);
  assert.equal((headers.match(/^\//gm) || []).length, 1, 'no-cache header must apply to sw.js only');
});

test('offline page is branded as we / AI FUSION', () => {
  const offline = fs.readFileSync(path.join(root, 'offline.html'), 'utf8');
  const copy = visibleCopy(offline);
  assert.ok(copy.includes('You’re offline') || copy.includes("You're offline"));
  assert.match(copy, /reconnect to see the latest pages/i);
  assert.ok(copy.includes('AI FUSION') || copy.includes('AI Fusion'));
  assert.equal(/Grant/i.test(copy), false, 'offline page must not use Grant’s name');
  assert.match(copy, /We.?ll have everything ready/i);
  assert.match(offline, /name=["']robots["'][^>]+noindex/i);
});

test('add to your phone instructions cover Safari and Chrome', () => {
  const page = fs.readFileSync(path.join(root, 'add-to-your-phone.html'), 'utf8');
  const copy = visibleCopy(page);
  assert.ok(copy.includes('Add AI FUSION to your phone'));
  assert.ok(copy.includes('iPhone, Safari'));
  assert.ok(copy.includes('iPhone, Chrome'));
  assert.ok(copy.includes('Android, Chrome'));
  assert.ok(copy.includes('square with an up arrow'));
  assert.ok(copy.includes('bottom middle'));
  assert.ok(copy.includes('... menu'));
  assert.ok(copy.includes('Add to Home Screen'));
  assert.ok(copy.includes('Install app') || copy.includes('Add to Home screen'));
  assert.equal(/Grant/i.test(copy), false, 'instructions must not use Grant’s name');
  assert.equal(/\*/.test(copy), false, 'instructions copy must not use asterisks');
});

test('footer points at the home-screen instructions', () => {
  const nav = fs.readFileSync(path.join(root, 'js/aifa-nav.js'), 'utf8');
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const news = fs.readFileSync(path.join(root, 'news/index.html'), 'utf8');
  for (const [label, source] of [['aifa-nav.js', nav], ['index.html', home], ['news/index.html', news]]) {
    assert.ok(source.includes('href="/add-to-your-phone.html">Add AI FUSION to your phone</a>'), `${label} missing footer link`);
  }
});

test('every public HTML page links the manifest and registers the worker once', () => {
  const pages = walkHtml(root);
  assert.ok(pages.length > 20, 'expected site HTML pages');
  const failures = [];
  for (const file of pages) {
    const rel = path.relative(root, file);
    const html = fs.readFileSync(file, 'utf8');
    if (count(html, 'rel="manifest"') !== 1) failures.push(`${rel}: manifest`);
    if (!html.includes('href="/manifest.json"')) failures.push(`${rel}: /manifest.json`);
    if ((html.match(/name=["']theme-color["']/g) || []).length !== 1) failures.push(`${rel}: theme-color`);
    if ((html.match(/name=["']application-name["']/g) || []).length !== 1) failures.push(`${rel}: application-name`);
    if ((html.match(/name=["']apple-mobile-web-app-title["']/g) || []).length !== 1) failures.push(`${rel}: apple title`);
    const appTitle = rel === 'boxleague-pro.html' ? 'BoxLeague Pro' : 'AI FUSION';
    if (!html.includes(`name="application-name" content="${appTitle}"`)) failures.push(`${rel}: application-name value`);
    if (!html.includes(`name="apple-mobile-web-app-title" content="${appTitle}"`)) failures.push(`${rel}: apple title value`);
    if ((html.match(/src=["']\/js\/pwa\.js/g) || []).length !== 1) failures.push(`${rel}: pwa.js`);
    if (html.includes('beforeinstallprompt')) failures.push(`${rel}: install banner`);
  }
  assert.deepEqual(failures, []);
});

test('robots.txt is unchanged and existing noindex pages keep their robots meta', () => {
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  assert.equal(robots, 'User-agent: *\nAllow: /\nDisallow: /index.html.bak\n\nSitemap: https://www.aifusionautomations.com/sitemap.xml\n');
  const expectedNoindex = [
    '404.html',
    'book.html',
    'pricing-v1.0.html',
    'privacy-policy.html',
    'roi-calculator.html',
    'strategy-call.html',
    'tools-index.html',
    'offline.html'
  ];
  for (const rel of expectedNoindex) {
    const html = fs.readFileSync(path.join(root, rel), 'utf8');
    assert.match(html, /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i, rel);
  }
});
