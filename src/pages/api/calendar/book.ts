/**
 * POST /api/calendar/book
 *
 * Creates a calendar event using GoogleCalendarService.
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
 *     calendarLink: string
 *   },
 *   message: string
 * }
 */

import type { APIRoute } from 'astro';
import type { PendingBooking, CustomerData } from '../../../lib/calendar/types';
import { GoogleCalendarService } from '../../../lib/calendar/googleCalendar';
import { sendAppointmentConfirmation, sendAppointmentNotificationToAdmin } from '../../../lib/mailing/service';

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

    console.log('📅 Creating appointment with GoogleCalendarService:', {
      name: customerData.name,
      email: customerData.email,
      start: pendingBooking.start,
    });

    // Create calendar event directly using GoogleCalendarService
    const calendarService = new GoogleCalendarService();

    const event = await calendarService.createEvent({
      summary: `Cita con ${customerData.name}`,
      description: `Motivo: ${customerData.reason || 'Consulta'}\nEmail: ${customerData.email}`,
      start: pendingBooking.start,
      end: pendingBooking.end,
      attendees: [customerData.email],
      customerName: customerData.name,
      customerEmail: customerData.email,
    });

    console.log('✅ Appointment created:', {
      eventId: event.id,
      calendarLink: event.htmlLink,
    });

    const appointmentData = {
      name: customerData.name,
      email: customerData.email,
      appointmentDate: pendingBooking.start,
      meetLink: '', // No Meet link with Service Account
      eventId: event.id,
      calendarLink: event.htmlLink || '',
      reason: customerData.reason,
    };

    // Send confirmation email to customer
    await sendAppointmentConfirmation(appointmentData);
    console.log('✅ Confirmation email sent to customer:', customerData.email);

    // Send notification to admin
    await sendAppointmentNotificationToAdmin(appointmentData);
    console.log('✅ Notification email sent to admin');

    return new Response(
      JSON.stringify({
        success: true,
        event: {
          id: event.id,
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
