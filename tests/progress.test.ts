// Tes statistik progres (Fase 4): streak, seri aktivitas, lencana. Logika murni.
import assert from "node:assert/strict";
import {
  activitySeries,
  computeStreak,
  countMastered,
  countReviewed,
  evaluateBadges,
} from "../lib/progress-stats.ts";

let checks = 0;
function ok(cond: boolean, msg: string) {
  assert.ok(cond, msg);
  checks++;
}
function eq<T>(actual: T, expected: T, msg: string) {
  assert.equal(actual, expected, `${msg} (dapat ${String(actual)}, mau ${String(expected)})`);
  checks++;
}

const TODAY = "2026-11-24";
const act = (date: string, count = 1) => ({ date, count });

// --- computeStreak ---
eq(computeStreak([], TODAY), 0, "tanpa aktivitas streak 0");
eq(
  computeStreak([act("2026-11-22", 3), act("2026-11-23", 2), act("2026-11-24", 1)], TODAY),
  3,
  "tiga hari berurutan sampai hari ini",
);
eq(
  computeStreak([act("2026-11-22"), act("2026-11-23")], TODAY),
  2,
  "belum belajar hari ini tidak memutus streak kemarin",
);
eq(
  computeStreak([act("2026-11-20"), act("2026-11-22"), act("2026-11-23")], TODAY),
  2,
  "celah satu hari memutus rantai lama",
);
eq(computeStreak([act("2026-11-20")], TODAY), 0, "aktivitas lama saja streak 0");
eq(computeStreak([act("2026-11-24", 0)], TODAY), 0, "count 0 tidak dihitung aktivitas");
eq(
  computeStreak([act("2026-11-23", 1), act("2026-11-23", 2), act("2026-11-24", 1)], TODAY),
  2,
  "entri ganda di tanggal sama digabung",
);

// --- activitySeries ---
{
  const series = activitySeries([act("2026-11-24", 5), act("2026-11-20", 2)], 7, TODAY);
  eq(series.length, 7, "seri 7 hari punya 7 titik");
  eq(series[0].date, "2026-11-18", "seri mulai 6 hari sebelum hari ini");
  eq(series[6].date, "2026-11-24", "seri berakhir hari ini");
  eq(series[6].count, 5, "count hari ini terbawa");
  eq(series[2].count, 2, "count 2026-11-20 terbawa");
  eq(series[1].count, 0, "tanggal kosong bernilai 0");
  eq(activitySeries([], 30, TODAY).length, 30, "seri 30 hari punya 30 titik");
}

// --- countMastered / countReviewed ---
{
  const progress = {
    a: { intervalDays: 21, repetitions: 3, lastGrade: 4 },
    b: { intervalDays: 30, repetitions: 5, lastGrade: 5 },
    c: { intervalDays: 6, repetitions: 2, lastGrade: 3 },
    d: { intervalDays: 0, repetitions: 0, lastGrade: 1 },
  };
  eq(countMastered(progress), 2, "interval >= 21 dihitung dikuasai");
  eq(countReviewed(progress), 4, "semua entri progres dihitung pernah dipelajari");
  eq(countMastered({}), 0, "progres kosong dikuasai 0");
}

// --- evaluateBadges ---
{
  const none = evaluateBadges({ kanaReviewed: 0, streak: 0, totalReviews: 0, quizSessions: 0 });
  eq(none.length, 4, "ada empat lencana");
  ok(none.every((b) => !b.earned), "pengguna baru belum meraih lencana apa pun");

  const kana = evaluateBadges({ kanaReviewed: 92, streak: 0, totalReviews: 92, quizSessions: 0 });
  ok(kana.find((b) => b.id === "kana-tuntas")?.earned, "92 kana dinilai meraih Kana Tuntas");
  const kana91 = evaluateBadges({ kanaReviewed: 91, streak: 0, totalReviews: 91, quizSessions: 0 });
  ok(!kana91.find((b) => b.id === "kana-tuntas")?.earned, "91 kana belum meraih Kana Tuntas");

  const streak = evaluateBadges({ kanaReviewed: 0, streak: 7, totalReviews: 10, quizSessions: 0 });
  ok(streak.find((b) => b.id === "streak-7")?.earned, "streak 7 meraih lencana streak");

  const reviews = evaluateBadges({ kanaReviewed: 0, streak: 1, totalReviews: 100, quizSessions: 0 });
  ok(reviews.find((b) => b.id === "ulasan-100")?.earned, "100 ulasan meraih lencana ulasan");

  const quiz = evaluateBadges({ kanaReviewed: 0, streak: 1, totalReviews: 10, quizSessions: 5 });
  ok(quiz.find((b) => b.id === "kuis-5")?.earned, "5 sesi kuis meraih lencana kuis");
}

console.log(`PASS: ${checks} kelompok assertion lolos (streak, seri aktivitas, lencana)`);
