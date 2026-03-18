import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStoredTrip, upsertTripOverride } from "@/lib/trip-store";

// GET /api/trips/[id] — Get a single trip with all related data
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            activities: {
              orderBy: { sortOrder: "asc" },
              include: { flight: true, place: true },
            },
            places: true,
          },
          orderBy: { dayNum: "asc" },
        },
        flights: {
          orderBy: { scheduledDeparture: "asc" },
        },
        stays: {
          orderBy: { checkIn: "asc" },
        },
        documents: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Failed to fetch trip:", error);
    const { id } = await params;
    const fallbackTrip = await getStoredTrip(id);

    if (!fallbackTrip) {
      return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 });
    }

    return NextResponse.json(fallbackTrip, {
      headers: {
        "x-family-travel-data-source": "fallback",
      },
    });
  }
}

// PATCH /api/trips/[id] — Update a trip
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const trip = await prisma.trip.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.type && { type: body.type }),
        ...(body.status && { status: body.status }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(body.cities && { cities: body.cities }),
        ...(body.countries && { countries: body.countries }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.travelers !== undefined && { travelers: body.travelers }),
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Failed to update trip:", error);

    const fallbackTrip = await getStoredTrip(id);

    if (!fallbackTrip) {
      return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
    }

    const updatedTrip = {
      ...fallbackTrip,
      ...(body.name !== undefined && { name: body.name }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.startDate !== undefined && { startDate: body.startDate }),
      ...(body.endDate !== undefined && { endDate: body.endDate }),
      ...(body.cities !== undefined && { cities: body.cities }),
      ...(body.countries !== undefined && { countries: body.countries }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.travelers !== undefined && { travelers: body.travelers }),
    };

    await upsertTripOverride({
      id,
      name: updatedTrip.name,
      type: updatedTrip.type,
      status: updatedTrip.status,
      startDate: updatedTrip.startDate,
      endDate: updatedTrip.endDate,
      cities: updatedTrip.cities,
      countries: updatedTrip.countries,
      coverImage: updatedTrip.coverImage,
      description: updatedTrip.description,
      travelers: updatedTrip.travelers,
    });

    return NextResponse.json(updatedTrip, {
      headers: {
        "x-family-travel-data-source": "fallback",
      },
    });
  }
}

// DELETE /api/trips/[id] — Delete a trip (cascades to days, activities, etc.)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.trip.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete trip:", error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
