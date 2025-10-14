# 🤖 Chatbot Infrastructure - Ready for n8n Integration

## 📋 Overview

La infraestructura del chatbot está **lista para conectar con tu webhook de n8n**. Hemos implementado una solución sencilla pero robusta que maneja sesiones, errores y comunicación con APIs externas.

## 🏗️ Architecture

```
Frontend (React) → SessionStorage → API Route → n8n Webhook → ChatGPT → Response
```

### Components Created:

1. **API Route** (`/src/pages/api/chat.ts`)
2. **Session Manager** (`/src/lib/chatbot/sessionManager.ts`)
3. **API Client** (`/src/lib/chatbot/apiClient.ts`)
4. **Updated Widget** (integrado con la nueva infraestructura)

## ⚙️ Configuration

### 1. Environment Variables

Crea un archivo `.env` basado en `.env.example`:

```bash
# N8N Webhook Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
N8N_WEBHOOK_AUTH=your-secret-token-here

# Environment
NODE_ENV=development
```

### 2. N8N Webhook Setup

Tu webhook de n8n debe:

- **Method:** POST
- **Authentication:** Header Auth con `Authorization: Bearer your-secret-token`
- **Expected Payload:**
```json
{
  "message": "User message text",
  "sessionId": "sess_abc123xyz",
  "metadata": {
    "timestamp": "2025-10-14T10:44:00.000Z",
    "userId": "anonymous",
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://yoursite.com"
  }
}
```

- **Expected Response:**
```json
{
  "success": true,
  "response": "Bot response text",
  "sessionId": "sess_abc123xyz",
  "timestamp": "2025-10-14T10:44:05.234Z",
  "metadata": {
    "model": "gpt-4o-mini",
    "responseTime": 1234
  }
}
```

## 🔧 Features Implemented

### ✅ Session Management
- **SessionStorage** para persistencia temporal
- **Auto-generated Session IDs** con nanoid
- **Session cleanup** automático (1 hora de inactividad)
- **Message limit** (50 mensajes máximo por sesión)

### ✅ Error Handling
- **Timeout protection** (30 segundos)
- **Retry logic** con exponential backoff
- **Connection status** monitoring
- **Graceful error messages** para usuarios

### ✅ API Integration
- **RESTful endpoint** `/api/chat`
- **Request validation**
- **Structured responses**
- **Development/Production** error handling

### ✅ Frontend Integration
- **Real-time session** sync
- **Connection status** indicator
- **Message persistence** across page reloads
- **Badge counter** con número de respuestas del bot

## 🚀 How to Use

### 1. Start Development Server
```bash
npm run dev
```

### 2. Configure Your N8N Webhook
- Set the webhook URL in your `.env` file
- Configure authentication token
- Test the connection

### 3. Test the Integration
- Open the chatbot widget
- Send a test message
- Verify the flow: Frontend → API → N8N → Response

## 📝 API Endpoints

### POST `/api/chat`

**Request:**
```typescript
{
  message: string;
  sessionId: string;
  metadata?: {
    userId?: string;
    userAgent?: string;
    referrer?: string;
  };
}
```

**Response (Success):**
```typescript
{
  success: true;
  response: string;
  sessionId: string;
  timestamp: string;
  metadata?: {
    model?: string;
    responseTime?: number;
  };
}
```

**Response (Error):**
```typescript
{
  success: false;
  error: string;
  sessionId: string;
  timestamp: string;
  details?: string; // Only in development
}
```

## 🔒 Security Features

- **Request validation** en API route
- **Timeout protection** contra requests colgados
- **Rate limiting** ready (puedes añadir middleware)
- **Environment-based** error details
- **Header authentication** para n8n webhook

## 📊 Session Storage Strategy

Siguiendo tu preferencia por simplicidad:

- **SessionStorage** para conversaciones temporales
- **Auto-cleanup** después de 1 hora de inactividad
- **No database** required - perfecto para FAQs simples
- **Memory efficient** con límite de mensajes

## 🎯 Next Steps

1. **Configure your n8n webhook** con la URL y token
2. **Test the integration** enviando mensajes
3. **Customize bot responses** en tu workflow de n8n
4. **Add FAQ knowledge base** si necesitas (opcional)

## 🐛 Troubleshooting

### Common Issues:

1. **"Request timeout"** → Verifica que tu n8n webhook esté activo
2. **"Connection error"** → Revisa la URL y token en `.env`
3. **"Invalid request format"** → Verifica el payload del webhook
4. **Session not persisting** → Verifica que sessionStorage esté habilitado

### Debug Mode:
Set `NODE_ENV=development` para ver detalles de errores en las respuestas de la API.

---

**La infraestructura está lista! 🎉** Solo necesitas configurar tu webhook de n8n y empezar a probar la integración.
