# Aurin Website

Sitio web oficial de Aurin, una agencia de diseño y comunicación visual en México. Este proyecto es una aplicación web moderna construida con Astro, que integra múltiples servicios externos y cuenta con un chatbot inteligente con capacidades de IA.

## Índice

- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías y Dependencias](#tecnologías-y-dependencias)
- [Integraciones Externas](#integraciones-externas)
- [Sistema de Internacionalización (i18n)](#sistema-de-internacionalización-i18n)
- [Sistema de Componentes](#sistema-de-componentes)
- [Chatbot con IA](#chatbot-con-ia)
- [Instalación y Desarrollo](#instalación-y-desarrollo)
- [Despliegue](#despliegue)

---

## Arquitectura del Proyecto

Este proyecto sigue una arquitectura de **Server-Side Rendering (SSR)** con Astro, desplegado en Vercel. La arquitectura está compuesta por:

### Repositorios Relacionados

1. **Main Website** (este repositorio)
   - URL: https://github.com/sodioComunicacionVisual/AurinWebsite
   - Función: Frontend principal con SSR en Astro
   - Deploy: Vercel (https://aurin.mx)

2. **Payload CMS**
   - URL: https://github.com/sodioComunicacionVisual/aurin-cms
   - Función: Headless CMS para gestión de proyectos
   - Deploy: Vercel (https://aurin-payload-cms.vercel.app)
   - API: `https://aurin-payload-cms.vercel.app/api`

3. **Speedlify Stats**
   - URL: https://github.com/sodioComunicacionVisual/AurinWebsiteStats
   - Función: Monitoreo de performance del sitio
   - Métricas: Performance, Accessibility, Best Practices, SEO

4. **n8n Workflow (Chatbot)**
   - URL: https://aurin.app.n8n.cloud/workflow/5eVhyM6e69m1mKTy
   - Función: Orquestación de agentes de IA para el chatbot
   - Agentes: RAG Agent, Calendar Agent, Ticket Agent

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Aurin Website (Astro)                   │
│                  https://aurin.mx                           │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Frontend   │  │  API Routes  │  │  SSR Rendering  │  │
│  │   (React +   │  │  (/api/*)    │  │   (Astro)       │  │
│  │    Astro)    │  └──────────────┘  └─────────────────┘  │
│  └──────────────┘                                          │
└────────┬────────────────────┬──────────────────┬───────────┘
         │                    │                  │
         ▼                    ▼                  ▼
┌────────────────┐   ┌────────────────┐   ┌──────────────┐
│  Payload CMS   │   │  n8n Chatbot   │   │  Speedlify   │
│   (Projects)   │   │   Workflows    │   │   (Stats)    │
└────────────────┘   └────────────────┘   └──────────────┘
         │                    │
         │                    ├─── RAG Agent
         │                    ├─── Calendar Agent
         │                    └─── Ticket Agent
         │
         └── API: /api/projects
```

---

## Estructura del Proyecto

```
AurinWebsite/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── modules/        # Módulos complejos (chatbot, contact, seo)
│   │   │   ├── chatbot/
│   │   │   │   ├── agents/           # Configuración de agentes n8n
│   │   │   │   │   ├── Company Website Chatbot Agent.json
│   │   │   │   │   ├── RAG Agent.json
│   │   │   │   │   ├── Calendar Agent.json
│   │   │   │   │   └── Ticket Agent.json
│   │   │   │   └── ChatbotContainer.astro
│   │   │   ├── contact/
│   │   │   │   └── Form.astro
│   │   │   └── seo/
│   │   │       └── AdvancedSEO.astro
│   │   ├── sections/       # Secciones de página
│   │   │   ├── home/      # Secciones específicas de Home
│   │   │   ├── services/  # Secciones de Servicios
│   │   │   ├── projects/  # Secciones de Proyectos
│   │   │   ├── us/        # Secciones de Nosotros
│   │   │   ├── privacy/   # Aviso de Privacidad
│   │   │   └── t&c/       # Términos y Condiciones
│   │   └── ui/            # Componentes UI reutilizables
│   │       ├── AnimatedCounter.tsx
│   │       ├── Card.astro
│   │       ├── Footer.astro
│   │       ├── MegaMenu.astro
│   │       ├── ProjectCard.astro
│   │       ├── SpeedlifyStats.tsx
│   │       └── ... (60+ componentes UI)
│   ├── i18n/              # Sistema de internacionalización
│   │   ├── translations.ts    # Diccionarios ES/EN
│   │   └── utils.ts          # Utilidades i18n
│   ├── layouts/           # Layouts de página
│   │   └── Layout.astro
│   ├── lib/               # Librerías y utilidades
│   │   ├── chatbot/      # Lógica del chatbot
│   │   │   ├── apiClient.ts      # Cliente API n8n
│   │   │   └── sessionManager.ts # Gestión de sesiones
│   │   ├── mailing/      # Sistema de emails
│   │   │   ├── service.ts
│   │   │   ├── templates.ts
│   │   │   └── types.ts
│   │   ├── payload.ts    # Cliente Payload CMS
│   │   ├── strapi.ts     # Cliente Strapi (legacy)
│   │   └── utils.ts      # Utilidades generales
│   ├── pages/            # Rutas del sitio
│   │   ├── index.astro          # Home (ES)
│   │   ├── contacto.astro       # Contacto (ES)
│   │   ├── servicios.astro      # Servicios (ES)
│   │   ├── proyectos.astro      # Proyectos (ES)
│   │   ├── nosotros.astro       # Nosotros (ES)
│   │   ├── en/                  # Versiones en inglés
│   │   │   ├── index.astro
│   │   │   ├── contact.astro
│   │   │   ├── services.astro
│   │   │   ├── projects.astro
│   │   │   └── about.astro
│   │   └── api/                 # API Routes
│   │       ├── chat.ts          # Endpoint chatbot
│   │       ├── send-ticket.ts   # Envío de tickets
│   │       └── contact.ts       # Formulario contacto
│   └── styles/           # Estilos globales
│       └── global.css
├── public/               # Archivos estáticos
│   ├── fonts/
│   ├── images/
│   └── ...
├── astro.config.mjs      # Configuración Astro
├── package.json
├── tsconfig.json
└── vercel.json          # Configuración Vercel
```

---

## Tecnologías y Dependencias

### Framework Principal
- **Astro 5.14.1** - Framework web moderno con SSR
- **React 19.2.0** - Componentes interactivos
- **TypeScript 5.9.3** - Tipado estático

### UI y Animaciones
- **Motion 12.23.24** - Animaciones fluidas
- **Lenis 1.3.11** / **astro-lenis 1.0.5** - Smooth scrolling
- **Splide 4.1.4** - Carruseles y sliders
- **ukiyo 1.1.1** / **ukiyojs 4.2.0** - Efectos parallax
- **@number-flow/react 0.5.10** - Contadores animados
- **Lucide React 0.545.0** - Iconos

### Integración con CMS y Servicios
- **Firebase 10.7.1** - Backend services
- **@vercel/blob 2.0.0** - Almacenamiento de archivos
- **@vercel/analytics 1.5.0** - Analytics
- **@vercel/speed-insights 1.2.0** - Performance monitoring
- **Resend 6.1.2** - Servicio de emails

### Utilidades
- **clsx 2.1.1** - Utilidad de clases CSS
- **tailwind-merge 3.3.1** - Merge de clases Tailwind
- **nanoid 5.1.6** - Generación de IDs únicos
- **react-markdown 10.1.0** - Renderizado de markdown
- **mathjs 15.0.0** - Operaciones matemáticas
- **Shiki 3.13.0** - Syntax highlighting

### Adaptadores de Deployment
- **@astrojs/vercel 8.2.8** - Adaptador Vercel (principal)
- **@astrojs/node 9.5.0** - Adaptador Node.js (alternativo)

---

## Integraciones Externas

### 1. Payload CMS Integration

**Repositorio:** https://github.com/sodioComunicacionVisual/aurin-cms

El sitio consume proyectos desde un Headless CMS Payload desplegado en Vercel.

#### Configuración

```typescript
// src/lib/payload.ts
const PAYLOAD_API_URL = 'https://aurin-payload-cms.vercel.app/api';
```

#### Funcionalidades

```typescript
import { PayloadAPI } from '@/lib/payload';

// Obtener todos los proyectos publicados
const projects = await PayloadAPI.getProjects('es');

// Obtener proyectos destacados
const featured = await PayloadAPI.getFeaturedProjects('es');

// Obtener proyecto por slug
const project = await PayloadAPI.getProjectBySlug('mi-proyecto', 'es');

// Buscar proyectos
const results = await PayloadAPI.searchProjects('branding', 'es');
```

#### Estructura de Datos

```typescript
interface PayloadProject {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishDate: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  tags?: Array<{ id: string; name: string; slug: string }>;
  hero: {
    description: string;
    bannerImage: { url: string; alt: string; };
    services: Array<{ name: string }>;
  };
  caseStudy: { title: string; content: any };
  gallery: Array<{ image: { url: string }; caption?: string }>;
  learnings: { title: string; content: any };
  client: {
    name: string;
    industry?: string;
    website?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}
```

### 2. Speedlify Performance Monitoring

**Repositorio:** https://github.com/sodioComunicacionVisual/AurinWebsiteStats

Speedlify monitorea continuamente el performance del sitio y expone métricas en tiempo real.

#### Métricas Monitoreadas

- **Performance Score** - Velocidad de carga
- **Accessibility Score** - Cumplimiento WCAG
- **Best Practices Score** - Estándares web
- **SEO Score** - Optimización para motores de búsqueda
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint)
  - FCP (First Contentful Paint)
  - CLS (Cumulative Layout Shift)

#### Componente de Stats

```astro
---
// src/components/ui/SpeedlifyStats.astro
import SpeedlifyStatsReact from './SpeedlifyStats.tsx';
---
<SpeedlifyStatsReact client:load />
```

### 3. n8n Chatbot Workflow

**Workflow URL:** https://aurin.app.n8n.cloud/workflow/5eVhyM6e69m1mKTy

Sistema de chatbot inteligente orquestado por n8n que coordina múltiples agentes especializados.

#### Arquitectura del Chatbot

```
┌─────────────────────────────────────────────────┐
│         Company Website Chatbot Agent          │
│              (Agente Principal)                 │
│                                                 │
│  - Recibe mensaje del usuario                  │
│  - Extrae contexto (fileUrl, metadata)         │
│  - Enruta a agente especializado               │
│  - Usa OpenAI GPT-4o-mini                      │
│  - Mantiene memoria de conversación            │
└───────────┬────────────────────┬────────────────┘
            │                    │
            ▼                    ▼
    ┌───────────────┐    ┌──────────────┐
    │  RAG Agent    │    │Calendar Agent│
    │  (FAQ/Info)   │    │ (Reuniones)  │
    └───────────────┘    └──────────────┘
            │
            ▼
    ┌───────────────┐
    │ Ticket Agent  │
    │  (Soporte)    │
    └───────────────┘
```

---

## Chatbot con IA

### Agentes del Chatbot

El chatbot de Aurin está compuesto por 4 agentes especializados que trabajan de forma coordinada:

#### 1. Company Website Chatbot Agent (Agente Principal)

**Archivo:** `src/components/modules/chatbot/agents/Company Website Chatbot Agent (RAG, Calendar integrations).json`

**Función:** Orquestador principal que enruta las consultas a los agentes especializados.

**Características:**
- Modelo: OpenAI GPT-4o-mini
- Memoria conversacional (ventana de 10 mensajes)
- Detección de archivos adjuntos
- Enrutamiento inteligente a herramientas

**System Prompt:**
```
You are Aurin's chatbot assistant. You route requests to tools - never answer directly.

TOOLS:
• RAGagent - FAQs about Aurin
• calendarAgent - Schedule meetings
• ticketAgent - Create support tickets

IMPORTANT - FILE ATTACHMENTS:
When you see [SYSTEM: User attached file: URL] in the conversation,
extract the URL and include it in ticket creation.
```

**Flujo de Trabajo:**
```
1. Webhook recibe mensaje →
2. Store Context extrae datos →
3. Chatbot Agent procesa →
4. Enruta a agente especializado →
5. Format Response estructura respuesta →
6. Respond Success envía al usuario
```

#### 2. RAG Agent (Knowledge Base)

**Archivo:** `src/components/modules/chatbot/agents/RAG Agent.json`

**Función:** Base de conocimientos con información sobre Aurin.

**Base de Conocimientos Incluye:**
- Servicios (Diseño Gráfico, Branding, UX/UI, Estrategia Digital)
- Información sobre la empresa (Historia, Aldea Creativa)
- Portafolio y casos de éxito
- Proceso de trabajo (5 pasos)
- Precios e inversión
- Información de contacto
- Herramientas y tecnologías

**Detección de Idioma:**
- Automática basada en palabras clave
- Soporte para ES/EN
- Respuestas con links clickeables a secciones del sitio

**Ejemplo de Respuesta:**
```markdown
**Servicios de Aurin**

Aurin es una agencia de diseño y comunicación visual con sede en México.

🎨 SERVICIOS PRINCIPALES:

1. Diseño Gráfico
   • Servicios profesionales de diseño gráfico

2. Branding e Identidad Corporativa
   • Desarrollo de marca completo

3. Diseño UX/UI
   • Diseño de experiencia de usuario

🔗 Ver todos nuestros servicios:
https://www.aurin.mx/servicios
```

#### 3. Calendar Agent

**Archivo:** `src/components/modules/chatbot/agents/Calendar Agent.json`

**Función:** Gestión de reuniones y disponibilidad.

**Capacidades:**
- Consultar disponibilidad semanal
- Reservar citas (30-60 min)
- Horarios GMT-6 (Ciudad de México)

**Horarios Disponibles:**
```javascript
const availableSlots = [
  { day: 'Lunes', times: ['10:00 AM', '2:00 PM', '4:00 PM'] },
  { day: 'Martes', times: ['11:00 AM', '3:00 PM'] },
  { day: 'Miércoles', times: ['10:00 AM', '1:00 PM', '5:00 PM'] },
  { day: 'Jueves', times: ['9:00 AM', '2:00 PM', '4:00 PM'] },
  { day: 'Viernes', times: ['10:00 AM', '12:00 PM', '3:00 PM'] }
];
```

**Flujo de Reserva:**
1. Usuario pregunta por disponibilidad
2. Agente muestra horarios disponibles
3. Usuario selecciona día/hora
4. Agente solicita datos (nombre, email, empresa, proyecto)
5. Confirmación de cita

#### 4. Ticket Agent

**Archivo:** `src/components/modules/chatbot/agents/Ticket Agent.json`

**Función:** Creación de tickets de soporte con integración de emails.

**Datos Recopilados:**
```json
{
  "nombre": "Nombre del cliente",
  "email": "email@example.com",
  "empresa": "Nombre de empresa",
  "servicio": "Servicio de interés",
  "asunto": "Asunto del ticket",
  "descripcion": "Descripción detallada",
  "archivoAdjunto": "URL del archivo (opcional)"
}
```

**Flujo del Ticket Agent:**

```
Parse Ticket Data → Send Ticket to API → Format Response
     ↓                      ↓                    ↓
Extrae campos         POST a /api/         Genera mensaje
del JSON             send-ticket          de confirmación
```

**Integración con API:**
```javascript
// POST https://aurin.mx/api/send-ticket
{
  name: "Juan Pérez",
  email: "juan@example.com",
  company: "Empresa ABC",
  service: "Branding",
  subject: "Nuevo proyecto",
  description: "Necesito rediseño de marca",
  ticketId: "AURIN-1234567890",
  createdAt: "2025-01-15T10:30:00Z",
  fileUrl: "https://blob.vercel-storage.com/file.pdf"
}
```

**Soporte de Archivos:**
- Detección automática de archivos adjuntos
- Almacenamiento en Vercel Blob Storage
- Inclusión de URL en ticket y email
- Validación de tamaño (máx 10MB)

### Cliente del Chatbot

**Ubicación:** `src/lib/chatbot/`

#### Session Manager (`sessionManager.ts`)

**Responsabilidades:**
- Generar IDs de sesión únicos (formato: `sess_XXXXXXXXXXXX`)
- Almacenar mensajes en sessionStorage
- Limitar historial a 50 mensajes
- Expiración de sesiones (1 hora de inactividad)

**API:**
```typescript
import { SessionManager } from '@/lib/chatbot/sessionManager';

// Obtener sesión actual
const session = SessionManager.getCurrentSession();

// Agregar mensaje
SessionManager.addMessage({
  text: "Hola",
  sender: "user",
  file: { name: "doc.pdf", url: "..." }
});

// Obtener ID de sesión
const sessionId = SessionManager.getSessionId();

// Limpiar sesión
SessionManager.clearSession();
```

#### API Client (`apiClient.ts`)

**Responsabilidades:**
- Comunicación con webhook de n8n
- Reintentos automáticos (exponential backoff)
- Timeout de 30 segundos
- Detección de conectividad

**API:**
```typescript
import { ChatApiClient } from '@/lib/chatbot/apiClient';

// Enviar mensaje simple
const response = await ChatApiClient.sendMessage(
  "¿Qué servicios ofrecen?",
  sessionId
);

// Enviar con reintentos
const response = await ChatApiClient.sendMessageWithRetry(
  "¿Qué servicios ofrecen?",
  sessionId,
  2  // máximo 2 reintentos
);

// Verificar conectividad
const isOnline = ChatApiClient.isOnline();
```

### Componente del Chatbot

**Ubicación:** `src/components/modules/chatbot/ChatbotContainer.astro`

**Características UI:**
- Botón flotante minimizable
- Indicador de estado online/offline
- Soporte de archivos drag & drop
- Markdown rendering en mensajes
- Scroll automático
- Indicador de "escribiendo..."
- Manejo de errores visuales

**Traducciones:**
```typescript
// Bilingüe ES/EN desde i18n
chatbot: {
  welcome: "¡Hola! 👋 Soy el asistente virtual de Aurin...",
  title: "Asistente IA",
  online: "En línea",
  placeholder: "Escribe un mensaje...",
  attach: "Adjuntar archivo",
  maxSize: "Máx 10MB",
  errorGeneric: "Lo siento, hubo un error...",
  // ... más traducciones
}
```

---

## Sistema de Internacionalización (i18n)

### Configuración

**Idiomas Soportados:**
- Español (ES) - idioma por defecto
- Inglés (EN)

**Configuración en `astro.config.mjs`:**
```javascript
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  routing: {
    prefixDefaultLocale: false  // ES sin prefijo, EN con /en/
  }
}
```

### Estructura de URLs

```
ES (Español - Default):
https://aurin.mx/
https://aurin.mx/contacto
https://aurin.mx/servicios
https://aurin.mx/proyectos
https://aurin.mx/nosotros

EN (English):
https://aurin.mx/en/
https://aurin.mx/en/contact
https://aurin.mx/en/services
https://aurin.mx/en/projects
https://aurin.mx/en/about
```

### Sistema de Traducciones

**Archivo:** `src/i18n/translations.ts`

**Estructura:**
```typescript
export const translations = {
  en: {
    common: { loading: 'Loading...' },
    seo: { title: "...", description: "..." },
    contact: { ... },
    chatbot: { ... },
    header: { ... },
    projects: { ... },
    services: { ... },
    // ... más secciones
  },
  es: {
    common: { loading: 'Cargando...' },
    seo: { title: "...", description: "..." },
    // ... traducciones en español
  }
}
```

**Uso en Componentes:**

```astro
---
import { translations } from '@/i18n/translations';
import { getLangFromUrl } from '@/i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = translations[lang];
---

<h1>{t.header.navLinks.home}</h1>
<p>{t.chatbot.welcome}</p>
```

### Utilidades i18n

**Archivo:** `src/i18n/utils.ts`

```typescript
// Detectar idioma de URL
const lang = getLangFromUrl(Astro.url);  // 'es' | 'en'

// Generar URL localizada
const url = getLocalizedUrl('/contacto', 'en');  // '/en/contact'

// Alternar idioma
const altLang = getAlternateLanguage('es');  // 'en'
```

### SEO Multiidioma

Cada página incluye etiquetas hreflang para SEO:

```html
<link rel="alternate" hreflang="es" href="https://aurin.mx/" />
<link rel="alternate" hreflang="en" href="https://aurin.mx/en/" />
<link rel="alternate" hreflang="x-default" href="https://aurin.mx/" />
```

---

## Sistema de Componentes

### Arquitectura de Componentes

El sistema está organizado en 3 niveles jerárquicos:

#### 1. **Modules** (Módulos Complejos)

Componentes de alto nivel con lógica compleja.

- **`chatbot/`** - Sistema completo de chatbot
  - `ChatbotContainer.astro` - Contenedor principal
  - `agents/` - Configuraciones de agentes n8n

- **`contact/`** - Sistema de contacto
  - `Form.astro` - Formulario con validación

- **`seo/`** - SEO avanzado
  - `AdvancedSEO.astro` - Meta tags, Open Graph, Schema.org

#### 2. **Sections** (Secciones de Página)

Secciones completas que componen páginas.

**Home (`home/`):**
- `Banner.astro` - Hero principal
- `Descripcion.astro` - Descripción de la empresa
- `ExpertosUsuarios.astro` - "Expertos en Usuarios"
- `Especialidades.astro` - Tarjetas de especialidades
- `Herramientas.astro` - Toolbox de herramientas
- `EnterpriseMarquee.astro` - Marquesina de empresas

**Services (`services/`):**
- `SBanner.astro` - Banner de servicios
- `Services.astro` - Lista de servicios
- `HerramientasStorytellingScroll.astro` - Scroll de herramientas
- `StoryTellingCard.astro` - Tarjetas de storytelling

**Projects (`projects/`):**
- `Introduction.astro` - Intro de proyectos
- `template/` - Template de case study
  - `atoms/` - Componentes atómicos de proyectos
    - `ProjectBanner.astro`
    - `CaseStudySection.astro`
    - `ImageGrid.astro`
    - `ServicesSection.astro`
    - `LearningSection.astro`

**About (`us/`):**
- `UsBanner.astro` - Banner principal
- `RutasInexploradas.astro` - "Descubridores de rutas"
- `LongCards.astro` - Métricas (clientes, años, países)
- `ComoLlegamos.astro` - Historia de Aurin
- `DisenoColaboracion.astro` - Aldea Creativa
- `Alianzas.astro` - Socios estratégicos
- `MainImage.astro` - Imagen del equipo

**Legal:**
- `privacy/Privacy.astro` - Aviso de privacidad
- `t&c/TermsConditions.astro` - Términos y condiciones

#### 3. **UI Components** (Componentes Reutilizables)

**60+ componentes** de interfaz altamente reutilizables:

**Navegación:**
- `MegaMenu.astro` - Menú principal
- `Footer.astro` - Pie de página
- `StickyFooter.astro` - Footer sticky

**Tarjetas:**
- `Card.astro` - Tarjeta genérica
- `ProjectCard.astro` - Tarjeta de proyecto
- `PayloadProjectCard.astro` - Tarjeta de proyecto Payload
- `DarkTallCard.astro` / `LightTallCard.astro` - Tarjetas altas

**Grids y Layouts:**
- `ProjectsGrid.astro` - Grid de proyectos
- `InteractiveGrid.tsx` - Grid interactivo
- `DynamicProjects.astro` - Proyectos dinámicos

**Efectos Visuales:**
- `Tilt.tsx` / `TiltSpotlight.tsx` - Efectos tilt 3D
- `SpotlightCursor.tsx` - Cursor con spotlight
- `LampLight.astro` - Efecto de lámpara
- `Vignette.astro` - Viñeta de fondo

**Animaciones:**
- `AnimatedCounter.tsx` - Contadores animados
- `ScrollAnimationContainer.astro` - Animación al scroll

**Performance:**
- `SpeedlifyStats.tsx` - Widget de stats Speedlify
- `SpeedlifyStatsContainer.astro` - Contenedor de stats

**Utilidades:**
- `MainButton.astro` / `SecondaryButton.astro` - Botones
- `Toast.astro` - Notificaciones
- `PageLoader.astro` - Loader de página
- `bg-pattern.tsx` - Patrones de fondo

### Patrón de Diseño: Strips

El sitio usa un sistema de **Strips** (bandas horizontales) para estructurar páginas:

```astro
<!-- Ejemplo: Home Page -->
<Layout>
  <Banner />              <!-- Strip 1: Hero -->
  <Descripcion />         <!-- Strip 2: Descripción -->
  <ExpertosUsuarios />    <!-- Strip 3: Expertos -->
  <Especialidades />      <!-- Strip 4: Especialidades -->
  <Herramientas />        <!-- Strip 5: Herramientas -->
  <MainCat />             <!-- Strip 6: CTA -->
  <Footer />              <!-- Strip 7: Footer -->
</Layout>
```

Cada strip es una sección completa de `src/components/sections/` que puede contener múltiples componentes UI.

---

## Instalación y Desarrollo

### Requisitos Previos

- Node.js 20+
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/sodioComunicacionVisual/AurinWebsite.git
cd AurinWebsite

# Instalar dependencias
npm install
```

### Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# Payload CMS
PAYLOAD_API_URL=https://aurin-payload-cms.vercel.app/api
PAYLOAD_SERVER_URL=https://aurin-payload-cms.vercel.app

# n8n Chatbot Webhook
N8N_CHATBOT_WEBHOOK=https://aurin.app.n8n.cloud/webhook/chatbot

# Firebase (opcional)
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...

# Resend (emails)
RESEND_API_KEY=re_...

# Vercel Blob (archivos)
BLOB_READ_WRITE_TOKEN=...
```

### Scripts de Desarrollo

```bash
# Desarrollo local (puerto 4321)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Type checking
npm run astro check
```

### Estructura de Desarrollo

```bash
# Crear nueva página
src/pages/nueva-pagina.astro

# Crear nueva sección
src/components/sections/nueva-seccion/MiSeccion.astro

# Crear componente UI
src/components/ui/MiComponente.astro

# Agregar traducción
src/i18n/translations.ts
```

---

## Despliegue

### Vercel (Producción)

El sitio está desplegado en Vercel con configuración SSR.

**Configuración:** `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

**Deploy Automático:**
- Push a `main` → deploy automático
- Pull Requests → preview deployments

**Variables de Entorno:**
Configurar en Vercel Dashboard todas las variables del `.env`.

### Performance

**Métricas actuales** (monitoreadas por Speedlify):
- Performance: ~95/100
- Accessibility: ~98/100
- Best Practices: ~95/100
- SEO: ~100/100
- LCP: < 2.5s
- FCP: < 1.8s
- CLS: < 0.1

### Optimizaciones Implementadas

- **SSR** para SEO y performance inicial
- **Image optimization** con Astro
- **Code splitting** automático
- **Lazy loading** de componentes React
- **Preload** de fuentes críticas
- **Minificación** CSS/JS
- **Smooth scrolling** con Lenis
- **Analytics** con Vercel Analytics

---

## Contacto y Soporte

**Email:** hey@aurin.mx
**Website:** https://aurin.mx
**GitHub:** https://github.com/sodioComunicacionVisual
**Ubicación:** Aldea Creativa, México

---

## Licencia

© 2025 Aurin. Todos los derechos reservados.

---

## Agradecimientos

- **Aldea Creativa** - Espacio de trabajo colaborativo
- **Ancient Technologies, Ideograma, TopDesign** - Socios estratégicos
- **n8n** - Plataforma de automatización
- **Payload CMS** - Sistema de gestión de contenidos
- **Vercel** - Hosting y deployment
