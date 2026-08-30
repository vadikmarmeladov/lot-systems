/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Calendar Event Toast
 *
 * Military-grade notification surface for the Calendar widget — fires once
 * per scheduled entry that falls due today, and once per completed time-
 * tracking session. Alerts are queued through the calendarAlerts store so
 * CalendarWidget can push a "logged" alert without this component knowing
 * about timers, and this component can push "due" alerts without
 * CalendarWidget knowing about the toast surface.
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import { isRouteActive } from '#client/stores/router'
import { $calendarAlertQueue, pushCalendarAlert, shiftCalendarAlert } from '#client/stores/calendarAlerts'

const SEEN_KEY = 'calendar_due_seen'
const DISMISS_MS = 6500

function loadSeen(today: string): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as { day: string; keys: string[] }
    return parsed.day === today ? new Set(parsed.keys) : new Set()
  } catch (_) {
    return new Set()
  }
}

function saveSeen(today: string, seen: Set<string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify({ day: today, keys: Array.from(seen) }))
  } catch (_) {}
}

export function CalendarEventToast() {
  const { data: logs = [] } = useLogs()
  const queue = useStore($calendarAlertQueue)
  const seenRef = React.useRef<Set<string> | null>(null)
  const [visible, setVisible] = React.useState(false)

  // Scan today's calendar entries once per minute; alert once per entry per day.
  React.useEffect(() => {
    const checkDue = () => {
      if (document.hidden || !isRouteActive('system')) return

      const today = dayjs().format('YYYY-MM-DD')
      if (!seenRef.current) seenRef.current = loadSeen(today)
      const seen = seenRef.current

      const dueToday = logs
        .filter(log => log.event === 'calendar_entry' && log.metadata)
        .map(log => ({
          date: log.metadata?.date as string,
          text: (log.metadata?.text as string) || log.text || '',
          type: (log.metadata?.entryType as string) || 'note',
        }))
        .filter(e => e.date === today && e.text)

      let dirty = false
      dueToday.forEach(e => {
        const key = `${e.date}::${e.text}`
        if (seen.has(key)) return
        seen.add(key)
        dirty = true
        pushCalendarAlert({
          kind: 'due',
          label: 'SCHED [T-0]:',
          title: e.type.toUpperCase(),
          detail: e.text,
        })
      })
      if (dirty) saveSeen(today, seen)
    }

    checkDue()
    const interval = setInterval(checkDue, 60000)
    return () => clearInterval(interval)
  }, [logs])

  const active = queue[0] || null

  React.useEffect(() => {
    if (!active) {
      setVisible(false)
      return
    }
    const showFrame = requestAnimationFrame(() => setVisible(true))
    const hideTimer = setTimeout(() => setVisible(false), DISMISS_MS)
    const clearTimer = setTimeout(shiftCalendarAlert, DISMISS_MS + 300)
    return () => {
      cancelAnimationFrame(showFrame)
      clearTimeout(hideTimer)
      clearTimeout(clearTimer)
    }
  }, [active])

  if (!active) return null

  return (
    <div
      className={cn(
        'fixed bottom-16 right-16 z-50 max-w-[280px]',
        'px-16 py-8 border border-acc/30 bg-bac',
        'transition-all duration-300 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      )}
    >
      <div className="uppercase tracking-widest text-acc/50">{active.label}</div>
      <div className="uppercase tracking-widest text-acc mt-4">{active.title}</div>
      {active.detail && <div className="text-acc/70 mt-4">{active.detail}</div>}
    </div>
  )
}
