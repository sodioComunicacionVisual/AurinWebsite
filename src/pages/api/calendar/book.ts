/**
 * POST /api/calendar/book
 *
 * Creates a calendar event and sends confirmation email.
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
 *     "meetLink": "https://meet.google.com/...",
 *     "calendarLink": "https://calendar.google.com/..."
 *   },
 *   "message": "Cita creada exitosamente"
 * }
 */

import type { APIRoute } from 'astro';
import { GoogleCalendarService } from '../../../lib/calendar/googleCalendar';
import { sendAppointmentConfirmation } from '../../../lib/mailing/service';
import type { PendingBooking, CustomerData } from '../../../lib/calendar/types';

export const prerender = false;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

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

    const calendarService = new GoogleCalendarService();

    // Create event in Google Calendar
    const event = await calendarService.createEvent({
      summary: `Cita con ${customerData.name}`,
      description: `Motivo: ${customerData.reason || 'Consulta'}\nEmail: ${customerData.email}`,
      start: pendingBooking.start,
      end: pendingBooking.end,
      attendees: [customerData.email],
      customerName: customerData.name,
      customerEmail: customerData.email,
    });

    // Send confirmation email
    await sendAppointmentConfirmation({
      name: customerData.name,
      email: customerData.email,
      appointmentDate: pendingBooking.start,
      meetLink: event.hangoutLink || event.htmlLink || '',
      eventId: event.id,
      calendarLink: event.htmlLink || '',
    });

    return new Response(
      JSON.stringify({
        success: true,
        event: {
          id: event.id,
          meetLink: event.hangoutLink || '',
          calendarLink: event.htmlLink || '',
        },
        message: 'Cita creada exitosamente',
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
