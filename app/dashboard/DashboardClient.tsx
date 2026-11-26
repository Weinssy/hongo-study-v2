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
import {
  StudioHelpDisclosure,
  StudioTabs,
} from "@/app/components/StudioControls";
import { showStudioToast } from "@/app/components/StudioToastHost";

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
    showStudioToast("Target harian tersimpan.");
  }

  if (phase === "loading") {
    return (
      <div className="page-shell">
        <div className="workspace-header">
          <h1>Dashboard Progres</h1>
          <p className="page-lead">Memuat progres belajarmu…</p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="page-shell">
        <div className="workspace-header">
          <h1>Dashboard Progres</h1>
        </div>
        <div className="panel">
          <p className="form-error" role="alert">
            {errorMsg}
          </p>
          <div className="session-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void load()}
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
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
    <div className="page-shell">
      <div className="workspace-header">
        <h1>Dashboard Progres</h1>
        <p className="page-lead">
          {user
            ? "Progres akunmu, dihitung dari ulangan yang tercatat."
            : "Progres mode tamu di perangkat ini. Masuk agar progres tersimpan ke akun."}
        </p>
      </div>

      <div className="dashboard-grid">
        {isEmpty ? (
          <div className="panel">
            <p>
              Belum ada aktivitas tercatat, jadi belum ada metrik atau grafik
              yang bisa ditampilkan. Selesaikan satu sesi belajar atau satu kuis
              terlebih dulu agar streak, grafik, dan lencanamu mulai terisi.
            </p>
            <div className="session-actions">
              <Link href="/belajar" className="btn btn-primary">
                Mulai sesi belajar pertama
              </Link>
              <Link href="/kuis" className="btn">
                Coba kuis 10 soal
              </Link>
            </div>
          </div>
        ) : (
          <section aria-label="Ringkasan progres" className="metrics-band">
            <div className="metric-card metric-card-primary">
              <span className="metric-value">{streak} hari</span>
              <span className="metric-label">Streak belajar berturut-turut</span>
            </div>
            <div className="metric-card metric-card-primary">
              <span className="metric-value">{mastered}</span>
              <span className="metric-label">Kartu dikuasai (interval 21+ hari)</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">{dueToday}</span>
              <span className="metric-label">Jatuh tempo hari ini</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">{totalReviews}</span>
              <span className="metric-label">Total penilaian tercatat</span>
            </div>
          </section>
        )}

        <div className="dashboard-split">
          {!isEmpty ? (
            <div className="dashboard-main-col">
              <section className="chart-panel" aria-labelledby="grafik-judul">
                <div className="chart-head">
                  <h2 id="grafik-judul">
                    Berapa banyak kartu yang kamu nilai per hari? ({range} hari)
                  </h2>
                </div>

                <StudioTabs
                  label="Rentang grafik aktivitas"
                  selected={range === 7 ? 0 : 1}
                  options={[
                    { value: "7", label: "7 hari" },
                    { value: "30", label: "30 hari" },
                  ]}
                  onChange={(_, val) => setRange(val === "30" ? 30 : 7)}
                />

                <div
                  className="activity-chart"
                  role="img"
                  aria-label={`Grafik jumlah penilaian per hari selama ${range} hari terakhir`}
                >
                  {series.map((s) => (
                    <div
                      key={s.date}
                      className="activity-col"
                      title={`${s.date}: ${s.count} penilaian`}
                    >
                      <div
                        className={`activity-bar${s.count === 0 ? " activity-bar-zero" : ""}`}
                        style={{
                          blockSize: `${s.count === 0 ? 4 : Math.max(8, (s.count / maxCount) * 100)}%`,
                        }}
                      />
                      <span className="activity-count">{s.count > 0 ? s.count : ""}</span>
                    </div>
                  ))}
                </div>
                <p className="meta-note num-tabular">
                  Hari ini: {todayCount} penilaian dari target {dailyTarget} kartu
                  per sesi.
                </p>
              </section>

              <section aria-labelledby="lencana-judul">
                <div className="heading-with-help">
                  <h2 id="lencana-judul">Lencana</h2>
                  <StudioHelpDisclosure
                    label="Info penguasaan kartu"
                    text="Kartu dihitung dikuasai saat interval SM-2 mencapai minimal 21 hari."
                  />
                </div>
                <div className="badge-grid">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className={b.earned ? "badge-card earned" : "badge-card"}
                    >
                      <div className="badge-head">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          aria-hidden="true"
                        >
                          {b.earned ? (
                            <path d="M20 6L9 17l-5-5" />
                          ) : (
                            <circle cx="12" cy="12" r="9" />
                          )}
                        </svg>
                        <strong>{b.label}</strong>
                      </div>
                      <span>{b.description}</span>
                      <span className="badge-status">
                        {b.earned ? "Sudah diraih" : "Belum diraih"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}

          <section aria-labelledby="target-judul">
            <h2 id="target-judul">Target harian</h2>
            <div className="panel target-panel">
              <form onSubmit={handleTargetSubmit} className="stack-form">
                <div className="field">
                  <label htmlFor="daily-target">Jumlah kartu per sesi belajar</label>
                  <span id="daily-target-hint" className="field-hint">
                    Pilih angka antara 1 sampai 100 kartu per sesi.
                  </span>
                  <input
                    id="daily-target"
                    name="dailyTarget"
                    type="number"
                    min={1}
                    max={100}
                    required
                    aria-describedby="daily-target-hint"
                    value={targetInput}
                    onChange={(e) => {
                      setTargetInput(e.target.value);
                      setTargetSaved(false);
                    }}
                  />
                </div>
                <div>
                  <button type="submit" className="btn btn-primary">
                    Simpan target
                  </button>
                </div>
                {targetSaved ? (
                  <p className="form-notice num-tabular" role="status">
                    <span aria-hidden="true">✓</span>
                    <span>Target harian tersimpan: {dailyTarget} kartu per sesi.</span>
                  </p>
                ) : null}
                <p className="meta-note">
                  Catatan: target harian tersimpan di perangkat ini dan belum
                  tersinkron ke akun.
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
