export async function sendChatMessage(query: string, sessionId: string): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: query,
      sessionId,
      mode: "search",
      metadata: {
        source: "chatbot-search",
        timestamp: new Date().toISOString(),
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "Error al procesar tu consulta")
  }

  const data = await response.json()
  return data.output || data.response || "No se pudo obtener una respuesta"
}
