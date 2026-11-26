"use client";

import { useState, type ReactNode } from "react";
import { SakugaTabs } from "@/app/components/SakugaControls";

type CardTab = "semua" | "kana" | "kosakata";

export default function KartuTabsClient({
  totalCount,
  kanaCount,
  vocabCount,
  initialTab = "semua",
  kanaSection,
  vocabSection,
}: {
  totalCount: number;
  kanaCount: number;
  vocabCount: number;
  initialTab?: CardTab;
  kanaSection: ReactNode;
  vocabSection: ReactNode;
}) {
  const initialIndex = initialTab === "kana" ? 1 : initialTab === "kosakata" ? 2 : 0;
  const [tabIndex, setTabIndex] = useState(initialIndex);

  const showKana = tabIndex === 0 || tabIndex === 1;
  const showVocab = tabIndex === 0 || tabIndex === 2;

  return (
    <>
      <div className="sakuga-tabs-row">
        <SakugaTabs
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
        {showKana ? kanaSection : null}
        {showVocab ? vocabSection : null}
      </div>
    </>
  );
}
