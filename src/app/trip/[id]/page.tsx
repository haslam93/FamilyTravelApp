"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Plane,
  FileText,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import { ActivityCard } from "@/components/activity-card";
import { SortableActivityList } from "@/components/sortable-activity-list";
import { AddActivityModal } from "@/components/add-activity-modal";
import {
  CITY_IMAGES,
  ACTIVITY_TYPE_EMOJI,
  TRIP_VISUALS,
} from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TripDay {
  id: string;
  date: string;
  dayNum: number;
  city: string;
  country: string;
  notes: string | null;
  activities: Activity[];
  places: Place[];
}

interface Activity {
  id: string;
  name: string;
  type: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
  sortOrder: number;
}

interface Place {
  id: string;
  name: string;
  category: string;
  visited: boolean;
  photoUrl: string | null;
}

interface TripData {
  id: string;
  name: string;
  type: "SOLO" | "FAMILY";
  status: string;
  startDate: string;
  endDate: string;
  cities: string[];
  countries: string[];
  coverImage: string | null;
  description: string | null;
  travelers: number;
  days: TripDay[];
  flights: FlightData[];
  documents: DocData[];
}

interface FlightData {
  id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  scheduledDeparture: string;
  status: string;
}

interface DocData {
  id: string;
  name: string;
  type: string;
}

// ─── Demo data (will be replaced with API calls) ────────────────────────────

const DEMO_TRIPS: Record<string, TripData> = {
  "india-solo-2026": {
    id: "india-solo-2026",
    name: "India Solo Adventure",
    type: "SOLO",
    status: "PLANNING",
    startDate: "2026-04-10",
    endDate: "2026-04-20",
    cities: ["Hyderabad", "Delhi"],
    countries: ["India"],
    coverImage: CITY_IMAGES.hyderabad.hero,
    description: "A solo exploration of Hyderabad and Delhi — street food, history, and tech hubs.",
    travelers: 1,
    days: [
      {
        id: "day-1",
        date: "2026-04-10",
        dayNum: 1,
        city: "Hyderabad",
        country: "India",
        notes: "Arrival day — settle in and explore Old City",
        activities: [
          { id: "a1", name: "Flight DXB → HYD", type: "FLIGHT", status: "PLANNED", startTime: "2026-04-10T08:30:00", endTime: "2026-04-10T13:00:00", notes: "Emirates EK505", sortOrder: 0 },
          { id: "a2", name: "Hotel Check-in", type: "HOTEL_CHECKIN", status: "PLANNED", startTime: "2026-04-10T14:00:00", endTime: null, notes: "Taj Falaknuma Palace", sortOrder: 1 },
          { id: "a3", name: "Charminar Visit", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-04-10T16:00:00", endTime: "2026-04-10T18:00:00", notes: null, sortOrder: 2 },
          { id: "a4", name: "Dinner at Paradise", type: "MEAL", status: "PLANNED", startTime: "2026-04-10T19:30:00", endTime: null, notes: "Famous Hyderabadi Biryani", sortOrder: 3 },
        ],
        places: [],
      },
      {
        id: "day-2",
        date: "2026-04-11",
        dayNum: 2,
        city: "Hyderabad",
        country: "India",
        notes: "Full exploration day",
        activities: [
          { id: "a5", name: "Golconda Fort", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-04-11T09:00:00", endTime: "2026-04-11T12:00:00", notes: "Morning visit for cooler weather", sortOrder: 0 },
          { id: "a6", name: "Lunch at Shadab", type: "MEAL", status: "PLANNED", startTime: "2026-04-11T12:30:00", endTime: null, notes: null, sortOrder: 1 },
          { id: "a7", name: "Salar Jung Museum", type: "MUSEUM", status: "PLANNED", startTime: "2026-04-11T14:00:00", endTime: "2026-04-11T17:00:00", notes: null, sortOrder: 2 },
        ],
        places: [],
      },
      {
        id: "day-3",
        date: "2026-04-12",
        dayNum: 3,
        city: "Hyderabad",
        country: "India",
        notes: "Tech and shopping day",
        activities: [
          { id: "a8", name: "HITEC City Visit", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-04-12T10:00:00", endTime: "2026-04-12T13:00:00", notes: "Explore tech campus area", sortOrder: 0 },
          { id: "a9", name: "Shopping at GVK One", type: "SHOPPING", status: "PLANNED", startTime: "2026-04-12T15:00:00", endTime: "2026-04-12T18:00:00", notes: null, sortOrder: 1 },
        ],
        places: [],
      },
    ],
    flights: [
      { id: "f1", flightNumber: "EK505", airline: "Emirates", departureCity: "Dubai", arrivalCity: "Hyderabad", scheduledDeparture: "2026-04-10T08:30:00", status: "SCHEDULED" },
      { id: "f2", flightNumber: "6E2341", airline: "IndiGo", departureCity: "Hyderabad", arrivalCity: "Delhi", scheduledDeparture: "2026-04-15T06:00:00", status: "SCHEDULED" },
    ],
    documents: [
      { id: "d1", name: "India Visa", type: "VISA" },
      { id: "d2", name: "Emirates Booking", type: "FLIGHT_BOOKING" },
    ],
  },
  "family-egypt-saudi-2026": {
    id: "family-egypt-saudi-2026",
    name: "Egypt & Umrah Family Trip",
    type: "FAMILY",
    status: "PLANNING",
    startDate: "2026-12-05",
    endDate: "2026-12-22",
    cities: ["Cairo", "Sharm El Sheikh", "Makkah", "Madinah"],
    countries: ["Egypt", "Saudi Arabia"],
    coverImage: CITY_IMAGES.cairo.hero,
    description: "Family trip combining Egypt sightseeing with Umrah in Saudi Arabia. 5 travelers including 3 kids.",
    travelers: 5,
    days: [
      {
        id: "day-f1",
        date: "2026-12-05",
        dayNum: 1,
        city: "Cairo",
        country: "Egypt",
        notes: "Arrival in Cairo",
        activities: [
          { id: "fa1", name: "Flight to Cairo", type: "FLIGHT", status: "PLANNED", startTime: "2026-12-05T07:00:00", endTime: "2026-12-05T10:30:00", notes: "EgyptAir MS916", sortOrder: 0 },
          { id: "fa2", name: "Hotel Check-in", type: "HOTEL_CHECKIN", status: "PLANNED", startTime: "2026-12-05T12:00:00", endTime: null, notes: "Four Seasons Cairo", sortOrder: 1 },
          { id: "fa3", name: "Rest & Settle", type: "REST", status: "PLANNED", startTime: "2026-12-05T13:00:00", endTime: "2026-12-05T16:00:00", notes: "Kids nap time", sortOrder: 2 },
        ],
        places: [],
      },
      {
        id: "day-f2",
        date: "2026-12-06",
        dayNum: 2,
        city: "Cairo",
        country: "Egypt",
        notes: "Pyramids day!",
        activities: [
          { id: "fa4", name: "Pyramids of Giza", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-12-06T08:00:00", endTime: "2026-12-06T12:00:00", notes: "Book guide in advance", sortOrder: 0 },
          { id: "fa5", name: "Sphinx Visit", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-12-06T12:00:00", endTime: "2026-12-06T13:00:00", notes: null, sortOrder: 1 },
          { id: "fa6", name: "Lunch", type: "MEAL", status: "PLANNED", startTime: "2026-12-06T13:30:00", endTime: null, notes: "Near Pyramids area", sortOrder: 2 },
          { id: "fa7", name: "Egyptian Museum", type: "MUSEUM", status: "PLANNED", startTime: "2026-12-06T15:00:00", endTime: "2026-12-06T17:00:00", notes: "Grand Egyptian Museum", sortOrder: 3 },
        ],
        places: [],
      },
    ],
    flights: [
      { id: "ff1", flightNumber: "MS916", airline: "EgyptAir", departureCity: "Dubai", arrivalCity: "Cairo", scheduledDeparture: "2026-12-05T07:00:00", status: "SCHEDULED" },
    ],
    documents: [
      { id: "fd1", name: "Passports", type: "PASSPORT" },
      { id: "fd2", name: "Egypt Visa", type: "VISA" },
      { id: "fd3", name: "Umrah Permit", type: "UMRAH_PERMIT" },
    ],
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<TripData | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activeTab, setActiveTab] = useState<"schedule" | "places" | "flights" | "docs">("schedule");

  useEffect(() => {
    // TODO: Replace with API call
    const data = DEMO_TRIPS[tripId];
    if (data) setTrip(data);
  }, [tripId]);

  const handleAddActivity = useCallback((activity: Omit<Activity, "id" | "sortOrder">) => {
    if (!trip) return;
    const newActivity: Activity = {
      ...activity,
      id: `new-${Date.now()}`,
      sortOrder: trip.days[selectedDay]?.activities.length ?? 0,
    };
    setTrip((prev) => {
      if (!prev) return prev;
      const days = [...prev.days];
      days[selectedDay] = {
        ...days[selectedDay],
        activities: [...days[selectedDay].activities, newActivity],
      };
      return { ...prev, days };
    });
    setShowAddActivity(false);
  }, [trip, selectedDay]);

  if (!trip) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">🗺️</div>
            <p className="text-lg font-bold text-slate-400">Trip not found</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-coral font-bold hover:underline"
            >
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const visuals = TRIP_VISUALS[trip.type];
  const currentDay = trip.days[selectedDay];
  const totalActivities = trip.days.reduce((sum, d) => sum + d.activities.length, 0);
  const doneActivities = trip.days.reduce(
    (sum, d) => sum + d.activities.filter((a) => a.status === "DONE").length,
    0
  );

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        {/* ─── Hero Banner ───────────────────────────────────────── */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          {trip.coverImage && (
            <Image
              src={trip.coverImage}
              alt={trip.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-t ${visuals.gradient} mix-blend-multiply opacity-70`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Back button */}
          <Link
            href="/"
            className="absolute top-4 left-4 z-10 glass rounded-full p-2 hover:scale-105 transition-transform"
          >
            <ChevronLeft size={20} className="text-slate-700" />
          </Link>

          {/* Trip info overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{visuals.emoji}</span>
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  {trip.type === "SOLO" ? "Solo Trip" : "Family Trip"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{trip.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-white/80 text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {" — "}
                  {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {trip.cities.join(", ")}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 space-y-6">
          {/* ─── Stats Strip ─────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Days", value: trip.days.length, emoji: "📅" },
              { label: "Activities", value: totalActivities, emoji: "📋" },
              { label: "Flights", value: trip.flights.length, emoji: "✈️" },
              { label: "Docs", value: trip.documents.length, emoji: "📄" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                className="glass rounded-2xl p-3 text-center"
              >
                <div className="text-xl mb-1">{stat.emoji}</div>
                <div className="text-xl font-black text-slate-800">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* ─── Progress Bar ────────────────────────────────────── */}
          {totalActivities > 0 && (
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Trip Progress</span>
                <span className="text-sm font-black text-coral">
                  {doneActivities}/{totalActivities}
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(doneActivities / totalActivities) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-coral to-sunset rounded-full"
                />
              </div>
            </div>
          )}

          {/* ─── Tab Bar ─────────────────────────────────────────── */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(
              [
                { key: "schedule", label: "Schedule", icon: CalendarDays, emoji: "📅" },
                { key: "places", label: "Places", icon: MapPin, emoji: "📍" },
                { key: "flights", label: "Flights", icon: Plane, emoji: "✈️" },
                { key: "docs", label: "Documents", icon: FileText, emoji: "📄" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-coral to-sunset text-white shadow-lg shadow-coral/25"
                    : "glass text-slate-500 hover:text-slate-700"
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Schedule Tab ────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeTab === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Day Selector */}
                {trip.days.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                      disabled={selectedDay === 0}
                      className="p-2 rounded-full glass disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="flex-1 overflow-x-auto scrollbar-hide">
                      <div className="flex gap-2">
                        {trip.days.map((day, i) => (
                          <button
                            key={day.id}
                            onClick={() => setSelectedDay(i)}
                            className={`flex-shrink-0 rounded-2xl px-4 py-2 text-center transition-all ${
                              i === selectedDay
                                ? "bg-gradient-to-r from-coral to-sunset text-white shadow-lg"
                                : "glass text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            <div className="text-xs font-bold">Day {day.dayNum}</div>
                            <div className="text-[10px] font-semibold opacity-80">
                              {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDay(Math.min(trip.days.length - 1, selectedDay + 1))}
                      disabled={selectedDay === trip.days.length - 1}
                      className="p-2 rounded-full glass disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Selected Day Header */}
                {currentDay && (
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-800">
                          Day {currentDay.dayNum} — {currentDay.city}
                        </h3>
                        <p className="text-sm text-slate-400 font-semibold">
                          {new Date(currentDay.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                          {" • "}
                          {currentDay.country}
                        </p>
                        {currentDay.notes && (
                          <p className="text-sm text-slate-500 mt-1 italic">
                            {currentDay.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowAddActivity(true)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-coral to-sunset text-white px-3 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-coral/25 hover:scale-105 transition-transform"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Activities Timeline */}
                {currentDay && (
                  <div className="space-y-3">
                    {currentDay.activities.length === 0 ? (
                      <div className="text-center py-12 glass rounded-2xl">
                        <div className="text-5xl mb-3">📝</div>
                        <p className="text-slate-400 font-bold">No activities yet</p>
                        <p className="text-sm text-slate-300">
                          Tap + to add your first activity
                        </p>
                      </div>
                    ) : (
                      <SortableActivityList
                        activities={currentDay.activities}
                        onReorder={(reordered) => {
                          setTrip((prev) => {
                            if (!prev) return prev;
                            const days = [...prev.days];
                            days[selectedDay] = { ...days[selectedDay], activities: reordered };
                            return { ...prev, days };
                          });
                        }}
                        onStatusChange={(activityId, newStatus) => {
                          setTrip((prev) => {
                            if (!prev) return prev;
                            const days = [...prev.days];
                            const acts = [...days[selectedDay].activities];
                            const idx = acts.findIndex((a) => a.id === activityId);
                            if (idx >= 0) acts[idx] = { ...acts[idx], status: newStatus };
                            days[selectedDay] = { ...days[selectedDay], activities: acts };
                            return { ...prev, days };
                          });
                        }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Places Tab ──────────────────────────────────────── */}
            {activeTab === "places" && (
              <motion.div
                key="places"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-lg font-bold text-slate-600">Places coming soon</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Visit the{" "}
                  <Link href="/places" className="text-coral font-bold hover:underline">
                    Places page
                  </Link>{" "}
                  to manage your places
                </p>
              </motion.div>
            )}

            {/* ─── Flights Tab ─────────────────────────────────────── */}
            {activeTab === "flights" && (
              <motion.div
                key="flights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {trip.flights.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">✈️</div>
                    <p className="text-slate-400 font-bold">No flights added yet</p>
                  </div>
                ) : (
                  trip.flights.map((flight) => (
                    <motion.div
                      key={flight.id}
                      whileHover={{ y: -2 }}
                      className="glass rounded-2xl p-4 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-ocean flex items-center justify-center text-white text-xl">
                        ✈️
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800">{flight.flightNumber}</p>
                        <p className="text-sm text-slate-400">
                          {flight.departureCity} → {flight.arrivalCity}
                        </p>
                        <p className="text-xs text-slate-300">
                          {new Date(flight.scheduledDeparture).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                        {flight.status}
                      </span>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* ─── Docs Tab ───────────────────────────────────────── */}
            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {trip.documents.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-slate-400 font-bold">No documents yet</p>
                  </div>
                ) : (
                  trip.documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ y: -2 }}
                      className="glass rounded-2xl p-4 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl">
                        📄
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">{doc.name}</p>
                        <p className="text-sm text-slate-400">{doc.type.replace(/_/g, " ")}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal
        open={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        onAdd={handleAddActivity}
      />
    </AppShell>
  );
}
