import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PATCH /api/activities/[id] — Update a single activity
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.startTime !== undefined && {
          startTime: body.startTime ? new Date(body.startTime) : null,
        }),
        ...(body.endTime !== undefined && {
          endTime: body.endTime ? new Date(body.endTime) : null,
        }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.placeId !== undefined && { placeId: body.placeId }),
      },
      include: { flight: true, place: true },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Failed to update activity:", error);
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

// DELETE /api/activities/[id] — Delete an activity
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.activity.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
