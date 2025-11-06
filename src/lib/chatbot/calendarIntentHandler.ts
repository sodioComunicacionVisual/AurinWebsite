/**
 * Calendar Intent Handler (Frontend)
 *
 * Handles calendar-related intents detected from bot responses and user messages.
 * Orchestrates calls to calendar APIs and manages booking state.
 */

import type { PendingBooking, CustomerData, CalendarMetadata } from '../calendar/types';

interface IntentHandlerResult {
  shouldCallAPI: boolean;
  apiEndpoint?: string;
  apiPayload?: any;
  metadata?: CalendarMetadata;
}

/**
 * Detects if bot response contains calendar intent markers
 */
export function detectCalendarIntent(botResponse: string): {
  isCalendar: boolean;
  intent: 'show_availability' | 'confirm_time' | 'request_details' | 'booking_confirmed' | 'none';
} {
  const lower = botResponse.toLowerCase();

  // Check for availability response
  if (lower.includes('disponibilidad') || lower.includes('horarios disponibles')) {
    return { isCalendar: true, intent: 'show_availability' };
  }

  // Check for time confirmation
  if (lower.includes('¡perfecto!') && (lower.includes('cita para') || lower.includes('nombre completo'))) {
    return { isCalendar: true, intent: 'confirm_time' };
  }

  // Check for details request
  if (lower.includes('nombre') && lower.includes('email') && lower.includes('motivo')) {
    return { isCalendar: true, intent: 'request_details' };
  }

  // Check for booking confirmation
  if (lower.includes('cita agendada') || lower.includes('cita reservada') || lower.includes('cita creada')) {
    return { isCalendar: true, intent: 'booking_confirmed' };
  }

  return { isCalendar: false, intent: 'none' };
}

/**
 * Extracts day name from user message
 */
function extractDayName(message: string): string | null {
  const days = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes'];
  const lower = message.toLowerCase();
  return days.find(day => lower.includes(day)) || null;
}

/**
 * Extracts time from user message and normalizes to HH:MM format
 */
function extractTime(message: string): string | null {
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

/**
 * Extracts customer data from message in format: "Name, email, reason"
 */
function extractCustomerData(message: string): CustomerData | null {
  const match = message.match(/^([^,]+),\s*([\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,})\s*(?:,\s*(.+))?$/i);

  if (!match) return null;

  return {
    name: match[1].trim(),
    email: match[2].trim(),
    reason: match[3]?.trim() || 'Consulta',
  };
}

/**
 * Handles user message and determines if calendar API should be called
 */
export async function handleUserMessage(
  message: string,
  currentMetadata: CalendarMetadata
): Promise<IntentHandlerResult> {
  // Check if user is selecting a time
  const dayName = extractDayName(message);
  const time = extractTime(message);

  if (dayName && time && !currentMetadata.pendingBooking) {
    // User is selecting a time slot
    return {
      shouldCallAPI: true,
      apiEndpoint: '/api/calendar/select-time',
      apiPayload: { dayName, time },
    };
  }

  // Check if user is providing customer details
  const customerData = extractCustomerData(message);

  if (customerData && currentMetadata.pendingBooking) {
    // User provided details, create the booking
    return {
      shouldCallAPI: true,
      apiEndpoint: '/api/calendar/book',
      apiPayload: {
        pendingBooking: currentMetadata.pendingBooking,
        customerData,
      },
      metadata: {
        pendingBooking: currentMetadata.pendingBooking,
        customerEmail: customerData.email,
        customerData,
      },
    };
  }

  // No calendar action needed
  return { shouldCallAPI: false };
}

/**
 * Fetches availability and formats response for display
 */
export async function fetchAvailability(): Promise<string> {
  try {
    const response = await fetch('/api/calendar/availability');
    const data = await response.json();

    if (!data.success || !data.availability?.length) {
      return '❌ No hay horarios disponibles en este momento. Por favor contacta a hey@aurin.mx';
    }

    let formatted = '📅 **Horarios disponibles** (Lun-Vie, 11 AM - 5:30 PM)\n\n';

    for (const day of data.availability.slice(0, 5)) {
      formatted += `**${day.dayName} ${day.dayNumber}**: ${day.slots.slice(0, 4).join(', ')}\n`;
    }

    formatted += '\n💡 Dime qué día y hora prefieres (ejemplo: "Jueves a las 11 AM")';

    return formatted;
  } catch (error) {
    console.error('Error fetching availability:', error);
    return '❌ Error al obtener disponibilidad. Por favor intenta de nuevo.';
  }
}
