# ⚠️ Análisis de Font-Sizes Hardcoded en el Home

## 🔍 RESPUESTA CORTA

**NO**, si alteras los estilos de `SectionHeading` NO se alteran TODOS los font-sizes del home.

Hay **font-sizes hardcoded** en varias strips que NO usan el componente `SectionHeading`.

---

## 📊 ESTADO ACTUAL POR STRIP

### ✅ STRIPS QUE USAN VARIABLES CSS (Se alteran automáticamente)

#### 1. **SectionHeading Component**
**Archivo:** `src/components/ui/SectionHeading.module.css`

```css
.headingLight {
  font-size: var(--heading-5-size);      /* ✅ Variable: 32px */
  line-height: var(--heading-5-line-height);  /* ✅ Variable: 35px */
}

.headingHighlight {
  font-size: var(--heading-2-size);      /* ✅ Variable: 48px */
  line-height: var(--heading-2-line-height);  /* ✅ Variable: 50px */
}
```

**Usado por:**
- ✅ Projects.astro (inglés)
- ✅ DynamicProjects.astro (español) - Recién actualizado
- ✅ HerramientasVariant.astro
- ✅ Especialidades.astro - Recién actualizado

**Resultado:** Si cambias `--heading-2-size` o `--heading-5-size`, ESTAS strips se actualizarán automáticamente.

---

### ⚠️ STRIPS CON FONT-SIZES HARDCODED (NO se alteran automáticamente)

#### 2. **Especialidades.module.css** (Estilos Legacy)

**Archivo:** `src/components/sections/home/Especialidades.module.css`

```css
/* ❌ LEGACY STYLES - Ya no se usan pero están en el archivo */
.headingNormal {
  font-size: clamp(24px, 3.5vw, 32px);   /* ❌ Hardcoded */
  line-height: clamp(28px, 4vw, 35px);   /* ❌ Hardcoded */
}

.headingHighlight {
  font-size: clamp(32px, 5vw, 48px);     /* ❌ Hardcoded */
  line-height: clamp(38px, 5.5vw, 50px); /* ❌ Hardcoded */
}

.description {
  font-size: clamp(14px, 3.5vw, 18px);   /* ❌ Hardcoded */
}
```

**Estado:** Ya NO se usan (componente actualizado a SectionHeading), pero permanecen en el archivo.

**Acción recomendada:** Pueden eliminarse de forma segura.

---

#### 3. **ExpertosUsuarios.module.css**

**Archivo:** `src/components/sections/home/ExpertosUsuarios.module.css`

```css
.subtitle {
  font-size: clamp(24px, 4vw, var(--heading-4-size)); /* ⚠️ Mix */
}

.mainTitle {
  font-size: clamp(40px, 6vw, var(--heading-1-size)) !important; /* ⚠️ Mix */
}

.description p {
  font-size: clamp(16px, 2vw, var(--body-1-size)); /* ⚠️ Mix */
}

/* Responsive hardcoded */
@media (max-width: 768px) {
  .subtitle {
    font-size: clamp(20px, 5vw, 28px);    /* ❌ Hardcoded */
  }
  .mainTitle {
    font-size: clamp(32px, 8vw, 48px);    /* ❌ Hardcoded */
  }
  .description p {
    font-size: clamp(14px, 3.5vw, 18px);  /* ❌ Hardcoded */
  }
}

@media (max-width: 480px) {
  .subtitle {
    font-size: clamp(18px, 5vw, 24px);    /* ❌ Hardcoded */
  }
  .mainTitle {
    font-size: clamp(28px, 8vw, 40px);    /* ❌ Hardcoded */
  }
  .description p {
    font-size: clamp(14px, 3.5vw, 16px);  /* ❌ Hardcoded */
  }
}
```

**Tipo:** Mix de variables y hardcoded
- Desktop: Usa variables con clamp
- Mobile/Tablet: Hardcoded

**Resultado:** Cambios en variables CSS se aplicarán parcialmente (solo desktop).

---

#### 4. **Descripcion.module.css**

**Archivo:** `src/components/sections/home/Descripcion.module.css`

```css
/* Texto pequeño */
.smallTextWord {
  font-size: clamp(12px, 4cqw, 24px);    /* ❌ Hardcoded */
}

/* Texto grande */
.largeTextWord {
  font-size: clamp(40px, 20cqw, 120px);  /* ❌ Hardcoded */
}

/* Múltiples breakpoints con valores hardcoded */
@media (max-width: 1024px) {
  .smallTextWord {
    font-size: clamp(10px, 3.5cqw, 20px);  /* ❌ Hardcoded */
  }
  .largeTextWord {
    font-size: clamp(35px, 18cqw, 90px);   /* ❌ Hardcoded */
  }
}

@media (max-width: 768px) {
  .smallTextWord {
    font-size: clamp(9px, 3.2cqw, 18px);   /* ❌ Hardcoded */
  }
  .largeTextWord {
    font-size: clamp(32px, 16cqw, 80px);   /* ❌ Hardcoded */
  }
  
  /* Y más... */
  .contentText p {
    font-size: 24px;                        /* ❌ Hardcoded */
  }
  
  .contrastText {
    font-size: 16px;                        /* ❌ Hardcoded */
  }
}

/* ... más breakpoints con valores hardcoded */
```

**Tipo:** Completamente hardcoded
- Usa `clamp()` con valores fijos
- Múltiples breakpoints con valores específicos

**Resultado:** NO se alterará con cambios en variables CSS.

---

#### 5. **Projects.module.css** (Solo Mobile)

**Archivo:** `src/components/ui/Projects.module.css`

```css
/* Desktop: Usa variables ✅ */
.headingLight {
  font-size: var(--heading-5-size);   /* ✅ Variable */
}

.headingHighlight {
  font-size: var(--heading-2-size);   /* ✅ Variable */
}

/* Mobile: Hardcoded ❌ */
@media (max-width: 480px) {
  .headingNormal {
    font-size: 24px;                  /* ❌ Hardcoded */
  }
  
  .headingHighlight {
    font-size: 36px;                  /* ❌ Hardcoded */
  }
}
```

**Tipo:** Mix
- Desktop: Variables ✅
- Mobile: Hardcoded ❌

**Nota:** Estas clases legacy ya no se usan porque ahora se usa `SectionHeading`, pero permanecen en el archivo.

---

## 📊 RESUMEN DE FONT-SIZES

| Strip | Usa Variables CSS | Font-sizes Hardcoded | Se Altera Automáticamente |
|-------|------------------|----------------------|---------------------------|
| **SectionHeading** | ✅ 100% | ❌ No | ✅ SÍ |
| **Projects** | ✅ Desktop | ⚠️ Mobile legacy | ✅ Desktop, ❌ Mobile |
| **DynamicProjects** | ✅ 100% | ❌ No | ✅ SÍ |
| **HerramientasVariant** | ✅ 100% | ❌ No | ✅ SÍ |
| **Especialidades** | ✅ 100% | ⚠️ Legacy no usado | ✅ SÍ |
| **ExpertosUsuarios** | ⚠️ Desktop | ❌ Mobile/Tablet | ⚠️ Parcial |
| **Descripcion** | ❌ No | ✅ Todos | ❌ NO |

---

## 🎯 QUÉ SE ALTERARÁ SI CAMBIAS VARIABLES CSS

### Si cambias `--heading-2-size` (48px) o `--heading-5-size` (32px):

#### ✅ SE ALTERARÁN (100%):
1. **SectionHeading** - Todos los que lo usan:
   - Projects (inglés) - Desktop y mobile
   - DynamicProjects (español) - Desktop y mobile
   - HerramientasVariant - Desktop y mobile
   - Especialidades - Desktop y mobile

#### ⚠️ SE ALTERARÁN PARCIALMENTE:
2. **ExpertosUsuarios** - Solo desktop, mobile sigue hardcoded

#### ❌ NO SE ALTERARÁN:
3. **Descripcion** - Completamente independiente
4. **Estilos legacy** no utilizados en Projects y Especialidades

---

## 💡 RECOMENDACIONES

### Opción 1: Limpieza de Código (RECOMENDADO) ✅

Eliminar estilos legacy que ya no se usan:

**En Especialidades.module.css:**
```css
/* ELIMINAR - Ya no se usa */
.heading { }
.headingNormal { }
.headingHighlight { }
```

**En Projects.module.css:**
```css
/* ELIMINAR - Ya no se usa (mobile hardcoded) */
@media (max-width: 480px) {
  .headingNormal { font-size: 24px; }
  .headingHighlight { font-size: 36px; }
}
```

---

### Opción 2: Actualizar ExpertosUsuarios

Reemplazar valores hardcoded en mobile/tablet con variables:

```css
@media (max-width: 768px) {
  .subtitle {
    font-size: clamp(20px, 5vw, var(--heading-4-size)); /* Usar variable */
  }
  .mainTitle {
    font-size: clamp(32px, 8vw, var(--heading-2-size)); /* Usar variable */
  }
}
```

---

### Opción 3: Mantener Descripcion Independiente

**Descripcion** tiene un diseño muy específico con `ScrollReveal` y valores únicos. Es recomendable mantenerlo independiente ya que:
- Tiene animaciones complejas
- Usa container queries (cqw)
- Diseño artístico único
- No sigue el patrón estándar

---

## 🔧 CAMBIOS PARA LOGRAR 100% CONSISTENCIA

Si quieres que **todo** se controle desde variables CSS:

1. ✅ **Ya hecho:** DynamicProjects y Especialidades usan SectionHeading
2. 🔄 **Limpiar:** Eliminar estilos legacy no utilizados
3. 🔄 **Actualizar:** ExpertosUsuarios responsive con variables
4. 💭 **Decidir:** Mantener Descripcion único o estandarizar

---

## 📏 VARIABLES CSS ACTUALES

```css
/* En src/styles/global.css */
--heading-1-size: 64px;
--heading-2-size: 48px;    /* ⭐ Usado por SectionHeading (grande) */
--heading-3-size: 40px;
--heading-4-size: 36px;
--heading-5-size: 32px;    /* ⭐ Usado por SectionHeading (pequeño) */

--body-1-size: 20px;
--body-2-size: 18px;
```

---

## ✅ CONCLUSIÓN

**NO, no todo se alterará automáticamente.**

**Strips que se alterarán** (4/6):
- ✅ Projects
- ✅ DynamicProjects  
- ✅ HerramientasVariant
- ✅ Especialidades

**Strips que NO se alterarán completamente** (2/6):
- ⚠️ ExpertosUsuarios (parcial)
- ❌ Descripcion (independiente)

Para lograr control total desde variables CSS, necesitarías actualizar los estilos hardcoded en ExpertosUsuarios o decidir mantener Descripcion como diseño único.
