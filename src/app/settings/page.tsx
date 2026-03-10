"use client";

import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Key,
  Globe,
  Calendar,
  Plane,
  Bell,
  Palette,
  Shield,
  ExternalLink,
  Check,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SettingsState {
  pin: string;
  timezone: string;
  tripItConnected: boolean;
  googleCalendarConnected: boolean;
  selectedCalendar: string;
  notifications: boolean;
}

const TIMEZONES = [
  "UTC",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Africa/Cairo",
  "Asia/Riyadh",
  "Europe/London",
  "America/New_York",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    pin: "",
    timezone: "Asia/Dubai",
    tripItConnected: false,
    googleCalendarConnected: false,
    selectedCalendar: "",
    notifications: true,
  });

  const [pinInput, setPinInput] = useState("");
  const [pinSaved, setPinSaved] = useState(false);

  const handleSavePin = async () => {
    if (pinInput.length < 4) return;
    // TODO: Call API to save hashed PIN
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2000);
    setPinInput("");
  };

  const handleConnectTripIt = () => {
    // TODO: Redirect to TripIt OAuth flow
    alert("TripIt OAuth flow would start here. Set TRIPIT_API_KEY and TRIPIT_API_SECRET in .env");
  };

  const handleConnectGoogle = () => {
    // TODO: Redirect to Google OAuth flow
    window.location.href = "/api/auth/google/callback?setup=true";
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <span className="text-3xl">⚙️</span> Settings
            </h1>
            <p className="text-sm text-slate-400 font-semibold">
              Configure your travel companion
            </p>
          </motion.div>

          {/* PIN Protection */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-coral to-sunset flex items-center justify-center text-white">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">PIN Protection</h2>
                <p className="text-xs text-slate-400">Set a PIN to protect access to your app</p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 4-6 digit PIN"
                maxLength={6}
                className="flex-1 px-4 py-3 rounded-2xl bg-white/80 border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-coral/40 tracking-[0.3em] text-center"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSavePin}
                disabled={pinInput.length < 4}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white text-sm font-bold shadow-lg shadow-coral/25 disabled:opacity-50"
              >
                {pinSaved ? <Check size={18} /> : "Save"}
              </motion.button>
            </div>
          </motion.div>

          {/* Timezone */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-ocean flex items-center justify-center text-white">
                <Globe size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Timezone</h2>
                <p className="text-xs text-slate-400">Used for flight times and schedules</p>
              </div>
            </div>

            <select
              value={settings.timezone}
              onChange={(e) => setSettings((s) => ({ ...s, timezone: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-coral/40"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </motion.div>

          {/* Integrations */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-6 space-y-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              🔗 Integrations
            </h2>

            {/* TripIt */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">
                  ✈️
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">TripIt</p>
                  <p className="text-xs text-slate-400">
                    {settings.tripItConnected ? "Connected" : "Sync itineraries from TripIt"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnectTripIt}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  settings.tripItConnected
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gradient-to-r from-sky-400 to-ocean text-white shadow-sm"
                }`}
              >
                {settings.tripItConnected ? "✅ Connected" : "Connect"}
              </motion.button>
            </div>

            {/* Google Calendar */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-xl">
                  📅
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Google Calendar</p>
                  <p className="text-xs text-slate-400">
                    {settings.googleCalendarConnected ? "Connected" : "Bi-directional calendar sync"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnectGoogle}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  settings.googleCalendarConnected
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm"
                }`}
              >
                {settings.googleCalendarConnected ? "✅ Connected" : "Connect"}
              </motion.button>
            </div>

            {/* AirLabs */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-xl">
                  🛩️
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">AirLabs</p>
                  <p className="text-xs text-slate-400">Real-time flight tracking</p>
                </div>
              </div>
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400">
                API Key in .env
              </span>
            </div>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">✈️👨‍👩‍👧‍👦🌍</div>
              <h2 className="text-lg font-black gradient-text">Family Travel Companion</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Built with ❤️ for the Aslam family adventures
              </p>
              <p className="text-xs text-slate-300 mt-2">
                Next.js · Tailwind CSS · Prisma · Azure
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppShell>
  );
}
