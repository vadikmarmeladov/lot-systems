/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useLogs } from '#client/queries'
import dayjs from '#client/utils/dayjs'

type AlertLevel = 'alert-1h' | 'alert-15min' | 'alert-now'

type TrackedEntry = {
  date: string
  text: string
  type: string
  time: string
  alertKey: (level: AlertLevel) => string
}

function padTwo(n: number): string {
  return String(n).padStart(2, '0')
}

function formatCountdown(ms: number): string {
  const abs = Math.abs(ms)
  const h = Math.floor(abs / 3_600_000)
  const m = Math.floor((abs % 3_600_000) / 60_000)
  const s = Math.floor((abs % 60_000) / 1_000)
  if (h > 0) return `${padTwo(h)}:${padTwo(m)}:${padTwo(s)}`
  return `${padTwo(m)}:${padTwo(s)}`
}

const LEVEL_CONFIG: Record<AlertLevel, { label: string; minMs: number; maxMs: number; autoDismissMs: number }> = {
  'alert-now':    { label: '▌ EXECUTE NOW',      minMs: -5 * 60_000,  maxMs: 0,         autoDismissMs: 90_000 },
  'alert-15min':  { label: '⚡ T-MINUS 15 MIN',   minMs: 0,            maxMs: 15 * 60_000, autoDismissMs: 45_000 },
  'alert-1h':     { label: '◈ STANDBY — 1 HOUR', minMs: 15 * 60_000,  maxMs: 60 * 60_000, autoDismissMs: 30_000 },
}

export function CalendarAlert() {
  const { data: logs = [] } = useLogs()
  const [now, setNow] = React.useState(() => dayjs())
  const [activeAlert, setActiveAlert] = React.useState<{
    entry: TrackedEntry
    level: AlertLevel
  } | null>(null)
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set())

  // 1-second tick
  React.useEffect(() => {
    const iv = setInterval(() => setNow(dayjs()), 1_000)
    return () => clearInterval(iv)
  }, [])

  const entries = React.useMemo<TrackedEntry[]>(() => {
    return logs
      .filter(l => l.event === 'calendar_entry' && l.metadata?.time && l.metadata?.date)
      .map(l => {
        const date = l.metadata!.date as string
        const text = (l.metadata!.text as string) || l.text || ''
        const time = l.metadata!.time as string
        const type = (l.metadata!.entryType as string) || 'ENTRY'
        return {
          date,
          text,
          type,
          time,
          alertKey: (level: AlertLevel) => `${date}-${time}-${text}-${level}`,
        }
      })
  }, [logs])

  // Alert-check runs every tick
  React.useEffect(() => {
    if (activeAlert) return
    const today = now.format('YYYY-MM-DD')
    const todayEntries = entries.filter(e => e.date === today)

    const PRIORITY: AlertLevel[] = ['alert-now', 'alert-15min', 'alert-1h']

    for (const level of PRIORITY) {
      const { minMs, maxMs } = LEVEL_CONFIG[level]
      for (const entry of todayEntries) {
        const [h, m] = entry.time.split(':').map(Number)
        const eventMs = now.startOf('day').add(h, 'hour').add(m, 'minute').diff(now)
        const key = entry.alertKey(level)
        if (eventMs >= minMs && eventMs < maxMs && !dismissed.has(key)) {
          setActiveAlert({ entry, level })
          return
        }
      }
    }
  }, [now, entries, activeAlert, dismissed])

  const handleAck = React.useCallback(() => {
    if (!activeAlert) return
    setDismissed(prev => new Set(prev).add(activeAlert.entry.alertKey(activeAlert.level)))
    setActiveAlert(null)
  }, [activeAlert])

  // Auto-dismiss
  React.useEffect(() => {
    if (!activeAlert) return
    const ms = LEVEL_CONFIG[activeAlert.level].autoDismissMs
    const timer = setTimeout(handleAck, ms)
    return () => clearTimeout(timer)
  }, [activeAlert, handleAck])

  if (!activeAlert) return null

  const { entry, level } = activeAlert
  const { label } = LEVEL_CONFIG[level]
  const [h, m] = entry.time.split(':').map(Number)
  const diffMs = now.startOf('day').add(h, 'hour').add(m, 'minute').diff(now)
  const isPast = diffMs < 0
  const isHot = level === 'alert-now' || level === 'alert-15min'

  return (
    <div
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50"
      style={{ animation: 'calAlertIn 0.25s ease-out', minWidth: '260px', maxWidth: '400px' }}
    >
      <div
        className="px-16 py-12 bg-[var(--base-color)]"
        style={{ border: `1px solid rgb(var(--acc-color-default) / ${isHot ? '0.8' : '0.3'})` }}
      >
        {/* Header row */}
        <div className="flex items-baseline justify-between gap-16 mb-8">
          <div
            className="text-[10px] tracking-[0.2em] uppercase tabular-nums"
            style={{ color: `rgb(var(--acc-color-default) / ${isHot ? '1' : '0.5'})` }}
          >
            {label}
          </div>
          <button
            onClick={handleAck}
            className="text-[10px] tracking-[0.15em] uppercase transition-opacity"
            style={{ color: 'rgb(var(--acc-color-default) / 0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgb(var(--acc-color-default) / 0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgb(var(--acc-color-default) / 0.3)')}
          >
            ACK
          </button>
        </div>

        {/* Type */}
        <div
          className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium"
          style={{ color: `rgb(var(--acc-color-default) / ${isHot ? '0.7' : '0.4'})` }}
        >
          [{entry.type}]
        </div>

        {/* Text */}
        <div
          className="tracking-wide mb-10"
          style={{ color: `rgb(var(--acc-color-default) / 0.9)` }}
        >
          {entry.text}
        </div>

        {/* Time + countdown */}
        <div className="flex items-baseline justify-between text-[11px] tabular-nums tracking-widest">
          <span style={{ color: 'rgb(var(--acc-color-default) / 0.35)' }}>
            {entry.time}
          </span>
          <span style={{ color: `rgb(var(--acc-color-default) / ${isHot ? '0.9' : '0.4'})` }}>
            {isPast ? '+' : 'T−'}{formatCountdown(diffMs)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Inject animation once
if (typeof document !== 'undefined') {
  const id = 'cal-alert-style'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = `
      @keyframes calAlertIn {
        from { opacity: 0; transform: translate(-50%, -8px); }
        to   { opacity: 1; transform: translate(-50%, 0);    }
      }
    `
    document.head.appendChild(s)
  }
}
