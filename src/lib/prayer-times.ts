// ─── Aladhan API Client ──────────────────────────────────────────────────────
// https://aladhan.com/prayer-times-api
// Free API for Islamic prayer times — no API key required

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { en: string; ar: string };
      year: string;
    };
  };
}

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: Record<string, string>;
    date: {
      readable: string;
      hijri: {
        date: string;
        month: { en: string; ar: string; number: number };
        year: string;
      };
    };
  };
}

/**
 * Get prayer times for a specific city and date.
 * Uses the Aladhan API (Method 4 = Umm Al-Qura for Saudi Arabia).
 */
export async function getPrayerTimes(
  city: string,
  country: string,
  date?: Date,
  method: number = 4 // Umm Al-Qura
): Promise<PrayerTimes> {
  const d = date || new Date();
  const dateStr = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

  const url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
  if (!res.ok) {
    throw new Error(`Aladhan API error: ${res.status}`);
  }

  const json: AladhanResponse = await res.json();
  const { timings, date: dateInfo } = json.data;

  return {
    Fajr: timings.Fajr,
    Sunrise: timings.Sunrise,
    Dhuhr: timings.Dhuhr,
    Asr: timings.Asr,
    Maghrib: timings.Maghrib,
    Isha: timings.Isha,
    date: {
      readable: dateInfo.readable,
      hijri: {
        date: dateInfo.hijri.date,
        month: {
          en: dateInfo.hijri.month.en,
          ar: dateInfo.hijri.month.ar,
        },
        year: dateInfo.hijri.year,
      },
    },
  };
}

/**
 * Get prayer times for a date range (e.g., entire trip duration).
 */
export async function getPrayerTimesRange(
  city: string,
  country: string,
  startDate: Date,
  endDate: Date,
  method: number = 4
): Promise<PrayerTimes[]> {
  const results: PrayerTimes[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const times = await getPrayerTimes(city, country, new Date(current), method);
    results.push(times);
    current.setDate(current.getDate() + 1);
  }

  return results;
}

// ─── Prayer Time Helpers ─────────────────────────────────────────────────────

export const PRAYER_NAMES = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export const PRAYER_EMOJI: Record<string, string> = {
  Fajr: "🌅",
  Sunrise: "☀️",
  Dhuhr: "🕐",
  Asr: "🌤️",
  Maghrib: "🌇",
  Isha: "🌙",
};

export const PRAYER_COLORS: Record<string, { gradient: string; bg: string }> = {
  Fajr: { gradient: "from-indigo-400 to-blue-500", bg: "bg-indigo-50" },
  Sunrise: { gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50" },
  Dhuhr: { gradient: "from-sky-400 to-blue-500", bg: "bg-sky-50" },
  Asr: { gradient: "from-teal-400 to-emerald-500", bg: "bg-teal-50" },
  Maghrib: { gradient: "from-rose-400 to-pink-500", bg: "bg-rose-50" },
  Isha: { gradient: "from-slate-600 to-slate-800", bg: "bg-slate-100" },
};
