/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT-FM-001 — BASIC (RATION) MODULE
 *
 * The hardware/physical layer of the LOT System. House style is
 * deliberately isolated from the rest of the app's theme (acc/bac,
 * rounded corners): fixed white ground / black ink, 2px square-corner
 * rules, uppercase register, monospace nomenclature. No color, no
 * radius, no icons — per LOT-FM-001 non-negotiable spec.
 *
 * Public OPEN TAB: reachable at /basics with no authentication. A
 * stranger reads doctrine, price, and the 23-item ledger, read-only.
 * COGS is never shipped to this bundle — see #shared/basicsRation
 * and docs/corporate/LOT-FM-001-COGS-LEDGER.md (server/ops only).
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { goTo } from '#client/stores/router'
import { Page } from '#client/components/ui'
import { cn } from '#client/utils'
import { useDocumentTitle } from '#client/utils/hooks'
import {
  RATION_MANIFEST,
  RATION_PRICE_USD,
  RATION_MARGIN_FLOOR,
  RationRecord,
  RationStatus,
  NO_RATION_RECORD,
  generateManifestCard,
} from '#shared/basicsRation'

const FM = "font-['Liberation_Mono','Courier_New',monospace]"
const BORDER = 'border-[2px] border-black'
const SQUARE = 'rounded-none'

function FMBlock({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(BORDER, SQUARE, className)}>
      <div className={cn(FM, 'bg-black text-white uppercase tracking-widest text-xs px-8 py-4')}>
        {label}
      </div>
      <div className={cn(FM, 'text-black text-sm p-12')}>{children}</div>
    </div>
  )
}

function FMRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-16 mb-4 last:mb-0">
      <span className="uppercase opacity-60 shrink-0">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  )
}

function FMButton({
  children,
  onClick,
  disabled,
  invert,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  invert?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        FM, BORDER, SQUARE,
        'uppercase tracking-widest text-xs px-16 py-8 w-full',
        invert ? 'bg-black text-white' : 'bg-white text-black',
        disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black hover:text-white transition-colors'
      )}
    >
      {children}
    </button>
  )
}

function FMInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        FM, BORDER, SQUARE,
        'w-full px-8 py-6 text-sm uppercase bg-white text-black placeholder:opacity-40 outline-none'
      )}
    />
  )
}

const STATUS_LINE: Record<RationStatus, string> = {
  NONE: 'OPEN TAB — READ ONLY',
  PENDING: 'ROSTER SUBMITTED — AWAITING CONFIRMATION',
  ON_STRENGTH: 'ON STRENGTH',
  STEADY_STATE: 'STEADY STATE',
  STAND_DOWN: 'STAND DOWN — RATION DROPPED',
}

const EMPTY_ROSTER = {
  shirtSize: '',
  sockSize: '',
  shippingName: '',
  shippingAddress: '',
  shippingCity: '',
  shippingCountry: '',
}

type Props = { noWrapper?: boolean }

export const Basics: React.FC<Props> = ({ noWrapper = false }) => {
  useDocumentTitle('LOT-FM-001 — Basic Ration')

  const me = useStore(stores.me) as any
  const isLoggedIn = !!me
  const hasUsership = isLoggedIn && (me.tags || []).some((t: string) => t.toLowerCase() === 'usership')
  const isAdmin = isLoggedIn && !!me.isAdmin

  const [ration, setRation] = React.useState<RationRecord>(NO_RATION_RECORD)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [roster, setRoster] = React.useState(EMPTY_ROSTER)

  const fetchRoster = React.useCallback(async () => {
    if (!isLoggedIn) return
    try {
      const res = await fetch('/api/basics/roster')
      if (res.ok) setRation(await res.json())
    } catch {
      // not logged in or endpoint unavailable — read-only ledger stands
    }
  }, [isLoggedIn])

  React.useEffect(() => {
    fetchRoster()
  }, [fetchRoster])

  const call = async (path: string, body?: unknown) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Request failed')
      setRation(data)
    } catch (err: any) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const status: RationStatus = ration.status
  const monthIndex = ration.issueLog.length
  const lastIssue = ration.issueLog[ration.issueLog.length - 1]

  const downloadCard = () => {
    if (!lastIssue) return
    const card = generateManifestCard({
      operatorName: `${me?.firstName || ''} ${me?.lastName || ''}`.trim() || me?.email || 'OPERATOR',
      monthIndex: lastIssue.monthIndex,
      issuedAt: lastIssue.issuedAt,
      itemCodes: lastIssue.items,
    })
    const blob = new Blob([card], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `LOT-FM-001-manifest-${lastIssue.monthIndex + 1}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const content = (
    <div className={cn(FM, 'bg-white text-black p-16 phone:p-24 max-w-[720px] mx-auto')}>
      {/* HEADER */}
      <div className={cn(BORDER, SQUARE, 'mb-16')}>
        <div className="bg-black text-white uppercase tracking-widest text-xs px-8 py-4">
          LOT-FM-001 // BASIC RATION
        </div>
        <div className="px-12 py-8 text-xs uppercase tracking-wide opacity-60">
          Physical layer. Civilian ration subscription. Issue, do not sell.
        </div>
      </div>

      {/* STATUS LINE */}
      <div className={cn(BORDER, SQUARE, 'mb-16 px-12 py-8 flex justify-between items-baseline text-xs uppercase tracking-widest')}>
        <span>STATUS</span>
        <span className="font-bold">{STATUS_LINE[status]}</span>
      </div>

      {/* DOCTRINE */}
      <FMBlock label="Doctrine" className="mb-16">
        <p className="mb-8">
          The System has issued material need. Not a store. Not a subscription
          box. A ration. The operator does not purchase — the operator is
          placed on strength, and the System issues.
        </p>
        <p>
          Twenty-three items, Section 2 nomenclature. Cadence fixed. No
          substitutions requested by the operator. The quartermaster issues
          what the cadence dictates.
        </p>
      </FMBlock>

      {/* PRICE LINE */}
      <div className={cn(BORDER, SQUARE, 'mb-16 px-12 py-8 flex justify-between items-baseline text-xs uppercase tracking-widest')}>
        <span>Rate</span>
        <span className="font-bold">
          ${RATION_PRICE_USD}/MO — ADDITIVE TO USERSHIP · MARGIN FLOOR {Math.round(RATION_MARGIN_FLOOR * 100)}%
        </span>
      </div>

      {/* LEDGER */}
      <FMBlock label="Section 2 — Ration Load (23 Items)" className="mb-16">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-[2px] border-black uppercase opacity-60 text-left">
                <th className="pb-4 pr-8">Code</th>
                <th className="pb-4 pr-8">Nomenclature</th>
                <th className="pb-4">Cadence</th>
              </tr>
            </thead>
            <tbody>
              {RATION_MANIFEST.map((item) => (
                <tr key={item.code} className="border-b border-black/20">
                  <td className="py-4 pr-8 opacity-60">{item.code}</td>
                  <td className="py-4 pr-8">{item.nomenclature}</td>
                  <td className="py-4">{item.cadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-[11px] opacity-40 uppercase">COGS withheld. The ledger is the marketing.</div>
      </FMBlock>

      {/* PUBLIC / LOGGED-OUT NOTICE */}
      {!isLoggedIn && (
        <FMBlock label="Enrollment" className="mb-16">
          <p className="mb-8">This tab is read-only for visitors. Log in to check enrollment status.</p>
          <FMButton onClick={() => goTo('system')}>Log In</FMButton>
        </FMBlock>
      )}

      {/* LOGGED IN, NO USERSHIP */}
      {isLoggedIn && !hasUsership && (
        <FMBlock label="Enrollment" className="mb-16">
          <p>USERSHIP (AI plan) required before UPGRADE to BASIC ration. Not sold standalone.</p>
        </FMBlock>
      )}

      {/* LOGGED IN, USERSHIP, NONE/STAND_DOWN — roster intake */}
      {isLoggedIn && hasUsership && (status === 'NONE' || status === 'STAND_DOWN') && (
        <FMBlock label="Upgrade — Roster Intake" className="mb-16">
          <div className="flex flex-col gap-8 mb-12">
            <FMInput placeholder="Shirt size" value={roster.shirtSize} onChange={(v) => setRoster((r) => ({ ...r, shirtSize: v }))} />
            <FMInput placeholder="Sock size" value={roster.sockSize} onChange={(v) => setRoster((r) => ({ ...r, sockSize: v }))} />
            <FMInput placeholder="Recipient name" value={roster.shippingName} onChange={(v) => setRoster((r) => ({ ...r, shippingName: v }))} />
            <FMInput placeholder="Shipping address" value={roster.shippingAddress} onChange={(v) => setRoster((r) => ({ ...r, shippingAddress: v }))} />
            <FMInput placeholder="City" value={roster.shippingCity} onChange={(v) => setRoster((r) => ({ ...r, shippingCity: v }))} />
            <FMInput placeholder="Country" value={roster.shippingCountry} onChange={(v) => setRoster((r) => ({ ...r, shippingCountry: v }))} />
          </div>
          <FMButton
            invert
            disabled={loading || Object.values(roster).some((v) => !v)}
            onClick={() => call('/api/basics/upgrade', roster)}
          >
            {loading ? 'Submitting...' : 'Upgrade — Submit Roster'}
          </FMButton>
        </FMBlock>
      )}

      {/* PENDING — confirm */}
      {isLoggedIn && status === 'PENDING' && ration.roster && (
        <FMBlock label="Roster Pending" className="mb-16">
          <FMRow label="Shirt" value={ration.roster.shirtSize} />
          <FMRow label="Sock" value={ration.roster.sockSize} />
          <FMRow label="Ship To" value={`${ration.roster.shippingName}, ${ration.roster.shippingCity}, ${ration.roster.shippingCountry}`} />
          <div className="mt-12">
            <FMButton invert disabled={loading} onClick={() => call('/api/basics/confirm')}>
              {loading ? 'Confirming...' : 'Confirm — Go On Strength'}
            </FMButton>
          </div>
        </FMBlock>
      )}

      {/* ON_STRENGTH / STEADY_STATE — issue log + stand down */}
      {isLoggedIn && (status === 'ON_STRENGTH' || status === 'STEADY_STATE') && (
        <>
          <FMBlock label="Issue Record" className="mb-16">
            <FMRow label="Cadence Start" value={ration.cadenceStart ? new Date(ration.cadenceStart).toISOString().slice(0, 10) : '—'} />
            <FMRow label="Next Issue" value={ration.nextIssue ? new Date(ration.nextIssue).toISOString().slice(0, 10) : '—'} />
            <FMRow label="Issues Logged" value={monthIndex} />
            {lastIssue && (
              <div className="mt-12">
                <FMButton onClick={downloadCard}>Download Last Manifest Card</FMButton>
              </div>
            )}
          </FMBlock>

          {isAdmin && (
            <FMBlock label="Quartermaster (Admin)" className="mb-16">
              <FMButton invert disabled={loading} onClick={() => call('/api/basics/next-issue', { userId: me.id })}>
                {loading ? 'Dispatching...' : 'Log Next Issue'}
              </FMButton>
            </FMBlock>
          )}

          <FMBlock label="Stand Down" className="mb-16">
            <p className="mb-8">Drops the ration. USERSHIP and AI access are retained.</p>
            <FMButton disabled={loading} onClick={() => call('/api/basics/stand-down')}>
              {loading ? 'Standing Down...' : 'Stand Down'}
            </FMButton>
          </FMBlock>
        </>
      )}

      {error && (
        <div className={cn(BORDER, SQUARE, 'px-12 py-8 text-xs uppercase mb-16')}>
          Error: {error}
        </div>
      )}

      <div className="text-[11px] opacity-40 uppercase tracking-wide text-center mt-24">
        LOT-FM-001. Issue, do not sell. The user is on strength.
      </div>
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
