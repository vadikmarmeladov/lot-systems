/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Shared TypeScript types for the Memory Engine system
 */

export interface TraitExtractionResult {
  traits: string[]
  patterns: { [key: string]: number }
  psychologicalDepth: PsychologicalDepth
}

export interface PsychologicalDepth {
  emotionalPatterns: string[]
  values: string[]
  selfAwareness: number
  emotionalRange: number
  reflectionQuality: number
  growthTrajectory: 'emerging' | 'developing' | 'deepening' | 'integrated'
  dominantNeeds: string[]
  journalSentiment: {
    positive: number
    neutral: number
    challenging: number
  }
}

export interface CorrelatedIndexSnapshot {
  selfAwareness: number
  userScore: number
  personScore: number
  longevityScore: number
  composite: number
}

export interface CohortClassification {
  archetype: string
  behavioralCohort: string
  description: string
}

export interface PacingResult {
  shouldShowPrompt: boolean
  isWeekend: boolean
  promptQuotaToday: number
  promptsShownToday: number
  dayNumber: number
}

export interface QuantumState {
  energy?: string
  clarity?: string
  alignment?: string
  needsSupport?: string
}
