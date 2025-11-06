"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"
import { SearchInput } from "./SearchInput"
import { ChatbotResponse } from "./ChatbotResponse"
import { getMockResponse } from "./mockResponses"

export function ChatbotInterface() {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (query: string) => {
    setIsLoading(true)
    setResponse(null)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockResponse = getMockResponse(query)
    setResponse(mockResponse)
    setIsLoading(false)
  }

  return (
    <div>
      <SearchInput onSubmit={handleSubmit} isLoading={isLoading} />

      <AnimatePresence mode="wait">
        {isLoading && <ChatbotResponse key="loading" response="Pensando en tu consulta..." />}
        {!isLoading && response && <ChatbotResponse key="response" response={response} />}
      </AnimatePresence>
    </div>
  )
}
