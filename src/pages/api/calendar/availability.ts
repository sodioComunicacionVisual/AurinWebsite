/**
 * GET /api/calendar/availability
 *
 * Returns available time slots for the next 7 business days.
 * Excludes weekends and times outside business hours (11 AM - 5:30 PM).
 *
 * @returns {
 *   success: boolean,
 *   availability: Array<{
 *     date: string,        // YYYY-MM-DD
 *     dayName: string,     // Spanish day name
 *     dayNumber: number,   // Day of month
 *     slots: string[]      // Available times in HH:MM format
 *   }>
 * }
 *
 * @example
 * GET /api/calendar/availability
 * Response:
 * {
 *   "success": true,
 *   "availability": [
 *     {
 *       "date": "2025-11-07",
 *       "dayName": "jueves",
 *       "dayNumber": 7,
 *       "slots": ["11:00", "11:30", "12:00", ...]
 *     }
 *   ]
 * }
 */

import type { APIRoute } from 'astro';
import { GoogleCalendarService } from '../../../lib/calendar/googleCalendar';
import type { TimeSlot } from '../../../lib/calendar/types';
import {
  generateDailyTimeSlots,
  isSlotAvailable,
  isValidBookingDate,
  createBusySlots,
  formatDateISO,
  DAYS_AHEAD,
} from '../../../lib/calendar/utils';

export const prerender = false;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const GET: APIRoute = async () => {
  try {
    const calendarService = new GoogleCalendarService();

    // Get events for the next week
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + DAYS_AHEAD);

    const events = await calendarService.getEvents(startDate, endDate);
    const dailyTimeSlots = generateDailyTimeSlots();
    const availability: TimeSlot[] = [];

    // Check each day in the range
    for (let i = 1; i <= DAYS_AHEAD; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() + i);

      // Skip if not a valid booking date (weekends, too soon, etc.)
      if (!isValidBookingDate(checkDate)) continue;

      const dateStr = formatDateISO(checkDate);
      const busySlots = createBusySlots(events, dateStr);

      // Filter available slots for this day
      const availableSlots = dailyTimeSlots.filter(time =>
        isSlotAvailable(dateStr, time, busySlots)
      );

      // Only include days with at least one available slot
      if (availableSlots.length > 0) {
        availability.push({
          date: dateStr,
          dayName: checkDate.toLocaleDateString('es-MX', { weekday: 'long' }),
          dayNumber: checkDate.getDate(),
          slots: availableSlots,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        availability,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Error fetching availability:', error);

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
