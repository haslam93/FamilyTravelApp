"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Star,
  ExternalLink,
  CheckCircle2,
  X,
  Baby,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { PLACE_CATEGORY_EMOJI, PLACEHOLDER_IMAGE } from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Place {
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
  notes: string | null;
}

// ─── Demo Data ───────────────────────────────────────────────────────────────

const DEMO_PLACES: Place[] = [
  { id: "p1", name: "Charminar", category: "LANDMARK", city: "Hyderabad", country: "India", photoUrl: "https://images.unsplash.com/photo-1572638075568-07d4a3a77375?w=400&q=80", rating: 4.6, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Charminar", notes: "Iconic 16th-century monument" },
  { id: "p2", name: "Golconda Fort", category: "LANDMARK", city: "Hyderabad", country: "India", photoUrl: "https://images.unsplash.com/photo-1584806749948-697891c67821?w=400&q=80", rating: 4.5, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Golconda+Fort", notes: "Medieval fortress with sound & light show" },
  { id: "p3", name: "Paradise Restaurant", category: "EAT", city: "Hyderabad", country: "India", photoUrl: null, rating: 4.3, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Paradise+Restaurant+Hyderabad", notes: "Famous for Hyderabadi Biryani" },
  { id: "p4", name: "Pyramids of Giza", category: "LANDMARK", city: "Cairo", country: "Egypt", photoUrl: "https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=400&q=80", rating: 4.7, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Pyramids+of+Giza", notes: "One of the Seven Wonders" },
  { id: "p5", name: "Grand Egyptian Museum", category: "MUSEUM", city: "Cairo", country: "Egypt", photoUrl: null, rating: 4.8, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Grand+Egyptian+Museum", notes: "World's largest archaeological museum" },
  { id: "p6", name: "Khan el-Khalili", category: "SHOP", city: "Cairo", country: "Egypt", photoUrl: null, rating: 4.2, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Khan+el-Khalili", notes: "Historic bazaar and marketplace" },
  { id: "p7", name: "Masjid al-Haram", category: "PRAY", city: "Makkah", country: "Saudi Arabia", photoUrl: "https://images.unsplash.com/photo-1591604129939-f1efa4d99f7e?w=400&q=80", rating: 4.9, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Masjid+al-Haram", notes: "The holiest mosque in Islam" },
  { id: "p8", name: "Masjid an-Nabawi", category: "PRAY", city: "Madinah", country: "Saudi Arabia", photoUrl: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=400&q=80", rating: 4.9, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Masjid+an-Nabawi", notes: "The Prophet's Mosque" },
  { id: "p9", name: "Ras Muhammad", category: "BEACH", city: "Sharm El Sheikh", country: "Egypt", photoUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80", rating: 4.6, kidFriendly: false, visited: false, googleMapsUrl: "https://maps.google.com/?q=Ras+Muhammad", notes: "National park with amazing snorkeling" },
  { id: "p10", name: "India Gate", category: "LANDMARK", city: "Delhi", country: "India", photoUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80", rating: 4.5, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=India+Gate+Delhi", notes: "War memorial and iconic landmark" },
];

const CATEGORIES = ["ALL", "EAT", "VISIT", "HOTEL", "PRAY", "SHOP", "BEACH", "MUSEUM", "PARK", "LANDMARK", "OTHER"];
const CITIES = ["All Cities", "Hyderabad", "Delhi", "Cairo", "Sharm El Sheikh", "Makkah", "Madinah"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>(DEMO_PLACES);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [city, setCity] = useState("All Cities");
  const [showVisited, setShowVisited] = useState<"all" | "visited" | "unvisited">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "ALL" && p.category !== category) return false;
      if (city !== "All Cities" && p.city !== city) return false;
      if (showVisited === "visited" && !p.visited) return false;
      if (showVisited === "unvisited" && p.visited) return false;
      return true;
    });
  }, [places, search, category, city, showVisited]);

  const toggleVisited = (id: string) => {
    setPlaces((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, visited: !p.visited, ...(p.visited ? {} : { visitedAt: new Date().toISOString() }) } : p
      )
    );
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <span className="text-3xl">📍</span> Places
              </h1>
              <p className="text-sm text-slate-400 font-semibold">
                {filtered.length} place{filtered.length !== 1 ? "s" : ""} to explore
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-coral/25"
            >
              <Plus size={16} />
              Add Place
            </motion.button>
          </motion.div>

          {/* Search & Filters */}
          <motion.div variants={itemVariants} className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    category === cat
                      ? "bg-gradient-to-r from-coral to-sunset text-white shadow-sm"
                      : "glass text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {cat !== "ALL" && <span>{PLACE_CATEGORY_EMOJI[cat] || "📍"}</span>}
                  {cat === "ALL" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* City & Visited Filters */}
            <div className="flex gap-3 flex-wrap">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2 rounded-2xl glass text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/40"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <div className="flex rounded-2xl glass overflow-hidden">
                {(["all", "unvisited", "visited"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setShowVisited(v)}
                    className={`px-3 py-2 text-xs font-bold transition-all ${
                      showVisited === v
                        ? "bg-gradient-to-r from-coral to-sunset text-white"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Places Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((place) => (
                <motion.div
                  key={place.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`glass rounded-3xl overflow-hidden shadow-md transition-all ${
                    place.visited ? "opacity-75" : ""
                  }`}
                >
                  {/* Photo */}
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

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="glass rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-600 flex items-center gap-1">
                        {PLACE_CATEGORY_EMOJI[place.category]} {place.category}
                      </span>
                    </div>

                    {/* Kid Friendly Badge */}
                    {place.kidFriendly && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-emerald-400 text-white rounded-full px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                          <Baby size={10} /> Kids OK
                        </span>
                      </div>
                    )}

                    {/* Visited Overlay */}
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

                  {/* Content */}
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

                    {place.notes && (
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{place.notes}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleVisited(place.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          place.visited
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-50 text-slate-500 hover:bg-coral/10 hover:text-coral"
                        }`}
                      >
                        {place.visited ? "✅ Visited" : "Mark Visited"}
                      </motion.button>

                      {place.googleMapsUrl && (
                        <a
                          href={place.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-ocean hover:bg-sky-50 transition-all"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-500">No places found</h3>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
