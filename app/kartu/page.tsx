import type { Metadata } from "next";
import { HIRAGANA_CARDS, KATAKANA_CARDS, VOCAB_CARDS } from "@/lib/cards";
import { THEME_LABELS, THEME_ORDER, type VocabTheme } from "@/data/vocab";
import KartuTabsClient from "./KartuTabsClient";

export const metadata: Metadata = {
  title: "Daftar Kartu: Hongo Study v2",
  description: "Hiragana, katakana, dan 100 kosakata JLPT N5 per tema. Terbuka tanpa login.",
};

function isTheme(value: string | undefined): value is VocabTheme {
  return value !== undefined && (THEME_ORDER as string[]).includes(value);
}

export default async function KartuPage({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string }>;
}) {
  const { tema } = await searchParams;
  const activeTheme = isTheme(tema) ? tema : null;
  const vocab = activeTheme
    ? VOCAB_CARDS.filter((c) => c.theme === activeTheme)
    : VOCAB_CARDS;

  return (
    <div className="page-shell">
      <div className="workspace-header">
        <h1>Daftar Kartu</h1>
        <p className="page-lead">
          Mode tamu: semua kartu terbuka tanpa login. Saring kosakata menurut
          tema atau cari langsung berdasarkan kana, kanji, romaji, dan arti.
        </p>
      </div>

      <KartuTabsClient
        hiragana={HIRAGANA_CARDS}
        katakana={KATAKANA_CARDS}
        vocab={vocab}
        totalVocabCount={VOCAB_CARDS.length}
        activeTheme={activeTheme}
        themeOrder={THEME_ORDER}
        themeLabels={THEME_LABELS}
        initialTab={activeTheme ? "kosakata" : "semua"}
      />
    </div>
  );
}
