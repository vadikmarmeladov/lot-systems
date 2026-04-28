import React from 'react'
import { Block, Button } from '#client/components/ui'
import * as stores from '#client/stores'
import { useStore } from '@nanostores/react'
import { recordSignal, intentionEngine } from '#client/stores/intentionEngine'
import { useLogs } from '#client/queries'
import dayjs from '#client/utils/dayjs'

type ReflectView = 'reflect' | 'recent'

/**
 * Journal Reflection Widget
 * View 1 (Reflect:) — time-aware prompts + QIE pattern context + Write action
 * View 2 (Journal:) — live activity: entries today, time since last write, total
 */
export function JournalReflection() {
  const [view, setView] = React.useState<ReflectView>('reflect')
  const engine = useStore(intentionEngine)
  const { data: logs = [] } = useLogs()

  const cycleView = () => setView(prev => (prev === 'reflect' ? 'recent' : 'reflect'))

  const navigateToLog = React.useCallback(() => {
    try {
      recordSignal('journal', 'reflect_initiated', { hour: new Date().getHours() })
    } catch (e) {}
    stores.goTo('logs')
  }, [])

  // Count text-bearing log entries (journal writing, not system events)
  const journalStats = React.useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    const textLogs = logs.filter((l) => l.text && l.text.trim().length > 10)
    const todayLogs = textLogs.filter(
      (l) => dayjs(l.createdAt).format('YYYY-MM-DD') === today
    )
    const lastEntry = textLogs[0]

    let timeSince: string | null = null
    if (lastEntry) {
      const mins = dayjs().diff(dayjs(lastEntry.createdAt), 'minute')
      if (mins < 60) timeSince = `${mins}m`
      else {
        const hrs = Math.floor(mins / 60)
        timeSince = hrs < 24 ? `${hrs}h` : `${Math.floor(hrs / 24)}d`
      }
    }

    return {
      todayCount: todayLogs.length,
      totalCount: textLogs.length,
      timeSince,
    }
  }, [logs])

  // Top QIE pattern for context injection
  const topPattern = React.useMemo(
    () => engine.recognizedPatterns[0] ?? null,
    [engine.recognizedPatterns]
  )

  // Time-aware reflection prompts
  const prompts = React.useMemo(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 9)
      return {
        primary: 'What intentions do you hold for today?',
        secondary: 'How do you want to feel by evening?',
        tertiary: 'What needs your attention today?',
      }
    if (h >= 9 && h < 12)
      return {
        primary: "What's alive in you right now?",
        secondary: 'What are you noticing about this morning?',
        tertiary: 'What wants to be acknowledged?',
      }
    if (h >= 12 && h < 17)
      return {
        primary: "What's present for you in this moment?",
        secondary: 'What surprised you today so far?',
        tertiary: 'What are you learning about yourself?',
      }
    if (h >= 17 && h < 21)
      return {
        primary: 'What did today teach you?',
        secondary: 'What moment are you grateful for?',
        tertiary: 'What are you ready to release?',
      }
    return {
      primary: 'What wants to be named before sleep?',
      secondary: 'What truth is emerging for you?',
      tertiary: 'What does your soul want you to know?',
    }
  }, [])

  const label = view === 'reflect' ? 'Reflect:' : 'Journal:'

  return (
    <Block label={label} blockView onLabelClick={cycleView}>
      {view === 'reflect' && (
        <div className="inline-block w-full">
          <div className="mb-16">{prompts.primary}</div>
          <div className="flex flex-col gap-4 mb-16 opacity-60">
            <div>. {prompts.secondary}</div>
            <div>. {prompts.tertiary}</div>
          </div>
          {topPattern && (
            <div className="mb-16 opacity-30">
              {topPattern.pattern.replace(/-/g, ' ')} detected.
            </div>
          )}
          <Button onClick={navigateToLog}>Write</Button>
        </div>
      )}

      {view === 'recent' && (
        <div className="inline-block w-full">
          <div className="flex justify-between mb-12">
            <span className="opacity-60">Today</span>
            <span>
              {journalStats.todayCount}{' '}
              {journalStats.todayCount === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          {journalStats.timeSince && (
            <div className="flex justify-between mb-12">
              <span className="opacity-60">Last written</span>
              <span>{journalStats.timeSince} ago</span>
            </div>
          )}
          <div className="flex justify-between mb-16">
            <span className="opacity-60">Total</span>
            <span>{journalStats.totalCount}</span>
          </div>
          {topPattern && (
            <div className="mb-16 opacity-30">
              Pattern: {topPattern.pattern.replace(/-/g, ' ')}
            </div>
          )}
          <Button onClick={navigateToLog}>Open log</Button>
        </div>
      )}
    </Block>
  )
}
