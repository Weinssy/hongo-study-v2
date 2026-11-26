# Hongo Study v2: Design Direction (Editorial Studio Kyoto)

## Design Read

Reading this as: Japanese Kana & JLPT N5 spaced-repetition study web app for Indonesian learners, in an Editorial Kyoto Stationery (Aizome & Washi) style, dial **ENERGY 2 / RHYTHM 3 / MOTION 2**.

- **Brand Character**: Quiet, tactile precision inspired by Kyoto letterpress study ledgers and indigo-dyed (*aizome*) bookbinding. Serious enough for daily memory drill, warm enough to open every morning without visual fatigue.
- **Identity Motif**:
  1. **Shuiro Hanko Seal**: A crisp square vermilion seal mark paired with the `Hongo Study` wordmark and used sparingly at focal action moments.
  2. **Genkouyoushi Study Frame**: Subtle corner registration ticks inside active study flashcards and kana specimen tiles (never applied as a full-page background grid).

## Color System (Light & Dark Modes)

Capped at 2 core brand colors (*Aizome Indigo* and *Indigo-Ink*) + 1 deliberate accent (*Shuiro Vermilion Seal*) + neutrals. All foreground/background pairs verified >= 4.5:1 (normal text) and >= 3.0:1 (large text & non-text UI boundaries).

### Light Mode (Washi Studio)
- Page canvas: `#F7F6F2`
- Card / ledger surface: `#FFFFFF`
- Inset surface: `#ECECE6`
- Primary ink (`core 1`): `#111C33` (15.69:1 on `#F7F6F2`)
- Muted ink (`neutral`): `#49546A` (7.04:1 on `#F7F6F2`, 7.61:1 on `#FFFFFF`)
- Structural indigo (`core 2`): `#1F3A6B` (10.35:1 on `#F7F6F2`), soft tint `#EBF0F8`
- Vermilion seal (`accent`): `#BF3422` (5.21:1 on `#F7F6F2`, 5.63:1 on `#FFFFFF`; `#FFFFFF` on `#BF3422` = 5.63:1), soft tint `#FBECE9`
- Hairline border: `#D4D3CA`
- Interactive control border: `#8B8E94` (3.28:1 on `#FFFFFF`)
- Semantic success (feedback only): `#1E6B43` (6.48:1 on `#FFFFFF`), soft tint `#E8F5EE`

### Dark Mode (Sumi Studio)
- Page canvas: `#0E1117`
- Elevated surface: `#161B24`
- Inset surface: `#1F2633`
- Primary ink: `#F2F1EC` (16.71:1 on `#0E1117`)
- Muted ink: `#A8B0BF` (8.66:1 on `#0E1117`, 7.91:1 on `#161B24`)
- Structural indigo: `#7FA8F0` (7.88:1 on `#0E1117`), soft tint `#1B2840`
- Vermilion seal (`accent`): `#F06452` for text/highlights (`5.98:1` on `#0E1117`, `5.47:1` on `#161B24`), `#C93B29` for solid primary buttons (`#FFFFFF` text = `5.07:1`), soft tint `#331917`
- Hairline border: `#2B3444`
- Interactive control border: `#667287` (3.55:1 on `#161B24`)
- Semantic success (feedback only): `#54C285` (7.75:1 on `#161B24`), soft tint `#142E21`

## Typography

- **Families (max 2)**: `Plus Jakarta Sans` (Indonesian Latin UI & display) + `Noto Sans JP` (Japanese kana & N5 kanji clarity). Numbers, intervals, scores, and counts use `font-variant-numeric: tabular-nums` instead of a 3rd monospace font.
- **Body 3-Size Scale**:
  - `--text-heading`: `1.25rem` (`20px`) for `h2` / `h3` (differentiated via weight, tracking, and color)
  - `--text-body`: `1rem` (`16px`, `line-height: 1.55`) for all body prose, lists, controls, and inputs
  - `--text-sm`: `0.875rem` (`14px`, `line-height: 1.45`) for secondary captions and metadata (no `< 13px` text above the fold)
- **Exempt Architectural Scale**: Hero/page `<h1>`, navbar brand wordmark, and isolated flashcard specimen glyphs (`clamp(3.25rem, 2rem + 6vw, 5.25rem)`).
- **Case**: Sentence case across all UI labels, tabs, buttons, and table headers.

## Aura Grainy Gradient Atmosphere (Header & Opening Stage)

Per owner direction referencing `vanta.supply/vault/gradients` (`Aura` structure), the opening stage of `/` and the top workspace header band across all internal routes share a deep **Aura grainy gradient** bleeding cleanly to `y = 0` behind the borderless transparent header:

- **Chromatic Stops (aligned with Aizome & Shuiro)**:
  - Deep midnight navy base (`#050916` to `#0C1D4A`) anchoring the left/reading side (`#F4F3EE` primary text = 14.65:1 to 17.66:1, `#D3D9E6` lead text = 11.50:1 to 13.86:1).
  - Kyoto cobalt sweep (`#124EB0` to `#1E66DB`) across center-right.
  - Warm *Shuiro* burnt-vermilion highlight (`#C84220` / `#E5633A`) and soft *Washi* mist (`#D8DFEB`) glowing in the upper-right quadrant, overlaid with tileable SVG `feTurbulence` film grain (`mix-blend-mode: overlay`).
- **Purpose (R-01) & Contrast Lock (R-25)**: The gradient frames navigation and page introductions cleanly at `y = 0` while keeping flashcards, dictionary rows, quiz inputs, and dashboard metrics on solid high-contrast `var(--bg-page)` / `var(--bg-surface)` reading surfaces in both light and dark modes.

- **Why Aizome & Washi light/dark tokens + Aura stage**: Replaces generic warm beige + flat white boxes with an unmistakable Kyoto study-ledger palette. The grainy Aura header/opening stage draws atmospheric focus at `y = 0` while study cards, dictionary lists, and forms stay on solid high-contrast Washi/Sumi surfaces (`R-01`, `R-25`).
- **Why 3D card flip & CSS micro-motion over Sakuga canvas VFX**: Replaces cartoonish anime dust/Comic-Sans overlays with crisp compositor-friendly CSS transitions (`transform`, `opacity`, `cubic-bezier(0.22, 1, 0.36, 1)`), honoring `prefers-reduced-motion` while letting the study flashcard take center stage.
- **Why varied section composition (RHYTHM 3)**: Home opens with an asymmetric editorial stage + live interactive sample flashcard, followed by a full-bleed curriculum index strip, a split two-column 3-layer workflow breakdown, and a focused closing note, avoiding cloned SaaS card grids.
- **Why selective radii & elevation**: Borders (`1px` architectural hairline) carry hierarchy; soft shadow is reserved strictly for focal elevated surfaces (active study flashcard, open nav popover, toast notification). Radii step intentionally (`2px` seal/bars, `8px` controls/inputs, `12px` study panels, pill `999px` only on filter links).
- **Why workspace-first internal routes**: `/kartu`, `/belajar`, `/kuis`, and `/dashboard` open directly into the active index, flashcard deck, quiz setup, or metrics overview with zero marketing hero clutter.
