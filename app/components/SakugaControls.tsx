"use client";

import { useEffect, useImperativeHandle, useRef, type ReactNode } from "react";
import type {
  SakugaButtonElement,
  SakugaInputElement,
  SakugaProgressElement,
  SakugaRadioElement,
  SakugaTabsElement,
} from "@/types/sakuga";

export interface SakugaButtonHandle {
  done: (hold?: number) => void;
  impact: () => void;
}

export function SakugaButton({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className,
  onClick,
  buttonRef,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  buttonRef?: React.Ref<SakugaButtonHandle>;
}) {
  const elRef = useRef<SakugaButtonElement | null>(null);

  useImperativeHandle(buttonRef, () => ({
    done: (hold = 1.8) => elRef.current?.done?.(hold),
    impact: () => elRef.current?.impact?.(),
  }));

  useEffect(() => {
    const el = elRef.current;
    if (!el || !onClick) return;
    const handleClick = () => {
      if (el.disabled) return;
      onClick();
    };
    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [onClick]);

  return (
    <sakuga-button
      ref={elRef}
      variant={variant === "secondary" ? "secondary" : undefined}
      type={type}
      disabled={disabled || undefined}
      className={className}
    >
      {children}
    </sakuga-button>
  );
}

export function SakugaProgress({
  value,
  label,
  doneLabel = "Selesai ✓",
  className,
}: {
  value: number;
  label: string;
  doneLabel?: string;
  className?: string;
}) {
  const elRef = useRef<SakugaProgressElement | null>(null);
  const clamped = Math.max(0, Math.min(1, value));
  const initializedRef = useRef(false);

  useEffect(() => {
    const apply = () => {
      const el = elRef.current;
      if (!el) return;
      if (typeof el.set === "function") {
        el.set(clamped, !initializedRef.current && clamped > 0);
        initializedRef.current = true;
      } else {
        el.setAttribute("value", String(clamped));
      }
    };
    apply();
    if (typeof customElements !== "undefined" && !customElements.get("sakuga-progress")) {
      void customElements.whenDefined("sakuga-progress").then(apply);
    }
  }, [clamped]);

  return (
    <sakuga-progress
      ref={elRef}
      label={label}
      done-label={doneLabel}
      className={className}
    />
  );
}

export interface TabOption {
  value: string;
  label: string;
}

export function SakugaTabs({
  label,
  options,
  selected,
  onChange,
  className,
}: {
  label: string;
  options: TabOption[];
  selected: number;
  onChange: (index: number, value: string) => void;
  className?: string;
}) {
  const elRef = useRef<SakugaTabsElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number; value: string }>).detail;
      if (detail) onChange(detail.index, detail.value);
    };
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, [onChange]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if ("selected" in el && typeof el.selected === "number" && el.selected !== selected) {
      el.selected = selected;
    }
  }, [selected]);

  return (
    <sakuga-tabs
      ref={elRef}
      label={label}
      selected={String(selected)}
      className={className}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </sakuga-tabs>
  );
}

export function SakugaRadio({
  label,
  name,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  name: string;
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const elRef = useRef<SakugaRadioElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handler = () => {
      onChange(el.value);
    };
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, [onChange]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (el.value !== value) {
      el.value = value;
    }
  }, [value]);

  return (
    <sakuga-radio
      ref={elRef}
      label={label}
      name={name}
      value={value}
      className={className}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} selected={opt.value === value}>
          {opt.label}
        </option>
      ))}
    </sakuga-radio>
  );
}

export function SakugaInput({
  id,
  label,
  value,
  placeholder,
  disabled = false,
  autoComplete = "off",
  className,
  onValueChange,
}: {
  id?: string;
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  onValueChange: (value: string) => void;
}) {
  const elRef = useRef<SakugaInputElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handleInput = () => onValueChange(el.value);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        el.closest("form")?.requestSubmit();
      }
    };
    el.addEventListener("input", handleInput);
    el.addEventListener("change", handleInput);
    el.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("input", handleInput);
      el.removeEventListener("change", handleInput);
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [onValueChange]);

  useEffect(() => {
    const el = elRef.current;
    if (el && el.value !== value) {
      el.value = value;
    }
  }, [value]);

  return (
    <sakuga-input
      ref={elRef}
      id={id}
      label={label}
      value={value}
      placeholder={placeholder}
      autocomplete={autoComplete}
      disabled={disabled || undefined}
      className={className}
    />
  );
}

export function SakugaTooltip({
  text,
  label = "Bantuan",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  return <sakuga-tooltip text={text} label={label} className={className} />;
}
