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
import { emitCalendarEvent, hasSeenReminder, markReminderSeen } from '#client/utils/calendarEvents'

type EntryType = 'note' | 'task' | 'call'
type EntryStatus = 'overdue' | 'due' | 'upcoming'

type CalendarEntry = {
  id: string
  date: string
  time: string | null
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/

// Always renders a fixed 6-week (42-day) ISO grid so every month's layout
// is deterministic — no edge-case month produces a short or ragged grid.
function getMonthWeeks(year: number, month: number): Dayjs[][] {
  const first = dayjs().year(year).month(month).date(1).startOf('day')
  const isoDay = first.day() === 0 ? 6 : first.day() - 1
  const start = first.subtract(isoDay, 'day')

  const weeks: Dayjs[][] = []
  let current = start
  for (let w = 0; w < 6; w++) {
    const week: Dayjs[] = []
    for (let i = 0; i < 7; i++) {
      week.push(current)
      current = current.add(1, 'day')
    }
    weeks.push(week)
  }
  return weeks
}

// Entry due-status relative to now — powers the [OVERDUE] / [DUE] bracket
// tags and the reminder toast. Entries without a time are treated as
// all-day: due for the whole calendar day, overdue only once the day passes.
function getEntryStatus(entry: CalendarEntry, now: Dayjs): EntryStatus {
  const entryDay = dayjs(entry.date)
  if (entryDay.isBefore(now, 'day')) return 'overdue'
  if (!entryDay.isSame(now, 'day')) return 'upcoming'

  if (entry.time && TIME_RE.test(entry.time)) {
    const [h, m] = entry.time.split(':').map(Number)
    const entryMoment = entryDay.hour(h).minute(m)
    if (entryMoment.isBefore(now)) return 'overdue'
  }
  return 'due'
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
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Live clock, minute-resolution — drives OVERDUE/DUE status transitions
  // without requiring a remount. Paused on hidden tabs to avoid idle churn.
  const [now, setNow] = React.useState(() => dayjs())
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return
      setNow(dayjs())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => {
        const time = log.metadata?.time as string | undefined
        return {
          id: log.id,
          date: log.metadata?.date as string,
          time: time && TIME_RE.test(time) ? time : null,
          text: log.metadata?.text as string || log.text || '',
          type: (log.metadata?.entryType as EntryType) || 'note',
        }
      })
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
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

  const today = now.format('YYYY-MM-DD')
  const isViewingCurrentMonth = viewMonth.isSame(now, 'month')
  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  // Sweep due/overdue entries and fire a toast once per entry per day —
  // this is the "reliable ... reminders" half of the widget: the log is
  // the source of truth, this is just the notification layer on top of it.
  React.useEffect(() => {
    entries.forEach(entry => {
      const status = getEntryStatus(entry, now)
      if (status === 'upcoming') return
      if (hasSeenReminder(entry.id, today)) return

      markReminderSeen(entry.id, today)
      const dateLabel = dayjs(entry.date).format('MMM D')
      const timeLabel = entry.time ? ` ${entry.time}Z` : ''
      emitCalendarEvent({
        code: status === 'overdue' ? 'REMINDER OVERDUE' : 'REMINDER DUE',
        message: `${entry.type.toUpperCase()} · ${dateLabel}${timeLabel} · ${entry.text}`,
        tone: status === 'overdue' ? 'overdue' : 'due',
      })
    })
  }, [entries, now, today])

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    if (selectedDate === key) {
      setSelectedDate(null)
    } else {
      setSelectedDate(key)
    }
    setIsAddingEntry(false)
  }

  const handleAddEntry = () => {
    const trimmed = entryText.trim()
    if (!selectedDate || !trimmed || isSubmitting) return

    const time = entryTime && TIME_RE.test(entryTime) ? entryTime : null
    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeLabel = time ? ` at ${time}` : ''

    setIsSubmitting(true)
    createLog({
      text: `[SCHEDULE] ${entryType}: ${trimmed} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        time,
        text: trimmed,
        entryType,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
        emitCalendarEvent({
          code: 'ENTRY LOGGED',
          message: `${entryType.toUpperCase()} · ${dayjs(selectedDate).format('MMM D')}${timeLabel} · ${trimmed}`,
          tone: 'ok',
        })
      },
      onSettled: () => setIsSubmitting(false),
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
              {!isViewingCurrentMonth && (
                <button
                  className="text-acc/30 hover:text-acc/60 transition-opacity"
                  onClick={() => setViewMonth(now)}
                >
                  Today
                </button>
              )}
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
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddEntry()
                      if (e.key === 'Escape') setIsAddingEntry(false)
                    }}
                    placeholder={`Add ${entryType}...`}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddEntry()
                      if (e.key === 'Escape') setIsAddingEntry(false)
                    }}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
                    aria-label="Time (optional)"
                  />
                  <Button onClick={handleAddEntry} disabled={!entryText.trim() || isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </Button>
                </div>
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map(e => {
                  const status = getEntryStatus(e, now)
                  return (
                    <div key={e.id} className="text-acc/80 mb-1">
                      {status !== 'upcoming' && (
                        <span className={cn('font-bold mr-4', status === 'overdue' ? 'text-red' : 'text-gold')}>
                          [{status === 'overdue' ? 'OVERDUE' : 'DUE'}]
                        </span>
                      )}
                      {e.time && <span className="text-acc/40 mr-4">{e.time}Z</span>}
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
            {upcomingEntries.map(entry => {
              const status = getEntryStatus(entry, now)
              return (
                <div key={entry.id} className="flex justify-between gap-16">
                  <span className="text-acc whitespace-nowrap">
                    {status !== 'upcoming' && (
                      <span className={cn('font-bold mr-4', status === 'overdue' ? 'text-red' : 'text-gold')}>
                        [{status === 'overdue' ? 'OVERDUE' : 'DUE'}]
                      </span>
                    )}
                    {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                    {entry.time && <span className="text-acc/40"> {entry.time}Z</span>}
                  </span>
                  <span className="text-acc text-right">
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
