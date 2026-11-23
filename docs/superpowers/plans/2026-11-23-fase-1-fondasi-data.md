# Fase 1 Hongo Study v2 — Fondasi dan Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Scaffold Next.js + lapisan data lokal (kana 46+46, kosakata N5 100) + skema Supabase + halaman daftar kartu mode tamu, terverifikasi `npm run build` lolos — tanpa push dan tanpa deploy.

**Architecture:** Next.js App Router + TypeScript. Dataset hidup sebagai modul TypeScript murni di `data/` (tanpa dependensi framework) supaya bisa dites langsung dengan Node dan dipakai halaman tamu sekarang, lalu disalin ke tabel Supabase `cards` nanti. Klien Supabase di `lib/supabase/` bersifat opsional: bila env belum diisi, aplikasi jalan penuh dari data lokal (mode tamu).

**Tech Stack:** Next.js (App Router), React, TypeScript, @supabase/supabase-js, Node test runner bawaan (node:assert, tanpa framework tes tambahan).

**Spec:** `~/workspace/goals/konsisten-1-project-dan-2-konten-per-minggu/files/Outline-Hongo-Study-v2.md` (bagian Fase 1) dan `Kickoff-Fase-1-Hongo-Study-v2.md` (checklist langkah 2–5; langkah 1 repo selesai, langkah 6 live Vercel menunggu Wein).

## Global Constraints

- Tidak ada push ke GitHub, tidak ada deploy, tidak ada pembuatan project Supabase, tidak ada kredensial apa pun dalam kode.
- Dataset kana: tepat 46 hiragana + 46 katakana dasar (gojuuon, tanpa dakuten/youon), romaji Hepburn.
- Dataset kosakata: tepat 100 kata JLPT N5, arti dalam Bahasa Indonesia, sumber + lisensi dicatat di `DATA.md`.
- Skema progres wajib memuat kolom SRS SM-2 untuk Fase 2: `ease`, `interval_days`, `repetitions`, `due_date`.
- Halaman daftar kartu harus bisa dibuka tanpa login dan tanpa env Supabase.

## Review Focus

- Env Supabase kosong/tidak valid → halaman tamu tidak boleh crash; klien mengembalikan `null` dan UI tetap render dari data lokal. Dites lewat build tanpa `.env.local` (Task 4).
- Karakter kana duplikat atau jumlah bukan 46 → tes data gagal (Task 2).
- Kosakata duplikat atau jumlah bukan 100, kolom kosong → tes data gagal (Task 2).
- Romaji hiragana dan katakana tidak sejajar (urutan beda) → tes data gagal (Task 2).
- SQL migrasi merujuk `auth.users` — hanya jalan di Supabase asli; di luar itu file hanya didokumentasikan, tidak dieksekusi di Fase 1.

---

### Task 1: Scaffold project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`, `.env.example`
- Create: `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (placeholder minimal, diisi Task 4)

**Interfaces:**
- Produces: script npm `dev`, `build`, `start`, `test` (`node tests/data.test.ts`).

- [x] **Step 1:** Tulis `package.json` (next, react, react-dom, @supabase/supabase-js; dev: typescript, @types/node, @types/react, @types/react-dom) dan jalankan `npm install`.
- [x] **Step 2:** Tulis konfigurasi TS/Next dan `.gitignore` (node_modules, .next, .env*.local).
- [x] **Step 3:** Tulis `app/layout.tsx` + `globals.css` + `page.tsx` minimal. Verifikasi: folder project terbentuk, `node_modules` ada.

### Task 2: Dataset kana + kosakata dengan TDD

**Files:**
- Create: `tests/data.test.ts`
- Create: `data/kana.ts`, `data/vocab.ts`

**Interfaces:**
- Produces: `KanaEntry { char, romaji }`, `HIRAGANA: KanaEntry[46]`, `KATAKANA: KanaEntry[46]`; `VocabEntry { japanese, reading, romaji, meaningId, example, exampleId }`, `VOCAB_N5: VocabEntry[100]`. File data mandiri (tanpa import) agar bisa diimpor tes Node dengan ekstensi `.ts`.

- [x] **Step 1:** Tulis tes: jumlah 46/46/100, tidak ada char/japanese duplikat, romaji hira–kata sejajar urutannya, semua kolom vocab tidak kosong.
- [x] **Step 2:** Jalankan `npm test` — Expected: FAIL (modul data belum ada).
- [x] **Step 3:** Tulis `data/kana.ts` dan `data/vocab.ts`.
- [x] **Step 4:** Jalankan `npm test` — Expected: PASS semua assertion.

### Task 3: Skema Supabase + klien opsional

**Files:**
- Create: `supabase/migrations/0001_init.sql`
- Create: `lib/supabase/client.ts`
- Create: `DATA.md`

**Interfaces:**
- Consumes: bentuk data Task 2 (kolom `cards` mencerminkan `KanaEntry`/`VocabEntry`).
- Produces: tabel `profiles`, `cards`, `user_card_progress` (+ RLS + trigger profil dari `auth.users`); `getSupabaseClient(): SupabaseClient | null`.

- [x] **Step 1:** Tulis SQL: `profiles(id → auth.users)`, `cards(type, front, back, romaji, example, example_id, script, sort_order)`, `user_card_progress(user_id, card_id, ease, interval_days, repetitions, due_date, last_grade, updated_at)`; aktifkan RLS + policy baca publik untuk `cards`, milik-sendiri untuk progres.
- [x] **Step 2:** Tulis `lib/supabase/client.ts`: baca `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`, kembalikan `null` bila kosong.
- [x] **Step 3:** Tulis `DATA.md`: sumber dataset + lisensi + catatan verifikasi lisensi N5.

### Task 4: Halaman mode tamu + README + build

**Files:**
- Create: `lib/cards.ts`, `app/kartu/page.tsx`
- Modify: `app/page.tsx`
- Create: `README.md`

**Interfaces:**
- Consumes: `HIRAGANA`, `KATAKANA`, `VOCAB_N5` (Task 2).
- Produces: `Card` gabungan + `getAllCards()`; rute `/` (ringkasan + tautan) dan `/kartu` (grid hiragana, grid katakana, daftar kosakata) render server-side dari data lokal.

- [x] **Step 1:** Tulis `lib/cards.ts` (gabungkan dataset menjadi `Card[]` stabil dengan id `kana-h-<romaji>`, `kana-k-<romaji>`, `vocab-<n>`).
- [x] **Step 2:** Tulis `app/page.tsx` dan `app/kartu/page.tsx`.
- [x] **Step 3:** Tulis `README.md` (cara jalan lokal, struktur, status Fase 1, langkah menunggu Wein).
- [x] **Step 4:** Jalankan `npm run build` tanpa `.env.local` — Expected: exit 0, rute `/` dan `/kartu` ter-generate.
- [x] **Step 5:** Jalankan ulang `npm test` — Expected: PASS. Catat bukti build + tes untuk laporan; tidak ada commit/push.
