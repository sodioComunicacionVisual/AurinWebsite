// Módulo Chatbot - Punto de entrada principal
export { default as ChatbotWidget } from './ChatbotWidget.tsx'
export type { Message, ChatbotState } from './types'
export { sampleMessages, botResponses, FILE_CONSTRAINTS } from './constants'
export { getCurrentTime, validateFile, formatFileSize } from './utils'
