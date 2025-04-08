import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  build: {
    assets: 'assets',
    inlineStylesheets: 'never'
  },
  compressHTML: true,
  outDir: './docs',
  base: '/digmore-website'
});