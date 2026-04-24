import * as React from 'react'
import { Block, Button, GhostButton, Page } from '#client/components/ui'
import { cn } from '#client/utils'
import { useDocumentTitle } from '#client/utils/hooks'
import dayjs from 'dayjs'
import { DATE_TIME_FORMAT } from '#shared/constants'

interface SystemCheck {
  name: string
  status: 'ok' | 'error' | 'unknown'
  message?: string
  duration?: number
}

interface StatusData {
  version: string
  timestamp: string
  buildDate: string
  environment: string
  checks: SystemCheck[]
  overall: 'ok' | 'degraded' | 'error'
  cached?: boolean
  cacheAge?: number
}

interface StatusPageProps {
  noWrapper?: boolean
}

interface MemoryStatus {
  currentTime: string
  currentHour: number
  isWeekend: boolean
  timeWindow: string
  shouldShowPrompt: boolean
  promptsShownToday: number
  promptQuotaToday: number
  remainingToday: number
  dayNumber: number
  answeredInLast2Hours: boolean
  nextPromptAvailable: boolean
  blockReason: string | null
}

const OVERALL_LABEL: Record<string, string> = {
  ok: 'All systems operational',
  degraded: 'Degraded performance',
  error: 'Service disruption',
}

const OVERALL_DESCRIPTION: Record<string, string> = {
  ok: 'All components are functioning normally.',
  degraded: 'Some non-critical components have issues. Core services remain operational.',
  error: 'One or more critical components are unavailable.',
}

export const StatusPage = ({ noWrapper = false }: StatusPageProps) => {
  const [status, setStatus] = React.useState<StatusData | null>(null)
  const [memoryStatus, setMemoryStatus] = React.useState<MemoryStatus | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date())

  useDocumentTitle('Systems Status')

  const fetchStatus = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/public/status')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setStatus(data)

      try {
        const localTime = btoa(dayjs().format(DATE_TIME_FORMAT))
        const memResponse = await fetch(`/api/memory-status?d=${localTime}`)
        if (memResponse.ok) {
          const memData = await memResponse.json()
          setMemoryStatus(memData)
        }
      } catch {
        setMemoryStatus(null)
      }

      setLastUpdate(new Date())
    } catch (err: any) {
      setError(err.message || 'Failed to fetch status')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  React.useEffect(() => {
    const interval = setInterval(fetchStatus, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    } catch {
      return dateString
    }
  }

  const getCheckDotClass = (checkStatus: 'ok' | 'error' | 'unknown') => {
    switch (checkStatus) {
      case 'ok':    return 'bg-acc'
      case 'error': return 'bg-acc/30'
      default:      return 'bg-acc/15'
    }
  }

  const getCheckLabel = (checkStatus: 'ok' | 'error' | 'unknown') => {
    switch (checkStatus) {
      case 'ok':    return 'Operational'
      case 'error': return 'Outage'
      default:      return 'Unknown'
    }
  }

  const getOverallDotClass = (overall: string) => {
    switch (overall) {
      case 'ok':       return 'bg-acc'
      case 'degraded': return 'bg-acc/50'
      case 'error':    return 'bg-acc/25'
      default:         return 'bg-acc/15'
    }
  }

  const content = (
    <div className="flex flex-col gap-y-16">
      <div>
        <div className="mb-16">LOT Systems Status</div>
        <GhostButton href="/">← Home</GhostButton>
      </div>

      {loading && !status && (
        <div className="text-acc/40">Fetching status.</div>
      )}

      {error && !status && (
        <div className="mb-32">
          <div className="mb-16 text-acc/60">Error: {error}</div>
          <Button kind="secondary" size="small" onClick={fetchStatus}>
            Retry
          </Button>
        </div>
      )}

      {status && (
        <>
          {/* Overall Status Banner */}
          <div className="mb-16">
            <Block label="Status:" labelClassName="!pl-0">
              <div className="flex items-center gap-x-8">
                <span
                  className={cn(
                    'inline-block w-[8px] h-[8px] rounded-full flex-shrink-0',
                    getOverallDotClass(status.overall),
                    status.overall === 'ok' && 'animate-pulse'
                  )}
                />
                <span>{OVERALL_LABEL[status.overall] ?? status.overall}</span>
              </div>
              {status.overall !== 'ok' && (
                <div className="text-acc/50 mt-4 text-sm">
                  {OVERALL_DESCRIPTION[status.overall]}
                </div>
              )}
            </Block>
            <Block label="Version:" labelClassName="!pl-0">v{status.version}</Block>
            <Block label="Environment:" labelClassName="!pl-0">{status.environment}</Block>
            <Block label="Last checked:" labelClassName="!pl-0" containsSmallButton>
              <div className="flex items-center gap-x-16">
                <span>
                  {formatDate(lastUpdate.toISOString())}
                  {status.cached && status.cacheAge !== undefined && (
                    <span className="text-acc/40"> (cached {status.cacheAge}s ago)</span>
                  )}
                </span>
                <Button
                  kind="secondary"
                  size="small"
                  onClick={fetchStatus}
                  disabled={loading}
                >
                  {loading ? 'Refreshing…' : 'Refresh'}
                </Button>
              </div>
            </Block>
          </div>

          {/* Component Checks */}
          <div className="mb-16">
            <div className="mb-16">Components:</div>
            {status.checks.map((check, index) => (
              <Block
                key={index}
                label={check.name + ':'}
                labelClassName="!pl-0"
                className="mb-8"
              >
                <div className="flex items-center gap-x-8">
                  <span
                    className={cn(
                      'inline-block w-[7px] h-[7px] rounded-full flex-shrink-0',
                      getCheckDotClass(check.status)
                    )}
                  />
                  <span
                    className={cn(
                      check.status === 'ok' ? 'text-acc' : 'text-acc/50'
                    )}
                  >
                    {getCheckLabel(check.status)}
                  </span>
                  {check.duration !== undefined && (
                    <span className="text-acc/30">{check.duration}ms</span>
                  )}
                </div>
                {check.message && (
                  <div className="text-acc/50 mt-4 text-sm pl-15">{check.message}</div>
                )}
              </Block>
            ))}
          </div>

          {/* Incident Summary (only shown when not fully operational) */}
          {status.overall !== 'ok' && (
            <div className="mb-16 pt-24 border-t border-acc/15">
              <div className="mb-12">Active incidents:</div>
              {status.checks
                .filter((c) => c.status === 'error')
                .map((check, i) => (
                  <div key={i} className="mb-8 text-acc/60">
                    <span className="text-acc/40">— </span>
                    {check.name}
                    {check.message ? `: ${check.message}` : ' is unavailable'}
                  </div>
                ))}
            </div>
          )}

          {/* Memory Status (authenticated only) */}
          {memoryStatus && (
            <div className="mb-16 pt-32 border-t border-acc/20">
              <div className="mb-16">Memory Engine (your session):</div>
              <Block label="Current time:" labelClassName="!pl-0">
                {memoryStatus.currentTime}
              </Block>
              <Block label="Time window:" labelClassName="!pl-0">
                <span className={cn(
                  memoryStatus.timeWindow === 'OUTSIDE TIME WINDOWS' && 'text-acc/50'
                )}>
                  {memoryStatus.timeWindow}
                </span>
              </Block>
              <Block label="Day:" labelClassName="!pl-0">Day {memoryStatus.dayNumber}</Block>
              <Block label="Today's quota:" labelClassName="!pl-0">
                {memoryStatus.promptsShownToday} / {memoryStatus.promptQuotaToday} prompts
                {memoryStatus.remainingToday > 0 && (
                  <span className="text-acc/50"> ({memoryStatus.remainingToday} remaining)</span>
                )}
              </Block>
              <Block label="Next prompt:" labelClassName="!pl-0">
                <div className="flex items-center gap-x-8">
                  <span
                    className={cn(
                      'inline-block w-[7px] h-[7px] rounded-full flex-shrink-0',
                      memoryStatus.nextPromptAvailable ? 'bg-acc' : 'bg-acc/25'
                    )}
                  />
                  <span className={cn(
                    memoryStatus.nextPromptAvailable ? 'text-acc' : 'text-acc/50'
                  )}>
                    {memoryStatus.nextPromptAvailable ? 'Available' : 'Not available'}
                  </span>
                </div>
                {memoryStatus.blockReason && (
                  <div className="text-acc/50 mt-4 text-sm">{memoryStatus.blockReason}</div>
                )}
              </Block>
            </div>
          )}

          {/* Footer */}
          <div className="text-acc/30 pt-32 border-t border-acc/15">
            <div>Build: {formatDate(status.buildDate)}</div>
            <div className="mt-4">Checks cached for 2 minutes.</div>
          </div>
        </>
      )}
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
