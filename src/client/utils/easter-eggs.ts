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

// ── Time v5 — Mirror & Math ──────────────────────────────────────────────────

/** Award Digital Symmetry badge if current time is 10:10 */
export function checkDigitalSymmetry(): BadgeType | null {
  if (hasBadge('digital_symmetry')) return null
  const now = new Date()
  if (now.getHours() === 10 && now.getMinutes() === 10) {
    awardBadge('digital_symmetry')
    return 'digital_symmetry'
  }
  return null
}

/** Award Sequential Boot badge if current time is 01:23 */
export function checkSeqBoot(): BadgeType | null {
  if (hasBadge('seq_boot')) return null
  const now = new Date()
  if (now.getHours() === 1 && now.getMinutes() === 23) {
    awardBadge('seq_boot')
    return 'seq_boot'
  }
  return null
}

/** Award Palindrome Time badge if current time is 21:12 */
export function checkPalindromeTime(): BadgeType | null {
  if (hasBadge('palindrome_time')) return null
  const now = new Date()
  if (now.getHours() === 21 && now.getMinutes() === 12) {
    awardBadge('palindrome_time')
    return 'palindrome_time'
  }
  return null
}

/** Award Tau Signal badge if current time is 06:28 (τ = 2π ≈ 6.28) */
export function checkTauSignal(): BadgeType | null {
  if (hasBadge('tau_signal')) return null
  const now = new Date()
  if (now.getHours() === 6 && now.getMinutes() === 28) {
    awardBadge('tau_signal')
    return 'tau_signal'
  }
  return null
}

// ── Time v6 — Infinite Loop ───────────────────────────────────────────────────

/** Award Nine Lives badge if current time is 09:09 */
export function checkNineLives(): BadgeType | null {
  if (hasBadge('nine_lives')) return null
  const now = new Date()
  if (now.getHours() === 9 && now.getMinutes() === 9) {
    awardBadge('nine_lives')
    return 'nine_lives'
  }
  return null
}

/** Award Hex Hour badge if current time is 16:16 (0x10:0x10) */
export function checkHexHour(): BadgeType | null {
  if (hasBadge('hex_hour')) return null
  const now = new Date()
  if (now.getHours() === 16 && now.getMinutes() === 16) {
    awardBadge('hex_hour')
    return 'hex_hour'
  }
  return null
}

/** Award Final Frame badge if current time is 23:59 */
export function checkFinalFrame(): BadgeType | null {
  if (hasBadge('final_frame')) return null
  const now = new Date()
  if (now.getHours() === 23 && now.getMinutes() === 59) {
    awardBadge('final_frame')
    return 'final_frame'
  }
  return null
}

/** Award Year Signal badge if current time is 20:26 (LOT founding year) */
export function checkYearSignal(): BadgeType | null {
  if (hasBadge('year_signal')) return null
  const now = new Date()
  if (now.getHours() === 20 && now.getMinutes() === 26) {
    awardBadge('year_signal')
    return 'year_signal'
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
    checkDigitalSymmetry, checkSeqBoot, checkPalindromeTime, checkTauSignal,
    checkNineLives, checkHexHour, checkFinalFrame, checkYearSignal,
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

  // ── Calendar v4 — Nerd & Cosmic ────────────────────────────────────────────

  // Signal Wars: May 4 — Star Wars Day
  if (!hasBadge('signal_wars') && month === 5 && day === 4) {
    awardBadge('signal_wars')
    awarded.push('signal_wars')
  }

  // Programmer's Day: Sep 12 or 13 (day 256 in non-leap/leap years)
  if (!hasBadge('prog_day') && month === 9 && (day === 12 || day === 13)) {
    awardBadge('prog_day')
    awarded.push('prog_day')
  }

  // Ada Protocol: December 9 — Ada Lovelace Day
  if (!hasBadge('ada_protocol') && month === 12 && day === 9) {
    awardBadge('ada_protocol')
    awarded.push('ada_protocol')
  }

  // ── Calendar v5 ────────────────────────────────────────────────────────────

  // Groundhog Loop: February 2
  if (!hasBadge('groundhog_loop') && month === 2 && day === 2) {
    awardBadge('groundhog_loop')
    awarded.push('groundhog_loop')
  }

  // Binary Day: October 10
  if (!hasBadge('binary_day') && month === 10 && day === 10) {
    awardBadge('binary_day')
    awarded.push('binary_day')
  }

  // Fibonacci Day: November 23 (1,1,2,3)
  if (!hasBadge('fibonacci_day') && month === 11 && day === 23) {
    awardBadge('fibonacci_day')
    awarded.push('fibonacci_day')
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

// ── Behavioral v4 — Deep Archive ─────────────────────────────────────────────

/**
 * Check Night Scribe badge: journal entry submitted after 23:30.
 * Call this when a journal entry is saved.
 */
export function checkNightScribe(): BadgeType | null {
  if (hasBadge('night_scribe')) return null
  const now = new Date()
  // After 23:30 or before 00:30 (deep night window)
  if (now.getHours() === 23 && now.getMinutes() >= 30) {
    awardBadge('night_scribe')
    return 'night_scribe'
  }
  return null
}

/**
 * Check Epic Transmission badge: memory answer ≥1,000 characters.
 * Call this when a memory answer is submitted.
 */
export function checkEpicTransmission(answerText: string): BadgeType | null {
  if (hasBadge('epic_transmission')) return null
  if (answerText.length >= 1000) {
    awardBadge('epic_transmission')
    return 'epic_transmission'
  }
  return null
}

/**
 * Check Analog Reboot badge: return after a 180+ day gap.
 * Distinct from Ghost Protocol (7d) and Quantum Leap (30d).
 */
export function checkAnalogReboot(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('analog_reboot')) return null

  try {
    const lastActivity = localStorage.getItem('last_activity_date')
    if (!lastActivity) return null

    const daysSince = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSince >= 180) {
      awardBadge('analog_reboot')
      return 'analog_reboot'
    }
  } catch { /* non-critical */ }

  return null
}

// ── Behavioral v5 ────────────────────────────────────────────────────────────

/**
 * Check Deep Scribe badge: journal entry ≥500 characters.
 * Call this when a journal entry is saved.
 */
export function checkDeepScribe(journalText: string): BadgeType | null {
  if (hasBadge('deep_scribe')) return null
  if (journalText.length >= 500) {
    awardBadge('deep_scribe')
    return 'deep_scribe'
  }
  return null
}

/**
 * Check Phoenix Streak badge: user rebuilt a streak after it broke.
 * Call this when a streak is restored (previousStreak was 0, currentStreak > 0 again).
 * streakBroke: was the streak at 0 recently (from stats)
 */
export function checkPhoenixStreak(previousStreakBroke: boolean, currentStreak: number): BadgeType | null {
  if (hasBadge('phoenix_streak')) return null
  if (previousStreakBroke && currentStreak >= 3) {
    awardBadge('phoenix_streak')
    return 'phoenix_streak'
  }
  return null
}

/**
 * Check Time Anchor badge: check-in at the same clock hour 14 consecutive days.
 * Stores hourly check-in history in localStorage.
 * Call this on every check-in.
 */
export function checkTimeAnchor(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('time_anchor')) return null

  try {
    const now = new Date()
    const hour = now.getHours()
    const todayStr = now.toISOString().slice(0, 10)
    const key = 'time_anchor_log'
    const stored = localStorage.getItem(key)
    const log: Array<{ date: string; hour: number }> = stored ? JSON.parse(stored) : []

    // Only log once per day
    const todayEntry = log.find(e => e.date === todayStr)
    if (!todayEntry) {
      log.push({ date: todayStr, hour })
      // Keep only last 20 days
      const recent = log.slice(-20)
      localStorage.setItem(key, JSON.stringify(recent))

      // Count consecutive days at the same hour
      if (recent.length >= 14) {
        const sorted = [...recent].sort((a, b) => a.date.localeCompare(b.date))
        let consecutive = 1
        const anchorHour = sorted[sorted.length - 1].hour
        for (let i = sorted.length - 1; i > 0; i--) {
          const prev = sorted[i - 1]
          const curr = sorted[i]
          const dayDiff = Math.round(
            (new Date(curr.date).getTime() - new Date(prev.date).getTime())
            / (1000 * 60 * 60 * 24)
          )
          if (dayDiff === 1 && prev.hour === anchorHour) {
            consecutive++
            if (consecutive >= 14) {
              awardBadge('time_anchor')
              return 'time_anchor'
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
  // ── v5 — Signal Codex ────────────────────────────────────────────────────
  { patterns: /\bsolitude\b/i,                      badge: 'solitude_mode' },
  { patterns: /\bwonder(ed|ing|s)?\b/i,             badge: 'wonder_protocol' },
  { patterns: /\bphoenix\b/i,                       badge: 'phoenix_sequence' },
  { patterns: /\b(align|aligned|aligning|alignment)\b/i, badge: 'alignment_lock' },
  { patterns: /\b(witness|witnessed|witnessing)\b/i,badge: 'witness_log' },
  { patterns: /\b(orbit|orbits|orbiting|orbital)\b/i, badge: 'orbital_pattern' },
  { patterns: /\b(forge|forged|forging)\b/i,        badge: 'forge_protocol' },
  { patterns: /\bmind\b/i,                           badge: 'neuro_link' },
  { patterns: /\b(light|lights|lit)\b/i,             badge: 'photon_signal' },
  { patterns: /\b(energy|energized|energetic)\b/i,  badge: 'field_charge' },
  { patterns: /\b(voyage|voyaging)\b/i,              badge: 'voyage_mode' },
  { patterns: /\bgravity\b/i,                        badge: 'gravity_lock' },
  // ── v6 — The Becoming Lexicon ────────────────────────────────────────────
  { patterns: /\b(surrender|surrendered|surrendering)\b/i, badge: 'surrender_signal' },
  { patterns: /\b(restore|restored|restoring|restoration)\b/i, badge: 'restore_protocol' },
  { patterns: /\b(anchor|anchored|anchoring)\b/i,   badge: 'anchor_lock' },
  { patterns: /\bthreshold\b/i,                      badge: 'threshold_gate' },
  { patterns: /\b(emerge|emerged|emerging|emergence)\b/i, badge: 'emergence_sequence' },
  { patterns: /\b(exhale|exhaled|exhaling)\b/i,      badge: 'exhale_wave' },
  { patterns: /\b(clear|cleared|clearing|clarity)\b/i, badge: 'clear_field' },
  { patterns: /\b(rise|risen|rising|arose)\b/i,      badge: 'rise_signal' },
  { patterns: /\b(presence|present)\b/i,             badge: 'presence_core' },
  { patterns: /\bbold\b/i,                           badge: 'bold_protocol' },
  { patterns: /\b(trust|trusted|trusting)\b/i,       badge: 'trust_lock' },
  { patterns: /\b(shift|shifted|shifting)\b/i,       badge: 'shift_sequence' },
  // ── Secret Boss word triggers ─────────────────────────────────────────────
  { patterns: /\bi am lot\b/i,                       badge: 'i_am_lot' },
  { patterns: /\bmalibu\b/i,                         badge: 'malibu' },
  { patterns: /\bkuzya\b/i,                          badge: 'the_cat_knows' },
  { patterns: /\b0451\b/,                            badge: 'key_code' },
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

  // Time-based (v1 + v2 + v5 + v6)
  const timeResults = checkTimeEasterEggs()
  awarded.push(...timeResults)

  // Calendar-based (v1 + v4 + v5)
  const calResults = checkCalendarEasterEggs()
  awarded.push(...calResults)

  // Behavioral — gap detection (must run before recordActivity)
  const quantumLeap = checkQuantumLeap()
  if (quantumLeap) awarded.push(quantumLeap)

  const ghost = checkGhostProtocol()
  if (ghost) awarded.push(ghost)

  const silent = checkSilentHour()
  if (silent) awarded.push(silent)

  // Behavioral v4: analog reboot (180+ day gap)
  const analogReboot = checkAnalogReboot()
  if (analogReboot) awarded.push(analogReboot)

  const friday = checkFridayRitual()
  if (friday) awarded.push(friday)

  if (activityCount !== undefined) {
    const overclock = checkOverclock(activityCount)
    if (overclock) awarded.push(overclock)
  }

  if (activityTimestamps !== undefined) {
    const speedrun = checkSpeedrun(activityTimestamps)
    if (speedrun) awarded.push(speedrun)
  }

  // Behavioral v5: time anchor (same hour 14 consecutive days)
  const timeAnchor = checkTimeAnchor()
  if (timeAnchor) awarded.push(timeAnchor)

  // Record activity after all checks (so gap detection works next time)
  recordActivity()

  return awarded
}

/**
 * Run journal-submit easter egg checks.
 * Call this when a journal entry is saved, passing the entry text.
 * Returns all newly awarded badge IDs.
 */
export function runJournalEasterEggs(journalText: string): BadgeType[] {
  const awarded: BadgeType[] = []

  // Behavioral v4: night scribe
  const nightScribe = checkNightScribe()
  if (nightScribe) awarded.push(nightScribe)

  // Behavioral v5: deep scribe (≥500 chars)
  const deepScribe = checkDeepScribe(journalText)
  if (deepScribe) awarded.push(deepScribe)

  // Word turns from journal text
  const wordTurns = detectWordTurns(journalText)
  awarded.push(...wordTurns)

  return awarded
}

/**
 * Run memory-answer easter egg checks.
 * Call this when a memory answer is submitted, passing the answer text.
 * Returns all newly awarded badge IDs.
 */
export function runMemoryAnswerEasterEggs(answerText: string): BadgeType[] {
  const awarded: BadgeType[] = []

  // Behavioral v4: epic transmission (≥1,000 chars)
  const epicTransmission = checkEpicTransmission(answerText)
  if (epicTransmission) awarded.push(epicTransmission)

  // Midnight sigil
  const midnight = checkMidnightSigil()
  if (midnight) awarded.push(midnight)

  // Word turns from answer text
  const wordTurns = detectWordTurns(answerText)
  awarded.push(...wordTurns)

  return awarded
}
