"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TripCardProps {
  id: string;
  name: string;
  type: "SOLO" | "FAMILY";
  startDate: string;
  endDate: string;
  cities: string[];
  countries: string[];
  coverImage: string;
  travelers: number;
  activitiesComplete: number;
  activitiesTotal: number;
}

function getCountdown(startDate: string): {
  days: number;
  label: string;
  isPast: boolean;
  isActive: boolean;
} {
  const now = new Date();
  const start = new Date(startDate);
  const diff = start.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return { days, label: "days to go", isPast: false, isActive: false };
  if (days === 0) return { days: 0, label: "Today!", isPast: false, isActive: true };
  return { days: Math.abs(days), label: "days ago", isPast: true, isActive: false };
}

export function TripCard({
  id,
  name,
  type,
  startDate,
  endDate,
  cities,
  coverImage,
  travelers,
  activitiesComplete,
  activitiesTotal,
}: TripCardProps) {
  const countdown = getCountdown(startDate);
  const progress =
    activitiesTotal > 0
      ? Math.round((activitiesComplete / activitiesTotal) * 100)
      : 0;

  const gradients = {
    SOLO: "from-sky-500/80 via-indigo-500/70 to-purple-600/80",
    FAMILY: "from-amber-400/80 via-rose-500/70 to-pink-600/80",
  };

  return (
    <Link href={`/trip/${id}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-3xl shadow-xl cursor-pointer group"
      >
        {/* Background Image */}
        <div className="relative h-56 sm:h-64">
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${gradients[type]} mix-blend-multiply`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          {/* Top Row */}
          <div className="flex items-start justify-between">
            {/* Trip Type Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="glass rounded-2xl px-3 py-1.5 flex items-center gap-1.5"
            >
              <span className="text-sm">
                {type === "SOLO" ? "✈️" : "👨‍👩‍👧‍👦"}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {type === "SOLO" ? "Solo Trip" : "Family Trip"}
              </span>
            </motion.div>

            {/* Countdown */}
            {!countdown.isPast && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="glass rounded-2xl px-4 py-2 text-center"
              >
                <div className="text-2xl font-black text-coral flip-number">
                  {countdown.days}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {countdown.label}
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Content */}
          <div className="space-y-3">
            {/* Trip Name */}
            <div>
              <h3 className="text-2xl font-extrabold text-white drop-shadow-lg">
                {name}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-white/80">
                  <MapPin size={14} />
                  <span className="text-xs font-semibold">
                    {cities.join(" → ")}
                  </span>
                </div>
                {travelers > 1 && (
                  <div className="flex items-center gap-1 text-white/80">
                    <Users size={14} />
                    <span className="text-xs font-semibold">
                      {travelers} travelers
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Date Range & Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/70">
                <Calendar size={14} />
                <span className="text-xs font-semibold">
                  {new Date(startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  –{" "}
                  {new Date(endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Progress Ring */}
              {activitiesTotal > 0 && (
                <div className="relative w-10 h-10">
                  <svg
                    className="w-10 h-10 -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 0.94} 94`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                    {progress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
