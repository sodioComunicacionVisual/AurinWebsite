/**
 * Calendar Types & Interfaces
 *
 * This file contains all TypeScript types and interfaces used across
 * the calendar booking system.
 */

/**
 * Booking state maintained throughout the conversation
 */
export interface PendingBooking {
  /** ISO 8601 datetime string (e.g., "2025-11-07T11:00:00-06:00") */
  start: string;
  /** ISO 8601 datetime string (e.g., "2025-11-07T11:30:00-06:00") */
  end: string;
  /** Human-readable date (e.g., "Jueves 7 de noviembre") */
  dateFormatted?: string;
  /** Human-readable time (e.g., "11:00 AM") */
  timeFormatted?: string;
}

/**
 * Customer information collected during booking
 */
export interface CustomerData {
  name: string;
  email: string;
  reason: string;
}

/**
 * Available time slot for booking
 */
export interface TimeSlot {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Spanish day name (e.g., "lunes", "martes") */
  dayName: string;
  /** Day number (1-31) */
  dayNumber: number;
  /** Available times in HH:MM format (e.g., ["11:00", "11:30"]) */
  slots: string[];
}

/**
 * Calendar session metadata passed between frontend and backend
 */
export interface CalendarMetadata {
  pendingBooking: PendingBooking | null;
  customerEmail: string;
  customerData: CustomerData | null;
}

/**
 * Intent detected from user message
 */
export type CalendarIntent =
  | 'request_appointment'   // User wants to book appointment
  | 'select_time'          // User selected a specific time
  | 'provide_details'      // User provided name, email, reason
  | 'confirm_booking'      // User confirmed the booking
  | 'cancel_booking'       // User wants to cancel
  | 'none';                // No calendar intent detected

/**
 * Result of intent detection
 */
export interface IntentDetectionResult {
  intent: CalendarIntent;
  confidence: number; // 0-1
  extractedData?: {
    dayName?: string;
    time?: string;
    name?: string;
    email?: string;
    reason?: string;
  };
}
