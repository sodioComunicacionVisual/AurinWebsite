# Variantes de Strip de Proyectos - ACTUALIZADO

## Descripción

Se han agregado **propiedades configurables** a los componentes de proyectos existentes (`Projects.astro` y `DynamicProjects.astro`) para permitir variantes sin duplicar código.

## Cambios Realizados

### 1. Componentes Modificados

#### Projects.astro y DynamicProjects.astro

**Ubicación:** 
- `src/components/ui/Projects.astro` (usado en home inglés)
- `src/components/ui/DynamicProjects.astro` (usado en home español)

**Nuevas Props:**
```typescript
interface Props {
  maxProjects?: number;      // Default: 3
  showChips?: boolean;        // Default: true
  variant?: 'three-column' | 'four-column';  // Default: 'three-column'
}
```

**CSS Modificado:** `Projects.module.css`
- Agregado `.projectsGridFourColumn` para el grid de 4 columnas
- Responsive breakpoints actualizados

### 2. Home Pages Actualizadas

#### Home Español (index.astro)
```astro
<DynamicProjects maxProjects={4} showChips={false} variant="four-column" />
```

#### Home Inglés (en/index.astro)
```astro
<Projects maxProjects={4} showChips={false} variant="four-column" />
```

## Configuración Aplicada en el Home

| Propiedad | Valor | Efecto |
|-----------|-------|--------|
| `maxProjects` | `4` | Muestra 4 proyectos en lugar de 3 |
| `showChips` | `false` | Oculta los chips verdes de servicios |
| `variant` | `"four-column"` | Usa grid de 4 columnas |

## Ejemplos de Uso

### Variante 1: 4 proyectos sin chips (ACTUAL EN HOME)
```astro
<DynamicProjects maxProjects={4} showChips={false} variant="four-column" />
```

### Variante 2: 3 proyectos con chips (original)
```astro
<DynamicProjects maxProjects={3} showChips={true} variant="three-column" />
<!-- o simplemente -->
<DynamicProjects />
```

### Variante 3: 5 proyectos con chips, grid de 4 columnas
```astro
<DynamicProjects maxProjects={5} showChips={true} variant="four-column" />
```

### Variante 4: 2 proyectos sin chips
```astro
<DynamicProjects maxProjects={2} showChips={false} variant="three-column" />
```

## Comportamiento Responsive

### Variant: "four-column"
- **Desktop (>1400px)**: 4 columnas
- **Tablet grande (1024px-1400px)**: 4 columnas
- **Tablet (768px-1024px)**: 2 columnas
- **Mobile (<768px)**: 1 columna

### Variant: "three-column" (default)
- **Desktop**: auto-fit con mínimo 300px
- **Tablet**: 2 columnas
- **Mobile**: 1 columna

## Comparación Visual

```
ANTES (Original - 3 proyectos con chips):
┌─────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │ IMG  │  │ IMG  │  │ IMG  │              │
│  │Title │  │Title │  │Title │              │
│  │🟢🟢🟢 │  │🟢🟢🟢 │  │🟢🟢🟢 │              │
│  └──────┘  └──────┘  └──────┘              │
└─────────────────────────────────────────────┘

AHORA (4 proyectos sin chips):
┌─────────────────────────────────────────────┐
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │ IMG │  │ IMG │  │ IMG │  │ IMG │        │
│  │Title│  │Title│  │Title│  │Title│        │
│  │     │  │     │  │     │  │     │        │
│  └─────┘  └─────┘  └─────┘  └─────┘        │
└─────────────────────────────────────────────┘
```

## Implementación en Otras Páginas

Para usar estas variantes en cualquier otra página:

```astro
---
import DynamicProjects from '../components/ui/DynamicProjects.astro';
// o
import Projects from '../components/ui/Projects.astro';
---

<!-- Personaliza según necesites -->
<DynamicProjects 
  maxProjects={4} 
  showChips={false} 
  variant="four-column" 
/>
```

## Notas Técnicas

1. **Retrocompatibilidad**: Los componentes funcionan sin props (valores por defecto)
2. **Sin duplicación**: No se crearon componentes nuevos, se extendieron los existentes
3. **Chips ocultos**: Cuando `showChips={false}`, se pasa un array vacío a `services`
4. **Fallback**: Incluye proyectos de respaldo si el CMS no responde
5. **Bilingüe**: Detecta automáticamente el idioma (ES/EN)

## Archivos Modificados

```
src/components/ui/
├── Projects.astro          (modificado - agregadas props)
├── DynamicProjects.astro   (modificado - agregadas props)
└── Projects.module.css     (modificado - agregado .projectsGridFourColumn)

src/pages/
├── index.astro             (modificado - props agregadas)
└── en/index.astro          (modificado - props agregadas)
```

## Archivos Creados (Alternativas - No usados en home)

Los siguientes archivos fueron creados como alternativas standalone pero **NO están activos** en el home:

```
src/components/ui/
├── ProjectsFourColumn.astro          (alternativa standalone)
├── ProjectsFourColumn.module.css     (alternativa standalone)
├── ProjectCardNoChips.astro          (alternativa standalone)
└── ProjectCardNoChips.module.css     (alternativa standalone)
```

Puedes usar estos componentes alternativos si prefieres tener componentes separados en lugar de usar props.

## Ventajas del Enfoque Actual

✅ **Flexible**: Cualquier combinación de props
✅ **Mantenible**: Un solo componente para todas las variantes
✅ **Retrocompatible**: No rompe uso existente
✅ **DRY**: No duplica código
✅ **Fácil de usar**: Props claras y autoexplicativas
