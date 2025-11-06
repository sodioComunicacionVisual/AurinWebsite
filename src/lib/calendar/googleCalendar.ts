/**
 * Google Calendar Service
 * Direct integration with Google Calendar API
 */

import { google } from 'googleapis';

// Calendar ID for "Citas de Aurin.mx"
const CALENDAR_ID = 'd8ef031d15c90593c2688e6aa89081c0f2cca90a18c32ddf14243b792d81f3a7@group.calendar.google.com';

const credentials = {
  client_email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  htmlLink?: string;
  hangoutLink?: string;
  attendees?: string[];
  confirmed?: string;
  createdAt?: string;
  customerName?: string;
  customerEmail?: string;
}

export class GoogleCalendarService {
  private calendar;

  constructor() {
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const response = await this.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items?.map(event => ({
      id: event.id!,
      summary: event.summary || '',
      description: event.description,
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      htmlLink: event.htmlLink,
      hangoutLink: event.hangoutLink,
      attendees: event.attendees?.map(a => a.email || ''),
      confirmed: event.extendedProperties?.private?.confirmed,
      createdAt: event.extendedProperties?.private?.createdAt,
      customerName: event.extendedProperties?.private?.customerName,
      customerEmail: event.extendedProperties?.private?.customerEmail,
    })) || [];
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: eventId,
      sendUpdates: 'all',
    });
  }

  async createEvent(data: {
    summary: string;
    description: string;
    start: string;
    end: string;
    attendees: string[];
    customerName: string;
    customerEmail: string;
  }): Promise<CalendarEvent> {
    const response = await this.calendar.events.insert({
      calendarId: CALENDAR_ID,
      sendUpdates: 'none', // Don't send Google Calendar invites
      requestBody: {
        summary: data.summary,
        description: data.description,
        start: { dateTime: data.start, timeZone: 'America/Mexico_City' },
        end: { dateTime: data.end, timeZone: 'America/Mexico_City' },
        // ❌ REMOVED attendees - Service Account can't invite without Domain-Wide Delegation
        // ❌ REMOVED conferenceData - Requires Google Workspace with Meet enabled
        // Email confirmation will be sent via Resend with meeting instructions
        extendedProperties: {
          private: {
            confirmed: 'false',
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            createdAt: new Date().toISOString(),
          },
        },
      },
    });

    const event = response.data;
    return {
      id: event.id!,
      summary: event.summary || '',
      description: event.description,
      start: event.start?.dateTime || '',
      end: event.end?.dateTime || '',
      htmlLink: event.htmlLink,
      hangoutLink: event.hangoutLink,
      attendees: [], // No attendees in Google Calendar, handled via email
    };
  }
}
