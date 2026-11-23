// Tes mesin SRS SM-2 (Fase 2): logika murni, tanpa framework.
// Jalankan lewat: npm test
import assert from "node:assert/strict";
import {
  GRADE_QUALITY,
  addDays,
  isMastered,
  newCardState,
  reviewCard,
  selectDueCards,
  type CardProgressLike,
  type SrsState,
} from "../lib/srs.ts";

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

// --- Pemetaan grade ke kualitas SM-2 (harus muat di kolom last_grade 0..5) ---
eq(GRADE_QUALITY.lupa, 1, "lupa = kualitas 1");
eq(GRADE_QUALITY.sulit, 3, "sulit = kualitas 3");
eq(GRADE_QUALITY.bisa, 4, "bisa = kualitas 4");
eq(GRADE_QUALITY.gampang, 5, "gampang = kualitas 5");

// --- addDays: aritmetika tanggal ISO tanpa efek zona waktu ---
eq(addDays("2026-11-24", 1), "2026-11-25", "tambah 1 hari");
eq(addDays("2026-11-30", 1), "2026-12-01", "lewat akhir bulan");
eq(addDays("2026-12-31", 1), "2027-01-01", "lewat akhir tahun");
eq(addDays("2026-11-24", 0), "2026-11-24", "tambah 0 hari");

// --- Kartu baru dinilai "bisa": repetitions 1, interval 1, jatuh tempo besok ---
{
  const r = reviewCard(newCardState(), "bisa", TODAY);
  eq(r.repetitions, 1, "ulangan pertama repetitions");
  eq(r.intervalDays, 1, "ulangan pertama interval");
  eq(r.dueDate, "2026-11-25", "ulangan pertama dueDate");
  ok(Math.abs(r.ease - 2.5) < 1e-9, "grade bisa (q=4) tidak mengubah ease dari 2.5");
}

// --- Ulangan kedua "bisa": interval 6 ---
{
  const s: SrsState = { ease: 2.5, intervalDays: 1, repetitions: 1 };
  const r = reviewCard(s, "bisa", TODAY);
  eq(r.repetitions, 2, "ulangan kedua repetitions");
  eq(r.intervalDays, 6, "ulangan kedua interval 6");
  eq(r.dueDate, "2026-11-30", "ulangan kedua dueDate");
}

// --- Ulangan ketiga "bisa": interval = round(6 x 2.5) = 15 ---
{
  const s: SrsState = { ease: 2.5, intervalDays: 6, repetitions: 2 };
  const r = reviewCard(s, "bisa", TODAY);
  eq(r.repetitions, 3, "ulangan ketiga repetitions");
  eq(r.intervalDays, 15, "ulangan ketiga interval round(6*2.5)");
}

// --- "gampang" menaikkan ease sebesar 0.1 ---
{
  const r = reviewCard(newCardState(), "gampang", TODAY);
  ok(Math.abs(r.ease - 2.6) < 1e-9, `gampang menaikkan ease ke 2.6 (dapat ${r.ease})`);
  eq(r.intervalDays, 1, "gampang pada kartu baru tetap interval 1");
}

// --- "sulit" menurunkan ease (q=3: -0.14) tapi tetap lanjut ---
{
  const s: SrsState = { ease: 2.5, intervalDays: 6, repetitions: 2 };
  const r = reviewCard(s, "sulit", TODAY);
  ok(Math.abs(r.ease - 2.36) < 1e-9, `sulit menurunkan ease ke 2.36 (dapat ${r.ease})`);
  eq(r.repetitions, 3, "sulit tetap menaikkan repetitions");
  eq(r.intervalDays, 14, "sulit interval round(6*2.36)=14");
}

// --- "lupa" mereset: repetitions 0, interval 1, ease turun besar, terkunci >= 1.3 ---
{
  const s: SrsState = { ease: 2.5, intervalDays: 30, repetitions: 5 };
  const r = reviewCard(s, "lupa", TODAY);
  eq(r.repetitions, 0, "lupa mereset repetitions");
  eq(r.intervalDays, 1, "lupa interval kembali 1");
  eq(r.dueDate, "2026-11-25", "lupa dueDate besok");
  ok(Math.abs(r.ease - 1.96) < 1e-9, `lupa menurunkan ease ke 1.96 (dapat ${r.ease})`);
}
{
  const s: SrsState = { ease: 1.35, intervalDays: 3, repetitions: 2 };
  const r = reviewCard(s, "lupa", TODAY);
  eq(r.ease, 1.3, "ease tidak boleh di bawah 1.3");
}

// --- isMastered: interval >= 21 hari ---
ok(!isMastered({ ease: 2.5, intervalDays: 20, repetitions: 3 }), "interval 20 belum dikuasai");
ok(isMastered({ ease: 2.5, intervalDays: 21, repetitions: 3 }), "interval 21 sudah dikuasai");

// --- selectDueCards: jatuh tempo dulu (paling lama menunggu di depan), lalu kartu baru ---
{
  const cards = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }, { id: "e" }];
  const progress: Record<string, CardProgressLike> = {
    a: { ease: 2.5, intervalDays: 1, repetitions: 1, dueDate: "2026-11-20" },
    b: { ease: 2.5, intervalDays: 1, repetitions: 1, dueDate: "2026-12-05" }, // belum jatuh tempo
    c: { ease: 2.5, intervalDays: 6, repetitions: 2, dueDate: "2026-11-24" }, // jatuh tempo hari ini
    // d dan e: belum pernah dipelajari (kartu baru)
  };
  const picked = selectDueCards(cards, progress, TODAY, 20).map((c) => c.id);
  eq(picked.join(","), "a,c,d,e", "urutan: jatuh tempo terlama, hari ini, lalu kartu baru; b terlewat");
  const limited = selectDueCards(cards, progress, TODAY, 2).map((c) => c.id);
  eq(limited.join(","), "a,c", "limit menghentikan pengambilan");
}

console.log(`PASS: ${checks} kelompok assertion lolos (SM-2 + pemilihan kartu jatuh tempo)`);
