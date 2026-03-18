import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "@/components/sw-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Travel Companion",
  description:
    "Track flights, itineraries, places, and documents for our family adventures — India 2026 & Egypt/Saudi Arabia 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Travel App",
  },
  icons: {
    icon: "/icons/app-icon.svg",
    shortcut: "/icons/app-icon.svg",
    apple: "/icons/app-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FF6B6B",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 font-[var(--font-body)] antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
