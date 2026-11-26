"use client";

import { useState } from "react";
import Link from "next/link";
import type { Card } from "@/lib/cards";

export default function HomeSpecimenCard({ samples }: { samples: Card[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = samples[selectedIdx] ?? samples[0];
  if (!current) return null;

  const kindLabel =
    current.type === "kana"
      ? current.script === "hiragana"
        ? "Hiragana"
        : "Katakana"
      : "Kosakata N5";

  return (
    <div className="specimen-stage">
      <div className="specimen-bar">
        <span className="specimen-kind">{kindLabel}</span>
        <div className="specimen-switch" role="group" aria-label="Pilih contoh kartu">
          {samples.map((card, i) => (
            <button
              key={card.id}
              type="button"
              className="specimen-dot-btn"
              aria-pressed={i === selectedIdx}
              aria-label={`Contoh ${i + 1}: ${card.front}`}
              onClick={() => {
                setSelectedIdx(i);
                setRevealed(false);
              }}
            >
              <span lang="ja">{card.front}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="study-frame">
        <span className="glyph-stage" lang="ja">
          {current.front}
        </span>

        {revealed ? (
          <div className="specimen-answer">
            <span className="specimen-romaji">{current.romaji}</span>
            {current.type === "vocab" ? (
              <span>{current.back}</span>
            ) : (
              <span>Pelafalan romaji</span>
            )}
            {current.example ? (
              <span className="meta-note">
                <span lang="ja">{current.example}</span> ({current.exampleId})
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="specimen-footer">
        <button
          type="button"
          className="btn"
          aria-expanded={revealed}
          onClick={() => setRevealed((prev) => !prev)}
        >
          {revealed ? "Tutup jawaban" : "Balik kartu contoh"}
        </button>
        <Link href="/kartu" className="text-action-link">
          Lihat semua kartu
        </Link>
      </div>
    </div>
  );
}
