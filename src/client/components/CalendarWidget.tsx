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
import { isRouteActive } from '#client/stores/router'
import { playCalendarAlertKlaxon } from '#client/utils/calendarAlert'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  id: string
  date: string
  time: string | null
  text: string
  type: EntryType
}

const FIRED_ALERTS_KEY = 'lot_calendar_fired_alerts_v1'
const ALERT_CHECK_INTERVAL_MS = 15_000
const COUNTDOWN_WINDOW_MIN = 60

function loadFiredAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem(FIRED_ALERTS_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch (_) {
    return new Set()
  }
}

function saveFiredAlerts(ids: Set<string>) {
  try {
    // Bound growth — keep only the most recent 200 fired ids.
    const trimmed = Array.from(ids).slice(-200)
    localStorage.setItem(FIRED_ALERTS_KEY, JSON.stringify(trimmed))
  } catch (_) {}
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

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

function formatCountdown(minutesRemaining: number): string {
  const totalSeconds = Math.round(minutesRemaining * 60)
  const mm = Math.floor(totalSeconds / 60)
  const ss = totalSeconds % 60
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
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

  const [firedAlerts, setFiredAlerts] = React.useState<Set<string>>(() => loadFiredAlerts())
  const [activeAlerts, setActiveAlerts] = React.useState<CalendarEntry[]>([])
  const [nowTick, setNowTick] = React.useState(() => dayjs())

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        time: (log.metadata?.time as string) || null,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date)
        if (dateCmp !== 0) return dateCmp
        if (!a.time && !b.time) return 0
        if (!a.time) return 1
        if (!b.time) return -1
        return a.time.localeCompare(b.time)
      })
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

  // Today's timed entries not yet acknowledged — the alert engine only
  // watches this list (never the full entry set) to stay cheap.
  const todaysTimedEntries = React.useMemo(
    () => entries.filter(e => e.date === today && e.time && !firedAlerts.has(e.id)),
    [entries, today, firedAlerts]
  )

  // Identity of "next" is independent of the live clock — todaysTimedEntries
  // already excludes fired entries, so the earliest by time is always next.
  const nextAlertEntry = React.useMemo(() => {
    const sorted = [...todaysTimedEntries].sort((a, b) => (a.time as string).localeCompare(b.time as string))
    return sorted[0] || null
  }, [todaysTimedEntries])

  const minutesToNextAlert = React.useMemo(() => {
    if (!nextAlertEntry) return null
    const target = dayjs(`${today}T${nextAlertEntry.time}`)
    return target.diff(nowTick, 'second') / 60
  }, [nextAlertEntry, today, nowTick])

  // Alert firing loop — only runs while there is at least one unfired timed
  // entry today, and pauses when the System tab isn't visible/active.
  React.useEffect(() => {
    if (todaysTimedEntries.length === 0) return

    const checkAlerts = () => {
      if (document.hidden || !isRouteActive('system')) return
      const nowStr = dayjs().format('HH:mm')
      const due = todaysTimedEntries.filter(e => (e.time as string) <= nowStr)
      if (due.length === 0) return

      setFiredAlerts(prev => {
        const next = new Set(prev)
        due.forEach(e => next.add(e.id))
        saveFiredAlerts(next)
        return next
      })
      setActiveAlerts(prev => [...prev, ...due])
      playCalendarAlertKlaxon()
      due.forEach(e => {
        createLog({
          text: `[ALERT] ${e.type}: ${e.text} fired at ${e.time}`,
          event: 'calendar_alert_fired',
          metadata: { date: e.date, time: e.time, text: e.text, entryType: e.type, sourceLogId: e.id },
        }, {
          onSuccess: () => queryClient.refetchQueries(['/api/logs']),
        })
      })
    }

    checkAlerts()
    const loop = setInterval(checkAlerts, ALERT_CHECK_INTERVAL_MS)
    return () => clearInterval(loop)
  }, [todaysTimedEntries, createLog, queryClient])

  // Second-precision tick, but only while a live T-minus countdown is on
  // screen (next alert within the countdown window) — otherwise idle.
  // The window check runs on a coarse timer so the fine (1s) timer never
  // has to be torn down and recreated every second while it's active.
  React.useEffect(() => {
    if (!nextAlertEntry) return
    let fineTimer: ReturnType<typeof setInterval> | null = null

    const evaluateWindow = () => {
      const mins = dayjs(`${today}T${nextAlertEntry.time}`).diff(dayjs(), 'second') / 60
      const withinWindow = mins <= COUNTDOWN_WINDOW_MIN
      if (withinWindow && !fineTimer) {
        fineTimer = setInterval(() => setNowTick(dayjs()), 1000)
      } else if (!withinWindow && fineTimer) {
        clearInterval(fineTimer)
        fineTimer = null
      }
    }

    evaluateWindow()
    const coarseTimer = setInterval(evaluateWindow, ALERT_CHECK_INTERVAL_MS)
    return () => {
      clearInterval(coarseTimer)
      if (fineTimer) clearInterval(fineTimer)
    }
  }, [nextAlertEntry, today])

  const handleAckAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(e => e.id !== id))
  }

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
    const time = /^([01]\d|2[0-3]):[0-5]\d$/.test(entryTime) ? entryTime : null
    const timeLabel = time ? ` at ${time}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        time,
        text: entryText.trim(),
        entryType,
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

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setViewMonth(dayjs())
    }
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
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
                    title="Optional — fires a calendar alert at this time"
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
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
                    {e.time && <span className="text-acc/50 tabular-nums mr-8">{e.time}</span>}
                    {e.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {nextAlertEntry && (
          <div className="mb-8 text-acc/50 tabular-nums whitespace-nowrap">
            {'NEXT: '}{nextAlertEntry.time}{' — '}{nextAlertEntry.text}
            {minutesToNextAlert !== null && minutesToNextAlert <= COUNTDOWN_WINDOW_MIN && (
              <span className="text-acc/70">
                {'  T-'}{formatCountdown(Math.max(minutesToNextAlert, 0))}
              </span>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => (
              <div key={i} className="flex justify-between gap-16">
                <span className="text-acc whitespace-nowrap">
                  {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                  {entry.time && <span className="text-acc/50 tabular-nums">{' '}{entry.time}</span>}
                </span>
                <span className="text-acc text-right">
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

      {activeAlerts.length > 0 && (
        <div className="fixed bottom-16 right-16 z-50 flex flex-col gap-8 items-end">
          {activeAlerts.map(alert => (
            <div
              key={alert.id}
              className="border border-red bg-bac text-red px-16 py-8 font-mono uppercase tracking-widest text-sm animate-pulse max-w-[360px]"
            >
              <div className="mb-4">{'[ ALERT :: '}{alert.time}{' ]'}</div>
              <div className="normal-case tracking-normal mb-8">
                {alert.type}{': '}{alert.text}
              </div>
              <button
                className="border border-red px-8 py-2 hover:bg-red/10 transition-colors"
                onClick={() => handleAckAlert(alert.id)}
              >
                ACK
              </button>
            </div>
          ))}
        </div>
      )}
    </Block>
  )
}
