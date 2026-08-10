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
import utc from 'dayjs/plugin/utc'
import { DATE_TIME_FORMAT } from '#shared/constants'

dayjs.extend(utc)

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

const STATUS_COLORS = {
  ok: 'text-green',
  error: 'text-red',
  unknown: 'text-yellow',
  degraded: 'text-yellow',
} as const

const STATUS_ICONS = {
  ok: '✓',
  error: '✕',
  unknown: '?',
  degraded: '△',
} as const

const OVERALL_LABEL: Record<StatusData['overall'], string> = {
  ok: 'All systems operational',
  degraded: 'Degraded performance',
  error: 'System issues detected',
}

const formatDate = (dateString: string): string => {
  const d = dayjs(dateString)
  return d.isValid() ? d.format('MMM D, YYYY HH:mm:ss') + ' local' : dateString
}

export const StatusPage = ({ noWrapper = false }: StatusPageProps) => {
  const [status, setStatus] = React.useState<StatusData | null>(null)
  const [memoryStatus, setMemoryStatus] = React.useState<MemoryStatus | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = React.useState<dayjs.Dayjs>(dayjs())
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
          const memData = await memResponse.json()
          setMemoryStatus(memData)
        }
      } catch {
        setMemoryStatus(null)
      }

      setLastUpdate(dayjs())
      setSecondsUntilRefresh(REFRESH_INTERVAL_MS / 1000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch status'
      setError(message)
      console.error('Status fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  React.useEffect(() => {
    const refresh = setInterval(fetchStatus, REFRESH_INTERVAL_MS)
    return () => clearInterval(refresh)
  }, [fetchStatus])

  React.useEffect(() => {
    const tick = setInterval(() => {
      setSecondsUntilRefresh((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

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
          <div className="mb-16 text-red">Error: {error}</div>
          <Button kind="secondary" size="small" onClick={fetchStatus}>
            Retry
          </Button>
        </div>
      )}

      {status && (
        <>
          <div className="mb-16">
            <Block label="Status:" labelClassName="!pl-0">
              <span className={cn(STATUS_COLORS[status.overall])}>
                <span aria-label={`overall status: ${status.overall}`}>
                  {STATUS_ICONS[status.overall]}
                </span>
                {' '}{OVERALL_LABEL[status.overall]}
              </span>
            </Block>
            <Block label="Version:" labelClassName="!pl-0">v{status.version}</Block>
            <Block label="Environment:" labelClassName="!pl-0">{status.environment}</Block>
            <Block label="Last updated:" labelClassName="!pl-0" containsSmallButton>
              <div className="flex items-center gap-x-16">
                <span>
                  {lastUpdate.format('MMM D, YYYY HH:mm:ss')} local
                  {status.cached && status.cacheAge && (
                    <span className="text-acc/40">
                      {' '}(cached {status.cacheAge}s ago)
                    </span>
                  )}
                  {!loading && (
                    <span className="text-acc/40"> · refresh in {secondsUntilRefresh}s</span>
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

          <div className="mb-16">
            <div className="mb-16">System components:</div>
            {status.checks.map((check) => (
              <Block
                key={check.name}
                label={check.name + ':'}
                labelClassName="!pl-0"
                className="mb-8"
              >
                <div className="flex items-center gap-x-8">
                  <span
                    aria-label={`${check.name} status: ${check.status}`}
                    className={cn(STATUS_COLORS[check.status])}
                  >
                    {STATUS_ICONS[check.status]}
                  </span>
                  <span className={cn(STATUS_COLORS[check.status])}>
                    {check.status === 'ok' ? 'Operational' :
                     check.status === 'error' ? 'Error' :
                     'Unknown'}
                  </span>
                  {check.duration !== undefined && (
                    <span className="text-acc/40">{check.duration}ms</span>
                  )}
                </div>
                {check.message && (
                  <div className="text-red/80 mt-4">{check.message}</div>
                )}
              </Block>
            ))}
          </div>

          {memoryStatus && (
            <div className="mb-16 pt-32 border-t border-acc/20">
              <div className="mb-16">Memory Prompts (Your Status):</div>
              <Block label="Current time:" labelClassName="!pl-0">
                {memoryStatus.currentTime}
              </Block>
              <Block label="Time window:" labelClassName="!pl-0">
                <span className={cn(
                  memoryStatus.timeWindow === 'OUTSIDE TIME WINDOWS'
                    ? 'text-acc/60'
                    : 'text-green'
                )}>
                  {memoryStatus.timeWindow}
                </span>
              </Block>
              <Block label="Day number:" labelClassName="!pl-0">
                Day {memoryStatus.dayNumber}
              </Block>
              <Block label="Today's quota:" labelClassName="!pl-0">
                {memoryStatus.promptsShownToday} / {memoryStatus.promptQuotaToday} prompts
                {memoryStatus.remainingToday > 0 && (
                  <span className="text-acc/60"> ({memoryStatus.remainingToday} remaining)</span>
                )}
              </Block>
              <Block label="Next prompt:" labelClassName="!pl-0">
                <div className="flex items-center gap-x-8">
                  <span
                    aria-label={memoryStatus.nextPromptAvailable ? 'prompt available' : 'prompt not available'}
                    className={cn(memoryStatus.nextPromptAvailable ? 'text-green' : 'text-red')}
                  >
                    {memoryStatus.nextPromptAvailable ? '✓' : '✕'}
                  </span>
                  <span className={cn(memoryStatus.nextPromptAvailable ? 'text-green' : 'text-acc/60')}>
                    {memoryStatus.nextPromptAvailable ? 'Available now' : 'Not available'}
                  </span>
                </div>
                {memoryStatus.blockReason && (
                  <div className="text-acc/60 mt-4">Reason: {memoryStatus.blockReason}</div>
                )}
              </Block>
            </div>
          )}

          <div className="text-acc/40 pt-32 border-t border-acc/20">
            <div>Build: {formatDate(status.buildDate)}</div>
            <div className="mt-8">Status checks cached server-side for 2 minutes</div>
          </div>
        </>
      )}
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
