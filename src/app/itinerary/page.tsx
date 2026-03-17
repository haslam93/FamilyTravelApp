"use client";

import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CITY_IMAGES, TRIP_VISUALS, ACTIVITY_TYPE_EMOJI } from "@/lib/constants";

// ─── Demo Data ───────────────────────────────────────────────────────────────

const TRIPS_OVERVIEW = [
  {
    id: "india-solo-2026",
    name: "India Solo Adventure",
    type: "SOLO" as const,
    startDate: "2026-04-10",
    endDate: "2026-04-20",
    cities: ["Hyderabad", "Delhi"],
    coverImage: CITY_IMAGES.hyderabad.thumb,
    dayCount: 11,
    activityCount: 15,
    upcomingActivities: [
      { id: "1", name: "Flight DXB → HYD", type: "FLIGHT", time: "Apr 10, 8:30 AM" },
      { id: "2", name: "Hotel Check-in", type: "HOTEL_CHECKIN", time: "Apr 10, 2:00 PM" },
      { id: "3", name: "Charminar Visit", type: "SIGHTSEEING", time: "Apr 10, 4:00 PM" },
    ],
  },
  {
    id: "family-egypt-saudi-2026",
    name: "Egypt & Umrah Family Trip",
    type: "FAMILY" as const,
    startDate: "2026-12-05",
    endDate: "2026-12-22",
    cities: ["Cairo", "Sharm El Sheikh", "Makkah", "Madinah"],
    coverImage: CITY_IMAGES.cairo.thumb,
    dayCount: 18,
    activityCount: 40,
    upcomingActivities: [
      { id: "4", name: "Flight to Cairo", type: "FLIGHT", time: "Dec 5, 7:00 AM" },
      { id: "5", name: "Hotel Check-in", type: "HOTEL_CHECKIN", time: "Dec 5, 12:00 PM" },
      { id: "6", name: "Pyramids of Giza", type: "SIGHTSEEING", time: "Dec 6, 8:00 AM" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ItineraryPage() {
  const [currentTime] = useState(() => Date.now());

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <span className="text-3xl">📅</span> Itinerary
            </h1>
            <p className="text-sm text-slate-400 font-semibold">
              Your day-by-day travel schedule
            </p>
          </motion.div>

          {/* Trip Itinerary Cards */}
          {TRIPS_OVERVIEW.map((trip) => {
            const visuals = TRIP_VISUALS[trip.type];
            const daysUntil = Math.ceil(
              (new Date(trip.startDate).getTime() - currentTime) / (1000 * 60 * 60 * 24)
            );

            return (
              <motion.div key={trip.id} variants={itemVariants}>
                <Link href={`/trip/${trip.id}`}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="glass rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {/* Trip Header */}
                    <div className="relative h-28 overflow-hidden">
                      <Image
                        src={trip.coverImage}
                        alt={trip.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-r ${visuals.gradient} opacity-70`} />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-between px-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{visuals.emoji}</span>
                            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                              {trip.type} trip
                            </span>
                          </div>
                          <h2 className="text-xl font-black text-white">{trip.name}</h2>
                          <div className="flex items-center gap-3 mt-1 text-white/70 text-xs font-semibold">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={12} />
                              {trip.dayCount} days
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {trip.cities.join(", ")}
                            </span>
                          </div>
                        </div>

                        {daysUntil > 0 && (
                          <div className="glass rounded-2xl px-4 py-2 text-center">
                            <div className="text-xl font-black text-coral">{daysUntil}</div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase">days</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upcoming Activities Preview */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Upcoming Activities
                        </h3>
                        <span className="text-xs font-bold text-slate-300">
                          {trip.activityCount} total
                        </span>
                      </div>

                      <div className="space-y-2">
                        {trip.upcomingActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
                          >
                            <span className="text-base w-8 text-center">
                              {ACTIVITY_TYPE_EMOJI[activity.type] || "📌"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-700 truncate">
                                {activity.name}
                              </p>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0">
                              <Clock size={11} />
                              {activity.time}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-coral">
                        View full itinerary <ChevronRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AppShell>
  );
}
