/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { Block, Button } from '#client/components/ui'
import { useCreateLog, useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import { recordCalendarSignal } from '#client/stores/intentionEngine'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  date: string
  text: string
  type: EntryType
  time?: string
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const NOTIFIED_ALERTS_KEY = 'calendar_notified_alerts'
const ALERT_WINDOW_MINUTES = 5
const ALERT_DISPLAY_MS = 8000

function loadNotifiedAlertKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_ALERTS_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch (_) {
    return new Set()
  }
}

function saveNotifiedAlertKeys(keys: Set<string>) {
  try {
    localStorage.setItem(NOTIFIED_ALERTS_KEY, JSON.stringify(Array.from(keys).slice(-200)))
  } catch (_) {}
}

function alertKeyFor(e: CalendarEntry): string {
  return `${e.date}T${e.time}:${e.type}:${e.text}`
}

// CAL [DUE] toast animation — injected once, module scope
const CAL_TOAST_STYLE_ID = 'cal-due-toast-style'
if (typeof document !== 'undefined' && !document.getElementById(CAL_TOAST_STYLE_ID)) {
  const style = document.createElement('style')
  style.id = CAL_TOAST_STYLE_ID
  style.textContent = `
    @keyframes calFadeInUp {
      from { opacity: 0; transform: translate(-50%, 10px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes calFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

function getMonthWeeks(year: number, month: number): Dayjs[][] {
  const first = dayjs().year(year).month(month).startOf('month')
  const last = dayjs().year(year).month(month).endOf('month')

  let isoDay = first.day() === 0 ? 6 : first.day() - 1
  const start = first.subtract(isoDay, 'day')

  const weeks: Dayjs[][] = []
  let current = start

  while (current.isBefore(last) || current.isSame(last, 'day') || weeks.length < 5) {
    const week: Dayjs[] = []
    for (let i = 0; i < 7; i++) {
      week.push(current)
      current = current.add(1, 'day')
    }
    weeks.push(week)
    if (weeks.length >= 6) break
  }

  return weeks
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [entryTime, setEntryTime] = React.useState('')
  const [dueAlert, setDueAlert] = React.useState<CalendarEntry | null>(null)

  const notifiedKeysRef = React.useRef<Set<string>>(loadNotifiedAlertKeys())
  const alertHideTimerRef = React.useRef<ReturnType<typeof setTimeout>>()

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
        time: log.metadata?.time as string | undefined,
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
  }, [logs])

  const upcomingEntries = React.useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    return entries
      .filter(e => e.date >= today)
      .slice(0, 10)
  }, [entries])

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  const today = dayjs().format('YYYY-MM-DD')
  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    if (selectedDate === key) {
      setSelectedDate(null)
    } else {
      setSelectedDate(key)
    }
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeLabel = entryTime ? ` ${entryTime}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        time: entryTime || undefined,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    setEntryText('')
    setEntryTime('')
    setIsAddingEntry(false)
  }

  // CAL [DUE] — fires a military-grade toast + Log entry when a timed entry's
  // moment arrives. 5-min catch window absorbs background-tab throttling; a
  // localStorage-persisted key set prevents re-firing on remount/reload.
  React.useEffect(() => {
    const checkDue = () => {
      const now = dayjs()
      const todayKey = now.format('YYYY-MM-DD')
      const nowMinutes = now.hour() * 60 + now.minute()

      for (const e of entries) {
        if (e.date !== todayKey || !e.time) continue
        const [h, m] = e.time.split(':').map(Number)
        if (Number.isNaN(h) || Number.isNaN(m)) continue
        const entryMinutes = h * 60 + m
        if (nowMinutes < entryMinutes || nowMinutes > entryMinutes + ALERT_WINDOW_MINUTES) continue

        const key = alertKeyFor(e)
        if (notifiedKeysRef.current.has(key)) continue

        notifiedKeysRef.current.add(key)
        saveNotifiedAlertKeys(notifiedKeysRef.current)

        setDueAlert(e)
        clearTimeout(alertHideTimerRef.current)
        alertHideTimerRef.current = setTimeout(() => setDueAlert(null), ALERT_DISPLAY_MS)

        createLog({
          text: `[CAL ALERT] ${e.type}: ${e.text} — DUE ${e.time}`,
          event: 'calendar_alert',
          metadata: { date: e.date, time: e.time, entryType: e.type, text: e.text },
        }, {
          onSuccess: () => queryClient.refetchQueries(['/api/logs']),
        })

        break // one alert surfaced per tick; the next interval picks up any remainder
      }
    }

    checkDue()
    const interval = setInterval(() => {
      if (document.hidden) return
      checkDue()
    }, 30000)

    const onVisible = () => {
      if (document.visibilityState === 'visible') checkDue()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [entries])

  React.useEffect(() => () => clearTimeout(alertHideTimerRef.current), [])

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setViewMonth(dayjs())
    }
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
    <>
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>
            Add date
          </Button>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            <div className="flex items-center gap-8 mb-8">
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(viewMonth.subtract(1, 'month'))}
              >
                {'<—'}
              </button>
              <span className="text-acc">
                {viewMonth.format('MMMM, YYYY')}
              </span>
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(viewMonth.add(1, 'month'))}
              >
                {'—>'}
              </button>
            </div>

            <div className="space-y-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex gap-0">
                  {week.map((d, di) => {
                    const key = d.format('YYYY-MM-DD')
                    const isToday = key === today
                    const isCurrentMonth = d.month() === viewMonth.month()
                    const isSelected = key === selectedDate
                    const hasEntry = datesWithEntries.has(key)

                    return (
                      <button
                        key={key}
                        onClick={() => handleDateClick(d)}
                        className={cn(
                          'py-0.5 px-0.5 transition-opacity whitespace-nowrap',
                          'min-w-[2.5em] text-left',
                          isToday && 'font-bold',
                          isSelected && 'underline',
                          !isCurrentMonth && 'text-acc/20',
                          isCurrentMonth && !isToday && 'text-acc/40',
                          isToday && 'text-acc',
                          hasEntry && isCurrentMonth && !isToday && 'text-acc/60',
                        )}
                      >
                        {DAY_LETTERS[di]}{d.date()}
                      </button>
                    )
                  })}

                  {wi === 0 && (
                    <div className="text-acc/30 flex items-center ml-4 whitespace-nowrap">
                      {selectedDate && !isAddingEntry && (
                        <button
                          className="text-acc/30 hover:text-acc/60 transition-opacity"
                          onClick={() => setIsAddingEntry(true)}
                        >
                          Note / Task / Call
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isAddingEntry && selectedDate && (
              <div className="mt-8">
                <div className="flex gap-8 mb-8">
                  {(['note', 'task', 'call'] as EntryType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setEntryType(t)}
                      className={cn(
                        'transition-opacity capitalize',
                        entryType === t ? 'text-acc' : 'text-acc/40 hover:text-acc/60'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-8 items-center">
                  <input
                    type="text"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    placeholder={`Add ${entryType}...`}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40 tabular-nums"
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="text-acc/80 mb-1">
                    {e.time && <span className="text-acc/40 mr-8 tabular-nums">{e.time}</span>}
                    {e.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => (
              <div key={i} className="flex justify-between gap-16">
                <span className="text-acc whitespace-nowrap">
                  {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                </span>
                <span className="text-acc text-right">
                  {entry.time && <span className="text-acc/40 mr-8 tabular-nums">{entry.time}</span>}
                  {entry.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>
    </Block>

    {dueAlert && (
      <div
        className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50
                   px-16 py-8 border border-acc/40 bg-[var(--base-color)] grid-fill-light text-center"
        style={{ animation: 'calFadeInUp 0.4s ease-out, calFadeOut 0.4s ease-in 7.5s forwards' }}
      >
        <div className="text-acc/40 uppercase tracking-widest mb-4">
          CAL [DUE] {dueAlert.time}
        </div>
        <div className="text-acc uppercase tracking-wide">
          {dueAlert.type}: {dueAlert.text}
        </div>
      </div>
    )}
    </>
  )
}
