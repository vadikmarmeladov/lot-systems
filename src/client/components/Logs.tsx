/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Block, Button, ResizibleGhostInput, Unknown } from '#client/components/ui'
import { useLogs, useUpdateLog } from '#client/queries'
import { useDebounce, useMouseInactivity } from '#client/utils/hooks'
import dayjs from '#client/utils/dayjs'
import * as fp from '#shared/utils/fp'
import { Log, LogSettingsChangeMetadata } from '#shared/types'
import { cn } from '#client/utils'
import { atom, map } from 'nanostores'
import {
  COUNTRY_BY_ALPHA3,
  USER_SETTING_NAMES,
  USER_SETTING_NAME_BY_ID,
} from '#shared/constants'
import { toCelsius } from '#shared/utils'
import {
  playKeyClick,
  playSynthActivationChime,
  playSynthDeactivationChime,
} from '#client/utils/sovietKeyboard'
import { detectNewTriggers, type LogTrigger } from '#client/utils/logTriggers'
import { recordLogSignal, recordJournalSignal, analyzeIntentions } from '#client/stores/intentionEngine'

const localStore = {
  logById: map<Record<string, Log>>({}),
  logIds: atom<string[]>([]),
}

export const Logs: React.FC = () => {
  const inputContainerRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const isTouchDevice = useStore(stores.isTouchDevice)
  const logById = useStore(localStore.logById)
  const logIds = useStore(localStore.logIds)

  const [isMouseActive, setIsMouseActive] = React.useState(true)
  const pendingPushRef = React.useRef<NodeJS.Timeout | null>(null)

  const { data: loadedLogs = [], refetch: refetchLogs } = useLogs()

  const { mutate: updateLog } = useUpdateLog({
    onSuccess: (log: any) => {
      // Skip if server deleted the log (user backspaced all content)
      if (log.deleted) {
        // Remove from store — read fresh store to avoid stale closure
        const current = localStore.logById.get()
        const { [log.id]: _, ...rest } = current
        localStore.logById.set(rest as Record<string, Log>)
        localStore.logIds.set(localStore.logIds.get().filter((id: string) => id !== log.id))
        return
      }
      // Read fresh store value to avoid stale closure overwriting recent data
      const current = localStore.logById.get()
      localStore.logById.set({
        ...current,
        [log.id]: log as Log,
      })
      // Only refetch (push down) if this is the primary/most recent log
      // Past logs don't need to trigger push-down
      if (log.id === recentLogId) {
        // Refetch logs to push down saved entry and create new empty log
        // Wait 7 seconds: 3s pause (read saved entry) + 4s gentle blink = 7s total
        // Push happens when blink completes at opacity 0.2 (matching saved logs)
        pendingPushRef.current = setTimeout(async () => {
          try {
            await refetchLogs()
            pendingPushRef.current = null
          } catch (error) {
            console.error('[Logs] Refetch failed:', error)
            pendingPushRef.current = null
          }
        }, 7000)
      }
    },
  })

  React.useEffect(() => {
    if (!loadedLogs.length) return

    // Update both stores atomically to prevent race condition
    const newLogById = loadedLogs.reduce(fp.by('id'), {})
    const newLogIds = loadedLogs.map(fp.prop('id'))

    // Update in a single batch to avoid intermediate renders
    localStore.logById.set(newLogById)
    localStore.logIds.set(newLogIds)
  }, [loadedLogs])

  // Cleanup pending push timeout on unmount
  React.useEffect(() => {
    return () => {
      if (pendingPushRef.current) {
        clearTimeout(pendingPushRef.current)
        pendingPushRef.current = null
      }
    }
  }, [])

  const onChangeLog = React.useCallback(
    (id: string) => (text: string) => {
      updateLog({ id, text })
    },
    [updateLog]
  )

  const [recentLogId, pastLogIds] = React.useMemo(() => {
    return [logIds[0], logIds.slice(1)]
  }, [logIds])

  const dateFormat = React.useMemo(() => {
    return isTimeFormat12h ? 'h:mm:ss A (M/D/YY)' : 'HH:mm:ss[Z] DD/MM/YY'
  }, [isTimeFormat12h])

  // Memoize onChange for primary log to prevent excessive re-renders
  const onChangePrimaryLog = React.useMemo(
    () => onChangeLog(recentLogId),
    [onChangeLog, recentLogId]
  )

  React.useEffect(() => {
    setTimeout(() => {
      const textarea = inputContainerRef?.current?.querySelector('textarea')
      if (!textarea) return
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = 9e6
    }, 300)
  }, [])

  const onMouseActivityChange = React.useCallback(
    (isMoving: boolean) => {
      if (isTouchDevice) return
      const nav = document.querySelector('#nav')
      if (!nav) return
      if (isMoving) {
        setIsMouseActive(true)
        nav.classList.remove('opacity-0', 'pointer-events-none')
      } else {
        setIsMouseActive(false)
        nav.classList.add('opacity-0', 'pointer-events-none')
      }
    },
    [isTouchDevice]
  )

  useMouseInactivity(2000, onMouseActivityChange)

  React.useEffect(() => {
    if (isTouchDevice) return
    const page = document.querySelector('#page')
    const onClick = (ev: Event) => {
      if (ev.target !== page) return
      stores.goTo('system')
    }
    page?.addEventListener('click', onClick)
    return () => {
      page?.removeEventListener('click', onClick)
    }
  }, [isTouchDevice])

  if (!logIds.length) return <>Loading...</>

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-y-[1.5rem] leading-[1.5rem] px-4 sm:px-0"
    >
      <div ref={inputContainerRef} className="min-h-[200px]">
        {logById[recentLogId] ? (
          <NoteEditor
            key={recentLogId}
            log={logById[recentLogId]}
            primary
            onChange={onChangePrimaryLog}
            isMouseActive={isMouseActive}
            dateFormat={dateFormat}
            pendingPushRef={pendingPushRef}
          />
        ) : null}
      </div>

      {pastLogIds.map((id) => {
        const log = logById[id]
        if (!log) return null  // Skip if log doesn't exist yet
        if (log.event === 'answer') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="MEM:" blockView>
                {log.metadata.question as string}
              </Block>
              <Block label="OUT:" blockView>
                {log.metadata.answer as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'chat_message') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="COMM:" blockView>
                {log.metadata.message as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'chat_message_like') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="COMM:" blockView>
                ACK{'\n'}{log.metadata.message as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'emotional_checkin') {
          const emotionalState = log.metadata?.emotionalState as string
          const checkInType = log.metadata?.checkInType as string
          const note = log.metadata?.note as string
          const insights = log.metadata?.insights as string[] | undefined

          const sector =
            checkInType === 'morning' ? '0600' :
            checkInType === 'evening' ? '1800' :
            'SPOT'

          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label={`BIO [${sector}]:`} blockView>
                <div className="mb-8 uppercase tracking-widest">{emotionalState}</div>
                {note && <div className="mb-8">{note}</div>}
                {insights && insights.length > 0 && (
                  <div>
                    {insights.map((insight, idx) => (
                      <div key={idx}>· {insight}</div>
                    ))}
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'self_care_complete' || log.event === 'self_care_completed') {
          const action = log.metadata?.action as string | undefined
          const practice = log.metadata?.practice as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CARE:" blockView>
                <div className="uppercase tracking-widest">{action || practice || '— protocol executed'}</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'plan_set') {
          const intent = log.metadata?.intent as string | undefined
          const today = log.metadata?.today as string | undefined
          const how = log.metadata?.how as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="PLAN:" blockView>
                {intent && <div>&gt; {intent}</div>}
                {today && <div className="opacity-60">{today}</div>}
                {how && <div className="opacity-40">{how}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'intention') {
          const intention = log.metadata?.intention as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="INTENT:" blockView>
                <div className="uppercase tracking-widest">{intention || log.text || '—'}</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'settings_change') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CFG:" blockView>
                {USER_SETTING_NAMES.map((x) => {
                  const change = (log.metadata as LogSettingsChangeMetadata)
                    .changes[x]
                  if (!change) return null
                  let from: string | null = change[0]
                  let to: string | null = change[1]
                  if (x === 'country') {
                    from = from ? COUNTRY_BY_ALPHA3[from]?.name : null
                    to = to ? COUNTRY_BY_ALPHA3[to]?.name : null
                  } else if (x === 'hideActivityLogs') {
                    from = from ? 'Off' : 'On'
                    to = to ? 'Off' : 'On'
                  }
                  return (
                    <div key={x}>
                      {USER_SETTING_NAME_BY_ID[x]}:{' '}
                      {from || <Unknown>—</Unknown>} →{' '}
                      {to || <Unknown>—</Unknown>}
                    </div>
                  )
                })}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'system_snapshot') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="SYS:" blockView>
                {log.context?.city && (
                  <div>
                    POS: {log.context.city}
                    {log.context.country && `, ${log.context.country}`}
                  </div>
                )}
                {log.context?.temperature && (
                  <div>TMP: {Math.round(toCelsius(log.context.temperature))}°C</div>
                )}
                {log.context?.humidity && (
                  <div>HUM: {log.context.humidity}%</div>
                )}
                {log.metadata?.sound && (
                  <div>SND: {log.metadata.sound}</div>
                )}
                {log.metadata?.theme?.theme && (
                  <div>THM: {log.metadata.theme.theme}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'quantum_intent_signal') {
          const pattern = log.metadata?.pattern as string | undefined
          const source = log.metadata?.source as string | undefined
          const confidence = log.metadata?.confidence as number | undefined
          const reason = log.metadata?.reason as string | undefined
          if (!pattern && !log.text) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="QIE:" blockView>
                {pattern && (
                  <div className="uppercase tracking-widest mb-4">
                    {pattern.replace(/-/g, ' ')}
                  </div>
                )}
                {source && <div className="opacity-60">SRC: {source.toUpperCase()}</div>}
                {confidence !== undefined && (
                  <div className="opacity-40">
                    CONF: {Math.round(confidence * 100)}%
                  </div>
                )}
                {reason && (
                  <div className="opacity-30 mt-4">{reason}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'energy_state' || log.event === 'energy_update') {
          const status = log.metadata?.status as string | undefined
          const level = log.metadata?.level as number | undefined
          const trajectory = log.metadata?.trajectory as string | undefined
          const needsReplenishment = log.metadata?.needsReplenishment as string[] | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="BIOFIELD:" blockView>
                {status && (
                  <div className="uppercase tracking-widest mb-4">{status}</div>
                )}
                {level !== undefined && (
                  <div className="opacity-60">
                    ATP: {level}%
                    {trajectory && (
                      <span className="ml-8 capitalize opacity-60">{trajectory}</span>
                    )}
                  </div>
                )}
                {needsReplenishment && needsReplenishment.length > 0 && (
                  <div className="opacity-40 mt-4">
                    NEED: {needsReplenishment.slice(0, 2).join(', ')}
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'qos_state') {
          const version = log.metadata?.version as string | undefined
          const archetype = log.metadata?.archetype as string | undefined
          const cohort = log.metadata?.behavioralCohort as string | undefined
          const atp = log.metadata?.atp as number | undefined
          const assembledModules = log.metadata?.assembledModules as number | undefined
          const totalModules = log.metadata?.totalModules as number | undefined
          const health = log.metadata?.health as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="QOS:" blockView>
                {version && (
                  <div className="uppercase tracking-widest mb-4">VER: {version}</div>
                )}
                {archetype && (
                  <div className="opacity-60">ARCH: {archetype}</div>
                )}
                {cohort && (
                  <div className="opacity-60">COHORT: {cohort}</div>
                )}
                {atp !== undefined && (
                  <div className="opacity-60">ATP: {atp}%</div>
                )}
                {assembledModules !== undefined && totalModules !== undefined && (
                  <div className="opacity-40">
                    ASM: {assembledModules}/{totalModules} modules
                  </div>
                )}
                {health && (
                  <div className="opacity-30 uppercase tracking-widest mt-4">{health}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'physiological_cohort') {
          const archetype = log.metadata?.archetype as string | undefined
          const behavioralCohort = log.metadata?.behavioralCohort as string | undefined
          const description = log.metadata?.description as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="COHORT:" blockView>
                {archetype && (
                  <div className="uppercase tracking-widest mb-4">{archetype}</div>
                )}
                {behavioralCohort && (
                  <div className="opacity-60">TYPE: {behavioralCohort}</div>
                )}
                {description && (
                  <div className="opacity-30 mt-4">{description}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'self_assembly') {
          const phase = log.metadata?.phase as string | undefined
          const assembled = log.metadata?.assembled as number | undefined
          const total = log.metadata?.total as number | undefined
          const milestone = log.metadata?.milestone as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="ASM:" blockView>
                {phase && (
                  <div className="uppercase tracking-widest mb-4">{phase}</div>
                )}
                {assembled !== undefined && total !== undefined && (
                  <div className="opacity-60">MODULES: {assembled}/{total}</div>
                )}
                {milestone && (
                  <div className="opacity-40 mt-4">{milestone}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'care_momentum') {
          const careCount = log.metadata?.careCount as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CARM:" blockView>
                <div className="uppercase tracking-widest mb-4">Care momentum</div>
                {careCount !== undefined && (
                  <div className="opacity-60">Self-care 24h: {careCount}</div>
                )}
                <div className="opacity-40">No depleting signals. Proactive cycle active.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'intention_decay_notice') {
          const note = log.metadata?.note as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="INTENT-DECAY:" blockView>
                <div className="uppercase tracking-widest mb-4">Intention set — no execution 48h</div>
                {note && <div className="opacity-40">{note}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'intention_follow_through') {
          const plannerCount = log.metadata?.plannerCount as number | undefined
          const goalCount = log.metadata?.goalCount as number | undefined
          const intentionLabel = log.metadata?.intentionLabel as string | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="INTF:" blockView>
                <div className="uppercase tracking-widest mb-4">Execution arc complete</div>
                {intentionLabel && (
                  <div className="opacity-60 mb-4">&gt; {intentionLabel}</div>
                )}
                {plannerCount !== undefined && (
                  <div className="opacity-60">PLAN 48h: {plannerCount}</div>
                )}
                {goalCount !== undefined && (
                  <div className="opacity-60">GOAL 48h: {goalCount}</div>
                )}
                <div className="opacity-40 mt-4">Intention → structure → action. Loop closed.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'energy_check') {
          const level = log.metadata?.level as number | undefined
          const status = log.metadata?.status as string | undefined
          const trajectory = log.metadata?.trajectory as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="BIO [ATP]:" blockView>
                {level !== undefined && (
                  <div className="tabular-nums uppercase tracking-widest">{level}%</div>
                )}
                {status && (
                  <div className="opacity-60 uppercase">{status}</div>
                )}
                {trajectory && (
                  <div className="opacity-40">&rarr; {trajectory}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'evolution_milestone') {
          const milestone = log.metadata?.milestone as string | undefined
          const dimension = log.metadata?.dimension as string | undefined
          const level = log.metadata?.level as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="EVO:" blockView>
                {milestone && (
                  <div className="uppercase tracking-widest">{milestone}</div>
                )}
                {dimension && (
                  <div className="opacity-60">{dimension}</div>
                )}
                {level !== undefined && (
                  <div className="opacity-40 tabular-nums">LVL {level}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'biofield_recovery_arc') {
          const confidence = log.metadata?.confidence as number | undefined
          const selfCareCount = log.metadata?.selfCareCount as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="ARC:" blockView>
                <div className="uppercase tracking-widest mb-4">Recovery arc closed</div>
                {selfCareCount !== undefined && (
                  <div className="opacity-60">CARE 4h: {selfCareCount}</div>
                )}
                <div className="opacity-40">Depleted → intervention → restored.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'cognitive_expansion') {
          const sourcesActive = log.metadata?.sourcesActive as number | undefined
          const wordCount = log.metadata?.wordCount as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CEXP:" blockView>
                <div className="uppercase tracking-widest mb-4">Cognitive expansion</div>
                {wordCount !== undefined && (
                  <div className="opacity-60">LOG DEPTH: {wordCount}w</div>
                )}
                {sourcesActive !== undefined && (
                  <div className="opacity-60">SOURCES: {sourcesActive}</div>
                )}
                <div className="opacity-40">Memory + journal + goals simultaneous.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'goal_complete') {
          const goalTitle = log.metadata?.title as string | undefined
          const category = log.metadata?.category as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="GOAL-X:" blockView>
                <div className="uppercase tracking-widest mb-4">Goal complete</div>
                {goalTitle && <div className="opacity-60">&gt; {goalTitle}</div>}
                {category && <div className="opacity-40">CAT: {category.toUpperCase()}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'biofield_coherence_cascade') {
          const moduleCount = log.metadata?.moduleCount as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CASCADE:" blockView>
                <div className="uppercase tracking-widest mb-4">Biofield coherence cascade</div>
                {moduleCount !== undefined && (
                  <div className="opacity-60">PRIMARY MODULES: {moduleCount}</div>
                )}
                <div className="opacity-40">Recovery arc + cognitive expansion converging.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'resonant_synthesis') {
          const sourcesActive = log.metadata?.sourcesActive as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="SYNTH:" blockView>
                <div className="uppercase tracking-widest mb-4">Resonant synthesis</div>
                {sourcesActive !== undefined && (
                  <div className="opacity-60">SOURCES 7d: {sourcesActive}</div>
                )}
                <div className="opacity-40">Full cascade + reflection + cognition advancing.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'deep_work_cascade') {
          const signalCount = log.metadata?.signalCount as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="DWRK:" blockView>
                <div className="uppercase tracking-widest mb-4">Deep work cascade</div>
                {signalCount !== undefined && (
                  <div className="opacity-60">SIGNALS 3h: {signalCount}</div>
                )}
                <div className="opacity-40">Memory + planner + journal + goals. No interruption.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'social_resonance_arc') {
          const signalCount = log.metadata?.signalCount as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="SOCR:" blockView>
                <div className="uppercase tracking-widest mb-4">Connection loop closed</div>
                {signalCount !== undefined && (
                  <div className="opacity-60">SIGNALS 48h: {signalCount}</div>
                )}
                <div className="opacity-40">Community → outreach → reflection.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'cognitive_load_release') {
          const plannerCount = log.metadata?.plannerCount as number | undefined
          const journalCount = log.metadata?.journalCount as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="RLSE:" blockView>
                <div className="uppercase tracking-widest mb-4">Decompression loop closed</div>
                {plannerCount !== undefined && (
                  <div className="opacity-60">PLAN 24h: {plannerCount}</div>
                )}
                {journalCount !== undefined && (
                  <div className="opacity-60">JRN 24h: {journalCount}</div>
                )}
                <div className="opacity-40">Structure → reflection → care. Load released.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'temporal_coherence_window') {
          const calCount = log.metadata?.calendarCount as number | undefined
          const planCount = log.metadata?.plannerCount as number | undefined
          const intentCount = log.metadata?.intentionCount as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="TCOH:" blockView>
                <div className="uppercase tracking-widest mb-4">Temporal grid active</div>
                {calCount !== undefined && (
                  <div className="opacity-60">CAL 7d: {calCount}</div>
                )}
                {planCount !== undefined && (
                  <div className="opacity-60">PLAN 7d: {planCount}</div>
                )}
                {intentCount !== undefined && (
                  <div className="opacity-60">INTENT 7d: {intentCount}</div>
                )}
                <div className="opacity-40">Calendar + planner + intentions. Time anchored.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'recovery_velocity') {
          const preMood = log.metadata?.preMood as string | undefined
          const postMood = log.metadata?.postMood as string | undefined
          const windowMinutes = log.metadata?.windowMinutes as number | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="RECV:" blockView>
                <div className="uppercase tracking-widest mb-4">Recovery arc accelerating</div>
                {(preMood || postMood) && (
                  <div className="opacity-60">
                    {preMood && preMood.toUpperCase()} → {postMood && postMood.toUpperCase()}
                  </div>
                )}
                {windowMinutes !== undefined && (
                  <div className="opacity-60">WINDOW: {windowMinutes}min</div>
                )}
                <div className="opacity-40">Negative → care → positive restored.</div>
                {confidence !== undefined && (
                  <div className="opacity-30">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'signal_silence') {
          const priorSources = log.metadata?.priorSources as number | undefined
          const silenceHours = log.metadata?.silenceHours as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="SIL:" blockView>
                <div className="uppercase tracking-widest mb-4">Signal silence detected</div>
                {priorSources !== undefined && (
                  <div className="opacity-60">PRIOR SOURCES: {priorSources}</div>
                )}
                {silenceHours !== undefined && (
                  <div className="opacity-60">QUIET: {silenceHours}h</div>
                )}
                <div className="opacity-40">The field went still. Check in.</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'circadian_anchor_loss') {
          const consecutiveNights = log.metadata?.consecutiveNights as number | undefined
          const depletedMornings = log.metadata?.depletedMornings as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CIRC:" blockView>
                <div className="uppercase tracking-widest mb-4">Circadian anchor lost</div>
                {consecutiveNights !== undefined && (
                  <div className="opacity-60">LATE-NIGHT RUN: {consecutiveNights} consecutive nights</div>
                )}
                {depletedMornings !== undefined && (
                  <div className="opacity-60">MORNING DEPLETION: {depletedMornings} day{depletedMornings === 1 ? '' : 's'}</div>
                )}
                <div className="opacity-40">Sleep architecture destabilizing. Rest protocol now.</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'badge_unlock') {
          const badgeName = log.metadata?.badgeName as string | undefined
          const tier = log.metadata?.tier as string | undefined
          const level = log.metadata?.level as number | undefined
          if (!badgeName && !log.text) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="BADGE:" blockView>
                <div className="uppercase tracking-widest mb-4">
                  {badgeName || log.text || '—'}
                </div>
                {tier && <div className="opacity-60">TIER: {tier.toUpperCase()}</div>}
                {level !== undefined && (
                  <div className="opacity-40">LVL: {level}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'quantum_os_snapshot') {
          const modules = log.metadata?.assembledModules as number | undefined
          const totalModules = log.metadata?.totalModules as number | undefined
          const assembly = log.metadata?.assembly as number | undefined
          const phase = log.metadata?.phase as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="QTOS:" blockView>
                {phase && (
                  <div className="uppercase tracking-widest mb-4">{phase}</div>
                )}
                {modules !== undefined && totalModules !== undefined && (
                  <div className="opacity-60 tabular-nums">
                    MOD: {modules}/{totalModules}
                  </div>
                )}
                {assembly !== undefined && (
                  <div className="opacity-40 tabular-nums">ASM: {assembly}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'recipe_viewed') {
          const mealType = log.metadata?.mealType as string | undefined
          const recipeName = log.metadata?.recipeName as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="NUTR:" blockView>
                {mealType && (
                  <div className="uppercase tracking-widest mb-4">{mealType}</div>
                )}
                {recipeName && (
                  <div className="opacity-60">{recipeName}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'goal_set' || log.event === 'goal_journey' || log.event === 'goal_update') {
          const title = log.metadata?.title as string | undefined
          const action = log.metadata?.action as string | undefined
          const stage = log.metadata?.stage as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="GOAL:" blockView>
                {title && (
                  <div className="uppercase tracking-widest mb-4">{title}</div>
                )}
                {(action || stage) && (
                  <div className="opacity-60">
                    {action || stage}
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'full_stack_session') {
          const activeSources = log.metadata?.activeSources as string[] | undefined
          const windowMinutes = log.metadata?.windowMinutes as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="STACK:" blockView>
                <div className="uppercase tracking-widest mb-4">FULL STACK</div>
                {activeSources && activeSources.length > 0 && (
                  <div className="opacity-60">{activeSources.join(' · ')}</div>
                )}
                {windowMinutes !== undefined && (
                  <div className="opacity-40 tabular-nums">WIN: {windowMinutes}m</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'benchmark_read') {
          const tier = log.metadata?.tier as string | undefined
          const score = log.metadata?.score as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="BENCH:" blockView>
                {tier && (
                  <div className="uppercase tracking-widest mb-4">{tier}</div>
                )}
                {score !== undefined && (
                  <div className="opacity-60 tabular-nums">SCR: {score}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'qos_phase_transition') {
          const fromPhase = log.metadata?.fromPhase as string | undefined
          const toPhase = log.metadata?.toPhase as string | undefined
          const moduleId = log.metadata?.moduleId as string | undefined
          if (!fromPhase && !toPhase) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="PHASE:" blockView>
                {moduleId && (
                  <div className="uppercase tracking-widest mb-4">{moduleId.replace(/-/g, ' ')}</div>
                )}
                <div className="opacity-60 tabular-nums">
                  {fromPhase?.toUpperCase() || '—'} → {toPhase?.toUpperCase() || '—'}
                </div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'user_login' || log.event === 'user_logout') {
          const isLogin = log.event === 'user_login'
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="AUTH:" blockView>
                <div className="uppercase tracking-widest">
                  {isLogin ? 'SESSION OPENED' : 'SESSION CLOSED'}
                </div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'weather_update') {
          const city = log.context?.city as string | undefined
          const temp = log.context?.temperature as number | undefined
          const description = log.metadata?.description as string | undefined
          if (!city && !temp) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="ENV:" blockView>
                {city && <div className="uppercase tracking-widest">{city}</div>}
                {temp && <div className="opacity-60">{Math.round(temp - 273.15)}°C{description ? ` · ${description}` : ''}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'theme_change') {
          const theme = log.metadata?.theme as string | undefined
          if (!theme) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="UI:" blockView>
                <div className="uppercase tracking-widest">THM {theme}</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'scheduled_job') {
          const jobName = log.metadata?.jobName as string | undefined
          const success = log.metadata?.success as boolean | undefined
          const resultSent = log.metadata?.result?.sent as number | undefined
          const resultProcessed = log.metadata?.result?.processed as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="JOB:" blockView>
                {jobName && (
                  <div className="uppercase tracking-widest mb-4">
                    {jobName.replace(/-/g, ' ')}
                  </div>
                )}
                <div className="opacity-60">
                  {success === true ? 'STATUS: OK' : success === false ? 'STATUS: ERR' : 'STATUS: —'}
                </div>
                {(resultSent !== undefined || resultProcessed !== undefined) && (
                  <div className="opacity-40 tabular-nums">
                    {resultSent !== undefined ? `SENT: ${resultSent}` : ''}
                    {resultProcessed !== undefined ? `PROC: ${resultProcessed}` : ''}
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'self_care_skip') {
          const reason = log.metadata?.reason as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CARE [SKIP]:" blockView>
                <div className="uppercase tracking-widest opacity-40">
                  {reason || 'Protocol skipped'}
                </div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'weekly_summary_response') {
          const weekNumber = log.metadata?.weekNumber as number | undefined
          const response = log.metadata?.response as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label={`MEM [W${weekNumber ?? '—'}]:`} blockView>
                {response && (
                  <div className="opacity-60">{response}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'calendar_entry') {
          const entryDate = log.metadata?.date as string | undefined
          const entryText = log.metadata?.text as string | undefined
          const entryType = (log.metadata?.entryType as string | undefined) || 'note'
          const typeLabel = entryType.toUpperCase()
          const formattedDate = entryDate
            ? dayjs(entryDate).format('YYYY-MM-DD / ddd').toUpperCase()
            : '—'
          const daysUntil = entryDate
            ? dayjs(entryDate).startOf('day').diff(dayjs().startOf('day'), 'day')
            : null
          const countdownLabel =
            daysUntil === null
              ? null
              : daysUntil === 0
                ? 'TODAY'
                : daysUntil > 0
                  ? `T-${daysUntil}`
                  : `+${Math.abs(daysUntil)}`
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label={`CAL [${typeLabel}]:`} blockView>
                <div className="uppercase tracking-widest mb-4 flex items-baseline gap-8">
                  <span>{formattedDate}</span>
                  {countdownLabel && (
                    <span className={cn(
                      'text-xs tabular-nums',
                      daysUntil === 0 ? 'opacity-100' : 'opacity-40'
                    )}>
                      {countdownLabel}
                    </span>
                  )}
                </div>
                {entryText && (
                  <div className="opacity-60">{entryText}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event !== 'note') {
          if (!log.text) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="LOG:" blockView>
                {log.text}
              </Block>
            </LogContainer>
          )
        }
        return (
          <NoteEditor
            key={id}
            log={log}
            onChange={onChangeLog(id)}
            isMouseActive={isMouseActive}
            dateFormat={dateFormat}
          />
        )
      })}
    </div>
  )
}

const NoteEditor = ({
  log,
  primary,
  onChange,
  isMouseActive,
  dateFormat,
  pendingPushRef,
}: {
  log: Log
  primary?: boolean
  onChange: (text: string) => void
  isMouseActive: boolean
  dateFormat: string
  pendingPushRef?: React.MutableRefObject<NodeJS.Timeout | null>
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const valueRef = React.useRef(log.text || '')
  const logTextRef = React.useRef(log.text || '')
  const onChangeRef = React.useRef(onChange)

  const [isFocused, setIsFocused] = React.useState(false)
  const [value, setValue] = React.useState(log.text || '')
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null)
  const [isSaved, setIsSaved] = React.useState(true) // Track if current content is saved
  const debounceTime = 7000  // 7s for all logs
  const debouncedValue = useDebounce(value, debounceTime)

  // Keep refs in sync
  React.useEffect(() => {
    valueRef.current = value
    // Mark as unsaved when user types
    if (value !== log.text) {
      setIsSaved(false)
      // Don't cancel pending push - let the save complete and push down
      // The sync effect has protection to not overwrite unsaved changes
    }
  }, [value, log.text, primary])

  React.useEffect(() => {
    logTextRef.current = log.text
  }, [log.text])

  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Note: No blur save handler - saves happen via unmount and debounced autosave
  // This keeps scrolling behavior simple (no blur = no issues)

  // Autosave for all logs (7s debounce)
  // Timeline: finish typing > wait 7s > save > opacity fades to 20% > push
  React.useEffect(() => {
    if (log.text === debouncedValue) return

    // Save the log
    onChange(debouncedValue)

    // Feed QIE biofield loop — journal depth signal for Reflection Layer assembly
    const wordCount = debouncedValue.trim().split(/\s+/).filter(Boolean).length
    if (wordCount > 0) {
      try {
        if (primary) {
          recordJournalSignal(wordCount)
        } else {
          recordLogSignal(wordCount, !!log.context)
        }
      } catch {}
    }

    // Update timestamp
    setLastSavedAt(new Date())

    // IMPORTANT: Only mark as saved if current value matches what we're saving
    // This prevents race condition where user types more while save is in progress
    if (valueRef.current === debouncedValue) {
      setIsSaved(true)
    }
  }, [debouncedValue, onChange, log.text, primary])

  // Sync local state when log updates from server
  // BUT: Don't overwrite if user is actively typing (focused)
  // ALSO: Don't clear non-empty user input to empty server value (prevents race condition)
  // ALSO: Don't sync if there are unsaved changes
  // NOTE: isFocused and value are NOT in deps - only sync when log.text changes from server
  React.useEffect(() => {
    if (isFocused) return  // Skip sync while user is typing
    if (!isSaved) return  // Skip sync if there are unsaved changes
    // Defensive: Don't clear user's typed text if server hasn't saved yet
    // This prevents race condition on mobile where blur saves but mutation hasn't completed
    if (value && !log.text) return
    // Additional safety: Don't overwrite if current value is different from server value
    // This prevents race condition where user typed more while autosave was in progress
    if (valueRef.current !== log.text && valueRef.current.length > log.text.length) return
    setValue(log.text || '')
  }, [log.text, isFocused, isSaved])  // eslint-disable-line react-hooks/exhaustive-deps

  // Track focus state for sync effect (prevent overwriting while typing)
  React.useEffect(() => {
    const textarea = containerRef.current?.querySelector('textarea')
    if (!textarea) return

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    textarea.addEventListener('focus', handleFocus)
    textarea.addEventListener('blur', handleBlur)

    return () => {
      textarea.removeEventListener('focus', handleFocus)
      textarea.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Save when user switches tabs (Page Visibility API)
  // Using refs to avoid re-subscribing on every log.text/onChange change
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && valueRef.current !== logTextRef.current) {
        onChangeRef.current(valueRef.current)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])  // Empty deps - only subscribe once, use refs for latest values

  // Save on unmount (when navigating to different tab within app)
  React.useEffect(() => {
    return () => {
      // Save on unmount if there are unsaved changes
      if (valueRef.current !== logTextRef.current) {
        onChangeRef.current(valueRef.current)
      }
    }
  }, [])

  // Handle Enter key - allow newlines, Cmd/Ctrl+Enter to save
  // Also plays the Soviet synth keyboard click on every keystroke
  // when enabled via Settings or the 🎹 / /synth triggers.
  // Using refs to avoid recreating callback
  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Fire the keyboard click for printable keys, space, Enter, Backspace.
      // We skip modifier-only presses and navigation keys so the sound
      // never feels like a machine gun (Arrow keys during scrolling).
      if (stores.isKeyboardSoundOn.get()) {
        const k = ev.key
        const isPrintable =
          k.length === 1 || k === 'Enter' || k === 'Backspace' || k === 'Tab' || k === ' '
        if (isPrintable && !ev.metaKey && !ev.ctrlKey) {
          try { playKeyClick(k) } catch {}
        }
      }

      if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault()
        if (valueRef.current !== logTextRef.current) {
          onChangeRef.current(valueRef.current) // Immediate save
          setLastSavedAt(new Date())
          setIsSaved(true)
        }
        // Optionally blur to show save happened
        ;(ev.target as HTMLTextAreaElement).blur()
      }
      // Regular Enter key creates newline (default behavior)
    },
    [primary]
  )

  // --------------------------------------------------------------------
  // Inline trigger detection: 🎹 emoji or /synth keyword toggles the
  // Soviet keyboard sound; other triggers (listed in logTriggers.ts)
  // are detected here so future modes can hook in without touching
  // the editor. We compare against the previous value via ref so
  // editing around an existing trigger doesn't re-fire it.
  // --------------------------------------------------------------------
  const lastTriggerScanRef = React.useRef(log.text || '')
  React.useEffect(() => {
    const fresh = detectNewTriggers(value, lastTriggerScanRef.current)
    lastTriggerScanRef.current = value
    if (fresh.length === 0) return

    for (const trigger of fresh as LogTrigger[]) {
      if (trigger === 'toggle-synth') {
        const next = !stores.isKeyboardSoundOn.get()
        stores.isKeyboardSoundOn.set(next)
        try {
          if (next) playSynthActivationChime()
          else playSynthDeactivationChime()
        } catch {}
      } else if (trigger === 'radio-toggle') {
        stores.isRadioOn.set(!stores.isRadioOn.get())
      } else if (trigger === 'prayer-mode' || trigger === 'night-mode') {
        if (!stores.isCustomThemeEnabled.get()) {
          stores.theme.set('dark')
        }
      } else if (trigger === 'qos-report' || trigger === 'assembly-check') {
        // Force immediate quantum intent analysis + recompute self-assembly state
        try { analyzeIntentions() } catch {}
      }
    }
  }, [value])

  const contextText = React.useMemo(() => {
    if (!log?.context) return ''
    const weatherParts: string[] = []
    if (log.context?.temperature) {
      const celsius = toCelsius(log.context.temperature)
      weatherParts.push(`${Math.round(celsius)}°C`)
    }
    if (log.context?.humidity) {
      weatherParts.push(`${Math.round(log.context.humidity)}%`)
    }
    const weatherText = weatherParts.join(', ')
    if (log.context?.city) {
      return `${weatherText} – ${log.context.city}`
    }
    return weatherText
  }, [log?.context])

  return (
    <div className="relative group">
      <div
        className={cn(
          'relative mb-4 sm:mb-0',
          'sm:absolute sm:top-0 sm:right-0 text-end select-none',
          'transition-opacity',
          primary
            ? cn(
                'hidden sm:block ___opacity-30 sm:opacity-100',
                !isMouseActive && 'sm:opacity-0'
              )
            : cn(
                'opacity-30',
                isFocused && 'sm:opacity-100',
                'sm:group-hover:opacity-100'
              )
        )}
      >
        {!primary && contextText ? (
          <div className="relative">
            <div
              className={cn(
                'transition-opacity duration-500',
                'sm:group-hover:opacity-0'
              )}
            >
              {!!log && dayjs(log.updatedAt).format(dateFormat)}
            </div>
            <div
              className={cn(
                'hidden sm:block',
                'absolute top-0 right-0 text-acc/60 transition-opacity duration-500',
                'opacity-0 group-hover:opacity-100 whitespace-nowrap'
              )}
            >
              {contextText}
            </div>
          </div>
        ) : (
          <div>
            {primary
              ? lastSavedAt
                ? dayjs(lastSavedAt).format(dateFormat)
                : 'Just now'
              : !!log && dayjs(log.updatedAt).format(dateFormat)}
          </div>
        )}
      </div>

      <div className="max-w-[700px]" ref={containerRef}>
        <ResizibleGhostInput
          direction="v"
          value={value}
          onChange={setValue}
          onKeyDown={onKeyDown}
          placeholder={
            !primary ? '[ record cleared on empty ]' : (() => {
              const hour = new Date().getHours()
              const phrases = [
                '[ FIELD ENTRY — 0000–0400: night protocol ]',
                '[ FIELD ENTRY — 0400–0600: pre-dawn window ]',
                '[ FIELD ENTRY — 0600–0900: morning briefing ]',
                '[ FIELD ENTRY — 0900–1200: operational block ]',
                '[ FIELD ENTRY — 1200–1400: midday audit ]',
                '[ FIELD ENTRY — 1400–1700: afternoon mission ]',
                '[ FIELD ENTRY — 1700–2000: evening debrief ]',
                '[ FIELD ENTRY — 2000–2400: night transmission ]',
              ]
              const idx =
                hour < 4  ? 0 :
                hour < 6  ? 1 :
                hour < 9  ? 2 :
                hour < 12 ? 3 :
                hour < 14 ? 4 :
                hour < 17 ? 5 :
                hour < 20 ? 6 : 7
              return phrases[idx]
            })()
          }
          className={cn(
            'max-w-[700px] focus:opacity-100 group-hover:opacity-100',
            'placeholder:opacity-100',
            !primary && 'opacity-30',
            primary && isSaved && 'opacity-30',
            primary && !isSaved && 'opacity-100'
          )}
          rows={primary ? 10 : 1}
        />
      </div>
    </div>
  )
}

const LogContainer: React.FC<{
  children: React.ReactNode
  log: Log
  dateFormat: string
}> = ({ log, dateFormat, children }) => {
  const contextText = React.useMemo(() => {
    const weatherParts: string[] = []
    if (log.context?.temperature) {
      const celsius = toCelsius(log.context.temperature)
      weatherParts.push(`${Math.round(celsius)}°C`)
    }
    if (log.context?.humidity) {
      weatherParts.push(`${Math.round(log.context.humidity)}%`)
    }
    const weatherText = weatherParts.join(', ')
    if (log.context?.city) {
      return `${weatherText} – ${log.context.city}`
    }
    return weatherText
  }, [log.context])

  return (
    <div className="relative group">
      <div
        className={cn(
          'relative mb-4 sm:mb-0',
          'sm:absolute sm:top-0 sm:right-0 text-end select-none',
          'transition-opacity',
          'opacity-30',
          'group-hover:opacity-100'
        )}
      >
        {contextText ? (
          <div className="relative">
            <div
              className={cn(
                'transition-opacity duration-500',
                'sm:group-hover:opacity-0'
              )}
            >
              {dayjs(log.updatedAt).format(dateFormat)}
            </div>
            <div
              className={cn(
                'hidden sm:block',
                'absolute top-0 right-0 text-acc/60 transition-opacity duration-500',
                'opacity-0 group-hover:opacity-100 whitespace-nowrap'
              )}
            >
              {contextText}
            </div>
          </div>
        ) : (
          <div>{dayjs(log.updatedAt).format(dateFormat)}</div>
        )}
      </div>

      <div
        className={cn(
          'max-w-[500px] lg:max-w-[700px] whitespace-breakspaces',
          'opacity-30 transition-opacity',
          'group-hover:opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  )
}
