-- Hongo Study v2 — skema awal (Fase 1)
-- Jalankan di Supabase SQL Editor atau via Supabase CLI setelah project dibuat.
-- Belum dieksekusi di Fase 1: file ini menunggu project Supabase milik Wein.

-- ---------------------------------------------------------------------------
-- profiles: satu baris per pengguna, id = Supabase Auth user id
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- cards: katalog kartu belajar (kana + kosakata)
-- front  = sisi depan (karakter Jepang / kata)
-- back   = sisi belakang (arti Bahasa Indonesia)
-- romaji = bacaan latin; example/example_id = contoh kalimat + artinya
-- script = 'hiragana' | 'katakana' | null (untuk kartu kosakata)
-- ---------------------------------------------------------------------------
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('kana', 'vocab')),
  front text not null,
  back text not null,
  romaji text,
  example text,
  example_id text,
  script text check (script in ('hiragana', 'katakana')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (type, front, script)
);

-- ---------------------------------------------------------------------------
-- user_card_progress: progres SRS per pengguna per kartu.
-- Kolom ease / interval_days / repetitions / due_date adalah fondasi
-- algoritma SM-2 yang diaktifkan di Fase 2.
-- ---------------------------------------------------------------------------
create table if not exists public.user_card_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  card_id uuid not null references public.cards (id) on delete cascade,
  ease numeric(4, 2) not null default 2.50 check (ease >= 1.30),
  interval_days int not null default 0 check (interval_days >= 0),
  repetitions int not null default 0 check (repetitions >= 0),
  due_date date not null default current_date,
  last_grade smallint check (last_grade between 0 and 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

create index if not exists user_card_progress_due_idx
  on public.user_card_progress (user_id, due_date);

-- ---------------------------------------------------------------------------
-- Otomatis buat baris profiles saat pengguna mendaftar (Supabase Auth)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.user_card_progress enable row level security;

-- Katalog kartu boleh dibaca siapa pun (mode tamu tanpa login).
drop policy if exists "cards are public" on public.cards;
create policy "cards are public"
  on public.cards for select
  using (true);

-- Profil: hanya pemilik yang bisa membaca/mengubah miliknya.
drop policy if exists "profiles are own" on public.profiles;
create policy "profiles are own"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Progres: hanya pemilik yang bisa membaca/mengubah miliknya.
drop policy if exists "progress is own" on public.user_card_progress;
create policy "progress is own"
  on public.user_card_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
