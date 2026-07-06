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

      // Fetch public system status
      const response = await fetch('/api/public/status')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setStatus(data)

      // Try to fetch memory status (authenticated)
      try {
        const localTime = btoa(dayjs().format(DATE_TIME_FORMAT))
        const memResponse = await fetch(`/api/memory-status?d=${localTime}`)
        if (memResponse.ok) {
          const memData = await memResponse.json()
          setMemoryStatus(memData)
        }
      } catch {
        // Not logged in or endpoint unavailable
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

  // Fetch status on mount
  React.useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Auto-refresh every 2 minutes
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchStatus()
    }, 2 * 60 * 1000) // 2 minutes

    return () => clearInterval(interval)
  }, [fetchStatus])

  const getStatusDot = (checkStatus: 'ok' | 'error' | 'unknown') => {
    const colorMap = { ok: 'bg-green', error: 'bg-red', unknown: 'bg-yellow' }
    return (
      <span
        className={cn(
          'inline-block w-8 h-8 rounded-full flex-shrink-0',
          colorMap[checkStatus]
        )}
      />
    )
  }

  const getStatusLabel = (checkStatus: 'ok' | 'error' | 'unknown') => {
    const colorMap = { ok: 'text-green', error: 'text-red', unknown: 'text-yellow' }
    const labelMap = { ok: 'Operational', error: 'Outage', unknown: 'Unknown' }
    return <span className={colorMap[checkStatus]}>{labelMap[checkStatus]}</span>
  }

  const getLatencyBadge = (duration: number | undefined) => {
    if (duration === undefined) return null
    const color = duration < 100 ? 'text-green' : duration < 500 ? 'text-yellow' : 'text-red'
    return <span className={cn('text-acc/40', color)}>{duration}ms</span>
  }

  const overallMeta = {
    ok: { label: 'All Systems Operational', color: 'text-green', border: 'border-green' },
    degraded: { label: 'Degraded Performance', color: 'text-yellow', border: 'border-yellow' },
    error: { label: 'System Issues Detected', color: 'text-red', border: 'border-red' },
  }

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
        <div className="text-acc/40">Checking systems&hellip;</div>
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
          <div className={cn(
            'mb-32 pl-16 border-l-2',
            overallMeta[status.overall]?.border ?? 'border-acc/40'
          )}>
            <div className={cn(
              'text-acc mb-8',
              overallMeta[status.overall]?.color
            )}>
              {overallMeta[status.overall]?.label ?? status.overall}
            </div>
            <div className="text-acc/40">
              {formatDate(lastUpdate.toISOString())}
              {status.cached && status.cacheAge !== undefined && (
                <span> · cached {status.cacheAge}s ago</span>
              )}
            </div>
          </div>

          <div className="mb-16">
            <Block label="Version:" labelClassName="!pl-0">v{status.version}</Block>
            <Block label="Environment:" labelClassName="!pl-0">{status.environment}</Block>
            <Block label="Refresh:" labelClassName="!pl-0" containsSmallButton>
              <Button
                kind="secondary"
                size="small"
                onClick={fetchStatus}
                disabled={loading}
              >
                {loading ? 'Refreshing…' : 'Refresh now'}
              </Button>
            </Block>
          </div>

          <div className="mb-16">
            <div className="mb-16 text-acc/60">Components</div>
            {status.checks.map((check, index) => (
              <Block
                key={index}
                label={check.name + ':'}
                labelClassName="!pl-0"
                className="mb-8"
              >
                <div className="flex items-center gap-x-8">
                  {getStatusDot(check.status)}
                  {getStatusLabel(check.status)}
                  {getLatencyBadge(check.duration)}
                </div>
                {check.message && (
                  <div className="text-red/80 mt-4 text-acc/60">{check.message}</div>
                )}
              </Block>
            ))}
          </div>

          {memoryStatus && (
            <div className="mb-16 pt-32 border-t border-acc/20">
              <div className="mb-16 text-acc/60">Memory Engine (Your Session)</div>
              <Block label="Time window:" labelClassName="!pl-0">
                <span className={cn(
                  memoryStatus.timeWindow === 'OUTSIDE TIME WINDOWS' ? 'text-acc/40' : 'text-acc'
                )}>
                  {memoryStatus.timeWindow}
                </span>
              </Block>
              <Block label="Day:" labelClassName="!pl-0">
                {memoryStatus.dayNumber}
              </Block>
              <Block label="Quota:" labelClassName="!pl-0">
                {memoryStatus.promptsShownToday} / {memoryStatus.promptQuotaToday}
                {memoryStatus.remainingToday > 0 && (
                  <span className="text-acc/40"> · {memoryStatus.remainingToday} remaining</span>
                )}
              </Block>
              <Block label="Next prompt:" labelClassName="!pl-0">
                <div className="flex items-center gap-x-8">
                  <span
                    className={cn(
                      'inline-block w-8 h-8 rounded-full flex-shrink-0',
                      memoryStatus.nextPromptAvailable ? 'bg-green' : 'bg-red'
                    )}
                  />
                  <span className={cn(
                    memoryStatus.nextPromptAvailable ? 'text-green' : 'text-acc/60'
                  )}>
                    {memoryStatus.nextPromptAvailable ? 'Available' : 'Not available'}
                  </span>
                </div>
                {memoryStatus.blockReason && (
                  <div className="text-acc/40 mt-4">{memoryStatus.blockReason}</div>
                )}
              </Block>
            </div>
          )}

          <div className="text-acc/40 pt-32 border-t border-acc/20">
            <div>Build: {formatDate(status.buildDate)}</div>
            <div className="mt-8">Auto-refreshes every 2 minutes · checks cached 2 minutes</div>
          </div>
        </>
      )}
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
