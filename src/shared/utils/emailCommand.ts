/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT Email — command parsing
 *
 * The simplest possible mail composer: type "/email to <name>" anywhere in
 * a Log entry and the rest of the entry becomes the message body. Pure
 * function, no stores, no DOM — shared between client (live preview) and
 * server (actual send on save).
 */

export type ParsedEmailCommand = {
  recipientQuery: string
  body: string
}

// Recipient is a single token (first name or username) — the simplest
// viable reference, no multi-word name support. An optional trailing
// '.', ',' or '!' right after the name is punctuation, not part of it.
const EMAIL_COMMAND_REGEX =
  /(^|\s)\/email\s+to\s+([A-Za-z][\w'-]{0,63})[.,!]?(?=\s|$)/i

export function parseEmailCommand(text: string | null | undefined): ParsedEmailCommand | null {
  if (!text) return null
  const match = text.match(EMAIL_COMMAND_REGEX)
  if (!match || match.index === undefined) return null

  const recipientQuery = match[2]
  const body = (text.slice(0, match.index) + text.slice(match.index + match[0].length)).trim()

  return { recipientQuery, body }
}
