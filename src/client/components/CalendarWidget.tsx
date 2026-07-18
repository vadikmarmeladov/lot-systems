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
  plannedMinutes?: number
  logId?: string
}

type ActiveTracker = {
  entryKey: string
  startedAt: number
}

const TRACKER_STORAGE_KEY = 'lot_calendar_tracker'

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m}m` : `${h}h`
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
  const [entryMinutes, setEntryMinutes] = React.useState('')

  const [activeTracker, setActiveTracker] = React.useState<ActiveTracker | null>(null)
  const [nowTick, setNowTick] = React.useState(() => Date.now())

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(TRACKER_STORAGE_KEY)
      if (raw) setActiveTracker(JSON.parse(raw))
    } catch (_) {}
  }, [])

  React.useEffect(() => {
    if (!activeTracker) return
    const interval = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [activeTracker])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
        time: log.metadata?.time as string | undefined,
        plannedMinutes: log.metadata?.plannedMinutes as number | undefined,
        logId: log.id,
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
    const timeLabel = entryTime ? ` at ${entryTime}` : ''
    const minutes = entryType === 'task' && entryMinutes ? parseInt(entryMinutes, 10) : undefined
    const durationLabel = minutes ? ` · ${formatDuration(minutes)} planned` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel}${durationLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        ...(entryTime ? { time: entryTime } : {}),
        ...(minutes ? { plannedMinutes: minutes } : {}),
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    setEntryText('')
    setEntryTime('')
    setEntryMinutes('')
    setIsAddingEntry(false)
  }

  const handleStartTracking = (entry: CalendarEntry) => {
    if (!entry.logId) return
    const tracker: ActiveTracker = { entryKey: entry.logId, startedAt: Date.now() }
    setActiveTracker(tracker)
    setNowTick(Date.now())
    try { window.localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(tracker)) } catch (_) {}
  }

  const handleStopTracking = (entry: CalendarEntry) => {
    if (!activeTracker || activeTracker.entryKey !== entry.logId) return

    const actualMinutes = Math.max(1, Math.round((Date.now() - activeTracker.startedAt) / 60000))
    const variance = entry.plannedMinutes ? actualMinutes - entry.plannedMinutes : undefined
    const varianceLabel = variance !== undefined
      ? ` (planned ${formatDuration(entry.plannedMinutes!)}, ${variance >= 0 ? '+' : ''}${variance}m)`
      : ''

    createLog({
      text: `[TIME-LOG] ${entry.type}: ${entry.text} — ${formatDuration(actualMinutes)} tracked${varianceLabel}`,
      event: 'calendar_time_logged',
      metadata: {
        date: entry.date,
        text: entry.text,
        entryType: entry.type,
        actualMinutes,
        ...(entry.plannedMinutes ? { plannedMinutes: entry.plannedMinutes, varianceMinutes: variance } : {}),
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entry.type, entry.date) } catch (_) {}
      },
    })

    setActiveTracker(null)
    try { window.localStorage.removeItem(TRACKER_STORAGE_KEY) } catch (_) {}
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
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
                  />
                  {entryType === 'task' && (
                    <input
                      type="number"
                      min={1}
                      value={entryMinutes}
                      onChange={e => setEntryMinutes(e.target.value)}
                      placeholder="min"
                      className="bg-transparent border border-acc/20 text-acc px-4 py-2 w-[64px] outline-none focus:border-acc/40"
                    />
                  )}
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => {
                  const isTracking = !!activeTracker && activeTracker.entryKey === e.logId
                  const elapsedMinutes = isTracking
                    ? Math.max(0, Math.round((nowTick - activeTracker!.startedAt) / 60000))
                    : 0

                  return (
                    <div key={i} className="mb-1">
                      <div className="flex items-baseline gap-8">
                        {e.time && <span className="text-acc/40 tabular-nums">{e.time}</span>}
                        <span className="text-acc/80">{e.text}</span>
                        {e.plannedMinutes && (
                          <span className="text-acc/30 tabular-nums">{formatDuration(e.plannedMinutes)}</span>
                        )}
                      </div>
                      {e.type === 'task' && e.logId && (
                        <div className="flex items-baseline gap-8 mt-0.5">
                          {isTracking ? (
                            <>
                              <button
                                className="text-acc/60 hover:text-acc transition-opacity"
                                onClick={() => handleStopTracking(e)}
                              >
                                Stop
                              </button>
                              <span className="text-acc/40 tabular-nums">{formatDuration(elapsedMinutes)} elapsed</span>
                            </>
                          ) : (
                            <button
                              className="text-acc/30 hover:text-acc/60 transition-opacity"
                              onClick={() => handleStartTracking(e)}
                              disabled={!!activeTracker}
                            >
                              Start
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
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
                  {entry.time && <span className="text-acc/40"> {entry.time}</span>}
                </span>
                <span className="text-acc text-right">
                  {entry.text}
                  {entry.plannedMinutes && (
                    <span className="text-acc/30"> · {formatDuration(entry.plannedMinutes)}</span>
                  )}
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
