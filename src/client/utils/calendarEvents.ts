/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// Calendar Event Bus
//
// Decouples CalendarWidget (writer) from CalendarEventToast (display).
// Bracket-notation codes follow the existing Terminal Grid convention
// already used by Logs.tsx / SystemProgressWidget.tsx ("LABEL [CODE]:").

export type CalendarEventTone = 'ok' | 'due' | 'overdue'

export type CalendarEventDetail = {
  code: string
  message: string
  tone: CalendarEventTone
}

const EVENT_NAME = 'lot:calendar-event'

export function emitCalendarEvent(detail: CalendarEventDetail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<CalendarEventDetail>(EVENT_NAME, { detail }))
}

export function onCalendarEvent(handler: (detail: CalendarEventDetail) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const listener = (e: Event) => handler((e as CustomEvent<CalendarEventDetail>).detail)
  window.addEventListener(EVENT_NAME, listener)
  return () => window.removeEventListener(EVENT_NAME, listener)
}

// Session-scoped dedupe so a due/overdue reminder fires once per entry per
// calendar day rather than on every mount or re-open of the widget.
const SEEN_KEY = 'lot_calendar_reminders_seen'

function readSeen(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(SEEN_KEY) || '{}')
  } catch (_) {
    return {}
  }
}

export function hasSeenReminder(entryKey: string, today: string): boolean {
  return readSeen()[entryKey] === today
}

export function markReminderSeen(entryKey: string, today: string) {
  try {
    const seen = readSeen()
    seen[entryKey] = today
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen))
  } catch (_) {}
}
