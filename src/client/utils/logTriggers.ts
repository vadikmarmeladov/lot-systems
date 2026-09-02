/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Log-text triggers
 *
 * Pure detectors for secret codes, keywords and emojis that the user
 * can sneak into a log entry to toggle System modes. Keeping this
 * module pure (no stores, no DOM) so tests and non-Log surfaces can
 * reuse it. Wiring into the actual stores happens at the call site.
 *
 * Design rules:
 *  - Detectors are case-insensitive for keywords, exact for emojis.
 *  - Each detector must be idempotent — returning `true` does not
 *    mean the trigger fires twice if the user edits around it; the
 *    call site is responsible for debouncing via "last seen" refs.
 *  - Triggers are additive: a single log can contain several.
 */

export type LogTrigger =
  | 'toggle-synth'      // 🎹  or  /synth
  | 'ai-scan'           // /scan
  | 'silent-mode'       // /silent
  | 'breathe'           // /breathe
  | 'force-fast'        // /fast
  | 'radio-toggle'      // 🎧  or  /radio
  | 'night-mode'        // 🌙  or  /night
  | 'prayer-mode'       // 🕯️  or  /prayer
  | 'freeze-widgets'    // 🧊  or  /freeze
  | 'cohort-support'    // ❗  (heavy exclamation, distinct from regular '!')
  | 'qos-report'        // /qos — surface Quantum OS state in current log session
  | 'assembly-check'    // /assembly — trigger self-assembly module status check
  | 'phys-report'       // /phys — generate physiological cohort report
  | 'sil-check'         // /sil — check for signal silence pattern
  | 'qi-rfi'            // /qi — Quantum Intelligence RFI (Request for Information)
  | 'system-help'       // /system — list all available slash commands
  | 'story-mode'        // /story — generate contextual story from recent data
  | 'how-checkin'       // /how — open LOT AI check-in (navigates to System tab)

interface TriggerRule {
  trigger: LogTrigger
  emojis: string[]
  keywords: string[] // lower-case slash commands (without leading slash)
  // Single source of truth for /system output — the command signature
  // (as typed) and a one-line description. A rule with no `command` is
  // invisible to the operator (e.g. the ❗ cohort-support signal) and is
  // omitted from the help screen on purpose.
  command?: string
  describe?: string
}

const RULES: TriggerRule[] = [
  { trigger: 'toggle-synth',   emojis: ['🎹'],    keywords: ['synth', 'keyboard'], command: '/synth', describe: 'Toggle keyboard sound' },
  { trigger: 'ai-scan',        emojis: [],       keywords: ['scan', 'ai'], command: '/scan', describe: 'System status overview' },
  { trigger: 'silent-mode',    emojis: [],       keywords: ['silent', 'quiet'], command: '/silent', describe: 'Signal silence check' },
  { trigger: 'breathe',        emojis: [],       keywords: ['breathe', 'breath'], command: '/breathe', describe: '4-2-6 breathing exercise' },
  { trigger: 'force-fast',     emojis: [],       keywords: ['fast'], command: '/fast', describe: 'Orthodox fasting calendar' },
  { trigger: 'radio-toggle',   emojis: ['🎧'],    keywords: ['radio'], command: '/radio', describe: 'Toggle radio' },
  { trigger: 'night-mode',     emojis: ['🌙'],    keywords: ['night'], command: '/night', describe: 'Dark mode' },
  { trigger: 'prayer-mode',    emojis: ['🕯️', '🕯'], keywords: ['prayer', 'candle'], command: '/prayer', describe: 'Generate contextual scripture' },
  { trigger: 'freeze-widgets', emojis: ['🧊'],    keywords: ['freeze', 'pause'], command: '/freeze', describe: 'Pause and reflect protocol' },
  { trigger: 'cohort-support', emojis: ['❗', '‼️', '‼'], keywords: [] },
  { trigger: 'qos-report',     emojis: [],        keywords: ['qos', 'os-report'], command: '/qos', describe: 'Quantum OS state analysis' },
  { trigger: 'assembly-check', emojis: [],        keywords: ['assembly', 'assemble'], command: '/assembly', describe: 'Self-assembly module status' },
  { trigger: 'phys-report',    emojis: [],        keywords: ['phys', 'cohort-report'], command: '/phys', describe: 'Physiological cohort report' },
  { trigger: 'sil-check',      emojis: [],        keywords: ['sil', 'silence-check'] },
  { trigger: 'qi-rfi',         emojis: [],        keywords: ['qi'], command: '/qi [query]', describe: 'Ask the Quantum Intelligence engine' },
  { trigger: 'system-help',    emojis: [],        keywords: ['system', 'commands'], command: '/system', describe: 'This help screen' },
  { trigger: 'story-mode',     emojis: ['📖'],    keywords: ['story'], command: '/story [day|week|month|year]', describe: 'Compress recent data into a personal story' },
  { trigger: 'how-checkin',    emojis: [],        keywords: ['how'], command: '/how', describe: 'Open LOT AI check-in (System tab)' },
]

/**
 * The compression window a /story invocation asks for. Bare `/story`
 * (or the 📖 emoji alone) defaults to 'day' — the finest grain the
 * Log already narrates. Longer windows ask the server to compress a
 * wider slice of the same signal stream into one story.
 */
export type StoryPeriod = 'day' | 'week' | 'month' | 'year'

const STORY_PERIOD_RE = /\/story\s+(day|week|month|year)\b/i

export function parseStoryPeriod(text: string): StoryPeriod {
  const match = text.match(STORY_PERIOD_RE)
  return (match ? match[1].toLowerCase() : 'day') as StoryPeriod
}

/**
 * Renders the operator-facing command list from `RULES` so /system can
 * never drift from what detectTriggers() actually recognizes — a rule
 * added here without a `describe` stays a hidden/easter-egg trigger.
 */
export function getSystemHelpLines(): string[] {
  return RULES.filter(r => r.command && r.describe).map(
    r => `${r.command!.padEnd(13)} ${r.describe}`
  )
}

/**
 * Returns every trigger present in `text`. An empty array means the
 * text is ordinary. Order reflects the order of `RULES`, not the
 * text — call sites that need "first occurrence" can scan manually.
 */
export function detectTriggers(text: string): LogTrigger[] {
  if (!text) return []
  const hits: LogTrigger[] = []
  const lower = text.toLowerCase()

  for (const rule of RULES) {
    // Emoji check — literal includes, no boundary. Emojis are already
    // atomic enough that a substring match is the correct behavior.
    const hasEmoji = rule.emojis.some(e => text.includes(e))

    // Keyword check — match "/word" as a whole token (followed by
    // end-of-string, whitespace, or non-word). This prevents "/scandalous"
    // from firing the /scan trigger.
    const hasKeyword = rule.keywords.some(k => {
      const re = new RegExp(`(^|\\s)\\/${k}(\\s|$|[^a-z0-9_])`, 'i')
      return re.test(lower)
    })

    if (hasEmoji || hasKeyword) hits.push(rule.trigger)
  }

  return hits
}

/**
 * Returns the *new* triggers that appeared in `text` compared to
 * `previousText`. The call site passes the prior value from a ref so
 * we only act on deltas — editing around an existing 🎹 will not
 * re-fire the toggle. This is the recommended entry point for the
 * NoteEditor effect.
 */
export function detectNewTriggers(
  text: string,
  previousText: string
): LogTrigger[] {
  const current = new Set(detectTriggers(text))
  const prior = new Set(detectTriggers(previousText))
  const fresh: LogTrigger[] = []
  current.forEach(t => { if (!prior.has(t)) fresh.push(t) })
  return fresh
}
