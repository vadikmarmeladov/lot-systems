/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Astrology utility functions for Japanese zodiac, moon phase, and Western zodiac
 */

// Japanese zodiac animals (12-year cycle starting from 1900 = Rat)
const JAPANESE_ZODIAC = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
] as const

// Rokuyo (六曜) - Six-day cycle used in Japanese calendars
const ROKUYO = [
  'Sensho',      // 先勝 - Morning is better
  'Tomobiki',    // 友引 - Good day (avoid funerals)
  'Senpu',       // 先負 - Afternoon is better
  'Butsumetsu',  // 仏滅 - Inauspicious day
  'Taian',       // 大安 - Very auspicious day
  'Shakku',      // 赤口 - Caution needed
] as const

// Western zodiac signs with date ranges
const WESTERN_ZODIAC = [
  { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
  { sign: 'Pisces', start: [2, 19], end: [3, 20] },
  { sign: 'Aries', start: [3, 21], end: [4, 19] },
  { sign: 'Taurus', start: [4, 20], end: [5, 20] },
  { sign: 'Gemini', start: [5, 21], end: [6, 20] },
  { sign: 'Cancer', start: [6, 21], end: [7, 22] },
  { sign: 'Leo', start: [7, 23], end: [8, 22] },
  { sign: 'Virgo', start: [8, 23], end: [9, 22] },
  { sign: 'Libra', start: [9, 23], end: [10, 22] },
  { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
] as const

/**
 * Get Japanese zodiac animal for a given year
 */
export function getJapaneseZodiac(year: number): string {
  // 1900 is year of the Rat (index 0)
  const index = (year - 1900) % 12
  return JAPANESE_ZODIAC[index]
}

/**
 * Get hourly Japanese zodiac animal based on time of day
 * Each animal governs a 2-hour period
 */
export function getHourlyZodiac(date: Date): string {
  const hour = date.getHours()

  // Map hours to zodiac animals (2-hour periods)
  if (hour >= 23 || hour < 1) return 'Rat'      // 11 PM - 1 AM
  if (hour >= 1 && hour < 3) return 'Ox'        // 1 AM - 3 AM
  if (hour >= 3 && hour < 5) return 'Tiger'     // 3 AM - 5 AM
  if (hour >= 5 && hour < 7) return 'Rabbit'    // 5 AM - 7 AM
  if (hour >= 7 && hour < 9) return 'Dragon'    // 7 AM - 9 AM
  if (hour >= 9 && hour < 11) return 'Snake'    // 9 AM - 11 AM
  if (hour >= 11 && hour < 13) return 'Horse'   // 11 AM - 1 PM
  if (hour >= 13 && hour < 15) return 'Goat'    // 1 PM - 3 PM
  if (hour >= 15 && hour < 17) return 'Monkey'  // 3 PM - 5 PM
  if (hour >= 17 && hour < 19) return 'Rooster' // 5 PM - 7 PM
  if (hour >= 19 && hour < 21) return 'Dog'     // 7 PM - 9 PM
  if (hour >= 21 && hour < 23) return 'Pig'     // 9 PM - 11 PM

  return 'Rat'
}

/**
 * Get the Rokuyo (六曜) index (0-5) for a given date — the raw cycle position,
 * shared by getRokuyo() and anything else that needs to key off the same cycle.
 */
export function getRokuyoIndex(date: Date): number {
  // Known starting point: January 1, 2000 was Sensho (index 0)
  const knownDate = new Date('2000-01-01')
  const knownRokuyoIndex = 0

  // Calculate days since known date
  const daysDiff = Math.floor((date.getTime() - knownDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate Rokuyo index (6-day cycle)
  return (knownRokuyoIndex + daysDiff) % 6
}

/**
 * Get Rokuyo (六曜) - Japanese six-day cycle for determining auspicious days
 * Simplified calculation based on Gregorian calendar
 */
export function getRokuyo(date: Date): string {
  return ROKUYO[getRokuyoIndex(date)]
}

/**
 * Get Western zodiac sign for a given date
 */
export function getWesternZodiac(date: Date): string {
  const month = date.getMonth() + 1 // 1-12
  const day = date.getDate()

  for (const zodiac of WESTERN_ZODIAC) {
    const [startMonth, startDay] = zodiac.start
    const [endMonth, endDay] = zodiac.end

    // Handle zodiac signs that span across year boundary (Capricorn)
    if (startMonth > endMonth) {
      if (month === startMonth && day >= startDay) return zodiac.sign
      if (month === endMonth && day <= endDay) return zodiac.sign
    } else {
      // Normal case
      if (month === startMonth && day >= startDay) return zodiac.sign
      if (month === endMonth && day <= endDay) return zodiac.sign
      if (month > startMonth && month < endMonth) return zodiac.sign
    }
  }

  return 'Unknown'
}

/**
 * Calculate moon phase for a given date
 * Returns phase name and illumination percentage
 */
export function getMoonPhase(date: Date): { phase: string; illumination: number } {
  // Known new moon: January 6, 2000, 18:14 UTC
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime()
  const secondsInDay = 86400000
  const lunarCycle = 29.53058770576 // days in lunar cycle

  // Calculate days since known new moon
  const daysSinceNewMoon = (date.getTime() - knownNewMoon) / secondsInDay
  const phase = daysSinceNewMoon % lunarCycle

  // Calculate illumination (0-100%)
  const illumination = Math.round(50 * (1 - Math.cos((phase / lunarCycle) * 2 * Math.PI)))

  // Determine phase name
  let phaseName: string
  if (phase < 1.84566) {
    phaseName = 'New Moon'
  } else if (phase < 7.38264) {
    phaseName = 'Waxing Crescent'
  } else if (phase < 8.84566) {
    phaseName = 'First Quarter'
  } else if (phase < 14.76529) {
    phaseName = 'Waxing Gibbous'
  } else if (phase < 16.22892) {
    phaseName = 'Full Moon'
  } else if (phase < 22.14855) {
    phaseName = 'Waning Gibbous'
  } else if (phase < 23.61224) {
    phaseName = 'Last Quarter'
  } else if (phase < 29.53059) {
    phaseName = 'Waning Crescent'
  } else {
    phaseName = 'New Moon'
  }

  return { phase: phaseName, illumination }
}

/**
 * Get moon emoji based on phase
 */
export function getMoonEmoji(phaseName: string): string {
  const emojiMap: Record<string, string> = {
    'New Moon': '🌑',
    'Waxing Crescent': '🌒',
    'First Quarter': '🌓',
    'Waxing Gibbous': '🌔',
    'Full Moon': '🌕',
    'Waning Gibbous': '🌖',
    'Last Quarter': '🌗',
    'Waning Crescent': '🌘',
  }
  return emojiMap[phaseName] || '🌑'
}

/**
 * Get the day-of-year (1-366) for a given date. Shared so every widget that
 * rotates daily content (patches, prompts, etc.) keys off the same count.
 */
export function getDayOfYear(date: Date): number {
  return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
}

export type AstrologySnapshot = {
  westernZodiac: string
  hourlyZodiac: string
  rokuyo: string
  rokuyoIndex: number
  moonPhase: string
  moonIllumination: number
  moonEmoji: string
  dayOfYear: number
}

/**
 * Single source of truth for "ambient" astrology conditions — same for every
 * user at a given moment. Widgets that render or key off zodiac/moon/rokuyo
 * data should read this instead of recomputing it independently, so they stay
 * in sync with each other.
 */
export function getAstrologySnapshot(date: Date = new Date()): AstrologySnapshot {
  const moon = getMoonPhase(date)
  return {
    westernZodiac: getWesternZodiac(date),
    hourlyZodiac: getHourlyZodiac(date),
    rokuyo: getRokuyo(date),
    rokuyoIndex: getRokuyoIndex(date),
    moonPhase: moon.phase,
    moonIllumination: moon.illumination,
    moonEmoji: getMoonEmoji(moon.phase),
    dayOfYear: getDayOfYear(date),
  }
}

/**
 * Minimal shape this module needs from a Log entry — kept decoupled from
 * #shared/types so utils/astrology.ts has no dependency on the app's log model.
 */
export type AstrologyLogEntry = {
  createdAt: Date | string
  event: string
  metadata?: Record<string, any> | null
}

// Rough valence (-2..+2) per logged emotional state, used only to correlate a
// user's own mood history against the ambient Rokuyo cycle. Unlisted states
// are ignored rather than guessed at.
const EMOTIONAL_VALENCE: Record<string, number> = {
  energized: 2, hopeful: 2, fulfilled: 2, grateful: 2, excited: 2,
  content: 1, calm: 1, peaceful: 1,
  uncertain: 0,
  restless: -1, tired: -1,
  anxious: -2, exhausted: -2, overwhelmed: -2,
}

export type RokuyoCorrelationBucket = {
  label: string
  avgValence: number
  count: number
}

export type RokuyoCorrelation = {
  best: RokuyoCorrelationBucket
  challenging: RokuyoCorrelationBucket | null
  sampleSize: number
}

const MIN_BUCKET_SAMPLES = 3
const MIN_QUALIFYING_BUCKETS = 2

/**
 * Correlate a user's own emotional check-in logs against the Rokuyo day they
 * were logged on. This is the personalization layer: the ambient Rokuyo cycle
 * itself never changes per-user, but which day of that cycle tends to carry
 * the user's brightest (or hardest) logged mood is derived entirely from
 * their own Logs history. Returns null until there's enough data to say
 * anything meaningful (at least two Rokuyo days with 3+ check-ins each).
 */
export function correlateLogsWithRokuyo(logs: AstrologyLogEntry[]): RokuyoCorrelation | null {
  const buckets = new Map<string, number[]>()

  for (const log of logs) {
    if (log.event !== 'emotional_checkin') continue
    const state = log.metadata?.emotionalState as string | undefined
    if (!state || !(state in EMOTIONAL_VALENCE)) continue
    const date = new Date(log.createdAt)
    if (Number.isNaN(date.getTime())) continue

    const rokuyo = getRokuyo(date)
    const bucket = buckets.get(rokuyo) ?? []
    bucket.push(EMOTIONAL_VALENCE[state])
    buckets.set(rokuyo, bucket)
  }

  const qualifying: RokuyoCorrelationBucket[] = Array.from(buckets.entries())
    .filter(([, values]) => values.length >= MIN_BUCKET_SAMPLES)
    .map(([label, values]) => ({
      label,
      avgValence: values.reduce((sum, v) => sum + v, 0) / values.length,
      count: values.length,
    }))

  if (qualifying.length < MIN_QUALIFYING_BUCKETS) return null

  const sorted = [...qualifying].sort((a, b) => b.avgValence - a.avgValence)
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  return {
    best,
    challenging: worst.label !== best.label ? worst : null,
    sampleSize: qualifying.reduce((sum, b) => sum + b.count, 0),
  }
}
