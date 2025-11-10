"use client"

import { useState, useRef } from "react"
import { AnimatePresence } from "motion/react"
import { nanoid } from 'nanoid'
import { SearchInput } from "./SearchInput"
import { ChatbotResponse } from "./ChatbotResponse"

interface ChatbotInterfaceProps {
  translations?: {
    label: string
    placeholder: string
    ariaLabel: string
    submitAriaLabel: string
    services: string[]
  }
}

export function ChatbotInterface({ translations }: ChatbotInterfaceProps) {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generar sessionId único para este chatbot-search
  const sessionIdRef = useRef<string>(nanoid(16))

  const handleSubmit = async (query: string) => {
    setIsLoading(true)
    setResponse(null)
    setError(null)

    try {
      // Llamar a la API de chat con modo 'search'
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: query,
          sessionId: sessionIdRef.current,
          mode: 'search', // ← Modo búsqueda para respuestas cortas
          metadata: {
            source: 'chatbot-search',
            timestamp: new Date().toISOString()
          }
        })
      })

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al procesar tu consulta')
      }

      const data = await apiResponse.json()
      const botResponse = data.output || data.response || 'No se pudo obtener una respuesta'

      setResponse(botResponse)
    } catch (err: any) {
      console.error('Error en chatbot-search:', err)
      setError(err.message || 'Hubo un error al procesar tu consulta. Por favor intenta de nuevo.')
      setResponse('Lo siento, no pude procesar tu consulta en este momento. Por favor intenta de nuevo o contáctanos en hey@aurin.mx')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <SearchInput onSubmit={handleSubmit} isLoading={isLoading} translations={translations} />

      <AnimatePresence mode="wait">
        {isLoading && <ChatbotResponse key="loading" response="Pensando en tu consulta..." />}
        {!isLoading && response && <ChatbotResponse key="response" response={response} />}
      </AnimatePresence>
    </div>
  )
}
