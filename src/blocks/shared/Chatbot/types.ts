export interface Message {
  id: number
  text: string
  sender: "bot" | "user"
  timestamp: string
  file?: {
    name: string
    size: string
    type: string
    url: string
  }
}

export interface ChatbotState {
  isExpanded: boolean
  messages: Message[]
  inputValue: string
  selectedFile: File | null
  isTyping: boolean
  isDragging: boolean
}
