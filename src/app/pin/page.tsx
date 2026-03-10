"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Lock, Plane, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function PinForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        router.push(redirect);
      } else {
        setError(true);
        setPin("");
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral/10 via-white to-sky/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-coral to-sunset shadow-xl shadow-coral/30 text-4xl mb-4"
          >
            ✈️
          </motion.div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Family Travel
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Enter your PIN to continue
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              animate={
                error
                  ? { x: [-4, 4, -4, 4, 0] }
                  : pin.length === i
                  ? { scale: [1, 1.3, 1] }
                  : {}
              }
              transition={error ? { duration: 0.3 } : { duration: 0.3, repeat: Infinity, repeatDelay: 0.5 }}
              className={`w-4 h-4 rounded-full transition-all ${
                i < pin.length
                  ? "bg-gradient-to-br from-coral to-sunset scale-110 shadow-md shadow-coral/25"
                  : "bg-slate-200"
              } ${error ? "bg-red-400" : ""}`}
            />
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"].map(
            (digit, i) => {
              if (digit === "") return <div key={i} />;

              return (
                <motion.button
                  key={digit}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    digit === "←" ? handleBackspace() : handleDigit(digit)
                  }
                  className="h-16 rounded-2xl bg-white shadow-md hover:shadow-lg text-xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:bg-slate-100"
                >
                  {digit}
                </motion.button>
              );
            }
          )}
        </div>

        {/* Submit Button */}
        {pin.length >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="pin" value={pin} />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-coral to-sunset text-white font-bold text-base shadow-xl shadow-coral/25 hover:shadow-2xl hover:shadow-coral/30 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Plane size={20} />
                  </motion.div>
                ) : (
                  <>
                    Unlock <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-red-500 font-semibold mt-4"
          >
            Wrong PIN. Try again!
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default function PinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-coral/10 via-white to-sky/10 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-coral to-sunset flex items-center justify-center text-4xl animate-bounce">
            ✈️
          </div>
        </div>
      }
    >
      <PinForm />
    </Suspense>
  );
}
