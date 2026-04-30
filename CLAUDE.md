# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:4321)
npm run build      # Production build
npm run preview    # Preview production build locally
```

No test suite or lint script is configured.

## Architecture

**Aurin** is the website for a Mexican graphic design/branding agency. It is an **Astro 5 SSR app** deployed to **Vercel**, with React components used for interactive islands. The default locale is Spanish (`es`); English (`en`) lives under `/en/` prefix.

### Key directories

```
src/
├── pages/             # File-based routes (SSR)
│   ├── api/           # Server endpoints (contact, calendar, chat, speedlify, etc.)
│   ├── en/            # English locale mirrors of main pages
│   └── proyecto-payload/  # Dynamic project detail pages
├── components/
│   ├── ui/            # Reusable primitives (Header, Footer, MegaMenu, Cards, Buttons…)
│   ├── modules/       # Feature modules (chatbot, contact form, SEO, banner effects)
│   └── sections/      # Page sections organized by page (home/, services/, projects/, us/)
├── layouts/
│   └── Layout.astro   # Root layout — injects global CSS, SEO, Chatbot, SpotlightCursor, Analytics
├── lib/
│   ├── payload.ts     # Payload CMS API client (projects, categories, tags)
│   ├── calendar/      # Google Calendar integration (appointment booking)
│   ├── chatbot/       # Chatbot session + intent logic
│   └── mailing/       # Email via Resend (contact, appointment confirmations)
├── i18n/
│   ├── translations.ts  # Full string catalog (ES/EN objects)
│   └── utils.ts         # getLangFromUrl, getLocalizedUrl helpers
└── styles/
    └── global.css     # CSS custom properties (design tokens) + reset
```

### Data sources

- **Payload CMS** (`https://aurin-payload-cms.vercel.app/api`) — único CMS, fuente de proyectos. Usar clase `PayloadAPI` de `src/lib/payload.ts`. Env vars: `PAYLOAD_API_URL`, `PAYLOAD_SERVER_URL`.
- **n8n webhook** (`N8N_WEBHOOK_URL`) — chatbot AI backend.
- **Resend** (`RESEND_API_KEY`) — transactional email.
- **Google Calendar** — appointment scheduling via `src/lib/calendar/`.
- **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`) — file uploads.
- **reCAPTCHA** (`RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY`) — contact form protection.

### Styling system

All component styles use **CSS Modules** (`.module.css` files co-located with their component). Global design tokens live in `src/styles/global.css`. Follow `CSS_STANDARDS.md` for naming and patterns:

- CSS class names: **camelCase** (CSS Modules convention).
- CSS variables: **kebab-case** with category prefix — `--color-*`, `--font-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--transition-*`, `--z-*`.
- Primary fonts: `Urbanist` (body) and `Titillium Web` (display).
- Brand colors: `--color-yellow: #D0DF00` (accent), `--color-black-a: #0A0A0A` (dark background).
- Responsive breakpoints (desktop-first): 1280 → 992 → 768 → 480px.
- **Never** use inline styles, magic numbers, or negative z-index. Always use CSS variable tokens.
- Section containers need `position: relative; overflow: hidden`. Content layer sits at `z-index: 2` above decorative background layers at `z-index: 0–1`.

### i18n pattern

Pages read the current locale with `getLangFromUrl(Astro.url)` and pull strings from `translations.ts`. Spanish is the default and has no URL prefix. When adding a page, create both `src/pages/[page].astro` (ES) and `src/pages/en/[page].astro` (EN).

### API routes

All API endpoints are under `src/pages/api/`. They run server-side (SSR). CORS headers allowing all origins are applied globally via `vercel.json`.

### Environment variables

Required in `.env` for local dev:

```
RECAPTCHA_SITE_KEY / RECAPTCHA_SECRET_KEY
PAGESPEED_API_KEY
PAYLOAD_API_URL / PAYLOAD_SERVER_URL
BLOB_READ_WRITE_TOKEN
RESEND_API_KEY
N8N_WEBHOOK_URL
```
