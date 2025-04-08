import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  build: {
    assets: 'assets',
    inlineStylesheets: 'always'
  },
  compressHTML: true,
  outDir: './docs',
  base: '/'
});