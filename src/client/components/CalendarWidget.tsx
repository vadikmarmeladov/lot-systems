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
type EntryStatusCode = 'OVERDUE' | 'IMMINENT' | 'SCHEDULED'

type CalendarEntry = {
  id: string
  date: string
  time?: string
  text: string
  type: EntryType
}

type EntryStatus = {
  code: EntryStatusCode
  label: string
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const ALERTS_FIRED_KEY = 'calendar_alerts_fired'
const CLOCK_TICK_MS = 30000

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

// Resolves an entry to its target instant: exact time if set, else end-of-day
// (an all-day item is only "due" once its day has fully elapsed).
function getEntryDateTime(entry: CalendarEntry): Dayjs {
  const base = dayjs(entry.date)
  if (!entry.time) return base.endOf('day')
  const [h, m] = entry.time.split(':').map(Number)
  return base.hour(h).minute(m).second(0).millisecond(0)
}

function getEntryStatus(entry: CalendarEntry, now: Dayjs): EntryStatus {
  const target = getEntryDateTime(entry)
  const diffMin = target.diff(now, 'minute')
  if (diffMin < 0) return { code: 'OVERDUE', label: 'OVERDUE' }
  if (diffMin <= 60) return { code: 'IMMINENT', label: `T-${Math.max(diffMin, 0)}M` }
  return { code: 'SCHEDULED', label: '' }
}

function loadFiredAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem(ALERTS_FIRED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch (_) {
    return new Set()
  }
}

function saveFiredAlerts(fired: Set<string>) {
  try {
    localStorage.setItem(ALERTS_FIRED_KEY, JSON.stringify(Array.from(fired)))
  } catch (_) {}
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
  const [entryTime, setEntryTime] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [now, setNow] = React.useState(() => dayjs())

  // Ticking clock — keeps OVERDUE/T-minus status live without a page refresh.
  React.useEffect(() => {
    const intervalId = setInterval(() => setNow(dayjs()), CLOCK_TICK_MS)
    return () => clearInterval(intervalId)
  }, [])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        time: log.metadata?.time as string | undefined,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) =>
        a.date === b.date
          ? (a.time || '').localeCompare(b.time || '')
          : a.date.localeCompare(b.date)
      )
  }, [logs])

  const upcomingEntries = React.useMemo(() => {
    const today = now.format('YYYY-MM-DD')
    return entries
      .filter(e => e.date >= today)
      .slice(0, 10)
  }, [entries, now])

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  // Fire a stylish, military-grade Log notification the first time an entry
  // crosses into OVERDUE. Dedup via localStorage so a single entry alerts once.
  React.useEffect(() => {
    const today = now.format('YYYY-MM-DD')
    const overdue = entries.filter(e => e.date <= today && getEntryStatus(e, now).code === 'OVERDUE')
    if (!overdue.length) return

    const fired = loadFiredAlerts()
    const toFire = overdue.filter(e => !fired.has(e.id))
    if (!toFire.length) return

    toFire.forEach(entry => {
      const sector = entry.time ? entry.time.replace(':', '') : 'ALLDAY'
      createLog({
        text: `[CAL-ALERT] OVERDUE ${entry.type}: ${entry.text} (${entry.date}${entry.time ? ` ${entry.time}` : ''})`,
        event: 'calendar_alert',
        metadata: {
          entryId: entry.id,
          status: 'OVERDUE',
          entryType: entry.type,
          date: entry.date,
          time: entry.time,
          text: entry.text,
          sector,
        },
      }, {
        onSuccess: () => { queryClient.refetchQueries(['/api/logs']) },
      })
      fired.add(entry.id)
    })
    saveFiredAlerts(fired)
  }, [entries, now, createLog, queryClient])

  const today = now.format('YYYY-MM-DD')
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
    const timeLabel = entryTime ? ` @ ${entryTime}` : ''

    createLog({
      text: `[SCHED] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
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

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setViewMonth(now)
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
                <div className="flex gap-8 items-center mb-8">
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
                  />
                  <span className="text-acc/30">time (optional)</span>
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
                {entriesOnDate.map((e, i) => {
                  const status = getEntryStatus(e, now)
                  return (
                    <div key={i} className="text-acc/80 mb-1">
                      {e.time && <span className="opacity-60 tabular-nums mr-8">{e.time}</span>}
                      {status.code !== 'SCHEDULED' && (
                        <span className={cn(
                          'tracking-widest mr-8',
                          status.code === 'OVERDUE' ? 'font-bold underline' : 'opacity-60'
                        )}>
                          [{status.label}]
                        </span>
                      )}
                      {e.text}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const status = getEntryStatus(entry, now)
              return (
                <div key={i} className="flex justify-between gap-16">
                  <span className="text-acc whitespace-nowrap">
                    {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                    {entry.time && <span className="opacity-60"> {entry.time}</span>}
                  </span>
                  <span className="text-acc text-right">
                    {status.code !== 'SCHEDULED' && (
                      <span className={cn(
                        'tracking-widest mr-8',
                        status.code === 'OVERDUE' ? 'font-bold underline' : 'opacity-60'
                      )}>
                        [{status.label}]
                      </span>
                    )}
                    {entry.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
