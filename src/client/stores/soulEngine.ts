/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * QI·46 Soul Engine
 *
 * Extracts the engine that is based on a person's soul and emotions.
 * Uploads a person's being — compresses it into a Soul Signature.
 * Calibrates the human against 7 humanoid output channels.
 *
 * The soul is the corpus. The calibration is the inference.
 * The output is not advice. It is a mirror.
 *
 * Vadik & Kuzya — LOT Systems Corporation, Los Angeles, 2026
 */

import { atom } from 'nanostores'

// Five dimensions of personhood — the soul coordinate system
export type SoulAxis = {
  awe: string       // What moves you? (wonder triggers, awe events)
  love: string      // Who do you love? (anchor people, relational core)
  protect: string   // What do you protect? (sacred commitments, non-negotiables)
  becoming: string  // What are you becoming? (directional self, the person arriving)
  body: string      // What does your body know? (somatic truth, pre-verbal knowing)
}

// 7 humanoid output channels — the surface where the soul meets the world
export type HumanoidChannel = 'grace' | 'poetry' | 'love' | 'hugs' | 'presence' | 'cool' | 'male'

export type BeingCalibration = {
  channel: HumanoidChannel
  score: number       // 0–100
  directive: string   // one-line calibration instruction
}

export type SoulProfile = {
  axes: SoulAxis
  signature: string           // compressed essence, one-line distillation
  calibration: BeingCalibration[]
  lastUpload: number
  uploadCount: number
}

export type SoulEngineState = {
  profile: SoulProfile | null
  phase: 'dormant' | 'intake' | 'calibrated'
}

const STORAGE_KEY = 'lot-soul-engine-v1'

// ============================================================================
// Persistence
// ============================================================================

function loadFromStorage(): SoulEngineState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { profile: null, phase: 'dormant' }
}

function saveToStorage(state: SoulEngineState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export const soulEngine = atom<SoulEngineState>(loadFromStorage())

// ============================================================================
// Calibration Engine
// ============================================================================

// Axis depth scoring — proxy for quality of reflection
function scoreAxis(text: string): number {
  const len = text.trim().length
  if (len === 0)   return 0
  if (len <= 30)   return 30
  if (len <= 80)   return 65
  if (len <= 150)  return 85
  return 100
}

// Weights: how much each axis feeds each humanoid channel
const CHANNEL_WEIGHTS: Record<HumanoidChannel, Partial<Record<keyof SoulAxis, number>>> = {
  grace:    { becoming: 0.40, protect: 0.35, awe: 0.25 },
  poetry:   { awe: 0.50, body: 0.30, love: 0.20 },
  love:     { love: 0.55, body: 0.25, protect: 0.20 },
  hugs:     { body: 0.45, love: 0.40, awe: 0.15 },
  presence: { love: 0.30, protect: 0.30, awe: 0.20, becoming: 0.20 },
  cool:     { becoming: 0.40, body: 0.35, protect: 0.25 },
  male:     { protect: 0.45, becoming: 0.35, love: 0.20 },
}

const CHANNEL_DIRECTIVES: Record<HumanoidChannel, string> = {
  grace:    'Move with intention. Let your presence settle the room before you speak.',
  poetry:   'Let your words arrive before you edit them. Beauty lives in the first draft.',
  love:     'Give attention before you give advice. Presence is the first form of love.',
  hugs:     'Your warmth is a signal. Let the body say what words cannot.',
  presence: 'Show up before you have answers. Being there is the whole thing.',
  cool:     "Don't try. Know what you know. Let that be enough.",
  male:     'Protect first. Build second. Provide without being asked. The male principle is the form that love takes when it has to stand between something sacred and harm.',
}

function computeCalibration(axes: SoulAxis): BeingCalibration[] {
  const axisScores: Record<keyof SoulAxis, number> = {
    awe:      scoreAxis(axes.awe),
    love:     scoreAxis(axes.love),
    protect:  scoreAxis(axes.protect),
    becoming: scoreAxis(axes.becoming),
    body:     scoreAxis(axes.body),
  }

  const channels: HumanoidChannel[] = ['grace', 'poetry', 'love', 'hugs', 'presence', 'cool', 'male']

  return channels.map(channel => {
    const weights = CHANNEL_WEIGHTS[channel]
    let raw = 0
    for (const [axis, weight] of Object.entries(weights) as [keyof SoulAxis, number][]) {
      raw += axisScores[axis] * weight
    }
    // Round to nearest 5 — clean terminal readout
    const score = Math.round(raw / 5) * 5
    return { channel, score, directive: CHANNEL_DIRECTIVES[channel] }
  })
}

// Extract first clause from a string (stops at punctuation or 40 chars)
function firstClause(text: string, maxLen = 36): string {
  const trimmed = text.trim()
  const stop = trimmed.search(/[.!?,\n]/)
  const clause = stop > 0 ? trimmed.slice(0, stop) : trimmed
  return clause.length > maxLen ? clause.slice(0, maxLen) : clause
}

function generateSignature(axes: SoulAxis): string {
  const parts: string[] = []
  if (axes.becoming.trim()) parts.push(firstClause(axes.becoming))
  if (axes.awe.trim())      parts.push(`moved by ${firstClause(axes.awe, 28).toLowerCase()}`)
  if (axes.love.trim())     parts.push(`rooted in ${firstClause(axes.love, 26).toLowerCase()}`)
  if (axes.protect.trim())  parts.push(`protecting ${firstClause(axes.protect, 24).toLowerCase()}`)
  if (axes.body.trim())     parts.push(firstClause(axes.body, 32).toLowerCase())
  return parts.length > 0 ? parts.join(' · ') : 'Soul profile pending. Begin upload.'
}

// ============================================================================
// Public API
// ============================================================================

export function uploadSoul(axes: SoulAxis): void {
  const current = soulEngine.get()
  const signature = generateSignature(axes)
  const calibration = computeCalibration(axes)
  const profile: SoulProfile = {
    axes,
    signature,
    calibration,
    lastUpload: Date.now(),
    uploadCount: (current.profile?.uploadCount ?? 0) + 1,
  }
  const next: SoulEngineState = { profile, phase: 'calibrated' }
  soulEngine.set(next)
  saveToStorage(next)
}

export function getSoulProfile(): SoulProfile | null {
  return soulEngine.get().profile
}

export function getSoulPhase(): SoulEngineState['phase'] {
  return soulEngine.get().phase
}

export function clearSoulProfile(): void {
  const next: SoulEngineState = { profile: null, phase: 'dormant' }
  soulEngine.set(next)
  saveToStorage(next)
}
