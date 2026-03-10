"use client";

import { motion } from "framer-motion";
import {
  Home,
  CalendarDays,
  MapPin,
  FileText,
  Settings,
  Moon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home", emoji: "🏠" },
  { href: "/itinerary", icon: CalendarDays, label: "Itinerary", emoji: "📅" },
  { href: "/places", icon: MapPin, label: "Places", emoji: "📍" },
  { href: "/umrah", icon: Moon, label: "Umrah", emoji: "🕋" },
  { href: "/recommendations", icon: Sparkles, label: "Discover", emoji: "✨" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
      <div className="glass border-t border-white/20 px-2 pb-1 pt-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`relative rounded-2xl p-2 transition-colors ${
                    isActive
                      ? "bg-gradient-to-br from-coral to-sunset text-white shadow-lg shadow-coral/25"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-coral"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.div>
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? "text-coral" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
