/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import type { Log } from '#shared/types'

export type CalendarEntryType = 'note' | 'task' | 'call'

export type CalendarEntry = {
  date: string
  time?: string
  text: string
  type: CalendarEntryType
  completed: boolean
}

export type CalendarEntryStatus = 'completed' | 'overdue' | 'due-soon' | 'scheduled'

/** Grace window (minutes) before a passed, uncompleted entry is flagged OVERDUE. */
export const OVERDUE_GRACE_MINUTES = 60

/** Window (minutes) before an entry's moment where it counts as DUE-SOON. */
export const DUE_SOON_MINUTES = 15

/**
 * Derive the calendar entry list from raw Log rows: `calendar_entry` events
 * carry the schedule, `calendar_entry_complete` events (keyed by date+text)
 * mark them done. Logs are the single source of truth — no separate store.
 */
export function getCalendarEntries(logs: Log[]): CalendarEntry[] {
  const completedKeys = new Set(
    logs
      .filter(l => l.event === 'calendar_entry_complete' && l.metadata)
      .map(l => `${l.metadata?.date}|${l.metadata?.text}`)
  )

  return logs
    .filter(l => l.event === 'calendar_entry' && l.metadata)
    .map(l => ({
      date: l.metadata?.date as string,
      time: (l.metadata?.time as string) || undefined,
      text: (l.metadata?.text as string) || l.text || '',
      type: (l.metadata?.entryType as CalendarEntryType) || 'note',
      completed: completedKeys.has(`${l.metadata?.date}|${l.metadata?.text}`),
    }))
    .filter(e => e.date && e.text)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
}

/** The precise instant an entry is due — end of day when no time was set. */
export function getEntryMoment(entry: { date: string; time?: string }): Dayjs {
  if (entry.time) {
    return dayjs(`${entry.date}T${entry.time}`)
  }
  return dayjs(entry.date).endOf('day')
}

export function getEntryStatus(
  entry: { date: string; time?: string; completed: boolean },
  now: Dayjs
): CalendarEntryStatus {
  if (entry.completed) return 'completed'
  const moment = getEntryMoment(entry)
  const diffMin = moment.diff(now, 'minute')
  if (diffMin < -OVERDUE_GRACE_MINUTES) return 'overdue'
  if (diffMin <= DUE_SOON_MINUTES) return 'due-soon'
  return 'scheduled'
}

/** T-2H15M ahead of the moment, or T+0H42M past it. */
export function formatCountdown(entry: { date: string; time?: string }, now: Dayjs): string {
  const moment = getEntryMoment(entry)
  const diffMin = moment.diff(now, 'minute')
  const abs = Math.abs(diffMin)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const label = `${h}H${String(m).padStart(2, '0')}M`
  return diffMin >= 0 ? `T-${label}` : `T+${label}`
}
