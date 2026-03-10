// ─── AirLabs Flight Tracking Client ─────────────────────────────────────────
// Free tier: 1,000 queries/month
// Docs: https://airlabs.co/docs/

const AIRLABS_BASE = "https://airlabs.co/api/v9";

interface FlightStatusResponse {
  flight_number: string;
  flight_iata: string;
  airline_iata: string;
  airline_name: string;
  dep_iata: string;
  dep_city: string;
  dep_terminal: string;
  dep_gate: string;
  dep_time: string;
  dep_estimated: string;
  dep_actual: string;
  arr_iata: string;
  arr_city: string;
  arr_terminal: string;
  arr_gate: string;
  arr_time: string;
  arr_estimated: string;
  arr_actual: string;
  arr_baggage: string;
  status: string;
  aircraft_icao: string;
}

// Simple in-memory cache (10-minute TTL)
const cache = new Map<string, { data: FlightStatusResponse; expires: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function getFlightStatus(
  flightIata: string
): Promise<FlightStatusResponse | null> {
  const cacheKey = flightIata.toUpperCase();
  const cached = cache.get(cacheKey);

  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const apiKey = process.env.AIRLABS_API_KEY;
  if (!apiKey) {
    console.warn("AIRLABS_API_KEY not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${AIRLABS_BASE}/flight?flight_iata=${cacheKey}&api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`AirLabs API error: ${response.status}`);
    }

    const json = await response.json();
    const data = json.response as FlightStatusResponse;

    if (data) {
      cache.set(cacheKey, { data, expires: Date.now() + CACHE_TTL });
    }

    return data || null;
  } catch (error) {
    console.error("Flight status fetch error:", error);
    return null;
  }
}

export function mapAirLabsStatus(status: string): string {
  const statusMap: Record<string, string> = {
    scheduled: "SCHEDULED",
    active: "IN_FLIGHT",
    landed: "LANDED",
    cancelled: "CANCELLED",
    incident: "DIVERTED",
    diverted: "DIVERTED",
    en_route: "IN_FLIGHT",
  };
  return statusMap[status?.toLowerCase()] || "UNKNOWN";
}
