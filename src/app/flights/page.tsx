"use client";

import { motion } from "framer-motion";
import {
  Plane,
  RefreshCw,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  getAirlineLogo,
  FLIGHT_STATUS_CONFIG,
} from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  departureCity: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: string;
  terminal: string | null;
  gate: string | null;
  tripName: string;
}

// ─── Demo Data ───────────────────────────────────────────────────────────────

const DEMO_FLIGHTS: Flight[] = [
  {
    id: "f1",
    flightNumber: "EK505",
    airline: "Emirates",
    airlineCode: "EK",
    departureCity: "Dubai",
    departureAirport: "DXB",
    arrivalCity: "Hyderabad",
    arrivalAirport: "HYD",
    scheduledDeparture: "2026-04-10T08:30:00",
    scheduledArrival: "2026-04-10T13:00:00",
    status: "SCHEDULED",
    terminal: "3",
    gate: null,
    tripName: "India Solo Adventure",
  },
  {
    id: "f2",
    flightNumber: "6E2341",
    airline: "IndiGo",
    airlineCode: "6E",
    departureCity: "Hyderabad",
    departureAirport: "HYD",
    arrivalCity: "Delhi",
    arrivalAirport: "DEL",
    scheduledDeparture: "2026-04-15T06:00:00",
    scheduledArrival: "2026-04-15T08:30:00",
    status: "SCHEDULED",
    terminal: "1",
    gate: null,
    tripName: "India Solo Adventure",
  },
  {
    id: "f3",
    flightNumber: "EK511",
    airline: "Emirates",
    airlineCode: "EK",
    departureCity: "Delhi",
    departureAirport: "DEL",
    arrivalCity: "Dubai",
    arrivalAirport: "DXB",
    scheduledDeparture: "2026-04-20T14:00:00",
    scheduledArrival: "2026-04-20T16:30:00",
    status: "SCHEDULED",
    terminal: "3",
    gate: null,
    tripName: "India Solo Adventure",
  },
  {
    id: "f4",
    flightNumber: "MS916",
    airline: "EgyptAir",
    airlineCode: "MS",
    departureCity: "Dubai",
    departureAirport: "DXB",
    arrivalCity: "Cairo",
    arrivalAirport: "CAI",
    scheduledDeparture: "2026-12-05T07:00:00",
    scheduledArrival: "2026-12-05T09:30:00",
    status: "SCHEDULED",
    terminal: "1",
    gate: null,
    tripName: "Egypt & Umrah Family Trip",
  },
  {
    id: "f5",
    flightNumber: "MS714",
    airline: "EgyptAir",
    airlineCode: "MS",
    departureCity: "Cairo",
    departureAirport: "CAI",
    arrivalCity: "Sharm El Sheikh",
    arrivalAirport: "SSH",
    scheduledDeparture: "2026-12-10T10:00:00",
    scheduledArrival: "2026-12-10T11:00:00",
    status: "SCHEDULED",
    terminal: null,
    gate: null,
    tripName: "Egypt & Umrah Family Trip",
  },
  {
    id: "f6",
    flightNumber: "SV1234",
    airline: "Saudia",
    airlineCode: "SV",
    departureCity: "Sharm El Sheikh",
    departureAirport: "SSH",
    arrivalCity: "Jeddah",
    arrivalAirport: "JED",
    scheduledDeparture: "2026-12-14T12:00:00",
    scheduledArrival: "2026-12-14T14:00:00",
    status: "SCHEDULED",
    terminal: null,
    gate: null,
    tripName: "Egypt & Umrah Family Trip",
  },
];

function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(dateStr).toLocaleDateString("en-US", options || { month: "short", day: "numeric" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function getDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function FlightsPage() {
  const [flights] = useState<Flight[]>(DEMO_FLIGHTS);
  const [refreshing, setRefreshing] = useState(false);

  // Group by trip
  const grouped: Record<string, Flight[]> = {};
  flights.forEach((f) => {
    if (!grouped[f.tripName]) grouped[f.tripName] = [];
    grouped[f.tripName].push(f);
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: call /api/flights/status for each flight
    await new Promise((r) => setTimeout(r, 1500));
    setRefreshing(false);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <span className="text-3xl">✈️</span> Flights
              </h1>
              <p className="text-sm text-slate-400 font-semibold">
                {flights.length} flight{flights.length !== 1 ? "s" : ""} tracked
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 glass px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:text-coral disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Checking..." : "Refresh Status"}
            </motion.button>
          </motion.div>

          {/* Flight Groups */}
          {Object.entries(grouped).map(([tripName, tripFlights]) => (
            <motion.div key={tripName} variants={itemVariants} className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <Plane size={16} className="text-coral" />
                {tripName}
              </h2>

              <div className="space-y-3">
                {tripFlights.map((flight) => {
                  const statusConfig = FLIGHT_STATUS_CONFIG[flight.status] || FLIGHT_STATUS_CONFIG.UNKNOWN;
                  const daysUntil = getDaysUntil(flight.scheduledDeparture);

                  return (
                    <motion.div
                      key={flight.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className="glass rounded-3xl p-5 shadow-md hover:shadow-lg transition-all"
                    >
                      {/* Top Row: Airline + Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                            <Image
                              src={getAirlineLogo(flight.airlineCode, 80)}
                              alt={flight.airline}
                              width={32}
                              height={16}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-black text-slate-800">{flight.flightNumber}</p>
                            <p className="text-xs text-slate-400 font-semibold">{flight.airline}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {daysUntil > 0 && (
                            <span className="text-xs font-bold text-slate-400">
                              in {daysUntil}d
                            </span>
                          )}
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.animation || ""}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-4">
                        <div className="text-center flex-1">
                          <p className="text-2xl font-black text-slate-800">{flight.departureAirport}</p>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">{flight.departureCity}</p>
                          <p className="text-sm font-bold text-coral mt-1">{formatTime(flight.scheduledDeparture)}</p>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex items-center gap-1 text-slate-200">
                            <div className="h-px flex-1 bg-slate-200" />
                            <Plane size={18} className="text-coral rotate-0" />
                            <div className="h-px flex-1 bg-slate-200" />
                          </div>
                        </div>

                        <div className="text-center flex-1">
                          <p className="text-2xl font-black text-slate-800">{flight.arrivalAirport}</p>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">{flight.arrivalCity}</p>
                          <p className="text-sm font-bold text-slate-500 mt-1">{formatTime(flight.scheduledArrival)}</p>
                        </div>
                      </div>

                      {/* Bottom Row: Date + Details */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(flight.scheduledDeparture, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                          {flight.terminal && (
                            <span>Terminal {flight.terminal}</span>
                          )}
                          {flight.gate && (
                            <span>Gate {flight.gate}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AppShell>
  );
}
