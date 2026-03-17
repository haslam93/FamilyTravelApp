"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Plane, MapPin, Calendar, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { TripCard } from "@/components/trip-card";
import { FlightBanner } from "@/components/flight-banner";
import { CITY_IMAGES } from "@/lib/constants";

// ─── Data ────────────────────────────────────────────────────────────────────

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
    activitiesComplete: 3,
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

// ─── Animated floating elements ──────────────────────────────────────────────

function FloatingEmoji({ emoji, delay, x, y }: { emoji: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute text-2xl sm:text-3xl pointer-events-none select-none opacity-30"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -15, 0, 10, 0],
        rotate: [0, 8, -8, 5, 0],
        scale: [1, 1.1, 1, 0.95, 1],
      }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {emoji}
    </motion.div>
  );
}

// ─── Animations ──────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 15 } },
};

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative overflow-hidden">
        {/* Floating background emojis */}
        <FloatingEmoji emoji="✈️" delay={0} x="85%" y="5%" />
        <FloatingEmoji emoji="🌴" delay={1.5} x="5%" y="15%" />
        <FloatingEmoji emoji="🕌" delay={0.8} x="92%" y="50%" />
        <FloatingEmoji emoji="🏖️" delay={2} x="3%" y="65%" />
        <FloatingEmoji emoji="🐪" delay={1.2} x="88%" y="80%" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8 relative z-10"
        >
          {/* ─── Welcome Hero ────────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-coral via-sunset to-bubblegum p-6 sm:p-8 text-white shadow-2xl shadow-coral/30"
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/5" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-3">
                  {["👨", "👩", "👧", "👦", "👶"].map((emoji, i) => (
                    <motion.div
                      key={i}
                      variants={scaleIn}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl border-2 border-white/30 shadow-lg"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.h1
                className="text-3xl sm:text-4xl font-black leading-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                The Aslam Family<br />
                <span className="text-white/80">Adventures ✨</span>
              </motion.h1>

              <motion.p
                className="mt-2 text-white/70 font-semibold text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </motion.p>

              {/* Quick stat pills */}
              <motion.div
                className="flex flex-wrap gap-2 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1.5">
                  <Plane size={12} /> 2 Trips Planned
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1.5">
                  <MapPin size={12} /> 6 Destinations
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1.5">
                  <Calendar size={12} /> 27 Days Total
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* ─── Next Flight ──────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 5 }}
                >
                  ✈️
                </motion.span>
                Next Flight
              </h2>
              <Link
                href="/flights"
                className="text-xs font-bold text-coral hover:text-sunset transition-colors flex items-center gap-1"
              >
                View all <Sparkles size={12} />
              </Link>
            </div>
            <FlightBanner {...DEMO_FLIGHT} />
          </motion.div>

          {/* ─── Trip Cards ──────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2">
                <span>🗺️</span> Our Trips
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMO_TRIPS.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  variants={scaleIn}
                  custom={i}
                >
                  <TripCard {...trip} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Destinations Carousel ───────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2 mb-4">
              <span>🌍</span> Destinations
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(CITY_IMAGES).map(([key, img], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.7, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.06 * i, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.08, y: -6, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative h-32 sm:h-36 rounded-[1.4rem] overflow-hidden shadow-lg cursor-pointer group"
                >
                  <Image
                    src={img.thumb}
                    alt={img.credit}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-120"
                    sizes="180px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs font-black text-white drop-shadow-lg">
                      {key
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-[10px] text-white/60 font-semibold mt-0.5">
                      {img.credit}
                    </p>
                  </div>
                  {/* Hover glow ring */}
                  <div className="absolute inset-0 rounded-[1.4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-white/40 ring-inset" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Quick Actions ───────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2 mb-4">
              <span>⚡</span> Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  emoji: "✈️",
                  label: "Add Flight",
                  gradient: "from-sky-400 to-ocean",
                  href: "/flights",
                },
                {
                  emoji: "📍",
                  label: "Add Place",
                  gradient: "from-emerald-400 to-teal-500",
                  href: "/places",
                },
                {
                  emoji: "📄",
                  label: "Upload Doc",
                  gradient: "from-amber-400 to-orange-500",
                  href: "/documents",
                },
                {
                  emoji: "📅",
                  label: "Calendar",
                  gradient: "from-purple-400 to-pink-500",
                  href: "/settings",
                },
                {
                  emoji: "🕌",
                  label: "Umrah Guide",
                  gradient: "from-emerald-500 to-green-600",
                  href: "/umrah",
                },
                {
                  emoji: "🧭",
                  label: "Discover",
                  gradient: "from-coral to-bubblegum",
                  href: "/recommendations",
                },
              ].map((action, i) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.gradient} p-5 text-white shadow-xl hover:shadow-2xl transition-shadow cursor-pointer`}
                  >
                    {/* Decorative circle */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
                    <span className="text-3xl mb-2 block">{action.emoji}</span>
                    <span className="text-sm font-bold block">{action.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppShell>
  );
}
