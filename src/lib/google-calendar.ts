// ─── Google Calendar Integration ────────────────────────────────────────────
// OAuth 2.0 + Calendar API for bi-directional sync.
// Activities in the app ↔ Events in Google Calendar.

import { google, calendar_v3 } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthUrl(): string {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function getCalendarClient(refreshToken: string): calendar_v3.Calendar {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.calendar({ version: "v3", auth: oauth2Client });
}

// ─── Sync: App → Google Calendar ────────────────────────────────────────────

export async function createCalendarEvent(
  refreshToken: string,
  calendarId: string,
  activity: {
    name: string;
    startTime: Date;
    endTime: Date;
    description?: string;
    location?: string;
  }
): Promise<string | null> {
  const calendar = getCalendarClient(refreshToken);

  const event = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: activity.name,
      description: activity.description,
      location: activity.location,
      start: {
        dateTime: activity.startTime.toISOString(),
      },
      end: {
        dateTime: activity.endTime.toISOString(),
      },
      colorId: "9", // Blueberry — travel-themed color
    },
  });

  return event.data.id || null;
}

export async function updateCalendarEvent(
  refreshToken: string,
  calendarId: string,
  eventId: string,
  activity: {
    name: string;
    startTime: Date;
    endTime: Date;
    description?: string;
    location?: string;
  }
): Promise<void> {
  const calendar = getCalendarClient(refreshToken);

  await calendar.events.update({
    calendarId,
    eventId,
    requestBody: {
      summary: activity.name,
      description: activity.description,
      location: activity.location,
      start: {
        dateTime: activity.startTime.toISOString(),
      },
      end: {
        dateTime: activity.endTime.toISOString(),
      },
    },
  });
}

export async function deleteCalendarEvent(
  refreshToken: string,
  calendarId: string,
  eventId: string
): Promise<void> {
  const calendar = getCalendarClient(refreshToken);

  await calendar.events.delete({
    calendarId,
    eventId,
  });
}

// ─── Sync: Google Calendar → App ────────────────────────────────────────────

export async function listCalendarEvents(
  refreshToken: string,
  calendarId: string,
  timeMin: Date,
  timeMax: Date
): Promise<calendar_v3.Schema$Event[]> {
  const calendar = getCalendarClient(refreshToken);

  const response = await calendar.events.list({
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.data.items || [];
}

export async function listCalendars(
  refreshToken: string
): Promise<calendar_v3.Schema$CalendarListEntry[]> {
  const calendar = getCalendarClient(refreshToken);
  const response = await calendar.calendarList.list();
  return response.data.items || [];
}
