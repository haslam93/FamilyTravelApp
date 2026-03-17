// ─── Google Calendar Sync API ────────────────────────────────────────────────
// POST /api/calendar/sync — Full bi-directional sync for a trip
// GET  /api/calendar/sync?tripId=... — Get sync status for a trip's activities

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createCalendarEvent,
  updateCalendarEvent,
  listCalendarEvents,
} from "@/lib/google-calendar";

async function getCalendarCredentials() {
  const settings = await prisma.settings.findUnique({
    where: { id: "app-settings" },
  });

  if (!settings?.googleRefreshToken || !settings?.googleCalendarId) {
    return null;
  }

  return {
    refreshToken: settings.googleRefreshToken,
    calendarId: settings.googleCalendarId,
  };
}

// GET — Sync status for a trip
export async function GET(request: NextRequest) {
  const tripId = request.nextUrl.searchParams.get("tripId");

  if (!tripId) {
    return NextResponse.json(
      { error: "tripId query parameter required" },
      { status: 400 }
    );
  }

  try {
    const activities = await prisma.activity.findMany({
      where: { tripDay: { tripId } },
      include: { calendarSync: true },
      orderBy: [{ tripDay: { date: "asc" } }, { sortOrder: "asc" }],
    });

    const syncStatus = activities.map((a) => ({
      activityId: a.id,
      activityName: a.name,
      synced: !!a.calendarSync,
      syncStatus: a.calendarSync?.syncStatus || null,
      lastSyncedAt: a.calendarSync?.lastSyncedAt || null,
      googleEventId: a.calendarSync?.googleEventId || null,
    }));

    return NextResponse.json({ syncStatus });
  } catch (err) {
    console.error("Failed to get sync status:", err);
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 }
    );
  }
}

// POST — Push activities to Google Calendar
export async function POST(request: NextRequest) {
  try {
    const { tripId, direction = "push" } = await request.json();

    if (!tripId) {
      return NextResponse.json(
        { error: "tripId is required" },
        { status: 400 }
      );
    }

    const creds = await getCalendarCredentials();
    if (!creds) {
      return NextResponse.json(
        { error: "Google Calendar not connected. Go to Settings to connect." },
        { status: 400 }
      );
    }

    if (direction === "push") {
      return await pushToCalendar(tripId, creds);
    } else if (direction === "pull") {
      return await pullFromCalendar(tripId, creds);
    }

    return NextResponse.json({ error: "Invalid direction" }, { status: 400 });
  } catch (err) {
    console.error("Calendar sync error:", err);
    return NextResponse.json(
      { error: "Calendar sync failed" },
      { status: 500 }
    );
  }
}

// ─── Push: App → Google Calendar ──────────────────────────────────────────

async function pushToCalendar(
  tripId: string,
  creds: { refreshToken: string; calendarId: string }
) {
  const activities = await prisma.activity.findMany({
    where: {
      tripDay: { tripId },
      startTime: { not: null },
      endTime: { not: null },
    },
    include: {
      calendarSync: true,
      tripDay: { select: { date: true, city: true, country: true } },
    },
  });

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const activity of activities) {
    try {
      const eventData = {
        name: activity.name,
        startTime: activity.startTime!,
        endTime: activity.endTime!,
        description: [
          activity.notes || "",
          `\uD83D\uDCCD ${activity.tripDay.city}, ${activity.tripDay.country}`,
          `Type: ${activity.type}`,
        ]
          .filter(Boolean)
          .join("\n"),
        location: `${activity.tripDay.city}, ${activity.tripDay.country}`,
      };

      if (activity.calendarSync) {
        // Update existing event
        await updateCalendarEvent(
          creds.refreshToken,
          creds.calendarId,
          activity.calendarSync.googleEventId,
          eventData
        );

        await prisma.calendarSync.update({
          where: { id: activity.calendarSync.id },
          data: {
            syncStatus: "SYNCED",
            lastSyncedAt: new Date(),
          },
        });

        updated++;
      } else {
        // Create new event
        const eventId = await createCalendarEvent(
          creds.refreshToken,
          creds.calendarId,
          eventData
        );

        if (eventId) {
          await prisma.calendarSync.create({
            data: {
              activityId: activity.id,
              googleEventId: eventId,
              googleCalendarId: creds.calendarId,
              syncStatus: "SYNCED",
              lastSyncedAt: new Date(),
            },
          });
          created++;
        }
      }
    } catch (err) {
      console.error(`Sync error for activity ${activity.id}:`, err);

      if (activity.calendarSync) {
        await prisma.calendarSync.update({
          where: { id: activity.calendarSync.id },
          data: { syncStatus: "ERROR" },
        });
      }

      errors++;
    }
  }

  return NextResponse.json({
    success: true,
    direction: "push",
    created,
    updated,
    errors,
    total: activities.length,
  });
}

// ─── Pull: Google Calendar → App ──────────────────────────────────────────

async function pullFromCalendar(
  tripId: string,
  creds: { refreshToken: string; calendarId: string }
) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      days: {
        include: {
          activities: { include: { calendarSync: true } },
        },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!trip || trip.days.length === 0) {
    return NextResponse.json(
      { error: "Trip not found or has no days" },
      { status: 404 }
    );
  }

  const timeMin = trip.days[0].date;
  const timeMax = new Date(trip.days[trip.days.length - 1].date);
  timeMax.setDate(timeMax.getDate() + 1);

  const events = await listCalendarEvents(
    creds.refreshToken,
    creds.calendarId,
    timeMin,
    timeMax
  );

  let synced = 0;
  let skipped = 0;

  // Map of google event IDs already tracked
  const trackedEventIds = new Set<string>();
  for (const day of trip.days) {
    for (const act of day.activities) {
      if (act.calendarSync) {
        trackedEventIds.add(act.calendarSync.googleEventId);
      }
    }
  }

  for (const event of events) {
    if (!event.id || trackedEventIds.has(event.id)) {
      skipped++;
      continue;
    }

    const eventStart = event.start?.dateTime
      ? new Date(event.start.dateTime)
      : event.start?.date
        ? new Date(event.start.date)
        : null;

    if (!eventStart) {
      skipped++;
      continue;
    }

    // Find the matching TripDay
    const matchingDay = trip.days.find((d) => {
      const dayDate = new Date(d.date);
      return (
        dayDate.getFullYear() === eventStart.getFullYear() &&
        dayDate.getMonth() === eventStart.getMonth() &&
        dayDate.getDate() === eventStart.getDate()
      );
    });

    if (!matchingDay) {
      skipped++;
      continue;
    }

    const eventEnd = event.end?.dateTime
      ? new Date(event.end.dateTime)
      : eventStart;

    const maxOrder = matchingDay.activities.reduce(
      (max, a) => Math.max(max, a.sortOrder),
      -1
    );

    await prisma.activity.create({
      data: {
        tripDayId: matchingDay.id,
        name: event.summary || "Untitled Event",
        type: "OTHER",
        startTime: eventStart,
        endTime: eventEnd,
        notes: event.description || null,
        sortOrder: maxOrder + 1,
        calendarSync: {
          create: {
            googleEventId: event.id,
            googleCalendarId: creds.calendarId,
            syncStatus: "SYNCED",
            lastSyncedAt: new Date(),
          },
        },
      },
    });

    synced++;
  }

  return NextResponse.json({
    success: true,
    direction: "pull",
    imported: synced,
    skipped,
    totalEvents: events.length,
  });
}
