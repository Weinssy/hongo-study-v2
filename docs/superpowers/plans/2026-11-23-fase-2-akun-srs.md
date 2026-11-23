# Fase 2 Hongo Study v2: Akun dan Mesin SRS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Akun Supabase (daftar/masuk/keluar), mesin SRS SM-2 murni teruji, halaman sesi belajar /belajar dengan penilaian 4 tingkat, dan seed SQL 192 kartu. Mode tamu Fase 1 tidak rusak.

**Architecture:** Logika SM-2 hidup di `lib/srs.ts` sebagai fungsi murni tanpa dependensi framework (dites Node langsung). Persistensi dipisah: `lib/local-store.ts` (localStorage untuk tamu) dan `lib/progress-store.ts` (memilih localStorage atau Supabase berdasarkan sesi). Auth lewat konteks React di `lib/auth.tsx` memakai klien opsional Fase 1: bila env kosong, semua halaman tetap jalan sebagai tamu. Pemetaan kartu lokal ke baris `cards` Supabase memakai kunci unik skema 0001: (type, front, script).

**Tech Stack:** Next.js App Router, React, TypeScript, @supabase/supabase-js, Node test (node:assert).

**Spec:** Outline Fase 2. Skema acuan: `supabase/migrations/0001_init.sql` (sudah dijalankan Wein di project Supabase miliknya).

## Global Constraints

- Tidak ada push, deploy, akses Supabase/Vercel Wein, atau kredensial apa pun. SQL baru ditulis sebagai file untuk dijalankan Wein.
- Mode tamu tidak boleh rusak: build tanpa `.env.local` harus exit 0 dan `/` + `/kartu` tetap render.
- Tes lama `tests/data.test.ts` (13 assertion) tidak boleh regresi.
- Antislop mode DURING: tanpa em dash di teks baru (R-02), nav hanya ke halaman yang ada (R-24), semua tombol berfungsi (R-26), state kosong/muat/error di UI data (R-27), label form dan fokus terlihat (R-32/R-39).

## Design Read dan alasan keputusan (R-31)

Reading this as: aplikasi belajar untuk pelajar Indonesia yang belajar bahasa Jepang dari HP, bahasa visual: buku catatan belajar (kertas hangat, tinta, satu aksen merah aka), dial ENERGY 2 / RHYTHM 2 / MOTION 1.

- Karakter kana/kata ditampilkan besar di tengah kartu belajar: kartu memang tentang karakter itu, jadi karakter adalah titik fokus layar (bukan ikon dekorasi).
- Empat tombol nilai dibedakan lebar dan labelnya (Lupa, Sulit, Bisa, Gampang) plus pratinjau interval: pengguna perlu tahu akibat tiap pilihan sebelum menekan.
- Merah aka hanya untuk aksen tindakan utama dan nilai "Lupa": satu aksen, dipakai hemat (R-29).
- Radius tombol disamakan 10px dengan kartu: satu sistem radius, tidak semua elemen jadi pil (R-11).
- Tanpa ikon library: ikon tidak menambah informasi di UI belajar ini (R-04).

## Review Focus

- SM-2: grade gagal (kualitas < 3) harus mereset repetitions ke 0 dan interval ke 1 hari; ease tidak boleh turun di bawah 1.3.
- Kartu tanpa progres dianggap baru dan selalu masuk antrean setelah kartu jatuh tempo.
- Upsert progres Supabase harus memakai card_id hasil pemetaan (type, front, script), bukan id lokal.
- Seed SQL harus idempoten: dijalankan dua kali tidak menggandakan kartu. Constraint unik 0001 memakai kolom script yang NULL untuk kosakata, dan Postgres memperlakukan NULL sebagai berbeda, jadi seed memakai penjaga `where not exists` dengan `is not distinct from`, bukan `on conflict`.

---

### Task 1: Mesin SM-2 dengan TDD

**Files:**
- Create: `tests/srs.test.ts`
- Create: `lib/srs.ts`
- Modify: `package.json` (script test menjalankan semua file tes)

**Interfaces:**
- Produces: `GradeName = "lupa" | "sulit" | "bisa" | "gampang"`, `GRADE_QUALITY` (lupa 1, sulit 3, bisa 4, gampang 5; cocok dengan kolom `last_grade` 0..5 di 0001), `SrsState { ease, intervalDays, repetitions }`, `SrsResult` (+ `dueDate`), `newCardState()`, `reviewCard(state, grade, todayIso)`, `addDays(iso, n)`, `isMastered(state)` (interval >= 21 hari), `selectDueCards(cards, progress, todayIso, limit)`.

- [x] **Step 1:** Tulis tes SM-2: kartu baru + "bisa" menjadi repetitions 1, interval 1; ulangan kedua interval 6; ketiga interval = round(interval x ease); "lupa" mereset; ease turun saat sulit dan terkunci minimum 1.3; dueDate = hari ini + interval; selectDueCards mengutamakan jatuh tempo lalu kartu baru dan menghormati limit.
- [x] **Step 2:** Jalankan tes, pastikan gagal (modul belum ada).
- [x] **Step 3:** Tulis `lib/srs.ts` (SM-2 klasik: kualitas < 3 reset; ease' = ease + (0.1 - (5-q)(0.08 + (5-q)0.02)), minimum 1.3).
- [x] **Step 4:** Jalankan semua tes: data + srs lolos.

### Task 2: Persistensi lokal dan store progres

**Files:**
- Create: `lib/local-store.ts`
- Create: `lib/progress-store.ts`

**Interfaces:**
- `CardProgress { ease, intervalDays, repetitions, dueDate, lastGrade, updatedAt }`.
- local-store: progres tamu, log aktivitas harian `{ date, count }`, riwayat kuis, pengaturan `{ dailyTarget }`, kunci localStorage berprefix `hongo.*.v1`.
- progress-store: `loadProgress(user)`, `saveReview(user, card, result, quality)`, `loadActivity(user)`, `saveQuizResult(user, entry)`. Untuk pengguna login: baca tabel `cards` + `user_card_progress`, upsert saat menilai, dan sisipkan `review_events` secara best-effort (tabelnya datang di migrasi 0002 Fase 4; kegagalan disembunyikan supaya Fase 2 tetap jalan sebelum 0002 dijalankan).

- [x] **Step 1:** Tulis `lib/local-store.ts` (aman di server: no-op bila `window` tidak ada).
- [x] **Step 2:** Tulis `lib/progress-store.ts` dengan pemetaan kunci (type, front, script) dan cache peta kartu Supabase.

### Task 3: Auth dan header sadar sesi

**Files:**
- Create: `lib/auth.tsx`
- Create: `app/components/SiteHeader.tsx`
- Create: `app/masuk/page.tsx`, `app/masuk/MasukForm.tsx`
- Modify: `app/layout.tsx` (AuthProvider + SiteHeader, teks footer netral, judul tanpa em dash)
- Modify: `app/globals.css` (form, tombol, header, fokus terlihat, kursor pointer)

**Interfaces:**
- `useAuth(): { user, loading, supabaseReady, signIn, signUp, signOut }`. signUp meneruskan `display_name` sebagai metadata (dipakai trigger `handle_new_user` di 0001).
- Halaman /masuk: form masuk/daftar dengan label terlihat, pesan error dan sukses; bila env Supabase kosong, tampilkan pemberitahuan jujur bahwa login belum aktif dan arahkan ke mode tamu.

- [x] **Step 1:** Tulis `lib/auth.tsx` (getSession + onAuthStateChange; null client berarti supabaseReady false).
- [x] **Step 2:** Tulis `SiteHeader.tsx`: nav Kartu dan Belajar (halaman yang sudah ada), area akun: email + tombol Keluar bila login, tautan Masuk bila tidak.
- [x] **Step 3:** Tulis halaman /masuk dan perbarui layout + CSS.

### Task 4: Halaman sesi belajar /belajar

**Files:**
- Create: `app/belajar/page.tsx`, `app/belajar/BelajarClient.tsx`
- Modify: `app/globals.css` (kartu belajar, tombol nilai, bilah progres sesi)

**Interfaces:**
- Consumes: `selectDueCards`, `reviewCard`, progress-store, `useAuth`.
- Alur: muat progres, susun antrean (jatuh tempo dulu, lalu kartu baru, batas 20), kartu tampil sisi depan, tombol "Tampilkan jawaban", empat tombol nilai dengan pratinjau interval, simpan tiap nilai, ringkasan akhir sesi. State kosong: tidak ada kartu jatuh tempo dan tidak ada kartu baru (tampilkan tanggal jatuh tempo berikutnya). State error: pesan + tombol coba lagi. Banner mode: tamu (tersimpan di perangkat ini) atau login (tersimpan ke akun).

- [x] **Step 1:** Tulis `BelajarClient.tsx` lengkap dengan state muat/kosong/error/selesai.
- [x] **Step 2:** Tulis `page.tsx` (metadata + render klien).

### Task 5: Seed SQL 192 kartu

**Files:**
- Create: `scripts/generate-seed.ts`
- Create: `supabase/seed.sql` (hasil generate, jangan edit tangan)

**Interfaces:**
- Generator membaca `data/kana.ts` dan `data/vocab.ts`, menulis satu `insert ... select ... where not exists` per kartu: kana back = romaji, kosakata script NULL, sort_order mengikuti urutan dataset.

- [x] **Step 1:** Tulis generator dengan escaping tanda kutip tunggal.
- [x] **Step 2:** Jalankan generator, verifikasi seed berisi 192 insert (92 kana + 100 kosakata).

### Task 6: Verifikasi dan Delivery Gate Fase 2

- [x] **Step 1:** `npm run build` tanpa `.env.local` exit 0; rute /, /kartu, /masuk, /belajar ter-generate.
- [x] **Step 2:** `npm test` exit 0 (data 13 assertion + srs).
- [x] **Step 3:** Pemeriksaan antislop: grep em dash di file baru, periksa nav dan tombol lewat inspeksi kode (tidak ada browser di sesi ini, dicatat jujur di laporan), perbaiki temuan.
