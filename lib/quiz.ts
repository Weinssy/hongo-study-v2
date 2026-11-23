// Logika kuis adaptif murni (Fase 3). Tanpa dependensi framework; RNG bisa
// disuntikkan agar pemilihan soal dapat dites secara deterministik.
//
// Aturan pemilihan soal:
// - Tamu (progress = null): semua kartu berpeluang sama (acak murni).
// - Login: peluang sebanding dengan skor kelemahan kartu dari data SRS,
//   ditambah bobot dasar kecil agar kartu kuat tetap sesekali muncul.

export interface QuizPoolItem {
  id: string;
  kind: "kana" | "vocab";
  front: string;
  back: string;
  romaji: string;
}

/** Subset progres yang dipakai skor kelemahan (kompatibel dengan CardProgress). */
export interface QuizProgressLike {
  ease: number;
  repetitions: number;
  lastGrade: number | null;
}

export type QuizQuestion =
  | {
      kind: "mc";
      cardId: string;
      prompt: string;
      choices: string[];
      answerIndex: number;
    }
  | {
      kind: "romaji";
      cardId: string;
      prompt: string;
      expected: string;
    };

/** RNG deterministik kecil (mulberry32) untuk tes dan kuis yang bisa diulang. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Skor kelemahan 0..1. Kartu belum pernah dipelajari bernilai 0.5 (tengah).
 * Komponen: nilai terakhir (bobot 0.45), ease rendah (0.35), dan sedikitnya
 * ulangan berhasil (0.20). Semakin tinggi, semakin lemah kartu itu.
 */
export function weaknessScore(progress: QuizProgressLike | undefined): number {
  if (!progress) return 0.5;
  const gradeWeak =
    progress.lastGrade === null ? 0.5 : (5 - progress.lastGrade) / 4;
  const easeWeak = Math.min(1, Math.max(0, (2.8 - progress.ease) / 1.5));
  const mastery = Math.min(progress.repetitions, 5) / 5;
  return 0.45 * gradeWeak + 0.35 * easeWeak + 0.2 * (1 - mastery);
}

/** Ambil `count` kartu tanpa pengulangan, berbobot bila progres tersedia. */
export function pickQuizCards(
  pool: readonly QuizPoolItem[],
  progress: Readonly<Record<string, QuizProgressLike>> | null,
  count: number,
  rng: () => number,
): QuizPoolItem[] {
  const remaining = pool.map((item) => ({
    item,
    weight: progress ? 0.15 + weaknessScore(progress[item.id]) : 1,
  }));
  const picked: QuizPoolItem[] = [];
  const target = Math.min(count, pool.length);
  while (picked.length < target && remaining.length > 0) {
    const total = remaining.reduce((sum, r) => sum + r.weight, 0);
    let roll = rng() * total;
    let idx = 0;
    for (let i = 0; i < remaining.length; i++) {
      roll -= remaining[i].weight;
      if (roll <= 0) {
        idx = i;
        break;
      }
      idx = i;
    }
    picked.push(remaining[idx].item);
    remaining.splice(idx, 1);
  }
  return picked;
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Soal pilihan ganda: prompt adalah sisi depan kartu, pilihan adalah sisi
 * belakang (romaji untuk kana, arti untuk kosakata). Distraktor diambil dari
 * kolam yang sama, unik, dan tidak sama dengan jawaban benar.
 */
export function buildMultipleChoice(
  item: QuizPoolItem,
  pool: readonly QuizPoolItem[],
  rng: () => number,
): QuizQuestion {
  const distractorPool = shuffle(
    pool.filter((p) => p.id !== item.id && p.back !== item.back),
    rng,
  );
  const seen = new Set<string>([item.back]);
  const distractors: string[] = [];
  for (const candidate of distractorPool) {
    if (seen.has(candidate.back)) continue;
    seen.add(candidate.back);
    distractors.push(candidate.back);
    if (distractors.length === 3) break;
  }
  const choices = shuffle([item.back, ...distractors], rng);
  return {
    kind: "mc",
    cardId: item.id,
    prompt: item.front,
    choices,
    answerIndex: choices.indexOf(item.back),
  };
}

export function buildRomajiQuestion(item: QuizPoolItem): QuizQuestion {
  return { kind: "romaji", cardId: item.id, prompt: item.front, expected: item.romaji };
}

/** Pemeriksaan romaji yang memaafkan kapital dan spasi, bukan ejaan. */
export function checkRomaji(input: string, expected: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
  const given = normalize(input);
  return given.length > 0 && given === normalize(expected);
}
