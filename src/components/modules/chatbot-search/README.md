# Chatbot Search Module

Módulo de búsqueda interactiva con efecto glass y respuestas de chatbot.

## 📁 Estructura

```
chatbot-search/
├── ChatbotSearchContainer.astro  # Contenedor principal Astro
├── ChatbotInterface.tsx          # Lógica del chatbot (maneja estado)
├── SearchInput.tsx               # Input con typewriter effect
├── SearchInput.module.css        # Estilos del input
├── ChatbotResponse.tsx           # Componente de respuesta
├── ChatbotResponse.module.css    # Estilos de respuesta
├── GlassEffect.tsx               # Efecto glass con filtros SVG
├── GlassEffect.module.css        # Estilos del efecto glass
├── useTypewriter.ts              # Hook para efecto typewriter
├── mockResponses.ts              # Respuestas mock del chatbot
├── index.ts                      # Exportaciones del módulo
└── README.md                     # Documentación
```

## 🎯 Uso

```astro
---
import ChatbotSearchContainer from '@/components/modules/chatbot-search/ChatbotSearchContainer.astro';
---

<ChatbotSearchContainer />
```

## ✨ Características

- **Efecto Glass**: Textura liquid glass con múltiples capas y blur
- **Typewriter Effect**: Placeholder animado que alterna entre servicios
- **Respuestas Mock**: Sistema de respuestas basado en keywords
- **Animaciones Suaves**: Usando Motion (framer-motion)
- **100% CSS Modules**: Sin Tailwind, todo en CSS puro
- **Accesible**: Labels, ARIA attributes, navegación por teclado
- **Responsive**: Adaptado para móvil y desktop

## 🔧 Componentes

### ChatbotInterface
Componente principal que maneja toda la lógica del chatbot.

### SearchInput
Input con efecto typewriter y botón de submit.

### ChatbotResponse
Muestra la respuesta del chatbot con animación.

### GlassEffect
Efecto visual de vidrio líquido con filtros SVG.

## 📝 Servicios

Los servicios que se muestran en el typewriter:
- Desarrollo web y de aplicaciones móviles
- Pruebas de usabilidad
- Desarrollo de Branding
- Diseño UX/UI
- Consultoría Digital
