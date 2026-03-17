# Propiedades CSS - Footer Copyright Text
## "©2025 aurin. Todos los derechos reservados"

### Selector CSS
```css
.footerCopyright p
```

### Propiedades Tipográficas Aplicadas

| Propiedad | Valor | Tipo |
|-----------|-------|------|
| **font-family** | `var(--font-body)` | Urbanist |
| **font-size** | `var(--body-4-size)` | 14px |
| **font-weight** | `var(--body-4-weight)` | **400 (Regular)** ✓ |
| **line-height** | 14px | Auto |
| **color** | white | #FFFFFF |
| **text-decoration** | underline | Subrayado |

### Variables CSS Definidas en `src/styles/global.css`

```css
/* Body 4 - 14/Auto */
--body-4-size: 14px;
--body-4-line-height: auto;
--body-4-weight: 400;  /* ← REGULAR */
```

### CSS Completo del Elemento

**Archivo:** `src/components/ui/StickyFooter.module.css`

```css
.footerCopyright {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footerCopyright p {
  color: white;
  font-family: var(--font-body);           /* Urbanist */
  font-size: var(--body-4-size);           /* 14px */
  font-weight: var(--body-4-weight);       /* 400 - REGULAR */
  text-decoration: underline;              /* Subrayado */
  line-height: 14px;
  margin: 0;
  white-space: nowrap;
}
```

### Confirmación de Peso Regular

✅ **Font-weight: 400** = **Regular**

En la escala de pesos de tipografía estándar:
- 100-300 = Light
- **400 = Regular** ← APLICADO ✓
- 500-600 = Medium/Semibold
- 700 = Bold
- 800-900 = Extra Bold

---

**Documento generado:** 13 de Enero 2026
**Proyecto:** Aurin Website
**Componente:** StickyFooter
