/**
 * Calendar Utility Functions
 *
 * Shared utility functions for date/time manipulation and formatting.
 * Following DRY principles - all calendar-related calculations in one place.
 */

import type { TimeSlot } from './types';

/** Business hours: 11:00 AM - 5:30 PM */
export const BUSINESS_HOURS = {
  START: '11:00',
  END: '17:30',
  TIMEZONE: 'America/Mexico_City',
};

/** Appointment duration in minutes */
export const APPOINTMENT_DURATION_MINUTES = 30;

/** Buffer time before/after appointments in minutes */
export const BUFFER_MINUTES = 15;

/** Days to look ahead for availability */
export const DAYS_AHEAD = 7;

/** Minimum hours ahead to book */
export const MIN_HOURS_AHEAD = 24;

/**
 * Spanish day names mapping
 */
const DAY_NAMES_ES: Record<number, string> = {
  1: 'lunes',
  2: 'martes',
  3: 'miércoles',
  4: 'jueves',
  5: 'viernes',
};

/**
 * Generates all possible time slots for a day within business hours
 *
 * @returns Array of time strings in HH:MM format (e.g., ["11:00", "11:30", ...])
 */
export function generateDailyTimeSlots(): string[] {
  const slots: string[] = [];
  let currentTime = parseTime(BUSINESS_HOURS.START);
  const endTime = parseTime(BUSINESS_HOURS.END);

  while (currentTime < endTime) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    currentTime += APPOINTMENT_DURATION_MINUTES;
  }

  return slots;
}

/**
 * Parses time string (HH:MM) to minutes since midnight
 */
function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if a time slot is available (not conflicting with existing events)
 *
 * @param slotDate - Date string in YYYY-MM-DD format
 * @param slotTime - Time string in HH:MM format
 * @param busySlots - Array of busy time ranges
 * @returns True if slot is available
 */
export function isSlotAvailable(
  slotDate: string,
  slotTime: string,
  busySlots: Array<{ start: Date; end: Date }>
): boolean {
  const slotStart = new Date(`${slotDate}T${slotTime}:00-06:00`);
  const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);

  // Check if slot conflicts with any busy period
  return !busySlots.some(busy => slotStart < busy.end && slotEnd > busy.start);
}

/**
 * Checks if a date is valid for booking (weekday, within range, not in past)
 */
export function isValidBookingDate(date: Date): boolean {
  const day = date.getDay();
  const now = new Date();
  const minDate = new Date(now.getTime() + MIN_HOURS_AHEAD * 60 * 60 * 1000);

  // Must be weekday (Monday-Friday)
  if (day === 0 || day === 6) return false;

  // Must be at least 24 hours ahead
  if (date < minDate) return false;

  return true;
}

/**
 * Converts busy events to time ranges with buffer
 */
export function createBusySlots(
  events: Array<{ start: string; end: string }>,
  targetDate: string
): Array<{ start: Date; end: Date }> {
  return events
    .filter(e => e.start.startsWith(targetDate))
    .map(e => ({
      start: new Date(new Date(e.start).getTime() - BUFFER_MINUTES * 60 * 1000),
      end: new Date(new Date(e.end).getTime() + BUFFER_MINUTES * 60 * 1000),
    }));
}

/**
 * Gets the next available weekday date matching a Spanish day name
 *
 * @param dayName - Spanish day name (e.g., "lunes", "martes")
 * @returns Date object or null if invalid day name
 */
export function getNextWeekdayByName(dayName: string): Date | null {
  const targetDayIndex = Object.entries(DAY_NAMES_ES).find(
    ([_, name]) => name.toLowerCase() === dayName.toLowerCase()
  )?.[0];

  if (!targetDayIndex) return null;

  const targetDay = parseInt(targetDayIndex);
  const today = new Date();

  // Search for next occurrence of this weekday (up to 10 days)
  for (let i = 1; i <= 10; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);

    const checkDay = checkDate.getDay();
    if (checkDay === targetDay && isValidBookingDate(checkDate)) {
      return checkDate;
    }
  }

  return null;
}

/**
 * Formats a Date to YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats a Date to Spanish human-readable format
 * Example: "Jueves 7 de noviembre"
 */
export function formatDateSpanish(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: BUSINESS_HOURS.TIMEZONE,
  });
}

/**
 * Formats a time to Spanish human-readable format
 * Example: "11:00 AM"
 */
export function formatTimeSpanish(date: Date): string {
  return date.toLocaleTimeString('es-MX', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: BUSINESS_HOURS.TIMEZONE,
  });
}

/**
 * Creates an ISO datetime string for Mexico City timezone
 */
export function createDateTimeISO(date: string, time: string): string {
  return `${date}T${time}:00-06:00`;
}

/**
 * Calculates end time given start time and duration
 */
export function calculateEndTime(startISO: string): string {
  const start = new Date(startISO);

  // Validate date
  if (isNaN(start.getTime())) {
    throw new Error(`Invalid start date: ${startISO}`);
  }

  const end = new Date(start.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);

  // Validate end date
  if (isNaN(end.getTime())) {
    throw new Error('Failed to calculate end time');
  }

  return end.toISOString().slice(0, 19) + '-06:00';
}
