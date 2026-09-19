import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const home = read('src/pages/index.astro');
const layout = read('src/layouts/EarthworksLayout.astro');
const css = read('src/styles/earthworks.css');

test('homepage has one descriptive h1 and a keyboard skip target', () => {
  assert.equal((home.match(/<h1\b/g) || []).length, 1);
  assert.match(home, /<main id="main-content" tabindex="-1">/);
  assert.match(layout, /href="#main-content"/);
});
test('navigation retains existing site destinations', () => {
  for (const path of ['/products', '/about', '/contact']) {
    assert.ok(home.includes(`href="${path}"`));
    assert.ok(layout.includes(`href="${path}"`));
  }
});
test('hero reserves image space and prioritizes responsive image loading', () => {
  assert.match(home, /width="1200" height="1800"/);
  assert.match(home, /fetchpriority="high"/);
  assert.match(home, /loading="eager"/);
  assert.match(home, /srcset=/);
  assert.match(home, /alt="Yellow excavator lifting rock/);
});
test('mobile navigation works without JS and supports enhanced dismissal', () => {
  assert.match(layout, /<details class="mobile-nav"/);
  assert.match(layout, /<summary>/);
  assert.match(layout, /event.key === 'Escape'/);
  assert.match(layout, /summary\?\.focus\(\)/);
});
test('design has mobile, reduced-motion and keyboard-focus rules', () => {
  assert.match(css, /@media\(max-width:799px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /focus-visible/);
});
test('external tabs are protected and the stock photo is credited', () => {
  const targets = home.match(/<a\b[^>]*target="_blank"[^>]*>/g) || [];
  assert.ok(targets.length > 0);
  for (const target of targets) assert.match(target, /rel="noopener noreferrer"/);
  assert.match(home, /Gowtham AGM \/ Pexels/);
  assert.ok(!home.includes('Unsplash'));
});
test('unsupported testimonial and performance claims are not carried over', () => {
  assert.ok(!home.includes('30%'));
  assert.ok(!home.includes('over 5 years'));
  assert.ok(!home.includes('Industry-leading'));
});
