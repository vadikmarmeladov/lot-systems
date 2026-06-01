/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | Made in the USA | brand.lot-systems.com
 */

export type Cadence = 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'always'

export type RationItem = {
  id: string
  nomenclature: string
  cadence: Cadence
  // COGS is internal — never rendered in public ledger
  cogs: number
}

// Month 2: Upgrade state machine
// OFF → PENDING → ON_STRENGTH → STEADY_STATE
// ON_STRENGTH / STEADY_STATE → OFF (STAND DOWN)
export type RationStatus =
  | 'OFF'
  | 'PENDING'
  | 'ON_STRENGTH'
  | 'STEADY_STATE'

export type RosterRecord = {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  cadenceStart: string // ISO date string, first of next available month
}

// Month 3: Issue log entry
export type IssueEntry = {
  issueNumber: number
  issuedAt: string // ISO date
  itemIds: string[] // items included in this issue
  status: 'SCHEDULED' | 'DISPATCHED' | 'DELIVERED'
  trackingNumber?: string
}

export type BasicsState = {
  status: RationStatus
  roster: RosterRecord | null
  issues: IssueEntry[]
  enrolledAt: string | null // ISO date
  nextIssueDate: string | null // ISO date
}
