import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/documents — List documents with optional trip filter
export async function GET(req: NextRequest) {
  try {
    const tripId = req.nextUrl.searchParams.get("tripId");
    const type = req.nextUrl.searchParams.get("type");

    const where: Record<string, unknown> = {};
    if (tripId) where.tripId = tripId;
    if (type) where.type = type;

    const documents = await prisma.document.findMany({
      where,
      include: { trip: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

// POST /api/documents — Create a document record
// Note: actual file upload to Azure Blob happens via separate signed URL flow
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, fileUrl, fileName, fileSize, mimeType, tripId, notes } = body;

    if (!name || !type || !fileUrl || !fileName || !tripId) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, fileUrl, fileName, tripId" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        name,
        type,
        fileUrl,
        fileName,
        fileSize,
        mimeType,
        tripId,
        notes,
      },
      include: { trip: { select: { name: true } } },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Failed to create document:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
