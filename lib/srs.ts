// Mesin SRS SM-2 murni (Fase 2). Tanpa dependensi framework supaya bisa
// dites langsung dengan Node (tests/srs.test.ts) dan dipakai ulang oleh
// halaman belajar, kuis, dan dashboard.
//
// Empat tingkat penilaian pengguna dipetakan ke kualitas SM-2 (0..5),
// cocok dengan kolom last_grade di supabase/migrations/0001_init.sql:
//   lupa = 1 (gagal, jadwal direset), sulit = 3, bisa = 4, gampang = 5.

export type GradeName = "lupa" | "sulit" | "bisa" | "gampang";

export const GRADE_QUALITY: Record<GradeName, number> = {
  lupa: 1,
  sulit: 3,
  bisa: 4,
  gampang: 5,
};

export const GRADE_LABELS: Record<GradeName, string> = {
  lupa: "Lupa",
  sulit: "Sulit",
  bisa: "Bisa",
  gampang: "Gampang",
};

export const GRADE_ORDER: GradeName[] = ["lupa", "sulit", "bisa", "gampang"];

export const MIN_EASE = 1.3;
export const DEFAULT_EASE = 2.5;
/** Kartu dianggap dikuasai bila intervalnya sudah mencapai ambang ini. */
export const MASTERED_INTERVAL_DAYS = 21;

export interface SrsState {
  ease: number;
  intervalDays: number;
  repetitions: number;
}

export interface SrsResult extends SrsState {
  dueDate: string; // ISO date (YYYY-MM-DD)
}

/** Bentuk minimal progres yang dibutuhkan pemilihan kartu (subset CardProgress). */
export interface CardProgressLike extends SrsState {
  dueDate: string;
}

export function newCardState(): SrsState {
  return { ease: DEFAULT_EASE, intervalDays: 0, repetitions: 0 };
}

/** Tambah n hari ke tanggal ISO. Dihitung dalam UTC agar zona waktu tidak menggeser hari. */
export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Satu langkah SM-2 klasik.
 * - Kualitas < 3 (lupa): repetitions kembali 0, interval 1 hari.
 * - Berhasil: interval berturut 1, 6, lalu round(interval x ease).
 * - Ease disesuaikan: ease + (0.1 - (5-q) x (0.08 + (5-q) x 0.02)), minimum 1.3.
 */
export function reviewCard(state: SrsState, grade: GradeName, todayIso: string): SrsResult {
  const q = GRADE_QUALITY[grade];
  const ease = Math.max(
    MIN_EASE,
    state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  );

  let repetitions: number;
  let intervalDays: number;
  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions = state.repetitions + 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(state.intervalDays * ease);
  }

  return {
    ease: Math.round(ease * 100) / 100,
    intervalDays,
    repetitions,
    dueDate: addDays(todayIso, intervalDays),
  };
}

export function isMastered(state: SrsState): boolean {
  return state.intervalDays >= MASTERED_INTERVAL_DAYS;
}

/**
 * Susun antrean sesi belajar: kartu yang sudah jatuh tempo lebih dulu
 * (yang paling lama menunggu di depan), lalu kartu yang belum pernah
 * dipelajari. Kartu yang belum jatuh tempo dilewati.
 */
export function selectDueCards<T extends { id: string }>(
  cards: readonly T[],
  progress: Readonly<Record<string, CardProgressLike>>,
  todayIso: string,
  limit: number,
): T[] {
  const due: T[] = [];
  const fresh: T[] = [];
  for (const card of cards) {
    const p = progress[card.id];
    if (!p) fresh.push(card);
    else if (p.dueDate <= todayIso) due.push(card);
  }
  due.sort((a, b) => progress[a.id].dueDate.localeCompare(progress[b.id].dueDate));
  return [...due, ...fresh].slice(0, Math.max(0, limit));
}
