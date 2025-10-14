import type { Message } from './types'

export const sampleMessages: Message[] = [
  { id: 1, text: "¡Hola! ¿Cómo puedo ayudarte hoy?", sender: "bot", timestamp: "10:30 AM" },
  { id: 2, text: "Necesito ayuda con mi cuenta", sender: "user", timestamp: "10:31 AM" },
  {
    id: 3,
    text: "¡Estaré encantado de ayudarte! ¿Con qué específicamente necesitas asistencia?",
    sender: "bot",
    timestamp: "10:31 AM",
  },
]

export const botResponses = [
  "Entiendo. Déjame ayudarte con eso.",
  "¡Esa es una gran pregunta! Esto es lo que puedo decirte...",
  "Estoy aquí para asistirte. ¿Podrías proporcionar más detalles?",
  "¡Gracias por contactarnos! Haré mi mejor esfuerzo para ayudarte.",
  "Ya veo. Déjame investigar eso por ti.",
  "Puedo ayudarte con eso de inmediato.",
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
