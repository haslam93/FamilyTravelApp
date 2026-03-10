// ─── Nearby Recommendations API ─────────────────────────────────────────────
// GET /api/recommendations?lat=...&lng=...&type=...&kidFriendly=true
// Uses Google Places Nearby Search to find nearby recommendations.

import { NextRequest, NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Kid-friendly place types to boost
const KID_FRIENDLY_TYPES = [
  "amusement_park",
  "aquarium",
  "zoo",
  "park",
  "museum",
  "shopping_mall",
  "ice_cream",
  "bakery",
];

interface PlaceResult {
  id: string;
  name: string;
  vicinity: string;
  rating: number;
  userRatingsTotal: number;
  types: string[];
  photoReference: string | null;
  lat: number;
  lng: number;
  openNow: boolean | null;
  priceLevel: number | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const type = searchParams.get("type") || "tourist_attraction";
  const radius = searchParams.get("radius") || "5000";
  const kidFriendly = searchParams.get("kidFriendly") === "true";
  const openNow = searchParams.get("openNow") === "true";

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "lat and lng query parameters are required" },
      { status: 400 }
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 500 }
    );
  }

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    );
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", radius);
    url.searchParams.set("type", type);
    url.searchParams.set("key", GOOGLE_MAPS_API_KEY);
    if (openNow) url.searchParams.set("opennow", "true");

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Places API error:", data.status, data.error_message);
      return NextResponse.json(
        { error: `Places API error: ${data.status}` },
        { status: 500 }
      );
    }

    let places: PlaceResult[] = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      vicinity: place.vicinity || "",
      rating: place.rating || 0,
      userRatingsTotal: place.user_ratings_total || 0,
      types: place.types || [],
      photoReference: place.photos?.[0]?.photo_reference || null,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      openNow: place.opening_hours?.open_now ?? null,
      priceLevel: place.price_level ?? null,
    }));

    // Filter for kid-friendly if requested
    if (kidFriendly) {
      places = places.filter(
        (p) =>
          p.types.some((t) => KID_FRIENDLY_TYPES.includes(t)) || p.rating >= 4.0
      );
    }

    // Sort by rating (descending)
    places.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({
      places,
      total: places.length,
    });
  } catch (err) {
    console.error("Recommendations error:", err);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
