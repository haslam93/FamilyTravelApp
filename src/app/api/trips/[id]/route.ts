import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 });
  }
}

// PATCH /api/trips/[id] — Update a trip
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

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
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
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
