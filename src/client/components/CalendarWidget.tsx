/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { Block, Button, GhostButton } from '#client/components/ui'
import { useCreateLog, useLogs, useUpdateLog } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import { recordCalendarSignal } from '#client/stores/intentionEngine'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  id: string
  date: string
  time?: string
  text: string
  type: EntryType
}

// How long after an entry's scheduled time it still counts as "due" and can
// trigger the EVT alert — a tab left in the background for a few minutes
// shouldn't miss the notification entirely.
const DUE_WINDOW_MINUTES = 15
const ACK_STORAGE_KEY = 'lot_calendar_acked_events'

function readAckedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(ACK_STORAGE_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch (_) {
    return new Set()
  }
}

function writeAckedIds(ids: Set<string>) {
  try {
    // Cap stored history — only the most recent acks matter for dedup.
    localStorage.setItem(ACK_STORAGE_KEY, JSON.stringify(Array.from(ids).slice(-200)))
  } catch (_) {
    // localStorage unavailable (private mode / quota) — alert simply
    // won't dedup across reloads, non-fatal.
  }
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
  const { mutate: updateLog } = useUpdateLog({
    onSuccess: () => queryClient.refetchQueries(['/api/logs']),
  })

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryTime, setEntryTime] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [dueAlert, setDueAlert] = React.useState<CalendarEntry | null>(null)

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        time: (log.metadata?.time as string) || undefined,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '99:99').localeCompare(b.time || '99:99'))
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
    const time = entryTime || undefined
    const timeLabel = time ? ` — ${time}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()}${timeLabel} (${dateLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        time,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!, time) } catch (_) {}
      },
    })

    setEntryText('')
    setEntryTime('')
    setIsAddingEntry(false)
  }

  const handleRemoveEntry = (id: string) => {
    updateLog({ id, text: '' })
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setViewMonth(dayjs())
    }
    setIsCalendarOpen(!isCalendarOpen)
  }

  // EVT alert — military-grade due notification. Fires once a timed entry's
  // scheduled moment arrives, stays up until acknowledged or the due window
  // (DUE_WINDOW_MINUTES) closes. Gated on tab visibility so hidden tabs don't
  // burn cycles; checked on mount and every 20s thereafter.
  React.useEffect(() => {
    const checkDue = () => {
      const acked = readAckedIds()
      const now = dayjs()
      const due = entries.find(e => {
        if (!e.time || acked.has(e.id)) return false
        const at = dayjs(`${e.date}T${e.time}`)
        const diffMin = now.diff(at, 'minute')
        return diffMin >= 0 && diffMin <= DUE_WINDOW_MINUTES
      })
      setDueAlert(due || null)
    }

    checkDue()
    const interval = setInterval(() => {
      if (document.hidden) return
      checkDue()
    }, 20000)
    return () => clearInterval(interval)
  }, [entries])

  const handleAckDueAlert = () => {
    if (!dueAlert) return
    const acked = readAckedIds()
    acked.add(dueAlert.id)
    writeAckedIds(acked)
    setDueAlert(null)
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
                    aria-label="Entry time (optional)"
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
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
                {entriesOnDate.map(e => (
                  <div key={e.id} className="group flex justify-between items-baseline gap-8 mb-1">
                    <span className="text-acc/80">
                      {e.time && <span className="text-acc/40 tabular-nums mr-4">{e.time}</span>}
                      {e.text}
                    </span>
                    <button
                      className="text-acc/0 group-hover:text-acc/50 transition-opacity whitespace-nowrap"
                      onClick={() => handleRemoveEntry(e.id)}
                      aria-label={`Remove ${e.text}`}
                    >
                      remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map(entry => (
              <div key={entry.id} className="group flex justify-between gap-16">
                <span className="text-acc whitespace-nowrap">
                  {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                  {entry.time && <span className="text-acc/40 tabular-nums"> · {entry.time}</span>}
                </span>
                <span className="text-acc text-right flex items-baseline gap-8 justify-end">
                  {entry.text}
                  <button
                    className="text-acc/0 group-hover:text-acc/50 transition-opacity whitespace-nowrap"
                    onClick={() => handleRemoveEntry(entry.id)}
                    aria-label={`Remove ${entry.text}`}
                  >
                    remove
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>

      {dueAlert && (
        <div
          className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50
                     px-16 py-8 border border-acc/20 bg-[var(--base-color)] grid-fill-light"
          style={{ animation: 'calEvtIn 0.4s ease-out' }}
        >
          <div className="flex items-center gap-16">
            <div>
              <div className="text-acc/30 tracking-widest uppercase text-xs">EVT [DUE]:</div>
              <div className="text-acc uppercase tracking-widest">
                {dueAlert.type} · {dueAlert.time}
              </div>
              <div className="text-acc/60 mt-4">{dueAlert.text}</div>
            </div>
            <GhostButton onClick={handleAckDueAlert}>ACK</GhostButton>
          </div>
        </div>
      )}
    </Block>
  )
}

if (typeof document !== 'undefined' && !document.getElementById('lot-calendar-evt-keyframes')) {
  const style = document.createElement('style')
  style.id = 'lot-calendar-evt-keyframes'
  style.textContent = `
    @keyframes calEvtIn {
      from { opacity: 0; transform: translate(-50%, 10px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
  `
  document.head.appendChild(style)
}
