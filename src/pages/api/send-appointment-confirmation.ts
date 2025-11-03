import type { APIRoute } from 'astro';
import { sendAppointmentConfirmation } from '../../lib/mailing/service';
import type { AppointmentData } from '../../lib/mailing/types';

export const prerender = false;

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400',
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
  };

  try {
    const body = await request.text();
    if (!body) {
      return new Response(
        JSON.stringify({ error: 'Cuerpo de la petición vacío' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const data = JSON.parse(body);
    const { name, email, appointmentDate, meetLink, eventId, calendarLink } = data;

    // Validación básica
    if (!name || !email || !appointmentDate || !meetLink || !eventId) {
      return new Response(
        JSON.stringify({
          error: 'Faltan campos requeridos: name, email, appointmentDate, meetLink, eventId'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Sending appointment confirmation email:', { name, email, eventId });

    // Prepare appointment data
    const appointmentData: AppointmentData = {
      name,
      email,
      appointmentDate,
      meetLink,
      eventId,
      calendarLink: calendarLink || meetLink,
    };

    // Send confirmation email
    const result = await sendAppointmentConfirmation(appointmentData);

    if (!result.success) {
      throw new Error(result.error || 'Failed to send confirmation email');
    }

    console.log('Appointment confirmation email sent successfully:', result.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Confirmation email sent successfully',
        emailId: result.id,
        eventId,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error sending appointment confirmation:', error);

    return new Response(
      JSON.stringify({
        error: 'Error al enviar confirmación de cita',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
