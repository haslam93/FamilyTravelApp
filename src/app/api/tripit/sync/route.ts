// ─── TripIt Sync API Route ──────────────────────────────────────────────────
// POST /api/tripit/sync
// Fetches trips from TripIt and upserts them into the database.

import { NextResponse } from "next/server";
import { listTrips, getTrip } from "@/lib/tripit";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    // Fetch all trips from TripIt
    const tripsResponse = await listTrips();
    const trips = Array.isArray(tripsResponse.Trip)
      ? tripsResponse.Trip
      : tripsResponse.Trip
      ? [tripsResponse.Trip]
      : [];

    const syncedTrips = [];

    for (const tripData of trips as Record<string, unknown>[]) {
      const tripId = tripData.id as string;
      const tripDetail = await getTrip(tripId);

      // Upsert trip into database
      const trip = await prisma.trip.upsert({
        where: { tripItId: tripId },
        create: {
          name: (tripData.display_name as string) || "Untitled Trip",
          type: "SOLO", // Default, can be updated manually
          startDate: new Date(tripData.start_date as string),
          endDate: new Date(tripData.end_date as string),
          cities: [],
          countries: [],
          tripItId: tripId,
        },
        update: {
          name: (tripData.display_name as string) || "Untitled Trip",
          startDate: new Date(tripData.start_date as string),
          endDate: new Date(tripData.end_date as string),
        },
      });

      // Sync flights from TripIt
      const airSegments = tripDetail.AirObject
        ? Array.isArray(tripDetail.AirObject)
          ? tripDetail.AirObject
          : [tripDetail.AirObject]
        : [];

      for (const air of airSegments as Record<string, unknown>[]) {
        const segments = air.Segment
          ? Array.isArray(air.Segment)
            ? air.Segment
            : [air.Segment]
          : [];

        for (const segment of segments as Record<string, unknown>[]) {
          const startDateTime = segment.StartDateTime as Record<string, string> | undefined;
          const endDateTime = segment.EndDateTime as Record<string, string> | undefined;

          await prisma.flight.upsert({
            where: { tripItId: segment.id as string },
            create: {
              flightNumber: `${segment.marketing_airline_code || ""}${segment.marketing_flight_number || ""}`,
              airline: (segment.marketing_airline as string) || "Unknown",
              airlineCode: (segment.marketing_airline_code as string) || "",
              departureAirport: (segment.start_airport_code as string) || "",
              departureCity: (segment.start_city_name as string) || "",
              arrivalAirport: (segment.end_airport_code as string) || "",
              arrivalCity: (segment.end_city_name as string) || "",
              scheduledDeparture: new Date(
                `${startDateTime?.date || ""}T${startDateTime?.time || "00:00:00"}`
              ),
              scheduledArrival: new Date(
                `${endDateTime?.date || ""}T${endDateTime?.time || "00:00:00"}`
              ),
              aircraft: (segment.aircraft_display_name as string) || undefined,
              tripId: trip.id,
              tripItId: segment.id as string,
            },
            update: {
              flightNumber: `${segment.marketing_airline_code || ""}${segment.marketing_flight_number || ""}`,
              airline: (segment.marketing_airline as string) || "Unknown",
              scheduledDeparture: new Date(
                `${startDateTime?.date || ""}T${startDateTime?.time || "00:00:00"}`
              ),
              scheduledArrival: new Date(
                `${endDateTime?.date || ""}T${endDateTime?.time || "00:00:00"}`
              ),
            },
          });
        }
      }

      syncedTrips.push({ id: trip.id, name: trip.name });
    }

    return NextResponse.json({
      success: true,
      syncedTrips,
      count: syncedTrips.length,
    });
  } catch (error) {
    console.error("TripIt sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync with TripIt" },
      { status: 500 }
    );
  }
}
