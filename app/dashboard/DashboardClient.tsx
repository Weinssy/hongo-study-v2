"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { loadActivity, loadProgress, type ActivityEntry, type ProgressMap } from "@/lib/progress-store";
import {
  loadLocalQuizHistory,
  loadSettings,
  saveSettings,
  todayLocal,
} from "@/lib/local-store";
import {
  activitySeries,
  computeStreak,
  countMastered,
  countReviewed,
  evaluateBadges,
} from "@/lib/progress-stats";
import { useAuth } from "@/lib/auth";

type Phase = "loading" | "error" | "ready";

export default function DashboardClient() {
  const { user, loading: authLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState<ProgressMap>({});
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [quizSessions, setQuizSessions] = useState(0);
  const [range, setRange] = useState<7 | 30>(7);
  const [targetInput, setTargetInput] = useState("10");
  const [targetSaved, setTargetSaved] = useState(false);

  const load = useCallback(async () => {
    if (authLoading) return;
    setPhase("loading");
    try {
      const [prog, act] = await Promise.all([loadProgress(user), loadActivity(user)]);
      setProgress(prog);
      setActivity(act);
      setQuizSessions(loadLocalQuizHistory().length);
      setTargetInput(String(loadSettings().dailyTarget));
      setPhase("ready");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat progres.");
      setPhase("error");
    }
  }, [user, authLoading]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleTargetSubmit(event: FormEvent) {
    event.preventDefault();
    const value = Number(targetInput);
    if (!Number.isFinite(value)) return;
    const clamped = Math.min(100, Math.max(1, Math.floor(value)));
    saveSettings({ dailyTarget: clamped });
    setTargetInput(String(clamped));
    setTargetSaved(true);
  }

  if (phase === "loading") {
    return (
      <>
        <h1>Dashboard Progres</h1>
        <p className="lead">Memuat progres belajarmu…</p>
      </>
    );
  }

  if (phase === "error") {
    return (
      <>
        <h1>Dashboard Progres</h1>
        <div className="panel">
          <p className="form-error" role="alert">
            {errorMsg}
          </p>
          <button type="button" className="btn btn-primary" onClick={() => void load()}>
            Coba lagi
          </button>
        </div>
      </>
    );
  }

  const today = todayLocal();
  const streak = computeStreak(activity, today);
  const mastered = countMastered(progress);
  const reviewed = countReviewed(progress);
  const dueToday = Object.values(progress).filter((p) => p.dueDate <= today).length;
  const totalReviews = activity.reduce((sum, e) => sum + e.count, 0);
  const todayCount = activity.find((e) => e.date === today)?.count ?? 0;
  const dailyTarget = loadSettings().dailyTarget;
  const kanaReviewed = Object.keys(progress).filter((id) => id.startsWith("kana-")).length;
  const badges = evaluateBadges({
    kanaReviewed,
    streak,
    totalReviews,
    quizSessions,
  });
  const series = activitySeries(activity, range, today);
  const maxCount = Math.max(1, ...series.map((s) => s.count));
  const isEmpty = reviewed === 0 && totalReviews === 0 && quizSessions === 0;

  return (
    <>
      <h1>Dashboard Progres</h1>
      <p className="lead">
        {user
          ? "Progres akunmu, dihitung dari ulangan yang tercatat."
          : "Progres mode tamu di perangkat ini. Masuk agar progres tersimpan ke akun."}
      </p>

      {isEmpty ? (
        <div className="panel">
          <p>
            Belum ada aktivitas tercatat, jadi belum ada yang bisa ditampilkan
            di sini. Selesaikan satu sesi belajar atau satu kuis, lalu kembali
            ke halaman ini: streak, grafik, dan lencanamu dihitung dari
            aktivitas itu.
          </p>
          <p className="session-actions">
            <Link href="/belajar" className="btn btn-primary">
              Mulai sesi belajar pertama
            </Link>
            <Link href="/kuis" className="btn btn-ghost">
              Coba kuis
            </Link>
          </p>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <strong>{streak} hari</strong>
              Streak belajar
            </div>
            <div className="stat-card">
              <strong>{mastered}</strong>
              Kartu dikuasai (interval 21+ hari)
            </div>
            <div className="stat-card">
              <strong>{dueToday}</strong>
              Kartu jatuh tempo hari ini
            </div>
            <div className="stat-card">
              <strong>{totalReviews}</strong>
              Total penilaian tercatat
            </div>
          </div>

          <h2>Aktivitas {range} hari terakhir</h2>
          <div className="range-switch" role="group" aria-label="Rentang grafik aktivitas">
            <button
              type="button"
              className={range === 7 ? "mode-btn active" : "mode-btn"}
              aria-pressed={range === 7}
              onClick={() => setRange(7)}
            >
              7 hari
            </button>
            <button
              type="button"
              className={range === 30 ? "mode-btn active" : "mode-btn"}
              aria-pressed={range === 30}
              onClick={() => setRange(30)}
            >
              30 hari
            </button>
          </div>
          <div className="activity-chart" role="img" aria-label={`Grafik jumlah penilaian per hari selama ${range} hari terakhir`}>
            {series.map((s) => (
              <div key={s.date} className="activity-col" title={`${s.date}: ${s.count} penilaian`}>
                <div
                  className="activity-bar"
                  style={{ height: `${Math.max(4, (s.count / maxCount) * 100)}%` }}
                />
                <span className="activity-count">{s.count > 0 ? s.count : ""}</span>
              </div>
            ))}
          </div>
          <p className="session-note">
            Hari ini: {todayCount} penilaian dari target {dailyTarget} kartu per sesi.
          </p>

          <h2>Lencana</h2>
          <div className="badge-grid">
            {badges.map((b) => (
              <div key={b.id} className={b.earned ? "badge-card earned" : "badge-card"}>
                <strong>{b.label}</strong>
                <span>{b.description}</span>
                <span className="badge-status">{b.earned ? "Sudah diraih" : "Belum diraih"}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2>Target harian</h2>
      <div className="panel">
        <form onSubmit={handleTargetSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="daily-target">Jumlah kartu per sesi belajar</label>
            <input
              id="daily-target"
              type="number"
              min={1}
              max={100}
              value={targetInput}
              onChange={(e) => {
                setTargetInput(e.target.value);
                setTargetSaved(false);
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Simpan target
          </button>
          {targetSaved ? (
            <p className="form-notice" role="status">
              Target harian tersimpan: {dailyTarget} kartu per sesi.
            </p>
          ) : null}
          <p className="session-note">
            Catatan: pada tahap ini target tersimpan di perangkat ini, belum
            tersinkron ke akun.
          </p>
        </form>
      </div>
    </>
  );
}
