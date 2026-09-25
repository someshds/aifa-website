import test from 'node:test';
import assert from 'node:assert/strict';
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

test('homepage preserves integrations and canonical conversion path', () => {
  const s=fs.readFileSync(path.join(root,'index.html'),'utf8')+fs.readFileSync(path.join(root,'js/aifa-form-loader.js'),'utf8');for(const needle of ['lS0nKZSRwsBvI4BUU92p','aifa-15-min-ai-opportunity-call-live','aifa-analytics.js','aifa-tracking.js','application/ld+json','privacy-policy-aifa.html'])assert.ok(s.includes(needle),needle);
});

test('sitemap contains every indexed canonical URL and no noindex URL', () => {
  const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');for(const file of indexed){const rel=path.relative(root,file).replaceAll(path.sep,'/');if(rel==='404.html')continue;const url=rel==='index.html'?'https://www.aifusionautomations.com/':rel.endsWith('/index.html')?`https://www.aifusionautomations.com/${rel.slice(0,-10)}`:`https://www.aifusionautomations.com/${rel}`;assert.ok(xml.includes(`<loc>${url}</loc>`),rel)}
});
