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

const REFRESH_SECONDS = 120

export const StatusPage = ({ noWrapper = false }: StatusPageProps) => {
  const [status, setStatus] = React.useState<StatusData | null>(null)
  const [memoryStatus, setMemoryStatus] = React.useState<MemoryStatus | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date())
  const [countdown, setCountdown] = React.useState(REFRESH_SECONDS)

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
      setCountdown(REFRESH_SECONDS)
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
    const interval = setInterval(() => {
      fetchStatus()
    }, REFRESH_SECONDS * 1000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  React.useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_SECONDS : prev - 1))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const handleRefresh = () => {
    setCountdown(REFRESH_SECONDS)
    fetchStatus()
  }

  const overallLabel = (overall: StatusData['overall']) => {
    if (overall === 'ok') return 'All systems operational.'
    if (overall === 'degraded') return 'Degraded performance.'
    return 'System issues detected.'
  }

  const checkLabel = (s: SystemCheck['status']) => {
    if (s === 'ok') return 'Ok.'
    if (s === 'error') return 'Error.'
    return 'Unknown.'
  }

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
          <div className="mb-16 text-acc/60">{error}</div>
          <Button kind="secondary" size="small" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      )}

      {status && (
        <>
          <div className="mb-16">
            <Block label="Status:" labelClassName="!pl-0">
              <span className={cn(
                status.overall === 'ok' && 'text-acc',
                status.overall === 'degraded' && 'text-acc/60',
                status.overall === 'error' && 'text-acc/40'
              )}>
                {overallLabel(status.overall)}
              </span>
            </Block>
            <Block label="Version:" labelClassName="!pl-0">v{status.version}</Block>
            <Block label="Environment:" labelClassName="!pl-0">{status.environment}</Block>
            <Block label="Checked:" labelClassName="!pl-0" containsSmallButton>
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
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </Block>
            <Block label="Next check:" labelClassName="!pl-0">
              <span className="text-acc/40">
                {loading ? 'Refreshing...' : `in ${countdown}s`}
              </span>
            </Block>
          </div>

          <div className="mb-16">
            <div className="mb-16">System components:</div>
            {status.checks.map((check, index) => (
              <Block
                key={index}
                label={check.name + ':'}
                labelClassName="!pl-0"
                className="mb-8"
                blockView
              >
                <div>
                  <div className="flex items-baseline gap-x-16">
                    <span className={cn(
                      check.status === 'ok' && 'text-acc',
                      check.status === 'error' && 'text-acc/40',
                      check.status === 'unknown' && 'text-acc/40'
                    )}>
                      {checkLabel(check.status)}
                    </span>
                    {check.duration !== undefined && (
                      <span className="text-acc/40">{check.duration}ms</span>
                    )}
                  </div>
                  {check.message && (
                    <div className="text-acc/60 mt-4">{check.message}</div>
                  )}
                </div>
              </Block>
            ))}
          </div>

          {memoryStatus && (
            <div className="mb-16 pt-32 border-t border-acc/20">
              <div className="mb-16">Memory prompts (your status):</div>
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
              <Block label="Day:" labelClassName="!pl-0">
                Day {memoryStatus.dayNumber}
              </Block>
              <Block label="Today's quota:" labelClassName="!pl-0">
                {memoryStatus.promptsShownToday} / {memoryStatus.promptQuotaToday}
                {memoryStatus.remainingToday > 0 && (
                  <span className="text-acc/60"> ({memoryStatus.remainingToday} remaining)</span>
                )}
              </Block>
              <Block label="Next prompt:" labelClassName="!pl-0">
                <span className={cn(
                  memoryStatus.nextPromptAvailable ? 'text-acc' : 'text-acc/40'
                )}>
                  {memoryStatus.nextPromptAvailable ? 'Available now.' : 'Not available.'}
                </span>
                {memoryStatus.blockReason && (
                  <div className="text-acc/60 mt-4">{memoryStatus.blockReason}</div>
                )}
              </Block>
            </div>
          )}

          <div className="text-acc/40 pt-32 border-t border-acc/20">
            <div>Build: {formatDate(status.buildDate)}</div>
            <div className="mt-8">Status checks are cached for 2 minutes.</div>
          </div>
        </>
      )}
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
