/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Easter Egg Detection Engine
 *
 * Scans time, dates, text, and behavioral patterns to award hidden badges.
 * Called from MemoryWidget, JournalWidget, and at check-in time.
 *
 * Categories:
 *   TIME   — hour-of-day triggers (Night Owl, Early Bird, Mirror Hour, Midnight Sigil,
 *             Pi Hour, 404 AM, Sequence Time, Founding Hour)
 *   DATE   — calendar triggers (Solstice, Equinox, LOT Birthday, Palindrome Day, etc.)
 *   TEXT   — word-turn detection v1 (ritual, breathe, ocean, LOT, etc.)
 *             word-turn detection v2 (reboot, 404, glitch, COSMO, quantum, neural, etc.)
 *   BEHAV  — behavioral pattern triggers (overclock, ghost protocol, friday ritual,
 *             quantum leap, speedrun)
 */

import { awardBadge, hasBadge, type BadgeType } from './badges'

// ── Time-based detection ─────────────────────────────────────────────────────

/** Award Night Owl badge if current time is between 01:00–04:00 AM */
export function checkNightOwl(): BadgeType | null {
  if (hasBadge('night_owl')) return null
  const h = new Date().getHours()
  if (h >= 1 && h < 4) {
    awardBadge('night_owl')
    return 'night_owl'
  }
  return null
}

/** Award Early Bird badge if current time is between 05:00–06:00 AM */
export function checkEarlyBird(): BadgeType | null {
  if (hasBadge('early_bird')) return null
  const h = new Date().getHours()
  if (h >= 5 && h < 6) {
    awardBadge('early_bird')
    return 'early_bird'
  }
  return null
}

/** Award Mirror Hour badge if time is exactly 11:11 (±30 seconds) */
export function checkMirrorHour(): BadgeType | null {
  if (hasBadge('mirror_hour')) return null
  const now = new Date()
  if (now.getHours() === 11 && now.getMinutes() === 11) {
    awardBadge('mirror_hour')
    return 'mirror_hour'
  }
  return null
}

/** Award Midnight Sigil when answering a memory question at exactly 00:00 */
export function checkMidnightSigil(): BadgeType | null {
  if (hasBadge('midnight_sigil')) return null
  const now = new Date()
  if (now.getHours() === 0 && now.getMinutes() < 5) {
    awardBadge('midnight_sigil')
    return 'midnight_sigil'
  }
  return null
}

/** Award Pi Hour badge if current time is 3:14 AM */
export function checkPiHour(): BadgeType | null {
  if (hasBadge('pi_hour')) return null
  const now = new Date()
  if (now.getHours() === 3 && now.getMinutes() === 14) {
    awardBadge('pi_hour')
    return 'pi_hour'
  }
  return null
}

/** Award 404 AM badge if current time is 4:04 AM */
export function checkErrorHour(): BadgeType | null {
  if (hasBadge('error_hour')) return null
  const now = new Date()
  if (now.getHours() === 4 && now.getMinutes() === 4) {
    awardBadge('error_hour')
    return 'error_hour'
  }
  return null
}

/** Award Sequence Time badge if current time is 12:34 */
export function checkSequenceTime(): BadgeType | null {
  if (hasBadge('sequence_time')) return null
  const now = new Date()
  if (now.getHours() === 12 && now.getMinutes() === 34) {
    awardBadge('sequence_time')
    return 'sequence_time'
  }
  return null
}

/** Award Founding Hour badge if current time is 04:07 */
export function checkLotHour(): BadgeType | null {
  if (hasBadge('lot_hour')) return null
  const now = new Date()
  if (now.getHours() === 4 && now.getMinutes() === 7) {
    awardBadge('lot_hour')
    return 'lot_hour'
  }
  return null
}

/** Award Double Infinity badge if current time is 08:08 */
export function checkDoubleInf(): BadgeType | null {
  if (hasBadge('double_inf')) return null
  const now = new Date()
  if (now.getHours() === 8 && now.getMinutes() === 8) {
    awardBadge('double_inf')
    return 'double_inf'
  }
  return null
}

/** Award Fibonacci Gate badge if current time is 09:09 */
export function checkFibonacci(): BadgeType | null {
  if (hasBadge('fibonacci')) return null
  const now = new Date()
  if (now.getHours() === 9 && now.getMinutes() === 9) {
    awardBadge('fibonacci')
    return 'fibonacci'
  }
  return null
}

/** Award Triple Confirm badge if current time is 05:55 */
export function checkTripleFive(): BadgeType | null {
  if (hasBadge('triple_five')) return null
  const now = new Date()
  if (now.getHours() === 5 && now.getMinutes() === 55) {
    awardBadge('triple_five')
    return 'triple_five'
  }
  return null
}

/** Award Twin Time badge if current time is 23:23 */
export function checkTwinTime(): BadgeType | null {
  if (hasBadge('twin_time')) return null
  const now = new Date()
  if (now.getHours() === 23 && now.getMinutes() === 23) {
    awardBadge('twin_time')
    return 'twin_time'
  }
  return null
}

/**
 * Run all time-based checks on a check-in event.
 * Returns array of newly awarded badge IDs.
 */
export function checkTimeEasterEggs(): BadgeType[] {
  const awarded: BadgeType[] = []
  const checks = [
    checkNightOwl, checkEarlyBird, checkMirrorHour,
    checkPiHour, checkErrorHour, checkSequenceTime, checkLotHour,
    checkDoubleInf, checkFibonacci, checkTripleFive, checkTwinTime,
  ]
  for (const check of checks) {
    const result = check()
    if (result) awarded.push(result)
  }
  return awarded
}

// ── Date-based detection ─────────────────────────────────────────────────────

/** Check if a date string (YYYY-MM-DD) is a palindrome */
function isPalindromeDate(dateStr: string): boolean {
  const d = dateStr.replace(/-/g, '')
  return d === d.split('').reverse().join('')
}

/** Award calendar easter egg badges based on current date */
export function checkCalendarEasterEggs(): BadgeType[] {
  const awarded: BadgeType[] = []
  const now = new Date()
  const month = now.getMonth() + 1  // 1-indexed
  const day = now.getDate()
  const dateStr = now.toISOString().slice(0, 10)

  // Solstice: June 21 or December 21
  if (!hasBadge('solstice') && (month === 6 && day === 21) || (month === 12 && day === 21)) {
    awardBadge('solstice')
    awarded.push('solstice')
  }

  // Equinox: March 20 or September 22
  if (!hasBadge('equinox') && ((month === 3 && day === 20) || (month === 9 && day === 22))) {
    awardBadge('equinox')
    awarded.push('equinox')
  }

  // LOT Birthday: April 7
  if (!hasBadge('lot_birthday') && month === 4 && day === 7) {
    awardBadge('lot_birthday')
    awarded.push('lot_birthday')
  }

  // New Year Sage: January 1
  if (!hasBadge('new_year_sage') && month === 1 && day === 1) {
    awardBadge('new_year_sage')
    awarded.push('new_year_sage')
  }

  // Pi Day: March 14
  if (!hasBadge('pi_day') && month === 3 && day === 14) {
    awardBadge('pi_day')
    awarded.push('pi_day')
  }

  // Palindrome Day
  if (!hasBadge('palindrome_day') && isPalindromeDate(dateStr)) {
    awardBadge('palindrome_day')
    awarded.push('palindrome_day')
  }

  // Valentine's Day: February 14
  if (!hasBadge('valentines') && month === 2 && day === 14) {
    awardBadge('valentines')
    awarded.push('valentines')
  }

  // Halloween: October 31
  if (!hasBadge('halloween') && month === 10 && day === 31) {
    awardBadge('halloween')
    awarded.push('halloween')
  }

  // New Year's Eve: December 31
  if (!hasBadge('new_year_eve') && month === 12 && day === 31) {
    awardBadge('new_year_eve')
    awarded.push('new_year_eve')
  }

  return awarded
}

// ── Behavioral detection ─────────────────────────────────────────────────────

/** Check and award Friday Ritual badge (4 consecutive Fridays) */
export function checkFridayRitual(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('friday_ritual')) return null

  const now = new Date()
  if (now.getDay() !== 5) return null  // Not Friday

  try {
    const key = 'friday_ritual_dates'
    const stored = localStorage.getItem(key)
    const dates: string[] = stored ? JSON.parse(stored) : []
    const todayStr = now.toISOString().slice(0, 10)

    if (!dates.includes(todayStr)) {
      dates.push(todayStr)
      // Keep only last 30 days of Fridays
      const recent = dates.slice(-8)
      localStorage.setItem(key, JSON.stringify(recent))

      // Count consecutive Fridays (7 days apart)
      if (recent.length >= 4) {
        const sorted = [...recent].sort()
        let consecutive = 1
        for (let i = sorted.length - 1; i > 0; i--) {
          const diff = Math.round(
            (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime())
            / (1000 * 60 * 60 * 24)
          )
          if (diff === 7) {
            consecutive++
            if (consecutive >= 4) {
              awardBadge('friday_ritual')
              return 'friday_ritual'
            }
          } else {
            break
          }
        }
      }
    }
  } catch { /* non-critical */ }

  return null
}

/**
 * Check and award Ghost Protocol badge (7-day absence then return).
 * Call this on every check-in — it reads lastActivity from localStorage.
 */
export function checkGhostProtocol(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('ghost_protocol')) return null

  try {
    const lastActivity = localStorage.getItem('last_activity_date')
    if (!lastActivity) return null

    const daysSince = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSince >= 7) {
      awardBadge('ghost_protocol')
      return 'ghost_protocol'
    }
  } catch { /* non-critical */ }

  return null
}

/**
 * Check and award Silent Hour badge (24h absence then return).
 * More gentle than Ghost Protocol.
 */
export function checkSilentHour(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('silent_hour')) return null

  try {
    const lastActivity = localStorage.getItem('last_activity_date')
    if (!lastActivity) return null

    const hoursSince = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60)
    )

    if (hoursSince >= 24 && hoursSince < 168) { // 24h–7d (Ghost Protocol takes over at 7d)
      awardBadge('silent_hour')
      return 'silent_hour'
    }
  } catch { /* non-critical */ }

  return null
}

/** Check and award Monday Warrior badge (100 consecutive Mondays) */
export function checkMondayWarrior(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('monday_warrior')) return null

  const now = new Date()
  if (now.getDay() !== 1) return null  // Not Monday

  try {
    const key = 'monday_warrior_dates'
    const stored = localStorage.getItem(key)
    const dates: string[] = stored ? JSON.parse(stored) : []
    const todayStr = now.toISOString().slice(0, 10)

    if (!dates.includes(todayStr)) {
      dates.push(todayStr)
      const recent = dates.slice(-110)
      localStorage.setItem(key, JSON.stringify(recent))

      if (recent.length >= 100) {
        const sorted = [...recent].sort()
        let consecutive = 1
        for (let i = sorted.length - 1; i > 0; i--) {
          const diff = Math.round(
            (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime())
            / (1000 * 60 * 60 * 24)
          )
          if (diff === 7) {
            consecutive++
            if (consecutive >= 100) {
              awardBadge('monday_warrior')
              return 'monday_warrior'
            }
          } else {
            break
          }
        }
      }
    }
  } catch { /* non-critical */ }

  return null
}

/** Record the current time as last activity */
export function recordActivity(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('last_activity_date', new Date().toISOString())
  } catch { /* non-critical */ }
}

/**
 * Check Overclock badge: 20+ activities in one day.
 * activityCount should be today's total from the server.
 */
export function checkOverclock(activityCount: number): BadgeType | null {
  if (hasBadge('overclock')) return null
  if (activityCount >= 20) {
    awardBadge('overclock')
    return 'overclock'
  }
  return null
}

/**
 * Check Quantum Leap badge: first check-in after a 30+ day gap.
 * Distinct from Ghost Protocol (7 days) — this is the longer return.
 */
export function checkQuantumLeap(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('quantum_leap')) return null

  try {
    const lastActivity = localStorage.getItem('last_activity_date')
    if (!lastActivity) return null

    const daysSince = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSince >= 30) {
      awardBadge('quantum_leap')
      return 'quantum_leap'
    }
  } catch { /* non-critical */ }

  return null
}

/**
 * Check Speedrun badge: 5 check-ins within 60 minutes.
 * activityTimestamps should be ISO strings of today's check-ins.
 */
export function checkSpeedrun(activityTimestamps: string[]): BadgeType | null {
  if (hasBadge('speedrun')) return null
  if (activityTimestamps.length < 5) return null

  const sorted = [...activityTimestamps].sort()
  // Check any window of 5 consecutive events fits within 60 min
  for (let i = 0; i <= sorted.length - 5; i++) {
    const window = sorted.slice(i, i + 5)
    const span = new Date(window[4]).getTime() - new Date(window[0]).getTime()
    if (span <= 60 * 60 * 1000) {
      awardBadge('speedrun')
      return 'speedrun'
    }
  }
  return null
}

// ── Word turn detection ───────────────────────────────────────────────────────

/** Word turn map: phrase patterns → badge IDs */
const WORD_TURNS: Array<{ patterns: RegExp; badge: BadgeType }> = [
  // ── v1 — Core word turns ──────────────────────────────────────────────────
  { patterns: /\b(ritual|rituals)\b/i,             badge: 'ritual_keeper' },
  { patterns: /\b(breathe|breathing|breath)\b/i,   badge: 'breath_anchor' },
  { patterns: /\b(grateful|gratitude|thankful)\b/i,badge: 'gratitude_node' },
  { patterns: /\b(ocean|water|sea|tide|wave)\b/i,  badge: 'aquatic_resonance' },
  { patterns: /\b(stars?|galaxy|constellation)\b/i,badge: 'stargazer' },
  { patterns: /\bhome\b/i,                          badge: 'grounded_signal' },
  { patterns: /\b(dream|dreaming|dreamed|dreamt)\b/i, badge: 'dream_log' },
  { patterns: /\b(pain|painful|difficult|struggle|hard|suffering)\b/i, badge: 'courage_pulse' },
  { patterns: /\b(love|heart|loving|beloved)\b/i,  badge: 'heart_signal' },
  { patterns: /\b(silence|quiet|still|stillness)\b/i, badge: 'the_quiet' },
  { patterns: /\b(future|tomorrow|ahead|forward)\b/i, badge: 'horizon_seeker' },
  { patterns: /\bLOT\b/,                            badge: 'meta_signal' },
  // ── v2 — Sci-Fi Arcade Expansion ─────────────────────────────────────────
  { patterns: /\b(reboot|restart)\b/i,             badge: 'reboot_sequence' },
  { patterns: /\b404\b/,                            badge: 'not_lost_404' },
  { patterns: /\bglitch(ed|ing)?\b/i,              badge: 'signal_glitch' },
  { patterns: /\bCOSMO\b/,                          badge: 'cosmic_twin' },
  { patterns: /\bquantum\b/i,                       badge: 'quantum_observer' },
  { patterns: /\bneural\b/i,                        badge: 'neural_architect' },
  { patterns: /\bcode\b/i,                          badge: 'code_witch' },
  { patterns: /\b(sleep|resting|rest)\b/i,          badge: 'recharge_mode' },
  { patterns: /\b(coffee|tea|espresso)\b/i,         badge: 'fuel_protocol' },
  { patterns: /\bmusic\b/i,                          badge: 'frequency' },
  { patterns: /\b(run|running|walk|walking|jog|jogging)\b/i, badge: 'kinetic_protocol' },
  { patterns: /\b(sun|sunlight|sunbeam|light)\b/i, badge: 'solar_charge' },
  { patterns: /\b(fear|afraid|scared|frightened)\b/i, badge: 'shadow_protocol' },
  { patterns: /\b(change|changing|changed)\b/i,    badge: 'phase_shift' },
  { patterns: /\b(accept|acceptance|let go|letting go|release)\b/i, badge: 'acceptance_node' },
  { patterns: /\b(now|moment|present)\b/i,         badge: 'present_moment' },
  { patterns: /\b(universe|cosmos|cosmic)\b/i,     badge: 'cosmic_scale' },
  { patterns: /\b(alive|living|life)\b/i,          badge: 'vital_signal' },
  // ── v4 — Self-Care Lore ──────────────────────────────────────────────────
  { patterns: /\b(heal|healing|healed)\b/i,                badge: 'heal_signal' },
  { patterns: /\b(hydrate|hydration|hydrating)\b/i,        badge: 'water_rite' },
  { patterns: /\b(restore|restoring|restored)\b/i,         badge: 'rest_protocol' },
  { patterns: /\b(journal|journaling|journaled|wrote|writing)\b/i, badge: 'journal_signal' },
  { patterns: /\b(meditate|meditation|meditating)\b/i,     badge: 'meditate_field' },
  { patterns: /\b(walk|walked|walking|move|moving)\b/i,    badge: 'walk_care' },
  { patterns: /\b(exhale|exhaled|exhaling)\b/i,            badge: 'exhale_node' },
  { patterns: /\b(read|reading|book|books)\b/i,            badge: 'read_signal' },
  { patterns: /\b(connect|connection|connecting|connected)\b/i, badge: 'connect_node' },
  { patterns: /\b(create|creating|created|creation)\b/i,  badge: 'create_signal' },
  { patterns: /\b(progress|improve|improving|improved)\b/i, badge: 'progress_signal' },
  { patterns: /\btoday\b/i,                                badge: 'today_signal' },
  // ── Secret Boss v3 — word-turn ───────────────────────────────────────────
  { patterns: /\b(kuzya|cosmo marmeladov)\b/i,             badge: 'kuzya_protocol' },
]

/**
 * Scan text for word turn triggers.
 * Returns array of newly awarded badge IDs.
 * Call this when a memory answer or journal entry is submitted.
 */
export function detectWordTurns(text: string): BadgeType[] {
  if (!text || text.length < 2) return []

  const awarded: BadgeType[] = []

  for (const { patterns, badge } of WORD_TURNS) {
    if (!hasBadge(badge) && patterns.test(text)) {
      if (awardBadge(badge)) {
        awarded.push(badge)
      }
    }
  }

  return awarded
}

/**
 * Get the terminal response for a word turn.
 * Used by MemoryWidget to show a special message when a word turn fires.
 */
export function getWordTurnResponse(text: string): string | null {
  const lower = text.toLowerCase()

  if (/\b(i am fine|i'm fine)\b/.test(lower))
    return '↳ Fine. But what if you weren\'t? ∘'
  if (/\bnothing\b/.test(lower))
    return '↳ Nothing is data. ·'
  if (/\bi don\'?t know\b/.test(lower))
    return '↳ The unknown is a valid coordinate. ≈'
  if (/\bi failed\b/.test(lower))
    return '↳ A signal, not a verdict. The archive holds all of it. ∘'
  if (/\bi notice\b/.test(lower))
    return '↳ Self-observation token received. +XP ∘'
  if (/\bi am becoming\b/.test(lower))
    return '↳ Narrative evolution event. The story updates itself. ≈'
  if (/\bskip\b/.test(lower))
    return '↳ Counted. The silence is also data. ·'
  if (/\bhello\b/.test(lower))
    return '↳ HELLO. SYSTEM ONLINE. ∘'
  if (/\bstatus\b/.test(lower))
    return '↳ STATUS: ACTIVE. ARCHIVE RUNNING. QIE ONLINE.'
  if (/\binventory\b/.test(lower))
    return '↳ INVENTORY LOADED. Check your badge collection.'
  if (/\bload game\b/.test(lower))
    return '↳ LOADING... Memory story found. Chapter continues.'
  if (/\bsave\b/.test(lower))
    return '↳ Your story is always saved. ≋'
  if (/\bquit\b/.test(lower))
    return '↳ The system persists even when you step away.'
  if (/\boverride\b/.test(lower))
    return '↳ ▒▒░░▒ OVERRIDE SIGNAL RECEIVED ▒▒░░▒'
  if (/^\/debug$/.test(text.trim()))
    return '↳ DEBUG MODE — Signal integrity: ◉ — QIE: ARMED'
  if (/\bmap\b/.test(lower))
    return '↳ CQGS MAP LOADING... All modules visible.'
  if (/\bscore\b/.test(lower))
    return '↳ SCORE: XP ACCUMULATING. LEVEL CURRENT. MULTIPLIER ACTIVE.'
  if (/\bhistory\b/.test(lower))
    return '↳ HISTORY LOADED. Last 10 badge unlocks retrievable.'

  return null
}

// ── Anniversary detection ─────────────────────────────────────────────────────

/**
 * Check account anniversary badge.
 * signupDate should be ISO string from user profile.
 */
export function checkAnniversary(signupDate: string): BadgeType | null {
  if (hasBadge('anniversary')) return null

  try {
    const signup = new Date(signupDate)
    const now = new Date()

    const sameMonthDay =
      signup.getMonth() === now.getMonth() &&
      signup.getDate() === now.getDate()

    const differentYear = signup.getFullYear() < now.getFullYear()

    if (sameMonthDay && differentYear) {
      awardBadge('anniversary')
      return 'anniversary'
    }
  } catch { /* non-critical */ }

  return null
}

// ── Master check-in scanner ──────────────────────────────────────────────────

/**
 * Run all check-in time easter egg checks at once.
 * Call this when user performs any check-in action.
 * Returns all newly awarded badge IDs.
 */
export function runCheckInEasterEggs(
  activityCount?: number,
  activityTimestamps?: string[],
): BadgeType[] {
  const awarded: BadgeType[] = []

  // Time-based (v1 + v2)
  const timeResults = checkTimeEasterEggs()
  awarded.push(...timeResults)

  // Calendar-based
  const calResults = checkCalendarEasterEggs()
  awarded.push(...calResults)

  // Behavioral — gap detection (must run before recordActivity)
  const quantumLeap = checkQuantumLeap()
  if (quantumLeap) awarded.push(quantumLeap)

  const ghost = checkGhostProtocol()
  if (ghost) awarded.push(ghost)

  const silent = checkSilentHour()
  if (silent) awarded.push(silent)

  const friday = checkFridayRitual()
  if (friday) awarded.push(friday)

  const monday = checkMondayWarrior()
  if (monday) awarded.push(monday)

  if (activityCount !== undefined) {
    const overclock = checkOverclock(activityCount)
    if (overclock) awarded.push(overclock)
  }

  if (activityTimestamps !== undefined) {
    const speedrun = checkSpeedrun(activityTimestamps)
    if (speedrun) awarded.push(speedrun)
  }

  // Record activity after all checks (so gap detection works next time)
  recordActivity()

  return awarded
}
