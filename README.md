# Hongo Study v2

Aplikasi web belajar bahasa Jepang dari nol: 46 hiragana, 46 katakana, dan
100 kosakata JLPT N5, dengan akun pengguna, pengulangan terjadwal SM-2,
kuis adaptif, dan dashboard progres.

- Situs live: https://hongo-study-v2.vercel.app
- Repo: https://github.com/Weinssy/hongo-study-v2

## Status: v2 lengkap (Fase 1 sampai 5 selesai di lokal)

| Fase | Isi | Keadaan |
| --- | --- | --- |
| 1 | Fondasi Next.js, dataset kana + kosakata, skema Supabase, mode tamu | Live di Vercel |
| 2 | Akun Supabase, mesin SRS SM-2, sesi belajar, seed 192 kartu | Kode selesai, menunggu push |
| 3 | Tema kosakata + filter, kuis adaptif (pilihan ganda + ketik romaji) | Kode selesai, menunggu push |
| 4 | Dashboard: streak, grafik aktivitas, target harian, lencana; migrasi 0002 | Kode selesai, menunggu push |
| 5 | Halaman tentang, halaman utama final, pengumuman situs lama, naskah konten peluncuran | Kode selesai, menunggu push |

Rencana tertulis tiap fase ada di `docs/superpowers/plans/`.

## Halaman

- `/` halaman utama dan pintu masuk belajar
- `/kartu` daftar kartu lengkap, terbuka tanpa login, kosakata bisa disaring per tema
- `/belajar` sesi belajar SRS: kartu jatuh tempo, penilaian Lupa/Sulit/Bisa/Gampang
- `/kuis` kuis 10 soal; untuk pengguna login, soal diprioritaskan dari kartu terlemah
- `/dashboard` streak, kartu dikuasai, grafik aktivitas 7/30 hari, target harian, lencana
- `/masuk` daftar dan masuk akun (Supabase Auth, email + kata sandi)
- `/tentang` penjelasan aplikasi dan batas isinya

Mode tamu berjalan penuh tanpa akun dan tanpa env Supabase: progres
tersimpan di localStorage perangkat. Akun memindahkan progres ke tabel
`user_card_progress` Supabase.

## Jalan lokal

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 4 berkas tes logika murni (data, SM-2, kuis, statistik)
npm run build      # build produksi; lolos juga tanpa .env.local
```

## Supabase

Salin `.env.example` menjadi `.env.local` dan isi
`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari project
Supabase kamu. Lalu jalankan file SQL ini di SQL Editor, berurutan:

1. `supabase/migrations/0001_init.sql` (tabel profiles, cards, user_card_progress + RLS)
2. `supabase/seed.sql` (192 kartu dari dataset; idempoten, aman diulang)
3. `supabase/migrations/0002_fase3_4.sql` (tabel review_events dan quiz_results + RLS)

`supabase/seed.sql` dihasilkan oleh `node scripts/generate-seed.ts` dari
`data/`; jangan edit seed dengan tangan.

## Struktur

```
app/                  halaman (App Router): /, /kartu, /belajar, /kuis,
                      /dashboard, /masuk, /tentang
app/components/       header situs sadar sesi
data/                 dataset murni: kana.ts, vocab.ts (dengan tema)
lib/cards.ts          gabungan dataset menjadi bentuk Card
lib/srs.ts            algoritma SM-2 murni
lib/quiz.ts           logika kuis adaptif murni
lib/progress-stats.ts streak, seri aktivitas, lencana (murni)
lib/local-store.ts    persistensi localStorage (mode tamu)
lib/progress-store.ts jembatan penyimpanan: lokal atau Supabase
lib/auth.tsx          konteks auth Supabase
lib/supabase/         klien Supabase opsional
supabase/migrations/  skema SQL (0001, 0002)
supabase/seed.sql     isi tabel cards dari dataset
scripts/              generator seed
tests/                tes logika murni (Node, tanpa framework)
docs/superpowers/     rencana implementasi per fase
docs/pengumuman-situs-lama.html  snippet pengumuman untuk situs Hongo Study lama
DATA.md               sumber & lisensi dataset
```

## Keterbatasan yang diketahui

- Tema kosakata baru hidup di dataset lokal; tabel `cards` Supabase belum
  punya kolom tema, jadi filter tema membaca data lokal, bukan database.
- Target harian tersimpan di perangkat (localStorage), belum tersinkron
  ke akun.
- Riwayat kuis yang ditampilkan dibaca dari perangkat; salinan per akun di
  tabel `quiz_results` sudah ditulis tetapi belum ditampilkan dari server.
- Streak pengguna login menggabungkan `review_events` dan log lokal dengan
  nilai terbesar per tanggal (heuristik anti hitung ganda, bukan angka
  eksak lintas perangkat).
- Belum ada: kanji, audio pelafalan, level N4 ke atas, dakuten/youon.
  Semua memang di luar ruang lingkup 5 fase ini.

## Dataset & lisensi

Lihat `DATA.md`. Singkatnya: kana adalah fakta dasar bahasa (domain
publik); 100 kata N5 adalah kata inti pilihan sendiri dengan arti dan
contoh yang ditulis sendiri. JLPT tidak menerbitkan daftar kosakata resmi.
