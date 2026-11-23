import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang: Hongo Study v2",
  description: "Apa itu Hongo Study v2, cara memakainya, dan batas isinya saat ini.",
};

export default function TentangPage() {
  return (
    <>
      <h1>Tentang Hongo Study v2</h1>
      <p className="lead">
        Hongo Study v2 adalah aplikasi web untuk belajar bahasa Jepang dari
        nol: 46 hiragana, 46 katakana, dan 100 kosakata JLPT N5. Versi
        sebelumnya hanya menampilkan materi; versi ini mengingat progresmu
        dan mengatur kapan tiap kartu perlu diulang.
      </p>

      <h2>Cara pakai</h2>
      <p>
        <strong>
          <Link href="/belajar">Sesi Belajar</Link>
        </strong>{" "}
        menampilkan kartu yang sudah jatuh tempo, lalu kartu baru. Setelah
        melihat jawaban, nilai ingatanmu dengan empat pilihan: Lupa, Sulit,
        Bisa, atau Gampang. Jadwal ulangan berikutnya dihitung dengan
        algoritma SM-2, metode pengulangan terjadwal yang juga dipakai
        aplikasi kartu kilat yang lebih dulu dikenal.
      </p>
      <p>
        <strong>
          <Link href="/kuis">Kuis</Link>
        </strong>{" "}
        berisi 10 soal pilihan ganda dan ketik romaji. Bila kamu masuk dengan
        akun, soal diambil dari kartu yang paling lemah menurut data
        ulanganmu. Kosakata juga bisa disaring per tema di{" "}
        <Link href="/kartu">daftar kartu</Link>.
      </p>
      <p>
        <strong>
          <Link href="/dashboard">Dashboard</Link>
        </strong>{" "}
        merangkum streak hari belajarmu, kartu yang sudah dikuasai, grafik
        aktivitas 7 atau 30 hari, dan lencana pencapaian.
      </p>
      <p>
        <strong>Mode tamu.</strong> Semua materi dan sesi belajar bisa dipakai
        tanpa akun; progres tersimpan di perangkat yang kamu pakai.{" "}
        <Link href="/masuk">Akun</Link> membuat progres yang sama tersimpan
        di server dan bisa dibuka dari perangkat lain.
      </p>

      <h2>Batas isi saat ini</h2>
      <p>
        Isi v2 berhenti di kana dasar dan kosakata N5. Belum ada kanji, belum
        ada audio pelafalan, dan belum ada level N4. Keterbatasan ini
        disengaja: fondasi akun, jadwal ulangan, dan kuis diselesaikan dulu
        sebelum isinya diperluas.
      </p>
    </>
  );
}
