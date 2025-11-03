# 🤖 N8N Agents - Configuración Final

## ✅ Workflows que DEBES tener en n8n (6 total)

Importa **EXACTAMENTE** estos 6 archivos JSON en este orden:

### 1. **RAG Agent.json** ✅
- **Estado:** Sin cambios
- **Acción:** Ya lo tienes, déjalo como está
- **Activo:** SÍ

### 2. **Ticket Agent.json** ✅
- **Estado:** Sin cambios (PROTEGIDO)
- **Acción:** Ya lo tienes, NO TOCAR
- **Activo:** SÍ

### 3. **Calendar Agent v4 (Quick Appointments).json** 🆕
- **Estado:** NUEVO (reemplaza al v3)
- **Acción:**
  1. Importar en n8n
  2. Configurar credenciales de Google Calendar en los nodos:
     - "Get Events"
     - "Create Event"
     - "Delete Event"
  3. Copiar el **Workflow ID** que se genere (lo necesitarás en el paso 6)
  4. Activar
- **Activo:** SÍ

### 4. **Confirm Appointment Webhook.json** 🆕
- **Estado:** NUEVO
- **Acción:**
  1. Importar en n8n
  2. Configurar credenciales de Google Calendar en:
     - "Get Event Details"
     - "Update Event to CONFIRMADA"
  3. Copiar la **URL del webhook** generada (ej: `https://n8n.n8nsystems.info/webhook/confirm-appointment`)
  4. Activar
- **Activo:** SÍ
- **IMPORTANTE:** Después de importar, actualiza `src/pages/api/confirm-appointment.ts` línea 23 con esta URL

### 5. **Auto-Cancel Unconfirmed Appointments.json** ✅
- **Estado:** Ya existe
- **Acción:** Verificar que esté activo y configurado para ejecutarse cada hora
- **Activo:** SÍ

### 6. **Company Website Chatbot Agent (RAG, Calendar integrations).json** 🔄
- **Estado:** ACTUALIZADO (nuevo prompt + referencia a Calendar v4)
- **Acción:**
  1. Importar en n8n (reemplazará el actual)
  2. En el nodo "calendarAgent" (toolWorkflow):
     - Cambiar el `workflowId` de `"CALENDAR_AGENT_V4_WORKFLOW_ID"` al Workflow ID real que copiaste en el paso 3
  3. Verificar que las credenciales de OpenAI estén configuradas
  4. Activar
- **Activo:** SÍ

---

## 🗑️ Workflow a ELIMINAR

- ❌ **Calendar Agent Pro v3 (Corrected).json** - Ya lo eliminé del directorio, si lo tienes en n8n, desactívalo o bórralo

---

## 📋 Checklist de Importación en n8n

```
[ ] 1. Importar "Calendar Agent v4 (Quick Appointments).json"
    [ ] Configurar credenciales Google Calendar (3 nodos)
    [ ] Copiar Workflow ID: ____________________
    [ ] Activar workflow

[ ] 2. Importar "Confirm Appointment Webhook.json"
    [ ] Configurar credenciales Google Calendar (2 nodos)
    [ ] Copiar URL webhook: https://n8n.n8nsystems.info/webhook/_____________
    [ ] Activar workflow

[ ] 3. Actualizar src/pages/api/confirm-appointment.ts línea 23
    [ ] Reemplazar URL del webhook con la copiada arriba

[ ] 4. Verificar "Auto-Cancel Unconfirmed Appointments"
    [ ] Está activo: [ ]
    [ ] Schedule trigger configurado cada hora: [ ]

[ ] 5. Importar "Company Website Chatbot Agent (RAG, Calendar integrations).json"
    [ ] En nodo "calendarAgent": reemplazar workflowId con el del paso 1
    [ ] Verificar credenciales OpenAI
    [ ] Activar workflow

[ ] 6. Desactivar/eliminar "Calendar Agent Pro v3" en n8n (si existe)

[ ] 7. Deploy a Vercel
    [ ] git add .
    [ ] git commit -m "feat: Calendar Agent v4 with email confirmation"
    [ ] git push
    [ ] Verificar deploy exitoso en Vercel dashboard
```

---

## 🔗 URLs a Configurar

Después de importar los workflows, actualiza estas URLs:

### En tu código Vercel:
**Archivo:** `src/pages/api/confirm-appointment.ts` (línea 23)
```typescript
const n8nWebhookUrl = 'TU_URL_DEL_WEBHOOK_AQUI';
```

### En n8n Calendar Agent v4:
**Nodo:** "Send Confirmation Email"
**URL:** `https://aurin.mx/api/send-appointment-confirmation` ✅ (ya configurada)

---

## 🧪 Testing Rápido

Una vez todo importado y desplegado en Vercel:

1. **Test básico:** Abre tu chatbot y escribe "Quiero una cita rápida"
2. **Debe mostrar:** Horarios disponibles de la próxima semana
3. **Test validación:** Intenta agendar para mañana → debe rechazar (<24h)
4. **Test completo:** Agenda una cita >24h, verifica email, confirma, revisa Google Calendar

---

## 📞 Si algo falla

**Error en Calendar Agent v4:**
- Verifica credenciales de Google Calendar en los 3 nodos
- Revisa logs en n8n > Executions

**Email no llega:**
- Verifica `RESEND_API_KEY` en Vercel env vars
- Revisa logs en https://resend.com/emails

**Confirmación no funciona:**
- Verifica URL del webhook en `confirm-appointment.ts` línea 23
- Verifica que el workflow "Confirm Appointment Webhook" esté activo

---

## ✨ Estado Final

```
n8n Workflows (6 activos):
├── Company Website Chatbot Agent ✅ (actualizado)
├── RAG Agent ✅ (sin cambios)
├── Ticket Agent ✅ (sin cambios)
├── Calendar Agent v4 (Quick Appointments) 🆕 (nuevo)
├── Confirm Appointment Webhook 🆕 (nuevo)
└── Auto-Cancel Unconfirmed Appointments ✅ (verificar activo)
```

---

**¡Listo para importar y desplegar!** 🚀
