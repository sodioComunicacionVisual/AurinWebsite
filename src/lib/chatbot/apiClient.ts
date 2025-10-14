import type { ChatMessage } from './sessionManager';

export interface ChatApiResponse {
  success: boolean;
  response?: string;
  error?: string;
  sessionId: string;
  timestamp: string;
  metadata?: {
    model?: string;
    responseTime?: number;
  };
}

export interface ChatApiRequest {
  message: string;
  sessionId: string;
  metadata?: {
    userId?: string;
    userAgent?: string;
    referrer?: string;
  };
}

export class ChatApiClient {
  private static readonly API_ENDPOINT = '/api/chat';
  private static readonly REQUEST_TIMEOUT = 30000; // 30 segundos

  static async sendMessage(
    message: string, 
    sessionId: string, 
    metadata?: ChatApiRequest['metadata']
  ): Promise<ChatApiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

    try {
      const payload: ChatApiRequest = {
        message,
        sessionId,
        metadata: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          referrer: typeof window !== 'undefined' ? window.location.href : undefined,
          ...metadata
        }
      };

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ChatApiResponse = await response.json();
      return data;

    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'La solicitud tardó demasiado. Por favor intenta nuevamente.',
          sessionId,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: false,
        error: error.message || 'Error de conexión. Verifica tu internet e intenta nuevamente.',
        sessionId,
        timestamp: new Date().toISOString()
      };
    }
  }

  static async sendMessageWithRetry(
    message: string,
    sessionId: string,
    maxRetries: number = 2,
    metadata?: ChatApiRequest['metadata']
  ): Promise<ChatApiResponse> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.sendMessage(message, sessionId, metadata);
        
        // Si es exitoso, retornar inmediatamente
        if (result.success) {
          return result;
        }

        // Si es un error de cliente (4xx), no reintentar
        if (result.error?.includes('400') || result.error?.includes('401') || result.error?.includes('403')) {
          return result;
        }

        lastError = result;

        // Esperar antes del siguiente intento (exponential backoff)
        if (attempt < maxRetries) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }

      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    return lastError || {
      success: false,
      error: 'No se pudo procesar tu mensaje después de varios intentos.',
      sessionId,
      timestamp: new Date().toISOString()
    };
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  static getConnectionStatus(): 'online' | 'offline' | 'unknown' {
    if (typeof navigator === 'undefined') return 'unknown';
    return navigator.onLine ? 'online' : 'offline';
  }
}
