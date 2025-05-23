import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  build: {
    assets: '_astro',
    inlineStylesheets: 'always'
  },
  compressHTML: true,
  outDir: './docs',
  base: '/',
  vite: {
    build: {
      cssCodeSplit: false
    }
  }
});