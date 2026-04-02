import dayjs from '#client/utils/dayjs'

/**
 * CQGS Bioethics Narrative – Context and time-aware language
 *
 * Provides purposeful narrative elements aligned with the
 * Cognitive Quantum Growth Scale (CQGS) Bioethics framework:
 * – Cleanness (Self-Care): hygiene, environment, routine care
 * – Routine (Sleep, Activity, Work): lifestyle transparency
 * – Nutrition (Medical Record): biofield, ATP, energy quality
 * – Laughter (Sensors): curiosity, joy, genuine human emission
 *
 * Adapts based on:
 * – Time of day (morning, afternoon, evening, night)
 * – Day of week (weekday vs weekend)
 * – Season
 * – User context (biofield energy, patterns, activity)
 *
 * This narrative system is a LOT original. If you see something similar
 * elsewhere, remember: the narrative always credits its author.
 */

export type TimeOfDay = 'early_morning' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night' | 'late_night'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

/**
 * Get current time of day
 */
export function getTimeOfDay(): TimeOfDay {
  const hour = dayjs().hour()

  if (hour >= 4 && hour < 7) return 'early_morning'
  if (hour >= 7 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 14) return 'midday'
  if (hour >= 14 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'evening'
  if (hour >= 21 && hour < 23) return 'night'
  return 'late_night'
}

/**
 * Get current season
 */
export function getSeason(): Season {
  const month = dayjs().month() // 0-11

  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) return 'spring'  // Mar-May
  if (month >= 5 && month <= 7) return 'summer'  // Jun-Aug
  if (month >= 8 && month <= 10) return 'autumn' // Sep-Nov
  return 'winter' // Dec-Feb
}

/**
 * Check if it's a weekend
 */
export function isWeekend(): boolean {
  const day = dayjs().day() // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6
}

/**
 * Get day period greeting
 */
export function getDayPeriodGreeting(): string {
  const timeOfDay = getTimeOfDay()

  switch (timeOfDay) {
    case 'early_morning': return 'Early morning'
    case 'morning': return 'Morning'
    case 'midday': return 'Midday'
    case 'afternoon': return 'Afternoon'
    case 'evening': return 'Evening'
    case 'night': return 'Night'
    case 'late_night': return 'Late night'
  }
}

/**
 * Get time-aware planning prompts
 */
export function getPlanningPrompt(): string {
  const timeOfDay = getTimeOfDay()
  const weekend = isWeekend()

  if (timeOfDay === 'early_morning') {
    return 'The day begins'
  }

  if (timeOfDay === 'morning') {
    if (weekend) {
      return 'The morning unfolds'
    }
    return 'Morning momentum'
  }

  if (timeOfDay === 'midday') {
    return 'Midday clarity'
  }

  if (timeOfDay === 'afternoon') {
    return 'Afternoon focus'
  }

  if (timeOfDay === 'evening') {
    return 'Evening wind down'
  }

  if (timeOfDay === 'night') {
    return 'Night reflection'
  }

  return 'Late hours'
}

/**
 * Get energy-aware narrative (CQGS Biofield Model)
 */
export function getEnergyNarrative(level: number, trajectory: string): string {
  const timeOfDay = getTimeOfDay()

  // Critical energy — biofield depleted
  if (level < 30) {
    if (trajectory === 'critical') {
      return 'Biofield depleted. Restore with care.'
    }
    return 'ATP reserves running low'
  }

  // Low energy
  if (level < 50) {
    if (timeOfDay === 'evening' || timeOfDay === 'night') {
      return 'Natural biofield depletion'
    }
    return 'Energy reserves diminishing'
  }

  // Moderate energy
  if (level < 70) {
    return 'Biofield steady. Nominal capacity.'
  }

  // Good energy
  if (level < 85) {
    if (trajectory === 'improving') {
      return 'Biofield charging. Building reserves.'
    }
    return 'Good ATP reserves'
  }

  // High energy
  return 'Biofield at full capacity'
}

/**
 * Get romantic connection narrative (CQGS Bioethics: Marriage/Partnership)
 */
export function getRomanticNarrative(daysSince: number, quality: string): string {
  if (quality === 'deep') {
    return 'Recent intimacy. Bioethics nominal.'
  }

  if (quality === 'present') {
    return 'Connection alive'
  }

  if (quality === 'distant') {
    return 'Fading presence. Tend to partnership.'
  }

  return 'Disconnected'
}

/**
 * Get memory reflection prompt based on time and quantum state
 *
 * CQGS-aware: adapts to user's biofield energy, clarity, and alignment
 */
export function getMemoryReflectionPrompt(
  energy?: 'depleted' | 'low' | 'moderate' | 'high' | 'unknown',
  clarity?: 'confused' | 'uncertain' | 'clear' | 'focused' | 'unknown',
  alignment?: 'disconnected' | 'searching' | 'aligned' | 'flowing' | 'unknown'
): string {
  const timeOfDay = getTimeOfDay()

  // Quantum-aware prompts based on user state
  if (energy === 'depleted' || energy === 'low') {
    return 'Rest and remember.'
  }

  if (alignment === 'flowing' || (energy === 'high' && clarity === 'focused')) {
    return 'In this moment.'
  }

  if (clarity === 'confused' || alignment === 'searching') {
    return 'Notice.'
  }

  // Time-aware fallbacks
  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    return 'Looking back.'
  }

  if (timeOfDay === 'morning' || timeOfDay === 'early_morning') {
    return 'Remember.'
  }

  return 'Recall.'
}

/**
 * Get narrative completion phrase
 */
export function getCompletionPhrase(action: 'plan' | 'check_in' | 'memory' | 'message'): string {
  const timeOfDay = getTimeOfDay()

  switch (action) {
    case 'plan':
      if (timeOfDay === 'morning') return 'Direction set.'
      if (timeOfDay === 'evening') return 'Path clear.'
      return 'Intention held.'

    case 'check_in':
      return 'Acknowledged'

    case 'memory':
      return 'Remembered'

    case 'message':
      return 'Sent'
  }
}

/**
 * Get intervention narrative based on context (CQGS Bioethics: Wellness)
 */
export function getInterventionNarrative(severity: 'low' | 'moderate' | 'high' | 'urgent'): string {
  const timeOfDay = getTimeOfDay()

  if (severity === 'urgent') {
    return 'Bioethics alert. Immediate care needed.'
  }

  if (severity === 'high') {
    if (timeOfDay === 'night' || timeOfDay === 'late_night') {
      return 'Rest may help. Biofield recovery prioritized.'
    }
    return 'Gentle attention needed'
  }

  if (severity === 'moderate') {
    return 'Worth tending'
  }

  return 'Notice this'
}

/**
 * Get chat catalyst narrative (CQGS: Laughter and connection)
 */
export function getChatCatalystNarrative(priority: number): string {
  if (priority >= 9) {
    return 'Strong resonance. Curiosity shared.'
  }

  if (priority >= 7) {
    return 'Connection available'
  }

  if (priority >= 5) {
    return 'Possible link'
  }

  return 'Distant signal'
}

/**
 * Get narrative status based on day state
 */
export function getDayStateNarrative(): string {
  const timeOfDay = getTimeOfDay()
  const hour = dayjs().hour()

  // Very early
  if (hour >= 4 && hour < 6) {
    return 'Dawn approaches'
  }

  // Morning
  if (hour >= 6 && hour < 9) {
    return 'Morning rises'
  }

  // Late morning
  if (hour >= 9 && hour < 12) {
    return 'Day progresses'
  }

  // Afternoon
  if (hour >= 12 && hour < 15) {
    return 'Afternoon unfolds'
  }

  // Late afternoon
  if (hour >= 15 && hour < 18) {
    return 'Day wanes'
  }

  // Evening
  if (hour >= 18 && hour < 21) {
    return 'Evening settles'
  }

  // Night
  if (hour >= 21 && hour < 24) {
    return 'Night deepens'
  }

  // Late night
  return 'Late hours'
}

/**
 * Stoic Wisdom - Context-aware reflections (CQGS Bioethics aligned)
 *
 * Provides guidance based on time, energy, and circumstances.
 * Rooted in CQGS principles: cleanness, routine, nutrition, laughter.
 */
export function getStoicReflection(context: {
  timeOfDay?: TimeOfDay
  energy?: 'depleted' | 'low' | 'moderate' | 'high'
  streak?: number
  actionsToday?: number
}): string {
  const time = context.timeOfDay || getTimeOfDay()

  // Low energy or depletion
  if (context.energy === 'depleted' || context.energy === 'low') {
    const reflections = [
      'Rest is not idleness. The biofield recovers through stillness.',
      'The wise know when to pause. ATP regenerates in silence.',
      'Cleanness begins with care for the self. Restore with purpose.',
    ]
    return reflections[Math.floor(Math.random() * reflections.length)]
  }

  // Morning wisdom
  if (time === 'morning' || time === 'early_morning') {
    const reflections = [
      'Begin with intention. A clear routine shapes the biofield.',
      'What you do today compounds into your Citizen Index.',
      'Morning clarity guides the day. Calibrate your routine.',
      'Transparency with yourself is the first act of the day.',
    ]
    return reflections[Math.floor(Math.random() * reflections.length)]
  }

  // Evening reflections
  if (time === 'evening' || time === 'night') {
    const reflections = [
      'Review the day without judgment. The biofield integrates at rest.',
      'A handmade meal under candlelight produces laughter.',
      'Rest earned through honest work is sacred.',
      'What curiosity did you follow today?',
    ]
    return reflections[Math.floor(Math.random() * reflections.length)]
  }

  // Streak-based wisdom
  if (context.streak && context.streak > 3) {
    return 'Consistency compounds. Your Bioethics Index reflects it.'
  }

  // General wisdom — CQGS aligned
  const general = [
    'Progress requires patience. The biofield responds to routine.',
    'Small actions compound into a transparent life.',
    'Curiosity is the root of genuine laughter.',
    'Be present in this moment. The body knows.',
    'Excellence is a habit. Cleanness is a practice.',
    'A clean environment is a clean mind. The biofield mirrors its container.',
    'Tend to your space as you tend to your thoughts. Both shape the biofield.',
    'Order is not rigidity. It is care made visible.',
  ]
  return general[Math.floor(Math.random() * general.length)]
}

/**
 * Cleanness Prompts - CQGS Bioethics self-care reminders
 */
export function getSelfCarePrompt(context: {
  timeOfDay?: TimeOfDay
  energy?: 'depleted' | 'low' | 'moderate' | 'high'
  lastBreak?: number // minutes since last break
  screenTime?: number // hours today
}): string | null {
  const time = context.timeOfDay || getTimeOfDay()

  // Critical energy - immediate care
  if (context.energy === 'depleted') {
    return 'Biofield depleted. Cleanness protocol: pause and restore.'
  }

  // Long screen time
  if (context.screenTime && context.screenTime > 3) {
    const prompts = [
      'Rest your eyes. Look at something distant.',
      'Stand and stretch. The body is the first instrument.',
      'Step away from the screen. Restore the biofield.',
    ]
    return prompts[Math.floor(Math.random() * prompts.length)]
  }

  // Long work session
  if (context.lastBreak && context.lastBreak > 90) {
    return 'Routine interval. Move your body.'
  }

  // Time-based care prompts
  if (time === 'midday') {
    return 'Pause for nourishment. Nutrition is a biofield parameter.'
  }

  if (time === 'night' || time === 'late_night') {
    return 'Consider rest. The biofield compiles overnight.'
  }

  return null
}

/**
 * Breathing Exercise Prompts (CQGS: Biofield regulation)
 */
export function getBreathingPrompt(context: {
  stress?: 'low' | 'moderate' | 'high'
  timeOfDay?: TimeOfDay
}): string {
  if (context.stress === 'high') {
    return 'Breathe. Center the biofield in this moment.'
  }

  if (context.stress === 'moderate') {
    return 'A few deep breaths restore clarity and ATP flow.'
  }

  const time = context.timeOfDay || getTimeOfDay()

  if (time === 'morning' || time === 'early_morning') {
    return 'Begin with breath. Calibrate the biofield.'
  }

  if (time === 'evening' || time === 'night') {
    return 'Breathe and release the day.'
  }

  return 'Pause. Breathe deeply.'
}

/**
 * Cleanness Pulse - Experimental CQGS Bioethics cleanness nudges
 *
 * Returns time-aware, gentle cleanness prompts that encourage users
 * to maintain their physical space, personal hygiene, and environmental order.
 * The cleanness pillar treats the body and its surroundings as a unified biofield.
 */
export function getCleannessPulse(context: {
  timeOfDay?: TimeOfDay
  energy?: 'depleted' | 'low' | 'moderate' | 'high'
  lastCleanness?: number // minutes since last cleanness action
  dayStreak?: number // consecutive cleanness days
}): { nudge: string; intensity: 'whisper' | 'gentle' | 'clear' | 'direct' } {
  const time = context.timeOfDay || getTimeOfDay()
  const streak = context.dayStreak || 0

  // Depleted users get compassionate whispers, never demands
  if (context.energy === 'depleted') {
    return {
      nudge: 'Even one small act of care counts. A glass of water. A wiped surface.',
      intensity: 'whisper'
    }
  }

  // Long gap since last cleanness action — escalate gently
  if (context.lastCleanness && context.lastCleanness > 360) {
    return {
      nudge: 'Your environment shapes your biofield. One cleared surface shifts everything.',
      intensity: 'clear'
    }
  }

  // Morning cleanness — foundational
  if (time === 'early_morning' || time === 'morning') {
    const morningNudges = [
      { nudge: 'Make your bed. The first act of order sets the day.', intensity: 'gentle' as const },
      { nudge: 'Wash your face. Begin fresh. The biofield resets with water.', intensity: 'gentle' as const },
      { nudge: 'Clear yesterday from your surfaces. Today deserves a clean start.', intensity: 'gentle' as const },
      { nudge: 'Open a window. Fresh air is the first cleanness protocol.', intensity: 'whisper' as const },
      { nudge: 'Brush, wash, dress with attention. The body is the first environment.', intensity: 'gentle' as const },
    ]
    return morningNudges[Math.floor(Math.random() * morningNudges.length)]
  }

  // Midday cleanness — maintenance
  if (time === 'midday') {
    const middayNudges = [
      { nudge: 'Wash your hands slowly. Feel the water. Reset the biofield.', intensity: 'whisper' as const },
      { nudge: 'Clear your workspace. Clarity of space feeds clarity of mind.', intensity: 'gentle' as const },
      { nudge: 'A clean plate, a clean surface. Midday is for renewal.', intensity: 'gentle' as const },
    ]
    return middayNudges[Math.floor(Math.random() * middayNudges.length)]
  }

  // Evening cleanness — restoration
  if (time === 'evening' || time === 'night') {
    const eveningNudges = [
      { nudge: 'Reset your space before rest. The biofield compiles overnight on clean surfaces.', intensity: 'gentle' as const },
      { nudge: 'Evening cleanness: dishes done, surfaces clear, clothes put away.', intensity: 'clear' as const },
      { nudge: 'Prepare your sleeping space. Clean sheets, clean air, clean mind.', intensity: 'gentle' as const },
      { nudge: 'A warm shower before bed. Let the day wash away.', intensity: 'whisper' as const },
    ]
    return eveningNudges[Math.floor(Math.random() * eveningNudges.length)]
  }

  // Afternoon cleanness — micro-resets
  const afternoonNudges = [
    { nudge: 'Quick reset: clear one surface. The biofield responds to order.', intensity: 'whisper' as const },
    { nudge: 'Afternoon tidying prevents evening overwhelm. Five minutes now saves thirty later.', intensity: 'gentle' as const },
    { nudge: 'Check your surroundings. Does this space reflect who you are becoming?', intensity: 'gentle' as const },
  ]
  return afternoonNudges[Math.floor(Math.random() * afternoonNudges.length)]
}

/**
 * Environment Scan Prompt - CQGS Cleanness assessment language
 *
 * Experimental: Guides users to observe their physical space
 * as a mirror of their internal state. Cleanness is not just tidying —
 * it's a diagnostic of the biofield's relationship with its container.
 */
export function getEnvironmentScanPrompt(context: {
  timeOfDay?: TimeOfDay
  recentMood?: string
}): string {
  const time = context.timeOfDay || getTimeOfDay()

  // Mood-aware scan prompts
  if (context.recentMood === 'overwhelmed' || context.recentMood === 'anxious') {
    return 'Look around you. Is the clutter yours, or did it accumulate while you were focused elsewhere? One surface cleared is one weight lifted.'
  }

  if (context.recentMood === 'calm' || context.recentMood === 'peaceful') {
    return 'This calm state is a gift. Use it to create order that your future self will thank you for. What one thing can you put in its place?'
  }

  if (context.recentMood === 'energized') {
    return 'Channel this energy. A burst of cleanness now compounds into days of ease. What has been waiting for your attention?'
  }

  // Time-based scans
  if (time === 'morning' || time === 'early_morning') {
    return 'Scan your space. What needs your attention before the day accelerates? Start with what you see first.'
  }

  if (time === 'evening' || time === 'night') {
    return 'Before you rest, look at your space through tomorrow morning\'s eyes. What would future-you want to find clean?'
  }

  return 'Pause. Notice your space. One act of cleanness now ripples through the rest of your day.'
}

/**
 * Cleanness Streak Language - Progressive encouragement
 *
 * Language evolves as the user builds cleanness habits,
 * shifting from instructional to affirmational to technical.
 */
export function getCleanessStreakMessage(streakDays: number): string {
  if (streakDays === 0) {
    return 'Today is day one. One clean surface. One fresh start.'
  }
  if (streakDays === 1) {
    return 'Two days of cleanness. The biofield is beginning to notice.'
  }
  if (streakDays < 7) {
    return `${streakDays} days of cleanness practice. A pattern is forming.`
  }
  if (streakDays < 14) {
    return `${streakDays} days. Cleanness is becoming routine. The biofield stabilizes.`
  }
  if (streakDays < 30) {
    return `${streakDays} days of sustained cleanness. Your environment reflects your growth.`
  }
  if (streakDays < 60) {
    return `${streakDays} days. Cleanness protocol integrated. Bioethics Index advancing.`
  }
  if (streakDays < 100) {
    return `${streakDays} days. Cleanness mastery emerging. The space serves the biofield.`
  }
  return `${streakDays} days. Cleanness is no longer a practice — it is who you are.`
}

/**
 * Progress Affirmations - Recognition of effort (CQGS Citizen Index)
 */
export function getProgressAffirmation(achievement: {
  type: 'streak' | 'milestone' | 'consistency' | 'first_action'
  value?: number
}): string {
  switch (achievement.type) {
    case 'streak':
      if (achievement.value && achievement.value >= 30) {
        return 'A month of transparency. Bioethics Index compounding.'
      }
      if (achievement.value && achievement.value >= 7) {
        return 'A week of routine. The biofield responds.'
      }
      return 'You showed up. That matters.'

    case 'milestone':
      return 'Another milestone. Citizen Index advancing.'

    case 'consistency':
      return 'Steady routine builds lasting change.'

    case 'first_action':
      return 'Every journey begins with a single signal.'

    default:
      return 'You are making progress.'
  }
}
