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
 * Subtle, military-format notification fired when a tracked calendar task/call
 * crosses into its due window. CalendarWidget writes to the 'calendar_due_events'
 * localStorage queue the moment an entry becomes due; this component polls that
 * queue and surfaces one entry at a time. No push, no sound — a single quiet
 * line that fades, consistent with the product's "context over notification" stance.
 */

import React from 'react'
import { isRouteActive } from '#client/stores/router'

interface DueEvent {
  message: string
  timestamp: string
}

const QUEUE_KEY = 'calendar_due_events'

export function CalendarEventToast() {
  const [current, setCurrent] = React.useState<DueEvent | null>(null)
  const [showToast, setShowToast] = React.useState(false)
  const [seen, setSeen] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    const checkQueue = () => {
      let queue: DueEvent[] = []
      try {
        const raw = localStorage.getItem(QUEUE_KEY)
        queue = raw ? JSON.parse(raw) : []
      } catch (_) {
        return
      }
      if (queue.length === 0) return

      const latest = queue[0]
      const key = `${latest.message}-${latest.timestamp}`
      if (!seen.has(key)) {
        setCurrent(latest)
        setShowToast(true)
        setSeen(prev => new Set(prev).add(key))
        setTimeout(() => setShowToast(false), 6000)
      }
    }

    checkQueue()
    const interval = setInterval(() => {
      if (document.hidden || !isRouteActive('system')) return
      checkQueue()
    }, 15000)
    return () => clearInterval(interval)
  }, [seen])

  if (!showToast || !current) return null

  return (
    <div
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50
                 px-16 py-8 border border-[rgb(var(--acc-color-default)/0.2)]
                 bg-[var(--base-color)] grid-fill-light font-mono uppercase tracking-widest text-xs"
      style={{
        animation: 'fadeInUp 0.5s ease-out, fadeOut 0.5s ease-in 5.5s forwards',
      }}
    >
      <div className="text-center">{current.message}</div>
    </div>
  )
}

// CSS animations — safe to inject even if EvolutionMilestoneToast already defined these keyframes.
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
