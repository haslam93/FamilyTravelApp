import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStoredTrips } from "@/lib/trip-store";

// GET /api/trips — List all trips
export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        days: {
          include: {
            activities: {
              orderBy: { sortOrder: "asc" },
            },
          },
          orderBy: { dayNum: "asc" },
        },
        flights: {
          orderBy: { scheduledDeparture: "asc" },
        },
        documents: true,
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return NextResponse.json(await getStoredTrips(), {
      headers: {
        "x-family-travel-data-source": "fallback",
      },
    });
  }
}

// POST /api/trips — Create a new trip
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, startDate, endDate, cities, countries, coverImage, description, travelers } = body;

    if (!name || !type || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, startDate, endDate" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        cities: cities || [],
        countries: countries || [],
        coverImage,
        description,
        travelers: travelers || 1,
      },
    });

    // Auto-generate days for the trip
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];
    let dayNum = 1;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        date: new Date(d),
        dayNum: dayNum++,
        city: cities?.[0] || "TBD",
        country: countries?.[0] || "TBD",
        tripId: trip.id,
      });
    }

    if (days.length > 0) {
      await prisma.tripDay.createMany({ data: days });
    }

    const fullTrip = await prisma.trip.findUnique({
      where: { id: trip.id },
      include: {
        days: { orderBy: { dayNum: "asc" } },
        flights: true,
        documents: true,
      },
    });

    return NextResponse.json(fullTrip, { status: 201 });
  } catch (error) {
    console.error("Failed to create trip:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
