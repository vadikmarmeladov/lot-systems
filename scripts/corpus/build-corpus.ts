// QI·46 Phase 0 — Corpus Assembly
// Implements Step 0.1–0.3 of docs/corporate/LOT_QI46_ENGINE.md, Section IV,
// against the document sources that actually exist in this repository.
//
// Scope note (read before extending): this script only ever touches markdown/text
// files already committed to this repo — LOT® white papers, vision docs, and
// brand-language specs. It does not and must not read subscriber records, journal
// entries, or any personal data. Those live in the production database, not this
// repo, and Phase 0 cannot inventory them from here. See the gap notes emitted
// into corpus-manifest.json for what remains outside this script's reach.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')
const OUT_DIR = join(REPO_ROOT, 'docs', 'assembly', 'corpus')

type SourceTag = 'platform' | 'institute' | 'brand' | 'bioelectric' | 'consumable' | 'cosmo'
type TypeTag = 'instruction' | 'example' | 'philosophy' | 'technical' | 'voice'

interface CorpusRecord {
  prompt: string
  completion: string
  tags: {
    source: SourceTag
    type: TypeTag
    arc_position: 'n/a'
    body_state: 'n/a'
    cosmo_cleared: false
  }
}

// Documents whose filename signals "white paper / philosophy" rather than
// "brand vision copy" — these map to source: institute.
const INSTITUTE_MARKERS = ['WHITE-PAPER', 'WHITE_PAPER', 'CQGS']

// Documents whose filename signals bioelectric/hardware domain content.
const BIOELECTRIC_MARKERS = ['FIELD-MANUAL', 'BIOFIELD', 'PIEZO']
// Exact filenames known to cover bioelectric/hardware/infra territory despite
// living outside docs/technical or not matching the marker list above.
const BIOELECTRIC_FILES = new Set(['LOT_SYSTEMS_BRIEF.md'])

function classifySource(relPath: string, filename: string): SourceTag {
  const upper = filename.toUpperCase()
  if (INSTITUTE_MARKERS.some(m => upper.includes(m))) return 'institute'
  if (BIOELECTRIC_MARKERS.some(m => upper.includes(m)) || BIOELECTRIC_FILES.has(filename)) return 'bioelectric'
  if (relPath.startsWith('docs/corporate')) return 'brand'
  return 'institute'
}

function classifyType(relPath: string, filename: string): TypeTag {
  const upper = filename.toUpperCase()
  if (INSTITUTE_MARKERS.some(m => upper.includes(m))) return 'philosophy'
  if (relPath.startsWith('docs/corporate')) return 'voice'
  return 'technical'
}

function walk(dir: string, exts: string[]): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) continue
    if (exts.some(ext => entry.endsWith(ext))) out.push(full)
  }
  return out
}

function buildPrompt(title: string, source: SourceTag): string {
  return `[LOT® SYSTEM] Speak in the LOT® voice on: ${title} (source: ${source})`
}

function main() {
  const sourceDirs: Array<{ dir: string; exts: string[] }> = [
    { dir: join(REPO_ROOT, 'docs', 'corporate'), exts: ['.md'] },
    { dir: join(REPO_ROOT, 'docs', 'technical'), exts: ['.md', '.txt'] },
  ]

  // Only files whose content is genuinely LOT® philosophy / brand voice / white
  // paper material — not operational engineering runbooks (setup guides, fix
  // logs, testing plans). Those aren't training signal for a *voice*.
  const includeFilters: RegExp[] = [
    /WHITE[-_]PAPER/i,
    /^CQGS/i,
    /VISION/i,
    /^LOT-AI-PRODUCT-BRIEF/i,
    /^LOT_QUANTUM_AI_SYSTEM_PROMPT/i,
    /^LOT_QI46_ENGINE/i,
    /^LOT_Medical_Records/i,
    /^LOT_PTSD_Protocol/i,
    /^LOT-TERMINAL-VISION/i,
    /^LOT-CUBIQ-VISION/i,
    /^LOT_SYSTEMS_BRIEF/i,
    /^LOT-FIELD-MANUAL/i,
  ]

  const records: CorpusRecord[] = []
  const fileLog: Array<{ path: string; source: SourceTag; type: TypeTag; words: number }> = []

  for (const { dir, exts } of sourceDirs) {
    let files: string[]
    try {
      files = walk(dir, exts)
    } catch {
      continue
    }
    for (const filePath of files) {
      const filename = filePath.split('/').pop()!
      if (!includeFilters.some(re => re.test(filename))) continue

      const relPath = relative(REPO_ROOT, filePath)
      const raw = readFileSync(filePath, 'utf-8')
      const title = filename.replace(/\.(md|txt)$/i, '').replace(/[-_]/g, ' ')
      const source = classifySource(relPath, filename)
      const type = classifyType(relPath, filename)

      records.push({
        prompt: buildPrompt(title, source),
        completion: raw.trim(),
        tags: { source, type, arc_position: 'n/a', body_state: 'n/a', cosmo_cleared: false },
      })
      fileLog.push({ path: relPath, source, type, words: raw.split(/\s+/).length })
    }
  }

  const jsonlPath = join(OUT_DIR, 'lot-qi-46-v0.jsonl')
  writeFileSync(jsonlPath, records.map(r => JSON.stringify(r)).join('\n') + '\n', 'utf-8')

  const bySource: Record<string, number> = {}
  for (const r of fileLog) bySource[r.source] = (bySource[r.source] ?? 0) + 1

  const manifest = {
    generated_by: 'scripts/corpus/build-corpus.ts',
    spec_ref: 'docs/corporate/LOT_QI46_ENGINE.md Section IV Phase 0',
    total_training_pairs: records.length,
    total_words: fileLog.reduce((s, r) => s + r.words, 0),
    by_source: bySource,
    cosmo_cleared_count: 0,
    cosmo_flagged_count: records.length,
    files: fileLog,
    gaps: [
      {
        source: 'platform',
        reason:
          'Subscriber journal entries and session logs live in the production PostgreSQL database, not this repository. This script has no DB credentials or access path in this session and did not attempt a connection. Not inventoried.',
      },
      {
        source: 'consumable',
        reason:
          'Consumable feedback records (sock/toothbrush/Quantum Cube ratings) are subscriber-submitted production data. Not present in this repo. Not inventoried.',
      },
      {
        source: 'cosmo',
        reason:
          'COSMO® event logs (detection -> FAX -> record) are runtime-generated production records. Not present in this repo. Not inventoried.',
      },
    ],
  }
  writeFileSync(join(OUT_DIR, 'corpus-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf-8')

  console.log(`corpus: ${records.length} training pairs from ${fileLog.length} source files`)
  console.log(`by source: ${JSON.stringify(bySource)}`)
  console.log(`gaps flagged: platform, consumable, cosmo (see corpus-manifest.json)`)
}

main()
