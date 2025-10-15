import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/mailing/service';
import type { ContactFormData } from '../../lib/mailing/types';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    if (!body) {
      return new Response(
        JSON.stringify({ error: 'Cuerpo de la petición vacío' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = JSON.parse(body);
    const { nombre, correo, servicio, asunto, mensaje, fileUrl, filename } = data;

    // Validación básica
    if (!nombre || !correo || !servicio || !asunto || !mensaje) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Intentando enviar email con datos:', { nombre, correo, servicio, asunto, mensaje, fileUrl });

    // Prepare contact form data
    const contactData: ContactFormData = {
      nombre,
      correo,
      servicio,
      asunto,
      mensaje,
      attachment: fileUrl && filename ? { filename, url: fileUrl } : undefined
    };

    // Send email using centralized service
    const result = await sendContactEmail(contactData);

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email enviado exitosamente:', result.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email enviado correctamente',
        id: result.id
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error enviando email:', error);

    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
