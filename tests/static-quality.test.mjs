import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const walk = d => fs.readdirSync(d,{withFileTypes:true}).flatMap(e => ['.git','node_modules','test-results','playwright-report'].includes(e.name) ? [] : e.isDirectory() ? walk(path.join(d,e.name)) : e.name.endsWith('.html') ? [path.join(d,e.name)] : []);
const pages = walk(root).filter(p => !p.includes('/includes/'));
const indexed = pages.filter(p => !p.endsWith('-v1.0.html') && !['tools-index.html','privacy-policy.html','boxleaguepro-lite.html','roi-calculator.html'].includes(path.basename(p)) && !/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(fs.readFileSync(p,'utf8')));

test('indexed pages have core metadata and one H1', () => {
  const failures=[];
  for(const file of indexed){const s=fs.readFileSync(file,'utf8');const rel=path.relative(root,file);for(const [name,re] of [['title',/<title>[^<]+<\/title>/i],['description',/<meta[^>]+name=["']description["']/i],['canonical',/<link[^>]+rel=["']canonical["']/i],['viewport',/<meta[^>]+name=["']viewport["']/i]])if(!re.test(s))failures.push(`${rel}: ${name}`);if(!rel.startsWith('videos/')&&(s.match(/<h1[\s>]/gi)||[]).length!==1)failures.push(`${rel}: h1`)}
  assert.deepEqual(failures,[]);
});

test('site has no stale booking endpoint or insecure links', () => {
  const failures=[];for(const file of pages){const s=fs.readFileSync(file,'utf8'),rel=path.relative(root,file);if(s.includes('api.leadconnectorhq.com/widget/booking/BROmkGCfiVZy4Kgg0sWi'))failures.push(`${rel}: stale booking`);if(/href=["']http:\/\//i.test(s))failures.push(`${rel}: http link`)}assert.deepEqual(failures,[]);
});

test('optional tracking is consent-gated on every HTML page', () => {
  const failures=[];
  for(const file of pages){const s=fs.readFileSync(file,'utf8'),rel=path.relative(root,file);if(!/src=["']\/js\/aifa-tracking\.js/.test(s))failures.push(`${rel}: missing consent gate`);if(/googletagmanager\.com\/(?:gtm\.js|ns\.html)|connect\.facebook\.net\/en_US\/fbevents\.js/.test(s))failures.push(`${rel}: direct tracking embed`)}
  assert.deepEqual(failures,[]);
});

test('local internal links resolve to a tracked page or asset', () => {
  const failures=[];
  for(const file of pages){const s=fs.readFileSync(file,'utf8'),rel=path.relative(root,file);for(const m of s.matchAll(/(?:href|src)=["']([^"']+)["']/gi)){let u=m[1];if(!u||/^(#|https?:|mailto:|tel:|data:|javascript:|about:|\/\/)/i.test(u)||/[{}$]/.test(u))continue;u=u.split(/[?#]/)[0];let target=u.startsWith('/')?path.join(root,u):path.resolve(path.dirname(file),u);if(u.endsWith('/'))target=path.join(target,'index.html');else if(!path.extname(target)&&fs.existsSync(path.join(target,'index.html')))target=path.join(target,'index.html');if(!fs.existsSync(target))failures.push(`${rel}: ${m[1]}`)}}
  assert.deepEqual([...new Set(failures)],[]);
});

test('public pages load shared site chrome with homepage nav IA', () => {
  const nav = fs.readFileSync(path.join(root, 'js/aifa-nav.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'css/site-chrome.css'), 'utf8');
  for (const needle of ['/#how', '/#proof', '/#seats', '/news/', "var BOOK_CALL_URL = '/strategy-call.html';", 'AI FUSION', 'aria-expanded', 'site-chrome.css', 'Escape']) {
    assert.ok(nav.includes(needle), `aifa-nav.js missing ${needle}`);
  }
  for (const skipped of ["/strategy-call.html", "/ai-systems-snapshot.html", "/ai-workflow-call-request.html"]) {
    assert.equal(nav.includes(`path === '${skipped}'`), false, `chat widget must load on ${skipped}`);
  }
  assert.ok(css.includes('.aifa-global-nav'), 'site-chrome.css missing nav styles');
  assert.ok(css.includes('[data-theme="dark"]'), 'site-chrome.css missing dark variant');
  assert.ok(css.includes('.aifa-global-footer'), 'site-chrome.css missing footer styles');
  assert.ok(css.includes('.aifa-footer-main'), 'site-chrome.css missing footer layout');
  const failures = [];
  for (const file of pages) {
    const s = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    if (!/src=["'][^"']*aifa-nav\.js/.test(s)) failures.push(`${rel}: missing aifa-nav.js`);
  }
  assert.deepEqual(failures, []);
});

test('homepage preserves integrations and canonical conversion path', () => {
  const s=fs.readFileSync(path.join(root,'index.html'),'utf8')+fs.readFileSync(path.join(root,'js/aifa-form-loader.js'),'utf8');for(const needle of ['lS0nKZSRwsBvI4BUU92p','aifa-15-min-ai-opportunity-call-live','aifa-analytics.js','aifa-tracking.js','application/ld+json','privacy-policy-aifa.html'])assert.ok(s.includes(needle),needle);
});

test('archived reviews are transparent, attributable and do not claim live Google status', () => {
  const reviews=fs.readFileSync(path.join(root,'reviews.html'),'utf8');
  assert.equal((reviews.match(/aria-label="5 out of 5 stars"/g)||[]).length,10);
  for(const reviewer of ['Beth Wild','Aaron','John Bridges','Fiona Felgate','Windelan Eria','Sam Halter','Bernalyn Perez','A G','Adam Shereston','Joanne Looker'])assert.ok(reviews.includes(reviewer),reviewer);
  assert.ok(reviews.includes('former Google Business Profile'));
  assert.ok(reviews.includes('profile is no longer active'));
  assert.doesNotMatch(reviews,/AggregateRating|aggregateRating|ratingCount/);
  assert.doesNotMatch(reviews,/Somesh/i);
  assert.doesNotMatch(reviews,/\[Grant\]/);
  assert.match(reviews,/Working with Grant has been a game-changer/);
});

test('sitemap contains every indexed canonical URL and no noindex URL', () => {
  const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');for(const file of indexed){const rel=path.relative(root,file).replaceAll(path.sep,'/');if(rel==='404.html')continue;const url=rel==='index.html'?'https://www.aifusionautomations.com/':rel.endsWith('/index.html')?`https://www.aifusionautomations.com/${rel.slice(0,-10)}`:`https://www.aifusionautomations.com/${rel}`;assert.ok(xml.includes(`<loc>${url}</loc>`),rel)}
});

test('news imagery uses the reproducible AI Fusion editorial-card system', () => {
  const imageDir = path.join(root, 'news/img');
  const sourceDir = path.join(imageDir, 'editorial-source');
  const generator = fs.readFileSync(path.join(root, 'scripts/generate_editorial_cards.py'), 'utf8');
  const imageNames = fs.readdirSync(imageDir).filter(name => /\.(?:png|jpe?g)$/i.test(name));
  const sourceNames = fs.readdirSync(sourceDir).filter(name => name.endsWith('.png'));

  assert.ok(imageNames.length >= 120, 'expected the complete news-image archive to be present');
  assert.deepEqual(sourceNames.sort(), ['devices.png','finance.png','government.png','hardware.png','infrastructure.png','research.png','security.png','workplace.png']);
  for (const needle of ['AI FUSION', 'NEWS + INSIGHT', 'Regenerated', 'metadata_by_image']) {
    assert.ok(generator.includes(needle), `editorial generator missing ${needle}`);
  }

  const newsPages = fs.readdirSync(path.join(root, 'news')).filter(name => name.endsWith('.html'));
  const missing = [];
  const hubCropReferences = [];
  for (const name of newsPages) {
    const source = fs.readFileSync(path.join(root, 'news', name), 'utf8');
    for (const match of source.matchAll(/\/news\/img\/([^?"']+)/g)) {
      if (!fs.existsSync(path.join(imageDir, path.basename(match[1])))) missing.push(`${name}: ${match[1]}`);
    }
  }
  for (const name of fs.readdirSync(path.join(root, 'news')).filter(name => /^brief-cards-\d+\.js$/.test(name))) {
    const source = fs.readFileSync(path.join(root, 'news', name), 'utf8');
    if (/-hub\.(?:png|jpe?g)/i.test(source)) hubCropReferences.push(name);
  }
  assert.deepEqual(missing, []);
  assert.deepEqual(hubCropReferences, [], 'hub must use full landscape compositions without portrait cropping');

  const dimensionCheck = execFileSync('python3', ['-c', [
    'from pathlib import Path',
    'from PIL import Image',
    `root=Path(${JSON.stringify(imageDir)})`,
    'bad=[]',
    "for p in root.iterdir():",
    "    if p.is_file() and p.suffix.lower() in {'.png','.jpg','.jpeg'}:",
    "        expected=(750,1122) if '-hub' in p.stem else (1376,768)",
    "        size=Image.open(p).size",
    "        if size != expected: bad.append(f'{p.name}:{size}')",
    "print('\\n'.join(bad))",
  ].join('\n')], { encoding: 'utf8' }).trim();
  assert.equal(dimensionCheck, '', `unexpected editorial-card dimensions:\n${dimensionCheck}`);
});
