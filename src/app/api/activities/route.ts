import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/activities?tripDayId=xxx — List activities for a day
export async function GET(req: NextRequest) {
  try {
    const tripDayId = req.nextUrl.searchParams.get("tripDayId");

    if (!tripDayId) {
      return NextResponse.json(
        { error: "tripDayId query parameter is required" },
        { status: 400 }
      );
    }

    const activities = await prisma.activity.findMany({
      where: { tripDayId },
      orderBy: { sortOrder: "asc" },
      include: { flight: true, place: true },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

// POST /api/activities — Create a new activity
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, tripDayId, startTime, endTime, notes, flightId, placeId } = body;

    if (!name || !type || !tripDayId) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, tripDayId" },
        { status: 400 }
      );
    }

    // Get the highest sort order for this day
    const maxOrder = await prisma.activity.aggregate({
      where: { tripDayId },
      _max: { sortOrder: true },
    });

    const activity = await prisma.activity.create({
      data: {
        name,
        type,
        tripDayId,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        notes,
        flightId,
        placeId,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
      include: { flight: true, place: true },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Failed to create activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

// PATCH /api/activities — Bulk update sort order (for drag-and-drop reorder)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reorder } = body;

    if (!reorder || !Array.isArray(reorder)) {
      return NextResponse.json(
        { error: "Expected { reorder: [{ id, sortOrder }] }" },
        { status: 400 }
      );
    }

    await prisma.$transaction(
      reorder.map((item: { id: string; sortOrder: number }) =>
        prisma.activity.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder activities:", error);
    return NextResponse.json({ error: "Failed to reorder activities" }, { status: 500 });
  }
}
