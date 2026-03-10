import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PATCH /api/places/[id] — Update a place (including visited toggle)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.category !== undefined) data.category = body.category;
    if (body.address !== undefined) data.address = body.address;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.kidFriendly !== undefined) data.kidFriendly = body.kidFriendly;
    if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl;
    if (body.tripDayId !== undefined) data.tripDayId = body.tripDayId;

    // Handle visited toggle
    if (body.visited !== undefined) {
      data.visited = body.visited;
      data.visitedAt = body.visited ? new Date() : null;
    }

    const place = await prisma.place.update({ where: { id }, data });

    return NextResponse.json(place);
  } catch (error) {
    console.error("Failed to update place:", error);
    return NextResponse.json({ error: "Failed to update place" }, { status: 500 });
  }
}

// DELETE /api/places/[id] — Delete a place
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.place.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete place:", error);
    return NextResponse.json({ error: "Failed to delete place" }, { status: 500 });
  }
}
