/**
 * LOT SYSTEMS CORPORATION
 * PDF Generator: COSMO® Cube — Model S1 User Manual
 * Uses pdfkit (devDependency) — source content lives in
 * docs/manuals/LOT-COSMO-CUBE-USER-MANUAL.md; keep both in sync.
 */
'use strict'

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '..', 'docs', 'manuals')
const OUT_FILE = path.join(OUT_DIR, 'LOT-COSMO-CUBE-USER-MANUAL.pdf')

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
  info: {
    Title: 'COSMO Cube — Model S1 User Manual',
    Author: 'Vadim Marmeladov — LOT Systems',
    Subject: 'COSMO Cube hardware companion — setup and use',
    Keywords: 'LOT, COSMO, hardware, manual',
    Creator: 'LOT Systems Corporation',
  },
})

const stream = fs.createWriteStream(OUT_FILE)
doc.pipe(stream)

const COLORS = {
  bg: '#ffffff',
  text: '#161616',
  dim: '#666666',
  accent: '#1f4fbf',
  rule: '#cccccc',
}

const MARGIN_L = doc.page.margins.left
const CONTENT_W = doc.page.width - doc.page.margins.left - doc.page.margins.right

function hr(gap = 10) {
  doc.moveDown(0.3)
  const y = doc.y
  doc.moveTo(MARGIN_L, y).lineTo(MARGIN_L + CONTENT_W, y).strokeColor(COLORS.rule).lineWidth(0.75).stroke()
  doc.moveDown(0.6)
}

function h1(text) {
  doc.moveDown(1)
  doc.fillColor(COLORS.text).font('Helvetica-Bold').fontSize(20).text(text)
  hr()
}

function h2(text) {
  doc.moveDown(0.8)
  doc.fillColor(COLORS.accent).font('Helvetica-Bold').fontSize(13).text(text)
  doc.moveDown(0.3)
}

function body(text) {
  doc.fillColor(COLORS.text).font('Helvetica').fontSize(10.5).text(text, { align: 'left', lineGap: 3 })
  doc.moveDown(0.5)
}

function small(text) {
  doc.fillColor(COLORS.dim).font('Helvetica-Oblique').fontSize(9).text(text)
  doc.moveDown(0.5)
}

function tableRow(cols, widths, opts = {}) {
  const startX = MARGIN_L
  const startY = doc.y
  let x = startX
  doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10)
  cols.forEach((c, i) => {
    doc.fillColor(COLORS.text).text(c, x, startY, { width: widths[i], lineGap: 2 })
    x += widths[i]
  })
  doc.moveDown(0.4)
}

// ── Cover ────────────────────────────────────────────────────────
doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.bg)
doc.moveDown(6)
doc.fillColor(COLORS.accent).font('Helvetica-Bold').fontSize(30).text('COSMO', { continued: true })
doc.fillColor(COLORS.text).text('® Cube')
doc.fillColor(COLORS.dim).font('Helvetica').fontSize(14).text('Model S1 — "Signal Tile"')
doc.moveDown(2)
doc.fillColor(COLORS.text).font('Helvetica-Bold').fontSize(18).text('User Manual')
doc.moveDown(0.5)
doc.fillColor(COLORS.dim).font('Helvetica').fontSize(11).text('Version 1.0 — 2026-07-05')
doc.moveDown(3)
doc.fillColor(COLORS.text).font('Helvetica').fontSize(10.5).text(
  'A small companion tile, paired to your Operator account on lot-systems.com. ' +
  'One line on the screen. One button. One signal back to your LOG.',
  { width: CONTENT_W * 0.7 }
)
doc.moveDown(8)
doc.fillColor(COLORS.dim).fontSize(9).text('LOT Systems Corporation · Made in the USA · brand.lot-systems.com')

// ── 1. What This Is ──────────────────────────────────────────────
doc.addPage()
h1('1. What This Is')
body(
  'COSMO Cube is a small companion tile that sits on your desk, connected to your ' +
  'Operator account on lot-systems.com. It shows one short line at a time -- a fact, a ' +
  'nudge, a moment the system noticed -- and it has one button: Copy.'
)
body(
  'It does not replace your phone or your screen. It is not a notification firehose. ' +
  'It shows you one thing when there is one thing worth showing, and it lets you send ' +
  'that moment into your permanent LOG with a single press.'
)

// ── 2. In the Box ────────────────────────────────────────────────
h1('2. In the Box')
;['1x COSMO Cube (4cm x 4cm x 5-8mm, polished stainless front, matte stainless back)',
  '1x Qi wireless charging dock (USB-C powered)',
  '1x USB-C cable',
  'This manual'
].forEach((line) => body('  -  ' + line))

// ── 3. First Setup ───────────────────────────────────────────────
h1('3. First Setup')
;[
  'Place the Cube on the charging dock. The screen will show "PAIR ME".',
  'On your phone or laptop, open lot-systems.com/pair while signed in to your Operator account.',
  'Follow the on-screen instructions to connect to the Cube over Bluetooth and enter your ' +
  'WiFi network name and password. This goes directly from your browser to the Cube -- LOT ' +
  'servers never see your WiFi password.',
  'Go to Settings -> Devices on lot-systems.com and click "Pair a COSMO Cube". A 6-digit ' +
  'code will appear.',
  'Enter that code into the pairing page. The Cube will confirm and show its first line ' +
  'within a few seconds.',
].forEach((line, i) => body(`${i + 1}. ${line}`))

// ── 4. The Screen ────────────────────────────────────────────────
h1('4. The Screen')
body(
  'The Cube shows one short line, updated a few times a day -- never more often than ' +
  'roughly every 90 seconds, and only when there is something new to show. Examples:'
)
;['"Coffee time!"', '"Day 214. Steady."', '"Journal gap: 2 days."'].forEach((l) => body('  -  ' + l))
body(
  'The screen does not light up, buzz, or interrupt you. It simply holds whatever it is ' +
  'showing until you look at it -- the same way a real pager does, not the way a phone ' +
  'notification does.'
)

// ── 5. The Button ────────────────────────────────────────────────
doc.addPage()
h1('5. The Button -- Copy')
h2('Short press')
body('Copies the current line into your LOG tab on lot-systems.com as a new entry.')
h2('Long press (1 second)')
body('Skips the wait and pulls a fresh line right now.')
h2('Double press')
body('Takes a quick photo and attaches it to the same LOG entry.')
body('Every Copy press appears in your LOG tab within a few seconds, tagged so you can tell it came from the Cube rather than something you typed.')

// ── 6-11 ─────────────────────────────────────────────────────────
h1('6. Charging')
body(
  'Place the polished face down on the charging dock -- the small ceramic circle in the ' +
  'center of the polished face is the charging point; the rest of that face is solid ' +
  'stainless. Full charge takes under an hour. Typical use between charges is several ' +
  'days, depending on how often the screen updates and how far your Cube is from your ' +
  'WiFi router.'
)

h1('7. Do Not Disturb')
body('Turn the Cube face-down on your desk (screen facing the desk) and it goes quiet -- no screen updates, no network checks -- until you turn it back over.')

h1('8. Care')
;['Wipe the polished face with a soft cloth; avoid abrasive cleaners.',
  'The seam between the two stainless halves has a light splash-resistant gasket. The Cube is not submersible.',
  'There are no user-serviceable parts inside. Do not attempt to open the two halves -- doing so voids the pairing and may require a full re-pair.'
].forEach((line) => body('  -  ' + line))

h1('9. Resetting')
body('Hold the button for 10 seconds while the Cube is off the charger. The screen will show "RESET" and the Cube returns to its out-of-box, unpaired state. Repeat Section 3 to set it up again.')

h1('10. Firmware Updates')
body('The Cube checks for firmware updates automatically and applies them overnight while charging. You do not need to do anything. The current firmware version is shown on lot-systems.com under Settings -> Devices.')

h1('11. Support')
body('Questions about your Cube: reach LOT Systems support through your Operator account on lot-systems.com. Include your device name (shown in Settings -> Devices) so support can look up your specific unit\'s pairing and firmware state.')

doc.moveDown(2)
small('LOT Systems Corporation. Made in the USA. brand.lot-systems.com')

doc.end()

stream.on('finish', () => {
  console.log(`Written: ${OUT_FILE}`)
})
