import type { Metadata } from "next";
import Link from "next/link";
import { HIRAGANA_CARDS, KATAKANA_CARDS, VOCAB_CARDS } from "@/lib/cards";
import { THEME_LABELS, THEME_ORDER, type VocabTheme } from "@/data/vocab";

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
    <>
      <h1>Daftar Kartu</h1>
      <p className="lead">
        Mode tamu: semua kartu bisa dilihat tanpa login. Kosakata bisa
        disaring per tema; kana selalu tampil lengkap.
      </p>

      <h2>Hiragana ({HIRAGANA_CARDS.length})</h2>
      <div className="kana-grid">
        {HIRAGANA_CARDS.map((c) => (
          <div key={c.id} className="kana-cell">
            <span className="char">{c.front}</span>
            <span className="romaji">{c.romaji}</span>
          </div>
        ))}
      </div>

      <h2>Katakana ({KATAKANA_CARDS.length})</h2>
      <div className="kana-grid">
        {KATAKANA_CARDS.map((c) => (
          <div key={c.id} className="kana-cell">
            <span className="char">{c.front}</span>
            <span className="romaji">{c.romaji}</span>
          </div>
        ))}
      </div>

      <h2>
        Kosakata JLPT N5 ({vocab.length}
        {activeTheme ? ` dari ${VOCAB_CARDS.length}` : ""})
      </h2>
      <nav className="theme-chips" aria-label="Saring kosakata per tema">
        <Link href="/kartu" className={activeTheme === null ? "chip active" : "chip"}>
          Semua tema
        </Link>
        {THEME_ORDER.map((t) => (
          <Link
            key={t}
            href={`/kartu?tema=${t}`}
            className={activeTheme === t ? "chip active" : "chip"}
            aria-current={activeTheme === t ? "page" : undefined}
          >
            {THEME_LABELS[t]}
          </Link>
        ))}
      </nav>

      <div className="vocab-list">
        {vocab.map((c) => (
          <div key={c.id} className="vocab-item">
            <span className="jp">{c.front}</span>
            <span className="reading">{c.romaji}</span>
            <span className="theme-tag">{c.theme ? THEME_LABELS[c.theme] : ""}</span>
            <span className="meaning">{c.back}</span>
            {c.example ? (
              <span className="example">
                {c.example} ({c.exampleId})
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
