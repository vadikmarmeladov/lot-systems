/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE
 * SECTION 1 — RATION MANIFEST + DOCTRINE
 *
 * Re-exports the shared manifest so it stays identical to what the
 * server issue engine ships against. Do not fork this list — edit
 * #shared/constants/basics.
 */

export {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  RATION_PRICE_USD,
  itemsForIssue,
  type RationItem,
  type RationCadence,
  type RationCategory,
  type BasicsStatus,
  type BasicsState,
  type BasicsRoster,
  type BasicsIssueRecord,
} from '#shared/constants/basics'
