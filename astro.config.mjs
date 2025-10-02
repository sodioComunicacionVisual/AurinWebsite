import { defineConfig } from 'astro/config';
import lenis from 'astro-lenis';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  integrations: [lenis(), react()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: ['javascript', 'typescript', 'html', 'css', 'json', 'astro'],
    },
  },
});