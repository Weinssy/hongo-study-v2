import { HIRAGANA, KATAKANA } from "@/data/kana";
import { VOCAB_N5 } from "@/data/vocab";

export type CardType = "kana" | "vocab";
export type KanaScript = "hiragana" | "katakana";

/**
 * Bentuk kartu gabungan — mencerminkan kolom tabel Supabase `cards`
 * (lihat supabase/migrations/0001_init.sql) supaya Fase 2 bisa menukar
 * sumber data lokal ini dengan query Supabase tanpa mengubah UI.
 */
export interface Card {
  id: string;
  type: CardType;
  front: string;
  back: string;
  romaji: string;
  example?: string;
  exampleId?: string;
  script?: KanaScript;
  sortOrder: number;
}

export const HIRAGANA_CARDS: Card[] = HIRAGANA.map((k, i) => ({
  id: `kana-h-${k.romaji}`,
  type: "kana",
  front: k.char,
  back: k.romaji,
  romaji: k.romaji,
  script: "hiragana",
  sortOrder: i,
}));

export const KATAKANA_CARDS: Card[] = KATAKANA.map((k, i) => ({
  id: `kana-k-${k.romaji}`,
  type: "kana",
  front: k.char,
  back: k.romaji,
  romaji: k.romaji,
  script: "katakana",
  sortOrder: i,
}));

export const VOCAB_CARDS: Card[] = VOCAB_N5.map((v, i) => ({
  id: `vocab-${i + 1}`,
  type: "vocab",
  front: v.japanese,
  back: v.meaningId,
  romaji: v.romaji,
  example: v.example,
  exampleId: v.exampleId,
  sortOrder: i,
}));

export function getAllCards(): Card[] {
  return [...HIRAGANA_CARDS, ...KATAKANA_CARDS, ...VOCAB_CARDS];
}
