import { FILE_CONSTRAINTS } from './constants'

export const getCurrentTime = (): string => {
  const now = new Date()
  return now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > FILE_CONSTRAINTS.maxSize) {
    return { isValid: false, error: "El archivo debe ser menor a 10MB" }
  }

  if (!FILE_CONSTRAINTS.allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Tipo de archivo no soportado" }
  }

  return { isValid: true }
}

export const formatFileSize = (bytes: number): string => {
  return `${(bytes / 1024).toFixed(1)} KB`
}
