import type { Message } from './types'
import { getCurrentTime } from './utils'

export const sampleMessages: Message[] = [
  {
    id: 1,
    text: "¡Hola! 👋 ¿Cómo puedo ayudarte hoy?\n\nPuedo asistirte con:\n- **Gestión de cuenta**\n- *Soporte técnico*\n- Consultas generales",
    sender: "bot",
    timestamp: getCurrentTime(),
  },
  { id: 2, text: "Necesito ayuda con mi cuenta", sender: "user", timestamp: getCurrentTime() },
  {
    id: 3,
    text: "¡**Perfecto**! Estaré encantado de ayudarte.\n\n¿Con qué específicamente necesitas asistencia?\n\nTambién puedes consultar nuestro [centro de ayuda](https://example.com) para respuestas rápidas.",
    sender: "bot",
    timestamp: getCurrentTime(),
  },
]

export const botResponses = [
  "**Entiendo**. Déjame ayudarte con eso de inmediato.",
  "¡Esa es una *gran pregunta*! Esto es lo que puedo decirte:\n\n- Primero, verifica tu configuración\n- Luego, confirma tu email\n- Finalmente, reinicia la aplicación",
  "Estoy aquí para asistirte. ¿Podrías proporcionar **más detalles** sobre el problema?",
  "¡Gracias por contactarnos! Haré mi mejor esfuerzo para ayudarte. 😊\n\nNo dudes en preguntarme cualquier cosa.",
  "Ya veo. Déjame investigar eso por ti.\n\n`Procesando tu solicitud...`",
  "Puedo ayudarte con eso de inmediato. Consulta esta [guía](https://example.com) para más información.",
]

export const FILE_CONSTRAINTS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "image/jpeg", 
    "image/png", 
    "image/gif", 
    "image/webp", 
    "application/pdf", 
    "text/plain"
  ]
}
