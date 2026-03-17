# CSS Standards & Style Guide for LLMs

> **Purpose**: This document provides comprehensive CSS standards, patterns, and best practices used in this codebase. It is optimized for LLM consumption to ensure consistent, high-quality code generation.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Organization](#file-organization)
3. [Naming Conventions](#naming-conventions)
4. [CSS Variables System](#css-variables-system)
5. [Component Structure](#component-structure)
6. [Background Layers Pattern](#background-layers-pattern)
7. [Responsive Design System](#responsive-design-system)
8. [Animation Standards](#animation-standards)
9. [Accessibility Requirements](#accessibility-requirements)
10. [Performance Optimization](#performance-optimization)
11. [Common Patterns](#common-patterns)
12. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Architecture Overview

### Technology Stack
- **Framework**: Astro with CSS Modules
- **Styling**: CSS Modules (`.module.css`) for scoped styles
- **Variables**: CSS Custom Properties (CSS Variables)
- **Methodology**: Component-based with atomic design principles

### Design Philosophy
```
LAYERED ARCHITECTURE:
┌─────────────────────────────────────┐
│  Layer N: Content (z-index: 2+)     │  ← Interactive elements
├─────────────────────────────────────┤
│  Layer 1.5: Decorative patterns     │  ← Doodles, textures
├─────────────────────────────────────┤
│  Layer 1: Overlays/Gradients        │  ← Color overlays
├─────────────────────────────────────┤
│  Layer 0: Background images         │  ← Base backgrounds
└─────────────────────────────────────┘
```

---

## File Organization

### Directory Structure
```
src/
├── shared/
│   ├── styles/
│   │   ├── variables.css      # Design tokens (colors, spacing, etc.)
│   │   └── global.css         # Reset + base styles
│   ├── animations/
│   │   ├── keyframes.css      # @keyframes definitions
│   │   └── animations.module.css
│   └── ui/
│       ├── atoms/             # Button, Badge, Icon, Text
│       ├── molecules/         # Card, FormField, NavLink
│       └── organisms/         # Container, Header
└── widgets/                   # Page sections (MainBanner, Footer, etc.)
    └── [WidgetName]/
        ├── [WidgetName].astro
        └── [WidgetName].module.css
```

### File Naming
```css
/* CORRECT */
ComponentName.module.css
ComponentName.astro

/* INCORRECT */
component-name.module.css
componentName.css
```

---

## Naming Conventions

### CSS Class Names (camelCase for CSS Modules)
```css
/* Container/Section level */
.mainBanner { }
.coursesSection { }
.signupSection { }

/* Structural elements */
.content { }
.headerContainer { }
.backgroundImage { }
.gradientOverlay { }

/* Sub-components */
.headerContent { }
.featureTags { }
.diffCards { }

/* State/Variant modifiers */
.isActive { }
.isDisabled { }
.variantPrimary { }
```

### CSS Variable Naming (kebab-case with category prefix)
```css
/* Pattern: --category-property[-variant] */

/* Colors */
--color-primary: #FC5602;
--color-primary-alt: #FF5E22;
--color-primary-hover: #E54D00;
--color-dark: #03192D;
--color-white: #FFFFFF;

/* Typography */
--font-family-primary: 'Mulish', sans-serif;
--font-size-base: 16px;
--font-weight-bold: 700;
--line-height-base: 1.5;

/* Spacing */
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-4: 16px;

/* Layout */
--radius-md: 8px;
--shadow-lg: 0px 4px 40px rgba(0, 0, 0, 0.10);
--transition-fast: 150ms ease;
```

---

## CSS Variables System

### Color Palette Definition
```css
:root {
  /* Primary Brand Colors */
  --color-primary: #FC5602;           /* Main brand orange */
  --color-primary-alt: #FF5E22;       /* Lighter variant */
  --color-primary-hover: #E54D00;     /* Darkened for hover */
  --color-primary-light: rgba(248, 77, 13, 0.10);

  /* Secondary/Dark Colors */
  --color-dark: #03192D;              /* Primary text, dark backgrounds */
  --color-dark-light: rgba(3, 25, 45, 0.80);

  /* Neutral Colors */
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-gray-100: #F9F9F8;
  --color-gray-200: #F2F3F3;
  --color-gray-300: rgba(0, 0, 0, 0.10);
  --color-cream: #FFF8F0;             /* Warm neutral background */
}
```

### Spacing Scale (4px base unit)
```css
:root {
  --spacing-1: 4px;    /* Micro spacing */
  --spacing-2: 8px;    /* Tight spacing */
  --spacing-3: 12px;   /* Small spacing */
  --spacing-4: 16px;   /* Base spacing */
  --spacing-5: 20px;   /* Medium spacing */
  --spacing-6: 24px;   /* Standard gap */
  --spacing-8: 32px;   /* Large spacing */
  --spacing-10: 40px;  /* Section padding */
  --spacing-12: 48px;  /* Large section padding */
  --spacing-16: 64px;  /* Hero spacing */
  --spacing-20: 80px;  /* Major section breaks */
}
```

### Typography Scale
```css
:root {
  /* Font Families */
  --font-family-primary: 'Mulish', -apple-system, sans-serif;
  --font-family-display: 'Geologica', -apple-system, sans-serif;

  /* Font Sizes (px for predictability) */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  --font-size-4xl: 36px;
  --font-size-5xl: 48px;
  --font-size-6xl: 70px;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.25;    /* Headings */
  --line-height-base: 1.5;      /* Body text */
  --line-height-relaxed: 1.75;  /* Long-form content */
}
```

### Border Radius Scale
```css
:root {
  --radius-sm: 4px;      /* Buttons, inputs */
  --radius-md: 8px;      /* Cards, small containers */
  --radius-lg: 16px;     /* Medium cards */
  --radius-xl: 24px;     /* Large cards */
  --radius-2xl: 32px;    /* Hero sections */
  --radius-3xl: 48px;    /* Extra large containers */
  --radius-full: 100px;  /* Pills, circular elements */
}
```

### Z-Index Scale
```css
:root {
  --z-base: 0;        /* Background layers */
  --z-dropdown: 100;  /* Dropdown menus */
  --z-sticky: 200;    /* Sticky elements */
  --z-header: 300;    /* Fixed header */
  --z-overlay: 400;   /* Modal overlays */
  --z-modal: 500;     /* Modal content */
  --z-tooltip: 600;   /* Tooltips */
}
```

---

## Component Structure

### Standard Section Component Template
```css
/* =============================================
   [ComponentName] Widget - [Style Description]
   [Brief purpose description]
   ============================================= */

.componentName {
  position: relative;
  width: 100%;
  padding: var(--spacing-16) var(--spacing-8);
  overflow: hidden;
}

/* ===========================================
   Background Layers
   =========================================== */
.backgroundImage {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.doodlesLayer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url('/Doodles.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.08;
}

.gradientOverlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* ===========================================
   Content Container
   =========================================== */
.content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-10);
}

/* ===========================================
   Responsive Breakpoints
   =========================================== */
@media (max-width: 1280px) { /* Large Desktop */ }
@media (max-width: 992px)  { /* Tablet Landscape */ }
@media (max-width: 768px)  { /* Tablet Portrait */ }
@media (max-width: 480px)  { /* Mobile */ }
```

### Astro Component Template
```astro
---
/**
 * [ComponentName] Widget
 * [Brief description]
 * Structure:
 *   - Layer 0: Background image
 *   - Layer 0.5: Doodles pattern (optional)
 *   - Layer 1: Gradient overlay
 *   - Layer 2: Content
 */

import styles from './ComponentName.module.css';

export interface Props {
  class?: string;
}

const { class: className = '' } = Astro.props;
const classes = [styles.componentName, className].filter(Boolean).join(' ');
---

<section class={classes} id="section-id">
  <!-- Layer 0: Background -->
  <div class={styles.backgroundImage}></div>

  <!-- Layer 0.5: Doodles Pattern -->
  <div class={styles.doodlesLayer}></div>

  <!-- Layer 1: Gradient Overlay -->
  <div class={styles.gradientOverlay}></div>

  <!-- Layer 2: Content -->
  <div class={styles.content}>
    <slot />
  </div>
</section>
```

---

## Background Layers Pattern

### Purpose
Create depth and visual interest through layered backgrounds while maintaining content readability.

### Layer Order (Bottom to Top)
```
z-index: 2+  → Content (text, buttons, cards)
z-index: 1   → Gradient overlays, decorative elements
z-index: 0   → Doodles/patterns layer
z-index: 0   → Base background image/color (rendered first)
```

### Doodles Layer Implementation
```css
/* Standard doodles layer - adjust opacity per section */
.doodlesLayer {
  position: absolute;
  inset: 0;                              /* Shorthand for top/right/bottom/left: 0 */
  z-index: 0;                            /* Or 1 if above gradient */
  pointer-events: none;                  /* Allow clicks through */
  background-image: url('/Doodles.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.08;                         /* Subtle visibility */
}

/* Opacity guidelines by background color */
/* Dark backgrounds (orange gradient): opacity: 0.08 */
/* Light backgrounds (cream, white):   opacity: 0.06 */
/* Image backgrounds:                  opacity: 0.15 */
```

### Gradient Overlay Patterns
```css
/* Orange brand gradient */
.gradientOverlay {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-alt) 100%
  );
}

/* Dark overlay for image backgrounds */
.gradientOverlay {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(252, 86, 2, 0.2) 100%
  );
}
```

---

## Responsive Design System

### Breakpoint Strategy (Desktop-First)
```css
/* Base styles: Desktop (1440px+) */
.component { }

/* Large Desktop: 1280px */
@media (max-width: 1280px) {
  .component {
    /* Reduce padding, font sizes slightly */
  }
}

/* Tablet Landscape: 992px */
@media (max-width: 992px) {
  .component {
    /* Switch to single column layouts */
    /* Reduce gaps and spacing */
  }
}

/* Tablet Portrait: 768px */
@media (max-width: 768px) {
  .component {
    /* Stack all elements vertically */
    /* Reduce font sizes further */
  }
}

/* Mobile: 480px */
@media (max-width: 480px) {
  .component {
    /* Minimum padding */
    /* Hide decorative elements */
    /* Smallest font sizes */
  }
}
```

### Responsive Typography Pattern
```css
.title {
  font-size: var(--font-size-5xl);  /* Desktop: 48px */
}

@media (max-width: 1280px) {
  .title { font-size: var(--font-size-4xl); }  /* 36px */
}

@media (max-width: 992px) {
  .title { font-size: var(--font-size-3xl); }  /* 30px */
}

@media (max-width: 768px) {
  .title { font-size: var(--font-size-2xl); }  /* 24px */
}

@media (max-width: 480px) {
  .title { font-size: var(--font-size-xl); }   /* 20px */
}
```

### Responsive Spacing Pattern
```css
.section {
  padding: var(--spacing-20) var(--spacing-8);
}

@media (max-width: 1280px) {
  .section { padding: var(--spacing-16) var(--spacing-6); }
}

@media (max-width: 992px) {
  .section { padding: var(--spacing-12) var(--spacing-6); }
}

@media (max-width: 768px) {
  .section { padding: var(--spacing-10) var(--spacing-4); }
}

@media (max-width: 480px) {
  .section { padding: var(--spacing-8) var(--spacing-4); }
}
```

### Grid to Stack Pattern
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-8);
}

@media (max-width: 992px) {
  .grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
}
```

---

## Animation Standards

### Transition Defaults
```css
/* Use CSS variables for consistency */
.element {
  transition:
    transform var(--transition-fast),
    opacity var(--transition-base),
    background var(--transition-fast);
}

/* Transition timing values */
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;
--transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover State Pattern
```css
.card {
  transition:
    transform var(--transition-smooth),
    box-shadow var(--transition-smooth);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Reduced Motion Support (REQUIRED)
```css
@media (prefers-reduced-motion: reduce) {
  .animatedElement {
    transition: none;
    animation: none;
  }

  .animatedElement:hover {
    transform: none;
  }
}
```

---

## Accessibility Requirements

### Focus States (REQUIRED for all interactive elements)
```css
.button:focus-visible,
.link:focus-visible,
.card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Never use outline: none without alternative */
```

### Color Contrast
```css
/* Minimum contrast ratios (WCAG 2.1 AA) */
/* Normal text: 4.5:1 */
/* Large text (18px+ bold, 24px+ regular): 3:1 */
/* UI components: 3:1 */

/* Use semi-transparent overlays carefully */
.textOnImage {
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
}
```

### Screen Reader Support
```css
/* Visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Performance Optimization

### Background Images
```css
/* Use CSS background-image for decorative images */
.backgroundImage {
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
}

/* Benefits: */
/* - No layout shift */
/* - Easier responsive control */
/* - Can be lazy-loaded via CSS */
```

### Efficient Selectors
```css
/* GOOD: Direct class selectors */
.cardTitle { }
.cardDescription { }

/* AVOID: Deep nesting */
.card .content .header .title { }

/* AVOID: Universal selectors in components */
.card * { }
```

### GPU-Accelerated Properties
```css
/* Use transform/opacity for animations (GPU accelerated) */
.element {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.3s, opacity 0.3s;
}

/* AVOID animating these properties */
/* width, height, top, left, margin, padding */
```

### pointer-events: none
```css
/* Use on decorative layers to prevent interaction blocking */
.decorativeElement {
  pointer-events: none;
}
```

---

## Common Patterns

### Centered Container
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-8);
}
```

### Flex Column with Gap
```css
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}
```

### Absolute Fill
```css
.fill {
  position: absolute;
  inset: 0;  /* Shorthand for top/right/bottom/left: 0 */
}
```

### Decorative Circles
```css
.decorativeCircle {
  position: absolute;
  border-radius: 50%;
  border: 80px solid rgba(255, 255, 255, 0.05);
  pointer-events: none;
}
```

### Text Truncation
```css
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lineClamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## Anti-Patterns to Avoid

### DON'T: Inline styles in components
```astro
<!-- BAD -->
<div style="padding: 20px; color: red;">

<!-- GOOD -->
<div class={styles.container}>
```

### DON'T: Magic numbers
```css
/* BAD */
.element {
  padding: 17px;
  margin-top: 43px;
}

/* GOOD */
.element {
  padding: var(--spacing-4);
  margin-top: var(--spacing-10);
}
```

### DON'T: !important (except for utility overrides)
```css
/* BAD */
.title {
  color: red !important;
}

/* GOOD - Use more specific selectors */
.section .title {
  color: var(--color-primary);
}
```

### DON'T: Fixed pixel heights on content containers
```css
/* BAD */
.content {
  height: 500px;
}

/* GOOD */
.content {
  min-height: 500px;
}
```

### DON'T: Negative z-index
```css
/* BAD - Can cause stacking issues */
.background {
  z-index: -1;
}

/* GOOD - Use proper layering */
.background {
  z-index: 0;
}
.content {
  z-index: 2;
}
```

### DON'T: Viewport units for font-size without clamp
```css
/* BAD - Can be too small or too large */
.title {
  font-size: 5vw;
}

/* GOOD - Constrained responsive sizing */
.title {
  font-size: clamp(24px, 5vw, 48px);
}
```

---

## Quick Reference Cheatsheet

### Standard Section Checklist
- [ ] `position: relative` on container
- [ ] `overflow: hidden` on container
- [ ] Background layers with proper z-index
- [ ] Content with `z-index: 2`
- [ ] Responsive breakpoints (1280, 992, 768, 480)
- [ ] Reduced motion support
- [ ] Focus states on interactive elements

### CSS Variable Categories
| Category | Prefix | Example |
|----------|--------|---------|
| Colors | `--color-` | `--color-primary` |
| Spacing | `--spacing-` | `--spacing-8` |
| Typography | `--font-` | `--font-size-xl` |
| Radius | `--radius-` | `--radius-lg` |
| Shadows | `--shadow-` | `--shadow-md` |
| Transitions | `--transition-` | `--transition-fast` |
| Z-Index | `--z-` | `--z-header` |

### Opacity Guidelines for Doodles Layer
| Background Type | Recommended Opacity |
|-----------------|---------------------|
| Dark/Orange gradient | `0.08` |
| Light cream/white | `0.06` |
| Over images | `0.15` |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-24 | Initial documentation |

---

**Document maintained by**: Development Team
**Last updated**: December 2024
**For questions**: Refer to component source files or design system documentation
