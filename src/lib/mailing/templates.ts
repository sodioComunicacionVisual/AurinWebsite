/**
 * Email HTML Templates
 * Centralized email templates for consistent branding
 */

import type { ContactFormData, TicketData } from './types';

export const contactEmailTemplate = (data: ContactFormData): string => {
  const attachmentSection = data.attachment
    ? `
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">📎 Archivo adjunto:</h3>
        <p>
          <a href="${data.attachment.url}"
             style="color: #D0DF00; text-decoration: none; font-weight: 600;"
             target="_blank">
            📥 Descargar: ${data.attachment.filename}
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
    ? `Servicio de interés: ${data.service}\n`
    : '';

  const subjectLine = data.subject && data.subject !== 'Consulta general'
    ? `Asunto: ${data.subject}\n`
    : '';

  const attachmentSection = data.fileUrl
    ? `\n📎 ARCHIVO ADJUNTO: ${data.fileUrl}\n`
    : '';

  return `Nuevo Ticket de Soporte - Chatbot Aurin

═══════════════════════════════════════════════════
📋 INFORMACIÓN DEL TICKET
═══════════════════════════════════════════════════

ID del Ticket: ${data.ticketId}
${subjectLine}Fecha y Hora: ${data.createdAt}
Origen: Chatbot Web (aurin.mx)

═══════════════════════════════════════════════════
👤 INFORMACIÓN DEL CLIENTE
═══════════════════════════════════════════════════

Nombre: ${data.name}
Email: ${data.email}
Empresa: ${data.company || 'No especificado'}
${serviceSection}
═══════════════════════════════════════════════════
📝 DESCRIPCIÓN DE LA SOLICITUD
═══════════════════════════════════════════════════

${data.description}${attachmentSection}
═══════════════════════════════════════════════════
📧 INFORMACIÓN DE CONTACTO
═══════════════════════════════════════════════════

Para más información:
📧 hey@aurin.mx
🌐 https://www.aurin.mx
📍 Aldea Creativa, México

═══════════════════════════════════════════════════

✨ Este ticket fue generado automáticamente por el chatbot de Aurin.
🤖 Sistema: n8n + OpenAI GPT-4o-mini
🔗 Workflow ID: Ticket Agent

═══════════════════════════════════════════════════`;
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
