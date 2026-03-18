"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  CheckCircle2,
  Edit3,
  ExternalLink,
  MapPin,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { getGoogleMapsUrl, PLACE_CATEGORY_EMOJI } from "@/lib/constants";

interface PlaceData {
  id: string;
  name: string;
  category: string;
  city: string;
  country: string;
  photoUrl: string | null;
  rating: number | null;
  kidFriendly: boolean;
  visited: boolean;
  googleMapsUrl: string | null;
  googlePlaceId: string | null;
  notes: string | null;
}

interface PlaceFormData {
  id?: string;
  name: string;
  category: string;
  city: string;
  country: string;
  photoUrl: string;
  rating: string;
  kidFriendly: boolean;
  googleMapsUrl: string;
  googlePlaceId: string;
  notes: string;
}

const CATEGORY_OPTIONS = [
  "ALL",
  "EAT",
  "VISIT",
  "HOTEL",
  "PRAY",
  "SHOP",
  "BEACH",
  "MUSEUM",
  "PARK",
  "LANDMARK",
  "OTHER",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

function PlaceModal({
  place,
  cities,
  saving,
  onSave,
  onClose,
}: {
  place: PlaceData | null;
  cities: string[];
  saving: boolean;
  onSave: (place: PlaceFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PlaceFormData>(() => ({
    id: place?.id,
    name: place?.name || "",
    category: place?.category || "VISIT",
    city: place?.city || cities[0] || "Hyderabad",
    country: place?.country || "India",
    photoUrl: place?.photoUrl || "",
    rating: place?.rating?.toString() || "",
    kidFriendly: place?.kidFriendly ?? true,
    googleMapsUrl: place?.googleMapsUrl || "",
    googlePlaceId: place?.googlePlaceId || "",
    notes: place?.notes || "",
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
        className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            📍 {place ? "Edit Place" : "Add Place"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Place Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              placeholder="Pyramids of Giza"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              >
                {CATEGORY_OPTIONS.filter((item) => item !== "ALL").map((item) => (
                  <option key={item} value={item}>
                    {PLACE_CATEGORY_EMOJI[item] || "📍"} {item.charAt(0) + item.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(event) => setForm({ ...form, rating: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
                placeholder="4.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">City</label>
              <select
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
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
            <label className="text-xs font-bold text-slate-500 block mb-1">Photo URL</label>
            <input
              value={form.photoUrl}
              onChange={(event) => setForm({ ...form, photoUrl: event.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

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

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 resize-none"
              rows={2}
              placeholder="Brief description..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              aria-label="Toggle kid friendly"
              onClick={() => setForm({ ...form, kidFriendly: !form.kidFriendly })}
              className={`w-11 h-6 rounded-full relative transition-colors ${
                form.kidFriendly ? "bg-emerald-400" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  form.kidFriendly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-bold text-slate-600 flex items-center gap-1">
              <Baby size={14} /> Kid Friendly
            </span>
          </label>
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
            disabled={saving || !form.name || !form.city || !form.country}
            className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-bold text-sm shadow-lg shadow-coral/25 disabled:opacity-50"
          >
            <Save size={14} className="inline mr-1.5" />
            {saving ? "Saving..." : place ? "Save Changes" : "Add Place"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [city, setCity] = useState("All Cities");
  const [showVisited, setShowVisited] = useState<"all" | "visited" | "unvisited">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PlaceData | null>(null);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const response = await fetch("/api/places", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load places.");
        }

        const data = await response.json();
        setPlaces(data);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load places.");
      } finally {
        setLoading(false);
      }
    };

    void loadPlaces();
  }, []);

  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(new Set(places.map((place) => place.city))).sort((left, right) =>
      left.localeCompare(right)
    );

    const fallbackCities = ["Hyderabad", "Delhi", "Cairo", "Sharm El Sheikh", "Makkah", "Madinah"];

    return ["All Cities", ...(uniqueCities.length > 0 ? uniqueCities : fallbackCities)];
  }, [places]);

  const filtered = useMemo(() => {
    return places.filter((place) => {
      if (search && !place.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (category !== "ALL" && place.category !== category) {
        return false;
      }

      if (city !== "All Cities" && place.city !== city) {
        return false;
      }

      if (showVisited === "visited" && !place.visited) {
        return false;
      }

      if (showVisited === "unvisited" && place.visited) {
        return false;
      }

      return true;
    });
  }, [places, search, category, city, showVisited]);

  const handleSave = async (place: PlaceFormData) => {
    try {
      setSaving(true);
      const derivedMapsUrl =
        place.googleMapsUrl || getGoogleMapsUrl(place.googlePlaceId || undefined, `${place.name} ${place.city}`);

      const payload = {
        name: place.name,
        category: place.category,
        city: place.city,
        country: place.country,
        photoUrl: place.photoUrl || null,
        rating: place.rating ? parseFloat(place.rating) : null,
        kidFriendly: place.kidFriendly,
        googleMapsUrl: derivedMapsUrl,
        googlePlaceId: place.googlePlaceId || null,
        notes: place.notes || null,
      };

      const response = await fetch(place.id ? `/api/places/${place.id}` : "/api/places", {
        method: place.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save place.");
      }

      const savedPlace = await response.json();
      setPlaces((current) => {
        const existingIndex = current.findIndex((item) => item.id === savedPlace.id);

        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex] = savedPlace;
          return updated;
        }

        return [...current, savedPlace];
      });
      setShowModal(false);
      setEditingPlace(null);
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save place.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/places/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete place.");
      }

      setPlaces((current) => current.filter((place) => place.id !== id));
      setError(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete place.");
    }
  };

  const toggleVisited = async (place: PlaceData) => {
    try {
      const response = await fetch(`/api/places/${place.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visited: !place.visited }),
      });

      if (!response.ok) {
        throw new Error("Failed to update place.");
      }

      const updatedPlace = await response.json();
      setPlaces((current) =>
        current.map((item) => (item.id === updatedPlace.id ? updatedPlace : item))
      );
      setError(null);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Failed to update place.");
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  className="text-3xl"
                >
                  📍
                </motion.span>
                Places
              </h1>
              <p className="text-sm text-slate-400 font-semibold">
                {loading ? "Loading places..." : `${filtered.length} place${filtered.length !== 1 ? "s" : ""} to explore`}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingPlace(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-coral/25"
            >
              <Plus size={16} />
              Add Place
            </motion.button>
          </motion.div>

          {error && (
            <motion.div variants={itemVariants} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="space-y-3">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search places..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORY_OPTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    category === item
                      ? "bg-gradient-to-r from-coral to-sunset text-white shadow-sm"
                      : "glass text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {item !== "ALL" && <span>{PLACE_CATEGORY_EMOJI[item] || "📍"}</span>}
                  {item === "ALL" ? "All" : item.charAt(0) + item.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="px-3 py-2 rounded-2xl glass text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/40"
              >
                {cityOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <div className="flex rounded-2xl glass overflow-hidden">
                {(["all", "unvisited", "visited"] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => setShowVisited(value)}
                    className={`px-3 py-2 text-xs font-bold transition-all ${
                      showVisited === value
                        ? "bg-gradient-to-r from-coral to-sunset text-white"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((place) => {
                const mapsUrl =
                  place.googleMapsUrl ||
                  getGoogleMapsUrl(place.googlePlaceId || undefined, `${place.name} ${place.city}`);

                return (
                  <motion.div
                    key={place.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`glass rounded-3xl overflow-hidden shadow-md transition-all group relative ${
                      place.visited ? "opacity-75" : ""
                    }`}
                  >
                    <div className="absolute top-3 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingPlace(place);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-full bg-white/90 hover:bg-coral/10 shadow-sm transition-colors"
                      >
                        <Edit3 size={12} className="text-slate-500" />
                      </button>
                      <button
                        onClick={() => {
                          void handleDelete(place.id);
                        }}
                        className="p-1.5 rounded-full bg-white/90 hover:bg-red-50 shadow-sm transition-colors"
                      >
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    </div>

                    <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200">
                      {place.photoUrl ? (
                        <Image
                          src={place.photoUrl}
                          alt={place.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-5xl">{PLACE_CATEGORY_EMOJI[place.category] || "📍"}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="glass rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-600 flex items-center gap-1">
                          {PLACE_CATEGORY_EMOJI[place.category]} {place.category}
                        </span>
                      </div>

                      {place.kidFriendly && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-emerald-400 text-white rounded-full px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                            <Baby size={10} /> Kids OK
                          </span>
                        </div>
                      )}

                      {place.visited && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                            className="bg-emerald-500 text-white rounded-full p-3"
                          >
                            <CheckCircle2 size={28} />
                          </motion.div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className={`font-bold text-slate-800 ${place.visited ? "line-through" : ""}`}>
                        {place.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin size={11} />
                        {place.city}, {place.country}
                      </p>

                      {place.rating && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star size={12} className="text-sunshine fill-sunshine" />
                          <span className="text-xs font-bold text-slate-600">{place.rating}</span>
                        </div>
                      )}

                      {place.notes && <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{place.notes}</p>}

                      <div className="flex items-center gap-2 mt-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            void toggleVisited(place);
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            place.visited
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-50 text-slate-500 hover:bg-coral/10 hover:text-coral"
                          }`}
                        >
                          {place.visited ? "✅ Visited" : "Mark Visited"}
                        </motion.button>

                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-ocean hover:bg-sky-50 transition-all"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🔍
              </motion.div>
              <h3 className="text-lg font-bold text-slate-500">No places found</h3>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <PlaceModal
            place={editingPlace}
            cities={cityOptions.filter((item) => item !== "All Cities")}
            saving={saving}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingPlace(null);
            }}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
