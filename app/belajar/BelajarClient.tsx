"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getAllCards, type Card } from "@/lib/cards";
import {
  GRADE_LABELS,
  GRADE_ORDER,
  GRADE_QUALITY,
  newCardState,
  reviewCard,
  selectDueCards,
  type GradeName,
} from "@/lib/srs";
import { loadProgress, saveReview, type ProgressMap } from "@/lib/progress-store";
import { loadSettings, todayLocal } from "@/lib/local-store";
import { useAuth } from "@/lib/auth";
import {
  StudioHelpDisclosure,
  StudioProgress,
} from "@/app/components/StudioControls";
import { showStudioToast } from "@/app/components/StudioToastHost";

type Phase = "loading" | "error" | "empty" | "studying" | "done";

export default function BelajarClient() {
  const { user, loading: authLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [queue, setQueue] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [nextDue, setNextDue] = useState<string | null>(null);
  const [dailyTarget, setDailyTarget] = useState(10);
  const progressRef = useRef<ProgressMap>({});
  const savingRef = useRef(false);

  const startSession = useCallback(async () => {
    if (authLoading) return;
    setPhase("loading");
    try {
      const progress = await loadProgress(user);
      progressRef.current = progress;
      const today = todayLocal();
      const target = loadSettings().dailyTarget;
      setDailyTarget(target);
      const picked = selectDueCards(getAllCards(), progress, today, target);
      if (picked.length === 0) {
        const upcoming = Object.values(progress)
          .map((p) => p.dueDate)
          .filter((d) => d > today)
          .sort();
        setNextDue(upcoming[0] ?? null);
        setPhase("empty");
        return;
      }
      setQueue(picked);
      setIndex(0);
      setReviewed(0);
      setFlipped(false);
      setPhase("studying");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat progres.");
      setPhase("error");
    }
  }, [user, authLoading]);

  useEffect(() => {
    void startSession();
  }, [startSession]);

  const current: Card | undefined = queue[index];

  const intervalPreview = useMemo(() => {
    if (!current) return null;
    const today = todayLocal();
    const state = progressRef.current[current.id] ?? newCardState();
    const map = new Map<GradeName, number>();
    for (const grade of GRADE_ORDER) {
      map.set(grade, reviewCard(state, grade, today).intervalDays);
    }
    return map;
  }, [current, index]);

  function handleReveal() {
    setFlipping(true);
    setFlipped(true);
    window.setTimeout(() => setFlipping(false), 300);
  }

  async function handleGrade(grade: GradeName) {
    if (!current || savingRef.current) return;
    savingRef.current = true;
    try {
      const today = todayLocal();
      const state = progressRef.current[current.id] ?? newCardState();
      const result = reviewCard(state, grade, today);
      await saveReview(user, current, result, GRADE_QUALITY[grade]);
      progressRef.current = {
        ...progressRef.current,
        [current.id]: {
          ease: result.ease,
          intervalDays: result.intervalDays,
          repetitions: result.repetitions,
          dueDate: result.dueDate,
          lastGrade: GRADE_QUALITY[grade],
          updatedAt: new Date().toISOString(),
        },
      };
      const doneCount = reviewed + 1;
      setReviewed(doneCount);
      setFlipped(false);
      if (index + 1 >= queue.length) {
        setPhase("done");
        showStudioToast("Sesi belajar selesai.");
      } else {
        setIndex(index + 1);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan nilai.");
      setPhase("error");
    } finally {
      savingRef.current = false;
    }
  }

  if (phase === "loading") {
    return (
      <div className="page-shell">
        <div className="workspace-header">
          <h1>Sesi Belajar</h1>
          <p className="page-lead">Menyiapkan kartu yang jatuh tempo…</p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="page-shell">
        <div className="workspace-header">
          <h1>Sesi Belajar</h1>
        </div>
        <div className="panel">
          <p className="form-error" role="alert">
            {errorMsg}
          </p>
          <div className="session-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void startSession()}
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "empty") {
    return (
      <div className="page-shell">
        <div className="workspace-header">
          <h1>Sesi Belajar</h1>
        </div>
        <div className="panel">
          <p>
            Tidak ada kartu yang jatuh tempo hari ini, dan semua kartu sudah
            pernah dipelajari.
            {nextDue ? (
              <>
                {" "}
                Kartu berikutnya jatuh tempo pada <strong className="num-tabular">{nextDue}</strong>.
              </>
            ) : null}
          </p>
          <div className="session-actions">
            <Link href="/kartu" className="btn btn-primary">
              Lihat daftar kartu lengkap
            </Link>
            <Link href="/kuis" className="btn">
              Latihan lewat kuis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressRatio =
    queue.length > 0 ? (phase === "done" ? 1 : reviewed / queue.length) : 0;

  return (
    <div className="page-shell">
      <div className="workspace-header">
        <div className="heading-with-help">
          <h1>{phase === "done" ? "Sesi selesai" : "Sesi Belajar"}</h1>
          <StudioHelpDisclosure
            label="Cara kerja jadwal SM-2"
            text="Penilaianmu mengatur jadwal muncul kartu lewat SM-2 tepat sebelum lupa. Nilai Lupa mengulang besok, sedangkan Bisa dan Gampang memperpanjang jarak hari."
          />
        </div>

        {phase === "studying" ? (
          <p className="page-lead">
            {user
              ? "Kamu masuk sebagai pengguna terdaftar: progres sesi ini tersimpan ke akunmu."
              : "Mode tamu: progres sesi ini tersimpan di perangkat ini. Masuk agar progresmu tersimpan ke akun."}
          </p>
        ) : null}
      </div>

      {queue.length > 0 ? (
        <StudioProgress
          value={progressRatio}
          label={`Progres sesi belajar: ${reviewed} dari ${queue.length} kartu`}
          caption={
            phase === "studying"
              ? `Kartu ${index + 1} dari ${queue.length}`
              : `${reviewed} dari ${queue.length} kartu dinilai`
          }
        />
      ) : null}

      {phase === "done" ? (
        <div className="panel">
          <p>
            Kamu menilai <strong className="num-tabular">{reviewed} kartu</strong> pada sesi ini.
            Jadwal ulangan tiap kartu sudah diperbarui mengikuti penilaianmu.
          </p>
          <div className="session-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void startSession()}
            >
              Periksa lagi kartu jatuh tempo
            </button>
            <Link href="/kartu" className="btn">
              Lihat daftar kartu
            </Link>
            <Link href="/dashboard" className="btn">
              Buka dashboard
            </Link>
          </div>
        </div>
      ) : current ? (
        <div className="study-stage">
          <div className="flashcard-perspective">
            <div
              className={`flashcard-card study-frame${flipped ? " is-flipped" : ""}${flipping ? " is-flipping" : ""}`}
            >
              <span className="flashcard-kind">
                {current.type === "kana"
                  ? current.script === "hiragana"
                    ? "Hiragana"
                    : "Katakana"
                  : "Kosakata N5"}
              </span>

              <span className="flashcard-front" lang="ja">
                {current.front}
              </span>

              {flipped ? (
                <div className="flashcard-back" aria-live="polite">
                  <span className="flashcard-romaji">{current.romaji}</span>
                  {current.type === "vocab" ? (
                    <span className="flashcard-meaning">{current.back}</span>
                  ) : null}
                  {current.example ? (
                    <span className="flashcard-example">
                      <span lang="ja">{current.example}</span> ({current.exampleId})
                    </span>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleReveal}
                >
                  Tampilkan jawaban
                </button>
              )}
            </div>
          </div>

          {flipped ? (
            <div
              className="grade-grid"
              role="group"
              aria-label="Nilai ingatanmu untuk kartu ini"
            >
              {GRADE_ORDER.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  className={`grade-btn grade-${grade}`}
                  onClick={() => void handleGrade(grade)}
                >
                  <span className="grade-label">{GRADE_LABELS[grade]}</span>
                  <span className="grade-interval">
                    {intervalPreview
                      ? `ulang ${intervalPreview.get(grade)} hari lagi`
                      : ""}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          <p className="meta-note">
            Satu sesi memuat paling banyak {dailyTarget} kartu mengikuti target
            harianmu di perangkat ini: kartu jatuh tempo lebih dulu, lalu kartu
            baru.
          </p>
        </div>
      ) : null}
    </div>
  );
}
