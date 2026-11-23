"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function SiteHeader() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        Hongo Study <span>v2</span>
      </Link>
      <nav className="site-nav" aria-label="Navigasi utama">
        <Link href="/kartu">Kartu</Link>
        <Link href="/belajar">Belajar</Link>
        <Link href="/kuis">Kuis</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/tentang">Tentang</Link>
      </nav>
      <div className="header-account">
        {loading ? (
          <span className="account-note">Memeriksa sesi…</span>
        ) : user ? (
          <>
            <span className="account-email" title={user.email ?? ""}>
              {user.email}
            </span>
            <button type="button" className="btn btn-ghost" onClick={() => void signOut()}>
              Keluar
            </button>
          </>
        ) : (
          <Link href="/masuk" className="btn btn-ghost">
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}
