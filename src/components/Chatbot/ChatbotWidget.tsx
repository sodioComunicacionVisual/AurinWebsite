import { useState, useRef, useEffect } from "react"
import { MessageCircle, ChevronDown, Send, Paperclip, X, FileText, ImageIcon, Download } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { nanoid } from 'nanoid'
import type { Message } from './types'
import { sampleMessages, botResponses } from './constants'
import { getCurrentTime, validateFile, formatFileSize, formatMessageTime } from './utils'
import { SessionManager, type ChatMessage } from '../../lib/chatbot/sessionManager'
import { ChatApiClient } from '../../lib/chatbot/apiClient'

export default function ChatbotWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [isOnline, setIsOnline] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    const initializeSession = () => {
      const session = SessionManager.getCurrentSession()
      setSessionId(session.sessionId)
      const savedMessages = SessionManager.getMessages()
      if (savedMessages.length > 0) {
        setMessages(savedMessages)
      } else {
        // Mensaje de bienvenida hardcoded
        const welcomeMessage: ChatMessage = {
          id: nanoid(8),
          text: '¡Hola! 👋 Soy el asistente virtual de Aurin. Estoy aquí para ayudarte con cualquier pregunta sobre nuestros servicios de comunicación visual y branding. ¿En qué puedo ayudarte hoy?',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          file: undefined
        }
        setMessages([welcomeMessage])
        SessionManager.addMessage(welcomeMessage)
      }
    }
    
    const checkConnection = () => {
      setIsOnline(ChatApiClient.isOnline())
    }
    
    checkMobile()
    initializeSession()
    checkConnection()
    
    window.addEventListener('resize', checkMobile)
    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return
    if (!isOnline) {
      alert('No hay conexión a internet. Verifica tu conexión e intenta nuevamente.')
      return
    }

    const messageText = inputValue.trim()
    
    const userMessage = SessionManager.addMessage({
      text: messageText,
      sender: "user",
      file: selectedFile ? {
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        type: selectedFile.type,
        url: URL.createObjectURL(selectedFile)
      } : undefined
    })

    setMessages(SessionManager.getMessages())
    setInputValue("")
    setSelectedFile(null)
    setIsTyping(true)

    try {
      // Usar nuestra API route para evitar problemas CORS
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId,
          metadata: {
            timestamp: new Date().toISOString(),
            userId: 'anonymous',
            userAgent: navigator.userAgent,
            referrer: document.referrer
          }
        })
      })

      const data = await response.json()
      setIsTyping(false)

      // Respuesta del bot desde n8n
      const botMessage = SessionManager.addMessage({
        text: data.output || data.response || "Lo siento, no pude procesar tu mensaje",
        sender: "bot"
      })
      setMessages(SessionManager.getMessages())
    } catch (error) {
      console.error('Error:', error)
      setIsTyping(false)
      
      const errorMessage = SessionManager.addMessage({
        text: "Lo siento, hubo un error. Por favor intenta de nuevo.",
        sender: "bot"
      })
      setMessages(SessionManager.getMessages())
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
        aria-label="Abrir chat"
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
              alt="Avatar del asistente"
              className="chatbot-avatar-img"
            />
            <motion.div 
              className="chatbot-online-indicator"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h3 className="chatbot-title">Asistente IA</h3>
            <p className="chatbot-status">{isOnline ? 'En línea' : 'Sin conexión'}</p>
          </div>
        </div>
        <motion.button
          onClick={() => setIsExpanded(false)}
          className="chatbot-minimize-btn"
          aria-label="Minimizar chat"
          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown size={20} color="black" />
        </motion.button>
      </motion.div>

      {/* Messages Container */}
      <div className="chatbot-messages chatbot-scrollbar">
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
                  alt="Avatar del bot"
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
                {message.text}
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
                  alt="Avatar del bot"
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
                <p className="chatbot-drag-title">Suelta los archivos aquí</p>
                <p className="chatbot-drag-subtitle">Máx 10MB</p>
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
                aria-label="Remover archivo"
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
            aria-label="Adjuntar archivo"
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
            placeholder="Escribe un mensaje..."
            className="chatbot-textarea"
            onFocus={(e) => e.currentTarget.style.borderColor = '#d0df00'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
            rows={1}
          />

          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !selectedFile}
            className={`chatbot-send-btn ${(!inputValue.trim() && !selectedFile) ? 'chatbot-send-btn--disabled' : ''}`}
            aria-label="Enviar mensaje"
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
