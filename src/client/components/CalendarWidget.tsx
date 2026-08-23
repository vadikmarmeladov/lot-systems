/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { Block, Button, Clock } from '#client/components/ui'
import { useCreateLog, useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import { recordCalendarSignal, recordCalendarAlertSignal } from '#client/stores/intentionEngine'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  date: string
  time?: string
  text: string
  type: EntryType
}

// Alert dedupe key — identifies a scheduled entry independent of its Log row id,
// so a re-check never fires the same entry twice (matched against existing
// 'calendar_alert' logs, not local state — reliable across reloads/devices).
function entryKey(entry: Pick<CalendarEntry, 'date' | 'type' | 'text'>): string {
  return `${entry.date}|${entry.type}|${entry.text}`
}

type ActiveAlert = {
  id: string
  entryType: EntryType
  text: string
  date: string
  time?: string
  firedAt: number
}

// HH:MM:SS countdown/elapsed readout — clamped to zero, never negative.
function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
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
  const [activeAlerts, setActiveAlerts] = React.useState<ActiveAlert[]>([])
  const [nowTick, setNowTick] = React.useState(() => dayjs())

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        time: log.metadata?.time as string | undefined,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
  }, [logs])

  // Keys of entries a [ ALERT ] has already fired for — read back from the Log
  // itself (event: 'calendar_alert'), not local/session state, so the guard
  // survives reloads and holds across every device the user logs in from.
  const alertedKeys = React.useMemo(() => {
    const set = new Set<string>()
    logs.forEach(log => {
      if (log.event === 'calendar_alert' && log.metadata?.entryKey) {
        set.add(log.metadata.entryKey as string)
      }
    })
    return set
  }, [logs])

  // In-flight guard: prevents a duplicate alert log from being submitted for
  // the same entry while the createLog round-trip for the first one is still
  // pending (the 30s check tick can otherwise race ahead of the Log refetch).
  const firingRef = React.useRef<Set<string>>(new Set())

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

  // Next scheduled entry today still armed to fire — drives the T-MINUS readout.
  const nextDueToday = React.useMemo(() => {
    const nowClock = nowTick.format('HH:mm')
    return entries.find(e =>
      e.date === today &&
      !!e.time &&
      e.time >= nowClock &&
      !alertedKeys.has(entryKey(e))
    ) || null
  }, [entries, today, alertedKeys, nowTick])

  // Terminal-style clock tick — only runs while the calendar panel is open
  // AND there is something armed to count down to. Idle otherwise, so the
  // widget carries no per-second render cost while collapsed on System.tsx.
  React.useEffect(() => {
    if (!isCalendarOpen || !nextDueToday) return
    const interval = setInterval(() => setNowTick(dayjs()), 1000)
    return () => clearInterval(interval)
  }, [isCalendarOpen, !!nextDueToday])

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
    const timeLabel = entryTime ? ` at ${entryTime}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        time: entryTime || undefined,
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

  // Reliable due-check: fires a [ ALERT ] the moment a scheduled entry's clock
  // time arrives (or immediately, for entries with no time set, once their
  // date turns to today). Runs on mount and every 30s while this widget is
  // mounted (the System page). Dedupe is read back from the Log itself
  // (alertedKeys), so a page reload never re-fires an alert already recorded.
  React.useEffect(() => {
    const checkDueEntries = () => {
      const now = dayjs()
      const todayKey = now.format('YYYY-MM-DD')
      const nowClock = now.format('HH:mm')

      entries
        .filter(e => e.date === todayKey && (!e.time || e.time <= nowClock))
        .forEach(e => {
          const key = entryKey(e)
          if (alertedKeys.has(key) || firingRef.current.has(key)) return
          firingRef.current.add(key)

          const dateLabel = dayjs(e.date).format('dddd, MMMM D, YYYY')
          const timeLabel = e.time ? ` ${e.time}` : ''

          createLog({
            text: `[ALERT] ${e.type.toUpperCase()} DUE: ${e.text} (${dateLabel}${timeLabel})`,
            event: 'calendar_alert',
            metadata: {
              date: e.date,
              time: e.time,
              text: e.text,
              entryType: e.type,
              entryKey: key,
              firedAt: new Date().toISOString(),
            },
          }, {
            onSuccess: () => {
              queryClient.refetchQueries(['/api/logs'])
              try { recordCalendarAlertSignal(e.type, e.date, e.text) } catch (_) {}

              setActiveAlerts(prev => [...prev, {
                id: key, entryType: e.type, text: e.text, date: e.date, time: e.time, firedAt: Date.now(),
              }])
              setTimeout(() => {
                setActiveAlerts(prev => prev.filter(a => a.id !== key))
              }, 12000)
            },
            onError: () => {
              firingRef.current.delete(key)
            },
          })
        })
    }

    checkDueEntries()
    const interval = setInterval(checkDueEntries, 30000)
    return () => clearInterval(interval)
  }, [entries, alertedKeys, createLog, queryClient])

  const dismissAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id))
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
        {activeAlerts.length > 0 && (
          <div className="mb-16 space-y-4">
            {activeAlerts.map(alert => (
              <div
                key={alert.id}
                className="border border-acc px-8 py-4 flex items-center justify-between gap-16"
              >
                <div className="flex items-center gap-8 font-mono">
                  <span className="text-acc blink">{'●'}</span>
                  <span className="text-acc/40">{'[ '}</span>
                  <span className="uppercase tracking-widest text-acc font-bold">
                    ALERT :: {alert.entryType} DUE
                  </span>
                  <span className="text-acc/40">{' ]'}</span>
                  <span className="text-acc/70">{alert.text}</span>
                  <span className="text-acc/30 tabular-nums">
                    FIRED {dayjs(alert.firedAt).format('HH:mm:ss')}
                  </span>
                </div>
                <button
                  className="text-acc/30 hover:text-acc/60 transition-opacity uppercase tracking-widest"
                  onClick={() => dismissAlert(alert.id)}
                >
                  dismiss
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>
            Add date
          </Button>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            <div className="flex items-center justify-between gap-8 mb-8">
              <div className="flex items-center gap-8">
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
              <span className="text-acc/30 tabular-nums font-mono">
                <Clock format="HH:mm:ss" interval={1000} />
              </span>
            </div>

            {nextDueToday && (
              <div className="mb-8 text-acc/50 font-mono tabular-nums">
                {'T-MINUS '}
                <span className="text-acc">
                  {formatDuration(
                    dayjs(`${today} ${nextDueToday.time}`, 'YYYY-MM-DD HH:mm').diff(nowTick, 'second')
                  )}
                </span>
                {' :: '}
                <span className="uppercase tracking-widest">{nextDueToday.type}</span>
                {' — '}
                <span className="text-acc/70">{nextDueToday.text}</span>
              </div>
            )}

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
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
                    title="Optional — fires a due alert at this time"
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
                  <div key={i} className="text-acc/80 mb-1 flex gap-8">
                    {e.time && <span className="text-acc/40 tabular-nums">{e.time}</span>}
                    <span>{e.text}</span>
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
                  {entry.time && <span className="text-acc/40 tabular-nums"> {entry.time}</span>}
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
    </Block>
  )
}
