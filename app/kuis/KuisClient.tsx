"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { getAllCards, type Card } from "@/lib/cards";
import { THEME_LABELS, THEME_ORDER, type VocabTheme } from "@/data/vocab";
import {
  buildMultipleChoice,
  buildRomajiQuestion,
  checkRomaji,
  mulberry32,
  pickQuizCards,
  type QuizPoolItem,
  type QuizQuestion,
} from "@/lib/quiz";
import { loadProgress, saveQuizResult } from "@/lib/progress-store";
import { loadLocalQuizHistory, type QuizHistoryEntry } from "@/lib/local-store";
import { useAuth } from "@/lib/auth";
import { StudioProgress } from "@/app/components/StudioControls";
import { showStudioToast } from "@/app/components/StudioToastHost";

const QUESTION_COUNT = 10;
const CHOICE_LABELS = ["A", "B", "C", "D"];

type QuizMode = "campuran" | "kana" | "kosakata";
type Phase = "setup" | "playing" | "done";

const MODE_LABELS: Record<QuizMode, string> = {
  campuran: "Campuran",
  kana: "Kana saja",
  kosakata: "Kosakata saja",
};

function toPoolItem(card: Card): QuizPoolItem {
  return {
    id: card.id,
    kind: card.type,
    front: card.front,
    back: card.back,
    romaji: card.romaji,
  };
}

export default function KuisClient() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<QuizMode>("campuran");
  const [theme, setTheme] = useState<string>("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [romajiInput, setRomajiInput] = useState("");
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [startError, setStartError] = useState<string | null>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    setHistory(loadLocalQuizHistory().slice(-5).reverse());
  }, [phase]);

  async function startQuiz() {
    setStartError(null);
    const all = getAllCards();
    let cards = all;
    if (mode === "kana") cards = all.filter((c) => c.type === "kana");
    if (mode === "kosakata") cards = all.filter((c) => c.type === "vocab");
    if (mode !== "kana" && theme) {
      const t = theme as VocabTheme;
      cards = cards.filter((c) => c.type === "kana" || c.theme === t);
      if (mode === "kosakata") cards = cards.filter((c) => c.theme === t);
    }
    const pool = cards.map(toPoolItem);
    if (pool.length === 0) {
      setStartError("Tidak ada kartu untuk kombinasi mode dan tema ini.");
      return;
    }
    const rng = mulberry32((Math.random() * 1_000_000_000) | 0);
    let progress = null;
    if (user) {
      try {
        progress = await loadProgress(user);
      } catch {
        progress = null;
      }
    }
    const picked = pickQuizCards(pool, progress, QUESTION_COUNT, rng);
    const built = picked.map((item, i) =>
      i % 2 === 0
        ? buildMultipleChoice(item, pool.filter((p) => p.kind === item.kind), rng)
        : buildRomajiQuestion(item),
    );
    setQuestions(built);
    setIndex(0);
    setCorrectCount(0);
    setFeedback(null);
    setRomajiInput("");
    savedRef.current = false;
    setPhase("playing");
  }

  const current = questions[index];

  function correctAnswerText(q: QuizQuestion): string {
    return q.kind === "mc" ? q.choices[q.answerIndex] : q.expected;
  }

  function answerMc(choiceIdx: number) {
    if (!current || current.kind !== "mc" || feedback) return;
    const correct = choiceIdx === current.answerIndex;
    if (correct) {
      setCorrectCount((n) => n + 1);
      showStudioToast("Benar!");
    }
    setFeedback({
      correct,
      text: correct
        ? "Benar."
        : `Belum tepat. Jawaban yang benar: ${correctAnswerText(current)}.`,
    });
  }

  function answerRomaji(event: FormEvent) {
    event.preventDefault();
    if (!current || current.kind !== "romaji" || feedback) return;
    const correct = checkRomaji(romajiInput, current.expected);
    if (correct) {
      setCorrectCount((n) => n + 1);
      showStudioToast("Benar!");
    }
    setFeedback({
      correct,
      text: correct
        ? "Benar."
        : `Belum tepat. Romaji yang benar: ${current.expected}.`,
    });
  }

  async function nextQuestion() {
    if (index + 1 >= questions.length) {
      setPhase("done");
      showStudioToast(`Skor akhir: ${correctCount}/${questions.length}`);
      if (!savedRef.current) {
        savedRef.current = true;
        const label =
          MODE_LABELS[mode] +
          (theme && mode !== "kana" ? `, tema ${THEME_LABELS[theme as VocabTheme]}` : "");
        await saveQuizResult(user, {
          at: new Date().toISOString(),
          mode: label,
          total: questions.length,
          correct: correctCount,
        });
      }
      return;
    }
    setIndex(index + 1);
    setFeedback(null);
    setRomajiInput("");
  }

  if (phase === "playing" || phase === "done") {
    const progressValue =
      questions.length > 0
        ? phase === "done"
          ? 1
          : (index + (feedback ? 1 : 0)) / questions.length
        : 0;

    return (
      <div className="page-shell">
        <div className="workspace-header">
          <h1>{phase === "done" ? "Hasil Kuis" : "Kuis"}</h1>

          {phase === "playing" && current ? (
            <p className="page-lead num-tabular">
              Soal {index + 1} dari {questions.length}. Skor sementara:{" "}
              {correctCount} benar.
            </p>
          ) : null}
        </div>

        {questions.length > 0 ? (
          <StudioProgress
            value={progressValue}
            label={`Progres kuis: ${phase === "done" ? questions.length : index + 1} dari ${questions.length}`}
            caption={
              phase === "done"
                ? `${questions.length} soal selesai`
                : `Soal ${index + 1} dari ${questions.length}`
            }
          />
        ) : null}

        {phase === "done" ? (
          <div className="panel">
            <p>
              Skor kamu{" "}
              <strong className="num-tabular">
                {correctCount} dari {questions.length}
              </strong>
              . Hasil ini tersimpan di riwayat kuis perangkat ini
              {user ? " dan dikirim ke akunmu" : ""}.
            </p>
            <div className="session-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPhase("setup")}
              >
                Atur kuis baru
              </button>
              <Link href="/belajar" className="btn">
                Lanjut sesi belajar
              </Link>
              <Link href="/dashboard" className="btn">
                Lihat dashboard
              </Link>
            </div>
          </div>
        ) : current ? (
          <div className="study-stage">
            <div className="flashcard-card study-frame">
              <span className="flashcard-kind">
                {current.kind === "mc" ? "Pilihan ganda" : "Ketik romaji"}
              </span>
              <span className="flashcard-front" lang="ja">
                {current.prompt}
              </span>
            </div>

            {current.kind === "mc" ? (
              <div className="quiz-choices" role="group" aria-label="Pilihan jawaban">
                {current.choices.map((choice, i) => (
                  <button
                    key={`${choice}-${i}`}
                    type="button"
                    className="quiz-choice"
                    disabled={feedback !== null}
                    onClick={() => answerMc(i)}
                  >
                    <span className="choice-index" aria-hidden="true">
                      {CHOICE_LABELS[i] ?? i + 1}
                    </span>
                    <span>{choice}</span>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={answerRomaji} className="stack-form">
                <div className="field">
                  <label htmlFor="romaji-answer">Romaji untuk kartu di atas</label>
                  <span id="romaji-hint" className="field-hint">
                    Ketik huruf latin tanpa spasi atau tanda baca, mis. watashi.
                  </span>
                  <input
                    id="romaji-answer"
                    name="romajiAnswer"
                    type="text"
                    aria-describedby="romaji-hint"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="done"
                    disabled={feedback !== null}
                    value={romajiInput}
                    onChange={(e) => setRomajiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.nativeEvent.isComposing) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="mis. watashi"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={feedback !== null}
                  >
                    Periksa jawaban
                  </button>
                </div>
              </form>
            )}

            {feedback ? (
              <div className="stack-form" role="status">
                <p className={feedback.correct ? "form-notice" : "form-error"}>
                  <span aria-hidden="true">{feedback.correct ? "✓" : "✕"}</span>
                  <span>{feedback.text}</span>
                </p>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => void nextQuestion()}
                  >
                    {index + 1 >= questions.length ? "Lihat hasil" : "Soal berikutnya"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="workspace-header">
        <h1>Kuis</h1>
        <p className="page-lead">
          Sepuluh soal bergantian pilihan ganda dan ketik romaji.
          {user
            ? " Karena kamu masuk, soal diambil dari kartu yang paling lemah menurut data SRS-mu."
            : " Sebagai tamu, soal dipilih acak. Masuk agar soal menyesuaikan kartu yang paling lemah menurut data SRS-mu."}
        </p>
      </div>

      <div className="panel stack-form">
        <fieldset className="quiz-fieldset">
          <legend>Mode kuis</legend>
          <div className="radio-group">
            {(Object.keys(MODE_LABELS) as QuizMode[]).map((m) => (
              <label key={m} className="radio-card">
                <input
                  type="radio"
                  name="quiz-mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                />
                <span>{MODE_LABELS[m]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {mode !== "kana" ? (
          <div className="field">
            <label htmlFor="quiz-theme">Tema kosakata</label>
            <select
              id="quiz-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="">Semua tema</option>
              {THEME_ORDER.map((t) => (
                <option key={t} value={t}>
                  {THEME_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {startError ? (
          <p className="form-error" role="alert">
            {startError}
          </p>
        ) : null}

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void startQuiz()}
          >
            Mulai kuis 10 soal
          </button>
        </div>
      </div>

      {history.length > 0 ? (
        <section className="quiz-history-section" aria-labelledby="riwayat-kuis">
          <h2 id="riwayat-kuis">Riwayat kuis terakhir</h2>
          <ul className="quiz-history">
            {history.map((h, i) => (
              <li key={`${h.at}-${i}`} className="num-tabular">
                {new Date(h.at).toLocaleDateString("id-ID")}: {h.mode}, skor{" "}
                {h.correct}/{h.total}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
