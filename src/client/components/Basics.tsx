/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE
 * BASICS — the physical layer of the LOT® System. In-app tab.
 * Section 1: manifest ledger + doctrine (M1). Section 2: status + UPGRADE /
 * roster intake / STAND DOWN (M2). Section 3: issue log + print manifest (M3).
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { cn } from '#client/utils'
import { getMe, useBasicIssues, useStandDownBasic, useUpgradeToBasic } from '#client/queries'
import { BasicsMetadata, BasicStatus } from '#shared/types'
import { nextCadenceDate } from '#shared/constants/basics-cadence'
import { BasicsHeader, DoctrineBlock, RationLedger, SectionLabel, ThinRule } from './basics/RationLedger'
import { BASIC_STATUS_LABEL, canStandDown, canUpgrade } from '#shared/constants/basics-state'
import { Button } from '#client/components/ui'

const EMPTY_BASICS: BasicsMetadata = {
  status: 'NONE',
  cadenceStart: null,
  sizingNotes: null,
  requestedAt: null,
  onStrengthAt: null,
  standDownAt: null,
  nextIssueDate: null,
  history: [],
}

const refetchMe = () => getMe().then((user) => stores.me.set(user)).catch(() => {})

const StatusLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
    <span className="text-acc/50 uppercase tracking-wider font-mono text-[12px] phone:text-[13px]">
      {label}
    </span>
    <span className="text-acc uppercase font-mono text-[12px] phone:text-[13px]">{value}</span>
  </div>
)

const RosterIntakeForm: React.FC<{ onSubmitted: () => void }> = ({ onSubmitted }) => {
  const [cadenceStart, setCadenceStart] = React.useState(
    nextCadenceDate().toISOString().slice(0, 10)
  )
  const [sizingNotes, setSizingNotes] = React.useState('')
  const { mutate: upgrade, isLoading, error } = useUpgradeToBasic({
    onSuccess: onSubmitted,
  })

  return (
    <div className="flex flex-col gap-y-8 mt-8">
      <label className="font-mono text-[11px] text-acc/50 uppercase tracking-widest">
        CADENCE START
      </label>
      <input
        type="date"
        value={cadenceStart}
        onChange={(e) => setCadenceStart(e.target.value)}
        className="px-8 py-8 border border-acc bg-transparent font-mono text-[12px] text-acc w-fit"
      />
      <label className="font-mono text-[11px] text-acc/50 uppercase tracking-widest mt-8">
        SIZING / FIT NOTES (OPTIONAL)
      </label>
      <textarea
        value={sizingNotes}
        onChange={(e) => setSizingNotes(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="Reserved for future hardware SKUs — not required for the current 23-item load."
        className="px-8 py-8 border border-acc bg-transparent font-mono text-[12px] text-acc placeholder:text-acc/30"
      />
      {error && (
        <p className="font-mono text-[11px] text-acc/70">
          {(error as any)?.response?.data?.message || 'UPGRADE failed.'}
        </p>
      )}
      <Button
        kind="secondary-rounded"
        disabled={isLoading}
        onClick={() => upgrade({ cadenceStart, sizingNotes: sizingNotes || undefined })}
        className="w-fit"
      >
        {isLoading ? 'PROCESSING…' : 'CONFIRM — GO ON STRENGTH'}
      </Button>
    </div>
  )
}

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isMirrorOn = useStore(stores.isMirrorOn)
  const queryClient = useQueryClient()
  const [showIntake, setShowIntake] = React.useState(false)

  const isUsership = me?.tags?.some((t) => t.toLowerCase() === 'usership') ?? false
  const isOnStrengthTag = me?.tags?.some((t) => t.toLowerCase() === 'basic') ?? false
  const basics: BasicsMetadata = (me?.metadata?.basics as BasicsMetadata) || EMPTY_BASICS
  const status: BasicStatus = basics.status

  const { data: issues } = useBasicIssues({ enabled: isOnStrengthTag })

  const { mutate: standDown, isLoading: standingDown } = useStandDownBasic({
    onSuccess: () => {
      refetchMe()
      queryClient.invalidateQueries(['/api/basics/issues'])
    },
  })

  const onUpgraded = () => {
    setShowIntake(false)
    refetchMe()
    queryClient.invalidateQueries(['/api/basics/issues'])
  }

  const printManifest = () => window.print()

  return (
    <div
      className={cn(
        'min-h-[100dvh] flex flex-col',
        'px-16 phone:px-32 tablet:px-48 desktop:px-64',
        'pt-24 phone:pt-32 pb-[120px]',
        isMirrorOn && 'text-white'
      )}
    >
      <BasicsHeader className="mb-16" />
      <DoctrineBlock className="mb-16" />
      <ThinRule className="mb-16" />

      <RationLedger />

      <ThinRule className="mb-16 mt-8" />

      {/* ── STATUS ────────────────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16 flex flex-col gap-y-4">
        <StatusLine
          label="PLAN"
          value={isOnStrengthTag ? 'BASIC / ON STRENGTH' : isUsership ? 'USERSHIP / AI' : 'NONE'}
        />
        <StatusLine label="RATION" value={BASIC_STATUS_LABEL[status]} />
        {basics.nextIssueDate && <StatusLine label="NEXT ISSUE" value={basics.nextIssueDate} />}
      </div>

      {/* ── UPGRADE / STAND DOWN ──────────────────────────── */}
      <div className="mb-16 basics-print-hide">
        <div className={cn('border-2 border-acc/20 p-16 font-mono text-[12px]', 'flex flex-col gap-y-8')}>
          <div className="text-acc/50 uppercase tracking-widest text-[10px]">
            UPGRADE PATH — USERSHIP → BASIC
          </div>

          {!isUsership && (
            <div className="text-acc leading-snug">
              Requires USERSHIP / AI plan as base layer.
            </div>
          )}

          {isUsership && canUpgrade(status) && !showIntake && (
            <>
              <div className="text-acc leading-snug">
                USERSHIP AI confirmed. BASIC ration available as additive layer (+USD 100.00/MO).
              </div>
              <Button kind="secondary-rounded" className="w-fit" onClick={() => setShowIntake(true)}>
                UPGRADE — GO ON STRENGTH
              </Button>
            </>
          )}

          {isUsership && canUpgrade(status) && showIntake && (
            <RosterIntakeForm onSubmitted={onUpgraded} />
          )}

          {canStandDown(status) && (
            <>
              <div className="text-acc leading-snug">
                Ration active. STAND DOWN drops the ration and retains USERSHIP / AI.
              </div>
              <Button
                kind="secondary-rounded"
                className="w-fit"
                disabled={standingDown}
                onClick={() => standDown()}
              >
                {standingDown ? 'PROCESSING…' : 'STAND DOWN'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── ISSUE LOG ─────────────────────────────────────── */}
      {isOnStrengthTag && (
        <>
          <ThinRule className="mb-16" />
          <div className="flex items-baseline justify-between">
            <SectionLabel>SECTION 3 — ISSUE LOG</SectionLabel>
            <button
              onClick={printManifest}
              className="font-mono text-[11px] text-acc/50 underline hover:text-acc basics-print-hide"
            >
              PRINT MANIFEST
            </button>
          </div>
          <div
            className="grid font-mono text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
            style={{ gridTemplateColumns: '48px 1fr auto auto' }}
          >
            <span>NO.</span>
            <span>SCHEDULED FOR</span>
            <span className="text-right">ITEMS</span>
            <span className="text-right w-[90px]">STATUS</span>
          </div>
          {(issues ?? []).map((issue, idx, arr) => (
            <div
              key={issue.id}
              className={cn(
                'grid font-mono text-[12px] py-[5px] gap-x-8',
                idx !== arr.length - 1 && 'border-b border-acc/10'
              )}
              style={{ gridTemplateColumns: '48px 1fr auto auto' }}
            >
              <span className="text-acc/40 tabular-nums">{issue.issueNumber}</span>
              <span className="text-acc">{issue.scheduledFor}</span>
              <span className="text-acc/50 text-right">{issue.items.length}</span>
              <span
                className={cn(
                  'text-right w-[90px]',
                  issue.status === 'DISPATCHED' ? 'text-acc' : 'text-acc/40'
                )}
              >
                {issue.status}
              </span>
            </div>
          ))}
          {(!issues || issues.length === 0) && (
            <p className="font-mono text-[11px] text-acc/40 py-8">No issues scheduled yet.</p>
          )}
        </>
      )}
    </div>
  )
}
