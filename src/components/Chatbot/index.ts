// Módulo Chatbot - Punto de entrada principal
export { default as ChatbotWidget } from './ChatbotWidget'
export { MarkdownRenderer } from './MarkdownRenderer'
export type { Message } from './types'
export { sampleMessages, botResponses } from './constants'
export { getCurrentTime, validateFile, formatFileSize, formatMessageTime } from './utils'
