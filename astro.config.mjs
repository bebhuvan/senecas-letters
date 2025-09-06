import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://seneca-letters.r-bhuvanesh2007.workers.dev',
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto', // Enable CSS caching
    assets: '_astro'
  },
  integrations: [
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: undefined,
          assetFileNames: '_astro/[name].[hash][extname]',
          chunkFileNames: '_astro/[name].[hash].js',
          entryFileNames: '_astro/[name].[hash].js'
        }
      }
    }
  },
  compressHTML: true
});