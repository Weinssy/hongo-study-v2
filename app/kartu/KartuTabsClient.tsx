"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Card } from "@/lib/cards";
import type { VocabTheme } from "@/data/vocab";
import { StudioTabs } from "@/app/components/StudioControls";

type CardTab = "semua" | "kana" | "kosakata";

export default function KartuTabsClient({
  hiragana,
  katakana,
  vocab,
  totalVocabCount,
  activeTheme,
  themeOrder,
  themeLabels,
  initialTab = "semua",
}: {
  hiragana: Card[];
  katakana: Card[];
  vocab: Card[];
  totalVocabCount: number;
  activeTheme: VocabTheme | null;
  themeOrder: VocabTheme[];
  themeLabels: Record<VocabTheme, string>;
  initialTab?: CardTab;
}) {
  const initialIndex = initialTab === "kana" ? 1 : initialTab === "kosakata" ? 2 : 0;
  const [tabIndex, setTabIndex] = useState(initialIndex);
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();

  const filteredHiragana = useMemo(() => {
    if (!trimmed) return hiragana;
    return hiragana.filter(
      (c) =>
        c.front.includes(trimmed) || c.romaji.toLowerCase().includes(trimmed),
    );
  }, [hiragana, trimmed]);

  const filteredKatakana = useMemo(() => {
    if (!trimmed) return katakana;
    return katakana.filter(
      (c) =>
        c.front.includes(trimmed) || c.romaji.toLowerCase().includes(trimmed),
    );
  }, [katakana, trimmed]);

  const filteredVocab = useMemo(() => {
    if (!trimmed) return vocab;
    return vocab.filter(
      (c) =>
        c.front.toLowerCase().includes(trimmed) ||
        c.romaji.toLowerCase().includes(trimmed) ||
        c.back.toLowerCase().includes(trimmed) ||
        (c.example?.toLowerCase().includes(trimmed) ?? false),
    );
  }, [vocab, trimmed]);

  const kanaCount = filteredHiragana.length + filteredKatakana.length;
  const vocabCount = filteredVocab.length;
  const totalCount = kanaCount + vocabCount;

  const showKana = tabIndex === 0 || tabIndex === 1;
  const showVocab = tabIndex === 0 || tabIndex === 2;
  const isEmpty =
    (tabIndex === 0 && totalCount === 0) ||
    (tabIndex === 1 && kanaCount === 0) ||
    (tabIndex === 2 && vocabCount === 0);

  return (
    <>
      <div className="kartu-toolbar">
        <search className="field search-box">
          <label htmlFor="cari-kartu">Cari kana, kata Jepang, romaji, atau arti</label>
          <input
            id="cari-kartu"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mis. ka, みず, atau minum"
            autoComplete="off"
          />
        </search>

        <StudioTabs
          label="Tampilan kartu"
          selected={tabIndex}
          options={[
            { value: "semua", label: `Semua (${totalCount})` },
            { value: "kana", label: `Kana (${kanaCount})` },
            { value: "kosakata", label: `Kosakata (${vocabCount})` },
          ]}
          onChange={(idx) => setTabIndex(idx)}
        />
      </div>

      <div role="tabpanel" aria-label="Daftar kartu terpilih">
        {isEmpty ? (
          <div className="panel">
            <p>
              Tidak ada kartu yang cocok dengan kata kunci{" "}
              <strong>{query.trim()}</strong>.
            </p>
            <div className="session-actions">
              <button
                type="button"
                className="btn"
                onClick={() => setQuery("")}
              >
                Hapus kata kunci
              </button>
              {activeTheme ? (
                <Link href="/kartu" className="btn">
                  Tampilkan semua tema
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {showKana && kanaCount > 0 ? (
          <section aria-label="Kana dasar">
            {filteredHiragana.length > 0 ? (
              <>
                <div className="kana-section-head">
                  <h2>Hiragana ({filteredHiragana.length})</h2>
                </div>
                <div className="kana-grid">
                  {filteredHiragana.map((c) => (
                    <div key={c.id} className="kana-cell">
                      <span className="char" lang="ja">
                        {c.front}
                      </span>
                      <span className="romaji">{c.romaji}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {filteredKatakana.length > 0 ? (
              <>
                <div className="kana-section-head">
                  <h2>Katakana ({filteredKatakana.length})</h2>
                </div>
                <div className="kana-grid">
                  {filteredKatakana.map((c) => (
                    <div key={c.id} className="kana-cell">
                      <span className="char" lang="ja">
                        {c.front}
                      </span>
                      <span className="romaji">{c.romaji}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        ) : null}

        {showVocab ? (
          <section aria-label="Kosakata JLPT N5">
            <div className="kana-section-head">
              <h2>
                Kosakata JLPT N5 ({filteredVocab.length}
                {activeTheme ? ` dari ${totalVocabCount}` : ""})
              </h2>
            </div>

            <nav className="theme-chips" aria-label="Saring kosakata per tema">
              <Link
                href="/kartu"
                className={activeTheme === null ? "chip active" : "chip"}
              >
                Semua tema
              </Link>
              {themeOrder.map((t) => (
                <Link
                  key={t}
                  href={`/kartu?tema=${t}`}
                  className={activeTheme === t ? "chip active" : "chip"}
                  aria-current={activeTheme === t ? "page" : undefined}
                >
                  {themeLabels[t]}
                </Link>
              ))}
            </nav>

            {filteredVocab.length > 0 ? (
              <div className="vocab-list">
                {filteredVocab.map((c) => (
                  <article key={c.id} className="vocab-item">
                    <div className="vocab-top">
                      <div className="vocab-word">
                        <span className="jp" lang="ja">
                          {c.front}
                        </span>
                        <span className="reading">{c.romaji}</span>
                      </div>
                      {c.theme ? (
                        <span className="theme-tag">{themeLabels[c.theme]}</span>
                      ) : null}
                    </div>
                    <span className="meaning">{c.back}</span>
                    {c.example ? (
                      <span className="example">
                        <span lang="ja">{c.example}</span> ({c.exampleId})
                      </span>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </>
  );
}
