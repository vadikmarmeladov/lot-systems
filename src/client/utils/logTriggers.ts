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
  // Shown by /system as the command's help line. Omitted for triggers that
  // are reactive/emoji-only rather than typed commands (e.g. cohort-support),
  // so they don't clutter the help screen with something the operator can't type.
  description?: string
  // Argument hint appended after the command in the help line, e.g. '[query]'.
  usage?: string
}

const RULES: TriggerRule[] = [
  { trigger: 'toggle-synth',   emojis: ['🎹'],    keywords: ['synth', 'keyboard'], description: 'Toggle keyboard sound' },
  { trigger: 'ai-scan',        emojis: [],       keywords: ['scan', 'ai'], description: 'System status overview' },
  { trigger: 'silent-mode',    emojis: [],       keywords: ['silent', 'quiet'], description: 'Signal silence check' },
  { trigger: 'breathe',        emojis: [],       keywords: ['breathe', 'breath'], description: '4-2-6 breathing exercise' },
  { trigger: 'force-fast',     emojis: [],       keywords: ['fast'], description: 'Orthodox fasting calendar' },
  { trigger: 'radio-toggle',   emojis: ['🎧'],    keywords: ['radio'], description: 'Toggle radio' },
  { trigger: 'night-mode',     emojis: ['🌙'],    keywords: ['night'], description: 'Dark mode' },
  { trigger: 'prayer-mode',    emojis: ['🕯️', '🕯'], keywords: ['prayer', 'candle'], description: 'Generate contextual scripture' },
  { trigger: 'freeze-widgets', emojis: ['🧊'],    keywords: ['freeze', 'pause'], description: 'Pause and reflect protocol' },
  { trigger: 'cohort-support', emojis: ['❗', '‼️', '‼'], keywords: [] },
  { trigger: 'qos-report',     emojis: [],        keywords: ['qos', 'os-report'], description: 'Quantum OS state analysis' },
  { trigger: 'assembly-check', emojis: [],        keywords: ['assembly', 'assemble'], description: 'Self-assembly module status' },
  { trigger: 'phys-report',    emojis: [],        keywords: ['phys', 'cohort-report'], description: 'Physiological cohort report' },
  { trigger: 'sil-check',      emojis: [],        keywords: ['sil', 'silence-check'], description: 'Signal silence pattern check' },
  { trigger: 'qi-rfi',         emojis: [],        keywords: ['qi'], description: 'Ask the Quantum Intelligence engine', usage: '[query]' },
  { trigger: 'system-help',    emojis: [],        keywords: ['system', 'commands'], description: 'This help screen' },
  { trigger: 'story-mode',     emojis: ['📖'],    keywords: ['story'], description: 'Compress recent data into a personal story', usage: '[day|week|month|year]' },
  { trigger: 'how-checkin',    emojis: [],        keywords: ['how'], description: 'Open LOT AI check-in (System tab)' },
]

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
 * Every typed slash command, derived straight from RULES — this is what
 * /system renders. Reactive/emoji-only triggers (no keywords, e.g.
 * cohort-support) are excluded since the operator can't type them anyway.
 * Deriving from RULES instead of hand-maintaining a second list is what
 * keeps /system from drifting out of sync with what actually fires
 * (a hand-written copy previously omitted /sil for this exact reason).
 */
export function listCommands(): { command: string; usage?: string; description: string }[] {
  return RULES
    .filter((r): r is TriggerRule & { description: string } => !!r.description && r.keywords.length > 0)
    .map(r => ({ command: `/${r.keywords[0]}`, usage: r.usage, description: r.description }))
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
