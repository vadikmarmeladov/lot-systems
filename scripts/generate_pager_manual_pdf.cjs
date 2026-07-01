/**
 * LOT SYSTEMS CORPORATION
 * PDF Generator: LOT Pager — Hardware Manual v1
 * Uses pdfkit (devDependency) — pattern matches generate-badge-codex-pdf.cjs
 */
'use strict'

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '..', 'docs', 'hardware', 'pdf')
const OUT_FILE = path.join(OUT_DIR, 'LOT-PAGER-MANUAL.pdf')
fs.mkdirSync(OUT_DIR, { recursive: true })

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  info: {
    Title: 'LOT Pager — Hardware Manual v1',
    Author: 'Vadik Marmeladov — LOT Systems',
    Subject: 'Assembly + user manual for the LOT Pager hardware device',
    Keywords: 'LOT, hardware, pager, PCBWay, firmware, manual',
    Creator: 'LOT Systems Corporation',
  },
})

const stream = fs.createWriteStream(OUT_FILE)
doc.pipe(stream)

const COLORS = {
  bg: '#0a0a0a',
  text: '#e8e8e8',
  accent: '#4a9fff',
  gold: '#ffcc44',
  dim: '#666666',
  border: '#333333',
}

function page() {
  doc.addPage()
  drawPageBg()
}

function drawPageBg() {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.bg)
}

function hr(y, color = COLORS.border) {
  doc.moveTo(55, y).lineTo(doc.page.width - 55, y).strokeColor(color).lineWidth(0.5).stroke()
}

function heading1(text, y) {
  doc.fontSize(18).fillColor(COLORS.gold).font('Courier-Bold')
    .text(text, 55, y, { width: doc.page.width - 110 })
  return doc.y + 6
}

function heading2(text, y) {
  doc.fontSize(12).fillColor(COLORS.accent).font('Courier-Bold')
    .text(text, 55, y, { width: doc.page.width - 110 })
  return doc.y + 4
}

function body(text, y, color = COLORS.text) {
  doc.fontSize(8.5).fillColor(color).font('Courier')
    .text(text, 55, y, { width: doc.page.width - 110 })
  return doc.y + 6
}

function bullet(text, y) {
  doc.fontSize(8.5).fillColor(COLORS.text).font('Courier')
    .text(`  - ${text}`, 55, y, { width: doc.page.width - 110 })
  return doc.y + 3
}

// ── COVER PAGE ───────────────────────────────────────────────────
drawPageBg()
doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
  .strokeColor(COLORS.border).lineWidth(1).stroke()

let cy = 110
doc.fontSize(11).fillColor(COLORS.dim).font('Courier')
  .text('L O T   S Y S T E M S   C O R P O R A T I O N', 55, cy, { align: 'center', width: doc.page.width - 110 })

cy = 180
doc.fontSize(32).fillColor(COLORS.gold).font('Courier-Bold')
  .text('LOT PAGER', 55, cy, { align: 'center', width: doc.page.width - 110 })

cy = doc.y + 10
doc.fontSize(13).fillColor(COLORS.accent).font('Courier-Bold')
  .text('HARDWARE MANUAL — v1', 55, cy, { align: 'center', width: doc.page.width - 110 })

cy = doc.y + 40
const boxW = 340, boxH = 90
const boxX = (doc.page.width - boxW) / 2
doc.rect(boxX, cy, boxW, boxH).fillColor('#111111').fill()
doc.rect(boxX, cy, boxW, boxH).strokeColor(COLORS.gold).lineWidth(0.8).stroke()
doc.fontSize(9).fillColor(COLORS.text).font('Courier')
  .text('"One button. One line of text.', boxX + 20, cy + 22, { width: boxW - 40, align: 'center' })
  .text('One gesture to record it."', boxX + 20, doc.y + 3, { width: boxW - 40, align: 'center' })

cy = doc.page.height - 160
hr(cy)
cy += 12
doc.fontSize(8).fillColor(COLORS.dim).font('Courier')
  .text('Author: Vadik Marmeladov — S-2, LOT Systems', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 4
doc.fontSize(8).fillColor(COLORS.dim).font('Courier')
  .text('© 2025-2026 LOT Systems. All rights reserved.', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 4
doc.fontSize(8).fillColor(COLORS.dim).font('Courier')
  .text('Classification: RESTRICTED // S-2 EYES · 2026-07-01', 55, cy, { align: 'center', width: doc.page.width - 110 })
cy = doc.y + 4
doc.fontSize(8).fillColor(COLORS.dim).font('Courier')
  .text('brand.lot-systems.com', 55, cy, { align: 'center', width: doc.page.width - 110 })

// ── PAGE 2: CONCEPT + FORM FACTOR ───────────────────────────────
page()
let y = 55
y = heading1('01 — WHAT THE PAGER IS', y)
hr(y); y += 10
y = body('LOT Pager is a physical, silent, one-line notification object. It receives ambient text from the LOT Memory Engine ("Coffee time.") and shows it on a small screen. No app, no scroll, no push alert — the screen updates silently and only shows the newest line when glanced at.', y)
y += 6
y = heading2('FORM FACTOR', y)
y = bullet('40mm x 40mm x 5mm flat silver square puck, two stainless steel shells', y)
y = bullet('BACK: mirror-polished stainless steel, no seams, no visible ports', y)
y = bullet('FRONT: brushed stainless steel — camera aperture, display window, COPY button', y)
y = bullet('5mm height is an aggressive target; 6-8mm is the engineering fallback', y)
y = bullet('Qi charging through steel requires a non-metal window over the coil', y)
y += 10
y = heading2('CORE ELECTRONICS', y)
y = bullet('MCU: ESP32-S3-WROOM-1 (WiFi + BLE, camera bus, deep sleep)', y)
y = bullet('Display: 0.96" monochrome OLED, SPI, single line of text', y)
y = bullet('Camera: Arducam OV2640 Mini, 2MP — QR/pairing scan + presence capture', y)
y = bullet('Weather: Bosch BME280 (temp / humidity / pressure)', y)
y = bullet('Charging: Qi receiver (BQ51013B-class) + external charging puck', y)
y = bullet('Battery: 3.7V ~150mAh LiPo pouch cell, 3.8mm thick', y)

// ── PAGE 3: BOM SUMMARY TABLE ───────────────────────────────────
page()
y = 55
y = heading1('02 — BILL OF MATERIALS (SUMMARY)', y)
hr(y); y += 10
doc.fontSize(8).fillColor(COLORS.dim).font('Courier')
  .text('Full links + sourcing detail in LOT-PAGER-BOM.md. Figures below are rough order of magnitude at 100-unit volume; PCB and enclosure lines require a real PCBWay quote before budget lock.', 55, y, { width: doc.page.width - 110 })
y = doc.y + 14

const rows = [
  ['MCU — ESP32-S3-WROOM-1-N8',        '$3.50 - 4.00'],
  ['Display — 0.96" mono OLED (SPI)',   '$3.00 - 5.00 (QUOTE)'],
  ['Camera — Arducam OV2640 Mini',      '$8.00 - 12.00 (QUOTE)'],
  ['Weather sensor — Bosch BME280',     '$1.50 - 2.50'],
  ['Qi receiver (IC + coil)',           '$2.50 - 4.00 (QUOTE)'],
  ['Button — SMD tactile, low profile', '$0.30 - 0.40'],
  ['Battery — LiPo 150mAh pouch',       '$2.00 - 3.00 (QUOTE)'],
  ['PCB fab + SMT assembly (PCBWay)',   'QUOTE'],
  ['CNC stainless shells x2 (PCBWay)',  'QUOTE'],
]

doc.rect(55, y, doc.page.width - 110, 16).fillColor('#1a1a1a').fill()
doc.fontSize(8).fillColor(COLORS.accent).font('Courier-Bold')
  .text('COMPONENT', 60, y + 4, { width: 300 })
  .text('x100 EST / UNIT', 380, y + 4, { width: 140, align: 'right' })
y += 18

rows.forEach(([name, price], i) => {
  if (i % 2 === 0) {
    doc.rect(55, y - 2, doc.page.width - 110, 15).fillColor('#141414').fill()
  }
  doc.fontSize(8).fillColor(COLORS.text).font('Courier')
    .text(name, 60, y + 1, { width: 300 })
    .text(price, 380, y + 1, { width: 140, align: 'right' })
  y += 15
})

y += 15
y = heading2('SENSOR GRADE INDEX (SGI) — AI-ASSISTED SELECTION', y)
y = body('Every sensor/camera/charging candidate is scored 0-100 across accuracy, power, footprint, and availability before lock — full scoring table in LOT-PAGER-BOM.md section 05.', y)

// ── PAGE 4: ROADMAP ──────────────────────────────────────────────
page()
y = 55
y = heading1('03 — ROADMAP', y)
hr(y); y += 10

const phases = [
  ['PHASE 0', 'Weeks 1-2', 'De-risk 5mm z-height; resolve Qi-through-steel window decision'],
  ['PHASE 1', 'Weeks 3-6', 'KiCad layout; 5-piece PCBWay prototype run; firmware bring-up'],
  ['PHASE 2', 'Weeks 7-8', 'Backend: device pairing + token auth, notification transport'],
  ['PHASE 3', 'Weeks 9-10', 'CNC stainless prototype x5; fit-check; Qi coil placement'],
  ['PHASE 4', 'Weeks 11-12', '5 hand-built units; S-2 dogfood; fix loop'],
  ['PHASE 5', 'Weeks 13-16', '100-unit PCBA + CNC run; final assembly; PDF manuals; ship'],
]

phases.forEach(([phase, weeks, desc]) => {
  doc.fontSize(9).fillColor(COLORS.gold).font('Courier-Bold')
    .text(phase, 55, y, { width: 70 })
  doc.fontSize(8).fillColor(COLORS.accent).font('Courier')
    .text(weeks, 130, y, { width: 80 })
  doc.fontSize(8).fillColor(COLORS.text).font('Courier')
    .text(desc, 215, y, { width: doc.page.width - 270 })
  y = doc.y + 10
})

y += 10
y = heading2('OPEN RISKS', y)
y = bullet('5mm total height — the hardest physical constraint in the spec', y)
y = bullet('Wireless charging through stainless steel needs a non-metal window', y)
y = bullet('No push/notification infrastructure exists server-side today — greenfield build', y)
y = bullet('No device-token auth path exists today — greenfield build', y)
y = bullet('RF (WiFi/BLE) range inside a metal enclosure needs its own antenna check', y)

y = doc.page.height - 90
hr(y)
y += 10
doc.fontSize(7.5).fillColor(COLORS.dim).font('Courier')
  .text('Companion documents: LOT-PAGER-SPEC.md, LOT-PAGER-BOM.md, LOT-PAGER-FIRMWARE.md, LOT-PAGER-API-CONNECTOR.md', 55, y, { width: doc.page.width - 110, align: 'center' })
y = doc.y + 4
doc.fontSize(7.5).fillColor(COLORS.dim).font('Courier')
  .text('AUTHORIZED BY: S-2 // VADIK MARMELADOV', 55, y, { width: doc.page.width - 110, align: 'center' })

doc.end()
stream.on('finish', () => {
  console.log(`PDF generated: ${OUT_FILE}`)
})
