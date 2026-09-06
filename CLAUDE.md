# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A self-contained, static HTML slide-deck course: **"Backend with AI — Laravel E-commerce Mastery"** (Arabic-language, RTL). 48 lectures across 14 modules teach Laravel 12 by building one running project, **SouqPro** (an e-commerce store), from scratch to production deployment. There is no build system, no dependencies, no server — every lecture is a single standalone `.html` file with inlined CSS/JS, opened directly in a browser.

`index.html` is the course landing page listing/linking every lecture card by module.

## Repository layout

- `index.html` — landing page with the module/lecture grid, links to every lecture file.
- `lectures/general/lecture-00-intro.html` — course intro deck.
- `lectures/module-01/` … `lectures/module-14/` — one folder per module; each contains that module's lecture decks (`lecture-NN.html`, numbered globally 01–46 across all modules).
- `assets/` — shared images (referenced from `module-01` as `../../assets/...`).
- `files/` — planning/reference docs, not shipped to students:
  - `SouqPro.md` — the full 48-lecture curriculum outline (topics, timing, per-lecture bullet points) for all 14 modules.
  - `lecture-template-system.md` — the narrative/content template mined from the existing lectures (slide sequence, tone, how content must always tie back to SouqPro). **Read this before writing lecture content.**
  - `presentation-style-guide.md` — the binding HTML/CSS/JS structural spec for every slide deck (exact class names, required behaviors, common bugs). **Read this before touching any lecture's markup.**
  - `remaining-modules-05-14-execution-map.md` — the production plan for modules 5–14, phased and mapped to what's already built in 1–4.

## Current state of the content

- **Modules 1–4 (lectures 01–19)** are fully built reference decks (~2500–2900 lines each) — these define the actual visual/narrative standard.
- **Modules 5–14 (lectures 20–46)** currently exist only as thin placeholder stubs (~450–500 lines: hero shell + title, no real slide content yet). Building these out is the main ongoing task, and `files/remaining-modules-05-14-execution-map.md` is the execution plan for doing so in order (module 5 → module 14), since each module assumes the SouqPro project state left by the previous one.

There is no test suite, linter, or build/run command — validate work by opening the `.html` file in a browser.

## Authoring a lecture (the required workflow)

Before generating or editing any lecture slide content:

1. Read `files/lecture-template-system.md` for the narrative template — slide sequence (Hero → Agenda/Plan → Concept → Code → SouqPro application → Best Practice/Avoid → Homework → Closing), title/description phrasing rules, and code-snippet rules (short, pattern-focused, never full files).
2. Read `files/presentation-style-guide.md` for the mandatory structural/CSS/JS contract (see below).
3. Cross-check the target lecture's scope against `files/SouqPro.md` (topic bullets) and `files/remaining-modules-05-14-execution-map.md` (what that specific lecture must produce and how it connects to neighboring lectures).
4. Every lecture must answer: what does this look like inside SouqPro (screen/route/table/model/role), and what's the practical homework proving the concept?

### Structural contract every lecture HTML must satisfy

- Fixed slide size `1060px × 596px` (16:9). Root layout: `#stage` → `.slide.active#sN` (absolute-positioned) → `.sb` (the scrollable slide body). Nav lives outside the slide in `#nav-row`.
- `.sb` must have `overflow-y: auto; min-height: 0;` — omitting `min-height: 0` on any flex/grid container (`.sb`, `.two-col`, `.three-col`, `.tabs-wrap`, `.tab-pane`) is the #1 cause of content breaking out of the slide.
- Color tokens, fonts (`Tajawal` for text, `JetBrains Mono` for code) are defined in `:root` — reuse the existing palette (`--bg`, `--acc`, `--gn`, `--bl`, `--pu`, `--rd`, etc.), don't invent a new one per lecture.
- Every slide has a topbar (`.tb` with `.cid`, `.tag`, `.pn`) and a title (`.sh`).
- All code blocks (`.cb`, `.term-body`, `.cvl pre`, `.clcode`) must be `direction: ltr; text-align: left;` regardless of the surrounding RTL page.
- Copy buttons are required only on `.cb` and `.term-body` (real teaching code blocks) — never on `.cvl pre` (hero/cover decoration) or `.clcode` (closing decoration). Copy behavior: `navigator.clipboard.writeText` with a `textarea`+`execCommand` fallback, strip `.copy-btn`/`.cb-label` text before copying, icon/text flips to "تم النسخ" for ~1.6s.
- The cover slide (`#s1`, `flex-direction: row`, code panel `.cvl` + content `.cvr`) and the closing slide (last slide only, `flex-direction: row`, code panel `.cll` + content `.clr`, vertically centered) styles must be scoped to their **exact** slide IDs — a past recurring bug was closing-slide CSS leaking onto the homework slide because the ID was off by one.
- JS footer must define `const N = <slide count>` matching the real slide count, a `go()` navigator, dot generation into `#dots`, keyboard arrow support, `scaleStage()` + resize handler if `#scale-wrap` responsive scaling is used, and `initCopyButtons()` called once at the end.
- Full pre-flight checklist before considering a lecture "done" is in `presentation-style-guide.md` §11.

### When editing an existing lecture

Don't change visual style without a reason. If fixing a layout bug, fix only what's actually broken (missing `min-height: 0`, wrong slide-ID scoping, etc.) rather than restyling. Any generally-applicable fix (copy button behavior, LTR code, scroll behavior) should be applied consistently across lectures rather than one-off.
