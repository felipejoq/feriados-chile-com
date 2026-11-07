// @ts-check
import {defineConfig} from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import partytown from '@astrojs/partytown';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://feriados-chile.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    react(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap()
  ],
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
  server: {
    host: '0.0.0.0'
  },
});
