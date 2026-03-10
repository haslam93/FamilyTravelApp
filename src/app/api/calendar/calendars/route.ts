// ─── Google Calendar List API ────────────────────────────────────────────────
// GET /api/calendar/calendars — List user's Google Calendars
// Used in settings to select which calendar to sync with.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { listCalendars } from "@/lib/google-calendar";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "app-settings" },
    });

    if (!settings?.googleRefreshToken) {
      return NextResponse.json(
        { error: "Google Calendar not connected" },
        { status: 400 }
      );
    }

    const calendars = await listCalendars(settings.googleRefreshToken);

    const calendarList = calendars.map((cal) => ({
      id: cal.id,
      summary: cal.summary,
      primary: cal.primary || false,
      backgroundColor: cal.backgroundColor,
    }));

    return NextResponse.json({
      calendars: calendarList,
      selectedCalendarId: settings.googleCalendarId,
    });
  } catch (err) {
    console.error("Failed to list calendars:", err);
    return NextResponse.json(
      { error: "Failed to list calendars" },
      { status: 500 }
    );
  }
}
