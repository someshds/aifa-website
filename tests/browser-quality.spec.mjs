import {test,expect} from '@playwright/test';
import axeSource from 'axe-core';

for(const route of ['/','/reviews.html','/services/','/strategy-call.html'])test(`${route} renders cleanly`,async({page})=>{const errors=[];page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('favicon'))errors.push(m.text())});await page.goto(route,{waitUntil:'domcontentloaded'});await page.waitForTimeout(500);await expect(page.locator('h1')).toHaveCount(1);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);expect(overflow).toBe(false);expect(errors).toEqual([])});

test('review archive is explicit and accessible',async({page})=>{await page.goto('/reviews.html');await expect(page.getByRole('heading',{name:'Five-star feedback from people we helped.'})).toBeVisible();await expect(page.locator('.review-card')).toHaveCount(10);await expect(page.getByText('the original profile is no longer active')).toBeVisible();await page.addScriptTag({content:axeSource.source});const result=await page.evaluate(()=>axe.run(document));expect(result.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([])});

test('homepage keyboard and accessibility gate',async({page})=>{await page.goto('/');await page.keyboard.press('Tab');await expect(page.locator('.skip-link')).toBeFocused();await page.addScriptTag({content:axeSource.source});const result=await page.evaluate(()=>axe.run(document,{rules:{'color-contrast':{enabled:true}}}));expect(result.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([]);await expect(page.getByRole('link',{name:/Book a free Opportunity Call/i})).toBeVisible();const nav=page.locator('.aifa-global-nav');const book=nav.getByRole('link',{name:'Book a call'});if(!(await book.isVisible())){await nav.getByRole('button',{name:/menu/i}).click()}await expect(book).toHaveAttribute('href','/strategy-call.html')});

test('news hub and nested article share homepage chrome',async({page})=>{
  for (const route of ['/news/','/news/2026-10-02-google-gemini-4-argon-fairwind-restricted.html','/news/2026-09-28-openai-anthropic-tens-of-thousands-agent-incidents.html','/news/2026-09-25-openai-agents-australian-medicare-portal-permissions.html']){
    await page.goto(route,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.aifa-global-nav');
    const nav=page.locator('.aifa-global-nav');
    await expect(nav).toBeVisible();
    const how=nav.getByRole('link',{name:'How it works'});
    if(!(await how.isVisible())){
      await nav.getByRole('button',{name:/menu/i}).click();
    }
    await expect(how).toBeVisible();
    await expect(how).toHaveAttribute('href','/#how');
    await expect(nav.getByRole('link',{name:'Proof'})).toHaveAttribute('href','/#proof');
    await expect(nav.getByRole('link',{name:'Platform seats'})).toHaveAttribute('href','/#seats');
    await expect(nav.getByRole('link',{name:'News'})).toHaveAttribute('href','/news/');
    await expect(nav.getByRole('link',{name:'Book a call'})).toHaveAttribute('href','/strategy-call.html');
  }
});

test('email re-imagined section is in site nav and the three pages render',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.aifa-global-nav');
  const homeNav=page.locator('.aifa-global-nav');
  const homeEmail=homeNav.getByRole('link',{name:'Email Re-imagined'});
  if(!(await homeEmail.isVisible())){
    await homeNav.getByRole('button',{name:/menu/i}).click();
  }
  await expect(homeEmail).toBeVisible();
  await expect(homeEmail).toHaveAttribute('href','/email-reimagined/');
  for (const route of ['/email-reimagined/','/email-reimagined/webinar.html','/email-reimagined/course.html','/email-reimagined/done-for-you.html']){
    await page.goto(route,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.aifa-global-nav');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('Finally - One clear view of every enquiry, payment warning, and urgent action across all gmail accounts.');
    const nav=page.locator('.aifa-global-nav');
    const email=nav.getByRole('link',{name:'Email Re-imagined'});
    if(!(await email.isVisible())){
      await nav.getByRole('button',{name:/menu/i}).click();
    }
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute('href','/email-reimagined/');
  }
});

test('optional integrations require an explicit choice',async({page})=>{await page.goto('/');expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);expect(await page.locator('iframe[src*="widget/form"]').count()).toBe(0);expect(await page.locator('#aifa-form-mount, #aifa-opportunity-form').count()).toBe(0);await page.getByRole('button',{name:'Essential only'}).click();expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);await page.evaluate(()=>localStorage.clear());await page.reload();await page.getByRole('button',{name:'Allow analytics'}).click();await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(1)});
