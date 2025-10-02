import type { APIRoute } from 'astro';
import { Resend } from 'resend';

console.log('API Key disponible:', !!import.meta.env.RESEND_API_KEY);
console.log('API Key (primeros 10 caracteres):', import.meta.env.RESEND_API_KEY?.substring(0, 10));

const resend = new Resend(import.meta.env.RESEND_API_KEY);

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
    const { nombre, correo, servicio, asunto, mensaje } = data;

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

    console.log('Intentando enviar email con datos:', { nombre, correo, servicio, asunto, mensaje });
    
    // Enviar email con Resend - usando el formato correcto según la documentación
    const emailData = await resend.emails.send({
      from: 'Aurin <onboarding@resend.dev>',
      to: ['sodioanalytics@gmail.com'],
      subject: `${asunto} - ${nombre}`,
      replyTo: correo,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D0DF00;">Nuevo mensaje de contacto - Aurin</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Información del contacto:</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Correo:</strong> ${correo}</p>
            <p><strong>Servicio de interés:</strong> ${servicio}</p>
            <p><strong>Asunto:</strong> ${asunto}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #D0DF00;">
            <h3 style="margin-top: 0; color: #333;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #555;">${mensaje}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto de aurin.com</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}</p>
          </div>
        </div>
      `,
    });

    console.log('Email enviado exitosamente:', emailData);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado correctamente',
        id: emailData.data?.id,
        emailData: emailData
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
