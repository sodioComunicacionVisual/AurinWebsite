import type { APIRoute } from 'astro';
import { sendAppointmentCancellation } from '../../lib/mailing/service';
import type { CancellationData } from '../../lib/mailing/types';

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
    const { name, email, appointmentDate, reason } = data;

    // Validación básica
    if (!name || !email || !appointmentDate) {
      return new Response(
        JSON.stringify({
          error: 'Faltan campos requeridos: name, email, appointmentDate'
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

    // Validación de reason
    const validReasons = ['not_confirmed', 'user_requested'];
    const cancellationReason = validReasons.includes(reason) ? reason : 'not_confirmed';

    console.log('Sending cancellation email:', { name, email, appointmentDate, reason: cancellationReason });

    // Prepare cancellation data
    const cancellationData: CancellationData = {
      name,
      email,
      appointmentDate,
      reason: cancellationReason,
    };

    // Send cancellation email
    const result = await sendAppointmentCancellation(cancellationData);

    if (!result.success) {
      throw new Error(result.error || 'Failed to send cancellation email');
    }

    console.log('Cancellation email sent successfully:', result.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cancellation email sent successfully',
        emailId: result.id,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error sending cancellation email:', error);

    return new Response(
      JSON.stringify({
        error: 'Error al enviar email de cancelación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
