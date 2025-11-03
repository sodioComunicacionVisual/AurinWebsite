# Calendar Agent API - Documentación

## 🎯 Arquitectura

Sistema de citas rápidas integrado con Google Calendar, n8n y Resend.

```
Usuario → Chatbot → n8n Calendar Agent → Google Calendar
                                      ↓
                            Vercel API → Resend → Email
                                      ↓
Usuario clic botón → Vercel API → n8n Webhook → Google Calendar
```

---

## 📋 APIs Nuevas

### 1. **POST /api/send-appointment-confirmation**

**Llamado desde:** n8n Calendar Agent (después de crear evento en Google Calendar)

**Request:**
```json
{
  "name": "Ana García",
  "email": "ana@ejemplo.com",
  "appointmentDate": "2025-11-06T15:00:00-06:00",
  "meetLink": "https://meet.google.com/abc-def-ghi",
  "eventId": "event123abc",
  "calendarLink": "https://calendar.google.com/event?eid=..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Confirmation email sent successfully",
  "emailId": "resend-id-123",
  "eventId": "event123abc"
}
```

**Funcionalidad:**
- Genera token seguro (eventId + email + timestamp + HMAC)
- Envía email via Resend con botón de confirmación
- Token válido por 24 horas

---

### 2. **GET /api/confirm-appointment**

**Llamado desde:** Email del usuario (botón "CONFIRMAR MI CITA")

**Request:**
```
GET /api/confirm-appointment?token=eyJldmVudElkIjoiZXZlbnQxMjMiLCJlbWFpbCI6ImFuYUBlamVtcGxvLmNvbSIsInRpbWVzdGFtcCI6MTczMTIwMDAwMDAwMCwiaGFzaCI6ImFiYzEyMyJ9
```

**Funcionalidad:**
1. Valida token (integridad, expiración)
2. Extrae `eventId` y `email`
3. Llama webhook n8n: `POST https://n8n.n8nsystems.info/webhook/confirm-appointment`
4. Redirige a: `https://aurin.mx/cita-confirmada`

**Errores:**
- Token inválido: 400 "Token inválido o expirado"
- Error n8n: 500 "Error al confirmar cita"

---

## 🔒 Seguridad

### Token de confirmación

**Formato:**
```
Base64URL(eventId:email:timestamp:hash)
```

**Hash:**
```js
HMAC-SHA256(
  payload: "eventId:email:timestamp",
  secret: RESEND_API_KEY
)
```

**Validaciones:**
- Hash HMAC válido
- Token < 24 horas de antigüedad
- Decodificación correcta

---

## 🔄 Flujo Completo

### **Paso 1: Usuario solicita cita**
```
Usuario: "Quiero cita el jueves 3pm"
 ↓
Chatbot: "Dame tu nombre y email"
 ↓
Usuario: "Ana, ana@ejemplo.com"
```

### **Paso 2: n8n Calendar Agent**
```js
// Parse Request (validar +24h, horarios dinámicos)
const proposedDateTime = new Date(`${targetDate}T${targetTime}:00-06:00`);
const minDateTime = new Date(Date.now() + 24*60*60*1000);

if (proposedDateTime < minDateTime) {
  return "Solo citas con +24h de anticipación";
}

// Get Events (verificar disponibilidad)
const events = await googleCalendar.getEvents();
const busySlots = events.filter(e => e.start.dateTime.startsWith(targetDate));

// Si disponible → Create Event [PENDIENTE CONFIRMACIÓN]
const event = await googleCalendar.createEvent({
  summary: `[PENDIENTE CONFIRMACIÓN] Cita - ${customerName}`,
  start: proposedDateTime,
  end: add30min(proposedDateTime),
  attendees: [{ email: customerEmail }],
  conferenceData: { createRequest: { requestId: uuid() } }
});
```

### **Paso 3: Enviar email de confirmación**
```js
// n8n → HTTP Request → POST /api/send-appointment-confirmation
await fetch('https://aurin.mx/api/send-appointment-confirmation', {
  method: 'POST',
  body: JSON.stringify({
    name: customerData.name,
    email: customerData.email,
    appointmentDate: event.start.dateTime,
    meetLink: event.hangoutLink,
    eventId: event.id,
    calendarLink: event.htmlLink
  })
});
```

### **Paso 4: Usuario confirma**
```
Usuario recibe email → Clic en botón
 ↓
GET /api/confirm-appointment?token=xyz
 ↓
Valida token → POST n8n webhook
 ↓
n8n → Update Google Calendar Event:
  summary: "[CONFIRMADA] Cita - Ana García"
 ↓
Redirect → https://aurin.mx/cita-confirmada
```

---

## ⚙️ Configuración n8n

### **Webhook: /webhook/confirm-appointment**

**Crear nuevo workflow en n8n:**

```json
{
  "name": "Confirm Appointment Webhook",
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "confirm-appointment",
        "method": "POST"
      }
    },
    {
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const { eventId, email } = $json.body;\nreturn [{ json: { eventId, email } }];"
      }
    },
    {
      "type": "n8n-nodes-base.googleCalendar",
      "parameters": {
        "operation": "update",
        "eventId": "={{ $json.eventId }}",
        "updateFields": {
          "summary": "={{ $json.summary.replace('[PENDIENTE CONFIRMACIÓN]', '[CONFIRMADA]') }}"
        }
      }
    }
  ]
}
```

**URL del webhook:**
```
https://n8n.n8nsystems.info/webhook/confirm-appointment
```

---

## 🤖 Actualización del Calendar Agent (n8n)

### **Nodo "Parse Request" - Validación +24h**

```js
// ... código existente ...

// NUEVO: Validar +24h anticipación
if (action === 'book' && targetDate && targetTime) {
  const proposedDateTime = new Date(`${targetDate}T${targetTime}:00-06:00`);
  const minDateTime = new Date(Date.now() + 24*60*60*1000); // +24h

  if (proposedDateTime < minDateTime) {
    return [{
      json: {
        output: '⏰ Solo aceptamos citas con al menos 24 horas de anticipación para poder confirmarlas adecuadamente.',
        action: 'error',
        needsData: false,
        pendingBooking: null
      }
    }];
  }
}

return [{ json: { query, action, targetDate, targetTime, customerEmail, customerData, pendingBookingIn } }];
```

### **Nodo "Process Action" - Horarios dinámicos**

```js
// ... código existente ...

if (action === 'check' || action === 'book') {
  const allowedTimes = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00'];

  // NUEVO: Calcular disponibilidad dinámica con buffer de 15 min
  const busySlots = events
    .filter(e => e.start?.dateTime?.startsWith(targetDate))
    .map(e => ({
      start: new Date(new Date(e.start.dateTime).getTime() - 15*60*1000),
      end: new Date(new Date(e.end.dateTime).getTime() + 15*60*1000)
    }));

  const availableTimes = allowedTimes.filter(time => {
    const proposedStart = new Date(`${targetDate}T${time}:00-06:00`);
    const proposedEnd = new Date(proposedStart.getTime() + 30*60*1000); // 30 min cita

    return !busySlots.some(busy =>
      proposedStart < busy.end && proposedEnd > busy.start
    );
  });

  // Si no hay horarios disponibles
  if (availableTimes.length === 0) {
    response = `❌ No hay horarios disponibles ese día. Intenta otro día.`;
  }
}
```

### **Nuevo nodo "Send Confirmation Email"**

**Reemplazar nodo `Send Confirm Email` (emailSend) por HTTP Request:**

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://aurin.mx/api/send-appointment-confirmation",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "name", "value": "={{ $json.customerData.name }}" },
        { "name": "email", "value": "={{ $json.customerData.email }}" },
        { "name": "appointmentDate", "value": "={{ $('Create Event').item.json.start.dateTime }}" },
        { "name": "meetLink", "value": "={{ $('Create Event').item.json.hangoutLink }}" },
        { "name": "eventId", "value": "={{ $('Create Event').item.json.id }}" },
        { "name": "calendarLink", "value": "={{ $('Create Event').item.json.htmlLink }}" }
      ]
    }
  }
}
```

---

## 🕐 Auto-Cancelación (Scheduled Workflow)

### **Nuevo workflow: "Auto-Cancel Unconfirmed Appointments"**

```json
{
  "name": "Auto-Cancel Unconfirmed Appointments",
  "nodes": [
    {
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 1 }]
        }
      },
      "name": "Every Hour"
    },
    {
      "type": "n8n-nodes-base.googleCalendar",
      "parameters": {
        "operation": "getAll",
        "calendar": "primary",
        "options": {
          "timeMin": "={{ new Date().toISOString() }}",
          "timeMax": "={{ new Date(Date.now() + 7*24*60*60*1000).toISOString() }}"
        }
      },
      "name": "Get Upcoming Events"
    },
    {
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Filtrar eventos [PENDIENTE] creados hace >24h\nconst events = $input.all().map(i => i.json);\nconst now = Date.now();\nconst toCancel = [];\n\nfor (const event of events) {\n  if (!event.summary?.includes('[PENDIENTE CONFIRMACIÓN]')) continue;\n  \n  const created = new Date(event.created).getTime();\n  const age = now - created;\n  \n  // Si tiene >24h sin confirmar\n  if (age > 24*60*60*1000) {\n    toCancel.push({ eventId: event.id, summary: event.summary });\n  }\n}\n\nreturn toCancel.map(e => ({ json: e }));"
      },
      "name": "Filter Expired"
    },
    {
      "type": "n8n-nodes-base.googleCalendar",
      "parameters": {
        "operation": "delete",
        "eventId": "={{ $json.eventId }}",
        "options": { "sendUpdates": "all" }
      },
      "name": "Delete Event"
    }
  ]
}
```

---

## 🎨 Actualización del Chatbot Principal

### **System Prompt del Ultimate Chatbot Agent**

**Actualizar en n8n → [Ultimate Website Chatbot Agent](src/components/modules/chatbot/agents/Company Website Chatbot Agent (RAG, Calendar integrations).json) → Options → System Message:**

```text
You are Aurin's chatbot assistant. You route requests to tools - never answer directly.

TOOLS:
• RAGagent - FAQs about Aurin services, portfolio, expertise
• calendarAgent - SOLO para citas rápidas de 30 minutos (demos, consultas breves, introducción)
• ticketAgent - Para proyectos complejos, presupuestos, consultas profundas con archivos adjuntos

CALENDAR AGENT (Citas Rápidas):
- Solo para: demos, dudas rápidas, consultas breves, conocer servicios
- Duración: 30 minutos
- Requisitos: nombre, email, motivo breve
- Disponibilidad: Lunes a Viernes, 9-11 AM y 2-5 PM (horario México)
- Confirmación: Usuario debe confirmar en 24h vía email o la cita se cancela
- Anticipación mínima: 24 horas

TICKET AGENT (Consultas Profundas):
- Para: proyectos grandes, presupuestos detallados, consultas complejas
- Nuestro equipo contactará personalmente
- Acepta archivos adjuntos
- Collect: nombre, email, empresa (opcional), servicio, asunto, descripcion, archivoAdjunto

FILE ATTACHMENTS:
When you see [SYSTEM: User attached file: URL], extract URL and include in archivoAdjunto field.

JSON FORMAT for ticketAgent (REQUIRED):
{
  "nombre": "Name",
  "email": "email@example.com",
  "empresa": "",
  "servicio": "Service",
  "asunto": "Subject",
  "descripcion": "Description",
  "archivoAdjunto": "https://url or empty string"
}

RULES:
1. Si usuario quiere cita rápida/demo/consulta breve → calendarAgent
2. Si usuario quiere proyecto grande/presupuesto/consulta profunda → ticketAgent
3. Si solo pregunta sobre servicios → RAGagent
4. Always use empty string "" if no data (NEVER use null)
5. Speak Spanish naturally
```

---

## ✅ Checklist de Implementación

### **Vercel (Código)**
- [x] Tipo `AppointmentData` en `src/lib/mailing/types.ts`
- [x] Template `appointmentConfirmationEmail` en `src/lib/mailing/templates.ts`
- [x] Funciones `sendAppointmentConfirmation`, `generateAppointmentToken`, `validateAppointmentToken` en `src/lib/mailing/service.ts`
- [x] API `POST /api/send-appointment-confirmation`
- [x] API `GET /api/confirm-appointment`
- [x] Documentación `docs/CALENDAR_AGENT_API.md`

### **n8n (Workflows)**
- [ ] Crear webhook `/webhook/confirm-appointment`
- [ ] Actualizar "Calendar Agent Pro v3":
  - [ ] Agregar validación +24h en "Parse Request"
  - [ ] Agregar horarios dinámicos en "Process Action"
  - [ ] Reemplazar "Send Confirm Email" por HTTP Request a Vercel API
  - [ ] Actualizar "Create Event" summary: `[PENDIENTE CONFIRMACIÓN] Cita - ${name}`
- [ ] Crear workflow "Auto-Cancel Unconfirmed Appointments"
- [ ] Actualizar system prompt de "Ultimate Website Chatbot Agent"

### **Google Calendar**
- [ ] Crear calendario dedicado (opcional pero recomendado)
- [ ] Configurar horario de trabajo
- [ ] Anotar Calendar ID en variable de entorno

### **Deploy**
- [ ] Push a GitHub
- [ ] Deploy en Vercel (automático)
- [ ] Activar workflows en n8n
- [ ] Probar flujo completo end-to-end

---

## 🧪 Testing

### **Caso 1: Cita exitosa**
```
1. Usuario: "Quiero una cita el jueves a las 3pm"
2. Bot: "Dame tu nombre y email"
3. Usuario: "Ana, ana@ejemplo.com"
4. Bot: "Cita reservada, revisa tu email para confirmar"
5. Email enviado con botón
6. Usuario hace clic → Redirect a /cita-confirmada
7. Evento actualizado en Google Calendar: [CONFIRMADA]
```

### **Caso 2: Validación +24h**
```
1. Usuario: "Quiero cita mañana 10am"
2. Bot: "Solo citas con +24h de anticipación"
```

### **Caso 3: Horario ocupado**
```
1. Usuario: "Quiero cita el jueves 3pm"
2. Calendar Agent verifica disponibilidad → ocupado
3. Bot: "Ese horario ya está ocupado, intenta: 4pm, 5pm"
```

### **Caso 4: No confirmada en 24h**
```
1. Cita creada → Email enviado
2. Usuario NO confirma
3. Después de 24h → Cron job elimina evento automáticamente
```

---

## 📞 Soporte

**Email:** hey@aurin.mx
**Docs:** Este archivo
**Repo:** GitHub (privado)
