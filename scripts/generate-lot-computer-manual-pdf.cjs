/**
 * LOT SYSTEMS CORPORATION
 * PDF Generator: LOT® Computer Owner's Manual (v1.0 pilot unit)
 * Uses pdfkit (devDependency). Source content mirrors
 * docs/technical/LOT-COMPUTER-MANUAL.md — keep both in sync by hand.
 */
'use strict'

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '..', 'docs', 'technical', 'pdf')
const OUT_FILE = path.join(OUT_DIR, 'LOT-COMPUTER-MANUAL-v1.pdf')
fs.mkdirSync(OUT_DIR, { recursive: true })

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
  info: {
    Title: "LOT® Computer — Owner's Manual (v1.0 Pilot Unit)",
    Author: 'Vadik Marmeladov — LOT Systems',
    Subject: 'LOT Computer hardware owner manual',
    Keywords: 'LOT, COSMO, hardware, computer, manual, pilot unit',
    Creator: 'LOT Systems Corporation',
  },
})

const stream = fs.createWriteStream(OUT_FILE)
doc.pipe(stream)

const COLORS = {
  text: '#1a1a1a',
  muted: '#555555',
  rule: '#cccccc',
  accent: '#0a3d62',
}

const PAGE_WIDTH = doc.page.width - doc.page.margins.left - doc.page.margins.right

function rule() {
  doc.moveDown(0.3)
  doc
    .strokeColor(COLORS.rule)
    .lineWidth(0.75)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()
  doc.moveDown(0.6)
}

function h1(txt) {
  doc.fillColor(COLORS.accent).font('Helvetica-Bold').fontSize(20).text(txt)
  doc.moveDown(0.4)
}

function h2(txt) {
  doc.moveDown(0.8)
  doc.fillColor(COLORS.accent).font('Helvetica-Bold').fontSize(13).text(txt.toUpperCase())
  rule()
}

function body(txt) {
  doc.fillColor(COLORS.text).font('Helvetica').fontSize(10.5).text(txt, { width: PAGE_WIDTH, lineGap: 3 })
  doc.moveDown(0.5)
}

function bullet(txt) {
  doc
    .fillColor(COLORS.text)
    .font('Helvetica')
    .fontSize(10.5)
    .text(`•  ${txt}`, { width: PAGE_WIDTH, indent: 0, lineGap: 3 })
}

function specRow(label, value) {
  const labelWidth = 130
  const y = doc.y
  doc.fillColor(COLORS.muted).font('Helvetica-Bold').fontSize(9.5).text(label, doc.page.margins.left, y, { width: labelWidth })
  doc.fillColor(COLORS.text).font('Helvetica').fontSize(9.5).text(value, doc.page.margins.left + labelWidth, y, { width: PAGE_WIDTH - labelWidth })
  doc.moveDown(0.35)
}

// ── Cover ────────────────────────────────────────────────────────
doc.fillColor(COLORS.muted).font('Helvetica').fontSize(9).text('LOT SYSTEMS CORPORATION', { align: 'right' })
doc.moveDown(6)
doc.fillColor(COLORS.accent).font('Helvetica-Bold').fontSize(30).text('LOT® Computer', { align: 'left' })
doc.fillColor(COLORS.text).font('Helvetica').fontSize(15).text("Owner's Manual — v1.0 Pilot Unit", { align: 'left' })
doc.moveDown(1)
doc.fillColor(COLORS.muted).font('Helvetica').fontSize(10).text('A flat stainless steel terminal for one message at a time, from your LOT® account.', { width: PAGE_WIDTH * 0.7 })
doc.moveDown(4)
doc.fillColor(COLORS.muted).fontSize(9).text('brand.lot-systems.com  ·  40mm x 40mm x 6.8mm  ·  316L stainless steel', { align: 'left' })
doc.addPage()

// ── What this is ─────────────────────────────────────────────────
h1('What This Is')
body(
  'LOT® Computer is a flat stainless steel terminal that sits on your desk and shows you exactly one thing, at exactly the right moment: a short line of text from your LOT® account. No app to check. No feed to scroll. When there is nothing to say, the screen is dark.'
)

h2('In the Box')
;[
  'LOT® Computer unit (40mm x 40mm x 6.8mm, 316L stainless steel)',
  'LOT® Plinth wireless charging base',
  'USB-C cable (charges the Plinth, not the unit directly)',
  'This manual',
].forEach(bullet)
doc.moveDown(0.5)

h2('Setup')
;[
  '1. Place the unit polished-side-down on the LOT® Plinth. A single LED ring lights briefly to confirm it is charging.',
  '2. On your phone or computer, sign in to your LOT® Usership account and go to lot-systems.com/computer/setup.',
  '3. Follow the on-screen pairing steps. Under two minutes, and only needed again if you change WiFi networks.',
  '4. Once paired, place the unit anywhere on your desk within WiFi range.',
].forEach((t) => body(t))

// ── Using it ─────────────────────────────────────────────────────
doc.addPage()
h1('Using It')

h2('The Screen')
body(
  'Shows a short message when your LOT® account has something for you — a routine reminder, a weather note, a badge — and returns to dark on its own after a few seconds. It is not a clock. Nothing is lost if you miss it; anything important is also in your LOT® account when you next open it.'
)

h2('The Copy Button')
body(
  'Press it while a message is showing, and that message is saved to your Log tab on lot-systems.com — automatically, with no typing. Press it when nothing is showing, and nothing happens. It has exactly one job.'
)

h2('Charging')
body(
  'Set it on the LOT® Plinth. A full charge from empty takes roughly 1.5-2 hours (measured target). Typical use between charges is several days.'
)

h2('About the Camera')
body(
  "LOT® Computer has a small camera on the same face as the screen, used for exactly one thing: telling whether someone is currently in front of the unit, so a message is timed to when you're actually there."
)
;[
  'The camera never sends a picture anywhere. Every frame is turned into a single yes/no answer on the device itself and discarded in the same instant — there is no path in the device software connecting the camera to the WiFi radio (see docs/technical/LOT-COMPUTER-FIRMWARE.md, Section 03, for engineers).',
  'The only thing that ever leaves the device because of the camera is one word — "present" or "not present" — timestamped, the same as a motion sensor would report.',
].forEach(bullet)

// ── Care + technical ─────────────────────────────────────────────
doc.addPage()
h1('Care')
;[
  'Wipe with a soft cloth. The polished face is bare stainless steel, not coated — fingerprints are normal, not a defect.',
  'Rated for dust and light splashes (IP54 target). Not for submersion, dishwashers, or the shower.',
  'No user-serviceable parts inside. The two-part shell is sealed at the factory; opening it voids the pilot-unit warranty.',
].forEach(bullet)
doc.moveDown(0.5)

h1('Technical Notes (Pilot Unit, v1.0)')
specRow('Dimensions', '40mm x 40mm x 6.8mm (see Hardware Plan §04.4 for the 5mm target vs. 6.8mm shipped)')
specRow('Material', '316L stainless steel, two-part construction')
specRow('Display', '1.28" round, 240x240')
specRow('Connectivity', 'WiFi 802.11 b/g/n, Bluetooth LE (setup only)')
specRow('Charging', 'Qi-class wireless, via LOT® Plinth')
specRow('Battery', '~350-400mAh, several days typical use')
specRow('Sensors', 'Temperature, humidity, pressure, VOC/air quality, motion/orientation, presence')
specRow('Certification', 'FCC/CE and UN38.3 in progress for this pilot batch — not yet general retail sale')

doc.moveDown(1)
h2('Support')
body('For setup help or questions about your pilot unit, use the same support channel as your LOT® Usership account at lot-systems.com.')

doc.moveDown(2)
doc.fillColor(COLORS.muted).font('Helvetica').fontSize(8.5).text('LOT SYSTEMS CORPORATION — brand.lot-systems.com', { align: 'center' })

doc.end()

stream.on('finish', () => {
  console.log(`Wrote ${OUT_FILE}`)
})
