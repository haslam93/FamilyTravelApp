"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BedDouble,
  Calendar,
  Edit3,
  ExternalLink,
  MapPin,
  Plus,
  Save,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { getGoogleMapsUrl } from "@/lib/constants";

interface StayData {
  id: string;
  tripId: string;
  hotelName: string;
  address: string | null;
  city: string;
  country: string;
  checkIn: string;
  checkOut: string;
  checkInLabel: string | null;
  checkOutLabel: string | null;
  confirmationCode: string | null;
  bookingProvider: string | null;
  roomType: string | null;
  guests: number;
  notes: string | null;
  googlePlaceId: string | null;
  googleMapsUrl: string | null;
  photoUrl: string | null;
  rating: number | null;
}

interface TripOption {
  id: string;
  name: string;
}

interface StayFormData {
  id?: string;
  tripId: string;
  hotelName: string;
  address: string;
  city: string;
  country: string;
  checkIn: string;
  checkOut: string;
  checkInLabel: string;
  checkOutLabel: string;
  confirmationCode: string;
  bookingProvider: string;
  roomType: string;
  guests: string;
  notes: string;
  googlePlaceId: string;
  googleMapsUrl: string;
  photoUrl: string;
  rating: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDateInputValue(value: string) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function StayModal({
  stay,
  trips,
  saving,
  onSave,
  onClose,
}: {
  stay: StayData | null;
  trips: TripOption[];
  saving: boolean;
  onSave: (stay: StayFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<StayFormData>(() => ({
    id: stay?.id,
    tripId: stay?.tripId || trips[0]?.id || "",
    hotelName: stay?.hotelName || "",
    address: stay?.address || "",
    city: stay?.city || "",
    country: stay?.country || "",
    checkIn: stay?.checkIn || "",
    checkOut: stay?.checkOut || "",
    checkInLabel: stay?.checkInLabel || "",
    checkOutLabel: stay?.checkOutLabel || "",
    confirmationCode: stay?.confirmationCode || "",
    bookingProvider: stay?.bookingProvider || "",
    roomType: stay?.roomType || "",
    guests: stay?.guests?.toString() || "1",
    notes: stay?.notes || "",
    googlePlaceId: stay?.googlePlaceId || "",
    googleMapsUrl: stay?.googleMapsUrl || "",
    photoUrl: stay?.photoUrl || "",
    rating: stay?.rating?.toString() || "",
  }));

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
        className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            🏨 {stay ? "Edit Stay" : "Add Stay"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Hotel Name</label>
              <input
                value={form.hotelName}
                onChange={(event) => setForm({ ...form, hotelName: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Cairo Marriott Hotel"
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
                placeholder="ABC123"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">City</label>
              <input
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Cairo"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Country</label>
              <input
                value={form.country}
                onChange={(event) => setForm({ ...form, country: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Egypt"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Address</label>
            <input
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              placeholder="16 Saray El Gezira St, Zamalek"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Check-in Date</label>
              <input
                type="date"
                value={toDateInputValue(form.checkIn)}
                onChange={(event) => setForm({ ...form, checkIn: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Check-out Date</label>
              <input
                type="date"
                value={toDateInputValue(form.checkOut)}
                onChange={(event) => setForm({ ...form, checkOut: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Check-in Label</label>
              <input
                value={form.checkInLabel}
                onChange={(event) => setForm({ ...form, checkInLabel: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="3:00 PM"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Check-out Label</label>
              <input
                value={form.checkOutLabel}
                onChange={(event) => setForm({ ...form, checkOutLabel: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="11:00 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Provider</label>
              <input
                value={form.bookingProvider}
                onChange={(event) => setForm({ ...form, bookingProvider: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Booking.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Room Type</label>
              <input
                value={form.roomType}
                onChange={(event) => setForm({ ...form, roomType: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Family Room"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Guests</label>
              <input
                type="number"
                min="1"
                value={form.guests}
                onChange={(event) => setForm({ ...form, guests: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Photo URL</label>
              <input
                value={form.photoUrl}
                onChange={(event) => setForm({ ...form, photoUrl: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Rating</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(event) => setForm({ ...form, rating: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="4.7"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Google Place ID</label>
              <input
                value={form.googlePlaceId}
                onChange={(event) => setForm({ ...form, googlePlaceId: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="ChIJ..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Google Maps URL</label>
              <input
                value={form.googleMapsUrl}
                onChange={(event) => setForm({ ...form, googleMapsUrl: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="Optional override"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 resize-none"
              placeholder="Suite near Haram entrance, request crib"
            />
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
            disabled={saving || !form.tripId || !form.hotelName || !form.city || !form.country || !form.checkIn || !form.checkOut}
            className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-bold text-sm shadow-lg shadow-coral/25 disabled:opacity-50"
          >
            <Save size={14} className="inline mr-1.5" />
            {saving ? "Saving..." : stay ? "Save Changes" : "Add Stay"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StaysPage() {
  const [stays, setStays] = useState<StayData[]>([]);
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStay, setEditingStay] = useState<StayData | null>(null);

  const loadData = async () => {
    try {
      const [staysResponse, tripsResponse] = await Promise.all([
        fetch("/api/stays", { cache: "no-store" }),
        fetch("/api/trips", { cache: "no-store" }),
      ]);

      if (!staysResponse.ok || !tripsResponse.ok) {
        throw new Error("Failed to load stays.");
      }

      const [staysData, tripsData] = await Promise.all([
        staysResponse.json(),
        tripsResponse.json(),
      ]);

      setStays(staysData);
      setTrips(tripsData.map((trip: TripOption) => ({ id: trip.id, name: trip.name })));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load stays.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const groupedStays = useMemo(() => {
    const tripNames = new Map(trips.map((trip) => [trip.id, trip.name]));
    const grouped: Record<string, StayData[]> = {};

    stays.forEach((stay) => {
      const tripName = tripNames.get(stay.tripId) || "Unassigned Trip";
      if (!grouped[tripName]) {
        grouped[tripName] = [];
      }

      grouped[tripName].push(stay);
    });

    return Object.entries(grouped).sort((left, right) => left[0].localeCompare(right[0]));
  }, [stays, trips]);

  const handleSave = async (stay: StayFormData) => {
    try {
      setSaving(true);
      const payload = {
        tripId: stay.tripId,
        hotelName: stay.hotelName,
        address: stay.address || null,
        city: stay.city,
        country: stay.country,
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        checkInLabel: stay.checkInLabel || null,
        checkOutLabel: stay.checkOutLabel || null,
        confirmationCode: stay.confirmationCode || null,
        bookingProvider: stay.bookingProvider || null,
        roomType: stay.roomType || null,
        guests: stay.guests ? parseInt(stay.guests, 10) : 1,
        notes: stay.notes || null,
        googlePlaceId: stay.googlePlaceId || null,
        googleMapsUrl:
          stay.googleMapsUrl || getGoogleMapsUrl(stay.googlePlaceId || undefined, `${stay.hotelName} ${stay.city}`),
        photoUrl: stay.photoUrl || null,
        rating: stay.rating ? parseFloat(stay.rating) : null,
      };

      const response = await fetch(stay.id ? `/api/stays/${stay.id}` : "/api/stays", {
        method: stay.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save stay.");
      }

      const savedStay = await response.json();
      setStays((current) => {
        const existingIndex = current.findIndex((item) => item.id === savedStay.id);

        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex] = savedStay;
          return updated;
        }

        return [...current, savedStay].sort(
          (left, right) => new Date(left.checkIn).getTime() - new Date(right.checkIn).getTime()
        );
      });
      setShowModal(false);
      setEditingStay(null);
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save stay.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/stays/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete stay.");
      }

      setStays((current) => current.filter((stay) => stay.id !== id));
      setError(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete stay.");
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
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  className="text-3xl"
                >
                  🏨
                </motion.span>
                Stays
              </h1>
              <p className="text-sm text-slate-400 font-semibold">
                {loading ? "Loading stays..." : `${stays.length} reservation${stays.length !== 1 ? "s" : ""} tracked`}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingStay(null);
                setShowModal(true);
              }}
              disabled={trips.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-coral/25 disabled:opacity-50"
            >
              <Plus size={16} />
              Add Stay
            </motion.button>
          </motion.div>

          {error && (
            <motion.div variants={itemVariants} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              {error}
            </motion.div>
          )}

          {groupedStays.map(([tripName, tripStays]) => (
            <motion.div key={tripName} variants={itemVariants} className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <BedDouble size={16} className="text-coral" />
                {tripName}
                <span className="text-xs text-slate-300">({tripStays.length})</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {tripStays.map((stay) => {
                  const mapsUrl =
                    stay.googleMapsUrl ||
                    getGoogleMapsUrl(stay.googlePlaceId || undefined, `${stay.hotelName} ${stay.city}`);

                  return (
                    <motion.div
                      key={stay.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="glass rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all group relative"
                    >
                      <div className="absolute top-3 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingStay(stay);
                            setShowModal(true);
                          }}
                          className="p-2 rounded-full bg-white/90 hover:bg-coral/10 shadow-sm transition-colors"
                        >
                          <Edit3 size={13} className="text-slate-500" />
                        </button>
                        <button
                          onClick={() => {
                            void handleDelete(stay.id);
                          }}
                          className="p-2 rounded-full bg-white/90 hover:bg-red-50 shadow-sm transition-colors"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>

                      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200">
                        {stay.photoUrl ? (
                          <Image
                            src={stay.photoUrl}
                            alt={stay.hotelName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-6xl">🏨</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-xl font-black drop-shadow-lg">{stay.hotelName}</h3>
                          <p className="text-sm font-semibold text-white/85 flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {stay.city}, {stay.country}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(stay.checkIn)} to {formatDate(stay.checkOut)}
                          </div>
                          {stay.rating && (
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                              <Star size={12} className="text-sunshine fill-sunshine" />
                              {stay.rating}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                          {stay.checkInLabel && <span className="rounded-full bg-slate-100 px-3 py-1">Check-in {stay.checkInLabel}</span>}
                          {stay.checkOutLabel && <span className="rounded-full bg-slate-100 px-3 py-1">Check-out {stay.checkOutLabel}</span>}
                          <span className="rounded-full bg-slate-100 px-3 py-1 flex items-center gap-1">
                            <Users size={12} /> {stay.guests} guests
                          </span>
                        </div>

                        {(stay.bookingProvider || stay.roomType || stay.confirmationCode) && (
                          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                            {stay.bookingProvider && <span>{stay.bookingProvider}</span>}
                            {stay.roomType && <span>{stay.roomType}</span>}
                            {stay.confirmationCode && <span>Confirmation {stay.confirmationCode}</span>}
                          </div>
                        )}

                        {stay.address && <p className="text-sm text-slate-500">{stay.address}</p>}
                        {stay.notes && <p className="text-sm text-slate-500">{stay.notes}</p>}

                        <div className="pt-2">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-sky-50 hover:text-ocean transition-colors"
                          >
                            <ExternalLink size={14} />
                            Open in Maps
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {!loading && stays.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                🏨
              </motion.div>
              <p className="text-xl font-bold text-slate-400">No stays yet</p>
              <p className="text-sm text-slate-300 mt-2">Add your hotel reservations to keep them in one place</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <StayModal
            stay={editingStay}
            trips={trips}
            saving={saving}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingStay(null);
            }}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}