/**
 * Badge System for LOT — Dual Theme Support
 *
 * Two parallel systems representing spiritual growth:
 *
 * 1. WATER (Aquatic Evolution): ∘ ⟶ ≈ ⟶ ≋
 *    ↳ Growth through natural cycles, like water flowing
 *
 * 2. ARCHITECTURE (Box Drawing): ├─ ⟶ ╞═╡ ⟶ ║·║
 *    ↳ Structural building and growth, construction of self
 *
 * Users can choose their preferred metaphor for growth.
 * Displayed in dedicated "Level:" field in Public Profile.
 *
 * Progression: ▸ milestone_7 → milestone_30 → milestone_100
 *
 * ─────────────────────────────────────────────────────────
 *  EASTER EGG BADGES — secret achievements for curious minds
 * ─────────────────────────────────────────────────────────
 *
 * Hidden badges unlock through special behaviors, timing,
 * and secret sequences. They appear as rare collectibles in
 * the badge registry. Dual-theme symbols apply.
 *
 *   [!]  GLITCH       — found something hidden in the system
 *   (*)  STARFIELD    — present during a magic timestamp
 *   \|/  SUNRISE      — checked in before the world woke up
 *   (~)  VOID         — practice in the midnight hour
 *   {o}  ORACLE       — 10 questions answered in one session
 *   ///  CURRENT      — 5 sessions in a single day
 *   |||  PILLAR       — used every core widget in one session
 *   /\/  SUMMIT       — reached level 60 (mastery begins)
 */

export type BadgeTheme = 'water' | 'architecture'

export type BadgeType =
  // ── Milestone Badges ───────────────────────────────────────
  // Water milestones        ↳ Architecture milestones
  | 'milestone_7'      // ∘ Droplet        → ├─  Foundation
  | 'milestone_30'     // ≈ Wave           → ╞═╡ Structure
  | 'milestone_100'    // ≋ Current        → ║·║ Architecture

  // ── Easter Egg Badges ──────────────────────────────────────
  // Hidden achievements for curious, dedicated players
  | 'secret_glitch'    // [!] / <!>  — found a hidden feature
  | 'magic_time'       // (*) / [*]  — magic timestamp trigger
  | 'speedrun_dawn'    // \|/ / [>]  — checked in before 7 AM
  | 'midnight_void'    // (~) / [_]  — practice at midnight hour
  | 'oracle_session'   // {o} / (#)  — 10 questions in one session
  | 'grind_mode'       // /// / ===  — 5 sessions in one day
  | 'full_stack'       // ||| / |||  — all core widgets in session
  | 'peak_climber'     // /\/ / ^|^  — reached level 60

export interface Badge {
  id: BadgeType
  waterSymbol: string
  architectureSymbol: string
  waterName: string
  architectureName: string
  description: string
  waterUnlockMessage: string
  architectureUnlockMessage: string
  isEasterEgg?: boolean    // true = hidden badge, shows as [???] until earned
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'secret'
}

export const BADGES: Record<BadgeType, Badge> = {

  // ── Milestone Badges ─────────────────────────────────────────────────────

  milestone_7: {
    id: 'milestone_7',
    waterSymbol: '∘',
    architectureSymbol: '├─',
    waterName: 'Droplet',
    architectureName: 'Foundation',
    description: 'Seven days of consistent practice',
    waterUnlockMessage: '↳ First drops form. You are learning the shape of your days. ∘',
    architectureUnlockMessage: '↳ Foundation laid. The first stone knows its purpose. ├─',
    rarity: 'uncommon',
  },
  milestone_30: {
    id: 'milestone_30',
    waterSymbol: '≈',
    architectureSymbol: '╞═╡',
    waterName: 'Wave',
    architectureName: 'Structure',
    description: 'A full month of engagement',
    waterUnlockMessage: '↳ Waves begin to flow. A month of practice leaves its mark. ≈',
    architectureUnlockMessage: '↳ Structure rises. The walls remember every day of work. ╞═╡',
    rarity: 'rare',
  },
  milestone_100: {
    id: 'milestone_100',
    waterSymbol: '≋',
    architectureSymbol: '║·║',
    waterName: 'Current',
    architectureName: 'Architecture',
    description: 'A hundred days of practice',
    waterUnlockMessage: '↳ Deep currents established. You have become the river. ≋',
    architectureUnlockMessage: '↳ Architecture complete. What you built is what you are. ║·║',
    rarity: 'epic',
  },

  // ── Easter Egg Badges ────────────────────────────────────────────────────

  secret_glitch: {
    id: 'secret_glitch',
    waterSymbol: '[!]',
    architectureSymbol: '<!>',
    waterName: 'GLITCH',
    architectureName: 'ANOMALY',
    description: 'You found something hidden in the system',
    waterUnlockMessage: '↳ The simulation glitched. You saw through the veil. [!]',
    architectureUnlockMessage: '↳ Error 404: Self Not Found. Then you found it. <!>',
    isEasterEgg: true,
    rarity: 'secret',
  },
  magic_time: {
    id: 'magic_time',
    waterSymbol: '(*)',
    architectureSymbol: '[*]',
    waterName: 'STARFIELD',
    architectureName: 'QUANTUM',
    description: 'Active during a magic timestamp (11:11, 12:34, 22:22...)',
    waterUnlockMessage: '↳ Time folded. The numbers aligned. You were there. (*)',
    architectureUnlockMessage: '↳ Quantum timestamp locked. The clock chose you. [*]',
    isEasterEgg: true,
    rarity: 'secret',
  },
  speedrun_dawn: {
    id: 'speedrun_dawn',
    waterSymbol: '\\|/',
    architectureSymbol: '[>]',
    waterName: 'SUNRISE',
    architectureName: 'BOOT',
    description: 'Checked in before 7 AM — first light protocol',
    waterUnlockMessage: '↳ You surfaced before the world woke up. The day is yours. \\|/',
    architectureUnlockMessage: '↳ System booted at first light. Primary directive: self. [>]',
    isEasterEgg: true,
    rarity: 'secret',
  },
  midnight_void: {
    id: 'midnight_void',
    waterSymbol: '(~)',
    architectureSymbol: '[_]',
    waterName: 'VOID',
    architectureName: 'NULL',
    description: 'Practice in the midnight hour (12 AM–1 AM)',
    waterUnlockMessage: '↳ Between days, in the dark current — you still showed up. (~)',
    architectureUnlockMessage: '↳ Null cycle registered. You kept running. [_]',
    isEasterEgg: true,
    rarity: 'secret',
  },
  oracle_session: {
    id: 'oracle_session',
    waterSymbol: '{o}',
    architectureSymbol: '(#)',
    waterName: 'ORACLE',
    architectureName: 'PROCESSOR',
    description: 'Answered 10 memory questions in a single session',
    waterUnlockMessage: '↳ The questions answered themselves through you. {o}',
    architectureUnlockMessage: '↳ Processing depth: maximum. Cache clear. (#)',
    isEasterEgg: true,
    rarity: 'secret',
  },
  grind_mode: {
    id: 'grind_mode',
    waterSymbol: '///',
    architectureSymbol: '===',
    waterName: 'CURRENT',
    architectureName: 'LOOP',
    description: '5 sessions completed in a single day',
    waterUnlockMessage: '↳ Relentless. The tide never stopped. You never stopped. ///',
    architectureUnlockMessage: '↳ Loop: unbroken. Process: persistent. Thread count: you. ===',
    isEasterEgg: true,
    rarity: 'secret',
  },
  full_stack: {
    id: 'full_stack',
    waterSymbol: '|||',
    architectureSymbol: '|||',
    waterName: 'PILLAR',
    architectureName: 'COLUMN',
    description: 'Engaged every core widget in a single session',
    waterUnlockMessage: '↳ Every current touched. The whole river flowed today. |||',
    architectureUnlockMessage: '↳ All columns load-bearing. System fully utilized. |||',
    isEasterEgg: true,
    rarity: 'secret',
  },
  peak_climber: {
    id: 'peak_climber',
    waterSymbol: '/\\/',
    architectureSymbol: '^|^',
    waterName: 'SUMMIT',
    architectureName: 'APEX',
    description: 'Reached level 60 — Mastery begins here',
    waterUnlockMessage: '↳ You climbed to where the current never sleeps. /\\/',
    architectureUnlockMessage: '↳ Apex architecture achieved. Load: infinite. ^|^',
    isEasterEgg: true,
    rarity: 'legendary',
  },
}

// ── Separators & UI Symbols ────────────────────────────────────────────────

// Default separator when no badges earned yet
export const DEFAULT_SEPARATOR = '•'

// Progression arrow used across the badge UI
export const PROGRESSION_ARROW = '→'

// Sub-item indicator for hierarchical display
export const SUB_INDICATOR = '↳'

// Easter egg placeholder shown before discovery
export const EASTER_EGG_PLACEHOLDER = '[???]'

// ── Badge Theme Utilities ──────────────────────────────────────────────────

/**
 * Get user's preferred badge theme
 */
export function getBadgeTheme(): BadgeTheme {
  if (typeof window === 'undefined') return 'water'

  try {
    const stored = localStorage.getItem('badge_theme')
    return (stored === 'architecture' ? 'architecture' : 'water') as BadgeTheme
  } catch (e) {
    return 'water'
  }
}

/**
 * Set user's preferred badge theme
 */
export function setBadgeTheme(theme: BadgeTheme): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('badge_theme', theme)
  } catch (e) {
    console.warn('Failed to set badge theme:', e)
  }
}

// ── Earned Badge Persistence ───────────────────────────────────────────────

/**
 * Get earned badges from localStorage
 * Format: comma-separated badge IDs
 */
export function getEarnedBadges(): BadgeType[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem('earned_badges')
    if (!stored) return []

    return stored.split(',').filter(Boolean) as BadgeType[]
  } catch (e) {
    console.warn('Failed to get earned badges:', e)
    return []
  }
}

/**
 * Save earned badges to localStorage
 */
export function saveEarnedBadges(badges: BadgeType[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('earned_badges', badges.join(','))
  } catch (e) {
    console.warn('Failed to save earned badges:', e)
  }
}

/**
 * Check if a badge is earned
 */
export function hasBadge(badgeId: BadgeType): boolean {
  return getEarnedBadges().includes(badgeId)
}

/**
 * Get count of easter egg badges earned
 */
export function getEasterEggCount(): { earned: number; total: number } {
  const easterEggs = Object.values(BADGES).filter(b => b.isEasterEgg)
  const earned = getEarnedBadges().filter(id => BADGES[id]?.isEasterEgg)
  return { earned: earned.length, total: easterEggs.length }
}

// ── Badge Awarding ─────────────────────────────────────────────────────────

// Simple lock to prevent race conditions in multi-tab scenarios
let awardingBadge = false

/**
 * Award a new badge (returns true if newly earned)
 */
export function awardBadge(badgeId: BadgeType): boolean {
  // Prevent race conditions
  if (awardingBadge) {
    console.warn('Badge award in progress, skipping duplicate request')
    return false
  }

  try {
    awardingBadge = true

    const earned = getEarnedBadges()
    if (earned.includes(badgeId)) return false

    earned.push(badgeId)
    saveEarnedBadges(earned)

    // Queue unlock notification for Memory widget
    queueBadgeUnlock(badgeId)

    return true
  } finally {
    awardingBadge = false
  }
}

/**
 * Queue badge unlock to show in next Memory widget appearance
 */
function queueBadgeUnlock(badgeId: BadgeType): void {
  if (typeof window === 'undefined') return

  try {
    const queued = localStorage.getItem('badge_unlock_queue') || ''
    const queue = queued ? queued.split(',') : []

    if (!queue.includes(badgeId)) {
      queue.push(badgeId)
      localStorage.setItem('badge_unlock_queue', queue.join(','))
    }
  } catch (e) {
    console.warn('Failed to queue badge unlock:', e)
  }
}

/**
 * Get next badge unlock to display (and remove from queue)
 * Returns badge with theme-appropriate message
 */
export function getNextBadgeUnlock(): { badge: Badge; unlockMessage: string; symbol: string; name: string } | null {
  if (typeof window === 'undefined') return null

  try {
    const queued = localStorage.getItem('badge_unlock_queue') || ''
    const queue = queued ? queued.split(',').filter(Boolean) : []

    if (queue.length === 0) return null

    const badgeId = queue.shift() as BadgeType
    localStorage.setItem('badge_unlock_queue', queue.join(','))

    // Validate badge ID exists
    const badge = BADGES[badgeId]
    if (!badge) {
      console.warn('Invalid badge ID in queue:', badgeId)
      return null
    }

    // Get theme-appropriate message and symbol
    const theme = getBadgeTheme()
    const unlockMessage = theme === 'water' ? badge.waterUnlockMessage : badge.architectureUnlockMessage
    const symbol = theme === 'water' ? badge.waterSymbol : badge.architectureSymbol
    const name = theme === 'water' ? badge.waterName : badge.architectureName

    return { badge, unlockMessage, symbol, name }
  } catch (e) {
    console.warn('Failed to get next badge unlock:', e)
    return null
  }
}

// ── Level & Progression ────────────────────────────────────────────────────

/**
 * Get current level symbol based on streak
 * Returns the highest milestone badge symbol earned (theme-specific)
 */
export function getLevelSymbol(streak: number, theme?: BadgeTheme): string {
  const badgeTheme = theme || getBadgeTheme()

  if (streak >= 100) {
    return badgeTheme === 'water' ? BADGES.milestone_100.waterSymbol : BADGES.milestone_100.architectureSymbol
  }
  if (streak >= 30) {
    return badgeTheme === 'water' ? BADGES.milestone_30.waterSymbol : BADGES.milestone_30.architectureSymbol
  }
  if (streak >= 7) {
    return badgeTheme === 'water' ? BADGES.milestone_7.waterSymbol : BADGES.milestone_7.architectureSymbol
  }
  return '' // No level yet → awaiting first milestone
}

/**
 * Get current level name based on streak (theme-specific)
 */
export function getLevelName(streak: number, theme?: BadgeTheme): string {
  const badgeTheme = theme || getBadgeTheme()

  if (streak >= 100) {
    return badgeTheme === 'water' ? BADGES.milestone_100.waterName : BADGES.milestone_100.architectureName
  }
  if (streak >= 30) {
    return badgeTheme === 'water' ? BADGES.milestone_30.waterName : BADGES.milestone_30.architectureName
  }
  if (streak >= 7) {
    return badgeTheme === 'water' ? BADGES.milestone_7.waterName : BADGES.milestone_7.architectureName
  }
  return '' // No level yet
}

/**
 * Get badge symbol for display, respecting easter egg hidden state
 * Unearned easter egg badges show as [???]
 */
export function getBadgeDisplaySymbol(badgeId: BadgeType, theme?: BadgeTheme): string {
  const badge = BADGES[badgeId]
  if (!badge) return ''

  const earned = hasBadge(badgeId)
  if (badge.isEasterEgg && !earned) return EASTER_EGG_PLACEHOLDER

  const badgeTheme = theme || getBadgeTheme()
  return badgeTheme === 'water' ? badge.waterSymbol : badge.architectureSymbol
}

// ── Display Utilities ──────────────────────────────────────────────────────

/**
 * Capitalize first letter of each word
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Join array with · separator and capitalize each word
 */
export function joinWithDots(items: string[]): string {
  if (items.length === 0) return ''
  return items.map(capitalize).join(' · ')
}

/**
 * Format badge progression display with arrows
 * e.g. "∘ → ≈ → ≋" or "├─ → ╞═╡ → ║·║"
 */
export function getBadgeProgressionDisplay(theme?: BadgeTheme): string {
  const badgeTheme = theme || getBadgeTheme()
  const milestones = ['milestone_7', 'milestone_30', 'milestone_100'] as const

  return milestones
    .map(id => badgeTheme === 'water' ? BADGES[id].waterSymbol : BADGES[id].architectureSymbol)
    .join(' → ')
}

/**
 * Get easter egg badge display string for profile
 * Shows earned easter eggs by symbol, hides unearned
 */
export function getEasterEggDisplay(theme?: BadgeTheme): string {
  const badgeTheme = theme || getBadgeTheme()
  const easterEggs = Object.values(BADGES).filter(b => b.isEasterEgg)
  const earned = getEarnedBadges()

  return easterEggs
    .filter(b => earned.includes(b.id))
    .map(b => badgeTheme === 'water' ? b.waterSymbol : b.architectureSymbol)
    .join(' ')
}

// ── Badge Check & Award Logic ──────────────────────────────────────────────

/**
 * Check and award easter egg badges based on context
 * Called at key moments: session start, question answer, time events
 */
export function checkEasterEggBadges(context: {
  hour?: number          // Current hour (0-23) for time-based badges
  sessionQuestions?: number  // Questions answered this session
  sessionsToday?: number     // Total sessions today
  widgetsUsed?: string[]     // Widget IDs used this session
  level?: number             // Current user level
  isMagicTime?: boolean      // Whether current time is a magic timestamp
}): BadgeType[] {
  const awarded: BadgeType[] = []

  const { hour, sessionQuestions, sessionsToday, level, isMagicTime } = context

  // Sunrise badge — checked in before 7 AM
  if (hour !== undefined && hour >= 5 && hour < 7 && !hasBadge('speedrun_dawn')) {
    if (awardBadge('speedrun_dawn')) awarded.push('speedrun_dawn')
  }

  // Midnight badge — practice between midnight and 1 AM
  if (hour !== undefined && hour === 0 && !hasBadge('midnight_void')) {
    if (awardBadge('midnight_void')) awarded.push('midnight_void')
  }

  // Oracle badge — 10+ questions in one session
  if (sessionQuestions !== undefined && sessionQuestions >= 10 && !hasBadge('oracle_session')) {
    if (awardBadge('oracle_session')) awarded.push('oracle_session')
  }

  // Grind mode badge — 5+ sessions today
  if (sessionsToday !== undefined && sessionsToday >= 5 && !hasBadge('grind_mode')) {
    if (awardBadge('grind_mode')) awarded.push('grind_mode')
  }

  // Magic time badge — triggered during special timestamps
  if (isMagicTime && !hasBadge('magic_time')) {
    if (awardBadge('magic_time')) awarded.push('magic_time')
  }

  // Peak climber badge — reached level 60
  if (level !== undefined && level >= 60 && !hasBadge('peak_climber')) {
    if (awardBadge('peak_climber')) awarded.push('peak_climber')
  }

  return awarded
}

/**
 * Award the glitch easter egg — call when user discovers a hidden feature
 */
export function awardGlitchBadge(): boolean {
  if (hasBadge('secret_glitch')) return false
  return awardBadge('secret_glitch')
}

/**
 * Award the full stack badge — call when all core widgets have been used
 */
export function awardFullStackBadge(): boolean {
  if (hasBadge('full_stack')) return false
  return awardBadge('full_stack')
}

// ── Milestone Check ────────────────────────────────────────────────────────

/**
 * Calculate which milestone badges should be awarded based on streak
 * This is called periodically or after significant events
 */
export async function checkAndAwardBadges(): Promise<BadgeType[]> {
  const newBadges: BadgeType[] = []

  try {
    // Fetch user stats from API
    const response = await fetch('/api/user-stats')
    if (!response.ok) return newBadges

    // Parse JSON safely
    let stats
    try {
      stats = await response.json()
    } catch (parseError) {
      console.warn('Failed to parse user stats response:', parseError)
      return newBadges
    }

    // Validate stats object
    if (!stats || typeof stats.streak !== 'number') {
      console.warn('Invalid stats response:', stats)
      return newBadges
    }

    // Check milestone badges: ∘ → ≈ → ≋ (water) │ ├─ → ╞═╡ → ║·║ (arch)
    if (stats.streak >= 7 && !hasBadge('milestone_7')) {
      if (awardBadge('milestone_7')) newBadges.push('milestone_7')
    }
    if (stats.streak >= 30 && !hasBadge('milestone_30')) {
      if (awardBadge('milestone_30')) newBadges.push('milestone_30')
    }
    if (stats.streak >= 100 && !hasBadge('milestone_100')) {
      if (awardBadge('milestone_100')) newBadges.push('milestone_100')
    }

    // Check easter egg: peak climber from level
    if (typeof stats.level === 'number') {
      checkEasterEggBadges({ level: stats.level })
    }

    // Check time-based easter eggs
    const hour = new Date().getHours()
    checkEasterEggBadges({ hour })

  } catch (error) {
    console.warn('Badge check failed:', error)
  }

  return newBadges
}
