"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hongo-color-scheme";

type Scheme = "light" | "dark";

function readMetaContent(): "light dark" | Scheme {
  if (typeof document === "undefined") return "light dark";
  const val = document
    .querySelector('meta[name="color-scheme"]')
    ?.getAttribute("content");
  if (val === "light" || val === "dark") return val;
  return "light dark";
}

function getSystemScheme(): Scheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveScheme(): Scheme {
  const meta = readMetaContent();
  if (meta === "light" || meta === "dark") return meta;
  return getSystemScheme();
}

export default function ThemeToggle() {
  const [rendered, setRendered] = useState<Scheme>("light");

  useEffect(() => {
    setRendered(resolveScheme());

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      setRendered(resolveScheme());
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next =
        event.newValue === "light" || event.newValue === "dark"
          ? event.newValue
          : "light dark";
      document
        .querySelector('meta[name="color-scheme"]')
        ?.setAttribute("content", next);
      setRendered(resolveScheme());
    };

    mql.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      mql.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function toggleTheme() {
    const currentRendered = resolveScheme();
    const target: Scheme = currentRendered === "dark" ? "light" : "dark";
    const system = getSystemScheme();
    const meta = document.querySelector('meta[name="color-scheme"]');

    try {
      if (target === system) {
        window.localStorage.removeItem(STORAGE_KEY);
        meta?.setAttribute("content", "light dark");
      } else {
        window.localStorage.setItem(STORAGE_KEY, target);
        meta?.setAttribute("content", target);
      }
    } catch {
      meta?.setAttribute("content", target);
    }
    setRendered(target);
  }

  const nextActionLabel =
    rendered === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={nextActionLabel}
    >
      {rendered === "dark" ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      )}
      <span className="theme-toggle-text">
        {rendered === "dark" ? "Terang" : "Gelap"}
      </span>
    </button>
  );
}
