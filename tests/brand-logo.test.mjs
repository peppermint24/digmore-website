import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const component = read('src/components/BrandLogo.astro');
const layout = read('src/layouts/EarthworksLayout.astro');
const css = read('src/styles/earthworks.css');
const logo = readFileSync(new URL('../public/images/brand/digmore-logo.webp', import.meta.url));

test('supplied logo asset is a valid, integrity-checked WebP container', () => {
  assert.equal(logo.subarray(0, 4).toString(), 'RIFF');
  assert.equal(logo.subarray(8, 12).toString(), 'WEBP');
  assert.equal(logo.readUInt32LE(4) + 8, logo.length);
  assert.equal(createHash('sha256').update(logo).digest('hex'), 'fa75cf797d4f786f9aaf14b18bd75bb6cd4e023a7c85556f37a1d1df11afdafa');
});
test('homepage header and footer use the supplied logo instead of placeholder lettering', () => {
  assert.match(layout, /import BrandLogo from '\.\.\/components\/BrandLogo\.astro'/);
  assert.match(layout, /<BrandLogo \/>/);
  assert.match(layout, /<BrandLogo variant="footer" \/>/);
  assert.doesNotMatch(layout, /class="wordmark"/);
});
test('logo has a local source, reserved square dimensions and accessible home link', () => {
  assert.match(component, /src="\/images\/brand\/digmore-logo\.webp"/);
  assert.match(component, /aria-label="Digmore home"/);
  assert.match(component, /alt="Digmore — Dig more, build more!"/);
  assert.match(component, /width="384"/);
  assert.match(component, /height="384"/);
});
test('full emblem remains uncropped and unrecolored, with responsive header space', () => {
  assert.match(component, /object-fit: contain/);
  assert.match(component, /background: #fff/);
  assert.doesNotMatch(component, /filter:|mix-blend-mode:|clip-path:|object-fit: cover/);
  assert.match(component, /width: 192px; height: 192px/);
  assert.match(component, /width: 80px; height: 80px/);
  assert.match(css, /min-height: 112px/);
  assert.match(css, /min-height: 96px/);
});
