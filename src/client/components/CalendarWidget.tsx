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

type AlertLevel = 'T0' | 'T1' | 'T2' | 'T7'

type AlertEntry = CalendarEntry & { level: AlertLevel; daysOut: number }

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const TYPE_SHORT: Record<EntryType, string> = {
  note: 'N',
  task: 'T',
  call: 'C',
}

// Module-level date guard: auto-log fires once per calendar day per session
let _calNotifyDate = ''

function getAlertInfo(dateStr: string, todayStr: string): { level: AlertLevel; daysOut: number } | null {
  const diff = dayjs(dateStr).diff(dayjs(todayStr), 'day')
  if (diff < 0) return null
  if (diff === 0) return { level: 'T0', daysOut: 0 }
  if (diff === 1) return { level: 'T1', daysOut: 1 }
  if (diff === 2) return { level: 'T2', daysOut: 2 }
  if (diff <= 7) return { level: 'T7', daysOut: diff }
  return null
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

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  const [now, setNow] = React.useState(() => dayjs())
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')

  const today = now.format('YYYY-MM-DD')

  // Live clock — checks for date rollover every minute
  React.useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: (log.metadata?.text as string) || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  const activeAlerts = React.useMemo<AlertEntry[]>(() => {
    return entries
      .map(e => {
        const info = getAlertInfo(e.date, today)
        if (!info) return null
        return { ...e, ...info }
      })
      .filter((e): e is AlertEntry => e !== null)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [entries, today])

  const todayAlerts = React.useMemo(
    () => activeAlerts.filter(a => a.level === 'T0'),
    [activeAlerts]
  )

  const inboundAlerts = React.useMemo(
    () => activeAlerts.filter(a => a.level !== 'T0'),
    [activeAlerts]
  )

  // Auto-log T-0 alerts to Log once per calendar day
  React.useEffect(() => {
    if (_calNotifyDate === today) return
    if (!todayAlerts.length) return

    const storageKey = `cal_notified_${today}`
    let notifiedSet: Set<string>
    try {
      notifiedSet = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'))
    } catch {
      notifiedSet = new Set()
    }

    const newAlerts = todayAlerts.filter(a => !notifiedSet.has(`${a.date}:${a.text}`))
    if (!newAlerts.length) return

    _calNotifyDate = today

    const timeStr = now.format('HHmm')
    const lines = newAlerts.map(a => `  [${TYPE_SHORT[a.type]}] ${a.text.toUpperCase()}`)
    const logText = [
      `CALENDAR // T-0 // ${today} // ${timeStr}`,
      ...lines,
      `${newAlerts.length} MISSION${newAlerts.length > 1 ? 'S' : ''} ACTIVE TODAY`,
    ].join('\n')

    createLog(
      {
        text: logText,
        event: 'calendar_notification',
        metadata: {
          date: today,
          alertLevel: 'T0',
          entryCount: newAlerts.length,
        },
      },
      {
        onSuccess: () => {
          const updated = new Set(notifiedSet)
          newAlerts.forEach(a => updated.add(`${a.date}:${a.text}`))
          localStorage.setItem(storageKey, JSON.stringify([...updated]))
          queryClient.invalidateQueries(['/api/logs'])
        },
      }
    )
  }, [todayAlerts, today]) // eslint-disable-line react-hooks/exhaustive-deps

  const upcomingEntries = React.useMemo(
    () => entries.filter(e => e.date >= today).slice(0, 10),
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

    createLog(
      {
        text: `${entryType}: ${entryText.trim()} (${dateLabel})`,
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
          try {
            recordCalendarSignal(entryType, selectedDate!)
          } catch (_) {}
        },
      }
    )

    setEntryText('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(v => !v)
  }

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        {/* Current date */}
        <div className="text-acc/30 text-xs mb-16">
          {now.format('dddd, D MMMM YYYY').toUpperCase()}
        </div>

        {/* Military alert panel — T-0 to T-7 */}
        {activeAlerts.length > 0 && (
          <div className="mb-16 space-y-8">
            {todayAlerts.length > 0 && (
              <div>
                <div className="text-acc/40 text-xs mb-4">ALERT // T-0 // TODAY</div>
                {todayAlerts.map((a, i) => (
                  <div key={i} className="text-sm text-acc">
                    [{TYPE_SHORT[a.type]}] {a.text}
                  </div>
                ))}
              </div>
            )}
            {inboundAlerts.length > 0 && (
              <div>
                {todayAlerts.length === 0 && (
                  <div className="text-acc/30 text-xs mb-4">INBOUND</div>
                )}
                {inboundAlerts.map((a, i) => (
                  <div
                    key={i}
                    className={cn(
                      'text-sm',
                      a.level === 'T1' && 'text-acc/70',
                      a.level === 'T2' && 'text-acc/60',
                      a.level === 'T7' && 'text-acc/40'
                    )}
                  >
                    T-{a.daysOut}&nbsp;&nbsp;[{TYPE_SHORT[a.type]}] {a.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add date toggle */}
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
        </div>

        {/* Month-view calendar grid */}
        {isCalendarOpen && (
          <div className="mb-16">
            <div className="flex items-center gap-8 mb-8">
              <button
                className="text-acc/40 hover:text-acc text-sm transition-opacity"
                onClick={() => setViewMonth(v => v.subtract(1, 'month'))}
              >
                {'<—'}
              </button>
              <span className="text-acc text-sm">{viewMonth.format('MMMM, YYYY')}</span>
              <button
                className="text-acc/40 hover:text-acc text-sm transition-opacity"
                onClick={() => setViewMonth(v => v.add(1, 'month'))}
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
                    const alertInfo = isCurrentMonth ? getAlertInfo(key, today) : null

                    return (
                      <button
                        key={key}
                        onClick={() => handleDateClick(d)}
                        className={cn(
                          'text-sm py-0.5 px-0.5 transition-opacity whitespace-nowrap min-w-[2.5em] text-left',
                          !isCurrentMonth && 'text-acc/20',
                          isCurrentMonth && !isToday && !hasEntry && 'text-acc/40',
                          isCurrentMonth && hasEntry && !isToday && !alertInfo && 'text-acc/60',
                          isCurrentMonth && hasEntry && alertInfo?.level === 'T7' && 'text-acc/60',
                          isCurrentMonth && hasEntry && alertInfo?.level === 'T2' && 'text-acc/70',
                          isCurrentMonth && hasEntry && alertInfo?.level === 'T1' && 'text-acc/80',
                          isCurrentMonth && hasEntry && alertInfo?.level === 'T0' && 'text-acc',
                          isToday && 'text-acc font-bold',
                          isSelected && 'underline'
                        )}
                      >
                        {DAY_LETTERS[di]}{d.date()}
                      </button>
                    )
                  })}

                  {wi === 0 && selectedDate && !isAddingEntry && (
                    <div className="flex items-center ml-4 whitespace-nowrap">
                      <button
                        className="text-acc/30 hover:text-acc/60 text-sm transition-opacity"
                        onClick={() => setIsAddingEntry(true)}
                      >
                        Note / Task / Call
                      </button>
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
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddEntry()
                    }}
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
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="text-acc/80 text-sm mb-1">
                    [{TYPE_SHORT[e.type]}] {e.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All upcoming entries */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const alertInfo = getAlertInfo(entry.date, today)
              const bright = alertInfo?.level === 'T0' || alertInfo?.level === 'T1'
              return (
                <div key={i} className="flex justify-between text-sm gap-16">
                  <span
                    className={cn(
                      'whitespace-nowrap',
                      bright ? 'text-acc' : 'text-acc/70'
                    )}
                  >
                    {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                  </span>
                  <span className={cn('text-right', bright ? 'text-acc' : 'text-acc/70')}>
                    [{TYPE_SHORT[entry.type]}] {entry.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && activeAlerts.length === 0 && (
          <div className="text-acc/40 text-sm">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
