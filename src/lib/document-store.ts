import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

export type StoredDocumentRecord = {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  mimeType: string | null;
  tripId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
const documentsFile = path.join(dataDirectory, "documents.json");

async function ensureDataDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

export async function ensureUploadsDirectory() {
  await mkdir(uploadsDirectory, { recursive: true });
  return uploadsDirectory;
}

export async function readStoredDocuments(): Promise<StoredDocumentRecord[]> {
  await ensureDataDirectory();

  try {
    const content = await readFile(documentsFile, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeStoredDocuments(documents: StoredDocumentRecord[]) {
  await ensureDataDirectory();
  await writeFile(documentsFile, JSON.stringify(documents, null, 2), "utf8");
}

export async function upsertStoredDocument(document: StoredDocumentRecord) {
  const documents = await readStoredDocuments();
  const nextDocuments = documents.filter((entry) => entry.id !== document.id);
  nextDocuments.unshift(document);
  await writeStoredDocuments(nextDocuments);
  return document;
}

export async function getStoredDocument(id: string) {
  const documents = await readStoredDocuments();
  return documents.find((entry) => entry.id === id) ?? null;
}

export async function deleteStoredDocument(id: string) {
  const documents = await readStoredDocuments();
  const existing = documents.find((entry) => entry.id === id) ?? null;

  if (!existing) {
    return null;
  }

  await writeStoredDocuments(documents.filter((entry) => entry.id !== id));
  return existing;
}

export async function deleteUploadedFile(fileUrl: string | null | undefined) {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
    return;
  }

  const relativePath = fileUrl.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", relativePath.replace(/^uploads\//, "uploads/"));
  await rm(absolutePath, { force: true });
}