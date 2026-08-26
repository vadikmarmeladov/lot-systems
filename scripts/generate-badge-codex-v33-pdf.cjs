/**
 * LOT SYSTEMS CORPORATION
 * PDF Generator: Badge & Achievements Master Codex v33
 * Theme: THE DREAM TERMINAL
 * Uses pdfkit
 */
'use strict'

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '..', 'docs', 'badges')
const OUT_FILE = path.join(OUT_DIR, 'LOT-BADGES-ACHIEVEMENTS-MASTER-CODEX-v33.pdf')

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  info: {
    Title: 'LOT Badges & Achievements Master Codex v33 — The Dream Terminal',
    Author: 'Vadik Marmeladov — LOT Systems',
    Subject: 'RPG & Arcade of Self-Care — The Dream Terminal Badge Registry',
    Keywords: 'LOT, badges, achievements, RPG, arcade, self-care, dream, terminal',
    Creator: 'LOT Systems Corporation',
  },
})

const stream = fs.createWriteStream(OUT_FILE)
doc.pipe(stream)

// ── Color palette ────────────────────────────────────────────────
const C = {
  bg: '#06060e',
  text: '#dde8f0',
  accent: '#5599ff',
  gold: '#ffcc44',
  mythic: '#ff6644',
  ultra: '#ff44ff',
  legendary: '#ffcc44',
  epic: '#cc88ee',
  rare: '#7788ee',
  uncommon: '#66cc99',
  common: '#bbbbbb',
  dim: '#555566',
  border: '#222244',
  header: '#0d0d1a',
  dream: '#334477',
  cyan: '#44ccdd',
}

// ── Helpers ──────────────────────────────────────────────────────
function newPage() {
  doc.addPage()
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(C.bg)
}

function drawBg() {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(C.bg)
}

function hr(y, color) {
  doc.moveTo(55, y).lineTo(doc.page.width - 55, y)
    .strokeColor(color || C.border).lineWidth(0.5).stroke()
}

function h1(text, y) {
  doc.fontSize(17).fillColor(C.gold).font('Courier-Bold')
    .text(text, 55, y, { width: doc.page.width - 110 })
  return doc.y + 6
}

function h2(text, y) {
  doc.fontSize(12).fillColor(C.accent).font('Courier-Bold')
    .text(text, 55, y, { width: doc.page.width - 110 })
  return doc.y + 4
}

function h3(text, y) {
  doc.fontSize(9.5).fillColor(C.gold).font('Courier-Bold')
    .text(text, 55, y, { width: doc.page.width - 110 })
  return doc.y + 3
}

function body(text, y, color, indent) {
  doc.fontSize(8).fillColor(color || C.text).font('Courier')
    .text(text, 55 + (indent || 0), y, { width: doc.page.width - 110 - (indent || 0) })
  return doc.y + 2
}

function mono(text, y, color) {
  doc.fontSize(7.5).fillColor(color || C.text).font('Courier')
    .text(text, 55, y, { width: doc.page.width - 110 })
  return doc.y + 1
}

function badge(symbol, name, desc, msg, rarity, y) {
  const rc = C[rarity] || C.common
  doc.rect(55, y, 34, 18).fillColor('#111122').fill()
  doc.rect(55, y, 34, 18).strokeColor(rc).lineWidth(0.7).stroke()
  doc.fontSize(9).fillColor(rc).font('Courier-Bold')
    .text(symbol, 57, y + 4, { width: 30, align: 'center' })
  doc.fontSize(8.5).fillColor(rc).font('Courier-Bold')
    .text(name, 97, y + 1, { width: 200 })
  doc.fontSize(7).fillColor(C.dim).font('Courier')
    .text(rarity.toUpperCase(), 97, y + 11)
  doc.fontSize(7).fillColor(C.text).font('Courier')
    .text(desc, 97, y + 1, { width: doc.page.width - 162, align: 'right' })
  doc.fontSize(7).fillColor(C.dim).font('Courier')
    .text(msg, 55, doc.y + 3, { width: doc.page.width - 110 })
  return doc.y + 5
}

// ── COVER PAGE ───────────────────────────────────────────────────
drawBg()

doc.rect(38, 38, doc.page.width - 76, doc.page.height - 76)
  .strokeColor(C.border).lineWidth(1).stroke()
doc.rect(43, 43, doc.page.width - 86, doc.page.height - 86)
  .strokeColor(C.dream).lineWidth(0.4).stroke()

let cy = 90
doc.fontSize(10).fillColor(C.dim).font('Courier')
  .text('L O T   S Y S T E M S   C O R P O R A T I O N', 55, cy, { align: 'center', width: doc.page.width - 110 })

cy = 140
// Dream terminal ASCII art header
const art = [
  '  ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿  ',
  '                                              ',
  '   B A D G E S  &  A C H I E V E M E N T S  ',
  '         M A S T E R   C O D E X            ',
  '               v 3 3                         ',
  '                                              ',
  '  ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿ ∿  ',
]
doc.fontSize(11).fillColor(C.gold).font('Courier-Bold')
for (const line of art) {
  doc.text(line, 55, cy, { align: 'center', width: doc.page.width - 110 })
  cy = doc.y + 2
}

cy += 16
doc.fontSize(18).fillColor(C.cyan).font('Courier-Bold')
  .text('THE DREAM TERMINAL', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 8
doc.fontSize(10).fillColor(C.text).font('Courier')
  .text('RPG · ARCADE · SELF-CARE · SCI-FI · INNER OS', 55, cy, { align: 'center', width: doc.page.width - 110 })

cy = doc.y + 40
const bW = 340, bH = 110
const bX = (doc.page.width - bW) / 2
doc.rect(bX, cy, bW, bH).fillColor('#0a0a18').fill()
doc.rect(bX, cy, bW, bH).strokeColor(C.cyan).lineWidth(0.8).stroke()

doc.fontSize(8.5).fillColor(C.dim).font('Courier')
  .text('LOT-DREAM-TERMINAL:// boot sequence initiated', bX + 16, cy + 14, { width: bW - 32 })
doc.fontSize(8.5).fillColor(C.text).font('Courier')
  .text('"The unconscious mind is the oldest computer."', bX + 16, doc.y + 6, { width: bW - 32, align: 'center' })
doc.fontSize(8.5).fillColor(C.dim).font('Courier')
  .text('"Every dream is a maintenance cycle."', bX + 16, doc.y + 4, { width: bW - 32, align: 'center' })
doc.fontSize(8.5).fillColor(C.dim).font('Courier')
  .text('"Every morning is a boot sequence."', bX + 16, doc.y + 4, { width: bW - 32, align: 'center' })
doc.fontSize(11).fillColor(C.cyan).font('Courier-Bold')
  .text('>_  INSERT COIN TO DREAM  <_', bX + 16, doc.y + 14, { width: bW - 32, align: 'center' })

cy = doc.page.height - 155
hr(cy, C.border)
cy += 12
doc.fontSize(8).fillColor(C.dim).font('Courier')
  .text('Author: Vadik Marmeladov — CEO & Founder, LOT Systems', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 4
doc.fontSize(8).fillColor(C.dim).font('Courier')
  .text('© 2025–2026 LOT Systems. All rights reserved.', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 4
doc.fontSize(8).fillColor(C.dim).font('Courier')
  .text('v33 · August 2026 · 843 total badges · +31 new', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 4
doc.fontSize(8).fillColor(C.dim).font('Courier')
  .text('LOT® Founded 7 April 2016  ·  brand.lot-systems.com', 55, cy, { align: 'center', width: doc.page.width - 110 })

// ── PAGE 2: ACCOUNTING + DELTA ────────────────────────────────────
newPage()
let y = 55
y = h1('BADGE INVENTORY v33 — COMPLETE ACCOUNTING', y)
hr(y); y += 10

const catTable = [
  ['Milestone',              '22', 'Day-count milestones (unchanged)'],
  ['Time Easter Eggs',       '28', 'Time-of-day check-ins (unchanged)'],
  ['Calendar Easter',        '76', '+3 from v32 (70 → 76 with v21)'],
  ['Word Turns',            '276', '+12 from v32 (264 → 276 with v23)'],
  ['Behavioral',             '84', '+3 from v32 (81 → 84 with v20)'],
  ['Achievement RPG',       '126', '+6 from v32 (120 → 126 with v21)'],
  ['Mastery Tiers',          '92', '+4 from v32 (88 → 92 with v23)'],
  ['Secret Boss',            '86', '+3 from v32 (83 → 86 with v20)'],
]

doc.rect(55, y, doc.page.width - 110, 14).fillColor(C.header).fill()
doc.fontSize(7.5).fillColor(C.accent).font('Courier-Bold')
  .text('CATEGORY', 60, y + 3, { width: 200 })
  .text('COUNT', 265, y + 3, { width: 40, align: 'right' })
  .text('NOTES', 315, y + 3, { width: doc.page.width - 380 })
y += 16

for (const [cat, count, note] of catTable) {
  const isNew = note.includes('+')
  const fg = isNew ? C.gold : C.text
  doc.rect(55, y, doc.page.width - 110, 12).fillColor(isNew ? '#12120a' : '#0d0d15').fill()
  doc.rect(55, y, doc.page.width - 110, 12).strokeColor(C.border).lineWidth(0.3).stroke()
  doc.fontSize(7.5).fillColor(fg).font(isNew ? 'Courier-Bold' : 'Courier')
    .text(cat, 60, y + 2, { width: 200 })
    .text(count, 265, y + 2, { width: 40, align: 'right' })
  doc.fontSize(7).fillColor(C.dim).font('Courier')
    .text(note, 315, y + 3, { width: doc.page.width - 380 })
  y += 13
}

y += 10
doc.rect(55, y, doc.page.width - 110, 32).fillColor('#0a0a18').fill()
doc.rect(55, y, doc.page.width - 110, 32).strokeColor(C.gold).lineWidth(0.8).stroke()
doc.fontSize(9).fillColor(C.gold).font('Courier-Bold')
  .text('v32 TOTAL: 812    v33 NEW: +31    v33 TOTAL: 843', 55, y + 6, { align: 'center', width: doc.page.width - 110 })
doc.fontSize(7.5).fillColor(C.dim).font('Courier')
  .text('WORD TURNS v1–v23: 276      WORD TURN ENGINES: 23', 55, y + 18, { align: 'center', width: doc.page.width - 110 })

y += 48
y = h2('DELTA FROM v32 — THE DREAM TERMINAL (+31)', y)
y += 4

const delta = [
  ['Word Turn v23',    '+12', 'dream_boot / sleep_mode / subconscious_load / night_process / inner_prompt / rest_protocol / vision_render / deep_sleep_core / wake_sequence / shadow_data / lucid_terminal / dream_recall'],
  ['Calendar EE v21', ' +3', 'morpheus_day (Nov 17) / sandman_day (Jun 16) / dream_solstice (Jun 21 solstice)'],
  ['Behavioral v20',  ' +3', 'dream_session (3+ v23 words in journal) / sleep_log (before 07:00 AM) / night_terminal (02:00–04:00 AM)'],
  ['Achievement v21', ' +6', 'dream_entry / dream_class / dream_complete / terminal_arc / twenty_three_arc / dream_opus'],
  ['Mastery v23',     ' +4', 'dream_archive (1000+ days) / night_library (200k+ words) / terminal_age (6+ years) / twenty_three_registers [COSMIC]'],
  ['Secret Boss v20', ' +3', 'morpheus_key [RARE] / sandman_word [EPIC] / jung_shadow [MYTHIC]'],
]
for (const [name, count, detail] of delta) {
  doc.fontSize(8).fillColor(C.cyan).font('Courier-Bold')
    .text(name + '  ' + count, 60, y)
  y = doc.y + 2
  doc.fontSize(7.5).fillColor(C.dim).font('Courier')
    .text(detail, 60, y, { width: doc.page.width - 120 })
  y = doc.y + 6
}

// ── PAGE 3: WORD TURN v23 BADGES ─────────────────────────────────
newPage(); y = 55
y = h1('WORD TURN ENGINE v23 — THE DREAM TERMINAL', y)
hr(y); y += 6
mono('Write these words in any journal or memory entry to unlock:', y, C.dim)
y = doc.y + 10

const wt23 = [
  ['∿·∘',   'Dream Boot',       'UNCOMMON', '"dream/dreamed/dreaming"',            '↳ Inner terminal is running. Dream logged. ∿·∘'],
  ['∼∼∼',   'Sleep Mode',       'UNCOMMON', '"sleep/sleeping/slept"',              '↳ Power-down acknowledged. Rest data received. ∼∼∼'],
  ['░·▓',   'Subconscious Load','RARE',     '"subconscious/unconscious"',          '↳ Background process accessed. ░·▓'],
  ['◉·∿',   'Night Process',    'RARE',     '"night/midnight/dark hours"',         '↳ The night shift runs the deepest jobs. ◉·∿'],
  ['>_·◈',  'Inner Prompt',     'RARE',     '"inner voice/inner world/inner self"', '↳ The terminal accepted your input. >_·◈'],
  ['∘·∼·∘', 'Rest Protocol',    'UNCOMMON', '"rest/resting/rested"',               '↳ Recovery cycle confirmed. System charges. ∘·∼·∘'],
  ['◈·∿·◈', 'Vision Render',    'EPIC',     '"vision/visions/dream vision"',       '↳ The render pipeline surfaced something real. ◈·∿·◈'],
  ['█·∼·█', 'Deep Sleep Core',  'EPIC',     '"deep sleep/dreamless/void rest"',    '↳ Core memory defragged. The void was productive. █·∼·█'],
  ['→·∘',   'Wake Sequence',    'UNCOMMON', '"woke up/waking/awakening"',          '↳ Boot complete. System online. →·∘'],
  ['▓·□',   'Shadow Data',      'RARE',     '"nightmare/night terror/shadow dream"','↳ Error log reviewed. The shadow has a record now. ▓·□'],
  ['>_·●',  'Lucid Terminal',   'LEGENDARY','"lucid/lucid dream/lucid dreaming"',  '↳ Admin access granted. You were IN the terminal. >_·●'],
  ['∿·●·∿', 'Dream Recall',     'RARE',     '"remembered a dream/dream recall"',   '↳ Data recovered from the overnight run. ∿·●·∿'],
]

for (const [sym, name, rarity, trigger, msg] of wt23) {
  y = badge(sym, name, trigger, msg, rarity, y)
  y += 4
}

// ── PAGE 4: CALENDAR + BEHAVIORAL + SECRET BOSS ───────────────────
newPage(); y = 55
y = h1('CALENDAR EASTER EGGS v21 — THE NIGHT CALENDAR', y)
hr(y); y += 6
mono('Check-in on these dates to unlock. Only one award per year per badge.', y, C.dim)
y = doc.y + 10

const cal21 = [
  ['∿·◉', 'Morpheus Day',   'EPIC',   'Nov 17 — The Matrix (1999)',     '↳ Morpheus offered the red pill. You are already awake. ∿·◉'],
  ['◆·∿', 'Sandman Day',    'RARE',   'Jun 16 — First Sandman issue (1989)', '↳ Gaiman built the library of dreams. You just checked it out. ◆·∿'],
  ['∼·∞', 'Dream Solstice', 'RARE',   'Jun 21 — Summer Solstice (shortest night)', '↳ The night was short but the dream was long. ∼·∞'],
]
for (const [sym, name, rarity, trigger, msg] of cal21) {
  y = badge(sym, name, trigger, msg, rarity, y)
  y += 4
}

y += 10
y = h1('BEHAVIORAL BADGES v20 — SLEEP PATTERNS', y)
hr(y); y += 6
mono('Automatically detected from check-in timing and journal content.', y, C.dim)
y = doc.y + 10

const beh20 = [
  ['∿·●·∿', 'Dream Session',    'RARE', '3+ Dream Terminal words in one journal entry',   '↳ The dream had vocabulary. The terminal was active. ∿·●·∿'],
  ['∼·◈',   'Sleep Log',        'RARE', 'Check-in before 07:00 AM (first waking hour)',   '↳ First morning signal. The boot sequence is logged. ∼·◈'],
  ['◉·□',   'Night Terminal',   'RARE', 'Check-in 02:00–04:00 AM (deep night process)',   '↳ 3 AM — the heaviest background jobs run now. ◉·□'],
]
for (const [sym, name, rarity, trigger, msg] of beh20) {
  y = badge(sym, name, trigger, msg, rarity, y)
  y += 4
}

y += 10
y = h1('SECRET BOSS BADGES v20 — THE DREAM VAULT', y)
hr(y); y += 6

doc.rect(55, y, doc.page.width - 110, 16).fillColor('#1a0a0a').fill()
doc.rect(55, y, doc.page.width - 110, 16).strokeColor(C.mythic).lineWidth(0.6).stroke()
doc.fontSize(8).fillColor(C.mythic).font('Courier-Bold')
  .text('[ HIDDEN ] These badges are not listed in-app. Discover by writing.', 60, y + 4, { width: doc.page.width - 120 })
y += 20

const boss20 = [
  ['∿·◆·∿', 'Morpheus Key',   'RARE',   '"morpheus/the matrix/red pill/bluepill"',          '↳ Only Morpheus knew what the construct really was. You named it. ∿·◆·∿'],
  ['◆·∞·◆', 'Sandman Word',   'EPIC',   '"sandman/dream lord/endless/gaiman dream"',        '↳ Dream is the oldest Endless. His library holds all unwritten books. ◆·∞·◆'],
  ['∞·▓·∞', 'Jung Shadow',    'MYTHIC', '"jung/jungian/shadow archetype/collective unconscious"', '↳ The shadow is the part of the self the ego refuses. You named it. MYTHIC. ∞·▓·∞'],
]
for (const [sym, name, rarity, trigger, msg] of boss20) {
  y = badge(sym, name, trigger, msg, rarity, y)
  y += 6
}

// ── PAGE 5: ACHIEVEMENTS + MASTERY ───────────────────────────────
newPage(); y = 55
y = h1('ACHIEVEMENT RPG v21 — DREAM CLASS', y)
hr(y); y += 6

const rpg21 = [
  ['∘·∿',   'Dream Entry',        'COMMON',    'Any 1 Word Turn v23 badge earned',           '↳ The terminal has a first entry. ∘·∿'],
  ['≈·∿',   'Dream Class',        'UNCOMMON',  'Any 5 Word Turn v23 badges earned',          '↳ Class registered. The dream vocabulary expands. ≈·∿'],
  ['≋·∿',   'Dream Complete',     'LEGENDARY', 'All 12 Word Turn v23 badges earned',         '↳ All twelve terminals accessed. The archive is full. ≋·∿'],
  ['●·∿',   'Terminal Arc',       'LEGENDARY', 'dream_complete + all 3 Calendar v21 badges',  '↳ Word turn + calendar: the full dream arc is complete. ●·∿'],
  ['◈·●·∿', 'Twenty-Three Arc',   'LEGENDARY', '1 badge from each Word Turn v1–v23',          '↳ All 23 engines unlocked. The full lexicon of self-care. ◈·●·∿'],
  ['●·◉·∿', 'Dream Opus',         'LEGENDARY', 'dream_complete + dream_session behavioral',   '↳ Spoke and logged. The opus is compiled. ●·◉·∿'],
]
for (const [sym, name, rarity, trigger, msg] of rpg21) {
  y = badge(sym, name, trigger, msg, rarity, y)
  y += 5
}

y += 10
y = h1('MASTERY TIER v23 — THE NIGHT ARCHIVE', y)
hr(y); y += 6

const mastery23 = [
  ['∿·∞·∿',    'Dream Archive',        'EPIC',      '1,000+ distinct calendar check-in days',     '↳ A thousand days of presence. The archive is deep. ∿·∞·∿'],
  ['●·∞·●',    'Night Library',        'LEGENDARY', '200,000+ total journal words',               '↳ Two hundred thousand words. This is a library now. ●·∞·●'],
  ['╔≋╗·●',    'Terminal Age',         'LEGENDARY', 'Account age >= 6 years (2,190+ days)',        '↳ Six years. The terminal has earned its permanence. ╔≋╗·●'],
  ['◈·◈·●·∿',  'Twenty-Three Registers','COSMIC',   '1 badge from all 23 Word Turn engines',       '↳ 23 vocabularies. The self speaks them all. COSMIC. ◈·◈·●·∿'],
]
for (const [sym, name, rarity, trigger, msg] of mastery23) {
  y = badge(sym, name, trigger, msg, rarity, y)
  y += 6
}

// ── PAGE 6: ASCII GALLERY + FLAVOR TEXT ──────────────────────────
newPage(); y = 55
y = h1('THE DREAM TERMINAL — ASCII GALLERY', y)
hr(y); y += 10

const gallery = [
  ['BOOT',      '∿·∘',   'UNCOMMON',  'Dream Boot',       '"The inner terminal is running. You logged a dream. The OS noted it."'],
  ['LUCID',     '>_·●',  'LEGENDARY', 'Lucid Terminal',   '"Admin access granted. You were IN the terminal."'],
  ['MYTHIC',    '∞·▓·∞', 'MYTHIC',    'Jung Shadow',      '"The Shadow is the part of the self the ego refuses to own. You named it."'],
  ['EPIC',      '◆·∞·◆', 'EPIC',      'Sandman Word',     '"Morpheus, the Dream Lord, is the Endless. Gaiman made dreams a library."'],
  ['COSMIC',    '◈·◈·●·∿','COSMIC',   '23 Registers',     '"23 vocabularies. Water. Arcade. Radio. Biology. Codex. Dream. One terminal."'],
]

for (const [label, sym, rarity, name, quote] of gallery) {
  const rc = C[rarity.toLowerCase()] || C.common
  doc.rect(55, y, doc.page.width - 110, 36).fillColor('#0a0a18').fill()
  doc.rect(55, y, doc.page.width - 110, 36).strokeColor(rc).lineWidth(0.7).stroke()
  doc.fontSize(7).fillColor(C.dim).font('Courier')
    .text('[ ' + label + ' ]', 64, y + 5)
  doc.fontSize(12).fillColor(rc).font('Courier-Bold')
    .text(sym, 64, y + 14, { width: 80 })
  doc.fontSize(8.5).fillColor(rc).font('Courier-Bold')
    .text(name + '  [' + rarity + ']', 150, y + 7, { width: doc.page.width - 220 })
  doc.fontSize(7.5).fillColor(C.text).font('Courier')
    .text(quote, 150, y + 18, { width: doc.page.width - 220 })
  y += 42
}

y += 8
y = h2('FLAVOR TEXT — THE DREAM TERMINAL', y)
y += 4

const flavors = [
  ['"Dreams are the royal road to the unconscious." — Freud',
   'Every dream log is data from the inner OS. Attend to it.'],
  ['"Who looks outside, dreams; who looks inside, awakes." — Jung',
   'The Shadow is not the enemy — it runs without root access. Name it.'],
  ['"I am the Prince of Stories." — Gaiman (Sandman)',
   'Your journal is the library of all the books you almost wrote.'],
  ['"What if I told you everything you know is a dream?" — Morpheus',
   'Writing it down is already the red pill.'],
  ['"The unconscious processes 11 million bits/sec. Consciousness: 50." — Baumeister',
   'Let the results surface. Self-care is the interface.'],
]
for (const [attr, text] of flavors) {
  doc.fontSize(7.5).fillColor(C.cyan).font('Courier-Bold')
    .text(attr, 55, y, { width: doc.page.width - 110 })
  y = doc.y + 1
  doc.fontSize(7.5).fillColor(C.dim).font('Courier')
    .text(text, 55, y, { width: doc.page.width - 110 })
  y = doc.y + 7
}

// ── PAGE 7: CUMULATIVE ENGINE TABLE ─────────────────────────────
newPage(); y = 55
y = h1('WORD TURN ENGINES — CUMULATIVE TABLE (v1–v23)', y)
hr(y); y += 10

doc.rect(55, y, doc.page.width - 110, 14).fillColor(C.header).fill()
doc.fontSize(7.5).fillColor(C.accent).font('Courier-Bold')
  .text('ENGINE', 60, y + 3, { width: 60 })
  .text('CODEX VER', 125, y + 3, { width: 70 })
  .text('THEME', 205, y + 3, { width: 200 })
  .text('BADGES', doc.page.width - 120, y + 3, { width: 60, align: 'right' })
y += 15

const engines = [
  ['v1', 'v1', 'Core Water', '12'],
  ['v2', 'v2', 'Seasonal Signal', '12'],
  ['v3', 'v3', 'Architecture', '12'],
  ['v4', 'v4', 'Mountain / Earth', '12'],
  ['v5', 'v5', 'Storm / Weather', '12'],
  ['v6', 'v6', 'Fire / Energy', '12'],
  ['v7', 'v7', 'Tech / Digital', '12'],
  ['v8', 'v8', 'Space / Cosmos', '12'],
  ['v9', 'v9', 'Chemistry / Elements', '12'],
  ['v10', 'v10', 'Music / Sound', '12'],
  ['v11', 'v11', 'Alchemy / Transformation', '12'],
  ['v12', 'v12', 'Quantum / Physics', '12'],
  ['v13', 'v16', 'The Quantum Library', '12'],
  ['v14', 'v17', 'The Neon Arcade', '12'],
  ['v15', 'v18', 'The Midnight Radio', '12'],
  ['v16', 'v19', 'The Bio-Terminal', '12'],
  ['v17', 'v20', 'The Codex Reader', '12'],
  ['v18', 'v21', 'The Cyberspace Codex', '12'],
  ['v19', 'v22', "The Hero's Journey", '12'],
  ['v20', 'v33', 'The Dream Terminal ← NEW', '12'],
]

for (let i = 0; i < engines.length; i++) {
  const [eng, cv, theme, count] = engines[i]
  const isNew = theme.includes('NEW')
  const fg = isNew ? C.gold : C.text
  doc.rect(55, y, doc.page.width - 110, 12).fillColor(isNew ? '#12120a' : '#0d0d15').fill()
  doc.rect(55, y, doc.page.width - 110, 12).strokeColor(C.border).lineWidth(0.3).stroke()
  doc.fontSize(7.5).fillColor(fg).font(isNew ? 'Courier-Bold' : 'Courier')
    .text(eng, 60, y + 2, { width: 60 })
    .text('v' + cv, 125, y + 2, { width: 70 })
    .text(theme, 205, y + 2, { width: 200 })
    .text(count, doc.page.width - 120, y + 2, { width: 60, align: 'right' })
  y += 13
}

y += 12
doc.rect(55, y, doc.page.width - 110, 24).fillColor('#0a0a18').fill()
doc.rect(55, y, doc.page.width - 110, 24).strokeColor(C.cyan).lineWidth(0.8).stroke()
doc.fontSize(9).fillColor(C.cyan).font('Courier-Bold')
  .text('TOTAL WORD TURN BADGES: 276  (23 engines × 12)', 55, y + 7, { align: 'center', width: doc.page.width - 110 })
y += 34

y = h2('RARITY SYSTEM — FULL TABLE', y)
y += 6
const rarTable = [
  ['Common',    '·',        'First acts',      '#cccccc', 'dream_entry'],
  ['Uncommon',  '○',        'Days 1–14',       '#66cc99', 'dream_boot, sleep_mode, wake_sequence'],
  ['Rare',      '◐',        'Days 30+',        '#7788ee', 'shadow_data, dream_recall, night_process'],
  ['Epic',      '◆',        'Days 100+',       '#cc88ee', 'vision_render, deep_sleep_core, sandman_word'],
  ['Legendary', '✦',        'Days 365+',       '#ffcc44', 'lucid_terminal, dream_complete, night_library'],
  ['Mythic',    '◉',        'Hidden',          '#ff6644', 'jung_shadow'],
  ['Cosmic',    '◈·◈·●·∿', '23 engines',      '#ffffff', 'twenty_three_registers'],
]
for (const [name, sym, freq, color, ex] of rarTable) {
  const rc = C[name.toLowerCase()] || color
  doc.rect(55, y, doc.page.width - 110, 13).fillColor('#0d0d15').fill()
  doc.rect(55, y, doc.page.width - 110, 13).strokeColor(C.border).lineWidth(0.3).stroke()
  doc.fontSize(8).fillColor(rc).font('Courier-Bold')
    .text(name, 60, y + 2, { width: 80 })
  doc.fontSize(9).fillColor(rc).font('Courier')
    .text(sym, 145, y + 1, { width: 70 })
  doc.fontSize(7).fillColor(C.dim).font('Courier')
    .text(freq, 220, y + 3, { width: 80 })
    .text(ex, 310, y + 3, { width: doc.page.width - 375 })
  y += 14
}

// ── CLOSING PAGE ─────────────────────────────────────────────────
newPage()
cy = 75
doc.rect(38, 38, doc.page.width - 76, doc.page.height - 76)
  .strokeColor(C.border).lineWidth(1).stroke()

doc.fontSize(14).fillColor(C.cyan).font('Courier-Bold')
  .text('C L O S I N G   T R A N S M I S S I O N', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 30

const cW = 380
const cX = (doc.page.width - cW) / 2
doc.rect(cX, cy, cW, 180).fillColor('#0a0a18').fill()
doc.rect(cX, cy, cW, 180).strokeColor(C.cyan).lineWidth(0.8).stroke()

doc.fontSize(8.5).fillColor(C.dim).font('Courier')
  .text('LOT-DREAM-TERMINAL:// shutdown initiated', cX + 20, cy + 16, { width: cW - 40, align: 'center' })
cy = doc.y + 12
doc.fontSize(8.5).fillColor(C.text).font('Courier')
  .text('"The unconscious mind is the oldest computer."', cX + 20, cy, { width: cW - 40, align: 'center' })
cy = doc.y + 4
doc.fontSize(8.5).fillColor(C.dim).font('Courier')
  .text('"Every night, it runs a full maintenance cycle."', cX + 20, cy, { width: cW - 40, align: 'center' })
cy = doc.y + 4
doc.fontSize(8.5).fillColor(C.dim).font('Courier')
  .text('"Every morning, it reports to whoever was listening."', cX + 20, cy, { width: cW - 40, align: 'center' })
cy = doc.y + 18
doc.fontSize(10).fillColor(C.cyan).font('Courier')
  .text('∿·∘  →  ∼∼∼  →  ◈·∿·◈  →  >_·●', cX + 20, cy, { width: cW - 40, align: 'center' })
cy = doc.y + 6
doc.fontSize(10).fillColor(C.dim).font('Courier')
  .text('boot  →  sleep  →  vision  →  lucid', cX + 20, cy, { width: cW - 40, align: 'center' })
cy = doc.y + 18
doc.fontSize(11).fillColor(C.gold).font('Courier-Bold')
  .text('>_  LEVEL UP — SWEET DREAMS  <_', cX + 20, cy, { width: cW - 40, align: 'center' })
cy = doc.y + 14
doc.fontSize(8).fillColor(C.dim).font('Courier')
  .text('v33 · 843 badges · 23 word turn engines', cX + 20, cy, { width: cW - 40, align: 'center' })

cy = doc.page.height - 110
hr(cy, C.border)
cy += 12
doc.fontSize(7.5).fillColor(C.dim).font('Courier')
  .text('© 2025–2026 LOT Systems. All rights reserved.', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 4
doc.fontSize(7.5).fillColor(C.dim).font('Courier')
  .text('LOT® Founded 7 April 2016  ·  brand.lot-systems.com', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 4
doc.fontSize(7.5).fillColor(C.cyan).font('Courier-Bold')
  .text('MASTER CODEX v33 · THE DREAM TERMINAL · 843 BADGES', 55, cy, { align: 'center', width: doc.page.width - 110 })

// ── FINALIZE ──────────────────────────────────────────────────────
doc.end()

stream.on('finish', () => {
  const stats = require('fs').statSync(OUT_FILE)
  console.log('PDF generated: ' + OUT_FILE)
  console.log('File size: ' + (stats.size / 1024).toFixed(1) + ' KB')
})

stream.on('error', (err) => {
  console.error('PDF error:', err)
  process.exit(1)
})
