/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

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
 */

export type BadgeTheme = 'water' | 'architecture'

export type BadgeType =
  // Water milestones      ↳ Architecture milestones
  | 'milestone_7'     // ∘ Droplet       → ├─ Foundation
  | 'milestone_30'    // ≈ Wave          → ╞═╡ Structure
  | 'milestone_100'   // ≋ Current       → ║·║ Architecture

export interface Badge {
  id: BadgeType
  waterSymbol: string
  architectureSymbol: string
  waterName: string
  architectureName: string
  description: string
  waterUnlockMessage: string
  architectureUnlockMessage: string
}

export const BADGES: Record<BadgeType, Badge> = {
  milestone_7: {
    id: 'milestone_7',
    waterSymbol: '∘',
    architectureSymbol: '├─',
    waterName: 'Droplet',
    architectureName: 'Foundation',
    description: 'Seven days of consistent practice',
    waterUnlockMessage: '↳ First drops form [badge]',
    architectureUnlockMessage: '↳ Foundation laid [badge]',
  },
  milestone_30: {
    id: 'milestone_30',
    waterSymbol: '≈',
    architectureSymbol: '╞═╡',
    waterName: 'Wave',
    architectureName: 'Structure',
    description: 'A full month of engagement',
    waterUnlockMessage: '↳ Waves begin to flow [badge]',
    architectureUnlockMessage: '↳ Structure rises [badge]',
  },
  milestone_100: {
    id: 'milestone_100',
    waterSymbol: '≋',
    architectureSymbol: '║·║',
    waterName: 'Current',
    architectureName: 'Architecture',
    description: 'A hundred days of practice',
    waterUnlockMessage: '↳ Deep currents established [badge]',
    architectureUnlockMessage: '↳ Architecture complete [badge]',
  },
}

// Default separator when no badges earned yet
export const DEFAULT_SEPARATOR = '•'

// Progression arrow used across the badge UI
export const PROGRESSION_ARROW = '→'

// Sub-item indicator for hierarchical display
export const SUB_INDICATOR = '↳'

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
    syncBadgesToServer()
  } catch (e) {
    console.warn('Failed to set badge theme:', e)
  }
}

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

    queueBadgeUnlock(badgeId)
    syncBadgesToServer([badgeId])

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

  } catch (error) {
    console.warn('Badge check failed:', error)
  }

  return newBadges
}

function syncBadgesToServer(newBadges?: string[]): void {
  if (typeof window === 'undefined') return

  try {
    const earnedBadges = getEarnedBadges()
    const badgeTheme = getBadgeTheme()

    fetch('/api/sync-badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        earnedBadges,
        badgeTheme,
        newBadges: newBadges || [],
      }),
    }).catch(() => {})
  } catch { /* non-critical */ }
}

export function hydrateBadgesFromServer(serverBadges: {
  earnedBadges?: string[]
  badgeTheme?: string | null
}): void {
  if (typeof window === 'undefined') return
  if (!serverBadges) return

  try {
    if (serverBadges.earnedBadges && serverBadges.earnedBadges.length > 0) {
      const localBadges = getEarnedBadges()
      const merged = Array.from(new Set([...localBadges, ...serverBadges.earnedBadges]))
      if (merged.length > localBadges.length) {
        saveEarnedBadges(merged as BadgeType[])
        console.log('[Badges] Hydrated from server:', merged)
      }
    }

    if (serverBadges.badgeTheme === 'water' || serverBadges.badgeTheme === 'architecture') {
      const localTheme = localStorage.getItem('badge_theme')
      if (!localTheme) {
        localStorage.setItem('badge_theme', serverBadges.badgeTheme)
        console.log('[Badges] Theme hydrated from server:', serverBadges.badgeTheme)
      }
    }
  } catch { /* non-critical */ }
}
