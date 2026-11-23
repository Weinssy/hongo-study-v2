# Fase 4 Hongo Study v2: Dashboard Progres Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Halaman /dashboard berisi streak harian, jumlah kartu dikuasai, grafik aktivitas 7/30 hari, target harian yang bisa diatur, dan lencana pencapaian, dari data progres dan aktivitas yang benar-benar tercatat.

**Architecture:** Statistik murni di `lib/progress-stats.ts` (streak, seri aktivitas, hitungan dikuasai, evaluasi lencana) dan dites Node. Sumber data memakai progress-store Fase 2: progres per kartu dan log aktivitas (lokal untuk tamu; Supabase `review_events` untuk login dengan gabungan cadangan lokal). Migrasi `0002_fase3_4.sql` membuat tabel `review_events` dan `quiz_results` yang sejak Fase 2/3 sudah ditulis secara best-effort oleh kode.

**Tech Stack:** Next.js App Router, React, TypeScript, Postgres (Supabase), Node test (node:assert).

**Spec:** Outline Fase 4.

## Global Constraints

- Batasan fase sebelumnya tetap berlaku (tanpa push/deploy/kredensial, mode tamu utuh, tes lama tidak regresi, antislop DURING).
- Dashboard harus jujur saat data belum ada: state kosong berisi penjelasan dan tautan mulai belajar, bukan angka nol yang berpura-pura jadi capaian (R-27, R-38).
- Target harian disimpan di localStorage untuk semua pengguna pada fase ini (belum ada kolom pengaturan di Supabase); keterbatasan ini ditulis di kode dan laporan.

## Design Read dan alasan keputusan (R-31)

Melanjutkan bahasa visual Fase 2 dan 3, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

- Grafik aktivitas adalah batang CSS dari data nyata dengan tinggi sebanding jumlah ulangan; tanpa pustaka grafik agar tidak menambah beban halaman (R-40).
- Lencana yang belum diraih ditampilkan redup dengan syaratnya tertulis: pengguna tahu persis cara meraihnya, dan tidak ada lencana palsu (R-38).
- Angka ringkasan memakai kartu statistik yang sama dengan halaman utama agar sistem visualnya konsisten.

## Review Focus

- Streak: hari ini belum belajar tidak langsung memutus streak bila kemarin belajar (streak dihitung sampai kemarin); celah satu hari memutus.
- Seri aktivitas harus selalu tepat 7 atau 30 titik berurutan berakhir hari ini, tanggal tanpa aktivitas bernilai 0.
- "Dikuasai" memakai definisi yang sama dengan lib/srs.ts: interval >= 21 hari.
- Kriteria lencana eksplisit dan dites: Kana Tuntas (92 kana pernah dinilai), Streak 7 Hari, 100 Ulasan Pertama, Penjelajah Kuis (5 sesi kuis selesai).

---

### Task 1: Migrasi 0002 (review_events + quiz_results)

**Files:**
- Create: `supabase/migrations/0002_fase3_4.sql`

**Interfaces:**
- `review_events(id, user_id -> profiles, card_id -> cards on delete set null, grade smallint 0..5, reviewed_on date default current_date, created_at)` + indeks (user_id, reviewed_on) + RLS milik sendiri.
- `quiz_results(id, user_id -> profiles, mode text, total int, correct int, created_at)` + RLS milik sendiri.

- [x] **Step 1:** Tulis SQL mengikuti pola RLS 0001.

### Task 2: Statistik progres dengan TDD

**Files:**
- Create: `tests/progress.test.ts`
- Create: `lib/progress-stats.ts`
- Modify: `package.json` (script test menambah progress.test.ts)

**Interfaces:**
- Produces: `computeStreak(activity, todayIso)`, `activitySeries(activity, days, todayIso)`, `countMastered(progress)`, `countReviewed(progress)`, `evaluateBadges(input): BadgeStatus[]` dengan input `{ kanaReviewed, streak, totalReviews, quizSessions }`.

- [x] **Step 1:** Tulis tes: streak berurutan, streak berakhir kemarin, streak putus, seri 7/30 hari dengan nol di tanggal kosong, hitungan dikuasai, keempat lencana menyala dan padam sesuai syarat.
- [x] **Step 2:** Jalankan tes, pastikan gagal.
- [x] **Step 3:** Tulis `lib/progress-stats.ts`.
- [x] **Step 4:** Jalankan semua tes: lolos semua.

### Task 3: Halaman /dashboard

**Files:**
- Create: `app/dashboard/page.tsx`, `app/dashboard/DashboardClient.tsx`
- Modify: `app/components/SiteHeader.tsx` (nav Dashboard)
- Modify: `app/globals.css` (grafik batang, lencana, kartu ringkasan)

**Interfaces:**
- Memuat progres + aktivitas + riwayat kuis, menampilkan: streak, kartu dikuasai, jatuh tempo hari ini, total ulangan; grafik 7/30 hari (tombol penukar rentang); form target harian (input angka + tombol simpan, tersimpan lewat local-store); daftar lencana dengan status. State muat dan kosong ditangani.

- [x] **Step 1:** Tulis `DashboardClient.tsx`.
- [x] **Step 2:** Tulis `page.tsx`, nav, CSS.

### Task 4: Verifikasi dan Delivery Gate Fase 4

- [x] **Step 1:** `npm run build` tanpa `.env.local` exit 0; /dashboard ter-generate.
- [x] **Step 2:** `npm test` exit 0 (data + srs + quiz + progress).
- [x] **Step 3:** Pemeriksaan antislop Fase 4; perbaiki temuan.
