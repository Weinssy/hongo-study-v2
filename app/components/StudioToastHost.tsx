"use client";

import { useEffect, useRef, useState } from "react";

const TOAST_EVENT = "hongo:studio-toast";

export function showStudioToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

export default function StudioToastHost() {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail) return;
      setMessage(detail);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setMessage(null);
      }, 2800);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {message ? (
        <div className="studio-toast">
          <span>{message}</span>
          <button
            type="button"
            className="studio-toast-close"
            aria-label="Tutup pemberitahuan"
            onClick={() => setMessage(null)}
          >
            ✕
          </button>
        </div>
      ) : null}
    </div>
  );
}
