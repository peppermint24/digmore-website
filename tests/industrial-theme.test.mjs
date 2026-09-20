import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const css=read('src/styles/earthworks.css');
const layout=read('src/layouts/EarthworksLayout.astro');
const home=read('src/pages/index.astro');
const token=name=>css.match(new RegExp(`--ew-${name}:\\s*(#[a-f0-9]{6})`,'i'))?.[1].toLowerCase();
const lum=hex=>{
  const v=hex.slice(1).match(/../g).map(h=>parseInt(h,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
  return .2126*v[0]+.7152*v[1]+.0722*v[2];
};
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
test('one stylesheet owns the homepage rather than layered conflicting themes',()=>{
  assert.match(layout,/import '\.\.\/styles\/earthworks\.css'/);
  assert.doesNotMatch(layout,/industrial\.css/);
});
test('reference palette is neutral charcoal with measured yellow',()=>{
  for(const [key,value] of Object.entries({bg:'#262626',panel:'#181818',raised:'#3e3e3e',text:'#f2f2f2',muted:'#bcbcbc',amber:'#fcb026',hover:'#e19d22'})) assert.equal(token(key),value,key);
  assert.match(layout,/name="theme-color" content="#262626"/);
});
test('font requests use the declared substitute families, not old fonts or JCB assets',()=>{
  assert.match(layout,/family=Saira:wght/); assert.match(layout,/family=Saira\+Semi\+Condensed/);
  assert.doesNotMatch(layout,/family=Oswald|family=DM\+Sans/);
  assert.doesNotMatch(layout+css+home,/https?:\/\/[^\s"')]*(?:jcb\.com|jcber-webfont|jcbebc__)/i);
  assert.match(css,/--ew-display: 'Saira Semi Condensed'/);
});
test('headline scale, normal tracking and button geometry reflect measured reference',()=>{
  assert.match(css,/\.hero h1 \{ font-size: 64px; line-height: 76px/);
  assert.match(css,/h2 \{ font-size: 37px; line-height: 44px/);
  assert.match(css,/border-radius: 4px/);
  assert.match(css,/letter-spacing: normal/);
  assert.doesNotMatch(css,/text-transform:\s*uppercase/);
});
test('copy uses readable case and direct product labels',()=>{
  assert.match(home,/>Dig more\.<br \/>Build more\.</);
  assert.match(home,/>Find your wear parts</);
  assert.ok(!home.includes('GROUND / WORK'));
});
test('all defined text pairs meet a 4.5:1 contrast target',()=>{
  for(const surface of ['bg','panel','raised']) for(const foreground of ['text','muted','amber']) assert.ok(contrast(token(surface),token(foreground))>=4.5,`${foreground}/${surface}`);
  for(const button of ['amber','hover']) assert.ok(contrast(token('bg'),token(button))>=4.5,button);
});
test('stock photo selection, existing WhatsApp destination and consent-by-click remain',()=>{
  assert.match(home,/photos\/20760025/);
  assert.match(home,/https:\/\/wa.me\/919410105848\?text=/);
  assert.ok(!home.includes('<form'));
});
