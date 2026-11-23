import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hongo Study v2 — Belajar Bahasa Jepang",
  description:
    "Platform belajar bahasa Jepang: kana, kosakata JLPT N5, dan (segera) pengulangan terjadwal SRS.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            Hongo Study <span>v2</span>
          </Link>
          <nav>
            <Link href="/kartu">Daftar Kartu</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          Hongo Study v2 — Fase 1: fondasi &amp; data. Mode tamu aktif, login
          menyusul di Fase 2.
        </footer>
      </body>
    </html>
  );
}
