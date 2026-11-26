import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_JP, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "@/lib/auth";
import SiteHeader from "./components/SiteHeader";
import StudioToastHost from "./components/StudioToastHost";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hongo Study v2: Belajar Bahasa Jepang",
  description:
    "Belajar bahasa Jepang dari kana dan kosakata JLPT N5, dengan pengulangan terjadwal SM-2, kuis adaptif, dan dashboard progres.",
};

const COLOR_SCHEME_INIT = `try{var s=localStorage.getItem("hongo-color-scheme");if(s==="light"||s==="dark"){var m=document.querySelector('meta[name="color-scheme"]');if(m)m.setAttribute("content",s);}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${notoSansJp.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: COLOR_SCHEME_INIT }} />
      </head>
      <body>
        <a href="#konten-utama" className="skip-link visually-hidden">
          Langsung ke konten utama
        </a>
        <AuthProvider>
          <SiteHeader />
          <main id="konten-utama" className="site-main" tabIndex={-1}>
            {children}
          </main>
          <footer className="site-footer">
            <div className="footer-inner">
              <span>
                Hongo Study v2, kartu kana dan kosakata JLPT N5 dengan jadwal SM-2.
              </span>
              <nav className="footer-links" aria-label="Tautan kaki halaman">
                <Link href="/kartu">Daftar kartu</Link>
                <Link href="/belajar">Sesi belajar</Link>
                <Link href="/kuis">Kuis</Link>
                <Link href="/tentang">Tentang</Link>
              </nav>
            </div>
          </footer>
          <StudioToastHost />
        </AuthProvider>
      </body>
    </html>
  );
}
