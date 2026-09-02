/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useStore } from '@nanostores/react'
import { Block, Button } from '#client/components/ui'
import { useCreateLog, useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import { recordCalendarSignal } from '#client/stores/intentionEngine'
import {
  $calendarTimer,
  startCalendarTimer,
  clearCalendarTimer,
  emitCalendarOpsEvent,
  formatDuration,
} from '#client/stores/calendarOps'
import type { EntryType } from '#client/stores/calendarOps'

type CalendarEntry = {
  id: string
  date: string
  text: string
  type: EntryType
}

const SITREP_STORAGE_KEY = 'lot_calendar_last_sitrep_date'

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

  const activeTimer = useStore($calendarTimer)
  const [nowTick, setNowTick] = React.useState(() => Date.now())

  // Repaint elapsed time once a second while a timer is live; idle otherwise.
  React.useEffect(() => {
    if (!activeTimer) return
    const interval = setInterval(() => setNowTick(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [activeTimer])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  // Total tracked time per entry, keyed by the originating entry's log id —
  // summed from every 'calendar_timer_stop' segment logged against it.
  const trackedMsByEntry = React.useMemo(() => {
    const totals = new Map<string, number>()
    logs
      .filter(log => log.event === 'calendar_timer_stop' && log.metadata)
      .forEach(log => {
        const entryId = log.metadata?.entryId as string | undefined
        const durationMs = log.metadata?.durationMs as number | undefined
        if (!entryId || typeof durationMs !== 'number') return
        totals.set(entryId, (totals.get(entryId) || 0) + durationMs)
      })
    return totals
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

  // Once-per-day SITREP — fires at most once per calendar day per browser,
  // so reopening the app doesn't re-alert on entries already surfaced.
  React.useEffect(() => {
    const dueToday = entries.filter(e => e.date === today)
    if (dueToday.length === 0) return

    try {
      const lastAlerted = window.localStorage.getItem(SITREP_STORAGE_KEY)
      if (lastAlerted === today) return
      window.localStorage.setItem(SITREP_STORAGE_KEY, today)
    } catch {
      // Storage unavailable — proceed without dedupe rather than staying silent.
    }

    const label = dueToday.length === 1 ? '1 ITEM DUE TODAY' : `${dueToday.length} ITEMS DUE TODAY`
    emitCalendarOpsEvent('SITREP', label)
  }, [entries, today])

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

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
        emitCalendarOpsEvent('LOG FILED', `${entryType} · ${dateLabel}`)
      },
    })

    setEntryText('')
    setIsAddingEntry(false)
  }

  /**
   * Engage/secure the tracked-time clock for one entry. Only one timer runs
   * at a time — starting a new one first secures (logs) whatever was live,
   * so no segment is ever silently dropped.
   */
  const handleToggleTimer = (entry: CalendarEntry) => {
    const running = $calendarTimer.get()

    if (running && running.entryId === entry.id) {
      const durationMs = Date.now() - running.startedAt
      createLog({
        text: `[OPS] TIMER SECURED — ${entry.type}: ${entry.text} (${formatDuration(durationMs)})`,
        event: 'calendar_timer_stop',
        metadata: {
          entryId: entry.id,
          date: entry.date,
          text: entry.text,
          entryType: entry.type,
          startedAt: running.startedAt,
          stoppedAt: Date.now(),
          durationMs,
        },
      }, {
        onSuccess: () => queryClient.refetchQueries(['/api/logs']),
      })
      clearCalendarTimer()
      emitCalendarOpsEvent('TIMER SECURED', `${entry.text} · ${formatDuration(durationMs)} logged`)
      return
    }

    if (running) {
      const priorDurationMs = Date.now() - running.startedAt
      createLog({
        text: `[OPS] TIMER SECURED — ${running.entryType}: ${running.text} (${formatDuration(priorDurationMs)})`,
        event: 'calendar_timer_stop',
        metadata: {
          entryId: running.entryId,
          date: running.date,
          text: running.text,
          entryType: running.entryType,
          startedAt: running.startedAt,
          stoppedAt: Date.now(),
          durationMs: priorDurationMs,
        },
      }, {
        onSuccess: () => queryClient.refetchQueries(['/api/logs']),
      })
    }

    createLog({
      text: `[OPS] TIMER ENGAGED — ${entry.type}: ${entry.text}`,
      event: 'calendar_timer_start',
      metadata: {
        entryId: entry.id,
        date: entry.date,
        text: entry.text,
        entryType: entry.type,
        startedAt: Date.now(),
      },
    })
    startCalendarTimer({ entryId: entry.id, date: entry.date, text: entry.text, entryType: entry.type })
    emitCalendarOpsEvent('TIMER ENGAGED', `${entry.type}: ${entry.text}`)
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
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e) => {
                  const isRunningThis = activeTimer?.entryId === e.id
                  const elapsedMs = isRunningThis ? nowTick - activeTimer!.startedAt : 0
                  const trackedMs = trackedMsByEntry.get(e.id) || 0

                  return (
                    <div key={e.id} className="flex items-center justify-between gap-8 mb-1">
                      <span className="text-acc/80">{e.text}</span>
                      <div className="flex items-center gap-8 whitespace-nowrap">
                        {!isRunningThis && trackedMs > 0 && (
                          <span className="text-acc/30 text-[11px]">{formatDuration(trackedMs)}</span>
                        )}
                        <button
                          onClick={() => handleToggleTimer(e)}
                          className={cn(
                            'text-[11px] uppercase tracking-wide transition-opacity',
                            isRunningThis ? 'text-acc' : 'text-acc/30 hover:text-acc/60'
                          )}
                        >
                          {isRunningThis ? `■ ${formatDuration(elapsedMs)}` : '▶ Track'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry) => (
              <div key={entry.id} className="flex justify-between gap-16">
                <span className="text-acc whitespace-nowrap">
                  {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                  {activeTimer?.entryId === entry.id && (
                    <span className="text-acc/40"> · ● tracking</span>
                  )}
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
