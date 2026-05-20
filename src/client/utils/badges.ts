/**
 * LOT Badge & Achievement System — RPG / Arcade / Sci-Fi Edition
 *
 * MILESTONE THEMES (user-selectable):
 *   water        ∘  →  ≈  →  ≋       Aquatic Evolution
 *   architecture ├─ →  ╞═╡ →  ║·║    Structural Growth
 *   terminal     >_ →  >>$ →  >|<    Computer Metaphor
 *   pixel        [.] → [o] →  [#]    8-Bit Arcade
 *   circuit      -o- → -+- →  =o=    Electronics / Sci-Fi
 *   mayan        ○∿  → ○≈○ →  ≋○≋   Oceanic Mayan Cycles
 *
 * ACHIEVEMENT CATEGORIES:
 *   Easter Eggs   — hidden triggers, secret conditions
 *   Word badges   — journey / data / chapter / sys tiers
 *   Class badges  — RPG character class (archetype-based)
 *
 * Progression: ▸ milestone_7 → milestone_30 → milestone_100
 */

// ── Types ──────────────────────────────────────────────────────────────────

export type BadgeTheme =
  | 'water'
  | 'architecture'
  | 'terminal'
  | 'pixel'
  | 'circuit'
  | 'mayan'

export type MilestoneBadgeType =
  | 'milestone_7'
  | 'milestone_30'
  | 'milestone_100'

export type EasterEggBadgeType =
  | 'easter_player_one'     // first log
  | 'easter_insert_coin'    // subscription activated
  | 'easter_konami_code'    // same time of day, 3 days running
  | 'easter_night_owl'      // after 11pm for 7 days
  | 'easter_dawn_boot'      // before 6am for 7 days
  | 'easter_extra_life'     // return after 7+ days away
  | 'easter_speedrun'       // answer within 5 min, 10 days straight
  | 'easter_the_answer'     // exactly 42-day streak
  | 'easter_new_game_plus'  // 365-day streak
  | 'easter_final_boss'     // 1,000 Memory questions answered
  | 'easter_true_end'       // all other badges collected
  | 'easter_ghost_mode'     // 30 days with private profile

export type WordBadgeType =
  // Journey tier — engagement level
  | 'word_newcomer'   | 'word_regular'   | 'word_dedicated'
  | 'word_veteran'    | 'word_legend'
  // Data tier — memory depth
  | 'word_byte'       | 'word_kilobyte'  | 'word_megabyte'
  | 'word_gigabyte'   | 'word_terabyte'
  // Chapter tier — story progression
  | 'word_chapter_1'  | 'word_chapter_3' | 'word_chapter_7'
  | 'word_chapter_10' | 'word_epilogue'
  // Sys tier — computer metaphor
  | 'word_sys_boot'   | 'word_sys_run'   | 'word_sys_compile'
  | 'word_sys_master'

export type ClassBadgeType =
  | 'class_ranger'     // The Explorer
  | 'class_artificer'  // The Builder
  | 'class_cleric'     // The Healer
  | 'class_archmage'   // The Sage
  | 'class_bard'       // The Creator
  | 'class_paladin'    // The Guardian
  | 'class_rogue'      // The Catalyst
  | 'class_oracle'     // The Visionary

export type BadgeType =
  | MilestoneBadgeType
  | EasterEggBadgeType
  | WordBadgeType
  | ClassBadgeType

// ── Milestone Badge Interface ──────────────────────────────────────────────

export interface MilestoneBadge {
  id: MilestoneBadgeType
  // per-theme symbols
  waterSymbol: string
  architectureSymbol: string
  terminalSymbol: string
  pixelSymbol: string
  circuitSymbol: string
  mayanSymbol: string
  // per-theme names
  waterName: string
  architectureName: string
  terminalName: string
  pixelName: string
  circuitName: string
  mayanName: string
  description: string
  // per-theme unlock messages (use [badge] as placeholder for symbol)
  waterUnlockMessage: string
  architectureUnlockMessage: string
  terminalUnlockMessage: string
  pixelUnlockMessage: string
  circuitUnlockMessage: string
  mayanUnlockMessage: string
}

// ── Achievement Badge Interface ────────────────────────────────────────────

export interface AchievementBadge {
  id: BadgeType
  symbol: string      // ASCII/Unicode display symbol
  name: string
  category: 'easter_egg' | 'word' | 'class'
  description: string
  unlockMessage: string
  secret?: boolean    // easter eggs are hidden until discovered
}

// ── Milestone Badges ───────────────────────────────────────────────────────

export const BADGES: Record<MilestoneBadgeType, MilestoneBadge> = {
  milestone_7: {
    id: 'milestone_7',
    waterSymbol:        '∘',
    architectureSymbol: '├─',
    terminalSymbol:     '>_',
    pixelSymbol:        '[.]',
    circuitSymbol:      '-o-',
    mayanSymbol:        '○∿',
    waterName:        'Droplet',
    architectureName: 'Foundation',
    terminalName:     'Boot',
    pixelName:        'Sprite',
    circuitName:      'Open',
    mayanName:        'Wave',
    description: 'Seven days of consistent practice',
    waterUnlockMessage:        '↳ First drops form [badge]',
    architectureUnlockMessage: '↳ Foundation laid [badge]',
    terminalUnlockMessage:     '↳ Boot sequence initiated [badge]',
    pixelUnlockMessage:        '↳ Pixel planted [badge]',
    circuitUnlockMessage:      '↳ Circuit open [badge]',
    mayanUnlockMessage:        '↳ Wave patterns emerge [badge]',
  },
  milestone_30: {
    id: 'milestone_30',
    waterSymbol:        '≈',
    architectureSymbol: '╞═╡',
    terminalSymbol:     '>>$',
    pixelSymbol:        '[o]',
    circuitSymbol:      '-+-',
    mayanSymbol:        '○≈○',
    waterName:        'Wave',
    architectureName: 'Structure',
    terminalName:     'Process',
    pixelName:        'Render',
    circuitName:      'Signal',
    mayanName:        'Tide',
    description: 'A full month of engagement',
    waterUnlockMessage:        '↳ Waves begin to flow [badge]',
    architectureUnlockMessage: '↳ Structure rises [badge]',
    terminalUnlockMessage:     '↳ Process loaded [badge]',
    pixelUnlockMessage:        '↳ Sprite loaded [badge]',
    circuitUnlockMessage:      '↳ Signal stable [badge]',
    mayanUnlockMessage:        '↳ Tides complete their cycle [badge]',
  },
  milestone_100: {
    id: 'milestone_100',
    waterSymbol:        '≋',
    architectureSymbol: '║·║',
    terminalSymbol:     '>|<',
    pixelSymbol:        '[#]',
    circuitSymbol:      '=o=',
    mayanSymbol:        '≋○≋',
    waterName:        'Current',
    architectureName: 'Architecture',
    terminalName:     'Master',
    pixelName:        'Bitmap',
    circuitName:      'Current',
    mayanName:        'Ocean',
    description: 'A hundred days of practice',
    waterUnlockMessage:        '↳ Deep currents established [badge]',
    architectureUnlockMessage: '↳ Architecture complete [badge]',
    terminalUnlockMessage:     '↳ System mastered [badge]',
    pixelUnlockMessage:        '↳ Full render [badge]',
    circuitUnlockMessage:      '↳ Full current [badge]',
    mayanUnlockMessage:        '↳ Ocean depth achieved [badge]',
  },
}

// ── Easter Egg Badges ──────────────────────────────────────────────────────

export const EASTER_EGG_BADGES: Record<EasterEggBadgeType, AchievementBadge> = {
  easter_player_one: {
    id: 'easter_player_one',
    symbol: 'PLAYER.ONE',
    name: 'Player One',
    category: 'easter_egg',
    description: 'First log of your journey.',
    unlockMessage: '↳ INSERT COIN. Your story begins.',
    secret: true,
  },
  easter_insert_coin: {
    id: 'easter_insert_coin',
    symbol: 'INSERT.COIN',
    name: 'Insert Coin',
    category: 'easter_egg',
    description: 'Subscribe to any LOT tier.',
    unlockMessage: '↳ CONTINUE? Y/N',
    secret: true,
  },
  easter_konami_code: {
    id: 'easter_konami_code',
    symbol: 'KONAMI.CODE',
    name: 'Konami Code',
    category: 'easter_egg',
    description: 'Answer at the same time of day, 3 days running.',
    unlockMessage: '↳ UP UP DOWN DOWN: Self-care unlocked.',
    secret: true,
  },
  easter_night_owl: {
    id: 'easter_night_owl',
    symbol: 'NIGHT.OWL',
    name: 'Night Owl',
    category: 'easter_egg',
    description: 'Answer after 11:00 PM for 7 consecutive days.',
    unlockMessage: '↳ DO ANDROIDS DREAM OF ELECTRIC SELF-CARE?',
    secret: true,
  },
  easter_dawn_boot: {
    id: 'easter_dawn_boot',
    symbol: 'DAWN.BOOT',
    name: 'Dawn Boot',
    category: 'easter_egg',
    description: 'Answer before 6:00 AM for 7 consecutive days.',
    unlockMessage: '↳ System.sunrise = True. Clarity module online.',
    secret: true,
  },
  easter_extra_life: {
    id: 'easter_extra_life',
    symbol: 'EXTRA.LIFE',
    name: 'Extra Life',
    category: 'easter_egg',
    description: 'Return after an absence of 7 or more days.',
    unlockMessage: '↳ CONTINUE? Y_  . . .  Session resumed.',
    secret: true,
  },
  easter_speedrun: {
    id: 'easter_speedrun',
    symbol: 'SPEEDRUN',
    name: 'Speedrun',
    category: 'easter_egg',
    description: 'Answer within 5 minutes of opening, 10 days straight.',
    unlockMessage: '↳ WR ATTEMPT: 00:04:59. glitchless.',
    secret: true,
  },
  easter_the_answer: {
    id: 'easter_the_answer',
    symbol: 'THE.ANSWER',
    name: 'The Answer',
    category: 'easter_egg',
    description: 'Exactly 42-day streak.',
    unlockMessage: '↳ 42. The answer is always the process.',
    secret: true,
  },
  easter_new_game_plus: {
    id: 'easter_new_game_plus',
    symbol: 'NEW.GAME+',
    name: 'New Game+',
    category: 'easter_egg',
    description: '365-day streak — one full year.',
    unlockMessage: '↳ You finished the base game. New Game+ unlocked.',
    secret: true,
  },
  easter_final_boss: {
    id: 'easter_final_boss',
    symbol: 'FINAL.BOSS',
    name: 'Final Boss',
    category: 'easter_egg',
    description: '1,000 Memory questions answered.',
    unlockMessage: '↳ The final boss was yourself. You won.',
    secret: true,
  },
  easter_true_end: {
    id: 'easter_true_end',
    symbol: 'TRUE.END',
    name: 'True Ending',
    category: 'easter_egg',
    description: 'All other badges collected.',
    unlockMessage: '↳ You found the true ending. The credits roll.',
    secret: true,
  },
  easter_ghost_mode: {
    id: 'easter_ghost_mode',
    symbol: 'GHOST.MODE',
    name: 'Ghost Mode',
    category: 'easter_egg',
    description: '30 days with public profile set to private.',
    unlockMessage: '↳ Entity detected. No trace found.',
    secret: true,
  },
}

// ── Word Achievement Badges ────────────────────────────────────────────────

export const WORD_BADGES: Record<WordBadgeType, AchievementBadge> = {
  // Journey tier
  word_newcomer:   { id: 'word_newcomer',   symbol: 'NEWCOMER',   name: 'Newcomer',   category: 'word', description: 'First Memory answer.',      unlockMessage: '↳ The journey of a thousand days begins now.' },
  word_regular:    { id: 'word_regular',    symbol: 'REGULAR',    name: 'Regular',    category: 'word', description: '10 total answers.',          unlockMessage: '↳ You are building a habit.' },
  word_dedicated:  { id: 'word_dedicated',  symbol: 'DEDICATED',  name: 'Dedicated',  category: 'word', description: '50 total answers.',          unlockMessage: '↳ Dedication is a superpower.' },
  word_veteran:    { id: 'word_veteran',    symbol: 'VETERAN',    name: 'Veteran',    category: 'word', description: '200 total answers.',         unlockMessage: '↳ You have seen the system evolve.' },
  word_legend:     { id: 'word_legend',     symbol: 'LEGEND',     name: 'Legend',     category: 'word', description: '500 total answers.',         unlockMessage: '↳ Your Memory Story is a novel now.' },
  // Data tier
  word_byte:       { id: 'word_byte',       symbol: 'BYTE',       name: 'Byte',       category: 'word', description: '5 questions answered.',      unlockMessage: '↳ First byte of self-knowledge stored.' },
  word_kilobyte:   { id: 'word_kilobyte',   symbol: 'KILOBYTE',   name: 'Kilobyte',   category: 'word', description: '20 questions answered.',     unlockMessage: '↳ A kilobyte of self-awareness.' },
  word_megabyte:   { id: 'word_megabyte',   symbol: 'MEGABYTE',   name: 'Megabyte',   category: 'word', description: '100 questions answered.',    unlockMessage: '↳ Megabyte-class memory density.' },
  word_gigabyte:   { id: 'word_gigabyte',   symbol: 'GIGABYTE',   name: 'Gigabyte',   category: 'word', description: '500 questions answered.',    unlockMessage: '↳ Your story exceeds most libraries.' },
  word_terabyte:   { id: 'word_terabyte',   symbol: 'TERABYTE',   name: 'Terabyte',   category: 'word', description: '1,000 questions answered.',  unlockMessage: '↳ TERABYTE CLASS. The system is you.' },
  // Chapter tier
  word_chapter_1:  { id: 'word_chapter_1',  symbol: 'CHAPTER I',  name: 'Chapter I',  category: 'word', description: 'Day 1.',                    unlockMessage: '↳ The story begins.' },
  word_chapter_3:  { id: 'word_chapter_3',  symbol: 'CHAPTER III',name: 'Chapter III',category: 'word', description: 'Day 30.',                   unlockMessage: '↳ The first arc closes.' },
  word_chapter_7:  { id: 'word_chapter_7',  symbol: 'CHAPTER VII',name: 'Chapter VII',category: 'word', description: 'Day 100.',                  unlockMessage: '↳ The middle of everything.' },
  word_chapter_10: { id: 'word_chapter_10', symbol: 'CHAPTER X',  name: 'Chapter X',  category: 'word', description: 'Day 365.',                  unlockMessage: '↳ A year of chapters.' },
  word_epilogue:   { id: 'word_epilogue',   symbol: 'EPILOGUE',   name: 'Epilogue',   category: 'word', description: 'Day 500+.',                  unlockMessage: '↳ Beyond the story. Into the myth.' },
  // Sys tier
  word_sys_boot:    { id: 'word_sys_boot',    symbol: 'SYS.BOOT',    name: 'SYS.BOOT',    category: 'word', description: 'First session.',    unlockMessage: '↳ Operating system: online.' },
  word_sys_run:     { id: 'word_sys_run',     symbol: 'SYS.RUN',     name: 'SYS.RUN',     category: 'word', description: '7-day streak.',     unlockMessage: '↳ Processes running. Stay online.' },
  word_sys_compile: { id: 'word_sys_compile', symbol: 'SYS.COMPILE', name: 'SYS.COMPILE', category: 'word', description: '30-day streak.',    unlockMessage: '↳ Compiled and optimized.' },
  word_sys_master:  { id: 'word_sys_master',  symbol: 'SYS.MASTER',  name: 'SYS.MASTER',  category: 'word', description: '100-day streak.',   unlockMessage: '↳ Master build. Zero errors.' },
}

// ── Character Class Badges ─────────────────────────────────────────────────

export const CLASS_BADGES: Record<ClassBadgeType, AchievementBadge> = {
  class_ranger:    { id: 'class_ranger',    symbol: '[ RANGER ]',    name: 'Ranger',    category: 'class', description: 'The Explorer archetype confirmed.',   unlockMessage: '↳ Every exploration is a quest. [ RANGER ]' },
  class_artificer: { id: 'class_artificer', symbol: '[ ARTIFICER ]', name: 'Artificer', category: 'class', description: 'The Builder archetype confirmed.',    unlockMessage: '↳ You build what others imagine. [ ARTIFICER ]' },
  class_cleric:    { id: 'class_cleric',    symbol: '[ CLERIC ]',    name: 'Cleric',    category: 'class', description: 'The Healer archetype confirmed.',     unlockMessage: '↳ Rest is a power, not a weakness. [ CLERIC ]' },
  class_archmage:  { id: 'class_archmage',  symbol: '[ ARCHMAGE ]',  name: 'Archmage',  category: 'class', description: 'The Sage archetype confirmed.',       unlockMessage: '↳ Wisdom accumulates like sediment. [ ARCHMAGE ]' },
  class_bard:      { id: 'class_bard',      symbol: '[ BARD ]',      name: 'Bard',      category: 'class', description: 'The Creator archetype confirmed.',    unlockMessage: '↳ Creation is a form of healing. [ BARD ]' },
  class_paladin:   { id: 'class_paladin',   symbol: '[ PALADIN ]',   name: 'Paladin',   category: 'class', description: 'The Guardian archetype confirmed.',   unlockMessage: '↳ Boundaries are sacred architecture. [ PALADIN ]' },
  class_rogue:     { id: 'class_rogue',     symbol: '[ ROGUE ]',     name: 'Rogue',     category: 'class', description: 'The Catalyst archetype confirmed.',   unlockMessage: '↳ The pattern breaker is the pattern. [ ROGUE ]' },
  class_oracle:    { id: 'class_oracle',    symbol: '[ ORACLE ]',    name: 'Oracle',    category: 'class', description: 'The Visionary archetype confirmed.',  unlockMessage: '↳ The future is already a memory. [ ORACLE ]' },
}

// ── Archetype → Class mapping ──────────────────────────────────────────────

export const ARCHETYPE_CLASS_MAP: Record<string, ClassBadgeType> = {
  'The Explorer':  'class_ranger',
  'The Builder':   'class_artificer',
  'The Healer':    'class_cleric',
  'The Sage':      'class_archmage',
  'The Creator':   'class_bard',
  'The Guardian':  'class_paladin',
  'The Catalyst':  'class_rogue',
  'The Visionary': 'class_oracle',
}

// ── Sci-Fi Easter Egg Messages ─────────────────────────────────────────────

export const SCIFI_MESSAGES: Record<string, string> = {
  streak_100_water:   '↳ The spice must flow.',                                              // Dune
  streak_30_water:    '↳ The ocean is thinking about you.',                                 // Solaris
  questions_50:       '↳ Psychohistory confirms: you are ahead of the curve.',              // Foundation
  questions_1000:     '↳ The enemy\'s gate is down. The enemy was entropy.',                // Ender's Game
  streak_42:          '↳ 42. The answer is always the process, not the destination.',       // Hitchhiker's Guide
  badge_reflective:   '↳ DOUBLETHINK.EXE: knowing and not-knowing, simultaneously.',       // 1984
  badge_night_owl:    '↳ Do androids dream of electric self-care? Yes.',                   // Philip K. Dick
  badge_all_complete: '↳ Any sufficiently advanced self-care is indistinguishable from magic.', // Clarke
  deep_reflection:    '↳ Ice broken. The matrix yields.',                                  // Neuromancer
}

// ── Arcade Callback Messages ───────────────────────────────────────────────

export const ARCADE_MESSAGES: Record<string, string> = {
  first_open:         '↳ PRESS START',
  streak_broken:      '↳ GAME OVER... BUT...',
  streak_restored:    '↳ 1-UP',
  questions_100:      '↳ ALL YOUR BASE ARE BELONG TO SELF-CARE',
  first_public:       '↳ IT\'S DANGEROUS TO GO ALONE',
  streak_365:         '↳ YOU WIN!',
  level_complete:     '↳ LEVEL COMPLETE',
  high_score:         '↳ HIGH SCORE',
}

// ── Theme Config ───────────────────────────────────────────────────────────

export const BADGE_THEME_LABELS: Record<BadgeTheme, string> = {
  water:        'Water    ∘ → ≈ → ≋',
  architecture: 'Arch     ├─ → ╞═╡ → ║·║',
  terminal:     'Terminal >_ → >>$ → >|<',
  pixel:        'Pixel    [.] → [o] → [#]',
  circuit:      'Circuit  -o- → -+- → =o=',
  mayan:        'Mayan    ○∿ → ○≈○ → ≋○≋',
}

// Default separator when no badges earned yet
export const DEFAULT_SEPARATOR = '•'

// Progression arrow used across the badge UI
export const PROGRESSION_ARROW = '→'

// Sub-item indicator for hierarchical display
export const SUB_INDICATOR = '↳'

// ── Theme Storage ──────────────────────────────────────────────────────────

export function getBadgeTheme(): BadgeTheme {
  if (typeof window === 'undefined') return 'water'
  try {
    const stored = localStorage.getItem('badge_theme')
    const valid: BadgeTheme[] = ['water', 'architecture', 'terminal', 'pixel', 'circuit', 'mayan']
    return (valid.includes(stored as BadgeTheme) ? stored : 'water') as BadgeTheme
  } catch {
    return 'water'
  }
}

export function setBadgeTheme(theme: BadgeTheme): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('badge_theme', theme)
  } catch (e) {
    console.warn('Failed to set badge theme:', e)
  }
}

// ── Badge Storage ──────────────────────────────────────────────────────────

export function getEarnedBadges(): BadgeType[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('earned_badges')
    if (!stored) return []
    return stored.split(',').filter(Boolean) as BadgeType[]
  } catch {
    return []
  }
}

export function saveEarnedBadges(badges: BadgeType[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('earned_badges', badges.join(','))
  } catch (e) {
    console.warn('Failed to save earned badges:', e)
  }
}

export function hasBadge(badgeId: BadgeType): boolean {
  return getEarnedBadges().includes(badgeId)
}

// ── Badge Award ────────────────────────────────────────────────────────────

let awardingBadge = false

export function awardBadge(badgeId: BadgeType): boolean {
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
    return true
  } finally {
    awardingBadge = false
  }
}

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

// ── Unlock Notification ────────────────────────────────────────────────────

export interface BadgeUnlockResult {
  id: BadgeType
  symbol: string
  name: string
  unlockMessage: string
  category: 'milestone' | 'easter_egg' | 'word' | 'class'
  secret?: boolean
}

export function getNextBadgeUnlock(): BadgeUnlockResult | null {
  if (typeof window === 'undefined') return null
  try {
    const queued = localStorage.getItem('badge_unlock_queue') || ''
    const queue = queued ? queued.split(',').filter(Boolean) : []
    if (queue.length === 0) return null

    const badgeId = queue.shift() as BadgeType
    localStorage.setItem('badge_unlock_queue', queue.join(','))

    const theme = getBadgeTheme()

    // Milestone badge
    const milestone = BADGES[badgeId as MilestoneBadgeType]
    if (milestone) {
      const symbol = getThemeSymbol(milestone, theme)
      const name   = getThemeName(milestone, theme)
      const msg    = getThemeMessage(milestone, theme).replace('[badge]', symbol)
      return { id: badgeId, symbol, name, unlockMessage: msg, category: 'milestone' }
    }

    // Easter egg
    const egg = EASTER_EGG_BADGES[badgeId as EasterEggBadgeType]
    if (egg) {
      return { id: badgeId, symbol: egg.symbol, name: egg.name,
               unlockMessage: egg.unlockMessage, category: 'easter_egg', secret: true }
    }

    // Word badge
    const word = WORD_BADGES[badgeId as WordBadgeType]
    if (word) {
      return { id: badgeId, symbol: word.symbol, name: word.name,
               unlockMessage: word.unlockMessage, category: 'word' }
    }

    // Class badge
    const cls = CLASS_BADGES[badgeId as ClassBadgeType]
    if (cls) {
      return { id: badgeId, symbol: cls.symbol, name: cls.name,
               unlockMessage: cls.unlockMessage, category: 'class' }
    }

    console.warn('Unknown badge ID in queue:', badgeId)
    return null
  } catch (e) {
    console.warn('Failed to get next badge unlock:', e)
    return null
  }
}

// ── Theme Helpers ──────────────────────────────────────────────────────────

export function getThemeSymbol(badge: MilestoneBadge, theme?: BadgeTheme): string {
  const t = theme || getBadgeTheme()
  switch (t) {
    case 'architecture': return badge.architectureSymbol
    case 'terminal':     return badge.terminalSymbol
    case 'pixel':        return badge.pixelSymbol
    case 'circuit':      return badge.circuitSymbol
    case 'mayan':        return badge.mayanSymbol
    default:             return badge.waterSymbol
  }
}

export function getThemeName(badge: MilestoneBadge, theme?: BadgeTheme): string {
  const t = theme || getBadgeTheme()
  switch (t) {
    case 'architecture': return badge.architectureName
    case 'terminal':     return badge.terminalName
    case 'pixel':        return badge.pixelName
    case 'circuit':      return badge.circuitName
    case 'mayan':        return badge.mayanName
    default:             return badge.waterName
  }
}

export function getThemeMessage(badge: MilestoneBadge, theme?: BadgeTheme): string {
  const t = theme || getBadgeTheme()
  switch (t) {
    case 'architecture': return badge.architectureUnlockMessage
    case 'terminal':     return badge.terminalUnlockMessage
    case 'pixel':        return badge.pixelUnlockMessage
    case 'circuit':      return badge.circuitUnlockMessage
    case 'mayan':        return badge.mayanUnlockMessage
    default:             return badge.waterUnlockMessage
  }
}

// ── Level Display ──────────────────────────────────────────────────────────

export function getLevelSymbol(streak: number, theme?: BadgeTheme): string {
  const t = theme || getBadgeTheme()
  if (streak >= 100) return getThemeSymbol(BADGES.milestone_100, t)
  if (streak >= 30)  return getThemeSymbol(BADGES.milestone_30, t)
  if (streak >= 7)   return getThemeSymbol(BADGES.milestone_7, t)
  return ''
}

export function getLevelName(streak: number, theme?: BadgeTheme): string {
  const t = theme || getBadgeTheme()
  if (streak >= 100) return getThemeName(BADGES.milestone_100, t)
  if (streak >= 30)  return getThemeName(BADGES.milestone_30, t)
  if (streak >= 7)   return getThemeName(BADGES.milestone_7, t)
  return ''
}

export function getBadgeProgressionDisplay(theme?: BadgeTheme): string {
  const t = theme || getBadgeTheme()
  return (['milestone_7', 'milestone_30', 'milestone_100'] as const)
    .map(id => getThemeSymbol(BADGES[id], t))
    .join(' → ')
}

// ── Badge Checks ───────────────────────────────────────────────────────────

export async function checkAndAwardBadges(): Promise<BadgeType[]> {
  const newBadges: BadgeType[] = []
  try {
    const response = await fetch('/api/user-stats')
    if (!response.ok) return newBadges

    let stats: { streak?: number; totalAnswers?: number; daysSinceLastAnswer?: number } | null = null
    try {
      stats = await response.json()
    } catch {
      return newBadges
    }

    if (!stats || typeof stats.streak !== 'number') return newBadges

    const { streak, totalAnswers = 0, daysSinceLastAnswer = 0 } = stats

    // ── Milestone badges
    const milestones: Array<[number, MilestoneBadgeType]> = [
      [7,   'milestone_7'],
      [30,  'milestone_30'],
      [100, 'milestone_100'],
    ]
    for (const [threshold, id] of milestones) {
      if (streak >= threshold && !hasBadge(id)) {
        if (awardBadge(id)) newBadges.push(id)
      }
    }

    // ── Word badges — Journey tier
    const journeyMap: Array<[number, WordBadgeType]> = [
      [1,   'word_newcomer'],
      [10,  'word_regular'],
      [50,  'word_dedicated'],
      [200, 'word_veteran'],
      [500, 'word_legend'],
    ]
    for (const [threshold, id] of journeyMap) {
      if (totalAnswers >= threshold && !hasBadge(id)) {
        if (awardBadge(id)) newBadges.push(id)
      }
    }

    // ── Word badges — Data tier
    const dataMap: Array<[number, WordBadgeType]> = [
      [5,    'word_byte'],
      [20,   'word_kilobyte'],
      [100,  'word_megabyte'],
      [500,  'word_gigabyte'],
      [1000, 'word_terabyte'],
    ]
    for (const [threshold, id] of dataMap) {
      if (totalAnswers >= threshold && !hasBadge(id)) {
        if (awardBadge(id)) newBadges.push(id)
      }
    }

    // ── Word badges — Sys tier (mirrors streak milestones)
    const sysMap: Array<[number, WordBadgeType]> = [
      [1,   'word_sys_boot'],
      [7,   'word_sys_run'],
      [30,  'word_sys_compile'],
      [100, 'word_sys_master'],
    ]
    for (const [threshold, id] of sysMap) {
      if (streak >= threshold && !hasBadge(id)) {
        if (awardBadge(id)) newBadges.push(id)
      }
    }

    // ── Easter eggs
    if (totalAnswers >= 1 && !hasBadge('easter_player_one')) {
      if (awardBadge('easter_player_one')) newBadges.push('easter_player_one')
    }
    if (streak === 42 && !hasBadge('easter_the_answer')) {
      if (awardBadge('easter_the_answer')) newBadges.push('easter_the_answer')
    }
    if (streak >= 365 && !hasBadge('easter_new_game_plus')) {
      if (awardBadge('easter_new_game_plus')) newBadges.push('easter_new_game_plus')
    }
    if (totalAnswers >= 1000 && !hasBadge('easter_final_boss')) {
      if (awardBadge('easter_final_boss')) newBadges.push('easter_final_boss')
    }
    if (daysSinceLastAnswer >= 7 && streak > 0 && !hasBadge('easter_extra_life')) {
      if (awardBadge('easter_extra_life')) newBadges.push('easter_extra_life')
    }

  } catch (error) {
    console.warn('Badge check failed:', error)
  }
  return newBadges
}

// ── Utility ────────────────────────────────────────────────────────────────

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function joinWithDots(items: string[]): string {
  if (items.length === 0) return ''
  return items.map(capitalize).join(' · ')
}

export function getAllBadges(): AchievementBadge[] {
  return [
    ...Object.values(EASTER_EGG_BADGES),
    ...Object.values(WORD_BADGES),
    ...Object.values(CLASS_BADGES),
  ]
}

export function getEarnedAchievements(): AchievementBadge[] {
  const earned = getEarnedBadges()
  return getAllBadges().filter(b => earned.includes(b.id))
}
