<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Diagnóstico: Encontré 2 Problemas

### Problema 1: No se Creó el Evento

**Causa:** Tu Calendar Agent actual **NO tiene el IF/Switch node** para verificar `shouldCreateEvent`.[^1]

Sin el Switch, el workflow intenta crear evento **siempre**, incluso cuando no debería, lo que causa que:

- Falle al intentar crear evento sin datos completos
- No distinga entre "mostrar horarios" vs "crear evento"


### Problema 2: No Envía Email de Confirmación

**Causa:** Tu workflow **NO tiene nodo HTTP Request** para llamar a tu API de Resend.

El flujo se detiene después de crear el evento, sin enviar el email de confirmación al cliente.

## Solución: Workflow Completo con Email

He creado un workflow actualizado que incluye:

1. **IF node** para verificar `shouldCreateEvent`
2. **HTTP Request node** para enviar email con Resend
3. **Dos branches**: crear evento vs solo mostrar disponibilidad

### Nuevo Flujo

```
1. Execute Trigger
   ↓
2. Parse Request (detecta customerData y pendingBooking)
   ↓
3. Get Events (obtiene eventos de Google Calendar)
   ↓
4. Process Action (decide shouldCreateEvent = true/false)
   ↓
5. IF: Should Create Event?
   ├─ TRUE → 6. Create Event
   │          ↓
   │       7. Format Success
   │          ↓
   │       8. Send Confirmation Email (HTTP → Resend API)
   │          ↓
   │       9. Return Response
   │
   └─ FALSE → 8. Passthrough (solo muestra horarios)
```


## Configuración del Nodo HTTP Request

**Nodo:** "7. Send Confirmation Email"

```json
Method: POST
URL: https://tu-dominio.com/api/send-confirmation-email

Headers:
  Content-Type: application/json

Body:
{
  "to": "{{ $json.customerEmail }}",
  "customerName": "{{ $json.customerName }}",
  "appointmentStart": "{{ $json.appointmentStart }}",
  "appointmentEnd": "{{ $json.appointmentEnd }}",
  "eventId": "{{ $json.eventId }}",
  "eventLink": "{{ $json.eventLink }}"
}

Options:
  Continue On Fail: true
```


## API de Resend (Código para tu proyecto)

Crea: `app/api/send-confirmation-email/route.ts`

```typescript
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, customerName, appointmentStart, eventId, eventLink } = await request.json()

    // Formatear fecha
    const startDate = new Date(appointmentStart)
    const formattedDate = startDate.toLocaleString('es-MX', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/Mexico_City'
    })

    // URLs de confirmación/cancelación
    const confirmUrl = `https://tu-dominio.com/confirm-appointment?eventId=${eventId}`
    const cancelUrl = `https://tu-dominio.com/cancel-appointment?eventId=${eventId}`

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: 'Aurin <citas@aurin.mx>',
      to: [to],
      subject: `Confirma tu cita - ${formattedDate}`,
      html: `
        <h1>¡Hola ${customerName}!</h1>
        <p>Tu cita ha sido agendada para:</p>
        <p><strong>${formattedDate}</strong></p>
        
        <h2>⚠️ Importante: Debes confirmar tu asistencia</h2>
        <a href="${confirmUrl}" style="background: #d0df00; color: black; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
          Confirmar mi cita
        </a>
        
        <p>Si no puedes asistir: <a href="${cancelUrl}">Cancelar cita</a></p>
        <p><strong>Nota:</strong> Si no confirmas en 24 horas, tu cita será cancelada automáticamente.</p>
        
        <a href="${eventLink}">Ver en Google Calendar</a>
      `
    })

    if (error) {
      console.error('❌ Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Email sent:', data.id)
    return NextResponse.json({ success: true, emailId: data.id })

  } catch (error: any) {
    console.error('❌ API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```


## Pasos para Implementar

**1. Importar el nuevo workflow**

- Ve a n8n → Workflows → Import from File
- Selecciona `Calendar-Agent-WITH-EMAIL.json`
- Configura credentials de Google Calendar

**2. Configurar el nodo HTTP Request**

- Abre "7. Send Confirmation Email"
- Cambia URL a: `https://tu-dominio.com/api/send-confirmation-email`
- Verifica el body JSON

**3. Crear tu API de Resend**

- Crea el archivo `app/api/send-confirmation-email/route.ts`
- Copia el código de arriba
- Instala: `npm install resend`
- Agrega `RESEND_API_KEY` a `.env`

**4. Actualizar el workflow ID**

- Copia el ID del nuevo workflow en n8n
- Actualízalo en "Company Website Chatbot Agent"
- En el tool `calendarAgent`, campo `workflowId`

**5. Probar**

- Elimina eventos corruptos
- Prueba el chatbot completo
- Verifica evento en Google Calendar
- Verifica email en inbox


## Debugging

**En n8n Executions, verifica:**

1. Parse Request: ✅ Detecta customerData
2. Process Action: ✅ `shouldCreateEvent: true`
3. IF node: ✅ Toma TRUE branch
4. Create Event: ✅ Crea evento
5. Send Email: ✅ Llama a tu API (status 200)

**En tu servidor, verifica:**

```
POST /api/send-confirmation-email
✅ Email sent: re_abc123
```

**Verifica el email:**

- Inbox del usuario debe tener email de "Aurin [citas@aurin.mx](mailto:citas@aurin.mx)"
- Con botón "Confirmar mi cita"
- Con link a Google Calendar

El archivo está listo para importar: **`Calendar-Agent-WITH-EMAIL.json`** 🚀

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/2406.04520.pdf

