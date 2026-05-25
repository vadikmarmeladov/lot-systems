/**
 * Journal Vocabulary Engine
 *
 * Reads the user's journal (note-event logs) and extracts the exact phrases,
 * dominant words, and punctuation signature they return to. The System learns
 * the user's language — not synonyms, the actual words they reach for.
 *
 * Output feeds VoiceMirrorWidget so the interface speaks back in the
 * user's own voice.
 */

import type { Log } from '#shared/types'

const STOP_WORDS = new Set([
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'the', 'a', 'an', 'is', 'it',
  'in', 'on', 'at', 'to', 'of', 'and', 'or', 'but', 'that', 'this', 'these',
  'those', 'have', 'has', 'had', 'for', 'with', 'not', 'are', 'was', 'were',
  'be', 'been', 'do', 'did', 'can', 'will', 'from', 'so', 'up', 'out', 'as',
  'into', 'if', 'by', 'he', 'she', 'they', 'them', 'their', 'what', 'when',
  'how', 'who', 'which', 'more', 'all', 'just', 'now', 'like', 'get', 'got',
  'am', 'no', 'yes', 'ok', 'about', 'than', 'then', 'also', 'very', 'really',
  'feel', 'felt', 'still', 'today', 'some', 'would', 'could', 'should', 'want',
  'need', 'think', 'know', 'make', 'see', 'going', 'go', 'back', 'good',
  'been', 'too', 'day', 'time', 'one', 'here', 'there', 'way', 'same'
])

export type VoiceSignature = 'energetic' | 'questioning' | 'reflective' | 'measured'

export interface JournalVocabulary {
  topPhrases: { phrase: string; count: number }[]
  topWords: { word: string; count: number }[]
  voiceSignature: VoiceSignature
  exclamationCount: number
  questionCount: number
  noteCount: number
  totalWords: number
  echoLines: string[]
  lastUpdated: string
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w))
}

function getBigrams(words: string[]): string[] {
  const bigrams: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`)
  }
  return bigrams
}

function getTrigrams(words: string[]): string[] {
  const trigrams: string[] = []
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
  }
  return trigrams
}

function buildEchoLines(
  topPhrases: { phrase: string; count: number }[],
  topWords: { word: string; count: number }[],
  signature: VoiceSignature,
  exclamationCount: number
): string[] {
  const lines: string[] = []

  if (topPhrases.length >= 1) {
    lines.push(`Signal: "${topPhrases[0].phrase}"`)
  }
  if (topPhrases.length >= 2) {
    lines.push(`Recurring: "${topPhrases[1].phrase}"`)
  }
  if (topWords.length >= 1) {
    lines.push(`Dominant: ${topWords[0].word}`)
  }

  const signatureLabels: Record<VoiceSignature, string> = {
    energetic: `Voice: energetic${exclamationCount >= 5 ? ` (${exclamationCount}!!)` : ''}`,
    questioning: 'Voice: questioning',
    reflective: 'Voice: reflective',
    measured: 'Voice: measured',
  }
  lines.push(signatureLabels[signature])

  return lines
}

let _cache: { hash: string; result: JournalVocabulary } | null = null

function simpleHash(notes: { id: string; text: string }[]): string {
  return notes.map(n => `${n.id}:${n.text.length}`).join('|')
}

export function extractVocabulary(logs: Log[]): JournalVocabulary | null {
  const notes = logs.filter(
    l => l.event === 'note' && typeof l.text === 'string' && l.text.trim().length > 5
  ) as (Log & { text: string })[]

  if (notes.length < 2) return null

  const cacheKey = simpleHash(notes.map(n => ({ id: n.id, text: n.text })))
  if (_cache && _cache.hash === cacheKey) return _cache.result

  const allText = notes.map(n => n.text).join('\n')

  // Punctuation analysis on raw text
  const exclamationCount = (allText.match(/!/g) || []).length
  const questionCount = (allText.match(/\?/g) || []).length
  const ellipsisCount = (allText.match(/\.\.\.|…/g) || []).length

  let voiceSignature: VoiceSignature
  if (exclamationCount >= 3 && exclamationCount > questionCount && exclamationCount > ellipsisCount) {
    voiceSignature = 'energetic'
  } else if (questionCount >= 2 && questionCount > exclamationCount) {
    voiceSignature = 'questioning'
  } else if (ellipsisCount >= 2) {
    voiceSignature = 'reflective'
  } else {
    voiceSignature = 'measured'
  }

  // Word frequency
  const wordCounts = new Map<string, number>()
  let totalWords = 0
  for (const note of notes) {
    const words = tokenize(note.text)
    totalWords += words.length
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    }
  }

  const topWords = Array.from(wordCounts.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))

  // Phrase frequency (bigrams + trigrams, filtered to meaningful content)
  const phraseCounts = new Map<string, number>()
  for (const note of notes) {
    const raw = note.text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 0)
    for (const p of [...getBigrams(raw), ...getTrigrams(raw)]) {
      phraseCounts.set(p, (phraseCounts.get(p) || 0) + 1)
    }
  }

  const topPhrases = Array.from(phraseCounts.entries())
    .filter(([phrase, count]) => {
      if (count < 2) return false
      const parts = phrase.split(' ')
      // At least one meaningful (non-stop) word in the phrase
      return parts.some(w => w.length >= 3 && !STOP_WORDS.has(w))
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([phrase, count]) => ({ phrase, count }))

  const echoLines = buildEchoLines(topPhrases, topWords, voiceSignature, exclamationCount)

  const result: JournalVocabulary = {
    topPhrases,
    topWords,
    voiceSignature,
    exclamationCount,
    questionCount,
    noteCount: notes.length,
    totalWords,
    echoLines,
    lastUpdated: new Date().toISOString().slice(0, 10),
  }

  _cache = { hash: cacheKey, result }
  return result
}
