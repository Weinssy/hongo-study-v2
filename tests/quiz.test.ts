// Tes logika kuis (Fase 3) dan integritas tema kosakata: logika murni.
import assert from "node:assert/strict";
import { VOCAB_N5, THEME_ORDER } from "../data/vocab.ts";
import {
  buildMultipleChoice,
  buildRomajiQuestion,
  checkRomaji,
  mulberry32,
  pickQuizCards,
  weaknessScore,
  type QuizPoolItem,
} from "../lib/quiz.ts";
import type { CardProgressLike } from "../lib/srs.ts";

let checks = 0;
function ok(cond: boolean, msg: string) {
  assert.ok(cond, msg);
  checks++;
}
function eq<T>(actual: T, expected: T, msg: string) {
  assert.equal(actual, expected, `${msg} (dapat ${String(actual)}, mau ${String(expected)})`);
  checks++;
}

// --- Tema: semua kata punya tema valid, semua tema terisi, total 100 ---
{
  const valid = new Set<string>(THEME_ORDER);
  ok(VOCAB_N5.every((v) => valid.has(v.theme)), "ada kata dengan tema tidak dikenal");
  const counts = new Map<string, number>();
  for (const v of VOCAB_N5) counts.set(v.theme, (counts.get(v.theme) ?? 0) + 1);
  eq(counts.size, THEME_ORDER.length, "semua tema harus terisi");
  let total = 0;
  for (const n of counts.values()) total += n;
  eq(total, 100, "total kata bertema harus 100");
  ok(Math.min(...counts.values()) >= 5, "tema terkecil minimal 5 kata");
}

// --- weaknessScore: gagal > baru > dikuasai, selalu 0..1 ---
const failed: CardProgressLike & { lastGrade: number | null } = {
  ease: 1.96, intervalDays: 1, repetitions: 0, dueDate: "2026-11-25", lastGrade: 1,
};
const mastered: CardProgressLike & { lastGrade: number | null } = {
  ease: 2.6, intervalDays: 30, repetitions: 5, dueDate: "2026-12-24", lastGrade: 5,
};
{
  eq(weaknessScore(undefined), 0.5, "kartu baru bernilai tengah 0.5");
  ok(weaknessScore(failed) > weaknessScore(undefined), "kartu gagal lebih lemah dari kartu baru");
  ok(weaknessScore(undefined) > weaknessScore(mastered), "kartu baru lebih lemah dari yang dikuasai");
  ok(weaknessScore(failed) <= 1 && weaknessScore(mastered) >= 0, "skor selalu dalam 0..1");
}

// --- Kolam contoh ---
const pool: QuizPoolItem[] = [
  { id: "kana-h-a", kind: "kana", front: "あ", back: "a", romaji: "a" },
  { id: "kana-h-ka", kind: "kana", front: "か", back: "ka", romaji: "ka" },
  { id: "kana-h-sa", kind: "kana", front: "さ", back: "sa", romaji: "sa" },
  { id: "kana-h-ta", kind: "kana", front: "た", back: "ta", romaji: "ta" },
  { id: "kana-h-na", kind: "kana", front: "な", back: "na", romaji: "na" },
  { id: "kana-h-ha", kind: "kana", front: "は", back: "ha", romaji: "ha" },
];

// --- pickQuizCards tanpa progres: deterministik per seed, unik, sesuai jumlah ---
{
  const a = pickQuizCards(pool, null, 4, mulberry32(42)).map((c) => c.id);
  const b = pickQuizCards(pool, null, 4, mulberry32(42)).map((c) => c.id);
  eq(a.join(","), b.join(","), "seed sama menghasilkan pilihan sama");
  eq(new Set(a).size, a.length, "tidak ada kartu ganda dalam satu kuis");
  eq(a.length, 4, "jumlah soal sesuai permintaan");
  eq(pickQuizCards(pool, null, 99, mulberry32(1)).length, pool.length, "jumlah dibatasi ukuran kolam");
}

// --- pickQuizCards dengan progres: kartu gagal jauh lebih sering terpilih ---
{
  const progress: Record<string, CardProgressLike & { lastGrade: number | null }> = {
    "kana-h-a": failed,
    "kana-h-ka": mastered,
    "kana-h-sa": mastered,
    "kana-h-ta": mastered,
    "kana-h-na": mastered,
    "kana-h-ha": mastered,
  };
  let failPicks = 0;
  let masteredPicks = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const picked = pickQuizCards(pool, progress, 2, mulberry32(seed)).map((c) => c.id);
    if (picked.includes("kana-h-a")) failPicks++;
    if (picked.includes("kana-h-ka")) masteredPicks++;
  }
  ok(failPicks > masteredPicks * 2, `kartu gagal harus dominan (gagal ${failPicks}, dikuasai ${masteredPicks})`);
}

// --- buildMultipleChoice: 4 pilihan unik, jawaban benar tepat satu ---
{
  const item = pool[0];
  const q = buildMultipleChoice(item, pool, mulberry32(7));
  eq(q.kind, "mc", "jenis soal pilihan ganda");
  eq(q.choices.length, 4, "empat pilihan");
  eq(new Set(q.choices).size, 4, "pilihan tidak ada yang ganda");
  eq(q.choices[q.answerIndex], item.back, "answerIndex menunjuk jawaban benar");
  ok(q.choices.every((c) => pool.some((p) => p.back === c)), "semua pilihan berasal dari kolam");
  eq(q.prompt, item.front, "prompt adalah sisi depan kartu");
}

// --- buildRomajiQuestion + checkRomaji ---
{
  const item: QuizPoolItem = { id: "vocab-1", kind: "vocab", front: "私", back: "saya", romaji: "watashi" };
  const q = buildRomajiQuestion(item);
  eq(q.kind, "romaji", "jenis soal ketik romaji");
  eq(q.expected, "watashi", "jawaban yang diharapkan adalah romaji kartu");
  ok(checkRomaji("watashi", q.expected), "jawaban persis diterima");
  ok(checkRomaji("  Watashi ", q.expected), "kapital dan spasi pinggir ditoleransi");
  ok(checkRomaji("wa tashi", q.expected), "spasi di tengah ditoleransi");
  ok(!checkRomaji("watachi", q.expected), "jawaban salah ditolak");
  ok(!checkRomaji("", q.expected), "jawaban kosong ditolak");
}

console.log(`PASS: ${checks} kelompok assertion lolos (tema kosakata + logika kuis)`);
