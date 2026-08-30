/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { atom } from 'nanostores'

export type CalendarAlertKind = 'due' | 'logged'

export type CalendarAlert = {
  id: string
  kind: CalendarAlertKind
  label: string
  title: string
  detail?: string
}

export const $calendarAlertQueue = atom<CalendarAlert[]>([])

export function pushCalendarAlert(alert: Omit<CalendarAlert, 'id'>) {
  const withId: CalendarAlert = {
    ...alert,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }
  $calendarAlertQueue.set([...$calendarAlertQueue.get(), withId])
}

export function shiftCalendarAlert() {
  const [, ...rest] = $calendarAlertQueue.get()
  $calendarAlertQueue.set(rest)
}
