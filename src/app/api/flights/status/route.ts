// ─── Flight Status API Route ────────────────────────────────────────────────
// GET /api/flights/status?flight=EK505
// Returns real-time flight status from AirLabs with 10-minute caching.

import { NextRequest, NextResponse } from "next/server";
import { getFlightStatus, mapAirLabsStatus } from "@/lib/flights";

export async function GET(request: NextRequest) {
  const flightNumber = request.nextUrl.searchParams.get("flight");

  if (!flightNumber) {
    return NextResponse.json(
      { error: "Missing ?flight= parameter" },
      { status: 400 }
    );
  }

  try {
    const status = await getFlightStatus(flightNumber);

    if (!status) {
      return NextResponse.json(
        { error: "Flight not found or API unavailable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      flightNumber: status.flight_iata,
      airline: status.airline_name,
      airlineCode: status.airline_iata,
      departure: {
        airport: status.dep_iata,
        city: status.dep_city,
        terminal: status.dep_terminal,
        gate: status.dep_gate,
        scheduled: status.dep_time,
        estimated: status.dep_estimated,
        actual: status.dep_actual,
      },
      arrival: {
        airport: status.arr_iata,
        city: status.arr_city,
        terminal: status.arr_terminal,
        gate: status.arr_gate,
        scheduled: status.arr_time,
        estimated: status.arr_estimated,
        actual: status.arr_actual,
        baggage: status.arr_baggage,
      },
      status: mapAirLabsStatus(status.status),
      aircraft: status.aircraft_icao,
    });
  } catch (error) {
    console.error("Flight status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight status" },
      { status: 500 }
    );
  }
}
