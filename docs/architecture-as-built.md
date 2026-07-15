# GEMA Imam LMS — As-Built Architecture

> Reference snapshot of the **vibecoded** code as it exists at `8c93372`
> (preserved on branches `main` + `vibecode-reference`). This documents what the
> current code actually *does*, as the basis for re-specifying and rebuilding on
> `rewrite/spec-driven`. It is descriptive, not aspirational.

## 1. What it is

A Next.js LMS for an SLB (Indonesian special-needs school) with **two audiences
and two largely independent subsystems**:

- **Lessons (siswa):** interactive, slide-based lessons teaching deaf/hard-of-hearing
  and intellectually-disabled students the sholat (prayer), with image-choice /
  matching-line / sort-order quizzes.
- **IoT + Rapor (guru/parent):** ingests real-time pose data from an Orange Pi 4 Pro
  running MediaPipe that scores prayer-movement *tuma'ninah* (stillness/calm), and
  reads it back as per-student reports.

The two subsystems currently share only the shell (layout, nav, styling, Supabase
client). There is **no data link** between a student's lessons and their rapor.

## 2. Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js **16.2.9** (App Router, Turbopack) |
| UI | React **19.2.4**, TypeScript |
| Styling | Tailwind CSS **v4** (CSS-first in `globals.css`, no `tailwind.config`), `tw-animate-css` |
| DB | Supabase (Postgres) via `@supabase/supabase-js` — **service-role key, server-only** |
| Media | Cloudinary |
| Icons/Fonts | lucide-react; custom fonts Gohan + SVN-Gilroy |
| Tooling | pnpm; Docker dev (`docker-compose.yml` + `Dockerfile.dev`, polling watch) |

## 3. Rendering & routing model

- App Router with a single **URL-transparent** route group `(siswa)`.
- **Only one layout** — root `app/layout.tsx`: global `<NavBar/>` + `<Providers>`
  (GenderContext) + `<main>`. No `(siswa)/layout.tsx`.
- Mix of Server Components (rapor pages, home — data fetching + server actions) and
  Client Components (modul player, quizzes, navbar, gender toggle).
- **No authentication anywhere.** `/rapor/*` mutations (add/delete student, start/cancel
  a recording session) are open to anyone with the URL — accepted for the campus
  prototype only.

### Route map

| Route | File | Type | Purpose |
|---|---|---|---|
| `/` | `app/page.tsx` | Server | Marketing home: hero, fitur, module cards, footer |
| `/` ⚠ | `app/(siswa)/page.tsx` | stub | `<div>Siswa Page</div>` — **also resolves to `/`** |
| `/modul` | `(siswa)/modul/page.tsx` | Server | Lesson list + gender toggle |
| `/modul/[id]` | `(siswa)/modul/[id]/page.tsx` | Client | Slide/quiz player |
| `/rapor` | `(siswa)/rapor/page.tsx` | Server | Student roster + add-student action |
| `/rapor/siswa/[id]` | `(siswa)/rapor/siswa/[id]/page.tsx` | Server | Session history; start/cancel session |
| `/rapor/sesi/[id]` | `(siswa)/rapor/sesi/[id]/page.tsx` | Server | One session, movement-by-movement report |
| `/tentang` | `(siswa)/tentang/page.tsx` | — | About |
| `GET /api/iot/status` | `api/iot/status/route.ts` | Route | Device poll; PENDING→ACTIVE handoff + cancel-check |
| `POST /api/iot/sesi/selesai` | `api/iot/sesi/selesai/route.ts` | Route | Bulk end-of-session report (atomic RPC) |
| `POST /api/iot/media/upload` | `api/iot/media/upload/route.ts` | Route | Cloudinary upload (built, not yet called by Pi) |

## 4. Pillar 1 — Lessons (data-driven slides & quizzes)

- **Content model** (`types/module.ts`, `data/modules.ts`): static, no CMS. A
  `ModuleDefinition` is an ordered `Slide[]`; each slide is a `ContentSlide`
  (mascot + 1–2 sentences, by design for the audience) or a `QuizSlide` of type
  `image-choice | matching-line | sort-order`. 5 modules authored.
- **Player** (`components/modul/SlidePresentation.tsx`): client state machine
  `presenting | reviewing | completed`. Tracks attempts against
  `MAX_QUIZ_ATTEMPTS` / `FINAL_RETRY_ATTEMPTS`; on 3 wrong answers it jumps to the
  quiz's `relatedSlideIndex` for review, then a final retry; scores 1–3 stars.
- **Quiz UIs** (`components/modul/quiz/*`): `ImageChoice`, `MatchingLine` (SVG
  connector lines + color/number pairing), `SortOrder`; shared `QuizFeedback` modal
  (hint surfaced on wrong answers).
- **Gender-adaptive art** (`context/GenderContext.tsx` + `components/modul/ModulImage.tsx`):
  a localStorage preference swaps `/images/modul/{male,female}/…`, falling back to the
  flat originals when a variant is missing.
- **Persistence: NONE.** The player's `onComplete` only `console.log`s the result —
  lesson outcomes are never written to Supabase.

## 5. Pillar 2 — IoT + Rapor (pull-based device pipeline)

- **Model:** exactly one physical Orange Pi/camera. The website is the "boss"; the Pi
  polls. A DB **partial-unique index** guarantees ≤1 non-terminal session system-wide.
- **Lifecycle:**
  1. Teacher clicks "Mulai Sesi" on `/rapor/siswa/[id]` (a server action) → inserts a
     `sholat_sessions` row with `status=PENDING`.
  2. Pi polls `GET /api/iot/status` (with `x-api-key`) → flips the oldest PENDING→ACTIVE
     (FIFO) and returns which student to record.
  3. Pi records the whole prayer locally, then calls `POST /api/iot/sesi/selesai` **once**
     — session summary + the full `log_transisi[]` array, inserted atomically into
     `movement_logs` via the `selesaikan_sesi_sholat` Postgres RPC.
  4. Mid-session the Pi polls `status?session_id=…` to detect a web-triggered cancel
     ("Batalkan Sesi").
- **Auth:** every `/api/iot/*` route calls `validateIoTApiKey` (`lib/auth-iot.ts`) —
  `x-api-key` must equal `IOT_SECRET_KEY`.
- **Payload sanitization:** the Pi sends sentinels (`"-"`, `"Batal"`, `"Selesai"`, `null`)
  in place of timestamps/angles; `sesi/selesai` cleans them (`parseNumeric`,
  `isInvalidEntry/Exit`, `exit_reason` derivation). **`movement_logs.urutan`** (not
  `entry_time`) is the authoritative timeline sort key.
- **Media:** `media/upload` → Cloudinary → `secure_url` intended for
  `log_transisi[].foto_pose_url`. Fully built but **not yet called by the Pi**.
- **Real Pi code lives elsewhere:** sibling repo `../cv` (`core/main.py`, MediaPipe).
  `orange_pi_script/` in this repo is now only documentation.

## 6. Data model (Supabase)

| Table | Role | Key fields |
|---|---|---|
| `imams` | Students (rapor roster) | `nama`, `kelas` (+ gender referenced elsewhere) |
| `sholat_sessions` | One prayer session | `status` = PENDING\|ACTIVE\|Selesai\|Dibatalkan (CHECK); summary stats; partial-unique index for ≤1 active |
| `movement_logs` | Per-movement rows | `rakaat`, `state`, `entry_time`/`exit_time`, `duration_seconds`, hip/knee/arm angles, `tumaninah_met`, `exit_reason`, `urutan`, `foto_pose_url` |

- RPC `selesaikan_sesi_sholat` (migration-002) — atomic session update + bulk movement insert.
- Schema is applied **manually** via the Supabase SQL Editor: `supabase-migration.sql`
  then `supabase-migration-002-fixes.sql`. No migration tool wired up.

## 7. Cross-cutting

- **Styling:** Tailwind v4 tokens in `globals.css` (`@theme`: `gema-navy/tosca/mint/…`,
  fonts, `mascot-bob` keyframe).
- **Client state:** React Context — only `GenderContext` (via `useSyncExternalStore`).
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_*`,
  `IOT_SECRET_KEY`.
- **Config:** `next.config.ts` (Cloudinary `remotePatterns`), `eslint.config.mjs`,
  `tsconfig.json`, `postcss.config.mjs`, Docker.

## 8. Vibecode landmines (do NOT carry over blindly)

1. **Dead generic Navbar** — `components/Navbar.tsx` ("LMSPintar"; `/courses`,`/dashboard`,
   `/login`,`/register`) is unused template boilerplate. Real nav = `components/siswa/Navbar.tsx`.
2. **Two `/` pages** — real home `app/page.tsx` + stub `app/(siswa)/page.tsx`
   (`<div>Siswa Page</div>`). Next normally rejects two pages on one route; resolve early.
3. **Home module cards are fiction** — `app/page.tsx` advertises "Huruf Hijaiyah / Rukun
   Islam / Wudhu / Alat Ibadah," none of which match the real modules. Content mismatch.
4. **Lessons don't persist** — player result is `console.log`ged, never saved; no link
   between lessons and rapor.
5. **No auth** on `/rapor` or the session-control actions.
6. **Lint debt** — React-Compiler rules (`set-state-in-effect`, `purity`/`Math.random`
   in render) fail across shuffle/confetti code; the build tolerates it.
7. **Stray scaffolding committed** — `components/modul/VideoPlayer.tsx` (unused),
   `scratch/`, `scripts/`; the abandoned push-based design still described in
   `integration_technical_specification.md` (§1/§4).
8. **Source of truth** — `CLAUDE.md` is accurate; the spec doc's §1/§4 describe an
   abandoned design.

## 9. Suggested rewrite module boundaries

- **A. Lessons** — self-contained, no backend dependency. Cleanest first candidate to
  re-spec and rebuild.
- **B. IoT + Rapor** — Supabase + a live contract with the `../cv` Pi client; higher risk.
- **C. Shell / home / shared** — layout, nav, landing, styling, config.
