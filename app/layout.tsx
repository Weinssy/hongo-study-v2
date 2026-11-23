import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import SiteHeader from "./components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hongo Study v2: Belajar Bahasa Jepang",
  description:
    "Belajar bahasa Jepang dari kana dan kosakata JLPT N5, dengan pengulangan terjadwal SM-2, kuis adaptif, dan dashboard progres.",
};

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
        </AuthProvider>
      </body>
    </html>
  );
}
