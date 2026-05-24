import { Log } from '#shared/types'

export interface VocabularyProfile {
  topWords: string[]
  topPhrases: string[]
  entryCount: number
  totalWords: number
  dominantTone: string | null
}

// Function words only — content words are the person's voice
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'is', 'it', 'i', 'me', 'my', 'we', 'you', 'your', 'he',
  'she', 'they', 'this', 'that', 'was', 'are', 'be', 'been', 'have',
  'has', 'had', 'do', 'did', 'not', 'no', 'from', 'by', 'as', 'so',
  'if', 'up', 'out', 'than', 'then', 'its', 'all', 'what', 'just',
  'about', 'can', 'will', 'more', 'very', 'when', 'which', 'who',
  'how', 'their', 'them', 'there', 'would', 'could', 'should',
  'still', 'also', 'into', 'get', 'got', 'back', 'like', 'now',
  'here', 'after', 'one', 'two', 'some', 'am', 'were', 'our', 'us',
  'him', 'her', 'even', 'too', 'own', 'over', 'down', 'off', 'come',
  'much', 'any', 'each', 'same', 'other', 'these', 'those',
  'again', 'being', 'where', 'while', 'before', 'without', 'through',
  'around', 'between', 'though', 'because', 'since', 'until', 'under',
  'always', 'never', 'every', 'really', 'already', 'well', 'just',
  'also', 'only', 'however', 'new', 'old', 'little', 'big', 'last',
  'next', 'make', 'made', 'take', 'took', 'let', 'see', 'saw',
  'know', 'knew', 'think', 'thought', 'say', 'said', 'go', 'went',
  'going', 'something', 'nothing', 'everything', 'many', 'few',
  'along', 'both', 'few', 'more', 'most', 'such', 'then', 'than',
  'too', 'very', 'just', 'must', 'might', 'may', 'shall', 'will',
  'into', 'onto', 'upon', 'within', 'above', 'below', 'across'
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
}

// Detect dominant tone from word mix — returns a word from the user's own vocabulary
function detectDominantTone(wordFreq: Record<string, number>): string | null {
  const toneGroups: Record<string, string[]> = {
    building: ['building', 'build', 'create', 'creating', 'design', 'making', 'work', 'working', 'project', 'system'],
    seeking: ['trying', 'looking', 'searching', 'figuring', 'wondering', 'exploring', 'finding'],
    tension: ['stuck', 'hard', 'difficult', 'struggling', 'struggle', 'frustrated', 'scattered', 'lost', 'overwhelmed'],
    clarity: ['clear', 'clarity', 'focused', 'focus', 'aligned', 'grounded', 'calm', 'stable'],
    moving: ['progress', 'forward', 'moving', 'momentum', 'growing', 'evolving', 'changing'],
  }

  let maxScore = 0
  let dominant: string | null = null

  for (const [tone, words] of Object.entries(toneGroups)) {
    const score = words.reduce((acc, w) => acc + (wordFreq[w] || 0), 0)
    if (score > maxScore) {
      maxScore = score
      dominant = tone
    }
  }

  return maxScore >= 2 ? dominant : null
}

export function extractJournalVocabulary(logs: Log[]): VocabularyProfile {
  const noteEntries = logs.filter(
    l => l.event === 'note' && l.text && l.text.trim().length > 15
  )

  if (noteEntries.length === 0) {
    return { topWords: [], topPhrases: [], entryCount: 0, totalWords: 0, dominantTone: null }
  }

  const wordFreq: Record<string, number> = {}
  const phraseFreq: Record<string, number> = {}
  let totalWords = 0

  for (const entry of noteEntries) {
    const words = tokenize(entry.text || '')
    totalWords += words.length

    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }

    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`
      phraseFreq[phrase] = (phraseFreq[phrase] || 0) + 1
    }
  }

  const topWords = Object.entries(wordFreq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word)

  const topPhrases = Object.entries(phraseFreq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase]) => phrase)

  return {
    topWords,
    topPhrases,
    entryCount: noteEntries.length,
    totalWords,
    dominantTone: detectDominantTone(wordFreq),
  }
}
