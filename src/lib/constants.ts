// ─── City Images ─────────────────────────────────────────────────────────────
// High-quality Unsplash images for each destination city.
// These are free-to-use images (Unsplash license, no attribution required in apps).

export const CITY_IMAGES: Record<string, { hero: string; thumb: string; credit: string }> = {
  hyderabad: {
    hero: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80",
    credit: "Charminar, Hyderabad",
  },
  delhi: {
    hero: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80",
    credit: "India Gate, New Delhi",
  },
  cairo: {
    hero: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=80",
    credit: "Pyramids of Giza, Cairo",
  },
  "sharm-el-sheikh": {
    hero: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
    credit: "Red Sea, Sharm El Sheikh",
  },
  makkah: {
    hero: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=400&q=80",
    credit: "Masjid al-Haram, Makkah",
  },
  madinah: {
    hero: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=400&q=80",
    credit: "Masjid an-Nabawi, Madinah",
  },
};

// ─── Airline Logos ───────────────────────────────────────────────────────────
// Using pics.avs.io for airline logos by IATA code

export function getAirlineLogo(iataCode: string, size: number = 200): string {
  return `https://pics.avs.io/${size}/80/${iataCode.toUpperCase()}.png`;
}

// Common airlines for these routes
export const AIRLINES: Record<string, { name: string; code: string; logo: string }> = {
  EK: { name: "Emirates", code: "EK", logo: getAirlineLogo("EK") },
  AI: { name: "Air India", code: "AI", logo: getAirlineLogo("AI") },
  "6E": { name: "IndiGo", code: "6E", logo: getAirlineLogo("6E") },
  SG: { name: "SpiceJet", code: "SG", logo: getAirlineLogo("SG") },
  MS: { name: "EgyptAir", code: "MS", logo: getAirlineLogo("MS") },
  SV: { name: "Saudia", code: "SV", logo: getAirlineLogo("SV") },
  FZ: { name: "flydubai", code: "FZ", logo: getAirlineLogo("FZ") },
  QR: { name: "Qatar Airways", code: "QR", logo: getAirlineLogo("QR") },
  TK: { name: "Turkish Airlines", code: "TK", logo: getAirlineLogo("TK") },
  WY: { name: "Oman Air", code: "WY", logo: getAirlineLogo("WY") },
};

// ─── Place Type Icons ────────────────────────────────────────────────────────

export const PLACE_CATEGORY_EMOJI: Record<string, string> = {
  EAT: "🍽️",
  VISIT: "🏛️",
  HOTEL: "🏨",
  PRAY: "🕌",
  SHOP: "🛍️",
  BEACH: "🏖️",
  MUSEUM: "🎨",
  PARK: "🌳",
  LANDMARK: "📸",
  OTHER: "📍",
};

// ─── Trip Type Visual Config ────────────────────────────────────────────────

export const TRIP_VISUALS = {
  SOLO: {
    emoji: "✈️",
    gradient: "from-sky-400 to-indigo-500",
    bgGradient: "from-sky-50 to-indigo-50",
    accentColor: "sky",
  },
  FAMILY: {
    emoji: "👨‍👩‍👧‍👦",
    gradient: "from-amber-400 to-rose-500",
    bgGradient: "from-amber-50 to-rose-50",
    accentColor: "amber",
  },
};

// ─── Activity Type Icons ────────────────────────────────────────────────────

export const ACTIVITY_TYPE_EMOJI: Record<string, string> = {
  FLIGHT: "✈️",
  SIGHTSEEING: "🏛️",
  MEAL: "🍽️",
  HOTEL_CHECKIN: "🏨",
  HOTEL_CHECKOUT: "🧳",
  TRANSPORT: "🚗",
  UMRAH: "🕋",
  PRAYER: "🤲",
  REST: "😴",
  SHOPPING: "🛍️",
  OTHER: "📌",
};

// ─── Flight Status Config ───────────────────────────────────────────────────

export const FLIGHT_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; animation?: string }> = {
  SCHEDULED: { label: "Scheduled", color: "text-slate-600", bgColor: "bg-slate-100" },
  ON_TIME: { label: "On Time", color: "text-emerald-700", bgColor: "bg-emerald-100", animation: "animate-pulse" },
  DELAYED: { label: "Delayed", color: "text-amber-700", bgColor: "bg-amber-100", animation: "animate-bounce" },
  BOARDING: { label: "Boarding", color: "text-blue-700", bgColor: "bg-blue-100", animation: "animate-pulse" },
  IN_FLIGHT: { label: "In Flight", color: "text-sky-700", bgColor: "bg-sky-100" },
  LANDED: { label: "Landed", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bgColor: "bg-red-100" },
  DIVERTED: { label: "Diverted", color: "text-orange-700", bgColor: "bg-orange-100" },
  UNKNOWN: { label: "Unknown", color: "text-gray-600", bgColor: "bg-gray-100" },
};

// ─── Google Maps URL Helper ─────────────────────────────────────────────────

export function getGoogleMapsUrl(placeId?: string, query?: string): string {
  if (placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  }
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  return "https://www.google.com/maps";
}

// ─── Family Member Avatars ──────────────────────────────────────────────────
// Drop your family photos into public/images/family/ and update paths here

export const FAMILY_MEMBERS = [
  { name: "Dad", avatar: "/images/family/dad.jpg", emoji: "👨" },
  { name: "Mom", avatar: "/images/family/mom.jpg", emoji: "👩" },
  { name: "Child 1", avatar: "/images/family/child1.jpg", emoji: "👧", age: 5 },
  { name: "Child 2", avatar: "/images/family/child2.jpg", emoji: "👦", age: 3 },
  { name: "Baby", avatar: "/images/family/baby.jpg", emoji: "👶", age: 1 },
];

// ─── Default Image Placeholder ──────────────────────────────────────────────

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23f0f0f0'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";
