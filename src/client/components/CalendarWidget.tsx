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
type AlertStage = 'reminder' | 'start' | 'end'

type CalendarEntry = {
  id: string
  date: string
  text: string
  type: EntryType
  time?: string
  durationMinutes?: number
  remindMinutesBefore?: number
}

type QueuedAlert = {
  key: string
  entry: CalendarEntry
  stage: AlertStage
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const REMIND_OPTIONS = [0, 5, 15, 30, 60]

function stageHeadline(entry: CalendarEntry, stage: AlertStage): string {
  if (stage === 'reminder') return `T-MINUS ${entry.remindMinutesBefore} MIN`
  if (stage === 'start') return 'ACTIVE // T-0'
  return `CONCLUDED // ${entry.durationMinutes} MIN`
}

function alertLogText(entry: CalendarEntry, stage: AlertStage): string {
  const dateLabel = dayjs(entry.date).format('ddd, MMM D')
  const timeLabel = entry.time ? ` ${entry.time}` : ''
  return `[ALERT] ${stageHeadline(entry, stage)}: ${entry.type} — ${entry.text} (${dateLabel}${timeLabel})`
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
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [entryTime, setEntryTime] = React.useState('')
  const [entryDuration, setEntryDuration] = React.useState('')
  const [entryRemind, setEntryRemind] = React.useState(15)
  const [alertQueue, setAlertQueue] = React.useState<QueuedAlert[]>([])
  const firedAlertsRef = React.useRef<Set<string>>(new Set())

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => {
        const durationMinutes = Number(log.metadata?.durationMinutes)
        const remindMinutesBefore = Number(log.metadata?.remindMinutesBefore)
        return {
          id: log.id,
          date: log.metadata?.date as string,
          text: log.metadata?.text as string || log.text || '',
          type: (log.metadata?.entryType as EntryType) || 'note',
          time: (log.metadata?.time as string) || undefined,
          durationMinutes: Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : undefined,
          remindMinutesBefore: Number.isFinite(remindMinutesBefore) ? remindMinutesBefore : undefined,
        }
      })
      .filter(e => e.date && e.text)
      .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
  }, [logs])

  const firedAlertKeys = React.useMemo(() => {
    const set = new Set<string>()
    logs
      .filter(log => log.event === 'calendar_alert' && log.metadata?.sourceLogId)
      .forEach(log => set.add(`${log.metadata?.sourceLogId}|${log.metadata?.stage}`))
    return set
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

  // Reliably fires a military-grade alert (toast + Log entry) once per
  // entry/stage — dedup is keyed off persisted Log rows, not just local
  // state, so it survives reloads and never double-fires from remounts.
  React.useEffect(() => {
    const scan = () => {
      const now = dayjs()
      const due: QueuedAlert[] = []

      entries.forEach(entry => {
        if (!entry.time) return
        const start = dayjs(`${entry.date} ${entry.time}`)
        if (!start.isValid()) return

        const stages: { stage: AlertStage; at: Dayjs }[] = []
        if (entry.remindMinutesBefore) {
          stages.push({ stage: 'reminder', at: start.subtract(entry.remindMinutesBefore, 'minute') })
        }
        stages.push({ stage: 'start', at: start })
        if (entry.durationMinutes) {
          stages.push({ stage: 'end', at: start.add(entry.durationMinutes, 'minute') })
        }

        stages.forEach(({ stage, at }) => {
          const minutesPast = now.diff(at, 'minute')
          if (minutesPast < 0 || minutesPast > 5) return
          const key = `${entry.id}|${stage}`
          if (firedAlertKeys.has(key) || firedAlertsRef.current.has(key)) return
          firedAlertsRef.current.add(key)
          due.push({ key, entry, stage })
        })
      })

      if (due.length === 0) return
      setAlertQueue(q => [...q, ...due])
      due.forEach(({ entry, stage }) => {
        createLog({
          text: alertLogText(entry, stage),
          event: 'calendar_alert',
          metadata: {
            sourceLogId: entry.id,
            stage,
            date: entry.date,
            time: entry.time,
            entryType: entry.type,
            text: entry.text,
            durationMinutes: entry.durationMinutes,
            remindMinutesBefore: entry.remindMinutesBefore,
          },
        }, {
          onSuccess: () => queryClient.refetchQueries(['/api/logs']),
        })
      })
    }

    scan()
    const interval = setInterval(scan, 20000)
    return () => clearInterval(interval)
  }, [entries, firedAlertKeys, createLog, queryClient])

  const activeAlert = alertQueue[0]

  React.useEffect(() => {
    if (!activeAlert) return
    const timeout = setTimeout(() => setAlertQueue(q => q.slice(1)), 8000)
    return () => clearTimeout(timeout)
  }, [activeAlert])

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

    const time = entryTime.trim() || undefined
    const durationMinutes = time && Number(entryDuration) > 0 ? Number(entryDuration) : undefined
    const remindMinutesBefore = time && entryRemind > 0 ? entryRemind : undefined

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeLabel = time ? ` at ${time}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        time,
        durationMinutes,
        remindMinutesBefore,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    setEntryText('')
    setEntryTime('')
    setEntryDuration('')
    setEntryRemind(15)
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
                <div className="flex gap-8 items-center mb-8">
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

                <div className="flex gap-8 items-center flex-wrap">
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-1 outline-none focus:border-acc/40"
                  />
                  {entryTime && (
                    <>
                      <input
                        type="number"
                        min={0}
                        value={entryDuration}
                        onChange={e => setEntryDuration(e.target.value)}
                        placeholder="min"
                        className="bg-transparent border border-acc/20 text-acc/60 px-4 py-1 w-[64px] outline-none focus:border-acc/40"
                      />
                      <span className="text-acc/30">remind</span>
                      <select
                        value={entryRemind}
                        onChange={e => setEntryRemind(Number(e.target.value))}
                        className="bg-transparent border border-acc/20 text-acc/60 px-4 py-1 outline-none focus:border-acc/40"
                      >
                        {REMIND_OPTIONS.map(m => (
                          <option key={m} value={m} className="bg-[var(--base-color)]">
                            {m === 0 ? 'off' : `${m}m before`}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
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
                    {e.time && <span className="text-acc/40">{e.time} — </span>}
                    {e.text}
                    {e.durationMinutes && <span className="text-acc/40"> ({e.durationMinutes}m)</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => (
              <div key={i} className="flex justify-between gap-16">
                <span className="text-acc whitespace-nowrap">
                  {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                  {entry.time && <span className="text-acc/40"> {entry.time}</span>}
                </span>
                <span className="text-acc text-right">
                  {entry.text}
                  {entry.durationMinutes && <span className="text-acc/40"> ({entry.durationMinutes}m)</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>

      {activeAlert && (
        <div
          key={activeAlert.key}
          className="fixed bottom-16 right-16 z-50 max-w-[340px] px-16 py-12
                     border border-acc/20 bg-[var(--base-color)] grid-fill
                     font-mono"
          style={{ animation: 'calendarOpsFadeInUp 0.4s ease-out, calendarOpsFadeOut 0.4s ease-in 7.6s forwards' }}
        >
          <div className="flex items-center justify-between text-acc/40 text-[10px] tracking-[0.2em] uppercase mb-4">
            <span>Calendar Ops</span>
            <span>{stageHeadline(activeAlert.entry, activeAlert.stage)}</span>
          </div>
          <div className="text-acc/20 mb-8 leading-none">{'—'.repeat(30)}</div>
          <div className="text-acc/50 text-[11px] tracking-wide uppercase mb-2">
            {activeAlert.entry.type}{activeAlert.entry.time ? ` · ${activeAlert.entry.time}` : ''}
          </div>
          <div className="text-acc">{activeAlert.entry.text}</div>
        </div>
      )}
    </Block>
  )
}

// CSS animations for the Calendar Ops alert toast
const calendarOpsStyle = document.createElement('style')
calendarOpsStyle.textContent = `
  @keyframes calendarOpsFadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes calendarOpsFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(calendarOpsStyle)
}
