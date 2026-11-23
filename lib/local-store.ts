// Persistensi lokal (localStorage) untuk mode tamu dan cadangan data.
// Semua fungsi aman dipanggil di server: bila `window` tidak ada, baca
// mengembalikan nilai kosong dan tulis tidak melakukan apa-apa.
//
// Kunci:
//   hongo.progress.v1  peta id kartu lokal -> CardProgress
//   hongo.activity.v1  log aktivitas harian [{ date, count }] (sumber streak)
//   hongo.quiz.v1      riwayat hasil kuis
//   hongo.settings.v1  pengaturan pengguna { dailyTarget }

import type { CardProgressLike } from "./srs";

export interface CardProgress extends CardProgressLike {
  lastGrade: number | null;
  updatedAt: string; // ISO datetime
}

export interface ActivityEntry {
  date: string; // YYYY-MM-DD (tanggal lokal pengguna)
  count: number;
}

export interface QuizHistoryEntry {
  at: string; // ISO datetime
  mode: string;
  total: number;
  correct: number;
}

export interface UserSettings {
  dailyTarget: number;
}

const KEYS = {
  progress: "hongo.progress.v1",
  activity: "hongo.activity.v1",
  quiz: "hongo.quiz.v1",
  settings: "hongo.settings.v1",
} as const;

export const DEFAULT_DAILY_TARGET = 10;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Penyimpanan penuh atau diblokir: abaikan, sesi tetap jalan di memori.
  }
}

/** Tanggal lokal pengguna sebagai YYYY-MM-DD (dasar perhitungan due date dan streak). */
export function todayLocal(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// ---------------------------------------------------------------------------
// Progres kartu
// ---------------------------------------------------------------------------

export type ProgressMap = Record<string, CardProgress>;

export function loadLocalProgress(): ProgressMap {
  return readJson<ProgressMap>(KEYS.progress, {});
}

export function saveLocalProgress(map: ProgressMap): void {
  writeJson(KEYS.progress, map);
}

// ---------------------------------------------------------------------------
// Log aktivitas harian
// ---------------------------------------------------------------------------

export function loadLocalActivity(): ActivityEntry[] {
  return readJson<ActivityEntry[]>(KEYS.activity, []);
}

export function addLocalActivity(date: string, count: number): void {
  if (count <= 0) return;
  const log = loadLocalActivity();
  const existing = log.find((e) => e.date === date);
  if (existing) existing.count += count;
  else log.push({ date, count });
  log.sort((a, b) => a.date.localeCompare(b.date));
  writeJson(KEYS.activity, log);
}

// ---------------------------------------------------------------------------
// Riwayat kuis
// ---------------------------------------------------------------------------

export function loadLocalQuizHistory(): QuizHistoryEntry[] {
  return readJson<QuizHistoryEntry[]>(KEYS.quiz, []);
}

export function addLocalQuizResult(entry: QuizHistoryEntry): void {
  const history = loadLocalQuizHistory();
  history.push(entry);
  writeJson(KEYS.quiz, history.slice(-50)); // simpan 50 sesi terakhir saja
}

// ---------------------------------------------------------------------------
// Pengaturan
// ---------------------------------------------------------------------------

export function loadSettings(): UserSettings {
  const s = readJson<UserSettings>(KEYS.settings, { dailyTarget: DEFAULT_DAILY_TARGET });
  return {
    dailyTarget:
      Number.isFinite(s.dailyTarget) && s.dailyTarget >= 1 && s.dailyTarget <= 100
        ? Math.floor(s.dailyTarget)
        : DEFAULT_DAILY_TARGET,
  };
}

export function saveSettings(settings: UserSettings): void {
  writeJson(KEYS.settings, settings);
}
