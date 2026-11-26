"use client";

import { useEffect, useRef } from "react";
import type { SakugaToastElement } from "@/types/sakuga";

const TOAST_EVENT = "hongo:sakuga-toast";

export function showSakugaToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

export default function SakugaToastHost() {
  const toastRef = useRef<SakugaToastElement | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<string>;
      const el = toastRef.current;
      if (!el) return;
      if (typeof el.show === "function") {
        el.show(custom.detail);
      } else if (typeof customElements !== "undefined") {
        void customElements.whenDefined("sakuga-toast").then(() => {
          toastRef.current?.show?.(custom.detail);
        });
      }
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  return (
    <sakuga-toast
      ref={toastRef}
      duration="2.6"
      className="sakuga-toast-anchor"
    />
  );
}
