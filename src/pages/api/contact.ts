import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/mailing/service';
import type { ContactFormData } from '../../lib/mailing/types';

// reCAPTCHA verification function
async function verifyRecaptcha(token: string, remoteIp?: string): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY not configured');
    return { success: false, error: 'reCAPTCHA not configured' };
  }

  try {
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
      ...(remoteIp && { remoteip: remoteIp })
    });

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const result = await response.json();

    console.log('reCAPTCHA verification result:', {
      success: result.success,
      score: result.score,
      action: result.action,
      challenge_ts: result.challenge_ts
    });

    // For reCAPTCHA v3, check the score (0.0 to 1.0)
    // Scores closer to 1.0 indicate likely legitimate interaction
    // Typically, 0.5 is a good threshold
    if (result.success && result.score !== undefined) {
      if (result.score < 0.5) {
        return {
          success: false,
          score: result.score,
          error: `Low reCAPTCHA score: ${result.score}`
        };
      }
    }

    return {
      success: result.success,
      score: result.score,
      error: result['error-codes']?.join(', ')
    };
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.text();
    if (!body) {
      return new Response(
        JSON.stringify({ error: 'Cuerpo de la petición vacío' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = JSON.parse(body);
    const { nombre, correo, servicio, asunto, mensaje, fileUrl, filename, recaptchaToken } = data;

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

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return new Response(
        JSON.stringify({ error: 'Token de reCAPTCHA no proporcionado' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken, clientAddress);

    if (!recaptchaResult.success) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
      return new Response(
        JSON.stringify({
          error: 'Verificación de seguridad fallida',
          details: recaptchaResult.error
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('reCAPTCHA verified successfully with score:', recaptchaResult.score);
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
