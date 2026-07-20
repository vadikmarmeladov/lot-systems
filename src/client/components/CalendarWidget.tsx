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

type EntryType = 'note' | 'task' | 'call'

type EntryStatus = 'scheduled' | 'due' | 'overdue'

type CalendarEntry = {
  id: string
  date: string
  time?: string
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Entries fire an in-widget notification once, within 30min of the scheduled
// time. Persisted so a reload does not re-fire an already-seen event.
const NOTIFIED_KEY = 'lot_calendar_notified_v1'
const NOTIFIED_CAP = 300

function loadNotified(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch (_) {
    return new Set()
  }
}

function saveNotified(keys: Set<string>) {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(Array.from(keys).slice(-NOTIFIED_CAP)))
  } catch (_) {}
}

function getEntryStatus(entry: CalendarEntry, now: Dayjs): EntryStatus {
  if (!entry.time) return 'scheduled'
  const target = dayjs(`${entry.date} ${entry.time}`)
  if (!target.isValid()) return 'scheduled'
  const diffMin = now.diff(target, 'minute')
  if (diffMin >= 0) return 'overdue'
  if (diffMin >= -15) return 'due'
  return 'scheduled'
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
  const [entryTime, setEntryTime] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [now, setNow] = React.useState(() => dayjs())

  const [toastEntry, setToastEntry] = React.useState<CalendarEntry | null>(null)
  const [toastVisible, setToastVisible] = React.useState(false)
  const notifiedRef = React.useRef<Set<string> | null>(null)
  if (!notifiedRef.current) notifiedRef.current = loadNotified()

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
      .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
  }, [logs])

  // Clock tick — drives due/overdue status. Paused off-tab and off-page.
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden || !isRouteActive('system')) return
      setNow(dayjs())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Event notification — fires once, in-widget, when a timed entry's
  // scheduled moment arrives. No OS push, no permission prompt: the
  // system surfaces at the right moment, never interrupts off-page.
  React.useEffect(() => {
    const check = () => {
      if (document.hidden || !isRouteActive('system')) return
      const nowTs = dayjs()
      for (const entry of entries) {
        if (!entry.time) continue
        const key = entry.id || `${entry.date}|${entry.time}|${entry.text}`
        if (notifiedRef.current!.has(key)) continue
        const target = dayjs(`${entry.date} ${entry.time}`)
        if (!target.isValid()) continue
        const diffMin = nowTs.diff(target, 'minute')
        if (diffMin >= 0 && diffMin <= 30) {
          notifiedRef.current!.add(key)
          saveNotified(notifiedRef.current!)
          setToastEntry(entry)
          window.requestAnimationFrame(() => setToastVisible(true))
          window.setTimeout(() => setToastVisible(false), 6000)
          window.setTimeout(() => setToastEntry(null), 6600)
          break
        }
      }
    }
    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [entries])

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

    const time = entryTime.trim()
    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeLabel = time ? ` at ${time}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        ...(time ? { time } : {}),
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
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-2 outline-none focus:border-acc/40 focus:text-acc"
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
                    <div key={e.id || i} className="flex justify-between gap-16 text-acc/80 mb-1">
                      <span>
                        {e.time && <span className="text-acc/60 tabular-nums">{e.time} </span>}
                        {e.text}
                      </span>
                      {status !== 'scheduled' && (
                        <span className={cn(
                          'tracking-widest whitespace-nowrap',
                          status === 'overdue' ? 'text-acc' : 'text-acc/60'
                        )}>
                          {status.toUpperCase()}
                        </span>
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
            {upcomingEntries.map((entry, i) => {
              const status = getEntryStatus(entry, now)
              return (
                <div key={entry.id || i} className="flex justify-between gap-16">
                  <span className="text-acc whitespace-nowrap">
                    {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                    {entry.time && <span className="text-acc/60 tabular-nums"> · {entry.time}</span>}
                  </span>
                  <span className="text-acc text-right">
                    {entry.text}
                    {status !== 'scheduled' && (
                      <span className={cn(
                        'tracking-widest ml-8',
                        status === 'overdue' ? 'text-acc' : 'text-acc/60'
                      )}>
                        {status.toUpperCase()}
                      </span>
                    )}
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

      {toastEntry && (
        <div
          className={cn(
            'fixed bottom-16 left-1/2 -translate-x-1/2 z-50',
            'px-16 py-8 border border-acc/20 bg-[var(--base-color)]',
            'transition-all duration-500 ease-out',
            toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="text-center">
            <div className="text-acc/40 tracking-widest uppercase mb-4">
              Event Due — {toastEntry.type}
            </div>
            <div className="text-acc tabular-nums">
              {toastEntry.time} — {toastEntry.text}
            </div>
          </div>
        </div>
      )}
    </Block>
  )
}
