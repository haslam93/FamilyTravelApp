"use client";

import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { PrayerTimesWidget } from "@/components/prayer-times-widget";
import { UmrahChecklist } from "@/components/umrah-checklist";
import { useState } from "react";
import { MapPin, Star, Heart, ExternalLink } from "lucide-react";

// ─── City Options for Prayer Times ──────────────────────────────────────────

const PRAYER_CITIES = [
  { city: "Makkah", country: "Saudi Arabia", emoji: "🕋" },
  { city: "Madinah", country: "Saudi Arabia", emoji: "🕌" },
  { city: "Cairo", country: "Egypt", emoji: "🇪🇬" },
  { city: "Sharm El Sheikh", country: "Egypt", emoji: "🏖️" },
  { city: "Hyderabad", country: "India", emoji: "🇮🇳" },
  { city: "Delhi", country: "India", emoji: "🇮🇳" },
];

// ─── Important Places in Makkah & Madinah ───────────────────────────────────

const HOLY_PLACES = [
  {
    name: "Masjid al-Haram",
    nameAr: "المسجد الحرام",
    city: "Makkah",
    emoji: "🕋",
    description: "The Sacred Mosque, home of the Ka'bah. The holiest site in Islam.",
    tips: [
      "Enter with your right foot",
      "Keep du'a ready for first sight of Ka'bah",
      "Use King Fahd Gate entrance for easy access",
      "Wheelchair accessible entrances available",
    ],
    coordinates: { lat: 21.4225, lng: 39.8262 },
  },
  {
    name: "Masjid an-Nabawi",
    nameAr: "المسجد النبوي",
    city: "Madinah",
    emoji: "🕌",
    description: "The Prophet's Mosque. Second holiest site in Islam.",
    tips: [
      "Visit Rawdah (Garden of Paradise) — green-carpeted area",
      "Send peace upon the Prophet ﷺ at the burial chamber",
      "Arrive early for a spot in Rawdah",
      "Separate times for men and women in Rawdah",
    ],
    coordinates: { lat: 24.4672, lng: 39.6112 },
  },
  {
    name: "Jabal al-Noor (Cave of Hira)",
    nameAr: "جبل النور",
    city: "Makkah",
    emoji: "⛰️",
    description: "The mountain where the first revelation of the Quran was received.",
    tips: [
      "Steep 2-hour climb — not suitable for young children",
      "Best visited early morning to avoid heat",
      "Bring water and wear comfortable shoes",
    ],
    coordinates: { lat: 21.4575, lng: 39.8583 },
  },
  {
    name: "Jannat al-Baqi",
    nameAr: "جنة البقيع",
    city: "Madinah",
    emoji: "🌿",
    description: "The blessed graveyard next to Masjid an-Nabawi. Many companions are buried here.",
    tips: [
      "Open after certain prayers — check schedule",
      "Make du'a for the departed",
      "Men only — women can make du'a from outside",
    ],
    coordinates: { lat: 24.4672, lng: 39.6145 },
  },
  {
    name: "Masjid Quba",
    nameAr: "مسجد قباء",
    city: "Madinah",
    emoji: "🕌",
    description: "The first mosque built in Islam. Praying 2 rak'ahs here equals an Umrah in reward.",
    tips: [
      "Visit on Saturday for extra reward (Sunnah)",
      "About 5 km from Masjid an-Nabawi",
      "Beautiful architecture — recently renovated",
    ],
    coordinates: { lat: 24.4398, lng: 39.6167 },
  },
  {
    name: "Mina, Arafat & Muzdalifah",
    nameAr: "منى، عرفات، مزدلفة",
    city: "Makkah",
    emoji: "🏕️",
    description: "The sacred sites of Hajj. Worth visiting to understand the Hajj journey.",
    tips: [
      "Can be visited as a day trip from Makkah",
      "Arafat: site of the Prophet's Farewell Sermon",
      "About 20 km from Masjid al-Haram",
    ],
    coordinates: { lat: 21.3547, lng: 39.9842 },
  },
];

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function UmrahPage() {
  const [selectedCity, setSelectedCity] = useState(PRAYER_CITIES[0]);
  const [activeSection, setActiveSection] = useState<"prayer" | "umrah" | "places">("prayer");

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/25">
              🕋
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800">
                Umrah & Prayer
              </h1>
              <p className="text-sm text-slate-400">
                Prayer times, step-by-step guide & du&apos;as
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide"
        >
          {[
            { id: "prayer" as const, label: "Prayer Times", emoji: "🕌" },
            { id: "umrah" as const, label: "Umrah Guide", emoji: "🕋" },
            { id: "places" as const, label: "Holy Places", emoji: "⭐" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-white/80 text-slate-500 hover:bg-white border border-slate-100"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Prayer Times Section */}
        {activeSection === "prayer" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* City Selector */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Select City
              </label>
              <div className="flex gap-2 flex-wrap">
                {PRAYER_CITIES.map((c) => (
                  <button
                    key={c.city}
                    onClick={() => setSelectedCity(c)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                      selectedCity.city === c.city
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                        : "bg-white/80 text-slate-600 hover:bg-white border border-slate-100"
                    }`}
                  >
                    <span>{c.emoji}</span>
                    {c.city}
                  </button>
                ))}
              </div>
            </div>

            {/* Prayer Times Widget */}
            <PrayerTimesWidget
              city={selectedCity.city}
              country={selectedCity.country}
            />

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4">
                <span className="text-2xl">🧭</span>
                <h3 className="font-bold text-slate-800 text-sm mt-2">
                  Qibla Direction
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedCity.city === "Makkah"
                    ? "You're at the Ka'bah! 🕋"
                    : `Face the Ka'bah in Makkah from ${selectedCity.city}`}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 p-4">
                <span className="text-2xl">📅</span>
                <h3 className="font-bold text-slate-800 text-sm mt-2">
                  Islamic Date
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hijri calendar date shown in the prayer times widget above
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Umrah Guide Section */}
        {activeSection === "umrah" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Intro Card */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 text-white mb-5 shadow-lg shadow-emerald-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-6 h-6" />
                <h2 className="text-lg font-bold">Complete Umrah Guide</h2>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Follow this step-by-step checklist for your Umrah journey. Each
                step includes du&apos;as, tips, and special notes for traveling
                with kids. Check off each step as you complete it!
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs opacity-80">
                <Heart className="w-3.5 h-3.5" />
                <span>
                  Kid-friendly notes included for families with young children
                </span>
              </div>
            </div>

            <UmrahChecklist />
          </motion.div>
        )}

        {/* Holy Places Section */}
        {activeSection === "places" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Makkah Places */}
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                🕋 Makkah al-Mukarramah
              </h2>
              <div className="space-y-3">
                {HOLY_PLACES.filter((p) => p.city === "Makkah").map((place) => (
                  <HolyPlaceCard key={place.name} place={place} />
                ))}
              </div>
            </div>

            {/* Madinah Places */}
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                🕌 Madinah al-Munawwarah
              </h2>
              <div className="space-y-3">
                {HOLY_PLACES.filter((p) => p.city === "Madinah").map((place) => (
                  <HolyPlaceCard key={place.name} place={place} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

// ─── Holy Place Card Component ───────────────────────────────────────────────

function HolyPlaceCard({
  place,
}: {
  place: (typeof HOLY_PLACES)[number];
}) {
  const [expanded, setExpanded] = useState(false);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`;

  return (
    <motion.div
      layout
      className="rounded-2xl bg-white/80 backdrop-blur-lg border border-slate-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 p-4 w-full text-left"
      >
        <span className="text-3xl">{place.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800">{place.name}</h3>
          <p className="text-xs text-slate-400">{place.nameAr}</p>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {place.description}
          </p>
        </div>
        <div className="flex items-center gap-1 text-emerald-500">
          <MapPin className="w-4 h-4" />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-4 pb-4 space-y-3"
        >
          <p className="text-sm text-slate-600 leading-relaxed">
            {place.description}
          </p>

          {place.tips.length > 0 && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
              <span className="text-xs font-bold text-emerald-700">
                💡 Tips for Your Visit
              </span>
              <div className="mt-2 space-y-1">
                {place.tips.map((tip, i) => (
                  <p key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    {tip}
                  </p>
                ))}
              </div>
            </div>
          )}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-shadow"
          >
            <MapPin className="w-4 h-4" />
            Open in Google Maps
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
