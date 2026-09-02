/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Calendar Ops — time tracking + ops-log notifications for the Calendar widget.
 *
 * A single active timer, persisted to localStorage so it survives reloads
 * and tab switches (the widget can be closed while a timer keeps running).
 * Every state transition (engage / secure) emits a terse ops-log event that
 * CalendarOpsToast renders as a military-grade notification.
 */

import { atom } from 'nanostores'

export type EntryType = 'note' | 'task' | 'call'

export type CalendarTimerState = {
  entryId: string
  date: string
  text: string
  entryType: EntryType
  startedAt: number
} | null

export type CalendarOpsEvent = {
  code: string
  message: string
  ts: number
} | null

const TIMER_STORAGE_KEY = 'lot_calendar_active_timer'

function readStoredTimer(): CalendarTimerState {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(TIMER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed.entryId === 'string' &&
      typeof parsed.date === 'string' &&
      typeof parsed.text === 'string' &&
      typeof parsed.entryType === 'string' &&
      typeof parsed.startedAt === 'number'
    ) {
      return parsed as CalendarTimerState
    }
    return null
  } catch {
    return null
  }
}

function persistTimer(state: CalendarTimerState) {
  if (typeof window === 'undefined') return
  try {
    if (state) {
      window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state))
    } else {
      window.localStorage.removeItem(TIMER_STORAGE_KEY)
    }
  } catch {
    // Storage unavailable (private mode, quota) — timer stays in-memory only.
  }
}

export const $calendarTimer = atom<CalendarTimerState>(readStoredTimer())
export const $calendarOpsEvent = atom<CalendarOpsEvent>(null)

export function emitCalendarOpsEvent(code: string, message: string) {
  $calendarOpsEvent.set({ code, message, ts: Date.now() })
}

/**
 * Engage the timer for one entry. Auto-secures any timer already running
 * for a different entry first so only one clock is ever live — the caller
 * (CalendarWidget) is responsible for logging that prior segment.
 */
export function startCalendarTimer(entry: { entryId: string; date: string; text: string; entryType: EntryType }) {
  $calendarTimer.set({ ...entry, startedAt: Date.now() })
  persistTimer($calendarTimer.get())
}

export function clearCalendarTimer() {
  $calendarTimer.set(null)
  persistTimer(null)
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}
