import type { APIRoute } from 'astro';
import { GoogleCalendarService } from '../../lib/calendar/googleCalendar';
import { sendAppointmentConfirmation } from '../../lib/mailing/service';

export const prerender = false;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('📥 Calendar API received:', JSON.stringify(body));

    const { action, ...data } = body;

    const calendarService = new GoogleCalendarService();

    // GET AVAILABILITY
    if (action === 'getAvailability') {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const events = await calendarService.getEvents(startDate, endDate);

      const allowedTimes = ['11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];
      const availability = [];

      for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        const dateStr = d.toISOString().split('T')[0];

        const busySlots = events
          .filter(e => e.start.startsWith(dateStr))
          .map(e => ({
            start: new Date(new Date(e.start).getTime() - 15*60*1000),
            end: new Date(new Date(e.end).getTime() + 15*60*1000)
          }));

        const available = allowedTimes.filter(time => {
          const slotStart = new Date(`${dateStr}T${time}:00-06:00`);
          const slotEnd = new Date(slotStart.getTime() + 30*60*1000);
          return !busySlots.some(b => slotStart < b.end && slotEnd > b.start);
        });

        if (available.length > 0) {
          availability.push({
            date: dateStr,
            dayName: d.toLocaleDateString('es-MX', { weekday: 'long' }),
            dayNumber: d.getDate(),
            slots: available
          });
        }
      }

      return new Response(JSON.stringify({ success: true, availability }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // CREATE APPOINTMENT
    if (action === 'createAppointment') {
      const { customerName, customerEmail, start, end, reason } = data;

      if (!customerName || !customerEmail || !start || !end) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Create event in Google Calendar
      const event = await calendarService.createEvent({
        summary: `Cita con ${customerName}`,
        description: `Motivo: ${reason || 'Consulta'}\nEmail: ${customerEmail}`,
        start,
        end,
        attendees: [customerEmail],
        customerName,
        customerEmail,
      });

      // Send confirmation email
      await sendAppointmentConfirmation({
        name: customerName,
        email: customerEmail,
        appointmentDate: start,
        meetLink: event.hangoutLink || event.htmlLink || '',
        eventId: event.id,
        calendarLink: event.htmlLink || '',
      });

      return new Response(JSON.stringify({
        success: true,
        event: {
          id: event.id,
          meetLink: event.hangoutLink,
          calendarLink: event.htmlLink,
        }
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    console.log('❌ Invalid action:', action);
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid action',
      receivedAction: action,
      receivedData: data
    }), {
      status: 400,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Calendar API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};
