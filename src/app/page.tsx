"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { TripCard } from "@/components/trip-card";
import { FlightBanner } from "@/components/flight-banner";
import { CITY_IMAGES } from "@/lib/constants";

// ─── Placeholder Data (will be replaced with DB queries) ─────────────────────

const DEMO_TRIPS = [
  {
    id: "india-solo-2026",
    name: "India Solo Adventure",
    type: "SOLO" as const,
    startDate: "2026-04-10",
    endDate: "2026-04-20",
    cities: ["Hyderabad", "Delhi"],
    countries: ["India"],
    coverImage: CITY_IMAGES.hyderabad.hero,
    travelers: 1,
    activitiesComplete: 0,
    activitiesTotal: 15,
  },
  {
    id: "family-egypt-saudi-2026",
    name: "Egypt & Umrah Family Trip",
    type: "FAMILY" as const,
    startDate: "2026-12-05",
    endDate: "2026-12-22",
    cities: ["Cairo", "Sharm El Sheikh", "Makkah", "Madinah"],
    countries: ["Egypt", "Saudi Arabia"],
    coverImage: CITY_IMAGES.cairo.hero,
    travelers: 5,
    activitiesComplete: 0,
    activitiesTotal: 40,
  },
];

const DEMO_FLIGHT = {
  flightNumber: "EK505",
  airline: "Emirates",
  airlineCode: "EK",
  departureCity: "Dubai",
  departureAirport: "DXB",
  arrivalCity: "Hyderabad",
  arrivalAirport: "HYD",
  scheduledDeparture: "2026-04-10T08:30:00",
  status: "SCHEDULED",
  gate: undefined,
  terminal: "3",
};

// ─── Page Container Animation ────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* ─── Header ──────────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["👨", "👩", "👧", "👦", "👶"].map((emoji, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 * i, type: "spring" }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-light to-bubblegum-light flex items-center justify-center text-lg border-2 border-white shadow-md"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
              <div className="ml-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                  Our Adventures
                </h1>
                <p className="text-sm text-slate-400 font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ─── Next Flight Banner ─────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2">
                <span>✈️</span> Next Flight
              </h2>
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-coral transition-colors">
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
            <FlightBanner {...DEMO_FLIGHT} />
          </motion.div>

          {/* ─── Trip Cards ─────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2 mb-4">
              <span>🗺️</span> Upcoming Trips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMO_TRIPS.map((trip) => (
                <TripCard key={trip.id} {...trip} />
              ))}
            </div>
          </motion.div>

          {/* ─── City Highlights ─────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2 mb-4">
              <span>🌍</span> Destinations
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(CITY_IMAGES).map(([key, img], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="relative h-28 rounded-2xl overflow-hidden shadow-md cursor-pointer group"
                >
                  <Image
                    src={img.thumb}
                    alt={img.credit}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="150px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-bold text-white truncate">
                      {key
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Quick Actions ───────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2 mb-4">
              <span>⚡</span> Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  emoji: "🔄",
                  label: "Sync TripIt",
                  gradient: "from-sky-400 to-blue-500",
                },
                {
                  emoji: "📍",
                  label: "Add Place",
                  gradient: "from-emerald-400 to-teal-500",
                },
                {
                  emoji: "📄",
                  label: "Upload Doc",
                  gradient: "from-amber-400 to-orange-500",
                },
                {
                  emoji: "📅",
                  label: "Sync Calendar",
                  gradient: "from-purple-400 to-pink-500",
                },
              ].map((action, i) => (
                <motion.button
                  key={action.label}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.gradient} p-4 text-white shadow-lg transition-all`}
                >
                  <span className="text-2xl mb-2 block">{action.emoji}</span>
                  <span className="text-xs font-bold block">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppShell>
  );
}
