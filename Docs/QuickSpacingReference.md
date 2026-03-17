# 📏 Guía Rápida de Spacing - Strip Toolbox

## 🎯 VALORES PRINCIPALES A REPLICAR

### 📦 CONTENEDOR PRINCIPAL

```css
.header-content {
  gap: 30px;           /* ⭐⭐⭐ SPACING ENTRE TÍTULO Y DESCRIPCIÓN */
}
```

### 📐 TÍTULO

```css
.title-wrapper {
  max-width: 488px;    /* ⭐⭐⭐ ANCHO MÁXIMO DEL TÍTULO */
}
```

### 📝 TEXTO PEQUEÑO (arriba)
```
Font: Montserrat
Size: 32px
Line-height: 35px
Weight: 300
Color: #FFFFFF
```

### 📝 TEXTO GRANDE AMARILLO
```
Font: Montserrat
Size: 48px (36px en mobile <480px)
Line-height: 50px (40px en mobile)
Weight: 300
Color: #C5D400
```

### 📝 DESCRIPCIÓN
```
Font: Raleway
Size: 20px
Line-height: auto
Weight: 400
Color: #FFFFFF
```

---

## 🎨 VISUAL REFERENCE

```
┌─────────────────────────────────────────────┐
│                                             │
│  [Texto pequeño 32px blanco]    ↑          │
│  [TEXTO GRANDE 48px amarillo]   │ 30px ⭐  │
│                                  ↓          │
│  [Descripción 20px blanca] ─────────────   │
│  [continua la descripción...]              │
│                                             │
│  └──── max-width: 488px ────┘              │
└─────────────────────────────────────────────┘
```

---

## 🔧 CSS VARIABLES A USAR

```css
/* Tamaños de texto */
--heading-5-size: 32px;          /* Texto pequeño */
--heading-5-line-height: 35px;
--heading-2-size: 48px;          /* Texto grande */
--heading-2-line-height: 50px;
--body-1-size: 20px;             /* Descripción */
--body-1-line-height: auto;

/* Colores */
--color-white: #FFFFFF;
--color-yellow: #C5D400;

/* Fonts */
--font-heading: 'Montserrat', sans-serif;
--font-body: 'Raleway', sans-serif;
```

---

## ⚡ QUICK COPY-PASTE

### Para el contenedor:
```css
.header-content {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;  /* ⭐ CLAVE */
}
```

### Para el título:
```css
.title-wrapper {
  max-width: 488px;  /* ⭐ CLAVE */
}
```

### Para la descripción:
```css
.description {
  align-self: stretch;
  color: var(--color-white);
  margin: 0;
}
```

### En HTML/Astro:
```astro
<div class="header-content">
  <div class="title-wrapper">
    <SectionHeading
      lightText="Texto pequeño"
      highlightText="Texto grande"
    />
  </div>
  <p class="description body-1">Descripción aquí</p>
</div>
```

---

## 📱 RESPONSIVE

```css
@media (max-width: 480px) {
  /* El texto grande se reduce */
  .headingHighlight {
    font-size: 36px;
    line-height: 40px;
  }
}
```

---

## ✅ CHECKLIST

Al replicar en otra strip, asegúrate de:

- [x] Gap de 30px entre título y descripción
- [x] Max-width de 488px para el título
- [x] Usar componente SectionHeading
- [x] Descripción con clase .body-1
- [x] Texto pequeño: 32px/35px
- [x] Texto grande: 48px/50px
- [x] Descripción: 20px/auto

---

## 🎯 ESTOS SON LOS VALORES PERFECTOS ⭐

**Spacing clave:** `30px`  
**Width clave:** `488px`  
**Tamaños:** `32px → 48px → 20px`

Úsalos en todas las strips del home para mantener consistencia visual.
