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

type AlertLevel = 'D1' | 'TODAY' | 'OVERDUE'

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const ALERT_STORE_KEY = 'lot-cal-alerts-v2'
// Alert check interval: every 5 minutes
const ALERT_INTERVAL_MS = 5 * 60 * 1000

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

function getAlertStore(): Set<string> {
  try {
    const raw = localStorage.getItem(ALERT_STORE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveAlertStore(store: Set<string>): void {
  try {
    localStorage.setItem(ALERT_STORE_KEY, JSON.stringify([...store]))
  } catch {}
}

function alertKey(date: string, text: string, level: AlertLevel): string {
  return `${date}::${text.slice(0, 40)}::${level}`
}

function daysUntil(entryDate: string): number {
  const target = dayjs(entryDate).startOf('day')
  const today = dayjs().startOf('day')
  return target.diff(today, 'day')
}

function tMinusLabel(entryDate: string): { label: string; urgency: 'past' | 'today' | 'soon' | 'normal' } {
  const diff = daysUntil(entryDate)
  if (diff < 0) return { label: `+${Math.abs(diff)}D OVERDUE`, urgency: 'past' }
  if (diff === 0) return { label: 'TODAY', urgency: 'today' }
  if (diff === 1) return { label: 'T-1D', urgency: 'soon' }
  if (diff <= 7) return { label: `T-${diff}D`, urgency: 'soon' }
  return { label: `T-${diff}D`, urgency: 'normal' }
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const createLogRef = React.useRef(createLog)
  createLogRef.current = createLog

  const [clock, setClock] = React.useState(() => dayjs().format('HH:mm:ss'))
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')

  // Live clock tick (every second)
  React.useEffect(() => {
    const id = setInterval(() => setClock(dayjs().format('HH:mm:ss')), 1000)
    return () => clearInterval(id)
  }, [])

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

  const todayStr = dayjs().format('YYYY-MM-DD')

  const todayEntries = React.useMemo(
    () => entries.filter(e => e.date === todayStr),
    [entries, todayStr]
  )

  const upcomingEntries = React.useMemo(() => {
    return entries.filter(e => e.date >= todayStr).slice(0, 10)
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

  // Alert engine — fires once per threshold per entry, persisted to localStorage
  const checkAndFireAlerts = React.useCallback(() => {
    const store = getAlertStore()
    let dirty = false
    const todayIso = dayjs().format('YYYY-MM-DD')
    const yesterdayIso = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    const tomorrowIso = dayjs().add(1, 'day').format('YYYY-MM-DD')

    for (const entry of entries) {
      const fireAlert = (level: AlertLevel, tMinus: string) => {
        const key = alertKey(entry.date, entry.text, level)
        if (store.has(key)) return
        store.add(key)
        dirty = true
        createLogRef.current({
          text: `[SCHED-ALERT] ${level}: ${entry.type.toUpperCase()} · ${entry.text}`,
          event: 'calendar_alert',
          metadata: {
            alertLevel: level,
            date: entry.date,
            entryType: entry.type,
            entryText: entry.text,
            tMinus,
          },
        }, {
          onSuccess: () => queryClient.invalidateQueries(['/api/logs']),
        })
      }

      if (entry.date === tomorrowIso) fireAlert('D1', 'T-1D')
      if (entry.date === todayIso) fireAlert('TODAY', 'TODAY')
      if (entry.date === yesterdayIso) fireAlert('OVERDUE', '+1D')
    }

    if (dirty) saveAlertStore(store)
  }, [entries, queryClient])

  // Run alert check on mount and every ALERT_INTERVAL_MS
  React.useEffect(() => {
    checkAndFireAlerts()
    const id = setInterval(checkAndFireAlerts, ALERT_INTERVAL_MS)
    return () => clearInterval(id)
  }, [checkAndFireAlerts])

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(prev => prev === key ? null : key)
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
        queryClient.invalidateQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })
    setEntryText('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(v => !v)
  }

  const today = dayjs()

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">

        {/* Header row: Add button + live clock */}
        <div className="flex items-center justify-between mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
          <span className="tabular-nums text-acc/40 tracking-wider">{clock}</span>
        </div>

        {/* Today panel */}
        {todayEntries.length > 0 && (
          <div className="mb-16">
            <div className="text-acc/30 uppercase tracking-widest mb-4">
              {today.format('ddd DD MMM').toUpperCase()}
            </div>
            {todayEntries.map((entry, i) => (
              <div key={i} className="flex items-baseline justify-between gap-8 mb-2">
                <span className="text-acc capitalize">{entry.type}: {entry.text}</span>
                <span className="text-acc tabular-nums whitespace-nowrap text-right">TODAY</span>
              </div>
            ))}
          </div>
        )}

        {/* Calendar grid (expandable) */}
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
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="text-acc/80 mb-1">
                    {e.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming entries with T-minus */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const { label, urgency } = tMinusLabel(entry.date)
              return (
                <div key={i} className="flex justify-between gap-16">
                  <span
                    className={cn(
                      'whitespace-nowrap',
                      urgency === 'today' ? 'text-acc' : 'text-acc/60',
                    )}
                  >
                    {dayjs(entry.date).format('ddd DD MMM').toUpperCase()}
                    {' · '}
                    {entry.text}
                  </span>
                  <span
                    className={cn(
                      'tabular-nums whitespace-nowrap text-right',
                      urgency === 'today' && 'text-acc',
                      urgency === 'soon' && 'text-acc/60',
                      urgency === 'normal' && 'text-acc/30',
                    )}
                  >
                    {label}
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
