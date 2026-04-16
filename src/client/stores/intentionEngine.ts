/**
 * Quantum Intention Recognition Engine
 *
 * Analyzes patterns across all widgets to deeply understand user intentions
 * and desires, surfacing the right support at the right moment.
 *
 * Philosophy: Users don't always know what they need. By observing patterns
 * in mood, planning, intentions, and timing, we can recognize deeper desires
 * and provide gentle, perfectly-timed support.
 *
 * Origin: LOT Systems. The intention engine was here first.
 * Copies may appear. They'll have the form but not the function.
 * The copycat war begins — but intention recognition can't be faked.
 */

import { atom } from 'nanostores'

// Intention signals collected from all widgets and background monitors
export type IntentionSignal = {
  timestamp: number
  source: 'mood' | 'memory' | 'planner' | 'intentions' | 'selfcare' | 'journal' | 'calculator' | 'log' | 'energy' | 'cohort'
  signal: string
  metadata?: Record<string, any>
}

// Recognized user states (quantum superposition of multiple states)
export type UserState = {
  energy: 'depleted' | 'low' | 'moderate' | 'high' | 'unknown'
  clarity: 'confused' | 'uncertain' | 'clear' | 'focused' | 'unknown'
  alignment: 'disconnected' | 'searching' | 'aligned' | 'flowing' | 'unknown'
  needsSupport: 'critical' | 'moderate' | 'low' | 'none'
  lastUpdated: number
}

// Deep intention patterns
export type IntentionPattern = {
  pattern: string
  confidence: number // 0-1
  suggestedWidget: string
  suggestedTiming: 'immediate' | 'soon' | 'next-session' | 'passive'
  reason: string
}

// Accumulative User Index — aggregated from all widget signals
export type UserIndex = {
  overall: number          // 0-100, the single accumulative score
  dimensions: {
    engagement: number     // 0-100, frequency and breadth of widget interactions
    emotional: number      // 0-100, emotional health from mood signals
    intentional: number    // 0-100, planning + intention + direction
    social: number         // 0-100, community connections and cohort
    selfCare: number       // 0-100, cleanness + rest + care practices
    cognitive: number      // 0-100, memory + journal + reflection depth
  }
  trend: 'rising' | 'stable' | 'declining'
  lastComputed: number
}

type IntentionEngineState = {
  signals: IntentionSignal[]
  userState: UserState
  userIndex: UserIndex
  recognizedPatterns: IntentionPattern[]
  lastAnalysis: number
  lastSyncedTimestamp: number
}

const SIGNAL_RETENTION = 7 * 24 * 60 * 60 * 1000 // 7 days
const MAX_SIGNALS = 1000 // Prevent unbounded growth
const ANALYSIS_COOLDOWN = 5 * 60 * 1000 // 5 minutes
const SYNC_INTERVAL = 10 // Sync every 10 signals
const SYNC_COOLDOWN = 5 * 60 * 1000 // Don't sync more than once per 5 minutes

const DEFAULT_USER_INDEX: UserIndex = {
  overall: 0,
  dimensions: {
    engagement: 0,
    emotional: 0,
    intentional: 0,
    social: 0,
    selfCare: 0,
    cognitive: 0,
  },
  trend: 'stable',
  lastComputed: 0
}

export const intentionEngine = atom<IntentionEngineState>({
  signals: [],
  userState: {
    energy: 'unknown',
    clarity: 'unknown',
    alignment: 'unknown',
    needsSupport: 'none',
    lastUpdated: 0
  },
  userIndex: DEFAULT_USER_INDEX,
  recognizedPatterns: [],
  lastAnalysis: 0,
  lastSyncedTimestamp: 0
})

// Load signals and user index from localStorage on init
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('intention-signals')
  const storedIndex = localStorage.getItem('user-index')
  let loadedIndex = DEFAULT_USER_INDEX

  if (storedIndex) {
    try {
      loadedIndex = JSON.parse(storedIndex)
    } catch (e) {
      console.error('Failed to load user index:', e)
    }
  }

  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      // Filter out old signals (keep last 7 days)
      const cutoff = Date.now() - SIGNAL_RETENTION
      const recentSignals = parsed.filter((s: IntentionSignal) => s.timestamp > cutoff)

      if (recentSignals.length > 0) {
        intentionEngine.set({
          ...intentionEngine.get(),
          signals: recentSignals,
          userIndex: loadedIndex
        })
      }
    } catch (e) {
      console.error('Failed to load intention signals:', e)
    }
  } else if (storedIndex) {
    intentionEngine.set({
      ...intentionEngine.get(),
      userIndex: loadedIndex
    })
  }
}

/**
 * Helper: Safely check if user has current intention
 */
function hasCurrentIntention(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return !!localStorage.getItem('current-intention')
  } catch (e) {
    console.warn('Failed to check current intention:', e)
    return false
  }
}

/**
 * Record a signal from any widget interaction
 */
export function recordSignal(
  source: IntentionSignal['source'],
  signal: string,
  metadata?: Record<string, any>
) {
  const state = intentionEngine.get()

  const newSignal: IntentionSignal = {
    timestamp: Date.now(),
    source,
    signal,
    metadata
  }

  const updatedSignals = [...state.signals, newSignal]

  // Keep only last 7 days AND enforce max limit
  const cutoff = Date.now() - SIGNAL_RETENTION
  let recentSignals = updatedSignals.filter(s => s.timestamp > cutoff)

  // Enforce MAX_SIGNALS limit (keep most recent)
  if (recentSignals.length > MAX_SIGNALS) {
    recentSignals = recentSignals
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_SIGNALS)
  }

  intentionEngine.set({
    ...state,
    signals: recentSignals
  })

  // Persist to localStorage (protected)
  try {
    localStorage.setItem('intention-signals', JSON.stringify(recentSignals))
  } catch (e) {
    console.warn('Failed to persist intention signals:', e)
  }

  // Trigger analysis if enough new signals AND cooldown has passed
  const now = Date.now()
  const shouldAnalyze = recentSignals.length % 5 === 0 &&
                        (now - state.lastAnalysis >= ANALYSIS_COOLDOWN)

  if (shouldAnalyze) {
    analyzeIntentions()
  }

  // Trigger server sync periodically
  const shouldSync = recentSignals.length % SYNC_INTERVAL === 0 &&
                     (now - state.lastSyncedTimestamp >= SYNC_COOLDOWN)

  if (shouldSync) {
    syncToServer()
  }
}

/**
 * Analyze all signals to recognize deep patterns and user state
 */
export function analyzeIntentions(): IntentionPattern[] {
  const state = intentionEngine.get()
  const now = Date.now()

  // Don't re-analyze too frequently
  if (now - state.lastAnalysis < 5 * 60 * 1000) { // 5 min cooldown
    return state.recognizedPatterns
  }

  const patterns: IntentionPattern[] = []
  const signals = state.signals

  // Get recent signals (last 24 hours for immediate patterns)
  const dayAgo = now - 24 * 60 * 60 * 1000
  const recentSignals = signals.filter(s => s.timestamp > dayAgo)

  // Pattern 1: Repeated anxious/overwhelmed moods → Need self-care
  const anxiousMoods = recentSignals.filter(s =>
    s.source === 'mood' && (s.signal === 'anxious' || s.signal === 'overwhelmed')
  )
  if (anxiousMoods.length >= 2) {
    patterns.push({
      pattern: 'anxiety-pattern',
      confidence: Math.min(anxiousMoods.length / 3, 1),
      suggestedWidget: 'selfcare',
      suggestedTiming: 'immediate',
      reason: 'Anxiety repeating. Break the cycle — ground yourself now.'
    })
  }

  // Pattern 2: Tired + no planning → Need structure
  const tiredMoods = recentSignals.filter(s => s.source === 'mood' && s.signal === 'tired')
  const plannerUse = recentSignals.filter(s => s.source === 'planner')
  if (tiredMoods.length >= 1 && plannerUse.length === 0) {
    patterns.push({
      pattern: 'lack-of-structure',
      confidence: 0.7,
      suggestedWidget: 'planner',
      suggestedTiming: 'soon',
      reason: 'Tired without a plan. Structure creates energy.'
    })
  }

  // Pattern 3: No intention set for weeks → Searching for direction
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000
  const intentionSignals = signals.filter(s =>
    s.source === 'intentions' && s.timestamp > weekAgo
  )
  const hasIntention = hasCurrentIntention()

  if (!hasIntention && intentionSignals.length === 0) {
    patterns.push({
      pattern: 'seeking-direction',
      confidence: 0.8,
      suggestedWidget: 'intentions',
      suggestedTiming: 'next-session',
      reason: 'No guiding intention set. Choose a direction.'
    })
  }

  // Pattern 4: Energized + planning → Flow state potential
  const energizedMoods = recentSignals.filter(s =>
    s.source === 'mood' && (s.signal === 'energized' || s.signal === 'hopeful')
  )
  const recentPlanning = recentSignals.filter(s => s.source === 'planner')

  if (energizedMoods.length >= 1 && recentPlanning.length >= 1) {
    patterns.push({
      pattern: 'flow-potential',
      confidence: 0.9,
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: 'Energy high, plans active. Capture this momentum.'
    })
  }

  // Pattern 5: Evening + overwhelmed → Rest needed
  const hour = new Date().getHours()
  const isEvening = hour >= 18 && hour < 23
  const overwhelmedRecently = recentSignals.filter(s =>
    s.source === 'mood' && s.signal === 'overwhelmed' &&
    (now - s.timestamp) < 3 * 60 * 60 * 1000 // Last 3 hours
  ).length > 0

  if (isEvening && overwhelmedRecently) {
    patterns.push({
      pattern: 'evening-overwhelm',
      confidence: 0.85,
      suggestedWidget: 'selfcare',
      suggestedTiming: 'immediate',
      reason: 'Evening overwhelm. Release before rest.'
    })
  }

  // Pattern 6: Consistent mood tracking + no journaling → Deeper reflection needed
  const moodSignals = recentSignals.filter(s => s.source === 'mood')
  const journalSignals = recentSignals.filter(s => s.source === 'journal')

  if (moodSignals.length >= 3 && journalSignals.length === 0) {
    patterns.push({
      pattern: 'surface-awareness',
      confidence: 0.6,
      suggestedWidget: 'journal',
      suggestedTiming: 'next-session',
      reason: 'You track moods but don\'t write. Go deeper.'
    })
  }

  // Pattern 7: Calm + morning → Intention-setting moment
  const isMorning = hour >= 6 && hour < 10
  const calmRecently = recentSignals.filter(s =>
    s.source === 'mood' && (s.signal === 'calm' || s.signal === 'peaceful') &&
    (now - s.timestamp) < 2 * 60 * 60 * 1000 // Last 2 hours
  ).length > 0

  if (isMorning && calmRecently && !hasIntention) {
    patterns.push({
      pattern: 'morning-clarity',
      confidence: 0.75,
      suggestedWidget: 'intentions',
      suggestedTiming: 'immediate',
      reason: 'Calm morning. Set one intention before it fades.'
    })
  }

  // Pattern 8: Cleanness neglect — no selfcare signals for extended period
  const selfCareRecent = recentSignals.filter(s => s.source === 'selfcare')
  const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000
  const selfCareLongTerm = signals.filter(s =>
    s.source === 'selfcare' && s.timestamp > threeDaysAgo
  )

  if (selfCareLongTerm.length === 0 && signals.length >= 5) {
    patterns.push({
      pattern: 'cleanness-neglect',
      confidence: 0.7,
      suggestedWidget: 'selfcare',
      suggestedTiming: 'soon',
      reason: 'No self-care in days. Start small. One act.'
    })
  }

  // Pattern 9: Morning without cleanness → morning cleanness protocol
  const morningCleanness = recentSignals.filter(s =>
    s.source === 'selfcare' &&
    s.metadata?.action && (
      s.metadata.action.toLowerCase().includes('clean') ||
      s.metadata.action.toLowerCase().includes('wash') ||
      s.metadata.action.toLowerCase().includes('tidy') ||
      s.metadata.action.toLowerCase().includes('surface')
    )
  )

  if (isMorning && morningCleanness.length === 0 && selfCareRecent.length === 0) {
    patterns.push({
      pattern: 'morning-cleanness-gap',
      confidence: 0.65,
      suggestedWidget: 'selfcare',
      suggestedTiming: 'soon',
      reason: 'Morning without cleanness. The first act anchors the day.'
    })
  }

  // Pattern 10: Post-overwhelm cleanness opportunity
  // When overwhelm is subsiding, cleanness can be therapeutic
  const recentOverwhelm = recentSignals.filter(s =>
    s.source === 'mood' && s.signal === 'overwhelmed' &&
    (now - s.timestamp) > 1 * 60 * 60 * 1000 && // More than 1 hour ago
    (now - s.timestamp) < 4 * 60 * 60 * 1000    // Less than 4 hours ago
  )
  const currentCalm = recentSignals.filter(s =>
    s.source === 'mood' &&
    (s.signal === 'calm' || s.signal === 'content' || s.signal === 'peaceful') &&
    (now - s.timestamp) < 1 * 60 * 60 * 1000
  )

  if (recentOverwhelm.length > 0 && currentCalm.length > 0) {
    patterns.push({
      pattern: 'post-overwhelm-cleanness',
      confidence: 0.8,
      suggestedWidget: 'selfcare',
      suggestedTiming: 'immediate',
      reason: 'Overwhelm passing. Clean one thing. Rebuild order from here.'
    })
  }

  // Calculate overall user state
  const userState = calculateUserState(signals, now)

  // Compute accumulative user index from all widget signals
  const userIndex = computeUserIndex(signals)

  // Persist user index to localStorage
  try {
    localStorage.setItem('user-index', JSON.stringify(userIndex))
  } catch (e) {
    console.warn('Failed to persist user index:', e)
  }

  // Update state (preserve lastSyncedTimestamp from current state)
  const currentState = intentionEngine.get()
  intentionEngine.set({
    signals,
    userState,
    userIndex,
    recognizedPatterns: patterns,
    lastAnalysis: now,
    lastSyncedTimestamp: currentState.lastSyncedTimestamp
  })

  return patterns
}

/**
 * Calculate holistic user state from signals
 */
function calculateUserState(signals: IntentionSignal[], now: number): UserState {
  const recentSignals = signals.filter(s => now - s.timestamp < 24 * 60 * 60 * 1000)

  // Analyze energy from mood signals
  const moodSignals = recentSignals.filter(s => s.source === 'mood')
  const energyMap: Record<string, number> = {
    'energized': 2, 'hopeful': 1, 'excited': 2, 'calm': 0,
    'tired': -2, 'exhausted': -3, 'overwhelmed': -1, 'anxious': -1
  }

  let energyScore = 0
  moodSignals.forEach(s => {
    energyScore += energyMap[s.signal] || 0
  })

  const energy =
    energyScore >= 3 ? 'high' :
    energyScore >= 1 ? 'moderate' :
    energyScore >= -1 ? 'low' :
    energyScore < -1 ? 'depleted' : 'unknown'

  // Analyze clarity from planning and intention signals
  const planningSignals = recentSignals.filter(s => s.source === 'planner')
  const intentionSignals = recentSignals.filter(s => s.source === 'intentions')
  const hasIntention = hasCurrentIntention()

  const clarity =
    planningSignals.length >= 2 && hasIntention ? 'focused' :
    planningSignals.length >= 1 || hasIntention ? 'clear' :
    intentionSignals.length >= 1 ? 'uncertain' :
    planningSignals.length === 0 && !hasIntention ? 'confused' : 'uncertain'

  // Analyze alignment from all signals
  const selfCareSignals = recentSignals.filter(s => s.source === 'selfcare')
  const positiveSignals = recentSignals.filter(s =>
    ['calm', 'peaceful', 'energized', 'hopeful', 'grateful', 'content'].includes(s.signal)
  )

  const alignment =
    positiveSignals.length >= 3 && planningSignals.length >= 1 ? 'flowing' :
    positiveSignals.length >= 2 || (hasIntention && planningSignals.length >= 1) ? 'aligned' :
    selfCareSignals.length >= 1 || intentionSignals.length >= 1 ? 'searching' : 'disconnected'

  // Determine support needs
  const anxiousSignals = recentSignals.filter(s =>
    ['anxious', 'overwhelmed', 'exhausted'].includes(s.signal)
  )

  const needsSupport =
    anxiousSignals.length >= 3 ? 'critical' :
    anxiousSignals.length >= 2 || energy === 'depleted' ? 'moderate' :
    anxiousSignals.length >= 1 ? 'low' : 'none'

  return {
    energy,
    clarity,
    alignment,
    needsSupport,
    lastUpdated: now
  }
}

/**
 * Compute accumulative User Index from all widget signals
 *
 * Each dimension scores 0-100 based on signal frequency, diversity, and recency.
 * The overall index is a weighted average of all dimensions.
 * This gives a single number representing holistic user engagement and wellbeing.
 */
export function computeUserIndex(signals: IntentionSignal[]): UserIndex {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const weekMs = 7 * dayMs

  // Signals from last 7 days and last 24 hours
  const weekSignals = signals.filter(s => now - s.timestamp < weekMs)
  const daySignals = signals.filter(s => now - s.timestamp < dayMs)

  // Helper: compute a dimension score from relevant signals with recency weighting
  function dimensionScore(relevant: IntentionSignal[], maxDaily: number): number {
    if (relevant.length === 0) return 0

    // Count unique active days in the week
    const activeDays = new Set(
      relevant.map(s => new Date(s.timestamp).toDateString())
    ).size

    // Recency bonus: more recent signals count more
    const recencyScore = relevant.reduce((sum, s) => {
      const age = (now - s.timestamp) / dayMs
      return sum + Math.max(0, 1 - age / 7) // 1.0 for today, 0 for 7 days ago
    }, 0)

    // Daily frequency normalized (cap at maxDaily per day)
    const todayCount = daySignals.filter(s => relevant.includes(s)).length
    const frequencyScore = Math.min(todayCount / maxDaily, 1)

    // Combine: consistency (days active) + recency + frequency
    const consistencyScore = activeDays / 7 // 0-1
    const normalizedRecency = Math.min(recencyScore / (relevant.length || 1), 1)

    return Math.round(
      Math.min(100, (consistencyScore * 40 + normalizedRecency * 30 + frequencyScore * 30))
    )
  }

  // --- Engagement: breadth of widget sources used ---
  const uniqueSources = new Set(weekSignals.map(s => s.source))
  const sourceCount = uniqueSources.size
  const totalSourceTypes = 10 // mood, memory, planner, intentions, selfcare, journal, calculator, log, energy, cohort
  const engagement = Math.round(
    Math.min(100,
      (sourceCount / totalSourceTypes) * 50 +
      Math.min(weekSignals.length / 30, 1) * 30 +
      Math.min(daySignals.length / 5, 1) * 20
    )
  )

  // --- Emotional: mood tracking quality ---
  const moodSignals = weekSignals.filter(s => s.source === 'mood')
  const positiveMoods = moodSignals.filter(s =>
    ['calm', 'peaceful', 'energized', 'hopeful', 'grateful', 'content', 'excited', 'fulfilled'].includes(s.signal)
  )
  const moodBase = dimensionScore(moodSignals, 3)
  const positiveRatio = moodSignals.length > 0 ? positiveMoods.length / moodSignals.length : 0.5
  const emotional = Math.round(moodBase * 0.6 + positiveRatio * 100 * 0.4)

  // --- Intentional: planning + intentions + direction ---
  const planSignals = weekSignals.filter(s => s.source === 'planner')
  const intentionSignals = weekSignals.filter(s => s.source === 'intentions')
  const intentionalSignals = [...planSignals, ...intentionSignals]
  const hasActiveIntention = hasCurrentIntention()
  const intentionalBase = dimensionScore(intentionalSignals, 2)
  const intentional = Math.round(
    Math.min(100, intentionalBase + (hasActiveIntention ? 20 : 0))
  )

  // --- Social: community interactions (cohort views, chat, messages) ---
  const socialSignals = weekSignals.filter(s =>
    s.signal.includes('cohort') ||
    s.signal.includes('chat') ||
    s.signal.includes('message') ||
    s.signal.includes('connection') ||
    s.signal.includes('community')
  )
  const social = dimensionScore(socialSignals, 3)

  // --- Self-care: cleanness + rest + care practices ---
  const selfCareSignals = weekSignals.filter(s => s.source === 'selfcare')
  const selfCare = dimensionScore(selfCareSignals, 3)

  // --- Cognitive: memory + journal + reflection depth ---
  const memorySignals = weekSignals.filter(s => s.source === 'memory')
  const journalSignals = weekSignals.filter(s => s.source === 'journal')
  const cognitiveSignals = [...memorySignals, ...journalSignals]
  const cognitive = dimensionScore(cognitiveSignals, 3)

  // --- Overall: weighted average of all dimensions ---
  const overall = Math.round(
    engagement * 0.15 +
    emotional * 0.25 +
    intentional * 0.20 +
    social * 0.10 +
    selfCare * 0.15 +
    cognitive * 0.15
  )

  // --- Trend: compare current week to previous stored index ---
  const previousIndex = intentionEngine.get().userIndex
  let trend: UserIndex['trend'] = 'stable'
  if (previousIndex.lastComputed > 0) {
    const delta = overall - previousIndex.overall
    if (delta >= 5) trend = 'rising'
    else if (delta <= -5) trend = 'declining'
  }

  return {
    overall,
    dimensions: { engagement, emotional, intentional, social, selfCare, cognitive },
    trend,
    lastComputed: now
  }
}

/**
 * Get the current User Index
 */
export function getUserIndex(): UserIndex {
  return intentionEngine.get().userIndex
}

/**
 * Get the most relevant widget to show based on deep analysis
 */
export function getOptimalWidget(): { widget: string; reason: string } | null {
  const patterns = analyzeIntentions()

  // Sort by confidence and timing priority
  const timingWeight = {
    'immediate': 3,
    'soon': 2,
    'next-session': 1,
    'passive': 0.5
  }

  const sorted = patterns
    .map(p => ({
      ...p,
      score: p.confidence * timingWeight[p.suggestedTiming]
    }))
    .sort((a, b) => b.score - a.score)

  if (sorted.length > 0 && sorted[0].score > 0.5) {
    return {
      widget: sorted[0].suggestedWidget,
      reason: sorted[0].reason
    }
  }

  return null
}

/**
 * Check if a widget should be shown based on intention analysis
 */
export function shouldShowWidget(widgetName: string): boolean {
  const optimal = getOptimalWidget()
  return optimal?.widget === widgetName
}

/**
 * Get user state for display/debugging
 */
export function getUserState(): UserState {
  return intentionEngine.get().userState
}

/**
 * Sync signals to server for persistence and cross-device continuity
 */
export async function syncToServer(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  const state = intentionEngine.get()
  const now = Date.now()

  // Don't sync too frequently
  if (now - state.lastSyncedTimestamp < SYNC_COOLDOWN) {
    return false
  }

  // Get signals that haven't been synced yet
  const unsyncedSignals = state.signals.filter(
    s => s.timestamp > state.lastSyncedTimestamp
  )

  if (unsyncedSignals.length === 0) {
    return false
  }

  try {
    console.log(`Syncing ${unsyncedSignals.length} Quantum Intent signals to server...`)

    const response = await fetch('/api/quantum-intent/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        signals: unsyncedSignals,
        userState: state.userState,
        userIndex: state.userIndex,
        recognizedPatterns: state.recognizedPatterns
      })
    })

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    // Update last synced timestamp
    intentionEngine.set({
      ...state,
      lastSyncedTimestamp: now
    })

    console.log(`Synced ${result.savedSignals}/${result.totalSignals} signals successfully`)
    return true
  } catch (error: any) {
    console.error('Failed to sync Quantum Intent signals:', error.message)
    return false
  }
}

/**
 * Manually trigger sync (useful for debugging or before logout)
 */
export function forceSyncToServer(): Promise<boolean> {
  const state = intentionEngine.get()
  // Reset lastSyncedTimestamp to allow immediate sync
  intentionEngine.set({
    ...state,
    lastSyncedTimestamp: 0
  })
  return syncToServer()
}

// ─── Physiological Cohort Reporting ────────────────────────────────────────

export type PhysiologicalReport = {
  sessionDate: string
  widgetDependencies: { widget: string; signalCount: number; lastSeen: string | null }[]
  logDependencies: { source: string; signalCount: number }[]
  biofieldStatus: {
    energyLevel: string
    clarity: string
    alignment: string
    supportNeeded: string
  }
  activePatterns: { pattern: string; confidence: number; action: string }[]
  cohortSignals: { archetype: string | null; behavioralCohort: string | null }
  systemHealth: 'nominal' | 'degraded' | 'critical'
  generatedAt: number
}

/**
 * Generate a physiological cohort report from current engine state.
 * Surfaces widget dependency map, log-based signal audit, biofield status,
 * and active pattern detections. Used by SystemProgressWidget self-assembly report.
 */
export function getPhysiologicalReport(): PhysiologicalReport {
  const state = intentionEngine.get()
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const signals = state.signals
  const weekSignals = signals.filter(s => now - s.timestamp < 7 * dayMs)

  // Widget dependency map
  const WIDGET_SOURCES: IntentionSignal['source'][] = [
    'mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'calculator', 'energy', 'cohort'
  ]
  const widgetDependencies = WIDGET_SOURCES.map(source => {
    const relevant = weekSignals.filter(s => s.source === source)
    const last = relevant.length > 0
      ? new Date(Math.max(...relevant.map(s => s.timestamp))).toISOString().slice(0, 10)
      : null
    return { widget: source, signalCount: relevant.length, lastSeen: last }
  }).filter(w => w.signalCount > 0)

  // Log-based signal dependency audit (non-widget sources)
  const LOG_SOURCES: IntentionSignal['source'][] = ['log', 'energy', 'cohort']
  const logDependencies = LOG_SOURCES.map(source => ({
    source,
    signalCount: weekSignals.filter(s => s.source === source).length
  })).filter(l => l.signalCount > 0)

  // Biofield status from userState
  const { energy, clarity, alignment, needsSupport } = state.userState
  const biofieldStatus = {
    energyLevel: energy,
    clarity,
    alignment,
    supportNeeded: needsSupport
  }

  // Active patterns (top 5 by confidence)
  const activePatterns = state.recognizedPatterns
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
    .map(p => ({
      pattern: p.pattern,
      confidence: Math.round(p.confidence * 100),
      action: p.suggestedWidget
    }))

  // Cohort signals from stored cohort metadata
  const cohortSignals = weekSignals.filter(s => s.source === 'cohort')
  const lastCohort = cohortSignals[cohortSignals.length - 1]
  const cohortData = {
    archetype: lastCohort?.metadata?.archetype ?? null,
    behavioralCohort: lastCohort?.metadata?.behavioralCohort ?? null
  }

  // System health determination
  const systemHealth: PhysiologicalReport['systemHealth'] =
    needsSupport === 'critical' || energy === 'depleted' ? 'critical' :
    needsSupport === 'moderate' || energy === 'low' ? 'degraded' :
    'nominal'

  return {
    sessionDate: new Date().toISOString().slice(0, 10),
    widgetDependencies,
    logDependencies,
    biofieldStatus,
    activePatterns,
    cohortSignals: cohortData,
    systemHealth,
    generatedAt: now
  }
}

/**
 * Record a cohort signal when archetype/behavioral cohort is determined
 */
export function recordCohortSignal(archetype: string, behavioralCohort: string) {
  recordSignal('cohort', 'cohort_determined', { archetype, behavioralCohort })
}

/**
 * Record an energy signal from the biofield capacitor
 */
export function recordEnergySignal(
  status: string,
  level: number,
  trajectory: string
) {
  recordSignal('energy', `energy_${status}`, { level, trajectory, hour: new Date().getHours() })
}

/**
 * Record a log-based signal for direct field entry activity
 */
export function recordLogSignal(wordCount: number, hasContext: boolean) {
  recordSignal('log', 'field_entry', { wordCount, hasContext, hour: new Date().getHours() })
}
