import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// DELETE /api/documents/[id] — Delete a document record
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Also delete from Azure Blob Storage
    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete document:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}

// PATCH /api/documents/[id] — Update document metadata
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const document = await prisma.document.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Failed to update document:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}
