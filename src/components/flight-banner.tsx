"use client";

import { motion } from "framer-motion";
import { Plane, Clock } from "lucide-react";
import Image from "next/image";
import { FLIGHT_STATUS_CONFIG, getAirlineLogo } from "@/lib/constants";

interface FlightBannerProps {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  departureCity: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  status: string;
  gate?: string;
  terminal?: string;
}

export function FlightBanner({
  flightNumber,
  airline,
  airlineCode,
  departureCity,
  departureAirport,
  arrivalCity,
  arrivalAirport,
  scheduledDeparture,
  status,
  gate,
  terminal,
}: FlightBannerProps) {
  const statusConfig = FLIGHT_STATUS_CONFIG[status] || FLIGHT_STATUS_CONFIG.UNKNOWN;
  const departure = new Date(scheduledDeparture);
  const now = new Date();
  const hoursToGo = Math.max(
    0,
    Math.round((departure.getTime() - now.getTime()) / (1000 * 60 * 60))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-5 text-white shadow-2xl"
    >
      {/* Decorative plane path */}
      <div className="absolute top-3 right-3 opacity-10">
        <Plane size={80} className="rotate-45" />
      </div>

      {/* Airline & Flight Number */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
          <Image
            src={getAirlineLogo(airlineCode, 80)}
            alt={airline}
            width={32}
            height={16}
            className="object-contain"
            unoptimized
          />
        </div>
        <div>
          <div className="text-sm font-bold">{airline}</div>
          <div className="text-xs text-white/60 font-semibold">
            {flightNumber}
          </div>
        </div>
        <div className="ml-auto">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.animation || ""}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-black">{departureAirport}</div>
          <div className="text-xs text-white/50 font-semibold mt-0.5">
            {departureCity}
          </div>
        </div>

        <div className="flex-1 mx-4 flex items-center gap-2">
          <div className="flex-1 border-t border-dashed border-white/20" />
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Plane size={18} className="text-sky-400 rotate-0" />
          </motion.div>
          <div className="flex-1 border-t border-dashed border-white/20" />
        </div>

        <div className="text-center">
          <div className="text-2xl font-black">{arrivalAirport}</div>
          <div className="text-xs text-white/50 font-semibold mt-0.5">
            {arrivalCity}
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-white/70">
          <Clock size={14} />
          <span className="text-xs font-semibold">
            {departure.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            at{" "}
            {departure.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        {gate && (
          <div className="flex items-center gap-1.5 text-white/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Gate
            </span>
            <span className="text-sm font-bold text-sky-400">{gate}</span>
          </div>
        )}
        {terminal && (
          <div className="flex items-center gap-1.5 text-white/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Terminal
            </span>
            <span className="text-sm font-bold text-sky-400">{terminal}</span>
          </div>
        )}
        {hoursToGo > 0 && (
          <div className="ml-auto bg-white/10 rounded-xl px-3 py-1.5">
            <span className="text-sm font-black text-sunshine">
              {hoursToGo}h
            </span>
            <span className="text-[10px] text-white/50 font-semibold ml-1">
              to go
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
