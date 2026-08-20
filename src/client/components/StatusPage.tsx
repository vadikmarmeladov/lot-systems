/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

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

const REFRESH_INTERVAL_MS = 2 * 60 * 1000
const MAX_LATENCY_BAR_MS = 500

const StatusDot = ({ status }: { status: 'ok' | 'error' | 'unknown' }) => {
  const base = 'inline-block w-8 h-8 rounded-full flex-shrink-0'
  if (status === 'ok') {
    return (
      <span className="relative inline-flex items-center justify-center w-16 h-16">
        <span className={cn(base, 'bg-green animate-ping absolute opacity-60')} />
        <span className={cn(base, 'bg-green relative')} />
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="relative inline-flex items-center justify-center w-16 h-16">
        <span className={cn(base, 'bg-red relative')} />
      </span>
    )
  }
  return (
    <span className="relative inline-flex items-center justify-center w-16 h-16">
      <span className={cn(base, 'bg-acc/30 relative')} />
    </span>
  )
}

const LatencyBar = ({ ms }: { ms: number }) => {
  const pct = Math.min(100, Math.round((ms / MAX_LATENCY_BAR_MS) * 100))
  const color = ms < 100 ? 'bg-green' : ms < 300 ? 'bg-gold' : 'bg-red'
  return (
    <span className="inline-flex items-center gap-x-8">
      <span className="w-64 h-4 bg-acc/10 rounded-full overflow-hidden inline-block">
        <span
          className={cn('h-full rounded-full block transition-all', color)}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="text-acc/40">{ms}ms</span>
    </span>
  )
}

const SkeletonRow = () => (
  <div className="flex items-center gap-x-16 mb-8 animate-pulse">
    <div className="w-[150px] h-16 bg-acc/10 rounded" />
    <div className="flex-1 h-16 bg-acc/10 rounded" />
  </div>
)

const OverallBanner = ({ overall }: { overall: 'ok' | 'degraded' | 'error' }) => {
  if (overall === 'ok') {
    return (
      <div className="flex items-center gap-x-12 py-16 px-16 border border-green/30 rounded bg-green/5 mb-32">
        <StatusDot status="ok" />
        <span className="text-green">All systems operational</span>
      </div>
    )
  }
  if (overall === 'degraded') {
    return (
      <div className="flex items-center gap-x-12 py-16 px-16 border border-gold/40 rounded bg-gold/5 mb-32">
        <StatusDot status="unknown" />
        <span className="text-gold">Degraded performance</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-x-12 py-16 px-16 border border-red/30 rounded bg-red/5 mb-32">
      <StatusDot status="error" />
      <span className="text-red">System issues detected</span>
    </div>
  )
}

export const StatusPage = ({ noWrapper = false }: StatusPageProps) => {
  const [status, setStatus] = React.useState<StatusData | null>(null)
  const [memoryStatus, setMemoryStatus] = React.useState<MemoryStatus | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date())
  const [secondsUntilRefresh, setSecondsUntilRefresh] = React.useState(REFRESH_INTERVAL_MS / 1000)

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
          setMemoryStatus(await memResponse.json())
        }
      } catch {
        setMemoryStatus(null)
      }

      setLastUpdate(new Date())
      setSecondsUntilRefresh(REFRESH_INTERVAL_MS / 1000)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch status')
      console.error('Status fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  React.useEffect(() => {
    const interval = setInterval(fetchStatus, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchStatus])

  React.useEffect(() => {
    const tick = setInterval(() => {
      setSecondsUntilRefresh((s) => (s <= 1 ? REFRESH_INTERVAL_MS / 1000 : s - 1))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

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

  const errorCount = status?.checks.filter((c) => c.status === 'error').length ?? 0

  const content = (
    <div className="flex flex-col gap-y-16">
      <div className="mb-8">
        <div className="mb-16">LOT Systems Status</div>
        <GhostButton href="/">← Home</GhostButton>
      </div>

      {loading && !status && (
        <div className="mt-16">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      )}

      {error && !status && (
        <div className="mb-32">
          <div className="flex items-center gap-x-12 py-16 px-16 border border-red/30 rounded bg-red/5 mb-16">
            <StatusDot status="error" />
            <span className="text-red">Error: {error}</span>
          </div>
          <Button kind="secondary" size="small" onClick={fetchStatus}>
            Retry
          </Button>
        </div>
      )}

      {status && (
        <>
          <OverallBanner overall={status.overall} />

          <div className="mb-24">
            <Block label="Version:" labelClassName="!pl-0">v{status.version}</Block>
            <Block label="Environment:" labelClassName="!pl-0">{status.environment}</Block>
            <Block label="Last checked:" labelClassName="!pl-0" containsSmallButton>
              <div className="flex items-center gap-x-16">
                <span>
                  {formatDate(lastUpdate.toISOString())}
                  {status.cached && status.cacheAge != null && (
                    <span className="text-acc/40"> (cached {status.cacheAge}s ago)</span>
                  )}
                </span>
                <Button
                  kind="secondary"
                  size="small"
                  onClick={fetchStatus}
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </Block>
            {!loading && (
              <Block label="Next check:" labelClassName="!pl-0">
                <span className="text-acc/40">in {secondsUntilRefresh}s</span>
              </Block>
            )}
          </div>

          <div className="mb-16">
            <div className="mb-16 flex items-center gap-x-8">
              <span>System components</span>
              {errorCount > 0 && (
                <span className="text-acc/40 text-sm">
                  — {errorCount} issue{errorCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {status.checks.map((check, index) => (
              <Block
                key={index}
                label={check.name + ':'}
                labelClassName="!pl-0"
                className="mb-8"
              >
                <div className="flex items-center gap-x-12 flex-wrap gap-y-4">
                  <StatusDot status={check.status} />
                  <span className={cn(
                    check.status === 'ok' && 'text-green',
                    check.status === 'error' && 'text-red',
                    check.status === 'unknown' && 'text-acc/60'
                  )}>
                    {check.status === 'ok' ? 'Operational' :
                     check.status === 'error' ? 'Error' :
                     'Unknown'}
                  </span>
                  {check.duration !== undefined && (
                    <LatencyBar ms={check.duration} />
                  )}
                </div>
                {check.message && (
                  <div className="text-acc/60 mt-4 ml-28">{check.message}</div>
                )}
              </Block>
            ))}
          </div>

          {memoryStatus && (
            <div className="mb-16 pt-32 border-t border-acc/20">
              <div className="mb-16">Memory prompts — your status</div>
              <Block label="Current time:" labelClassName="!pl-0">
                {memoryStatus.currentTime}
              </Block>
              <Block label="Time window:" labelClassName="!pl-0">
                <span className={cn(
                  memoryStatus.timeWindow === 'OUTSIDE TIME WINDOWS' && 'text-acc/40'
                )}>
                  {memoryStatus.timeWindow}
                </span>
              </Block>
              <Block label="Day number:" labelClassName="!pl-0">
                Day {memoryStatus.dayNumber}
              </Block>
              <Block label="Today's quota:" labelClassName="!pl-0">
                <span>{memoryStatus.promptsShownToday} / {memoryStatus.promptQuotaToday}</span>
                {memoryStatus.remainingToday > 0 && (
                  <span className="text-acc/40"> — {memoryStatus.remainingToday} remaining</span>
                )}
              </Block>
              <Block label="Next prompt:" labelClassName="!pl-0">
                <div className="flex items-center gap-x-12">
                  <StatusDot status={memoryStatus.nextPromptAvailable ? 'ok' : 'unknown'} />
                  <span className={cn(
                    memoryStatus.nextPromptAvailable ? 'text-green' : 'text-acc/60'
                  )}>
                    {memoryStatus.nextPromptAvailable ? 'Available now' : 'Not available'}
                  </span>
                </div>
                {memoryStatus.blockReason && (
                  <div className="text-acc/40 mt-4 ml-28">{memoryStatus.blockReason}</div>
                )}
              </Block>
            </div>
          )}

          <div className="text-acc/40 pt-32 border-t border-acc/20 flex flex-col gap-y-4">
            <div>Build: {formatDate(status.buildDate)}</div>
            <div>Checks cached for 2 minutes · Auto-refreshes every {REFRESH_INTERVAL_MS / 60000} min</div>
          </div>
        </>
      )}
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
