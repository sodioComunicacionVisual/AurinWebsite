# 🚀 Plan de Migración - Calendar Agent v4

## 📊 Estado Actual vs Estado Final

### **ANTES (Estado Actual)**
```
n8n Workflows:
├── Ultimate Website Chatbot Agent ✅ (activo)
├── RAG Agent ✅ (activo)
├── Ticket Agent ✅ (activo)
├── Calendar Agent Pro v3 (Corrected) ⚠️ (activo pero desactualizado)
└── Auto-Cancel Unconfirmed Appointments ✅ (existe)
```

### **DESPUÉS (Estado Final)**
```
n8n Workflows:
├── Ultimate Website Chatbot Agent 🔄 (actualizar prompt + workflowId)
├── RAG Agent ✅ (sin cambios)
├── Ticket Agent ✅ (sin cambios - PROTEGIDO)
├── Calendar Agent v4 (Quick Appointments) 🆕 (NUEVO - reemplaza v3)
├── Confirm Appointment Webhook 🆕 (NUEVO)
└── Auto-Cancel Unconfirmed Appointments ✅ (revisar que esté activo)
```

---

## ⚠️ DECISIÓN CRÍTICA: Solo UN Calendar Agent

**Opción 1: Reemplazar v3 con v4 (RECOMENDADO)**
- Desactivar "Calendar Agent Pro v3"
- Importar "Calendar Agent v4 (Quick Appointments)"
- Actualizar el workflowId en Ultimate Chatbot Agent

**Opción 2: Actualizar v3 a v4 (Alternativa)**
- Editar manualmente "Calendar Agent Pro v3" con los cambios de v4
- No importar nuevo workflow

**🎯 Recomendación: Opción 1** - Más limpio, menos riesgo de errores

---

## 📋 Checklist de Migración

### **FASE 1: Preparación (Google Calendar)**
- [ ] Ir a Google Calendar
- [ ] **Opción A:** Usar calendario "primary" (más simple)
  - [ ] Configurar horario de trabajo: L-V 9-11am, 2-5pm (GMT-6)
  - [ ] Calendar ID = `"primary"`
- [ ] **Opción B:** Crear calendario dedicado (recomendado)
  - [ ] Crear nuevo calendario "Citas Rápidas Aurin"
  - [ ] Configurar zona horaria: GMT-6 Ciudad de México
  - [ ] Copiar Calendar ID (ej: `abc123@group.calendar.google.com`)
  - [ ] Guardar en .env: `GOOGLE_CALENDAR_ID=abc123@group.calendar.google.com`

### **FASE 2: Deploy del código Vercel**
- [ ] Verificar que las nuevas APIs están en el código:
  - [ ] `src/pages/api/send-appointment-confirmation.ts` ✅
  - [ ] `src/pages/api/confirm-appointment.ts` ✅
  - [ ] `src/lib/mailing/service.ts` (con nuevas funciones) ✅
  - [ ] `src/lib/mailing/templates.ts` (con nuevo template) ✅
  - [ ] `src/lib/mailing/types.ts` (con AppointmentData) ✅
- [ ] Commit y push a GitHub
- [ ] Esperar deploy automático en Vercel
- [ ] Verificar que las APIs responden:
  ```bash
  curl -X OPTIONS https://aurin.mx/api/send-appointment-confirmation
  # Debe retornar 204
  ```

### **FASE 3: Importar workflows en n8n**

#### **3.1 Importar "Confirm Appointment Webhook"**
1. [ ] En n8n: Menu > Workflows > Import
2. [ ] Seleccionar: `src/components/modules/chatbot/agents/Confirm Appointment Webhook.json`
3. [ ] Configurar credenciales de Google Calendar en el workflow
4. [ ] **IMPORTANTE:** Copiar la URL del webhook generada (ej: `https://n8n.n8nsystems.info/webhook/confirm-appointment`)
5. [ ] Pegar esta URL en `src/pages/api/confirm-appointment.ts` línea 23
6. [ ] Activar el workflow
7. [ ] Probar el webhook:
   ```bash
   curl -X POST https://n8n.n8nsystems.info/webhook/confirm-appointment \
     -H "Content-Type: application/json" \
     -d '{"eventId":"test123","email":"test@test.com","action":"confirm"}'
   ```

#### **3.2 Importar "Calendar Agent v4"**
1. [ ] En n8n: Menu > Workflows > Import
2. [ ] Seleccionar: `src/components/modules/chatbot/agents/Calendar Agent v4 (Quick Appointments).json`
3. [ ] Configurar credenciales de Google Calendar en TODOS los nodos que lo requieran:
   - [ ] "Get Events"
   - [ ] "Create Event"
   - [ ] "Delete Event"
4. [ ] Si usas calendario dedicado (no "primary"), actualizar el Calendar ID en cada nodo
5. [ ] Verificar que el nodo "Send Confirmation Email" apunta a `https://aurin.mx/api/send-appointment-confirmation`
6. [ ] Guardar workflow
7. [ ] **IMPORTANTE:** Copiar el Workflow ID (ej: `qjGXYKG8lfA6iKPx`)

#### **3.3 Actualizar "Ultimate Website Chatbot Agent"**
1. [ ] En n8n: Abrir "Company Website Chatbot Agent (RAG, Calendar integrations)"
2. [ ] Ir al nodo "Ultimate Website Chatbot Agent"
3. [ ] Click en "Options" > "System Message"
4. [ ] **REEMPLAZAR** el texto completo con este (copia exacta):

```text
You are Aurin's chatbot assistant. You route requests to tools - never answer directly.

TOOLS:
• RAGagent - FAQs about Aurin services, portfolio, expertise
• calendarAgent - SOLO para citas rápidas de 30 minutos (demos, consultas breves)
• ticketAgent - Para proyectos complejos, presupuestos, consultas profundas

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

5. [ ] Ir al nodo "calendarAgent" (toolWorkflow)
6. [ ] Actualizar el "Workflow ID" con el ID del Calendar Agent v4 copiado en el paso 3.2
7. [ ] Guardar cambios

#### **3.4 Desactivar Calendar Agent v3**
1. [ ] En n8n: Abrir "Calendar Agent Pro v3 (Corrected)"
2. [ ] Toggle "Active" a OFF
3. [ ] (Opcional) Renombrar a "[DEPRECATED] Calendar Agent Pro v3"

#### **3.5 Verificar Auto-Cancel Workflow**
1. [ ] En n8n: Abrir "Auto-Cancel Unconfirmed Appointments"
2. [ ] Verificar que el nodo "Schedule Trigger" está configurado para cada hora
3. [ ] Verificar credenciales de Google Calendar
4. [ ] Activar el workflow si está desactivado
5. [ ] Guardar

### **FASE 4: Testing End-to-End**

#### **Test 1: Flujo completo de cita exitosa**
```
1. Abrir chatbot en https://aurin.mx
2. Escribir: "Quiero una cita rápida"
3. Bot debe mostrar horarios disponibles
4. Escribir: "Jueves a las 3pm" (elegir fecha >24h en futuro)
5. Bot pide datos
6. Escribir: "Juan Pérez, juan@test.com, quiero consultar sobre branding"
7. Bot confirma reserva y menciona email
8. Verificar:
   - [ ] Email recibido en juan@test.com
   - [ ] Botón "CONFIRMAR MI CITA" funciona
   - [ ] Evento aparece en Google Calendar con [PENDIENTE CONFIRMACIÓN]
9. Click en botón del email
10. Verificar:
    - [ ] Redirect a /cita-confirmada
    - [ ] Evento actualizado a [CONFIRMADA] en Google Calendar
```

#### **Test 2: Validación +24h**
```
1. Chatbot: "Quiero cita mañana 10am"
2. Bot debe responder: "Solo aceptamos citas con al menos 24 horas de anticipación"
```

#### **Test 3: Horario ocupado**
```
1. Crear evento manual en Google Calendar para mañana +24h a las 3pm
2. Chatbot: "Quiero cita [ese día] a las 3pm"
3. Bot debe responder: "Ese horario ya está ocupado"
```

#### **Test 4: Auto-cancelación (requiere esperar 24h)**
```
1. Crear cita sin confirmar
2. Esperar 25 horas
3. Verificar que el cron ejecutó y eliminó el evento
4. Verificar logs en n8n > Executions > "Auto-Cancel..."
```

#### **Test 5: Ticket Agent sigue funcionando**
```
1. Chatbot: "Necesito un presupuesto completo para rediseño de sitio web"
2. Bot debe activar ticketAgent
3. Verificar que el flujo completo funciona sin cambios
```

### **FASE 5: Monitoreo Post-Deploy**

#### **Día 1-3 después del deploy**
- [ ] Revisar logs de n8n cada 6 horas
- [ ] Verificar que los emails se envían correctamente
- [ ] Monitorear errores en Vercel (Dashboard > Functions > Logs)
- [ ] Revisar que el auto-cancel ejecuta cada hora

#### **Día 4-7**
- [ ] Revisar métricas:
  - Citas creadas
  - Citas confirmadas
  - Citas auto-canceladas
  - Errores en APIs
- [ ] Ajustar horarios si es necesario

---

## 🔧 Configuración de URLs (Variables críticas)

### **En n8n workflows:**
| Workflow | Nodo | URL a configurar |
|----------|------|------------------|
| Calendar Agent v4 | "Send Confirmation Email" | `https://aurin.mx/api/send-appointment-confirmation` |

### **En Vercel código:**
| Archivo | Línea | URL a configurar |
|---------|-------|------------------|
| `src/pages/api/confirm-appointment.ts` | 23 | `https://n8n.n8nsystems.info/webhook/confirm-appointment` |

---

## ⚠️ Rollback Plan (Si algo falla)

### **Si el Calendar Agent v4 falla:**
```
1. Desactivar "Calendar Agent v4"
2. Reactivar "Calendar Agent Pro v3 (Corrected)"
3. Revertir el Workflow ID en Ultimate Chatbot Agent
4. Guardar y probar
```

### **Si el webhook de confirmación falla:**
```
1. Verificar URL del webhook en confirm-appointment.ts
2. Verificar credenciales de Google Calendar en n8n
3. Revisar logs en n8n > Executions
```

### **Si los emails no llegan:**
```
1. Verificar RESEND_API_KEY en Vercel env vars
2. Revisar logs en Resend Dashboard
3. Verificar que el from: "Aurin <onboarding@resend.dev>" está aprobado
```

---

## 📞 Soporte y Debugging

### **Logs importantes:**
- **Vercel:** https://vercel.com/your-project/functions
- **n8n:** Menu > Executions (filtrar por workflow)
- **Resend:** https://resend.com/emails

### **Endpoints para testing:**
```bash
# Test API de confirmación
curl -X POST https://aurin.mx/api/send-appointment-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test",
    "email":"test@test.com",
    "appointmentDate":"2025-11-08T15:00:00-06:00",
    "meetLink":"https://meet.google.com/test",
    "eventId":"test123",
    "calendarLink":"https://calendar.google.com"
  }'

# Test webhook de confirmación
curl -X POST https://n8n.n8nsystems.info/webhook/confirm-appointment \
  -H "Content-Type: application/json" \
  -d '{"eventId":"test123","email":"test@test.com","action":"confirm"}'
```

---

## ✅ Checklist Final

- [ ] Google Calendar configurado
- [ ] Código desplegado en Vercel
- [ ] APIs responden correctamente
- [ ] Confirm Webhook importado y activo
- [ ] Calendar Agent v4 importado con credenciales
- [ ] Ultimate Chatbot Agent actualizado (prompt + workflowId)
- [ ] Calendar Agent v3 desactivado
- [ ] Auto-Cancel activo
- [ ] Test 1: Flujo completo exitoso
- [ ] Test 2: Validación +24h funciona
- [ ] Test 3: Horario ocupado funciona
- [ ] Test 5: Ticket Agent sigue funcionando
- [ ] Monitoreo configurado

---

## 🎉 Próximos Pasos (Opcional)

### **Mejoras futuras:**
1. **Página /cita-confirmada personalizada**
   - Crear `src/pages/cita-confirmada.astro` con mensaje bonito
   - Agregar botón "Agregar a mi calendario"

2. **Dashboard de citas**
   - Ver todas las citas pendientes/confirmadas
   - Estadísticas de confirmación

3. **Recordatorios automáticos**
   - Email 1 hora antes de la cita
   - SMS via Twilio (opcional)

4. **Reprogramación de citas**
   - Permitir al usuario cambiar fecha/hora desde el email

---

**Última actualización:** 2025-11-03
**Autor:** Karen + Claude
**Versión:** 1.0
