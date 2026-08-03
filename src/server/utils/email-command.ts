/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT Email — "/email to <Name>" Log command.
 *
 * The command may appear anywhere in a Log entry. Everything else in the
 * entry (with the command substring removed) is the mail body — so a log
 * that is nothing but "/email to Hitomi." sends an empty-body ping, and a
 * longer journal entry with the command tucked in sends the rest of the
 * entry as the message. Pure/DOM-free so the route handler and any future
 * client-side reuse share one detector, mirroring logTriggers.ts on the
 * client.
 */

const EMAIL_COMMAND_RE = /\/email\s+to\s+([A-Za-z][A-Za-z'-]*)[.,!]?/i

export type ParsedEmailCommand = {
  /** Name token as typed after "to", e.g. "Hitomi". */
  name: string
  /** Log text with the command substring removed and whitespace trimmed. */
  body: string
  /** The exact substring matched, for building the replacement marker. */
  matchedText: string
}

export function parseEmailCommand(text: string): ParsedEmailCommand | null {
  if (!text) return null
  const match = text.match(EMAIL_COMMAND_RE)
  if (!match) return null

  const name = match[1]
  const body = (text.slice(0, match.index) + text.slice((match.index || 0) + match[0].length))
    .replace(/\s+/g, ' ')
    .trim()

  return { name, body, matchedText: match[0] }
}
