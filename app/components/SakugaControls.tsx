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
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useImperativeHandle(buttonRef, () => ({
    done: (hold = 1.8) => elRef.current?.done?.(hold),
    impact: () => elRef.current?.impact?.(),
  }));

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handleClick = () => {
      if (el.disabled) return;
      onClickRef.current?.();
    };
    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (disabled) el.setAttribute("disabled", "");
    else el.removeAttribute("disabled");
  }, [disabled]);

  return (
    <sakuga-button
      ref={elRef}
      variant={variant === "secondary" ? "secondary" : undefined}
      type={type}
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
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number; value: string }>).detail;
      if (detail) onChangeRef.current(detail.index, detail.value);
    };
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const apply = () => {
      const el = elRef.current;
      if (!el) return;
      if (typeof customElements !== "undefined" && customElements.get("sakuga-tabs")) {
        if (el.selected !== selected) el.selected = selected;
      } else {
        el.setAttribute("selected", String(selected));
      }
    };
    apply();
    if (typeof customElements !== "undefined" && !customElements.get("sakuga-tabs")) {
      void customElements.whenDefined("sakuga-tabs").then(apply);
    }
  }, [selected]);

  return (
    <sakuga-tabs ref={elRef} label={label} className={className}>
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
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handler = () => {
      onChangeRef.current(el.value);
    };
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const apply = () => {
      const el = elRef.current;
      if (!el) return;
      if (typeof customElements !== "undefined" && customElements.get("sakuga-radio")) {
        if (el.value !== value) el.value = value;
      } else {
        el.setAttribute("value", value);
      }
    };
    apply();
    if (typeof customElements !== "undefined" && !customElements.get("sakuga-radio")) {
      void customElements.whenDefined("sakuga-radio").then(apply);
    }
  }, [value]);

  return (
    <sakuga-radio ref={elRef} label={label} name={name} className={className}>
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
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const handleInput = () => onValueChangeRef.current(el.value);
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
  }, []);

  useEffect(() => {
    const apply = () => {
      const el = elRef.current;
      if (!el) return;
      if (typeof customElements !== "undefined" && customElements.get("sakuga-input")) {
        if (el.value !== value) el.value = value;
      } else {
        el.setAttribute("value", value);
      }
    };
    apply();
    if (typeof customElements !== "undefined" && !customElements.get("sakuga-input")) {
      void customElements.whenDefined("sakuga-input").then(apply);
    }
  }, [value]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (disabled) el.setAttribute("disabled", "");
    else el.removeAttribute("disabled");
  }, [disabled]);

  return (
    <sakuga-input
      ref={elRef}
      id={id}
      label={label}
      placeholder={placeholder}
      autocomplete={autoComplete}
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
