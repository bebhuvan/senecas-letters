import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://seneca-letters.r-bhuvanesh2007.workers.dev',
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
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
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    },
    ssr: {
      noExternal: []
    }
  },
  compressHTML: true
});