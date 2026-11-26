"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface TabOption {
  value: string;
  label: string;
}

export function StudioProgress({
  value,
  label,
  caption,
}: {
  value: number;
  label: string;
  caption?: string;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const percent = Math.round(clamped * 100);

  return (
    <div className="progress-wrap">
      <div className="progress-head">
        <span>{caption ?? label}</span>
        <span className="num-tabular">{percent}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="progress-fill" style={{ inlineSize: `${percent}%` }} />
      </div>
    </div>
  );
}

export function StudioTabs({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: TabOption[];
  selected: number;
  onChange: (index: number, value: string) => void;
}) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectIndex(idx: number, focus = false) {
    const clamped = Math.max(0, Math.min(options.length - 1, idx));
    const opt = options[clamped];
    if (!opt) return;
    onChange(clamped, opt.value);
    const el = tabRefs.current[clamped];
    if (el) {
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (focus) el.focus();
    }
  }

  return (
    <div className="studio-tablist" role="tablist" aria-label={label}>
      {options.map((opt, idx) => {
        const isSelected = idx === selected;
        return (
          <button
            key={opt.value}
            ref={(node) => {
              tabRefs.current[idx] = node;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            className="studio-tab"
            onClick={() => selectIndex(idx)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                selectIndex((idx + 1) % options.length, true);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                selectIndex((idx - 1 + options.length) % options.length, true);
              } else if (event.key === "Home") {
                event.preventDefault();
                selectIndex(0, true);
              } else if (event.key === "End") {
                event.preventDefault();
                selectIndex(options.length - 1, true);
              }
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function StudioHelpDisclosure({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div ref={rootRef} className="help-contents">
      <button
        type="button"
        className="help-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        <span>{label}</span>
      </button>
      {open ? (
        <div id={panelId} className="help-drawer">
          {text}
        </div>
      ) : null}
    </div>
  );
}
