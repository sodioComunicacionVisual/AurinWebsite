import { defineConfig } from 'astro/config';
import lenis from 'astro-lenis';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://aurin.mx',
  output: 'server',
  adapter: vercel(),
  integrations: [lenis(), react()],
  vite: {
    // Configuraciones de Vite si las necesitas
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: ['javascript', 'typescript', 'html', 'css', 'json', 'astro'],
    },
  },
});
