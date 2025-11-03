/**
 * Mailing Service
 * Centralized email using Resend
 */

import { Resend } from 'resend';
import type { ContactFormData, TicketData, AppointmentData, CancellationData, EmailResponse } from './types';
import { contactEmailTemplate, ticketEmailTemplate, appointmentConfirmationEmail, appointmentCancellationEmail } from './templates';
import crypto from 'crypto';

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

/**
 * Generate secure token for appointment confirmation
 */
export function generateAppointmentToken(eventId: string, email: string): string {
  const secret = import.meta.env.RESEND_API_KEY; // Reusing existing env var as secret
  const payload = `${eventId}:${email}:${Date.now()}`;
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  // Format: eventId:email:timestamp:hash
  return Buffer.from(`${payload}:${hash}`).toString('base64url');
}

/**
 * Validate and decode appointment token
 */
export function validateAppointmentToken(token: string): { valid: boolean; eventId?: string; email?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [eventId, email, timestamp, hash] = decoded.split(':');

    // Check token age (24 hours max)
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return { valid: false };
    }

    // Verify hash
    const secret = import.meta.env.RESEND_API_KEY;
    const payload = `${eventId}:${email}:${timestamp}`;
    const expectedHash = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    if (hash !== expectedHash) {
      return { valid: false };
    }

    return { valid: true, eventId, email };
  } catch (error) {
    return { valid: false };
  }
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmation(data: AppointmentData): Promise<EmailResponse> {
  try {
    const token = generateAppointmentToken(data.eventId, data.email);
    const confirmUrl = `https://aurin.mx/api/confirm-appointment?token=${token}`;

    const result = await resend.emails.send({
      from: 'Aurin <onboarding@resend.dev>',
      to: [data.email],
      subject: `Confirma tu cita - ${new Date(data.appointmentDate).toLocaleDateString('es-MX')}`,
      html: appointmentConfirmationEmail(data, confirmUrl),
    });

    return {
      success: true,
      id: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send appointment cancellation email
 */
export async function sendAppointmentCancellation(data: CancellationData): Promise<EmailResponse> {
  try {
    const result = await resend.emails.send({
      from: 'Aurin <onboarding@resend.dev>',
      to: [data.email],
      subject: `Cita cancelada - ${new Date(data.appointmentDate).toLocaleDateString('es-MX')}`,
      html: appointmentCancellationEmail(data),
    });

    return {
      success: true,
      id: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending appointment cancellation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
