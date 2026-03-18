import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/stays?tripId=xxx — List stays, optionally scoped to a trip
export async function GET(req: NextRequest) {
  try {
    const tripId = req.nextUrl.searchParams.get("tripId");

    const stays = await prisma.stay.findMany({
      where: tripId ? { tripId } : undefined,
      orderBy: [{ checkIn: "asc" }],
    });

    return NextResponse.json(stays);
  } catch (error) {
    console.error("Failed to fetch stays:", error);
    return NextResponse.json({ error: "Failed to fetch stays" }, { status: 500 });
  }
}

// POST /api/stays — Create a new stay
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tripId,
      hotelName,
      address,
      city,
      country,
      checkIn,
      checkOut,
      checkInLabel,
      checkOutLabel,
      confirmationCode,
      bookingProvider,
      roomType,
      guests,
      notes,
      googlePlaceId,
      googleMapsUrl,
      photoUrl,
      rating,
      phone,
      website,
    } = body;

    if (!tripId || !hotelName || !city || !country || !checkIn || !checkOut) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: tripId, hotelName, city, country, checkIn, checkOut",
        },
        { status: 400 }
      );
    }

    const stay = await prisma.stay.create({
      data: {
        tripId,
        hotelName,
        address,
        city,
        country,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        checkInLabel,
        checkOutLabel,
        confirmationCode,
        bookingProvider,
        roomType,
        guests: guests ?? 1,
        notes,
        googlePlaceId,
        googleMapsUrl,
        photoUrl,
        rating,
        phone,
        website,
      },
    });

    return NextResponse.json(stay, { status: 201 });
  } catch (error) {
    console.error("Failed to create stay:", error);
    return NextResponse.json({ error: "Failed to create stay" }, { status: 500 });
  }
}
