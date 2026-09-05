/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import { atom } from 'nanostores'

export type CalendarNotification = {
  id: string
  code: string
  title: string
  lines: string[]
}

export const $calendarNotification = atom<CalendarNotification | null>(null)

export function pushCalendarNotification(n: Omit<CalendarNotification, 'id'>) {
  $calendarNotification.set({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, ...n })
}
