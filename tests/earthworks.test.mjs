import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const home = read('src/pages/index.astro');
const layout = read('src/layouts/EarthworksLayout.astro');
const css = read('src/styles/earthworks.css');
test('homepage has one h1 and a keyboard skip target', () => {
  assert.equal((home.match(/<h1\b/g) || []).length, 1);
  assert.match(home, /<main id="main-content" tabindex="-1">/);
  assert.match(layout, /href="#main-content"/);
});
test('navigation retains existing destinations', () => {
  for (const p of ['/products','/about','/contact']) {
    assert.ok(home.includes(`href="${p}"`)); assert.ok(layout.includes(`href="${p}"`));
  }
});
test('hero reserves image dimensions and requests responsive priority loading', () => {
  assert.match(home, /width="1200" height="1800"/);
  assert.match(home, /fetchpriority="high"/); assert.match(home, /loading="eager"/);
  assert.match(home, /srcset=/); assert.match(home, /alt="Yellow excavator lifting rock/);
});
test('native mobile navigation and Escape focus restoration are retained', () => {
  assert.match(layout, /<details class="mobile-nav"/); assert.match(layout, /<summary>/);
  assert.match(layout, /event.key === 'Escape'/); assert.match(layout, /summary\?\.focus\(\)/);
});
test('responsive, reduced-motion, forced-colors and focus rules exist', () => {
  for (const term of ['@media(max-width:799px)','prefers-reduced-motion:reduce','forced-colors:active','focus-visible']) assert.ok(css.includes(term));
});
test('new tabs are protected and application photography is credited', () => {
  const links=home.match(/<a\b[^>]*target="_blank"[^>]*>/g)||[];
  assert.ok(links.length>0);
  for(const a of links) assert.match(a,/rel="noopener noreferrer"/);
  assert.match(home,/Gowtham AGM \/ Pexels/);
});
test('no unverified testimonial, certification or savings claims are introduced', () => {
  for(const term of ['30%','over 5 years','Industry-leading','ISO 9001','JCB approved']) assert.ok(!home.includes(term));
});
