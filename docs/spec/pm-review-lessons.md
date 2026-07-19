# PM Specification Review — Lessons Subsystem

**Reviewer:** Product Manager (EdTech / inclusive products)
**Artifacts under review:** `docs/spec/lessons.md` (primary), `CLAUDE.md` (architecture/IoT contract), `docs/architecture-as-built.md` (supporting)
**Context:** Spec-driven clean rewrite on `rewrite/spec-driven`; `src/` cleared to `globals.css` + `favicon.ico`; old code preserved on `vibecode-reference` / `main` @ `8c93372`. Team: 1–2 devs, ~4-month PKM timeline. Lessons first, IoT second.
**Date:** 2026-07-15 · **Verdict:** Conditionally ready — engine is low-risk, but **4 blockers** must clear before code/content start.

---

## 1. Executive Summary

- **The engine is the easy part; content, art, and religious sign-off are the real schedule risk.** The player, three quiz types, attempt loop, and scoring are a clean re-implementation of *already-proven* as-built mechanics — very achievable for 1–2 devs in weeks. What can sink the PKM timeline is illustrations, correct religious content, and reading-level Indonesian copy. De-risk those in week 1 (placeholders + one "golden" lesson) or the engine will have nothing real to show.
- **Four blockers must clear before writing lesson code / authoring content:** (B1) the specs never declare a **single primary user** — the brief says tunagrahita-first, the spec treats deaf + tunagrahita as co-primary; (B2) there is **no field-level TypeScript content schema**, and both authoring *and* the player block on it; (B3) **no religious-correctness reviewer is named** and no canonical "correct sholat" reference exists (a faith product cannot ship unreviewed content); (B4) **no lesson-art / placeholder strategy** exists, so lessons cannot render.
- **All 5 locked decisions (D1–D5) are correctly locked — keep them all** — but two carry open dependencies: D1 (local-per-device) needs the **shared-classroom-tablet usage model validated** (progress collides when several students share one device), and D5 needs someone to produce the **definitive corrected lesson list**. (Note: the role brief references "9 decisions"; §9 actually holds 5 — assessed below.)
- **The "adapter swap to Supabase" promise (D1) will not hold as written.** The intent is right, but the interface must be **async from day one** and must **reserve a `studentId` dimension now**; otherwise the localStorage→Supabase move is a data-model change and call-site rewrite, not an adapter swap.
- **The IoT contract is implementation-ready — clearer than the lessons spec** — but do **not** build it in full parallel on a 1–2 person team. Ship a small, time-boxed `GET /api/iot/status` spike after the lesson engine is stable, and settle **`/rapor` authentication** (currently unauthenticated minors' PII) *before* the rapor rewrite, not after.

---

## 2. Spec Completeness Audit (Task 1)

### Clearly defined — ready to build 🟢
- **Player behavior & attempt loop** (`lessons.md` §4.3): 3 tries → jump to related ContentSlide to re-teach → one final retry → partial credit → continue. No dead-ends. Precise and testable.
- **Scoring thresholds** (§4.3): ≥80% → 3★, ≥50% → 2★, else 1★, always ≥1. Clear (but see partial-credit gap below).
- **Non-punitive feedback palette** (§4.3): green = correct, amber = "not yet", teal = active; never red; hint in the feedback modal, not a scroll-away banner. Well-specified.
- **Accessibility hard rules** (§4.5): ≤2 sentences, ≥48px targets, no audio dependency, `prefers-reduced-motion`, no timed disappearance. Clear.
- **The IoT contract** (`CLAUDE.md` "IoT ingestion contract"): pull-based lifecycle, 3 endpoints, `x-api-key` auth, FIFO PENDING→ACTIVE handoff, one-active-session partial-unique index, atomic `selesaikan_sesi_sholat` RPC, and the sanitization rules. The most complete part of the whole spec set.

### Ambiguous / missing 🔴🟡
- 🔴 **No field-level content schema.** §4.1 describes ContentSlide/QuizSlide *conceptually* but pins no fields (ids, `body`, `imageId`, `hint`, `options[]`, `pairs[]`, `correctOrder[]`, `relatedSlide`, reserved sign fields). The spec deliberately stays "descriptive," but for a spec-driven rewrite the **data contract is the one implementation artifact both authoring and the player depend on**. → **Write `types/lesson.ts`** by extracting/cleaning the as-built `types/module.ts` (on `vibecode-reference`) before any authoring or player work. *(Blocker B2.)*
- 🟡 **Partial credit is unquantified.** §4.3 says a re-taught-then-passed question earns "partial credit" but never states the fraction, the denominator (quiz *slides* vs *questions*), or whether a correct answer on attempt 2/3 (before re-teach) is full or reduced credit. This silently determines the star math. → **PM to lock:** full credit for any correct answer within the initial attempt loop; a fixed fraction (recommend **0.5**) only for the post-re-teach final retry; denominator = total quiz questions; add a worked example to §4.3.
- 🟡 **Quiz interaction mechanics unspecified for the two hard types.** §4.4 does not say *how* a student forms a matching pair or reorders sort cards. Free-drag is motor-flaky and cognitively heavy for the primary audience. → **Specify:** matching-line = tap-source-then-tap-target (no drag); sort-order = tap-to-place / up-down controls (no free-drag-only).
- 🟡 **Lesson list not enumerated.** D5 says "keep + correct the sholat lessons" but no doc lists the *actual* lessons (titles, objectives, slide counts). Authoring cannot start without it. → **Content/PM produce the definitive lesson list** (see §5).
- 🟡 **No copy style guide.** "≤2 short simple Indonesian sentences" has no word cap, vocabulary constraint, or voice/tense rule, and no owner for the actual strings. → **Produce a 1-page copy guide** (e.g. ≤8 words/sentence, imperative voice, no compound clauses) and an authoring lint check.
- 🔴 **No art inventory or placeholder strategy.** Every ContentSlide needs an illustration + gender variants (§4.6); none exist and no naming convention/fallback detail is defined. → Define the placeholder system + inventory now. *(Blocker B4.)*
- 🔴 **No religious-review owner or canonical reference.** §4.1 names specific must-haves (duduk di antara dua sujud, second sujud, "wa bihamdih", correct imam/makmum orientation) — good awareness — but there is no exhaustive correct-sholat reference and no named sign-off gate. *(Blocker B3.)*

### Assumptions baked in that need validation ⚠️
- **Shared-device progress model (D1).** "Per device" localStorage is meaningless if multiple students share one classroom tablet in rotation — student B silently overwrites student A's stars. → **Validate the real usage model** (1 tablet : 1 student per session, or rotating). If shared, add a lightweight local "who's using this" picker or explicitly accept that progress is ephemeral/demo-only.
- **Lesson art is local, not Cloudinary.** §7 promises the core flow "works even if Supabase/Cloudinary are down" and "no external CDNs at runtime" — this **implies lesson illustrations ship in `/public`**, while the as-built used Cloudinary for media. Latent conflict. → **State explicitly:** lesson art is bundled in `/public`; Cloudinary is IoT-rapor-only.
- **As-built mechanics are the right baseline (§10).** Safe *except* the lint debt (RNG-in-render, setState-in-effect) must not be carried — the spec acknowledges this; enforce it (see §7).

### Contradictions between CLAUDE.md and lessons.md
- 🔴 **Primary-audience framing conflicts.** The PM brief says **tunagrahita = PRIMARY, tunarungu = SECONDARY**; `CLAUDE.md` leads with "deaf/hard-of-hearing students"; `lessons.md` §2 treats them as co-primary ("deaf **and/or** tunagrahita"), with no tie-break. These audiences have partly competing needs (deaf → sign-language/captions; tunagrahita → cognitive minimalism, fewer choices, no text-reliance). Without a declared primary, design trade-offs (esp. matching-line's text labels) resolve inconsistently. *(Blocker B1.)*
- 🟢 **Persistence, catalog-fiction, and audio** are *intentional supersedes*, not contradictions: the rewrite fixes as-built's "console.log-only" persistence (D1), the fictional "Huruf Hijaiyah/Wudhu" home cards (D5/§4.2), and keeps audio a non-goal (consistent with "operable without sound" + D2 sign-language-later). No conflict.

---

## 3. Tunagrahita-First Validation (Task 2)

| # | Hard requirement | Status | Evidence · Gap · Concrete next step |
|---|---|---|---|
| 1 | ≤2 short sentences / screen | ✅ Covered | §2 + §4.5 state it explicitly. **Strengthen:** add a hard word cap (≤8 words/sentence) + an authoring lint check so it's enforced, not aspirational. |
| 2 | Visual-first (image for every concept) | ⚠️ Partial | ✅ for ContentSlides (§4.1: one illustration each) and image-choice. ❌ **matching-line pairs pictures to text *labels* (§4.4)** — that is a reading task, which undercuts visual-first for low-literacy tunagrahita. **Next step:** add an icon to every label, or use picture-to-picture/icon matching. |
| 3 | Fully operable without sound | ✅ Covered | §2 + §3 (audio = non-goal) + §4.5 ("no information may depend on audio"). Strong. |
| 4 | Large touch targets ≥48px | ✅ Covered | §2 + §4.5 explicit ≥48px, "no hover-only affordances." Add to DoD as a measured check. |
| 5 | Gentle, non-punitive feedback (never red/alarming) | ✅ Covered | §4.3 palette green/amber/teal, "never alarming red," hint in modal. Best-specified requirement in the doc. |
| 6 | No time pressure anywhere | ✅ Covered | §2 ("no time pressure") + §4.5 ("no timed disappearance of information"). |
| 7 | Predictable, consistent layout | ⚠️ Partial | §2 asserts it, but there is **no canonical slide-frame wireframe** defining fixed regions (title / illustration / text / primary CTA / nav / progress). "Consistent" isn't testable without a reference. **Next step:** add a slide-frame layout spec + shared layout component. |
| 8 | One primary action per screen | ⚠️ Partial | §2 states it, but quiz slides carry options + submit + back + hint — "one *primary* action" needs a **visual-hierarchy rule** (options = interaction; a single emphasized CTA "Lanjut/Periksa"; back is de-emphasized). **Next step:** codify the hierarchy rule in the layout spec. |
| 9 | No dead-ends — always progress | ✅ Covered | §4.3 ("No dead-ends") + §5 flow 2 (wrong → hint → retry → re-teach → final retry → continue w/ partial credit). Strongest flow in the spec; verify by forcing all-wrong answers (DoD). |

**Summary:** 6 ✅, 3 ⚠️. No ❌ at the requirement level — the spec's *intent* is genuinely tunagrahita-aware. The three ⚠️ are (2) matching-line text labels, (7) missing layout template, (8) missing primary-action hierarchy rule — all cheap to fix and all feeding the blocker/action list.

---

## 4. Scope Validation (Task 3)

**Is the lesson subsystem realistic for ~4 months / 1–2 devs?**
🟢 **Yes for the engine, 🟡 conditional on content/art.** Re-implementing known-good mechanics is low-risk engineering — realistically ~4–6 weeks to a demoable engine. The schedule risk is *not code*; it's the illustration pipeline, religiously-correct content, and reading-level copy. **Mitigation:** decouple engine from content with placeholder assets + one golden lesson so engineering never waits on art.

**Minimum viable lesson (proves the concept):**
One complete lesson, ~8 slides — ~5 ContentSlides + 3 QuizSlides (**one of each type**) — with at least one quiz wired to a `relatedSlide` so the re-teach → final-retry → partial-credit loop is exercised, ending in the stars/completion screen. Natural choice: **"Gerakan Sholat"** (the movement sequence), since the religious-correctness requirements (movement order) live there. One lesson end-to-end beats five half-lessons.

**Which quiz type first — and why:**
**Build `image-choice` first.**
1. Simplest interaction (single tap = answer) → lowest engineering, motor, and cognitive load.
2. Purest visual-first (no text-label reading) → best fit for the tunagrahita PRIMARY audience.
3. It's the **reusable primitive**: the feedback modal, shuffle util, attempt loop, and scoring all get built and proven here, then reused by the other two.
4. Fastest route to a demoable slice.
Then **`sort-order`** (single-list ordering, moderate), then **`matching-line`** last (SVG connectors + stacked-mobile fallback + pairing state + the text-label visual-first fix = most complex).

**Are the 5 decisions in §9 correctly locked?** *(The brief says "9"; §9 contains 5 — D1–D5.)* — **All 5 correctly locked; none should be reversed.**

| ID | Decision | Verdict | Note |
|---|---|---|---|
| D1 | Local now, upgrade-ready | ✅ Keep | Right for the timeline (no auth cost). **Open dependency:** validate shared-device usage model; make the interface async + reserve `studentId` (see §7) or "upgrade-ready" is nominal. |
| D2 | Sign-language reserved | ✅ Keep | Building it now would blow the timeline with no asset source. **Condition:** the reserved fields must actually exist in `types/lesson.ts` (B2), or D2 is only nominal. |
| D3 | Static in code | ✅ Keep | Correct for a dev-only, git-versioned, no-backend model. Accept that content edits need a dev + redeploy (fine for PKM). |
| D4 | Local per-device gender toggle | ✅ Keep | Follows D1, low cost. Same shared-device caveat as D1 but low-stakes. |
| D5 | Keep + correct sholat lessons | ✅ Keep | Reuse proven topics, kill the fictional catalog cards. **Open dependency:** someone must produce the corrected lesson list (§5) — the lock is fine, the input is missing. |

---

## 5. Content Readiness (Task 4)

**Is §4.1 complete enough to start authoring?**
⚠️ **Conceptually yes, structurally no.** Authors cannot write typed content files against prose. → **First deliverable is `types/lesson.ts`** (extract + clean from as-built `types/module.ts`), including reserved D2 sign fields and — recommended — **id-based** `relatedSlide` references (index-based references from the as-built break when slides are reordered during authoring). *(Blocker B2.)*

**Minimum content for a working demo:**
- **1 fully authored golden lesson** ("Gerakan Sholat"), ~8 slides, all 3 quiz types, one re-teach path wired.
- **Catalog with ≥3 cards** (1 authored + 2 "Segera hadir/coming-soon" placeholders) so the catalog looks real without full content.
- For a richer stakeholder demo: **2–3** authored lessons.

**Are the religious-correctness requirements specific enough?**
❌ **Not without a domain expert.** The named must-haves are a good *checklist* but are illustrative, not exhaustive — the full ordered step sequence and complete recitation texts are not enumerated, and no qualified reviewer is named. For a faith-education product this is reputationally critical. **Next step (Blocker B3):** (1) name a reviewer (guru agama / ustadz); (2) produce a canonical **"Correct Sholat Reference"** (full ordered steps + full recitations: Arabic + transliteration + Indonesian) that authors copy from verbatim; (3) add a per-lesson **sign-off gate** and a visible **"DRAFT — not religiously reviewed"** flag that must be cleared before any lesson is demoed as final.

**Placeholder / dummy content strategy:**
- **Grey-box placeholder illustrations** — labeled with the pose name, at the *correct* aspect ratio + final naming convention (`/images/modul/{male,female}/…` per as-built) — so layout is real and swapping in final art is a data-only change.
- **Real short Indonesian strings** (not lorem) that respect the ≤2-sentence rule, to test text-fit for real.
- **One golden real lesson** to validate the full pipeline while the rest stay placeholder.
- Keep everything behind the schema so final art/copy is a drop-in; never demo a DRAFT-flagged lesson as final.

---

## 6. IoT Integration (Task 5)

**Is the IoT contract clear enough to implement?**
🟢 **Yes — clearer than the lessons spec.** `CLAUDE.md` fully specifies the pull-based lifecycle, all 3 endpoints, `x-api-key` auth (401/500), the FIFO PENDING→ACTIVE handoff, the ≤1-non-terminal-session partial-unique index, the atomic `selesaikan_sesi_sholat` RPC, and the sanitization rules (`parseNumeric`, `isInvalidEntry/Exit`, `exit_reason`, `urutan` as the authoritative sort key). Real Pi client exists in sibling repo `../cv`.
🟡 **Gaps to close in the rewrite:** exact request/response JSON bodies live in the as-built `src/types/iot.ts` + route files (re-extract them); DB schema/RPC live in two manually-applied migration SQL files (document apply order: `migration.sql` then `-002-fixes.sql`); and `../cv` is a **live cross-repo dependency** (branch `feature/web-integration`) → coordination risk.

**Minimum IoT endpoint to build first:**
**`GET /api/iot/status`** + the "Mulai Sesi" server action (inserts a `PENDING` `sholat_sessions` row) + the `sholat_sessions` table + its partial-unique index. It's the handshake that proves the pull model, is testable with a `curl` + api-key stub, and depends on neither movement data nor Cloudinary. Then `POST /api/iot/sesi/selesai` (payload + RPC + sanitization), then `media/upload` last (the Pi doesn't even call it yet).

**Risks of building lessons + IoT in parallel (1–2 devs):**
- **Context fragmentation:** lessons (client / localStorage / no backend) and IoT (server routes / Supabase service-role / SQL migrations / live Pi contract) are entirely different stacks; splitting a 1–2 person team across both slows both.
- **Shared-foundation churn:** both need the shell/layout/Supabase client; building simultaneously risks reworking the shared base.
- **External-dependency stalls:** the `../cv` Pi/hardware can block IoT work; lessons have no such gate — parallelizing lets IoT waiting-time steal lesson time.
- **Split-the-baby outcome:** half an engine + half a pipeline = nothing demoable.
→ **Do not fully parallelize.** Lessons are the primary track to a demoable milestone; IoT is a **time-boxed status-endpoint spike** slotted in once the engine is stable. Keep IoT behind its own module boundary (as-built §9-B).

**Recommended integration checkpoint:**
Note: per as-built §1 the two subsystems **share only the shell — there is no data link** between lessons and rapor. So "test lesson + IoT together" means *coexistence in one app*, not data integration.
- **Checkpoint #1 (in-timeline): shell coexistence.** Once the lesson engine is demoable *and* `GET /api/iot/status` works, deploy both in one build to catch shell/routing/env conflicts early (e.g. the as-built two-`/`-pages landmine).
- **Checkpoint #2 (future/optional): data link.** Only if/when lesson progress moves to Supabase-per-student (D1=(c)), join it to the `imams` roster the rapor uses. **Defer beyond the PKM timeline** unless explicitly prioritized.

---

## 7. Technical Gaps (Task 6)

**next@16.2.9 / react@19.2.4 vs 14/15 — architecture impact:**
🟡 **Manageable, but one concrete trap for the lesson engine.** Per `AGENTS.md`, treat this as *not the Next.js in training data* — read `node_modules/next/dist/docs/01-app/*` and the React-19 compiler notes before coding, don't assume APIs. The single most architecture-relevant point: the **React Compiler's purity rules** are exactly what the as-built violated (`Math.random` in render for shuffle, `set-state-in-effect` for confetti), and the build merely *tolerated* it. The rewrite must **design impurity out of render from day one** — seed shuffle/celebration RNG in state/init or event handlers, never in render body — and **gate it in ESLint so the build FAILS** on those rules. Also verify: Next 16 async request APIs (`params`/`cookies`/`headers` may be Promises) affect `/modul/[id]` and rapor dynamic routes; caching defaults shifted across 15→16. → Verify against local docs before writing the dynamic routes + server actions.

**Storage interface (localStorage → Supabase) — true adapter swap?**
🟡 **Intent is right, execution under-specified — it will NOT be a clean swap as written.** Two hard requirements to make "adapter swap, not data-model rewrite" real:
1. **Async interface from day one** — even the localStorage adapter must return Promises, because Supabase is async. If a synchronous `localStorage.*` API leaks into components, the later swap becomes a call-site rewrite. Enforce "no direct `localStorage.*` in components" via lint/grep.
2. **Reserve a `studentId` dimension now.** localStorage is implicitly single-student (per device); Supabase is per-student. Model the record as `{ studentId ('local' for now) → { lessonId → result } }` from the start, so adding real students is data, not a schema migration.

**Payload sanitization for Orange Pi — sufficient?**
🟢 **Strategy is mature and sufficient** (it names every sentinel, the exact helpers, `exit_reason` derivation, and `urutan`-not-`entry_time` as the sort key — hard-won lessons; the git log shows 3 sanitization hotfixes). 🟡 **Two hardening notes:** (a) `CLAUDE.md` says "replicate this defensive parsing in any new endpoint" — replication invites drift; **centralize it in one shared module** reused by every IoT route instead. (b) The repo has **no test runner** — sanitization + scoring are pure functions that *should* be unit-tested; add a minimal runner (e.g. vitest) for at least those.

**Security — "no auth gate on `/rapor/*`":**
🟡 **Risk (🔴-adjacent if ever public).** `/rapor/*` and its session-control server actions are open to anyone with the URL — add/delete students, start/cancel sessions, and view reports, all of which are **PII of minors with intellectual disabilities** (a sensitive category). The IoT routes *are* protected (`x-api-key`); the gap is purely the web surface. The lessons-first rewrite doesn't touch this, so it's **not a lessons blocker** — but decide before the rapor rewrite lands:
1. **Cheapest now:** keep the deployment non-public (network-restricted / edge basic-auth) — no app changes.
2. **Near-term hardening:** a single env-based passcode gate in front of `/rapor` mutations — small effort, large risk reduction.
3. **Before any wider-than-campus deployment:** real per-user auth (correctly out of scope for lessons now).
- **Standing review gate:** never import the service-role `supabase.ts` into a client component (it bypasses RLS) — enforce in review.

---

## 8. Definition of Done (Task 7)

**Content slide rendering**
- ✅ Renders illustration + mascot + ≤2 sentences with **zero layout shift** (CLS ≈ 0) on a 768px portrait tablet; text never clips at max allowed copy length.
- ✅ A missing illustration falls back to the placeholder (no broken-image icon, no blank) and the slide stays navigable.
- ✅ Forward/back preserves position; the progress indicator matches the current slide index.

**image-choice**
- ✅ 2–4 options, each ≥48px, **shuffled each mount** (location isn't a cue); a single tap registers the answer.
- ✅ Correct → green confirmation; wrong → amber "belum, coba lagi" + hint **in the feedback modal**; never red.
- ✅ Fully operable by touch with sound off and no hover; keyboard/AT focus reaches every option.

**matching-line**
- ✅ Pairs formed by **tap-source-then-tap-target (no drag)**; each pair shows connector **and** shared color **and** numeric badge (meaning survives loss of color).
- ✅ On stacked/mobile (no line drawable), the numeric-badge pairing still fully communicates the match; validation on submit.
- ✅ Every item and label is ≥48px; any wrong pair → amber feedback + hint + retry within the attempt loop.

**sort-order**
- ✅ Cards start shuffled; reorder via **tap-to-place / up-down controls (not free-drag-only)**; validate on submit.
- ✅ Correct → advance; incorrect → amber "belum urut" (never red) + retry.
- ✅ For movement lessons, the correct sequence enforces the religious order (incl. duduk di antara dua sujud + second sujud).

**Attempt loop + re-teach flow**
- ✅ After 3 wrong attempts, the player jumps to the quiz's related ContentSlide, then offers exactly **one** final retry.
- ✅ After the final retry (pass or fail) the student **always** continues; a failed final retry awards partial credit, not zero.
- ✅ Forcing all-wrong answers through a whole lesson never traps the student on any path.

**Scoring (1–3 stars)**
- ✅ Stars use the locked thresholds (≥80%→3, ≥50%→2, else 1) and **never** drop below 1.
- ✅ Partial-credit questions contribute the **locked fraction** (recommend 0.5); denominator = total quiz questions; a worked example in §4.3 matches the implementation exactly.
- ✅ Completion screen shows earned stars + encouragement + a working return-to-catalog.

**Progress persistence (localStorage)**
- ✅ Completing a lesson writes `{ lessonId, completed, stars, quizResults }` (under a `studentId` key) and **survives a full reload**.
- ✅ The catalog reads persisted progress and shows the completion/stars indicator on the next visit.
- ✅ **All** reads/writes go through the **async** storage interface — zero direct `localStorage.*` in components (verified by grep/lint) — so the Supabase adapter drops in without touching call sites.

**Accessibility compliance**
- ✅ Every interactive target ≥48px; no hover-only or audio-only information; the whole lesson is completable by touch with sound off.
- ✅ Color is never the sole signal (paired with icon/shape/text) — verified on a **grayscale render**.
- ✅ `prefers-reduced-motion` disables idle/celebration animation; no information disappears on a timer.

**Character / gender art system**
- ✅ Toggling gender swaps the illustration set app-wide and persists via the **same** interface as progress (D4/D1).
- ✅ A missing gender variant falls back to the base asset — no broken image, no layout shift.
- ✅ The selected gender stays consistent across catalog + every lesson within a session.

---

## 9. Recommended Build Order (Task 8)

**Build order (clean `src/`, only `globals.css` + `favicon.ico`):**
1. `types/lesson.ts` — content schema (unblocks authoring **and** player in parallel; include reserved D2 fields + id-based `relatedSlide`). *(Blocker B2.)*
2. `lib/storage.ts` — **async** storage interface + localStorage adapter, keyed `{ studentId → { lessonId → result } }` (D1).
3. `globals.css` design tokens — non-punitive palette (green/amber/teal), ≥48px sizing, spacing, mascot keyframe (Tailwind v4 `@theme`; confirm against the existing CSS-first file).
4. One **golden lesson** in `data/lessons/` — real schema, placeholder art + real short copy — so the engine runs on real data.
5. Canonical **slide-frame layout component** — the "predictable layout" made real (fixed regions + single-primary-action hierarchy).
6. `ContentSlide` renderer — proves layout + text-fit + image fallback.
7. `image-choice` + shared `QuizFeedback` modal + shuffle util (**RNG in state/init, never in render**) + attempt-loop scaffolding — the reusable quiz infrastructure.
8. Player state machine (`presenting | reviewing | completed`) — wire attempts → re-teach → final retry → scoring → completion.
9. Catalog page — lists lessons, reads progress, gender toggle.
10. `sort-order`, then `matching-line` (reuse step 7's infra; apply the visual-first label fix).
11. Persistence wire-up + gender-art component with fallback.
12. **Then** the IoT `status` spike (table + partial-unique index + migration + Mulai-Sesi action + curl test) as a separate time-boxed track.

**First milestone — end of day 1:** `types/lesson.ts` + async storage interface committed; the golden lesson's **data compiles** against the schema; a bare route renders the **first ContentSlide** (image + mascot + ≤2 sentences) with forward/back nav, **lint-clean**. ("A slide is on screen from typed data." No quizzes yet.)

**First demo-able checkpoint (~week 2–3):** one full lesson end-to-end with image-choice — catalog → open golden lesson → step slides → answer → gentle feedback + hint → trigger the re-teach loop once → completion with stars → progress shows on the catalog on return. Demoable with placeholder art; matching-line/sort-order shown as "coming next."

**Red flags to watch:**
- 🔴 RNG/impurity creeping back into render (shuffle/confetti) → repeats the as-built React-Compiler debt. **Gate in ESLint.**
- 🔴 Direct `localStorage.*` in components → breaks the D1 adapter-swap promise. **Enforce the interface via lint/grep.**
- 🔴 Content/art critical path slipping while the engine idles → **placeholders + one golden lesson** decouple them.
- 🟡 Scoring math shipped as an accidental implementation choice → **lock partial-credit + denominator before building the player.**
- 🟡 As-built landmines re-introduced with the shell (two `/` pages, dead generic Navbar) → **one home route, real nav only.**
- 🟡 Religious content demoed unreviewed → **enforce the DRAFT flag + sign-off gate.**
- 🟡 matching-line text labels undercutting visual-first → **icons on labels / picture-to-picture.**
- 🟡 Cloudinary creeping into lesson image loading → **lesson art stays local in `/public`** (preserves the §7 offline NFR).
- 🟡 True lessons+IoT parallelism on 1–2 devs → **keep IoT a time-boxed spike.**

---

## 10. Action Items — prioritized, with owner

### 🔴 P0 — Blockers (resolve before code / authoring)

| # | Owner | Action (concrete next step) | Ref |
|---|---|---|---|
| **B1** | **PM** | Ratify **tunagrahita as the single primary user** + a tie-break rule ("when deaf vs tunagrahita needs conflict, tunagrahita cognitive-load wins; sign-language is the deaf accommodation, reserved via D2") in `lessons.md` §2. | §2, Task 1/2 |
| **B2** | **Dev** | Write `types/lesson.ts` — field-level content schema extracted/cleaned from as-built `types/module.ts` (on `vibecode-reference`); include reserved D2 sign fields + **id-based** `relatedSlide`. | §2, §5 |
| **B3** | **Content + PM** | Name a religious reviewer (guru agama/ustadz); produce the canonical **"Correct Sholat Reference"** (full ordered steps + full recitations, Arabic+translit+Indonesian); add a per-lesson **sign-off gate + "DRAFT" flag**. *(Blocks content publish/demo-as-final, not engine scaffolding.)* | §5 |
| **B4** | **Content + Dev** | Define the **placeholder-art system** (labeled grey-box, correct aspect ratios, final naming convention) + the **required-illustration inventory** for the golden lesson. *(This is what unblocks the engine.)* | §2, §5 |

### 🟡 P1 — This month (before / during engine build)

| # | Owner | Action | Ref |
|---|---|---|---|
| 5 | **PM** | Lock the scoring math: partial-credit fraction (recommend 0.5), denominator = total quiz questions, full credit for any correct answer inside the initial attempt loop; add a worked example to §4.3. | §2, §8 |
| 6 | **Dev** | Make the storage interface **async** and reserve a `studentId` dimension now (`{ studentId → { lessonId → result } }`); ban direct `localStorage.*` in components via lint/grep. | §7 |
| 7 | **PM** | Validate the classroom **device-sharing model**; if shared, decide local student-picker vs. accept ephemeral/demo-only progress. | §4, D1 |
| 8 | **Dev** | Specify low-motor quiz interactions in §4.4: matching-line = tap-source→tap-target (no drag); sort-order = tap-to-place/arrows (no free-drag). | §2 |
| 9 | **Content** | Resolve matching-line visual-first: add an icon to every right-side label **or** switch to picture-to-picture matching. | §3 (row 2) |
| 10 | **Dev** | Establish a "no impurity in render" rule (RNG seeded in state/init) + an ESLint gate that **fails** the build on React-Compiler purity/set-state-in-effect rules. | §7 |
| 11 | **PM + Content** | Produce the definitive lesson list (titles + objective + slide count) to satisfy D5 and align the catalog (kill the fictional cards). | §2, §4 |
| 12 | **Dev** | Add a canonical slide-frame wireframe + shared layout component (fixed regions, single-primary-action hierarchy) to make "predictable layout" testable. | §3 (rows 7–8) |
| 13 | **Dev** | Centralize IoT payload sanitization in one shared module (not "replicate per endpoint"); add a minimal test runner (e.g. vitest) for sanitizer + scoring pure logic. | §7 |
| 14 | **PM** | Confirm in-spec that lesson art ships local in `/public` (Cloudinary = IoT-only) to preserve the §7 offline NFR. | §2, §7 |

### 🟢 P2 — Before the rapor / IoT rewrite lands

| # | Owner | Action | Ref |
|---|---|---|---|
| 15 | **Dev + PM** | Decide the `/rapor` auth approach (minimum: network-restrict + env passcode on mutations) before the rapor rewrite; keep the service-role client server-only (standing review gate). | §7 |
| 16 | **Dev** | Build the IoT `status` spike (`sholat_sessions` table + partial-unique index + migration + Mulai-Sesi action + curl test) as a time-boxed side task **after** the engine is stable; defer `sesi/selesai` + `media/upload`. | §6 |
| 17 | **PM** | Set integration checkpoint #1 = shell coexistence (engine demoable + status endpoint live in one build); defer any lesson↔rapor data link (checkpoint #2) beyond PKM unless prioritized. | §6 |

---

*End of review. The engine is buildable now; clearing B1–B4 this week converts "conditionally ready" to "ready to build."*
