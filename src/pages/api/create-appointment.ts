import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { customerName, customerEmail, eventStart, eventEnd, reason } = await request.json();

    // Aquí iría la lógica para crear el evento en Google Calendar
    // Por ahora solo retornamos éxito simulado

    console.log('📅 Creating appointment:', {
      customerName,
      customerEmail,
      eventStart,
      eventEnd,
      reason
    });

    // En producción, aquí llamarías a Google Calendar API
    // y luego enviarías el email de confirmación

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Appointment created successfully',
        eventId: `evt_${Date.now()}`,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error creating appointment:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to create appointment'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
