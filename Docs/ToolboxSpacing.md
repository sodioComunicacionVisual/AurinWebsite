# 📐 Especificaciones de Diseño - Strip Toolbox (HerramientasVariant)

## 🎯 Estructura HTML

```html
<div class="header-content">
  <div class="title-wrapper">
    <div class="_headingWrapper_vh2j4_1">
      <span class="_headingLight_vh2j4_8">Our toolbox</span>
      <h2 class="_headingHighlight_vh2j4_16">of Tools</h2>
    </div>
  </div>
  <p class="description body-1">
    With these capabilities, we shape solutions that connect, inspire and generate impact.
  </p>
</div>
```

---

## 📏 TAMAÑOS Y ESPACIADOS EXACTOS

### 🔷 Container Principal - `.header-content`

```css
.header-content {
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;                    /* ⭐ SPACING CLAVE entre título y descripción */
  flex: 1;
}
```

**Spacing clave:**
- **Gap entre título y descripción:** `30px`

---

### 🔷 Title Wrapper - `.title-wrapper`

```css
.title-wrapper {
  max-width: 488px;            /* ⭐ ANCHO MÁXIMO del contenedor de título */
}
```

**Tamaño clave:**
- **Max-width:** `488px`

---

### 🔷 Heading Wrapper - `.headingWrapper`

```css
.headingWrapper {
  flex: 1;
  max-width: 488px;            /* ⭐ ANCHO MÁXIMO */
  display: flex;
  flex-direction: column;
}
```

**Tamaño clave:**
- **Max-width:** `488px`

---

### 🔷 Light Text (Pequeño arriba) - `.headingLight`

```css
.headingLight {
  color: var(--color-white);
  font-size: 32px;             /* ⭐ TAMAÑO (--heading-5-size) */
  line-height: 35px;           /* ⭐ LINE HEIGHT (--heading-5-line-height) */
  font-family: var(--font-heading);
  font-weight: 300;
}
```

**Tipografía clave:**
- **Font-size:** `32px` (variable: `--heading-5-size`)
- **Line-height:** `35px` (variable: `--heading-5-line-height`)
- **Font-weight:** `300`
- **Font-family:** `var(--font-heading)` (Montserrat)
- **Color:** `var(--color-white)` (#FFFFFF)

---

### 🔷 Highlight Text (Grande amarillo) - `.headingHighlight`

```css
.headingHighlight {
  color: var(--color-yellow);
  font-size: 48px;             /* ⭐ TAMAÑO (--heading-2-size) */
  line-height: 50px;           /* ⭐ LINE HEIGHT (--heading-2-line-height) */
  font-family: var(--font-heading);
  font-weight: 300;
  white-space: nowrap;
  margin: 0;
}
```

**Tipografía clave:**
- **Font-size:** `48px` (variable: `--heading-2-size`)
- **Line-height:** `50px` (variable: `--heading-2-line-height`)
- **Font-weight:** `300`
- **Font-family:** `var(--font-heading)` (Montserrat)
- **Color:** `var(--color-yellow)` (#C5D400)
- **White-space:** `nowrap`
- **Margin:** `0`

**Mobile (max-width: 480px):**
```css
.headingHighlight {
  font-size: 36px;
  line-height: 40px;
}
```

---

### 🔷 Description (Párrafo) - `.description.body-1`

```css
.description {
  align-self: stretch;
  justify-content: center;
  display: flex;
  flex-direction: column;
  color: var(--color-white);
  margin: 0;
  
  /* Estilos de .body-1 */
  font-family: var(--font-body);
  font-size: 20px;             /* ⭐ TAMAÑO (--body-1-size) */
  line-height: auto;           /* ⭐ LINE HEIGHT (--body-1-line-height) */
  font-weight: 400;            /* ⭐ WEIGHT (--body-1-weight) */
}
```

**Tipografía clave:**
- **Font-size:** `20px` (variable: `--body-1-size`)
- **Line-height:** `auto` (variable: `--body-1-line-height`)
- **Font-weight:** `400`
- **Font-family:** `var(--font-body)` (Raleway)
- **Color:** `var(--color-white)` (#FFFFFF)
- **Margin:** `0`
- **Align-self:** `stretch` (ocupa todo el ancho disponible)

---

## 🎨 HEADER SECTION COMPLETO

```css
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 3.5rem;       /* ⭐ SPACING después del header: 56px */
  gap: 2rem;                   /* ⭐ GAP entre elementos: 32px */
  padding: 49px 50px;          /* ⭐ PADDING del header */
}
```

**Spacings clave:**
- **Margin-bottom:** `3.5rem` (56px)
- **Gap:** `2rem` (32px)
- **Padding:** `49px 50px` (vertical: 49px, horizontal: 50px)

**Responsive (max-width: 768px):**
```css
.header {
  margin-bottom: 2rem;         /* 32px en tablet/mobile */
  padding: 49px 0;             /* Sin padding horizontal */
}
```

---

## 📊 RESUMEN DE VALORES PARA REPLICAR

### ✅ Spacing Principal
```
Gap título-descripción:    30px
Max-width título:          488px
Margin-bottom header:      56px (3.5rem)
Gap header:                32px (2rem)
Padding header:            49px 50px
```

### ✅ Tipografía Light Text (arriba)
```
Font-size:     32px (--heading-5-size)
Line-height:   35px (--heading-5-line-height)
Font-weight:   300
Color:         #FFFFFF (--color-white)
```

### ✅ Tipografía Highlight Text (amarillo)
```
Font-size:     48px (--heading-2-size)
Line-height:   50px (--heading-2-line-height)
Font-weight:   300
Color:         #C5D400 (--color-yellow)
Mobile:        36px / 40px (max-width: 480px)
```

### ✅ Tipografía Description
```
Font-size:     20px (--body-1-size)
Line-height:   auto (--body-1-line-height)
Font-weight:   400 (--body-1-weight)
Color:         #FFFFFF (--color-white)
```

---

## 🎯 VARIABLES CSS A USAR

Para replicar estos estilos en otras strips, usa estas variables:

```css
/* Headings */
--heading-2-size: 48px;
--heading-2-line-height: 50px;
--heading-5-size: 32px;
--heading-5-line-height: 35px;

/* Body */
--body-1-size: 20px;
--body-1-line-height: auto;
--body-1-weight: 400;

/* Colors */
--color-white: #FFFFFF;
--color-yellow: #C5D400;

/* Fonts */
--font-heading: 'Montserrat', sans-serif;
--font-body: 'Raleway', sans-serif;
```

---

## 🔄 ESTRUCTURA PARA REPLICAR

Para crear una estructura similar en otras strips:

```astro
<div class="header-content">
  <div class="title-wrapper">
    <SectionHeading
      lightText="Texto pequeño"
      highlightText="Texto grande amarillo"
    />
  </div>
  <p class="description body-1">
    Descripción del contenido de la sección.
  </p>
</div>
```

Con estos estilos:

```css
.header-content {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;  /* ⭐ Spacing clave */
}

.title-wrapper {
  max-width: 488px;  /* ⭐ Ancho máximo */
}

.description {
  align-self: stretch;
  color: var(--color-white);
  margin: 0;
}
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Desktop: valores por defecto */

/* Tablet: max-width 768px */
@media (max-width: 768px) {
  .header {
    margin-bottom: 2rem;
    padding: 49px 0;
  }
}

/* Mobile: max-width 480px */
@media (max-width: 480px) {
  .headingHighlight {
    font-size: 36px;
    line-height: 40px;
  }
}
```

---

## 🎨 COMPONENTE REUTILIZABLE

El componente **`SectionHeading.astro`** ya está configurado con estos valores:

```astro
<SectionHeading
  lightText="Our toolbox"
  highlightText="of Tools"
/>
```

Usa este componente en cualquier strip para mantener consistencia visual.
