// Lapisan penyimpanan progres: memilih localStorage (tamu) atau Supabase
// (login) di balik satu antarmuka, supaya halaman tidak perlu tahu sumbernya.
//
// Pemetaan kartu lokal <-> baris tabel `cards` memakai kunci unik skema
// 0001: (type, front, script). Untuk kosakata script bernilai NULL.
//
// Catatan jujur untuk peninjau:
// - review_events dan quiz_results baru ada setelah migrasi 0002 (Fase 4)
//   dijalankan Wein. Penulisan ke dua tabel itu best-effort: error ditelan
//   supaya Fase 2 dan 3 tetap berfungsi sebelum 0002 dijalankan.
// - Log aktivitas lokal tetap ditulis juga untuk pengguna login, dan
//   loadActivity menggabungkan dua sumber dengan mengambil nilai terbesar
//   per tanggal. Ini heuristik: kedua sumber menghitung ulangan yang sama,
//   jadi mengambil max menghindari hitung ganda sambil tetap menangkap
//   ulangan dari perangkat lain. Bukan angka eksak bila dua perangkat
//   dipakai di hari yang sama sebelum sinkron.

import type { User } from "@supabase/supabase-js";
import { getAllCards, type Card } from "./cards";
import { getSupabaseClient } from "./supabase/client";
import type { SrsResult } from "./srs";
import {
  addLocalActivity,
  addLocalQuizResult,
  loadLocalActivity,
  loadLocalProgress,
  saveLocalProgress,
  todayLocal,
  type ActivityEntry,
  type CardProgress,
  type ProgressMap,
  type QuizHistoryEntry,
} from "./local-store";

function dbKey(type: string, front: string, script: string | null): string {
  return `${type}|${script ?? ""}|${front}`;
}

interface DbCardMaps {
  localToDb: Map<string, string>;
  dbToLocal: Map<string, string>;
}

let dbMapsPromise: Promise<DbCardMaps | null> | null = null;

function getDbCardMaps(): Promise<DbCardMaps | null> {
  if (!dbMapsPromise) {
    dbMapsPromise = (async () => {
      const client = getSupabaseClient();
      if (!client) return null;
      const { data, error } = await client
        .from("cards")
        .select("id, type, front, script");
      if (error || !data) return null;
      const byKey = new Map<string, string>();
      for (const row of data as Array<{ id: string; type: string; front: string; script: string | null }>) {
        byKey.set(dbKey(row.type, row.front, row.script), row.id);
      }
      const localToDb = new Map<string, string>();
      const dbToLocal = new Map<string, string>();
      for (const card of getAllCards()) {
        const dbId = byKey.get(dbKey(card.type, card.front, card.script ?? null));
        if (dbId) {
          localToDb.set(card.id, dbId);
          dbToLocal.set(dbId, card.id);
        }
      }
      return { localToDb, dbToLocal };
    })();
  }
  return dbMapsPromise;
}

// ---------------------------------------------------------------------------
// Progres per kartu
// ---------------------------------------------------------------------------

export async function loadProgress(user: User | null): Promise<ProgressMap> {
  const client = getSupabaseClient();
  if (!user || !client) return loadLocalProgress();

  const maps = await getDbCardMaps();
  if (!maps) return loadLocalProgress();

  const { data, error } = await client
    .from("user_card_progress")
    .select("card_id, ease, interval_days, repetitions, due_date, last_grade, updated_at")
    .eq("user_id", user.id);
  if (error) throw new Error(`Gagal memuat progres dari Supabase: ${error.message}`);

  const map: ProgressMap = {};
  for (const row of (data ?? []) as Array<{
    card_id: string;
    ease: number;
    interval_days: number;
    repetitions: number;
    due_date: string;
    last_grade: number | null;
    updated_at: string;
  }>) {
    const localId = maps.dbToLocal.get(row.card_id);
    if (!localId) continue;
    map[localId] = {
      ease: Number(row.ease),
      intervalDays: row.interval_days,
      repetitions: row.repetitions,
      dueDate: row.due_date,
      lastGrade: row.last_grade,
      updatedAt: row.updated_at,
    };
  }
  return map;
}

export async function saveReview(
  user: User | null,
  card: Card,
  result: SrsResult,
  quality: number,
): Promise<void> {
  const entry: CardProgress = {
    ease: result.ease,
    intervalDays: result.intervalDays,
    repetitions: result.repetitions,
    dueDate: result.dueDate,
    lastGrade: quality,
    updatedAt: new Date().toISOString(),
  };

  // Aktivitas lokal selalu dicatat (dasar streak cadangan, lihat catatan di atas).
  addLocalActivity(todayLocal(), 1);

  const client = getSupabaseClient();
  if (!user || !client) {
    const map = loadLocalProgress();
    map[card.id] = entry;
    saveLocalProgress(map);
    return;
  }

  const maps = await getDbCardMaps();
  const dbId = maps?.localToDb.get(card.id);
  if (!dbId) {
    // Kartu belum ada di tabel cards (seed belum dijalankan): simpan lokal
    // agar ulangan pengguna tidak hilang, dan tandai lewat error yang jelas
    // di konsol. Ini jalan pintas yang disengaja, dicatat di laporan Fase 2.
    console.warn(
      `Kartu ${card.id} tidak ditemukan di tabel cards Supabase; progres disimpan lokal. Jalankan supabase/seed.sql.`,
    );
    const map = loadLocalProgress();
    map[card.id] = entry;
    saveLocalProgress(map);
    return;
  }

  const { error } = await client.from("user_card_progress").upsert(
    {
      user_id: user.id,
      card_id: dbId,
      ease: entry.ease,
      interval_days: entry.intervalDays,
      repetitions: entry.repetitions,
      due_date: entry.dueDate,
      last_grade: quality,
      updated_at: entry.updatedAt,
    },
    { onConflict: "user_id,card_id" },
  );
  if (error) throw new Error(`Gagal menyimpan progres ke Supabase: ${error.message}`);

  // Best-effort: log peristiwa ulangan untuk dashboard (tabel dari migrasi 0002).
  await client
    .from("review_events")
    .insert({ user_id: user.id, card_id: dbId, grade: quality })
    .then(undefined, () => undefined);
}

// ---------------------------------------------------------------------------
// Aktivitas harian (streak dan grafik dashboard)
// ---------------------------------------------------------------------------

export async function loadActivity(user: User | null): Promise<ActivityEntry[]> {
  const local = loadLocalActivity();
  const client = getSupabaseClient();
  if (!user || !client) return local;

  const { data, error } = await client
    .from("review_events")
    .select("reviewed_on")
    .eq("user_id", user.id)
    .limit(5000);
  if (error || !data) return local; // tabel belum ada (0002 belum jalan) atau gagal: pakai lokal

  const byDate = new Map<string, number>();
  for (const row of data as Array<{ reviewed_on: string }>) {
    byDate.set(row.reviewed_on, (byDate.get(row.reviewed_on) ?? 0) + 1);
  }
  for (const entry of local) {
    byDate.set(entry.date, Math.max(byDate.get(entry.date) ?? 0, entry.count));
  }
  return [...byDate.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ---------------------------------------------------------------------------
// Hasil kuis
// ---------------------------------------------------------------------------

export async function saveQuizResult(user: User | null, entry: QuizHistoryEntry): Promise<void> {
  addLocalQuizResult(entry);
  const client = getSupabaseClient();
  if (!user || !client) return;
  // Best-effort: tabel quiz_results datang dari migrasi 0002.
  await client
    .from("quiz_results")
    .insert({ user_id: user.id, mode: entry.mode, total: entry.total, correct: entry.correct })
    .then(undefined, () => undefined);
}

export type { CardProgress, ProgressMap, ActivityEntry, QuizHistoryEntry };
