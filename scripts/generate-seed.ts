// Generator supabase/seed.sql dari dataset lokal (data/kana.ts, data/vocab.ts).
// Jalankan: node scripts/generate-seed.ts
// File hasil generate ini yang dijalankan Wein di SQL Editor Supabase,
// setelah 0001_init.sql. Jangan edit seed.sql dengan tangan; ubah dataset
// lalu jalankan ulang generator ini.
//
// Kenapa bukan "insert ... on conflict": constraint unik 0001 adalah
// (type, front, script) dan script bernilai NULL untuk kosakata. Postgres
// memperlakukan NULL sebagai tidak pernah sama, jadi on conflict tidak akan
// pernah cocok untuk baris kosakata dan seed kedua akan menggandakan data.
// Penjaga "where not exists" dengan "is not distinct from" aman untuk NULL
// dan membuat seed idempoten.

import { writeFileSync } from "node:fs";
import { HIRAGANA, KATAKANA } from "../data/kana.ts";
import { VOCAB_N5 } from "../data/vocab.ts";

function sqlText(value: string | null): string {
  if (value === null) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

function insertLine(
  type: "kana" | "vocab",
  front: string,
  back: string,
  romaji: string,
  example: string | null,
  exampleId: string | null,
  script: "hiragana" | "katakana" | null,
  sortOrder: number,
): string {
  const guardScript =
    script === null ? "c.script is null" : `c.script = ${sqlText(script)}`;
  return [
    "insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)",
    `select ${sqlText(type)}, ${sqlText(front)}, ${sqlText(back)}, ${sqlText(romaji)}, ${sqlText(example)}, ${sqlText(exampleId)}, ${sqlText(script)}, ${sortOrder}`,
    `where not exists (select 1 from public.cards c where c.type = ${sqlText(type)} and c.front = ${sqlText(front)} and ${guardScript});`,
  ].join("\n");
}

const lines: string[] = [
  "-- Hongo Study v2: seed katalog kartu (dihasilkan oleh scripts/generate-seed.ts)",
  "-- Jalankan di Supabase SQL Editor SETELAH supabase/migrations/0001_init.sql.",
  "-- Aman dijalankan berulang: setiap baris dijaga where not exists.",
  "-- Isi: 46 hiragana + 46 katakana + 100 kosakata JLPT N5 = 192 kartu.",
  "",
];

HIRAGANA.forEach((k, i) => {
  lines.push(insertLine("kana", k.char, k.romaji, k.romaji, null, null, "hiragana", i));
});
KATAKANA.forEach((k, i) => {
  lines.push(insertLine("kana", k.char, k.romaji, k.romaji, null, null, "katakana", i));
});
VOCAB_N5.forEach((v, i) => {
  lines.push(
    insertLine("vocab", v.japanese, v.meaningId, v.romaji, v.example, v.exampleId, null, i),
  );
});

lines.push("");
const out = new URL("../supabase/seed.sql", import.meta.url);
writeFileSync(out, lines.join("\n"), "utf8");
console.log(`seed.sql ditulis: ${HIRAGANA.length + KATAKANA.length + VOCAB_N5.length} insert`);
