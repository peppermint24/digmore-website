import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const theme = read('src/styles/industrial.css');
const layout = read('src/layouts/EarthworksLayout.astro');
const tokens = Object.fromEntries([...theme.matchAll(/--([\w-]+):\s*(#[\da-f]{6})\s*;/gi)].map((match) => [match[1], match[2]]));
const luminance = (hex) => {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const channels = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255);
  const linear = channels.map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
};
const contrast = (first, second) => {
  const a = luminance(tokens[first]);
  const b = luminance(tokens[second]);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};

test('industrial layer follows the original homepage stylesheet', () => {
  assert.match(layout, /import '\.\.\/styles\/earthworks\.css';\s*import '\.\.\/styles\/industrial\.css';/);
  assert.match(theme, /body\.earthworks-site\s*\{/);
});

test('browser theme color matches the dark navigation', () => {
  assert.ok(layout.includes(`name="theme-color" content="${tokens['ew-header']}"`));
  assert.match(theme, /\.site-header\s*\{\s*background: var\(--ew-header\)/);
});

test('catalogue and closing content keep neutral light backgrounds', () => {
  assert.ok(luminance(tokens['ew-paper']) > .8);
  assert.ok(luminance(tokens['ew-night']) < .03);
  assert.match(theme, /\.product-range, \.closing-section\s*\{\s*background: var\(--ew-paper\)/);
});

test('defined text and focus pairs meet minimum contrast targets', () => {
  // Token checks only: this is not a full rendered accessibility audit.
  const pairs = [
    ['ew-on-dark', 'ew-header', 4.5],
    ['ew-on-dark', 'ew-night', 4.5],
    ['ew-on-dark', 'ew-charcoal', 4.5],
    ['ew-muted-dark', 'ew-charcoal', 4.5],
    ['ew-muted-dark', 'ew-night', 4.5],
    ['ew-ink', 'ew-amber', 4.5],
    ['ew-ink', 'ew-paper', 4.5],
    ['ew-muted', 'ew-paper', 4.5],
    ['ew-muted', 'ew-hover-light', 4.5],
    ['ew-focus-light', 'ew-paper', 3],
    ['ew-amber', 'ew-charcoal', 3],
  ];
  for (const [foreground, background, minimum] of pairs) {
    const ratio = contrast(foreground, background);
    assert.ok(ratio >= minimum, `${foreground} on ${background}: ${ratio.toFixed(2)} < ${minimum}`);
  }
});

test('mobile navigation, reduced motion and forced colors have theme rules', () => {
  assert.match(theme, /@media\(max-width:799px\)/);
  assert.match(theme, /\.mobile-nav nav\s*\{\s*background: var\(--ew-header\)/);
  assert.match(theme, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(theme, /@media\(forced-colors:active\)/);
  assert.match(theme, /outline-color: Highlight !important/);
});

test('theme retains the existing image and does not load reference-brand assets', () => {
  assert.ok(!/url\s*\(/i.test(theme));
  assert.ok(!/jcb\.com/i.test(layout));
  assert.match(theme, /pointer-events: none/);
});
