-- Hongo Study v2: migrasi 0002 (Fase 3 dan 4)
-- Jalankan di Supabase SQL Editor SETELAH 0001_init.sql.
-- Urutan yang disarankan: 0001_init.sql, lalu seed.sql, lalu file ini.
-- File ini sebenarnya sudah boleh dijalankan kapan pun setelah 0001:
-- kode aplikasi menulis ke dua tabel ini secara best-effort, jadi sebelum
-- migrasi ini dijalankan pun tidak ada yang rusak, hanya pencatatan
-- peristiwa untuk pengguna login belum aktif.

-- ---------------------------------------------------------------------------
-- review_events: satu baris per penilaian kartu di sesi belajar.
-- Dasar streak dan grafik aktivitas dashboard untuk pengguna login
-- (user_card_progress hanya menyimpan keadaan terakhir, bukan riwayat).
-- ---------------------------------------------------------------------------
create table if not exists public.review_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  card_id uuid references public.cards (id) on delete set null,
  grade smallint not null check (grade between 0 and 5),
  reviewed_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists review_events_user_date_idx
  on public.review_events (user_id, reviewed_on);

-- ---------------------------------------------------------------------------
-- quiz_results: satu baris per sesi kuis selesai (Fase 3).
-- Riwayat yang ditampilkan ke pengguna saat ini dibaca dari perangkat;
-- tabel ini menyimpan salinan per akun untuk pengembangan berikutnya.
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mode text not null,
  total int not null check (total >= 0),
  correct int not null check (correct >= 0),
  created_at timestamptz not null default now()
);

create index if not exists quiz_results_user_idx
  on public.quiz_results (user_id, created_at);

-- ---------------------------------------------------------------------------
-- Row Level Security: pola yang sama dengan 0001, hanya milik sendiri.
-- ---------------------------------------------------------------------------
alter table public.review_events enable row level security;
alter table public.quiz_results enable row level security;

drop policy if exists "review events are own" on public.review_events;
create policy "review events are own"
  on public.review_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "quiz results are own" on public.quiz_results;
create policy "quiz results are own"
  on public.quiz_results for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
