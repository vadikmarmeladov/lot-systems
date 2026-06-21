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
import { useCreateLog, useLogs, useUpdateLog } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import { recordCalendarSignal } from '#client/stores/intentionEngine'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  id: string
  date: string
  time?: string // HH:MM
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const TYPE_LABEL: Record<EntryType, string> = {
  note: '[N]',
  task: '[T]',
  call: '[C]',
}

const ALERT_KEY = 'cal-alerts-v1'
const ALERT_WINDOW_MS = 5 * 60 * 1000 // 5-minute window post-event

function loadFiredAlerts(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(ALERT_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function saveFiredAlert(key: string) {
  const set = loadFiredAlerts()
  set.add(key)
  try {
    sessionStorage.setItem(ALERT_KEY, JSON.stringify([...set]))
  } catch {}
}

function militaryAlert(entry: CalendarEntry): string {
  const typeCode = { note: 'NOTE', task: 'TASK', call: 'CALL' }[entry.type]
  const timeStr = entry.time ? ` // ${entry.time}` : ''
  return `◼ SCHEDULE ALERT ◼ [${typeCode}] ${entry.text.toUpperCase()}${timeStr} // EXECUTE NOW`
}

function dailyBriefText(logs: Array<{ text: string | null; metadata: Record<string, any> }>): string {
  const n = logs.length
  const items = logs
    .map(l => {
      const type = ((l.metadata?.entryType as string) || 'task').toUpperCase().charAt(0)
      const text = (l.metadata?.text as string) || l.text || ''
      return `[${type}] ${text}`
    })
    .join(' / ')
  return `◼ DAILY BRIEF ◼ ${n} EVENT${n !== 1 ? 'S' : ''} TODAY — ${items}`
}

function getMonthWeeks(year: number, month: number): Dayjs[][] {
  const first = dayjs().year(year).month(month).startOf('month')
  const last = dayjs().year(year).month(month).endOf('month')
  const isoOffset = first.day() === 0 ? 6 : first.day() - 1
  const start = first.subtract(isoOffset, 'day')
  const weeks: Dayjs[][] = []
  let cur = start
  while (cur.isBefore(last) || cur.isSame(last, 'day') || weeks.length < 5) {
    const week: Dayjs[] = []
    for (let i = 0; i < 7; i++) {
      week.push(cur)
      cur = cur.add(1, 'day')
    }
    weeks.push(week)
    if (weeks.length >= 6) break
  }
  return weeks
}

function formatCountdown(date: string, today: string): string {
  if (date === today) return 'TODAY'
  const diff = dayjs(date).diff(today, 'day')
  if (diff < 0) return 'PAST'
  if (diff === 1) return 'T-1'
  return `T-${diff}`
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const { mutate: updateLog } = useUpdateLog()

  const [isOpen, setIsOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAdding, setIsAdding] = React.useState(false)
  const [inputText, setInputText] = React.useState('')
  const [inputTime, setInputTime] = React.useState('')
  const [inputType, setInputType] = React.useState<EntryType>('task')
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata?.date)
      .map(log => ({
        id: log.id,
        date: log.metadata!.date as string,
        time: log.metadata?.time as string | undefined,
        text: (log.metadata?.text as string) || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'task',
      }))
      .filter(e => e.text)
      .sort((a, b) => {
        const dc = a.date.localeCompare(b.date)
        if (dc !== 0) return dc
        if (a.time && b.time) return a.time.localeCompare(b.time)
        return a.time ? -1 : b.time ? 1 : 0
      })
  }, [logs])

  const today = dayjs().format('YYYY-MM-DD')
  const todayEntries = React.useMemo(() => entries.filter(e => e.date === today), [entries, today])
  const upcoming = React.useMemo(() => entries.filter(e => e.date >= today).slice(0, 12), [entries, today])
  const selectedEntries = React.useMemo(() => selectedDate ? entries.filter(e => e.date === selectedDate) : [], [entries, selectedDate])
  const datesWithEntries = React.useMemo(() => new Set(entries.map(e => e.date)), [entries])
  const weeks = React.useMemo(() => getMonthWeeks(viewMonth.year(), viewMonth.month()), [viewMonth])

  // Stale-closure-safe refs for alert interval
  const logsRef = React.useRef(logs)
  const createLogRef = React.useRef(createLog)
  const queryClientRef = React.useRef(queryClient)
  React.useEffect(() => { logsRef.current = logs }, [logs])
  React.useEffect(() => { createLogRef.current = createLog }, [createLog])
  React.useEffect(() => { queryClientRef.current = queryClient }, [queryClient])

  // Military-grade alert system — fires timed events into the Log
  React.useEffect(() => {
    const check = () => {
      const now = dayjs()
      const todayStr = now.format('YYYY-MM-DD')
      const fired = loadFiredAlerts()

      // Timed entry alerts: fire within 5-minute post-event window
      const todayTimedLogs = logsRef.current.filter(
        log => log.event === 'calendar_entry' && log.metadata?.date === todayStr && log.metadata?.time
      )

      todayTimedLogs.forEach(log => {
        const entryTime = log.metadata!.time as string
        const alertKey = `timed:${log.id}:${todayStr}:${entryTime}`
        if (fired.has(alertKey)) return

        const [hh, mm] = entryTime.split(':').map(Number)
        const eventMoment = now.hour(hh).minute(mm).second(0).millisecond(0)
        const diffMs = now.valueOf() - eventMoment.valueOf() // positive = after event

        if (diffMs >= 0 && diffMs <= ALERT_WINDOW_MS) {
          const entry: CalendarEntry = {
            id: log.id,
            date: todayStr,
            time: entryTime,
            text: (log.metadata!.text as string) || log.text || '',
            type: (log.metadata?.entryType as EntryType) || 'task',
          }
          saveFiredAlert(alertKey)
          createLogRef.current(
            {
              text: militaryAlert(entry),
              event: 'calendar_alert',
              metadata: { date: todayStr, entryId: log.id, time: entryTime, alertType: 'timed' },
            },
            { onSuccess: () => queryClientRef.current.invalidateQueries(['/api/logs']) }
          )
        }
      })

      // Daily brief at 08:00 for all-day (no time) today entries
      const briefKey = `brief:${todayStr}`
      if (now.hour() === 8 && now.minute() < 5 && !fired.has(briefKey)) {
        const allDayLogs = logsRef.current.filter(
          log => log.event === 'calendar_entry' && log.metadata?.date === todayStr && !log.metadata?.time
        )
        if (allDayLogs.length > 0) {
          saveFiredAlert(briefKey)
          createLogRef.current(
            {
              text: dailyBriefText(allDayLogs),
              event: 'calendar_alert',
              metadata: { date: todayStr, alertType: 'daily_brief', count: allDayLogs.length },
            },
            { onSuccess: () => queryClientRef.current.invalidateQueries(['/api/logs']) }
          )
        }
      }
    }

    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, []) // runs once; reads live data via refs

  const addEntry = () => {
    if (!selectedDate || !inputText.trim()) return
    const dateLabel = dayjs(selectedDate).format('ddd MMMM D YYYY')
    const timeLabel = inputTime ? ` at ${inputTime}` : ''
    createLog(
      {
        text: `[SCHEDULE] ${inputType}: ${inputText.trim()}${timeLabel} (${dateLabel})`,
        event: 'calendar_entry',
        metadata: {
          date: selectedDate,
          ...(inputTime ? { time: inputTime } : {}),
          text: inputText.trim(),
          entryType: inputType,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['/api/logs'])
          try { recordCalendarSignal(inputType, selectedDate!) } catch (_) {}
        },
      }
    )
    setInputText('')
    setInputTime('')
    setIsAdding(false)
  }

  const deleteEntry = (id: string) => {
    updateLog(
      { id, text: '' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['/api/logs'])
          setDeleteConfirm(null)
        },
      }
    )
  }

  const toggleCalendar = () => {
    if (!isOpen) setViewMonth(dayjs())
    setIsOpen(x => !x)
  }

  const label = todayEntries.length > 0 ? `Calendar: [${todayEntries.length} today]` : 'Calendar:'

  return (
    <Block label={label} blockView onLabelClick={toggleCalendar}>
      <div className="w-full">
        {!isOpen && (
          <div className="mb-16">
            <Button onClick={toggleCalendar}>Schedule</Button>
          </div>
        )}

        {isOpen && (
          <div className="mb-16">
            {/* Month navigation */}
            <div className="flex items-center gap-8 mb-8">
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(v => v.subtract(1, 'month'))}
              >
                {'<—'}
              </button>
              <span className="text-acc">{viewMonth.format('MMMM YYYY')}</span>
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(v => v.add(1, 'month'))}
              >
                {'—>'}
              </button>
            </div>

            {/* Calendar grid */}
            <div className="space-y-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex gap-0 items-center">
                  {week.map((d, di) => {
                    const key = d.format('YYYY-MM-DD')
                    const isToday = key === today
                    const inMonth = d.month() === viewMonth.month()
                    const isSelected = key === selectedDate
                    const hasEntry = datesWithEntries.has(key)
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          if (selectedDate === key) {
                            setSelectedDate(null)
                            setIsAdding(false)
                          } else {
                            setSelectedDate(key)
                            setIsAdding(false)
                          }
                        }}
                        className={cn(
                          'py-0.5 px-0.5 transition-opacity whitespace-nowrap min-w-[2.5em] text-left',
                          !inMonth && 'text-acc/20',
                          inMonth && !isToday && !hasEntry && 'text-acc/40',
                          inMonth && !isToday && hasEntry && 'text-acc/70',
                          isToday && 'text-acc font-bold',
                          isSelected && 'underline',
                        )}
                      >
                        {DAY_LETTERS[di]}{d.date()}{hasEntry && inMonth ? '·' : ''}
                      </button>
                    )
                  })}
                  {wi === 0 && selectedDate && !isAdding && (
                    <button
                      className="ml-4 text-acc/30 hover:text-acc/60 transition-opacity whitespace-nowrap"
                      onClick={() => setIsAdding(true)}
                    >
                      + add
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add entry form */}
            {isAdding && selectedDate && (
              <div className="mt-8">
                <div className="flex gap-8 mb-6">
                  {(['task', 'note', 'call'] as EntryType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setInputType(t)}
                      className={cn(
                        'uppercase text-xs tracking-widest transition-opacity',
                        inputType === t ? 'text-acc' : 'text-acc/40 hover:text-acc/60'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-8 items-center">
                  <input
                    autoFocus
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addEntry()}
                    placeholder={`${inputType}...`}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 flex-1 outline-none focus:border-acc/40"
                  />
                  <input
                    type="time"
                    value={inputTime}
                    onChange={e => setInputTime(e.target.value)}
                    title="Optional time"
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-2 w-28 outline-none focus:border-acc/40"
                  />
                  <Button onClick={addEntry}>Add</Button>
                </div>
              </div>
            )}

            {/* Selected day entries */}
            {selectedDate && selectedEntries.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4 text-xs uppercase tracking-widest">
                  {dayjs(selectedDate).format('ddd, MMMM D')}
                </div>
                {selectedEntries.map(e => (
                  <div key={e.id} className="flex items-baseline justify-between gap-8 mb-2">
                    <div className="text-acc/80">
                      <span className="text-acc/40 mr-4 font-mono text-xs">{TYPE_LABEL[e.type]}</span>
                      {e.time && <span className="text-acc/50 mr-4">{e.time}</span>}
                      {e.text}
                    </div>
                    {deleteConfirm === e.id ? (
                      <span className="flex gap-4 shrink-0">
                        <button
                          className="text-acc/60 hover:text-acc transition-opacity text-xs"
                          onClick={() => deleteEntry(e.id)}
                        >
                          del
                        </button>
                        <button
                          className="text-acc/30 hover:text-acc/50 transition-opacity text-xs"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          ×
                        </button>
                      </span>
                    ) : (
                      <button
                        className="text-acc/20 hover:text-acc/50 transition-opacity text-xs shrink-0"
                        onClick={() => setDeleteConfirm(e.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming entries list */}
        {upcoming.length > 0 && (
          <div className="space-y-1">
            {upcoming.map(entry => {
              const cd = formatCountdown(entry.date, today)
              const isToday = entry.date === today
              return (
                <div key={entry.id} className="flex items-baseline gap-8">
                  <span className={cn(
                    'font-mono text-xs w-12 shrink-0',
                    isToday ? 'text-acc font-bold' : 'text-acc/40'
                  )}>
                    {cd}
                  </span>
                  <span className="font-mono text-xs text-acc/30 shrink-0">
                    {TYPE_LABEL[entry.type]}
                  </span>
                  {entry.time && (
                    <span className={cn('text-xs shrink-0', isToday ? 'text-acc/70' : 'text-acc/40')}>
                      {entry.time}
                    </span>
                  )}
                  <span className={cn('whitespace-nowrap shrink-0', isToday ? 'text-acc' : 'text-acc/50')}>
                    {dayjs(entry.date).format('ddd D MMM')}
                  </span>
                  <span className={cn('flex-1 text-right', isToday ? 'text-acc' : 'text-acc/60')}>
                    {entry.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {upcoming.length === 0 && !isOpen && (
          <div className="text-acc/40">No upcoming.</div>
        )}
      </div>
    </Block>
  )
}
