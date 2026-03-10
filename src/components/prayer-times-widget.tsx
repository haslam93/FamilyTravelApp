"use client";

import { motion } from "framer-motion";
import { PRAYER_EMOJI, PRAYER_COLORS, PRAYER_NAMES } from "@/lib/prayer-times";
import type { PrayerTimes } from "@/lib/prayer-times";
import { useEffect, useState } from "react";
import { Clock, MapPin, RefreshCw, Moon } from "lucide-react";

interface PrayerTimesWidgetProps {
  city?: string;
  country?: string;
  compact?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function PrayerTimesWidget({
  city = "Makkah",
  country = "Saudi Arabia",
  compact = false,
}: PrayerTimesWidgetProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/prayer-times?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
      );
      if (!res.ok) throw new Error("Failed to fetch prayer times");
      const data = await res.json();
      setPrayerTimes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, country]);

  // Determine current and next prayer
  useEffect(() => {
    if (!prayerTimes) return;

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const prayerOrder = PRAYER_NAMES.filter((n) => n !== "Sunrise");
    let foundCurrent: string | null = null;
    let foundNext: string | null = null;

    for (let i = prayerOrder.length - 1; i >= 0; i--) {
      const name = prayerOrder[i];
      const timeStr = prayerTimes[name as keyof PrayerTimes] as string;
      if (!timeStr || typeof timeStr !== "string") continue;

      const [h, m] = timeStr.split(":").map(Number);
      const prayerDate = new Date(`${todayStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);

      if (now >= prayerDate) {
        foundCurrent = name;
        foundNext = i < prayerOrder.length - 1 ? prayerOrder[i + 1] : prayerOrder[0];
        break;
      }
    }

    if (!foundCurrent) {
      foundCurrent = prayerOrder[prayerOrder.length - 1];
      foundNext = prayerOrder[0];
    }

    setCurrentPrayer(foundCurrent);
    setNextPrayer(foundNext);
  }, [prayerTimes]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white/80 backdrop-blur-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded-full w-40 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-red-50 border border-red-100 p-6 text-center">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={fetchPrayerTimes}
          className="mt-2 text-sm text-red-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!prayerTimes) return null;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white shadow-lg shadow-emerald-500/20"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            <span className="text-sm font-bold">Prayer Times</span>
          </div>
          <span className="text-[10px] opacity-80">{city}</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {PRAYER_NAMES.filter((n) => n !== "Sunrise").map((name) => {
            const time = prayerTimes[name as keyof PrayerTimes] as string;
            const isCurrent = name === currentPrayer;
            return (
              <div
                key={name}
                className={`flex flex-col items-center min-w-[52px] rounded-xl px-2 py-1.5 ${
                  isCurrent
                    ? "bg-white/25 ring-2 ring-white/50"
                    : "bg-white/10"
                }`}
              >
                <span className="text-xs">{PRAYER_EMOJI[name]}</span>
                <span className="text-[10px] font-medium opacity-90">{name}</span>
                <span className="text-xs font-bold">{time}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-lg border border-white/50 shadow-xl shadow-emerald-500/5 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕌</span>
            <div>
              <h3 className="font-bold text-lg">Prayer Times</h3>
              {prayerTimes.date?.hijri && (
                <p className="text-[11px] opacity-80">
                  {prayerTimes.date.hijri.date} {prayerTimes.date.hijri.month.en}{" "}
                  {prayerTimes.date.hijri.year} AH
                </p>
              )}
            </div>
          </div>
          <button
            onClick={fetchPrayerTimes}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs opacity-90">
          <MapPin className="w-3 h-3" />
          <span>{city}, {country}</span>
          <span className="mx-1">•</span>
          <Clock className="w-3 h-3" />
          <span>{prayerTimes.date?.readable}</span>
        </div>

        {nextPrayer && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-white/15 backdrop-blur-sm">
            <p className="text-xs opacity-80">Next Prayer</p>
            <p className="text-lg font-bold">
              {PRAYER_EMOJI[nextPrayer]} {nextPrayer} —{" "}
              {prayerTimes[nextPrayer as keyof PrayerTimes] as string}
            </p>
          </div>
        )}
      </div>

      {/* Prayer Time Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4"
      >
        {PRAYER_NAMES.map((name) => {
          const time = prayerTimes[name as keyof PrayerTimes] as string;
          const colors = PRAYER_COLORS[name];
          const isCurrent = name === currentPrayer;
          const isNext = name === nextPrayer;

          return (
            <motion.div
              key={name}
              variants={item}
              className={`relative rounded-2xl p-4 text-center transition-all ${
                isCurrent
                  ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg scale-[1.02]`
                  : isNext
                  ? `${colors.bg} ring-2 ring-offset-1 ring-emerald-300`
                  : colors.bg
              }`}
            >
              {isCurrent && (
                <div className="absolute top-2 right-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                </div>
              )}
              <span className="text-2xl">{PRAYER_EMOJI[name]}</span>
              <p
                className={`text-xs font-semibold mt-1 ${
                  isCurrent ? "text-white/90" : "text-slate-500"
                }`}
              >
                {name}
              </p>
              <p
                className={`text-lg font-bold ${
                  isCurrent ? "text-white" : "text-slate-800"
                }`}
              >
                {time}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
