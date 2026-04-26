# Repository Audit Report: PhotoMontage

Date: 2026-04-26  
Scope: `index.html`, `styles.css`, `script.js`, `server.py`, and project docs.

## Executive summary

The project is a clean, small static app and is easy to run, but maintainability is currently limited by:

1. **Tight coupling of configuration and logic** in a single large `script.js` file.
2. **Lack of project automation** (no linting, formatting, tests, CI).
3. **Inconsistent documentation vs implementation** (ports, audio filename guidance).
4. **Missing accessibility and resilience patterns** (keyboard/focus support, reduced-motion fallback, error UX).

Overall maturity: **prototype / personal project**. With a few targeted refactors and tooling, it can become a maintainable production-quality front-end.

---

## Findings and recommendations

## 1) Architecture and separation of concerns

### Current state
- `script.js` mixes constants, data, DOM selection, feature classes, and bootstrap logic in one file.
- Customization data (dates, filenames, quotes) is hardcoded directly in source.

### Risk
- Every small content change requires code edits.
- Higher chance of regressions as feature count grows.

### Recommendation
- Split into modules:
  - `src/config.js` (dates, filenames, feature flags)
  - `src/features/lightbox.js`
  - `src/features/music-player.js`
  - `src/features/anniversary-counter.js`
  - `src/features/spiral-stream.js`
  - `src/main.js` (wiring/bootstrap only)
- Move editable user data into `config.json` (or JS object loaded once).

### Standards alignment
- **SOLID (Single Responsibility Principle)** for classes/modules.
- **12-factor-ish config principle**: separate config from code where practical.

---

## 2) Front-end code quality standards

### Current state
- No linting or formatting enforcement.
- Extensive console logging in runtime paths.
- A few broad `catch` usages (e.g., browser open in Python) and error handling is mostly logging.

### Recommendation
- Add dev tooling:
  - `eslint` with a modern browser config.
  - `prettier` for consistent formatting.
  - `stylelint` for CSS quality.
  - `editorconfig` and pre-commit hooks (`lint-staged` + `husky`).
- Introduce `DEBUG` flag or logger utility to gate noisy logs.

### Standards alignment
- JavaScript style: **Airbnb / StandardJS / ESLint recommended rules**.
- Formatting consistency: **Prettier convention**.

---

## 3) Testing strategy (currently absent)

### Current state
- No automated unit/integration tests.
- No regression checks for core behavior (stream creation, counters, lightbox state, music toggle).

### Recommendation
- Add fast unit tests with `vitest` or `jest` + `jsdom`:
  - `calculateTimeDifference()` edge cases.
  - `Lightbox.open/close` class toggling.
  - `MusicPlayer.toggle` icon state transitions.
- Add a minimal E2E smoke test with Playwright:
  - App loads, at least one image appears, lightbox opens/closes.

### Standards alignment
- Test pyramid and CI-based quality gates.

---

## 4) Accessibility (A11y)

### Current state
- Good semantic baseline (button element used), but:
  - Lightbox focus trap is missing.
  - No ARIA attributes for modal state.
  - No clear keyboard navigation support beyond `Escape` close.
  - Animations are heavy and no `prefers-reduced-motion` alternative.

### Recommendation
- Add modal semantics:
  - `role="dialog"`, `aria-modal="true"`, labelled title/description.
  - Focus trap and return focus to trigger on close.
- Add motion fallback:
  - CSS `@media (prefers-reduced-motion: reduce)` to minimize/disable animation.
- Add visible focus states for interactive controls.

### Standards alignment
- **WCAG 2.2 AA** expectations.

---

## 5) Performance and runtime resilience

### Current state
- Continuous stream with repeated DOM inserts/removals and long-running animation.
- Image loading failures hide elements silently.
- All image files are static and potentially large.

### Recommendation
- Add lazy strategy and bounded concurrency:
  - Keep max active nodes capped (already partly true; make explicit guard).
- Add fallback UI for failed image loads (placeholder thumbnail).
- Compress/resize images and document target dimensions.
- Consider `requestAnimationFrame` or CSS-only flow with fewer JS timers if scale increases.

### Standards alignment
- Front-end performance best practices (Core Web Vitals-minded).

---

## 6) Documentation and developer experience

### Current state
- README has inconsistent runtime details:
  - Says open on `:8001`, but server default is `8000`.
  - Music filename guidance differs across docs and HTML.
- Setup is manual for end users (edit JS lines directly).

### Recommendation
- Align docs with actual defaults and one canonical filename rule.
- Add `CONTRIBUTING.md` with:
  - local setup
  - lint/test commands
  - coding conventions
- Add an explicit customization section via one config file instead of "edit line X" guidance.

---

## 7) Python server maintainability

### Current state
- `server.py` recursively retries port on bind error.
- Uses errno `48` check (macOS-specific) for "address in use".

### Recommendation
- Handle cross-platform error conditions (`EADDRINUSE`) via `errno` constants.
- Prefer iterative retry loop instead of recursion.
- Add CLI args for port (`--port`) and no-browser mode (`--no-open`).

### Standards alignment
- Cross-platform robustness, explicit error handling.

---

## Prioritized roadmap

### Quick wins (1 day)
1. Fix doc inconsistencies (port/audio filename).
2. Add ESLint + Prettier + Stylelint + npm scripts.
3. Extract runtime config (`config.js` or `config.json`) from `script.js`.

### Short term (2–4 days)
1. Modularize JS features into separate files.
2. Add unit tests for pure logic and DOM state transitions.
3. Add basic GitHub Actions CI (lint + unit tests).

### Medium term (1–2 weeks)
1. Accessibility hardening (focus trap, ARIA, reduced motion).
2. Performance pass (image sizing guide + load fallback + metrics).
3. Improve server CLI and portability handling.

---

## Proposed target structure

```text
PhotoMontage/
├── index.html
├── src/
│   ├── main.js
│   ├── config.js
│   └── features/
│       ├── spiral-stream.js
│       ├── lightbox.js
│       ├── anniversary-counter.js
│       └── music-player.js
├── styles/
│   ├── base.css
│   ├── components.css
│   └── animations.css
├── tests/
│   ├── unit/
│   └── e2e/
├── server.py
├── package.json
├── .eslintrc.cjs
├── .prettierrc
├── .stylelintrc.cjs
├── CONTRIBUTING.md
└── README.md
```

---

## Suggested engineering standards to adopt

- **Versioning**: Semantic Versioning (SemVer).
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`).
- **Quality gates in CI**:
  - Lint must pass.
  - Unit tests must pass.
  - Optional E2E smoke on PR.
- **Security hygiene**:
  - Dependabot (if npm introduced).
  - Pin and regularly update tooling dependencies.

---

## Conclusion

The codebase is a strong visual prototype with clear feature intent. The fastest path to simplicity and maintainability is to **externalize config**, **modularize by feature**, and **add lint/test/CI guardrails**. Those changes reduce cognitive load, make edits safer, and align the project with mainstream engineering standards.
