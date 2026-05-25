import React from 'react'
import { Block } from '#client/components/ui'
import { ProgressBars } from '#client/utils/progressBars'
import { extractVocabulary } from '#client/stores/journalVocabulary'
import { recordSignal } from '#client/stores/intentionEngine'
import type { Log } from '#shared/types'

type VoiceView = 'signal' | 'vocabulary' | 'echo'

/**
 * VoiceMirrorWidget — the System reading the user's own language back to them.
 *
 * Parses journal note entries for repeated exact phrases, dominant words,
 * and punctuation signature. Three views:
 *   Signal:     top phrases — what the user returns to most
 *   Vocabulary: word frequency table with progress bars
 *   Echo:       system speaking back in the user's exact language
 *
 * Only surfaces when ≥2 note entries exist with meaningful text.
 * Wires voice_mirror_viewed into the QIE signal stream.
 */
export function VoiceMirrorWidget({ logs }: { logs: Log[] }) {
  const [view, setView] = React.useState<VoiceView>('signal')
  const hasRecordedRef = React.useRef(false)

  const vocab = React.useMemo(() => extractVocabulary(logs), [logs])

  if (!vocab) return null

  if (!hasRecordedRef.current) {
    recordSignal('memory', 'voice_mirror_viewed', {
      noteCount: vocab.noteCount,
      topPhraseCount: vocab.topPhrases.length,
      signature: vocab.voiceSignature,
    })
    hasRecordedRef.current = true
  }

  const cycleView = () => {
    setView(prev =>
      prev === 'signal' ? 'vocabulary' :
      prev === 'vocabulary' ? 'echo' :
      'signal'
    )
  }

  const label =
    view === 'signal' ? 'Signal:' :
    view === 'vocabulary' ? 'Vocabulary:' :
    'Echo:'

  const maxWordCount = vocab.topWords[0]?.count || 1

  return (
    <Block label={label} blockView onLabelClick={cycleView}>
      <div className="flex flex-col gap-y-12 font-mono text-xs">

        {/* ─── Signal View — top phrases the user returns to ─── */}
        {view === 'signal' && (
          <>
            <div className="opacity-30 mb-4">
              Phrase signal · {vocab.noteCount} {vocab.noteCount === 1 ? 'entry' : 'entries'} read
            </div>

            {vocab.topPhrases.length === 0 ? (
              <div className="opacity-30">
                Reading signal. Write more to reveal patterns.
              </div>
            ) : (
              <div className="flex flex-col gap-y-4">
                {vocab.topPhrases.slice(0, 6).map(({ phrase, count }) => (
                  <div key={phrase} className="flex justify-between items-baseline">
                    <span>"{phrase}"</span>
                    <span className="opacity-40 tabular-nums ml-16">&times;{count}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-acc-400/20 pt-8 flex justify-between">
              <span className="opacity-30">Voice signature</span>
              <span className="capitalize">{vocab.voiceSignature}</span>
            </div>
          </>
        )}

        {/* ─── Vocabulary View — word frequency table ─── */}
        {view === 'vocabulary' && (
          <>
            <div className="opacity-30 mb-4">
              Dominant words · {vocab.totalWords} total
            </div>

            {vocab.topWords.length === 0 ? (
              <div className="opacity-30">Vocabulary forming. Write more entries.</div>
            ) : (
              <div className="flex flex-col gap-y-6">
                {vocab.topWords.slice(0, 8).map(({ word, count }) => {
                  const pct = Math.round((count / maxWordCount) * 100)
                  return (
                    <div key={word} className="flex items-baseline gap-8">
                      <span className="opacity-70 w-24 shrink-0 truncate">{word}</span>
                      <ProgressBars percentage={pct} barCount={10} emergingOpacity={0.1} />
                      <span className="opacity-40 tabular-nums ml-4">{count}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {vocab.exclamationCount > 0 && (
              <div className="border-t border-acc-400/20 pt-8 flex justify-between">
                <span className="opacity-30">Exclamations</span>
                <span className="tabular-nums">{vocab.exclamationCount}</span>
              </div>
            )}

            {vocab.questionCount > 0 && (
              <div className="flex justify-between">
                <span className="opacity-30">Questions</span>
                <span className="tabular-nums">{vocab.questionCount}</span>
              </div>
            )}
          </>
        )}

        {/* ─── Echo View — system speaking back in the user's language ─── */}
        {view === 'echo' && (
          <>
            <div className="flex justify-between mb-4">
              <span className="opacity-30 uppercase tracking-widest">System echo</span>
              <span className="opacity-30 tabular-nums">{vocab.lastUpdated}</span>
            </div>

            <div className="flex flex-col gap-y-8 border-l border-acc-400/30 pl-8">
              {vocab.echoLines.map((line, idx) => (
                <div key={idx} className={idx === 0 ? '' : 'opacity-60'}>
                  {line}
                </div>
              ))}
            </div>

            <div className="border-t border-acc-400/20 pt-8 opacity-30">
              The system learns your language. Pattern confirmed.
            </div>
          </>
        )}

      </div>
    </Block>
  )
}
