"use client";

import { motion } from "framer-motion";
import { Check, Clock, SkipForward, Circle } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ACTIVITY_TYPE_EMOJI } from "@/lib/constants";

const subscribeToHydration = () => () => {};

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    type: string;
    status: string;
    startTime: string | null;
    endTime: string | null;
    notes: string | null;
    sortOrder: number;
  };
  index: number;
  isLast: boolean;
  onStatusChange: (status: string) => void;
}

const STATUS_CONFIG: Record<string, { icon: typeof Check; color: string; bg: string; label: string }> = {
  PLANNED: { icon: Circle, color: "text-slate-400", bg: "bg-slate-100", label: "Planned" },
  IN_PROGRESS: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50", label: "In Progress" },
  DONE: { icon: Check, color: "text-emerald-500", bg: "bg-emerald-50", label: "Done" },
  SKIPPED: { icon: SkipForward, color: "text-slate-300", bg: "bg-slate-50", label: "Skipped" },
};

const STATUS_CYCLE: string[] = ["PLANNED", "IN_PROGRESS", "DONE", "SKIPPED"];

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ActivityCard({ activity, index, isLast, onStatusChange }: ActivityCardProps) {
  const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const statusConfig = STATUS_CONFIG[activity.status] || STATUS_CONFIG.PLANNED;
  const StatusIcon = statusConfig.icon;
  const emoji = ACTIVITY_TYPE_EMOJI[activity.type] || "📌";

  const nextStatus = () => {
    const currentIdx = STATUS_CYCLE.indexOf(activity.status);
    const next = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
    onStatusChange(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3"
    >
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={nextStatus}
          className={`relative z-10 w-10 h-10 rounded-full ${statusConfig.bg} flex items-center justify-center border-2 border-white shadow-sm transition-all hover:scale-110`}
          title={`Status: ${statusConfig.label} — tap to change`}
        >
          {activity.status === "DONE" ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Check size={18} className="text-emerald-500" strokeWidth={3} />
            </motion.div>
          ) : (
            <StatusIcon size={16} className={statusConfig.color} />
          )}
        </motion.button>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-[20px] ${
              activity.status === "DONE" ? "bg-emerald-200" : "bg-slate-200"
            }`}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        whileHover={{ y: -1 }}
        className={`flex-1 glass rounded-2xl p-4 mb-2 transition-all ${
          activity.status === "DONE" ? "opacity-70" : ""
        } ${activity.status === "SKIPPED" ? "opacity-40" : ""}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{emoji}</span>
              <h4
                className={`font-bold text-slate-800 ${
                  activity.status === "DONE" ? "line-through" : ""
                }`}
              >
                {activity.name}
              </h4>
            </div>

            {/* Time */}
            {activity.startTime && (
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 font-semibold">
                <Clock size={12} />
                <span>{isHydrated ? formatTime(activity.startTime) : "..."}</span>
                {activity.endTime && <span> — {isHydrated ? formatTime(activity.endTime) : "..."}</span>}
              </div>
            )}

            {/* Notes */}
            {activity.notes && (
              <p className="text-xs text-slate-400 mt-1.5 italic">{activity.notes}</p>
            )}
          </div>

          {/* Status Badge */}
          <span
            className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
