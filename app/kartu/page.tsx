import type { Metadata } from "next";
import { HIRAGANA_CARDS, KATAKANA_CARDS, VOCAB_CARDS } from "@/lib/cards";

export const metadata: Metadata = {
  title: "Daftar Kartu — Hongo Study v2",
  description: "Hiragana, katakana, dan 100 kosakata JLPT N5. Terbuka tanpa login.",
};

export default function KartuPage() {
  return (
    <>
      <h1>Daftar Kartu</h1>
      <p className="lead">
        Mode tamu: semua kartu Fase 1 bisa dilihat tanpa login. Data dirender
        dari dataset lokal project ini.
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

      <h2>Kosakata JLPT N5 ({VOCAB_CARDS.length})</h2>
      <div className="vocab-list">
        {VOCAB_CARDS.map((c) => (
          <div key={c.id} className="vocab-item">
            <span className="jp">{c.front}</span>
            <span className="reading">{c.romaji}</span>
            <span className="meaning">{c.back}</span>
            {c.example ? (
              <span className="example">
                {c.example} — {c.exampleId}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
