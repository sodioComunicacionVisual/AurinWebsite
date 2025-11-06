/**
 * Calendar Intent Detector
 *
 * Detects user intents related to calendar booking from natural language.
 * Uses pattern matching and keyword detection.
 */

import type { IntentDetectionResult, CalendarIntent } from './types';

const DAYS_ES = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes'];

const PATTERNS = {
  request_appointment: [
    /agendar.*cita/i,
    /programar.*cita/i,
    /quiero.*cita/i,
    /solicitar.*cita/i,
    /hacer.*cita/i,
    /disponibilidad/i,
    /horarios?\s+disponibles?/i,
  ],
  select_time: [
    /(lunes|martes|miércoles|miercoles|jueves|viernes)\s+a\s+las?\s+\d+/i,
    /\d+\s*(am|pm|:\d+)/i,
    /(mañana|tarde)\s+a\s+las?/i,
  ],
  provide_details: [
    /^[^,]+,\s*[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/i, // Name, email format
  ],
  cancel_booking: [
    /cancelar/i,
    /no\s+(quiero|puedo)/i,
    /mejor\s+no/i,
  ],
};

/**
 * Detects the user's intent from their message
 *
 * @param message - User's natural language message
 * @param hasExistingBooking - Whether user has a pending booking
 * @returns Intent detection result with confidence score
 */
export function detectIntent(
  message: string,
  hasExistingBooking: boolean = false
): IntentDetectionResult {
  const lowerMessage = message.toLowerCase().trim();

  // Check for cancellation first
  if (PATTERNS.cancel_booking.some(pattern => pattern.test(lowerMessage))) {
    return {
      intent: 'cancel_booking',
      confidence: 0.9,
    };
  }

  // Check for customer details (Name, email, reason format)
  const detailsMatch = message.match(/^([^,]+),\s*([\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,})\s*(?:,\s*(.+))?$/i);
  if (detailsMatch && hasExistingBooking) {
    return {
      intent: 'provide_details',
      confidence: 0.95,
      extractedData: {
        name: detailsMatch[1].trim(),
        email: detailsMatch[2].trim(),
        reason: detailsMatch[3]?.trim() || 'Consulta',
      },
    };
  }

  // Check for time selection
  for (const pattern of PATTERNS.select_time) {
    if (pattern.test(lowerMessage)) {
      const dayMatch = DAYS_ES.find(day => lowerMessage.includes(day));
      const timeMatch = message.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);

      return {
        intent: 'select_time',
        confidence: 0.85,
        extractedData: {
          dayName: dayMatch,
          time: timeMatch ? timeMatch[0] : undefined,
        },
      };
    }
  }

  // Check for appointment request
  for (const pattern of PATTERNS.request_appointment) {
    if (pattern.test(lowerMessage)) {
      return {
        intent: 'request_appointment',
        confidence: 0.8,
      };
    }
  }

  return {
    intent: 'none',
    confidence: 0,
  };
}

/**
 * Extracts day name from message
 */
export function extractDayName(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  return DAYS_ES.find(day => lowerMessage.includes(day)) || null;
}

/**
 * Extracts time from message and normalizes to HH:MM format
 */
export function extractTime(message: string): string | null {
  const timeMatch = message.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);
  if (!timeMatch) return null;

  let hours = parseInt(timeMatch[1]);
  const minutes = timeMatch[2] || '00';
  const meridiem = timeMatch[3]?.toLowerCase();

  // Convert to 24-hour format
  if (meridiem === 'pm' && hours !== 12) {
    hours += 12;
  } else if (meridiem === 'am' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}
