"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Plane,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Edit3,
  Trash2,
  Save,
  X,
  ExternalLink,
  Download,
  Eye,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { AppShell } from "@/components/app-shell";
import { SortableActivityList } from "@/components/sortable-activity-list";
import { AddActivityModal } from "@/components/add-activity-modal";
import {
  CITY_IMAGES,
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
  address?: string | null;
  city?: string;
  country?: string;
  notes?: string | null;
  kidFriendly?: boolean;
  googleMapsUrl?: string | null;
  tripDayId?: string | null;
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
  stays?: StayData[];
  documents: DocData[];
}

interface FlightData {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string | null;
  confirmationCode?: string | null;
  departureCity: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: string;
  terminal: string | null;
  gate: string | null;
}

const subscribeToHydration = () => () => {};

interface StayData {
  id: string;
  hotelName: string;
  address: string | null;
  city: string;
  country: string;
  checkIn: string;
  checkOut: string;
  checkInLabel?: string | null;
  checkOutLabel?: string | null;
  confirmationCode?: string | null;
  guests: number;
}

interface DocData {
  id: string;
  name: string;
  type: string;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  notes?: string | null;
}

// ─── Demo data ──────────────────────────────────────────────────────────────

const DEMO_TRIPS: Record<string, TripData> = {
  "india-solo-2026": {
    id: "india-solo-2026",
    name: "Trip to Hyderabad",
    type: "SOLO",
    status: "PLANNING",
    startDate: "2026-04-28",
    endDate: "2026-05-11",
    cities: ["Hyderabad", "Delhi"],
    countries: ["India"],
    coverImage: CITY_IMAGES.hyderabad.hero,
    description: "Booked long-haul route through Abu Dhabi with a later Delhi hop before the Emirates return to Toronto.",
    travelers: 1,
    days: [
      {
        id: "day-1", date: "2026-04-10", dayNum: 1, city: "Hyderabad", country: "India",
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
        id: "day-2", date: "2026-04-11", dayNum: 2, city: "Hyderabad", country: "India",
        notes: "Full exploration day",
        activities: [
          { id: "a5", name: "Golconda Fort", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-04-11T09:00:00", endTime: "2026-04-11T12:00:00", notes: "Morning visit for cooler weather", sortOrder: 0 },
          { id: "a6", name: "Lunch at Shadab", type: "MEAL", status: "PLANNED", startTime: "2026-04-11T12:30:00", endTime: null, notes: null, sortOrder: 1 },
          { id: "a7", name: "Salar Jung Museum", type: "MUSEUM", status: "PLANNED", startTime: "2026-04-11T14:00:00", endTime: "2026-04-11T17:00:00", notes: null, sortOrder: 2 },
        ],
        places: [],
      },
      {
        id: "day-3", date: "2026-04-12", dayNum: 3, city: "Hyderabad", country: "India",
        notes: "Tech and shopping day",
        activities: [
          { id: "a8", name: "HITEC City Visit", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-04-12T10:00:00", endTime: "2026-04-12T13:00:00", notes: "Explore tech campus area", sortOrder: 0 },
          { id: "a9", name: "Shopping at GVK One", type: "SHOPPING", status: "PLANNED", startTime: "2026-04-12T15:00:00", endTime: "2026-04-12T18:00:00", notes: null, sortOrder: 1 },
        ],
        places: [],
      },
    ],
    flights: [
      { id: "f1", flightNumber: "EY22", confirmationCode: "STTKL", airline: "Etihad Airways", airlineCode: "EY", departureCity: "Toronto", departureAirport: "YYZ", arrivalCity: "Abu Dhabi", arrivalAirport: "AUH", scheduledDeparture: "2026-04-28T15:10:00-04:00", scheduledArrival: "2026-04-29T12:30:00+04:00", status: "SCHEDULED", terminal: "1", gate: null },
      { id: "f2", flightNumber: "EY358", confirmationCode: "STTKL", airline: "Etihad Airways", airlineCode: "EY", departureCity: "Abu Dhabi", departureAirport: "AUH", arrivalCity: "Hyderabad", arrivalAirport: "HYD", scheduledDeparture: "2026-04-29T14:30:00+04:00", scheduledArrival: "2026-04-29T19:45:00+05:30", status: "SCHEDULED", terminal: "A", gate: null },
      { id: "f3", flightNumber: "6E6202", confirmationCode: "CCGM9X", airline: "IndiGo", airlineCode: "6E", departureCity: "Hyderabad", departureAirport: "HYD", arrivalCity: "Delhi", arrivalAirport: "DEL", scheduledDeparture: "2026-05-07T10:35:00+05:30", scheduledArrival: "2026-05-07T13:10:00+05:30", status: "SCHEDULED", terminal: "1", gate: null },
      { id: "f4", flightNumber: "EK513", confirmationCode: "JMH5CJ", airline: "Emirates", airlineCode: "EK", departureCity: "Delhi", departureAirport: "DEL", arrivalCity: "Dubai", arrivalAirport: "DXB", scheduledDeparture: "2026-05-10T04:25:00+05:30", scheduledArrival: "2026-05-10T06:25:00+04:00", status: "SCHEDULED", terminal: "3", gate: null },
      { id: "f5", flightNumber: "EK241", confirmationCode: "JMH5CJ", airline: "Emirates", airlineCode: "EK", departureCity: "Dubai", departureAirport: "DXB", arrivalCity: "Toronto", arrivalAirport: "YYZ", scheduledDeparture: "2026-05-11T03:30:00+04:00", scheduledArrival: "2026-05-11T09:30:00-04:00", status: "SCHEDULED", terminal: "3", gate: null },
    ],
    documents: [
      { id: "d1", name: "India Visa", type: "VISA" },
      { id: "d2", name: "Emirates Booking", type: "FLIGHT_BOOKING" },
    ],
  },
  "family-egypt-saudi-2026": {
    id: "family-egypt-saudi-2026",
    name: "Trip to Cairo and Umrah",
    type: "FAMILY",
    status: "PLANNING",
    startDate: "2026-12-05",
    endDate: "2026-12-24",
    cities: ["Cairo", "Sharm El Sheikh", "Madinah", "Makkah"],
    countries: ["Egypt", "Saudi Arabia"],
    coverImage: CITY_IMAGES.cairo.hero,
    description: "Family itinerary with Cairo and Sharm stays, then the Umrah leg through Madinah and Makkah.",
    travelers: 5,
    days: [
      {
        id: "day-f1", date: "2026-12-05", dayNum: 1, city: "Cairo", country: "Egypt",
        notes: "Arrival in Cairo",
        activities: [
          { id: "fa1", name: "Flight to Cairo", type: "FLIGHT", status: "PLANNED", startTime: "2026-12-05T07:00:00", endTime: "2026-12-05T10:30:00", notes: "EgyptAir MS916", sortOrder: 0 },
          { id: "fa2", name: "Hotel Check-in", type: "HOTEL_CHECKIN", status: "PLANNED", startTime: "2026-12-05T12:00:00", endTime: null, notes: "Four Seasons Cairo", sortOrder: 1 },
          { id: "fa3", name: "Rest & Settle", type: "REST", status: "PLANNED", startTime: "2026-12-05T13:00:00", endTime: "2026-12-05T16:00:00", notes: "Kids nap time", sortOrder: 2 },
        ],
        places: [],
      },
      {
        id: "day-f2", date: "2026-12-06", dayNum: 2, city: "Cairo", country: "Egypt",
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
      { id: "ff1", flightNumber: "MS996", airline: "EgyptAir", airlineCode: "MS", departureCity: "Toronto", departureAirport: "YYZ", arrivalCity: "Cairo", arrivalAirport: "CAI", scheduledDeparture: "2026-12-05T12:00:00-05:00", scheduledArrival: "2026-12-06T05:25:00+02:00", status: "SCHEDULED", terminal: "1", gate: null },
      { id: "ff2", flightNumber: "MS762", confirmationCode: "CAISHARM", airline: "EgyptAir", airlineCode: "MS", departureCity: "Cairo", departureAirport: "CAI", arrivalCity: "Sharm El Sheikh", arrivalAirport: "SSH", scheduledDeparture: "2026-12-09T14:00:00+02:00", scheduledArrival: "2026-12-09T15:05:00+02:00", status: "SCHEDULED", terminal: "1", gate: null },
      { id: "ff3", flightNumber: "SV1277", airline: "Saudia", airlineCode: "SV", departureCity: "Cairo", departureAirport: "CAI", arrivalCity: "Madinah", arrivalAirport: "MED", scheduledDeparture: "2026-12-15T16:45:00+02:00", scheduledArrival: "2026-12-15T19:35:00+03:00", status: "SCHEDULED", terminal: "5", gate: null },
      { id: "ff4", flightNumber: "MS664", airline: "EgyptAir", airlineCode: "MS", departureCity: "Jeddah", departureAirport: "JED", arrivalCity: "Cairo", arrivalAirport: "CAI", scheduledDeparture: "2026-12-24T12:00:00+03:00", scheduledArrival: "2026-12-24T13:20:00+02:00", status: "SCHEDULED", terminal: "1", gate: null },
    ],
    stays: [
      { id: "s1", hotelName: "Cairo Marriott Hotel", address: "16 Saray El Gezira Street, Zamalek, Cairo 11211, Egypt", city: "Cairo", country: "Egypt", checkIn: "2026-12-05T14:00:00+02:00", checkOut: "2026-12-09T12:00:00+02:00", checkInLabel: "2:00 PM GMT+2", checkOutLabel: "12:00 PM GMT+2", guests: 5 },
      { id: "s2", hotelName: "Sunstaro Royal Beach Resort", address: "Ras Nosrani Bay, 46619 Sharm El Sheikh, Egypt", city: "Sharm El Sheikh", country: "Egypt", checkIn: "2026-12-09T14:00:00+02:00", checkOut: "2026-12-12T12:00:00+02:00", checkInLabel: "2:00 PM GMT+2", checkOutLabel: "12:00 PM GMT+2", guests: 5 },
      { id: "s3", hotelName: "Hilton Cairo Heliopolis", address: "El-Orouba, Qism El Nozha, Cairo Governorate 2466, Cairo, Egypt", city: "Cairo", country: "Egypt", checkIn: "2026-12-12T14:00:00+02:00", checkOut: "2026-12-15T12:00:00+02:00", checkInLabel: "2:00 PM GMT+2", checkOutLabel: "12:00 PM GMT+2", guests: 5 },
      { id: "s4", hotelName: "Madinah Hilton", address: "Opposite Prophet Mosque, King Fahad St, Madinah 41419, Saudi Arabia", city: "Madinah", country: "Saudi Arabia", checkIn: "2026-12-15T22:00:00+03:00", checkOut: "2026-12-19T12:00:00+03:00", checkInLabel: "10:00 PM GMT+3", checkOutLabel: "12:00 PM GMT+3", guests: 5 },
      { id: "s5", hotelName: "Hilton Suites Jabal Omar Makkah", address: "Jabal Omar Ibrahim Al Khalil, Makkah 24231, Saudi Arabia", city: "Makkah", country: "Saudi Arabia", checkIn: "2026-12-19T16:00:00+03:00", checkOut: "2026-12-22T12:00:00+03:00", checkInLabel: "4:00 PM GMT+3", checkOutLabel: "12:00 PM GMT+3", guests: 5 },
    ],
    documents: [
      { id: "fd1", name: "Passports", type: "PASSPORT" },
      { id: "fd2", name: "Egypt Visa", type: "VISA" },
      { id: "fd3", name: "Umrah Permit", type: "UMRAH_PERMIT" },
    ],
  },
};

function mergePlaces(places: Place[]) {
  const seen = new Set<string>();

  return places.filter((place) => {
    const key = place.id || `${place.name}-${place.city || "unknown"}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function mergeDocuments(documents: DocData[]) {
  const seen = new Set<string>();

  return documents.filter((document) => {
    const key = document.id || `${document.name}-${document.type}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getDocumentVisual(type: string) {
  switch (type) {
    case "VISA":
      return { emoji: "🛂", badge: "bg-sky-100 text-sky-700" };
    case "PASSPORT":
      return { emoji: "📕", badge: "bg-indigo-100 text-indigo-700" };
    case "UMRAH_PERMIT":
      return { emoji: "🕋", badge: "bg-violet-100 text-violet-700" };
    case "FLIGHT_BOOKING":
      return { emoji: "✈️", badge: "bg-cyan-100 text-cyan-700" };
    case "HOTEL_BOOKING":
      return { emoji: "🏨", badge: "bg-amber-100 text-amber-700" };
    default:
      return { emoji: "📄", badge: "bg-slate-100 text-slate-700" };
  }
}

function deriveFallbackStays(days: TripDay[], tripEndDate: string): StayData[] {
  const hotelCheckIns = days.flatMap((day, dayIndex) =>
    day.activities
      .filter((activity) => activity.type === "HOTEL_CHECKIN")
      .map((activity, activityIndex) => ({ day, dayIndex, activity, activityIndex }))
  );

  return hotelCheckIns.map(({ day, dayIndex, activity, activityIndex }, index) => {
    const nextCheckIn = hotelCheckIns[index + 1];
    const hotelName = activity.notes?.trim() || activity.name.replace(/check-?in/i, "").trim() || `${day.city} Stay`;

    return {
      id: `derived-stay-${day.id}-${activityIndex}`,
      hotelName,
      address: null,
      city: day.city,
      country: day.country,
      checkIn: activity.startTime || `${day.date}T15:00:00`,
      checkOut: nextCheckIn?.activity.startTime || `${tripEndDate}T12:00:00`,
      checkInLabel: null,
      checkOutLabel: null,
      confirmationCode: null,
      guests: 1,
    };
  });
}

// ─── Edit Flight Modal ──────────────────────────────────────────────────────

function EditFlightModal({
  flight,
  onSave,
  onClose,
}: {
  flight: FlightData | null;
  onSave: (f: FlightData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FlightData>(() =>
    flight || {
      id: `fl-${Date.now()}`,
      flightNumber: "",
      airline: "",
      airlineCode: "",
      confirmationCode: null,
      departureCity: "",
      departureAirport: "",
      arrivalCity: "",
      arrivalAirport: "",
      scheduledDeparture: "",
      scheduledArrival: "",
      status: "SCHEDULED",
      terminal: null,
      gate: null,
    }
  );
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "error">("idle");
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  const handleLookup = async () => {
    const normalizedFlightNumber = form.flightNumber.trim().toUpperCase();

    if (!normalizedFlightNumber) {
      return;
    }

    setLookupState("loading");
    setLookupMessage(null);

    try {
      const response = await fetch(
        `/api/flights/status?flight=${encodeURIComponent(normalizedFlightNumber)}`
      );

      if (!response.ok) {
        throw new Error("Flight lookup unavailable");
      }

      const data = await response.json();

      setForm((prev) => ({
        ...prev,
        flightNumber: data.flightNumber ?? prev.flightNumber,
        airline: data.airline ?? prev.airline,
        airlineCode: data.airlineCode ?? prev.airlineCode,
        departureCity: data.departure?.city ?? prev.departureCity,
        departureAirport: data.departure?.airport ?? prev.departureAirport,
        arrivalCity: data.arrival?.city ?? prev.arrivalCity,
        arrivalAirport: data.arrival?.airport ?? prev.arrivalAirport,
        scheduledDeparture: data.departure?.scheduled ?? prev.scheduledDeparture,
        scheduledArrival: data.arrival?.scheduled ?? prev.scheduledArrival,
        status: data.status ?? prev.status,
        terminal: data.departure?.terminal ?? prev.terminal,
        gate: data.departure?.gate ?? prev.gate,
      }));

      setLookupState("idle");
      setLookupMessage("Filled route and timing details from live flight data.");
    } catch {
      setLookupState("error");
      setLookupMessage("No live match found. You can keep entering the flight manually.");
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Flight Number</label>
              <input value={form.flightNumber} onBlur={() => void handleLookup()} onChange={(e) => setForm({ ...form, flightNumber: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="EK505" />
              <p className="mt-1 text-[11px] font-semibold text-slate-400">
                Leaves the field, then auto-fills when AirLabs finds a match.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Confirmation</label>
              <input value={form.confirmationCode || ""} onChange={(e) => setForm({ ...form, confirmationCode: e.target.value || null })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 uppercase" placeholder="ABC123" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Airline</label>
              <input value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="Emirates" />
            </div>
          </div>

          {lookupMessage && (
            <div className={`rounded-2xl px-3 py-2 text-xs font-bold ${lookupState === "error" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}>
              {lookupState === "loading" ? "Looking up flight details..." : lookupMessage}
            </div>
          )}

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

// ─── Edit Trip Modal ────────────────────────────────────────────────────────

function EditTripModal({
  trip,
  onSave,
  onClose,
}: {
  trip: TripData;
  onSave: (t: Partial<TripData>) => void;
  onClose: () => void;
}) {
  const normalizeDateInput = (value: string) => value.slice(0, 10);
  const [name, setName] = useState(trip.name);
  const [description, setDescription] = useState(trip.description || "");
  const [startDate, setStartDate] = useState(normalizeDateInput(trip.startDate));
  const [endDate, setEndDate] = useState(normalizeDateInput(trip.endDate));
  const [travelers, setTravelers] = useState(trip.travelers);
  const [cities, setCities] = useState(trip.cities.join(", "));

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
            ✏️ Edit Trip
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Trip Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Travelers</label>
              <input type="number" min={1} max={20} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Cities (comma-separated)</label>
              <input value={cities} onChange={(e) => setCities(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave({ name, description, startDate, endDate, travelers, cities: cities.split(",").map((c) => c.trim()).filter(Boolean) }); onClose(); }}
            className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-bold text-sm shadow-lg shadow-coral/25">
            <Save size={14} className="inline mr-1.5" />Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<TripData | null>(null);
  const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [showEditFlight, setShowEditFlight] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightData | null>(null);
  const [activeTab, setActiveTab] = useState<"schedule" | "places" | "flights" | "stays" | "docs">("schedule");
  const [tripPlaces, setTripPlaces] = useState<Place[]>([]);
  const [tripDocuments, setTripDocuments] = useState<DocData[]>([]);

  const loadTrip = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/trips/${tripId}`, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(response.status === 404 ? "Trip not found in the database yet." : "Failed to load trip details.");
      }

      const data = await response.json();
      setTrip({ ...data, stays: data.stays ?? [] });
      setLoadError(null);
    } catch (error) {
      const fallbackTrip = DEMO_TRIPS[tripId] ?? null;
      setTrip(fallbackTrip);
      setLoadError(error instanceof Error ? error.message : "Failed to load trip details.");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    void loadTrip();
  }, [loadTrip]);

  useEffect(() => {
    setSelectedDay((prev) => {
      if (!trip) {
        return 0;
      }

      return Math.min(prev, Math.max(trip.days.length - 1, 0));
    });
  }, [trip]);

  useEffect(() => {
    if (!trip) {
      setTripPlaces([]);
      setTripDocuments([]);
      return;
    }

    const dayPlaces = trip.days.flatMap((day) =>
      day.places.map((place) => ({
        ...place,
        city: place.city || day.city,
        country: place.country || day.country,
        tripDayId: place.tripDayId || day.id,
      }))
    );

    setTripPlaces(mergePlaces(dayPlaces));
    setTripDocuments(mergeDocuments(trip.documents));

    let cancelled = false;

    void (async () => {
      try {
        const placeResponses = await Promise.all(
          trip.cities.map((city) => fetch(`/api/places?city=${encodeURIComponent(city)}`, { cache: "no-store" }))
        );
        const cityPlaces = (
          await Promise.all(
            placeResponses.map(async (response) => {
              if (!response.ok) {
                return [] as Place[];
              }

              return (await response.json()) as Place[];
            })
          )
        ).flat();

        const documentsResponse = await fetch(`/api/documents?tripId=${encodeURIComponent(trip.id)}`, {
          cache: "no-store",
        });
        const documents = documentsResponse.ok ? ((await documentsResponse.json()) as DocData[]) : trip.documents;

        if (!cancelled) {
          setTripPlaces(mergePlaces([...dayPlaces, ...cityPlaces]));
          setTripDocuments(mergeDocuments(documents));
        }
      } catch {
        if (!cancelled) {
          setTripPlaces(mergePlaces(dayPlaces));
          setTripDocuments(mergeDocuments(trip.documents));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [trip]);

  const formatDate = useCallback(
    (value: string, options: Intl.DateTimeFormatOptions) => {
      if (!isHydrated) {
        return "";
      }

      return new Date(value).toLocaleDateString("en-US", options);
    },
    [isHydrated]
  );

  const formatTime = useCallback(
    (value: string, options: Intl.DateTimeFormatOptions) => {
      if (!isHydrated) {
        return "";
      }

      return new Date(value).toLocaleTimeString("en-US", options);
    },
    [isHydrated]
  );

  const handleAddActivity = useCallback(async (activity: Omit<Activity, "id" | "sortOrder">) => {
    if (!trip || !trip.days[selectedDay]) return;

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...activity, tripDayId: trip.days[selectedDay].id }),
      });

      if (!response.ok) {
        throw new Error("Failed to save activity.");
      }

      const createdActivity = await response.json();

      setTrip((prev) => {
        if (!prev) return prev;
        const days = [...prev.days];
        days[selectedDay] = {
          ...days[selectedDay],
          activities: [...days[selectedDay].activities, createdActivity],
        };
        return { ...prev, days };
      });
      setSaveError(null);
      setShowAddActivity(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save activity.");
    }
  }, [selectedDay, trip]);

  const handleSaveFlight = async (flight: FlightData) => {
    if (!trip) return;

    try {
      const existingFlight = trip.flights.some((item) => item.id === flight.id);
      const response = await fetch(existingFlight ? `/api/flights/${flight.id}` : "/api/flights", {
        method: existingFlight ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...flight, tripId: trip.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to save flight.");
      }

      const savedFlight = await response.json();
      setTrip((prev) => {
        if (!prev) return prev;
        const idx = prev.flights.findIndex((f) => f.id === savedFlight.id);
        const flights = [...prev.flights];
        if (idx >= 0) {
          flights[idx] = savedFlight;
        } else {
          flights.push(savedFlight);
        }
        flights.sort((left, right) => new Date(left.scheduledDeparture).getTime() - new Date(right.scheduledDeparture).getTime());
        return { ...prev, flights };
      });
      setSaveError(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save flight.");
    }
  };

  const handleDeleteFlight = async (flightId: string) => {
    try {
      const response = await fetch(`/api/flights/${flightId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete flight.");
      }

      setTrip((prev) => {
        if (!prev) return prev;
        return { ...prev, flights: prev.flights.filter((f) => f.id !== flightId) };
      });
      setSaveError(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to delete flight.");
    }
  };

  const handleUpdateTrip = async (updates: Partial<TripData>) => {
    if (!trip) return;

    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to save trip changes.");
      }

      const updatedTrip = await response.json();
      setTrip((prev) => prev ? { ...prev, ...updatedTrip } : prev);
      setSaveError(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save trip changes.");
    }
  };

  if (isLoading && !trip) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} className="text-5xl">
              ✈️
            </motion.div>
            <p className="text-lg font-bold text-slate-500">Loading trip details</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!trip) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl"
            >
              🗺️
            </motion.div>
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
  const stays = (trip.stays && trip.stays.length > 0) ? trip.stays : deriveFallbackStays(trip.days, trip.endDate);
  const totalActivities = trip.days.reduce((sum, d) => sum + d.activities.length, 0);
  const doneActivities = trip.days.reduce(
    (sum, d) => sum + d.activities.filter((a) => a.status === "DONE").length,
    0
  );
  const visitedPlaces = tripPlaces.filter((place) => place.visited).length;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        {/* ─── Hero Banner ───────────────────────────────────────── */}
        <div className="relative h-52 sm:h-72 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Back + Edit buttons */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <Link
              href="/"
              className="glass rounded-full p-2.5 hover:scale-105 transition-transform shadow-lg"
            >
              <ChevronLeft size={20} className="text-slate-700" />
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditTrip(true)}
              className="glass rounded-full px-4 py-2 flex items-center gap-1.5 shadow-lg"
            >
              <Edit3 size={14} className="text-slate-600" />
              <span className="text-xs font-bold text-slate-600">Edit Trip</span>
            </motion.button>
          </div>

          {/* Trip info overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{visuals.emoji}</span>
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  {trip.type === "SOLO" ? "Solo Trip" : "Family Trip"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">{trip.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-white/80 text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  {formatDate(trip.startDate, { month: "short", day: "numeric" }) || "..."}
                  {" — "}
                  {formatDate(trip.endDate, { month: "short", day: "numeric", year: "numeric" }) || "..."}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {trip.cities.join(" → ")}
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
          {loadError && (
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              {loadError}
            </div>
          )}

          {saveError && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "Days", value: trip.days.length, emoji: "📅", color: "from-sky-400 to-blue-500" },
              { label: "Activities", value: totalActivities, emoji: "📋", color: "from-amber-400 to-orange-500" },
              { label: "Flights", value: trip.flights.length, emoji: "✈️", color: "from-coral to-sunset" },
              { label: "Stays", value: stays.length, emoji: "🏨", color: "from-indigo-400 to-violet-500" },
              { label: "Docs", value: tripDocuments.length, emoji: "📄", color: "from-emerald-400 to-teal-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * i, type: "spring" }}
                whileHover={{ y: -3, scale: 1.03 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-3 text-center text-white shadow-md`}
              >
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/10" />
                <div className="text-xl mb-1">{stat.emoji}</div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* ─── Progress Bar ────────────────────────────────────── */}
          {totalActivities > 0 && (
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Trip Progress</span>
                <span className="text-sm font-black text-coral">
                  {doneActivities}/{totalActivities} done
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
                { key: "schedule", label: "Schedule", emoji: "📅" },
                { key: "flights", label: "Flights", emoji: "✈️" },
                { key: "stays", label: "Stays", emoji: "🏨" },
                { key: "places", label: "Places", emoji: "📍" },
                { key: "docs", label: "Documents", emoji: "📄" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
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
                              {formatDate(day.date, { month: "short", day: "numeric" }) || "..."}
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
                          {formatDate(currentDay.date, {
                            weekday: "long", month: "long", day: "numeric",
                          }) || "..."}
                          {" • "}{currentDay.country}
                        </p>
                        {currentDay.notes && (
                          <p className="text-sm text-slate-500 mt-1 italic">{currentDay.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowAddActivity(true)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-coral/25 hover:scale-105 transition-transform"
                      >
                        <Plus size={14} />
                        Add Activity
                      </button>
                    </div>
                  </div>
                )}

                {/* Activities Timeline */}
                {currentDay && (
                  <div className="space-y-3">
                    {currentDay.activities.length === 0 ? (
                      <div className="text-center py-12 glass rounded-2xl">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-3">📝</motion.div>
                        <p className="text-slate-400 font-bold">No activities yet</p>
                        <p className="text-sm text-slate-300">Tap + to add your first activity</p>
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

                          void fetch("/api/activities", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              reorder: reordered.map((activity) => ({
                                id: activity.id,
                                sortOrder: activity.sortOrder,
                              })),
                            }),
                          }).then((response) => {
                            if (!response.ok) {
                              throw new Error("Failed to reorder activities.");
                            }
                          }).catch((error: unknown) => {
                            setSaveError(error instanceof Error ? error.message : "Failed to reorder activities.");
                            void loadTrip();
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

                          void fetch(`/api/activities/${activityId}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: newStatus }),
                          }).then((response) => {
                            if (!response.ok) {
                              throw new Error("Failed to update activity status.");
                            }
                          }).catch((error: unknown) => {
                            setSaveError(error instanceof Error ? error.message : "Failed to update activity status.");
                            void loadTrip();
                          });
                        }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Stays Tab ───────────────────────────────────────── */}
            {activeTab === "stays" && (
              <motion.div
                key="stays"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {stays.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-7xl mb-4">🏨</div>
                    <p className="text-slate-400 font-bold">No stays saved yet</p>
                    <p className="text-sm text-slate-300 mt-1">Hotel reservations will appear here as dedicated records.</p>
                  </div>
                ) : (
                  stays.map((stay) => (
                    <motion.div
                      key={stay.id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="glass rounded-2xl p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-2xl shadow-md">
                          🏨
                        </div>
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-slate-800">{stay.hotelName}</p>
                            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                              {stay.city}
                            </span>
                            {trip.stays?.length ? null : (
                              <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                                derived from itinerary
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-500">
                            {formatDate(stay.checkIn, { month: "short", day: "numeric" }) || "..."}
                            {" → "}
                            {formatDate(stay.checkOut, { month: "short", day: "numeric", year: "numeric" }) || "..."}
                          </p>
                          {(stay.checkInLabel || stay.checkOutLabel) && (
                            <p className="text-xs font-semibold text-slate-400">
                              {stay.checkInLabel ? `Check-in ${stay.checkInLabel}` : ""}
                              {stay.checkInLabel && stay.checkOutLabel ? " • " : ""}
                              {stay.checkOutLabel ? `Check-out ${stay.checkOutLabel}` : ""}
                            </p>
                          )}
                          {stay.address && (
                            <p className="text-sm text-slate-600">{stay.address}</p>
                          )}
                          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold text-slate-500">
                            <span className="rounded-full bg-white/70 px-2.5 py-1">{stay.guests} guests</span>
                            {stay.confirmationCode && (
                              <span className="rounded-full bg-white/70 px-2.5 py-1">Confirmation {stay.confirmationCode}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* ─── Flights Tab ─────────────────────────────────────── */}
            {activeTab === "flights" && (
              <motion.div
                key="flights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-500">
                    {trip.flights.length} flight{trip.flights.length !== 1 ? "s" : ""}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setEditingFlight(null); setShowEditFlight(true); }}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-coral/25"
                  >
                    <Plus size={14} />
                    Add Flight
                  </motion.button>
                </div>

                {trip.flights.length === 0 ? (
                  <div className="text-center py-16">
                    <motion.div animate={{ rotate: [0, -5, 5, 0], y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl mb-4">✈️</motion.div>
                    <p className="text-slate-400 font-bold text-lg">No flights yet</p>
                    <p className="text-sm text-slate-300 mt-1">Add your flights to track them</p>
                  </div>
                ) : (
                  trip.flights.map((flight) => (
                    <motion.div
                      key={flight.id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="glass rounded-2xl p-5 group relative"
                    >
                      {/* Edit/Delete buttons */}
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingFlight(flight); setShowEditFlight(true); }}
                          className="p-2 rounded-full bg-white/80 hover:bg-coral/10 transition-colors"
                        >
                          <Edit3 size={14} className="text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteFlight(flight.id)}
                          className="p-2 rounded-full bg-white/80 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-ocean flex items-center justify-center text-white text-2xl shadow-md">
                          ✈️
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-black text-slate-800">{flight.flightNumber}</p>
                            <span className="text-xs font-semibold text-slate-400">• {flight.airline}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-slate-700">{flight.departureAirport}</span>
                            <div className="flex-1 flex items-center gap-1 text-slate-300">
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-sky-300 to-ocean/50 rounded-full" />
                              <Plane size={14} className="text-coral rotate-45" />
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-ocean/50 to-sky-300 rounded-full" />
                            </div>
                            <span className="font-bold text-slate-700">{flight.arrivalAirport}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-semibold">
                            <span>{formatDate(flight.scheduledDeparture, { month: "short", day: "numeric" }) || "..."}</span>
                            <span>{formatTime(flight.scheduledDeparture, { hour: "numeric", minute: "2-digit", hour12: true }) || "..."}</span>
                            {flight.terminal && <span>Terminal {flight.terminal}</span>}
                            {flight.gate && <span>Gate {flight.gate}</span>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
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
                className="space-y-4"
              >
                <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(255,107,107,0.12),rgba(124,92,255,0.12))] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Trip Places</p>
                      <h3 className="mt-1 text-2xl font-black text-slate-800">Places connected to this trip</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {tripPlaces.length} saved place{tripPlaces.length === 1 ? "" : "s"} across {trip.cities.length} cit{trip.cities.length === 1 ? "y" : "ies"}.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      <span className="rounded-full bg-white px-3 py-2 shadow-sm">{visitedPlaces} visited</span>
                      <span className="rounded-full bg-white px-3 py-2 shadow-sm">{tripPlaces.length - visitedPlaces} planned</span>
                    </div>
                  </div>
                </div>

                {tripPlaces.length === 0 ? (
                  <div className="text-center py-16 glass rounded-2xl">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-7xl mb-4">📍</motion.div>
                    <h3 className="text-lg font-bold text-slate-600">No places attached yet</h3>
                    <p className="text-sm text-slate-400 mt-1">Add places for any of this trip's cities and they will show up here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {tripPlaces.map((place) => (
                      <motion.div
                        key={place.id}
                        whileHover={{ y: -3 }}
                        className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/85 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
                      >
                        <div className="flex gap-4 p-4">
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1.25rem] bg-slate-100">
                            {place.photoUrl ? (
                              <Image src={place.photoUrl} alt={place.name} fill className="object-cover" sizes="96px" />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-gradient-to-br from-coral/20 to-sunset/20 text-3xl">📍</div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-lg font-black text-slate-800">{place.name}</h4>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
                                {place.category.replace(/_/g, " ")}
                              </span>
                              {place.kidFriendly && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                                  kid friendly
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              {[place.city, place.country].filter(Boolean).join(", ")}
                            </p>
                            {place.address && (
                              <p className="mt-2 text-sm text-slate-500">{place.address}</p>
                            )}
                            {place.notes && (
                              <p className="mt-2 text-sm text-slate-500">{place.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                          <span className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] ${place.visited ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {place.visited ? "Visited" : "Planned"}
                          </span>

                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/places`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 transition hover:bg-slate-200"
                            >
                              <Eye size={13} /> Manage
                            </Link>
                            {place.googleMapsUrl && (
                              <a
                                href={place.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                              >
                                <ExternalLink size={13} /> Maps
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Documents Tab ───────────────────────────────────── */}
            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(34,211,238,0.12))] p-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Trip Documents</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-800">Files attached to this trip</h3>
                  </div>
                  <Link
                    href="/documents"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white"
                  >
                    <Upload size={14} /> Manage Vault
                  </Link>
                </div>

                {tripDocuments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-7xl mb-4">📄</div>
                    <p className="text-slate-400 font-bold">No documents yet</p>
                  </div>
                ) : (
                  tripDocuments.map((doc) => {
                    const visual = getDocumentVisual(doc.type);

                    return (
                    <motion.div
                      key={doc.id}
                      whileHover={{ y: -2 }}
                      className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl text-white shadow-md">
                          {visual.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-slate-800">{doc.name}</p>
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${visual.badge}`}>
                              {doc.type.replace(/_/g, " ")}
                            </span>
                          </div>
                          {doc.fileName && (
                            <p className="mt-1 text-sm font-semibold text-slate-500">{doc.fileName}</p>
                          )}
                          {doc.notes && (
                            <p className="mt-2 text-sm text-slate-500">{doc.notes}</p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {doc.fileUrl ? (
                              <>
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white"
                                >
                                  <Eye size={13} /> Preview
                                </a>
                                <a
                                  href={doc.fileUrl}
                                  download={doc.fileName || doc.name}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600"
                                >
                                  <Download size={13} /> Download
                                </a>
                              </>
                            ) : (
                              <Link
                                href="/documents"
                                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600"
                              >
                                <Eye size={13} /> Open Vault
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );})
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Modals ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddActivity && (
          <AddActivityModal
            open={showAddActivity}
            onAdd={handleAddActivity}
            onClose={() => setShowAddActivity(false)}
          />
        )}
        {showEditTrip && trip && (
          <EditTripModal
            trip={trip}
            onSave={handleUpdateTrip}
            onClose={() => setShowEditTrip(false)}
          />
        )}
        {showEditFlight && (
          <EditFlightModal
            flight={editingFlight}
            onSave={handleSaveFlight}
            onClose={() => setShowEditFlight(false)}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
