/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import { Log } from '#shared/types'

export type CalendarEntryType = 'note' | 'task' | 'call'

export type CalendarEntry = {
  id: string
  date: string
  time: string | null
  text: string
  type: CalendarEntryType
  done: boolean
  trackingStartedAt: string | null
  totalTrackedMinutes: number
}

/** Derives calendar entries from the raw log stream. Shared by the widget and its notifications. */
export function parseCalendarEntries(logs: Log[]): CalendarEntry[] {
  return logs
    .filter(log => log.event === 'calendar_entry' && log.metadata && !log.metadata.deleted)
    .map(log => ({
      id: log.id,
      date: log.metadata?.date as string,
      time: (log.metadata?.time as string) || null,
      text: (log.metadata?.text as string) || log.text || '',
      type: (log.metadata?.entryType as CalendarEntryType) || 'note',
      done: Boolean(log.metadata?.done),
      trackingStartedAt: (log.metadata?.trackingStartedAt as string) || null,
      totalTrackedMinutes: Number(log.metadata?.totalTrackedMinutes) || 0,
    }))
    .filter(e => e.date && e.text)
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
}

/** True once an entry's date+time has passed and it isn't marked done. */
export function isOverdue(entry: CalendarEntry, now: Dayjs): boolean {
  if (entry.done) return false
  const due = entry.time ? dayjs(`${entry.date}T${entry.time}`) : dayjs(entry.date).endOf('day')
  return due.isBefore(now)
}

/** True once an entry is due within the next `windowMinutes`, not yet overdue. */
export function isDueSoon(entry: CalendarEntry, now: Dayjs, windowMinutes = 15): boolean {
  if (entry.done || !entry.time) return false
  const due = dayjs(`${entry.date}T${entry.time}`)
  const diff = due.diff(now, 'minute')
  return diff >= 0 && diff <= windowMinutes
}

export function formatTrackedMinutes(totalMinutes: number): string {
  const m = Math.max(0, Math.round(totalMinutes))
  const h = Math.floor(m / 60)
  const mm = m % 60
  return h > 0 ? `${h}h ${mm}m` : `${mm}m`
}

export function formatElapsed(startedAt: string, now: Dayjs): string {
  const seconds = Math.max(0, now.diff(dayjs(startedAt), 'second'))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}
