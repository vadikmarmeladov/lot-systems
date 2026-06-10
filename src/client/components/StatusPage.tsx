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

const StatusDot = ({ status }: { status: 'ok' | 'error' | 'unknown' }) => (
  <span
    className={cn(
      'inline-block w-8 h-8 rounded-full flex-shrink-0',
      status === 'ok' && 'bg-green',
      status === 'error' && 'bg-red',
      status === 'unknown' && 'bg-acc/30'
    )}
  />
)

const overallLabel = {
  ok: 'All systems operational',
  degraded: 'Partial degradation',
  error: 'System outage detected',
}

const overallColor = {
  ok: 'text-green',
  degraded: 'text-yellow-darker',
  error: 'text-red',
}

const checkLabel = {
  ok: 'Operational',
  error: 'Outage',
  unknown: 'Unknown',
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
      console.error('Status fetch error:', err)
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
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
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

  const content = (
    <div className="flex flex-col gap-y-16">
      <div>
        <div className="mb-16">LOT Systems Status</div>
        <GhostButton href="/">← Home</GhostButton>
      </div>

      {loading && !status && (
        <div className="text-acc/40">Loading...</div>
      )}

      {error && !status && (
        <div className="mb-32">
          <div className="mb-16 text-acc/80">Error: {error}</div>
          <Button kind="secondary" size="small" onClick={fetchStatus}>
            Retry
          </Button>
        </div>
      )}

      {status && (
        <>
          {/* Overall status banner */}
          <div className="flex items-center gap-x-12 py-16 border-b border-acc/10">
            <StatusDot status={status.overall === 'ok' ? 'ok' : status.overall === 'degraded' ? 'unknown' : 'error'} />
            <span className={cn('font-base', overallColor[status.overall])}>
              {overallLabel[status.overall]}
            </span>
          </div>

          {/* Meta */}
          <div className="mb-8">
            <Block label="Version:" labelClassName="!pl-0">v{status.version}</Block>
            <Block label="Environment:" labelClassName="!pl-0">{status.environment}</Block>
            <Block label="Last check:" labelClassName="!pl-0" containsSmallButton>
              <div className="flex items-center gap-x-16">
                <span className="text-acc/60">
                  {formatDate(lastUpdate.toISOString())}
                  {status.cached && status.cacheAge !== undefined && (
                    <span className="text-acc/40"> · cached {status.cacheAge}s ago</span>
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
          </div>

          {/* Component checks */}
          <div>
            <div className="mb-16 text-acc/60">Components</div>
            {status.checks.map((check, index) => (
              <div
                key={index}
                className="flex items-start gap-x-12 py-8 border-b border-acc/10 last:border-b-0"
              >
                <StatusDot status={check.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-x-16">
                    <span>{check.name}</span>
                    <span className={cn(
                      'text-acc/50 flex-shrink-0',
                      check.status === 'ok' && 'text-green',
                      check.status === 'error' && 'text-red',
                    )}>
                      {checkLabel[check.status]}
                      {check.duration !== undefined && (
                        <span className="text-acc/30 font-base"> · {check.duration}ms</span>
                      )}
                    </span>
                  </div>
                  {check.message && (
                    <div className="text-acc/50 mt-4 text-base">{check.message}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Memory status (authenticated users only) */}
          {memoryStatus && (
            <div className="pt-32 border-t border-acc/20">
              <div className="mb-16 text-acc/60">Memory Engine — Your Status</div>
              <Block label="Current time:" labelClassName="!pl-0">
                {memoryStatus.currentTime}
              </Block>
              <Block label="Time window:" labelClassName="!pl-0">
                <span className={cn(
                  memoryStatus.timeWindow === 'OUTSIDE TIME WINDOWS' && 'text-acc/60'
                )}>
                  {memoryStatus.timeWindow}
                </span>
              </Block>
              <Block label="Day:" labelClassName="!pl-0">
                Day {memoryStatus.dayNumber}
              </Block>
              <Block label="Today's quota:" labelClassName="!pl-0">
                {memoryStatus.promptsShownToday} / {memoryStatus.promptQuotaToday}
                {memoryStatus.remainingToday > 0 && (
                  <span className="text-acc/60"> · {memoryStatus.remainingToday} remaining</span>
                )}
              </Block>
              <Block label="Next prompt:" labelClassName="!pl-0">
                <div className="flex items-center gap-x-8">
                  <StatusDot status={memoryStatus.nextPromptAvailable ? 'ok' : 'error'} />
                  <span className={cn(
                    memoryStatus.nextPromptAvailable ? 'text-green' : 'text-acc/60'
                  )}>
                    {memoryStatus.nextPromptAvailable ? 'Available now' : 'Not available'}
                  </span>
                </div>
                {memoryStatus.blockReason && (
                  <div className="text-acc/50 mt-4">{memoryStatus.blockReason}</div>
                )}
              </Block>
            </div>
          )}

          {/* Footer */}
          <div className="text-acc/30 pt-24 border-t border-acc/10 flex flex-col gap-y-4">
            <div>Build: {formatDate(status.buildDate)}</div>
            <div>Status checks refresh every 2 minutes</div>
          </div>
        </>
      )}
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
