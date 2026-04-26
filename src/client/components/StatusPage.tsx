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
  criticalServices?: string[]
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
  error: 'System issues detected',
}

export const StatusPage = ({ noWrapper = false }: StatusPageProps) => {
  const [status, setStatus] = React.useState<StatusData | null>(null)
  const [memoryStatus, setMemoryStatus] = React.useState<MemoryStatus | null>(null)
  const [initialLoading, setInitialLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date())

  useDocumentTitle('Systems Status')

  const fetchStatus = React.useCallback(async () => {
    try {
      setError(null)
      setRefreshing(true)

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
      setInitialLoading(false)
      setRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Auto-refresh every 2 minutes
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

  const statusDot = (checkStatus: 'ok' | 'error' | 'unknown') => (
    <span
      className={cn(
        'inline-block w-6 h-6 rounded-full flex-shrink-0 mt-[3px]',
        checkStatus === 'ok' && 'bg-acc',
        checkStatus === 'error' && 'bg-acc/30',
        checkStatus === 'unknown' && 'bg-acc/15'
      )}
    />
  )

  const overallDot = (overall: 'ok' | 'degraded' | 'error') => (
    <span
      className={cn(
        'inline-block w-8 h-8 rounded-full flex-shrink-0',
        overall === 'ok' && 'bg-acc',
        overall === 'degraded' && 'bg-acc/50',
        overall === 'error' && 'bg-acc/25'
      )}
    />
  )

  const content = (
    <div className="flex flex-col gap-y-16">
      <div>
        <div className="mb-16">LOT Systems Status</div>
        <GhostButton href="/">← Home</GhostButton>
      </div>

      {initialLoading && (
        <div className="text-acc/40">Loading...</div>
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
          {/* Overall status banner */}
          <div className="flex items-center gap-x-12">
            {overallDot(status.overall)}
            <div>
              <div className={cn(
                status.overall === 'ok' && 'text-acc',
                status.overall === 'degraded' && 'text-acc/70',
                status.overall === 'error' && 'text-acc/50'
              )}>
                {OVERALL_LABEL[status.overall] ?? 'Unknown'}
              </div>
              <div className="text-acc/40 text-sm mt-2">
                v{status.version} · {status.environment}
              </div>
            </div>
          </div>

          {/* Last updated row */}
          <Block label="Last updated:" labelClassName="!pl-0" containsSmallButton>
            <div className="flex items-center gap-x-16">
              <span className="text-acc/70">
                {formatDate(lastUpdate.toISOString())}
                {status.cached && status.cacheAge != null && (
                  <span className="text-acc/40"> (cached {status.cacheAge}s ago)</span>
                )}
              </span>
              <Button
                kind="secondary"
                size="small"
                onClick={fetchStatus}
                disabled={refreshing}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </Block>

          {/* Component checks */}
          <div>
            <div className="mb-16 text-acc/60">System components</div>
            {status.checks.map((check, index) => (
              <Block
                key={index}
                label={check.name + ':'}
                labelClassName="!pl-0"
                className="mb-8"
              >
                <div className="flex items-start gap-x-10">
                  {statusDot(check.status)}
                  <div>
                    <span className={cn(
                      check.status === 'ok' && 'text-acc',
                      check.status === 'error' && 'text-acc/50',
                      check.status === 'unknown' && 'text-acc/30'
                    )}>
                      {check.status === 'ok' ? 'Operational' :
                       check.status === 'error' ? 'Error' :
                       'Unknown'}
                    </span>
                    {check.duration !== undefined && (
                      <span className="text-acc/30 ml-8">{check.duration}ms</span>
                    )}
                    {check.message && (
                      <div className="text-acc/50 mt-2">{check.message}</div>
                    )}
                  </div>
                </div>
              </Block>
            ))}
          </div>

          {/* Memory prompts (authenticated users only) */}
          {memoryStatus && (
            <div className="pt-32 border-t border-acc/20">
              <div className="mb-16 text-acc/60">Memory Prompts</div>
              <Block label="Time window:" labelClassName="!pl-0">
                <span className={cn(
                  memoryStatus.timeWindow === 'OUTSIDE TIME WINDOWS' && 'text-acc/40'
                )}>
                  {memoryStatus.timeWindow}
                </span>
              </Block>
              <Block label="Current time:" labelClassName="!pl-0">
                {memoryStatus.currentTime}
              </Block>
              <Block label="Day number:" labelClassName="!pl-0">
                Day {memoryStatus.dayNumber}
              </Block>
              <Block label="Today's quota:" labelClassName="!pl-0">
                {memoryStatus.promptsShownToday} / {memoryStatus.promptQuotaToday} prompts
                {memoryStatus.remainingToday > 0 && (
                  <span className="text-acc/50"> ({memoryStatus.remainingToday} remaining)</span>
                )}
              </Block>
              <Block label="Next prompt:" labelClassName="!pl-0">
                <div className="flex items-start gap-x-10">
                  {statusDot(memoryStatus.nextPromptAvailable ? 'ok' : 'error')}
                  <div>
                    <span className={cn(
                      memoryStatus.nextPromptAvailable ? 'text-acc' : 'text-acc/50'
                    )}>
                      {memoryStatus.nextPromptAvailable ? 'Available now' : 'Not available'}
                    </span>
                    {memoryStatus.blockReason && (
                      <div className="text-acc/40 mt-2">{memoryStatus.blockReason}</div>
                    )}
                  </div>
                </div>
              </Block>
            </div>
          )}

          {/* Build metadata */}
          <div className="text-acc/30 pt-32 border-t border-acc/20 flex flex-col gap-y-4">
            <div>Build: {formatDate(status.buildDate)}</div>
            <div>Status checks cached for 2 minutes</div>
          </div>
        </>
      )}
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
