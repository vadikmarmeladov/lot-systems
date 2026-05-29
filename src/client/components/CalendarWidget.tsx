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
import { useCreateLog, useDeleteLog, useLogs } from '#client/queries'
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

// Alert horizon: fire notifications for events this many days out
const ALERT_HORIZON = 2
const ALERT_STORAGE_KEY = 'calendar-alerts'

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

function getEta(date: string, today: string): string {
  const daysUntil = dayjs(date).diff(dayjs(today), 'day')
  if (daysUntil === 0) return 'TODAY'
  if (daysUntil === 1) return 'T-1'
  return `T-${daysUntil}`
}

function alertKey(entry: CalendarEntry, today: string): string {
  const slug = entry.text.slice(0, 24).toLowerCase().replace(/\s+/g, '-')
  return `${today}|${entry.date}|${entry.type}|${slug}`
}

function loadAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem(ALERT_STORAGE_KEY)
    if (!raw) return new Set()
    const items: string[] = JSON.parse(raw)
    const cutoff = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
    return new Set(items.filter(k => (k.split('|')[0] ?? '') >= cutoff))
  } catch {
    return new Set()
  }
}

function saveAlerts(alerts: Set<string>) {
  try {
    const cutoff = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
    const valid = [...alerts].filter(k => (k.split('|')[0] ?? '') >= cutoff)
    localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(valid))
  } catch {}
}

function buildAlertText(entry: CalendarEntry, today: string): string {
  const daysUntil = dayjs(entry.date).diff(dayjs(today), 'day')
  const typeCode = entry.type === 'note' ? 'NOTE' : entry.type === 'task' ? 'TASK' : 'COMMS'
  const eta =
    daysUntil === 0 ? 'EXECUTE: TODAY' :
    daysUntil === 1 ? 'ETA: T-1 DAY' :
    `ETA: T-${daysUntil} DAYS`
  return `[CAL/${typeCode}] ${entry.text.toUpperCase()} — ${eta}`
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const { mutate: deleteLog } = useDeleteLog()

  // Live clock — updates every minute so ETAs stay fresh
  const [now, setNow] = React.useState(() => dayjs())
  React.useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 60_000)
    return () => clearInterval(id)
  }, [])

  const today = now.format('YYYY-MM-DD')

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null)

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        text: (log.metadata?.text as string) || log.text || '',
        type: ((log.metadata?.entryType as EntryType) || 'note'),
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  const upcomingEntries = React.useMemo(() => {
    return entries.filter(e => e.date >= today).slice(0, 10)
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

  // Military-grade event notifications: fire once per day per upcoming event within horizon
  React.useEffect(() => {
    if (upcomingEntries.length === 0) return

    const firedAlerts = loadAlerts()
    const horizon = dayjs(today).add(ALERT_HORIZON, 'day').format('YYYY-MM-DD')

    const toFire = upcomingEntries.filter(e => {
      if (e.date > horizon) return false
      return !firedAlerts.has(alertKey(e, today))
    })

    if (toFire.length === 0) return

    const timeouts: ReturnType<typeof setTimeout>[] = []

    toFire.forEach((entry, i) => {
      const t = setTimeout(() => {
        createLog(
          {
            text: buildAlertText(entry, today),
            event: 'calendar_alert',
            metadata: { date: entry.date, entryType: entry.type },
          },
          {
            onSuccess: () => {
              const key = alertKey(entry, today)
              firedAlerts.add(key)
              saveAlerts(firedAlerts)
              queryClient.invalidateQueries(['/api/logs'])
            },
          }
        )
      }, i * 600)
      timeouts.push(t)
    })

    return () => timeouts.forEach(clearTimeout)
  }, [upcomingEntries, today])

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(selectedDate === key ? null : key)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')

    createLog(
      {
        text: `${entryType}: ${entryText.trim()} (${dateLabel})`,
        event: 'calendar_entry',
        metadata: { date: selectedDate, text: entryText.trim(), entryType },
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

  const handleDeleteEntry = (entry: CalendarEntry) => {
    if (confirmDeleteId === entry.id) {
      deleteLog(
        { id: entry.id },
        {
          onSuccess: () => {
            setConfirmDeleteId(null)
            queryClient.invalidateQueries(['/api/logs'])
          },
        }
      )
    } else {
      setConfirmDeleteId(entry.id)
      setTimeout(
        () => setConfirmDeleteId(prev => (prev === entry.id ? null : prev)),
        3000
      )
    }
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            {/* Month navigation */}
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

            {/* Calendar grid */}
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

            {/* Add entry form */}
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

            {/* Entries on selected date */}
            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 text-xs mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map(e => (
                  <div key={e.id} className="flex items-center gap-8 mb-1 group">
                    <span className="text-acc/80 text-sm flex-1">{e.text}</span>
                    <button
                      onClick={() => handleDeleteEntry(e)}
                      className={cn(
                        'text-xs opacity-0 group-hover:opacity-100 transition-opacity',
                        confirmDeleteId === e.id
                          ? 'text-acc'
                          : 'text-acc/30 hover:text-acc/60'
                      )}
                    >
                      {confirmDeleteId === e.id ? 'confirm' : '×'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming events with ETA */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map(entry => {
              const eta = getEta(entry.date, today)
              const isToday = eta === 'TODAY'

              return (
                <div key={entry.id} className="flex items-baseline gap-8 text-sm group">
                  <span className={cn(
                    'shrink-0 tabular-nums',
                    isToday ? 'text-acc font-bold' : 'text-acc/40'
                  )}>
                    {eta}
                  </span>
                  <span className={cn(
                    'shrink-0 text-xs uppercase tracking-widest',
                    isToday ? 'text-acc/60' : 'text-acc/20'
                  )}>
                    {entry.type}
                  </span>
                  <span className={cn(
                    'flex-1 text-right truncate',
                    isToday ? 'text-acc' : 'text-acc/70'
                  )}>
                    {entry.text}
                  </span>
                  <button
                    onClick={() => handleDeleteEntry(entry)}
                    className={cn(
                      'shrink-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity',
                      confirmDeleteId === entry.id
                        ? 'text-acc'
                        : 'text-acc/30 hover:text-acc/60'
                    )}
                  >
                    {confirmDeleteId === entry.id ? 'confirm' : '×'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40 text-sm">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
