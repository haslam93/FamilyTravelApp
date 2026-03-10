import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/places — List places with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const visited = searchParams.get("visited");
    const tripDayId = searchParams.get("tripDayId");
    const q = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (city) where.city = city;
    if (category) where.category = category;
    if (visited !== null && visited !== undefined) where.visited = visited === "true";
    if (tripDayId) where.tripDayId = tripDayId;
    if (q) where.name = { contains: q, mode: "insensitive" };

    const places = await prisma.place.findMany({
      where,
      orderBy: [{ visited: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error("Failed to fetch places:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}

// POST /api/places — Create a new place
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      category,
      city,
      country,
      address,
      latitude,
      longitude,
      googlePlaceId,
      googleMapsUrl,
      photoUrl,
      rating,
      priceLevel,
      phone,
      website,
      notes,
      kidFriendly,
      tripDayId,
    } = body;

    if (!name || !category || !city || !country) {
      return NextResponse.json(
        { error: "Missing required fields: name, category, city, country" },
        { status: 400 }
      );
    }

    const place = await prisma.place.create({
      data: {
        name,
        category,
        city,
        country,
        address,
        latitude,
        longitude,
        googlePlaceId,
        googleMapsUrl,
        photoUrl,
        rating,
        priceLevel,
        phone,
        website,
        notes,
        kidFriendly: kidFriendly ?? true,
        tripDayId,
      },
    });

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    console.error("Failed to create place:", error);
    return NextResponse.json({ error: "Failed to create place" }, { status: 500 });
  }
}
