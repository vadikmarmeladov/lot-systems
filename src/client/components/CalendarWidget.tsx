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
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const TYPE_CODE: Record<EntryType, string> = {
  note: 'NOTE',
  task: 'TASK',
  call: 'CALL',
}

function getMonthWeeks(year: number, month: number): Dayjs[][] {
  const first = dayjs().year(year).month(month).startOf('month')
  const last = dayjs().year(year).month(month).endOf('month')

  const isoDay = first.day() === 0 ? 6 : first.day() - 1
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

function getDaysUntil(date: string): number {
  return dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'day')
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const firedAlertsRef = React.useRef<Set<string>>(new Set())

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  // Notification system: fire calendar_alert logs for due, standby, and overdue events
  React.useEffect(() => {
    if (!entries.length) return

    const todayKey = dayjs().format('YYYY-MM-DD')
    const storageKey = `lot-cal-alerts-${todayKey}`

    let storedList: string[] = []
    try {
      storedList = JSON.parse(localStorage.getItem(storageKey) || '[]')
    } catch {
      storedList = []
    }
    const stored = new Set<string>(storedList)

    const toAlert: Array<{ entry: CalendarEntry; daysUntil: number }> = []

    for (const entry of entries) {
      const daysUntil = getDaysUntil(entry.date)
      // Alert window: tomorrow (1), today (0), and up to 30 days overdue
      if (daysUntil > 1 || daysUntil < -30) continue

      const alertKey = `${entry.date}:${entry.text}`
      if (stored.has(alertKey) || firedAlertsRef.current.has(alertKey)) continue

      firedAlertsRef.current.add(alertKey)
      toAlert.push({ entry, daysUntil })
    }

    if (!toAlert.length) return

    const allStored = new Set([...stored, ...toAlert.map(a => `${a.entry.date}:${a.entry.text}`)])
    try {
      localStorage.setItem(storageKey, JSON.stringify([...allStored]))
    } catch {}

    for (const { entry, daysUntil } of toAlert) {
      const status = daysUntil < 0 ? 'OVERDUE' : daysUntil === 0 ? 'ACTIVE' : 'STANDBY'
      createLog(
        {
          text: `[${status}] ${TYPE_CODE[entry.type]}: ${entry.text} — ${entry.date}`,
          event: 'calendar_alert',
          metadata: {
            date: entry.date,
            text: entry.text,
            entryType: entry.type,
            daysUntil,
            status,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['/api/logs'])
          },
        }
      )
    }
  }, [entries]) // eslint-disable-line react-hooks/exhaustive-deps

  const today = dayjs().format('YYYY-MM-DD')

  const upcomingEntries = React.useMemo(() => {
    return entries.filter(e => e.date >= today)
  }, [entries, today])

  const overdueEntries = React.useMemo(() => {
    return entries
      .filter(e => e.date < today)
      .slice(-5)
      .reverse()
  }, [entries, today])

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
      text: `${entryType}: ${entryText.trim()} (${dateLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    setEntryText('')
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
            Add entry
          </Button>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            <div className="flex items-center gap-8 mb-8">
              <button
                className="text-acc/40 hover:text-acc text-sm transition-opacity"
                onClick={() => setViewMonth(viewMonth.subtract(1, 'month'))}
              >
                {'<—'}
              </button>
              <span className="text-acc text-sm">
                {viewMonth.format('MMMM, YYYY')}
              </span>
              <button
                className="text-acc/40 hover:text-acc text-sm transition-opacity"
                onClick={() => setViewMonth(viewMonth.add(1, 'month'))}
              >
                {'—>'}
              </button>
            </div>

            <div className="text-sm space-y-1">
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
                          'text-sm py-0.5 px-0.5 transition-opacity whitespace-nowrap',
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
                    <div className="text-acc/30 text-sm flex items-center ml-4 whitespace-nowrap">
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
                        'text-xs transition-opacity capitalize',
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
                    className="bg-transparent border border-acc/20 text-acc text-sm px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 text-xs mb-4 uppercase tracking-widest">
                  {dayjs(selectedDate).format('ddd DD MMM YYYY')}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="text-sm mb-1 flex gap-8">
                    <span className="text-acc/40 text-xs font-mono">{TYPE_CODE[e.type]}</span>
                    <span className="text-acc/80">{e.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming operations */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.slice(0, 10).map((entry, i) => {
              const daysUntil = getDaysUntil(entry.date)
              const isToday = daysUntil === 0
              return (
                <div key={i} className="flex gap-8 text-sm items-baseline">
                  <span className={cn(
                    'text-xs font-mono tracking-wider whitespace-nowrap w-12 shrink-0',
                    isToday ? 'text-acc' : 'text-acc/40'
                  )}>
                    {isToday ? 'T+0' : `T-${daysUntil}d`}
                  </span>
                  <span className="text-acc/40 text-xs whitespace-nowrap shrink-0 w-8">
                    {TYPE_CODE[entry.type]}
                  </span>
                  <span className={cn(
                    'text-sm flex-1',
                    isToday ? 'text-acc' : 'text-acc/80'
                  )}>
                    {entry.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Overdue entries */}
        {overdueEntries.length > 0 && (
          <div className="space-y-1 mt-8">
            {overdueEntries.map((entry, i) => {
              const elapsed = Math.abs(getDaysUntil(entry.date))
              return (
                <div key={i} className="flex gap-8 text-sm items-baseline">
                  <span className="text-acc/25 text-xs font-mono tracking-wider whitespace-nowrap w-12 shrink-0">
                    +{elapsed}d
                  </span>
                  <span className="text-acc/25 text-xs whitespace-nowrap shrink-0 w-8">
                    {TYPE_CODE[entry.type]}
                  </span>
                  <span className="text-acc/25 text-sm flex-1 line-through">
                    {entry.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {upcomingEntries.length === 0 && overdueEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40 text-sm">No scheduled operations.</div>
        )}
      </div>
    </Block>
  )
}
