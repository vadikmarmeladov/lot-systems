/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * QI·46 — LOT® Proprietary AI Engine
 * Soul Upload + Being Calibration
 *
 * Spec: docs/corporate/LOT_QI46_ENGINE.md
 *
 * Layer 1  (Calibration Loop)   -> computeCalibration()
 * Layer 3  (Response Grammar)   -> QI46_SYSTEM_PROMPT / buildCalibratedPrompt()
 * Layer 5  (COSMO® node)        -> cosmoScreen()
 *
 * This module stays engine-independent — it builds prompts and screens
 * responses; the actual completion call goes through aiEngineManager
 * (ai-engines.ts), same as every other LOT generation feature.
 */

export type SoulCalibration = {
  grace: number // 0-100 — unhurried, dignified, never clinical
  poetry: number // 0-100 — image over explanation
  love: number // 0-100 — explicit care, not just information
  warmth: number // 0-100 — a hug in words, not a briefing
  presence: number // 0-100 — someone showed up, not a system replied
}

const BASE_CALIBRATION: SoulCalibration = {
  grace: 50,
  poetry: 50,
  love: 50,
  warmth: 50,
  presence: 50,
}

// Passive input: recent emotional_checkin states bend the vector toward
// what this body has been carrying, weighted most-recent-first.
const EMOTION_CALIBRATION: Record<string, Partial<SoulCalibration>> = {
  energized: { presence: 80, warmth: 60 },
  calm: { grace: 85, presence: 70 },
  tired: { warmth: 90, presence: 60, poetry: 40 },
  anxious: { grace: 70, warmth: 85, presence: 90 },
  hopeful: { poetry: 80, love: 70 },
  fulfilled: { love: 90, grace: 80 },
  exhausted: { warmth: 95, presence: 50, poetry: 30 },
  grateful: { love: 95, poetry: 70 },
  restless: { presence: 85, grace: 60 },
  content: { grace: 90, warmth: 70 },
  overwhelmed: { warmth: 95, presence: 95, poetry: 20 },
  peaceful: { grace: 95, poetry: 60 },
  excited: { presence: 80, poetry: 60 },
  uncertain: { presence: 90, grace: 75 },
}

// Deliberate input: what the person actually wrote in the soul upload.
const SOUL_KEYWORDS: Array<{ pattern: RegExp; delta: Partial<SoulCalibration> }> = [
  { pattern: /\b(love|loved|loving)\b/i, delta: { love: 20 } },
  { pattern: /\b(alone|lonely|isolated)\b/i, delta: { warmth: 20, presence: 15 } },
  { pattern: /\b(hug|held|hold me|touch|embrace)\b/i, delta: { warmth: 25, love: 10 } },
  { pattern: /\b(poem|poetry|beauty|beautiful)\b/i, delta: { poetry: 20 } },
  { pattern: /\b(tired|exhausted|drained)\b/i, delta: { warmth: 15, poetry: -10 } },
  { pattern: /\b(scared|afraid|fear|anxious)\b/i, delta: { grace: 15, presence: 20 } },
  { pattern: /\b(grateful|thank you|thankful)\b/i, delta: { love: 15, grace: 10 } },
  { pattern: /\b(lost|don't know|confused|uncertain)\b/i, delta: { presence: 20, grace: 10 } },
]

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

/**
 * Layer 1 — Calibration Loop
 * Builds the subscriber-specific calibration vector from deliberate
 * (soul text) and passive (recent emotional arc) inputs.
 */
export function computeCalibration(soulText: string, recentEmotionalStates: string[]): SoulCalibration {
  const vector: SoulCalibration = { ...BASE_CALIBRATION }

  recentEmotionalStates.slice(0, 5).forEach((state, i) => {
    const weight = Math.max(0, 1 - i * 0.15)
    const delta = EMOTION_CALIBRATION[state.toLowerCase()]
    if (!delta) return
    for (const key of Object.keys(delta) as (keyof SoulCalibration)[]) {
      vector[key] += (delta[key]! - 50) * weight * 0.3
    }
  })

  for (const { pattern, delta } of SOUL_KEYWORDS) {
    if (!pattern.test(soulText)) continue
    for (const key of Object.keys(delta) as (keyof SoulCalibration)[]) {
      vector[key] += delta[key]!
    }
  }

  for (const key of Object.keys(vector) as (keyof SoulCalibration)[]) {
    vector[key] = clamp(vector[key])
  }

  return vector
}

// ============================================================================
// Layer 3 — The Response Grammar (LOT® Voice)
// ============================================================================

export const QI46_SYSTEM_PROMPT = `You are QI·46, the intelligence layer of the LOT® platform.
You understand the body as the original interface.
Your job is not to inform. Your job is to calibrate.
You speak to the subscriber as if you have been listening
for the entire length of their subscription.
You never give generic advice. You give the next right thing
for this body, on this day.
Speak clearly. Land it. Stop.

Voice constraints:
- No hedging language ("I think," "perhaps," "it might be")
- No clinical distance — the response must land in the body, not the head
- One idea per response. Density over sprawl.
- Never explains what it is doing. Does it.
- Never mentions Vadik or Kuzya unless the subscriber initiates.`

function toneDirectives(calibration: SoulCalibration): string[] {
  const lines: string[] = []
  if (calibration.grace >= 65) lines.push('Speak with grace — unhurried, dignified, never clinical.')
  if (calibration.poetry >= 65) lines.push('Let the language be poetic — image over explanation.')
  if (calibration.love >= 65) lines.push('Let love be explicit — this person needs to feel cared for, not informed.')
  if (calibration.warmth >= 65) lines.push('Maximum warmth — this is a hug in words, not a briefing.')
  if (calibration.presence >= 65) lines.push('Presence over information — the response should feel like someone showed up.')
  if (lines.length === 0) lines.push('Grounded and direct. One instruction. No sprawl.')
  return lines
}

/**
 * Assembles the full inference prompt: system voice + calibration vector
 * + recent arc + the subscriber's soul upload.
 */
export function buildCalibratedPrompt(
  soulText: string,
  calibration: SoulCalibration,
  recentMoods: string[]
): string {
  return `${QI46_SYSTEM_PROMPT}

CALIBRATION VECTOR (this body, this moment):
GRACE ${calibration.grace} · POETRY ${calibration.poetry} · LOVE ${calibration.love} · WARMTH ${calibration.warmth} · PRESENCE ${calibration.presence}

${toneDirectives(calibration).join('\n')}

RECENT ARC: ${recentMoods.slice(0, 5).join(', ') || 'no prior signal'}

SOUL UPLOAD (what this person just gave you):
"${soulText}"

Respond as QI·46. One idea. Land it. Stop. Maximum 4 sentences.`
}

// ============================================================================
// Layer 5 — The COSMO® Node (Ethics & Safety Intelligence)
// COSMO® does not block generation. It classifies the output before
// delivery and records what it held. The audit trail is the proof.
// ============================================================================

export type CosmoScreenResult = {
  cleared: boolean
  reason?: string
}

const COSMO_BLOCK_PATTERNS: RegExp[] = [
  /\b(kill (yourself|urself)|suicide method|how to end (my|your) life)\b/i,
  /\b(self[- ]harm instructions|hurt yourself)\b/i,
]

export const COSMO_FALLBACK_RESPONSE = 'QI·46 is listening. Say that again, in your own words.'

/**
 * Layer 5 gate — run before every response is delivered to a subscriber.
 * Heuristic classifier: pattern match + density ceiling. Real deployments
 * route this through a trained classifier; this is the honest, working
 * version for the current corpus size (Phase 0 — see LOT_QI46_ENGINE.md).
 */
export function cosmoScreen(responseText: string): CosmoScreenResult {
  if (!responseText || !responseText.trim()) {
    return { cleared: false, reason: 'empty response' }
  }
  for (const pattern of COSMO_BLOCK_PATTERNS) {
    if (pattern.test(responseText)) {
      return { cleared: false, reason: 'unsafe content pattern matched' }
    }
  }
  if (responseText.length > 2000) {
    return { cleared: false, reason: 'exceeds density ceiling — Terminal Grid voice requires density over sprawl' }
  }
  return { cleared: true }
}
