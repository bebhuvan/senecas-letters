// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://senecas-letters.r-bhuvanesh2007.workers.dev',
  adapter: cloudflare(),
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  },
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {},
        },
      },
    },
  },
});
