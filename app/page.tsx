import Link from "next/link";
import { HIRAGANA_CARDS, KATAKANA_CARDS, VOCAB_CARDS } from "@/lib/cards";

export default function HomePage() {
  return (
    <section className="hero">
      <h1>Belajar Bahasa Jepang, mulai dari kana.</h1>
      <p className="lead">
        Hongo Study v2 sedang dibangun bertahap. Fase 1 sudah berisi dataset
        awal lengkap — hiragana, katakana, dan 100 kosakata JLPT N5 — dan
        semuanya bisa dibuka tanpa login (mode tamu). Akun dan pengulangan
        terjadwal (SRS) datang di Fase 2.
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <strong>{HIRAGANA_CARDS.length}</strong>
          Hiragana
        </div>
        <div className="stat-card">
          <strong>{KATAKANA_CARDS.length}</strong>
          Katakana
        </div>
        <div className="stat-card">
          <strong>{VOCAB_CARDS.length}</strong>
          Kosakata N5
        </div>
      </div>

      <Link href="/kartu" className="cta">
        Lihat daftar kartu →
      </Link>
    </section>
  );
}
