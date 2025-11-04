import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, ChevronDown, Send, Paperclip, X, FileText, ImageIcon, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { nanoid } from 'nanoid'
import type { Message } from './types'
import { sampleMessages, botResponses } from './constants'
import { getCurrentTime, validateFile, formatFileSize, formatMessageTime } from './utils'
import { SessionManager, type ChatMessage } from '../../../lib/chatbot/sessionManager'
import { ChatApiClient } from '../../../lib/chatbot/apiClient'
import { MarkdownRenderer } from './MarkdownRenderer'

interface ChatbotTranslations {
  welcome: string;
  title: string;
  online: string;
  offline: string;
  openChat: string;
  minimizeChat: string;
  placeholder: string;
  send: string;
  attach: string;
  removeFile: string;
  dragFiles: string;
  maxSize: string;
  noConnection: string;
  errorGeneric: string;
  errorResponse: string;
  errorProcess: string;
  avatarAlt: string;
  botAvatarAlt: string;
}

interface ChatbotWidgetProps {
  lang?: string;
  translations?: ChatbotTranslations;
}

export default function ChatbotWidget({ lang = 'es', translations }: ChatbotWidgetProps) {
  // Default translations (fallback to Spanish)
  const t = translations || {
    welcome: "¡Hola! 👋 Soy el asistente virtual de Aurin. Estoy aquí para ayudarte con cualquier pregunta sobre nuestros servicios de comunicación visual y branding. ¿En qué puedo ayudarte hoy?",
    title: "Asistente IA",
    online: "En línea",
    offline: "Sin conexión",
    openChat: "Abrir chat",
    minimizeChat: "Minimizar chat",
    placeholder: "Escribe un mensaje...",
    send: "Enviar mensaje",
    attach: "Adjuntar archivo",
    removeFile: "Remover archivo",
    dragFiles: "Suelta los archivos aquí",
    maxSize: "Máx 10MB",
    noConnection: "No hay conexión a internet. Verifica tu conexión e intenta nuevamente.",
    errorGeneric: "Lo siento, hubo un error. Por favor intenta de nuevo.",
    errorResponse: "Lo siento, hubo un problema. Por favor intenta de nuevo o contáctanos en hey@aurin.mx",
    errorProcess: "Lo siento, no pude procesar tu mensaje",
    avatarAlt: "Avatar del asistente",
    botAvatarAlt: "Avatar del bot"
  };
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [sessionId, setSessionId] = useState<string>('')
  
  // ✅ Estado con persistencia en localStorage
  const [pendingBooking, setPendingBooking] = useState<any>(() => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('chatbot_pendingBooking')
    return saved ? JSON.parse(saved) : null
  })
  
  const [customerEmail, setCustomerEmail] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('chatbot_customerEmail') || ''
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasInitialized = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Helper function to save messages only when there are 2+ messages
  const saveMessagesToSession = (messagesToSave: ChatMessage[]) => {
    if (messagesToSave.length >= 2) {
      // Save all messages including welcome message
      const session = SessionManager.getCurrentSession()
      session.messages = messagesToSave
      SessionManager.saveSession(session)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Initialize session only once on mount
  useEffect(() => {
    if (hasInitialized.current) return

    const session = SessionManager.getCurrentSession()
    setSessionId(session.sessionId)
    const savedMessages = SessionManager.getMessages()

    // If there are saved messages, use them (already includes welcome message)
    if (savedMessages.length > 0) {
      setMessages(savedMessages)
    } else {
      // First time: create welcome message with current translation (NOT saved yet)
      const welcomeMessage: ChatMessage = {
        id: nanoid(8),
        text: t.welcome,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        file: undefined
      }
      setMessages([welcomeMessage])
      // Note: NOT calling SessionManager.addMessage here - only in state
    }

    hasInitialized.current = true
  }, [])

  // Update welcome message when language changes
  useEffect(() => {
    if (!hasInitialized.current) return

    setMessages(prevMessages => {
      if (prevMessages.length === 0) return prevMessages

      // Update only the first bot message (welcome message)
      return prevMessages.map((msg, index) => {
        if (index === 0 && msg.sender === 'bot') {
          return { ...msg, text: t.welcome }
        }
        return msg
      })
    })
  }, [lang, t.welcome])

  // ✅ Persistir pendingBooking y customerEmail en localStorage automáticamente
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (pendingBooking) {
      localStorage.setItem('chatbot_pendingBooking', JSON.stringify(pendingBooking))
      console.log('💾 PendingBooking saved to localStorage:', pendingBooking)
    } else {
      localStorage.removeItem('chatbot_pendingBooking')
      console.log('🗑️ PendingBooking removed from localStorage')
    }
  }, [pendingBooking])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (customerEmail) {
      localStorage.setItem('chatbot_customerEmail', customerEmail)
      console.log('💾 CustomerEmail saved to localStorage:', customerEmail)
    } else {
      localStorage.removeItem('chatbot_customerEmail')
      console.log('🗑️ CustomerEmail removed from localStorage')
    }
  }, [customerEmail])

  // Handle event listeners and body scroll
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const checkConnection = () => {
      setIsOnline(ChatApiClient.isOnline())
    }

    // Función para bloquear scroll del body
    const preventBodyScroll = () => {
      document.body.style.overflow = 'hidden'
    }

    // Función para restaurar scroll del body
    const restoreBodyScroll = () => {
      document.body.style.overflow = ''
    }

    // Función para cerrar chat
    const closeChatbot = () => {
      setIsExpanded(false)
      restoreBodyScroll()
    }

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        closeChatbot()
      }
    }

    checkMobile()
    checkConnection()

    window.addEventListener('resize', checkMobile)
    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)

    // Bloquear scroll del body cuando el chat está expandido
    if (isExpanded) {
      preventBodyScroll()
      // Agregar listener para click outside
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
      document.removeEventListener('mousedown', handleClickOutside)
      restoreBodyScroll() // Restaurar scroll al desmontar
    }
  }, [isExpanded])

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return
    if (!isOnline) {
      alert(t.noConnection)
      return
    }

    const messageText = inputValue.trim()
    let fileUrl: string | undefined = undefined
    let fileMetadata: { name: string; size: string; type: string; url: string } | undefined = undefined

    // Upload file to Vercel Blob if present
    if (selectedFile) {
      try {
        const formData = new FormData()
        formData.append('file', selectedFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file')
        }

        const uploadData = await uploadResponse.json()
        fileUrl = uploadData.url

        if (fileUrl) {
          fileMetadata = {
            name: selectedFile.name,
            size: formatFileSize(selectedFile.size),
            type: selectedFile.type,
            url: fileUrl
          }
        }
      } catch (uploadError) {
        console.error('File upload error:', uploadError)
        alert('Error al subir el archivo. Intenta de nuevo.')
        return
      }
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: nanoid(8),
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      file: fileMetadata
    }

    // Update state with new message
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    saveMessagesToSession(updatedMessages)

    setInputValue("")
    setSelectedFile(null)
    setIsTyping(true)

    try {
      // ✅ Preparar metadata con estado actual
      const requestMetadata = {
        timestamp: new Date().toISOString(),
        userId: 'anonymous',
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        hasAttachment: !!fileUrl,
        fileName: fileMetadata?.name,
        pendingBooking: pendingBooking,
        customerEmail: customerEmail
      }

      console.log('📤 Sending to backend:', {
        message: messageText,
        sessionId: sessionId,
        metadata: requestMetadata
      })

      // Usar nuestra API route para evitar problemas CORS
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId,
          fileUrl: fileUrl, // Incluir URL del archivo si existe
          metadata: requestMetadata
        })
      })

      setIsTyping(false)

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage: ChatMessage = {
          id: nanoid(8),
          text: errorData.output || errorData.error || t.errorResponse,
          sender: "bot",
          timestamp: new Date().toISOString(),
          file: undefined
        }
        const updatedMessages = [...messages, userMessage, errorMessage]
        setMessages(updatedMessages)
        saveMessagesToSession(updatedMessages)
        return
      }

      const data = await response.json()

      // ✅ GUARDAR metadata completo del backend para el siguiente turno
      if (data.metadata) {
        console.log('✅ Metadata received from backend:', data.metadata)
        
        // Actualizar pendingBooking si existe en metadata
        if (data.metadata.pendingBooking !== undefined) {
          setPendingBooking(data.metadata.pendingBooking)
          console.log('✅ PendingBooking saved:', data.metadata.pendingBooking)
        }
        
        // Actualizar customerEmail si existe en metadata
        if (data.metadata.customerEmail) {
          setCustomerEmail(data.metadata.customerEmail)
          console.log('✅ CustomerEmail saved:', data.metadata.customerEmail)
        }
      }

      // Respuesta del bot desde n8n
      const botMessage: ChatMessage = {
        id: nanoid(8),
        text: data.output || data.response || t.errorProcess,
        sender: "bot",
        timestamp: new Date().toISOString(),
        file: undefined
      }
      const updatedMessagesWithBot = [...messages, userMessage, botMessage]
      setMessages(updatedMessagesWithBot)
      saveMessagesToSession(updatedMessagesWithBot)
    } catch (error) {
      console.error('Error:', error)
      setIsTyping(false)

      const errorMessage: ChatMessage = {
        id: nanoid(8),
        text: t.errorGeneric,
        sender: "bot",
        timestamp: new Date().toISOString(),
        file: undefined
      }
      const updatedMessagesWithError = [...messages, userMessage, errorMessage]
      setMessages(updatedMessagesWithError)
      saveMessagesToSession(updatedMessagesWithError)
    }
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
    const validation = validateFile(file)
    
    if (!validation.isValid) {
      alert(validation.error)
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
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="chatbot-floating-btn"
        aria-label={t.openChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <MessageCircle size={32} color="black" />
        {messages.length > 0 && (
          <motion.span 
            className="chatbot-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            {messages.filter(m => m.sender === 'bot').length}
          </motion.span>
        )}
      </motion.button>
    )
  }

  return (
    <motion.div 
      ref={chatContainerRef}
      className={`chatbot-main ${isMobile ? 'chatbot-main--mobile' : ''}`}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <motion.div 
        className={`chatbot-header ${isMobile ? 'chatbot-header--mobile' : ''}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="chatbot-header-info">
          <div className="chatbot-avatar">
            <img
              src="https://pub-d17bbbdbf8e348c5a57c8168ad69c92f.r2.dev/Avatar_2%404x.webp"
              alt={t.avatarAlt}
              className="chatbot-avatar-img"
            />
            <motion.div
              className="chatbot-online-indicator"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h3 className="chatbot-title">{t.title}</h3>
            <p className="chatbot-status">{isOnline ? t.online : t.offline}</p>
          </div>
        </div>
        <motion.button
          onClick={() => {
            setIsExpanded(false)
            // Restaurar scroll del body al cerrar
            document.body.style.overflow = ''
          }}
          className="chatbot-minimize-btn"
          aria-label={t.minimizeChat}
          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown size={20} color="black" />
        </motion.button>
      </motion.div>

      {/* Messages Container */}
      <div 
        className="chatbot-messages chatbot-scrollbar"
        onWheel={(e) => {
          // Permitir scroll dentro del contenedor de mensajes
          const container = e.currentTarget
          const isScrollingUp = e.deltaY < 0
          const isScrollingDown = e.deltaY > 0
          const isAtTop = container.scrollTop === 0
          const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1

          // Prevenir propagación del scroll al body si estamos scrolleando dentro del contenedor
          if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
            e.stopPropagation()
          }
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`chatbot-message ${message.sender === "user" ? 'chatbot-message--user' : 'chatbot-message--bot'}`}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
            {message.sender === "bot" && (
              <motion.div
                className="chatbot-bot-avatar"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                <img
                  src="https://pub-d17bbbdbf8e348c5a57c8168ad69c92f.r2.dev/Avatar_2%404x.webp"
                  alt={t.botAvatarAlt}
                  className="chatbot-bot-avatar-img"
                />
              </motion.div>
            )}
            <div className={`chatbot-message-content ${message.sender === "user" ? 'chatbot-message-content--user' : 'chatbot-message-content--bot'}`}>
              <motion.div
                className={`chatbot-bubble ${message.sender === "user" ? 'chatbot-bubble--user' : 'chatbot-bubble--bot'}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.05 }}
              >
                {message.sender === 'bot' ? (
                  <MarkdownRenderer content={message.text} />
                ) : (
                  message.text
                )}
                {message.file && (
                  <motion.div 
                    className="chatbot-file-attachment"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {message.file.type.startsWith("image/") ? (
                      <motion.img
                        src={message.file.url || "/placeholder.svg"}
                        alt={message.file.name}
                        whileHover={{ opacity: 0.9 }}
                        style={{ borderRadius: '8px', maxWidth: '100%', cursor: 'pointer' }}
                      />
                    ) : (
                      <div className="chatbot-file-attachment-info">
                        <FileText size={32} color="#d0df00" />
                        <div className="chatbot-file-attachment-details">
                          <p className="chatbot-file-attachment-name">{message.file.name}</p>
                          <p className="chatbot-file-attachment-size">{message.file.size}</p>
                        </div>
                        <motion.button 
                          className="chatbot-download-btn"
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Download size={16} />
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
              <span className={`chatbot-timestamp ${message.sender === "user" ? 'chatbot-timestamp--user' : ''}`}>
                {formatMessageTime(message.timestamp)}
              </span>
            </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div 
              className="chatbot-message chatbot-message--bot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className="chatbot-bot-avatar">
                <img
                  src="https://pub-d17bbbdbf8e348c5a57c8168ad69c92f.r2.dev/Avatar_2%404x.webp"
                  alt={t.botAvatarAlt}
                  className="chatbot-bot-avatar-img"
                />
              </div>
              <div className="chatbot-bubble chatbot-bubble--bot">
                <div className="chatbot-typing">
                  <motion.div 
                    className="chatbot-typing-dot"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="chatbot-typing-dot"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="chatbot-typing-dot"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        className={`chatbot-input-area ${isMobile ? 'chatbot-input-area--mobile' : ''} ${isDragging ? 'chatbot-input-area--dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              className="chatbot-drag-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="chatbot-drag-content"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Paperclip size={48} color="#d0df00" />
                </motion.div>
                <p className="chatbot-drag-text">{t.dragFiles}</p>
                <p className="chatbot-drag-subtext">{t.maxSize}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedFile && (
            <motion.div 
              className="chatbot-file-preview"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
              >
                {selectedFile.type.startsWith("image/") ? (
                  <ImageIcon size={32} color="#d0df00" />
                ) : (
                  <FileText size={32} color="#d0df00" />
                )}
              </motion.div>
              <div className="chatbot-file-preview-info">
                <p className="chatbot-file-preview-name">{selectedFile.name}</p>
                <p className="chatbot-file-preview-size">{formatFileSize(selectedFile.size)}</p>
              </div>
              <motion.button
                onClick={() => setSelectedFile(null)}
                className="chatbot-remove-file-btn"
                aria-label={t.removeFile}
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} color="#ef4444" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="chatbot-input-container">
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.txt"
          />
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="chatbot-attach-btn"
            aria-label={t.attach}
            whileHover={{
              backgroundColor: 'rgba(208, 223, 0, 0.1)',
              scale: 1.1
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Paperclip size={20} color="#6b7280" />
            </motion.div>
          </motion.button>

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t.placeholder}
            className="chatbot-textarea"
            onFocus={(e) => e.currentTarget.style.borderColor = '#d0df00'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
            rows={1}
          />

          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !selectedFile}
            className={`chatbot-send-btn ${(!inputValue.trim() && !selectedFile) ? 'chatbot-send-btn--disabled' : ''}`}
            aria-label={t.send}
            whileHover={(!inputValue.trim() && !selectedFile) ? {} : { 
              scale: 1.05,
              boxShadow: '0 4px 12px rgba(208, 223, 0, 0.4)'
            }}
            whileTap={(!inputValue.trim() && !selectedFile) ? {} : { scale: 0.95 }}
            animate={(!inputValue.trim() && !selectedFile) ? {} : { 
              rotate: [0, -10, 10, 0] 
            }}
            transition={{ 
              duration: 0.3,
              repeat: inputValue.trim() || selectedFile ? 0 : 0
            }}
          >
            <Send size={20} color="black" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
