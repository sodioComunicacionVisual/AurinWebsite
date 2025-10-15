"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, ChevronDown, Send, Paperclip, X, FileText, ImageIcon, Download } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
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

const sampleMessages: Message[] = [
  {
    id: 1,
    text: "Hello! 👋 How can I help you today?\n\nI can assist you with:\n- **Account management**\n- *Technical support*\n- General inquiries",
    sender: "bot",
    timestamp: "10:30 AM",
  },
  { id: 2, text: "I need help with my account", sender: "user", timestamp: "10:31 AM" },
  {
    id: 3,
    text: "I'd be **happy to help**! What specifically do you need assistance with?\n\nYou can also check our [help center](https://example.com) for quick answers.",
    sender: "bot",
    timestamp: "10:31 AM",
  },
]

const botResponses = [
  "I **understand**. Let me help you with that right away.",
  "That's a *great question*! Here's what I can tell you:\n\n- First, check your settings\n- Then, verify your email\n- Finally, restart the app",
  "I'm here to assist you. Could you provide **more details** about the issue?",
  "Thanks for reaching out! I'll do my best to help. 😊\n\nFeel free to ask me anything.",
  "I see. Let me look into that for you.\n\n`Processing your request...`",
  "I can help you with that right away! Check out this [guide](https://example.com) for more information.",
]

export default function ChatbotWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [inputValue, setInputValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() && !selectedFile) return

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: getCurrentTime(),
      ...(selectedFile && {
        file: {
          name: selectedFile.name,
          size: `${(selectedFile.size / 1024).toFixed(1)} KB`,
          type: selectedFile.type,
          url: URL.createObjectURL(selectedFile),
        },
      }),
    }

    setMessages([...messages, newMessage])
    setInputValue("")
    setSelectedFile(null)

    // Simulate bot response
    setIsTyping(true)
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: getCurrentTime(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "text/plain"]

    if (file.size > maxSize) {
      alert("File size must be less than 10MB")
      return
    }

    if (!allowedTypes.includes(file.type)) {
      alert("File type not supported")
      return
    }

    setSelectedFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#d0df00] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-[9999] flex items-center justify-center animate-pulse-subtle"
        aria-label="Open chat"
      >
        <MessageCircle className="w-8 h-8 text-black" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">
          3
        </span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[650px] max-md:w-screen max-md:h-screen max-md:bottom-0 max-md:right-0 max-md:rounded-none rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#0f0f0f] z-[9998] flex flex-col animate-scale-in">
      {/* Header */}
      <div className="h-[72px] bg-[#d0df00] rounded-t-[20px] max-md:rounded-none px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-black/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-black" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#d0df00]" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black">AI Assistant</h3>
            <p className="text-xs text-black/80">Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="w-10 h-10 rounded-lg bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center"
          aria-label="Minimize chat"
        >
          <ChevronDown className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            {message.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-[#d0df00] flex items-center justify-center mr-2 flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-black" />
              </div>
            )}
            <div className={`max-w-[75%] ${message.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
              <div
                className={`px-4 py-3 text-sm ${
                  message.sender === "user"
                    ? "bg-[#d0df00] text-black rounded-[18px_18px_4px_18px]"
                    : "bg-[#1a1a1a] text-[#e5e5e5] rounded-[18px_18px_18px_4px]"
                }`}
              >
                {message.sender === "bot" ? (
                  <ReactMarkdown
                    className="markdown-content"
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-[#d0df00]">{children}</strong>,
                      em: ({ children }) => <em className="italic text-[#e5e5e5]">{children}</em>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d0df00] underline hover:text-[#e0ef10] transition-colors"
                        >
                          {children}
                        </a>
                      ),
                      ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                      li: ({ children }) => <li className="text-[#e5e5e5]">{children}</li>,
                      code: ({ children, className }) => {
                        const isInline = !className
                        return isInline ? (
                          <code className="bg-black/30 px-1.5 py-0.5 rounded text-[#d0df00] font-mono text-xs">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-black/30 p-2 rounded my-2 text-[#d0df00] font-mono text-xs overflow-x-auto">
                            {children}
                          </code>
                        )
                      },
                      h1: ({ children }) => <h1 className="text-lg font-bold text-[#d0df00] mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold text-[#d0df00] mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold text-[#d0df00] mb-1">{children}</h3>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-[#d0df00] pl-3 my-2 text-[#e5e5e5]/80 italic">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                ) : (
                  message.text
                )}
                {message.file && (
                  <div className="mt-2 p-3 bg-black/20 rounded-lg border border-white/10">
                    {message.file.type.startsWith("image/") ? (
                      <img
                        src={message.file.url || "/placeholder.svg"}
                        alt={message.file.name}
                        className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#d0df00]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{message.file.name}</p>
                          <p className="text-xs opacity-70">{message.file.size}</p>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : ""}`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-[#d0df00] flex items-center justify-center mr-2">
              <MessageCircle className="w-4 h-4 text-black" />
            </div>
            <div className="bg-[#1a1a1a] text-[#e5e5e5] rounded-[18px_18px_18px_4px] px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className={`border-t border-[#2a2a2a] p-4 rounded-b-[20px] max-md:rounded-none ${
          isDragging ? "border-2 border-dashed border-[#d0df00] bg-[#d0df00]/5" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-b-[20px] z-10">
            <div className="text-center">
              <Paperclip className="w-12 h-12 text-[#d0df00] mx-auto mb-2" />
              <p className="text-white font-medium">Drop files here</p>
              <p className="text-gray-400 text-sm">Max 10MB</p>
            </div>
          </div>
        )}

        {selectedFile && (
          <div className="mb-3 p-2 bg-[#1a1a1a] rounded-lg flex items-center gap-3">
            {selectedFile.type.startsWith("image/") ? (
              <ImageIcon className="w-8 h-8 text-[#d0df00]" />
            ) : (
              <FileText className="w-8 h-8 text-[#d0df00]" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}

        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full hover:bg-[#d0df00]/10 transition-colors flex items-center justify-center z-10"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5 text-gray-500 hover:text-[#d0df00] transition-colors" />
          </button>

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full min-h-[44px] max-h-[120px] bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#d0df00] rounded-[22px] px-12 py-3 text-sm text-white placeholder:text-gray-500 resize-none focus:outline-none transition-colors"
            rows={1}
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !selectedFile}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#d0df00] hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  )
}
