/**
 * LOT SYSTEMS CORPORATION
 * COSMO® CIA Hardware Division
 * PDF Generator: COSMO® Cube hardware manual set
 * Renders docs/hardware/*.md into print-ready PDFs under docs/hardware/pdf/
 * Uses pdfkit (devDependency), same approach as scripts/generate-badge-codex-pdf.cjs
 */
'use strict'

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, '..', 'docs', 'hardware')
const OUT_DIR = path.join(SRC_DIR, 'pdf')

const MANUALS = [
  { file: 'COSMO-HARDWARE-REPORT-v1.md', title: 'COSMO® Cube — Hardware Computer Design Report', subject: 'Session report, roadmap, buying list summary' },
  { file: 'COSMO-DEVICE-SPEC-v1.md', title: 'COSMO® Cube — Device Specification', subject: 'Engineering specification v1.0' },
  { file: 'COSMO-BOM-v1.md', title: 'COSMO® Cube — Bill of Materials', subject: '100-unit production run, supplier links' },
  { file: 'COSMO-FIRMWARE-v1.md', title: 'COSMO® Cube — Firmware Architecture', subject: 'ESP32-S3 / ESP-IDF developer guide' },
  { file: 'COSMO-SOFTWARE-API-v1.md', title: 'COSMO® Cube — Software & LOT API Integration', subject: 'Backend connector, Log tab, notifications' },
  { file: 'COSMO-MANUFACTURING-v1.md', title: 'COSMO® Cube — Manufacturing Guide', subject: 'PCBWay production + QA' },
  { file: 'COSMO-CHARGER-SPEC-v1.md', title: 'COSMO® Cube — Wireless Charger Specification', subject: 'Qi receiver + transmitter pad' },
]

const COLORS = {
  text: '#1a1a1a',
  muted: '#5a5a5a',
  rule: '#c9c9c9',
  accent: '#0a4d8c',
  codeBg: '#f2f2f0',
  tableBg: '#f7f7f5',
}

const MARGIN = 55
const PAGE = { size: 'A4', margins: { top: 60, bottom: 55, left: MARGIN, right: MARGIN } }

function stripInlineMd(line) {
  return line
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s*/, '')
}

function isTableRow(line) {
  return /^\s*\|.*\|\s*$/.test(line)
}

function isTableSeparator(line) {
  return /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes('-')
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => stripInlineMd(c.trim()))
}

function ensureSpace(doc, needed) {
  const bottom = doc.page.height - doc.page.margins.bottom
  if (doc.y + needed > bottom) doc.addPage()
}

function renderTable(doc, rows) {
  const colCount = rows[0].length
  const usable = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const colWidth = usable / colCount
  const fontSize = 8
  doc.font('Helvetica').fontSize(fontSize)

  const rowHeights = rows.map((row) =>
    Math.max(
      ...row.map((cell) => doc.heightOfString(cell || '', { width: colWidth - 8 })),
      14
    ) + 8
  )

  rows.forEach((row, ri) => {
    const h = rowHeights[ri]
    ensureSpace(doc, h)
    const y0 = doc.y
    const x0 = doc.page.margins.left
    if (ri === 0) {
      doc.rect(x0, y0, usable, h).fill(COLORS.accent)
    } else if (ri % 2 === 0) {
      doc.rect(x0, y0, usable, h).fill(COLORS.tableBg)
    }
    row.forEach((cell, ci) => {
      doc
        .fillColor(ri === 0 ? '#ffffff' : COLORS.text)
        .font(ri === 0 ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(fontSize)
        .text(cell, x0 + ci * colWidth + 4, y0 + 4, { width: colWidth - 8 })
    })
    doc.y = y0 + h
  })
  doc.fillColor(COLORS.text).font('Helvetica')
  doc.moveDown(0.6)
}

function renderCodeBlock(doc, lines) {
  const usable = doc.page.width - doc.page.margins.left - doc.page.margins.right
  doc.font('Courier').fontSize(7.5)
  const height = lines.reduce((sum, l) => sum + doc.heightOfString(l || ' ', { width: usable - 16 }) + 1, 0) + 10
  ensureSpace(doc, Math.min(height, doc.page.height - doc.page.margins.top - doc.page.margins.bottom))
  const x0 = doc.page.margins.left
  const y0 = doc.y
  let cursorY = y0 + 6
  lines.forEach((l) => {
    const lh = doc.heightOfString(l || ' ', { width: usable - 16 })
    if (cursorY + lh > doc.page.height - doc.page.margins.bottom) {
      doc.rect(x0, y0, usable, cursorY - y0 + 4).fill(COLORS.codeBg)
      doc.addPage()
      doc.y = doc.page.margins.top
      cursorY = doc.y
    }
    doc.fillColor(COLORS.text).font('Courier').fontSize(7.5).text(l || ' ', x0 + 8, cursorY, { width: usable - 16 })
    cursorY = doc.y + 1
  })
  doc.y = cursorY + 6
  doc.font('Helvetica').fillColor(COLORS.text)
}

function renderMarkdown(doc, md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  // skip leading HTML comment block
  if (lines[i] && lines[i].trim().startsWith('<!--')) {
    while (i < lines.length && !lines[i].includes('-->')) i++
    i++
  }
  for (; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trimEnd()

    if (line.trim() === '') {
      doc.moveDown(0.4)
      continue
    }

    if (line.trim().startsWith('```')) {
      const block = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        block.push(lines[i])
        i++
      }
      renderCodeBlock(doc, block)
      continue
    }

    if (line.trim() === '---') {
      ensureSpace(doc, 20)
      doc.moveTo(doc.page.margins.left, doc.y + 6)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y + 6)
        .strokeColor(COLORS.rule)
        .lineWidth(0.5)
        .stroke()
      doc.moveDown(1)
      continue
    }

    if (isTableRow(line)) {
      const tableLines = [line]
      let j = i + 1
      while (j < lines.length && isTableRow(lines[j])) {
        tableLines.push(lines[j])
        j++
      }
      i = j - 1
      const rows = tableLines.filter((l) => !isTableSeparator(l)).map(splitTableRow)
      if (rows.length) renderTable(doc, rows)
      continue
    }

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length
      const text = stripInlineMd(line)
      if (level === 1) {
        ensureSpace(doc, 40)
        doc.font('Helvetica-Bold').fontSize(20).fillColor(COLORS.accent).text(text, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right })
        doc.moveDown(0.3)
      } else if (level === 2) {
        ensureSpace(doc, 28)
        doc.moveDown(0.3)
        doc.font('Helvetica-Bold').fontSize(14).fillColor(COLORS.text).text(text)
        doc.moveDown(0.15)
      } else {
        ensureSpace(doc, 20)
        doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.text).text(text)
        doc.moveDown(0.1)
      }
      doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.text)
      continue
    }

    if (/^(\s*)([-*]|\d+\.)\s+/.test(line) || /^\s*[□☐]\s+/.test(line)) {
      const indentMatch = line.match(/^(\s*)/)
      const indent = Math.min((indentMatch ? indentMatch[1].length : 0) * 4, 40)
      const text = stripInlineMd(line.replace(/^(\s*)([-*]|\d+\.)\s+/, '').replace(/^\s*[□☐]\s+/, '☐ '))
      doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.text)
      doc.text(`•  ${text}`, doc.page.margins.left + indent, undefined, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right - indent,
      })
      continue
    }

    if (line.trim().startsWith('>')) {
      const text = stripInlineMd(line.replace(/^\s*>\s?/, ''))
      doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(COLORS.muted).text(text, doc.page.margins.left + 10, undefined, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 10,
      })
      doc.font('Helvetica').fillColor(COLORS.text)
      continue
    }

    // plain paragraph
    doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.text).text(stripInlineMd(line))
  }
}

function drawCoverFooter(doc, meta) {
  const bottomY = doc.page.height - doc.page.margins.bottom + 15
  doc.fontSize(7.5).fillColor(COLORS.muted).font('Helvetica')
  doc.text(
    `COSMO® CIA — LOT Systems, Inc.  |  ${meta.title}  |  lot-systems.com`,
    doc.page.margins.left,
    bottomY,
    { width: doc.page.width - doc.page.margins.left - doc.page.margins.right, align: 'center' }
  )
}

function generateOne(meta) {
  const mdPath = path.join(SRC_DIR, meta.file)
  const md = fs.readFileSync(mdPath, 'utf8')
  const outFile = path.join(OUT_DIR, meta.file.replace(/\.md$/, '.pdf'))

  const doc = new PDFDocument({
    ...PAGE,
    bufferPages: true,
    info: {
      Title: meta.title,
      Author: 'Vadim Marmeladov — Inventor, COSMO® CIA, LOT Systems',
      Subject: meta.subject,
      Keywords: 'LOT, COSMO, Cube, hardware, PCBWay, ESP32-S3',
      Creator: 'LOT Systems Corporation',
    },
  })
  const stream = fs.createWriteStream(outFile)
  doc.pipe(stream)

  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.muted)
  doc.text('LOT SYSTEMS CORPORATION — COSMO® CIA HARDWARE DIVISION', { align: 'left' })
  doc.moveDown(1.2)

  renderMarkdown(doc, md)

  const range = doc.bufferedPageRange()
  for (let p = 0; p < range.count; p++) {
    doc.switchToPage(range.start + p)
    drawCoverFooter(doc, meta)
    doc
      .fontSize(7.5)
      .fillColor(COLORS.muted)
      .text(`${p + 1} / ${range.count}`, doc.page.width - doc.page.margins.right - 40, doc.page.height - doc.page.margins.bottom + 15, {
        width: 40,
        align: 'right',
      })
  }

  doc.end()
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(outFile))
    stream.on('error', reject)
  })
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
  for (const meta of MANUALS) {
    const outFile = await generateOne(meta)
    console.log(`Generated ${path.relative(process.cwd(), outFile)}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
