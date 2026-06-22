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
  // ── Easter egg — time-based v5 (Mirror & Math) ──────────────────────────────
  | 'digital_symmetry'   // ⊡·⊡  Check in at 10:10
  | 'seq_boot'           // →∘→  Check in at 01:23
  | 'palindrome_time'    // ◈·◈  Check in at 21:12
  | 'tau_signal'         // ∞·∘  Check in at 06:28 (τ ≈ 6.28)
  // ── Easter egg — time-based v6 (Infinite Loop) ──────────────────────────────
  | 'nine_lives'         // ◉×◉  Check in at 09:09
  | 'hex_hour'           // ▒·▒  Check in at 16:16 (0x10:0x10)
  | 'final_frame'        // ◈—◈  Check in at 23:59
  | 'year_signal'        // ≋·◉  Check in at 20:26 (founding year)
  // ── Easter egg — calendar v4 (Nerd & Cosmic) ────────────────────────────────
  | 'signal_wars'        // ⊛·⊛  May 4 — Star Wars Day
  | 'prog_day'           // □∘□  Sep 12–13 — Programmers' Day (day 256)
  | 'ada_protocol'       // ∞·∞  Dec 9 — Ada Lovelace Day
  // ── Easter egg — calendar v5 ────────────────────────────────────────────────
  | 'groundhog_loop'     // ↺·↺  Feb 2 — Groundhog Day
  | 'binary_day'         // 1·0  Oct 10 — Binary Day
  | 'fibonacci_day'      // ∗→∗  Nov 23 — Fibonacci Day (1,1,2,3)
  // ── Easter egg — behavioral v4 (Deep Archive) ───────────────────────────────
  | 'night_scribe'       // ◐·◐  Journal entry after 23:30
  | 'epic_transmission'  // ▒▒▒  1,000+ char memory answer
  | 'perfect_week'       // ✦✦✦  7 consecutive Perfect Days
  | 'analog_reboot'      // ↺≋↺  Return after 180+ day gap
  // ── Easter egg — behavioral v5 ──────────────────────────────────────────────
  | 'deep_scribe'        // ≋·≋  Journal entry ≥500 chars
  | 'phoenix_streak'     // ∴→∘  Rebuild streak after breaking it
  | 'time_anchor'        // ⊡·⊡  Same clock hour 14 consecutive days
  // ── Word turn badges v5 — Signal Codex ──────────────────────────────────────
  | 'solitude_mode'      // ∘—∘  "solitude" detected in text
  | 'wonder_protocol'    // ○·∗  "wonder" detected in text
  | 'phoenix_sequence'   // ∴→∘  "phoenix" detected in text
  | 'alignment_lock'     // ─○─  "align" / "aligned" detected in text
  | 'witness_log'        // ◯·◯  "witness" detected in text
  | 'orbital_pattern'    // ○→○  "orbit" detected in text
  | 'forge_protocol'     // ■·■  "forge" detected in text
  | 'neuro_link'         // ≋·—  "mind" detected in text
  | 'photon_signal'      // ○—○  "light" detected in text
  | 'field_charge'       // ∿→∿  "energy" detected in text
  | 'voyage_mode'        // →·∗  "voyage" detected in text
  | 'gravity_lock'       // ≋·■  "gravity" detected in text
  // ── Word turn badges v6 — The Becoming Lexicon ──────────────────────────────
  | 'surrender_signal'   // ∿·∿  "surrender" detected in text
  | 'restore_protocol'   // ○→●  "restore" detected in text
  | 'anchor_lock'        // ─▪─  "anchor" detected in text
  | 'threshold_gate'     // ╞═╡  "threshold" detected in text
  | 'emergence_sequence' // ∘→≈  "emerge" detected in text
  | 'exhale_wave'        // ≋·∿  "exhale" detected in text
  | 'clear_field'        // □·□  "clear" detected in text
  | 'rise_signal'        // ∘↑∘  "rise" detected in text
  | 'presence_core'      // ●·●  "presence" detected in text
  | 'bold_protocol'      // ▶·▶  "bold" detected in text
  | 'trust_lock'         // ○═○  "trust" detected in text
  | 'shift_sequence'     // →∘→  "shift" detected in text
  // ── Mastery tier v4 — Final Frontier ────────────────────────────────────────
  | 'interstellar'       // ∗×∗  2,000 total check-ins (LEGENDARY)
  | 'deep_narrator'      // ≋≋·≋≋ Memory story 1,000+ words (LEGENDARY)
  | 'signal_master'      // ◉·◈·◉ 100+ distinct badge types earned (EPIC)
  | 'word_master'        // ▒→▒  30+ word-turn badge types triggered (RARE)
  // ── Mastery tier v5 — Infinite Loop ─────────────────────────────────────────
  | 'epoch_operator'     // ∞·◉  3,000 total check-ins (LEGENDARY)
  | 'time_collector'     // ⊡·⊡·⊡ All Time v1 badges earned (EPIC)
  | 'memory_keeper_30'   // ≋·≋  Memory answers on 30 distinct calendar days (RARE)
  | 'word_collector'     // ◇→◇  30+ distinct word-turn badge types (EPIC)
  // ── Secret Boss v4 — Founders' Layer ────────────────────────────────────────
  | 'i_am_lot'           // ◉◉◉  Write "I am LOT" in any answer (MYTHIC)
  | 'malibu'             // ∘◉∘  Write "Malibu" in any answer (MYTHIC)
  | 'perfect_month'      // ✦●✦  28 consecutive Perfect Days (MYTHIC)
  // ── Secret Boss v5 — Invisible Layer ────────────────────────────────────────
  | 'the_cat_knows'      // ∗◉∗  Write "Kuzya" in any entry (MYTHIC)
  | 'key_code'           // ▒→▒  Write "0451" in any entry (RARE)
  | 'five_years'         // ≋≋≋·≋  Account age ≥ 5 years (COSMIC)
  // ── Achievement RPG v2 — Story Arcs ─────────────────────────────────────────
  | 'signal_keeper'      // ◇  100+ memory answers (lifetime)
  | 'word_weaver'        // ≈·≋  20+ word-turn badge types triggered
  | 'full_spectrum'      // ◆  All 6 User Index dimensions scored in one week
  | 'truth_forge'        // ■  50+ journal entries (lifetime)
  | 'inner_compass'      // ○  25+ intention entries (lifetime)
  | 'perfect_architect'  // ╔═╗  All 14 Progressive Feature Unlocks activated
  // ── Achievement RPG v3 — Story Arcs ─────────────────────────────────────────
  | 'first_signal'       // ∘  10+ memory answers (lifetime)
  | 'planner_class'      // ○  10+ intention entries (lifetime)
  | 'dual_channel'       // ≈≋  Journal AND memory answer same week × 5
  | 'mood_master'        // ·  30+ mood entries (lifetime)
  | 'body_keeper'        // ≈  25+ self-care activity entries (lifetime)
  | 'community_builder'  // ∘→∘  50+ chat messages (lifetime)

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
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'cosmic'
  category: 'milestone' | 'easter_egg' | 'word_turn' | 'pattern' | 'achievement_rpg' | 'secret_boss'
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

  // ── Easter egg — time-based v5 (Mirror & Math) ────────────────────────────
  digital_symmetry: {
    id: 'digital_symmetry',
    symbol: '⊡·⊡',
    name: 'Digital Symmetry',
    description: 'Check in at 10:10',
    unlockMessage: '↳ Perfect decimal symmetry. 10:10. ⊡·⊡',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  seq_boot: {
    id: 'seq_boot',
    symbol: '→∘→',
    name: 'Sequential Boot',
    description: 'Check in at 01:23',
    unlockMessage: '↳ Boot sequence: 01→02→03. The system starts in order. →∘→',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  palindrome_time: {
    id: 'palindrome_time',
    symbol: '◈·◈',
    name: 'Palindrome Time',
    description: 'Check in at 21:12',
    unlockMessage: '↳ 21:12. The time that reads itself. ◈·◈',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  tau_signal: {
    id: 'tau_signal',
    symbol: '∞·∘',
    name: 'Tau Signal',
    description: 'Check in at 06:28 (τ = 2π ≈ 6.28)',
    unlockMessage: '↳ Tau signal detected. Full circle confirmed. ∞·∘',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — time-based v6 (Infinite Loop) ────────────────────────────
  nine_lives: {
    id: 'nine_lives',
    symbol: '◉×◉',
    name: 'Nine Lives',
    description: 'Check in at 09:09',
    unlockMessage: '↳ Nine-nine. The digital cat. ◉×◉',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  hex_hour: {
    id: 'hex_hour',
    symbol: '▒·▒',
    name: 'Hex Hour',
    description: 'Check in at 16:16 (0x10:0x10)',
    unlockMessage: '↳ 0x10:0x10. Hexadecimal symmetry. ▒·▒',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  final_frame: {
    id: 'final_frame',
    symbol: '◈—◈',
    name: 'Final Frame',
    description: 'Check in at 23:59 — the last minute of the day',
    unlockMessage: '↳ The last minute. You were awake for it. ◈—◈',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  year_signal: {
    id: 'year_signal',
    symbol: '≋·◉',
    name: 'Year Signal',
    description: 'Check in at 20:26 — LOT founding year encoded in time',
    unlockMessage: '↳ 20:26. The founding year in the clock. ≋·◉',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — calendar v4 (Nerd & Cosmic) ──────────────────────────────
  signal_wars: {
    id: 'signal_wars',
    symbol: '⊛·⊛',
    name: 'Signal Wars',
    description: 'Check in on May 4 — Star Wars Day',
    unlockMessage: '↳ May the signal be with you. ⊛·⊛',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  prog_day: {
    id: 'prog_day',
    symbol: '□∘□',
    name: "Programmer's Day",
    description: 'Check in on September 12–13 — the 256th day of the year',
    unlockMessage: "↳ Day 256. The programmers' annual rite. □∘□",
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  ada_protocol: {
    id: 'ada_protocol',
    symbol: '∞·∞',
    name: 'Ada Protocol',
    description: 'Check in on December 9 — Ada Lovelace Day',
    unlockMessage: '↳ Ada Lovelace. First programmer. The protocol is named for her. ∞·∞',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — calendar v5 ───────────────────────────────────────────────
  groundhog_loop: {
    id: 'groundhog_loop',
    symbol: '↺·↺',
    name: 'Groundhog Loop',
    description: 'Check in on February 2 — Groundhog Day',
    unlockMessage: '↳ Repeat detected. But this loop has meaning. ↺·↺',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  binary_day: {
    id: 'binary_day',
    symbol: '1·0',
    name: 'Binary Day',
    description: 'Check in on October 10 — 10/10 reads as binary',
    unlockMessage: '↳ 10/10 in base 10 is 1010 in base 2. Double-coded date. 1·0',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  fibonacci_day: {
    id: 'fibonacci_day',
    symbol: '∗→∗',
    name: 'Fibonacci Day',
    description: 'Check in on November 23 — 1,1,2,3 are Fibonacci numbers',
    unlockMessage: '↳ 1, 1, 2, 3. November 23. The sequence runs through the calendar. ∗→∗',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — behavioral v4 (Deep Archive) ─────────────────────────────
  night_scribe: {
    id: 'night_scribe',
    symbol: '◐·◐',
    name: 'Night Scribe',
    description: 'Submit a journal entry after 23:30',
    unlockMessage: '↳ The night writer. The record never sleeps. ◐·◐',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  epic_transmission: {
    id: 'epic_transmission',
    symbol: '▒▒▒',
    name: 'Epic Transmission',
    description: 'Submit a memory answer of 1,000+ characters',
    unlockMessage: '↳ 1,000 characters. A transmission worthy of the archive. ▒▒▒',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  perfect_week: {
    id: 'perfect_week',
    symbol: '✦✦✦',
    name: 'Perfect Week',
    description: '7 consecutive Perfect Days',
    unlockMessage: '↳ Seven consecutive perfect days. The system noticed. ✦✦✦',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  analog_reboot: {
    id: 'analog_reboot',
    symbol: '↺≋↺',
    name: 'Analog Reboot',
    description: 'Return after a 180+ day gap',
    unlockMessage: '↳ Six months away. The system held your place. ↺≋↺',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Easter egg — behavioral v5 ────────────────────────────────────────────
  deep_scribe: {
    id: 'deep_scribe',
    symbol: '≋·≋',
    name: 'Deep Scribe',
    description: 'Submit a journal entry of 500+ characters',
    unlockMessage: '↳ Deep writing logged. The archive has depth. ≋·≋',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  phoenix_streak: {
    id: 'phoenix_streak',
    symbol: '∴→∘',
    name: 'Phoenix Streak',
    description: 'Rebuild a check-in streak after breaking it',
    unlockMessage: '↳ The streak broke. Then you rebuilt. That is the harder pattern. ∴→∘',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  time_anchor: {
    id: 'time_anchor',
    symbol: '⊡·⊡',
    name: 'Time Anchor',
    description: 'Check in at the same clock hour for 14 consecutive days',
    unlockMessage: '↳ Same hour. 14 days. The anchor is set. ⊡·⊡',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Word turn badges v5 — Signal Codex ───────────────────────────────────
  solitude_mode: {
    id: 'solitude_mode',
    symbol: '∘—∘',
    name: 'Solitude Mode',
    description: '"solitude" detected in journal or memory answer',
    unlockMessage: '↳ Solitude is a signal. You chose it. ∘—∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  wonder_protocol: {
    id: 'wonder_protocol',
    symbol: '○·∗',
    name: 'Wonder Protocol',
    description: '"wonder" detected in text',
    unlockMessage: '↳ Wonder detected. The system wonders back. ○·∗',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  phoenix_sequence: {
    id: 'phoenix_sequence',
    symbol: '∴→∘',
    name: 'Phoenix Sequence',
    description: '"phoenix" detected in text',
    unlockMessage: '↳ Phoenix pattern detected. The rise is real. ∴→∘',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  alignment_lock: {
    id: 'alignment_lock',
    symbol: '─○─',
    name: 'Alignment Lock',
    description: '"align" or "aligned" detected in text',
    unlockMessage: '↳ Alignment event logged. ─○─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  witness_log: {
    id: 'witness_log',
    symbol: '◯·◯',
    name: 'Witness Log',
    description: '"witness" detected in text',
    unlockMessage: '↳ Witness state recorded. ◯·◯',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  orbital_pattern: {
    id: 'orbital_pattern',
    symbol: '○→○',
    name: 'Orbital Pattern',
    description: '"orbit" detected in text',
    unlockMessage: '↳ Orbital pattern detected. In motion. ○→○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  forge_protocol: {
    id: 'forge_protocol',
    symbol: '■·■',
    name: 'Forge Protocol',
    description: '"forge" detected in text',
    unlockMessage: '↳ Forge event logged. Something being made. ■·■',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  neuro_link: {
    id: 'neuro_link',
    symbol: '≋·—',
    name: 'Neuro Link',
    description: '"mind" detected in text',
    unlockMessage: '↳ Mind signal captured. Neuro link established. ≋·—',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  photon_signal: {
    id: 'photon_signal',
    symbol: '○—○',
    name: 'Photon Signal',
    description: '"light" detected in text',
    unlockMessage: '↳ Light noted. Photon signal received. ○—○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  field_charge: {
    id: 'field_charge',
    symbol: '∿→∿',
    name: 'Field Charge',
    description: '"energy" detected in text',
    unlockMessage: '↳ Energy signal logged. Field charging. ∿→∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  voyage_mode: {
    id: 'voyage_mode',
    symbol: '→·∗',
    name: 'Voyage Mode',
    description: '"voyage" detected in text',
    unlockMessage: '↳ Voyage logged. The signal is moving. →·∗',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  gravity_lock: {
    id: 'gravity_lock',
    symbol: '≋·■',
    name: 'Gravity Lock',
    description: '"gravity" detected in text',
    unlockMessage: '↳ Gravity recognized. Weight noted in the archive. ≋·■',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },

  // ── Word turn badges v6 — The Becoming Lexicon ───────────────────────────
  surrender_signal: {
    id: 'surrender_signal',
    symbol: '∿·∿',
    name: 'Surrender Signal',
    description: '"surrender" detected in text',
    unlockMessage: '↳ Surrender logged. The hardest word. ∿·∿',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  restore_protocol: {
    id: 'restore_protocol',
    symbol: '○→●',
    name: 'Restore Protocol',
    description: '"restore" detected in text',
    unlockMessage: '↳ Restore event logged. ○→●',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  anchor_lock: {
    id: 'anchor_lock',
    symbol: '─▪─',
    name: 'Anchor Lock',
    description: '"anchor" detected in text',
    unlockMessage: '↳ Anchor point established. ─▪─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  threshold_gate: {
    id: 'threshold_gate',
    symbol: '╞═╡',
    name: 'Threshold Gate',
    description: '"threshold" detected in text',
    unlockMessage: '↳ Threshold moment recorded. ╞═╡',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  emergence_sequence: {
    id: 'emergence_sequence',
    symbol: '∘→≈',
    name: 'Emergence Sequence',
    description: '"emerge" detected in text',
    unlockMessage: '↳ Emergence event logged. ∘→≈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  exhale_wave: {
    id: 'exhale_wave',
    symbol: '≋·∿',
    name: 'Exhale Wave',
    description: '"exhale" detected in text',
    unlockMessage: '↳ Exhale logged. The system breathes with you. ≋·∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  clear_field: {
    id: 'clear_field',
    symbol: '□·□',
    name: 'Clear Field',
    description: '"clear" detected in text',
    unlockMessage: '↳ Clarity signal received. □·□',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  rise_signal: {
    id: 'rise_signal',
    symbol: '∘↑∘',
    name: 'Rise Signal',
    description: '"rise" detected in text',
    unlockMessage: '↳ Rise event logged. The upward arc confirmed. ∘↑∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  presence_core: {
    id: 'presence_core',
    symbol: '●·●',
    name: 'Presence Core',
    description: '"presence" detected in text',
    unlockMessage: '↳ Presence acknowledged. Core signal stable. ●·●',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  bold_protocol: {
    id: 'bold_protocol',
    symbol: '▶·▶',
    name: 'Bold Protocol',
    description: '"bold" detected in text',
    unlockMessage: '↳ Bold event registered. ▶·▶',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  trust_lock: {
    id: 'trust_lock',
    symbol: '○═○',
    name: 'Trust Lock',
    description: '"trust" detected in text',
    unlockMessage: '↳ Trust signal received. Lock confirmed. ○═○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  shift_sequence: {
    id: 'shift_sequence',
    symbol: '→∘→',
    name: 'Shift Sequence',
    description: '"shift" detected in text',
    unlockMessage: '↳ Shift event logged. Pattern updated. →∘→',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },

  // ── Mastery tier v4 — Final Frontier ──────────────────────────────────────
  interstellar: {
    id: 'interstellar',
    symbol: '∗×∗',
    name: 'Interstellar',
    description: '2,000 total check-ins',
    unlockMessage: '↳ 2,000. The system entered interstellar space. ∗×∗',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  deep_narrator: {
    id: 'deep_narrator',
    symbol: '≋≋·≋≋',
    name: 'Deep Narrator',
    description: 'Write a memory story of 1,000+ words',
    unlockMessage: '↳ 1,000 words. A whole world in the archive. ≋≋·≋≋',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  signal_master: {
    id: 'signal_master',
    symbol: '◉·◈·◉',
    name: 'Signal Master',
    description: 'Earn 100+ distinct badge types',
    unlockMessage: '↳ 100 badge types. The signal is everywhere. ◉·◈·◉',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  word_master: {
    id: 'word_master',
    symbol: '▒→▒',
    name: 'Word Master',
    description: '30+ word-turn badge types triggered',
    unlockMessage: '↳ 30 word turns. The vocabulary of your inner world. ▒→▒',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Mastery tier v5 — Infinite Loop ───────────────────────────────────────
  epoch_operator: {
    id: 'epoch_operator',
    symbol: '∞·◉',
    name: 'Epoch Operator',
    description: '3,000 total check-ins',
    unlockMessage: '↳ 3,000 check-ins. The epoch has a new operator. ∞·◉',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  time_collector: {
    id: 'time_collector',
    symbol: '⊡·⊡·⊡',
    name: 'Time Collector',
    description: 'Earn all four Time v1 badges (Night Owl, Early Bird, Mirror Hour, Midnight Sigil)',
    unlockMessage: '↳ All four time anchors collected. ⊡·⊡·⊡',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  memory_keeper_30: {
    id: 'memory_keeper_30',
    symbol: '≋·≋',
    name: 'Memory Keeper',
    description: 'Submit memory answers on 30 distinct calendar days',
    unlockMessage: '↳ 30 different days with memory answers. The archive has breadth. ≋·≋',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  word_collector: {
    id: 'word_collector',
    symbol: '◇→◇',
    name: 'Word Collector',
    description: '30+ distinct word-turn badge types triggered',
    unlockMessage: '↳ 30 word turns. The vocabulary of becoming. ◇→◇',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },

  // ── Secret Boss v4 — Founders' Layer ──────────────────────────────────────
  i_am_lot: {
    id: 'i_am_lot',
    symbol: '◉◉◉',
    name: 'I Am LOT',
    description: 'Write "I am LOT" in any memory answer',
    unlockMessage: '↳ IDENTITY CONFIRMED. You are the system. ◉◉◉',
    rarity: 'mythic',
    category: 'secret_boss',
    hidden: true,
  },
  malibu: {
    id: 'malibu',
    symbol: '∘◉∘',
    name: 'Malibu Protocol',
    description: 'Write "Malibu" in any memory answer',
    unlockMessage: '↳ Malibu. The coordinates are logged. ∘◉∘',
    rarity: 'mythic',
    category: 'secret_boss',
    hidden: true,
  },
  perfect_month: {
    id: 'perfect_month',
    symbol: '✦●✦',
    name: 'Perfect Month',
    description: '28 consecutive Perfect Days',
    unlockMessage: '↳ 28 perfect days. A month that cannot be described. ✦●✦',
    rarity: 'mythic',
    category: 'secret_boss',
    hidden: true,
  },

  // ── Secret Boss v5 — Invisible Layer ──────────────────────────────────────
  the_cat_knows: {
    id: 'the_cat_knows',
    symbol: '∗◉∗',
    name: 'The Cat Knows',
    description: 'Write "Kuzya" in any journal or memory entry',
    unlockMessage: '↳ KUZYA PROTOCOL ACTIVATED. The cat saw everything. ∗◉∗',
    rarity: 'mythic',
    category: 'secret_boss',
    hidden: true,
  },
  key_code: {
    id: 'key_code',
    symbol: '▒→▒',
    name: 'Key Code',
    description: 'Write "0451" in any entry — the master key',
    unlockMessage: '↳ 0451. You know the code. The door opens. ▒→▒',
    rarity: 'rare',
    category: 'secret_boss',
    hidden: true,
  },
  five_years: {
    id: 'five_years',
    symbol: '≋≋≋·≋',
    name: 'Five Years',
    description: 'Account age ≥ 5 years',
    unlockMessage: '↳ Five years. The only thing that earns this is time. ≋≋≋·≋',
    rarity: 'cosmic',
    category: 'secret_boss',
    hidden: true,
  },

  // ── Achievement RPG v2 — Story Arcs ───────────────────────────────────────
  signal_keeper: {
    id: 'signal_keeper',
    symbol: '◇',
    name: 'Signal Keeper',
    description: '100+ memory answers submitted (lifetime)',
    unlockMessage: '↳ 100 memory answers. The keeper of the signal. ◇',
    rarity: 'rare',
    category: 'achievement_rpg',
  },
  word_weaver: {
    id: 'word_weaver',
    symbol: '≈·≋',
    name: 'Word Weaver',
    description: '20+ distinct word-turn badge types triggered',
    unlockMessage: '↳ 20 word turns. You have built a vocabulary. ≈·≋',
    rarity: 'uncommon',
    category: 'achievement_rpg',
  },
  full_spectrum: {
    id: 'full_spectrum',
    symbol: '◆',
    name: 'Full Spectrum',
    description: 'All 6 User Index dimensions scored in a single week',
    unlockMessage: '↳ All dimensions active. Full spectrum operator. ◆',
    rarity: 'epic',
    category: 'achievement_rpg',
  },
  truth_forge: {
    id: 'truth_forge',
    symbol: '■',
    name: 'Truth Forge',
    description: '50+ journal entries submitted (lifetime)',
    unlockMessage: '↳ 50 journal entries. The forge is hot. ■',
    rarity: 'uncommon',
    category: 'achievement_rpg',
  },
  inner_compass: {
    id: 'inner_compass',
    symbol: '○',
    name: 'Inner Compass',
    description: '25+ intention entries submitted (lifetime)',
    unlockMessage: '↳ 25 intentions. The compass has a bearing. ○',
    rarity: 'uncommon',
    category: 'achievement_rpg',
  },
  perfect_architect: {
    id: 'perfect_architect',
    symbol: '╔═╗',
    name: 'Perfect Architect',
    description: 'All 14 Progressive Feature Unlocks activated',
    unlockMessage: '↳ All features unlocked. The architecture is complete. ╔═╗',
    rarity: 'legendary',
    category: 'achievement_rpg',
  },

  // ── Achievement RPG v3 — Story Arcs ───────────────────────────────────────
  first_signal: {
    id: 'first_signal',
    symbol: '∘',
    name: 'First Signal',
    description: '10+ memory answers submitted (lifetime)',
    unlockMessage: '↳ 10 memory answers. The first signal is strong. ∘',
    rarity: 'common',
    category: 'achievement_rpg',
  },
  planner_class: {
    id: 'planner_class',
    symbol: '○',
    name: 'Planner Class',
    description: '10+ intention entries submitted (lifetime)',
    unlockMessage: '↳ 10 intentions. Planning class achieved. ○',
    rarity: 'common',
    category: 'achievement_rpg',
  },
  dual_channel: {
    id: 'dual_channel',
    symbol: '≈≋',
    name: 'Dual Channel',
    description: 'Submit both a journal entry and a memory answer in the same week × 5',
    unlockMessage: '↳ Five weeks of dual engagement. Both channels open. ≈≋',
    rarity: 'uncommon',
    category: 'achievement_rpg',
  },
  mood_master: {
    id: 'mood_master',
    symbol: '·',
    name: 'Mood Master',
    description: '30+ mood entries submitted (lifetime)',
    unlockMessage: '↳ 30 mood logs. The emotional archive is full. ·',
    rarity: 'uncommon',
    category: 'achievement_rpg',
  },
  body_keeper: {
    id: 'body_keeper',
    symbol: '≈',
    name: 'Body Keeper',
    description: '25+ self-care activity entries (lifetime)',
    unlockMessage: '↳ 25 self-care entries. The body is in the archive. ≈',
    rarity: 'uncommon',
    category: 'achievement_rpg',
  },
  community_builder: {
    id: 'community_builder',
    symbol: '∘→∘',
    name: 'Community Builder',
    description: '50+ chat messages (lifetime)',
    unlockMessage: '↳ 50 messages. The network is real. ∘→∘',
    rarity: 'uncommon',
    category: 'achievement_rpg',
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

    // Mastery tier: memory answer milestones
    if (typeof stats.totalAnswers === 'number') {
      if (stats.totalAnswers >= 500 && !hasBadge('commander_data')) {
        if (awardBadge('commander_data')) newBadges.push('commander_data')
      }
      // Achievement RPG v3
      if (stats.totalAnswers >= 10 && !hasBadge('first_signal')) {
        if (awardBadge('first_signal')) newBadges.push('first_signal')
      }
      // Achievement RPG v2
      if (stats.totalAnswers >= 100 && !hasBadge('signal_keeper')) {
        if (awardBadge('signal_keeper')) newBadges.push('signal_keeper')
      }
    }

    // Mastery tier: level milestone
    if (typeof stats.level === 'number') {
      if (stats.level >= 90 && !hasBadge('sage_mode')) {
        if (awardBadge('sage_mode')) newBadges.push('sage_mode')
      }
    }

    // Mastery v4/v5: total check-ins
    if (typeof stats.totalCheckIns === 'number') {
      if (stats.totalCheckIns >= 2000 && !hasBadge('interstellar')) {
        if (awardBadge('interstellar')) newBadges.push('interstellar')
      }
      if (stats.totalCheckIns >= 3000 && !hasBadge('epoch_operator')) {
        if (awardBadge('epoch_operator')) newBadges.push('epoch_operator')
      }
    }

    // Mastery v4: distinct badge types earned
    const earnedCount = getEarnedBadges().length
    if (earnedCount >= 100 && !hasBadge('signal_master')) {
      if (awardBadge('signal_master')) newBadges.push('signal_master')
    }

    // Mastery v5: all Time v1 badges collected
    const timeV1Badges: BadgeType[] = ['night_owl', 'early_bird', 'mirror_hour', 'midnight_sigil']
    if (timeV1Badges.every(b => hasBadge(b)) && !hasBadge('time_collector')) {
      if (awardBadge('time_collector')) newBadges.push('time_collector')
    }

    // Word-turn badge type counts (earned word_turn category badges)
    const earned = getEarnedBadges()
    const wordTurnCount = earned.filter(id => BADGES[id]?.category === 'word_turn').length
    if (wordTurnCount >= 20 && !hasBadge('word_weaver')) {
      if (awardBadge('word_weaver')) newBadges.push('word_weaver')
    }
    if (wordTurnCount >= 30 && !hasBadge('word_master')) {
      if (awardBadge('word_master')) newBadges.push('word_master')
    }
    if (wordTurnCount >= 30 && !hasBadge('word_collector')) {
      if (awardBadge('word_collector')) newBadges.push('word_collector')
    }

    // Achievement RPG v3: intention entries
    if (typeof stats.totalIntentions === 'number') {
      if (stats.totalIntentions >= 10 && !hasBadge('planner_class')) {
        if (awardBadge('planner_class')) newBadges.push('planner_class')
      }
      // Achievement RPG v2
      if (stats.totalIntentions >= 25 && !hasBadge('inner_compass')) {
        if (awardBadge('inner_compass')) newBadges.push('inner_compass')
      }
    }

    // Achievement RPG v2: journal entries
    if (typeof stats.totalJournalEntries === 'number') {
      if (stats.totalJournalEntries >= 50 && !hasBadge('truth_forge')) {
        if (awardBadge('truth_forge')) newBadges.push('truth_forge')
      }
    }

    // Achievement RPG v3: mood entries
    if (typeof stats.totalMoodEntries === 'number') {
      if (stats.totalMoodEntries >= 30 && !hasBadge('mood_master')) {
        if (awardBadge('mood_master')) newBadges.push('mood_master')
      }
    }

    // Achievement RPG v3: self-care entries
    if (typeof stats.totalSelfCareEntries === 'number') {
      if (stats.totalSelfCareEntries >= 25 && !hasBadge('body_keeper')) {
        if (awardBadge('body_keeper')) newBadges.push('body_keeper')
      }
    }

    // Achievement RPG v3: chat messages
    if (typeof stats.totalChatMessages === 'number') {
      if (stats.totalChatMessages >= 50 && !hasBadge('community_builder')) {
        if (awardBadge('community_builder')) newBadges.push('community_builder')
      }
    }

    // Mastery v5: memory answers on distinct calendar days
    if (typeof stats.memoryDaysCount === 'number') {
      if (stats.memoryDaysCount >= 30 && !hasBadge('memory_keeper_30')) {
        if (awardBadge('memory_keeper_30')) newBadges.push('memory_keeper_30')
      }
    }

    // Secret Boss v5: five years account age
    if (typeof stats.signupDate === 'string' && stats.signupDate) {
      const signup = new Date(stats.signupDate)
      const now = new Date()
      const yearsElapsed = (now.getTime() - signup.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      if (yearsElapsed >= 5 && !hasBadge('five_years')) {
        if (awardBadge('five_years')) newBadges.push('five_years')
      }
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
      }
    }

    if (serverBadges.badgeTheme === 'water' || serverBadges.badgeTheme === 'architecture') {
      const localTheme = localStorage.getItem('badge_theme')
      if (!localTheme) {
        localStorage.setItem('badge_theme', serverBadges.badgeTheme)
      }
    }
  } catch { /* non-critical */ }
}
