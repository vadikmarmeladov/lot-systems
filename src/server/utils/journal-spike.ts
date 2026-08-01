/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import type { Log } from '#shared/types'
import type { PatternInsight } from './patterns'

/**
 * Journal spike detection
 *
 * The Log (Journal) tab is intentionally passive — no prompts, no
 * questions, the user just writes. This module is the machine's only
 * way of "following up": it looks at journal/log_entry text purely by
 * shape (length, cadence) — never by reading meaning into the words —
 * and flags two conditions worth a gentle, later check-in:
 *
 *  - WORD-COUNT SPIKE: the latest entry is a sharp outlier against the
 *    person's own recent baseline (much longer or much shorter).
 *  - SILENCE-THEN-BURST: a multi-day gap in journaling ended today.
 *
 * This is intentionally NOT sentiment/NLP analysis — LOT does not
 * read journal content to score it. It is a shape-of-behavior detector,
 * consistent with "the machine mirrors, it does not direct."
 */

const MIN_ENTRIES_FOR_BASELINE = 4
const SPIKE_RATIO = 2.5 // latest entry vs rolling average, either direction
const MIN_SPIKE_WORDS = 25 // ignore spikes below this — too short to matter
const SILENCE_GAP_DAYS = 3 // gap since the entry before last, to call it "silence"

function wordCount(text: string | null | undefined): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Detects journal-shape spikes across a user's recent logs. Pure
 * function — no AI call, no DB access — so it can run on every
 * `/contextual-prompts` request without added latency or cost.
 */
export function detectJournalSpike(logs: Log[]): PatternInsight[] {
  const insights: PatternInsight[] = []

  const journalEntries = logs
    .filter(l => (l.event === 'note' || l.event === 'log_entry' || l.event === 'journal') && (l.text || '').trim().length > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (journalEntries.length < MIN_ENTRIES_FOR_BASELINE + 1) return insights

  const [latest, ...priorEntries] = journalEntries
  const baseline = priorEntries.slice(0, 14) // last 2 weeks of entries, roughly
  const baselineWords = baseline.map(l => wordCount(l.text))
  const avgWords = baselineWords.reduce((a, b) => a + b, 0) / baselineWords.length
  const latestWords = wordCount(latest.text)

  if (avgWords > 0 && latestWords >= MIN_SPIKE_WORDS) {
    const ratio = latestWords / avgWords
    if (ratio >= SPIKE_RATIO) {
      insights.push({
        type: 'journal-spike',
        title: 'Journal length spike (up)',
        description: `Latest entry is ${latestWords} words vs a ${Math.round(avgWords)}-word average — a sharp expansion.`,
        confidence: Math.min(0.9, 0.5 + (ratio - SPIKE_RATIO) * 0.1),
        dataPoints: baseline.length + 1,
        metadata: { direction: 'up', latestWords, avgWords: Math.round(avgWords), ratio: Number(ratio.toFixed(2)) },
      })
    } else if (avgWords / Math.max(latestWords, 1) >= SPIKE_RATIO && avgWords >= MIN_SPIKE_WORDS) {
      insights.push({
        type: 'journal-spike',
        title: 'Journal length spike (down)',
        description: `Latest entry is ${latestWords} words vs a ${Math.round(avgWords)}-word average — a sharp contraction.`,
        confidence: Math.min(0.85, 0.5 + (avgWords / Math.max(latestWords, 1) - SPIKE_RATIO) * 0.1),
        dataPoints: baseline.length + 1,
        metadata: { direction: 'down', latestWords, avgWords: Math.round(avgWords), ratio: Number((latestWords / avgWords).toFixed(2)) },
      })
    }
  }

  // Silence-then-burst: gap between the two most recent entries.
  if (priorEntries.length > 0) {
    const gapMs = new Date(latest.createdAt).getTime() - new Date(priorEntries[0].createdAt).getTime()
    const gapDays = gapMs / (24 * 60 * 60 * 1000)
    if (gapDays >= SILENCE_GAP_DAYS) {
      insights.push({
        type: 'journal-spike',
        title: 'Silence then burst',
        description: `${Math.round(gapDays)} days of journal silence, then a new entry just landed.`,
        confidence: Math.min(0.85, 0.5 + (gapDays - SILENCE_GAP_DAYS) * 0.05),
        dataPoints: 2,
        metadata: { direction: 'burst', gapDays: Math.round(gapDays) },
      })
    }
  }

  return insights
}
