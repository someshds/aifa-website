import {test,expect} from '@playwright/test';
import axeSource from 'axe-core';

const DEMO_URL='https://email-reimagined.com/founder-priority-inbox-demo';

for(const route of ['/','/reviews.html','/contact.html','/services/'])test(`${route} renders cleanly`,async({page})=>{const errors=[];page.on('console',m=>{if(m.type()!=='error')return;const text=m.text();if(text.includes('favicon')||text.includes('link.aifusionautomations.com'))return;errors.push(text)});await page.goto(route,{waitUntil:'domcontentloaded'});await page.waitForTimeout(500);await expect(page.locator('h1')).toHaveCount(1);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);expect(overflow).toBe(false);expect(errors).toEqual([])});

test('contact page embeds the enquiry form and keeps email and booking as secondary paths',async({page})=>{
  await page.goto('/contact.html');
  await expect(page.getByRole('heading',{name:'Contact us'})).toBeVisible();
  const form=page.locator('#inline-t4FnzGSw0lcb4l1PFx8q');
  await expect(form).toBeVisible();
  await expect(form).toHaveAttribute('src','https://link.aifusionautomations.com/widget/form/t4FnzGSw0lcb4l1PFx8q');
  await expect(form).toHaveAttribute('title','Contact AI Fusion Team');
  const email=page.locator('#main').getByRole('link',{name:'grant@aifusionautomations.com'});
  await expect(email).toBeVisible();
  await expect(email).toHaveAttribute('href','mailto:grant@aifusionautomations.com');
  await expect(page.getByText('East Sussex, England')).toBeVisible();
  await expect(page.locator('#main').getByRole('link',{name:'book a demo'})).toHaveAttribute('href',DEMO_URL);
  await page.waitForSelector('.aifa-global-nav');
  const nav=page.locator('.aifa-global-nav');
  const contact=nav.getByRole('link',{name:'Contact'});
  if(!(await contact.isVisible())){
    await nav.getByRole('button',{name:/menu/i}).click();
  }
  await expect(contact).toHaveAttribute('href','/contact.html');
  await expect(contact).toHaveAttribute('aria-current','page');
  await expect(page.locator('.aifa-global-footer').getByRole('link',{name:'Contact'})).toHaveAttribute('href','/contact.html');
});

test('review archive is explicit and accessible',async({page})=>{await page.goto('/reviews.html');await expect(page.getByRole('heading',{name:'Five-star feedback from people we helped.'})).toBeVisible();await expect(page.locator('.review-card')).toHaveCount(10);await expect(page.getByText('the original profile is no longer active')).toBeVisible();await page.addScriptTag({content:axeSource.source});const result=await page.evaluate(()=>axe.run(document));expect(result.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([])});

test('homepage keyboard and accessibility gate',async({page})=>{await page.goto('/');await page.keyboard.press('Tab');await expect(page.locator('.skip-link')).toBeFocused();await page.addScriptTag({content:axeSource.source});const result=await page.evaluate(()=>axe.run(document,{rules:{'color-contrast':{enabled:true}}}));expect(result.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([]);await expect(page.getByRole('link',{name:/Book a free demo/i})).toBeVisible();const nav=page.locator('.aifa-global-nav');const book=nav.getByRole('link',{name:'Book a demo'});if(!(await book.isVisible())){await nav.getByRole('button',{name:/menu/i}).click()}await expect(book).toHaveAttribute('href',DEMO_URL);const contact=nav.getByRole('link',{name:'Contact'});await expect(contact).toHaveAttribute('href','/contact.html');await expect(page.locator('footer').getByRole('link',{name:'Contact'})).toHaveAttribute('href','/contact.html')});

test('homepage and workshops expose Contact in primary nav and footer',async({page})=>{
  for (const route of ['/','/workshops/']){
    await page.goto(route,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.aifa-global-nav');
    const nav=page.locator('.aifa-global-nav');
    const contact=nav.getByRole('link',{name:'Contact'});
    if(!(await contact.isVisible())){
      await nav.getByRole('button',{name:/menu/i}).click();
    }
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute('href','/contact.html');
    await expect(nav.getByRole('link',{name:'Book a demo'})).toHaveAttribute('href',DEMO_URL);
    await expect(page.locator('footer').getByRole('link',{name:'Contact'})).toHaveAttribute('href','/contact.html');
  }
});

test('news hub and nested article share homepage chrome',async({page})=>{
  for (const route of ['/news/','/news/2026-10-08-gpt-6-chatgpt-intelligent-ui.html','/news/2026-10-02-google-gemini-4-argon-fairwind-restricted.html','/news/2026-09-28-openai-anthropic-tens-of-thousands-agent-incidents.html','/news/2026-09-25-openai-agents-australian-medicare-portal-permissions.html']){
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
    await expect(nav.getByRole('link',{name:'Contact'})).toHaveAttribute('href','/contact.html');
    await expect(nav.getByRole('link',{name:'Book a demo'})).toHaveAttribute('href',DEMO_URL);
    await expect(page.locator('body > footer, .aifa-global-footer').getByRole('link',{name:'Contact'})).toHaveAttribute('href','/contact.html');
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
  for (const route of ['/email-reimagined/','/email-reimagined/webinar.html','/email-reimagined/course.html','/email-reimagined/shop.html','/email-reimagined/done-for-you.html']){
    await page.goto(route,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.aifa-global-nav');
    await expect(page.locator('h1')).toHaveCount(1);
    const nav=page.locator('.aifa-global-nav');
    const email=nav.getByRole('link',{name:'Email Re-imagined'});
    if(!(await email.isVisible())){
      await nav.getByRole('button',{name:/menu/i}).click();
    }
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute('href','/email-reimagined/');
    if (route.endsWith('webinar.html')) {
      await expect(page.getByRole('link',{name:/Save My Seat/}).first()).toHaveAttribute('href','https://email-reimagined.com/founder-priority-inbox-16th-october');
    }
    if (route.endsWith('course.html')) {
      await expect(page.getByRole('link',{name:/See it on the free webinar/}).first()).toHaveAttribute('href','https://email-reimagined.com/home');
      await expect(page.locator('.offer-price')).toHaveText('£119 / $149, paid once.');
      await expect(page.getByText('£19 / $27').first()).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/Save My Seat|16 October|October 16|19 October/);
      await expect(page.getByRole('link',{name:/^Buy$/})).toHaveCount(0);
    }
    if (route.endsWith('shop.html')) {
      await expect(page.getByRole('link',{name:'Buy in the UK, £19'})).toHaveAttribute('href','https://link.aifusionautomations.com/payment-link/6ac909cdc0e70c7fefb738e5');
      await expect(page.getByRole('link',{name:'Buy in the US, $27'})).toHaveAttribute('href','https://link.aifusionautomations.com/payment-link/6ac8c98bc0e70c7fefb73839');
      await expect(page.getByRole('link',{name:'Buy in the UK, £119'})).toHaveAttribute('href','https://link.aifusionautomations.com/payment-link/6ac90a13075ea22a20cdd6df');
      await expect(page.getByRole('link',{name:'Buy in the US, $149'})).toHaveAttribute('href','https://link.aifusionautomations.com/payment-link/6ac8cc7c075ea22a20cdd622');
      await expect(page.getByRole('link',{name:"See what's in the course"})).toHaveAttribute('href','/email-reimagined/course.html');
      await expect(page.getByRole('link',{name:'Book a call'})).toHaveAttribute('href','/email-reimagined/done-for-you.html');
      await expect(page.getByRole('link',{name:'Not sure yet? Book a free demo'}).first()).toHaveAttribute('href',DEMO_URL);
      await expect(page.locator('body')).not.toContainText(/Save My Seat|16 October|October 16|19 October|#UK_PROMPTS_LINK|#UK_COURSE_LINK/);
      await expect(page.getByRole('link',{name:/^Buy$/})).toHaveCount(0);
    }
    if (route.endsWith('done-for-you.html')) {
      await expect(page.getByRole('link',{name:/See the webinar first/})).toHaveAttribute('href','https://email-reimagined.com/home');
      await expect(page.getByText('From £599 / $799').first()).toBeVisible();
      await expect(page.getByText('£19 / $27').first()).toBeVisible();
      await expect(page.getByText('£119 / $149').first()).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/Save My Seat|16 October|October 16|19 October/);
      await expect(page.getByRole('link',{name:/^Buy$/})).toHaveCount(0);
    }
  }
});

test('optional integrations require an explicit choice',async({page})=>{await page.goto('/');expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);expect(await page.locator('iframe[src*="widget/form"]').count()).toBe(0);expect(await page.locator('#aifa-form-mount, #aifa-opportunity-form').count()).toBe(0);await page.getByRole('button',{name:'Essential only'}).click();expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);await page.evaluate(()=>localStorage.clear());await page.reload();await page.getByRole('button',{name:'Allow analytics'}).click();await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(1)});
