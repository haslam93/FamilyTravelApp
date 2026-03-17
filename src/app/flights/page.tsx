"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  RefreshCw,
  Clock,
  MapPin,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
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

const INITIAL_FLIGHTS: Flight[] = [
  { id: "f1", flightNumber: "EK505", airline: "Emirates", airlineCode: "EK", departureCity: "Dubai", departureAirport: "DXB", arrivalCity: "Hyderabad", arrivalAirport: "HYD", scheduledDeparture: "2026-04-10T08:30:00", scheduledArrival: "2026-04-10T13:00:00", status: "SCHEDULED", terminal: "3", gate: null, tripName: "India Solo Adventure" },
  { id: "f2", flightNumber: "6E2341", airline: "IndiGo", airlineCode: "6E", departureCity: "Hyderabad", departureAirport: "HYD", arrivalCity: "Delhi", arrivalAirport: "DEL", scheduledDeparture: "2026-04-15T06:00:00", scheduledArrival: "2026-04-15T08:30:00", status: "SCHEDULED", terminal: "1", gate: null, tripName: "India Solo Adventure" },
  { id: "f3", flightNumber: "EK511", airline: "Emirates", airlineCode: "EK", departureCity: "Delhi", departureAirport: "DEL", arrivalCity: "Dubai", arrivalAirport: "DXB", scheduledDeparture: "2026-04-20T14:00:00", scheduledArrival: "2026-04-20T16:30:00", status: "SCHEDULED", terminal: "3", gate: null, tripName: "India Solo Adventure" },
  { id: "f4", flightNumber: "MS916", airline: "EgyptAir", airlineCode: "MS", departureCity: "Dubai", departureAirport: "DXB", arrivalCity: "Cairo", arrivalAirport: "CAI", scheduledDeparture: "2026-12-05T07:00:00", scheduledArrival: "2026-12-05T09:30:00", status: "SCHEDULED", terminal: "1", gate: null, tripName: "Egypt & Umrah Family Trip" },
  { id: "f5", flightNumber: "MS714", airline: "EgyptAir", airlineCode: "MS", departureCity: "Cairo", departureAirport: "CAI", arrivalCity: "Sharm El Sheikh", arrivalAirport: "SSH", scheduledDeparture: "2026-12-10T10:00:00", scheduledArrival: "2026-12-10T11:00:00", status: "SCHEDULED", terminal: null, gate: null, tripName: "Egypt & Umrah Family Trip" },
  { id: "f6", flightNumber: "SV1234", airline: "Saudia", airlineCode: "SV", departureCity: "Sharm El Sheikh", departureAirport: "SSH", arrivalCity: "Jeddah", arrivalAirport: "JED", scheduledDeparture: "2026-12-14T12:00:00", scheduledArrival: "2026-12-14T14:00:00", status: "SCHEDULED", terminal: null, gate: null, tripName: "Egypt & Umrah Family Trip" },
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
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

// ─── Edit Flight Modal ──────────────────────────────────────────────────────

function FlightModal({
  flight,
  onSave,
  onClose,
}: {
  flight: Flight | null;
  onSave: (f: Flight) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Flight>(
    flight || {
      id: `fl-${Date.now()}`,
      flightNumber: "",
      airline: "",
      airlineCode: "",
      departureCity: "",
      departureAirport: "",
      arrivalCity: "",
      arrivalAirport: "",
      scheduledDeparture: "",
      scheduledArrival: "",
      status: "SCHEDULED",
      terminal: null,
      gate: null,
      tripName: "India Solo Adventure",
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            ✈️ {flight ? "Edit Flight" : "Add Flight"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Flight Number</label>
              <input value={form.flightNumber} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="EK505" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Airline</label>
              <input value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="Emirates" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Airline Code</label>
              <input value={form.airlineCode} onChange={(e) => setForm({ ...form, airlineCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 uppercase" placeholder="EK" maxLength={3} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Trip</label>
              <select value={form.tripName} onChange={(e) => setForm({ ...form, tripName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40">
                <option>India Solo Adventure</option>
                <option>Egypt & Umrah Family Trip</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">From (City)</label>
              <input value={form.departureCity} onChange={(e) => setForm({ ...form, departureCity: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="Dubai" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">From (Airport)</label>
              <input value={form.departureAirport} onChange={(e) => setForm({ ...form, departureAirport: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 uppercase" placeholder="DXB" maxLength={4} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">To (City)</label>
              <input value={form.arrivalCity} onChange={(e) => setForm({ ...form, arrivalCity: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="Hyderabad" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">To (Airport)</label>
              <input value={form.arrivalAirport} onChange={(e) => setForm({ ...form, arrivalAirport: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 uppercase" placeholder="HYD" maxLength={4} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Departure</label>
              <input type="datetime-local" value={form.scheduledDeparture ? form.scheduledDeparture.slice(0, 16) : ""}
                onChange={(e) => setForm({ ...form, scheduledDeparture: e.target.value + ":00" })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Arrival</label>
              <input type="datetime-local" value={form.scheduledArrival ? form.scheduledArrival.slice(0, 16) : ""}
                onChange={(e) => setForm({ ...form, scheduledArrival: e.target.value + ":00" })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Terminal</label>
              <input value={form.terminal || ""} onChange={(e) => setForm({ ...form, terminal: e.target.value || null })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="3" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Gate</label>
              <input value={form.gate || ""} onChange={(e) => setForm({ ...form, gate: e.target.value || null })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="B12" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            disabled={!form.flightNumber || !form.departureCity || !form.arrivalCity}
            className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-bold text-sm shadow-lg shadow-coral/25 disabled:opacity-50">
            <Save size={14} className="inline mr-1.5" />
            {flight ? "Save Changes" : "Add Flight"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>(INITIAL_FLIGHTS);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  // Group by trip
  const grouped: Record<string, Flight[]> = {};
  flights.forEach((f) => {
    if (!grouped[f.tripName]) grouped[f.tripName] = [];
    grouped[f.tripName].push(f);
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRefreshing(false);
  };

  const handleSave = (flight: Flight) => {
    setFlights((prev) => {
      const idx = prev.findIndex((f) => f.id === flight.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = flight;
        return updated;
      }
      return [...prev, flight];
    });
  };

  const handleDelete = (flightId: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== flightId));
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  className="text-3xl"
                >
                  ✈️
                </motion.span>
                Flights
              </h1>
              <p className="text-sm text-slate-400 font-semibold">
                {flights.length} flight{flights.length !== 1 ? "s" : ""} tracked
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 glass px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:text-coral disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Checking..." : "Refresh"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setEditingFlight(null); setShowModal(true); }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-coral/25"
              >
                <Plus size={16} />
                Add Flight
              </motion.button>
            </div>
          </motion.div>

          {/* Flight Groups */}
          {Object.entries(grouped).map(([tripName, tripFlights]) => (
            <motion.div key={tripName} variants={itemVariants} className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <Plane size={16} className="text-coral" />
                {tripName}
                <span className="text-xs text-slate-300">({tripFlights.length})</span>
              </h2>

              <div className="space-y-3">
                {tripFlights.map((flight) => {
                  const statusConfig = FLIGHT_STATUS_CONFIG[flight.status] || FLIGHT_STATUS_CONFIG.UNKNOWN;
                  const daysUntil = getDaysUntil(flight.scheduledDeparture);

                  return (
                    <motion.div
                      key={flight.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className="glass rounded-3xl p-5 shadow-md hover:shadow-lg transition-all group relative"
                    >
                      {/* Edit/Delete buttons */}
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => { setEditingFlight(flight); setShowModal(true); }}
                          className="p-2 rounded-full bg-white/80 hover:bg-coral/10 transition-colors shadow-sm"
                        >
                          <Edit3 size={14} className="text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(flight.id)}
                          className="p-2 rounded-full bg-white/80 hover:bg-red-50 transition-colors shadow-sm"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>

                      {/* Top Row: Airline + Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
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
                          <div className="flex items-center gap-1 w-full">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-sky-300 to-coral rounded-full" />
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Plane size={18} className="text-coral rotate-45" />
                            </motion.div>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-coral to-sky-300 rounded-full" />
                          </div>
                        </div>

                        <div className="text-center flex-1">
                          <p className="text-2xl font-black text-slate-800">{flight.arrivalAirport}</p>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">{flight.arrivalCity}</p>
                          <p className="text-sm font-bold text-slate-500 mt-1">{formatTime(flight.scheduledArrival)}</p>
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(flight.scheduledDeparture, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                          {flight.terminal && <span>Terminal {flight.terminal}</span>}
                          {flight.gate && <span>Gate {flight.gate}</span>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {flights.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20">
              <motion.div animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl mb-4">✈️</motion.div>
              <p className="text-xl font-bold text-slate-400">No flights yet</p>
              <p className="text-sm text-slate-300 mt-2">Add your first flight to start tracking</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <FlightModal
            flight={editingFlight}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
