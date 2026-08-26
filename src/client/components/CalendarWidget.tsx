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
  time?: string
  text: string
  type: EntryType
}

type AlertState = {
  entry: CalendarEntry
  status: 'EXECUTE' | 'ALERT'
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const ALERT_WINDOW_MIN = 60
const EXECUTE_WINDOW_MIN = 15
const ALERT_AUTO_DISMISS_MS = 30000
const ALERT_POLL_MS = 60000

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

// Entries are keyed by a plain "HH:mm" string, so build the timestamp from
// numeric parts rather than re-parsing a composed string — avoids depending
// on a date-time format the runtime's Date parser may read differently.
function parseTimeParts(time: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return null
  return { hour, minute }
}

function getEventDayjs(entry: CalendarEntry): Dayjs {
  const base = dayjs(entry.date)
  const parts = entry.time ? parseTimeParts(entry.time) : null
  if (!parts) return base.endOf('day')
  return base.hour(parts.hour).minute(parts.minute).second(0).millisecond(0)
}

function getStatus(entry: CalendarEntry, now: Dayjs): 'EXECUTE' | 'ALERT' | 'STANDBY' | 'ELAPSED' | null {
  if (!entry.time) {
    const entryDate = entry.date
    const todayStr = now.format('YYYY-MM-DD')
    if (entryDate < todayStr) return 'ELAPSED'
    if (entryDate === todayStr) return 'STANDBY'
    return null
  }
  const eventTime = getEventDayjs(entry)
  const diffMin = eventTime.diff(now, 'minute')
  if (diffMin < -120) return null
  if (diffMin < 0) return 'ELAPSED'
  if (diffMin <= EXECUTE_WINDOW_MIN) return 'EXECUTE'
  if (diffMin <= ALERT_WINDOW_MIN) return 'ALERT'
  if (diffMin <= 1440) return 'STANDBY'
  return null
}

function formatCountdown(entry: CalendarEntry, now: Dayjs): string {
  const eventTime = getEventDayjs(entry)
  const diffSec = eventTime.diff(now, 'second')
  const sign = diffSec < 0 ? '+' : '-'
  const abs = Math.abs(diffSec)
  const h = Math.floor(abs / 3600)
  const m = Math.floor((abs % 3600) / 60)
  const s = abs % 60
  return `T${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function statusClass(status: ReturnType<typeof getStatus>): string {
  if (status === 'EXECUTE') return 'text-acc'
  if (status === 'ALERT') return 'text-acc/70'
  if (status === 'STANDBY') return 'text-acc/50'
  if (status === 'ELAPSED') return 'text-acc/25'
  return 'text-acc/40'
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog, isLoading: isSaving } = useCreateLog()

  const [now, setNow] = React.useState(() => dayjs())
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryTime, setEntryTime] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [activeAlert, setActiveAlert] = React.useState<AlertState | null>(null)
  const alertedRef = React.useRef<Set<string>>(new Set())

  // Live clock — tick every second
  React.useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-dismiss alert after 30 seconds
  React.useEffect(() => {
    if (!activeAlert) return
    const timer = setTimeout(() => setActiveAlert(null), ALERT_AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [activeAlert])

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
      .sort((a, b) => {
        const aKey = `${a.date}${a.time ?? '23:59'}`
        const bKey = `${b.date}${b.time ?? '23:59'}`
        return aKey.localeCompare(bKey)
      })
  }, [logs])

  const checkAlerts = React.useCallback(() => {
    const n = dayjs()
    for (const entry of entries) {
      if (!entry.time) continue
      const key = `${entry.date}|${entry.time}|${entry.text}`
      if (alertedRef.current.has(key)) continue
      const diffMin = getEventDayjs(entry).diff(n, 'minute')
      if (diffMin >= 0 && diffMin <= ALERT_WINDOW_MIN) {
        alertedRef.current.add(key)
        setActiveAlert({ entry, status: diffMin <= EXECUTE_WINDOW_MIN ? 'EXECUTE' : 'ALERT' })
        return
      }
    }
  }, [entries])

  // Fire alerts for timed events within the window. Re-runs immediately
  // whenever the overlay clears (dismissed or auto-timed-out) so a second
  // queued event surfaces at once instead of waiting out the poll interval.
  React.useEffect(() => {
    if (activeAlert) return
    checkAlerts()
    const timer = setInterval(checkAlerts, ALERT_POLL_MS)
    return () => clearInterval(timer)
  }, [checkAlerts, activeAlert])

  const todayStr = now.format('YYYY-MM-DD')

  const todayEntries = React.useMemo(
    () => entries.filter(e => e.date === todayStr),
    [entries, todayStr]
  )

  const upcomingEntries = React.useMemo(
    () => entries.filter(e => e.date > todayStr).slice(0, 8),
    [entries, todayStr]
  )

  const entriesOnDate = React.useMemo(
    () => selectedDate ? entries.filter(e => e.date === selectedDate) : [],
    [entries, selectedDate]
  )

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  // Next upcoming timed event — recomputed each render since `now` ticks
  const nextTimedEvent = entries.find(
    e => e.time && getEventDayjs(e).isAfter(now)
  ) ?? null

  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(prev => prev === key ? null : key)
    setIsAddingEntry(false)
  }

  const handleAddEntry = () => {
    if (isSaving || !selectedDate) return
    const text = entryText.trim()
    if (!text) return

    const timeParts = entryTime ? parseTimeParts(entryTime) : null
    const validTime = timeParts ? entryTime : undefined

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeLabel = validTime ? ` at ${validTime}` : ''

    createLog({
      text: `${entryType.toUpperCase()}: ${text} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        ...(validTime ? { time: validTime } : {}),
        text,
        entryType,
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate) } catch (_) {}
      },
    })

    setEntryText('')
    setEntryTime('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(open => !open)
  }

  return (
    <>
      <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
        <div className="w-full">

          {/* Live clock + next timed event countdown */}
          <div className="flex justify-between items-baseline mb-16 font-mono text-sm">
            <span className="text-acc tabular-nums tracking-widest">
              {now.format('HH:mm:ss')}
            </span>
            {nextTimedEvent && (
              <span className={cn('tabular-nums text-xs', statusClass(getStatus(nextTimedEvent, now)))}>
                {formatCountdown(nextTimedEvent, now)}
              </span>
            )}
          </div>

          {/* Today's schedule */}
          {todayEntries.length > 0 && (
            <div className="mb-16">
              <div className="text-acc/25 text-xs uppercase tracking-widest mb-4">Today</div>
              {todayEntries.map((e, i) => {
                const status = getStatus(e, now)
                return (
                  <div key={i} className="flex items-baseline gap-8 mb-2 text-sm">
                    {e.time
                      ? <span className="text-acc/40 tabular-nums shrink-0 w-10">{e.time}</span>
                      : <span className="text-acc/20 text-xs shrink-0 w-10">—</span>
                    }
                    <span className={cn('text-xs uppercase tracking-widest shrink-0', statusClass(status))}>
                      {e.type[0]}
                    </span>
                    <span className={cn('flex-1', statusClass(status))}>{e.text}</span>
                    {(status === 'EXECUTE' || status === 'ALERT') && (
                      <span className={cn('text-xs tabular-nums shrink-0', statusClass(status))}>
                        {formatCountdown(e, now)}
                      </span>
                    )}
                    {status === 'ELAPSED' && (
                      <span className="text-acc/20 text-xs shrink-0 uppercase tracking-widest">done</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Add date button */}
          <div className="mb-16">
            <Button onClick={handleToggleCalendar}>
              {isCalendarOpen ? 'Close calendar' : 'Add date'}
            </Button>
          </div>

          {isCalendarOpen && (
            <div className="mb-16">
              {/* Month navigation */}
              <div className="flex items-center gap-8 mb-8">
                <button
                  className="text-acc/40 hover:text-acc text-sm transition-opacity"
                  onClick={() => setViewMonth(v => v.subtract(1, 'month'))}
                >{'<—'}</button>
                <span className="text-acc text-sm">{viewMonth.format('MMMM, YYYY')}</span>
                <button
                  className="text-acc/40 hover:text-acc text-sm transition-opacity"
                  onClick={() => setViewMonth(v => v.add(1, 'month'))}
                >{'—>'}</button>
              </div>

              {/* Calendar grid */}
              <div className="text-sm space-y-1">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex gap-0">
                    {week.map((d, di) => {
                      const key = d.format('YYYY-MM-DD')
                      const isToday = key === todayStr
                      const isCurrentMonth = d.month() === viewMonth.month()
                      const isSelected = key === selectedDate
                      const hasEntry = datesWithEntries.has(key)

                      return (
                        <button
                          key={key}
                          onClick={() => handleDateClick(d)}
                          className={cn(
                            'text-sm py-0.5 px-0.5 transition-opacity whitespace-nowrap min-w-[2.5em] text-left',
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

                    {wi === 0 && selectedDate && !isAddingEntry && (
                      <div className="flex items-center ml-4">
                        <button
                          className="text-acc/30 hover:text-acc/60 transition-opacity text-sm"
                          onClick={() => setIsAddingEntry(true)}
                        >
                          + entry
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add entry form */}
              {isAddingEntry && selectedDate && (
                <div className="mt-8 border-l border-acc/10 pl-8">
                  <div className="text-acc/30 text-xs uppercase tracking-widest mb-8">
                    {dayjs(selectedDate).format('ddd D MMM YYYY')}
                  </div>
                  <div className="flex gap-8 mb-8">
                    {(['note', 'task', 'call'] as EntryType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setEntryType(t)}
                        className={cn(
                          'text-xs transition-opacity capitalize',
                          entryType === t ? 'text-acc' : 'text-acc/40 hover:text-acc/60'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-8 items-center mb-4">
                    <input
                      type="time"
                      value={entryTime}
                      onChange={e => setEntryTime(e.target.value)}
                      className="bg-transparent border border-acc/20 text-acc/60 text-sm px-4 py-1 outline-none focus:border-acc/40 tabular-nums"
                    />
                    <span className="text-acc/20 text-xs">time optional</span>
                  </div>
                  <div className="flex gap-8 items-center">
                    <input
                      type="text"
                      value={entryText}
                      onChange={e => setEntryText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                      placeholder={`${entryType}...`}
                      className="bg-transparent border border-acc/20 text-acc text-sm px-4 py-2 flex-1 outline-none focus:border-acc/40"
                      autoFocus
                    />
                    <Button onClick={handleAddEntry} disabled={isSaving || !entryText.trim()}>
                      {isSaving ? '...' : 'Add'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Selected date entries */}
              {selectedDate && entriesOnDate.length > 0 && !isAddingEntry && (
                <div className="mt-8">
                  <div className="text-acc/30 text-xs uppercase tracking-widest mb-4">
                    {dayjs(selectedDate).format('ddd D MMM YYYY')}
                  </div>
                  {entriesOnDate.map((e, i) => (
                    <div key={i} className="flex gap-8 items-baseline mb-2 text-sm">
                      {e.time && <span className="text-acc/40 tabular-nums">{e.time}</span>}
                      <span className="text-acc/40 text-xs uppercase tracking-widest">{e.type[0]}</span>
                      <span className="text-acc/70">{e.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming entries */}
          {upcomingEntries.length > 0 && (
            <div className="space-y-2">
              {upcomingEntries.map((entry, i) => (
                <div key={i} className="flex gap-8 text-sm items-baseline">
                  <span className="text-acc/30 tabular-nums whitespace-nowrap shrink-0">
                    {dayjs(entry.date).format('D MMM')}
                    {entry.time && ` ${entry.time}`}
                  </span>
                  <span className="text-acc/30 text-xs uppercase tracking-widest shrink-0">{entry.type[0]}</span>
                  <span className="text-acc/60 flex-1">{entry.text}</span>
                </div>
              ))}
            </div>
          )}

          {todayEntries.length === 0 && upcomingEntries.length === 0 && !isCalendarOpen && (
            <div className="text-acc/40 text-sm">No upcoming dates.</div>
          )}
        </div>
      </Block>

      {/* Military-grade event alert overlay */}
      {activeAlert && (
        <div className="fixed bottom-32 right-16 z-50">
          <div className="border border-acc/40 bg-base grid-fill p-16 max-w-64">
            <div className="flex justify-between items-baseline mb-8">
              <span className={cn(
                'text-xs uppercase tracking-widest font-bold',
                activeAlert.status === 'EXECUTE' ? 'text-acc' : 'text-acc/70'
              )}>
                CAL [{activeAlert.status}]
              </span>
              <button
                className="text-acc/30 hover:text-acc/70 text-xs ml-16 uppercase tracking-widest transition-opacity"
                onClick={() => setActiveAlert(null)}
              >
                ACK
              </button>
            </div>
            <div className="text-acc text-sm uppercase tracking-widest mb-4 leading-tight">
              {activeAlert.entry.type}: {activeAlert.entry.text}
            </div>
            <div className="text-acc/40 text-xs uppercase tracking-widest">
              {dayjs(activeAlert.entry.date).format('ddd D MMM').toUpperCase()}
              {activeAlert.entry.time && ` · ${activeAlert.entry.time}`}
            </div>
            <div className={cn(
              'tabular-nums font-mono mt-4 text-sm',
              activeAlert.status === 'EXECUTE' ? 'text-acc' : 'text-acc/60'
            )}>
              {formatCountdown(activeAlert.entry, now)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
