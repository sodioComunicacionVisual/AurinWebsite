# Módulo Chatbot

Este módulo contiene un widget de chatbot completamente funcional integrado con la arquitectura de islas de Astro.

## Estructura del Módulo

```
src/components/Chatbot/
├── ChatbotContainer.astro    # Contenedor Astro que maneja la hidratación
├── ChatbotWidget.tsx         # Componente React principal del chatbot
├── types.ts                  # Definiciones de tipos TypeScript
├── constants.ts              # Constantes y datos de ejemplo
├── utils.ts                  # Funciones utilitarias
├── index.ts                  # Punto de entrada del módulo
└── README.md                 # Esta documentación
```

## Características

- **Arquitectura de Islas**: Utiliza `client:idle` para optimizar el rendimiento
- **Interfaz Moderna**: UI oscura con acentos en color `#d0df00`
- **Soporte de Archivos**: Drag & drop, validación de tipos y tamaños
- **Responsive**: Adaptado para móviles y escritorio
- **Animaciones**: Transiciones suaves y feedback visual
- **Accesibilidad**: ARIA labels y navegación por teclado
- **Internacionalización**: Textos en español

## Uso

El chatbot se integra automáticamente en el Layout principal y estará disponible en todas las páginas del sitio.

### Importación Manual

```typescript
import { ChatbotWidget } from '../components/Chatbot'
```

### En Componentes Astro

```astro
---
import ChatbotContainer from '../components/Chatbot/ChatbotContainer.astro'
---

<ChatbotContainer />
```

## Configuración

### Personalizar Respuestas del Bot

Edita el archivo `constants.ts` para modificar las respuestas automáticas:

```typescript
export const botResponses = [
  "Tu respuesta personalizada aquí...",
  // más respuestas
]
```

### Modificar Restricciones de Archivos

En `constants.ts`:

```typescript
export const FILE_CONSTRAINTS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png", /* más tipos */]
}
```

## Optimización de Rendimiento

- Usa `client:idle` para cargar solo cuando el navegador esté inactivo
- Componente React optimizado con hooks apropiados
- Lazy loading de archivos adjuntos
- Animaciones CSS optimizadas

## Personalización de Estilos

Los estilos están definidos en `ChatbotContainer.astro` y pueden ser modificados según las necesidades del diseño.

## Integración con Backend

Para conectar con un backend real, modifica la función `handleSendMessage` en `ChatbotWidget.tsx` para hacer llamadas a tu API en lugar de usar respuestas simuladas.
