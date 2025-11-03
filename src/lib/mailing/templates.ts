/**
 * Email HTML Templates
 * Centralized email templates for consistent branding
 */

import type { ContactFormData, TicketData } from './types';

export const contactEmailTemplate = (data: ContactFormData): string => {
  const attachmentSection = data.attachment
    ? `
      <div style="background: #D0DF00; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Archivo adjunto:</h3>
        <p>
          <a href="${data.attachment.url}"
             style="color:rgb(0, 0, 0); text-decoration: none; font-weight: 600;"
             target="_blank">
            Descargar: ${data.attachment.filename}
          </a>
        </p>
      </div>
    `
    : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #D0DF00;">Nuevo mensaje de contacto - Aurin</h2>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Información del contacto:</h3>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Correo:</strong> ${data.correo}</p>
        <p><strong>Servicio de interés:</strong> ${data.servicio}</p>
        <p><strong>Asunto:</strong> ${data.asunto}</p>
      </div>

      ${attachmentSection}

      <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #D0DF00;">
        <h3 style="margin-top: 0; color: #333;">Mensaje:</h3>
        <p style="line-height: 1.6; color: #555;">${data.mensaje}</p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
        <p>Este mensaje fue enviado desde el formulario de contacto de aurin.mx</p>
        <p>Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}</p>
      </div>
    </div>
  `;
};

export const ticketEmailTemplate = (data: TicketData): string => {
  const serviceSection = data.service && data.service !== 'No especificado'
    ? `
      <tr>
        <td style="padding: 8px 0; color: #000; font-family: Arial, sans-serif;">
          <strong>Servicio de interés:</strong> ${data.service}
        </td>
      </tr>
    `
    : '';

  const subjectLine = data.subject && data.subject !== 'Consulta general'
    ? `
      <tr>
        <td style="padding: 8px 0; color: #000; font-family: Arial, sans-serif;">
          <strong>Asunto:</strong> ${data.subject}
        </td>
      </tr>
    `
    : '';

  const attachmentSection = data.fileUrl
    ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
        <tr>
          <td style="padding: 15px; border-left: 4px solid #D0DF00; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color: #000; font-size: 16px; font-weight: bold; padding-bottom: 10px;">
                  Archivo adjunto:
                </td>
              </tr>
              <tr>
                <td>
                  <a href="${data.fileUrl}" 
                     style="color: #000; text-decoration: none; font-weight: 600; background: #D0DF00; padding: 12px 20px; display: inline-block; border-radius: 4px;"
                     target="_blank">
                    Ver archivo adjunto
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    : '';

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; margin: 0 auto; background: #ffffff; font-family: Arial, sans-serif;">
      
      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #D0DF00 0%, #a8b800 100%); padding: 30px; text-align: center;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color: #000; font-size: 24px; font-weight: bold; padding-bottom: 10px;">
                Nuevo Ticket de Soporte
              </td>
            </tr>
            <tr>
              <td style="color: #000; font-size: 16px;">
                Chatbot Aurin
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding: 30px;">
          
          <!-- Ticket Information -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; margin-bottom: 25px;">
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #000; font-size: 18px; font-weight: bold; padding-bottom: 10px; border-bottom: 2px solid #D0DF00;">
                      Información del Ticket
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #000;">
                      <strong>ID del Ticket:</strong> ${data.ticketId}
                    </td>
                  </tr>
                  ${subjectLine}
                  <tr>
                    <td style="padding: 8px 0; color: #000;">
                      <strong>Fecha y Hora:</strong> ${new Date(data.createdAt || '').toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #000;">
                      <strong>Origen:</strong> Chatbot Web (aurin.mx)
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Client Information -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; margin-bottom: 25px;">
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #000; font-size: 18px; font-weight: bold; padding-bottom: 10px; border-bottom: 2px solid #D0DF00;">
                      Información del Cliente
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #000;">
                      <strong>Nombre:</strong> ${data.name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #000;">
                      <strong>Email:</strong> <a href="mailto:${data.email}" style="color: #D0DF00; text-decoration: none;">${data.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #000;">
                      <strong>Empresa:</strong> ${data.company || 'No especificado'}
                    </td>
                  </tr>
                  ${serviceSection}
                </table>
              </td>
            </tr>
          </table>

          <!-- Description -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; margin-bottom: 25px;">
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #000; font-size: 18px; font-weight: bold; padding-bottom: 10px; border-bottom: 2px solid #D0DF00;">
                      Descripción de la Solicitud
                    </td>
                  </tr>
                  <tr>
                    <td style="background: #fff; padding: 15px; border-left: 4px solid #D0DF00;">
                      <p style="line-height: 1.6; color: #000; margin: 0; font-family: Arial, sans-serif;">
                        ${data.description}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Attachment -->
          ${attachmentSection}

          <!-- Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; border-top: 1px solid #eee;">
            <tr>
              <td style="padding-top: 20px; text-align: center; color: #000; font-size: 12px;">
                <p style="margin: 5px 0;">Este ticket fue generado automáticamente por el chatbot de Aurin.</p>
                <p style="margin: 5px 0;">Sistema: n8n + OpenAI GPT-4o-mini | Workflow ID: Ticket Agent</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  `;
};

export const ticketConfirmationMessage = (data: TicketData): string => {
  return `✅ **Perfecto, ${data.name}!**

He creado un ticket de soporte y nuestro equipo te contactará a **${data.email}** muy pronto.

**📋 Detalles de tu ticket:**
- Número de ticket: **${data.ticketId}**
- Estado: En proceso
- Tiempo estimado de respuesta: 24 horas

**📧 Email de contacto:** [hey@aurin.mx](mailto:hey@aurin.mx)

Nos pondremos en contacto contigo dentro de las próximas 24 horas para atender tu solicitud personalmente.

¿Hay algo más en lo que pueda ayudarte mientras tanto?`;
};

export const appointmentCancellationEmail = (data: CancellationData): string => {
  const appointmentDateTime = new Date(data.appointmentDate).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const reasonText = data.reason === 'not_confirmed'
    ? 'No confirmaste tu cita dentro del período de 24 horas requerido.'
    : 'Recibimos tu solicitud de cancelación.';

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; font-family: Arial, sans-serif;">

      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #666 0%, #444 100%); padding: 30px; text-align: center;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color: #fff; font-size: 24px; font-weight: bold; padding-bottom: 10px;">
                Cita cancelada
              </td>
            </tr>
            <tr>
              <td style="color: #fff; font-size: 16px;">
                Aurin - Sistema de Citas
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding: 30px;">

          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
            Hola <strong>${data.name}</strong>,
          </p>

          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 30px;">
            Lamentamos informarte que tu cita con Aurin ha sido cancelada.
          </p>

          <!-- Appointment Details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; margin-bottom: 25px;">
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #000; font-size: 18px; font-weight: bold; padding-bottom: 15px; border-bottom: 2px solid #D0DF00;">
                      Detalles de la cita cancelada
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #000;">
                      <strong>📅 Fecha y hora:</strong> ${appointmentDateTime}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #000;">
                      <strong>❌ Motivo:</strong> ${reasonText}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Reschedule CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff3cd; border-left: 4px solid #ffc107; margin-bottom: 25px;">
            <tr>
              <td style="padding: 20px;">
                <p style="margin: 0; color: #856404; font-weight: bold; font-size: 16px;">
                  ¿Quieres agendar una nueva cita?
                </p>
                <p style="margin: 10px 0 0 0; color: #856404; line-height: 1.6;">
                  Puedes contactarnos directamente en <a href="mailto:hey@aurin.mx" style="color: #856404; text-decoration: underline;">hey@aurin.mx</a> o agendar una nueva cita a través de nuestro chatbot en <a href="https://aurin.mx" style="color: #856404; text-decoration: underline;">aurin.mx</a>
                </p>
              </td>
            </tr>
          </table>

          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px;">
            Si tienes alguna pregunta, no dudes en contactarnos en <a href="mailto:hey@aurin.mx" style="color: #D0DF00; text-decoration: none;">hey@aurin.mx</a>
          </p>

          <!-- Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; border-top: 1px solid #eee;">
            <tr>
              <td style="padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
                <p style="margin: 5px 0;">Este email fue enviado automáticamente por el sistema de citas de Aurin.</p>
                <p style="margin: 5px 0;">© ${new Date().getFullYear()} Aurin. Todos los derechos reservados.</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  `;
};

export const appointmentConfirmationEmail = (
  data: AppointmentData,
  confirmUrl: string
): string => {
  const appointmentDateTime = new Date(data.appointmentDate).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; font-family: Arial, sans-serif;">

      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #D0DF00 0%, #a8b800 100%); padding: 30px; text-align: center;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color: #000; font-size: 24px; font-weight: bold; padding-bottom: 10px;">
                ¡Tu cita está reservada!
              </td>
            </tr>
            <tr>
              <td style="color: #000; font-size: 16px;">
                Aurin - Citas Rápidas
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding: 30px;">

          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
            Hola <strong>${data.name}</strong>,
          </p>

          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 30px;">
            Tu cita con Aurin ha sido reservada exitosamente. Para confirmarla y asegurar tu lugar, haz clic en el botón de abajo.
          </p>

          <!-- Appointment Details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; margin-bottom: 25px;">
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #000; font-size: 18px; font-weight: bold; padding-bottom: 15px; border-bottom: 2px solid #D0DF00;">
                      Detalles de tu cita
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #000;">
                      <strong>📅 Fecha y hora:</strong> ${appointmentDateTime}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #000;">
                      <strong>⏱️ Duración:</strong> 30 minutos
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #000;">
                      <strong>🎥 Enlace de reunión:</strong> <a href="${data.meetLink}" style="color: #D0DF00; text-decoration: none;">${data.meetLink}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Important Notice -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff3cd; border-left: 4px solid #ffc107; margin-bottom: 25px;">
            <tr>
              <td style="padding: 20px;">
                <p style="margin: 0; color: #856404; font-weight: bold; font-size: 16px;">
                  ⚠️ IMPORTANTE
                </p>
                <p style="margin: 10px 0 0 0; color: #856404; line-height: 1.6;">
                  Tienes <strong>24 horas</strong> para confirmar tu cita. Si no la confirmas, será cancelada automáticamente para liberar el espacio.
                </p>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
            <tr>
              <td align="center">
                <a href="${confirmUrl}"
                   style="background: #D0DF00; color: #000; text-decoration: none; font-weight: bold; font-size: 18px; padding: 16px 40px; display: inline-block; border-radius: 8px;">
                  ✓ CONFIRMAR MI CITA
                </a>
              </td>
            </tr>
          </table>

          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px;">
            Si tienes alguna pregunta o necesitas reprogramar, responde a este email o contáctanos en <a href="mailto:hey@aurin.mx" style="color: #D0DF00; text-decoration: none;">hey@aurin.mx</a>
          </p>

          <!-- Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; border-top: 1px solid #eee;">
            <tr>
              <td style="padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
                <p style="margin: 5px 0;">Este email fue enviado automáticamente por el sistema de citas de Aurin.</p>
                <p style="margin: 5px 0;">© ${new Date().getFullYear()} Aurin. Todos los derechos reservados.</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  `;
};
