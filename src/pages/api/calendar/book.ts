/**
 * POST /api/calendar/book
 *
 * Creates a calendar event via n8n webhook (with OAuth and Google Meet support).
 * Requires a pending booking and customer details.
 *
 * @body {
 *   pendingBooking: {
 *     start: string,  // ISO datetime
 *     end: string     // ISO datetime
 *   },
 *   customerData: {
 *     name: string,
 *     email: string,
 *     reason: string
 *   }
 * }
 *
 * @returns {
 *   success: boolean,
 *   event: {
 *     id: string,
 *     meetLink: string,
 *     calendarLink: string
 *   },
 *   message: string
 * }
 *
 * @example
 * POST /api/calendar/book
 * Body: {
 *   "pendingBooking": {
 *     "start": "2025-11-07T11:00:00-06:00",
 *     "end": "2025-11-07T11:30:00-06:00"
 *   },
 *   "customerData": {
 *     "name": "Juan Pérez",
 *     "email": "juan@example.com",
 *     "reason": "Demo"
 *   }
 * }
 * Response:
 * {
 *   "success": true,
 *   "event": {
 *     "id": "evt123",
 *     "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
 *     "calendarLink": "https://calendar.google.com/..."
 *   },
 *   "message": "Cita creada exitosamente"
 * }
 */

import type { APIRoute } from 'astro';
import type { PendingBooking, CustomerData } from '../../../lib/calendar/types';

export const prerender = false;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

// n8n webhook URL for creating calendar events (with OAuth & Google Meet)
const N8N_CREATE_APPOINTMENT_WEBHOOK = 'https://n8nsystems.info/webhook/create-appointment';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { pendingBooking, customerData } = await request.json() as {
      pendingBooking: PendingBooking;
      customerData: CustomerData;
    };

    // Validate input
    if (!pendingBooking?.start || !pendingBooking?.end) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing pending booking information',
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!customerData?.name || !customerData?.email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing customer information (name or email)',
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('📅 Creating appointment via n8n webhook:', {
      name: customerData.name,
      email: customerData.email,
      start: pendingBooking.start,
    });

    // Call n8n webhook to create calendar event with OAuth (supports Google Meet)
    const n8nResponse = await fetch(N8N_CREATE_APPOINTMENT_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: customerData.name,
        customerEmail: customerData.email,
        eventStart: pendingBooking.start,
        eventEnd: pendingBooking.end,
        reason: customerData.reason || 'Consulta',
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('❌ n8n webhook error:', n8nResponse.status, errorText);
      throw new Error(`Failed to create appointment: ${n8nResponse.status}`);
    }

    const n8nData = await n8nResponse.json();

    console.log('✅ Appointment created:', {
      eventId: n8nData.eventId,
      meetLink: n8nData.meetLink,
      emailSent: n8nData.emailSent,
    });

    // n8n webhook already sends confirmation email, just return success
    return new Response(
      JSON.stringify({
        success: true,
        event: {
          id: n8nData.eventId,
          meetLink: n8nData.meetLink || '',
          calendarLink: n8nData.calendarLink || '',
        },
        message: n8nData.message || 'Cita creada exitosamente',
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Error creating booking:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};
