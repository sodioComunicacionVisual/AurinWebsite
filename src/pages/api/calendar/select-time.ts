/**
 * POST /api/calendar/select-time
 *
 * Validates and reserves a specific time slot for booking.
 * Returns a pending booking object to be stored in session/localStorage.
 *
 * @body {
 *   dayName: string,  // Spanish day name (e.g., "jueves")
 *   time: string      // Time in HH:MM format (e.g., "11:00")
 * }
 *
 * @returns {
 *   success: boolean,
 *   pendingBooking: {
 *     start: string,         // ISO datetime
 *     end: string,           // ISO datetime
 *     dateFormatted: string, // Human-readable date
 *     timeFormatted: string  // Human-readable time
 *   } | null,
 *   message: string
 * }
 *
 * @example
 * POST /api/calendar/select-time
 * Body: { "dayName": "jueves", "time": "11:00" }
 * Response:
 * {
 *   "success": true,
 *   "pendingBooking": {
 *     "start": "2025-11-07T11:00:00-06:00",
 *     "end": "2025-11-07T11:30:00-06:00",
 *     "dateFormatted": "Jueves 7 de noviembre",
 *     "timeFormatted": "11:00 AM"
 *   },
 *   "message": "Horario reservado temporalmente"
 * }
 */

import type { APIRoute } from 'astro';
import type { PendingBooking } from '../../../lib/calendar/types';
import {
  getNextWeekdayByName,
  formatDateISO,
  formatDateSpanish,
  formatTimeSpanish,
  createDateTimeISO,
  calculateEndTime,
  isValidBookingDate,
} from '../../../lib/calendar/utils';

export const prerender = false;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { dayName, time } = await request.json();

    // Validate input
    if (!dayName || !time) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: dayName or time',
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Find the next occurrence of the specified weekday
    const targetDate = getNextWeekdayByName(dayName);

    if (!targetDate) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid day name: ${dayName}`,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate the date is bookable
    if (!isValidBookingDate(targetDate)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Selected date is not available for booking',
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Create ISO datetime strings
    const dateISO = formatDateISO(targetDate);
    const startISO = createDateTimeISO(dateISO, time);
    const endISO = calculateEndTime(startISO);

    const startDate = new Date(startISO);

    const pendingBooking: PendingBooking = {
      start: startISO,
      end: endISO,
      dateFormatted: formatDateSpanish(targetDate),
      timeFormatted: formatTimeSpanish(startDate),
    };

    return new Response(
      JSON.stringify({
        success: true,
        pendingBooking,
        message: 'Horario reservado temporalmente',
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Error selecting time:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};
