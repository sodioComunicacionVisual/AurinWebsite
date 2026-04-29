"use client"

import { useState, useRef } from "react"
import { AnimatePresence } from "motion/react"
import { nanoid } from "nanoid"
import { SearchInput } from "./SearchInput"
import { ChatbotResponse } from "./ChatbotResponse"
import { sendChatMessage } from "./api"
import type { SearchTranslations } from "./types"

interface ChatbotInterfaceProps {
  translations?: SearchTranslations
}

export function ChatbotInterface({ translations }: ChatbotInterfaceProps) {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionId = useRef<string>(nanoid(16))

  const handleSubmit = async (query: string) => {
    setIsLoading(true)
    setResponse(null)
    setError(null)

    try {
      const result = await sendChatMessage(query, sessionId.current)
      setResponse(result)
    } catch (err: any) {
      console.error("Error en chatbot-search:", err)
      setError(err.message)
      setResponse("Lo siento, no pude procesar tu consulta en este momento. Por favor intenta de nuevo o contáctanos en hey@aurin.mx")
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
