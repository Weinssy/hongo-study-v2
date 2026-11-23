// Tes integritas dataset Fase 1 — logika data murni, tanpa framework.
// Jalankan: npm test  (Node >= 22, type stripping bawaan)
import assert from "node:assert/strict";
import { HIRAGANA, KATAKANA } from "../data/kana.ts";
import { VOCAB_N5 } from "../data/vocab.ts";

let checks = 0;
function ok(cond: boolean, msg: string) {
  assert.ok(cond, msg);
  checks++;
}

// --- Kana: jumlah tepat 46 + 46 ---
ok(HIRAGANA.length === 46, `hiragana harus 46, dapat ${HIRAGANA.length}`);
ok(KATAKANA.length === 46, `katakana harus 46, dapat ${KATAKANA.length}`);

// --- Kana: tidak ada karakter duplikat di tiap set ---
ok(
  new Set(HIRAGANA.map((k) => k.char)).size === 46,
  "ada karakter hiragana duplikat",
);
ok(
  new Set(KATAKANA.map((k) => k.char)).size === 46,
  "ada karakter katakana duplikat",
);

// --- Kana: romaji hiragana dan katakana sejajar urutannya ---
ok(
  HIRAGANA.every((k, i) => KATAKANA[i].romaji === k.romaji),
  "urutan romaji hiragana/katakana tidak sejajar",
);

// --- Kana: semua kolom terisi ---
ok(
  HIRAGANA.concat(KATAKANA).every((k) => k.char.length > 0 && k.romaji.length > 0),
  "ada entri kana dengan char/romaji kosong",
);

// --- Kana: jangkar urutan gojuuon ---
ok(HIRAGANA[0].char === "あ" && HIRAGANA[0].romaji === "a", "hiragana[0] harus あ/a");
ok(HIRAGANA[45].char === "ん" && HIRAGANA[45].romaji === "n", "hiragana[45] harus ん/n");
ok(KATAKANA[0].char === "ア" && KATAKANA[45].char === "ン", "katakana harus mulai ア dan berakhir ン");

// --- Kosakata: tepat 100 ---
ok(VOCAB_N5.length === 100, `kosakata harus 100, dapat ${VOCAB_N5.length}`);

// --- Kosakata: tidak ada japanese duplikat ---
ok(
  new Set(VOCAB_N5.map((v) => v.japanese)).size === 100,
  "ada kosakata japanese duplikat",
);

// --- Kosakata: semua kolom wajib terisi ---
ok(
  VOCAB_N5.every(
    (v) =>
      v.japanese.length > 0 &&
      v.reading.length > 0 &&
      v.romaji.length > 0 &&
      v.meaningId.length > 0 &&
      v.example.length > 0 &&
      v.exampleId.length > 0,
  ),
  "ada entri kosakata dengan kolom kosong",
);

// --- Kosakata: romaji hanya huruf latin kecil + apostrof ---
ok(
  VOCAB_N5.every((v) => /^[a-z']+$/.test(v.romaji)),
  "ada romaji kosakata dengan karakter tak terduga",
);

console.log(`PASS — ${checks} kelompok assertion lolos (kana 46+46, kosakata 100)`);
