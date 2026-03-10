import { NextResponse } from "next/server";
import { getPrayerTimes } from "@/lib/prayer-times";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Makkah";
  const country = searchParams.get("country") || "Saudi Arabia";
  const method = parseInt(searchParams.get("method") || "4", 10); // Default: Umm Al-Qura

  try {
    const prayerTimes = await getPrayerTimes(city, country, new Date(), method);
    return NextResponse.json(prayerTimes);
  } catch (error) {
    console.error("Prayer times API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayer times" },
      { status: 500 }
    );
  }
}
