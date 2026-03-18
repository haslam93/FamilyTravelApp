import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PATCH /api/flights/[id] — Update a flight
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const flight = await prisma.flight.update({
      where: { id },
      data: {
        ...(body.flightNumber !== undefined && { flightNumber: body.flightNumber }),
        ...(body.confirmationCode !== undefined && {
          confirmationCode: body.confirmationCode,
        }),
        ...(body.airline !== undefined && { airline: body.airline }),
        ...(body.airlineCode !== undefined && { airlineCode: body.airlineCode }),
        ...(body.airlineLogo !== undefined && { airlineLogo: body.airlineLogo }),
        ...(body.departureAirport !== undefined && {
          departureAirport: body.departureAirport,
        }),
        ...(body.departureCity !== undefined && { departureCity: body.departureCity }),
        ...(body.arrivalAirport !== undefined && {
          arrivalAirport: body.arrivalAirport,
        }),
        ...(body.arrivalCity !== undefined && { arrivalCity: body.arrivalCity }),
        ...(body.scheduledDeparture !== undefined && {
          scheduledDeparture: new Date(body.scheduledDeparture),
        }),
        ...(body.scheduledArrival !== undefined && {
          scheduledArrival: new Date(body.scheduledArrival),
        }),
        ...(body.actualDeparture !== undefined && {
          actualDeparture: body.actualDeparture ? new Date(body.actualDeparture) : null,
        }),
        ...(body.actualArrival !== undefined && {
          actualArrival: body.actualArrival ? new Date(body.actualArrival) : null,
        }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.terminal !== undefined && { terminal: body.terminal }),
        ...(body.gate !== undefined && { gate: body.gate }),
        ...(body.baggageBelt !== undefined && { baggageBelt: body.baggageBelt }),
        ...(body.aircraft !== undefined && { aircraft: body.aircraft }),
        ...(body.lastChecked !== undefined && {
          lastChecked: body.lastChecked ? new Date(body.lastChecked) : null,
        }),
      },
    });

    return NextResponse.json(flight);
  } catch (error) {
    console.error("Failed to update flight:", error);
    return NextResponse.json({ error: "Failed to update flight" }, { status: 500 });
  }
}

// DELETE /api/flights/[id] — Delete a flight
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.flight.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete flight:", error);
    return NextResponse.json({ error: "Failed to delete flight" }, { status: 500 });
  }
}
