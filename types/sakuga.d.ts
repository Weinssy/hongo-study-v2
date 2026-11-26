import type { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SakugaButtonElement extends HTMLElement {
  disabled: boolean;
  impact: () => void;
  done: (hold?: number) => void;
}

export interface SakugaProgressElement extends HTMLElement {
  value: number;
  done: boolean;
  set: (n: number, instant?: boolean) => void;
  reset: () => void;
}

export interface SakugaTabsElement extends HTMLElement {
  selected: number;
  value: string;
}

export interface SakugaRadioElement extends HTMLElement {
  value: string;
  disabled: boolean;
}

export interface SakugaInputElement extends HTMLElement {
  value: string;
  disabled: boolean;
}

export interface SakugaToastElement extends HTMLElement {
  open: boolean;
  show: (text?: string) => void;
  hide: () => void;
}

export interface SakugaTooltipElement extends HTMLElement {
  open: boolean;
  show: (on?: boolean) => void;
  hide: () => void;
}

type CustomElProps<T extends HTMLElement> = DetailedHTMLProps<HTMLAttributes<T>, T> & {
  variant?: string;
  type?: string;
  disabled?: boolean;
  label?: string;
  value?: string | number;
  selected?: number | string;
  name?: string;
  placeholder?: string;
  autocomplete?: string;
  "done-label"?: string;
  duration?: number | string;
  message?: string;
  text?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "sakuga-button": CustomElProps<SakugaButtonElement>;
      "sakuga-progress": CustomElProps<SakugaProgressElement>;
      "sakuga-tabs": CustomElProps<SakugaTabsElement>;
      "sakuga-radio": CustomElProps<SakugaRadioElement>;
      "sakuga-input": CustomElProps<SakugaInputElement>;
      "sakuga-toast": CustomElProps<SakugaToastElement>;
      "sakuga-tooltip": CustomElProps<SakugaTooltipElement>;
    }
  }
}
