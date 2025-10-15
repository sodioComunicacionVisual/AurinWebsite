/**
 * Email HTML Templates
 * Centralized email templates for consistent branding
 */

import type { ContactFormData, TicketData } from './types';

export const contactEmailTemplate = (data: ContactFormData): string => {
  const attachmentSection = data.attachment
    ? `
      <div style="background: #D0DF00; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">📎 Archivo adjunto:</h3>
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
    ? `<p><strong>Servicio de interés:</strong> ${data.service}</p>`
    : '';

  const subjectLine = data.subject && data.subject !== 'Consulta general'
    ? `<p><strong>Asunto:</strong> ${data.subject}</p>`
    : '';

  const attachmentSection = data.fileUrl
    ? `
      <div style="background: #D0DF00; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #D0DF00;">
        <h4 style="margin-top: 0; color: #333;">📎 Archivo adjunto:</h4>
        <p style="margin-bottom: 0;">
          <a href="${data.fileUrl}" 
             style="color:rgb(0, 0, 0); text-decoration: none; font-weight: 600; background: #333; padding: 8px 16px; border-radius: 4px; display: inline-block;"
             target="_blank">
            Ver archivo adjunto
          </a>
        </p>
      </div>
    `
    : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff;">
      
      <div style="background: linear-gradient(135deg, #D0DF00 0%, #a8b800 100%); padding: 30px; text-align: center;">
        <h1 style="color: #333; margin: 0; font-size: 24px;">Nuevo Ticket de Soporte</h1>
        <p style="color: #333; margin: 10px 0 0 0; font-size: 16px;">Chatbot Aurin</p>
      </div>

      <div style="padding: 30px;">
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #333; margin-top: 0; font-size: 18px; border-bottom: 2px solid #D0DF00; padding-bottom: 10px;">📋 Información del Ticket</h2>
          <p><strong>ID del Ticket:</strong> ${data.ticketId}</p>
          ${subjectLine}
          <p><strong>Fecha y Hora:</strong> ${new Date(data.createdAt || '').toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}</p>
          <p><strong>Origen:</strong> Chatbot Web (aurin.mx)</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #333; margin-top: 0; font-size: 18px; border-bottom: 2px solid #D0DF00; padding-bottom: 10px;">👤 Información del Cliente</h2>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #D0DF00; text-decoration: none;">${data.email}</a></p>
          <p><strong>Empresa:</strong> ${data.company || 'No especificado'}</p>
          ${serviceSection}
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #333; margin-top: 0; font-size: 18px; border-bottom: 2px solid #D0DF00; padding-bottom: 10px;">📝 Descripción de la Solicitud</h2>
          <div style="background: #fff; padding: 15px; border-radius: 6px; border-left: 4px solid #D0DF00;">
            <p style="line-height: 1.6; color: #555; margin: 0;">${data.description}</p>
          </div>
        </div>

        ${attachmentSection}

        <div style="background: #333; color: #fff; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="color:rgb(0, 0, 0); margin-top: 0;">Información de Contacto</h3>
          <p style="margin: 10px 0;">
            <strong>Email:</strong> <a href="mailto:hey@aurin.mx" style="color: #D0DF00; text-decoration: none;">hey@aurin.mx</a>
          </p>
          <p style="margin: 10px 0;">
            <strong>Web:</strong> <a href="https://www.aurin.mx" style="color: #D0DF00; text-decoration: none;" target="_blank">www.aurin.mx</a>
          </p>
          <p style="margin: 10px 0;"><strong>Ubicación:</strong> Aldea Creativa, México</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px; text-align: center;">
          <p>✨ Este ticket fue generado automáticamente por el chatbot de Aurin.</p>
          <p>🤖 Sistema: n8n + OpenAI GPT-4o-mini | 🔗 Workflow ID: Ticket Agent</p>
        </div>

      </div>
    </div>
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
