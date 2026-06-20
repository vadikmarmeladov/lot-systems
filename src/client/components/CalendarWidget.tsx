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

type EntryStatus = 'overdue' | 'elapsed' | 'today' | 'tomorrow' | 'upcoming'

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

function getEntryStatus(entry: CalendarEntry, now: Dayjs): { status: EntryStatus; label: string } {
  const today = now.format('YYYY-MM-DD')

  if (entry.date < today) return { status: 'overdue', label: 'OVERDUE' }

  if (entry.date === today) {
    if (entry.time) {
      const eventTime = dayjs(`${entry.date} ${entry.time}`, 'YYYY-MM-DD HH:mm')
      if (eventTime.isBefore(now)) return { status: 'elapsed', label: 'ELAPSED' }
      const diffM = eventTime.diff(now, 'minute')
      if (diffM < 60) return { status: 'today', label: `in ${diffM}m` }
      return { status: 'today', label: `in ${Math.floor(diffM / 60)}h` }
    }
    return { status: 'today', label: 'TODAY' }
  }

  const diffDays = dayjs(entry.date).diff(now.startOf('day'), 'day')
  if (diffDays === 1) return { status: 'tomorrow', label: 'TOMORROW' }
  return { status: 'upcoming', label: `in ${diffDays}d` }
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

  // Live clock — updates every minute to keep status labels accurate
  React.useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 60_000)
    return () => clearInterval(id)
  }, [])

  const today = now.format('YYYY-MM-DD')

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        time: (log.metadata?.time as string) || undefined,
        text: (log.metadata?.text as string) || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => {
        const d = a.date.localeCompare(b.date)
        if (d !== 0) return d
        if (a.time && b.time) return a.time.localeCompare(b.time)
        if (a.time) return -1
        if (b.time) return 1
        return 0
      })
  }, [logs])

  // Track which entries have already triggered a notification log today
  const notifiedTodayIds = React.useMemo(() => {
    const todayStr = now.format('YYYY-MM-DD')
    return new Set(
      logs
        .filter(log =>
          log.event === 'calendar_notification' &&
          dayjs(log.createdAt).format('YYYY-MM-DD') === todayStr
        )
        .map(log => `${log.metadata?.date}|${log.metadata?.entryType}|${log.metadata?.originalEntryText}`)
    )
  }, [logs, now])

  // In-flight guard — prevents duplicate fire before query refetches
  const notifyingRef = React.useRef(new Set<string>())

  // Emit calendar_notification logs for today/overdue entries not yet notified
  React.useEffect(() => {
    if (entries.length === 0) return

    const candidates = entries.filter(e => e.date <= today)
    if (candidates.length === 0) return

    const fresh = candidates.filter(e => {
      const id = `${e.date}|${e.type}|${e.text}`
      return !notifiedTodayIds.has(id) && !notifyingRef.current.has(id)
    })

    if (fresh.length === 0) return

    fresh.forEach(e => {
      const id = `${e.date}|${e.type}|${e.text}`
      notifyingRef.current.add(id)

      const { label } = getEntryStatus(e, now)
      const dateLabel = dayjs(e.date).format('YYYY-MM-DD')
      const timeLabel = e.time ? ` ${e.time}` : ''

      createLog(
        {
          text: `[SIGNAL] CALENDAR — ${TYPE_CODE[e.type]}: ${e.text} — STATUS: ${label} (${dateLabel}${timeLabel})`,
          event: 'calendar_notification',
          metadata: {
            date: e.date,
            time: e.time ?? null,
            entryType: e.type,
            status: label,
            originalEntryText: e.text,
          },
        },
        { onSuccess: () => queryClient.invalidateQueries(['/api/logs']) }
      )
    })
  }, [entries, notifiedTodayIds, today])

  const activeEntries = React.useMemo(
    () => entries.filter(e => e.date <= today),
    [entries, today]
  )

  const upcomingEntries = React.useMemo(
    () => entries.filter(e => e.date > today).slice(0, 10),
    [entries, today]
  )

  const entriesOnDate = React.useMemo(
    () => (selectedDate ? entries.filter(e => e.date === selectedDate) : []),
    [entries, selectedDate]
  )

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
    const timeLabel = entryTime ? ` ${entryTime}` : ''

    createLog(
      {
        text: `[SCHEDULE] ${TYPE_CODE[entryType]}: ${entryText.trim()}${timeLabel} (${dateLabel})`,
        event: 'calendar_entry',
        metadata: {
          date: selectedDate,
          time: entryTime || undefined,
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
    setEntryTime('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(v => !v)
  }

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
        </div>

        {/* Active / overdue entries — always visible */}
        {activeEntries.length > 0 && (
          <div className="mb-16 space-y-1">
            {activeEntries.map((entry, i) => {
              const { status, label } = getEntryStatus(entry, now)
              const isOverdue = status === 'overdue'
              const isElapsed = status === 'elapsed'
              return (
                <div key={i} className="flex items-baseline gap-8">
                  <span
                    className={cn(
                      'text-[10px] font-mono tracking-widest whitespace-nowrap',
                      isOverdue || isElapsed ? 'text-acc/60' : 'text-acc'
                    )}
                  >
                    {label}
                  </span>
                  <span className="text-acc/40 text-[10px] font-mono whitespace-nowrap">
                    [{TYPE_CODE[entry.type]}]
                  </span>
                  <span
                    className={cn(
                      isOverdue || isElapsed ? 'text-acc/40 line-through' : 'text-acc'
                    )}
                  >
                    {entry.text}
                  </span>
                  {entry.time && (
                    <span className="text-acc/40 text-[10px] font-mono whitespace-nowrap ml-4">
                      {entry.time}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Calendar grid */}
        {isCalendarOpen && (
          <div className="mb-16">
            <div className="flex items-center gap-8 mb-8">
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(v => v.subtract(1, 'month'))}
              >
                {'<—'}
              </button>
              <span className="text-acc">{viewMonth.format('MMMM, YYYY')}</span>
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(v => v.add(1, 'month'))}
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
                    const isPast = key < today

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
                          isCurrentMonth && !isToday && !isPast && 'text-acc/40',
                          isCurrentMonth && !isToday && isPast && 'text-acc/20',
                          isToday && 'text-acc',
                          hasEntry && isCurrentMonth && !isToday && 'text-acc/60',
                        )}
                      >
                        {DAY_LETTERS[di]}{d.date()}
                      </button>
                    )
                  })}

                  {wi === 0 && (
                    <div className="flex items-center ml-4 whitespace-nowrap">
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
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-2 outline-none focus:border-acc/40 w-[88px] font-mono text-sm"
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
                  <div key={i} className="flex items-baseline gap-8 mb-1">
                    <span className="text-acc/40 text-[10px] font-mono">
                      [{TYPE_CODE[e.type]}]
                    </span>
                    <span className="text-acc/80">{e.text}</span>
                    {e.time && (
                      <span className="text-acc/40 text-[10px] font-mono">{e.time}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming entries */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const { label } = getEntryStatus(entry, now)
              return (
                <div key={i} className="flex items-baseline gap-8">
                  <span className="text-acc whitespace-nowrap">
                    {dayjs(entry.date).format('ddd, MMM D')}
                  </span>
                  {entry.time && (
                    <span className="text-acc/40 text-[10px] font-mono whitespace-nowrap">
                      {entry.time}
                    </span>
                  )}
                  <span className="text-acc/40 text-[10px] font-mono whitespace-nowrap">
                    {label}
                  </span>
                  <span className="text-acc/40 text-[10px] font-mono whitespace-nowrap">
                    [{TYPE_CODE[entry.type]}]
                  </span>
                  <span className="text-acc">{entry.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {activeEntries.length === 0 && upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
