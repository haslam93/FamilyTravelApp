"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink, Check, Star, Baby } from "lucide-react";
import Image from "next/image";
import { PLACE_CATEGORY_EMOJI, PLACEHOLDER_IMAGE } from "@/lib/constants";
import { useState } from "react";

interface PlaceCardProps {
  id: string;
  name: string;
  category: string;
  photoUrl?: string;
  rating?: number;
  googleMapsUrl?: string;
  visited: boolean;
  kidFriendly: boolean;
  city: string;
  notes?: string;
  onToggleVisited?: (id: string) => void;
}

export function PlaceCard({
  id,
  name,
  category,
  photoUrl,
  rating,
  googleMapsUrl,
  visited,
  kidFriendly,
  city,
  notes,
  onToggleVisited,
}: PlaceCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces] = useState(() =>
    ["🎉", "⭐", "🎊", "✨", "🌟", "💫"].map((emoji, index) => ({
      emoji,
      index,
      x: (index - 2.5) * 40,
      yPeak: -60 - Math.random() * 40,
      rotate: Math.random() * 360,
    }))
  );
  const emoji = PLACE_CATEGORY_EMOJI[category] || "📍";

  const handleVisitToggle = () => {
    if (!visited) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    }
    onToggleVisited?.(id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all ${
        visited ? "ring-2 ring-mint" : "card-glow"
      }`}
    >
      {/* Confetti burst on visit */}
      {showConfetti && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          {confettiPieces.map((piece) => (
            <motion.span
              key={piece.index}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                x: piece.x,
                y: [0, piece.yPeak, 20],
                rotate: piece.rotate,
              }}
              transition={{ duration: 0.8, delay: piece.index * 0.05 }}
              className="absolute text-2xl"
            >
              {piece.emoji}
            </motion.span>
          ))}
        </div>
      )}

      {/* Photo */}
      <div className="relative h-36 overflow-hidden">
        <Image
          src={photoUrl || PLACEHOLDER_IMAGE}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={!photoUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1">
          <span className="text-sm">{emoji}</span>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {category}
          </span>
        </div>

        {/* Kid-Friendly Badge */}
        {kidFriendly && (
          <div className="absolute top-3 right-3 bg-mint/90 backdrop-blur-sm rounded-xl p-1.5">
            <Baby size={14} className="text-white" />
          </div>
        )}

        {/* Rating */}
        {rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-0.5">
            <Star size={12} className="text-sunshine fill-sunshine" />
            <span className="text-xs font-bold text-white">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-base font-extrabold text-slate-800 leading-tight">
            {name}
          </h4>
          <div className="flex items-center gap-1 mt-0.5 text-slate-400">
            <MapPin size={12} />
            <span className="text-xs font-semibold">{city}</span>
          </div>
        </div>

        {notes && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {notes}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Google Maps Link */}
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-ocean/10 text-ocean rounded-2xl py-2.5 text-xs font-bold hover:bg-ocean/20 transition-colors"
            >
              <ExternalLink size={14} />
              Open in Maps
            </a>
          )}

          {/* Visit Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleVisitToggle}
            className={`flex items-center justify-center gap-1.5 rounded-2xl py-2.5 px-4 text-xs font-bold transition-all ${
              visited
                ? "bg-mint text-white shadow-lg shadow-mint/25"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Check size={14} strokeWidth={3} />
            {visited ? "Visited!" : "Mark Done"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
