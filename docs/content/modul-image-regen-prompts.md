# Modul Illustration Regeneration — Prompt Spec

> **Round 3 update (Modul 1 launch prep, 2 days out):** `formasi-imam.png` was
> found missing entirely from `female/` and the flat top-level path (not just
> "still wrong" — actually deleted from the working tree), which broke the
> image for any female-gender student in Modul 1 right now. Applied a
> same-gender stopgap (copied `male/formasi-imam.png` into both paths) so
> nothing is broken while better art is pending — see git history for the
> commit. Attempted generating real corrected art via the installed
> `ui-ux-pro-max` Claude Code skill instead of an external tool: **confirmed
> dead end** — this machine has no Python interpreter installed and no
> `GEMINI_API_KEY` configured anywhere in the repo, and the skill's only
> image-generation scripts (`design/scripts/logo/generate.py`,
> `design/scripts/icon/generate.py`) produce a single symbolic
> logo/icon-template graphic, not a full-scene, multi-character, back-view
> illustration matching this doc's Style Bible — wrong tool for this job even
> with credentials. `formasi-imam` and `formasi-makmum` are re-promoted to
> **active** below with ready-to-paste blocks (matching the format already
> used for `formasi-jamaah`) for whoever runs the external tool next.
>
> **Round 2 update:** the first regen pass fixed some things (salam torso is now
> upright; makmum in `formasi-makmum.png` now face one consistent direction) but got
> the duduk leg position and rukuk angle wrong, and regressed `formasi-jamaah.png` to a
> side-by-side layout that no longer reads as "imam in front." See the corrected
> sections for #3, #6, #8-#10 below — they supersede the original text for those poses.
> Grounded against Indonesian fiqh references, see Sources at the bottom.
>
> **Non-art bugs to fix alongside the art:**
> - `formasi-imam-v2.png` and `gerakan-salam-v2.png` currently sit at the flat top
>   level under the wrong filenames — the app reads `formasi-imam.png` and
>   `gerakan-salam.png` literally, so these are invisible to it. Once a version is
>   approved, save it as the plain filename (no `-v2`), not alongside it.
> - Only 3 of 11 `female/` files were actually regenerated so far (`gerakan-berdiri`,
>   `gerakan-rukuk`, `gerakan-sedekap`). The other 8 are still the stale male-art or
>   old duplicates from before this pass — they still need generating.

> **Purpose:** regenerate `public/images/modul/` with real, distinct male/female art for
> every pose, fix 4 posture/orientation errors, and unify the visual style across the set.
> Written for whoever runs these through an image-gen tool (Midjourney, ChatGPT/DALL·E,
> Bing Image Creator, etc.) — paste the **Style Bible** with every single prompt below, then
> the pose-specific block. Output canvas: **1024×1024 PNG**, matching the existing assets.

## Why a full regen, not just the 4 broken images

Every current file in `male/`, `female/`, and the flat top-level folder is **byte-identical**
across all three locations, for all 11 poses — the male/female character toggle currently
has zero visual effect. Each pose just happens to use one arbitrarily-gendered drawing (e.g.
`gerakan-salam` is a boy, duplicated into `female/`; `gerakan-duduk-antara-sujud` is a girl,
duplicated into `male/`). This spec produces real male *and* female art for all 11 poses,
not just the 4 flagged ones.

Two extra accuracy fixes folded in while touching everything (flag if you'd rather skip
these — they weren't in the original complaint, but they're wrong against `src/data/modules.ts`
captions):
- **`gerakan-berdiri`** currently shows folded/sedekap hands, identical to `gerakan-sedekap`
  — but Modul 4 uses them as two distinct sequential steps ("1. Berdiri tegak (Takbiratul
  Ihram)" → "2. Bersedekap membaca Al-Fatihah"). Berdiri below is respecified as **hands
  relaxed at the sides** (plain Qiyam stance) so it's visually distinct from sedekap.
- **`gerakan-duduk`** and **`gerakan-duduk-antara-sujud`** are the same file already
  (same seated/iftirasy position) — the corrected pose below covers both filenames.

---

## Regeneration selection — skip what's already in `public/asset`

`public/asset` (singular — separate from the existing `public/assets` icon library,
and from `public/asset.zip` it was extracted from) already has a file for **6 of the
11 poses**: `formasi-imam` (+ a `-v2`), `formasi-makmum`, `gerakan-itidal`,
`gerakan-rukuk`, `gerakan-salam` (+ a `-v2`), `gerakan-sujud`. Per your note, those are
excluded from the active prompt selection below — **5 poses actually need new
generations**: `gerakan-berdiri`, `gerakan-sedekap`, `gerakan-duduk` (6a),
`gerakan-duduk-antara-sujud` (6b), and `formasi-jamaah` (9). Each pose section below is
tagged accordingly.

⚠️ One caveat worth flagging: "available" isn't the same as "correct." Checking the
files actually sitting in `public/asset` against them against the round-2 review above
— `gerakan-rukuk` is still ~45-50° instead of 90°, `gerakan-salam` (the `-v2`) still has
duduk-sila legs, `formasi-imam` still has no gold trim and a turned head instead of a
back view, and `formasi-makmum` still faces the viewer instead of the locked back-view
convention. I've left their corrected prompts in place further down (marked
**SKIPPED**) in case you want them later — just not treating them as part of this
round's active selection per your instruction.

| Pose | In `public/asset`? | In this selection? |
|---|---|---|
| `gerakan-berdiri` | no | ✅ **active** |
| `gerakan-sedekap` | no | ✅ **active** |
| `gerakan-rukuk` | yes | ⛔ skipped (still wrong — see caveat) |
| `gerakan-itidal` | yes | ⛔ skipped |
| `gerakan-sujud` | yes | ⛔ skipped |
| `gerakan-duduk` (6a) | no | ✅ **active** |
| `gerakan-duduk-antara-sujud` (6b) | no | ✅ **active** |
| `gerakan-salam` | yes | ⛔ skipped (still wrong — see caveat) |
| `formasi-imam` | yes | ⛔ skipped (still wrong — see caveat) |
| `formasi-jamaah` | no | ✅ **active** |
| `formasi-makmum` | yes | ⛔ skipped (still wrong — see caveat) |

---

## Style Bible — prepend to every prompt below

```
Flat vector "chibi" illustration, children's educational-app style. Thick, slightly
rounded charcoal-brown outlines (~6-8px at 1024px). Soft flat cel-shading with gentle
rounded highlights, no photographic rendering, no gradients-as-texture. Big glossy
almond eyes with a single catchlight, short simple lashes, small nose, warm closed-mouth
smile, rosy circular cheek blush. Chubby toddler proportions: head is roughly 1/3 of
total height, soft rounded limbs, no visible neck gap between head and shoulders.
Character is a young child, approx. 5-7 years old.

Background (use identically across every image in this set): soft warm radial gradient
from cream (#FFF6EA) at center to a pale blush-peach (#FFE9DD) at the edges, with a
faint, low-contrast Islamic arabesque/mosque-arch silhouette centered behind the
character, 2-3 soft round clouds, and 3-4 small sparkle accents scattered in the upper
background — all subtle enough to stay secondary to the character. Floor is a warm
honey-wood tone (#F0C99B) in a simple one-point perspective. Character stands/kneels on
a rectangular prayer rug (sajadah) with a muted sage-green field and a simple gold
geometric border (mirah/mihrab motif at the near edge), centered in frame with even
margin on all sides, matching the character's contact points to the floor plane.
**Keep the rug's long edge parallel to the bottom of the frame** — a light 3/4-view
foreshortening (near edge wider than far edge) is fine, but the rug must not be
rotated diagonally or drawn as a skewed diamond. This has drifted across the set —
double-check it on every generation, it's an easy thing for the model to skew.

Camera: eye-level, medium-full shot, character centered, consistent scale across the
whole set (character occupies roughly the central 55-65% of frame height).

Negative / avoid: extra or missing fingers, six-fingered hands, mismatched hand sizes,
blurry or double linework, text, watermarks, logos, asymmetric or wall-eyed pupils,
adult body proportions, additional limbs or heads, deformed feet, harsh photographic
realism, unrelated props.
```

### Boy character (male set — use in every `male/` prompt)

```
Short neat dark-brown hair with a small fringe peeking out from under a white kopiah/
peci cap (subtle woven trim pattern near the base). Wearing a white koko/gamis: long-
sleeve tunic with a small mandarin collar, 3 small buttons down the front, and loose
white sirwal/trousers underneath. Bare feet. No accessories beyond the peci.
```

### Girl character (female set — use in every `female/` prompt)

```
Same face shape, eyes, cheeks and smile as the boy character (same age, same height,
same proportions, so the two sets read as a matched pair). Wearing a white mukena: a
hijab/head-covering with a delicate scalloped floral-lace trim framing the face and
draping to mid-back, plus a matching loose white gown with lace-trimmed cuffs. Bare feet.
```

---

## Poses

For every pose, generate **two images** (Style Bible + Boy character; Style Bible + Girl
character) and save as both `male/<file>.png` and `female/<file>.png`. Also copy the
**male** version into the flat `public/images/modul/<file>.png` path (that flat copy is
the fallback default `ModulImage.tsx` uses when a gendered variant is missing, and it's
also what `rapor/sesi/[id]/page.tsx` reads directly, ungendered) — pick male as the
default only because that's what's flat today; swap if you'd rather default female.

### 1. `gerakan-berdiri.png` — Berdiri / Qiyam (standing, prayer start) — ✅ ACTIVE
> Used for: "Ini namanya BERDIRI (Qiyam)"; "1. Berdiri tegak (Takbiratul Ihram)"

Standing fully upright, facing forward toward the viewer, both arms relaxed straight
down at the sides (not folded — keep this visually distinct from Sedekap below).
Feet shoulder-width apart on the prayer rug.

### 2. `gerakan-sedekap.png` — Sedekap (hands folded, reciting Al-Fatihah) — ✅ ACTIVE
> Used for: "2. Bersedekap membaca Al-Fatihah"

Standing upright facing forward, right hand resting on top of the left forearm/wrist,
both held together in front of the lower chest/upper stomach. Relaxed shoulders, calm
expression.

### 3. `gerakan-rukuk.png` — Rukuk (bowing) — **corrected, round 2** — ⛔ SKIPPED (available in `public/asset`, still wrong)
> Used for: "Ini namanya RUKUK"; "Saat rukuk: Subhaana Rabbiyal 'Azhiimi wa bihamdih"

> Round 1 undershot the angle (~45-50° bow, head turned toward viewer). Be explicit
> about the full right angle this time.

Bent forward at the hips at a **full 90° right angle** — not a shallow lean. The
torso is exactly horizontal: imagine a glass of water balanced on the back that
must not spill. Back, neck, and head continue as **one flat, straight, unbroken
line parallel to the floor** — head is in line with the spine, face pointed down
toward the rug, **not turned or lifted to face the viewer**. Both hands open, flat
on top of the knees, fingers naturally spread. Calves and thighs stay vertical
(knees not bent forward), so the silhouette reads as a clean upside-down "L": legs
straight up, torso flat across. Show from a side/3-4 angle so the 90° bend and the
flat back line are both unambiguous in silhouette.

### 4. `gerakan-itidal.png` — I'tidal (standing back up after rukuk) — ⛔ SKIPPED (available in `public/asset`)
> Used for: "4. Kelima: I'tidal (berdiri setelah rukuk)"

Standing fully upright facing forward, both arms relaxed at the sides (same base stance
as Berdiri) — the visual cue that distinguishes it in-context is the surrounding slide
sequence, not the pose itself, so keep this simple and calm, a small content variant of
Berdiri is fine.

### 5. `gerakan-sujud.png` — Sujud (prostration) — ⛔ SKIPPED (available in `public/asset`)
> Used for: "Ini namanya SUJUD"; "Saat sujud: Subhaana Rabbiyal A'laa wa bihamdih"

Kneeling with forehead and nose touching the rug, palms flat on the rug beside the head
roughly ear-level, forearms off the ground, hips raised above the shoulder line, knees
and toes on the rug. Shown from a 3/4 side angle so the forehead-to-rug contact is
legible (matches the current asset's framing).

### 6a. `gerakan-duduk.png` — Duduk Tahiyat (tasyahud sitting) — **corrected, round 2, now a separate pose from 6b** — ✅ ACTIVE
> Used for: "Ini namanya DUDUK (Tahiyyat)"; also reused generically for "duduk"
> elsewhere in the lesson data.
>
> Round 1 treated this as identical to `gerakan-duduk-antara-sujud.png` (both hands
> flat, no pointing) — that was wrong; Duduk Tahiyat **does** get the pointing
> gesture, `gerakan-duduk-antara-sujud.png` (6b) does not. Round 2's actual generated
> art also drew **duduk sila** (symmetric cross-legged) instead of iftirasy — fix the
> legs too.

**Legs (iftirasy — not duduk sila):** sitting on top of the left foot/ankle, the top
of the left foot flat against the rug, weight resting on it; the right foot stood
upright on its toes, toes curled under and pointing toward the front of the rug. This
is asymmetric — the two legs look different from each other, unlike cross-legged
sitting where both feet tuck in symmetrically. Do not draw both legs mirrored/tucked
the same way.

**Hands:** right forearm laid along the right thigh, elbow near the hip; the right
hand has the ring and little finger curled into the palm, thumb and middle finger
touching to form a small circle, and the **index finger extended, pointing forward/down
toward knee height** — not raised up near the chest or shoulder. Left hand open, flat
on the left thigh. Torso upright, calm neutral expression, facing forward.

### 6b. `gerakan-duduk-antara-sujud.png` — Duduk antara dua sujud (iftirasy, both hands flat) — ✅ ACTIVE
> Used for: "6. Duduk di antara dua sujud"
>
> **Fixed pose** — previous art used the tasyahud pointing gesture, which belongs to
> 6a, not here. Round 2's art also had the duduk-sila leg problem — same leg fix as 6a.

Same **iftirasy leg position as 6a** (sit on the left foot, right foot upright on its
toes — not duduk sila). The only difference from 6a is the hands: **both hands open
and resting flat on top of the thighs close to the knees** — no pointing finger, no
hand raised above thigh height, both arms symmetric. Calm, neutral expression, facing
forward.

### 7. `gerakan-salam.png` — Salam (closing prayer, head turned) — **legs corrected, round 2** — ⛔ SKIPPED (available in `public/asset`, still wrong)
> Used for: "Ini namanya SALAM"
>
> Round 1's torso-leaning problem is fixed in `gerakan-salam-v2.png` (currently sitting
> under the wrong filename — see note at the top) — keep that upright torso. But it
> still has duduk-sila legs. Reuse the same **iftirasy leg fix as 6a/6b** here.

Sitting in the same upright iftirasy position as 6a/6b (torso perfectly vertical,
spine perpendicular to the rug, not tilted or leaning to either side; legs sitting on
the left foot with the right foot upright on its toes — not duduk sila), hands resting
on the thighs (same open-hand style as 6b), head turned to face over the right
shoulder (~45-60° turn), eyes looking past the shoulder, small calm smile. The torso
and hips do not rotate — only the head turns.

### Formasi camera convention — read this before 8/9/10 (round 2)

Round 1 left the three formasi images inconsistent with each other — `formasi-imam-v2`
came out as a 3/4 turned-head view, `formasi-jamaah`/`formasi-makmum` came out fully
front-facing (viewer sees all faces), and `formasi-jamaah` additionally placed the imam
**beside** the makmum instead of in front of them, so it no longer reads as a prayer
line at all. Lock one convention for all three images:

**Every character in every formasi image is a clean, full back view — facing away from
the viewer, toward the qiblat wall at the top of the frame. No turned heads, no
profile faces, no character facing the viewer.** This is the least ambiguous way to
show "everyone faces the same direction," and it's what makes imam-in-front /
makmum-behind legible as actual depth (near vs. far from viewer) rather than a
left-right lineup.

### 8. `formasi-imam.png` — a single child, seen from behind, leading prayer — ⛔ SKIPPED (available in `public/asset`, still wrong)
> Used for: "Imam adalah orang yang memimpin sholat"; matching-quiz options for "IMAM"

Full back view (see convention above — no turned head), standing upright on a prayer
rug, facing away from the viewer toward the front of the room, same silhouette-arch
backdrop as the rest of the set. **Give the imam one small distinguishing visual
marker not used on makmum art**, so kids can tell the roles apart without relying on
facing direction: a thin gold trim line along the edge of the peci/hijab and a
matching gold border accent on the prayer rug (vs. the plain sage-green/white rug used
for makmum below). Keep the outfit otherwise identical to the standard boy/girl
character. Rug aligned per the Style Bible note (long edge parallel to frame bottom).

### 9. `formasi-jamaah.png` — full congregation (imam + makmum together) — **corrected, round 2** — ✅ ACTIVE
> Used for: "Imam berdiri sendiri di depan. Makmum berdiri di belakang imam"
>
> Round 1 fixed the facing direction on paper but round 2's actual output regressed:
> imam and makmum ended up side-by-side on adjoining mats, all facing the viewer. Be
> explicit about **depth**, not just direction.

One imam (with the gold-trim marker from #8), positioned **closer to the viewer /
lower in the frame, standing alone on his own gold-trimmed mat**. Three makmum
children stand **behind him — farther from the viewer / higher in the frame — in one
neat row on a separate shared plain mat**, clearly spaced back from the imam, not
level with him. All four face away from the viewer (per the convention above), toward
the front of the room, imam's back to the makmum, exactly like a real prayer line. The
imam should read as visibly in front through placement and slightly larger scale
(closer to camera), not just by having a different-colored mat. No character beside
another at the same depth. Produce the male set as 4 boys, the female set as 4 girls
(single-gender jamaah, which also matches real practice for a female-led
congregation).

### 10. `formasi-makmum.png` — makmum only (no imam) — ⛔ SKIPPED (available in `public/asset`, still wrong)
> Used for: "Makmum adalah orang yang mengikuti imam dari belakang"; matching-quiz
> options for "MAKMUM"

3 children standing in one neat row, evenly spaced, **all three in full back view,
facing away from the viewer** (per the convention above — identical orientation, no
turned heads, no exceptions) — same plain rug styling as the makmum row in
`formasi-jamaah.png` (no gold trim; that marker is imam-only). Male set = 3 boys,
female set = 3 girls.

---

## File checklist (round 2 status)

| File | Round 1 fix | Round 2 status |
|---|---|---|
| `gerakan-berdiri.png` | hands un-folded (was duplicate of sedekap pose) | ✅ male+female done |
| `gerakan-sedekap.png` | restyle + gender split | ✅ male+female done |
| `gerakan-rukuk.png` | restyle + gender split | ⚠️ angle only ~45-50°, needs full 90°; male+female both need redo |
| `gerakan-itidal.png` | restyle + gender split | male done, female still stale |
| `gerakan-sujud.png` | restyle + gender split | male done, female still stale |
| `gerakan-duduk.png` | — | ❌ still duduk-sila legs + shares art with 6b (needs the pointing-hand variant, 6a) |
| `gerakan-duduk-antara-sujud.png` | — | ❌ same issue, needs the flat-hands variant (6b) instead |
| `gerakan-salam.png` | torso straightened | ✅ torso fixed in `gerakan-salam-v2.png`, ❌ still duduk-sila legs, ❌ wrong filename |
| `formasi-imam.png` | added gold-trim imam marker | ❌ no gold trim yet, 3/4 turned head instead of back view, ❌ wrong filename (`-v2`); **round 3: `female/` + flat were missing entirely (broken image in Modul 1) — stopgapped with male art, real regen still needed, ready-to-paste prompt below** |
| `formasi-jamaah.png` | imam now faces same way as makmum | ❌ regressed — imam beside makmum instead of in front, all face viewer |
| `formasi-makmum.png` | all 3 children face same way | ⚠️ internally consistent now, but facing viewer instead of the locked back-view convention; **round 3: re-activated, ready-to-paste prompt below** |

Each row = regenerate for **both** `male/` and `female/`, then refresh the flat
top-level copy (pick one gender as the default — male has been the convention so far)
under its **plain filename, no `-v2` suffix**.

---

## Ready-to-paste Gemini prompts (5 active poses × male/female = 10)

Gemini takes one flowing prompt rather than Midjourney-style split parameters, so
these combine Style Bible + character + pose into a single block each. Output as a
square 1024×1024 image.

**Consistency tip:** generate `gerakan-berdiri` (boy and girl) first from the text
prompts below, then for the remaining 4 poses, feed that generated image back into
Gemini as image input with: *"Keep this exact character design, outfit, art style,
and background — change only the pose to: [paste the Pose: line from the relevant
prompt below]."* Editing a locked reference forward drifts far less across 10 separate
generations than re-describing the whole character from text every time.

### 1. `gerakan-berdiri` — boy
```
Flat vector "chibi" illustration, children's educational-app style. Thick, slightly rounded charcoal-brown outlines (~6-8px at 1024px). Soft flat cel-shading with gentle rounded highlights, no photographic rendering. Big glossy almond eyes with a single catchlight, short simple lashes, small nose, warm closed-mouth smile, rosy circular cheek blush. Chubby toddler proportions: head roughly 1/3 of total height, soft rounded limbs, no visible neck gap. Character is a young child, approx. 5-7 years old.

The child is a boy: short neat dark-brown hair with a small fringe peeking out from under a white kopiah/peci cap (subtle woven trim near the base). Wearing a white koko/gamis: long-sleeve tunic, small mandarin collar, 3 small buttons down the front, loose white sirwal/trousers underneath. Bare feet. No accessories beyond the peci.

Background: soft warm radial gradient from cream (#FFF6EA) at center to pale blush-peach (#FFE9DD) at the edges, a faint low-contrast Islamic arabesque/mosque-arch silhouette centered behind the character, 2-3 soft round clouds, 3-4 small sparkle accents in the upper background, all subtle and secondary to the character. Floor is warm honey-wood (#F0C99B) in simple one-point perspective. Character stands on a rectangular prayer rug (sajadah), muted sage-green field with a simple gold geometric border, long edge parallel to the bottom of the frame — not rotated diagonally or skewed into a diamond. Eye-level medium-full shot, character centered, occupying roughly the central 55-65% of frame height.

Pose: standing fully upright, facing forward toward the viewer, both arms relaxed straight down at the sides — hands NOT folded together. Feet shoulder-width apart on the rug.

Avoid: extra/missing fingers, six-fingered hands, blurry or double linework, text, watermarks, logos, asymmetric pupils, adult proportions, extra limbs, harsh photographic realism.
```

### 1. `gerakan-berdiri` — girl
```
[Same Style Bible + Background + Camera paragraphs as above.]

The child is a girl: same face shape, eyes, cheeks and smile as the boy character (same age, height, proportions). Wearing a white mukena: hijab with a delicate scalloped floral-lace trim framing the face and draping to mid-back, plus a matching loose white gown with lace-trimmed cuffs. Bare feet.

Pose: standing fully upright, facing forward toward the viewer, both arms relaxed straight down at the sides — hands NOT folded together. Feet shoulder-width apart on the rug.

Avoid: extra/missing fingers, six-fingered hands, blurry or double linework, text, watermarks, logos, asymmetric pupils, adult proportions, extra limbs, harsh photographic realism.
```

### 2. `gerakan-sedekap` — boy / girl
Same Style Bible + Background + Camera + Avoid blocks as above, boy or girl character
block as above, with this Pose line:
```
Pose: standing upright facing forward, right hand resting on top of the left forearm/wrist, both held together in front of the lower chest/upper stomach. Relaxed shoulders, calm expression.
```

### 6a. `gerakan-duduk` (Duduk Tahiyat) — boy / girl
```
Pose: sitting in the Islamic prayer "duduk iftirasy" position — sitting on top of the left foot/ankle (top of the left foot flat against the rug), right foot stood upright on its toes, toes curled under, pointing toward the front of the rug. This is ASYMMETRIC — the two legs look different from each other. This is NOT cross-legged/duduk sila; do not draw both legs tucked the same way. Right forearm laid along the right thigh, elbow near the hip; the right hand has the ring and little fingers curled into the palm, thumb and middle finger touching to form a small circle, and the index finger extended, pointing forward/down toward knee height — not raised up near the chest. Left hand open, flat on the left thigh. Torso upright, calm neutral expression, facing forward.
```

### 6b. `gerakan-duduk-antara-sujud` — boy / girl
```
Pose: sitting in the Islamic prayer "duduk iftirasy" position — sitting on top of the left foot/ankle (top of the left foot flat against the rug), right foot stood upright on its toes, toes curled under. This is ASYMMETRIC — the two legs look different from each other. This is NOT cross-legged/duduk sila; do not draw both legs tucked the same way. Both hands open and resting flat on top of the thighs close to the knees — no pointing finger, both arms symmetric. Calm, neutral expression, facing forward.
```

### 8. `formasi-imam` — boy / girl (round 3 — reactivated for Modul 1 launch)
```
Flat vector "chibi" illustration, children's educational-app style. Thick, slightly rounded charcoal-brown outlines (~6-8px at 1024px). Soft flat cel-shading with gentle rounded highlights, no photographic rendering. Big glossy almond eyes with a single catchlight, short simple lashes, small nose, warm closed-mouth smile, rosy circular cheek blush. Chubby toddler proportions: head roughly 1/3 of total height, soft rounded limbs, no visible neck gap. Character is a young child, approx. 5-7 years old.

[Boy character block: short neat dark-brown hair with a small fringe peeking out from under a white kopiah/peci cap, subtle woven trim near the base. Wearing a white koko/gamis: long-sleeve tunic, small mandarin collar, 3 small buttons down the front, loose white sirwal/trousers underneath. Bare feet. / Girl character block: same face shape, eyes, cheeks and smile as the boy character, same age/height/proportions. Wearing a white mukena: hijab with a delicate scalloped floral-lace trim framing the face and draping to mid-back, plus a matching loose white gown with lace-trimmed cuffs. Bare feet.]

Background: soft warm radial gradient from cream (#FFF6EA) at center to pale blush-peach (#FFE9DD) at the edges, a faint low-contrast Islamic arabesque/mosque-arch silhouette centered behind the character, 2-3 soft round clouds, 3-4 small sparkle accents in the upper background. Floor is warm honey-wood (#F0C99B) in simple one-point perspective. Eye-level medium-full shot, character centered, occupying roughly the central 55-65% of frame height.

Pose: full back view — facing away from the viewer, toward the qiblat wall at the top of the frame. No turned head, no profile face, character never faces the viewer. Standing upright alone on a prayer rug. Give this character one small distinguishing visual marker not used on makmum art: a thin gold trim line along the edge of the peci/hijab, and a matching gold geometric border accent on the prayer rug (vs. the plain sage-green/white rug used for makmum art). Rug's long edge parallel to the bottom of the frame — light 3/4-view foreshortening is fine, but not rotated diagonally or drawn as a skewed diamond.

Avoid: extra/missing fingers, six-fingered hands, blurry or double linework, text, watermarks, logos, asymmetric pupils, adult proportions, extra limbs, harsh photographic realism, turned head, any visible face.
```

### 10. `formasi-makmum` — boy / girl (round 3 — reactivated for Modul 1 launch)
```
Flat vector "chibi" illustration, children's educational-app style. Thick, slightly rounded charcoal-brown outlines (~6-8px at 1024px). Soft flat cel-shading with gentle rounded highlights, no photographic rendering. Big glossy almond eyes with a single catchlight, short simple lashes, small nose, warm closed-mouth smile, rosy circular cheek blush. Chubby toddler proportions: head roughly 1/3 of total height, soft rounded limbs, no visible neck gap. Children approx. 5-7 years old.

[Boy character block, applied to all 3 children: short neat dark-brown hair with a small fringe peeking out from under a white kopiah/peci cap, subtle woven trim near the base. Wearing a white koko/gamis: long-sleeve tunic, small mandarin collar, 3 small buttons down the front, loose white sirwal/trousers underneath. Bare feet. / Girl character block, applied to all 3 children: same face shape, eyes, cheeks and smile, same age/height/proportions. Wearing a white mukena: hijab with a delicate scalloped floral-lace trim framing the face and draping to mid-back, plus a matching loose white gown with lace-trimmed cuffs. Bare feet.]

Background: same soft warm cream-to-blush radial gradient with faint mosque-arch silhouette, clouds, sparkles, honey-wood floor.

Pose/composition: 3 children standing in one neat row, evenly spaced, all three in full back view, facing away from the viewer toward the top of the frame — identical orientation, no turned heads, no exceptions, nobody facing the viewer or each other. Same plain sage-green rug styling as the makmum row in `formasi-jamaah` (no gold trim — that marker is imam-only). Rug's long edge parallel to the bottom of the frame, not rotated diagonally or drawn as a skewed diamond.

Avoid: extra/missing fingers, blurry or double linework, text, watermarks, logos, any character facing the viewer or each other, adult proportions, harsh photographic realism.
```

### 9. `formasi-jamaah` — 4 boys / 4 girls
```
Flat vector "chibi" illustration, children's educational-app style. Thick, slightly rounded charcoal-brown outlines. Soft flat cel-shading. Big glossy almond eyes, rosy cheeks. Chubby toddler proportions, children approx. 5-7 years old. [Boy or girl character block as above, applied to all 4 children.]

Background: same soft warm cream-to-blush radial gradient with faint mosque-arch silhouette, clouds, sparkles, honey-wood floor.

Pose/composition: a group of 4 children praying together. One child (the imam) has a thin gold trim line along the edge of the peci/hijab and a matching gold border accent on his own small prayer rug — positioned closer to the viewer, lower in the frame, standing alone. The other 3 children (the makmum — plain outfits, no gold trim) stand in one neat row directly behind the imam, farther from the viewer / higher in the frame, clearly spaced back on a separate shared plain sage-green rug — not level with the imam. ALL FOUR characters are shown from a clean full back view, facing away from the viewer toward the top of the frame — no turned heads, no visible faces, nobody facing the viewer or each other. The imam reads as visibly in front through placement and slightly larger scale (closer to camera).

Avoid: extra/missing fingers, blurry linework, text, watermarks, any character facing the viewer or another character, mats rotated into a skewed diamond.
```

---

## Sources (round 2 research)
- [Perbedaan Duduk Iftirasy dan Tawarruk: Cara & Gambarnya — tirto.id](https://tirto.id/perbedaan-duduk-iftirasy-dan-tawarruk-cara-dan-gambarnya-g9ws)
- [Tahiyat Awal dan Akhir: Posisi Duduk Serta Bacaannya sesuai Sunnah Nabi — detik.com](https://www.detik.com/hikmah/khazanah/d-6597564/tahiyat-awal-dan-akhir-posisi-duduk-serta-bacaannya-sesuai-sunnah-nabi)
- [Posisi Jari Saat Tasyahud Menurut Para Ulama — Masjid Darussalam Kota Wisata Cibubur](https://darussalam.id/posisi-jari-saat-tasyahud-menurut-para-ulama/)
- [Perbedaan Duduk Iftirasy dan Duduk Tawarruk — kumparan.com](https://kumparan.com/berita-hari-ini/perbedaan-duduk-iftirasy-dan-duduk-tawarruk-1vHxrY2do3d)
- [Begini Posisi Rukuk yang Benar dalam Sholat — Republika Online](https://islamdigest.republika.co.id/berita/s18i1p366/begini-posisi-rukuk-yang-benar-dalam-sholat)
- [Sifat Shalat Nabi (6): Cara Ruku — Rumaysho.Com](https://rumaysho.com/7045-sifat-shalat-nabi-6.html)
