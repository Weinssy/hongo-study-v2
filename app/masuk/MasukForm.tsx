"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

type Mode = "masuk" | "daftar";

export default function MasukForm() {
  const { supabaseReady, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("masuk");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!supabaseReady) {
    return (
      <div className="page-shell">
        <div className="panel auth-panel">
          <h1>Login belum aktif</h1>
          <p className="page-lead">
            Project Supabase belum terhubung ke situs ini (kunci akses belum
            dipasang), jadi pendaftaran dan login belum bisa dipakai. Mode tamu
            tetap jalan penuh: semua kartu bisa dilihat dan sesi belajar
            tersimpan di perangkat ini.
          </p>
          <div className="session-actions">
            <Link href="/belajar" className="btn btn-primary">
              Buka sesi belajar sebagai tamu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "masuk") {
        const { error: err } = await signIn(email.trim(), password);
        if (err) {
          setError(`Tidak bisa masuk: ${err}`);
          return;
        }
        router.push("/belajar");
      } else {
        const { error: err, needsEmailConfirmation } = await signUp(
          email.trim(),
          password,
          displayName.trim(),
        );
        if (err) {
          setError(`Tidak bisa mendaftar: ${err}`);
          return;
        }
        if (needsEmailConfirmation) {
          setNotice(
            "Pendaftaran diterima. Project ini meminta konfirmasi email: buka kotak masukmu, klik tautan konfirmasi, lalu masuk di sini.",
          );
          setMode("masuk");
        } else {
          router.push("/belajar");
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="panel auth-panel">
        <h1>{mode === "masuk" ? "Masuk" : "Daftar akun"}</h1>
        <p className="page-lead">
          {mode === "masuk"
            ? "Masuk supaya progres belajarmu tersimpan ke akun dan bisa dibuka dari perangkat lain."
            : "Akun dipakai untuk menyimpan progres SRS per kartu. Tanpa akun pun kamu tetap bisa belajar sebagai tamu."}
        </p>

        <div className="mode-switch" role="group" aria-label="Pilih mode autentikasi">
          <button
            type="button"
            className={mode === "masuk" ? "mode-btn active" : "mode-btn"}
            aria-pressed={mode === "masuk"}
            onClick={() => {
              setMode("masuk");
              setError(null);
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={mode === "daftar" ? "mode-btn active" : "mode-btn"}
            aria-pressed={mode === "daftar"}
            onClick={() => {
              setMode("daftar");
              setError(null);
            }}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stack-form">
          {mode === "daftar" ? (
            <div className="field">
              <label htmlFor="displayName">Nama tampilan</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nama kamu"
              />
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="email">Email</label>
            <span id="email-hint" className="field-hint">
              Gunakan format email yang aktif, mis. nama@contoh.id.
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-describedby="email-hint"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@contoh.id"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Kata sandi</label>
            <span id="password-hint" className="field-hint">
              Minimal 6 karakter.
            </span>
            <div className="password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "masuk" ? "current-password" : "new-password"}
                aria-describedby="password-hint"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn"
                aria-pressed={showPassword}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Tutup" : "Lihat"}
              </button>
            </div>
          </div>

          {error ? (
            <p className="form-error" role="alert">
              <span aria-hidden="true">✕</span>
              <span>{error}</span>
            </p>
          ) : null}

          {notice ? (
            <p className="form-notice" role="status">
              <span aria-hidden="true">✓</span>
              <span>{notice}</span>
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Memproses…" : mode === "masuk" ? "Masuk dan lanjut belajar" : "Buat akun"}
          </button>
        </form>
      </div>
    </div>
  );
}
