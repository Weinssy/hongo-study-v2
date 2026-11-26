import Link from "next/link";
import { HIRAGANA_CARDS, KATAKANA_CARDS, VOCAB_CARDS } from "@/lib/cards";
import HomeSpecimenCard from "./components/HomeSpecimenCard";

export default function HomePage() {
  const sampleCards = [HIRAGANA_CARDS[0], KATAKANA_CARDS[0], VOCAB_CARDS[0]].filter(Boolean);

  return (
    <>
      <section className="home-stage">
        <div className="home-opening">
          <div className="home-opening-copy">
            <h1>Belajar huruf dan kosakata Jepang sampai hafal.</h1>
            <p className="home-opening-lead">
              Empat puluh enam hiragana, 46 katakana, dan 100 kosakata JLPT N5
              dengan jadwal ulangan SM-2 agar kamu mengulang tepat sebelum lupa.
            </p>
            <div className="home-opening-actions">
              <Link href="/belajar" className="btn btn-primary">
                Mulai sesi belajar
              </Link>
              <Link href="/kartu" className="text-action-link">
                Jelajahi 192 kartu
              </Link>
            </div>
          </div>

          <HomeSpecimenCard samples={sampleCards} />
        </div>
      </section>

      <section className="curriculum-band" aria-labelledby="kurikulum-judul">
        <div className="curriculum-inner">
          <h2 id="kurikulum-judul">Isi dataset yang siap kamu pelajari</h2>
          <div className="curriculum-grid">
            <Link href="/kartu" className="curriculum-cell">
              <span className="curriculum-num">{HIRAGANA_CARDS.length}</span>
              <span className="curriculum-label">Hiragana dasar</span>
              <span className="meta-note">
                Tabel gojuuon lengkap dari a sampai n beserta bacaan romaji.
              </span>
            </Link>
            <Link href="/kartu" className="curriculum-cell">
              <span className="curriculum-num">{KATAKANA_CARDS.length}</span>
              <span className="curriculum-label">Katakana dasar</span>
              <span className="meta-note">
                Pasangan katakana sejajar urutan gojuuon untuk kata serapan.
              </span>
            </Link>
            <Link href="/kartu?tema=kegiatan" className="curriculum-cell">
              <span className="curriculum-num">{VOCAB_CARDS.length}</span>
              <span className="curriculum-label">Kosakata JLPT N5</span>
              <span className="meta-note">
                Seratus kata inti dalam 10 tema lengkap dengan contoh kalimat.
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="workflow-section" aria-labelledby="alur-judul">
        <div className="workflow-intro">
          <h2 id="alur-judul">Tiga langkah latihan harian</h2>
          <p className="page-lead">
            Setiap bagian terhubung ke penyimpanan progres yang sama, baik di
            mode tamu pada perangkat ini maupun saat tersambung ke akun.
          </p>
        </div>

        <div className="workflow-list">
          <div className="workflow-row workflow-row-lead">
            <div className="workflow-row-body">
              <h3>Sesi Belajar Terjadwal</h3>
              <p>
                Kartu yang jatuh tempo muncul lebih dulu, lalu kartu baru. Nilai
                ingatanmu Lupa, Sulit, Bisa, atau Gampang untuk menghitung
                interval SM-2 berikutnya.
              </p>
            </div>
            <Link href="/belajar" className="btn btn-primary">
              Buka sesi belajar
            </Link>
          </div>

          <div className="workflow-row">
            <div className="workflow-row-body">
              <h3>Kuis Adaptif 10 Soal</h3>
              <p>
                Pilihan ganda dan ketik romaji bergantian. Saat masuk dengan
                akun, soal diprioritaskan dari kartu yang nilainya paling lemah.
              </p>
            </div>
            <Link href="/kuis" className="btn">
              Ikuti kuis 10 soal
            </Link>
          </div>

          <div className="workflow-row">
            <div className="workflow-row-body">
              <h3>Dashboard Progres</h3>
              <p>
                Pantau streak harian, kartu yang sudah dikuasai, grafik
                aktivitas 7 atau 30 hari, serta atur target kartu per sesi.
              </p>
            </div>
            <Link href="/dashboard" className="btn">
              Lihat progres saya
            </Link>
          </div>
        </div>
      </section>

      <section className="closing-band" aria-labelledby="tamu-judul">
        <div className="closing-ledger">
          <div>
            <h2 id="tamu-judul">Mulai langsung tanpa wajib mendaftar</h2>
            <p className="page-lead">
              Seluruh 192 kartu terbuka di mode tamu dan progres tersimpan di
              perangkat ini. Masuk akun kapan saja jika ingin menyinkronkan
              riwayat ulangan.
            </p>
          </div>
          <div className="closing-actions">
            <Link href="/tentang" className="btn">
              Baca batasan isi
            </Link>
            <Link href="/masuk" className="btn">
              Masuk atau daftar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
