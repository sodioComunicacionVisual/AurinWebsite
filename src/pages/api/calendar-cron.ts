import type { APIRoute } from 'astro';
import { GoogleCalendarService } from '../../lib/calendar/googleCalendar';
import { sendAppointmentCancellation } from '../../lib/mailing/service';

export const prerender = false;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

/**
 * Endpoint for n8n cron to check and cancel unconfirmed appointments
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { action } = await request.json();

    if (action === 'cancelUnconfirmed') {
      const calendarService = new GoogleCalendarService();

      // Get events from now to 30 days ahead
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const events = await calendarService.getEvents(startDate, endDate);

      const unconfirmedEvents = [];
      const now = Date.now();

      // Filter unconfirmed events older than 24h
      for (const event of events) {
        // Check if event has extendedProperties indicating it's unconfirmed
        const createdAt = event.createdAt;
        const confirmed = event.confirmed;

        if (confirmed === 'false' && createdAt) {
          const ageHours = (now - new Date(createdAt).getTime()) / (1000 * 60 * 60);

          if (ageHours >= 24) {
            unconfirmedEvents.push({
              eventId: event.id,
              customerName: event.customerName,
              customerEmail: event.customerEmail,
              start: event.start,
              ageHours: ageHours.toFixed(1)
            });
          }
        }
      }

      console.log(`Found ${unconfirmedEvents.length} unconfirmed events to cancel`);

      // Cancel each event
      const results = [];
      for (const event of unconfirmedEvents) {
        try {
          await calendarService.deleteEvent(event.eventId);

          // Send cancellation email
          await sendAppointmentCancellation({
            name: event.customerName,
            email: event.customerEmail,
            appointmentDate: event.start,
            reason: 'not_confirmed'
          });

          results.push({
            eventId: event.eventId,
            success: true,
            cancelled: true
          });

          console.log(`✅ Cancelled event ${event.eventId}`);
        } catch (error) {
          console.error(`❌ Error cancelling event ${event.eventId}:`, error);
          results.push({
            eventId: event.eventId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return new Response(JSON.stringify({
        success: true,
        cancelled: unconfirmedEvents.length,
        results
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid action'
    }), {
      status: 400,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Calendar cron error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};
