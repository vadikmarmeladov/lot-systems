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
import { cn } from '#client/utils'
import { UserTag, type BasicsMeta, type BasicsShipping, type BasicsSize } from '#shared/types'
import { useEnrollBasics, useStandDownBasics, getMe } from '#client/queries'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  BASICS_SIZES,
  SHIPPING_FIELDS,
  type RationItem,
  type RationCadence,
} from './basics/doctrine'

// ─── terminal grid constants ──────────────────────────────────────────────────
const RULE = '─'
const HEAVY = '━'
const ruleOf = (n: number) => Array(n).fill(RULE).join('')
const heavyOf = (n: number) => Array(n).fill(HEAVY).join('')

// ─── sub-components ───────────────────────────────────────────────────────────

const HeavyRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('text-acc tracking-[0] leading-none select-none overflow-hidden', className)}>
    <div className="border-t-2 border-acc w-full" />
  </div>
)

const ThinRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t border-acc/30 w-full', className)} />
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="font-mono text-[11px] tracking-widest uppercase text-acc/50 py-8">
    {children}
  </div>
)

const cadenceBadge = (cadence: RationCadence) => {
  const cls = cadence === 'MONTHLY'
    ? 'text-acc'
    : cadence === 'QUARTERLY'
    ? 'text-acc/60'
    : 'text-acc/40'
  return <span className={cn('font-mono text-[11px]', cls)}>{cadence}</span>
}

const LedgerRow: React.FC<{ item: RationItem; isLast: boolean }> = ({ item, isLast }) => (
  <div
    className={cn(
      'grid font-mono text-[12px] phone:text-[13px] py-[5px] gap-x-8',
      'grid-cols-[28px_1fr_auto_auto]',
      !isLast && 'border-b border-acc/10'
    )}
    style={{ gridTemplateColumns: '28px 1fr auto auto' }}
  >
    <span className="text-acc/40 tabular-nums">{item.line}</span>
    <span className="text-acc uppercase tracking-wide leading-snug">{item.nomenclature}</span>
    <span className="text-acc/50 text-right whitespace-nowrap">{item.spec}</span>
    <span className="text-right w-[80px] phone:w-[90px]">{cadenceBadge(item.cadence)}</span>
  </div>
)

const StatusLine: React.FC<{ plan: string; rationsStatus: string }> = ({ plan, rationsStatus }) => (
  <div className="font-mono text-[12px] phone:text-[13px] flex flex-col gap-y-4">
    <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
      <span className="text-acc/50 uppercase tracking-wider">PLAN</span>
      <span className="text-acc uppercase">{plan}</span>
    </div>
    <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
      <span className="text-acc/50 uppercase tracking-wider">RATION</span>
      <span className="text-acc/60 uppercase">{rationsStatus}</span>
    </div>
  </div>
)

// ─── main component ───────────────────────────────────────────────────────────

const emptyShipping = (): BasicsShipping => ({
  name: '', address1: '', address2: '', city: '', region: '', postalCode: '', country: '',
})

const formatCadence = (iso: string | null) => {
  if (!iso) return null
  const d = new Date(iso)
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return `01 ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isMirrorOn = useStore(stores.isMirrorOn)

  const [size, setSize] = React.useState<BasicsSize>('M')
  const [shipping, setShipping] = React.useState<BasicsShipping>(emptyShipping())
  const [formError, setFormError] = React.useState<string | null>(null)
  const [standDownArmed, setStandDownArmed] = React.useState(false)

  const refreshMe = React.useCallback(() => {
    getMe().then((u) => stores.me.set(u)).catch(() => {})
  }, [])

  const { mutate: enroll, isLoading: isEnrolling } = useEnrollBasics({
    onError: (err) => setFormError((err.response?.data as any)?.message || 'ENROLLMENT REJECTED'),
    onSuccess: () => { setFormError(null); refreshMe() },
  })
  const { mutate: standDown, isLoading: isStandingDown } = useStandDownBasics({
    onSuccess: () => { setStandDownArmed(false); refreshMe() },
  })

  const isOnStrength = me?.tags?.includes(UserTag.Basic) ?? false
  const isUsership = me?.tags?.includes(UserTag.Usership) ?? false
  const basicsMeta = (me as any)?.metadata?.basics as BasicsMeta | undefined
  const isPending = !isOnStrength && basicsMeta?.status === 'PENDING'
  const isEnrolled = isOnStrength || isPending

  const planLabel = isOnStrength
    ? 'BASIC / ON STRENGTH'
    : isPending
    ? 'BASIC / PENDING'
    : isUsership
    ? 'USERSHIP / AI'
    : 'NONE'

  const nextIssue = formatCadence(basicsMeta?.cadenceStart ?? null)
  const rationStatus = isOnStrength
    ? nextIssue
      ? `ACTIVE — NEXT ISSUE ${nextIssue}`
      : 'ACTIVE — NEXT ISSUE PENDING'
    : isPending
    ? 'ENROLLMENT SUBMITTED — AWAITING S-2 CONFIRMATION'
    : 'NOT ON STRENGTH'

  const onSubmitEnrollment = () => {
    const required = SHIPPING_FIELDS.filter((f) => f.required)
    const missing = required.find((f) => !(shipping[f.key] || '').trim())
    if (missing) {
      setFormError(`${missing.label} REQUIRED`)
      return
    }
    setFormError(null)
    enroll({ size, shipping })
  }

  const monthlyItems = RATION_MANIFEST.filter((i) => i.cadence === 'MONTHLY')
  const quarterlyItems = RATION_MANIFEST.filter((i) => i.cadence === 'QUARTERLY')
  const annualItems = RATION_MANIFEST.filter((i) => i.cadence === 'ANNUALLY')

  return (
    <div
      className={cn(
        'min-h-[100dvh] flex flex-col',
        'px-16 phone:px-32 tablet:px-48 desktop:px-64',
        'pt-24 phone:pt-32 pb-[120px]',
        isMirrorOn && 'text-white'
      )}
    >
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="font-mono text-[13px] phone:text-[14px] uppercase tracking-[0.15em] text-acc font-bold">
          BASICS
        </h1>
        <span className="font-mono text-[11px] text-acc/40 tracking-widest">
          {MANUAL_REF}
        </span>
      </div>
      <HeavyRule className="mb-16" />

      {/* ── DOCTRINE + PRICE ──────────────────────────────── */}
      <div className="mb-16 flex flex-col gap-y-4">
        {DOCTRINE_LINES.map((line, i) => (
          <p key={i} className="font-mono text-[12px] phone:text-[13px] text-acc leading-snug">
            {line}
          </p>
        ))}
        <p className="font-mono text-[13px] phone:text-[15px] text-acc font-bold mt-8 tracking-wide">
          {PRICE_LINE}
        </p>
      </div>

      <ThinRule className="mb-16" />

      {/* ── MANIFEST LEDGER ───────────────────────────────── */}
      <SectionLabel>SECTION 1 — RATION MANIFEST ({RATION_COUNT} ITEMS)</SectionLabel>

      {/* Ledger column headers */}
      <div
        className="grid font-mono text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
        style={{ gridTemplateColumns: '28px 1fr auto auto' }}
      >
        <span>NO.</span>
        <span>NOMENCLATURE</span>
        <span className="text-right">SPEC</span>
        <span className="text-right w-[80px] phone:w-[90px]">CADENCE</span>
      </div>

      {/* Monthly items */}
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
          NUTRITION ({monthlyItems.filter(i => i.category === 'NUTRITION').length})
        </div>
        {RATION_MANIFEST.filter(i => i.category === 'NUTRITION').map((item, idx, arr) => (
          <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
        ))}
      </div>

      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
          HEALTH ({RATION_MANIFEST.filter(i => i.category === 'HEALTH').length})
        </div>
        {RATION_MANIFEST.filter(i => i.category === 'HEALTH').map((item, idx, arr) => (
          <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
        ))}
      </div>

      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
          HYGIENE ({RATION_MANIFEST.filter(i => i.category === 'HYGIENE').length})
        </div>
        {RATION_MANIFEST.filter(i => i.category === 'HYGIENE').map((item, idx, arr) => (
          <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
        ))}
      </div>

      <div className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
          EQUIPMENT ({RATION_MANIFEST.filter(i => i.category === 'EQUIPMENT').length})
        </div>
        {RATION_MANIFEST.filter(i => i.category === 'EQUIPMENT').map((item, idx, arr) => (
          <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
        ))}
      </div>

      <ThinRule className="mb-16 mt-8" />

      {/* ── STATUS LINE ───────────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16">
        <StatusLine plan={planLabel} rationsStatus={rationStatus} />
      </div>

      {/* ── SECTION 3 — UPGRADE / ROSTER / STAND DOWN ─────── */}
      <ThinRule className="mb-16" />
      <SectionLabel>SECTION 3 — {isEnrolled ? 'ROSTER' : 'UPGRADE'}</SectionLabel>

      {isEnrolled ? (
        <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-12">
          {basicsMeta && (
            <div className="grid gap-x-16 gap-y-4" style={{ gridTemplateColumns: '120px 1fr' }}>
              <span className="text-acc/50 uppercase tracking-wider">SIZE</span>
              <span className="text-acc uppercase">{basicsMeta.size}</span>
              <span className="text-acc/50 uppercase tracking-wider">SHIP TO</span>
              <span className="text-acc/70 leading-snug">
                {basicsMeta.shipping.name}, {basicsMeta.shipping.address1}
                {basicsMeta.shipping.address2 ? `, ${basicsMeta.shipping.address2}` : ''}, {basicsMeta.shipping.city}, {basicsMeta.shipping.region} {basicsMeta.shipping.postalCode}, {basicsMeta.shipping.country}
              </span>
              <span className="text-acc/50 uppercase tracking-wider">ENROLLED</span>
              <span className="text-acc/70">{new Date(basicsMeta.enrolledAt).toISOString().slice(0, 10)}</span>
            </div>
          )}

          {isPending && (
            <div className="text-acc/50 text-[11px] leading-snug">
              PENDING confirms manually by S-2 once the USD 100.00/MO additive
              billing is settled. No card is collected in this interface.
            </div>
          )}

          <ThinRule />

          {!standDownArmed ? (
            <button
              onClick={() => setStandDownArmed(true)}
              className="self-start font-mono text-[11px] uppercase tracking-widest text-acc/60 hover:text-acc border border-acc/30 px-12 py-6"
            >
              {isPending ? 'CANCEL ENROLLMENT' : 'STAND DOWN'}
            </button>
          ) : (
            <div className="flex items-center gap-x-12">
              <span className="text-acc/60 text-[11px] uppercase tracking-widest">
                CONFIRM — {isPending ? 'CANCEL ENROLLMENT' : 'DROPS RATION, RETAINS AI'}?
              </span>
              <button
                disabled={isStandingDown}
                onClick={() => standDown()}
                className="font-mono text-[11px] uppercase tracking-widest text-acc border border-acc px-12 py-6 disabled:opacity-40"
              >
                {isStandingDown ? 'WORKING…' : 'CONFIRM'}
              </button>
              <button
                onClick={() => setStandDownArmed(false)}
                className="font-mono text-[11px] uppercase tracking-widest text-acc/40 hover:text-acc/70"
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      ) : isUsership ? (
        <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-12">
          <div className="text-acc leading-snug">
            USERSHIP AI confirmed. BASIC ration available as additive layer
            (+{PRICE_LINE}). Submit roster intake below.
          </div>

          <div className="grid gap-x-16 gap-y-8" style={{ gridTemplateColumns: '120px 1fr' }}>
            <span className="text-acc/50 uppercase tracking-wider self-center">SIZE</span>
            <div className="flex gap-x-8">
              {BASICS_SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value as BasicsSize)}
                  className={cn(
                    'font-mono text-[11px] uppercase px-12 py-6 border',
                    size === s.value ? 'border-acc text-acc' : 'border-acc/30 text-acc/50'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {SHIPPING_FIELDS.map((f) => (
              <React.Fragment key={f.key}>
                <span className="text-acc/50 uppercase tracking-wider self-center">
                  {f.label}{!f.required && ' (OPT)'}
                </span>
                <input
                  type="text"
                  value={shipping[f.key]}
                  onChange={(e) => setShipping((s) => ({ ...s, [f.key]: e.target.value }))}
                  maxLength={200}
                  className="bg-transparent border border-acc/30 focus:border-acc text-acc font-mono text-[12px] px-8 py-6 outline-none"
                />
              </React.Fragment>
            ))}
          </div>

          {formError && (
            <div className="text-acc text-[11px] uppercase tracking-wider">{formError}</div>
          )}

          <button
            disabled={isEnrolling}
            onClick={onSubmitEnrollment}
            className="self-start font-mono text-[11px] uppercase tracking-widest text-acc border border-acc px-16 py-8 disabled:opacity-40"
          >
            {isEnrolling ? 'SUBMITTING…' : 'SUBMIT ENROLLMENT'}
          </button>
        </div>
      ) : (
        <div className="border-2 border-acc/20 p-16 font-mono text-[12px]">
          <div className="text-acc/60 leading-snug">
            Requires USERSHIP / AI plan as base layer.
          </div>
        </div>
      )}
    </div>
  )
}
