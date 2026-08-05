/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE
 * SECTION 3 — ROSTER INTAKE (Month 2)
 */

import * as React from 'react'
import { cn } from '#client/utils'
import type { BasicsShipping } from '#shared/constants/basics'

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="font-mono text-[10px] uppercase tracking-widest text-acc/50 block mb-2">
    {children}
  </label>
)

const inputCls = cn(
  'w-full bg-transparent border-2 border-acc/30 focus:border-acc',
  'text-acc font-mono text-[12px] tracking-wide px-8 py-6 outline-none',
  'placeholder:text-acc/30 rounded-none'
)

type RosterInput = {
  shipping: BasicsShipping
  householdSize: string
  cadenceStartDay: string
}

const EMPTY_INPUT: RosterInput = {
  shipping: { name: '', address1: '', address2: '', city: '', region: '', postal: '', country: '' },
  householdSize: '1',
  cadenceStartDay: '1',
}

export const RosterIntake: React.FC<{
  onConfirm: (payload: { shipping: BasicsShipping; householdSize: number; cadenceStartDay: number }) => void
  onAbort: () => void
  submitting: boolean
  error: string | null
}> = ({ onConfirm, onAbort, submitting, error }) => {
  const [input, setInput] = React.useState<RosterInput>(EMPTY_INPUT)

  const set = (patch: Partial<RosterInput>) => setInput((prev) => ({ ...prev, ...patch }))
  const setShipping = (patch: Partial<BasicsShipping>) =>
    setInput((prev) => ({ ...prev, shipping: { ...prev.shipping, ...patch } }))

  const householdSize = parseInt(input.householdSize, 10)
  const cadenceStartDay = parseInt(input.cadenceStartDay, 10)
  const canSubmit =
    input.shipping.name.trim() &&
    input.shipping.address1.trim() &&
    input.shipping.city.trim() &&
    input.shipping.region.trim() &&
    input.shipping.postal.trim() &&
    input.shipping.country.trim() &&
    Number.isInteger(householdSize) && householdSize >= 1 && householdSize <= 12 &&
    Number.isInteger(cadenceStartDay) && cadenceStartDay >= 1 && cadenceStartDay <= 28

  return (
    <div className="border-2 border-acc p-16 font-mono flex flex-col gap-y-16">
      <div className="text-acc/50 uppercase tracking-widest text-[10px]">
        ROSTER INTAKE — REQUIRED TO GO ON STRENGTH
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-16 gap-y-12">
        <div className="tablet:col-span-2">
          <FieldLabel>NAME</FieldLabel>
          <input
            className={inputCls}
            value={input.shipping.name}
            onChange={(e) => setShipping({ name: e.target.value })}
            placeholder="OPERATOR NAME"
          />
        </div>
        <div className="tablet:col-span-2">
          <FieldLabel>ADDRESS 1</FieldLabel>
          <input
            className={inputCls}
            value={input.shipping.address1}
            onChange={(e) => setShipping({ address1: e.target.value })}
            placeholder="STREET ADDRESS"
          />
        </div>
        <div className="tablet:col-span-2">
          <FieldLabel>ADDRESS 2 (OPTIONAL)</FieldLabel>
          <input
            className={inputCls}
            value={input.shipping.address2}
            onChange={(e) => setShipping({ address2: e.target.value })}
            placeholder="APT / UNIT / SUITE"
          />
        </div>
        <div>
          <FieldLabel>CITY</FieldLabel>
          <input
            className={inputCls}
            value={input.shipping.city}
            onChange={(e) => setShipping({ city: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>REGION / STATE</FieldLabel>
          <input
            className={inputCls}
            value={input.shipping.region}
            onChange={(e) => setShipping({ region: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>POSTAL CODE</FieldLabel>
          <input
            className={inputCls}
            value={input.shipping.postal}
            onChange={(e) => setShipping({ postal: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>COUNTRY</FieldLabel>
          <input
            className={inputCls}
            value={input.shipping.country}
            onChange={(e) => setShipping({ country: e.target.value })}
            placeholder="ISO OR NAME"
          />
        </div>
        <div>
          <FieldLabel>HOUSEHOLD SIZE (1–12)</FieldLabel>
          <input
            className={inputCls}
            type="number"
            min={1}
            max={12}
            value={input.householdSize}
            onChange={(e) => set({ householdSize: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>CADENCE START DAY (1–28)</FieldLabel>
          <input
            className={inputCls}
            type="number"
            min={1}
            max={28}
            value={input.cadenceStartDay}
            onChange={(e) => set({ cadenceStartDay: e.target.value })}
          />
        </div>
      </div>

      {error && (
        <div className="font-mono text-[11px] text-acc uppercase tracking-wide border-2 border-acc p-8">
          ERROR: {error}
        </div>
      )}

      <div className="flex gap-x-12">
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={() => onConfirm({ shipping: input.shipping, householdSize, cadenceStartDay })}
          className={cn(
            'font-mono text-[12px] uppercase tracking-widest px-16 py-8 border-2 border-acc',
            canSubmit && !submitting
              ? 'bg-acc text-bac hover:bg-transparent hover:text-acc'
              : 'opacity-30 cursor-not-allowed'
          )}
        >
          {submitting ? 'PROCESSING…' : 'CONFIRM ENROLLMENT'}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onAbort}
          className="font-mono text-[12px] uppercase tracking-widest px-16 py-8 border-2 border-acc/30 text-acc/50 hover:text-acc hover:border-acc"
        >
          ABORT
        </button>
      </div>
    </div>
  )
}
