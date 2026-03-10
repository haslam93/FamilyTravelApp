"use client";

import { motion } from "framer-motion";
import {
  Home,
  CalendarDays,
  MapPin,
  FileText,
  Settings,
  Plane,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home", emoji: "🏠" },
  { href: "/itinerary", icon: CalendarDays, label: "Itinerary", emoji: "📅" },
  { href: "/places", icon: MapPin, label: "Places", emoji: "📍" },
  { href: "/flights", icon: Plane, label: "Flights", emoji: "✈️" },
  { href: "/umrah", icon: Moon, label: "Umrah", emoji: "🕋" },
  { href: "/recommendations", icon: Sparkles, label: "Discover", emoji: "✨" },
  { href: "/documents", icon: FileText, label: "Documents", emoji: "📄" },
  { href: "/settings", icon: Settings, label: "Settings", emoji: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } bg-white/80 backdrop-blur-xl border-r border-slate-100 shadow-sm`}
    >
      {/* Logo / App Name */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-100">
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-coral to-sunset flex items-center justify-center text-white text-lg shadow-lg shadow-coral/25">
          ✈️
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden"
          >
            <h1 className="text-lg font-extrabold gradient-text leading-tight">
              Family Travel
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Companion App
            </p>
          </motion.div>
        )}
      </div>

      {/* Family Avatar Row */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-1">
            {["👨", "👩", "👧", "👦", "👶"].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-light to-bubblegum-light flex items-center justify-center text-sm border-2 border-white shadow-sm -ml-1 first:ml-0"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-coral/10 to-sunset/10 text-coral shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-coral to-sunset"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="flex-shrink-0"
                />
                {!collapsed && (
                  <span
                    className={`text-sm ${
                      isActive ? "font-bold" : "font-semibold"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 mb-4 mx-3 rounded-2xl hover:bg-slate-50 text-slate-400 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
