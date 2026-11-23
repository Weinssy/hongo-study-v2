// Statistik progres murni (Fase 4): streak, seri aktivitas, hitungan kartu
// dikuasai, dan evaluasi lencana. Tanpa dependensi framework agar dites
// langsung dengan Node (tests/progress.test.ts).
//
// Definisi "dikuasai" sengaja disamakan dengan lib/srs.ts: interval >= 21
// hari. Konstanta disalin di sini (bukan impor lintas berkas berekstensi
// .ts) agar bundel Next tidak perlu menyelesaikan impor semacam itu dari
// modul yang juga dimuat tes Node.

export interface ActivityLike {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface ProgressStatsLike {
  intervalDays: number;
  repetitions: number;
  lastGrade: number | null;
}

export const MASTERED_INTERVAL_DAYS = 21;

/** Tambah/kurang hari pada tanggal ISO, dihitung dalam UTC. */
function shiftDays(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function activeDates(activity: readonly ActivityLike[]): Set<string> {
  const set = new Set<string>();
  for (const entry of activity) {
    if (entry.count > 0) set.add(entry.date);
  }
  return set;
}

/**
 * Streak hari berurutan yang berakhir hari ini atau kemarin.
 * Belum belajar hari ini tidak memutus streak; celah satu hari memutus.
 */
export function computeStreak(activity: readonly ActivityLike[], todayIso: string): number {
  const dates = activeDates(activity);
  let cursor = todayIso;
  if (!dates.has(cursor)) {
    cursor = shiftDays(todayIso, -1);
    if (!dates.has(cursor)) return 0;
  }
  let streak = 0;
  while (dates.has(cursor)) {
    streak++;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

/** Seri aktivitas `days` hari berurutan yang berakhir hari ini; tanggal kosong bernilai 0. */
export function activitySeries(
  activity: readonly ActivityLike[],
  days: number,
  todayIso: string,
): ActivityLike[] {
  const totals = new Map<string, number>();
  for (const entry of activity) {
    totals.set(entry.date, (totals.get(entry.date) ?? 0) + entry.count);
  }
  const series: ActivityLike[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = shiftDays(todayIso, -i);
    series.push({ date, count: totals.get(date) ?? 0 });
  }
  return series;
}

export function countMastered(
  progress: Readonly<Record<string, ProgressStatsLike>>,
): number {
  return Object.values(progress).filter((p) => p.intervalDays >= MASTERED_INTERVAL_DAYS)
    .length;
}

export function countReviewed(
  progress: Readonly<Record<string, ProgressStatsLike>>,
): number {
  return Object.keys(progress).length;
}

// ---------------------------------------------------------------------------
// Lencana
// ---------------------------------------------------------------------------

export interface BadgeStatus {
  id: string;
  label: string;
  description: string;
  earned: boolean;
}

export interface BadgeInput {
  kanaReviewed: number;
  streak: number;
  totalReviews: number;
  quizSessions: number;
}

export function evaluateBadges(input: BadgeInput): BadgeStatus[] {
  return [
    {
      id: "kana-tuntas",
      label: "Kana Tuntas",
      description: "Menilai semua 92 kartu kana (46 hiragana + 46 katakana) minimal satu kali.",
      earned: input.kanaReviewed >= 92,
    },
    {
      id: "streak-7",
      label: "Streak 7 Hari",
      description: "Belajar pada 7 hari berturut-turut.",
      earned: input.streak >= 7,
    },
    {
      id: "ulasan-100",
      label: "100 Ulasan",
      description: "Menyelesaikan 100 penilaian kartu di sesi belajar.",
      earned: input.totalReviews >= 100,
    },
    {
      id: "kuis-5",
      label: "Penjelajah Kuis",
      description: "Menyelesaikan 5 sesi kuis.",
      earned: input.quizSessions >= 5,
    },
  ];
}
