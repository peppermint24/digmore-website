/* Read-only review of the built preview. Never submit forms or launch WhatsApp. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.env.REVIEW_URL || 'http://127.0.0.1:4173';
const out = 'design-review-results';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, args: ['--no-sandbox'] });
  const results = [];
  const pageErrors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' });
    page.on('pageerror', err => pageErrors.push(err.message));
    const response = await page.goto(base, { waitUntil: 'load', timeout: 60000 });
    assert.equal(response.status(), 200);
    const logoResponse = await page.request.get(base + '/images/brand/digmore-logo.webp');
    assert.equal(logoResponse.status(), 200, 'Supplied logo is served locally');
    assert.match(logoResponse.headers()['content-type'], /^image\/webp/);
    const fonts = await page.evaluate(async () => {
      const loaded = await Promise.race([
        Promise.all([document.fonts.load('400 16px "Saira"'), document.fonts.load('700 64px "Saira Semi Condensed"')]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Webfont load timed out')), 25000)),
      ]);
      return loaded.map(faces => faces.map(f => ({ family: f.family, status: f.status })));
    });
    assert.ok(fonts.every(group => group.length > 0 && group.every(f => f.status === 'loaded')), 'Real webfonts must load; fallback is not a pass');
    console.log('LOADED_WEBFONTS', JSON.stringify(fonts));
    for (const width of [320, 390, 768, 799, 800, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForFunction(() => {
        const image = document.querySelector('.hero-image');
        const logos = [...document.querySelectorAll('.brand-logo')];
        return image && image.complete && image.naturalWidth > 0 && logos.length === 2 && logos.every(logo => logo.complete && logo.naturalWidth === 384);
      }, null, { timeout: 25000 });
      const metrics = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const button = document.querySelector('.hero .button-primary');
        const image = document.querySelector('.hero-image');
        const h1s = getComputedStyle(h1);
        const bs = getComputedStyle(button);
        return {
          width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
          background: getComputedStyle(document.body).backgroundColor,
          font: h1s.fontFamily, headlineSize: h1s.fontSize, lineHeight: h1s.lineHeight,
          letterSpacing: h1s.letterSpacing, textTransform: h1s.textTransform,
          buttonBackground: bs.backgroundColor, buttonRadius: bs.borderRadius,
          heroImage: { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, currentSrc: image.currentSrc },
          logos: [...document.querySelectorAll('.brand-logo')].map(logo => ({ naturalWidth: logo.naturalWidth, naturalHeight: logo.naturalHeight, width: logo.clientWidth, height: logo.clientHeight, fit: getComputedStyle(logo).objectFit, filter: getComputedStyle(logo).filter })),
          menuVisible: document.querySelector('.mobile-nav').getBoundingClientRect().width > 0,
        };
      });
      assert.ok(metrics.scrollWidth <= width + 1, `Horizontal overflow at ${width}: ${metrics.scrollWidth}`);
      assert.equal(metrics.background, 'rgb(38, 38, 38)');
      assert.equal(metrics.buttonBackground, 'rgb(252, 176, 38)');
      assert.equal(metrics.buttonRadius, '4px');
      assert.equal(metrics.textTransform, 'none');
      assert.equal(metrics.letterSpacing, 'normal');
      assert.ok(metrics.font.includes('Saira Semi Condensed'));
      assert.equal(metrics.headlineSize, width < 800 ? '44px' : width <= 1100 ? '54px' : '64px');
      assert.equal(metrics.menuVisible, width < 800);
      assert.equal(metrics.logos.length, 2);
      assert.equal(metrics.logos[0].width, width < 800 ? 80 : 96);
      assert.equal(metrics.logos[1].width, 192);
      for (const logo of metrics.logos) {
        assert.equal(logo.naturalWidth, 384);
        assert.equal(logo.naturalHeight, 384);
        assert.equal(logo.width, logo.height);
        assert.equal(logo.fit, 'contain');
        assert.equal(logo.filter, 'none');
      }
      results.push(metrics);
      if (width < 800) {
        const summary = page.locator('.mobile-nav summary');
        await summary.click();
        assert.ok(await page.locator('.mobile-nav').evaluate(e => e.open));
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.mobile-nav').evaluate(e => e.open), false);
        assert.ok(await summary.evaluate(e => document.activeElement === e));
        await summary.click();
        // Click below the open panel, not a heading that the menu legitimately covers.
        const panel = await page.locator('.mobile-nav nav').boundingBox();
        assert.ok(panel);
        await page.mouse.click(width - 8, panel.y + panel.height + 12);
        assert.equal(await page.locator('.mobile-nav').evaluate(e => e.open), false);
      }
      if ([390, 1440].includes(width)) await page.screenshot({ path: `${out}/homepage-${width}.png`, fullPage: true });
    }
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.locator('.mobile-nav summary').click();
    await page.setViewportSize({ width: 1024, height: 1000 });
    await page.waitForFunction(() => !document.querySelector('.mobile-nav').open);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    await page.emulateMedia({ forcedColors: 'active' });
    assert.equal(await page.locator('.hero .button').first().evaluate(e => getComputedStyle(e).borderTopWidth), '1px');
    for (const route of ['/products', '/about', '/contact']) assert.equal((await page.request.get(base + route)).status(), 200, route);
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const nativePage = await noJS.newPage();
    await nativePage.goto(base, { waitUntil: 'domcontentloaded' });
    await nativePage.locator('.mobile-nav summary').click();
    assert.ok(await nativePage.locator('.mobile-nav').evaluate(e => e.open), 'Native menu works without JS');
    await noJS.close();
    assert.deepEqual(pageErrors, [], 'No browser JavaScript exceptions');
    const report = { fonts, viewports: results, pageErrors, routes: ['/products','/about','/contact'], logo: 'both locally served supplied-logo instances passed', menu: 'passed including no-JS', reducedMotion: 'passed', forcedColors: 'border check passed' };
    fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
    console.log('BUILT_SITE_BROWSER_REVIEW', JSON.stringify(report));
  } catch (err) {
    fs.writeFileSync(`${out}/failure.txt`, err.stack || String(err));
    throw err;
  } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exit(1); });
