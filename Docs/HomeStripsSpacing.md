# 🎯 Aplicación de Spacing Toolbox en Strips del Home

## 📋 Strips Actuales en el Home

Basándome en el análisis del home, estas son las strips que deberían usar los mismos tamaños y espaciados:

---

## ✅ STRIP 1: Toolbox (HerramientasVariant) - ✨ REFERENCIA

**Ubicación:** `src/components/sections/services/HerramientasVariant.astro`

**Estado:** ✅ PERFECTO - Esta es la referencia

**Valores actuales:**
```css
.header-content {
  gap: 30px;                    /* ✅ Correcto */
}

.title-wrapper {
  max-width: 488px;             /* ✅ Correcto */
}

/* Usa SectionHeading con:
   - heading-5-size: 32px (light text)
   - heading-2-size: 48px (highlight text)
   - gap: 30px entre título y descripción
*/
```

---

## 🔍 STRIP 2: Projects (Proyectos)

**Ubicación:** 
- `src/components/ui/Projects.astro`
- `src/components/ui/DynamicProjects.astro`

**Archivo CSS:** `src/components/ui/Projects.module.css`

### 📊 Estado Actual vs Ideal

**Actualmente:**
```css
.headerSection {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;                    /* ❌ Diferente (debería ser 30px) */
  flex-wrap: wrap;
}

.headingWrapper {
  flex: 1;
  max-width: 488px;             /* ✅ Correcto */
  display: flex;
  flex-direction: column;
}
```

**Usa SectionHeading:** ✅ Sí
- `headingLight`: 32px ✅
- `headingHighlight`: 48px ✅

### ✏️ Cambios Sugeridos:

```css
.headerSection {
  gap: 30px;                    /* Cambiar de 50px a 30px */
}
```

**Nota:** Esta strip NO tiene descripción debajo del título, solo título + botón, por lo que el gap de 50px podría ser intencional para separar del botón.

---

## 🔍 STRIP 3: Especialidades

**Ubicación:** `src/components/sections/home/Especialidades.astro`

**Necesita análisis:** Verificar si usa estructura de header similar

---

## 🔍 STRIP 4: Descripción

**Ubicación:** `src/components/sections/home/Descripcion.astro`

**Necesita análisis:** Verificar estructura de títulos

---

## 🔍 STRIP 5: ExpertosUsuarios

**Ubicación:** `src/components/sections/home/ExpertosUsuarios.astro`

**Necesita análisis:** Verificar si tiene header con título y descripción

---

## 📐 TEMPLATE DE HEADER CONSISTENTE

Para mantener consistencia visual en todas las strips del home, usa esta estructura:

### HTML/Astro Structure:
```astro
<div class="header">
  <div class="header-content">
    <div class="title-wrapper">
      <SectionHeading
        lightText="Texto pequeño"
        highlightText="Texto grande"
      />
    </div>
    <p class="description body-1">
      Descripción de la sección aquí.
    </p>
  </div>
  <!-- Opcional: Botón u otro elemento -->
</div>
```

### CSS Template:
```css
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 3.5rem;       /* 56px */
  gap: 2rem;                   /* 32px entre elementos principales */
  padding: 49px 50px;
}

.header-content {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;                   /* ⭐ SPACING CLAVE */
}

.title-wrapper {
  max-width: 488px;            /* ⭐ ANCHO MÁXIMO */
}

.description {
  align-self: stretch;
  color: var(--color-white);
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    margin-bottom: 2rem;
    padding: 49px 0;
  }
}
```

---

## 🎨 VALORES ESTANDARIZADOS PARA EL HOME

### Spacing del Header:
```
gap entre título y descripción:  30px  (⭐ CLAVE)
gap entre elementos header:      32px  (2rem)
margin-bottom del header:        56px  (3.5rem)
padding vertical header:         49px
padding horizontal header:       50px (0 en mobile)
max-width título:                488px (⭐ CLAVE)
```

### Tipografía:
```
Light text:      32px / 35px / weight 300
Highlight text:  48px / 50px / weight 300 (36px/40px en mobile)
Body text:       20px / auto / weight 400
```

### Colores:
```
Light text:      #FFFFFF (--color-white)
Highlight text:  #C5D400 (--color-yellow)
Description:     #FFFFFF (--color-white)
```

---

## 🔄 CHECKLIST DE IMPLEMENTACIÓN

Para cada strip del home, verifica:

- [ ] Usa `SectionHeading` component
- [ ] `.header-content` con `gap: 30px`
- [ ] `.title-wrapper` con `max-width: 488px`
- [ ] Descripción usa clase `.body-1`
- [ ] Header tiene `padding: 49px 50px`
- [ ] Header tiene `margin-bottom: 3.5rem`
- [ ] Responsive: padding cambia a `49px 0` en mobile

---

## 📝 PRÓXIMOS PASOS

1. ✅ **Toolbox** - Ya está perfecto
2. 🔍 **Projects** - Revisar gap (actualmente 50px)
3. 🔍 **Especialidades** - Analizar y ajustar
4. 🔍 **Descripción** - Analizar y ajustar
5. 🔍 **ExpertosUsuarios** - Analizar y ajustar

---

## 💡 COMPONENTE HELPER

Considera crear un componente `StripHeader.astro` reutilizable:

```astro
---
interface Props {
  lightText: string;
  highlightText: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonHref?: string;
}

const { 
  lightText, 
  highlightText, 
  description, 
  showButton, 
  buttonText, 
  buttonHref 
} = Astro.props;
---

<div class="header">
  <div class="header-content">
    <div class="title-wrapper">
      <SectionHeading
        lightText={lightText}
        highlightText={highlightText}
      />
    </div>
    {description && (
      <p class="description body-1">{description}</p>
    )}
  </div>
  {showButton && (
    <ButtonIsland 
      text={buttonText} 
      href={buttonHref}
      variant="primary"
    />
  )}
</div>

<style>
  /* Estilos estandarizados aquí */
</style>
```

Esto garantizaría consistencia automática en todas las strips.
