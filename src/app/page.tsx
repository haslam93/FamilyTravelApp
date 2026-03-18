"use client";

import { motion } from "framer-motion";
import { Plane, MapPin, Calendar, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { FlightBanner } from "@/components/flight-banner";
import { TripCard } from "@/components/trip-card";
import { CITY_IMAGES } from "@/lib/constants";

interface ActivitySummary {
  id: string;
  status: string;
}

interface TripDaySummary {
  id: string;
  activities: ActivitySummary[];
}

interface FlightSummary {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string | null;
  departureCity: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  status: string;
  gate: string | null;
  terminal: string | null;
}

interface TripSummary {
  id: string;
  name: string;
  type: "SOLO" | "FAMILY";
  startDate: string;
  endDate: string;
  cities: string[];
  countries: string[];
  coverImage: string | null;
  travelers: number;
  days: TripDaySummary[];
  flights: FlightSummary[];
}

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

function getFallbackImage(city?: string) {
  const normalized = city?.toLowerCase().replace(/\s+/g, "-");
  return normalized && CITY_IMAGES[normalized] ? CITY_IMAGES[normalized].hero : CITY_IMAGES.cairo.hero;
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await fetch("/api/trips", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load trips.");
        }

        const data = await response.json();
        setTrips(data);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load trips.");
      } finally {
        setLoading(false);
      }
    };

    void loadTrips();
  }, []);

  useEffect(() => {
    setCurrentTimestamp(Date.now());
    setTodayLabel(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  const tripCards = trips.map((trip) => ({
    id: trip.id,
    name: trip.name,
    type: trip.type,
    startDate: trip.startDate,
    endDate: trip.endDate,
    cities: trip.cities,
    countries: trip.countries,
    coverImage: trip.coverImage || getFallbackImage(trip.cities[0]),
    travelers: trip.travelers,
    activitiesComplete: trip.days.reduce(
      (sum, day) => sum + day.activities.filter((activity) => activity.status === "DONE").length,
      0
    ),
    activitiesTotal: trip.days.reduce((sum, day) => sum + day.activities.length, 0),
  }));

  const upcomingFlights = trips
    .flatMap((trip) => trip.flights)
    .filter(
      (flight) => currentTimestamp !== null && new Date(flight.scheduledDeparture).getTime() >= currentTimestamp
    )
    .sort(
      (left, right) =>
        new Date(left.scheduledDeparture).getTime() -
        new Date(right.scheduledDeparture).getTime()
    );
  const nextFlight = upcomingFlights[0];

  const totalDestinations = new Set(trips.flatMap((trip) => trip.cities)).size;
  const totalDays = trips.reduce((sum, trip) => sum + trip.days.length, 0);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative overflow-hidden">
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
          <motion.div
            variants={itemVariants}
            className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-coral via-sunset to-bubblegum p-6 sm:p-8 text-white shadow-2xl shadow-coral/30"
          >
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
                The Aslam Family
                <br />
                <span className="text-white/80">Adventures ✨</span>
              </motion.h1>

              <motion.p
                className="mt-2 text-white/70 font-semibold text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {todayLabel || " "}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-2 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1.5">
                  <Plane size={12} /> {trips.length} Trips Planned
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1.5">
                  <MapPin size={12} /> {totalDestinations} Destinations
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1.5">
                  <Calendar size={12} /> {totalDays} Days Total
                </span>
              </motion.div>
            </div>
          </motion.div>

          {error && (
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              {error}
            </div>
          )}

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
            {nextFlight ? (
              <FlightBanner
                flightNumber={nextFlight.flightNumber}
                airline={nextFlight.airline}
                airlineCode={nextFlight.airlineCode || nextFlight.airline.slice(0, 2).toUpperCase()}
                departureCity={nextFlight.departureCity}
                departureAirport={nextFlight.departureAirport}
                arrivalCity={nextFlight.arrivalCity}
                arrivalAirport={nextFlight.arrivalAirport}
                scheduledDeparture={nextFlight.scheduledDeparture}
                status={nextFlight.status}
                gate={nextFlight.gate || undefined}
                terminal={nextFlight.terminal || undefined}
              />
            ) : (
              <div className="rounded-3xl bg-slate-100 px-5 py-8 text-center text-slate-500 font-semibold">
                {loading ? "Loading upcoming flights..." : "No upcoming flights saved yet."}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2">
                <span>🗺️</span> Our Trips
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tripCards.map((trip, i) => (
                <motion.div key={trip.id} variants={scaleIn} custom={i}>
                  <TripCard {...trip} />
                </motion.div>
              ))}
            </div>
            {!loading && tripCards.length === 0 && (
              <div className="rounded-3xl bg-slate-100 px-5 py-8 text-center text-slate-500 font-semibold mt-4">
                No trips in the database yet.
              </div>
            )}
          </motion.div>

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
                      {key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-[10px] text-white/60 font-semibold mt-0.5">{img.credit}</p>
                  </div>
                  <div className="absolute inset-0 rounded-[1.4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-white/40 ring-inset" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2 mb-4">
              <span>⚡</span> Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  emoji: "✈️",
                  label: "Manage Flights",
                  gradient: "from-sky-400 to-ocean",
                  href: "/flights",
                },
                {
                  emoji: "🏨",
                  label: "Manage Stays",
                  gradient: "from-indigo-400 to-violet-500",
                  href: "/stays",
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
