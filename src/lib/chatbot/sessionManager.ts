import { nanoid } from 'nanoid';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  file?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  };
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: string;
  lastActivity: string;
}

export class SessionManager {
  private static readonly SESSION_KEY = 'chatbot_session';
  private static readonly MAX_MESSAGES = 50; // Límite para evitar overflow
  
  static generateSessionId(): string {
    return `sess_${nanoid(12)}`;
  }

  static getCurrentSession(): ChatSession {
    if (typeof window === 'undefined') {
      // SSR fallback
      return this.createNewSession();
    }

    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (stored) {
        const session: ChatSession = JSON.parse(stored);
        // Verificar que la sesión no sea muy antigua (más de 1 hora)
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        if (new Date(session.lastActivity).getTime() > oneHourAgo) {
          return session;
        }
      }
    } catch (error) {
      console.warn('Error loading session from storage:', error);
    }

    return this.createNewSession();
  }

  static createNewSession(): ChatSession {
    const session: ChatSession = {
      sessionId: this.generateSessionId(),
      messages: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    this.saveSession(session);
    return session;
  }

  static saveSession(session: ChatSession): void {
    if (typeof window === 'undefined') return;

    try {
      // Actualizar timestamp de actividad
      session.lastActivity = new Date().toISOString();
      
      // Limitar número de mensajes para evitar overflow
      if (session.messages.length > this.MAX_MESSAGES) {
        session.messages = session.messages.slice(-this.MAX_MESSAGES);
      }

      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.warn('Error saving session to storage:', error);
    }
  }

  static addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const session = this.getCurrentSession();
    
    const newMessage: ChatMessage = {
      id: nanoid(8),
      timestamp: new Date().toISOString(),
      ...message
    };

    session.messages.push(newMessage);
    this.saveSession(session);
    
    return newMessage;
  }

  static getMessages(): ChatMessage[] {
    return this.getCurrentSession().messages;
  }

  static getSessionId(): string {
    return this.getCurrentSession().sessionId;
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.warn('Error clearing session:', error);
    }
  }

  static getSessionInfo(): { sessionId: string; messageCount: number; duration: string } {
    const session = this.getCurrentSession();
    const duration = this.calculateSessionDuration(session.createdAt);
    
    return {
      sessionId: session.sessionId,
      messageCount: session.messages.length,
      duration
    };
  }

  private static calculateSessionDuration(createdAt: string): string {
    const now = Date.now();
    const created = new Date(createdAt).getTime();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffMinutes < 1) return 'menos de 1 minuto';
    if (diffMinutes < 60) return `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  }
}
