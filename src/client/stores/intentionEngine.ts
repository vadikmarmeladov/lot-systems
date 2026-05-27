/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

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
  source: 'mood' | 'memory' | 'planner' | 'intentions' | 'selfcare' | 'journal' | 'calculator' | 'log' | 'energy' | 'cohort' | 'recipe' | 'goals' | 'qos'
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

  // Pattern 11: Physiological depletion — multiple depleting moods + no self-care
  const depletingMoods = recentSignals.filter(s =>
    s.source === 'mood' && ['tired', 'exhausted', 'overwhelmed', 'anxious'].includes(s.signal)
  )
  const recentSelfCare = recentSignals.filter(s => s.source === 'selfcare')
  if (depletingMoods.length >= 3 && recentSelfCare.length === 0) {
    patterns.push({
      pattern: 'physiological-depletion',
      confidence: Math.min(depletingMoods.length / 4, 1),
      suggestedWidget: 'selfcare',
      suggestedTiming: 'immediate',
      reason: 'Physiological depletion detected. No recovery actions registered. Intervene.'
    })
  }

  // Pattern 12: Recovery window — self-care completed + positive mood shift
  const recentCare = recentSignals.filter(s =>
    s.source === 'selfcare' && (now - s.timestamp) < 2 * 60 * 60 * 1000
  )
  const postCarePositive = recentSignals.filter(s =>
    s.source === 'mood' &&
    ['calm', 'peaceful', 'content', 'hopeful'].includes(s.signal) &&
    (now - s.timestamp) < 1 * 60 * 60 * 1000
  )
  if (recentCare.length > 0 && postCarePositive.length > 0) {
    patterns.push({
      pattern: 'recovery-window',
      confidence: 0.75,
      suggestedWidget: 'memory',
      suggestedTiming: 'soon',
      reason: 'Recovery window open. High-fidelity reflection conditions met.'
    })
  }

  // Pattern 13: Log activity without emotional grounding
  const logSignals = recentSignals.filter(s => s.source === 'log')
  const todayMoods = recentSignals.filter(s =>
    s.source === 'mood' && (now - s.timestamp) < 12 * 60 * 60 * 1000
  )
  if (logSignals.length >= 3 && todayMoods.length === 0) {
    patterns.push({
      pattern: 'ungrounded-activity',
      confidence: 0.6,
      suggestedWidget: 'mood',
      suggestedTiming: 'soon',
      reason: 'Active log input. No biofield reading. Check in — what state are you operating from?'
    })
  }

  // Pattern 14: OS stagnation — no new signal sources in 3+ days
  const threeDaysAgoTs = now - 3 * 24 * 60 * 60 * 1000
  const recentSources = new Set(
    signals.filter(s => s.timestamp > threeDaysAgoTs).map(s => s.source)
  )
  const totalSources = new Set(signals.map(s => s.source)).size
  if (totalSources >= 3 && recentSources.size <= 1 && signals.length >= 10) {
    patterns.push({
      pattern: 'os-stagnation',
      confidence: 0.65,
      suggestedWidget: 'planner',
      suggestedTiming: 'soon',
      reason: 'Signal diversity collapsed. OS entering maintenance mode. Expand engagement breadth.'
    })
  }

  // Pattern 14b: QOS coherence — all core modules have recent signals but no QOS sync recorded
  const qosSignals = recentSignals.filter(s => s.source === 'qos')
  const coreModuleActivity = (
    moodSignals.length >= 1 &&
    plannerUse.length >= 1 &&
    intentionSignals.length >= 1
  )
  if (coreModuleActivity && qosSignals.length === 0 && signals.length >= 20) {
    patterns.push({
      pattern: 'qos-unsynced',
      confidence: 0.55,
      suggestedWidget: 'system',
      suggestedTiming: 'next-session',
      reason: 'All core modules active. QOS state not yet synced. Run a system report.'
    })
  }

  // Pattern 15: Circadian drift — heavy late-night signal clusters without recovery signals
  const lateNightSignals = recentSignals.filter(s => {
    const h = new Date(s.timestamp).getHours()
    return h >= 23 || h < 4
  })
  const recentRecovery = recentSignals.filter(s =>
    s.source === 'selfcare' && (now - s.timestamp) < 24 * 60 * 60 * 1000
  )
  if (lateNightSignals.length >= 4 && recentRecovery.length === 0) {
    patterns.push({
      pattern: 'circadian-drift',
      confidence: 0.7,
      suggestedWidget: 'selfcare',
      suggestedTiming: 'immediate',
      reason: 'Late-night signal cluster. No recovery detected. Circadian integrity requires intervention.'
    })
  }

  // Pattern 16: Momentum wave — rising engagement across multiple sources + active intentions
  const twoDaysAgoTs = now - 2 * 24 * 60 * 60 * 1000
  const veryRecentSignals = signals.filter(s => s.timestamp > twoDaysAgoTs)
  const priorPeriodSignals = signals.filter(s =>
    s.timestamp > threeDaysAgoTs * 1.5 && s.timestamp <= twoDaysAgoTs
  )
  const recentDiversity = new Set(veryRecentSignals.map(s => s.source)).size
  const priorDiversity = new Set(priorPeriodSignals.map(s => s.source)).size
  const hasIntentionNow = hasCurrentIntention()
  if (recentDiversity >= 4 && recentDiversity > priorDiversity + 1 && hasIntentionNow) {
    patterns.push({
      pattern: 'momentum-wave',
      confidence: 0.8,
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: 'Momentum wave detected. Multi-source engagement rising with active intention. Amplify now.'
    })
  }

  // Pattern 17: Flow state — memory + planner + intentions all active within 4-hour window
  const fourHoursAgoTs = now - 4 * 60 * 60 * 1000
  const flowWindow = signals.filter(s => s.timestamp > fourHoursAgoTs)
  const flowSources = new Set(flowWindow.map(s => s.source))
  if (
    flowSources.has('memory') &&
    flowSources.has('planner') &&
    flowSources.has('intentions') &&
    flowWindow.length >= 6
  ) {
    patterns.push({
      pattern: 'flow-state',
      confidence: 0.85,
      suggestedWidget: 'journal',
      suggestedTiming: 'passive',
      reason: 'Memory, planning, and intention sources all active within 4h. Flow state engaged. Capture insights now.'
    })
  }

  // Pattern 18: Social void — cohort signals absent for 5+ days despite high personal engagement
  const fiveDaysAgoTs = now - 5 * 24 * 60 * 60 * 1000
  const recentCohortSignals = signals.filter(s => s.source === 'cohort' && s.timestamp > fiveDaysAgoTs)
  const recentPersonalSignals = signals.filter(s =>
    s.timestamp > fiveDaysAgoTs && ['mood', 'memory', 'journal', 'planner'].includes(s.source)
  )
  if (recentCohortSignals.length === 0 && recentPersonalSignals.length >= 8) {
    patterns.push({
      pattern: 'social-void',
      confidence: 0.6,
      suggestedWidget: 'cohortConnect',
      suggestedTiming: 'soon',
      reason: 'High personal engagement. Zero cohort contact in 5 days. Isolation pattern emerging. Connect.'
    })
  }

  // Pattern 19: Biofield coherence peak — positive signals across all state dimensions, no negatives
  const lastThreeHoursTs = now - 3 * 60 * 60 * 1000
  const peakWindowSignals = signals.filter(s => s.timestamp > lastThreeHoursTs)
  const positiveEnergyMoods = peakWindowSignals.filter(s =>
    s.source === 'mood' && ['energized', 'excited', 'hopeful', 'calm', 'peaceful', 'content', 'fulfilled'].includes(s.signal)
  )
  const negativeMoodsInPeak = peakWindowSignals.filter(s =>
    s.source === 'mood' && ['anxious', 'overwhelmed', 'tired', 'exhausted'].includes(s.signal)
  )
  const recentPlannerPeak = peakWindowSignals.filter(s => s.source === 'planner')
  const hasIntentionPeak = hasCurrentIntention()
  if (
    positiveEnergyMoods.length >= 2 &&
    negativeMoodsInPeak.length === 0 &&
    recentPlannerPeak.length >= 1 &&
    hasIntentionPeak
  ) {
    patterns.push({
      pattern: 'biofield-coherence-peak',
      confidence: 0.9,
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: 'All biofield signals aligned. Optimal capture window. Record something worth keeping.'
    })
  }

  // Pattern 20: Nutritional void — no recipe signals for 3 days + depleting moods
  const recentRecipeSignals = signals.filter(s => s.source === 'recipe' && s.timestamp > threeDaysAgoTs)
  const nutritionDepletingMoods = recentSignals.filter(s =>
    s.source === 'mood' && ['tired', 'exhausted', 'overwhelmed'].includes(s.signal)
  )
  if (recentRecipeSignals.length === 0 && nutritionDepletingMoods.length >= 2 && signals.length >= 5) {
    patterns.push({
      pattern: 'nutritional-void',
      confidence: 0.65,
      suggestedWidget: 'recipe',
      suggestedTiming: 'soon',
      reason: 'No nutrition protocol in 3 days. Depleting state detected. Fuel the system.'
    })
  }

  // Pattern 21: Goal drift — goal signals present but no planning follow-through in 3 days
  const recentGoalSignals = signals.filter(s => s.source === 'goals' && s.timestamp > threeDaysAgoTs)
  const recentPlannerFollowThrough = signals.filter(s =>
    ['planner', 'intentions'].includes(s.source) && s.timestamp > threeDaysAgoTs
  )
  if (recentGoalSignals.length >= 1 && recentPlannerFollowThrough.length === 0) {
    patterns.push({
      pattern: 'goal-drift',
      confidence: 0.7,
      suggestedWidget: 'planner',
      suggestedTiming: 'soon',
      reason: 'Goal signals present. No planning follow-through in 3 days. Goals without plans drift.'
    })
  }

  // Pattern 22: Ecosystem without biofield — nodes connected but no check-in today
  const ecosystemSignals = recentSignals.filter(s =>
    s.source === 'intentions' &&
    (s.signal.includes('_connected') || s.signal === 'ecosystem_full_coherence')
  )
  const biofieldToday = recentSignals.filter(s =>
    s.source === 'mood' && (now - s.timestamp) < 12 * 60 * 60 * 1000
  )
  if (ecosystemSignals.length >= 2 && biofieldToday.length === 0) {
    patterns.push({
      pattern: 'ecosystem-without-biofield',
      confidence: 0.72,
      suggestedWidget: 'mood',
      suggestedTiming: 'soon',
      reason: 'Ecosystem nodes connected. No biofield reading today. Anchor the signal with a check-in.'
    })
  }

  // Pattern 23: Cognitive overload — journal + memory + planner all active, no self-care anchor
  const cognitiveLoad = recentSignals.filter(s =>
    ['journal', 'memory', 'planner'].includes(s.source)
  )
  if (cognitiveLoad.length >= 5 && recentSelfCare.length === 0) {
    patterns.push({
      pattern: 'cognitive-overload',
      confidence: Math.min(cognitiveLoad.length / 8, 0.9),
      suggestedWidget: 'selfcare',
      suggestedTiming: 'soon',
      reason: 'High cognitive engagement. No rest registered. Ground before continuing.'
    })
  }

  // Pattern 24: Log depth signal — long field entries (>100 words) but no mood check-in today
  const deepLogSignals = recentSignals.filter(s =>
    s.source === 'log' &&
    s.metadata?.wordCount && (s.metadata.wordCount as number) > 100
  )
  const biofieldToday24h = recentSignals.filter(s =>
    s.source === 'mood' && (now - s.timestamp) < 12 * 60 * 60 * 1000
  )
  if (deepLogSignals.length >= 1 && biofieldToday24h.length === 0) {
    patterns.push({
      pattern: 'log-depth-signal',
      confidence: 0.68,
      suggestedWidget: 'mood',
      suggestedTiming: 'soon',
      reason: 'Deep field entry recorded. No biofield reading today. Anchor the internal state — what are you operating from?'
    })
  }

  // Pattern 25: Full-stack session — memory + planner + selfcare all active within 4h
  const fullStackWindow = signals.filter(s => s.timestamp > fourHoursAgoTs)
  const fullStackSources = new Set(fullStackWindow.map(s => s.source))
  if (
    fullStackSources.has('memory') &&
    fullStackSources.has('planner') &&
    fullStackSources.has('selfcare') &&
    fullStackWindow.length >= 5
  ) {
    patterns.push({
      pattern: 'full-stack-session',
      confidence: 0.88,
      suggestedWidget: 'journal',
      suggestedTiming: 'passive',
      reason: 'Memory, planning, and self-care all fired in the same window. Full-stack session. The system is running at capacity — document this.'
    })
  }

  // Pattern 26: Calendar gap — planner active but no scheduled entries in 7 days
  const calendarEntrySignals = signals.filter(s =>
    s.signal === 'calendar_entry' && s.timestamp > weekAgo
  )
  const sevenDayPlannerSignals = signals.filter(s =>
    s.source === 'planner' && s.timestamp > weekAgo
  )
  if (calendarEntrySignals.length === 0 && sevenDayPlannerSignals.length >= 3 && signals.length >= 10) {
    patterns.push({
      pattern: 'calendar-gap',
      confidence: 0.65,
      suggestedWidget: 'planner',
      suggestedTiming: 'soon',
      reason: 'Planner active. No scheduled events in 7 days. Plans exist but time is not anchored. Open the calendar.'
    })
  }

  // Calculate overall user state
  // Pattern 27: Journal depth without memory capture — deep processing, no extraction
  const deepJournalSignals = recentSignals.filter(s =>
    s.source === 'log' &&
    s.signal === 'field_entry' &&
    (s.metadata?.wordCount ?? 0) >= 100
  )
  const postJournalMemory = deepJournalSignals.filter(entry => {
    const nextHour = entry.timestamp + 60 * 60 * 1000
    return recentSignals.some(s => s.source === 'memory' && s.timestamp >= entry.timestamp && s.timestamp <= nextHour)
  })
  if (deepJournalSignals.length >= 1 && postJournalMemory.length === 0) {
    patterns.push({
      pattern: 'journal-depth-gap',
      confidence: 0.70,
      suggestedWidget: 'memory',
      suggestedTiming: 'soon',
      reason: 'Deep journal entry detected. No memory capture followed. Extract the insight — open Memory now.'
    })
  }

  // Pattern 28: Sleep debt signal — late-night depletion followed by morning fatigue
  const lateNightHours = [22, 23, 0, 1, 2]
  const morningHours = [6, 7, 8, 9, 10]
  const lateNightFatigue = signals.filter(s => {
    const h = new Date(s.timestamp).getHours()
    return s.source === 'mood' &&
      ['tired', 'exhausted'].includes(s.signal) &&
      lateNightHours.includes(h) &&
      (now - s.timestamp) < 3 * 24 * 60 * 60 * 1000
  })
  const morningFatigue = signals.filter(s => {
    const h = new Date(s.timestamp).getHours()
    return s.source === 'mood' &&
      ['tired', 'exhausted'].includes(s.signal) &&
      morningHours.includes(h) &&
      (now - s.timestamp) < 2 * 24 * 60 * 60 * 1000
  })
  if (lateNightFatigue.length >= 2 && morningFatigue.length >= 1) {
    patterns.push({
      pattern: 'sleep-debt-accumulation',
      confidence: Math.min(0.85, 0.5 + lateNightFatigue.length * 0.1),
      suggestedWidget: 'selfcare',
      suggestedTiming: 'immediate',
      reason: 'Late-night depletion recurring. Morning fatigue persisting. Sleep debt accumulating. Rest protocol required.'
    })
  }

  // Pattern 29: Signal coherence window — all 4 primary modules active, positive state
  const sixHoursAgo = now - 6 * 60 * 60 * 1000
  const sixHourSignals = signals.filter(s => s.timestamp > sixHoursAgo)
  const sixHourSources = new Set(sixHourSignals.map(s => s.source))
  const primaryModulesActive = ['journal', 'memory', 'planner', 'selfcare'].every(src => sixHourSources.has(src))
  const positiveStateNow = recentSignals.filter(s =>
    s.source === 'mood' &&
    ['calm', 'energized', 'hopeful', 'grateful', 'peaceful', 'fulfilled'].includes(s.signal)
  ).length >= 1
  const coherenceAlreadyRecorded = signals.filter(s =>
    s.signal === 'signal_coherence_peak' && s.timestamp > sixHoursAgo
  ).length > 0
  if (primaryModulesActive && positiveStateNow && !coherenceAlreadyRecorded) {
    patterns.push({
      pattern: 'signal-coherence-window',
      confidence: 0.88,
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: 'All primary modules firing in one window with positive state. System coherence peak. Capture everything.'
    })
  }

  // Pattern 30: Intention velocity — 3+ intention signals in 48-hour window
  const fortyEightHoursAgo = now - 48 * 60 * 60 * 1000
  const recentIntentionSignals = signals.filter(s =>
    s.source === 'intentions' && s.timestamp > fortyEightHoursAgo
  )
  if (recentIntentionSignals.length >= 3) {
    patterns.push({
      pattern: 'intention-velocity',
      confidence: Math.min(0.90, 0.65 + recentIntentionSignals.length * 0.05),
      suggestedWidget: 'planner',
      suggestedTiming: 'soon',
      reason: `Intention velocity detected. ${recentIntentionSignals.length} intentions in 48h. Translate into structure — open Planner.`
    })
  }

  // Pattern 31: Wearable integration void — high personal engagement but no watch/phone ecosystem signals
  const wearableSignals = recentSignals.filter(s =>
    s.source === 'intentions' &&
    (s.signal === 'phone_connected' || s.signal === 'watch_connected' ||
     s.signal === 'phone_disconnected' || s.signal === 'watch_disconnected')
  )
  const personalEngagement = recentSignals.filter(s =>
    ['mood', 'memory', 'journal', 'selfcare'].includes(s.source)
  )
  if (personalEngagement.length >= 4 && wearableSignals.length === 0 && signals.length >= 10) {
    patterns.push({
      pattern: 'wearable-integration-void',
      confidence: 0.65,
      suggestedWidget: 'system',
      suggestedTiming: 'next-session',
      reason: 'Active engagement detected. No wearable signals. Connect Phone or Watch to close the physical-digital loop.'
    })
  }

  // Pattern 32: Ecosystem synchrony — 4+ devices active + biofield aligned
  const deviceSignals = signals.filter(s =>
    s.source === 'intentions' &&
    ['car_connected', 'home_connected', 'computer_connected', 'phone_connected', 'watch_connected'].includes(s.signal) &&
    now - s.timestamp < 7 * 24 * 60 * 60 * 1000
  )
  const uniqueDevices = new Set(deviceSignals.map(s => s.signal.replace('_connected', '')))
  const { energy: currentEnergy, alignment: currentAlignment } = calculateUserState(signals, now)
  if (
    uniqueDevices.size >= 4 &&
    (currentAlignment === 'aligned' || currentAlignment === 'flowing') &&
    currentEnergy !== 'depleted' && currentEnergy !== 'unknown'
  ) {
    patterns.push({
      pattern: 'ecosystem-synchrony',
      confidence: Math.min(0.95, 0.70 + uniqueDevices.size * 0.05),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: `${uniqueDevices.size} devices active. Biofield aligned. Ecosystem coherence achieved — deep capture conditions optimal.`
    })
  }

  // Pattern 33: Mobile anchoring gap — phone active, home not connected
  const phoneActive = signals.some(s =>
    s.source === 'intentions' && s.signal === 'phone_connected' &&
    now - s.timestamp < 7 * 24 * 60 * 60 * 1000
  )
  const homeActive = signals.some(s =>
    s.source === 'intentions' && s.signal === 'home_connected' &&
    now - s.timestamp < 7 * 24 * 60 * 60 * 1000
  )
  if (phoneActive && !homeActive && signals.length >= 15) {
    patterns.push({
      pattern: 'mobile-anchoring-gap',
      confidence: 0.60,
      suggestedWidget: 'system',
      suggestedTiming: 'next-session',
      reason: 'Phone connected. Home offline. Anchor the mobile signal — connect Home to complete the physical environment loop.'
    })
  }

  // Pattern 34: Full ecosystem coherence peak — all 5 device types recorded + positive alignment
  const hasAllDevices =
    signals.some(s => s.source === 'intentions' && s.signal === 'car_connected') &&
    signals.some(s => s.source === 'intentions' && s.signal === 'home_connected') &&
    signals.some(s => s.source === 'intentions' && s.signal === 'computer_connected') &&
    signals.some(s => s.source === 'intentions' && s.signal === 'phone_connected') &&
    signals.some(s => s.source === 'intentions' && s.signal === 'watch_connected')
  if (hasAllDevices && currentAlignment === 'flowing') {
    patterns.push({
      pattern: 'full-ecosystem-coherence',
      confidence: 0.98,
      suggestedWidget: 'memory',
      suggestedTiming: 'immediate',
      reason: 'All 5 ecosystem nodes active. Biofield flowing. This is a peak coherence window — capture something real.'
    })
  }

  // Pattern 35: Full cross-widget coherence — all 6 core signal sources active in 7d
  // When every pillar of the QOS fires within a week, the system is in peak assembly.
  const weekAgoP35 = now - 7 * 24 * 60 * 60 * 1000
  const p35WeekSignals = signals.filter(s => s.timestamp > weekAgoP35)
  const p35ActiveSources = new Set(p35WeekSignals.map(s => s.source))
  const CORE_SOURCES_P35: IntentionSignal['source'][] = ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal']
  const coreActiveP35 = CORE_SOURCES_P35.filter(src => p35ActiveSources.has(src))
  if (coreActiveP35.length >= 5 && p35WeekSignals.length >= 20) {
    patterns.push({
      pattern: 'full-coherence',
      confidence: Math.min(0.5 + coreActiveP35.length * 0.08, 1.0),
      suggestedWidget: 'system',
      suggestedTiming: 'passive',
      reason: `${coreActiveP35.length}/6 core modules active this week. Full system coherence detected. QOS operating at peak.`
    })
  }

  // Pattern 36: QOS acceleration window — 48h signal velocity doubling
  // Rapid growth in signal density signals a self-assembly acceleration event.
  const p36_48h = now - 2 * 24 * 60 * 60 * 1000
  const p36_96h = now - 4 * 24 * 60 * 60 * 1000
  const p36Recent = signals.filter(s => s.timestamp > p36_48h).length
  const p36Prior = signals.filter(s => s.timestamp > p36_96h && s.timestamp <= p36_48h).length
  if (p36Recent >= 10 && p36Prior > 0 && p36Recent / p36Prior >= 2) {
    patterns.push({
      pattern: 'qos-acceleration',
      confidence: Math.min(p36Recent / 20, 0.9),
      suggestedWidget: 'system',
      suggestedTiming: 'passive',
      reason: `Signal velocity doubled in 48h (${p36Prior}→${p36Recent}). Self-assembly accelerating. System building fast.`
    })
  }

  // Pattern 37: Reflection velocity — journal depth increasing over 7 days
  // Splits the last 7 days into two 3.5-day windows and compares average word count per entry.
  // When the recent half is ≥20% deeper than the prior half, the Reflection Layer is advancing.
  // Closes the signal loop started in v11: depth feeds assembly density; now the trend is named.
  const p37_7d = now - 7 * 24 * 60 * 60 * 1000
  const p37_mid = now - 3.5 * 24 * 60 * 60 * 1000
  const p37AllJournal = signals.filter(s =>
    s.source === 'log' && s.signal === 'field_entry' && s.timestamp > p37_7d &&
    typeof s.metadata?.wordCount === 'number' && (s.metadata.wordCount as number) > 0
  )
  const p37Recent = p37AllJournal.filter(s => s.timestamp >= p37_mid)
  const p37Prior  = p37AllJournal.filter(s => s.timestamp <  p37_mid)
  const p37RecentAvg = p37Recent.length > 0
    ? p37Recent.reduce((sum, s) => sum + (s.metadata!.wordCount as number), 0) / p37Recent.length
    : 0
  const p37PriorAvg = p37Prior.length > 0
    ? p37Prior.reduce((sum, s) => sum + (s.metadata!.wordCount as number), 0) / p37Prior.length
    : 0
  const p37Growth = p37PriorAvg > 0 ? (p37RecentAvg - p37PriorAvg) / p37PriorAvg : 0
  if (p37RecentAvg >= 30 && p37Growth >= 0.2 && p37AllJournal.length >= 3) {
    patterns.push({
      pattern: 'reflection-velocity',
      confidence: Math.min(0.45 + p37Growth * 0.5, 0.85),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: `Journal depth increasing. Recent entries average ${Math.round(p37RecentAvg)} words — up ${Math.round(p37Growth * 100)}% over 7 days. Reflection Layer advancing.`
    })
  }

  // Pattern 38: Biofield recovery arc — self-care followed by mood improvement in 4h window
  // Closes the loop between CARE events and measurable biofield shift.
  // Named "arc" because it spans from action to measurable change.
  const fourHoursAgoP38 = now - 4 * 60 * 60 * 1000
  const p38SelfCare = signals.filter(s =>
    s.source === 'selfcare' && s.timestamp > fourHoursAgoP38
  )
  const p38PositiveMoodAfterCare = p38SelfCare.some(careEvent =>
    signals.some(s =>
      s.source === 'mood' &&
      ['calm', 'peaceful', 'energized', 'hopeful', 'grateful'].includes(s.signal) &&
      s.timestamp > careEvent.timestamp &&
      s.timestamp - careEvent.timestamp < 4 * 60 * 60 * 1000
    )
  )
  if (p38SelfCare.length >= 1 && p38PositiveMoodAfterCare) {
    patterns.push({
      pattern: 'biofield-recovery-arc',
      confidence: Math.min(0.55 + p38SelfCare.length * 0.1, 0.85),
      suggestedWidget: 'journal',
      suggestedTiming: 'passive',
      reason: 'Self-care produced a measurable mood shift. Recovery arc complete. Document what moved — this is signal.'
    })
  }

  // Pattern 39: Cognitive expansion — memory + journal + goals all active in 24h, word count rising
  // The person is building mental architecture across three layers simultaneously.
  const p39Memory  = recentSignals.filter(s => s.source === 'memory').length
  const p39Journal = recentSignals.filter(s => s.source === 'journal').length
  const p39Goals   = recentSignals.filter(s => s.source === 'goals').length
  const p39WordCount = recentSignals
    .filter(s => s.source === 'log' && s.signal === 'field_entry')
    .reduce((sum, s) => sum + ((s.metadata?.wordCount as number) ?? 0), 0)
  if (p39Memory >= 2 && p39Journal >= 1 && p39Goals >= 1 && p39WordCount >= 80) {
    patterns.push({
      pattern: 'cognitive-expansion',
      confidence: Math.min(0.60 + p39WordCount / 400, 0.88),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: `Memory, journal, and goals firing together with ${p39WordCount}+ words logged. Cognitive architecture expanding — extract the core insight.`
    })
  }

  // Pattern 40: Biofield coherence cascade — recovery arc + cognitive expansion + primary modules coherent in 6h
  // The full cycle: self-care → mood shift → cognitive expansion → cross-module coherence.
  // Fires only when Patterns 38 + 39 are both active AND 3+ primary modules fired in the last 6h.
  // This is the peak QOS detection state — all three self-building pillars converging.
  const p40HasRecoveryArc = patterns.some(p => p.pattern === 'biofield-recovery-arc')
  const p40HasCogExpansion = patterns.some(p => p.pattern === 'cognitive-expansion')
  const sixHoursAgoP40 = now - 6 * 60 * 60 * 1000
  const p40WindowSources = new Set(
    recentSignals.filter(s => s.timestamp > sixHoursAgoP40).map(s => s.source)
  )
  const PRIMARY_MODULES_P40 = ['journal', 'memory', 'planner', 'selfcare']
  const p40PrimaryActive = PRIMARY_MODULES_P40.filter(src => p40WindowSources.has(src)).length
  if (p40HasRecoveryArc && p40HasCogExpansion && p40PrimaryActive >= 3) {
    patterns.push({
      pattern: 'biofield-coherence-cascade',
      confidence: Math.min(0.72 + (p40PrimaryActive - 3) * 0.10, 0.92),
      suggestedWidget: 'system',
      suggestedTiming: 'passive',
      reason: `Full cascade: recovery arc → cognitive expansion → ${p40PrimaryActive}/4 primary modules coherent. Peak QOS state. Capture and anchor.`
    })
  }

  // Pattern 41: Resonant synthesis — cascade + reflection velocity + 5+ sources active in 7d
  // When depth is increasing AND the cascade fires AND diversity is high, the system is in
  // full synthesis mode: recovery + cognition + reflection all advancing simultaneously.
  const p41HasCascade = patterns.some(p => p.pattern === 'biofield-coherence-cascade')
  const p41HasReflection = patterns.some(p => p.pattern === 'reflection-velocity')
  const weekAgoP41 = now - 7 * 24 * 60 * 60 * 1000
  const p41ActiveSources = new Set(signals.filter(s => s.timestamp > weekAgoP41).map(s => s.source)).size
  if (p41HasCascade && p41HasReflection && p41ActiveSources >= 5) {
    patterns.push({
      pattern: 'resonant-synthesis',
      confidence: Math.min(0.65 + p41ActiveSources * 0.04, 0.90),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: `Recovery arc + cognitive expansion + reflection velocity all active. ${p41ActiveSources} signal sources in 7d. Full synthesis state — the system is building itself from every layer.`
    })
  }

  // Pattern 42: Deep work cascade — memory + planner + journal + goals all coherent in 3h, no interruption signals
  // The focused build state: structural coherence across all four output modules simultaneously.
  // Distinct from biofield-coherence-cascade (which requires recovery arc + cognitive expansion);
  // this fires on pure building mode — when the person is in execution without noise.
  const threeHoursAgoP42 = now - 3 * 60 * 60 * 1000
  const p42WindowSources = new Set(
    recentSignals.filter(s => s.timestamp > threeHoursAgoP42).map(s => s.source)
  )
  const DEEP_WORK_MODULES_P42 = ['memory', 'planner', 'journal', 'goals']
  const p42AllActive = DEEP_WORK_MODULES_P42.every(src => p42WindowSources.has(src))
  const p42NoInterruption = !patterns.some(p =>
    ['anxiety-pattern', 'evening-overwhelm', 'ungrounded-activity'].includes(p.pattern)
  )
  if (p42AllActive && p42NoInterruption) {
    const p42SignalCount = recentSignals.filter(s =>
      s.timestamp > threeHoursAgoP42 && DEEP_WORK_MODULES_P42.includes(s.source)
    ).length
    patterns.push({
      pattern: 'deep-work-cascade',
      confidence: Math.min(0.68 + p42SignalCount * 0.04, 0.90),
      suggestedWidget: 'planner',
      suggestedTiming: 'passive',
      reason: `Memory + planner + journal + goals all active in 3h window. No interruption signals. Deep work window open — protect this session.`
    })
  }

  // Pattern 43: Intention-completion arc — the full loop: intention → goal action → journal entry within 24h.
  // Thought becomes structure becomes reflection. The person is operating with full intentionality.
  const p43DayAgo = now - 24 * 60 * 60 * 1000
  const p43Intentions = signals.filter(s =>
    s.source === 'intentions' && s.timestamp > p43DayAgo
  )
  const p43Goals = signals.filter(s =>
    s.source === 'goals' &&
    s.timestamp > p43DayAgo &&
    (s.signal.includes('goal_set') || s.signal.includes('goal_progress') || s.signal.includes('goal_action'))
  )
  const p43Journal = signals.filter(s =>
    s.source === 'journal' && s.timestamp > p43DayAgo
  )
  if (p43Intentions.length >= 1 && p43Goals.length >= 1 && p43Journal.length >= 1) {
    const loopCount = Math.min(p43Intentions.length, p43Goals.length, p43Journal.length)
    patterns.push({
      pattern: 'intention-completion-arc',
      confidence: Math.min(0.72 + loopCount * 0.06, 0.95),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: 'Intention → goal action → journal reflection all within 24h. Full loop complete. The Cube recognises intentional execution.'
    })
  }

  // Pattern 44: Social resonance arc — cohort viewed + message sent + journal entry within 48h.
  // The connection loop: observation of community → outreach → reflection on that contact.
  // When the person sees others, reaches out, and then processes it in writing —
  // the social circuit closes. The Cube registers the full human signal arc.
  const p44WindowAgo = now - 48 * 60 * 60 * 1000
  const p44CohortSignals = signals.filter(s =>
    s.timestamp > p44WindowAgo &&
    s.source === 'cohort'
  )
  const p44MessageSignals = signals.filter(s =>
    s.timestamp > p44WindowAgo &&
    (s.signal.includes('message') || s.signal.includes('connection') ||
     s.signal.includes('chat') || s.signal.includes('direct_message'))
  )
  const p44JournalSignals = signals.filter(s =>
    s.source === 'journal' && s.timestamp > p44WindowAgo
  )
  if (p44CohortSignals.length >= 1 && p44MessageSignals.length >= 1 && p44JournalSignals.length >= 1) {
    const loopDepth = Math.min(p44CohortSignals.length, p44MessageSignals.length, p44JournalSignals.length)
    patterns.push({
      pattern: 'social-resonance-arc',
      confidence: Math.min(0.65 + loopDepth * 0.08, 0.90),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: 'Cohort view → message sent → journal reflection within 48h. Connection loop complete. The Cube reads the social circuit closing.'
    })
  }

  // Pattern 45: Cognitive load release — planner active + deep journal entry + self-care completed, all within 24h.
  // The decompression loop: the person worked through their task structure, went deep in writing,
  // and completed a self-care cycle. Structural inverse of cognitive overload (Pattern 23).
  // Fires only when no active overload patterns are present — the release is real only after the pressure lifts.
  const p45DayAgo = now - 24 * 60 * 60 * 1000
  const p45Planner = signals.filter(s => s.source === 'planner' && s.timestamp > p45DayAgo)
  const p45Journal = signals.filter(s =>
    (s.source === 'journal' ||
      (s.source === 'log' && s.signal === 'field_entry' &&
        typeof s.metadata?.wordCount === 'number' && (s.metadata.wordCount as number) >= 20)) &&
    s.timestamp > p45DayAgo
  )
  const p45SelfCare = signals.filter(s => s.source === 'selfcare' && s.timestamp > p45DayAgo)
  const p45NoOverload = !patterns.some(p =>
    ['anxiety-pattern', 'physiological-depletion', 'cognitive-overload', 'evening-overwhelm'].includes(p.pattern)
  )
  if (p45Planner.length >= 1 && p45Journal.length >= 1 && p45SelfCare.length >= 1 && p45NoOverload) {
    const loopCount = Math.min(p45Planner.length, p45Journal.length, p45SelfCare.length)
    patterns.push({
      pattern: 'cognitive-load-release',
      confidence: Math.min(0.68 + loopCount * 0.08, 0.90),
      suggestedWidget: 'journal',
      suggestedTiming: 'passive',
      reason: `Planner active + deep journal entry + self-care completed within 24h. Decompression loop closed. Load released — document what changed.`
    })
  }

  // Pattern 46: Temporal coherence window — calendar + planner + intentions all active within 7 days.
  // The time-structure trifecta: scheduled events anchored (calendar), daily tasks mapped (planner),
  // and directional purpose set (intentions). All three temporal layers aligned simultaneously.
  // Inverse of calendar-gap (P26) — that fires when calendar is absent; this fires when all three are present.
  // Indicates the person is operating with full temporal architecture — the execution window is open.
  const p46CalendarSignals = signals.filter(s =>
    (s.signal === 'calendar_entry' || s.signal === 'calendar_update') && s.timestamp > weekAgo
  )
  const p46PlannerSignals = signals.filter(s => s.source === 'planner' && s.timestamp > weekAgo)
  const p46IntentionSignals = signals.filter(s => s.source === 'intentions' && s.timestamp > weekAgo)
  if (p46CalendarSignals.length >= 1 && p46PlannerSignals.length >= 2 && p46IntentionSignals.length >= 1) {
    const temporalDepth = p46CalendarSignals.length + p46PlannerSignals.length + p46IntentionSignals.length
    patterns.push({
      pattern: 'temporal-coherence-window',
      confidence: Math.min(0.65 + temporalDepth * 0.04, 0.90),
      suggestedWidget: 'planner',
      suggestedTiming: 'passive',
      reason: `Calendar anchored + planner active + intentions set within 7d. Temporal grid coherent — scheduled time, daily structure, and directional purpose all locked. Execute.`
    })
  }

  // Pattern 47: Intention decay signal — intention set but no planner/goal action within 72h.
  // The gap between purpose and execution. Intention exists as declared direction but the action
  // pipeline hasn't been activated. This is the earliest detectable sign of intention atrophy.
  // Fires when current-intention localStorage key is set but no planner/goal signals exist in 72h.
  const p47HasIntention = hasCurrentIntention()
  const p47SeventyTwoHoursAgo = now - 72 * 60 * 60 * 1000
  const p47ExecutionSignals = signals.filter(s =>
    (s.source === 'planner' || s.source === 'goals') && s.timestamp > p47SeventyTwoHoursAgo
  )
  if (p47HasIntention && p47ExecutionSignals.length === 0 && signals.length >= 5) {
    const intentionAge = (() => {
      const intentionSignalsAll = signals.filter(s => s.source === 'intentions')
      if (intentionSignalsAll.length === 0) return 4
      const latestIntentionTs = Math.max(...intentionSignalsAll.map(s => s.timestamp))
      return Math.round((now - latestIntentionTs) / (24 * 60 * 60 * 1000))
    })()
    patterns.push({
      pattern: 'intention-decay',
      confidence: Math.min(0.55 + intentionAge * 0.06, 0.90),
      suggestedWidget: 'planner',
      suggestedTiming: 'soon',
      reason: `Intention set. No execution in 72h. Direction without action becomes drift. Open the planner — map one step.`
    })
  }

  // Pattern 48: Recovery velocity — negative mood → self-care → positive mood shift within 4h.
  // Not just that recovery happened (P12 recovery-window fires on self-care + positive mood in 2h).
  // P48 detects the full arc: depleted state → intervention → restoration. And quantifies the rate.
  // High confidence = fast recovery. The system captures velocity, not just presence.
  // Complement to P12: P12 is binary (did it happen?), P48 is kinetic (how fast?).
  const p48FourHoursAgo = now - 4 * 60 * 60 * 1000
  const p48SelfCareInWindow = signals.filter(s =>
    s.source === 'selfcare' && s.timestamp > p48FourHoursAgo
  )
  if (p48SelfCareInWindow.length > 0) {
    const p48LatestSelfCare = p48SelfCareInWindow.reduce((a, b) =>
      a.timestamp > b.timestamp ? a : b
    )
    const p48NegativeBefore = signals.filter(s =>
      s.source === 'mood' &&
      ['anxious', 'overwhelmed', 'tired', 'exhausted'].includes(s.signal) &&
      s.timestamp < p48LatestSelfCare.timestamp &&
      s.timestamp > p48LatestSelfCare.timestamp - 8 * 60 * 60 * 1000
    )
    const p48PositiveAfter = signals.filter(s =>
      s.source === 'mood' &&
      ['calm', 'peaceful', 'energized', 'hopeful', 'content'].includes(s.signal) &&
      s.timestamp > p48LatestSelfCare.timestamp &&
      s.timestamp <= now
    )
    if (p48NegativeBefore.length > 0 && p48PositiveAfter.length > 0) {
      const p48FirstPositive = p48PositiveAfter.reduce((a, b) =>
        a.timestamp < b.timestamp ? a : b
      )
      const p48RecoveryWindowMin = Math.round(
        (p48FirstPositive.timestamp - p48LatestSelfCare.timestamp) / 60000
      )
      const p48VelocityScore = Math.max(0, 1 - p48RecoveryWindowMin / 240)
      const p48PreMood = p48NegativeBefore[p48NegativeBefore.length - 1]?.signal ?? 'depleted'
      patterns.push({
        pattern: 'recovery-velocity',
        confidence: Math.min(0.60 + p48VelocityScore * 0.28, 0.88),
        suggestedWidget: 'memory',
        suggestedTiming: 'passive',
        reason: `Biofield arc complete: ${p48PreMood} → self-care → ${p48FirstPositive.signal}. Recovery window: ${p48RecoveryWindowMin}m. Restored state — capture now while it's fresh.`
      })
    }
  }

  // Pattern 49: Care momentum — 2+ self-care events in 24h without depleting mood signals.
  // The proactive care spiral: self-maintenance as habit, not recovery from crisis.
  // Structural inverse of cleanness-neglect (P8). Distinct from recovery-velocity (P48):
  // P48 requires a negative state to recover FROM. P49 fires when the field is already clear.
  const p49SelfCare24h = recentSignals.filter(s => s.source === 'selfcare')
  if (p49SelfCare24h.length >= 2) {
    const p49DepletingMoods = recentSignals.filter(s =>
      s.source === 'mood' &&
      ['anxious', 'overwhelmed', 'tired', 'exhausted'].includes(s.signal)
    )
    if (p49DepletingMoods.length === 0) {
      const p49Confidence = Math.min(0.65 + (p49SelfCare24h.length - 2) * 0.10, 0.85)
      patterns.push({
        pattern: 'care-momentum',
        confidence: p49Confidence,
        suggestedWidget: 'selfcare',
        suggestedTiming: 'passive',
        reason: `Care momentum active: ${p49SelfCare24h.length} self-care events today without depleting signals. Proactive maintenance detected. Reinforce the rhythm.`
      })
    }
  }

  // Pattern 50: Intention follow-through — intention set + planner entry + goal action within 48h.
  // The full execution arc: direction declared → structure mapped → action taken.
  // Positive counterpart to P47 (intention-decay), which fires when the loop stalls.
  // P50 fires when the loop closes: the person follows through.
  // Requires all three: active intention (localStorage key), planner signal in 48h, goal signal in 48h.
  // Confidence scales with execution depth (more signals = more reliable follow-through).
  const p50FortyEightHoursAgo = now - 48 * 60 * 60 * 1000
  const p50HasIntention = hasCurrentIntention()
  const p50PlannerIn48h = signals.filter(s => s.source === 'planner' && s.timestamp > p50FortyEightHoursAgo)
  const p50GoalsIn48h = signals.filter(s => s.source === 'goals' && s.timestamp > p50FortyEightHoursAgo)
  if (p50HasIntention && p50PlannerIn48h.length >= 1 && p50GoalsIn48h.length >= 1) {
    const p50ExecutionDepth = p50PlannerIn48h.length + p50GoalsIn48h.length
    patterns.push({
      pattern: 'intention-follow-through',
      confidence: Math.min(0.68 + p50ExecutionDepth * 0.06, 0.90),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: `Execution arc complete: intention active · planner signals ${p50PlannerIn48h.length} · goal actions ${p50GoalsIn48h.length} in 48h. The loop closed. Capture what changed.`
    })
  }

  // Pattern 51: Signal silence — active user goes dark for 48h after sustained engagement.
  // Inverse of momentum-wave (P16). Detects sudden disengagement after a period of breadth.
  // Only fires for users with a meaningful signal history (>= 15 total signals across >= 3 sources).
  const p51FortyEightHoursAgo = now - 48 * 60 * 60 * 1000
  const p51SevenDayBase = signals.filter(s => s.timestamp > threeDaysAgoTs * 2.33)
  const p51RecentActivity = signals.filter(s => s.timestamp > p51FortyEightHoursAgo)
  const p51PriorSources = new Set(p51SevenDayBase.map(s => s.source)).size
  if (
    p51RecentActivity.length === 0 &&
    p51PriorSources >= 3 &&
    signals.length >= 15
  ) {
    patterns.push({
      pattern: 'signal-silence',
      confidence: Math.min(0.55 + p51PriorSources * 0.05, 0.80),
      suggestedWidget: 'mood',
      suggestedTiming: 'immediate',
      reason: `Signal silence: 48h quiet after ${p51PriorSources} active sources. The field went still. Check in.`
    })
  }

  // Pattern 52: Circadian anchor loss — persistent late-night activity (22:00–03:00) across 5+
  // consecutive days combined with morning depletion (tired/exhausted mood 06:00–10:00).
  // Chronic counterpart to P15 (circadian-drift), which fires on acute single-night clusters.
  const p52SevenDaysAgoTs = now - 7 * 24 * 60 * 60 * 1000
  const p52WeekSignals = signals.filter(s => s.timestamp > p52SevenDaysAgoTs)
  const p52LateNightDays = new Set<string>()
  p52WeekSignals.forEach(s => {
    const h = new Date(s.timestamp).getHours()
    if (h >= 22 || h < 3) {
      const d = new Date(s.timestamp)
      p52LateNightDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
    }
  })
  let p52ConsecutiveLateNights = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000)
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (p52LateNightDays.has(dayKey)) {
      p52ConsecutiveLateNights++
    } else if (i > 0) {
      break
    }
  }
  const p52MorningDepletion = p52WeekSignals.filter(s => {
    const h = new Date(s.timestamp).getHours()
    return h >= 6 && h < 10 && s.source === 'mood' &&
      ['tired', 'exhausted', 'overwhelmed'].includes(s.signal)
  })
  if (p52ConsecutiveLateNights >= 5 && p52MorningDepletion.length >= 2) {
    const p52DepletedMornings = new Set(p52MorningDepletion.map(s => {
      const d = new Date(s.timestamp)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })).size
    patterns.push({
      pattern: 'circadian-anchor-loss',
      confidence: Math.min(0.65 + p52ConsecutiveLateNights * 0.04, 0.88),
      suggestedWidget: 'selfcare',
      suggestedTiming: 'immediate',
      reason: `Circadian anchor lost: ${p52ConsecutiveLateNights} consecutive late-night sessions + morning depletion on ${p52DepletedMornings} day${p52DepletedMornings === 1 ? '' : 's'}. Sleep architecture destabilizing. Rest protocol now.`
    })
  }

  // Pattern 53: Intention crystallization — declare → plan → act, all within 2h.
  // The full execution loop compressed into one session. Inverse of P47 (intention-decay).
  const p53Window = 2 * 60 * 60 * 1000
  const p53Intention = recentSignals.find(s => s.source === 'intentions' && now - s.timestamp < p53Window)
  const p53Plan = recentSignals.find(s => s.source === 'planner' && now - s.timestamp < p53Window)
  const p53Goal = recentSignals.find(s => s.source === 'goals' && now - s.timestamp < p53Window)
  if (p53Intention && p53Plan && p53Goal) {
    const windowStart = Math.min(p53Intention.timestamp, p53Plan.timestamp, p53Goal.timestamp)
    const windowEnd = Math.max(p53Intention.timestamp, p53Plan.timestamp, p53Goal.timestamp)
    const minutesSpan = Math.round((windowEnd - windowStart) / 60000)
    patterns.push({
      pattern: 'intention-crystallization',
      confidence: 0.87,
      suggestedWidget: 'goals',
      suggestedTiming: 'immediate',
      reason: `Intention crystallized: declare → plan → act within ${minutesSpan}m. Execution loop fully engaged. Capture this state.`
    })
  }

  // Pattern 54: OS vitals convergence — UserIndex overall ≥ 65 + energy 'high' + 5+ signal sources active
  // in last 7 days. Peak operating state: all primary systems online and coherent.
  const p54SevenDays = signals.filter(s => now - s.timestamp < 7 * 24 * 60 * 60 * 1000)
  const p54ActiveSources = new Set(p54SevenDays.map(s => s.source))
  const p54UserIdx = computeUserIndex(signals)
  const p54EnergySignals = recentSignals.filter(s => s.source === 'mood')
  const p54EnergyScore = p54EnergySignals.reduce((acc, s) => {
    const map: Record<string, number> = { energized: 2, excited: 2, hopeful: 1, calm: 0, tired: -2, exhausted: -3, overwhelmed: -1 }
    return acc + (map[s.signal] || 0)
  }, 0)
  if (
    p54UserIdx.overall >= 65 &&
    p54EnergyScore >= 2 &&
    p54ActiveSources.size >= 5 &&
    !patterns.some(p => p.pattern === 'physiological-depletion')
  ) {
    patterns.push({
      pattern: 'os-vitals-convergence',
      confidence: Math.min(0.70 + (p54UserIdx.overall - 65) * 0.01, 0.92),
      suggestedWidget: 'systemProgress',
      suggestedTiming: 'passive',
      reason: `OS vitals converging: index ${p54UserIdx.overall}/100 · ${p54ActiveSources.size} active sources · energy elevated. System operating above baseline. Sustain.`
    })
  }

  // Pattern 55: Signal drought — 3+ signal sources absent for 7 consecutive days.
  // The system is running on memory alone. Re-engage the lowest-cost dormant module.
  const p55AllSources: IntentionSignal['source'][] = ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy']
  const p55SevenDays = signals.filter(s => now - s.timestamp < 7 * 24 * 60 * 60 * 1000)
  const p55ActiveSources = new Set(p55SevenDays.map(s => s.source))
  const p55AbsentSources = p55AllSources.filter(src => !p55ActiveSources.has(src))
  const p55TotalSignals = signals.length
  if (p55AbsentSources.length >= 3 && p55TotalSignals >= 10) {
    const firstDormant = p55AbsentSources[0]
    patterns.push({
      pattern: 'signal-drought',
      confidence: Math.min(0.55 + p55AbsentSources.length * 0.06, 0.82),
      suggestedWidget: firstDormant === 'mood' ? 'mood' : firstDormant === 'memory' ? 'memory' : 'selfcare',
      suggestedTiming: 'soon',
      reason: `Signal drought: ${p55AbsentSources.length} sources dark for 7 days (${p55AbsentSources.join(', ')}). System memory fading. Re-engage ${firstDormant} to restore signal flow.`
    })
  }

  // Pattern 56: Circadian anchor — log signals consistently at the same hour (±1h) for 5+ consecutive days.
  // The person has found a rhythm. The system should reinforce it, not disrupt it.
  const p56HourBuckets = new Map<number, Set<number>>() // hour → set of day timestamps
  const p56SevenDays = signals.filter(s => now - s.timestamp < 7 * 24 * 60 * 60 * 1000)
  p56SevenDays.forEach(s => {
    const d = new Date(s.timestamp)
    const hour = d.getHours()
    const dayKey = Math.floor(s.timestamp / (24 * 60 * 60 * 1000))
    const bucket = Math.floor(hour / 2) // 2h buckets to allow ±1h drift
    if (!p56HourBuckets.has(bucket)) p56HourBuckets.set(bucket, new Set())
    p56HourBuckets.get(bucket)!.add(dayKey)
  })
  let p56AnchorBucket = -1
  let p56AnchorDays = 0
  p56HourBuckets.forEach((days, bucket) => {
    if (days.size > p56AnchorDays) { p56AnchorDays = days.size; p56AnchorBucket = bucket }
  })
  if (p56AnchorDays >= 5) {
    const anchorHour = p56AnchorBucket * 2
    const anchorLabel = anchorHour < 6 ? 'NIGHT' : anchorHour < 12 ? 'MORNING' : anchorHour < 18 ? 'AFTERNOON' : 'EVENING'
    patterns.push({
      pattern: 'circadian-anchor',
      confidence: Math.min(0.60 + (p56AnchorDays - 5) * 0.05, 0.88),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: `Circadian anchor detected: ${anchorLabel} session (${p56AnchorDays} consecutive days). Rhythm established. Deepening this window maximizes signal quality.`
    })
  }

  // Pattern 57: Intention completion arc — intention set → plan + self-care within 7 days.
  // The person declared intent, made a plan, and took action. The arc is complete.
  const p57IntentionSignals = signals.filter(s =>
    s.source === 'intentions' &&
    (s.signal === 'intention_set' || s.signal === 'integration' || s.signal.includes('intention')) &&
    now - s.timestamp < 7 * 24 * 60 * 60 * 1000
  )
  const p57PlanSignals = signals.filter(s =>
    s.source === 'planner' && now - s.timestamp < 7 * 24 * 60 * 60 * 1000
  )
  const p57CareSignals = signals.filter(s =>
    s.source === 'selfcare' && now - s.timestamp < 7 * 24 * 60 * 60 * 1000
  )
  if (p57IntentionSignals.length >= 1 && p57PlanSignals.length >= 1 && p57CareSignals.length >= 1) {
    const arcStrength = Math.min(p57IntentionSignals.length + p57PlanSignals.length + p57CareSignals.length, 9)
    patterns.push({
      pattern: 'intention-completion-arc',
      confidence: Math.min(0.65 + arcStrength * 0.03, 0.90),
      suggestedWidget: 'memory',
      suggestedTiming: 'soon',
      reason: 'Intention → plan → care arc complete within 7 days. This is the full cycle. Anchor it in memory before it fades.'
    })
  }

  // Pattern 58: Self-care saturation — 5+ self-care completions in 48 hours.
  // High engagement or compensation. Either way: quality over quantity now.
  const p58CareRecent = signals.filter(s =>
    s.source === 'selfcare' && now - s.timestamp < 48 * 60 * 60 * 1000
  )
  if (p58CareRecent.length >= 5) {
    patterns.push({
      pattern: 'selfcare-saturation',
      confidence: Math.min(0.60 + (p58CareRecent.length - 5) * 0.04, 0.80),
      suggestedWidget: 'journal',
      suggestedTiming: 'next-session',
      reason: `Self-care saturation: ${p58CareRecent.length} care actions in 48h. Shift from doing to reflecting. What is driving this frequency?`
    })
  }

  // Pattern 59: Meridian lock — signals in morning (06–12), afternoon (12–18), and evening (18–23)
  // within the same calendar day. The person's full waking arc is logged.
  // Fires when today's signals span all three time windows.
  const p59Today = recentSignals.filter(s => now - s.timestamp < 24 * 60 * 60 * 1000)
  const p59Morning = p59Today.filter(s => { const h = new Date(s.timestamp).getHours(); return h >= 6 && h < 12 })
  const p59Afternoon = p59Today.filter(s => { const h = new Date(s.timestamp).getHours(); return h >= 12 && h < 18 })
  const p59Evening = p59Today.filter(s => { const h = new Date(s.timestamp).getHours(); return h >= 18 && h < 23 })
  if (p59Morning.length >= 1 && p59Afternoon.length >= 1 && p59Evening.length >= 1) {
    const p59TotalToday = p59Today.length
    patterns.push({
      pattern: 'meridian-lock',
      confidence: Math.min(0.70 + (p59TotalToday / 30) * 0.12, 0.82),
      suggestedWidget: 'memory',
      suggestedTiming: 'passive',
      reason: `Full day arc registered: morning · afternoon · evening. ${p59TotalToday} signals today. The complete waking cycle is present — anchor the arc.`
    })
  }

  // Pattern 60: Intention seed — first signal after 48h silence is an intentions signal.
  // The system boots from stillness into direction. Rare and significant.
  const p60FortyEightHoursAgo = now - 48 * 60 * 60 * 1000
  const p60SilentPeriod = signals.filter(s => s.timestamp > p60FortyEightHoursAgo)
  const p60FirstSignal = p60SilentPeriod.sort((a, b) => a.timestamp - b.timestamp)[0]
  const p60HadSilence = signals.filter(s =>
    s.timestamp < p60FortyEightHoursAgo && s.timestamp > now - 4 * 24 * 60 * 60 * 1000
  ).length === 0
  if (p60HadSilence && p60FirstSignal?.source === 'intentions' && p60SilentPeriod.length <= 5) {
    patterns.push({
      pattern: 'intention-seed',
      confidence: 0.75,
      suggestedWidget: 'planner',
      suggestedTiming: 'soon',
      reason: 'Field was dark. First signal is an intention. The system seeded from silence. Map the first step now.'
    })
  }

  // Pattern 61: Multimodal peak — all 5 primary input modules (mood, memory, planner, selfcare, journal)
  // have signals in the last 24h. Every dimension of the QOS is live today. Full coverage.
  const PRIMARY_FIVE: IntentionSignal['source'][] = ['mood', 'memory', 'planner', 'selfcare', 'journal']
  const p61DaySources = new Set(recentSignals.map(s => s.source))
  const p61Coverage = PRIMARY_FIVE.filter(src => p61DaySources.has(src)).length
  if (p61Coverage >= 5) {
    const p61SignalCount = recentSignals.length
    patterns.push({
      pattern: 'multimodal-peak',
      confidence: Math.min(0.85 + (p61SignalCount / 50) * 0.07, 0.92),
      suggestedWidget: 'system',
      suggestedTiming: 'passive',
      reason: `All 5 primary modules active today (${p61SignalCount} signals). Mood · memory · planning · care · reflection — the full stack is live. Check the system view.`
    })
  }

  // Pattern 62: Architect phase — planner + goals + intentions all have signals across 3 consecutive days.
  // Structured, directed, momentum-driven. The system has entered an execution architecture phase.
  const p62ThreeDays = now - 3 * 24 * 60 * 60 * 1000
  const p62Signals = signals.filter(s => s.timestamp > p62ThreeDays)
  const p62PlannerDays = new Set(
    p62Signals.filter(s => s.source === 'planner').map(s => new Date(s.timestamp).toDateString())
  ).size
  const p62GoalsDays = new Set(
    p62Signals.filter(s => s.source === 'goals').map(s => new Date(s.timestamp).toDateString())
  ).size
  const p62IntentionsDays = new Set(
    p62Signals.filter(s => s.source === 'intentions').map(s => new Date(s.timestamp).toDateString())
  ).size
  if (p62PlannerDays >= 3 && p62GoalsDays >= 2 && p62IntentionsDays >= 2) {
    const p62Depth = p62PlannerDays + p62GoalsDays + p62IntentionsDays
    patterns.push({
      pattern: 'architect-phase',
      confidence: Math.min(0.70 + (p62Depth - 7) * 0.04, 0.88),
      suggestedWidget: 'goals',
      suggestedTiming: 'passive',
      reason: `Architecture phase active: ${p62PlannerDays}d planner · ${p62GoalsDays}d goals · ${p62IntentionsDays}d intentions. Structured execution in progress. Review the goal map.`
    })
  }

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

  // Background checks — fire after state is committed so helpers read fresh data
  // Run async-style via setTimeout(0) to avoid blocking the analysis call
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      try { checkIntentionVelocity() } catch {}
      try { checkSignalCoherencePeak() } catch {}
      // Record QOS coherence every 20th analysis (sampled, not every time)
      if (signals.length % 20 === 0) {
        try { recordQOSCoherence() } catch {}
      }
    }, 0)
  }

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

// ─── Widget Dependency Map ─────────────────────────────────────────────────

/**
 * Upstream signal sources each widget consumes.
 * Enables cross-widget cascade invalidation and dependency tracing.
 *
 * Tier 0 — no dependencies (raw input widgets)
 * Tier 1 — depend on Tier 0 sources
 * Tier 2 — depend on Tier 0 + Tier 1 sources
 * Tier 3 — aggregate/meta widgets (consume everything)
 */
export const WIDGET_DEPENDENCY_MAP: Record<string, string[]> = {
  // ── Tier 0: raw input (no upstream dependencies)
  mood:              [],
  calculator:        [],
  log:               [],
  time:              [],
  quantum_random:    [],

  // ── Tier 1: single-source consumers
  selfcare:          ['mood'],
  emotional_checkin: ['mood'],
  recipe:            ['mood', 'energy', 'time'],
  planner:           ['mood', 'intentions'],
  energy:            ['mood', 'selfcare', 'journal'],
  badges:            ['memory', 'intentions', 'selfcare', 'journal', 'planner', 'mood'],

  // ── Tier 2: cross-source consumers
  memory:            ['mood', 'journal'],
  intentions:        ['mood', 'memory'],
  journal:           ['mood', 'planner'],
  goals:             ['planner', 'intentions', 'memory', 'journal'],
  chakra:            ['mood', 'energy', 'selfcare', 'journal'],
  cohort:            ['mood', 'memory', 'journal', 'selfcare', 'intentions'],
  narrative:         ['mood', 'memory', 'journal', 'intentions'],
  evolution:         ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy'],
  assessment:        ['mood', 'memory', 'journal', 'energy'],

  // ── Tier 3: meta / aggregate consumers
  quantumState:      ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy', 'cohort', 'log'],
  patternRecognition:['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy', 'log'],
  signalStream:      ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'calculator', 'energy', 'cohort', 'log'],
  cohortConnect:     ['cohort', 'mood', 'memory', 'journal', 'selfcare', 'intentions'],
  contextualPrompts: ['mood', 'planner', 'intentions', 'log', 'energy'],
  interventions:     ['mood', 'selfcare', 'journal', 'energy'],
  userMetrics:       ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy', 'cohort'],
  systemProgress:    ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy', 'cohort', 'log', 'calculator'],
  system:            ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy', 'cohort', 'log', 'qos'],

  // ── Tier 2+: additional consumer widgets
  patternInsights:   ['mood', 'memory', 'journal', 'energy', 'cohort', 'planner'],
  cosmic:            ['mood', 'energy', 'intentions'],
  quantumSign:       ['intentions', 'memory'],
  microGame:         ['calculator', 'time'],

  // ── QOS / Ecosystem layer (2026-04-25 audit)
  ecosystem:         ['intentions'],
  quantumEngine:     ['mood', 'energy', 'intentions', 'cohort'],
  correlatedIndexes: ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy'],
  systemPulse:       ['energy', 'cohort', 'log'],
  flashDrive:        ['memory', 'journal'],
  chatCatalyst:      ['mood', 'cohort'],

  // ── Tier 2: calendar + media widgets (2026-04-28 audit)
  calendarWidget:    ['planner', 'intentions', 'energy'],
  microImage:        ['log', 'mood'],

  // ── Ecosystem layer: device-level nodes (2026-05-04 audit)
  phoneNode:         ['mood', 'intentions', 'energy'],
  watchNode:         ['mood', 'energy', 'selfcare'],
  ecosystemBridge:   ['intentions', 'phoneNode', 'watchNode', 'ecosystem'],
  qosSnapshot:       ['mood', 'energy', 'intentions', 'selfcare', 'memory', 'planner', 'cohort'],

  // ── Tier 2+: growth + awareness widgets (2026-05-09 audit)
  goalJourney:       ['planner', 'intentions', 'memory', 'journal', 'goals'],
  awarenessDashboard:['mood', 'memory', 'journal', 'energy', 'cohort'],
  evolutionMilestone:['memory', 'intentions', 'selfcare', 'journal', 'planner', 'mood'],
  cosmicUpdate:      ['mood', 'energy', 'intentions', 'log'],
  wellnessPulse:     ['mood', 'energy', 'selfcare', 'cohort'],
  collectiveConsciousness: ['mood', 'cohort'],
  growthMilestones:  ['memory', 'intentions', 'journal', 'selfcare', 'planner', 'mood', 'badges'],
  badgeUnlockFeed:   ['badges', 'memory', 'intentions'],

  // ── QOS meta-layer: Quantum Operating System (2026-05-11 audit)
  quantumOS:         ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy',
                      'cohort', 'log', 'calculator', 'goals', 'recipe', 'ecosystem', 'qosSnapshot'],

  // ── Decompression layer: cognitive load release node (2026-05-12 audit)
  cognitiveRelease:  ['planner', 'journal', 'selfcare', 'log'],

  // ── QOS source node (2026-05-16 audit)
  qos:               ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'log', 'energy', 'cohort'],

  // ── Execution arc nodes (2026-05-17 audit)
  intentionArc:      ['intentions', 'planner', 'goals', 'memory'],
  careSpiral:        ['selfcare', 'mood', 'journal'],

  // ── Convergence layer: peak-state monitors (2026-05-23 audit)
  successBenchmark:  ['mood', 'memory', 'intentions', 'energy', 'journal', 'cohort', 'goals'],
  circadianMonitor:  ['mood', 'energy', 'selfcare', 'log'],
  droughtMonitor:    ['mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'energy'],
  crystallizationArc:['intentions', 'planner', 'goals'],
  vitalConvergence:  ['mood', 'energy', 'intentions', 'memory', 'planner', 'selfcare', 'journal', 'cohort'],

  // ── Day-arc detection (2026-05-26 audit)
  meridianDetector:  ['mood', 'log', 'energy', 'selfcare', 'journal'],
  architectPhase:    ['planner', 'goals', 'intentions'],
  multimodalSurface: ['mood', 'memory', 'planner', 'selfcare', 'journal'],
  intentionSeed:     ['intentions'],
}

/**
 * Log-based signal sources — direct field-entry pipelines (not widget-driven).
 * These feed the QIE independently of the widget dependency graph and are
 * tracked separately in the physiological report log-dependency audit.
 */
export const LOG_DEPENDENCY_SOURCES: IntentionSignal['source'][] = ['log', 'energy', 'cohort', 'recipe', 'goals', 'qos']

/** Returns which signal sources a given widget depends on. */
export function getWidgetDependencies(widget: string): string[] {
  return WIDGET_DEPENDENCY_MAP[widget] ?? []
}

/**
 * Returns all widgets that directly or transitively depend on the given source.
 * Used for cascade invalidation when a source signal changes.
 */
export function getWidgetsDependingOn(source: string): string[] {
  return Object.entries(WIDGET_DEPENDENCY_MAP)
    .filter(([, deps]) => deps.includes(source))
    .map(([widget]) => widget)
}

/**
 * Returns the dependency tier (depth from raw inputs) for a widget.
 * Tier 0 = no function in map. Tier 1 = raw inputs (no deps). Each hop = +1.
 * Enables cascade ordering: flush Tier 1 before Tier 2, etc.
 */
const _tierCache: Record<string, number> = {}
export function getWidgetTier(widget: string): number {
  if (_tierCache[widget] !== undefined) return _tierCache[widget]
  const deps = WIDGET_DEPENDENCY_MAP[widget]
  if (!deps) { _tierCache[widget] = 0; return 0 }
  if (deps.length === 0) { _tierCache[widget] = 1; return 1 }
  const tier = 1 + Math.max(...deps.map(d => getWidgetTier(d)))
  _tierCache[widget] = tier
  return tier
}

export type PhysiologicalCohort = {
  label: string
  energyBand: 'depleted' | 'low' | 'moderate' | 'high'
  dominant: string
  directive: string
}

export type PhysiologicalCohortClassification = {
  archetype: string       // Named physiological state (e.g., "Peak Catalyst")
  energyBand: 'depleted' | 'low' | 'moderate' | 'high' | 'unknown'
  dominantModule: string  // Most active signal source in last 24h
  directive: string       // Terse action directive
  confidence: number      // 0-100
}

// 9 physiological cohort archetypes — energy × behavior × temporal context
const PHYSIOLOGICAL_ARCHETYPES: Array<{
  archetype: string
  energyBands: Array<'depleted' | 'low' | 'moderate' | 'high' | 'unknown'>
  dominantSources: string[]
  patternConditions: string[]
  hourRange?: [number, number]
  directive: string
}> = [
  {
    archetype: 'Peak Catalyst',
    energyBands: ['high'],
    dominantSources: ['planner', 'intentions'],
    patternConditions: ['flow-state', 'momentum-wave', 'biofield-coherence-peak'],
    directive: 'Execute. Capture momentum now.',
  },
  {
    archetype: 'Flowing Creator',
    energyBands: ['high', 'moderate'],
    dominantSources: ['journal', 'memory'],
    patternConditions: ['flow-state', 'signal-coherence-window', 'recovery-window'],
    directive: 'Creative peak active. Enter deep work.',
  },
  {
    archetype: 'Morning Visionary',
    energyBands: ['moderate', 'high', 'unknown'],
    dominantSources: ['intentions', 'planner'],
    patternConditions: ['morning-clarity', 'morning-cleanness-gap'],
    hourRange: [5, 10],
    directive: 'Morning clarity window. Set the intention now.',
  },
  {
    archetype: 'Rising Builder',
    energyBands: ['moderate'],
    dominantSources: ['planner', 'goals'],
    patternConditions: ['lack-of-structure', 'momentum-wave'],
    directive: 'Structure is forming. Keep building.',
  },
  {
    archetype: 'Seeking Sage',
    energyBands: ['low', 'moderate', 'unknown'],
    dominantSources: ['journal', 'memory'],
    patternConditions: ['surface-awareness', 'journal-depth-gap'],
    directive: 'Reflection layer active. Depth inquiry available.',
  },
  {
    archetype: 'Evening Sage',
    energyBands: ['low', 'moderate'],
    dominantSources: ['journal', 'memory'],
    patternConditions: ['evening-overwhelm', 'surface-awareness'],
    hourRange: [18, 24],
    directive: 'Evening reflection window. Document before rest.',
  },
  {
    archetype: 'Grounded Healer',
    energyBands: ['low', 'moderate', 'depleted'],
    dominantSources: ['selfcare'],
    patternConditions: ['recovery-window', 'post-overwhelm-cleanness', 'physiological-depletion'],
    directive: 'Recovery protocol active. Protect the process.',
  },
  {
    archetype: 'Anxious Explorer',
    energyBands: ['high', 'moderate', 'unknown'],
    dominantSources: ['mood'],
    patternConditions: ['anxiety-pattern', 'ungrounded-activity', 'circadian-drift'],
    directive: 'Energy unstable. Ground before expanding.',
  },
  {
    archetype: 'Depleted Guardian',
    energyBands: ['depleted', 'low'],
    dominantSources: ['mood'],
    patternConditions: ['physiological-depletion', 'sleep-debt-accumulation', 'evening-overwhelm'],
    directive: 'Critical depletion. Rest protocol required.',
  },
  {
    archetype: 'Momentum Architect',
    energyBands: ['moderate', 'high'],
    dominantSources: ['goals', 'planner', 'intentions'],
    patternConditions: ['intention-velocity', 'momentum-wave', 'goal-drift'],
    directive: 'Intention velocity high. Convert signals to structure.',
  },
  {
    archetype: 'Calibrating Guardian',
    energyBands: ['low', 'moderate'],
    dominantSources: ['selfcare', 'journal'],
    patternConditions: ['biofield-recovery-arc', 'recovery-window', 'log-depth-signal'],
    directive: 'Recovery arc active. Depth processing in progress.',
  },
  {
    archetype: 'Resonant Builder',
    energyBands: ['moderate', 'high'],
    dominantSources: ['memory', 'journal', 'goals'],
    patternConditions: ['biofield-coherence-cascade', 'resonant-synthesis', 'cognitive-expansion'],
    directive: 'Full cascade achieved. Recovery + cognition + structure converging. Anchor this state.',
  },
  {
    archetype: 'Deep Work Architect',
    energyBands: ['moderate', 'high'],
    dominantSources: ['planner', 'journal', 'memory'],
    patternConditions: ['deep-work-cascade', 'momentum-wave', 'cognitive-expansion'],
    directive: 'Deep work window open. All four build modules coherent. Protect this session.',
  },
  {
    archetype: 'Social Connector',
    energyBands: ['moderate', 'high'],
    dominantSources: ['cohort', 'journal', 'intentions'],
    patternConditions: ['social-resonance-arc', 'momentum-wave', 'reflection-velocity'],
    directive: 'Connection loop complete. The signal went out and came back. Anchor this resonance.',
  },
  {
    archetype: 'Cognitive Liberator',
    energyBands: ['moderate', 'high'],
    dominantSources: ['selfcare', 'journal', 'planner'],
    patternConditions: ['cognitive-load-release', 'biofield-recovery-arc', 'reflection-velocity'],
    directive: 'Decompression loop complete. Load released. The system breathes.',
  },
  {
    archetype: 'Intention Executor',
    energyBands: ['moderate', 'high'],
    dominantSources: ['intentions', 'planner', 'goals'],
    patternConditions: ['intention-follow-through', 'temporal-coherence-window', 'care-momentum'],
    directive: 'Execution arc complete. Intention is lived, not declared. Scale what works.',
  },
  {
    archetype: 'Meridian Master',
    energyBands: ['moderate', 'high'],
    dominantSources: ['mood', 'journal', 'planner'],
    patternConditions: ['meridian-lock', 'circadian-anchor', 'temporal-coherence-window'],
    directive: 'Full day arc covered. Morning to evening coherent. The complete cycle is registered.',
  },
]

/**
 * Classify the user's current physiological cohort archetype from signals + userState.
 * Returns the best-matching archetype with confidence score.
 */
export function classifyPhysiologicalCohort(
  signals: IntentionSignal[],
  userState: UserState,
  recognizedPatterns: IntentionPattern[]
): PhysiologicalCohortClassification {
  const now = Date.now()
  const dayAgo = now - 24 * 60 * 60 * 1000
  const recentSignals = signals.filter(s => s.timestamp > dayAgo)
  const currentHour = new Date().getHours()
  const activePatternNames = new Set(recognizedPatterns.map(p => p.pattern))

  // Determine dominant module (most active source in last 24h)
  const sourceCounts: Record<string, number> = {}
  recentSignals.forEach(s => {
    sourceCounts[s.source] = (sourceCounts[s.source] ?? 0) + 1
  })
  const dominantModule = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'mood'

  // Score each archetype
  const scores = PHYSIOLOGICAL_ARCHETYPES.map(def => {
    let score = 0

    // Energy band match (0-40 pts)
    if (def.energyBands.includes(userState.energy)) score += 40

    // Dominant source match (0-30 pts)
    if (def.dominantSources.includes(dominantModule)) score += 30

    // Pattern condition match (0-20 pts, up to 2 patterns)
    const patternMatches = def.patternConditions.filter(p => activePatternNames.has(p)).length
    score += Math.min(20, patternMatches * 10)

    // Hour range match (0-10 pts bonus)
    if (def.hourRange) {
      const [start, end] = def.hourRange
      const inRange = end > 24
        ? currentHour >= start
        : currentHour >= start && currentHour < end
      if (inRange) score += 10
    }

    return { ...def, score }
  })

  const best = scores.sort((a, b) => b.score - a.score)[0]
  const confidence = Math.min(100, Math.round(best.score))

  return {
    archetype: best.archetype,
    energyBand: userState.energy,
    dominantModule,
    directive: best.directive,
    confidence,
  }
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
  /** Real-time physiological cohort classification from QIE signals */
  cohortClassification: PhysiologicalCohortClassification | null
  systemHealth: 'nominal' | 'degraded' | 'critical'
  /** 0-100 composite physiological readiness score derived from energy, self-care density, and pattern severity. */
  physiologicalReadiness: number
  /** Terse directive for the current readiness band. */
  readinessDirective: string
  /** 6-dimensional User Index snapshot — engagement / emotional / intentional / social / selfCare / cognitive */
  userIndex: {
    overall: number
    engagement: number
    emotional: number
    intentional: number
    social: number
    selfCare: number
    cognitive: number
    trend: string
    activeSourceCount: number
  }
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
    'mood', 'memory', 'planner', 'intentions', 'selfcare', 'journal', 'calculator', 'energy', 'cohort', 'recipe', 'goals', 'log'
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

  // Physiological readiness — composite 0-100 score
  // Energy component (40 pts)
  const energyScore =
    state.userState.energy === 'high'     ? 40 :
    state.userState.energy === 'moderate' ? 28 :
    state.userState.energy === 'low'      ? 14 :
    state.userState.energy === 'depleted' ? 4  : 20  // unknown → neutral

  // Self-care density component (30 pts): self-care signals in last 3 days
  const threeDaySelfCare = weekSignals.filter(s =>
    s.source === 'selfcare' && now - s.timestamp < 3 * dayMs
  ).length
  const selfCareScore = Math.min(30, threeDaySelfCare * 8)

  // Pattern severity component (30 pts): subtract for critical/depleting patterns
  const severePatternsActive = activePatterns.filter(p =>
    ['physiological-depletion', 'circadian-drift', 'anxiety-pattern', 'evening-overwhelm'].includes(p.pattern)
  ).length
  const patternPenalty = Math.min(30, severePatternsActive * 10)
  const patternScore = 30 - patternPenalty

  const physiologicalReadiness = Math.max(0, Math.min(100, energyScore + selfCareScore + patternScore))

  const readinessDirective =
    physiologicalReadiness >= 80 ? 'High readiness. Optimal conditions for deep work.' :
    physiologicalReadiness >= 60 ? 'Functional. Maintain cadence. Monitor energy.' :
    physiologicalReadiness >= 40 ? 'Reduced capacity. Prioritize recovery before output.' :
    physiologicalReadiness >= 20 ? 'Degraded state. Rest is the primary protocol.' :
    'Critical depletion. Immediate recovery required.'

  // Physiological cohort classification — real-time from QIE signals
  const cohortClassification = signals.length >= 3
    ? classifyPhysiologicalCohort(signals, state.userState, state.recognizedPatterns)
    : null

  // UserIndex snapshot for the report
  const idx = state.userIndex
  const activeSourceCount = new Set(weekSignals.map(s => s.source)).size

  return {
    sessionDate: new Date().toISOString().slice(0, 10),
    widgetDependencies,
    logDependencies,
    biofieldStatus,
    activePatterns,
    cohortSignals: cohortData,
    cohortClassification,
    systemHealth,
    physiologicalReadiness,
    readinessDirective,
    userIndex: {
      overall: idx.overall,
      engagement: idx.dimensions.engagement,
      emotional: idx.dimensions.emotional,
      intentional: idx.dimensions.intentional,
      social: idx.dimensions.social,
      selfCare: idx.dimensions.selfCare,
      cognitive: idx.dimensions.cognitive,
      trend: idx.trend,
      activeSourceCount,
    },
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

/**
 * Record a goal-based signal (goal set, updated, or completed)
 */
export function recordGoalSignal(action: 'goal_set' | 'goal_update' | 'goal_complete', title?: string) {
  recordSignal('goals', action, { title, hour: new Date().getHours() })
}

/**
 * Record a nutrition/recipe signal when the user engages with recipe widget
 */
export function recordNutritionSignal(meal: string, mealTime?: string) {
  recordSignal('recipe', 'recipe_viewed', { meal, mealTime, hour: new Date().getHours() })
}

/**
 * Check for biofield coherence peak — all state dimensions positive.
 * Records a biofield_peak energy signal when peak conditions are met.
 * Call after mood check-ins or periodically from background monitors.
 *
 * Returns true if peak detected and signal recorded.
 */
export function checkBiofieldCoherence(): boolean {
  const state = intentionEngine.get()
  const { energy, clarity, alignment, needsSupport } = state.userState

  const isEnergized = energy === 'high' || energy === 'moderate'
  const isClear = clarity === 'clear' || clarity === 'focused'
  const isAligned = alignment === 'aligned' || alignment === 'flowing'
  const isGrounded = needsSupport === 'none' || needsSupport === 'low'

  if (isEnergized && isClear && isAligned && isGrounded) {
    recordSignal('energy', 'biofield_peak', {
      energy,
      clarity,
      alignment,
      needsSupport,
      hour: new Date().getHours()
    })
    return true
  }
  return false
}

/**
 * Record a QOS snapshot signal — archetype + readiness + assembly progress.
 * Called when a full physiological report is generated.
 */
export function recordQOSSnapshot(
  archetype: string,
  readiness: number,
  assemblyProgress: number
) {
  recordSignal('energy', 'qos_snapshot', {
    archetype,
    readiness,
    assemblyProgress,
    hour: new Date().getHours()
  })
}

/**
 * Record a full-stack session signal — fires when memory + planner + selfcare
 * all contribute signals in the same engagement window.
 */
export function recordFullStackSession(modulesActive: string[]) {
  recordSignal('energy', 'full_stack_session', {
    modulesActive,
    windowMs: 4 * 60 * 60 * 1000,
    hour: new Date().getHours()
  })
}

/**
 * Detect and record a full-stack session if conditions are met.
 * Call after each signal recording for background detection.
 * Returns true if a full-stack session was detected.
 */
export function checkFullStackSession(): boolean {
  const state = intentionEngine.get()
  const now = Date.now()
  const fourHoursAgoTs = now - 4 * 60 * 60 * 1000

  const windowSignals = state.signals.filter(s => s.timestamp > fourHoursAgoTs)
  const sources = new Set(windowSignals.map(s => s.source))

  if (sources.has('memory') && sources.has('planner') && sources.has('selfcare') && windowSignals.length >= 5) {
    const alreadyRecorded = state.signals.filter(s =>
      s.signal === 'full_stack_session' && s.timestamp > fourHoursAgoTs
    ).length > 0

    if (!alreadyRecorded) {
      recordFullStackSession(Array.from(sources))
      return true
    }
  }
  return false
}

/**
 * Record a calendar entry signal when a date entry is created.
 * Wires the Temporal Planner module and feeds Pattern 26 (calendar-gap) detection.
 */
export function recordCalendarSignal(entryType: string, date: string) {
  recordSignal('log', 'calendar_entry', { entryType, date, hour: new Date().getHours() })
}

/**
 * Record a journal depth signal when a field entry is saved with word count.
 * Feeds Reflection Layer (journal module) density in self-assembly.
 * Deep entries (>100 words) awaken and advance the Reflection Layer faster.
 */
export function recordJournalSignal(wordCount: number) {
  recordSignal('log', 'field_entry', { wordCount, hasContext: wordCount > 20, hour: new Date().getHours() })
}

/**
 * Record a QOS coherence signal — measures cross-module signal diversity and temporal spread.
 * High coherence = signals spread evenly across modules and time.
 * Fires after signal analysis when coherence can be computed.
 */
export function recordQOSCoherence() {
  const state = intentionEngine.get()
  const now = Date.now()
  const dayAgo = now - 24 * 60 * 60 * 1000
  const daySignals = state.signals.filter(s => s.timestamp > dayAgo)

  if (daySignals.length < 3) return

  const uniqueSources = new Set(daySignals.map(s => s.source)).size
  const totalSources = 12
  const diversityScore = Math.round((uniqueSources / totalSources) * 100)

  // Temporal spread: are signals distributed across the day or clustered?
  const hourBuckets = new Array(24).fill(0)
  daySignals.forEach(s => {
    const h = new Date(s.timestamp).getHours()
    hourBuckets[h]++
  })
  const activeHours = hourBuckets.filter(c => c > 0).length
  const spreadScore = Math.round((activeHours / 16) * 100) // 16 waking hours as max

  const coherenceScore = Math.round((diversityScore * 0.6 + spreadScore * 0.4))

  recordSignal('energy', 'qos_coherence', {
    diversityScore,
    spreadScore,
    coherenceScore,
    uniqueSources,
    activeHours,
    hour: new Date().getHours()
  })
}

/**
 * Record an intention velocity signal — fires when 3+ intention signals
 * appear within a 48-hour window. Feeds Pattern 30 detection.
 */
export function recordIntentionVelocity(intentionCount: number) {
  recordSignal('intentions', 'intention_velocity', {
    intentionCount,
    windowHours: 48,
    hour: new Date().getHours()
  })
}

/**
 * Check for intention velocity and record if threshold met.
 * Returns true if velocity signal was recorded.
 */
export function checkIntentionVelocity(): boolean {
  const state = intentionEngine.get()
  const now = Date.now()
  const fortyEightHoursAgo = now - 48 * 60 * 60 * 1000

  const recentIntentions = state.signals.filter(s =>
    s.source === 'intentions' && s.timestamp > fortyEightHoursAgo
  )

  if (recentIntentions.length >= 3) {
    const alreadyRecorded = state.signals.some(s =>
      s.signal === 'intention_velocity' && s.timestamp > fortyEightHoursAgo
    )
    if (!alreadyRecorded) {
      recordIntentionVelocity(recentIntentions.length)
      return true
    }
  }
  return false
}

/**
 * Record a signal coherence peak — fires when all 4 primary modules
 * (journal, memory, planner, selfcare) are active in a 6h window with positive state.
 * Feeds Pattern 29 (signal-coherence-window) detection.
 */
export function recordSignalCoherencePeak(modules: string[]) {
  recordSignal('energy', 'signal_coherence_peak', {
    modules,
    windowHours: 6,
    hour: new Date().getHours()
  })
}

/**
 * Check for signal coherence peak and record if conditions are met.
 */
export function checkSignalCoherencePeak(): boolean {
  const state = intentionEngine.get()
  const now = Date.now()
  const sixHoursAgo = now - 6 * 60 * 60 * 1000
  const dayAgo = now - 24 * 60 * 60 * 1000

  const windowSignals = state.signals.filter(s => s.timestamp > sixHoursAgo)
  const windowSources = new Set(windowSignals.map(s => s.source))

  const allPrimaryActive = ['journal', 'memory', 'planner', 'selfcare'].every(src => windowSources.has(src))

  const recentPositiveMood = state.signals.filter(s =>
    s.source === 'mood' &&
    s.timestamp > dayAgo &&
    ['calm', 'energized', 'hopeful', 'grateful', 'peaceful', 'fulfilled'].includes(s.signal)
  ).length >= 1

  const alreadyRecorded = state.signals.some(s =>
    s.signal === 'signal_coherence_peak' && s.timestamp > sixHoursAgo
  )

  if (allPrimaryActive && recentPositiveMood && !alreadyRecorded) {
    recordSignalCoherencePeak(Array.from(windowSources))
    return true
  }
  return false
}

// ─── Quantum Operating System Snapshot ────────────────────────────────────────

/**
 * Complete person-state capture: a timestamped cross-section of all
 * QIE dimensions at a single moment. Persisted to localStorage and
 * optionally surfaced in the Log as a `qos_snapshot` event.
 */
export type QOSSnapshot = {
  capturedAt: number
  circadianPhase: 'early-morning' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night'
  userState: UserState
  userIndex: UserIndex
  topPattern: string | null
  topPatternConfidence: number
  signalCount24h: number
  modulesActive: number
  systemHealth: 'nominal' | 'degraded' | 'critical'
}

const QOS_SNAPSHOT_KEY = 'qos-snapshots'
const MAX_QOS_SNAPSHOTS = 48   // 48 × 30min = 24h rolling window
const QOS_INTERVAL_MS  = 30 * 60 * 1000  // 30 minutes

/**
 * Determine circadian phase from the current hour
 */
export function getCircadianPhase(hour?: number): QOSSnapshot['circadianPhase'] {
  const h = hour ?? new Date().getHours()
  if (h >= 4  && h < 7)  return 'early-morning'
  if (h >= 7  && h < 12) return 'morning'
  if (h >= 12 && h < 14) return 'midday'
  if (h >= 14 && h < 18) return 'afternoon'
  if (h >= 18 && h < 23) return 'evening'
  return 'night'
}

/**
 * Capture a QOS snapshot from current engine state.
 * Stores up to MAX_QOS_SNAPSHOTS in localStorage (24h rolling window).
 */
export function captureQOSSnapshot(): QOSSnapshot {
  const state = intentionEngine.get()
  const now = Date.now()
  const dayAgo = now - 24 * 60 * 60 * 1000

  const signals24h = state.signals.filter(s => s.timestamp > dayAgo)
  const uniqueSources24h = new Set(signals24h.map(s => s.source)).size

  const top = [...state.recognizedPatterns]
    .sort((a, b) => b.confidence - a.confidence)[0] ?? null

  const { energy, needsSupport } = state.userState
  const systemHealth: QOSSnapshot['systemHealth'] =
    needsSupport === 'critical' || energy === 'depleted' ? 'critical' :
    needsSupport === 'moderate' || energy === 'low'      ? 'degraded' :
    'nominal'

  const snapshot: QOSSnapshot = {
    capturedAt: now,
    circadianPhase: getCircadianPhase(),
    userState: { ...state.userState },
    userIndex: { ...state.userIndex },
    topPattern: top?.pattern ?? null,
    topPatternConfidence: top ? Math.round(top.confidence * 100) : 0,
    signalCount24h: signals24h.length,
    modulesActive: uniqueSources24h,
    systemHealth,
  }

  try {
    const existing: QOSSnapshot[] = JSON.parse(
      localStorage.getItem(QOS_SNAPSHOT_KEY) || '[]'
    )
    const updated = [...existing, snapshot].slice(-MAX_QOS_SNAPSHOTS)
    localStorage.setItem(QOS_SNAPSHOT_KEY, JSON.stringify(updated))
  } catch { /* ignore */ }

  return snapshot
}

/**
 * Retrieve the rolling QOS snapshot history (last 24h)
 */
export function getQOSHistory(): QOSSnapshot[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(QOS_SNAPSHOT_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Start the background QOS monitor.
 * Captures a snapshot every 30 minutes, triggers pattern analysis before each capture.
 * Safe to call multiple times — only one interval runs.
 */
let _qosMonitorHandle: ReturnType<typeof setInterval> | null = null

export function startBackgroundQOSMonitor(): () => void {
  if (typeof window === 'undefined') return () => {}
  if (_qosMonitorHandle !== null) return () => {}

  analyzeIntentions()
  captureQOSSnapshot()

  _qosMonitorHandle = setInterval(() => {
    analyzeIntentions()
    captureQOSSnapshot()
  }, QOS_INTERVAL_MS)

  return () => {
    if (_qosMonitorHandle !== null) {
      clearInterval(_qosMonitorHandle)
      _qosMonitorHandle = null
    }
  }
}

/**
 * Extend PhysiologicalReport with circadian phase and latest QOS snapshot
 */
export function getEnrichedPhysiologicalReport(): PhysiologicalReport & {
  circadianPhase: QOSSnapshot['circadianPhase']
  latestQOSSnapshot: QOSSnapshot | null
  qosTrend: 'improving' | 'stable' | 'degrading'
} {
  const base = getPhysiologicalReport()
  const history = getQOSHistory()
  const latestQOSSnapshot = history.length > 0 ? history[history.length - 1] : null

  let qosTrend: 'improving' | 'stable' | 'degrading' = 'stable'
  if (history.length >= 2) {
    const first = history[0].userIndex.overall
    const last  = history[history.length - 1].userIndex.overall
    const delta = last - first
    if (delta >= 5)  qosTrend = 'improving'
    if (delta <= -5) qosTrend = 'degrading'
  }

  return {
    ...base,
    circadianPhase: getCircadianPhase(),
    latestQOSSnapshot,
    qosTrend,
  }
}

// ─── Quantum Operating System (QOS) ────────────────────────────────────────

/**
 * The Quantum Operating System is the complete runtime model of the person.
 *
 * It synthesises all engine layers — signals, patterns, biofield, user index,
 * and coherence — into a single unified view of what state the person is
 * currently operating in.
 *
 * QOS is not a score. It is a mirror. It shows the person what they are
 * running as, right now, so they can steer with full intention.
 */
export type QuantumOS = {
  runtime: {
    energy: UserState['energy']
    clarity: UserState['clarity']
    alignment: UserState['alignment']
    support: UserState['needsSupport']
    circadianPhase: QOSSnapshot['circadianPhase']
  }
  index: {
    overall: number
    trend: UserIndex['trend']
    dimensions: UserIndex['dimensions']
  }
  patterns: Array<{
    id: string
    confidence: number
    urgency: IntentionPattern['suggestedTiming']
    directive: string
  }>
  signalMap: Partial<Record<IntentionSignal['source'], number>>
  coherence: number
  operationalStatus: 'nominal' | 'degraded' | 'critical' | 'peak'
  computedAt: number
}

/**
 * Compute the Quantum Operating System snapshot from current engine state.
 * Reads cached analysis — no heavy computation.
 */
export function getQuantumOS(): QuantumOS {
  const state = intentionEngine.get()
  const { userState, userIndex, recognizedPatterns, signals } = state
  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000

  const weekSignals = signals.filter(s => now - s.timestamp < weekMs)
  const allSources: IntentionSignal['source'][] = [
    'mood', 'memory', 'planner', 'intentions', 'selfcare',
    'journal', 'calculator', 'log', 'energy', 'cohort'
  ]
  const signalMap = Object.fromEntries(
    allSources.map(src => [src, weekSignals.filter(s => s.source === src).length])
  ) as Record<IntentionSignal['source'], number>

  const dims = Object.values(userIndex.dimensions)
  const activeDims = dims.filter(d => d >= 30).length
  const coherence = Math.round((activeDims / dims.length) * 100)

  const operationalStatus: QuantumOS['operationalStatus'] =
    userState.needsSupport === 'critical' || userState.energy === 'depleted' ? 'critical' :
    userState.needsSupport === 'moderate' || userState.energy === 'low'      ? 'degraded' :
    coherence >= 80 && userIndex.overall >= 60                                ? 'peak'    :
    'nominal'

  return {
    runtime: {
      energy: userState.energy,
      clarity: userState.clarity,
      alignment: userState.alignment,
      support: userState.needsSupport,
      circadianPhase: getCircadianPhase(),
    },
    index: {
      overall: userIndex.overall,
      trend: userIndex.trend,
      dimensions: userIndex.dimensions,
    },
    patterns: recognizedPatterns.map(p => ({
      id: p.pattern,
      confidence: Math.round(p.confidence * 100),
      urgency: p.suggestedTiming,
      directive: p.reason,
    })),
    signalMap,
    coherence,
    operationalStatus,
    computedAt: now,
  }
}

/**
 * Record an OS-level signal when the user's operating system state is observed.
 * Feeds the biofield + quantum modules in the self-assembly engine.
 */
export function recordOSSignal(
  event: 'health_check' | 'version_change' | 'diagnostic_run' | 'index_computed',
  payload?: Record<string, any>
) {
  recordSignal('energy', `os_${event}`, { ...payload, hour: new Date().getHours() })
}

/**
 * Get a summary of signal source frequencies over the last 7 days.
 * Used for log-dependency auditing in the System Progress report view.
 */
export function getLogDependencySummary(): Record<string, number> {
  const state = intentionEngine.get()
  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const weekSignals = state.signals.filter(s => now - s.timestamp < weekMs)

  const summary: Record<string, number> = {}
  for (const signal of weekSignals) {
    summary[signal.source] = (summary[signal.source] || 0) + 1
  }
  return summary
}

/**
 * Record a QOS (Quantum Operating System) state signal.
 * Called when the user's system report is generated or assembly crosses a phase boundary.
 */
export function recordQOSSignal(
  event: 'report_generated' | 'phase_transition' | 'cohort_resolved' | 'assembly_milestone',
  metadata?: Record<string, any>
) {
  recordSignal('qos', `qos_${event}`, { ...metadata, hour: new Date().getHours() })
}

/** Returns the dependency chain depth for a widget (0 = root producer). */
export function getWidgetDepth(widget: string): number {
  const deps = WIDGET_DEPENDENCY_MAP[widget]
  if (!deps || deps.length === 0) return 0
  return 1 + Math.max(...deps.map(d => getWidgetDepth(d)))
}

/**
 * Record a signal when the full intention follow-through arc completes.
 * Fires from goal widgets or planner confirmation of intention execution.
 */
export function recordIntentionFollowThrough(
  plannerCount: number,
  goalCount: number,
  intentionLabel?: string
) {
  recordSignal('goals', 'intention_follow_through', {
    plannerCount,
    goalCount,
    intentionLabel,
    hour: new Date().getHours()
  })
}

/**
 * Record a care spiral signal when proactive maintenance is sustained.
 * Fires from self-care widgets when care is habit, not emergency protocol.
 */
export function recordCareSpiralSignal(careCount: number, dominantAction?: string) {
  recordSignal('selfcare', 'care_spiral', {
    careCount,
    dominantAction,
    hour: new Date().getHours()
  })
}

/**
 * Record a quantum substrate signal from the calculator, random, or sign widget.
 * Feeds the quantum module in the self-assembly engine via 'qos' source.
 */
export function recordQuantumSignal(type: 'calculator' | 'random' | 'sign', value?: number) {
  recordSignal('qos', `quantum_${type}`, { value, hour: new Date().getHours() })
}

/**
 * Record a Quantum Success Benchmark reading signal.
 * Fires from the benchmark widget when the user reads their tier.
 * Tier codes: white / green / yellow / purple / black
 */
export function recordBenchmarkSignal(tier: 'white' | 'green' | 'yellow' | 'purple' | 'black', score: number) {
  recordSignal('energy', 'benchmark_read', { tier, score, hour: new Date().getHours() })
}

/**
 * Record a QOS phase transition — fires when the system crosses an assembly phase boundary.
 * Logged to the field archive for the person to observe their system maturing.
 */
export function recordQOSPhaseTransition(fromPhase: string, toPhase: string, moduleId: string) {
  recordSignal('qos', 'qos_phase_transition', {
    fromPhase,
    toPhase,
    moduleId,
    hour: new Date().getHours(),
  })
}

/**
 * Record a recipe-viewed signal. Feeds Pattern 20 (nutritional void) detection
 * and the Nutrition Protocol assembly module.
 */
export function recordRecipeViewedSignal(mealType: string, recipeName?: string) {
  recordSignal('recipe', 'recipe_viewed', {
    mealType,
    recipeName,
    hour: new Date().getHours(),
  })
}

/**
 * Record a meridian lock signal when morning + afternoon + evening all fire in the same day.
 * Feeds Pattern 59 (meridian-lock) and the Biofield Engine module.
 */
export function recordMeridianLockSignal(signalCount: number) {
  recordSignal('energy', 'meridian_lock', {
    signalCount,
    windows: ['morning', 'afternoon', 'evening'],
    hour: new Date().getHours(),
  })
}
