import Link from "next/link";
import { HIRAGANA_CARDS, KATAKANA_CARDS, VOCAB_CARDS } from "@/lib/cards";
import SakugaHomeCta from "./components/SakugaHomeCta";

export default function HomePage() {
  return (
    <section className="hero">
      <h1>Belajar Bahasa Jepang, mulai dari kana.</h1>
      <p className="lead">
        Hongo Study v2 berisi 46 hiragana, 46 katakana, dan 100 kosakata JLPT
        N5. Yang membedakannya dari sekadar daftar materi: aplikasi ini
        mencatat penilaianmu di tiap kartu, lalu mengatur kapan kartu itu
        muncul lagi supaya kamu mengulang tepat sebelum lupa.
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

      <h2>Mulai dari sini</h2>
      <div className="path-list">
        <div className="path-item">
          <h3>1. Sesi Belajar</h3>
          <p>
            Kartu yang jatuh tempo muncul lebih dulu. Nilai ingatanmu Lupa,
            Sulit, Bisa, atau Gampang; jadwal berikutnya dihitung dengan
            SM-2.
          </p>
          <SakugaHomeCta href="/belajar" label="Mulai sesi belajar" />
        </div>
        <div className="path-item">
          <h3>2. Kuis</h3>
          <p>
            Sepuluh soal pilihan ganda dan ketik romaji. Untuk pengguna yang
            masuk, soal diambil dari kartu yang paling lemah.
          </p>
          <SakugaHomeCta href="/kuis" label="Ikuti kuis 10 soal" variant="secondary" />
        </div>
        <div className="path-item">
          <h3>3. Dashboard</h3>
          <p>
            Streak harian, kartu yang sudah dikuasai, grafik aktivitas, dan
            lencana. Semua dihitung dari ulangan yang benar-benar kamu
            kerjakan.
          </p>
          <SakugaHomeCta href="/dashboard" label="Lihat progres saya" variant="secondary" />
        </div>
      </div>

      <p className="lead">
        Tanpa akun pun semua materi terbuka di{" "}
        <Link href="/kartu">daftar kartu</Link> dan progres tersimpan di
        perangkat ini. Penjelasan lengkapnya ada di halaman{" "}
        <Link href="/tentang">tentang</Link>.
      </p>
    </section>
  );
}
