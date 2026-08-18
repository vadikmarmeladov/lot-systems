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
  | 'silent-mode'       // /silent  (also /sil — merged alias, see RULES)
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
  | 'qi-rfi'            // /qi — Quantum Intelligence RFI (Request for Information)
  | 'system-help'       // /system — list all available slash commands
  | 'story-mode'        // /story — generate contextual story from recent data
  | 'how-checkin'       // /how — open LOT AI check-in (navigates to System tab)

interface TriggerRule {
  trigger: LogTrigger
  emojis: string[]
  keywords: string[] // lower-case slash commands (without leading slash)
  /**
   * One-line description shown on the /system help screen. Every trigger
   * that exposes at least one slash keyword MUST carry a `help` string —
   * `getSystemHelpLines()` is generated from this table so the help
   * screen can never drift out of sync with what the triggers actually do
   * (previously `/system`'s text was a hand-maintained duplicate list and
   * had silently fallen out of sync: /sil was documented nowhere and had
   * no handler at all). Triggers with no `help` (e.g. the emoji-only
   * cohort-support signal) are simply omitted from the help screen.
   */
  help?: string
  /** Optional argument hint appended after the command, e.g. '[query]'. */
  args?: string
}

const RULES: TriggerRule[] = [
  { trigger: 'toggle-synth',   emojis: ['🎹'],    keywords: ['synth', 'keyboard'], help: 'Toggle keyboard sound' },
  { trigger: 'ai-scan',        emojis: [],       keywords: ['scan', 'ai'], help: 'System status overview' },
  { trigger: 'silent-mode',    emojis: [],       keywords: ['silent', 'quiet', 'sil', 'silence-check'], help: 'Signal silence check' },
  { trigger: 'breathe',        emojis: [],       keywords: ['breathe', 'breath'], help: '4-2-6 breathing exercise' },
  { trigger: 'force-fast',     emojis: [],       keywords: ['fast'], help: 'Orthodox fasting calendar' },
  { trigger: 'radio-toggle',   emojis: ['🎧'],    keywords: ['radio'], help: 'Toggle radio' },
  { trigger: 'night-mode',     emojis: ['🌙'],    keywords: ['night'], help: 'Dark mode' },
  { trigger: 'prayer-mode',    emojis: ['🕯️', '🕯'], keywords: ['prayer', 'candle'], help: 'Generate contextual scripture' },
  { trigger: 'freeze-widgets', emojis: ['🧊'],    keywords: ['freeze', 'pause'], help: 'Pause and reflect protocol' },
  { trigger: 'cohort-support', emojis: ['❗', '‼️', '‼'], keywords: [] },
  { trigger: 'qos-report',     emojis: [],        keywords: ['qos', 'os-report'], help: 'Quantum OS state analysis' },
  { trigger: 'assembly-check', emojis: [],        keywords: ['assembly', 'assemble'], help: 'Self-assembly module status' },
  { trigger: 'phys-report',    emojis: [],        keywords: ['phys', 'cohort-report'], help: 'Physiological cohort report' },
  { trigger: 'qi-rfi',         emojis: [],        keywords: ['qi'], help: 'Ask the Quantum Intelligence engine', args: '[query]' },
  { trigger: 'system-help',    emojis: [],        keywords: ['system', 'commands'], help: 'This help screen' },
  { trigger: 'story-mode',     emojis: ['📖'],    keywords: ['story'], help: 'Generate a personal story from recent data' },
  { trigger: 'how-checkin',    emojis: [],        keywords: ['how'], help: 'Open LOT AI check-in (System tab)' },
]

const HELP_COLUMN_WIDTH = 14

/**
 * Builds the full /system help screen text as an array of lines, derived
 * directly from RULES — the same table that drives trigger detection. This
 * is the single source of truth for "what commands exist" so the help
 * screen and the actual matching logic can never disagree.
 */
export function getSystemHelpLines(): string[] {
  const commandLines = RULES
    .filter(rule => rule.help && rule.keywords.length > 0)
    .map(rule => {
      const command = `/${rule.keywords[0]}${rule.args ? ` ${rule.args}` : ''}`
      return `${command.padEnd(HELP_COLUMN_WIDTH)}${rule.help}`
    })

  return [
    'AVAILABLE COMMANDS',
    '',
    ...commandLines,
    '',
    'SHORTCUTS',
    'Ctrl+Enter    Save log immediately',
  ]
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
