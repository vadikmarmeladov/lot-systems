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
type AlertLevel = 'ALPHA' | 'BRAVO' | 'NOTICE' | 'CLEARED'

type CalendarEntry = {
  id: string
  date: string
  text: string
  type: EntryType
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

// Alert dedup: one fire per entry per calendar day, per session
function alertStorageKey(entryId: string): string {
  return `lot_cal_${dayjs().format('YYYY-MM-DD')}_${entryId}`
}

function wasAlerted(entryId: string): boolean {
  try { return !!sessionStorage.getItem(alertStorageKey(entryId)) } catch { return false }
}

function markAlerted(entryId: string): void {
  try { sessionStorage.setItem(alertStorageKey(entryId), '1') } catch {}
}

function buildAlertText(level: AlertLevel, entry: CalendarEntry): string {
  const type = entry.type.toUpperCase()
  const date = dayjs(entry.date).format('DD MMM YYYY').toUpperCase()
  if (level === 'BRAVO') {
    const over = dayjs().diff(dayjs(entry.date), 'day')
    return `[BRAVO] OVERDUE +${over}D — ${type}: ${entry.text} — ${date}`
  }
  if (level === 'ALPHA') {
    return `[ALPHA] ${type}: ${entry.text} — ${date}`
  }
  if (level === 'CLEARED') {
    return `[CLEARED] ${type}: ${entry.text} — ${date} — COMPLETE`
  }
  const until = dayjs(entry.date).diff(dayjs(), 'day')
  return `[NOTICE] T-MINUS ${until}D — ${type}: ${entry.text} — ${date}`
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const { mutate: updateLog } = useUpdateLog()

  const [now, setNow] = React.useState(() => dayjs())
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')

  // Live clock — 1-min tick
  React.useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 60_000)
    return () => clearInterval(id)
  }, [])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  const today = now.format('YYYY-MM-DD')
  const tomorrow = now.add(1, 'day').format('YYYY-MM-DD')

  const overdueEntries = React.useMemo(
    () => entries.filter(e => e.date < today),
    [entries, today]
  )
  const todayEntries = React.useMemo(
    () => entries.filter(e => e.date === today),
    [entries, today]
  )
  const standbyEntries = React.useMemo(
    () => entries.filter(e => {
      const diff = dayjs(e.date).diff(now, 'day')
      return diff > 0 && diff <= 3
    }),
    [entries, today]
  )
  const upcomingEntries = React.useMemo(
    () => entries.filter(e => e.date > today).slice(0, 10),
    [entries, today]
  )

  const hasCommandBoard = overdueEntries.length > 0 || todayEntries.length > 0 || standbyEntries.length > 0

  // Alert engine: fires log entries for overdue / today / tomorrow events
  React.useEffect(() => {
    if (entries.length === 0) return

    function fireAlerts() {
      const candidates: { entry: CalendarEntry; level: AlertLevel }[] = [
        ...entries.filter(e => e.date < today).map(e => ({ entry: e, level: 'BRAVO' as AlertLevel })),
        ...entries.filter(e => e.date === today).map(e => ({ entry: e, level: 'ALPHA' as AlertLevel })),
        ...entries.filter(e => e.date === tomorrow).map(e => ({ entry: e, level: 'NOTICE' as AlertLevel })),
      ]

      for (const { entry, level } of candidates) {
        if (wasAlerted(entry.id)) continue
        createLog({
          text: buildAlertText(level, entry),
          event: 'calendar_alert',
          metadata: { level, date: entry.date, entryType: entry.type, text: entry.text },
        })
        markAlerted(entry.id)
      }
    }

    fireAlerts()
    const id = setInterval(fireAlerts, 60_000)
    return () => clearInterval(id)
  }, [entries, today, tomorrow])

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(prev => prev === key ? null : key)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return
    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')

    createLog({
      text: `[SCHEDULE] ${entryType.toUpperCase()}: ${entryText.trim()} — ${dayjs(selectedDate).format('DD MMM YYYY').toUpperCase()}`,
      event: 'calendar_entry',
      metadata: { date: selectedDate, text: entryText.trim(), entryType },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    setEntryText('')
    setIsAddingEntry(false)
  }

  const handleClearEntry = (entry: CalendarEntry) => {
    updateLog({ id: entry.id, text: '' }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['/api/logs'])
        createLog({
          text: buildAlertText('CLEARED', entry),
          event: 'calendar_alert',
          metadata: { level: 'CLEARED', date: entry.date, entryType: entry.type, text: entry.text },
        })
      },
    })
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(v => !v)
  }

  const dateHeader = now.format('DD MMM YYYY').toUpperCase() + ' // ' + now.format('ddd').toUpperCase() + ' // ' + now.format('HH:mm')

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">

        {/* Live date/time */}
        <div className="text-acc/40 mb-16 text-sm tracking-wider">
          {dateHeader}
        </div>

        {/* Command Board */}
        {hasCommandBoard && (
          <div className="mb-16 space-y-8">

            {overdueEntries.length > 0 && (
              <div>
                <div className="text-acc/30 text-xs tracking-widest mb-4">
                  {'// OVERDUE [' + overdueEntries.length + ']'}
                </div>
                <div className="space-y-2">
                  {overdueEntries.map(entry => (
                    <div key={entry.id} className="flex items-start justify-between gap-8 group">
                      <span className="text-acc/70 text-sm">
                        <span className="text-acc/40 mr-4">BRAVO</span>
                        {entry.type.toUpperCase()}: {entry.text}
                        <span className="text-acc/30 ml-4 text-xs">
                          {dayjs().diff(dayjs(entry.date), 'day')}D AGO
                        </span>
                      </span>
                      <button
                        onClick={() => handleClearEntry(entry)}
                        className="text-acc/20 hover:text-acc/60 transition-opacity shrink-0 leading-none"
                        title="Mark cleared"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {todayEntries.length > 0 && (
              <div>
                <div className="text-acc/30 text-xs tracking-widest mb-4">
                  {'// TODAY'}
                </div>
                <div className="space-y-2">
                  {todayEntries.map(entry => (
                    <div key={entry.id} className="flex items-start justify-between gap-8 group">
                      <span className="text-acc text-sm">
                        <span className="text-acc/50 mr-4">ALPHA</span>
                        {entry.type.toUpperCase()}: {entry.text}
                      </span>
                      <button
                        onClick={() => handleClearEntry(entry)}
                        className="text-acc/20 hover:text-acc/60 transition-opacity shrink-0 leading-none"
                        title="Mark cleared"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {standbyEntries.length > 0 && (
              <div>
                <div className="text-acc/30 text-xs tracking-widest mb-4">
                  {'// STANDBY'}
                </div>
                <div className="space-y-2">
                  {standbyEntries.map(entry => (
                    <div key={entry.id} className="flex items-start justify-between gap-8 group">
                      <span className="text-acc/60 text-sm">
                        <span className="text-acc/30 mr-4">
                          T-{dayjs(entry.date).diff(now, 'day')}D
                        </span>
                        {entry.type.toUpperCase()}: {entry.text}
                      </span>
                      <button
                        onClick={() => handleClearEntry(entry)}
                        className="text-acc/20 hover:text-acc/60 transition-opacity shrink-0 leading-none"
                        title="Mark cleared"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add date toggle */}
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>
            Add date
          </Button>
        </div>

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
              <span className="text-acc">
                {viewMonth.format('MMMM, YYYY')}
              </span>
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

                  {wi === 0 && selectedDate && !isAddingEntry && (
                    <div className="flex items-center ml-4 whitespace-nowrap">
                      <button
                        className="text-acc/30 hover:text-acc/60 transition-opacity"
                        onClick={() => setIsAddingEntry(true)}
                      >
                        Note / Task / Call
                      </button>
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

            {/* Entries on selected date */}
            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map(e => (
                  <div key={e.id} className="flex items-start justify-between gap-8 mb-1">
                    <span className="text-acc/80 text-sm">
                      <span className="text-acc/40 mr-2">{e.type}</span>{e.text}
                    </span>
                    <button
                      onClick={() => handleClearEntry(e)}
                      className="text-acc/20 hover:text-acc/60 transition-opacity shrink-0 leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming list */}
        {upcomingEntries.length > 0 && (
          <div>
            <div className="text-acc/30 text-xs tracking-widest mb-4">
              {'// UPCOMING'}
            </div>
            <div className="space-y-1">
              {upcomingEntries.map(entry => (
                <div key={entry.id} className="flex justify-between gap-16">
                  <span className="text-acc/60 whitespace-nowrap text-sm">
                    {dayjs(entry.date).format('ddd, MMM D')}
                  </span>
                  <span className="text-acc/60 text-right text-sm">
                    {entry.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {entries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40 text-sm">No scheduled events.</div>
        )}
      </div>
    </Block>
  )
}
