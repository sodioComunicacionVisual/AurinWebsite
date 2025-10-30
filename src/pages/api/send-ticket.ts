import type { APIRoute } from 'astro';
import { sendTicketEmail } from '../../lib/mailing/service';
import { ticketConfirmationMessage } from '../../lib/mailing/templates';
import type { TicketData } from '../../lib/mailing/types';

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
  // CORS headers for all responses
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
    const { name, email, company, service, subject, description, ticketId, createdAt, fileUrl } = data;

    // Validación básica
    if (!name || !email || !description) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos: name, email, description' }),
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

    console.log('Creating ticket with data:', { name, email, company, service, subject, description, ticketId, fileUrl });

    // Prepare ticket data
    const ticketData: TicketData = {
      name,
      email,
      company: company || 'No especificado',
      service: service || 'No especificado',
      subject: subject || 'Consulta general',
      description,
      ticketId: ticketId || `AURIN-${Date.now()}`,
      createdAt: createdAt || new Date().toISOString(),
      fileUrl: fileUrl || undefined
    };

    // Send ticket email
    const result = await sendTicketEmail(ticketData);

    if (!result.success) {
      throw new Error(result.error || 'Failed to send ticket email');
    }

    console.log('Ticket email sent successfully:', result.id);

    // Generate confirmation message for the bot
    const confirmationMessage = ticketConfirmationMessage(ticketData);

    return new Response(
      JSON.stringify({
        success: true,
        output: confirmationMessage,
        ticketId: ticketData.ticketId,
        emailSent: true,
        emailId: result.id
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error creating ticket:', error);

    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    };

    return new Response(
      JSON.stringify({
        error: 'Error al crear el ticket',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
