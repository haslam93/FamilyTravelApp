"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, StickyNote } from "lucide-react";
import { useState } from "react";
import { ACTIVITY_TYPE_EMOJI } from "@/lib/constants";

interface AddActivityModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (activity: {
    name: string;
    type: string;
    status: string;
    startTime: string | null;
    endTime: string | null;
    notes: string | null;
  }) => void;
}

const ACTIVITY_TYPES = [
  "SIGHTSEEING",
  "MEAL",
  "FLIGHT",
  "HOTEL_CHECKIN",
  "HOTEL_CHECKOUT",
  "TRANSPORT",
  "UMRAH",
  "PRAYER",
  "REST",
  "SHOPPING",
  "OTHER",
];

export function AddActivityModal({ open, onClose, onAdd }: AddActivityModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("SIGHTSEEING");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      type,
      status: "PLANNED",
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: endTime ? new Date(endTime).toISOString() : null,
      notes: notes.trim() || null,
    });

    // Reset form
    setName("");
    setType("SIGHTSEEING");
    setStartTime("");
    setEndTime("");
    setNotes("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md z-50 glass rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800">Add Activity</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Visit the Pyramids"
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all"
                  autoFocus
                />
              </div>

              {/* Type Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ACTIVITY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-2xl text-center transition-all ${
                        type === t
                          ? "bg-gradient-to-br from-coral to-sunset text-white shadow-lg shadow-coral/25"
                          : "glass text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <span className="text-lg">{ACTIVITY_TYPE_EMOJI[t] || "📌"}</span>
                      <span className="text-[9px] font-bold leading-tight">
                        {t.replace(/_/g, " ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    <Clock size={12} className="inline mr-1" />
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white/80 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    <Clock size={12} className="inline mr-1" />
                    End
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white/80 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  <StickyNote size={12} className="inline mr-1" />
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any extra details..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-slate-200 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-coral/40 resize-none transition-all"
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-bold text-sm shadow-lg shadow-coral/25 transition-all disabled:opacity-50"
                disabled={!name.trim()}
              >
                Add to Itinerary ✨
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
