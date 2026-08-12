/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE — Month 1: OPEN TAB
 * Public, read-only ledger of the hardware/physical layer of the LOT System.
 * A stranger can read what LOT issues and on what terms. No sale flow here.
 *
 * House style is fixed, not theme-reactive: white ground / black ink,
 * LiberationMono register, 2px rules, square corners, inversion-only
 * hierarchy, no color, no radius, no icons. This tab deliberately opts out
 * of the app's user theme — the ration ledger reads the same for every
 * operator and every stranger who opens it.
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { useDocumentTitle } from '#client/utils/hooks'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  UPGRADE_ENROLLMENT_NOTE,
  type RationCadence,
  type RationCategory,
} from './basics/doctrine'

// ─── fixed terminal tokens (never theme-reactive) ──────────────────────────
const INK = '#000'
const GROUND = '#fff'
const FONT = "'Liberation Mono', 'Courier New', Courier, monospace"
const RULE_2PX = `2px solid ${INK}`
const RULE_1PX = `1px solid ${INK}`

const base: React.CSSProperties = {
  fontFamily: FONT,
  color: INK,
  backgroundColor: GROUND,
}

// ─── sub-components ─────────────────────────────────────────────────────────

const InvertedBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      ...base,
      backgroundColor: INK,
      color: GROUND,
      border: RULE_2PX,
      fontWeight: 700,
      padding: '6px 10px',
      fontSize: '11px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '4px 16px',
    }}
  >
    {children}
  </div>
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      ...base,
      fontWeight: 700,
      fontSize: '11px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      borderBottom: RULE_2PX,
      padding: '10px 0 6px',
      marginTop: '20px',
    }}
  >
    {children}
  </div>
)

const CATEGORY_LABEL: Record<RationCategory, string> = {
  NUTRITION: 'NUTRITION',
  HEALTH: 'HEALTH',
  HYGIENE: 'HYGIENE',
  EQUIPMENT: 'EQUIPMENT',
}

const CadenceTag: React.FC<{ cadence: RationCadence }> = ({ cadence }) => (
  <span style={{ ...base, fontSize: '11px', opacity: cadence === 'MONTHLY' ? 1 : 0.6 }}>
    {cadence}
  </span>
)

const LedgerHeader: React.FC = () => (
  <div
    style={{
      ...base,
      display: 'grid',
      gridTemplateColumns: '28px 1fr auto 84px',
      gap: '0 8px',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      opacity: 0.6,
      borderBottom: RULE_1PX,
      paddingBottom: '4px',
    }}
  >
    <span>NO.</span>
    <span>NOMENCLATURE</span>
    <span style={{ textAlign: 'right' }}>SPEC</span>
    <span style={{ textAlign: 'right' }}>CADENCE</span>
  </div>
)

const LedgerRow: React.FC<{ item: (typeof RATION_MANIFEST)[number]; isLast: boolean }> = ({
  item,
  isLast,
}) => (
  <div
    style={{
      ...base,
      display: 'grid',
      gridTemplateColumns: '28px 1fr auto 84px',
      gap: '0 8px',
      fontSize: '12px',
      padding: '5px 0',
      borderBottom: isLast ? 'none' : `1px solid rgba(0,0,0,0.15)`,
    }}
  >
    <span style={{ opacity: 0.5 }}>{item.line}</span>
    <span style={{ textTransform: 'uppercase', letterSpacing: '0.02em' }}>
      {item.nomenclature}
    </span>
    <span style={{ textAlign: 'right', opacity: 0.6, whiteSpace: 'nowrap' }}>{item.spec}</span>
    <span style={{ textAlign: 'right' }}>
      <CadenceTag cadence={item.cadence} />
    </span>
  </div>
)

const RationGroup: React.FC<{ category: RationCategory }> = ({ category }) => {
  const items = RATION_MANIFEST.filter((i) => i.category === category)
  if (items.length === 0) return null
  return (
    <div style={{ marginBottom: '14px' }}>
      <div
        style={{
          ...base,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.45,
          padding: '8px 0 4px',
        }}
      >
        {CATEGORY_LABEL[category]} ({items.length})
      </div>
      {items.map((item, idx) => (
        <LedgerRow key={item.line} item={item} isLast={idx === items.length - 1} />
      ))}
    </div>
  )
}

const StatusRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      ...base,
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: '0 16px',
      fontSize: '12px',
      padding: '2px 0',
    }}
  >
    <span style={{ opacity: 0.55, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </span>
    <span style={{ textTransform: 'uppercase' }}>{value}</span>
  </div>
)

// ─── main component ──────────────────────────────────────────────────────────

type BasicsProps = {
  // true only on the standalone public bundle (no app Layout/Page around it).
  // Embedded (default) relies on the parent Page for viewport height + padding.
  standalone?: boolean
}

export const Basics: React.FC<BasicsProps> = ({ standalone = false }) => {
  const me = useStore(stores.me)
  useDocumentTitle('Basics — OPEN TAB')

  const isOnStrength = me?.tags?.includes('Basic') ?? false
  const isUsership = me?.tags?.includes('Usership') ?? false

  const planLabel = isOnStrength ? 'BASIC / ON STRENGTH' : isUsership ? 'USERSHIP / AI' : 'NONE'
  const rationStatus = isOnStrength ? 'ACTIVE — NEXT ISSUE PENDING' : 'NOT ON STRENGTH'

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div
      style={{
        ...base,
        minHeight: standalone ? '100dvh' : undefined,
        padding: standalone ? '24px 16px 96px' : '4px 0 24px',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '640px',
        margin: standalone ? '0 auto' : undefined,
      }}
    >
      {/* ── STATUS LINE (system-wide, not user-specific) ─────────────────── */}
      <InvertedBar>
        <span>{MANUAL_REF} // BASIC RATION MODULE</span>
        <span>STATUS: OPEN TAB — READ ONLY</span>
        <span>{today}</span>
      </InvertedBar>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div
        style={{
          ...base,
          fontWeight: 700,
          fontSize: '16px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '16px 0 6px',
        }}
      >
        BASICS
      </div>
      <div style={{ borderTop: RULE_2PX, marginBottom: '12px' }} />

      {/* ── DOCTRINE + PRICE ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
        {DOCTRINE_LINES.map((line, i) => (
          <p key={i} style={{ ...base, fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
            {line}
          </p>
        ))}
      </div>
      <div
        style={{
          ...base,
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '0.03em',
          marginTop: '10px',
        }}
      >
        {PRICE_LINE}
      </div>

      {/* ── SECTION 1 — RATION MANIFEST ────────────────────────────────── */}
      <SectionLabel>Section 1 — Ration Manifest ({RATION_COUNT} items)</SectionLabel>
      <LedgerHeader />
      <RationGroup category="NUTRITION" />
      <RationGroup category="HEALTH" />
      <RationGroup category="HYGIENE" />
      <RationGroup category="EQUIPMENT" />

      {/* ── SECTION 2 — OPERATOR STATUS ────────────────────────────────── */}
      <SectionLabel>Section 2 — Operator Status</SectionLabel>
      <div style={{ padding: '8px 0 4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <StatusRow label="Plan" value={planLabel} />
        <StatusRow label="Ration" value={rationStatus} />
      </div>

      {/* ── SECTION 3 — UPGRADE PATH (scaffold — Month 2 activates) ─────── */}
      <SectionLabel>Section 3 — Upgrade Path</SectionLabel>
      <div style={{ border: RULE_2PX, padding: '14px', marginTop: '8px' }}>
        <div
          style={{
            ...base,
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.55,
            marginBottom: '6px',
          }}
        >
          USERSHIP / AI → BASIC
        </div>
        <div style={{ ...base, fontSize: '12px', lineHeight: 1.4 }}>
          {isOnStrength
            ? 'BASIC ration active. STAND DOWN available from Settings once M2 ships.'
            : isUsership
              ? 'USERSHIP AI confirmed. BASIC ration available as an additive layer (+USD 100.00/MO) once enrollment opens.'
              : 'Requires USERSHIP / AI plan as base layer.'}
        </div>
        <div style={{ ...base, fontSize: '11px', opacity: 0.5, marginTop: '8px' }}>
          {UPGRADE_ENROLLMENT_NOTE}
        </div>
      </div>
    </div>
  )
}
