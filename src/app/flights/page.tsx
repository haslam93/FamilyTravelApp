"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Edit3, Plane, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { FLIGHT_STATUS_CONFIG, getAirlineLogo } from "@/lib/constants";

interface FlightData {
  id: string;
  tripId: string;
  flightNumber: string;
  confirmationCode: string | null;
  airline: string;
  airlineCode: string | null;
  departureCity: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: string;
  terminal: string | null;
  gate: string | null;
  baggageBelt: string | null;
  aircraft: string | null;
}

interface TripOption {
  id: string;
  name: string;
}

interface FlightFormData {
  id?: string;
  tripId: string;
  flightNumber: string;
  confirmationCode: string;
  airline: string;
  airlineCode: string;
  departureCity: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: string;
  terminal: string;
  gate: string;
  baggageBelt: string;
  aircraft: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(dateStr).toLocaleDateString(
    "en-US",
    options || { month: "short", day: "numeric" }
  );
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDaysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function toDateTimeLocalValue(dateStr: string) {
  if (!dateStr) {
    return "";
  }

  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function toIsoString(value: string) {
  return value ? new Date(value).toISOString() : "";
}

function FlightModal({
  flight,
  trips,
  saving,
  onSave,
  onClose,
}: {
  flight: FlightData | null;
  trips: TripOption[];
  saving: boolean;
  onSave: (flight: FlightFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FlightFormData>(() => ({
    id: flight?.id,
    tripId: flight?.tripId || trips[0]?.id || "",
    flightNumber: flight?.flightNumber || "",
    confirmationCode: flight?.confirmationCode || "",
    airline: flight?.airline || "",
    airlineCode: flight?.airlineCode || "",
    departureCity: flight?.departureCity || "",
    departureAirport: flight?.departureAirport || "",
    arrivalCity: flight?.arrivalCity || "",
    arrivalAirport: flight?.arrivalAirport || "",
    scheduledDeparture: flight?.scheduledDeparture || "",
    scheduledArrival: flight?.scheduledArrival || "",
    status: flight?.status || "SCHEDULED",
    terminal: flight?.terminal || "",
    gate: flight?.gate || "",
    baggageBelt: flight?.baggageBelt || "",
    aircraft: flight?.aircraft || "",
  }));
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const handleLookup = async () => {
    if (!form.flightNumber.trim()) {
      return;
    }

    try {
      setLookupLoading(true);
      setLookupMessage(null);

      const response = await fetch(
        `/api/flights/status?flight=${encodeURIComponent(form.flightNumber.trim().toUpperCase())}`
      );

      if (!response.ok) {
        throw new Error("Live flight lookup unavailable.");
      }

      const data = await response.json();
      setForm((current) => ({
        ...current,
        flightNumber: data.flightNumber || current.flightNumber,
        airline: data.airline || current.airline,
        airlineCode: data.airlineCode || current.airlineCode,
        departureAirport: data.departure?.airport || current.departureAirport,
        departureCity: data.departure?.city || current.departureCity,
        arrivalAirport: data.arrival?.airport || current.arrivalAirport,
        arrivalCity: data.arrival?.city || current.arrivalCity,
        scheduledDeparture: data.departure?.scheduled || current.scheduledDeparture,
        scheduledArrival: data.arrival?.scheduled || current.scheduledArrival,
        terminal: data.departure?.terminal || current.terminal,
        gate: data.departure?.gate || current.gate,
        baggageBelt: data.arrival?.baggage || current.baggageBelt,
        aircraft: data.aircraft || current.aircraft,
        status: data.status || current.status,
      }));
      setLookupMessage("Live status loaded.");
    } catch (error) {
      setLookupMessage(error instanceof Error ? error.message : "Lookup failed.");
    } finally {
      setLookupLoading(false);
    }
  };

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
        onClick={(event) => event.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            ✈️ {flight ? "Edit Flight" : "Add Flight"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Flight Number</label>
              <input
                value={form.flightNumber}
                onChange={(event) =>
                  setForm({ ...form, flightNumber: event.target.value.toUpperCase() })
                }
                onBlur={() => {
                  void handleLookup();
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="EY358"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Confirmation</label>
              <input
                value={form.confirmationCode}
                onChange={(event) =>
                  setForm({ ...form, confirmationCode: event.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="STTKL"
              />
            </div>
          </div>

          {lookupMessage && (
            <p className="text-xs font-semibold text-slate-500">{lookupMessage}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Airline</label>
              <input
                value={form.airline}
                onChange={(event) => setForm({ ...form, airline: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Etihad Airways"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Airline Code</label>
              <input
                value={form.airlineCode}
                onChange={(event) =>
                  setForm({ ...form, airlineCode: event.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 uppercase"
                placeholder="EY"
                maxLength={3}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Trip</label>
            <select
              value={form.tripId}
              onChange={(event) => setForm({ ...form, tripId: event.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
            >
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">From (City)</label>
              <input
                value={form.departureCity}
                onChange={(event) => setForm({ ...form, departureCity: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Abu Dhabi"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">From (Airport)</label>
              <input
                value={form.departureAirport}
                onChange={(event) =>
                  setForm({ ...form, departureAirport: event.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 uppercase"
                placeholder="AUH"
                maxLength={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">To (City)</label>
              <input
                value={form.arrivalCity}
                onChange={(event) => setForm({ ...form, arrivalCity: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Hyderabad"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">To (Airport)</label>
              <input
                value={form.arrivalAirport}
                onChange={(event) =>
                  setForm({ ...form, arrivalAirport: event.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 uppercase"
                placeholder="HYD"
                maxLength={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Departure</label>
              <input
                type="datetime-local"
                value={toDateTimeLocalValue(form.scheduledDeparture)}
                onChange={(event) =>
                  setForm({ ...form, scheduledDeparture: toIsoString(event.target.value) })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Arrival</label>
              <input
                type="datetime-local"
                value={toDateTimeLocalValue(form.scheduledArrival)}
                onChange={(event) =>
                  setForm({ ...form, scheduledArrival: toIsoString(event.target.value) })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Terminal</label>
              <input
                value={form.terminal}
                onChange={(event) => setForm({ ...form, terminal: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="3"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Gate</label>
              <input
                value={form.gate}
                onChange={(event) => setForm({ ...form, gate: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="B12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Baggage Belt</label>
              <input
                value={form.baggageBelt}
                onChange={(event) => setForm({ ...form, baggageBelt: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="7"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Aircraft</label>
              <input
                value={form.aircraft}
                onChange={(event) => setForm({ ...form, aircraft: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="A320"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              void onSave(form);
            }}
            disabled={
              saving ||
              lookupLoading ||
              !form.tripId ||
              !form.flightNumber ||
              !form.airline ||
              !form.departureCity ||
              !form.departureAirport ||
              !form.arrivalCity ||
              !form.arrivalAirport ||
              !form.scheduledDeparture ||
              !form.scheduledArrival
            }
            className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-bold text-sm shadow-lg shadow-coral/25 disabled:opacity-50"
          >
            <Save size={14} className="inline mr-1.5" />
            {saving ? "Saving..." : flight ? "Save Changes" : "Add Flight"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightData | null>(null);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [flightsResponse, tripsResponse] = await Promise.all([
        fetch("/api/flights", { cache: "no-store" }),
        fetch("/api/trips", { cache: "no-store" }),
      ]);

      if (!flightsResponse.ok || !tripsResponse.ok) {
        throw new Error("Failed to load flights.");
      }

      const [flightsData, tripsData] = await Promise.all([
        flightsResponse.json(),
        tripsResponse.json(),
      ]);

      setFlights(flightsData);
      setTrips(tripsData.map((trip: TripOption) => ({ id: trip.id, name: trip.name })));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load flights.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const groupedFlights = useMemo(() => {
    const tripNames = new Map(trips.map((trip) => [trip.id, trip.name]));
    const grouped: Record<string, FlightData[]> = {};

    flights.forEach((flight) => {
      const tripName = tripNames.get(flight.tripId) || "Unassigned Trip";
      if (!grouped[tripName]) {
        grouped[tripName] = [];
      }

      grouped[tripName].push(flight);
    });

    return Object.entries(grouped).sort((left, right) => left[0].localeCompare(right[0]));
  }, [flights, trips]);

  const handleSave = async (flight: FlightFormData) => {
    try {
      setSaving(true);

      const payload = {
        tripId: flight.tripId,
        flightNumber: flight.flightNumber,
        confirmationCode: flight.confirmationCode || null,
        airline: flight.airline,
        airlineCode: flight.airlineCode || null,
        departureCity: flight.departureCity,
        departureAirport: flight.departureAirport,
        arrivalCity: flight.arrivalCity,
        arrivalAirport: flight.arrivalAirport,
        scheduledDeparture: flight.scheduledDeparture,
        scheduledArrival: flight.scheduledArrival,
        status: flight.status,
        terminal: flight.terminal || null,
        gate: flight.gate || null,
        baggageBelt: flight.baggageBelt || null,
        aircraft: flight.aircraft || null,
      };

      const response = await fetch(flight.id ? `/api/flights/${flight.id}` : "/api/flights", {
        method: flight.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save flight.");
      }

      const savedFlight = await response.json();
      setFlights((current) => {
        const existingIndex = current.findIndex((item) => item.id === savedFlight.id);

        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex] = savedFlight;
          return updated;
        }

        return [...current, savedFlight].sort(
          (left, right) =>
            new Date(left.scheduledDeparture).getTime() - new Date(right.scheduledDeparture).getTime()
        );
      });
      setShowModal(false);
      setEditingFlight(null);
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save flight.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (flightId: string) => {
    try {
      const response = await fetch(`/api/flights/${flightId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete flight.");
      }

      setFlights((current) => current.filter((flight) => flight.id !== flightId));
      setError(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete flight.");
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
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
                {loading ? "Loading flights..." : `${flights.length} flight${flights.length !== 1 ? "s" : ""} tracked`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  void loadData();
                }}
                disabled={refreshing}
                className="flex items-center gap-2 glass px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:text-coral disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Checking..." : "Refresh"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingFlight(null);
                  setShowModal(true);
                }}
                disabled={trips.length === 0}
                className="flex items-center gap-1.5 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-coral/25 disabled:opacity-50"
              >
                <Plus size={16} />
                Add Flight
              </motion.button>
            </div>
          </motion.div>

          {error && (
            <motion.div variants={itemVariants} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              {error}
            </motion.div>
          )}

          {groupedFlights.map(([tripName, tripFlights]) => (
            <motion.div key={tripName} variants={itemVariants} className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <Plane size={16} className="text-coral" />
                {tripName}
                <span className="text-xs text-slate-300">({tripFlights.length})</span>
              </h2>

              <div className="space-y-3">
                {tripFlights.map((flight) => {
                  const statusConfig =
                    FLIGHT_STATUS_CONFIG[flight.status as keyof typeof FLIGHT_STATUS_CONFIG] ||
                    FLIGHT_STATUS_CONFIG.UNKNOWN;
                  const daysUntil = getDaysUntil(flight.scheduledDeparture);

                  return (
                    <motion.div
                      key={flight.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className="glass rounded-3xl p-5 shadow-md hover:shadow-lg transition-all group relative"
                    >
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => {
                            setEditingFlight(flight);
                            setShowModal(true);
                          }}
                          className="p-2 rounded-full bg-white/80 hover:bg-coral/10 transition-colors shadow-sm"
                        >
                          <Edit3 size={14} className="text-slate-500" />
                        </button>
                        <button
                          onClick={() => {
                            void handleDelete(flight.id);
                          }}
                          className="p-2 rounded-full bg-white/80 hover:bg-red-50 transition-colors shadow-sm"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden">
                            <Image
                              src={getAirlineLogo(flight.airlineCode || flight.airline.slice(0, 2).toUpperCase(), 80)}
                              alt={flight.airline}
                              width={32}
                              height={16}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-black text-slate-800">{flight.flightNumber}</p>
                            <p className="text-xs text-slate-400 font-semibold">{flight.airline}</p>
                            {flight.confirmationCode && (
                              <p className="text-[11px] text-slate-400 font-semibold">
                                Confirmation {flight.confirmationCode}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {daysUntil > 0 && (
                            <span className="text-xs font-bold text-slate-400">in {daysUntil}d</span>
                          )}
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.animation || ""}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

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

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(flight.scheduledDeparture, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                          {flight.terminal && <span>Terminal {flight.terminal}</span>}
                          {flight.gate && <span>Gate {flight.gate}</span>}
                          {flight.baggageBelt && <span>Belt {flight.baggageBelt}</span>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {!loading && flights.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                ✈️
              </motion.div>
              <p className="text-xl font-bold text-slate-400">No flights yet</p>
              <p className="text-sm text-slate-300 mt-2">Add your first flight to start tracking</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <FlightModal
            flight={editingFlight}
            trips={trips}
            saving={saving}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingFlight(null);
            }}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
