"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Plane,
  Shield,
  Car,
  Hotel,
  X,
  FolderOpen,
} from "lucide-react";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/app-shell";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Doc {
  id: string;
  name: string;
  type: string;
  fileName: string;
  fileSize: number | null;
  mimeType: string | null;
  tripName: string;
  notes: string | null;
  createdAt: string;
}

// ─── Document Type Config ────────────────────────────────────────────────────

const DOC_TYPE_CONFIG: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  PASSPORT: { emoji: "🛂", label: "Passport", color: "text-blue-600", bg: "bg-blue-50" },
  VISA: { emoji: "📋", label: "Visa", color: "text-purple-600", bg: "bg-purple-50" },
  FLIGHT_BOOKING: { emoji: "✈️", label: "Flight Booking", color: "text-sky-600", bg: "bg-sky-50" },
  HOTEL_BOOKING: { emoji: "🏨", label: "Hotel Booking", color: "text-amber-600", bg: "bg-amber-50" },
  INSURANCE: { emoji: "🛡️", label: "Insurance", color: "text-emerald-600", bg: "bg-emerald-50" },
  UMRAH_PERMIT: { emoji: "🕋", label: "Umrah Permit", color: "text-teal-600", bg: "bg-teal-50" },
  CAR_RENTAL: { emoji: "🚗", label: "Car Rental", color: "text-orange-600", bg: "bg-orange-50" },
  ITINERARY: { emoji: "📅", label: "Itinerary", color: "text-indigo-600", bg: "bg-indigo-50" },
  OTHER: { emoji: "📄", label: "Other", color: "text-slate-600", bg: "bg-slate-50" },
};

// ─── Demo Data ───────────────────────────────────────────────────────────────

const DEMO_DOCS: Doc[] = [
  { id: "d1", name: "Hammad's Passport", type: "PASSPORT", fileName: "passport-hammad.pdf", fileSize: 2450000, mimeType: "application/pdf", tripName: "India Solo Adventure", notes: "Valid until 2030", createdAt: "2026-02-15T10:00:00" },
  { id: "d2", name: "India Tourist Visa", type: "VISA", fileName: "india-visa-2026.pdf", fileSize: 1200000, mimeType: "application/pdf", tripName: "India Solo Adventure", notes: "30-day e-Visa", createdAt: "2026-03-01T14:30:00" },
  { id: "d3", name: "Emirates DXB-HYD", type: "FLIGHT_BOOKING", fileName: "emirates-ek505.pdf", fileSize: 890000, mimeType: "application/pdf", tripName: "India Solo Adventure", notes: "EK505, Apr 10", createdAt: "2026-01-20T09:00:00" },
  { id: "d4", name: "Taj Falaknuma Booking", type: "HOTEL_BOOKING", fileName: "taj-falaknuma.pdf", fileSize: 560000, mimeType: "application/pdf", tripName: "India Solo Adventure", notes: "Apr 10-15, Deluxe Room", createdAt: "2026-02-10T11:00:00" },
  { id: "d5", name: "Family Passports", type: "PASSPORT", fileName: "family-passports.pdf", fileSize: 8900000, mimeType: "application/pdf", tripName: "Egypt & Umrah Family Trip", notes: "All 5 family members", createdAt: "2026-06-01T08:00:00" },
  { id: "d6", name: "Egypt Visa", type: "VISA", fileName: "egypt-visa-family.pdf", fileSize: 3100000, mimeType: "application/pdf", tripName: "Egypt & Umrah Family Trip", notes: "Family of 5", createdAt: "2026-09-15T16:00:00" },
  { id: "d7", name: "Umrah Permit", type: "UMRAH_PERMIT", fileName: "umrah-permit-2026.pdf", fileSize: 1500000, mimeType: "application/pdf", tripName: "Egypt & Umrah Family Trip", notes: "Ministry of Hajj permit", createdAt: "2026-10-01T12:00:00" },
  { id: "d8", name: "Travel Insurance", type: "INSURANCE", fileName: "travel-insurance.pdf", fileSize: 750000, mimeType: "application/pdf", tripName: "Egypt & Umrah Family Trip", notes: "Family plan, Dec 5-22", createdAt: "2026-11-01T10:00:00" },
];

const DOC_TYPES = ["ALL", ...Object.keys(DOC_TYPE_CONFIG)];

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>(DEMO_DOCS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [tripFilter, setTripFilter] = useState("All Trips");

  const tripNames = useMemo(() => {
    const names = new Set(docs.map((d) => d.tripName));
    return ["All Trips", ...names];
  }, [docs]);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "ALL" && d.type !== typeFilter) return false;
      if (tripFilter !== "All Trips" && d.tripName !== tripFilter) return false;
      return true;
    });
  }, [docs, search, typeFilter, tripFilter]);

  // Group by trip
  const grouped = useMemo(() => {
    const groups: Record<string, Doc[]> = {};
    filtered.forEach((doc) => {
      if (!groups[doc.tripName]) groups[doc.tripName] = [];
      groups[doc.tripName].push(doc);
    });
    return groups;
  }, [filtered]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <span className="text-3xl">📄</span> Document Vault
              </h1>
              <p className="text-sm text-slate-400 font-semibold">
                {docs.length} document{docs.length !== 1 ? "s" : ""} stored securely
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-coral to-sunset text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-coral/25"
            >
              <Upload size={16} />
              Upload
            </motion.button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {Object.entries(DOC_TYPE_CONFIG)
              .filter(([type]) => docs.some((d) => d.type === type))
              .slice(0, 5)
              .map(([type, config]) => {
                const count = docs.filter((d) => d.type === type).length;
                return (
                  <motion.button
                    key={type}
                    whileHover={{ y: -2 }}
                    onClick={() => setTypeFilter(typeFilter === type ? "ALL" : type)}
                    className={`rounded-2xl p-3 text-center transition-all ${
                      typeFilter === type ? `${config.bg} ring-2 ring-coral/30` : "glass"
                    }`}
                  >
                    <div className="text-2xl mb-1">{config.emoji}</div>
                    <div className="text-lg font-black text-slate-800">{count}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">{config.label}</div>
                  </motion.button>
                );
              })}
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
              />
            </div>
            <select
              value={tripFilter}
              onChange={(e) => setTripFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl glass text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-coral/40"
            >
              {tripNames.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </motion.div>

          {/* Document Groups */}
          {Object.entries(grouped).map(([tripName, tripDocs]) => (
            <motion.div key={tripName} variants={itemVariants} className="space-y-3">
              <h2 className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <FolderOpen size={16} className="text-coral" />
                {tripName}
                <span className="text-slate-300 font-normal">({tripDocs.length})</span>
              </h2>

              <div className="space-y-2">
                {tripDocs.map((doc) => {
                  const config = DOC_TYPE_CONFIG[doc.type] || DOC_TYPE_CONFIG.OTHER;
                  return (
                    <motion.div
                      key={doc.id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="glass rounded-2xl p-4 flex items-center gap-4"
                    >
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center text-xl flex-shrink-0`}>
                        {config.emoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{doc.name}</h3>
                        <p className="text-xs text-slate-400 font-semibold flex items-center gap-2 mt-0.5">
                          <span className={`${config.color} font-bold`}>{config.label}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span>•</span>
                          <span>{doc.fileName}</span>
                        </p>
                        {doc.notes && (
                          <p className="text-xs text-slate-300 mt-1 italic truncate">{doc.notes}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button className="p-2 rounded-xl hover:bg-sky-50 text-slate-300 hover:text-ocean transition-all" title="Preview">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-emerald-50 text-slate-300 hover:text-emerald-500 transition-all" title="Download">
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))}
                          className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Empty State */}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-lg font-bold text-slate-500">No documents found</h3>
              <p className="text-sm text-slate-400 mt-1">Upload your first document to get started</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
