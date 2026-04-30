# Plan de Refactorización — Aurin Website

> Generado: 2026-04-30
> Actualizado: 2026-04-30
> Estado: EN PROGRESO
> Rama activa: lgr/dev

## Contexto rápido
Astro 5 SSR + Vercel. Componentes en src/components/{ui,sections,modules}.
CSS Modules co-ubicados. i18n ES (default) + EN bajo /en/.
CMS único: **Payload CMS** (`src/lib/payload.ts`). Strapi eliminado.

---

## FASE 1 — Eliminar Strapi + Bugs críticos (riesgo: BAJO, aislado)

### 1a — Eliminar Strapi (decisión: Payload CMS es el único CMS)
> Solo 2 archivos lo referencian. Limpieza de 15 minutos.

- [x] **1.0** Auditar referencias a Strapi
  - Resultado: solo 2 archivos afectados:
    - `src/lib/strapi.ts` ← el cliente completo, a eliminar
    - `src/pages/projects/example.astro` ← página de ejemplo, a eliminar

- [x] **1.1** Eliminar `src/lib/strapi.ts`

- [x] **1.2** Eliminar `src/pages/projects/example.astro`
  - También se eliminó la carpeta vacía `src/pages/projects/`

- [x] **1.3** Actualizar `CLAUDE.md`
  - Quitada línea de Strapi en árbol de directorios
  - Quitada entrada de Strapi en "Data sources"
  - Payload CMS marcado como único CMS

- [x] **1.4** Verificación: `grep -r "strapi\|STRAPI" src/` → 0 resultados

### 1b — Bugs críticos de CSS
> Sin estas correcciones el sitio puede fallar en producción (Linux es case-sensitive).

- [x] **1.5** Renombrar `Sbanner.module.css` → `SBanner.module.css`
  - Import actualizado en `SBanner.astro`
  - Verificación: `grep -r "Sbanner" src/` → 0 resultados ✓

- [x] **1.6** Resolver CSS global del chatbot
  - `chatbot.css` → movido a `src/styles/chatbot.css` (CSS global intencional: tiene `:root` vars y BEM `chatbot-*`)
  - `markdown.css` → convertido a `markdown.module.css`, clase `.markdown-content` → `.markdownContent`
  - `MarkdownRenderer.tsx` actualizado para importar y usar `styles.markdownContent`
  - `ChatbotContainer.astro` actualizado: import de chatbot.css desde nueva ruta, markdown.css removido
  - Build limpio ✓

---

## FASE 2 — Consolidar ProjectCard (riesgo: BAJO-MEDIO, aislado)
> Tres variantes que son 95% idénticas. Mantenimiento triplicado sin motivo.

- [x] **2.1** Auditar diferencias exactas entre los 3 archivos
  - `PayloadProjectCard.astro` → código muerto (nadie lo importa), eliminado
  - `ProjectCardNoChips.astro` → idéntico a `ProjectCard.astro` salvo que oculta chips

- [x] **2.2** Agregar `showChips?: boolean` (default: true) a `ProjectCard.astro`
  - Guard: `{showChips && services.length > 0 && (...)}`

- [x] **2.3** Actualizar `ProjectsFourColumn.astro`
  - Import cambiado a `ProjectCard`
  - Todos los `<ProjectCardNoChips` → `<ProjectCard showChips={false}`

- [x] **2.4** Eliminar `ProjectCardNoChips.astro`, `ProjectCardNoChips.module.css`, `PayloadProjectCard.astro`

- [x] **2.5** Build limpio: `[build] Complete!` ✓

---

## FASE 3 — Reorganizar API routes (riesgo: MEDIO, SSR)
> Mezcla de endpoints sueltos y carpeta /calendar/ que confunde responsabilidades.

Estado actual:
```
/api/calendar.ts                     ← PROBLEMA: duplica con /api/calendar/
/api/calendar-cron.ts
/api/calendar/availability.ts
/api/calendar/book.ts
/api/calendar/confirm.ts
/api/calendar/select-time.ts
/api/confirm-appointment.ts          ← PROBLEMA: fuera de /calendar/
/api/create-appointment.ts           ← PROBLEMA: fuera de /calendar/
/api/send-appointment-confirmation.ts← PROBLEMA: fuera de /calendar/
/api/send-cancellation-email.ts      ← PROBLEMA: fuera de /calendar/
```

Estado objetivo:
```
/api/calendar/
  ├── index.ts               (renombrado desde calendar.ts)
  ├── cron.ts                (renombrado desde calendar-cron.ts)
  ├── availability.ts        (ya está)
  ├── book.ts                (ya está)
  ├── confirm.ts             (ya está)
  ├── select-time.ts         (ya está)
  ├── create-appointment.ts  (movido)
  ├── confirm-appointment.ts (movido)
  ├── send-confirmation.ts   (renombrado y movido)
  └── send-cancellation.ts   (renombrado y movido)
/api/contact.ts              (queda igual)
/api/chat.ts                 (queda igual)
/api/upload.ts               (queda igual)
/api/send-ticket.ts          (queda igual)
```

Pasos:
- [x] **3.1** Verificar qué llama a cada endpoint
  - `/api/calendar/availability` ← chatbot (calendarIntentHandler.ts)
  - `/api/calendar/confirm?token=` ← links en emails de clientes (mailing/service.ts)
  - Resto: llamados desde n8n (externo) o código muerto

- [x] **3.2** Eliminar código muerto + stubs:
  - `calendar.ts` → ELIMINADO (legacy multi-action, reemplazado por /calendar/*.ts)
  - `create-appointment.ts` → ELIMINADO (stub simulado, nunca llamado)
  - `confirm-appointment.ts` → ELIMINADO (viejo flujo n8n, reemplazado por /calendar/confirm.ts)

- [x] **3.3** Mover endpoints con update de imports (../../lib → ../../../lib):
  - `calendar-cron.ts` → `calendar/cron.ts` ⚠️ n8n debe actualizar URL
  - `send-appointment-confirmation.ts` → `calendar/send-confirmation.ts` ⚠️ n8n debe actualizar URL
  - `send-cancellation-email.ts` → `calendar/send-cancellation.ts` ⚠️ n8n debe actualizar URL

- [x] **3.4** Build limpio: `[build] Complete!` ✓

> ⚠️ **Pendiente (acción externa):** Actualizar en n8n los webhook URLs:
> - `/api/calendar-cron` → `/api/calendar/cron`
> - `/api/send-appointment-confirmation` → `/api/calendar/send-confirmation`
> - `/api/send-cancellation-email` → `/api/calendar/send-cancellation`

---

## FASE 4 — Aplanar estructura de carpetas (riesgo: BAJO, rename)
> 6 niveles de profundidad; ideal: máximo 4.

Problemas actuales:
```
src/components/modules/banner/light-rays/hooks/useIntroAnimation.ts  (6 niveles)
src/components/sections/projects/template/atoms/AnimatedSection.tsx   (6 niveles)
```

Propuesta:
```
src/components/modules/banner/LightRays.tsx          (ya existe duplicado aquí)
src/components/modules/banner/useIntroAnimation.ts   (mover hook aquí)

src/components/sections/projects/template/AnimatedSection.tsx  (sacar de atoms/)
src/components/sections/projects/template/CaseStudySection.astro
... (resto de atoms/ sube un nivel)
```

Pasos:
- [x] **4.1** Auditoría real: ambos `LightRays.tsx` y toda `light-rays/` eran código muerto (no importados)
  - También `atoms/` tenía 9 archivos: solo `ProjectBanner` era usado

- [x] **4.2** Acciones realizadas:
  - ELIMINADO `banner/LightRays.tsx` (monolítico, dead code)
  - ELIMINADO `banner/light-rays/` (carpeta entera — dead code)
  - MOVIDO `atoms/ProjectBanner.astro` → `template/ProjectBanner.astro`
  - MOVIDO `atoms/ProjectBanner.module.css` → `template/ProjectBanner.module.css`
  - ELIMINADA `atoms/` (resto eran dead code)
  - Actualizado import en `Template.astro`

- [x] **4.3** Build limpio: `[build] Complete!` ✓
  - Máxima profundidad: 5 niveles (aceptable para esta estructura)

---

## FASE 6 — Deduplicar páginas ES/EN (riesgo: ALTO, impacta rutas SSR)
> Páginas de 400-460 líneas duplicadas para ES y EN. Cambiar una requiere cambiar dos.

Páginas afectadas:
- `proyectos-payload.astro` vs `en/proyectos-payload.astro`
- `contacto.astro` vs `en/contact.astro`
- `servicios.astro` vs `en/services.astro`
- `nosotros.astro` vs `en/about.astro`

Estrategia: extraer lógica a componente de sección que recibe `lang` prop.
La página Astro solo determina el lang y renderiza el componente.

Pasos (por página):
- [x] **6.1** `proyectos-payload` — creado `sections/projects/ProjectsPayloadPage.astro`
  - Ambas páginas son ahora wrappers de 5 líneas con `lang="es"` / `lang="en"`
  - Links usan `getProjectUrl(project, lang)` — ya no hardcodeados
  - Strings hardcodeados en ES resueltos con inline ternaries y `t.projects.introduction.description`

- [x] **6.2** `DynamicProjects` vs `Projects` — eliminado `Projects.astro` (era copia idéntica)
  - 4 import sites migrados a `DynamicProjects`
  - Fallback title usa `lang === 'en'` ternary en `DynamicProjects.astro`

- [x] **6.3** `contacto/contact`, `nosotros/about`, `servicios/services` — dejadas como twin-files
  - Ya son < 102 líneas y usan `getLangFromUrl` internamente
  - `servicios` tiene divergencia intencional (HerramientasStorytellingScroll vs HerramientasVariant)
  - Extraer a section components no reduciría complejidad en estos casos

- [x] Build limpio: `[build] Complete!` ✓

---

## FASE 7 — Estandarizar CSS (riesgo: BAJO, visual)
> CSS_STANDARDS.md dice camelCase. El código usa los dos. Hay 13 archivos con !important.

- [x] **7.1** Decisión naming: camelCase para archivos nuevos, kebab-case existente se migra oportunistamente.
  - Migración masiva descartada: requiere actualizar 48 archivos + todos sus consumidores, sin red de tests.

- [x] **7.2-7.3** CSS_STANDARDS.md reescrito desde cero:
  - Corregidos colores reales (--color-yellow #D0DF00, no naranja)
  - Corregidas fuentes reales (Titillium Web, no Mulish/Geologica)
  - Documentada escala tipográfica real (--heading-*, --body-*)
  - Aclarado estado actual de naming (camelCase nuevo / kebab existente)
  - Eliminados ejemplos de tokens que no existen en el proyecto

- [x] **7.4** Auditoría completa de !important — tabla en CSS_STANDARDS.md:
  - **Necesarios** (5): SearchInput autofill, ScrollReveal JS override, chatbot.css force-hide, MainImage Ukiyo library, Form.module.css browser UA
  - **Arquitectónicos** (2): HerramientasStorytellingScroll + SBanner (global heading override — limitación de Astro)
  - **Refactor candidatos** (6): Card, TallCard, LongCards, SplitCard, AnimatedCounter
  - Documentado el patrón arquitectónico y la solución a largo plazo (@layer CSS)

- [x] Build limpio: `[build] Complete!` ✓

---

## FASE 8 — Completar i18n (riesgo: BAJO, nuevas páginas)
> Páginas EN faltantes generan 404 para usuarios en inglés.

- [x] **8.1** Crear `src/pages/en/privacy.astro` ✓
- [x] **8.2** Crear `src/pages/en/terms.astro` ✓
- [x] **8.3** Crear `src/pages/en/appointment-confirmation.astro` ✓
  - `privacy` y `termsConditions` usan `getLangFromUrl` → traducciones EN ya existían
  - `appointment-confirmation` tenía texto hardcodeado ES → creada con texto EN
- [x] Build limpio: `[build] Complete!` ✓

---

## Orden de ejecución recomendado

```
Fase 1 (Strapi + CSS bugs) → Fase 2 (ProjectCard) → Fase 3 (API routes) → Fase 4 (carpetas) → Fase 5 (i18n) → Fase 6 (dedup páginas) → Fase 7 (CSS standards)
```
Justificación:
- Fase 1: Strapi es decisión ya tomada (Payload only). CSS bugs pueden romper producción. Sin dependencias.
- Fase 2: ProjectCard ya no necesita prop `source` (Strapi eliminado en Fase 1). Depende de Fase 1.
- Fase 3: API routes, riesgo medio — mejor con código limpio de Fase 2 como referencia
- Fase 4: Aplanar carpetas es más fácil con menos variantes de componentes (Fase 2 terminada)
- Fase 5: i18n antes de deduplicar páginas para no duplicar trabajo
- Fase 6: Dedup páginas ES/EN es la más compleja — dejar para el final
- Fase 7: CSS es trabajo de pulido — no bloquea nada

## Reglas de trabajo
- Una fase a la vez, `npm run build` al terminar cada sub-tarea
- Nunca editar ES y EN en la misma sesión sin verificar ambos
- Marcar tareas con [x] en este archivo al completarlas
- Si una tarea descubre nueva deuda técnica, agregarla al final de la fase correspondiente
