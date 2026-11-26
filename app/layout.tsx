import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth";
import SiteHeader from "./components/SiteHeader";
import SakugaToastHost from "./components/SakugaToastHost";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hongo Study v2: Belajar Bahasa Jepang",
  description:
    "Belajar bahasa Jepang dari kana dan kosakata JLPT N5, dengan pengulangan terjadwal SM-2, kuis adaptif, dan dashboard progres.",
};

const SAKUGA_SCRIPTS = [
  "/sakuga-vfx/button.js",
  "/sakuga-vfx/progress.js",
  "/sakuga-vfx/tabs.js",
  "/sakuga-vfx/radio.js",
  "/sakuga-vfx/input.js",
  "/sakuga-vfx/toast.js",
  "/sakuga-vfx/tooltip.js",
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <SiteHeader />
          <main className="container">{children}</main>
          <footer className="site-footer">
            Hongo Study v2: belajar bahasa Jepang dengan kartu dan pengulangan
            terjadwal.
          </footer>
          <SakugaToastHost />
        </AuthProvider>
        {SAKUGA_SCRIPTS.map((src) => (
          <Script key={src} src={src} strategy="afterInteractive" />
        ))}
      </body>
    </html>
  );
}
