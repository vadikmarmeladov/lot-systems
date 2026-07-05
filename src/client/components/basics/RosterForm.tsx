/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE — ROSTER INTAKE (Month 2)
 *
 * Sizing: fixed at one standard ration per operator (LOT-FM-001 doctrine —
 * "one ration per operator per month"), so intake asks only for shipping
 * confirmation and cadence-start notes, not a size selector.
 */

import * as React from 'react'
import { cn } from '#client/utils'

type Props = {
  address: string | null
  city: string | null
  country: string | null
  phone: string | null
  shippingNotes: string
  onShippingNotesChange: (v: string) => void
  onGoToSettings: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export const RosterForm: React.FC<Props> = ({
  address,
  city,
  country,
  phone,
  shippingNotes,
  onShippingNotesChange,
  onGoToSettings,
  onSubmit,
  isSubmitting,
}) => {
  const shippingComplete = !!(address && city && country)

  return (
    <div className="flex flex-col gap-y-8 font-mono text-[12px] phone:text-[13px]">
      <div className="text-acc/50 uppercase tracking-widest text-[10px]">
        ROSTER INTAKE — SIZE: STANDARD (1 OPERATOR)
      </div>

      <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
        <span className="text-acc/50 uppercase tracking-wider">SHIP TO</span>
        {shippingComplete ? (
          <span className="text-acc uppercase">
            {address}, {city}, {country}
            {phone ? ` · ${phone}` : ''}
          </span>
        ) : (
          <button
            type="button"
            onClick={onGoToSettings}
            className="text-acc/70 uppercase underline text-left"
          >
            NO ADDRESS ON FILE — SET IN SETTINGS
          </button>
        )}
      </div>

      <label className="flex flex-col gap-y-4">
        <span className="text-acc/50 uppercase tracking-wider text-[11px]">
          SHIPPING NOTES (OPTIONAL)
        </span>
        <textarea
          value={shippingNotes}
          onChange={(e) => onShippingNotesChange(e.target.value.slice(0, 500))}
          rows={2}
          className={cn(
            'bg-transparent border-2 border-acc/20 focus:border-acc/60 outline-none p-8',
            'font-mono text-[12px] text-acc resize-none square'
          )}
          placeholder="GATE CODE, GUARD DOG, LEAVE AT SIDE DOOR..."
        />
      </label>

      <button
        type="button"
        disabled={!shippingComplete || isSubmitting}
        onClick={onSubmit}
        className={cn(
          'border-2 border-acc mt-4 py-8 uppercase tracking-widest text-[12px]',
          'hover:bg-acc hover:text-bac transition-colors',
          (!shippingComplete || isSubmitting) && 'opacity-30 pointer-events-none'
        )}
      >
        {isSubmitting ? 'SUBMITTING…' : 'SUBMIT ROSTER INTAKE'}
      </button>
    </div>
  )
}
