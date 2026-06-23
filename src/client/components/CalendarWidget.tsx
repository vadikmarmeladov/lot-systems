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
  id: string
  date: string
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Alert day thresholds: fire an alert when an event is exactly N days away
const ALERT_DAYS = [0, 1, 3, 7]

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

function getDaysUntil(dateStr: string): number {
  return dayjs(dateStr).startOf('day').diff(dayjs().startOf('day'), 'day')
}

function getCountdownLabel(days: number): string {
  if (days < 0) return `+${Math.abs(days)}D`
  if (days === 0) return 'TODAY'
  if (days === 1) return 'T-1'
  return `T-${days}`
}

function getAlertLabel(daysUntil: number): string {
  if (daysUntil === 0) return 'TODAY'
  if (daysUntil === 1) return 'T-1'
  return `T-${daysUntil}`
}

// localStorage key: one alert per (logId × alertType × calendar-day)
function getAlertKey(logId: string, alertType: number, todayStr: string): string {
  return `lot_cal_alert_${todayStr}_${logId}_t${alertType}`
}

function hasAlerted(logId: string, alertType: number, todayStr: string): boolean {
  try {
    return !!localStorage.getItem(getAlertKey(logId, alertType, todayStr))
  } catch {
    return false
  }
}

function markAlerted(logId: string, alertType: number, todayStr: string): void {
  try {
    localStorage.setItem(getAlertKey(logId, alertType, todayStr), '1')
  } catch {}
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
  const [todayStr, setTodayStr] = React.useState(() => dayjs().format('YYYY-MM-DD'))

  // Keep todayStr current — re-check every minute so midnight transitions work
  React.useEffect(() => {
    const tick = () => {
      const now = dayjs().format('YYYY-MM-DD')
      setTodayStr(prev => (prev !== now ? now : prev))
    }
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        text: (log.metadata?.text as string) || log.text || '',
        type: ((log.metadata?.entryType as EntryType) || 'note'),
      }))
      .filter(e => e.id && e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  // Fire calendar_alert logs for upcoming/today events — once per day per entry per threshold
  const alertFiredRef = React.useRef(false)
  React.useEffect(() => {
    if (!entries.length) return
    // Debounce: skip if logs haven't loaded yet (no calendar entries means nothing to alert)
    let fired = false
    for (const entry of entries) {
      const daysUntil = getDaysUntil(entry.date)
      if (!ALERT_DAYS.includes(daysUntil)) continue
      if (hasAlerted(entry.id, daysUntil, todayStr)) continue

      markAlerted(entry.id, daysUntil, todayStr)
      fired = true

      const countdown = getAlertLabel(daysUntil)
      const typeLabel = entry.type.toUpperCase()
      const dateLabel = dayjs(entry.date).format('dddd, D MMM YYYY')

      createLog(
        {
          text: `[CAL ${countdown}] ${typeLabel}: ${entry.text} (${dateLabel})`,
          event: 'calendar_alert',
          metadata: {
            date: entry.date,
            text: entry.text,
            entryType: entry.type,
            daysUntil,
            countdown,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['/api/logs'])
            try { recordCalendarSignal(entry.type, entry.date) } catch (_) {}
          },
        }
      )
    }
    if (fired) alertFiredRef.current = true
  }, [entries, todayStr]) // eslint-disable-line react-hooks/exhaustive-deps

  const upcomingEntries = React.useMemo(() => {
    return entries
      .filter(e => e.date >= todayStr)
      .slice(0, 10)
  }, [entries, todayStr])

  const overdueEntries = React.useMemo(() => {
    return entries.filter(e => e.date < todayStr).slice(-3)
  }, [entries, todayStr])

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(prev => (prev === key ? null : key))
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')

    createLog(
      {
        text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel})`,
        event: 'calendar_entry',
        metadata: {
          date: selectedDate,
          text: entryText.trim(),
          entryType,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['/api/logs'])
          try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
        },
      }
    )

    setEntryText('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(x => !x)
  }

  const totalUpcoming = upcomingEntries.length
  const dateHeader = dayjs(todayStr).format('ddd D MMM')

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        {/* Header row: Add button + today's date */}
        <div className="flex items-center gap-16 mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
          <span className="text-acc/30 text-sm tabular-nums">
            {dateHeader}
            {totalUpcoming > 0 && ` · ${totalUpcoming}`}
          </span>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            {/* Month nav */}
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

            {/* Calendar grid */}
            <div className="space-y-1">
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

            {/* Entry form */}
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

            {/* Entries on selected date */}
            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="text-acc/80 mb-1 flex gap-8">
                    <span className="text-acc/30 uppercase text-xs tabular-nums w-[2.5em]">
                      {e.type.slice(0, 3).toUpperCase()}
                    </span>
                    <span>{e.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Overdue entries */}
        {overdueEntries.length > 0 && (
          <div className="space-y-1 mb-12">
            {overdueEntries.map((entry, i) => {
              const days = getDaysUntil(entry.date)
              return (
                <div key={i} className="flex gap-12 items-baseline">
                  <span className="text-acc/20 tabular-nums text-xs w-[3.5em] shrink-0">
                    {getCountdownLabel(days)}
                  </span>
                  <span className="text-acc/20 uppercase text-xs w-[2.5em] shrink-0">
                    {entry.type.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="text-acc/20 truncate">{entry.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Upcoming entries with countdown */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const days = getDaysUntil(entry.date)
              const countdown = getCountdownLabel(days)
              const isToday = days === 0
              const isTomorrow = days === 1
              const isNear = days <= 3

              return (
                <div
                  key={i}
                  className={cn(
                    'flex gap-12 items-baseline',
                    isToday && 'text-acc',
                    !isToday && isTomorrow && 'text-acc/80',
                    !isToday && !isTomorrow && isNear && 'text-acc/70',
                    !isNear && 'text-acc/50',
                  )}
                >
                  <span className="tabular-nums text-xs w-[3.5em] shrink-0 opacity-60">
                    {countdown}
                  </span>
                  <span className="uppercase text-xs w-[2.5em] shrink-0 opacity-50">
                    {entry.type.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="truncate">{entry.text}</span>
                  {days > 3 && (
                    <span className="text-xs opacity-30 shrink-0 ml-auto">
                      {dayjs(entry.date).format('MMM D')}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {upcomingEntries.length === 0 && overdueEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/30">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
