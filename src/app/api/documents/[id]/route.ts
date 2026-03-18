import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deleteStoredDocument, deleteUploadedFile, getStoredDocument, upsertStoredDocument } from "@/lib/document-store";

export const runtime = "nodejs";

// DELETE /api/documents/[id] — Delete a document record
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const existing = await prisma.document.findUnique({ where: { id } });

      await prisma.document.delete({ where: { id } });
      await deleteUploadedFile(existing?.fileUrl);
    } catch (prismaError) {
      console.error("Falling back to local document deletion:", prismaError);
      const existing = await deleteStoredDocument(id);

      if (!existing) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }

      await deleteUploadedFile(existing.fileUrl);
    }

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
    const patch = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.notes !== undefined && { notes: body.notes }),
    };

    try {
      const document = await prisma.document.update({
        where: { id },
        data: patch,
        include: { trip: { select: { id: true, name: true } } },
      });

      return NextResponse.json(document);
    } catch (prismaError) {
      console.error("Falling back to local document update:", prismaError);
      const existing = await getStoredDocument(id);

      if (!existing) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }

      const updated = await upsertStoredDocument({
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json(updated, {
        headers: {
          "x-family-travel-data-source": "local-fallback",
        },
      });
    }
  } catch (error) {
    console.error("Failed to update document:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}
