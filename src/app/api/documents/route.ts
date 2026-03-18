import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";
import { DocumentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { FALLBACK_TRIPS_BY_ID } from "@/lib/fallback-data";
import {
  ensureUploadsDirectory,
  readStoredDocuments,
  upsertStoredDocument,
} from "@/lib/document-store";

export const runtime = "nodejs";

function withTripName<T extends { tripId: string }>(document: T) {
  return {
    ...document,
    trip: {
      id: document.tripId,
      name: FALLBACK_TRIPS_BY_ID[document.tripId]?.name ?? document.tripId,
    },
  };
}

function filterDocuments<T extends { tripId: string; type: string }>(
  documents: T[],
  tripId?: string | null,
  type?: string | null
) {
  return documents.filter((document) => {
    if (tripId && document.tripId !== tripId) {
      return false;
    }

    if (type && document.type !== type) {
      return false;
    }

    return true;
  });
}

function parseDocumentType(value: string) {
  return Object.values(DocumentType).includes(value as DocumentType)
    ? (value as DocumentType)
    : null;
}

// GET /api/documents — List documents with optional trip filter
export async function GET(req: NextRequest) {
  const tripId = req.nextUrl.searchParams.get("tripId");
  const type = req.nextUrl.searchParams.get("type");

  try {
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

    const fallbackDocuments = filterDocuments(await readStoredDocuments(), tripId, type)
      .map(withTripName)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

    return NextResponse.json(fallbackDocuments, {
      headers: {
        "x-family-travel-data-source": "local-fallback",
      },
    });
  }
}

// POST /api/documents — Upload a file and create a document record
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const name = String(formData.get("name") || "").trim();
    const parsedType = parseDocumentType(String(formData.get("type") || "").trim());
    const tripId = String(formData.get("tripId") || "").trim();
    const notes = String(formData.get("notes") || "").trim() || null;

    if (!(file instanceof File) || !name || !parsedType || !tripId) {
      return NextResponse.json(
        { error: "Missing required fields: file, name, type, tripId" },
        { status: 400 }
      );
    }

    await ensureUploadsDirectory();

    const sanitizedBaseName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const storedFileName = `${Date.now()}-${randomUUID()}-${sanitizedBaseName}`;
    const relativeFileUrl = `/uploads/${storedFileName}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", storedFileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(uploadPath, buffer);

    const documentPayload = {
      id: randomUUID(),
      name,
      type: parsedType,
      fileUrl: relativeFileUrl,
      fileName: file.name,
      fileSize: file.size || null,
      mimeType: file.type || null,
      tripId,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const document = await prisma.document.create({
        data: {
          name,
          type: parsedType,
          fileUrl: relativeFileUrl,
          fileName: file.name,
          fileSize: file.size || null,
          mimeType: file.type || null,
          tripId,
          notes,
        },
        include: { trip: { select: { id: true, name: true } } },
      });

      return NextResponse.json(document, { status: 201 });
    } catch (error) {
      console.error("Falling back to local document metadata store:", error);

      const storedDocument = await upsertStoredDocument(documentPayload);
      return NextResponse.json(withTripName(storedDocument), {
        status: 201,
        headers: {
          "x-family-travel-data-source": "local-fallback",
        },
      });
    }
  } catch (error) {
    console.error("Failed to create document:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
