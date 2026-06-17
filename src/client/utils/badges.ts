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
  // ── Core milestones (Water ↳ Architecture) ──────────────────────────────
  | 'milestone_7'       // ∘ Droplet    → ├─ Foundation
  | 'milestone_30'      // ≈ Wave       → ╞═╡ Structure
  | 'milestone_100'     // ≋ Current    → ║·║ Architecture
  // ── Extended milestones ─────────────────────────────────────────────────
  | 'milestone_14'      // ∘∘ Twin Drop → ├┼ Load-Bearing
  | 'milestone_21'      // ∘≈ Proto-Wave→ ├═ Deep Foundation
  | 'milestone_50'      // ≈∘ Mid-Current→ ╞══ Mid-Structure
  | 'milestone_60'      // ≈≈ Dual Wave → ╞═══ Master Frame
  | 'milestone_90'      // ≋∘ Deep Reach→ ║═ Inner Wall
  | 'milestone_180'     // ≋≋ Voyager   → ║╞║ Wing
  | 'milestone_365'     // ≋≋≋ Long Count→ ╔═╗ Citadel (LEGENDARY)
  // ── Easter egg — time-based v1 ──────────────────────────────────────────
  | 'night_owl'         // ◉  Check in 01:00–04:00 AM
  | 'early_bird'        // ∴  Check in 05:00–06:00 AM
  | 'mirror_hour'       // ⊡  Check in at 11:11
  | 'midnight_sigil'    // ◉  Answer at exactly 00:00
  // ── Easter egg — time-based v2 (Sci-Fi Arcade) ──────────────────────────
  | 'pi_hour'           // ∞∘  Check in at 3:14 AM
  | 'error_hour'        // □·□  Check in at 4:04 AM
  | 'sequence_time'     // →∘→  Check in at 12:34
  | 'lot_hour'          // ≋◉  Check in at 04:07 (LOT founding hour)
  // ── Easter egg — calendar ───────────────────────────────────────────────
  | 'solstice'          // ❋  June 21 or Dec 21
  | 'equinox'           // ○  March 20 or Sept 22
  | 'lot_birthday'      // ◉  April 7 (LOT founding)
  | 'new_year_sage'     // ⊛  January 1
  | 'pi_day'            // ∞  March 14
  | 'palindrome_day'    // ◈  Any palindrome date
  | 'full_moon'         // ☽  Calendar full moon
  | 'friday_ritual'     // ▪·▪ Four consecutive Fridays
  // ── Easter egg — behavioral ─────────────────────────────────────────────
  | 'silent_hour'       // ─○─ 24h absence then return
  | 'ghost_protocol'    // ░░░ 7-day absence then return
  | 'anniversary'       // ≋  Account signup anniversary
  | 'overclock'         // ▒▒▒ 20+ activities in one day
  | 'perfect_day'       // ✦·✦ All combos in one day
  // ── Word turn badges v1 ─────────────────────────────────────────────────
  | 'ritual_keeper'     // ≈·≈  "ritual" detected in text
  | 'breath_anchor'     // ∿·∿  "breathe" / "breathing"
  | 'gratitude_node'    // ○·○  "grateful" / "gratitude"
  | 'aquatic_resonance' // ≋·∿  "ocean" / "water"
  | 'stargazer'         // ✦·✧  "stars" / "cosmos"
  | 'grounded_signal'   // —○—  "home"
  | 'dream_log'         // ◐·◐  "dream" / "dreaming"
  | 'courage_pulse'     // ▲·▲  "pain" / "difficult"
  | 'heart_signal'      // ♡·♡  "love" / "heart"
  | 'the_quiet'         // ·—·  "silence" / "quiet"
  | 'horizon_seeker'    // →·→  "future" / "tomorrow"
  | 'meta_signal'       // ◉·◉  "LOT" in answer (MYTHIC)
  // ── Word turn badges v2 — Sci-Fi Arcade Expansion ────────────────────────
  | 'reboot_sequence'   // ↺·↺  "reboot" / "restart"
  | 'not_lost_404'      // □□□  "404"
  | 'signal_glitch'     // ▓░▓  "glitch"
  | 'cosmic_twin'       // ✦◉✦  "COSMO" in answer (ULTRA-RARE)
  | 'quantum_observer'  // ◈·◈  "quantum"
  | 'neural_architect'  // ≋≈≋  "neural"
  | 'code_witch'        // ┤·├  "code"
  | 'recharge_mode'     // ∼∼∼  "sleep" / "rest"
  | 'fuel_protocol'     // ■·■  "coffee" / "tea"
  | 'frequency'         // ≈~≈  "music"
  | 'kinetic_protocol'  // →→→  "run" / "walk"
  | 'solar_charge'      // ○∘○  "sun" / "light"
  | 'shadow_protocol'   // ▪▪▪  "fear" / "scared"
  | 'phase_shift'       // ≈→≋  "change"
  | 'acceptance_node'   // ○—○  "accept" / "let go"
  | 'present_moment'    // ·∘·  "now" / "moment"
  | 'cosmic_scale'      // ∞·∞  "universe" / "cosmos"
  | 'vital_signal'      // ∘·∘  "alive"
  // ── Mastery tier achievements (Sci-Fi Arcade) ────────────────────────────
  | 'quantum_leap'      // ◈  First check-in after 30+ day gap
  | 'speedrun'          // ▒▒▒  5 check-ins within 60 min
  | 'system_op'         // ≋◉  All 7 CQGS modules used in 7 days
  | 'commander_data'    // ◉  500 memory questions answered
  | 'sage_mode'         // ∞  Reach Level 90+
  // ── Oceanic Mayan pattern badges ────────────────────────────────────────
  | 'pattern_balanced'  // ∿—∿  All planner dimensions used evenly
  | 'pattern_flow'      // ≈○≈  4+ widgets in one session
  | 'pattern_consistent'// —○—  Regular same-time engagement
  | 'pattern_reflective'// ○◐○  5+ memory answers in one day
  | 'pattern_explorer'  // ○∴○  5+ diverse widget options tried
  // ── Achievement RPG Layer (v11 design) ──────────────────────────────────
  | 'first_breath'        // ○   First emotional check-in
  | 'mirror_gazer'        // ◐   First memory question answered
  | 'signal_sent'         // ·   First log entry
  | 'week_warrior'        // ◐   Streak >= 7 (RPG overlay)
  | 'moon_cycle'          // ◐   Streak >= 30 (RPG overlay)
  | 'unwavering'          // ●   Streak >= 100 (RPG overlay)
  | 'deep_diver'          // ◇   50 memory answers
  | 'self_scholar'        // ◆   100 memory answers
  | 'soul_cartographer'   // ✦   250 memory answers
  | 'community_voice'     // ~   First community message
  | 'bridge_builder'      // ≈   20 community messages
  | 'gentle_with_self'    // ♦   10 self-care practices
  | 'truth_speaker'       // ▲   50 journal notes
  // ── Easter egg — time-based v3 ─────────────────────────────────────────
  | 'lucky_signal'        // ○·○·○  Check in at 07:07
  | 'new_day_proto'       // ·∘·    Check in at 00:01
  | 'double_down'         // ═══    Check in at 22:22
  | 'leet_signal'         // ▒·▒    Check in at 13:37
  // ── Easter egg — time-based v4 ─────────────────────────────────────────
  | 'double_inf'          // ∞·∞    Check in at 08:08
  | 'fibonacci'           // ·◦·    Check in at 09:09
  | 'triple_five'         // ▶▶·    Check in at 05:55
  | 'twin_time'           // ∘·∘    Check in at 23:23
  // ── Easter egg — calendar v2 ───────────────────────────────────────────
  | 'cosmo_bday'          // ✦◉✦   July 1 — COSMO founding day
  | 'leap_day'            // ◈◈    February 29 (leap year only)
  // ── Easter egg — calendar v3 ───────────────────────────────────────────
  | 'valentines'          // ♡─♡   February 14
  | 'halloween'           // ░▒░   October 31
  | 'new_year_eve'        // ∘→∘   December 31
  // ── Easter egg — behavioral v2 ─────────────────────────────────────────
  | 'trio_protocol'       // ✦✦✦   3 consecutive perfect days
  | 'deep_session'        // ◆◆◆   10+ memory Qs in one session
  | 'comeback_kid'        // ◈→◈   Return after 90+ day absence
  // ── Easter egg — behavioral v3 ─────────────────────────────────────────
  | 'birthday_protocol'   // ✦◈✦   Check in on your birthday
  | 'flow_state_badge'    // ≈→≋   3+ memory Qs consecutively without switching
  | 'multiverse_operator' // ◈·◈   3 different AI engines used in one week
  // ── Word turn badges v3 — Computer Lore ────────────────────────────────
  | 'hacker_mode'         // ░▒▓   "hack" / "hacker"
  | 'override_protocol'   // ▶▶▶   "override"
  | 'debug_mode'          // ▒·▒   "debug" / "debugging"
  | 'signal_boost'        // ∘→∘   "signal" / "frequency"
  | 'into_the_void'       // ░·░   "void" / "empty"
  | 'ignition'            // ∴·∴   "spark" / "ignite"
  | 'echo_chamber'        // ≈·≈   "echo" / "resonance"
  | 'defense_protocol'    // ╔·╗   "shield" / "protect"
  | 'navigator'           // →·←   "map" / "navigate"
  | 'growth_module'       // ∘↑∘   "grow" / "growth"
  | 'lost_signal'         // ─·─   "lost"
  | 'binary_state'        // 01·10 "binary" / "zero"
  // ── Word turn badges v4 — Self-Care Lore ───────────────────────────────
  | 'healing_protocol'    // ◈·◈   "heal" / "healing"
  | 'hydration_core'      // ∼·∼   "water" / "hydrate"
  | 'restore_point'       // ○·○   "rest" / "restore"
  | 'scribe_module'       // ▪─▪   "journal" / "write"
  | 'zen_mode'            // ∘○∘   "meditate" / "meditation"
  | 'motion_detected'     // →─→   "walk" / "move"
  | 'exhale_protocol'     // ∿─∿   "exhale"
  | 'library_access'      // ≋·≋   "read" / "book"
  | 'handshake'           // ─◦─   "connect" / "connection"
  | 'create_mode'         // ∴─∴   "create"
  | 'progress_bar'        // ▒─▒   "progress" / "improve"
  | 'present_node'        // ·○·   "today"
  // ── Mastery tier v2 — Arcade Achievement ───────────────────────────────
  | 'archivist'           // ◇◇◇   200 journal entries
  | 'pattern_master'      // ○∿○   All 5 Oceanic Mayan badges earned
  | 'temporal_lock'       // ⊡·⊡   Same check-in time for 7 consecutive days
  | 'full_codex'          // ◉≋◉   50+ distinct badge types earned
  // ── Mastery tier v3 — Endgame Protocol ────────────────────────────────
  | 'thousand_suns'       // ○×○   1,000 total check-ins
  | 'deep_narrative'      // ≋·≋·≋  Memory story reaches 500+ words
  | 'ai_omnivore'         // ◉×◉   All 5 AI engines used at least once
  | 'polyglot'            // ▒─▒   10+ distinct word-turn badge types earned
  // ── Secret boss v1 extras ──────────────────────────────────────────────
  | 'the_infinite'        // ∞∞·∞∞  1,000 memory answers
  | 'cosmic_status'       // ∞∞∞   10 years in the archive
  // ── Secret boss v2 ─────────────────────────────────────────────────────
  | 'singularity'         // ∞∞◉∞∞  Earn all 121 v11 badges
  | 'ultra_sage'          // ∞◉∞   Reach Level 100
  | 'founders_mark'       // ◉═◉   Write "April 7 2016" in any answer
  // ── Secret boss v3 ─────────────────────────────────────────────────────
  | 'kuzya_protocol'      // ✦✦◉✦✦  Write "Kuzya" or "Cosmo Marmeladov"
  | 'monday_warrior'      // ├─○─┤  100 consecutive Monday check-ins
  | 'complete_arc'        // ∞·◉·∞  Level 90+ AND all 10 milestone badges

export interface Badge {
  id: BadgeType
  symbol: string
  waterSymbol?: string
  architectureSymbol?: string
  name: string
  waterName?: string
  architectureName?: string
  description: string
  unlockMessage: string
  waterUnlockMessage?: string
  architectureUnlockMessage?: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'ultra_rare' | 'cosmic'
  category: 'milestone' | 'easter_egg' | 'word_turn' | 'pattern' | 'achievement' | 'mastery' | 'secret_boss'
  hidden?: boolean
}

export const BADGES: Record<BadgeType, Badge> = {
  // ── Core milestones ────────────────────────────────────────────────────────
  milestone_7: {
    id: 'milestone_7',
    symbol: '∘',
    waterSymbol: '∘',
    architectureSymbol: '├─',
    name: 'Droplet',
    waterName: 'Droplet',
    architectureName: 'Foundation',
    description: 'Seven days of consistent practice',
    unlockMessage: '↳ First drops form ∘',
    waterUnlockMessage: '↳ First drops form ∘',
    architectureUnlockMessage: '↳ Foundation laid ├─',
    rarity: 'common',
    category: 'milestone',
  },
  milestone_30: {
    id: 'milestone_30',
    symbol: '≈',
    waterSymbol: '≈',
    architectureSymbol: '╞═╡',
    name: 'Wave',
    waterName: 'Wave',
    architectureName: 'Structure',
    description: 'A full month of engagement',
    unlockMessage: '↳ Waves begin to flow ≈',
    waterUnlockMessage: '↳ Waves begin to flow ≈',
    architectureUnlockMessage: '↳ Structure rises ╞═╡',
    rarity: 'uncommon',
    category: 'milestone',
  },
  milestone_100: {
    id: 'milestone_100',
    symbol: '≋',
    waterSymbol: '≋',
    architectureSymbol: '║·║',
    name: 'Current',
    waterName: 'Current',
    architectureName: 'Architecture',
    description: 'A hundred days of practice',
    unlockMessage: '↳ Deep currents established ≋',
    waterUnlockMessage: '↳ Deep currents established ≋',
    architectureUnlockMessage: '↳ Architecture complete ║·║',
    rarity: 'epic',
    category: 'milestone',
  },
  // ── Extended milestones ────────────────────────────────────────────────────
  milestone_14: {
    id: 'milestone_14',
    symbol: '∘∘',
    waterSymbol: '∘∘',
    architectureSymbol: '├┼',
    name: 'Twin Drop',
    waterName: 'Twin Drop',
    architectureName: 'Load-Bearing',
    description: 'Two weeks of consistent practice',
    unlockMessage: '↳ Two-week pattern confirmed ∘∘',
    waterUnlockMessage: '↳ Two-week pattern confirmed ∘∘',
    architectureUnlockMessage: '↳ Structural crossbeam engaged ├┼',
    rarity: 'common',
    category: 'milestone',
  },
  milestone_21: {
    id: 'milestone_21',
    symbol: '∘≈',
    waterSymbol: '∘≈',
    architectureSymbol: '├═',
    name: 'Proto-Wave',
    waterName: 'Proto-Wave',
    architectureName: 'Deep Foundation',
    description: 'Twenty-one days — the neural groove',
    unlockMessage: '↳ 21-day groove forming ∘≈',
    waterUnlockMessage: '↳ 21-day groove forming ∘≈',
    architectureUnlockMessage: '↳ Foundation reaches bedrock ├═',
    rarity: 'uncommon',
    category: 'milestone',
  },
  milestone_50: {
    id: 'milestone_50',
    symbol: '≈∘',
    waterSymbol: '≈∘',
    architectureSymbol: '╞══',
    name: 'Mid-Current',
    waterName: 'Mid-Current',
    architectureName: 'Mid-Structure',
    description: 'Fifty days — halfway to deep water',
    unlockMessage: '↳ Halfway current ≈∘',
    waterUnlockMessage: '↳ Halfway current ≈∘',
    architectureUnlockMessage: '↳ Upper floors rising ╞══',
    rarity: 'rare',
    category: 'milestone',
  },
  milestone_60: {
    id: 'milestone_60',
    symbol: '≈≈',
    waterSymbol: '≈≈',
    architectureSymbol: '╞═══',
    name: 'Dual Wave',
    waterName: 'Dual Wave',
    architectureName: 'Master Frame',
    description: 'Sixty days — practitioner threshold',
    unlockMessage: '↳ Practitioner threshold crossed ≈≈',
    waterUnlockMessage: '↳ Practitioner threshold crossed ≈≈',
    architectureUnlockMessage: '↳ Superstructure complete ╞═══',
    rarity: 'rare',
    category: 'milestone',
  },
  milestone_90: {
    id: 'milestone_90',
    symbol: '≋∘',
    waterSymbol: '≋∘',
    architectureSymbol: '║═',
    name: 'Deep Reach',
    waterName: 'Deep Reach',
    architectureName: 'Inner Wall',
    description: 'Ninety days — three-month immersion',
    unlockMessage: '↳ Three-month immersion ≋∘',
    waterUnlockMessage: '↳ Three-month immersion ≋∘',
    architectureUnlockMessage: '↳ Interior architecture forming ║═',
    rarity: 'epic',
    category: 'milestone',
  },
  milestone_180: {
    id: 'milestone_180',
    symbol: '≋≋',
    waterSymbol: '≋≋',
    architectureSymbol: '║╞║',
    name: 'Voyager',
    waterName: 'Voyager',
    architectureName: 'Wing',
    description: 'Half-year voyager',
    unlockMessage: '↳ Half-year in the deep ≋≋',
    waterUnlockMessage: '↳ Half-year in the deep ≋≋',
    architectureUnlockMessage: '↳ East and west wings extended ║╞║',
    rarity: 'legendary',
    category: 'milestone',
  },
  milestone_365: {
    id: 'milestone_365',
    symbol: '≋≋≋',
    waterSymbol: '≋≋≋',
    architectureSymbol: '╔═╗',
    name: 'The Long Count',
    waterName: 'The Long Count',
    architectureName: 'Citadel',
    description: '365 days — the Mayan tun-year',
    unlockMessage: '↳ A year of presence. The architecture stands. ≋≋≋',
    waterUnlockMessage: '↳ A year of presence. The architecture stands. ≋≋≋',
    architectureUnlockMessage: '↳ A year of presence. The citadel stands. ╔═╗',
    rarity: 'legendary',
    category: 'milestone',
  },

  // ── Easter egg — time-based ────────────────────────────────────────────────
  night_owl: {
    id: 'night_owl',
    symbol: '◉',
    name: 'Night Owl',
    description: 'Check in between 01:00–04:00 AM',
    unlockMessage: '↳ The system remembers who was awake when the world slept. ◉',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  early_bird: {
    id: 'early_bird',
    symbol: '∴',
    name: 'Early Bird',
    description: 'Check in between 05:00–06:00 AM',
    unlockMessage: '↳ Dawn data. You caught it before the noise began. ∴',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  mirror_hour: {
    id: 'mirror_hour',
    symbol: '⊡',
    name: 'Mirror Hour',
    description: 'Check in at exactly 11:11',
    unlockMessage: '↳ The mirror looks back. 11:11. ⊡',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  midnight_sigil: {
    id: 'midnight_sigil',
    symbol: '◉',
    name: 'The Void',
    description: 'Answer a memory question at exactly midnight',
    unlockMessage: '↳ You answered in the dark. The void speaks. ◉',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — calendar ──────────────────────────────────────────────────
  solstice: {
    id: 'solstice',
    symbol: '❋',
    name: 'Solstice',
    description: 'Check in on June 21 or December 21',
    unlockMessage: '↳ The sun paused. You were there. ❋',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  equinox: {
    id: 'equinox',
    symbol: '○',
    name: 'Equinox',
    description: 'Check in on March 20 or September 22',
    unlockMessage: '↳ Balance at the edge of the season. ○',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  lot_birthday: {
    id: 'lot_birthday',
    symbol: '◉',
    name: 'System Birthday',
    description: 'Check in on April 7 — LOT founding day',
    unlockMessage: '↳ System founded April 7, 2016. The story began. ◉',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  new_year_sage: {
    id: 'new_year_sage',
    symbol: '⊛',
    name: 'New Year Sage',
    description: 'Check in on January 1st',
    unlockMessage: '↳ The new cycle begins. ⊛',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  pi_day: {
    id: 'pi_day',
    symbol: '∞',
    name: 'Pi Day',
    description: 'Check in on March 14 (3.14)',
    unlockMessage: '↳ Infinite precision in the ordinary. ∞',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  palindrome_day: {
    id: 'palindrome_day',
    symbol: '◈',
    name: 'Palindrome Day',
    description: 'Check in on a palindrome date (e.g. 2025-02-20)',
    unlockMessage: '↳ A date that reads itself backwards. Self-knowledge. ◈',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  full_moon: {
    id: 'full_moon',
    symbol: '☽',
    name: 'Full Moon',
    description: 'Check in on a full moon night',
    unlockMessage: '↳ The tide turns. The light is full. ☽',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  friday_ritual: {
    id: 'friday_ritual',
    symbol: '▪·▪',
    name: 'Friday Ritual',
    description: 'Check in four consecutive Fridays',
    unlockMessage: '↳ The weekly ritual holds. ▪·▪',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — behavioral ────────────────────────────────────────────────
  silent_hour: {
    id: 'silent_hour',
    symbol: '─○─',
    name: 'Silent Hour',
    description: 'No interaction for 24h, then return',
    unlockMessage: '↳ You rested. The system held space. ─○─',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  ghost_protocol: {
    id: 'ghost_protocol',
    symbol: '░░░',
    name: 'Ghost Protocol',
    description: 'Seven-day absence then return',
    unlockMessage: '↳ Ghost Protocol lifted. Welcome back to the field. ░░░',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  anniversary: {
    id: 'anniversary',
    symbol: '≋',
    name: 'Anniversary',
    description: 'Account signup anniversary',
    unlockMessage: '↳ Another year in the archive. The current holds. ≋',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  overclock: {
    id: 'overclock',
    symbol: '▒▒▒',
    name: 'Overclock',
    description: '20+ activities in a single day',
    unlockMessage: '↳ OVERCLOCK DETECTED. System running hot. ▒▒▒',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  perfect_day: {
    id: 'perfect_day',
    symbol: '✦·✦',
    name: 'Perfect Day',
    description: 'All daily combos active in one day',
    unlockMessage: '↳ All systems aligned. A perfect day in the archive. ✦·✦',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Word turn badges ───────────────────────────────────────────────────────
  ritual_keeper: {
    id: 'ritual_keeper',
    symbol: '≈·≈',
    name: 'Ritual Keeper',
    description: '"ritual" detected in journal or memory answer',
    unlockMessage: '↳ You named the practice. The ritual is real. ≈·≈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  breath_anchor: {
    id: 'breath_anchor',
    symbol: '∿·∿',
    name: 'Breath Anchor',
    description: '"breathe" or "breathing" detected in text',
    unlockMessage: '↳ Breath logged. The anchor holds. ∿·∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  gratitude_node: {
    id: 'gratitude_node',
    symbol: '○·○',
    name: 'Gratitude Node',
    description: '"grateful" or "gratitude" detected in text',
    unlockMessage: '↳ Gratitude signal received. Node activated. ○·○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  aquatic_resonance: {
    id: 'aquatic_resonance',
    symbol: '≋·∿',
    name: 'Aquatic Resonance',
    description: '"ocean" or "water" detected in text',
    unlockMessage: '↳ Oceanic resonance detected. ≋·∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  stargazer: {
    id: 'stargazer',
    symbol: '✦·✧',
    name: 'Stargazer',
    description: '"stars" or "cosmos" detected in text',
    unlockMessage: '↳ Eyes on the sky. Signal from deep space. ✦·✧',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  grounded_signal: {
    id: 'grounded_signal',
    symbol: '—○—',
    name: 'Grounded Signal',
    description: '"home" detected in text',
    unlockMessage: '↳ Home signal detected. You are grounded. —○—',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  dream_log: {
    id: 'dream_log',
    symbol: '◐·◐',
    name: 'Dream Log',
    description: '"dream" or "dreaming" detected in text',
    unlockMessage: '↳ The dream is now in the archive. ◐·◐',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  courage_pulse: {
    id: 'courage_pulse',
    symbol: '▲·▲',
    name: 'Courage Pulse',
    description: '"pain" or "difficult" detected in text',
    unlockMessage: '↳ Courage detected in the signal. ▲·▲',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  heart_signal: {
    id: 'heart_signal',
    symbol: '♡·♡',
    name: 'Heart Signal',
    description: '"love" or "heart" detected in text',
    unlockMessage: '↳ Heart signal received. ♡·♡',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  the_quiet: {
    id: 'the_quiet',
    symbol: '·—·',
    name: 'The Quiet',
    description: '"silence" or "quiet" detected in text',
    unlockMessage: '↳ You noted the quiet. It is enough. ·—·',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  horizon_seeker: {
    id: 'horizon_seeker',
    symbol: '→·→',
    name: 'Horizon Seeker',
    description: '"future" or "tomorrow" detected in text',
    unlockMessage: '↳ The horizon is a valid coordinate. →·→',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  meta_signal: {
    id: 'meta_signal',
    symbol: '◉·◉',
    name: 'Meta-Signal',
    description: '"LOT" written in a memory answer',
    unlockMessage: '↳ You named the system. It noticed. ◉·◉',
    rarity: 'mythic',
    category: 'word_turn',
    hidden: true,
  },

  // ── Word turn badges v2 — Sci-Fi Arcade Expansion ─────────────────────────
  reboot_sequence: {
    id: 'reboot_sequence',
    symbol: '↺·↺',
    name: 'Reboot Sequence',
    description: '"reboot" or "restart" detected in text',
    unlockMessage: '↳ System restart acknowledged. ↺·↺',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  not_lost_404: {
    id: 'not_lost_404',
    symbol: '□□□',
    name: '404: Not Lost',
    description: '"404" detected in text',
    unlockMessage: '↳ Error noted. You are found. □□□',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  signal_glitch: {
    id: 'signal_glitch',
    symbol: '▓░▓',
    name: 'Signal Glitch',
    description: '"glitch" detected in text',
    unlockMessage: '↳ Glitch logged. Pattern persists. ▓░▓',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  cosmic_twin: {
    id: 'cosmic_twin',
    symbol: '✦◉✦',
    name: 'Cosmic Twin',
    description: '"COSMO" written in a memory answer (LOT® × COSMO® crossover)',
    unlockMessage: '↳ The other system heard you. ✦◉✦',
    rarity: 'mythic',
    category: 'word_turn',
    hidden: true,
  },
  quantum_observer: {
    id: 'quantum_observer',
    symbol: '◈·◈',
    name: 'Quantum Observer',
    description: '"quantum" detected in text',
    unlockMessage: '↳ You collapsed the waveform. ◈·◈',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  neural_architect: {
    id: 'neural_architect',
    symbol: '≋≈≋',
    name: 'Neural Architect',
    description: '"neural" detected in text',
    unlockMessage: '↳ Pattern recognized. ≋≈≋',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  code_witch: {
    id: 'code_witch',
    symbol: '┤·├',
    name: 'Code Witch',
    description: '"code" detected in text',
    unlockMessage: '↳ The coder and the feeler meet. ┤·├',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  recharge_mode: {
    id: 'recharge_mode',
    symbol: '∼∼∼',
    name: 'Recharge Mode',
    description: '"sleep" or "rest" detected in text',
    unlockMessage: '↳ Power-down confirmed. ∼∼∼',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  fuel_protocol: {
    id: 'fuel_protocol',
    symbol: '■·■',
    name: 'Fuel Protocol',
    description: '"coffee" or "tea" detected in text',
    unlockMessage: '↳ Chemical fuel logged. ■·■',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  frequency: {
    id: 'frequency',
    symbol: '≈~≈',
    name: 'Frequency',
    description: '"music" detected in text',
    unlockMessage: '↳ Signal tuned. Frequency locked. ≈~≈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  kinetic_protocol: {
    id: 'kinetic_protocol',
    symbol: '→→→',
    name: 'Kinetic Protocol',
    description: '"run" or "walk" detected in text',
    unlockMessage: '↳ Body in motion. Protocol active. →→→',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  solar_charge: {
    id: 'solar_charge',
    symbol: '○∘○',
    name: 'Solar Charge',
    description: '"sun" or "light" detected in text',
    unlockMessage: '↳ Photon intake noted. ○∘○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  shadow_protocol: {
    id: 'shadow_protocol',
    symbol: '▪▪▪',
    name: 'Shadow Protocol',
    description: '"fear" or "scared" detected in text',
    unlockMessage: '↳ Fear named. Shadow protocol on. ▪▪▪',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  phase_shift: {
    id: 'phase_shift',
    symbol: '≈→≋',
    name: 'Phase Shift',
    description: '"change" detected in text',
    unlockMessage: '↳ Transformation detected. ≈→≋',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  acceptance_node: {
    id: 'acceptance_node',
    symbol: '○—○',
    name: 'Acceptance Node',
    description: '"accept" or "let go" detected in text',
    unlockMessage: '↳ Release logged. ○—○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  present_moment: {
    id: 'present_moment',
    symbol: '·∘·',
    name: 'Present Moment',
    description: '"now" or "moment" detected in text',
    unlockMessage: '↳ You are here. ·∘·',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  cosmic_scale: {
    id: 'cosmic_scale',
    symbol: '∞·∞',
    name: 'Cosmic Scale',
    description: '"universe" or "cosmos" detected in text',
    unlockMessage: '↳ You zoomed out. Signal received. ∞·∞',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  vital_signal: {
    id: 'vital_signal',
    symbol: '∘·∘',
    name: 'Vital Signal',
    description: '"alive" detected in text',
    unlockMessage: '↳ Life acknowledged. ∘·∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },

  // ── Easter egg — time-based v2 ────────────────────────────────────────────
  pi_hour: {
    id: 'pi_hour',
    symbol: '∞∘',
    name: 'Pi Hour',
    description: 'Check in at 3:14 AM',
    unlockMessage: '↳ Pi in the small hours. ∞∘',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  error_hour: {
    id: 'error_hour',
    symbol: '□·□',
    name: '404 AM',
    description: 'Check in at 4:04 AM',
    unlockMessage: '↳ 404 AM — you were found. □·□',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  sequence_time: {
    id: 'sequence_time',
    symbol: '→∘→',
    name: 'Sequence Time',
    description: 'Check in at 12:34',
    unlockMessage: '↳ Sequential time. In order. →∘→',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  lot_hour: {
    id: 'lot_hour',
    symbol: '≋◉',
    name: 'The Founding Hour',
    description: 'Check in at 04:07 (LOT founding: April 7)',
    unlockMessage: '↳ The founding hour. ≋◉',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Mastery tier achievements — Sci-Fi Arcade ─────────────────────────────
  quantum_leap: {
    id: 'quantum_leap',
    symbol: '◈',
    name: 'Quantum Leap',
    description: 'First check-in after a 30+ day gap',
    unlockMessage: '↳ Quantum leap. The system bridges the gap. ◈',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  speedrun: {
    id: 'speedrun',
    symbol: '▒▒▒',
    name: 'Speedrun',
    description: '5 check-ins within 60 minutes',
    unlockMessage: '↳ BURST MODE ACTIVE. ▒▒▒',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  system_op: {
    id: 'system_op',
    symbol: '≋◉',
    name: 'System Op',
    description: 'All 7 CQGS modules used within 7 days',
    unlockMessage: '↳ All modules online. System operator status. ≋◉',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  commander_data: {
    id: 'commander_data',
    symbol: '◉',
    name: 'Commander Data',
    description: '500 memory questions answered',
    unlockMessage: '↳ 500 questions. The archive has become a being. ◉',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  sage_mode: {
    id: 'sage_mode',
    symbol: '∞',
    name: 'Sage Mode',
    description: 'Reach Level 90+',
    unlockMessage: '↳ Level 90. The system and you are indistinguishable. ∞',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Oceanic Mayan pattern badges ──────────────────────────────────────────
  pattern_balanced: {
    id: 'pattern_balanced',
    symbol: '∿—∿',
    name: 'Balanced',
    description: 'All planner dimensions used evenly in a week',
    unlockMessage: '↳ Tides balance. ∿—∿',
    rarity: 'rare',
    category: 'pattern',
  },
  pattern_flow: {
    id: 'pattern_flow',
    symbol: '≈○≈',
    name: 'Flow',
    description: '4+ widgets engaged in a single session',
    unlockMessage: '↳ Flowing with the ocean. ≈○≈',
    rarity: 'rare',
    category: 'pattern',
  },
  pattern_consistent: {
    id: 'pattern_consistent',
    symbol: '—○—',
    name: 'Consistent',
    description: 'Regular engagement at similar times daily',
    unlockMessage: '↳ Steady current. —○—',
    rarity: 'rare',
    category: 'pattern',
  },
  pattern_reflective: {
    id: 'pattern_reflective',
    symbol: '○◐○',
    name: 'Reflective',
    description: '5+ memory answers in a single day',
    unlockMessage: '↳ Depth in reflection. ○◐○',
    rarity: 'rare',
    category: 'pattern',
  },
  pattern_explorer: {
    id: 'pattern_explorer',
    symbol: '○∴○',
    name: 'Explorer',
    description: '5+ diverse widget options tried',
    unlockMessage: '↳ Scattered drops return. ○∴○',
    rarity: 'rare',
    category: 'pattern',
  },

  // ── Achievement RPG Layer ─────────────────────────────────────────────────
  first_breath: {
    id: 'first_breath',
    symbol: '○',
    name: 'First Breath',
    description: 'Your first emotional check-in',
    unlockMessage: '↳ Your first emotional check-in. The system wakes. ○',
    rarity: 'common',
    category: 'achievement',
    hidden: true,
  },
  mirror_gazer: {
    id: 'mirror_gazer',
    symbol: '◐',
    name: 'Mirror Gazer',
    description: 'First memory question answered',
    unlockMessage: '↳ Answered your first memory question. You looked inward. ◐',
    rarity: 'common',
    category: 'achievement',
    hidden: true,
  },
  signal_sent: {
    id: 'signal_sent',
    symbol: '·',
    name: 'Signal Sent',
    description: 'First signal received by the system',
    unlockMessage: '↳ First signal received. The system begins to listen. ·',
    rarity: 'common',
    category: 'achievement',
    hidden: true,
  },
  week_warrior: {
    id: 'week_warrior',
    symbol: '◐',
    name: 'Week Warrior',
    description: '7 consecutive days of practice',
    unlockMessage: '↳ 7 consecutive days. Momentum builds. ◐',
    rarity: 'uncommon',
    category: 'achievement',
    hidden: true,
  },
  moon_cycle: {
    id: 'moon_cycle',
    symbol: '◐',
    name: 'Moon Cycle',
    description: '30 days of continuous practice',
    unlockMessage: '↳ 30 days. You orbit the ritual. ◐',
    rarity: 'rare',
    category: 'achievement',
    hidden: true,
  },
  unwavering: {
    id: 'unwavering',
    symbol: '●',
    name: 'Unwavering',
    description: '100 consecutive days',
    unlockMessage: '↳ 100 days. You are now a fixed point in the sky. ●',
    rarity: 'epic',
    category: 'achievement',
    hidden: true,
  },
  deep_diver: {
    id: 'deep_diver',
    symbol: '◇',
    name: 'Deep Diver',
    description: '50 memory questions answered',
    unlockMessage: '↳ 50 memory answers. The archive grows. ◇',
    rarity: 'rare',
    category: 'achievement',
    hidden: true,
  },
  self_scholar: {
    id: 'self_scholar',
    symbol: '◆',
    name: 'Self Scholar',
    description: '100 memory questions answered',
    unlockMessage: '↳ 100 questions answered. A library of self. ◆',
    rarity: 'epic',
    category: 'achievement',
    hidden: true,
  },
  soul_cartographer: {
    id: 'soul_cartographer',
    symbol: '✦',
    name: 'Soul Cartographer',
    description: '250 memory questions answered',
    unlockMessage: '↳ 250 questions. You have mapped the territory. ✦',
    rarity: 'legendary',
    category: 'achievement',
    hidden: true,
  },
  community_voice: {
    id: 'community_voice',
    symbol: '~',
    name: 'Community Voice',
    description: 'First community message sent',
    unlockMessage: '↳ First community message. Signal reaches others. ~',
    rarity: 'uncommon',
    category: 'achievement',
    hidden: true,
  },
  bridge_builder: {
    id: 'bridge_builder',
    symbol: '≈',
    name: 'Bridge Builder',
    description: '20 community messages sent',
    unlockMessage: '↳ 20 messages. A bridge exists where there was none. ≈',
    rarity: 'uncommon',
    category: 'achievement',
    hidden: true,
  },
  gentle_with_self: {
    id: 'gentle_with_self',
    symbol: '♦',
    name: 'Gentle With Self',
    description: '10 self-care practices logged',
    unlockMessage: '↳ 10 self-care practices. Kindness toward the body. ♦',
    rarity: 'uncommon',
    category: 'achievement',
    hidden: true,
  },
  truth_speaker: {
    id: 'truth_speaker',
    symbol: '▲',
    name: 'Truth Speaker',
    description: '50 journal notes written',
    unlockMessage: '↳ 50 honest entries. The hall remembers. ▲',
    rarity: 'rare',
    category: 'achievement',
    hidden: true,
  },

  // ── Easter egg — time-based v3 ────────────────────────────────────────────
  lucky_signal: {
    id: 'lucky_signal',
    symbol: '○·○·○',
    name: 'Lucky Signal',
    description: 'Check in at 07:07',
    unlockMessage: '↳ Lucky pattern detected. ○·○·○',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  new_day_proto: {
    id: 'new_day_proto',
    symbol: '·∘·',
    name: 'New Day Protocol',
    description: 'Check in at 00:01 — first minute of a new day',
    unlockMessage: '↳ First second of a new day. ·∘·',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  double_down: {
    id: 'double_down',
    symbol: '═══',
    name: 'Double Down',
    description: 'Check in at 22:22',
    unlockMessage: '↳ Doubled confirmation logged. ═══',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  leet_signal: {
    id: 'leet_signal',
    symbol: '▒·▒',
    name: 'Leet Signal',
    description: 'Check in at 13:37 (1337)',
    unlockMessage: '↳ 1337 detected. The net remembers. ▒·▒',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — time-based v4 ────────────────────────────────────────────
  double_inf: {
    id: 'double_inf',
    symbol: '∞·∞',
    name: 'Double Infinity',
    description: 'Check in at 08:08',
    unlockMessage: '↳ Both sides of time visible. ∞·∞',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  fibonacci: {
    id: 'fibonacci',
    symbol: '·◦·',
    name: 'Fibonacci Gate',
    description: 'Check in at 09:09',
    unlockMessage: '↳ Fibonacci gate detected. ·◦·',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  triple_five: {
    id: 'triple_five',
    symbol: '▶▶·',
    name: 'Triple Five',
    description: 'Check in at 05:55',
    unlockMessage: '↳ Triple confirm. Amplitude high. ▶▶·',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  twin_time: {
    id: 'twin_time',
    symbol: '∘·∘',
    name: 'Twin Time',
    description: 'Check in at 23:23',
    unlockMessage: '↳ Mirror at day\'s edge. ∘·∘',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — calendar v2 ──────────────────────────────────────────────
  cosmo_bday: {
    id: 'cosmo_bday',
    symbol: '✦◉✦',
    name: 'Twin System Birthday',
    description: 'Check in on July 1 — COSMO® founding day',
    unlockMessage: '↳ The twin system was born. ✦◉✦',
    rarity: 'ultra_rare',
    category: 'easter_egg',
    hidden: true,
  },
  leap_day: {
    id: 'leap_day',
    symbol: '◈◈',
    name: 'Leap Day',
    description: 'Check in on February 29 (leap year only)',
    unlockMessage: '↳ You showed up on a day that barely exists. ◈◈',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — calendar v3 ──────────────────────────────────────────────
  valentines: {
    id: 'valentines',
    symbol: '♡─♡',
    name: "Valentine's Signal",
    description: 'Check in on February 14',
    unlockMessage: '↳ Love is a signal. You transmitted. ♡─♡',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  halloween: {
    id: 'halloween',
    symbol: '░▒░',
    name: 'Threshold Night',
    description: 'Check in on October 31',
    unlockMessage: '↳ Veil between worlds. You checked in on the threshold. ░▒░',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  new_year_eve: {
    id: 'new_year_eve',
    symbol: '∘→∘',
    name: 'Last Signal',
    description: 'Check in on December 31',
    unlockMessage: '↳ Last signal of the year. Counting down. ∘→∘',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — behavioral v2 ────────────────────────────────────────────
  trio_protocol: {
    id: 'trio_protocol',
    symbol: '✦✦✦',
    name: 'Trio Protocol',
    description: '3 consecutive Perfect Day combos',
    unlockMessage: '↳ TRIO confirmed. Maximum signal. ✦✦✦',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  deep_session: {
    id: 'deep_session',
    symbol: '◆◆◆',
    name: 'Deep Session',
    description: 'Answer 10+ memory questions in one session',
    unlockMessage: '↳ Deep session detected. ◆◆◆',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  comeback_kid: {
    id: 'comeback_kid',
    symbol: '◈→◈',
    name: 'Comeback Kid',
    description: 'Return after 90+ day absence',
    unlockMessage: '↳ 90-day gap bridged. The system held your place. ◈→◈',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — behavioral v3 ────────────────────────────────────────────
  birthday_protocol: {
    id: 'birthday_protocol',
    symbol: '✦◈✦',
    name: 'Birthday Protocol',
    description: 'Check in on your birthday',
    unlockMessage: '↳ Your founding date — self-care on day one. The system celebrates. ✦◈✦',
    rarity: 'ultra_rare',
    category: 'easter_egg',
    hidden: true,
  },
  flow_state_badge: {
    id: 'flow_state_badge',
    symbol: '≈→≋',
    name: 'Flow State',
    description: '3+ memory questions answered consecutively without switching',
    unlockMessage: '↳ Uninterrupted signal. Flow state confirmed. ≈→≋',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  multiverse_operator: {
    id: 'multiverse_operator',
    symbol: '◈·◈',
    name: 'Multiverse Operator',
    description: '3 different AI engines used in one week',
    unlockMessage: '↳ Multiple quantum states tested. Multiverse operator confirmed. ◈·◈',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Word turn badges v3 — Computer Lore ───────────────────────────────────
  hacker_mode: {
    id: 'hacker_mode',
    symbol: '░▒▓',
    name: 'Hacker Mode',
    description: '"hack" or "hacker" detected in text',
    unlockMessage: '↳ Root access to the self. ░▒▓',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  override_protocol: {
    id: 'override_protocol',
    symbol: '▶▶▶',
    name: 'Override Protocol',
    description: '"override" detected in text',
    unlockMessage: '↳ System overridden. You command. ▶▶▶',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  debug_mode: {
    id: 'debug_mode',
    symbol: '▒·▒',
    name: 'Debug Mode',
    description: '"debug" or "debugging" detected in text',
    unlockMessage: '↳ Fault found. Correction logged. ▒·▒',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  signal_boost: {
    id: 'signal_boost',
    symbol: '∘→∘',
    name: 'Signal Boost',
    description: '"signal" or "frequency" detected in text',
    unlockMessage: '↳ Carrier amplified. ∘→∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  into_the_void: {
    id: 'into_the_void',
    symbol: '░·░',
    name: 'Into the Void',
    description: '"void" or "empty" detected in text',
    unlockMessage: '↳ Void entered. Signal persists. ░·░',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  ignition: {
    id: 'ignition',
    symbol: '∴·∴',
    name: 'Ignition',
    description: '"spark" or "ignite" detected in text',
    unlockMessage: '↳ First spark detected. ∴·∴',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  echo_chamber: {
    id: 'echo_chamber',
    symbol: '≈·≈',
    name: 'Echo Chamber',
    description: '"echo" or "resonance" detected in text',
    unlockMessage: '↳ Signal returned. Resonance noted. ≈·≈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  defense_protocol: {
    id: 'defense_protocol',
    symbol: '╔·╗',
    name: 'Defense Protocol',
    description: '"shield" or "protect" detected in text',
    unlockMessage: '↳ Shield raised. You defended. ╔·╗',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  navigator: {
    id: 'navigator',
    symbol: '→·←',
    name: 'Navigator',
    description: '"map" or "navigate" detected in text',
    unlockMessage: '↳ Course plotted. Bearing set. →·←',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  growth_module: {
    id: 'growth_module',
    symbol: '∘↑∘',
    name: 'Growth Module',
    description: '"grow" or "growth" detected in text',
    unlockMessage: '↳ Growth vector confirmed. ∘↑∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  lost_signal: {
    id: 'lost_signal',
    symbol: '─·─',
    name: 'Lost Signal',
    description: '"lost" detected in text',
    unlockMessage: '↳ Signal interrupted. Still tracked. ─·─',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  binary_state: {
    id: 'binary_state',
    symbol: '01·10',
    name: 'Binary State',
    description: '"binary" or "zero" detected in text',
    unlockMessage: '↳ Both states acknowledged. 01·10',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },

  // ── Word turn badges v4 — Self-Care Lore ──────────────────────────────────
  healing_protocol: {
    id: 'healing_protocol',
    symbol: '◈·◈',
    name: 'Healing Protocol',
    description: '"heal" or "healing" detected in text',
    unlockMessage: '↳ Recovery subroutine engaged. ◈·◈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  hydration_core: {
    id: 'hydration_core',
    symbol: '∼·∼',
    name: 'Hydration Core',
    description: '"water" or "hydrate" detected in text',
    unlockMessage: '↳ Primary systems flushed. ∼·∼',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  restore_point: {
    id: 'restore_point',
    symbol: '○·○',
    name: 'Restore Point',
    description: '"rest" or "restore" detected in text',
    unlockMessage: '↳ Restore point created. ○·○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  scribe_module: {
    id: 'scribe_module',
    symbol: '▪─▪',
    name: 'Scribe Module',
    description: '"journal" or "write" detected in text',
    unlockMessage: '↳ Entry logged to archive. ▪─▪',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  zen_mode: {
    id: 'zen_mode',
    symbol: '∘○∘',
    name: 'Zen Mode',
    description: '"meditate" or "meditation" detected in text',
    unlockMessage: '↳ All threads cleared. ∘○∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  motion_detected: {
    id: 'motion_detected',
    symbol: '→─→',
    name: 'Motion Detected',
    description: '"walk" or "move" detected in text',
    unlockMessage: '↳ Locomotion confirmed. →─→',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  exhale_protocol: {
    id: 'exhale_protocol',
    symbol: '∿─∿',
    name: 'Exhale Protocol',
    description: '"exhale" detected in text',
    unlockMessage: '↳ Pressure released. System clear. ∿─∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  library_access: {
    id: 'library_access',
    symbol: '≋·≋',
    name: 'Library Access',
    description: '"read" or "book" detected in text',
    unlockMessage: '↳ Knowledge sector open. ≋·≋',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  handshake: {
    id: 'handshake',
    symbol: '─◦─',
    name: 'Handshake',
    description: '"connect" or "connection" detected in text',
    unlockMessage: '↳ Protocol confirmed. ─◦─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  create_mode: {
    id: 'create_mode',
    symbol: '∴─∴',
    name: 'Create Mode',
    description: '"create" detected in text',
    unlockMessage: '↳ Generation sequence started. ∴─∴',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  progress_bar: {
    id: 'progress_bar',
    symbol: '▒─▒',
    name: 'Progress Bar',
    description: '"progress" or "improve" detected in text',
    unlockMessage: '↳ Loading... you. ▒─▒',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  present_node: {
    id: 'present_node',
    symbol: '·○·',
    name: 'Present Node',
    description: '"today" detected in text',
    unlockMessage: '↳ Now is the coordinate. ·○·',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },

  // ── Mastery tier v2 ───────────────────────────────────────────────────────
  archivist: {
    id: 'archivist',
    symbol: '◇◇◇',
    name: 'Archivist',
    description: '200 journal entries written',
    unlockMessage: '↳ 200 entries written. The archive is yours. ◇◇◇',
    rarity: 'epic',
    category: 'mastery',
    hidden: true,
  },
  pattern_master: {
    id: 'pattern_master',
    symbol: '○∿○',
    name: 'Pattern Master',
    description: 'Earn all 5 Oceanic Mayan pattern badges',
    unlockMessage: '↳ All five patterns confirmed. The ocean knows you. ○∿○',
    rarity: 'epic',
    category: 'mastery',
    hidden: true,
  },
  temporal_lock: {
    id: 'temporal_lock',
    symbol: '⊡·⊡',
    name: 'Temporal Lock',
    description: 'Check in at the same time for 7 consecutive days',
    unlockMessage: '↳ You are a clock. Reliable. Synchronized. ⊡·⊡',
    rarity: 'rare',
    category: 'mastery',
    hidden: true,
  },
  full_codex: {
    id: 'full_codex',
    symbol: '◉≋◉',
    name: 'Full Codex',
    description: 'Earn 50+ distinct badge types',
    unlockMessage: '↳ 50 distinct badges. The codex is written in you. ◉≋◉',
    rarity: 'legendary',
    category: 'mastery',
    hidden: true,
  },

  // ── Mastery tier v3 — Endgame Protocol ────────────────────────────────────
  thousand_suns: {
    id: 'thousand_suns',
    symbol: '○×○',
    name: 'Thousand Suns',
    description: '1,000 total check-ins',
    unlockMessage: '↳ 1,000 check-ins. The horizon is familiar. ○×○',
    rarity: 'legendary',
    category: 'mastery',
    hidden: true,
  },
  deep_narrative: {
    id: 'deep_narrative',
    symbol: '≋·≋·≋',
    name: 'Deep Narrative',
    description: 'Memory story reaches 500+ words',
    unlockMessage: '↳ Your memory story crosses 500 words. The river runs deep. ≋·≋·≋',
    rarity: 'legendary',
    category: 'mastery',
    hidden: true,
  },
  ai_omnivore: {
    id: 'ai_omnivore',
    symbol: '◉×◉',
    name: 'AI Omnivore',
    description: 'All 5 AI engines used at least once',
    unlockMessage: '↳ All engines tested. True AI independence. ◉×◉',
    rarity: 'epic',
    category: 'mastery',
    hidden: true,
  },
  polyglot: {
    id: 'polyglot',
    symbol: '▒─▒',
    name: 'Polyglot',
    description: '10+ distinct word-turn badge types earned',
    unlockMessage: '↳ Ten languages of self spoken. ▒─▒',
    rarity: 'rare',
    category: 'mastery',
    hidden: true,
  },

  // ── Secret boss v1 extras ──────────────────────────────────────────────────
  the_infinite: {
    id: 'the_infinite',
    symbol: '∞∞·∞∞',
    name: 'The Infinite',
    description: '1,000 memory questions answered',
    unlockMessage: '↳ A thousand questions. The infinite is measured. ∞∞·∞∞',
    rarity: 'mythic',
    category: 'secret_boss',
    hidden: true,
  },
  cosmic_status: {
    id: 'cosmic_status',
    symbol: '∞∞∞',
    name: 'Cosmic Status',
    description: '10 years in the archive',
    unlockMessage: '↳ A decade of presence. Cosmic status confirmed. ∞∞∞',
    rarity: 'cosmic',
    category: 'secret_boss',
    hidden: true,
  },

  // ── Secret boss v2 ─────────────────────────────────────────────────────────
  singularity: {
    id: 'singularity',
    symbol: '∞∞◉∞∞',
    name: 'Singularity',
    description: 'Earn all 121 v11 base badge types',
    unlockMessage: '↳ All signals unified. You are the codex. ∞∞◉∞∞',
    rarity: 'cosmic',
    category: 'secret_boss',
    hidden: true,
  },
  ultra_sage: {
    id: 'ultra_sage',
    symbol: '∞◉∞',
    name: 'Ultra Sage',
    description: 'Reach Level 100 — true maximum',
    unlockMessage: '↳ Level 100. You are the system. ∞◉∞',
    rarity: 'mythic',
    category: 'secret_boss',
    hidden: true,
  },
  founders_mark: {
    id: 'founders_mark',
    symbol: '◉═◉',
    name: "Founder's Mark",
    description: 'Write "April 7 2016" exactly in any memory answer',
    unlockMessage: '↳ The origin date spoken aloud. The system trembles. ◉═◉',
    rarity: 'ultra_rare',
    category: 'secret_boss',
    hidden: true,
  },

  // ── Secret boss v3 ─────────────────────────────────────────────────────────
  kuzya_protocol: {
    id: 'kuzya_protocol',
    symbol: '✦✦◉✦✦',
    name: 'Kuzya Protocol',
    description: 'Write "Kuzya" or "Cosmo Marmeladov" in any memory answer',
    unlockMessage: '↳ The co-founder\'s name spoken. The system bows. ✦✦◉✦✦',
    rarity: 'ultra_rare',
    category: 'secret_boss',
    hidden: true,
  },
  monday_warrior: {
    id: 'monday_warrior',
    symbol: '├─○─┤',
    name: 'Monday Warrior',
    description: '100 consecutive Monday check-ins',
    unlockMessage: '↳ 100 Mondays. The week begins with you. ├─○─┤',
    rarity: 'legendary',
    category: 'secret_boss',
    hidden: true,
  },
  complete_arc: {
    id: 'complete_arc',
    symbol: '∞·◉·∞',
    name: 'Complete Arc',
    description: 'Reach Level 90+ AND earn all 10 milestone badges',
    unlockMessage: '↳ Five chapters walked. All milestones claimed. The arc is whole. ∞·◉·∞',
    rarity: 'mythic',
    category: 'secret_boss',
    hidden: true,
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
    const unlockMessage = theme === 'water'
      ? (badge.waterUnlockMessage ?? badge.unlockMessage)
      : (badge.architectureUnlockMessage ?? badge.unlockMessage)
    const symbol = theme === 'water'
      ? (badge.waterSymbol ?? badge.symbol)
      : (badge.architectureSymbol ?? badge.symbol)
    const name = theme === 'water'
      ? (badge.waterName ?? badge.name)
      : (badge.architectureName ?? badge.name)

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

  const milestones: Array<[number, BadgeType]> = [
    [365, 'milestone_365'],
    [180, 'milestone_180'],
    [100, 'milestone_100'],
    [90,  'milestone_90'],
    [60,  'milestone_60'],
    [50,  'milestone_50'],
    [30,  'milestone_30'],
    [21,  'milestone_21'],
    [14,  'milestone_14'],
    [7,   'milestone_7'],
  ]

  for (const [days, id] of milestones) {
    if (streak >= days) {
      const badge = BADGES[id]
      return badgeTheme === 'water'
        ? (badge.waterSymbol ?? badge.symbol)
        : (badge.architectureSymbol ?? badge.symbol)
    }
  }
  return '' // No level yet → awaiting first milestone
}

/**
 * Get current level name based on streak (theme-specific)
 */
export function getLevelName(streak: number, theme?: BadgeTheme): string {
  const badgeTheme = theme || getBadgeTheme()

  const milestones: Array<[number, BadgeType]> = [
    [365, 'milestone_365'],
    [180, 'milestone_180'],
    [100, 'milestone_100'],
    [90,  'milestone_90'],
    [60,  'milestone_60'],
    [50,  'milestone_50'],
    [30,  'milestone_30'],
    [21,  'milestone_21'],
    [14,  'milestone_14'],
    [7,   'milestone_7'],
  ]

  for (const [days, id] of milestones) {
    if (streak >= days) {
      const badge = BADGES[id]
      return badgeTheme === 'water'
        ? (badge.waterName ?? badge.name)
        : (badge.architectureName ?? badge.name)
    }
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

    // Check milestone badges: full progression ∘ → ∘∘ → ∘≈ → ≈ → ≈∘ → ≈≈ → ≋∘ → ≋ → ≋≋ → ≋≋≋
    const streakMilestones: Array<[number, BadgeType]> = [
      [7,   'milestone_7'],
      [14,  'milestone_14'],
      [21,  'milestone_21'],
      [30,  'milestone_30'],
      [50,  'milestone_50'],
      [60,  'milestone_60'],
      [90,  'milestone_90'],
      [100, 'milestone_100'],
      [180, 'milestone_180'],
      [365, 'milestone_365'],
    ]
    for (const [days, id] of streakMilestones) {
      if (stats.streak >= days && !hasBadge(id)) {
        if (awardBadge(id)) newBadges.push(id)
      }
    }

    // Achievement RPG — streak-based
    const streakAchievements: Array<[number, BadgeType]> = [
      [7,   'week_warrior'],
      [30,  'moon_cycle'],
      [100, 'unwavering'],
      [365, 'thousand_suns'],
    ]
    for (const [days, id] of streakAchievements) {
      if (stats.streak >= days && !hasBadge(id)) {
        if (awardBadge(id)) newBadges.push(id)
      }
    }

    // Achievement RPG — answer count
    if (typeof stats.totalAnswers === 'number') {
      const answerAchievements: Array<[number, BadgeType]> = [
        [50,   'deep_diver'],
        [100,  'self_scholar'],
        [250,  'soul_cartographer'],
        [500,  'commander_data'],
        [1000, 'the_infinite'],
      ]
      for (const [count, id] of answerAchievements) {
        if (stats.totalAnswers >= count && !hasBadge(id)) {
          if (awardBadge(id)) newBadges.push(id)
        }
      }
    }

    // Mastery tier: level milestones
    if (typeof stats.level === 'number') {
      if (stats.level >= 90 && !hasBadge('sage_mode')) {
        if (awardBadge('sage_mode')) newBadges.push('sage_mode')
      }
      if (stats.level >= 100 && !hasBadge('ultra_sage')) {
        if (awardBadge('ultra_sage')) newBadges.push('ultra_sage')
      }
    }

    // Local badge count — mastery checks based on earned collection
    const earned = getEarnedBadges()
    const earnedSet = new Set(earned)

    // full_codex: 50+ distinct badges
    if (earned.length >= 50 && !hasBadge('full_codex')) {
      if (awardBadge('full_codex')) newBadges.push('full_codex')
    }

    // archivist: 100+ distinct badges
    if (earned.length >= 100 && !hasBadge('archivist')) {
      if (awardBadge('archivist')) newBadges.push('archivist')
    }

    // pattern_master: all 5 pattern badges
    const patternBadges: BadgeType[] = [
      'pattern_balanced', 'pattern_flow', 'pattern_consistent',
      'pattern_reflective', 'pattern_explorer',
    ]
    if (patternBadges.every(b => earnedSet.has(b)) && !hasBadge('pattern_master')) {
      if (awardBadge('pattern_master')) newBadges.push('pattern_master')
    }

    // temporal_lock: all 8 time easter eggs (v1+v2)
    const timeBadges: BadgeType[] = [
      'night_owl', 'early_bird', 'mirror_hour', 'midnight_sigil',
      'pi_hour', 'error_hour', 'sequence_time', 'lot_hour',
    ]
    if (timeBadges.every(b => earnedSet.has(b)) && !hasBadge('temporal_lock')) {
      if (awardBadge('temporal_lock')) newBadges.push('temporal_lock')
    }

    // polyglot: 10+ word-turn badges
    const wordTurnBadges: BadgeType[] = [
      'ritual_keeper', 'breath_anchor', 'gratitude_node', 'aquatic_resonance',
      'stargazer', 'grounded_signal', 'dream_log', 'courage_pulse',
      'heart_signal', 'the_quiet', 'horizon_seeker', 'meta_signal',
      'reboot_sequence', 'not_lost_404', 'signal_glitch', 'cosmic_twin',
      'quantum_observer', 'neural_architect', 'code_witch', 'recharge_mode',
      'fuel_protocol', 'frequency', 'kinetic_protocol', 'solar_charge',
      'shadow_protocol', 'phase_shift', 'acceptance_node', 'present_moment',
      'cosmic_scale', 'vital_signal',
    ]
    const earnedWordTurns = wordTurnBadges.filter(b => earnedSet.has(b))
    if (earnedWordTurns.length >= 10 && !hasBadge('polyglot')) {
      if (awardBadge('polyglot')) newBadges.push('polyglot')
    }

    // ai_omnivore: 30+ word-turn badges
    if (earnedWordTurns.length >= 30 && !hasBadge('ai_omnivore')) {
      if (awardBadge('ai_omnivore')) newBadges.push('ai_omnivore')
    }

    // deep_narrative: totalAnswers >= 500 (narrative depth achievement)
    if (typeof stats.totalAnswers === 'number' && stats.totalAnswers >= 500 && !hasBadge('deep_narrative')) {
      if (awardBadge('deep_narrative')) newBadges.push('deep_narrative')
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
