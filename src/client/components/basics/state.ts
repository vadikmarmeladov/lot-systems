/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE
 * SECTION 3 — UPGRADE + ROSTER STATE MACHINE (M2)
 *
 * USERSHIP / AI -> PENDING -> ON STRENGTH -> STEADY STATE
 *                          \-> STAND DOWN -/
 * PENDING is user-initiated (enroll). ON STRENGTH is quartermaster-confirmed
 * (CEO advance). STEADY STATE is reached on the first confirmed issue.
 * STAND DOWN is user-initiated at any active state and drops the ration only
 * — USERSHIP / AI is retained. Re-enrollment from STAND DOWN returns to PENDING.
 */

export type BasicsStatus = 'PENDING' | 'ON_STRENGTH' | 'STEADY_STATE' | 'STAND_DOWN'

export type BasicsSizing = 'S' | 'M' | 'L' | 'XL'

export const SIZING_OPTIONS: BasicsSizing[] = ['S', 'M', 'L', 'XL']

export type BasicsIssueLogEntry = {
  cycle: string // 'YYYY-MM'
  status: 'SCHEDULED' | 'DISPATCHED'
  dispatchedAt: string | null
}

export type BasicsRecord = {
  status: BasicsStatus
  sizing: BasicsSizing
  enrolledAt: string
  cadenceStart: string
  confirmedAt?: string
  steadyStateAt?: string
  standDownAt?: string
  issueLog: BasicsIssueLogEntry[]
}

export const ACTIVE_STATUSES: BasicsStatus[] = ['PENDING', 'ON_STRENGTH', 'STEADY_STATE']

export const STATUS_LABEL: Record<BasicsStatus, string> = {
  PENDING: 'PENDING — AWAITING QUARTERMASTER CONFIRMATION',
  ON_STRENGTH: 'ON STRENGTH — ACTIVE',
  STEADY_STATE: 'STEADY STATE — RECURRING ISSUE',
  STAND_DOWN: 'STAND DOWN — RATION HALTED',
}
