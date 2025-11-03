import type { APIRoute } from 'astro';
import { validateAppointmentToken } from '../../lib/mailing/service';

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response('Token no proporcionado', { status: 400 });
    }

    // Validate token
    const { valid, eventId, email } = validateAppointmentToken(token);

    if (!valid || !eventId || !email) {
      return new Response(
        'Token inválido o expirado. Por favor, contacta a hey@aurin.mx para asistencia.',
        { status: 400 }
      );
    }

    console.log('Confirming appointment:', { eventId, email });

    // Call n8n webhook to update Google Calendar event
    // IMPORTANTE: Actualizar esta URL después de importar el webhook en n8n
    const n8nWebhookUrl = 'https://n8n.n8nsystems.info/webhook/confirm-appointment';

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, email, action: 'confirm' }),
    });

    if (!n8nResponse.ok) {
      throw new Error('Error al confirmar cita en Google Calendar');
    }

    console.log('Appointment confirmed successfully:', eventId);

    // Redirect to confirmation page
    return Response.redirect('https://aurin.mx/cita-confirmada', 302);

  } catch (error) {
    console.error('Error confirming appointment:', error);

    return new Response(
      `Error al confirmar la cita: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, contacta a hey@aurin.mx`,
      { status: 500 }
    );
  }
};
