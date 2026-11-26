import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang: Hongo Study v2",
  description: "Apa itu Hongo Study v2, cara memakainya, dan batas isinya saat ini.",
};

export default function TentangPage() {
  return (
    <>
      <section className="workspace-aura aura-surface">
        <div className="workspace-aura-inner">
          <h1>Tentang Hongo Study v2</h1>
          <p className="page-lead">
            Hongo Study v2 adalah aplikasi web untuk belajar bahasa Jepang dari
            nol: 46 hiragana, 46 katakana, dan 100 kosakata JLPT N5. Versi
            sebelumnya hanya menampilkan materi; versi ini mengingat progresmu
            dan mengatur kapan tiap kartu perlu diulang.
          </p>
        </div>
      </section>

      <div className="page-shell">
        <article className="article-sheet">
          <section className="article-section">
            <h2>Cara pakai</h2>
            <p>
              <Link href="/belajar">Sesi Belajar</Link> menampilkan kartu yang
              sudah jatuh tempo, lalu kartu baru. Setelah melihat jawaban, nilai
              ingatanmu dengan empat pilihan: Lupa, Sulit, Bisa, atau Gampang.
              Jadwal ulangan berikutnya dihitung dengan algoritma SM-2.
            </p>
            <p>
              <Link href="/kuis">Kuis</Link> berisi 10 soal pilihan ganda dan
              ketik romaji. Bila kamu masuk dengan akun, soal diambil dari kartu
              yang paling lemah menurut data ulanganmu. Kosakata juga bisa
              disaring per tema di <Link href="/kartu">daftar kartu</Link>.
            </p>
            <p>
              <Link href="/dashboard">Dashboard</Link> merangkum streak hari
              belajarmu, kartu yang sudah dikuasai, grafik aktivitas 7 atau 30
              hari, dan lencana pencapaian.
            </p>
            <p>
              Mode tamu memungkinkan semua materi dan sesi belajar dipakai tanpa
              akun; progres tersimpan di perangkat yang kamu pakai.{" "}
              <Link href="/masuk">Akun</Link> membuat progres yang sama tersimpan
              di server dan bisa dibuka dari perangkat lain.
            </p>
          </section>

          <section className="article-section">
            <h2>Batas isi saat ini</h2>
            <p>
              Isi v2 berhenti di kana dasar dan kosakata N5. Belum ada kanji
              terpisah, belum ada audio pelafalan, dan belum ada level N4.
              Keterbatasan ini disengaja agar fondasi akun, jadwal ulangan, dan
              kuis terselesaikan terlebih dulu sebelum isinya diperluas.
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
