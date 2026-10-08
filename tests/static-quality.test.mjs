import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const walk = d => fs.readdirSync(d,{withFileTypes:true}).flatMap(e => ['.git','node_modules','test-results','playwright-report'].includes(e.name) ? [] : e.isDirectory() ? walk(path.join(d,e.name)) : e.name.endsWith('.html') ? [path.join(d,e.name)] : []);
const pages = walk(root).filter(p => !p.includes('/includes/'));
const indexed = pages.filter(p => !p.endsWith('-v1.0.html') && !['tools-index.html','privacy-policy.html','boxleaguepro-lite.html','roi-calculator.html'].includes(path.basename(p)) && !/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(fs.readFileSync(p,'utf8')));

function imageDimensions(file) {
  const data = fs.readFileSync(file);
  if (data.subarray(1, 4).toString() === 'PNG') return [data.readUInt32BE(16), data.readUInt32BE(20)];
  if (data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < data.length) {
      if (data[offset] !== 0xff) { offset += 1; continue; }
      const marker = data[offset + 1];
      const length = data.readUInt16BE(offset + 2);
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        return [data.readUInt16BE(offset + 7), data.readUInt16BE(offset + 5)];
      }
      offset += 2 + length;
    }
  }
  throw new Error(`Unsupported image: ${file}`);
}
