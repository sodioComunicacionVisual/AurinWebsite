import { defineConfig } from 'astro/config';
import lenis from 'astro-lenis';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: 'server',
  adapter: vercel(),
  integrations: [lenis(), react()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: ['javascript', 'typescript', 'html', 'css', 'json', 'astro'],
    },
  },
});