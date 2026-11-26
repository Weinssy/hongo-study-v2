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
  SakugaButton,
  SakugaProgress,
  SakugaTooltip,
} from "@/app/components/SakugaControls";
import { showSakugaToast } from "@/app/components/SakugaToastHost";

type Phase = "loading" | "error" | "empty" | "studying" | "done";

export default function BelajarClient() {
  const { user, loading: authLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [queue, setQueue] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
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
        showSakugaToast("Sesi selesai!");
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
      <>
        <h1>Sesi Belajar</h1>
        <p className="lead">Menyiapkan kartu yang jatuh tempo…</p>
      </>
    );
  }

  if (phase === "error") {
    return (
      <>
        <h1>Sesi Belajar</h1>
        <div className="panel">
          <p className="form-error" role="alert">
            {errorMsg}
          </p>
          <SakugaButton onClick={() => void startSession()}>
            Coba lagi
          </SakugaButton>
        </div>
      </>
    );
  }

  if (phase === "empty") {
    return (
      <>
        <h1>Sesi Belajar</h1>
        <div className="panel">
          <p>
            Tidak ada kartu yang jatuh tempo hari ini, dan semua kartu sudah
            pernah dipelajari.
            {nextDue ? (
              <>
                {" "}
                Kartu berikutnya jatuh tempo pada <strong>{nextDue}</strong>.
              </>
            ) : null}
          </p>
          <p>
            Sambil menunggu, kamu bisa menengok lagi{" "}
            <Link href="/kartu">daftar kartu lengkap</Link>.
          </p>
        </div>
      </>
    );
  }

  const progressRatio =
    queue.length > 0 ? (phase === "done" ? 1 : reviewed / queue.length) : 0;

  return (
    <>
      <div className="sakuga-heading-row">
        <h1>{phase === "done" ? "Sesi selesai" : "Sesi Belajar"}</h1>
        <SakugaTooltip
          label="Cara kerja jadwal SM-2"
          text="Penilaianmu mengatur jadwal muncul kartu lewat SM-2 tepat sebelum lupa."
        />
      </div>

      {phase === "studying" ? (
        <p className="lead">
          {user
            ? "Kamu masuk sebagai pengguna terdaftar: progres sesi ini tersimpan ke akunmu."
            : "Mode tamu: progres sesi ini tersimpan di perangkat ini. Masuk agar progresmu tersimpan ke akun."}
        </p>
      ) : null}

      {queue.length > 0 ? (
        <div className="sakuga-progress-wrap">
          <SakugaProgress
            value={progressRatio}
            label={`Progres sesi belajar: ${reviewed} dari ${queue.length} kartu`}
            doneLabel="Selesai ✓"
          />
          {phase === "studying" ? (
            <p className="session-progress-caption">
              Kartu {index + 1} dari {queue.length}
            </p>
          ) : null}
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="panel">
          <p>
            Kamu menilai <strong>{reviewed} kartu</strong> pada sesi ini.
            Jadwal ulangan tiap kartu sudah diperbarui mengikuti penilaianmu.
          </p>
          <div className="session-actions">
            <SakugaButton onClick={() => void startSession()}>
              Periksa lagi kartu jatuh tempo
            </SakugaButton>
            <Link href="/kartu" className="btn btn-ghost">
              Lihat daftar kartu
            </Link>
          </div>
        </div>
      ) : current ? (
        <>
          <div className="study-card">
            <span className="study-card-kind">
              {current.type === "kana"
                ? current.script === "hiragana"
                  ? "Hiragana"
                  : "Katakana"
                : "Kosakata N5"}
            </span>
            <span className="study-card-front">{current.front}</span>
            {flipped ? (
              <span className="study-card-back">
                <span className="study-card-romaji">{current.romaji}</span>
                {current.type === "vocab" ? (
                  <span className="study-card-meaning">{current.back}</span>
                ) : null}
                {current.example ? (
                  <span className="study-card-example">
                    {current.example} ({current.exampleId})
                  </span>
                ) : null}
              </span>
            ) : (
              <SakugaButton onClick={() => setFlipped(true)}>
                Tampilkan jawaban
              </SakugaButton>
            )}
          </div>

          {flipped ? (
            <div className="grade-grid" role="group" aria-label="Nilai ingatanmu untuk kartu ini">
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
                      ? `muncul lagi ${intervalPreview.get(grade)} hari lagi`
                      : ""}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          <p className="session-note">
            Satu sesi memuat paling banyak {dailyTarget} kartu mengikuti target
            harianmu yang tersimpan di perangkat ini: kartu jatuh tempo lebih
            dulu, lalu kartu baru. Jadwal dihitung dengan algoritma SM-2 dari
            penilaianmu sendiri.
          </p>
        </>
      ) : null}
    </>
  );
}
