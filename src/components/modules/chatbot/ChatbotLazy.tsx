import React, { useState, useEffect, Suspense } from 'react'

const ChatbotWidget = React.lazy(() => import('./ChatbotWidget'))

interface Props {
  lang: string
  translations: any
}

export default function ChatbotLazy({ lang, translations }: Props) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const win = window as any
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setIdle(true), { timeout: 2500 })
      return () => win.cancelIdleCallback(id)
    }
    const id = setTimeout(() => setIdle(true), 500)
    return () => clearTimeout(id)
  }, [])

  if (!idle) return null

  return (
    <Suspense fallback={null}>
      <ChatbotWidget lang={lang} translations={translations} />
    </Suspense>
  )
}
