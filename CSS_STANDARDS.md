# CSS Standards & Style Guide — Aurin

> Last updated: 2026-04-30
> Source of truth for all CSS decisions in this project.

---

## Architecture

- **CSS Modules** (`.module.css`) co-located with each component for scoped styles.
- **Global tokens** in `src/styles/global.css` (`:root` custom properties).
- **Global CSS** in `src/styles/chatbot.css` (BEM namespace `chatbot-*`, intentionally global).
- Framework: **Astro 5 SSR** + React islands. Desktop-first responsive.

---

## Naming Conventions

### CSS class names
**New files**: camelCase (CSS Modules convention).
**Existing files**: many use kebab-case (historical). Migrate opportunistically when editing a component, not as a standalone task.

```css
/* New files — camelCase */
.heroSection { }
.cardTitle { }
.imageOverlay { }

/* Existing files — kebab-case (do not break, migrate gradually) */
.hero-section { }  /* referenced as styles['hero-section'] in Astro/TSX */
.card-title { }
```

### CSS variable names
Always **kebab-case** with category prefix. Never invent new tokens — use what's defined in `global.css`.

```css
--color-*       /* colors */
--font-*        /* font families, sizes, weights */
--spacing-*     /* spacing scale */
--radius-*      /* border radii */
--z-*           /* z-index scale */
--transition-*  /* transitions */
```

---

## Color Palette

Defined in `src/styles/global.css`. Use these tokens — never hardcode hex values.

```css
/* Brand */
--color-yellow:  #D0DF00;   /* Primary accent — buttons, highlights */

/* Backgrounds */
--color-black-a: #0A0A0A;   /* Page background (darkest) */
--color-black-b: #161616;   /* Card backgrounds */
--color-gray-b:  #282828;   /* Elevated surfaces */

/* Text */
--color-white:   #FFFFFF;
--color-gray-a:  #A0A0A0;   /* Secondary text */
```

---

## Typography

**Fonts**: `Titillium Web` for both display and body (single family, multiple weights).
Aliases: `--font-body` and `--font-heading` both resolve to `Titillium Web`.

### Type scale
The codebase uses semantic utility classes (applied directly in HTML) and CSS variables:

```css
/* Heading variants (regular weight) */
--heading-1-size / --heading-1-line-height   /* 64px */
--heading-2-size / --heading-2-line-height   /* 48px */
--heading-3-size / --heading-3-line-height   /* 40px */
--heading-4-size / --heading-4-line-height   /* 36px */
--heading-5-size / --heading-5-line-height   /* 48px */
--heading-6-size                             /* 24px */

/* Heading variants (bold weight) */
--heading-bold-1-size   /* 64px */
--heading-bold-2-size   /* 48px */
/* ... through --heading-bold-5-size */

/* Body */
--body-0-size    /* 24px */
--body-1-size    /* 20px */
--body-2-size    /* 16px */
--body-3-size    /* 15px */
--body-4-size    /* 14px */

/* Font weights */
--font-weight-light:    300;
--font-weight-regular:  400;
--font-weight-medium:   500;
--font-weight-semibold: 600;
--font-weight-bold:     700;
```

---

## Spacing

4px base unit. Available steps: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20.

```css
--spacing-1:  4px;
--spacing-2:  8px;
--spacing-3:  12px;
--spacing-4:  16px;
--spacing-5:  20px;
--spacing-6:  24px;
--spacing-8:  32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
```

---

## Z-Index Scale

```css
--z-base:     0;
--z-dropdown: 100;
--z-sticky:   200;
--z-header:   300;
--z-overlay:  400;
--z-modal:    500;
--z-tooltip:  600;
```

Background layers within a section use `z-index: 0` (decorative) and `z-index: 2` (content).

---

## Border Radius

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   16px;
--radius-xl:   24px;
--radius-2xl:  32px;
--radius-3xl:  48px;
--radius-full: 100px;
```

---

## Transitions

```css
--transition-fast:   150ms ease;
--transition-base:   250ms ease;
--transition-slow:   400ms ease;
--transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Responsive Breakpoints (desktop-first)

```css
@media (max-width: 1280px) { }   /* Large desktop */
@media (max-width: 992px)  { }   /* Tablet landscape */
@media (max-width: 768px)  { }   /* Tablet portrait */
@media (max-width: 480px)  { }   /* Mobile */
```

---

## Section Layer Pattern

Every section container needs:

```css
.section {
  position: relative;   /* establishes stacking context */
  overflow: hidden;     /* clips decorative effects */
}
```

Layer order (bottom to top):

| z-index | Purpose |
|---------|---------|
| 0       | Background image / decorative elements |
| 1       | Gradient overlay |
| 2+      | Content (text, cards, interactive) |

---

## `!important` Usage

`!important` is acceptable in specific, documented scenarios. Never use it to work around specificity lazily.

### Intentional uses in this codebase

| File | Reason | Status |
|------|--------|--------|
| `SearchInput.module.css` | Browser autofill background hack (`-webkit-box-shadow` + `background: transparent`) | **Necessary** |
| `ScrollReveal.module.css` | Overrides JS-set `opacity` from animation library | **Necessary** |
| `chatbot.css` | Force-hides an element that third-party code may show | **Necessary** |
| `MainImage.module.css` | `:global(.ukiyo-wrapper)` — overrides inline styles injected by Ukiyo parallax library | **Necessary** |
| `HerramientasStorytellingScroll.module.css` | Overrides global `h2`/`h3` element styles from `global.css` (Astro scoping limitation) | **Architectural** |
| `SBanner.module.css` | Same pattern — global heading override | **Architectural** |
| `Form.module.css` | Browser UA input text color | **Necessary** |
| `Card.module.css` | Specificity conflict within module (`.card-yellow` vs `:not(.card-yellow)`) | **Refactor candidate** |
| `TallCard.module.css` | Color override in hover state inside responsive block | **Refactor candidate** |
| `LongCards.module.css` | Child component font-size + hover color | **Refactor candidate** |
| `SplitCard.module.css` | Color override that global styles compete with | **Refactor candidate** |
| `AnimatedCounter.module.css` | CSS custom property color with fallback | **Refactor candidate** |

### The "Architectural" pattern explained

Astro's `global.css` defines element selectors (`h1`, `h2`, `p`, etc.) with typographic styles. CSS Modules generate scoped class names, but they don't increase specificity over bare element selectors at the same level. When a component needs to override a global heading style inside a scoped block, `!important` is the pragmatic fix. Long-term solution: move element resets to lower-specificity rules or use CSS layers (`@layer`).

---

## Anti-Patterns

```css
/* ❌ Hardcoded hex values */
color: #D0DF00;
/* ✅ Use token */
color: var(--color-yellow);

/* ❌ Magic numbers */
padding: 17px;
/* ✅ Use scale */
padding: var(--spacing-4);

/* ❌ Inline styles in Astro/TSX */
<div style="padding: 20px">
/* ✅ CSS Module class */
<div class={styles.container}>

/* ❌ Negative z-index */
z-index: -1;
/* ✅ Proper layering */
z-index: 0; /* background layer */

/* ❌ Fixed pixel heights on content */
height: 500px;
/* ✅ */
min-height: 500px;

/* ❌ font-size in viewport units without clamp */
font-size: 5vw;
/* ✅ */
font-size: clamp(24px, 5vw, 48px);
```

---

## Standard Section Template

```astro
---
import styles from './ComponentName.module.css';
---

<section class={styles.section}>
  <!-- z-index: 0 — decorative background -->
  <div class={styles.background}></div>

  <!-- z-index: 2 — content -->
  <div class={styles.content}>
    <slot />
  </div>
</section>
```

```css
.section {
  position: relative;
  overflow: hidden;
  padding: var(--spacing-20) var(--spacing-8);
}

.background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 2;
  max-width: var(--content-max-width);
  margin: 0 auto;
}

@media (max-width: 768px) {
  .section {
    padding: var(--spacing-10) var(--spacing-4);
  }
}
```
