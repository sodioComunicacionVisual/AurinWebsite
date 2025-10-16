/**
 * Mailing Service
 * Centralized email using Resend
 */

import { Resend } from 'resend';
import type { ContactFormData, TicketData, EmailResponse } from './types';
import { contactEmailTemplate, ticketEmailTemplate } from './templates';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

/**
 * Send contact form email
 */
export async function sendContactEmail(data: ContactFormData): Promise<EmailResponse> {
  try {
    const emailPayload: any = {
      from: 'Aurin <onboarding@resend.dev>',
      to: ['info@sodio.net'],
      subject: `${data.asunto} - ${data.nombre}`,
      replyTo: data.correo,
      html: contactEmailTemplate(data),
    };

    // Add attachment if present
    if (data.attachment) {
      emailPayload.attachments = [{
        filename: data.attachment.filename,
        path: data.attachment.url,
      }];
    }

    const result = await resend.emails.send(emailPayload);

    return {
      success: true,
      id: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send ticket email (from chatbot)
 */
export async function sendTicketEmail(data: TicketData): Promise<EmailResponse> {
  try {
    const emailPayload: any = {
      from: 'Aurin <onboarding@resend.dev>',
      to: ['info@sodio.net'],
      subject: `Ticket de Agente Aurin - ${data.name}`,
      replyTo: data.email,
      html: ticketEmailTemplate(data),
    };

    // Add attachment if present
    if (data.fileUrl) {
      // Extract filename from URL
      const filename = data.fileUrl.split('/').pop() || 'attachment';
      emailPayload.attachments = [{
        filename: filename,
        path: data.fileUrl,
      }];
    }

    const result = await resend.emails.send(emailPayload);

    return {
      success: true,
      id: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending ticket email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
