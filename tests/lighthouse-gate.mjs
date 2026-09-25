import {chromium} from '@playwright/test';
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';

const mins={performance:90,accessibility:95,'best-practices':95,seo:95};
const maxes={'largest-contentful-paint':2500,'total-blocking-time':200,'cumulative-layout-shift':.1};
const attempts=3;

const evaluate=j=>{
  const scores=Object.fromEntries(Object.entries(j.categories).filter(([k])=>['performance','accessibility','best-practices','seo'].includes(k)).map(([k,v])=>[k,Math.round(v.score*100)]));
  const failures=[];
  for(const [k,min] of Object.entries(mins))if(scores[k]<min)failures.push(`${k} ${scores[k]} < ${min}`);
  for(const [k,max] of Object.entries(maxes))if(j.audits[k].numericValue>max)failures.push(`${k} ${j.audits[k].numericValue} > ${max}`);
  return {scores,failures};
};

const server=spawn('python3',['-m','http.server','4173','--bind','127.0.0.1'],{stdio:'ignore'});
try {
  for(let attempt=0;attempt<30;attempt++){
    try{if((await fetch('http://127.0.0.1:4173/')).ok)break;}catch{}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  const bin=process.platform==='win32'?'node_modules/.bin/lighthouse.cmd':'node_modules/.bin/lighthouse';
  let lastError='Lighthouse failed';
  let passed=false;
  for(let i=1;i<=attempts;i++){
    const out='/tmp/aifa-lighthouse-ci.json';
    const run=spawnSync(bin,['http://127.0.0.1:4173/','--chrome-path='+chromium.executablePath(),'--chrome-flags=--headless --no-sandbox','--output=json','--output-path='+out,'--quiet'],{encoding:'utf8'});
    if(run.status!==0){
      lastError=run.stderr||'Lighthouse failed';
      console.warn(`Lighthouse attempt ${i}/${attempts} failed to run: ${lastError}`);
      continue;
    }
    const {scores,failures}=evaluate(JSON.parse(fs.readFileSync(out)));
    console.log(scores);
    if(!failures.length){passed=true;break;}
    lastError=failures.join('; ');
    console.warn(`Lighthouse attempt ${i}/${attempts}: ${lastError}`);
  }
  if(!passed)throw new Error(lastError);
} finally {
  server.kill('SIGTERM');
}
