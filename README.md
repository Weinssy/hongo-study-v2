# Hongo Study v2

Platform belajar bahasa Jepang: kana, kosakata JLPT N5, dan — mulai Fase 2 —
akun pengguna dengan pengulangan terjadwal (SRS SM-2).

Repo: https://github.com/Weinssy/hongo-study-v2

## Status: Fase 1 — Fondasi dan data

Sudah ada:

- Scaffold Next.js (App Router + TypeScript)
- Dataset lokal: hiragana 46 + katakana 46 (`data/kana.ts`), 100 kosakata
  JLPT N5 dengan arti + contoh Bahasa Indonesia (`data/vocab.ts`)
- Halaman mode tamu: `/` (ringkasan) dan `/kartu` (daftar kartu lengkap,
  tanpa login, dirender dari data lokal)
- Skema Supabase siap jalan: `supabase/migrations/0001_init.sql`
  (tabel `profiles`, `cards`, `user_card_progress` + RLS + kolom SRS)
- Klien Supabase opsional (`lib/supabase/client.ts`) — aplikasi tetap jalan
  penuh walau env kosong
- Tes integritas dataset: `npm test`

Belum (menunggu langkah di bawah): koneksi Supabase nyata, login/akun
(Fase 2), deploy Vercel.

## Jalan lokal

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # tes integritas dataset
npm run build      # build produksi
```

Supabase (opsional di Fase 1): salin `.env.example` menjadi `.env.local`
dan isi `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari
project Supabase kamu, lalu jalankan isi
`supabase/migrations/0001_init.sql` di SQL Editor project tersebut.

## Struktur

```
app/                  halaman (App Router): / dan /kartu
data/                 dataset murni: kana.ts, vocab.ts
lib/cards.ts          gabungan dataset -> bentuk Card (cermin tabel cards)
lib/supabase/         klien Supabase opsional
supabase/migrations/  skema SQL
tests/                tes integritas dataset (Node, tanpa framework)
docs/superpowers/     rencana implementasi per fase
DATA.md               sumber & lisensi dataset
```

## Yang menunggu Wein

1. **Project Supabase** — buat project (paket gratis) di supabase.com,
   jalankan migrasi `0001_init.sql`, beri URL + anon key untuk `.env.local`.
2. **Vercel** — hubungkan repo GitHub ini ke Vercel untuk deploy
   (langkah 6 checklist Fase 1: live dengan data kana tampil).
3. **Persetujuan push** — scaffold lokal ini belum di-push; push pertama
   menunggu ringkasan file disetujui.

## Dataset & lisensi

Lihat `DATA.md`. Singkatnya: kana adalah fakta dasar bahasa (domain
publik); 100 kata N5 adalah kata inti pilihan sendiri dengan arti dan
contoh yang ditulis sendiri — JLPT tidak menerbitkan daftar kosakata resmi.
