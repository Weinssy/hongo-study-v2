# Fase 3 Hongo Study v2: Kuis Adaptif dan Kosakata per Tema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Kolom tema pada 100 kosakata + filter tema di /kartu, dan halaman /kuis (pilihan ganda + ketik romaji) yang memilih soal dari kartu terlemah pengguna login dan acak untuk tamu, lengkap dengan skor dan riwayat sesi.

**Architecture:** Logika kuis murni di `lib/quiz.ts` (skor kelemahan, pemilihan soal berbobot, pembuatan soal, pemeriksaan romaji) dengan RNG yang bisa disuntikkan agar deterministik saat dites. Tema ditambahkan ke `data/vocab.ts` sebagai union type dan diteruskan ke `Card` lewat `lib/cards.ts`. Filter tema di /kartu memakai searchParams server (tautan chip biasa, tanpa JavaScript klien). Halaman /kuis adalah komponen klien yang memakai progress-store Fase 2.

**Tech Stack:** Next.js App Router, React, TypeScript, Node test (node:assert).

**Spec:** Outline Fase 3. Catatan penyimpangan jujur: outline menyebut tema keluarga dan angka, tetapi dataset 100 kata Fase 1 tidak memiliki satu pun kata bilangan dan hanya satu kata keluarga inti. Tema disusun mengikuti isi dataset yang nyata (10 tema), bukan memaksakan label outline. Kekurangan dataset ini dicatat di laporan.

## Global Constraints

- Batasan Fase 2 tetap berlaku: tanpa push/deploy/kredensial, mode tamu tidak rusak, tes lama tidak regresi, antislop DURING aktif.
- Tamu: pemilihan soal acak (sesuai tugas). Login: berbobot kelemahan dari progres SRS.
- Riwayat kuis selalu disimpan lokal; untuk pengguna login juga dikirim best-effort ke tabel `quiz_results` (migrasi 0002, Fase 4).

## Design Read dan alasan keputusan (R-31)

Melanjutkan bahasa visual Fase 2 (buku catatan, kertas hangat, satu aksen merah), dial ENERGY 2 / RHYTHM 2 / MOTION 1.

- Chip filter tema adalah tautan biasa dengan status aktif berwarna aksen: filter harus bisa dipakai keyboard dan dibagikan sebagai URL (R-32, R-24).
- Pilihan jawaban kuis adalah tombol selebar kartu soal: target sentuh besar untuk HP (R-03) dan urutan baca satu kolom.
- Umpan balik benar/salah memakai teks eksplisit ("Benar", "Belum tepat, jawaban yang benar: ..."), bukan hanya warna (R-39).

## Review Focus

- Distraktor pilihan ganda harus unik, tidak boleh sama dengan jawaban benar, dan diambil dari kolam yang sama (romaji untuk kana, arti untuk kosakata).
- Pemeriksaan romaji: normalisasi huruf kecil dan spasi; tidak menerima bacaan kana sebagai jawaban romaji.
- Skor kelemahan: kartu dengan lastGrade rendah dan ease rendah harus lebih mungkin terpilih daripada kartu yang sudah dikuasai; kartu belum pernah dipelajari berada di tengah.

---

### Task 1: Tema kosakata

**Files:**
- Modify: `data/vocab.ts` (field `theme` di semua 100 entri + `VocabTheme` + `THEME_LABELS`)
- Modify: `lib/cards.ts` (`theme` diteruskan ke `Card` kosakata)
- Modify: `tests/data.test.ts` hanya bila perlu: jangan ubah assertion lama; assertion tema ditambahkan di `tests/quiz.test.ts`.

**Interfaces:**
- Tema: orang, tanya, posisi, tempat, alam, makanan, waktu, benda, sifat, kegiatan (pemetaan mengikuti arti kata, total tepat 100).

- [x] **Step 1:** Tambahkan field theme ke 100 entri dengan skrip bantu satu kali (pemetaan eksplisit per kata, diverifikasi tes), bukan menebak dari arti.
- [x] **Step 2:** Teruskan theme ke `lib/cards.ts`.

### Task 2: Logika kuis dengan TDD

**Files:**
- Create: `tests/quiz.test.ts`
- Create: `lib/quiz.ts`
- Modify: `package.json` (script test menambah quiz.test.ts)

**Interfaces:**
- Produces: `QuizPoolItem { id, front, back, romaji }`, `weaknessScore(progress?)`, `pickQuizCards(pool, progress | null, count, rng)`, `buildMultipleChoice(item, pool, rng)`, `buildRomajiQuestion(item)`, `checkRomaji(input, expected)`, `mulberry32(seed)` untuk tes dan pemakaian deterministik.

- [x] **Step 1:** Tulis tes: kelemahan kartu gagal > kartu baru > kartu dikuasai; pemilihan tanpa progres memakai rng (deterministik dengan seed); distraktor unik dan memuat jawaban benar tepat satu kali; checkRomaji menerima variasi kapital/spasi dan menolak jawaban salah.
- [x] **Step 2:** Jalankan tes, pastikan gagal.
- [x] **Step 3:** Tulis `lib/quiz.ts`.
- [x] **Step 4:** Jalankan semua tes: lolos semua.

### Task 3: Filter tema di /kartu

**Files:**
- Modify: `app/kartu/page.tsx` (searchParams `tema`, chip tautan, daftar kosakata terfilter)
- Modify: `app/globals.css` (chip filter)

- [x] **Step 1:** Ubah halaman menjadi async dengan searchParams; chip "Semua" + 10 tema; hanya bagian kosakata yang terfilter; kana tetap tampil penuh.

### Task 4: Halaman /kuis

**Files:**
- Create: `app/kuis/page.tsx`, `app/kuis/KuisClient.tsx`
- Modify: `app/components/SiteHeader.tsx` (nav Kuis)
- Modify: `app/globals.css` (soal, pilihan, umpan balik)

**Interfaces:**
- Alur: layar atur (mode Campuran/Kana/Kosakata, tema untuk kosakata, tombol mulai), 10 soal bergantian pilihan ganda dan ketik romaji, umpan balik langsung per soal, layar hasil dengan skor, riwayat 5 sesi terakhir dari localStorage. State kosong: kolam kosong untuk kombinasi mode/tema (tidak terjadi dengan dataset saat ini, tetap ditangani).

- [x] **Step 1:** Tulis `KuisClient.tsx`.
- [x] **Step 2:** Tulis `page.tsx`, nav, dan CSS.

### Task 5: Verifikasi dan Delivery Gate Fase 3

- [x] **Step 1:** `npm run build` tanpa `.env.local` exit 0; /kuis ter-generate; /kartu tetap jalan.
- [x] **Step 2:** `npm test` exit 0 (data + srs + quiz).
- [x] **Step 3:** Pemeriksaan antislop Fase 3 (em dash, tautan, tombol, label) lewat grep dan inspeksi kode; perbaiki temuan.
