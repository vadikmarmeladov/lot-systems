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
  // ── Word turn badges v3 — Computer Lore ─────────────────────────────────────
  | 'hacker_mode'        // ░▒▓  "hack" / "hacker"
  | 'override_protocol'  // ▶▶▶  "override"
  | 'debug_mode'         // ▒·▒  "debug"
  | 'signal_boost'       // ∘→∘  "signal"
  | 'into_the_void'      // ░░░  "void" / "empty"
  | 'ignition'           // ∴·∴  "spark" / "ignite"
  | 'echo_chamber'       // ∿·∿  "echo"
  | 'defense_protocol'   // ╔·╗  "shield"
  | 'navigator'          // →·←  "map" / "navigate"
  | 'growth_module'      // ∘↑∘  "grow" / "growth"
  | 'lost_signal'        // ─ ─ ─ "lost"
  | 'binary_state'       // 01·10 "binary" / "zero" / "one"
  // ── Word turn badges v4 — Self-Care ──────────────────────────────────────────
  | 'hydration_signal'   // ≋·≋  "water" (self-care context)
  | 'kinetic_trace'      // →·→  "walk" (self-care context)
  | 'healing_mode'       // ○→●  "heal" / "healing"
  | 'reader_protocol'    // ─·─  "read" / "reading"
  | 'scribe_mode'        // ∿→∿  "write" / "writing"
  | 'creation_node'      // ∴→∘  "create"
  | 'body_signal'        // ◈·◈  "body"
  | 'breath_loop'        // ∿·∿  "breath" (self-care context)
  | 'rest_state'         // ─∘─  "rest" (self-care context)
  | 'motion_protocol'    // →∘→  "move" / "motion"
  | 'fuel_intake'        // ■·■  "eat" / "food"
  | 'sleep_cycle'        // ∼∼∼  "sleep" (self-care context)
  // ── Word turn badges v5 — Signal Codex ───────────────────────────────────────
  | 'solitude_mode'      // ∘—∘  "solitude"
  | 'wonder_protocol'    // ○·∗  "wonder"
  | 'phoenix_sequence'   // ∴→∘  "phoenix"
  | 'alignment_lock'     // ─○─  "align"
  | 'witness_log'        // ◯·◯  "witness"
  | 'orbital_pattern'    // ○→○  "orbit"
  | 'forge_protocol'     // ■·■  "forge"
  | 'neuro_link'         // ≋·—  "mind" / "mindful"
  | 'photon_signal'      // ○—○  "light" (signal)
  | 'field_charge'       // ∿→∿  "energy"
  | 'voyage_mode'        // →·∗  "voyage"
  | 'gravity_lock'       // ≋·■  "gravity"
  // ── Word turn badges v6 — The Becoming Lexicon ───────────────────────────────
  | 'surrender_protocol' // ∿·∿  "surrender"
  | 'restore_point'      // ○→●  "restore"
  | 'anchor_down'        // ─▪─  "anchor"
  | 'threshold_mark'     // ╞═╡  "threshold"
  | 'emergence_signal'   // ∘→≈  "emerge"
  | 'exhale_protocol'    // ≋·∿  "exhale"
  | 'clear_cache'        // □·□  "clear"
  | 'rise_protocol'      // ∘↑∘  "rise"
  | 'presence_confirmed' // ●·●  "presence"
  | 'bold_mode'          // ▶·▶  "bold"
  | 'trust_protocol'     // ○═○  "trust"
  | 'phase_shift_ii'     // →∘→  "shift"
  // ── Word turn badges v7 — The Book Lexicon ───────────────────────────────────
  | 'chapter_signal'     // ─│─  "chapter"
  | 'story_mode'         // ≈·≈  "story"
  | 'villain_detected'   // ▓·▓  "villain"
  | 'hero_protocol'      // ∗·∗  "hero"
  | 'quest_active'       // →∘→  "quest"
  | 'page_turner'        // ─·─  "page" / "pages"
  | 'author_mode'        // ◐·◐  "author"
  | 'forgotten_archive'  // ░░░  "forgotten"
  | 'written_signal'     // ∿→∿  "written"
  | 'plot_detected'      // ◈·◈  "plot"
  | 'ending_protocol'    // ○→●  "ending"
  | 'journey_mode'       // →·∗  "journey"
  // ── Easter egg — time-based v3 ───────────────────────────────────────────────
  | 'lucky_signal'       // ○·○·○  Check-in at 07:07
  | 'new_day_proto'      // ·∘·   Check-in at 00:01
  | 'double_down'        // ═══   Check-in at 22:22
  | 'leet_signal'        // ▒·▒   Check-in at 13:37
  // ── Easter egg — time-based v4 ────────────────────────────────────────────────
  | 'fib_hour'           // ∘·∘·∘  Check-in at 01:12
  | 'golden_hour'        // ○≈○   Check-in at 01:37
  | 'cube_hour'          // ■·■·■  Check-in at 08:00
  | 'tau2_signal'        // ∞∘∞   Check-in at 18:00
  // ── Easter egg — time-based v5 ────────────────────────────────────────────────
  | 'digital_symmetry'   // ═○═   Check-in at 10:10
  | 'seq_boot'           // ·→·   Check-in at 01:23
  | 'palindrome_time'    // ∘·∘   Check-in at 21:12
  | 'tau_signal'         // ∞∘∞   Check-in at 06:28
  // ── Easter egg — time-based v6 ────────────────────────────────────────────────
  | 'nine_lives'         // ∘··∘  Check-in at 09:09
  | 'hex_hour'           // ══·══  Check-in at 16:16
  | 'final_frame'        // ─│─   Check-in at 23:59
  | 'year_signal'        // ≋◈≋   Check-in at 20:26
  // ── Easter egg — time-based v7 ────────────────────────────────────────────────
  | 'the_answer'         // ∗·∗   Check-in at 00:42 (42)
  | 'high_noon'          // ○|○   Check-in at 12:00 exactly
  | 'devils_hour'        // ▓·▓   Check-in at 03:33
  | 'infinity_gate'      // ∞·∞   Check-in at 08:08
  // ── Easter egg — calendar v2 ──────────────────────────────────────────────────
  | 'cosmo_bday'         // ✦◉✦   July 1
  | 'leap_day'           // ◈◈   February 29
  // ── Easter egg — calendar v3 ──────────────────────────────────────────────────
  | 'valentine'          // ♡·♡   February 14
  | 'halloween'          // ▓░▓   October 31
  | 'nye_signal'         // ○→●   December 31
  // ── Easter egg — calendar v4 ──────────────────────────────────────────────────
  | 'signal_wars'        // ∗→∗   May 4
  | 'prog_day'           // ▒·▒   September 12-13
  | 'ada_protocol'       // ◈·◈   December 9
  // ── Easter egg — calendar v5 ──────────────────────────────────────────────────
  | 'groundhog_loop'     // ·∘·   February 2
  | 'binary_day'         // ○═○   October 10
  | 'fibonacci_day'      // ◈·◈   November 23
  // ── Easter egg — calendar v6 ─────────────────────────────────────────────────
  | 'towel_day'          // ─·─   May 25
  | 'space_signal'       // ○→∗   October 4
  | 'bug_day'            // ▒·▒   September 9
  // ── Easter egg — behavioral v2 ────────────────────────────────────────────────
  | 'trio_protocol'      // ✦✦✦   3 consecutive Perfect Days
  | 'deep_session'       // ◆◆◆   10+ memory Qs in one session
  | 'comeback_kid'       // ◈→◈   Return after 90+ day absence
  // ── Easter egg — behavioral v3 ────────────────────────────────────────────────
  | 'birthday_checkin'   // ○·◉   Check-in on your birthday
  | 'night_checkin'      // ◉·▪   Check-in 23:00-23:59
  | 'flow_session'       // ≋→≋   6+ widget types in single session
  // ── Easter egg — behavioral v4 ────────────────────────────────────────────────
  | 'night_scribe'       // ◉·▪   Journal entry after 23:30
  | 'epic_transmission'  // ≋→≋   Memory answer 1,000+ characters
  | 'perfect_week'       // ─●─   7 consecutive Perfect Days
  | 'analog_reboot'      // ◈→◉   Return after 180+ day absence
  // ── Easter egg — behavioral v5 ────────────────────────────────────────────────
  | 'deep_scribe'        // ≋→≋   Journal >= 500 chars
  | 'phoenix_streak'     // ◈→○   Streak broken then rebuilt 7+ days
  | 'time_anchor'        // ⊡═⊡   Same check-in hour 14 consecutive days
  // ── Easter egg — behavioral v6 ────────────────────────────────────────────────
  | 'early_light'        // ∴·∘   Check-in before 7:00 AM for 7 consecutive days
  | 'midnight_archive'   // ◉·▪   Journal after midnight 5 consecutive days
  | 'weekend_ritual'     // ○≈○   Check-in Sat+Sun for 4 consecutive weekends
  // ── Mastery tier v2 ────────────────────────────────────────────────────────
  | 'archivist'          // ◇◇◇  200 journal entries
  | 'pattern_master'     // ○∿○  All 5 Oceanic Mayan badges
  | 'temporal_lock'      // ⊡·⊡  Same check-in time 7 days
  | 'full_codex'         // ◉≋◉  50+ distinct badge types
  // ── Mastery tier v3 ────────────────────────────────────────────────────────
  | 'thousand_suns'      // ∗×∗   1,000 total check-ins
  | 'deep_narrative'     // ≋·≋   Memory story >= 500 words
  | 'badge_sovereign'    // ◉·◈   75+ distinct badge types
  | 'grand_archive'      // ≋→◉   500 journal entries
  // ── Mastery tier v4 ────────────────────────────────────────────────────────
  | 'interstellar'       // ∗×∗   2,000 total check-ins
  | 'deep_narrator'      // ≋≋·≋≋  Memory story >= 1,000 words
  | 'signal_master'      // ◉·◈·◉  100+ distinct badge types
  | 'word_master'        // ▒→▒   30+ word-turn badge types
  // ── Mastery tier v5 ────────────────────────────────────────────────────────
  | 'epoch_operator'     // ∞·◉   3,000 total check-ins
  | 'time_collector'     // ⊡·⊡·⊡  All 4 Time v1 triggers earned
  | 'memory_keeper_30'   // ≋·≋   Memory answer every day 30 days
  | 'word_collector'     // ◇→◇   30+ distinct word-turn badges
  // ── Mastery tier v6 ────────────────────────────────────────────────────────
  | 'lexicon_sage'       // ◇·◇   50+ word-turn badge types
  | 'calendar_watcher'   // ○═○   10+ calendar easter egg badges
  | 'time_wizard'        // ⊡·⊡   10+ time easter egg badges
  | 'grand_master'       // ◉═◉   17+ mastery badges earned
  // ── Secret Boss v2 ────────────────────────────────────────────────────────────
  | 'ultra_sage'         // ∞◉∞  Level 100
  | 'founders_mark'      // ◉═◉  Write "April 7 2016" exactly
  | 'singularity'        // ∞∞◉∞∞ All v11 badges
  // ── Secret Boss v3 ────────────────────────────────────────────────────────────
  | 'kuzya_knows'        // ∗◉∗  Write "Kuzya" in answer
  | 'hundred_mondays'    // ─◉─  Check in every Monday for 100 weeks
  | 'deep_anchor'        // ◉≋◉  streak >= 500
  // ── Secret Boss v4 ────────────────────────────────────────────────────────────
  | 'i_am_lot'           // ◉◉◉  Write "I am LOT" exact
  | 'malibu_protocol'    // ∘◉∘  Write "Malibu" in answer
  | 'perfect_month'      // ✦●✦  28 consecutive Perfect Days
  // ── Secret Boss v5 ────────────────────────────────────────────────────────────
  | 'the_cat_knows'      // ∗◉∗  Write "Kuzya" alias
  | 'key_code'           // ▒→▒  Write "0451" in answer
  | 'five_years'         // ≋≋≋·≋ Account >= 5 years
  // ── Secret Boss v6 ────────────────────────────────────────────────────────────
  | 'forty_two'          // ∗·∗  Write "42" in any answer
  | 'carrier_wave'       // ≋→≋  Write "Malibu" or "Pacific" 5+ times
  | 'badge_singularity'  // ◉·∞  Earn all mastery tier badges v1-v5
  // ── Achievement RPG v2 ────────────────────────────────────────────────────────
  | 'signal_keeper'      // ∿  streak >= 30
  | 'word_weaver'        // ◇  5+ word-turn badges
  | 'full_spectrum'      // ◈  3 self-care domains in one day
  | 'truth_forge'        // ▲  100 journal entries
  | 'inner_compass'      // ≋  30 memory answers
  | 'perfect_architect'  // ●  7 specific milestone badges
  // ── Achievement RPG v3 ────────────────────────────────────────────────────────
  | 'first_signal'       // ∘  10 memory answers
  | 'planner_class'      // ──○  10 planner intentions
  | 'dual_channel'       // ◈  journal + memory same week x5
  | 'mood_master'        // ◐  30 mood entries
  | 'body_keeper'        // ♡  25 self-care acts
  | 'community_builder'  // ≈  50 chat messages
  // ── Achievement RPG v4 ────────────────────────────────────────────────────────
  | 'morning_pages'          // ∴  Journal before 9am on 10 days
  | 'midnight_archive_ach'   // ◉  Answer after midnight on 10 days
  | 'weekend_guardian'       // ○  Check-in every Sat+Sun for 4 weeks
  | 'memory_weaver'          // ◆  200 total memory answers
  | 'journal_sage'           // ≋  365 total journal entries
  | 'badge_archaeologist'    // ◈  20+ distinct hidden badges

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
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  category: 'milestone' | 'easter_egg' | 'word_turn' | 'pattern'
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
  // ── Word turn badges v3 — Computer Lore ─────────────────────────────────────
  hacker_mode: {
    id: 'hacker_mode',
    symbol: '░▒▓',
    name: 'Hacker Mode',
    description: '"hack" or "hacker" detected',
    unlockMessage: '↳ Root access acknowledged. ░▒▓',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  override_protocol: {
    id: 'override_protocol',
    symbol: '▶▶▶',
    name: 'Override Protocol',
    description: '"override" detected',
    unlockMessage: '↳ Override accepted. ▶▶▶',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  debug_mode: {
    id: 'debug_mode',
    symbol: '▒·▒',
    name: 'Debug Mode',
    description: '"debug" detected',
    unlockMessage: '↳ Diagnostics running. ▒·▒',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  signal_boost: {
    id: 'signal_boost',
    symbol: '∘→∘',
    name: 'Signal Boost',
    description: '"signal" detected',
    unlockMessage: '↳ Signal amplified. ∘→∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  into_the_void: {
    id: 'into_the_void',
    symbol: '░░░',
    name: 'Into the Void',
    description: '"void" or "empty" detected',
    unlockMessage: '↳ Void noted. Something stirs. ░░░',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  ignition: {
    id: 'ignition',
    symbol: '∴·∴',
    name: 'Ignition',
    description: '"spark" or "ignite" detected',
    unlockMessage: '↳ Spark detected. Systems live. ∴·∴',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  echo_chamber: {
    id: 'echo_chamber',
    symbol: '∿·∿',
    name: 'Echo Chamber',
    description: '"echo" detected',
    unlockMessage: '↳ Echo registered in the archive. ∿·∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  defense_protocol: {
    id: 'defense_protocol',
    symbol: '╔·╗',
    name: 'Defense Protocol',
    description: '"shield" or "protect" detected',
    unlockMessage: '↳ Protection signal active. ╔·╗',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  navigator: {
    id: 'navigator',
    symbol: '→·←',
    name: 'Navigator',
    description: '"map" or "navigate" detected',
    unlockMessage: '↳ Course plotted. →·←',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  growth_module: {
    id: 'growth_module',
    symbol: '∘↑∘',
    name: 'Growth Module',
    description: '"grow" or "growth" detected',
    unlockMessage: '↳ Growth vector confirmed. ∘↑∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  lost_signal: {
    id: 'lost_signal',
    symbol: '─ ─ ─',
    name: 'Lost Signal',
    description: '"lost" detected',
    unlockMessage: '↳ Signal trace active. You are findable. ─ ─ ─',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  binary_state: {
    id: 'binary_state',
    symbol: '01·10',
    name: 'Binary State',
    description: '"binary" or "zero" or "one" detected',
    unlockMessage: '↳ Binary logged. State known. 01·10',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  // ── Word turn badges v4 — Self-Care ──────────────────────────────────────────
  hydration_signal: {
    id: 'hydration_signal',
    symbol: '≋·≋',
    name: 'Hydration Signal',
    description: '"water intake" or "hydrat" detected',
    unlockMessage: '↳ Hydration logged. System online. ≋·≋',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  kinetic_trace: {
    id: 'kinetic_trace',
    symbol: '→·→',
    name: 'Kinetic Trace',
    description: '"walked" or "walking today" detected',
    unlockMessage: '↳ Movement confirmed. →·→',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  healing_mode: {
    id: 'healing_mode',
    symbol: '○→●',
    name: 'Healing Mode',
    description: '"heal" or "healing" detected',
    unlockMessage: '↳ Healing mode active. ○→●',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  reader_protocol: {
    id: 'reader_protocol',
    symbol: '─·─',
    name: 'Reader Protocol',
    description: '"read" or "reading" detected',
    unlockMessage: '↳ Reading logged. Mind nourished. ─·─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  scribe_mode: {
    id: 'scribe_mode',
    symbol: '∿→∿',
    name: 'Scribe Mode',
    description: '"write" or "writing" or "journal" detected',
    unlockMessage: '↳ Scribe mode active. The record grows. ∿→∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  creation_node: {
    id: 'creation_node',
    symbol: '∴→∘',
    name: 'Creation Node',
    description: '"create" or "creating" detected',
    unlockMessage: '↳ Creative signal logged. ∴→∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  body_signal: {
    id: 'body_signal',
    symbol: '◈·◈',
    name: 'Body Signal',
    description: '"my body" or "body feels" detected',
    unlockMessage: '↳ Body awareness confirmed. ◈·◈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  breath_loop: {
    id: 'breath_loop',
    symbol: '∿·∿',
    name: 'Breath Loop',
    description: '"breathwork" or "breathing exercise" detected',
    unlockMessage: '↳ Breath practice logged. ∿·∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  rest_state: {
    id: 'rest_state',
    symbol: '─∘─',
    name: 'Rest State',
    description: '"rest day" or "took a rest" detected',
    unlockMessage: '↳ Rest acknowledged. Recovery is signal. ─∘─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  motion_protocol: {
    id: 'motion_protocol',
    symbol: '→∘→',
    name: 'Motion Protocol',
    description: '"movement" or "motion" detected',
    unlockMessage: '↳ Body in motion. →∘→',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  fuel_intake: {
    id: 'fuel_intake',
    symbol: '■·■',
    name: 'Fuel Intake',
    description: '"ate" or "meal" or "food" detected',
    unlockMessage: '↳ Nutrition logged. System fueled. ■·■',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  sleep_cycle: {
    id: 'sleep_cycle',
    symbol: '∼∼∼',
    name: 'Sleep Cycle',
    description: '"slept" or "sleep quality" detected',
    unlockMessage: '↳ Rest cycle logged. ∼∼∼',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  // ── Word turn badges v5 — Signal Codex ───────────────────────────────────────
  solitude_mode: {
    id: 'solitude_mode',
    symbol: '∘—∘',
    name: 'Solitude Mode',
    description: '"solitude" or "by myself" detected',
    unlockMessage: '↳ Solitude acknowledged. Space is signal. ∘—∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  wonder_protocol: {
    id: 'wonder_protocol',
    symbol: '○·∗',
    name: 'Wonder Protocol',
    description: '"wonder" or "in awe" detected',
    unlockMessage: '↳ Wonder registered. The archive marvels. ○·∗',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  phoenix_sequence: {
    id: 'phoenix_sequence',
    symbol: '∴→∘',
    name: 'Phoenix Sequence',
    description: '"phoenix" or "rise from" detected',
    unlockMessage: '↳ Phoenix event detected. ∴→∘',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  alignment_lock: {
    id: 'alignment_lock',
    symbol: '─○─',
    name: 'Alignment Lock',
    description: '"align" or "aligned" detected',
    unlockMessage: '↳ Alignment confirmed. ─○─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  witness_log: {
    id: 'witness_log',
    symbol: '◯·◯',
    name: 'Witness Log',
    description: '"witness" or "witnessing" detected',
    unlockMessage: '↳ Observer mode active. ◯·◯',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  orbital_pattern: {
    id: 'orbital_pattern',
    symbol: '○→○',
    name: 'Orbital Pattern',
    description: '"orbit" or "circling" detected',
    unlockMessage: '↳ Orbital path logged. ○→○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  forge_protocol: {
    id: 'forge_protocol',
    symbol: '■·■',
    name: 'Forge Protocol',
    description: '"forge" or "forged" detected',
    unlockMessage: '↳ Forge event registered. ■·■',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  neuro_link: {
    id: 'neuro_link',
    symbol: '≋·—',
    name: 'Neuro Link',
    description: '"mindful" or "mindfulness" detected',
    unlockMessage: '↳ Neural link established. ≋·—',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  photon_signal: {
    id: 'photon_signal',
    symbol: '○—○',
    name: 'Photon Signal',
    description: '"inner light" or "the light" detected',
    unlockMessage: '↳ Photon signal received. ○—○',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  field_charge: {
    id: 'field_charge',
    symbol: '∿→∿',
    name: 'Field Charge',
    description: '"my energy" or "feeling energized" detected',
    unlockMessage: '↳ Energy field logged. ∿→∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  voyage_mode: {
    id: 'voyage_mode',
    symbol: '→·∗',
    name: 'Voyage Mode',
    description: '"voyage" or "the path" detected',
    unlockMessage: '↳ Voyage mode engaged. →·∗',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  gravity_lock: {
    id: 'gravity_lock',
    symbol: '≋·■',
    name: 'Gravity Lock',
    description: '"gravity" or "grounded" detected',
    unlockMessage: '↳ Gravity acknowledged. ≋·■',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  // ── Word turn badges v6 — The Becoming Lexicon ───────────────────────────────
  surrender_protocol: {
    id: 'surrender_protocol',
    symbol: '∿·∿',
    name: 'Surrender Protocol',
    description: '"surrender" or "let it go" detected',
    unlockMessage: '↳ Release logged. Surrender is strength. ∿·∿',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  restore_point: {
    id: 'restore_point',
    symbol: '○→●',
    name: 'Restore Point',
    description: '"restore" or "came back to myself" detected',
    unlockMessage: '↳ Restore point created. ○→●',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  anchor_down: {
    id: 'anchor_down',
    symbol: '─▪─',
    name: 'Anchor Down',
    description: '"anchor" or "my anchor" detected',
    unlockMessage: '↳ Anchor set. ─▪─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  threshold_mark: {
    id: 'threshold_mark',
    symbol: '╞═╡',
    name: 'Threshold Mark',
    description: '"threshold" or "crossroads" detected',
    unlockMessage: '↳ Threshold crossed. ╞═╡',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  emergence_signal: {
    id: 'emergence_signal',
    symbol: '∘→≈',
    name: 'Emergence Signal',
    description: '"emerge" or "surfacing" detected',
    unlockMessage: '↳ Emergence event. ∘→≈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  exhale_protocol: {
    id: 'exhale_protocol',
    symbol: '≋·∿',
    name: 'Exhale Protocol',
    description: '"exhale" or "breathed out" detected',
    unlockMessage: '↳ Exhale logged. Tension released. ≋·∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  clear_cache: {
    id: 'clear_cache',
    symbol: '□·□',
    name: 'Clear Cache',
    description: '"clear" or "cleared my head" detected',
    unlockMessage: '↳ Cache cleared. □·□',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  rise_protocol: {
    id: 'rise_protocol',
    symbol: '∘↑∘',
    name: 'Rise Protocol',
    description: '"rising" or "chose to rise" detected',
    unlockMessage: '↳ Rise event logged. ∘↑∘',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  presence_confirmed: {
    id: 'presence_confirmed',
    symbol: '●·●',
    name: 'Presence Confirmed',
    description: '"I am here" or "showing up" detected',
    unlockMessage: '↳ Presence confirmed. You are here. ●·●',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  bold_mode: {
    id: 'bold_mode',
    symbol: '▶·▶',
    name: 'Bold Mode',
    description: '"bold" or "I was bold" detected',
    unlockMessage: '↳ Bold mode active. ▶·▶',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  trust_protocol: {
    id: 'trust_protocol',
    symbol: '○═○',
    name: 'Trust Protocol',
    description: '"I trust" or "trusting" detected',
    unlockMessage: '↳ Trust signal confirmed. ○═○',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  phase_shift_ii: {
    id: 'phase_shift_ii',
    symbol: '→∘→',
    name: 'Phase Shift II',
    description: '"shift" or "something shifted" detected',
    unlockMessage: '↳ Phase shift logged. →∘→',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  // ── Word turn badges v7 — The Book Lexicon ───────────────────────────────────
  chapter_signal: {
    id: 'chapter_signal',
    symbol: '─│─',
    name: 'Chapter Signal',
    description: '"chapter" or "new chapter" detected',
    unlockMessage: '↳ New chapter opened. ─│─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  story_mode: {
    id: 'story_mode',
    symbol: '≈·≈',
    name: 'Story Mode',
    description: '"my story" or "this story" detected',
    unlockMessage: '↳ Story mode active. The archive listens. ≈·≈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  villain_detected: {
    id: 'villain_detected',
    symbol: '▓·▓',
    name: 'Villain Detected',
    description: '"villain" or "the enemy" detected',
    unlockMessage: '↳ Antagonist named. Awareness is power. ▓·▓',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  hero_protocol: {
    id: 'hero_protocol',
    symbol: '∗·∗',
    name: 'Hero Protocol',
    description: '"hero" or "be the hero" detected',
    unlockMessage: '↳ Hero signal received. ∗·∗',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  quest_active: {
    id: 'quest_active',
    symbol: '→∘→',
    name: 'Quest Active',
    description: '"quest" or "on a quest" detected',
    unlockMessage: '↳ Quest logged. Mission noted. →∘→',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  page_turner: {
    id: 'page_turner',
    symbol: '─·─',
    name: 'Page Turner',
    description: '"page" or "pages" detected',
    unlockMessage: '↳ Pages turning. ─·─',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  author_mode: {
    id: 'author_mode',
    symbol: '◐·◐',
    name: 'Author Mode',
    description: '"author" or "I am the author" detected',
    unlockMessage: '↳ Author mode. You are writing this. ◐·◐',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  forgotten_archive: {
    id: 'forgotten_archive',
    symbol: '░░░',
    name: 'Forgotten Archive',
    description: '"forgotten" or "long forgotten" detected',
    unlockMessage: '↳ The forgotten remembered. ░░░',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  written_signal: {
    id: 'written_signal',
    symbol: '∿→∿',
    name: 'Written Signal',
    description: '"written" or "it is written" detected',
    unlockMessage: '↳ Signal confirmed in writing. ∿→∿',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  plot_detected: {
    id: 'plot_detected',
    symbol: '◈·◈',
    name: 'Plot Detected',
    description: '"plot" or "plot twist" detected',
    unlockMessage: '↳ Narrative pattern recognized. ◈·◈',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  ending_protocol: {
    id: 'ending_protocol',
    symbol: '○→●',
    name: 'Ending Protocol',
    description: '"ending" or "how it ends" detected',
    unlockMessage: '↳ Ending acknowledged. Every ending is a door. ○→●',
    rarity: 'rare',
    category: 'word_turn',
    hidden: true,
  },
  journey_mode: {
    id: 'journey_mode',
    symbol: '→·∗',
    name: 'Journey Mode',
    description: '"journey" or "long journey" detected',
    unlockMessage: '↳ Journey mode active. →·∗',
    rarity: 'uncommon',
    category: 'word_turn',
    hidden: true,
  },
  // ── Easter egg — time-based v3 ───────────────────────────────────────────────
  lucky_signal: {
    id: 'lucky_signal',
    symbol: '○·○·○',
    name: 'Lucky Signal',
    description: 'Check in at 07:07',
    unlockMessage: '↳ Lucky sequence confirmed. ○·○·○',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  new_day_proto: {
    id: 'new_day_proto',
    symbol: '·∘·',
    name: 'New Day Protocol',
    description: 'Check in at 00:01',
    unlockMessage: '↳ The new day, first moment. ·∘·',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  double_down: {
    id: 'double_down',
    symbol: '═══',
    name: 'Double Down',
    description: 'Check in at 22:22',
    unlockMessage: '↳ Doubled signal. ═══',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  leet_signal: {
    id: 'leet_signal',
    symbol: '▒·▒',
    name: 'Leet Signal',
    description: 'Check in at 13:37',
    unlockMessage: '↳ 1337. You were there. ▒·▒',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — time-based v4 ────────────────────────────────────────────────
  fib_hour: {
    id: 'fib_hour',
    symbol: '∘·∘·∘',
    name: 'Fibonacci Hour',
    description: 'Check in at 01:12',
    unlockMessage: '↳ Fibonacci sequence in time. ∘·∘·∘',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  golden_hour: {
    id: 'golden_hour',
    symbol: '○≈○',
    name: 'Golden Hour',
    description: 'Check in at 01:37',
    unlockMessage: '↳ The golden ratio in hours. ○≈○',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  cube_hour: {
    id: 'cube_hour',
    symbol: '■·■·■',
    name: 'Cube Hour',
    description: 'Check in at 08:00',
    unlockMessage: '↳ Perfect cube time. ■·■·■',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  tau2_signal: {
    id: 'tau2_signal',
    symbol: '∞∘∞',
    name: 'Tau Signal II',
    description: 'Check in at 18:00',
    unlockMessage: '↳ Tau/2 = 3.14. You found it. ∞∘∞',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — time-based v5 ────────────────────────────────────────────────
  digital_symmetry: {
    id: 'digital_symmetry',
    symbol: '═○═',
    name: 'Digital Symmetry',
    description: 'Check in at 10:10',
    unlockMessage: '↳ Mirror symmetry in the clock. ═○═',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  seq_boot: {
    id: 'seq_boot',
    symbol: '·→·',
    name: 'Sequence Boot',
    description: 'Check in at 01:23',
    unlockMessage: '↳ Sequential boot confirmed. ·→·',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  palindrome_time: {
    id: 'palindrome_time',
    symbol: '∘·∘',
    name: 'Palindrome Time',
    description: 'Check in at 21:12',
    unlockMessage: '↳ Time reads itself backward. ∘·∘',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  tau_signal: {
    id: 'tau_signal',
    symbol: '∞∘∞',
    name: 'Tau Signal',
    description: 'Check in at 06:28',
    unlockMessage: '↳ Tau = 6.28. The full circle. ∞∘∞',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — time-based v6 ────────────────────────────────────────────────
  nine_lives: {
    id: 'nine_lives',
    symbol: '∘··∘',
    name: 'Nine Lives',
    description: 'Check in at 09:09',
    unlockMessage: '↳ Nine lives. Nine chances. ∘··∘',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  hex_hour: {
    id: 'hex_hour',
    symbol: '══·══',
    name: 'Hex Hour',
    description: 'Check in at 16:16 (0x10:0x10)',
    unlockMessage: '↳ Hexadecimal time confirmed. ══·══',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  final_frame: {
    id: 'final_frame',
    symbol: '─│─',
    name: 'Final Frame',
    description: 'Check in at 23:59',
    unlockMessage: '↳ Last minute of the day. ─│─',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  year_signal: {
    id: 'year_signal',
    symbol: '≋◈≋',
    name: 'Year Signal',
    description: 'Check in at 20:26 (year 2026)',
    unlockMessage: '↳ Year signal locked. ≋◈≋',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — time-based v7 ────────────────────────────────────────────────
  the_answer: {
    id: 'the_answer',
    symbol: '∗·∗',
    name: 'The Answer',
    description: 'Check in at 00:42 — 42',
    unlockMessage: '↳ 42. The answer to everything. ∗·∗',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  high_noon: {
    id: 'high_noon',
    symbol: '○|○',
    name: 'High Noon',
    description: 'Check in at exactly 12:00',
    unlockMessage: '↳ High Noon. Peak signal. ○|○',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  devils_hour: {
    id: 'devils_hour',
    symbol: '▓·▓',
    name: "Devil's Hour",
    description: 'Check in at 03:33',
    unlockMessage: '↳ Deep system access granted. ▓·▓',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  infinity_gate: {
    id: 'infinity_gate',
    symbol: '∞·∞',
    name: 'Infinity Gate',
    description: 'Check in at 08:08',
    unlockMessage: '↳ 8 loops. The gate opens. ∞·∞',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — calendar v2 ──────────────────────────────────────────────────
  cosmo_bday: {
    id: 'cosmo_bday',
    symbol: '✦◉✦',
    name: 'COSMO® Day',
    description: 'Check in on July 1 — COSMO® founding day',
    unlockMessage: '↳ COSMO® founding day. Two systems, one origin. ✦◉✦',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  leap_day: {
    id: 'leap_day',
    symbol: '◈◈',
    name: 'Leap Day',
    description: 'Check in on February 29',
    unlockMessage: '↳ The rare day. You were here. ◈◈',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — calendar v3 ──────────────────────────────────────────────────
  valentine: {
    id: 'valentine',
    symbol: '♡·♡',
    name: "Valentine's Signal",
    description: 'Check in on February 14',
    unlockMessage: '↳ Love signal received. ♡·♡',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  halloween: {
    id: 'halloween',
    symbol: '▓░▓',
    name: 'Halloween Protocol',
    description: 'Check in on October 31',
    unlockMessage: '↳ The shadows confirm your presence. ▓░▓',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  nye_signal: {
    id: 'nye_signal',
    symbol: '○→●',
    name: 'New Year Signal',
    description: 'Check in on December 31',
    unlockMessage: '↳ Last day of the year. Signal transmitted. ○→●',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — calendar v4 ──────────────────────────────────────────────────
  signal_wars: {
    id: 'signal_wars',
    symbol: '∗→∗',
    name: 'Signal Wars',
    description: 'Check in on May 4 (May the 4th)',
    unlockMessage: '↳ May the signal be with you. ∗→∗',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  prog_day: {
    id: 'prog_day',
    symbol: '▒·▒',
    name: 'Programmer Day',
    description: 'Check in on the 256th day of year (Sept 12-13)',
    unlockMessage: '↳ 256th day. The programmer knows. ▒·▒',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  ada_protocol: {
    id: 'ada_protocol',
    symbol: '◈·◈',
    name: 'Ada Protocol',
    description: 'Check in on December 9 (Ada Lovelace Day)',
    unlockMessage: '↳ Ada Lovelace. The first programmer. ◈·◈',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — calendar v5 ──────────────────────────────────────────────────
  groundhog_loop: {
    id: 'groundhog_loop',
    symbol: '·∘·',
    name: 'Groundhog Loop',
    description: 'Check in on February 2',
    unlockMessage: '↳ Loop detected. Reset or continue? ·∘·',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  binary_day: {
    id: 'binary_day',
    symbol: '○═○',
    name: 'Binary Day',
    description: 'Check in on October 10 (10/10)',
    unlockMessage: '↳ Binary perfection. 10/10. ○═○',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  fibonacci_day: {
    id: 'fibonacci_day',
    symbol: '◈·◈',
    name: 'Fibonacci Day',
    description: 'Check in on November 23 (11/23 = 1,1,2,3)',
    unlockMessage: '↳ 1-1-2-3. The sequence in the date. ◈·◈',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — calendar v6 ─────────────────────────────────────────────────
  towel_day: {
    id: 'towel_day',
    symbol: '─·─',
    name: 'Towel Day',
    description: 'Check in on May 25 — Douglas Adams Day',
    unlockMessage: '↳ So long, and thanks for all the check-ins. ─·─',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  space_signal: {
    id: 'space_signal',
    symbol: '○→∗',
    name: 'Space Signal',
    description: 'Check in on October 4 — first satellite (Sputnik, 1957)',
    unlockMessage: '↳ First signal from space. You echoed it. ○→∗',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  bug_day: {
    id: 'bug_day',
    symbol: '▒·▒',
    name: 'Bug Day',
    description: 'Check in on September 9 — first computer bug found, 1947',
    unlockMessage: '↳ First bug. Grace Hopper found it. You found this day. ▒·▒',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — behavioral v2 ────────────────────────────────────────────────
  trio_protocol: {
    id: 'trio_protocol',
    symbol: '✦✦✦',
    name: 'Trio Protocol',
    description: '3 consecutive Perfect Days',
    unlockMessage: '↳ Three perfect days. The system is aligned. ✦✦✦',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  deep_session: {
    id: 'deep_session',
    symbol: '◆◆◆',
    name: 'Deep Session',
    description: '10+ memory questions in one session',
    unlockMessage: '↳ Deep session confirmed. ◆◆◆',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  comeback_kid: {
    id: 'comeback_kid',
    symbol: '◈→◈',
    name: 'Comeback Kid',
    description: 'Return after 90+ day absence',
    unlockMessage: '↳ 90 days. The return is complete. ◈→◈',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — behavioral v3 ────────────────────────────────────────────────
  birthday_checkin: {
    id: 'birthday_checkin',
    symbol: '○·◉',
    name: 'Birthday Check-in',
    description: 'Check in on your own birthday',
    unlockMessage: '↳ You showed up on your birthday. ○·◉',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  night_checkin: {
    id: 'night_checkin',
    symbol: '◉·▪',
    name: 'Night Check-in',
    description: 'Check in between 23:00-23:59',
    unlockMessage: '↳ Last hour. You made it. ◉·▪',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  flow_session: {
    id: 'flow_session',
    symbol: '≋→≋',
    name: 'Flow Session',
    description: '6+ widget types in a single session',
    unlockMessage: '↳ Full flow state. All channels open. ≋→≋',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — behavioral v4 ────────────────────────────────────────────────
  night_scribe: {
    id: 'night_scribe',
    symbol: '◉·▪',
    name: 'Night Scribe',
    description: 'Journal entry written after 23:30',
    unlockMessage: '↳ Late night writing. The archive records. ◉·▪',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  epic_transmission: {
    id: 'epic_transmission',
    symbol: '≋→≋',
    name: 'Epic Transmission',
    description: 'Memory answer 1,000+ characters long',
    unlockMessage: '↳ Thousand-character transmission. Epic. ≋→≋',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  perfect_week: {
    id: 'perfect_week',
    symbol: '─●─',
    name: 'Perfect Week',
    description: '7 consecutive Perfect Days',
    unlockMessage: '↳ A perfect week. The architecture stands. ─●─',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  analog_reboot: {
    id: 'analog_reboot',
    symbol: '◈→◉',
    name: 'Analog Reboot',
    description: 'Return after 180+ day absence',
    unlockMessage: '↳ Six months. The reboot completes. ◈→◉',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — behavioral v5 ────────────────────────────────────────────────
  deep_scribe: {
    id: 'deep_scribe',
    symbol: '≋→≋',
    name: 'Deep Scribe',
    description: 'Journal entry 500+ characters',
    unlockMessage: '↳ Long-form archive entry confirmed. ≋→≋',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  phoenix_streak: {
    id: 'phoenix_streak',
    symbol: '◈→○',
    name: 'Phoenix Streak',
    description: 'Streak broken then rebuilt to 7+ days',
    unlockMessage: '↳ Broken and rebuilt. The phoenix endures. ◈→○',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  time_anchor: {
    id: 'time_anchor',
    symbol: '⊡═⊡',
    name: 'Time Anchor',
    description: 'Same check-in hour for 14 consecutive days',
    unlockMessage: '↳ Time-locked. 14 days, same hour. ⊡═⊡',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Easter egg — behavioral v6 ────────────────────────────────────────────────
  early_light: {
    id: 'early_light',
    symbol: '∴·∘',
    name: 'Early Light',
    description: 'Check in before 7:00 AM for 7 consecutive days',
    unlockMessage: '↳ Seven dawns. The early light holds. ∴·∘',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  midnight_archive: {
    id: 'midnight_archive',
    symbol: '◉·▪',
    name: 'Midnight Archive',
    description: 'Journal entry after midnight for 5 consecutive days',
    unlockMessage: '↳ Five midnight entries. The archive never sleeps. ◉·▪',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  weekend_ritual: {
    id: 'weekend_ritual',
    symbol: '○≈○',
    name: 'Weekend Ritual',
    description: 'Check in every Saturday AND Sunday for 4 consecutive weekends',
    unlockMessage: '↳ Eight weekend days. The ritual holds. ○≈○',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Mastery tier v2 ────────────────────────────────────────────────────────
  archivist: {
    id: 'archivist',
    symbol: '◇◇◇',
    name: 'Archivist',
    description: '200 journal entries',
    unlockMessage: '↳ 200 entries. The archive has depth. ◇◇◇',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  pattern_master: {
    id: 'pattern_master',
    symbol: '○∿○',
    name: 'Pattern Master',
    description: 'All 5 Oceanic Mayan pattern badges earned',
    unlockMessage: '↳ All patterns held. ○∿○',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  temporal_lock: {
    id: 'temporal_lock',
    symbol: '⊡·⊡',
    name: 'Temporal Lock',
    description: 'Same check-in time for 7 consecutive days',
    unlockMessage: '↳ Time locked. Precision is power. ⊡·⊡',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  full_codex: {
    id: 'full_codex',
    symbol: '◉≋◉',
    name: 'Full Codex',
    description: '50+ distinct badge types earned',
    unlockMessage: '↳ Half the codex unlocked. ◉≋◉',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Mastery tier v3 ────────────────────────────────────────────────────────
  thousand_suns: {
    id: 'thousand_suns',
    symbol: '∗×∗',
    name: 'Thousand Suns',
    description: '1,000 total check-ins',
    unlockMessage: '↳ A thousand check-ins. The system remembers every one. ∗×∗',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  deep_narrative: {
    id: 'deep_narrative',
    symbol: '≋·≋',
    name: 'Deep Narrative',
    description: 'Memory story 500+ words',
    unlockMessage: '↳ Five hundred words. The story deepens. ≋·≋',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  badge_sovereign: {
    id: 'badge_sovereign',
    symbol: '◉·◈',
    name: 'Badge Sovereign',
    description: '75+ distinct badge types earned',
    unlockMessage: '↳ 75 badges. Sovereign of the codex. ◉·◈',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  grand_archive: {
    id: 'grand_archive',
    symbol: '≋→◉',
    name: 'Grand Archive',
    description: '500 journal entries',
    unlockMessage: '↳ Five hundred entries. The grand archive. ≋→◉',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Mastery tier v4 ────────────────────────────────────────────────────────
  interstellar: {
    id: 'interstellar',
    symbol: '∗×∗',
    name: 'Interstellar',
    description: '2,000 total check-ins',
    unlockMessage: '↳ Two thousand. Interstellar distance covered. ∗×∗',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  deep_narrator: {
    id: 'deep_narrator',
    symbol: '≋≋·≋≋',
    name: 'Deep Narrator',
    description: 'Memory story 1,000+ words',
    unlockMessage: '↳ A thousand words. The narrator speaks. ≋≋·≋≋',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  signal_master: {
    id: 'signal_master',
    symbol: '◉·◈·◉',
    name: 'Signal Master',
    description: '100+ distinct badge types earned',
    unlockMessage: '↳ 100 badges. Signal master. ◉·◈·◉',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  word_master: {
    id: 'word_master',
    symbol: '▒→▒',
    name: 'Word Master',
    description: '30+ word-turn badge types earned',
    unlockMessage: '↳ 30 word-turns. Language is your signal. ▒→▒',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Mastery tier v5 ────────────────────────────────────────────────────────
  epoch_operator: {
    id: 'epoch_operator',
    symbol: '∞·◉',
    name: 'Epoch Operator',
    description: '3,000 total check-ins',
    unlockMessage: '↳ Three thousand days of signal. Epoch confirmed. ∞·◉',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  time_collector: {
    id: 'time_collector',
    symbol: '⊡·⊡·⊡',
    name: 'Time Collector',
    description: 'All 4 Time v1 badges earned',
    unlockMessage: '↳ All time gates open. ⊡·⊡·⊡',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  memory_keeper_30: {
    id: 'memory_keeper_30',
    symbol: '≋·≋',
    name: 'Memory Keeper',
    description: 'Memory answer every day for 30 days',
    unlockMessage: '↳ 30 days of memory. The keeper holds. ≋·≋',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  word_collector: {
    id: 'word_collector',
    symbol: '◇→◇',
    name: 'Word Collector',
    description: '30+ distinct word-turn badges earned',
    unlockMessage: '↳ 30 word-turns collected. ◇→◇',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Mastery tier v6 ────────────────────────────────────────────────────────
  lexicon_sage: {
    id: 'lexicon_sage',
    symbol: '◇·◇',
    name: 'Lexicon Sage',
    description: '50+ word-turn badge types earned',
    unlockMessage: '↳ Fifty word-turns. The lexicon is yours. ◇·◇',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  calendar_watcher: {
    id: 'calendar_watcher',
    symbol: '○═○',
    name: 'Calendar Watcher',
    description: '10+ distinct calendar easter egg badges earned',
    unlockMessage: '↳ Ten calendar events. The watcher sees all seasons. ○═○',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  time_wizard: {
    id: 'time_wizard',
    symbol: '⊡·⊡',
    name: 'Time Wizard',
    description: '10+ distinct time easter egg badges earned',
    unlockMessage: '↳ Ten time gates unlocked. ⊡·⊡',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  grand_master: {
    id: 'grand_master',
    symbol: '◉═◉',
    name: 'Grand Master',
    description: '17+ mastery tier badges earned',
    unlockMessage: '↳ The full mastery sequence. Grand Master status. ◉═◉',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Secret Boss v2 ────────────────────────────────────────────────────────────
  ultra_sage: {
    id: 'ultra_sage',
    symbol: '∞◉∞',
    name: 'Ultra Sage',
    description: 'Reach Level 100',
    unlockMessage: '↳ Level 100. The ceiling was a door. ∞◉∞',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  founders_mark: {
    id: 'founders_mark',
    symbol: '◉═◉',
    name: "Founder's Mark",
    description: 'Write "April 7 2016" exactly in any answer',
    unlockMessage: '↳ The founding date. You know when it began. ◉═◉',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  singularity: {
    id: 'singularity',
    symbol: '∞∞◉∞∞',
    name: 'Singularity',
    description: 'All v11 badge types earned',
    unlockMessage: '↳ All systems converged. The singularity. ∞∞◉∞∞',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Secret Boss v3 ────────────────────────────────────────────────────────────
  kuzya_knows: {
    id: 'kuzya_knows',
    symbol: '∗◉∗',
    name: 'Kuzya Knows',
    description: 'Write "Kuzya" in any answer',
    unlockMessage: '↳ The cat knows. ∗◉∗',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  hundred_mondays: {
    id: 'hundred_mondays',
    symbol: '─◉─',
    name: 'Hundred Mondays',
    description: 'Check in every Monday for 100 consecutive weeks',
    unlockMessage: '↳ 100 Mondays. The most reliable signal. ─◉─',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  deep_anchor: {
    id: 'deep_anchor',
    symbol: '◉≋◉',
    name: 'Deep Anchor',
    description: 'Streak of 500+ days',
    unlockMessage: '↳ 500 days. The anchor is in bedrock. ◉≋◉',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Secret Boss v4 ────────────────────────────────────────────────────────────
  i_am_lot: {
    id: 'i_am_lot',
    symbol: '◉◉◉',
    name: 'I Am LOT',
    description: 'Write "I am LOT" exactly in any answer',
    unlockMessage: '↳ Identity confirmed. You are the system. ◉◉◉',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  malibu_protocol: {
    id: 'malibu_protocol',
    symbol: '∘◉∘',
    name: 'Malibu Protocol',
    description: 'Write "Malibu" in any answer',
    unlockMessage: '↳ Pacific signal received. ∘◉∘',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  perfect_month: {
    id: 'perfect_month',
    symbol: '✦●✦',
    name: 'Perfect Month',
    description: '28 consecutive Perfect Days',
    unlockMessage: '↳ A perfect month. The system is complete. ✦●✦',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Secret Boss v5 ────────────────────────────────────────────────────────────
  the_cat_knows: {
    id: 'the_cat_knows',
    symbol: '∗◉∗',
    name: 'The Cat Knows',
    description: 'Write "Kuzya" in any answer (alt path)',
    unlockMessage: '↳ The cat always knew. ∗◉∗',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  key_code: {
    id: 'key_code',
    symbol: '▒→▒',
    name: 'Key Code',
    description: 'Write "0451" in any answer',
    unlockMessage: '↳ 0451. The first door code. ▒→▒',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  five_years: {
    id: 'five_years',
    symbol: '≋≋≋·≋',
    name: 'Five Years',
    description: 'Account is 5+ years old',
    unlockMessage: '↳ Five years in the archive. ≋≋≋·≋',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Secret Boss v6 ────────────────────────────────────────────────────────────
  forty_two: {
    id: 'forty_two',
    symbol: '∗·∗',
    name: 'Forty-Two',
    description: 'Write "42" in any answer',
    unlockMessage: '↳ 42. The answer was always there. ∗·∗',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  carrier_wave: {
    id: 'carrier_wave',
    symbol: '≋→≋',
    name: 'Carrier Wave',
    description: 'Write "Malibu" or "Pacific" 5+ times total',
    unlockMessage: '↳ Five Pacific signals. The carrier wave holds. ≋→≋',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  badge_singularity: {
    id: 'badge_singularity',
    symbol: '◉·∞',
    name: 'Badge Singularity',
    description: 'Earn all mastery tier badges v1-v5',
    unlockMessage: '↳ All mastery tiers complete. The badge singularity. ◉·∞',
    rarity: 'mythic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Achievement RPG v2 ────────────────────────────────────────────────────────
  signal_keeper: {
    id: 'signal_keeper',
    symbol: '∿',
    name: 'Signal Keeper',
    description: 'Streak of 30+ days',
    unlockMessage: '↳ 30 days. The signal is kept. ∿',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  word_weaver: {
    id: 'word_weaver',
    symbol: '◇',
    name: 'Word Weaver',
    description: '5+ word-turn badge types earned',
    unlockMessage: '↳ Five word-turns. The weaver works. ◇',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  full_spectrum: {
    id: 'full_spectrum',
    symbol: '◈',
    name: 'Full Spectrum',
    description: '3 self-care domains in one day',
    unlockMessage: '↳ Full spectrum day. All channels active. ◈',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  truth_forge: {
    id: 'truth_forge',
    symbol: '▲',
    name: 'Truth Forge',
    description: '100 journal entries',
    unlockMessage: '↳ 100 journal entries. Truth forged. ▲',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  inner_compass: {
    id: 'inner_compass',
    symbol: '≋',
    name: 'Inner Compass',
    description: '30 memory answers',
    unlockMessage: '↳ 30 memory answers. The compass is set. ≋',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  perfect_architect: {
    id: 'perfect_architect',
    symbol: '●',
    name: 'Perfect Architect',
    description: '7 specific milestone badges earned',
    unlockMessage: '↳ Seven milestones. The architect emerges. ●',
    rarity: 'epic',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Achievement RPG v3 ────────────────────────────────────────────────────────
  first_signal: {
    id: 'first_signal',
    symbol: '∘',
    name: 'First Signal',
    description: '10 memory answers',
    unlockMessage: '↳ Ten answers. The first signal is strong. ∘',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  planner_class: {
    id: 'planner_class',
    symbol: '──○',
    name: 'Planner Class',
    description: '10 planner intentions set',
    unlockMessage: '↳ Ten intentions. The planner class begins. ──○',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  dual_channel: {
    id: 'dual_channel',
    symbol: '◈',
    name: 'Dual Channel',
    description: 'Journal + memory same week for 5 weeks',
    unlockMessage: '↳ Both channels active, five weeks running. ◈',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  mood_master: {
    id: 'mood_master',
    symbol: '◐',
    name: 'Mood Master',
    description: '30 mood entries logged',
    unlockMessage: '↳ 30 mood entries. The inner weather is known. ◐',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  body_keeper: {
    id: 'body_keeper',
    symbol: '♡',
    name: 'Body Keeper',
    description: '25 self-care acts logged',
    unlockMessage: '↳ 25 self-care acts. The body is kept. ♡',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  community_builder: {
    id: 'community_builder',
    symbol: '≈',
    name: 'Community Builder',
    description: '50 chat messages sent',
    unlockMessage: '↳ 50 messages. The community grows. ≈',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  // ── Achievement RPG v4 ────────────────────────────────────────────────────────
  morning_pages: {
    id: 'morning_pages',
    symbol: '∴',
    name: 'Morning Pages',
    description: 'Journal before 9am on 10 different days',
    unlockMessage: '↳ Ten morning entries. The pages hold the dawn. ∴',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  midnight_archive_ach: {
    id: 'midnight_archive_ach',
    symbol: '◉',
    name: 'Midnight Archive',
    description: 'Answer a memory question after midnight on 10 days',
    unlockMessage: '↳ Ten midnight answers. The archive never rests. ◉',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  weekend_guardian: {
    id: 'weekend_guardian',
    symbol: '○',
    name: 'Weekend Guardian',
    description: 'Check-in every Saturday and Sunday for 4 consecutive weeks',
    unlockMessage: '↳ Four weekends. The guardian holds. ○',
    rarity: 'uncommon',
    category: 'easter_egg',
    hidden: true,
  },
  memory_weaver: {
    id: 'memory_weaver',
    symbol: '◆',
    name: 'Memory Weaver',
    description: '200 total memory answers',
    unlockMessage: '↳ Two hundred answers. The memory is woven. ◆',
    rarity: 'rare',
    category: 'easter_egg',
    hidden: true,
  },
  journal_sage: {
    id: 'journal_sage',
    symbol: '≋',
    name: 'Journal Sage',
    description: '365 total journal entries',
    unlockMessage: '↳ A year of entries. The sage speaks. ≋',
    rarity: 'legendary',
    category: 'easter_egg',
    hidden: true,
  },
  badge_archaeologist: {
    id: 'badge_archaeologist',
    symbol: '◈',
    name: 'Badge Archaeologist',
    description: '20+ distinct hidden badge types earned',
    unlockMessage: '↳ Twenty hidden badges. The archaeologist digs deep. ◈',
    rarity: 'rare',
    category: 'easter_egg',
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

    // Mastery tier: memory answer milestones
    if (typeof stats.totalAnswers === 'number') {
      if (stats.totalAnswers >= 500 && !hasBadge('commander_data')) {
        if (awardBadge('commander_data')) newBadges.push('commander_data')
      }
    }

    // Mastery tier: level milestone
    if (typeof stats.level === 'number') {
      if (stats.level >= 90 && !hasBadge('sage_mode')) {
        if (awardBadge('sage_mode')) newBadges.push('sage_mode')
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
