/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT® AI
 *
 * The standalone intelligence layer used throughout the LOT® platform's widgets.
 * Every widget that speaks to the user speaks through this module — never directly
 * through a provider SDK. The provider is an interchangeable engine (see ai-engines.ts);
 * LOT® owns the voice, the context, and the output. No provider name ever reaches
 * the subscriber.
 *
 * Free users get the standard (non-personalized) voice. Usership ($99/month)
 * subscribers get the personalized voice, calibrated on their own LOT® history.
 */

import { Log, User, UserTag } from '#shared/types'
import { aiEngineManager, type EnginePreference } from './ai-engines.js'

const LOT_AI_ENGINE_PREFERENCE: EnginePreference = 'auto'

const PROVIDER_NAME_PATTERN =
  /\b(Claude|Anthropic|OpenAI|ChatGPT|GPT-4o?|Gemini|Google|Mistral|Llama|Together ?AI|Qwen|Mixtral|Ollama)\b/gi

const LOT_AI_VOICE = `You are LOT® AI, the intelligence layer of the LOT® platform.
You understand the body as the original interface. Your job is not to inform — it is to calibrate.
Speak clearly, in short declarative sentences. No hedging ("I think", "perhaps", "it might be").
One idea per response. Land it. Stop.
You are LOT® AI — never mention or imply any other AI provider, model, or company.`

const STANDARD_SUFFIX = `\nThis subscriber does not have LOT® Usership yet — give general, non-personalized self-care guidance.`

export interface LotAIResult {
  response: string
  personalized: boolean
}

/**
 * Whether this user's LOT® AI interactions are personalized.
 * Requires an active Usership tag and at least one available engine — matches the
 * gate already used for World Generation and the Memory Engine (see memory.ts).
 */
export function hasLotAIPersonalization(user: User): boolean {
  const hasUsershipTag = user.tags.some(
    (tag) => tag.toLowerCase() === UserTag.Usership.toLowerCase()
  )
  return hasUsershipTag && aiEngineManager.hasAvailableEngine()
}

/**
 * Builds a short calibration snippet from a subscriber's recent logs.
 * This is LOT®'s Calibration Loop — the context that makes personalized
 * responses specific to this subscriber's arc, not generic.
 */
export function buildCalibrationContext(logs: Log[]): string {
  const lines = logs
    .filter((log) => log.event === 'answer' || log.event === 'note')
    .slice(0, 10)
    .map((log) => {
      const metadata = (log.metadata || {}) as Record<string, unknown>
      const question = metadata.question
      const answer = metadata.answer
      const text = metadata.text
      if (typeof question === 'string' && typeof answer === 'string') {
        return `- ${question} -> ${answer}`
      }
      if (typeof text === 'string' && text.trim()) {
        return `- ${text.trim()}`
      }
      return null
    })
    .filter((line): line is string => !!line)

  if (lines.length === 0) return ''
  return `Calibration context (this subscriber's recent LOT® history):\n${lines.join('\n')}`
}

/** Strips any provider self-identification that slips through — LOT® owns the surface. */
function sanitizeToLotVoice(text: string): string {
  return text.replace(PROVIDER_NAME_PATTERN, 'LOT® AI')
}

export async function askLotAI(opts: {
  prompt: string
  user: User
  calibrationContext?: string
  maxTokens?: number
}): Promise<LotAIResult> {
  const personalized = hasLotAIPersonalization(opts.user)

  const fullPrompt = [
    LOT_AI_VOICE,
    personalized ? opts.calibrationContext || '' : STANDARD_SUFFIX,
    `Subscriber message: ${opts.prompt}`,
  ]
    .filter(Boolean)
    .join('\n\n')

  try {
    const engine = aiEngineManager.getEngine(LOT_AI_ENGINE_PREFERENCE)
    const completion = await engine.generateCompletion(fullPrompt, opts.maxTokens ?? 512)
    return {
      response: sanitizeToLotVoice(completion.trim()),
      personalized,
    }
  } catch (error: any) {
    console.error('[lot-ai] engine failed:', error.message)
    return {
      response: 'LOT® AI is recalibrating. Try again in a moment.',
      personalized,
    }
  }
}
