import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PATCH /api/stays/[id] — Update a stay
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const stay = await prisma.stay.update({
      where: { id },
      data: {
        ...(body.hotelName !== undefined && { hotelName: body.hotelName }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.country !== undefined && { country: body.country }),
        ...(body.checkIn !== undefined && { checkIn: new Date(body.checkIn) }),
        ...(body.checkOut !== undefined && { checkOut: new Date(body.checkOut) }),
        ...(body.checkInLabel !== undefined && {
          checkInLabel: body.checkInLabel,
        }),
        ...(body.checkOutLabel !== undefined && {
          checkOutLabel: body.checkOutLabel,
        }),
        ...(body.confirmationCode !== undefined && {
          confirmationCode: body.confirmationCode,
        }),
        ...(body.bookingProvider !== undefined && {
          bookingProvider: body.bookingProvider,
        }),
        ...(body.roomType !== undefined && { roomType: body.roomType }),
        ...(body.guests !== undefined && { guests: body.guests }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.googlePlaceId !== undefined && {
          googlePlaceId: body.googlePlaceId,
        }),
        ...(body.googleMapsUrl !== undefined && {
          googleMapsUrl: body.googleMapsUrl,
        }),
        ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.website !== undefined && { website: body.website }),
      },
    });

    return NextResponse.json(stay);
  } catch (error) {
    console.error("Failed to update stay:", error);
    return NextResponse.json({ error: "Failed to update stay" }, { status: 500 });
  }
}

// DELETE /api/stays/[id] — Delete a stay
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.stay.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete stay:", error);
    return NextResponse.json({ error: "Failed to delete stay" }, { status: 500 });
  }
}
