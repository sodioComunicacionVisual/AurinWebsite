# Calendar Booking System - API Documentation

## Architecture Overview

The calendar booking system uses a **client-side intent detection** architecture where the frontend (ChatbotWidget) detects calendar-related intents and calls specialized APIs directly, bypassing n8n for calendar operations.

```
┌─────────────┐
│   Frontend  │  (ChatbotWidget.tsx)
│  ────────── │
│  Intent     │  Detects calendar intents from user messages
│  Detection  │  and bot responses
└──────┬──────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      ▼
┌─────────────┐                      ┌─────────────┐
│  Calendar   │                      │   n8n Bot   │
│    APIs     │                      │  (General)  │
│             │                      │             │
│ - /availability                    │ - FAQs      │
│ - /select-time                     │ - Tickets   │
│ - /book                            │ - General   │
└─────────────┘                      └─────────────┘
```

## Benefits of This Architecture

1. **Reliable State Management** - Frontend controls booking state, no dependency on LLM tool calling
2. **Faster Response** - Direct API calls, no LLM round-trip for calendar operations
3. **Better UX** - Consistent calendar responses, not subject to LLM variability
4. **Cost Effective** - Reduces LLM API calls by handling calendar logic client-side
5. **Maintainable** - Calendar logic isolated from conversation logic

---

## API Endpoints

### 1. GET `/api/calendar/availability`

Returns available time slots for the next 7 business days.

**Request:**
```http
GET /api/calendar/availability
```

**Response:**
```json
{
  "success": true,
  "availability": [
    {
      "date": "2025-11-07",
      "dayName": "jueves",
      "dayNumber": 7,
      "slots": ["11:00", "11:30", "12:00", "12:30", "13:00"]
    }
  ]
}
```

**Business Rules:**
- Only weekdays (Monday-Friday)
- Hours: 11:00 AM - 5:30 PM (Mexico City time)
- 30-minute appointment slots
- 15-minute buffer between appointments
- Minimum 24 hours advance booking

---

### 2. POST `/api/calendar/select-time`

Validates and reserves a specific time slot.

**Request:**
```json
{
  "dayName": "jueves",
  "time": "11:00"
}
```

**Response:**
```json
{
  "success": true,
  "pendingBooking": {
    "start": "2025-11-07T11:00:00-06:00",
    "end": "2025-11-07T11:30:00-06:00",
    "dateFormatted": "Jueves 7 de noviembre",
    "timeFormatted": "11:00 AM"
  },
  "message": "Horario reservado temporalmente"
}
```

**Validation:**
- Day name must be valid Spanish weekday
- Time must be within business hours
- Date must be at least 24 hours in the future
- Slot must not conflict with existing events

---

### 3. POST `/api/calendar/book`

Creates calendar event and sends confirmation email.

**Request:**
```json
{
  "pendingBooking": {
    "start": "2025-11-07T11:00:00-06:00",
    "end": "2025-11-07T11:30:00-06:00"
  },
  "customerData": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "reason": "Demo"
  }
}
```

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "evt_abc123",
    "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
    "calendarLink": "https://calendar.google.com/event?eid=..."
  },
  "message": "Cita creada exitosamente"
}
```

**Actions Performed:**
1. Creates event in Google Calendar with Google Meet link
2. Sends confirmation email to customer
3. Sets event as "unconfirmed" (pending email confirmation)
4. Event will auto-cancel in 24h if not confirmed

---

## Frontend Integration

### Intent Detection Flow

```typescript
// 1. User sends message
const message = "Jueves a las 11 AM"

// 2. Frontend detects calendar intent
const intent = detectIntent(message, hasPendingBooking)
// Returns: { intent: 'select_time', extractedData: { dayName: 'jueves', time: '11:00' } }

// 3. Frontend calls appropriate API
const response = await fetch('/api/calendar/select-time', {
  method: 'POST',
  body: JSON.stringify({ dayName: 'jueves', time: '11:00' })
})

// 4. Update local state with pendingBooking
setPendingBooking(response.pendingBooking)
```

### State Management

The frontend maintains booking state in localStorage:

```typescript
interface CalendarMetadata {
  pendingBooking: PendingBooking | null;  // Selected time slot
  customerEmail: string;                   // Customer email
  customerData: CustomerData | null;       // Full customer info
}
```

**State Lifecycle:**
1. **Initial**: All null
2. **Time Selected**: `pendingBooking` populated
3. **Details Provided**: `customerData` populated
4. **Booking Complete**: All cleared back to null

---

## Conversation Flow Example

```
User: "Hola, quiero agendar una cita"
  ↓ [Bot detects appointment request keyword]
  ↓ [Frontend calls /api/calendar/availability]
Bot: "📅 Horarios disponibles:
     Jueves 7: 11:00, 11:30, 12:00...
     💡 ¿Qué día y hora prefieres?"

User: "Jueves a las 11 AM"
  ↓ [Frontend detects time selection]
  ↓ [Calls /api/calendar/select-time]
  ↓ [Saves pendingBooking to state]
Bot: "✅ Cita para el Jueves 7 de noviembre a las 11:00 AM
     Para confirmar necesito:
     1. Nombre completo
     2. Email
     3. Motivo"

User: "Juan Pérez, juan@example.com, quiero una demo"
  ↓ [Frontend detects customer data format]
  ↓ [Calls /api/calendar/book with pendingBooking + customerData]
  ↓ [Creates Google Calendar event]
  ↓ [Sends confirmation email]
  ↓ [Clears state]
Bot: "✅ ¡Cita agendada!
     📧 Recibirás un email de confirmación.
     🔗 Link de Meet: https://meet.google.com/..."
```

---

## Code Structure

```
src/
├── lib/
│   ├── calendar/
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── utils.ts              # Date/time utilities
│   │   ├── intentDetector.ts    # Pattern matching (server)
│   │   └── googleCalendar.ts    # Google Calendar service
│   │
│   └── chatbot/
│       └── calendarIntentHandler.ts  # Intent detection (client)
│
├── pages/api/
│   └── calendar/
│       ├── availability.ts       # GET /api/calendar/availability
│       ├── select-time.ts        # POST /api/calendar/select-time
│       └── book.ts               # POST /api/calendar/book
│
└── components/modules/chatbot/
    └── ChatbotWidget.tsx         # Frontend with intent handling
```

---

## Testing

### Manual Testing Checklist

**1. Availability Request**
```
User: "Hola, quiero agendar una cita"
Expected: Bot shows available time slots
```

**2. Time Selection**
```
User: "Jueves a las 11 AM"
Expected: Bot confirms time and requests user details
Check: localStorage has pendingBooking
```

**3. Provide Details**
```
User: "Juan Pérez, juan@example.com, quiero una demo"
Expected: Bot confirms booking, sends email
Check: Google Calendar has event
Check: Email sent to customer
Check: localStorage cleared
```

**4. Invalid Time**
```
User: "Sábado a las 10 PM"
Expected: Error - invalid day or time outside hours
```

**5. Past Date**
```
User: "Ayer a las 2 PM"
Expected: Error - must be 24h in advance
```

---

## Deployment

### Environment Variables Required

```bash
# Google Calendar
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Email Service (Resend)
RESEND_API_KEY=re_...

# n8n (for general chatbot)
N8N_WEBHOOK_URL=https://n8nsystems.info/webhook/chatbot
```

### Build & Deploy

```bash
# Install dependencies
npm install

# Build
npm run build

# Deploy to Vercel
vercel --prod
```

---

## DRY Principles Applied

1. **Single Source of Truth**: All date/time logic in `utils.ts`
2. **Reusable Functions**: Shared utilities across all APIs
3. **Type Safety**: Centralized types in `types.ts`
4. **No Duplication**: Each API has <4 conditionals, complex logic extracted to utilities
5. **Clear Separation**: Intent detection separate from business logic

---

## Troubleshooting

### "No availability found"
- Check Google Calendar API credentials
- Verify calendar has no events blocking all slots
- Check timezone settings (should be America/Mexico_City)

### "Booking fails with 500"
- Check Google Service Account has calendar write permissions
- Verify Resend API key is valid
- Check event doesn't conflict with existing event

### "PendingBooking not persisting"
- Check browser localStorage is enabled
- Verify no console errors in DevTools
- Check state is being set correctly in React

---

## Future Improvements

1. **Cancellation Flow**: Add `/api/calendar/cancel` endpoint
2. **Reschedule**: Allow users to change their booking
3. **Multiple Duration Options**: Support 15min, 30min, 1h appointments
4. **Timezone Selection**: Allow users to book in their timezone
5. **Recurring Appointments**: Support weekly/monthly bookings

---

**Last Updated**: November 6, 2025
**Version**: 1.0.0
