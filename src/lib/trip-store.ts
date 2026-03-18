import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getFallbackTrip, FALLBACK_TRIPS } from "@/lib/fallback-data";

type TripOverride = {
  id: string;
  name?: string;
  type?: "SOLO" | "FAMILY";
  status?: string;
  startDate?: string;
  endDate?: string;
  cities?: string[];
  countries?: string[];
  coverImage?: string | null;
  description?: string | null;
  travelers?: number;
  updatedAt: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const tripOverridesFile = path.join(dataDirectory, "trip-overrides.json");

async function ensureDataDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

export async function readTripOverrides(): Promise<TripOverride[]> {
  await ensureDataDirectory();

  try {
    const content = await readFile(tripOverridesFile, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeTripOverrides(overrides: TripOverride[]) {
  await ensureDataDirectory();
  await writeFile(tripOverridesFile, JSON.stringify(overrides, null, 2), "utf8");
}

export async function upsertTripOverride(override: Omit<TripOverride, "updatedAt"> & { updatedAt?: string }) {
  const overrides = await readTripOverrides();
  const nextOverride: TripOverride = {
    ...override,
    updatedAt: override.updatedAt || new Date().toISOString(),
  };

  const nextOverrides = overrides.filter((entry) => entry.id !== override.id);
  nextOverrides.unshift(nextOverride);
  await writeTripOverrides(nextOverrides);
  return nextOverride;
}

function applyOverride<T extends { id: string }>(trip: T, override?: TripOverride | null) {
  if (!override) {
    return JSON.parse(JSON.stringify(trip)) as T;
  }

  return {
    ...JSON.parse(JSON.stringify(trip)),
    ...Object.fromEntries(Object.entries(override).filter(([key, value]) => key !== "id" && key !== "updatedAt" && value !== undefined)),
  } as T;
}

export async function getStoredTrip(id: string) {
  const overrides = await readTripOverrides();
  const baseTrip = getFallbackTrip(id);

  if (!baseTrip) {
    return null;
  }

  const override = overrides.find((entry) => entry.id === id);
  return applyOverride(baseTrip, override);
}

export async function getStoredTrips() {
  const overrides = await readTripOverrides();

  return FALLBACK_TRIPS.map((trip) => {
    const override = overrides.find((entry) => entry.id === trip.id);
    return applyOverride(trip, override);
  });
}
