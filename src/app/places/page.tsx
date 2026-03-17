"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MapPin,
  Star,
  ExternalLink,
  CheckCircle2,
  X,
  Baby,
  Edit3,
  Trash2,
  Save,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { PLACE_CATEGORY_EMOJI } from "@/lib/constants";

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

const INITIAL_PLACES: Place[] = [
  { id: "p1", name: "Charminar", category: "LANDMARK", city: "Hyderabad", country: "India", photoUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80", rating: 4.6, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Charminar", notes: "Iconic 16th-century monument" },
  { id: "p2", name: "Golconda Fort", category: "LANDMARK", city: "Hyderabad", country: "India", photoUrl: "https://images.unsplash.com/photo-1584806749948-697891c67821?w=400&q=80", rating: 4.5, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Golconda+Fort", notes: "Medieval fortress with sound & light show" },
  { id: "p3", name: "Paradise Restaurant", category: "EAT", city: "Hyderabad", country: "India", photoUrl: null, rating: 4.3, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Paradise+Restaurant+Hyderabad", notes: "Famous for Hyderabadi Biryani" },
  { id: "p4", name: "Pyramids of Giza", category: "LANDMARK", city: "Cairo", country: "Egypt", photoUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=80", rating: 4.7, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Pyramids+of+Giza", notes: "One of the Seven Wonders" },
  { id: "p5", name: "Grand Egyptian Museum", category: "MUSEUM", city: "Cairo", country: "Egypt", photoUrl: null, rating: 4.8, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Grand+Egyptian+Museum", notes: "World's largest archaeological museum" },
  { id: "p6", name: "Khan el-Khalili", category: "SHOP", city: "Cairo", country: "Egypt", photoUrl: null, rating: 4.2, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Khan+el-Khalili", notes: "Historic bazaar and marketplace" },
  { id: "p7", name: "Masjid al-Haram", category: "PRAY", city: "Makkah", country: "Saudi Arabia", photoUrl: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=400&q=80", rating: 4.9, kidFriendly: true, visited: false, googleMapsUrl: "https://maps.google.com/?q=Masjid+al-Haram", notes: "The holiest mosque in Islam" },
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
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

// ─── Place Modal ─────────────────────────────────────────────────────────────

function PlaceModal({
  place,
  onSave,
  onClose,
}: {
  place: Place | null;
  onSave: (p: Place) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Place>(
    place || {
      id: `pl-${Date.now()}`,
      name: "",
      category: "VISIT",
      city: "Hyderabad",
      country: "India",
      photoUrl: null,
      rating: null,
      kidFriendly: true,
      visited: false,
      googleMapsUrl: null,
      notes: null,
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
            📍 {place ? "Edit Place" : "Add Place"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Place Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="Pyramids of Giza" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40">
                {CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                  <option key={c} value={c}>{PLACE_CATEGORY_EMOJI[c] || "📍"} {c.charAt(0) + c.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating ?? ""}
                onChange={(e) => setForm({ ...form, rating: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="4.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">City</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40">
                {CITIES.filter((c) => c !== "All Cities").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Country</label>
              <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="Egypt" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Photo URL (optional)</label>
            <input value={form.photoUrl || ""} onChange={(e) => setForm({ ...form, photoUrl: e.target.value || null })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="https://images.unsplash.com/..." />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Google Maps URL (optional)</label>
            <input value={form.googleMapsUrl || ""} onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value || null })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40" placeholder="https://maps.google.com/?q=..." />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Notes</label>
            <textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value || null })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/40 resize-none" rows={2} placeholder="Brief description..." />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-11 h-6 rounded-full relative transition-colors ${form.kidFriendly ? "bg-emerald-400" : "bg-slate-200"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.kidFriendly ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm font-bold text-slate-600 flex items-center gap-1"><Baby size={14} /> Kid Friendly</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            disabled={!form.name}
            className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-bold text-sm shadow-lg shadow-coral/25 disabled:opacity-50">
            <Save size={14} className="inline mr-1.5" />
            {place ? "Save Changes" : "Add Place"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [city, setCity] = useState("All Cities");
  const [showVisited, setShowVisited] = useState<"all" | "visited" | "unvisited">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

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
      prev.map((p) => (p.id === id ? { ...p, visited: !p.visited } : p))
    );
  };

  const handleSave = (place: Place) => {
    setPlaces((prev) => {
      const idx = prev.findIndex((p) => p.id === place.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = place;
        return updated;
      }
      return [...prev, place];
    });
  };

  const handleDelete = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
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
                {filtered.length} place{filtered.length !== 1 ? "s" : ""} to explore
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditingPlace(null); setShowModal(true); }}
              className="flex items-center gap-2 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-coral/25"
            >
              <Plus size={16} />
              Add Place
            </motion.button>
          </motion.div>

          {/* Search & Filters */}
          <motion.div variants={itemVariants} className="space-y-3">
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
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <X size={16} />
                </button>
              )}
            </div>

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

            <div className="flex gap-3 flex-wrap">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2 rounded-2xl glass text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/40"
              >
                {CITIES.map((c) => <option key={c}>{c}</option>)}
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
                  className={`glass rounded-3xl overflow-hidden shadow-md transition-all group relative ${
                    place.visited ? "opacity-75" : ""
                  }`}
                >
                  {/* Edit/Delete Buttons */}
                  <div className="absolute top-3 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingPlace(place); setShowModal(true); }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-coral/10 shadow-sm transition-colors"
                    >
                      <Edit3 size={12} className="text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(place.id)}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-red-50 shadow-sm transition-colors"
                    >
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>

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

                  {/* Content */}
                  <div className="p-4">
                    <h3 className={`font-bold text-slate-800 ${place.visited ? "line-through" : ""}`}>{place.name}</h3>
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
                        <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-ocean hover:bg-sky-50 transition-all">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-7xl mb-4">🔍</motion.div>
              <h3 className="text-lg font-bold text-slate-500">No places found</h3>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <PlaceModal
            place={editingPlace}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
