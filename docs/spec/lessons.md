# Lessons Module — Specification

**Status:** Draft v0.2 (core decisions locked 2026-07-15) · **Branch:** `rewrite/spec-driven` · **Supersedes:** the vibecoded lessons (`docs/architecture-as-built.md` §4)

> Defines the student-facing **Lessons** subsystem for the rewrite. It keeps what worked
> in the as-built version, fixes its known gaps, and flags the product decisions (§9)
> that must be locked before/while building. Descriptive requirements, not implementation.

## 1. Purpose & scope

Teach sholat (prayer) — and closely related basics — to junior SLB students through
short, highly visual, interactive slide lessons with light, non-punitive quizzing.

- **In scope:** lesson catalog, the slide/quiz player, the three quiz interactions, the
  content model, character/gender art, lesson-level accessibility.
- **Out of scope (other specs):** IoT movement detection & rapor, teacher/admin tooling,
  authentication, the marketing/home shell.

## 2. Users & context

**Positioning:** the LMS is a **teacher-facilitated classroom aid shown on a shared screen**
(e.g. a big TV) — support for the teacher's live instruction, *not* a standalone self-teaching
app. The teacher remains the primary instructor and bridges the edges (explanation, pacing,
sign for deaf students); the app is the clear, engaging, correct-enough visual anchor. This
lowers the "app must be perfect/autonomous" bar and shapes the interaction model below.

- **Primary — students:** junior-age, deaf/hard-of-hearing **and/or** tunagrahita
  (intellectual disability). These design implications are hard requirements:
  - ≤2 short, simple Indonesian sentences per screen.
  - Visual-first: every concept carried by image/icon/character, not words alone.
  - **Fully operable without sound** (deaf audience) — no information may depend on audio.
  - Large targets sized for the shared screen & viewing distance (≥48px min), generous
    spacing, one primary action per screen.
  - Gentle, encouraging feedback; never punitive; no time pressure.
  - Predictable, consistent layout and navigation across every lesson.
- **Secondary — guru (facilitator):** often seated with the student; may want to
  see/track progress (→ §6 decision).
- **Devices / interaction model:** primarily a **shared large screen (TV)** the teacher drives
  while the class watches and participates — **not** one tablet per child. Input is
  **teacher-facilitated / one-student-at-a-time**; size UI for room viewing-distance. Modest
  hardware; variable wifi.

## 3. Goals & non-goals

- **Goals:** comprehension of prayer steps, names, order, and recitations; sustained
  engagement; accessibility for the target audience; **religious correctness** of content.
- **Non-goals (this module):** pose/movement scoring (IoT), account management, in-app
  content authoring (unless §9-D3 says otherwise), audio narration.

## 4. Functional requirements

### 4.1 Content model
- A **Lesson** = ordered list of **Slides**. A Slide is one of:
  - **ContentSlide** — one illustration + mascot + ≤2 short sentences.
  - **QuizSlide** — of type `image-choice`, `matching-line`, or `sort-order`.
- A QuizSlide may reference a related ContentSlide (for "re-teach on repeated failure").
- **Religious-correctness requirements** (regressions the as-built fixed — keep them):
  - Movement order complete, incl. **duduk di antara dua sujud** and the **second sujud**.
  - Recitations complete (e.g. "Subhaana Rabbiyal 'Azhiimi **wa bihamdih**").
  - Illustrations depict correct posture/orientation (e.g. imam/makmum facing correctly).
- Content is authored as **static, typed files in the repo** (D3) — versioned in git, no
  runtime backend; only developers edit lessons.
- Each ContentSlide **reserves optional fields** for a future per-slide **sign-language
  (SIBI/isyarat) video + caption text** (D2) — unused for now, but present so adding them
  later needs no content reshape.

### 4.2 Lesson catalog (list)
- Shows each lesson: title, one-line description, icon, and — if progress is tracked
  (§6) — a completion/stars indicator.
- Character/gender selector (see §4.6).
- The catalog must reflect the **real** lessons (fix the as-built home cards that
  advertised non-existent topics like "Huruf Hijaiyah / Wudhu").

### 4.3 Player behavior
- Linear forward/back navigation with a visible progress indicator.
- **Quiz attempt loop:** a small max number of tries (as-built: 3). On exhaustion → jump
  to the related ContentSlide in **re-teach mode** (gentle "let's look again" framing;
  the progress indicator is **held, not regressed** — review is a supportive detour, not a
  setback; re-teach button reads simply, e.g. "Ayo Coba Lagi!") → one **final retry**.
  If the final retry is correct → normal correct feedback; if still wrong → an
  **effort-celebration** beat ("Sudah Berusaha", participation ★) — **never** another
  "belum tepat" (that would read as a dead-end). No dead-ends; the student always progresses.
- **Mascot emotion (hard rule):** the mascot is **never disappointed/sad**. Defined states:
  *encourage* on "not yet", *guide/teach* on re-teach, *celebrate* on correct/effort.
- **Scoring (D6):** 1–3 stars from the lesson's quiz-score % (≥80% → 3, ≥50% → 2, else 1;
  floor 1 star). Each quiz weights **solved on any attempt = 1.0**, **never solved = 0.5**
  (effort — never zero); lesson % = Σ(quiz weight) ÷ quiz count. Stars are a whole-lesson
  tally, not a per-quiz badge.
- **Feedback semantics (non-punitive palette):** green = correct, amber = "not yet"
  (never alarming red), teal = active/selected. Hints appear prominently on a wrong
  answer (in the feedback modal, not only a top banner that can scroll out of view).
- **Completion screen:** stars + encouragement + return to catalog.

### 4.4 Quiz interactions (each must be fully operable by touch, visual-only)
- **image-choice** — pick the correct picture among 2–4 large options.
- **matching-line** — link left items (pictures) to right items (labels); pairing shown
  by an explicit visual connector + shared color (plus a numeric badge where a line can't
  be drawn, e.g. stacked mobile).
- **sort-order** — arrange step cards into the correct sequence; validate on submit.
- Option/position order is shuffled so location isn't a cue.

### 4.5 Accessibility (hard requirements)
- Text load ≤2 short sentences/screen; simple language.
- Color is never the sole carrier of meaning (pair with icon/shape/text).
- Touch targets ≥48px; no hover-only affordances.
- Respect `prefers-reduced-motion` (idle/celebration animations opt out).
- No timed disappearance of information the student needs to read.
- **Sign-language / captions (D2 — reserved, not built now):** the content model (§4.1)
  reserves per-slide isyarat-video + caption fields so this can be added later without
  reshaping content. The home page's SIBI/subtitle promise is deferred, not dropped.

### 4.6 Character & gender art
- Illustrations consistently depict a single coherent character set.
- Gender-adaptive art (male/female sets) is selectable, with graceful fallback when a
  variant asset is missing.
- **Selection source (D4 → local per-device toggle):** matches D1. Persist the choice
  behind the same storage interface as progress (§6) so a later move to a student-profile
  source is a drop-in change.

## 5. Primary flows
1. **Learn:** Catalog → open lesson → step through slides/quizzes → completion → back.
2. **Struggle → support:** wrong answer → gentle feedback + hint → retry; after N fails →
   re-teach slide → final retry → continue with partial credit.
3. **(If §6)** progress/stars persist and show on the catalog next visit.

## 6. Data & persistence — **D1 → local now, upgrade-ready**
- **Now:** persist per-lesson progress + stars in **`localStorage`** (per device). Survives
  reloads; no login or identity step.
- **Design constraint:** represent progress as a serializable record keyed by lesson id
  (e.g. `{ lessonId, completed, stars, quizResults }`) behind a small storage interface, so
  switching later to **Supabase-per-student** (student picker + `imams` link, feeding the
  rapor) is an adapter swap — not a data-model rewrite.
- **Not now:** no student identity, no server writes, no teacher-facing progress view.

## 7. Non-functional
- Fast on modest tablets; fully responsive (portrait-tablet first).
- Core lesson flow has **no hard external-service dependency at runtime** (works even if
  Supabase/Cloudinary are down) — unless D1=(c), where saving is best-effort/deferred.
- Assets optimized; no layout shift; no external fonts/CDNs at runtime.

## 8. Explicitly out of scope / future
Audio narration/TTS; analytics dashboards; in-app authoring UI (unless D3); cross-device
sync beyond D1=(c).

## 9. Decisions (locked 2026-07-15; D6 added 2026-07-18)
| ID | Decision | Choice |
|----|----------|--------|
| **D1** | Progress persistence & identity | **Local now, upgrade-ready** — localStorage progress/stars; model designed so per-student Supabase saving can be added later without rework |
| **D2** | Sign-language video + captions | **Reserve, add later** — not built now; content model reserves per-slide isyarat-video + caption fields |
| **D3** | Content authoring | **Static in code** — typed content files, versioned in git |
| **D4** | Gender-art source | **Local per-device toggle** (follows D1) |
| **D5** | Lesson topic scope | **Keep + correct** the sholat lessons; align the catalog to reality |
| **D6** | Quiz scoring weight | **Solved (any attempt) = 1.0, never solved = 0.5 (effort)**; lesson % = Σ ÷ quiz count → stars (≥80→3, ≥50→2, else 1; floor 1). A "never solved" quiz still shows the "Sudah Berusaha" effort ★ |

## 10. Baseline to preserve
The as-built mechanics (`docs/architecture-as-built.md` §4) are the functional starting
point: keep the player state machine, the three quiz types, the attempt/review/scoring
loop, the gentle-feedback palette, and the gender-art fallback — re-implemented cleanly
(typed, lint-clean, no setState-in-render/effect debt).
