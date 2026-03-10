"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Baby,
  Clock,
  Navigation,
  Plus,
  Sparkles,
  Filter,
  Loader2,
} from "lucide-react";
import { useState, useCallback } from "react";
import { AppShell } from "@/components/app-shell";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Recommendation {
  id: string;
  name: string;
  vicinity: string;
  rating: number;
  userRatingsTotal: number;
  types: string[];
  photoReference: string | null;
  lat: number;
  lng: number;
  openNow: boolean | null;
  priceLevel: number | null;
}

// ─── City Coordinates ────────────────────────────────────────────────────────

const CITY_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  hyderabad: { lat: 17.3850, lng: 78.4867, label: "Hyderabad" },
  delhi: { lat: 28.6139, lng: 77.2090, label: "Delhi" },
  cairo: { lat: 30.0444, lng: 31.2357, label: "Cairo" },
  sharm: { lat: 27.9158, lng: 34.3300, label: "Sharm El Sheikh" },
  makkah: { lat: 21.3891, lng: 39.8579, label: "Makkah" },
  madinah: { lat: 24.4672, lng: 39.6112, label: "Madinah" },
};

const PLACE_TYPES = [
  { value: "tourist_attraction", label: "Attractions", emoji: "🏛️" },
  { value: "restaurant", label: "Restaurants", emoji: "🍽️" },
  { value: "park", label: "Parks", emoji: "🌳" },
  { value: "museum", label: "Museums", emoji: "🏺" },
  { value: "shopping_mall", label: "Shopping", emoji: "🛍️" },
  { value: "cafe", label: "Cafés", emoji: "☕" },
  { value: "mosque", label: "Mosques", emoji: "🕌" },
  { value: "amusement_park", label: "Fun Parks", emoji: "🎢" },
  { value: "aquarium", label: "Aquariums", emoji: "🐠" },
  { value: "zoo", label: "Zoos", emoji: "🦁" },
];

// ─── Price Level Labels ──────────────────────────────────────────────────────

function getPriceLabel(level: number | null): string {
  if (level === null) return "";
  return "$".repeat(level + 1);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RecommendationsPage() {
  const [selectedCity, setSelectedCity] = useState("cairo");
  const [selectedType, setSelectedType] = useState("tourist_attraction");
  const [kidFriendly, setKidFriendly] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);

    try {
      const coords = CITY_COORDS[selectedCity];
      const params = new URLSearchParams({
        lat: String(coords.lat),
        lng: String(coords.lng),
        type: selectedType,
        radius: "5000",
        kidFriendly: String(kidFriendly),
        openNow: String(openNow),
      });

      const res = await fetch(`/api/recommendations?${params}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data.places || []);
      } else {
        console.error("Search error:", data.error);
        setResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedType, kidFriendly, openNow]);

  const typeInfo = PLACE_TYPES.find((t) => t.value === selectedType);
  const cityInfo = CITY_COORDS[selectedCity];

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-5xl mb-2">✨</div>
          <h1 className="text-3xl sm:text-4xl font-black text-gradient-main">
            Discover Nearby
          </h1>
          <p className="text-slate-400 font-semibold mt-1">
            Find amazing places near your destinations
          </p>
        </motion.div>

        {/* Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-5 space-y-4"
        >
          {/* City Selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              <MapPin size={12} className="inline mr-1" />
              City
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CITY_COORDS).map(([key, city]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCity(key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                    selectedCity === key
                      ? "bg-gradient-to-r from-ocean to-sky text-white shadow-lg shadow-ocean/25 scale-105"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>

          {/* Place Type */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              <Search size={12} className="inline mr-1" />
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {PLACE_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                    selectedType === type.value
                      ? "bg-gradient-to-r from-coral to-sunset text-white shadow-lg shadow-coral/25 scale-105"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <span>{type.emoji}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setKidFriendly(!kidFriendly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all ${
                kidFriendly
                  ? "bg-mint/20 text-emerald-700 ring-2 ring-mint"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Baby size={14} />
              Kid-Friendly
            </button>
            <button
              onClick={() => setOpenNow(!openNow)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all ${
                openNow
                  ? "bg-sky/20 text-blue-700 ring-2 ring-sky"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Clock size={14} />
              Open Now
            </button>
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-ocean to-sky text-white py-3 rounded-2xl font-bold text-lg shadow-lg shadow-ocean/25 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Find Places
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12"
            >
              <div className="w-12 h-12 rounded-full border-4 border-ocean/20 border-t-ocean animate-spin" />
              <p className="text-slate-400 font-bold mt-4">
                Searching {cityInfo.label}...
              </p>
            </motion.div>
          ) : searched && results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 glass rounded-3xl"
            >
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-slate-400 font-bold">No places found</p>
              <p className="text-sm text-slate-300 mt-1">
                Try a different category or city
              </p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-700">
                  {typeInfo?.emoji} {results.length} {typeInfo?.label || "Places"} near{" "}
                  {cityInfo.label}
                </h2>
              </div>

              {results.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-2xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Photo or Placeholder */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ocean/20 to-sky/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {place.photoReference ? (
                        <img
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${place.photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{typeInfo?.emoji || "📍"}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">
                        {place.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {place.vicinity}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {/* Rating */}
                        {place.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="text-amber-400"
                              fill="currentColor"
                            />
                            <span className="text-xs font-bold text-slate-600">
                              {place.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-300">
                              ({place.userRatingsTotal})
                            </span>
                          </div>
                        )}

                        {/* Open Status */}
                        {place.openNow !== null && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              place.openNow
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            {place.openNow ? "Open" : "Closed"}
                          </span>
                        )}

                        {/* Price Level */}
                        {place.priceLevel !== null && (
                          <span className="text-xs text-slate-400 font-semibold">
                            {getPriceLabel(place.priceLevel)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}&query_place_id=${place.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-xl bg-ocean/10 flex items-center justify-center hover:bg-ocean/20 transition-colors"
                        title="Open in Maps"
                      >
                        <Navigation
                          size={14}
                          className="text-ocean"
                        />
                      </a>
                      <button
                        className="w-8 h-8 rounded-xl bg-coral/10 flex items-center justify-center hover:bg-coral/20 transition-colors"
                        title="Add to itinerary"
                      >
                        <Plus size={14} className="text-coral" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-slate-400 font-bold text-lg">
                Discover amazing places
              </p>
              <p className="text-sm text-slate-300 mt-1">
                Select a city and category, then tap Find Places
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
