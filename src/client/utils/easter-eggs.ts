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

// ── Time v3 ──────────────────────────────────────────────────────────────────

/** Award Lucky Signal badge at 07:07 */
export function checkLuckySignal(): BadgeType | null {
  if (hasBadge('lucky_signal')) return null
  const now = new Date()
  if (now.getHours() === 7 && now.getMinutes() === 7) {
    awardBadge('lucky_signal')
    return 'lucky_signal'
  }
  return null
}

/** Award New Day Proto badge at 00:01 (first minute of day) */
export function checkNewDayProto(): BadgeType | null {
  if (hasBadge('new_day_proto')) return null
  const now = new Date()
  if (now.getHours() === 0 && now.getMinutes() === 1) {
    awardBadge('new_day_proto')
    return 'new_day_proto'
  }
  return null
}

/** Award Double Down badge at 22:22 */
export function checkDoubleDown(): BadgeType | null {
  if (hasBadge('double_down')) return null
  const now = new Date()
  if (now.getHours() === 22 && now.getMinutes() === 22) {
    awardBadge('double_down')
    return 'double_down'
  }
  return null
}

/** Award Leet Signal badge at 13:37 */
export function checkLeetSignal(): BadgeType | null {
  if (hasBadge('leet_signal')) return null
  const now = new Date()
  if (now.getHours() === 13 && now.getMinutes() === 37) {
    awardBadge('leet_signal')
    return 'leet_signal'
  }
  return null
}

// ── Time v4 ──────────────────────────────────────────────────────────────────

/** Award Double Infinity badge at 08:08 */
export function checkDoubleInf(): BadgeType | null {
  if (hasBadge('double_inf')) return null
  const now = new Date()
  if (now.getHours() === 8 && now.getMinutes() === 8) {
    awardBadge('double_inf')
    return 'double_inf'
  }
  return null
}

/** Award Fibonacci badge at 09:09 */
export function checkFibonacci(): BadgeType | null {
  if (hasBadge('fibonacci')) return null
  const now = new Date()
  if (now.getHours() === 9 && now.getMinutes() === 9) {
    awardBadge('fibonacci')
    return 'fibonacci'
  }
  return null
}

/** Award Triple Five badge at 05:55 */
export function checkTripleFive(): BadgeType | null {
  if (hasBadge('triple_five')) return null
  const now = new Date()
  if (now.getHours() === 5 && now.getMinutes() === 55) {
    awardBadge('triple_five')
    return 'triple_five'
  }
  return null
}

/** Award Twin Time badge at 23:23 */
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
    // v1
    checkNightOwl, checkEarlyBird, checkMirrorHour, checkMidnightSigil,
    checkPiHour, checkErrorHour, checkSequenceTime, checkLotHour,
    // v3
    checkLuckySignal, checkNewDayProto, checkDoubleDown, checkLeetSignal,
    // v4
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

  // ── Calendar v2 ────────────────────────────────────────────────────────────

  // COSMO Birthday: July 1
  if (!hasBadge('cosmo_bday') && month === 7 && day === 1) {
    awardBadge('cosmo_bday')
    awarded.push('cosmo_bday')
  }

  // Leap Day: February 29
  if (!hasBadge('leap_day') && month === 2 && day === 29) {
    awardBadge('leap_day')
    awarded.push('leap_day')
  }

  // ── Calendar v3 ────────────────────────────────────────────────────────────

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

// ── Behavioral v2+v3 ─────────────────────────────────────────────────────────

/**
 * Check Trio Protocol: 3 consecutive daily check-ins.
 * Reads/writes check-in dates to localStorage.
 */
export function checkTrioProtocol(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('trio_protocol')) return null

  try {
    const key = 'daily_checkin_dates'
    const stored = localStorage.getItem(key)
    const dates: string[] = stored ? JSON.parse(stored) : []
    const todayStr = new Date().toISOString().slice(0, 10)

    if (!dates.includes(todayStr)) {
      dates.push(todayStr)
      localStorage.setItem(key, JSON.stringify(dates.slice(-10)))
    }

    if (dates.length >= 3) {
      const sorted = [...dates].sort()
      for (let i = sorted.length - 1; i >= 2; i--) {
        const d2 = new Date(sorted[i]).getTime()
        const d1 = new Date(sorted[i - 1]).getTime()
        const d0 = new Date(sorted[i - 2]).getTime()
        const day = 86400000
        if (d2 - d1 === day && d1 - d0 === day) {
          awardBadge('trio_protocol')
          return 'trio_protocol'
        }
      }
    }
  } catch { /* non-critical */ }

  return null
}

/**
 * Check Deep Session badge: 10+ answers in a single session.
 * sessionAnswerCount is the number of questions answered this session.
 */
export function checkDeepSession(sessionAnswerCount: number): BadgeType | null {
  if (hasBadge('deep_session')) return null
  if (sessionAnswerCount >= 10) {
    awardBadge('deep_session')
    return 'deep_session'
  }
  return null
}

/**
 * Check Comeback Kid badge: return after 90+ day gap.
 * More extreme than Quantum Leap (30d) and Ghost Protocol (7d).
 */
export function checkComebackKid(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('comeback_kid')) return null

  try {
    const lastActivity = localStorage.getItem('last_activity_date')
    if (!lastActivity) return null

    const daysSince = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSince >= 90) {
      awardBadge('comeback_kid')
      return 'comeback_kid'
    }
  } catch { /* non-critical */ }

  return null
}

/**
 * Check Birthday Protocol: check-in on user's own birthday.
 * userBirthdate should be ISO string (YYYY-MM-DD) from profile.
 */
export function checkBirthdayProtocol(userBirthdate: string | null | undefined): BadgeType | null {
  if (!userBirthdate) return null
  if (hasBadge('birthday_protocol')) return null

  try {
    const bday = new Date(userBirthdate)
    const now = new Date()
    if (bday.getMonth() === now.getMonth() && bday.getDate() === now.getDate()) {
      awardBadge('birthday_protocol')
      return 'birthday_protocol'
    }
  } catch { /* non-critical */ }

  return null
}

/**
 * Check Flow State badge: 5+ consecutive answers without interruption.
 * consecutiveAnswers tracks unbroken answer chains this session.
 */
export function checkFlowStateBadge(consecutiveAnswers: number): BadgeType | null {
  if (hasBadge('flow_state_badge')) return null
  if (consecutiveAnswers >= 5) {
    awardBadge('flow_state_badge')
    return 'flow_state_badge'
  }
  return null
}

/**
 * Check Multiverse Operator badge: 5+ active CQGS modules logged today.
 * activeModules should be an array of distinct module keys used today.
 */
export function checkMultiverseOperator(activeModules: string[]): BadgeType | null {
  if (hasBadge('multiverse_operator')) return null
  if (activeModules.length >= 5) {
    awardBadge('multiverse_operator')
    return 'multiverse_operator'
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
  // ── v3 — Computer Lore ───────────────────────────────────────────────────
  { patterns: /\b(hack|hacker|hacking)\b/i,         badge: 'hacker_mode' },
  { patterns: /\boverride\b/i,                       badge: 'override_protocol' },
  { patterns: /\bdebug(ging|ged)?\b/i,               badge: 'debug_mode' },
  { patterns: /\b(signal|frequency|freq)\b/i,        badge: 'signal_boost' },
  { patterns: /\b(void|empty|emptiness|nothingness)\b/i, badge: 'into_the_void' },
  { patterns: /\b(spark|ignite|ignition|ignited)\b/i, badge: 'ignition' },
  { patterns: /\b(echo|resonance|resonate)\b/i,      badge: 'echo_chamber' },
  { patterns: /\b(shield|protect|protection|defend)\b/i, badge: 'defense_protocol' },
  { patterns: /\b(navigate|navigation|compass|waypoint)\b/i, badge: 'navigator' },
  { patterns: /\b(grow|growth|growing|expand)\b/i,   badge: 'growth_module' },
  { patterns: /\b(lost|adrift|untethered)\b/i,       badge: 'lost_signal' },
  { patterns: /\b(binary|zero|ones?|zeros?)\b/i,     badge: 'binary_state' },
  // ── v4 — Self-Care Lore ──────────────────────────────────────────────────
  { patterns: /\b(heal|healing|healed|healer)\b/i,   badge: 'healing_protocol' },
  { patterns: /\b(hydrate|hydration|drink water)\b/i,badge: 'hydration_core' },
  { patterns: /\b(restore|restoration|recover)\b/i,  badge: 'restore_point' },
  { patterns: /\b(journal|journaling|write|writing)\b/i, badge: 'scribe_module' },
  { patterns: /\b(meditate|meditation|mindful)\b/i,  badge: 'zen_mode' },
  { patterns: /\b(exercise|workout|gym|training)\b/i,badge: 'motion_detected' },
  { patterns: /\bexhale\b/i,                          badge: 'exhale_protocol' },
  { patterns: /\b(read|reading|book|books|library)\b/i, badge: 'library_access' },
  { patterns: /\b(connect|connection|together|bond)\b/i, badge: 'handshake' },
  { patterns: /\bcreate\b/i,                          badge: 'create_mode' },
  { patterns: /\b(progress|improve|improving)\b/i,   badge: 'progress_bar' },
  { patterns: /\btoday\b/i,                           badge: 'present_node' },
  // ── Secret Boss ──────────────────────────────────────────────────────────
  { patterns: /April\s+7(?:th)?,?\s*2016/,            badge: 'founders_mark' },
  { patterns: /\bKuzya\b/,                             badge: 'kuzya_protocol' },
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
  sessionAnswerCount?: number,
  userBirthdate?: string | null,
  activeModules?: string[],
): BadgeType[] {
  const awarded: BadgeType[] = []

  // Time-based (v1 + v3 + v4)
  const timeResults = checkTimeEasterEggs()
  awarded.push(...timeResults)

  // Calendar-based (v1 + v2 + v3)
  const calResults = checkCalendarEasterEggs()
  awarded.push(...calResults)

  // Behavioral — gap detection (must run before recordActivity)
  const comebackKid = checkComebackKid()
  if (comebackKid) awarded.push(comebackKid)

  const quantumLeap = checkQuantumLeap()
  if (quantumLeap) awarded.push(quantumLeap)

  const ghost = checkGhostProtocol()
  if (ghost) awarded.push(ghost)

  const silent = checkSilentHour()
  if (silent) awarded.push(silent)

  // Behavioral v1
  const friday = checkFridayRitual()
  if (friday) awarded.push(friday)

  // Behavioral v2
  const trio = checkTrioProtocol()
  if (trio) awarded.push(trio)

  if (activityCount !== undefined) {
    const overclock = checkOverclock(activityCount)
    if (overclock) awarded.push(overclock)
  }

  if (activityTimestamps !== undefined) {
    const speedrun = checkSpeedrun(activityTimestamps)
    if (speedrun) awarded.push(speedrun)
  }

  if (sessionAnswerCount !== undefined) {
    const deep = checkDeepSession(sessionAnswerCount)
    if (deep) awarded.push(deep)
  }

  // Behavioral v3
  if (userBirthdate !== undefined) {
    const bday = checkBirthdayProtocol(userBirthdate)
    if (bday) awarded.push(bday)
  }

  if (activeModules !== undefined) {
    const multiverse = checkMultiverseOperator(activeModules)
    if (multiverse) awarded.push(multiverse)
  }

  // Record activity after all checks (so gap detection works next time)
  recordActivity()

  return awarded
}
