import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getFallbackFlights } from "@/lib/fallback-data";

// GET /api/flights?tripId=xxx — List flights, optionally scoped to a trip
export async function GET(req: NextRequest) {
  const tripId = req.nextUrl.searchParams.get("tripId");

  try {
    const flights = await prisma.flight.findMany({
      where: tripId ? { tripId } : undefined,
      orderBy: [{ scheduledDeparture: "asc" }],
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error("Failed to fetch flights:", error);
    return NextResponse.json(getFallbackFlights(tripId), {
      headers: {
        "x-family-travel-data-source": "fallback",
      },
    });
  }
}

// POST /api/flights — Create a new flight
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tripId,
      flightNumber,
      confirmationCode,
      airline,
      airlineCode,
      airlineLogo,
      departureAirport,
      departureCity,
      arrivalAirport,
      arrivalCity,
      scheduledDeparture,
      scheduledArrival,
      actualDeparture,
      actualArrival,
      status,
      terminal,
      gate,
      baggageBelt,
      aircraft,
      lastChecked,
    } = body;

    if (
      !tripId ||
      !flightNumber ||
      !airline ||
      !departureAirport ||
      !departureCity ||
      !arrivalAirport ||
      !arrivalCity ||
      !scheduledDeparture ||
      !scheduledArrival
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: tripId, flightNumber, airline, departureAirport, departureCity, arrivalAirport, arrivalCity, scheduledDeparture, scheduledArrival",
        },
        { status: 400 }
      );
    }

    const flight = await prisma.flight.create({
      data: {
        tripId,
        flightNumber,
        confirmationCode,
        airline,
        airlineCode,
        airlineLogo,
        departureAirport,
        departureCity,
        arrivalAirport,
        arrivalCity,
        scheduledDeparture: new Date(scheduledDeparture),
        scheduledArrival: new Date(scheduledArrival),
        actualDeparture: actualDeparture ? new Date(actualDeparture) : null,
        actualArrival: actualArrival ? new Date(actualArrival) : null,
        status: status ?? "SCHEDULED",
        terminal,
        gate,
        baggageBelt,
        aircraft,
        lastChecked: lastChecked ? new Date(lastChecked) : null,
      },
    });

    return NextResponse.json(flight, { status: 201 });
  } catch (error) {
    console.error("Failed to create flight:", error);
    return NextResponse.json({ error: "Failed to create flight" }, { status: 500 });
  }
}
