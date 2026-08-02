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
 * Terminal Grid style event notifications for the Calendar widget —
 * bracket-notation status lines ("[ENTRY LOGGED] ...") that fade in/out
 * bottom-right, stacked. Listens on the calendarEvents bus so the widget
 * stays decoupled from how (or whether) events get displayed.
 */

import * as React from 'react'
import { cn } from '#client/utils'
import { onCalendarEvent } from '#client/utils/calendarEvents'
import type { CalendarEventDetail } from '#client/utils/calendarEvents'

type QueuedToast = CalendarEventDetail & { id: number }

const AUTO_DISMISS_MS = 5000
const MAX_VISIBLE = 3

const TONE_CLASSNAME: Record<CalendarEventDetail['tone'], string> = {
  ok: 'border-acc/20 text-acc',
  due: 'border-gold/40 text-gold',
  overdue: 'border-red/40 text-red',
}

export function CalendarEventToast() {
  const [toasts, setToasts] = React.useState<QueuedToast[]>([])
  const nextId = React.useRef(0)

  React.useEffect(() => {
    return onCalendarEvent(detail => {
      const id = ++nextId.current
      setToasts(prev => [...prev.slice(-(MAX_VISIBLE - 1)), { ...detail, id }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, AUTO_DISMISS_MS)
    })
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-16 right-16 z-50 flex flex-col gap-8 items-end pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            'px-12 py-6 border bg-[var(--base-color)] font-mono text-sm whitespace-nowrap',
            'animate-fade-in-up',
            TONE_CLASSNAME[toast.tone]
          )}
          style={{ animation: 'fadeInUp 0.3s ease-out, fadeOut 0.4s ease-in 4.6s forwards' }}
        >
          <span className="font-bold">[{toast.code}]</span> {toast.message}
        </div>
      ))}
    </div>
  )
}

// Reuses the fadeInUp/fadeOut keyframes already registered by
// EvolutionMilestoneToast; declared standalone too so this component
// works even if that one hasn't mounted yet.
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
