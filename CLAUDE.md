# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

**GEMA Imam** — a Next.js LMS for an SLB (special-needs school) that has two audiences:

1. **Siswa (student) modules** — interactive slide-based lessons teaching deaf/hard-of-hearing students how to pray (sholat), with image-choice/matching/sort-order quizzes.
2. **IoT ingestion API** — receives real-time pose-detection data from an Orange Pi 4 Pro running MediaPipe (see `orange_pi_script/` in this repo, and `integration_technical_specification.md`) that tracks a student's prayer movements (rukuk, sujud, etc.), scores "tuma'ninah" (stillness/calm) compliance, and stores skeleton-overlay photos via Cloudinary. Guru (teacher) and parent-facing report views ("rapor") read this data back out.

`integration_technical_specification.md` documents DB schema and forward-looking dashboard ideas but its §1/§4 data-flow diagram and REST contract describe an **abandoned design** — see the "IoT ingestion contract" section below for what's actually implemented.

**The Orange Pi's actual Python client (`cv/`, `core/main.py`) is a separate git repo** (`github.com/gema-imam-its/cv`, branch `feature/web-integration`), a sibling directory next to this project (`../cv`, i.e. `D:\PKM\cv` if this repo is at `D:\PKM\lms`) — **not** a subdirectory inside this repo. If a `cv/` folder ever shows up nested inside this project, it's a stray duplicate, not the source of truth — check `git remote -v` inside it before editing anything there.

## Commands

```bash
pnpm dev      # start dev server (Next.js, localhost:3000)
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
```

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`) — don't use npm/yarn. There is no test runner configured in this repo.

Docker dev environment: `docker-compose.yml` + `Dockerfile.dev` runs `next dev` in a container with polling enabled (`WATCHPACK_POLLING=true`) for volume-mounted file watching.

## Critical: this is not the Next.js you know

Per `AGENTS.md`, this project pins `next@16.2.9` / `react@19.2.4`, versions ahead of training data with breaking API/convention changes. **Before writing any Next.js code, read the relevant doc under `node_modules/next/dist/docs/`** (`01-app/`, `02-pages/`, `03-architecture/`, `04-community/`) rather than assuming APIs match older Next.js. Heed deprecation notices there.

## Architecture

### Route groups

- `src/app/(siswa)/` — student-facing pages: home, `/modul` (module list), `/modul/[id]` (slide player).
- `src/app/(guru)/` — guru (teacher)-only pages, gated by `requireGuru()` (see "Guru login & Supabase access" below): `/rapor` (report list), `/rapor/sesi/[id]` (single prayer-session detail), `/rapor/siswa/[id]` (per-student report, incl. the "Mulai Sesi Baru" action).
- `src/app/masuk/` — guru login page (`page.tsx` + `actions.ts`), public.
- `src/app/api/iot/` — unauthenticated-by-header-key REST endpoints consumed by the Orange Pi Python client, not by the frontend.
- `src/app/tentang/` — about page.

### IoT ingestion contract

All `/api/iot/*` routes require header `x-api-key` matching `IOT_SECRET_KEY` — validated via `validateIoTApiKey()` in [src/lib/auth-iot.ts](src/lib/auth-iot.ts), called as the first line of every route handler. Missing/invalid key returns 401 (and a 500 if `IOT_SECRET_KEY` isn't set server-side).

Data flow is **pull-based**, driven by the website, not push-based from the Pi (an earlier push-based design — Pi self-initiates a session, streams per-movement calls — was abandoned; its routes were deleted):

1. A teacher clicks "Mulai Sesi Baru" on `/rapor/siswa/[id]` (a `"use server"` action, not an `/api/iot/*` route) — inserts a `sholat_sessions` row with `status: "PENDING"`.
2. `GET /api/iot/status` — polled by the Orange Pi every ~2-3s; flips the oldest `PENDING` session to `ACTIVE` (FIFO by `created_at`) and returns which student to record next (queue-of-one polling handoff). A DB-level partial unique index guarantees at most one non-terminal (`PENDING`/`ACTIVE`) session system-wide, since there's physically one camera.
3. The Pi records the entire prayer session locally (`cv/core/main.py`, the real MediaPipe implementation — not `orange_pi_script/`, which only has a `README.md` documenting the contract now), then reports everything in one shot.
4. `POST /api/iot/sesi/selesai` — called once at prayer end/cancel; atomically updates the session's summary stats **and** bulk-inserts the full `log_transisi` array into `movement_logs` via the `selesaikan_sesi_sholat` Postgres RPC (see `supabase-migration-002-fixes.sql`), so a failed movement insert can't leave a "Selesai" session with zero recorded movements.
5. `POST /api/iot/media/upload` — accepts multipart form image, uploads to Cloudinary via [src/lib/cloudinary.ts](src/lib/cloudinary.ts), returns the `secure_url`. Fully implemented and ready to embed a URL into `log_transisi[].foto_pose_url`, but **not yet called by the Pi side** — no snapshot capture is wired up in `cv/` yet.

**Payload sanitization matters here**: the Orange Pi's Python/AI side sometimes sends sentinel strings (`"-"`, `"Batal"`, `"Selesai"`) or JSON `null` in place of real timestamps or numeric angles. See the sanitization logic in [src/app/api/iot/sesi/selesai/route.ts](src/app/api/iot/sesi/selesai/route.ts) (`parseNumeric`, `isInvalidEntry`/`isInvalidExit`, and `exit_reason` derivation) — replicate this defensive parsing in any new endpoint that consumes Orange Pi payloads rather than trusting the JSON shape in `src/types/iot.ts`. `movement_logs.urutan` (not `entry_time`) is the authoritative sort key for a session's timeline, since `entry_time` can be sanitized to a fake `"00:00:00"`.

### Guru login & Supabase access

Three Supabase clients under `src/lib/supabase/`, each for a different trust level — never mix them up:

- [client.ts](src/lib/supabase/client.ts) — browser client (anon key), for Client Components.
- [server.ts](src/lib/supabase/server.ts) — **authenticated** SSR client (anon key + the guru's session cookie via `@supabase/ssr`), for Server Components/Actions/Route Handlers acting *as the logged-in guru*. Subject to RLS.
- [service.ts](src/lib/supabase/service.ts) — **service-role** client (bypasses RLS). Server-only, and used **only** by the `/api/iot/*` routes (which authenticate via `x-api-key`, not a user session) — never import it into guru-facing page/action code.

Guru auth is Supabase Auth (email/password, accounts created by hand in the dashboard — no public signup):

- `/masuk` ([actions.ts](src/app/masuk/actions.ts)) signs in via `signInWithPassword` and redirects to `/rapor`.
- [src/lib/auth-guru.ts](src/lib/auth-guru.ts) exports `requireGuru()` (redirects to `/masuk` if unauthenticated) and `getGuru()` (returns `null` instead) — both use `getUser()`, which re-verifies the JWT with Supabase, never the spoofable `getSession()`. **Call `requireGuru()` at the top of every guru page and every `"use server"` action**, including ones inlined inside a page component — the `(guru)/layout.tsx` guard and [src/proxy.ts](src/proxy.ts) redirect are optimistic layers only (a layout doesn't re-render on every navigation, and Server Actions are separate entry points a proxy matcher can silently miss).
- `src/proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`) refreshes the Supabase session cookie and does the optimistic redirect (unauthenticated off `/rapor/*`, authenticated away from `/masuk`).
- `supabase-migration-003-rls.sql` enables RLS on all three tables with an "any authenticated user is a guru" policy — the DB-level backstop behind the app-level gate above. Apply after `-002-fixes.sql`, manually via the Supabase SQL Editor (same as the other migrations, no migration tool wired up).

Schema lives in `supabase-migration.sql` (tables: `imams`, `sholat_sessions`, `movement_logs`) plus `supabase-migration-002-fixes.sql` (status CHECK constraint, one-active-session partial unique index, `exit_reason`/`urutan` columns, `selesaikan_sesi_sholat` RPC) and `-003-rls.sql` above — apply all three in order.

### Module/quiz content model

Lesson content is authored as static data in [src/data/modules.ts](src/data/modules.ts) (no CMS/DB) typed by [src/types/module.ts](src/types/module.ts). A `ModuleDefinition` is an ordered array of `Slide`s, each either a `ContentSlide` (mascot + short text, 1-2 sentences by design for the tunagrahita/intellectual-disability audience) or a `QuizSlide` of one of three types (`image-choice`, `matching-line`, `sort-order`), rendered by the matching component in `src/components/modul/quiz/`. Quiz slides can reference `relatedSlideIndex` to jump back to the content slide being tested, and enforce `MAX_QUIZ_ATTEMPTS` / `FINAL_RETRY_ATTEMPTS` from `module.ts` before scoring. The slide player itself is [src/components/modul/SlidePresentation.tsx](src/components/modul/SlidePresentation.tsx) / `SlideContent.tsx` / `SlideQuiz.tsx`, orchestrated from `src/app/(siswa)/modul/[id]/page.tsx`.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss` (see `postcss.config.mjs`) — no separate `tailwind.config` file (v4 is CSS-first config, check `src/app/globals.css`).

## Env vars

Required at runtime (see `.env.local`, not committed): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `IOT_SECRET_KEY`.
