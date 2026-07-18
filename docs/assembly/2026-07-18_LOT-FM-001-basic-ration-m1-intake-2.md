================================================================================
LOT SYSTEMS / SELF-ASSEMBLY DIRECTIVE — INTAKE CORRECTION
DOCUMENT: LOT-FM-001 (ADDENDUM)
TITLE:    BASICS — SURPRISE-BOX MODEL + PLAN TIERS (supersedes M1 v1 pricing)
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-18
BRANCH:   claude/beautiful-johnson-afqz6n
================================================================================

## WHY THIS FILE EXISTS

The first LOT-FM-001 build this session (see
`2026-07-18_LOT-FM-001-basic-ration-m1.md`) shipped a $100/mo "BASIC RATION"
with one flat 23-item manifest mixing wardrobe, hygiene, and tool items. S-2
corrected this across four follow-up messages in the same session. This file
is the reconciled model; the constants/component were rebuilt against it in
this same push (not a separate session) — the ledger's append-only rule
covers session reports, not mid-session iteration on the same artifact.

## RECONCILED MODEL (verbatim intent, compressed)

PLAN TIERS
  AI (Usership, digital only)     $99/mo
  BASICS (physical, default)      $399/mo — AI included. First physical
                                   module after digital-only AI.
  Module upgrade (Self-care, Home,
    Kids, ...)                    +$99/mo each, additive on top of BASICS.

BASICS IS A SURPRISE BOX
  The operator does not know contents in advance. The System smart-curates
  one box per operator per month. Confirmed contents categories:
    - WARDROBE: socks, underwear, t-shirt, backpack (one month), basic
      wardrobe rotation — native to Basics, ships every issue.
    - SELF-CARE preview: e.g. toothbrush — a small representative sample,
      not the full self-care stream.
    - HOME preview: e.g. candle, and the LOT® BioStation™ weather station
      (part by part) — representative sample of the Home module, shippable
      via Basics even before Home exists as its own subscribable module.

MODULE UPGRADE MECHANIC
  Upgrading a module (+$99/mo) does not add a new box — it swaps that
  module's Basics-preview sample for its full, dedicated, more granular
  monthly stream. Self-care upgrade is conceptually live (open for
  enrollment once Month 2 billing exists); Home and Kids are COMING — not
  yet open, but their preview items still ship inside Basics.

BIOSTATION™ CONSTRUCTOR
  12-month build-it-yourself weather station, shipped part by part inside
  the Basics box (not a separate SKU/tier). S-2 named: month 1 computer
  block (core), month 2 tripod, month 3 first sensor, personalized LOT®
  hard drive as one of the parts. Distributed IoT — connects to LOT®
  Systems dashboard with an available enterprise-grade API.
  Shipping order recommendation (given to S-2, adopted): dependency-first —
  compute/power core ships before anything that depends on it (mount,
  sensors); sensors ascend in complexity; the personalized drive slots in
  once there's real data to log (not month 1, when there's nothing yet);
  the year closes on an enclosure/calibration month so the build has a
  visible finish line.

## WHAT WAS REBUILT THIS SESSION (same push)

- `src/shared/constants/rations.ts` — full rewrite. `RATION_POOL` now
  carries `module: 'WARDROBE' | 'SELF-CARE' | 'HOME'` and
  `previewInBasics: boolean` per item (5 wardrobe + 8 self-care + 1 home,
  14 total — down from the prior flat 23; hardware/tool items from the v1
  list were dropped, since "hardware" turned out to mean BioStation, not
  a multitool/compass/flashlight kit). New `BIOSTATION_SEQUENCE` (12
  months, dependency-ordered). New `PLANS` (AI, BASICS, SELF_CARE, HOME,
  KIDS) carrying price, `includesAi`, and `LIVE`/`COMING` status.
- `src/client/components/Basics.tsx` — full rewrite. Doctrine copy now
  explains the surprise-box mechanic explicitly. Price line reads
  BASICS $399/mo (AI included), with AI-standalone and per-module upgrade
  rows beneath it (StatusLine `live`/`pending` per module status). Contents
  table now renders only `getBasicsPreviewPool()` (previewInBasics items),
  tagged by originating MODULE column, with an explicit "SMART-CURATED. NOT
  GUARANTEED EACH MONTH" footer — the old ledger implied a fixed guaranteed
  shipment, which was wrong for a surprise box. New BioStation constructor
  card (MONTH | NOMENCLATURE, 12 rows) as its own block, since it's the
  headline hardware narrative and deserves separate visual treatment from
  the wardrobe/self-care preview table.
- Full build re-verified green (`npm run build`) after the rewrite; new
  strings confirmed present in the compiled bundle.

## STILL PROVISIONAL / OPEN FOR NEXT INTAKE

- BioStation months 5-12 are this session's constructor-sequence guess
  (sensors, power, cabling, enclosure) — only months 1-4 came from S-2
  directly. Supersede when a real bill of materials exists.
- The exact self-care/home preview subset (toothbrush + soap; candle) vs.
  deeper-only items (tea, magnesium, electrolytes, sleep mask, earplugs,
  bandages) is this session's judgment call about which items feel like a
  fair "teaser," not a confirmed split from S-2. Flag if wrong.
- Kids module has zero items defined — plan row exists, pool does not.
- $399 margin (82%, per S-2) and the earlier $100/mo ceiling (<=$40 landed,
  >=60% margin) from the original LOT-FM-001 OPERATING RULES are now two
  different numbers for two different eras of the same plan — the >=60%/
  <=$40 ceiling was written against the old $100/mo framing and no longer
  applies verbatim at $399/mo. Not reconciled in code (no COGS numbers are
  stored client-side by design) — flag for S-2 if the OPERATING RULES text
  itself needs updating for a future manual revision.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-FM-001 ADDENDUM
================================================================================
