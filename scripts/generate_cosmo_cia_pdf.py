#!/usr/bin/env python3
"""
COSMO® CIA Hardware Manual — PDF Generator
LOT Systems | Terminal Sci-Fi aesthetic
Generates: docs/COSMO-CIA-Hardware-Manual.pdf
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

PAGE_W, PAGE_H = A4

# ── Palette (matches LOT Systems brand) ──────────────────────────────────────
BG      = HexColor('#0a0a0a')
PANEL   = HexColor('#111111')
BORDER  = HexColor('#1e1e1e')
SILVER  = HexColor('#c0c0c0')
STEEL   = HexColor('#8a9bb0')
GREEN   = HexColor('#00ff88')
CYAN    = HexColor('#00ccff')
AMBER   = HexColor('#ffcc00')
RED     = HexColor('#ff4444')
MUTED   = HexColor('#555555')
DIM     = HexColor('#333333')
TEXT    = HexColor('#dddddd')
SUBTEXT = HexColor('#888888')
WHITE   = HexColor('#ffffff')

OUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'docs', 'COSMO-CIA-Hardware-Manual.pdf')


# ── Canvas helpers ────────────────────────────────────────────────────────────

def draw_bg(c):
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

def draw_scanlines(c):
    c.saveState()
    c.setStrokeColor(HexColor('#ffffff'))
    c.setLineWidth(0.3)
    c.setStrokeAlpha(0.025)
    y = 0
    while y < PAGE_H:
        c.line(0, y, PAGE_W, y)
        y += 4
    c.restoreState()

def hdr(c, text, color=GREEN):
    mx = 20 * mm
    c.setFillColor(color)
    c.rect(mx, PAGE_H - 32 * mm, PAGE_W - 2 * mx, 10 * mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 11)
    c.setFillColor(BG)
    c.drawString(mx + 4 * mm, PAGE_H - 25 * mm, text)

def footer(c, page_num):
    c.setFont('Courier', 6)
    c.setFillColor(MUTED)
    c.drawCentredString(PAGE_W / 2, 10 * mm,
        f'COSMO® CIA Hardware Manual  ·  LOT Systems  ·  lot-systems.com  ·  page {page_num}')
    c.setStrokeColor(DIM)
    c.setLineWidth(0.5)
    c.line(20 * mm, 14 * mm, PAGE_W - 20 * mm, 14 * mm)

def panel(c, x, y, w, h, fill=PANEL, border=BORDER):
    c.setFillColor(fill)
    c.setStrokeColor(border)
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, 2, fill=1, stroke=1)

def row(c, x, y, w, label, value, label_col=SUBTEXT, val_col=TEXT):
    c.setFont('Courier', 7)
    c.setFillColor(label_col)
    c.drawString(x + 3 * mm, y + 2 * mm, label)
    c.setFillColor(val_col)
    c.drawRightString(x + w - 3 * mm, y + 2 * mm, value)

def section_title(c, x, y, text, color=CYAN):
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(color)
    c.drawString(x, y, '>> ' + text)
    c.setStrokeColor(color)
    c.setLineWidth(0.4)
    c.line(x, y - 1.5 * mm, x + 165 * mm, y - 1.5 * mm)


# ── Page 1 — Cover ─────────────────────────────────────────────────────────────

def page_cover(c, n):
    draw_bg(c)
    draw_scanlines(c)
    mx = 20 * mm

    # Outer border
    c.setStrokeColor(STEEL)
    c.setLineWidth(1)
    c.roundRect(mx, 20 * mm, PAGE_W - 2 * mx, PAGE_H - 40 * mm, 3, fill=0, stroke=1)

    # Device silhouette — simple square
    sx = PAGE_W / 2 - 25 * mm
    sy = PAGE_H - 90 * mm
    c.setFillColor(HexColor('#1a1a2a'))
    c.roundRect(sx, sy, 50 * mm, 50 * mm, 4, fill=1, stroke=0)
    c.setStrokeColor(SILVER)
    c.setLineWidth(1.5)
    c.roundRect(sx, sy, 50 * mm, 50 * mm, 4, fill=0, stroke=1)
    # Display window on silhouette
    c.setFillColor(HexColor('#0a0a0a'))
    c.roundRect(sx + 8 * mm, sy + 9 * mm, 34 * mm, 26 * mm, 2, fill=1, stroke=0)
    c.setStrokeColor(STEEL)
    c.setLineWidth(0.5)
    c.roundRect(sx + 8 * mm, sy + 9 * mm, 34 * mm, 26 * mm, 2, fill=0, stroke=1)
    # Notification text on display
    c.setFont('Courier-Bold', 7)
    c.setFillColor(GREEN)
    c.drawCentredString(PAGE_W / 2, sy + 27 * mm, 'Coffee time!')
    c.setFont('Courier', 5.5)
    c.setFillColor(MUTED)
    c.drawCentredString(PAGE_W / 2, sy + 22 * mm, 'via: memory_engine')
    # Camera dot
    c.setFillColor(STEEL)
    c.circle(sx + 45 * mm, sy + 43 * mm, 1.5 * mm, fill=1, stroke=0)
    # Button
    c.setFillColor(DIM)
    c.circle(PAGE_W / 2, sy + 4 * mm, 2.5 * mm, fill=1, stroke=0)
    c.setStrokeColor(MUTED)
    c.setLineWidth(0.5)
    c.circle(PAGE_W / 2, sy + 4 * mm, 2.5 * mm, fill=0, stroke=1)

    # Dimensions labels
    c.setFont('Courier', 6)
    c.setFillColor(STEEL)
    c.drawCentredString(PAGE_W / 2, sy - 5 * mm, '40mm × 40mm × 5mm  ·  316L Stainless Steel')

    # Title block
    c.setFont('Courier-Bold', 28)
    c.setFillColor(SILVER)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 150 * mm, 'COSMO')
    c.setFont('Courier-Bold', 14)
    c.setFillColor(CYAN)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 163 * mm, 'Connected Intelligence Architecture')

    c.setStrokeColor(STEEL)
    c.setLineWidth(0.5)
    c.line(mx + 20 * mm, PAGE_H - 170 * mm, PAGE_W - mx - 20 * mm, PAGE_H - 170 * mm)

    c.setFont('Courier', 8)
    c.setFillColor(SUBTEXT)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 178 * mm, 'Hardware Manual v1.0  ·  100-Unit Production Run')
    c.drawCentredString(PAGE_W / 2, PAGE_H - 185 * mm, 'Inventor: Vadik Marmeladov — COSMO® CIA  ·  LOT Systems')

    # Boot sequence block
    panel(c, mx + 10 * mm, PAGE_H - 250 * mm, PAGE_W - 2 * mx - 20 * mm, 48 * mm,
          fill=HexColor('#00000060'), border=DIM)
    boot = [
        ('> COSMO CIA v1.0 BOOT SEQUENCE', GREEN),
        ('> WiFi: connecting ...........', STEEL),
        ('> LOT API: authenticated .....', GREEN),
        ('> BME688 IAQ: calibrating ....', AMBER),
        ('> E-paper: initialized .......', GREEN),
        ('> Notifications: polling .....', CYAN),
        ('>', MUTED),
        ('> READY — Connected to lot-systems.com', GREEN),
    ]
    by = PAGE_H - 208 * mm
    for line, col in boot:
        c.setFont('Courier', 7)
        c.setFillColor(col)
        c.drawString(mx + 15 * mm, by, line)
        by -= 4.8 * mm

    c.setFont('Courier', 6.5)
    c.setFillColor(MUTED)
    c.drawCentredString(PAGE_W / 2, 28 * mm, '© 2026 LOT Systems Corporation  ·  All rights reserved')
    c.setFillColor(DIM)
    c.drawCentredString(PAGE_W / 2, 23 * mm, 'lot-systems.com  ·  brand.lot-systems.com')

    footer(c, n)


# ── Page 2 — Physical Specification ────────────────────────────────────────────

def page_physical(c, n):
    draw_bg(c)
    draw_scanlines(c)
    mx = 20 * mm
    hdr(c, '[ PHYSICAL SPECIFICATION :: 316L STAINLESS STEEL ]', STEEL)
    y = PAGE_H - 42 * mm

    # Two-column layout: Side A | Side B description
    col_w = (PAGE_W - 2 * mx - 4 * mm) / 2

    # Side A
    panel(c, mx, y - 70 * mm, col_w, 72 * mm, fill=HexColor('#0d0d14'), border=STEEL)
    c.setFont('Courier-Bold', 9)
    c.setFillColor(SILVER)
    c.drawString(mx + 4 * mm, y - 8 * mm, 'SIDE A — POLISHED FACE')
    # Mirror square
    c.setFillColor(HexColor('#e8e8e8'))
    c.roundRect(mx + col_w / 2 - 20 * mm, y - 46 * mm, 40 * mm, 40 * mm, 2, fill=1, stroke=0)
    c.setFont('Courier', 5.5)
    c.setFillColor(MUTED)
    c.drawCentredString(mx + col_w / 2, y - 52 * mm, 'Mirror polish Ra ≤ 0.1µm')
    c.drawCentredString(mx + col_w / 2, y - 57 * mm, 'No features / No text')
    c.drawCentredString(mx + col_w / 2, y - 62 * mm, '40mm × 40mm  ·  2.8mm thick')

    # Side B
    cx2 = mx + col_w + 4 * mm
    panel(c, cx2, y - 70 * mm, col_w, 72 * mm, fill=HexColor('#0d140d'), border=GREEN)
    c.setFont('Courier-Bold', 9)
    c.setFillColor(GREEN)
    c.drawString(cx2 + 4 * mm, y - 8 * mm, 'SIDE B — ACTIVE FACE')
    # Active face diagram
    fsx = cx2 + col_w / 2 - 18 * mm
    fsy = y - 48 * mm
    c.setFillColor(HexColor('#1a1a1a'))
    c.roundRect(fsx, fsy, 36 * mm, 36 * mm, 2, fill=1, stroke=0)
    c.setStrokeColor(STEEL)
    c.setLineWidth(0.5)
    c.roundRect(fsx, fsy, 36 * mm, 36 * mm, 2, fill=0, stroke=1)
    # Display
    c.setFillColor(HexColor('#0a0a0a'))
    c.roundRect(fsx + 3 * mm, fsy + 6 * mm, 23 * mm, 18 * mm, 1, fill=1, stroke=0)
    c.setStrokeColor(STEEL); c.setLineWidth(0.3)
    c.roundRect(fsx + 3 * mm, fsy + 6 * mm, 23 * mm, 18 * mm, 1, fill=0, stroke=1)
    # Camera
    c.setFillColor(MUTED)
    c.circle(fsx + 32 * mm, fsy + 31 * mm, 1.5 * mm, fill=1, stroke=0)
    # Button
    c.setFillColor(DIM)
    c.circle(fsx + 18 * mm, fsy + 2.5 * mm, 2 * mm, fill=1, stroke=0)
    # USB-C slot
    c.setFillColor(DIM)
    c.roundRect(fsx + 13.5 * mm, fsy - 1 * mm, 9 * mm, 2 * mm, 0.5, fill=1, stroke=0)
    # Labels
    c.setFont('Courier', 5)
    c.setFillColor(CYAN)
    c.drawString(fsx + 3 * mm, fsy + 3.5 * mm, 'Display: 1.54" e-paper')
    c.setFillColor(AMBER)
    c.drawString(fsx + 27 * mm, fsy + 33.5 * mm, 'CAM')
    c.setFillColor(STEEL)
    c.drawCentredString(fsx + 18 * mm, fsy - 4 * mm, 'USB-C (flash)')

    y -= 78 * mm

    # Spec table
    section_title(c, mx, y, 'DIMENSIONS & MATERIALS', SILVER)
    y -= 7 * mm

    specs = [
        ('Footprint', '40.0 × 40.0 mm'),
        ('Thickness', '5.0 mm total (2.8mm Side A + 0.2mm gasket + 1.7mm Side B + 0.3mm PCB stack)'),
        ('Weight', '~38 g (estimated)'),
        ('Body material', '316L Stainless Steel (2 CNC machined parts)'),
        ('Side A finish', 'Mirror polish — Ra ≤ 0.1µm — ASTM A967 passivation'),
        ('Side B finish', 'Satin brushed — Ra 0.8µm — ASTM A967 passivation'),
        ('Fasteners', '4× M1.6 × 4mm 316L SS recessed screws'),
        ('Seal', '0.3mm silicone gasket — IP52 dust/splash resistant'),
    ]
    for i, (lbl, val) in enumerate(specs):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        row(c, mx, y - 7 * mm, PAGE_W - 2 * mx, lbl, val[:72], SUBTEXT, TEXT)
        y -= 9 * mm

    y -= 6 * mm
    section_title(c, mx, y, 'SIDE B FEATURE POSITIONS', GREEN)
    y -= 7 * mm

    features = [
        ('E-paper display window', '28.0 × 38.0 mm', 'Center face, 6mm from top edge'),
        ('Camera aperture', 'ø3.5 mm', 'Top-right corner — 35mm from left, 3.5mm from top'),
        ('Copy button', 'ø7.0 mm recess, ø2.5 mm through', 'Bottom-center — 37mm from top'),
        ('Charge LED', 'ø1.2 mm light pipe', 'Bottom-left — 3mm from left, 37mm from top'),
        ('USB-C slot', '9.5 × 4.0 mm', 'Bottom edge center (flash/debug only)'),
    ]
    fw = (PAGE_W - 2 * mx) / 3
    for i, (feat, dim, pos) in enumerate(features):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        c.setFont('Courier', 6.5); c.setFillColor(TEXT)
        c.drawString(mx + 3 * mm, y - 4.5 * mm, feat)
        c.setFillColor(AMBER)
        c.drawString(mx + fw + 3 * mm, y - 4.5 * mm, dim)
        c.setFillColor(SUBTEXT)
        c.drawString(mx + 2 * fw + 3 * mm, y - 4.5 * mm, pos[:38])
        y -= 9 * mm

    footer(c, n)


# ── Page 3 — Bill of Materials ─────────────────────────────────────────────────

def page_bom(c, n):
    draw_bg(c)
    draw_scanlines(c)
    mx = 20 * mm
    hdr(c, '[ BILL OF MATERIALS :: 100-UNIT RUN ]', AMBER)
    y = PAGE_H - 42 * mm

    section_title(c, mx, y, 'KEY COMPONENTS', AMBER)
    y -= 7 * mm

    bom = [
        ('U1', 'ESP32-S3-MINI-1-N8', 'Espressif', 'LCSC C2913202', '$3.50', 'MCU: Xtensa LX7 240MHz, WiFi, BLE 5'),
        ('DISP1', 'GDEH0154D67', 'Good Display', 'Waveshare', '$4.20', '1.54" e-paper 200×200 BW SPI'),
        ('CAM1', 'OV2640 Module', 'OmniVision', 'LCSC / AliExpress', '$2.80', '2MP DVP, 24×24mm, flush lens'),
        ('U3', 'BME688', 'Bosch Sensortec', 'LCSC C2682739', '$7.55', 'T/H/P/Gas AI IAQ sensor (BSEC2)'),
        ('L1', 'WR135-30003', 'Würth Elektronik', 'Mouser 710-760308103', '$2.80', 'Qi RX coil 30mm, 0.6mm thick'),
        ('U4', 'STWLC68', 'STMicroelectronics', 'Mouser 511-STWLC68JR', '$2.20', 'Qi 5W WPC 1.2.4 receiver IC'),
        ('BAT1', 'LP303030', 'Generic LiPo', 'LCSC bulk', '$3.20', '200mAh 3.7V 30×30×3mm'),
        ('U5', 'BQ21040DBVR', 'Texas Instruments', 'Mouser 595-BQ21040DBVR', '$0.95', 'LiPo charger 500mA, SOT-23-5'),
        ('U6', 'MAX17048G+T', 'Analog Devices', 'Mouser 700-MAX17048G+T', '$1.60', 'Fuel gauge I2C 1% accuracy'),
        ('SW1', 'TS-1187A-B', 'XKB', 'LCSC C318937', '$0.08', '6mm tactile, 160gf, 0.5mm travel'),
        ('—', 'Passives bundle', 'Various', 'LCSC', '$0.50', 'Caps, resistors, ferrites, ESD'),
    ]

    # Table header
    c.setFillColor(HexColor('#1a1a1a'))
    c.rect(mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=1, stroke=0)
    cols = [('Ref', 12 * mm), ('Part', 38 * mm), ('Mfr', 30 * mm), ('Source', 32 * mm),
            ('$/unit', 12 * mm), ('Notes', 0)]
    c.setFont('Courier-Bold', 6.5)
    c.setFillColor(AMBER)
    cx = mx + 3 * mm
    for hd, wd in cols:
        c.drawString(cx, y - 4 * mm, hd)
        cx += wd
    y -= 9 * mm

    for i, (ref, part, mfr, src, price, notes) in enumerate(bom):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        c.setFont('Courier', 6)
        cx = mx + 3 * mm
        for val, wd, col in [
            (ref, 12*mm, AMBER), (part, 38*mm, WHITE), (mfr, 30*mm, SUBTEXT),
            (src, 32*mm, MUTED), (price, 12*mm, GREEN), (notes[:44], 0, SUBTEXT)
        ]:
            c.setFillColor(col)
            c.drawString(cx, y - 4.5 * mm, val)
            cx += wd
        y -= 9 * mm

    y -= 6 * mm
    section_title(c, mx, y, 'COST SUMMARY (100 UNITS)', GREEN)
    y -= 7 * mm

    costs = [
        ('PCBWay PCBA (110 boards, turnkey)', '$12.50/unit', '$1,375'),
        ('CNC Enclosure, 316L SS, 110 sets', '$22.60/unit', '$2,486'),
        ('Electronic components (BOM above)', '$24.50/unit', '$2,695'),
        ('Packaging (box, foam, cable, card)', '$2.60/unit', '$286'),
        ('Prototype run + validation (Phase 1)', '—', '$350'),
        ('Logistics + duties + contingency 15%', '—', '$1,089'),
    ]
    for i, (item, per_unit, total) in enumerate(costs):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        c.setFont('Courier', 6.5); c.setFillColor(TEXT)
        c.drawString(mx + 3 * mm, y - 4.5 * mm, item)
        c.setFillColor(SUBTEXT)
        c.drawString(mx + 110 * mm, y - 4.5 * mm, per_unit)
        c.setFillColor(AMBER)
        c.drawRightString(PAGE_W - mx - 3 * mm, y - 4.5 * mm, total)
        y -= 9 * mm

    # Total
    panel(c, mx, y - 8 * mm, PAGE_W - 2 * mx, 9 * mm, fill=HexColor('#0a140a'), border=GREEN)
    c.setFont('Courier-Bold', 8)
    c.setFillColor(GREEN)
    c.drawString(mx + 3 * mm, y - 5 * mm, 'TOTAL — 100 units shipped')
    c.setFillColor(WHITE)
    c.drawRightString(PAGE_W - mx - 3 * mm, y - 5 * mm, '~$8,281   (~$83/unit landed)')

    footer(c, n)


# ── Page 4 — PCBWay Guide ──────────────────────────────────────────────────────

def page_pcbway(c, n):
    draw_bg(c)
    draw_scanlines(c)
    mx = 20 * mm
    hdr(c, '[ PCBWAY MANUFACTURING GUIDE :: PCB + PCBA + CNC ]', CYAN)
    y = PAGE_H - 42 * mm

    # PCB spec
    section_title(c, mx, y, 'PCB SPECIFICATION', CYAN)
    y -= 7 * mm

    pcb_specs = [
        ('Board size', '36 × 36 mm'),
        ('Layer count', '4 layers'),
        ('Board thickness', '1.0 mm'),
        ('Surface finish', 'ENIG (Electroless Nickel Immersion Gold)'),
        ('Copper weight', '1 oz outer / 0.5 oz inner'),
        ('Solder mask', 'Black (both sides)'),
        ('Silkscreen', 'White (Side B component side)'),
        ('Via treatment', 'Tented'),
        ('Quantity to order', '110 boards (100 production + 10 spare)'),
        ('Lead time', '3–5 business days'),
    ]
    for i, (lbl, val) in enumerate(pcb_specs):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        row(c, mx, y - 7 * mm, PAGE_W - 2 * mx, lbl, val, SUBTEXT, TEXT)
        y -= 9 * mm

    y -= 6 * mm
    section_title(c, mx, y, 'PCBA ASSEMBLY SERVICE', GREEN)
    y -= 7 * mm

    pcba = [
        ('Assembly type', 'Double-sided SMT (reflow oven, lead-free RoHS)'),
        ('Sourcing mode', 'Turnkey (PCBWay sources from LCSC)'),
        ('Inspection', 'AOI all boards + X-ray for STWLC68 (QFN-28)'),
        ('Critical no-substitute', 'U1 ESP32-S3, U3 BME688, U4 STWLC68, U6 MAX17048'),
        ('Hand-solder after PCBA', 'FPC connector, OV2640, LiPo battery, SW1 button'),
        ('Files required', 'Gerbers ZIP + BOM XLSX + CPL CSV'),
    ]
    for i, (lbl, val) in enumerate(pcba):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        row(c, mx, y - 7 * mm, PAGE_W - 2 * mx, lbl, val[:72], SUBTEXT, TEXT)
        y -= 9 * mm

    y -= 6 * mm
    section_title(c, mx, y, 'CNC ENCLOSURE ORDER (316L SS)', SILVER)
    y -= 7 * mm

    cnc = [
        ('Side A — polished face', '40×40×2.8mm, mirror Ra≤0.1µm, M1.6 inserts, STEP file'),
        ('Side B — active face', '40×40×2.5mm, satin Ra0.8µm, all cutouts, STEP file'),
        ('Quantity', '110 sets (220 individual shells)'),
        ('Post-processing', 'Passivation ASTM A967 required for both shells'),
        ('Tolerance', '±0.05mm cavity / ±0.1mm outer dimensions'),
        ('Lead time', '10–12 business days'),
    ]
    for i, (lbl, val) in enumerate(cnc):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        row(c, mx, y - 7 * mm, PAGE_W - 2 * mx, lbl, val[:72], SUBTEXT, SILVER)
        y -= 9 * mm

    y -= 6 * mm
    section_title(c, mx, y, 'ORDER TIMELINE (PARALLEL)', AMBER)
    y -= 7 * mm

    timeline = [
        ('Day 1', 'Submit PCBA order (110 boards) + CNC order (110 enclosure sets)'),
        ('Day 7–9', 'Receive PCBs from PCBA service'),
        ('Day 10–12', 'Receive CNC enclosures'),
        ('Day 10–14', 'Assembly + QA (test every board before housing)'),
        ('Day 15', 'Packaged units ready for distribution'),
    ]
    for i, (when, what) in enumerate(timeline):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        c.setFont('Courier-Bold', 6.5); c.setFillColor(AMBER)
        c.drawString(mx + 3 * mm, y - 4.5 * mm, when)
        c.setFont('Courier', 6.5); c.setFillColor(TEXT)
        c.drawString(mx + 22 * mm, y - 4.5 * mm, what[:70])
        y -= 9 * mm

    footer(c, n)


# ── Page 5 — Firmware & API ────────────────────────────────────────────────────

def page_firmware(c, n):
    draw_bg(c)
    draw_scanlines(c)
    mx = 20 * mm
    hdr(c, '[ FIRMWARE & LOT API CONNECTOR :: ESP32-S3 ]', GREEN)
    y = PAGE_H - 42 * mm

    # Two columns
    col_w = (PAGE_W - 2 * mx - 4 * mm) / 2

    # Left column — Firmware
    section_title(c, mx, y, 'FIRMWARE QUICK REF', GREEN)
    y -= 7 * mm

    fw_info = [
        ('Framework', 'Arduino ESP32 Core 3.x'),
        ('MCU', 'ESP32-S3-MINI-1-N8 @ 240MHz'),
        ('Flash scheme', 'OTA dual-bank (app0/app1)'),
        ('WiFi setup', 'WiFiManager captive portal'),
        ('Notif poll', 'Every 30 seconds'),
        ('Sensor upload', 'Every 5 minutes'),
        ('Heartbeat', 'Every 10 minutes'),
        ('Light sleep', '25s between polls (~2mA)'),
        ('Deep sleep', 'After 30min idle (~120µA)'),
        ('Battery life', '7–10 days normal use'),
        ('Factory reset', 'Hold button 10s at boot'),
    ]
    for i, (lbl, val) in enumerate(fw_info):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, col_w, 8 * mm, fill=bg, border=DIM)
        row(c, mx, y - 7 * mm, col_w, lbl, val[:28], SUBTEXT, TEXT)
        y -= 9 * mm

    # Right column — API endpoints
    cx2 = mx + col_w + 4 * mm
    y2 = PAGE_H - 42 * mm - 7 * mm
    section_title(c, cx2, PAGE_H - 42 * mm, 'API ENDPOINTS', CYAN)

    endpoints = [
        ('GET',  '/ping',              'Heartbeat + config'),
        ('GET',  '/notifications',     'Poll pending notifs'),
        ('POST', '/notifications/ack', 'Acknowledge delivery'),
        ('POST', '/event',             'Log button press'),
        ('POST', '/sensor',            'BME688 data upload'),
        ('POST', '/register',          'Device registration'),
        ('POST', '/push',              'Server→device push'),
        ('GET',  '/devices',           'List user devices'),
    ]
    for i, (method, path, desc) in enumerate(endpoints):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, cx2, y2 - 7 * mm, col_w, 8 * mm, fill=bg, border=DIM)
        method_col = GREEN if method == 'GET' else AMBER
        c.setFont('Courier-Bold', 6)
        c.setFillColor(method_col)
        c.drawString(cx2 + 3 * mm, y2 - 4.5 * mm, method)
        c.setFont('Courier', 6)
        c.setFillColor(CYAN)
        c.drawString(cx2 + 16 * mm, y2 - 4.5 * mm, path)
        c.setFillColor(SUBTEXT)
        c.drawString(cx2 + 52 * mm, y2 - 4.5 * mm, desc)
        y2 -= 9 * mm

    # Button gesture table
    y = min(y, y2) - 6 * mm
    section_title(c, mx, y, 'COPY BUTTON GESTURES', AMBER)
    y -= 7 * mm

    gestures = [
        ('Single click', 'Logs copy_button event → visible in LOT Log tab'),
        ('Hold 3 seconds', 'Captures OV2640 photo → uploads to LOT API'),
        ('Hold 10s at boot', 'Factory reset — clears WiFi creds + API token'),
    ]
    for i, (g, d) in enumerate(gestures):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        panel(c, mx, y - 7 * mm, PAGE_W - 2 * mx, 8 * mm, fill=bg, border=DIM)
        c.setFont('Courier-Bold', 6.5); c.setFillColor(AMBER)
        c.drawString(mx + 3 * mm, y - 4.5 * mm, g)
        c.setFont('Courier', 6.5); c.setFillColor(TEXT)
        c.drawString(mx + 42 * mm, y - 4.5 * mm, d)
        y -= 9 * mm

    # Display layout
    y -= 6 * mm
    section_title(c, mx, y, 'E-PAPER DISPLAY LAYOUT (200×200 px)', STEEL)
    y -= 7 * mm

    panel(c, mx, y - 38 * mm, PAGE_W - 2 * mx, 40 * mm, fill=HexColor('#0d0d14'), border=STEEL)
    c.setFont('Courier', 7)
    c.setFillColor(STEEL)
    layout = [
        '┌─────────────────────────────────────┐',
        '│  LOT                  BAT: 87%       │  ← Status bar (20px)',
        '├─────────────────────────────────────┤',
        '│                                      │',
        '│   Coffee time!                       │  ← Notification (18pt)',
        '│                                      │',
        '│   11:34 AM                           │  ← Timestamp',
        '│   via: memory_engine                 │  ← Source',
        '│                                      │',
        '├─────────────────────────────────────┤',
        '│  [O] Copy        CHG                 │  ← Footer (20px)',
        '└─────────────────────────────────────┘',
    ]
    ly = y - 6 * mm
    for line in layout:
        c.drawString(mx + 4 * mm, ly, line[:60])
        ly -= 3.2 * mm

    footer(c, n)


# ── Page 6 — Roadmap ──────────────────────────────────────────────────────────

def page_roadmap(c, n):
    draw_bg(c)
    draw_scanlines(c)
    mx = 20 * mm
    hdr(c, '[ PROJECT ROADMAP :: 100-UNIT PRODUCTION RUN ]', AMBER)
    y = PAGE_H - 42 * mm

    phases = [
        ('Phase 0', 'Design Lock',           'Weeks 1–2',  'PCB schematic, layout, STEP files, BOM finalized',      GREEN,  '✓ Initiated'),
        ('Phase 1', 'PCB Prototyping',        'Weeks 3–5',  '10 prototype boards — functional test + field validation', CYAN, '○ Pending'),
        ('Phase 2', 'Firmware Alpha',         'Weeks 3–6',  'WiFi, display, BME688, API, button, camera, OTA',      GREEN,  '○ Pending'),
        ('Phase 3', 'Prototype Validation',   'Weeks 5–7',  '5 internal testers — battery life, WiFi resilience',   AMBER,  '○ Pending'),
        ('Phase 4', 'Production Order',       'Weeks 7–10', 'Place PCBWay PCBA (110) + CNC (110 sets) orders',      STEEL,  '○ Pending'),
        ('Phase 5', 'Assembly & QA',          'Weeks 10–12','FPC, camera, battery, enclosure — 100% test every board', RED, '○ Pending'),
        ('Phase 6', 'Software Integration',   'Weeks 8–12', 'Device API, Settings page, Memory Engine notifs',       CYAN,  '✓ API built'),
        ('Phase 7', 'Distribution',           'Weeks 12–14','100 units shipped — Usership members first',           GREEN,  '○ Pending'),
    ]

    pw = (PAGE_W - 2 * mx)
    for i, (phase, name, weeks, desc, col, status) in enumerate(phases):
        ph = 14 * mm
        px = mx
        py = y - ph

        c.setFillColor(HexColor('#0d0d0d') if i % 2 == 0 else BG)
        c.roundRect(px, py, pw, ph, 2, fill=1, stroke=0)
        c.setStrokeColor(col)
        c.setLineWidth(1)
        c.line(px, py, px, py + ph)

        c.setFont('Courier-Bold', 7)
        c.setFillColor(col)
        c.drawString(px + 4 * mm, py + ph - 5 * mm, phase)

        c.setFont('Courier-Bold', 8)
        c.setFillColor(WHITE)
        c.drawString(px + 22 * mm, py + ph - 5 * mm, name)

        c.setFont('Courier', 6.5)
        c.setFillColor(AMBER)
        c.drawString(px + 22 * mm, py + 4 * mm, weeks)

        c.setFont('Courier', 6.5)
        c.setFillColor(SUBTEXT)
        c.drawString(px + 55 * mm, py + 4 * mm, desc[:62])

        status_col = GREEN if '✓' in status else MUTED
        c.setFont('Courier-Bold', 6.5)
        c.setFillColor(status_col)
        c.drawRightString(px + pw - 3 * mm, py + ph - 5 * mm, status)

        y -= ph + 1.5 * mm

    y -= 6 * mm

    # Risk register (compact)
    section_title(c, mx, y, 'KEY RISKS', RED)
    y -= 7 * mm

    risks = [
        ('BME688 stock', 'Med', 'Order +20 units; alt: BME280+SGP40'),
        ('CNC quality', 'Low', 'Prototype enclosure sample in Phase 1'),
        ('Assembly yield', 'Low', '10 spare boards as buffer (110 ordered)'),
        ('OTA infra delay', 'Med', 'Non-blocking for v1.0 ship date'),
    ]
    rw = (PAGE_W - 2 * mx - 4 * mm) / 2
    rx1, rx2 = mx, mx + rw + 4 * mm
    ry1, ry2 = y, y
    for i, (risk, prob, mit) in enumerate(risks):
        rcol = rx1 if i % 2 == 0 else rx2
        ry = ry1 if i % 2 == 0 else ry2
        prob_col = AMBER if prob == 'Med' else GREEN
        panel(c, rcol, ry - 10 * mm, rw, 11 * mm, fill=HexColor('#0d0d0d'), border=DIM)
        c.setFont('Courier-Bold', 6.5); c.setFillColor(RED)
        c.drawString(rcol + 3 * mm, ry - 4.5 * mm, risk)
        c.setFont('Courier-Bold', 6); c.setFillColor(prob_col)
        c.drawString(rcol + 38 * mm, ry - 4.5 * mm, prob)
        c.setFont('Courier', 6); c.setFillColor(SUBTEXT)
        c.drawString(rcol + 3 * mm, ry - 9 * mm, mit[:40])
        if i % 2 == 0: ry1 -= 13 * mm
        else: ry2 -= 13 * mm

    footer(c, n)


# ── Page 7 — Closing ──────────────────────────────────────────────────────────

def page_closing(c, n):
    draw_bg(c)
    draw_scanlines(c)
    mx = 20 * mm

    from reportlab.pdfgen.canvas import Canvas  # noqa — already imported
    c.setStrokeColor(STEEL)
    c.setLineWidth(1)
    c.roundRect(mx, 20 * mm, PAGE_W - 2 * mx, PAGE_H - 40 * mm, 3, fill=0, stroke=1)

    # COSMO CIA box art
    art = [
        '  ╔═══════════════════════════════════════════════╗  ',
        '  ║   COSMO® CIA — Connected Intelligence         ║  ',
        '  ║   Architecture                                ║  ',
        '  ║                                               ║  ',
        '  ║   40mm × 40mm × 5mm                          ║  ',
        '  ║   316L Stainless Steel · E-paper · WiFi       ║  ',
        '  ║   BME688 AI Sensor · Qi Wireless · Camera     ║  ',
        '  ║                                               ║  ',
        '  ║   Copy button → lot-systems.com/log           ║  ',
        '  ║   Notifications ← Memory Engine AI            ║  ',
        '  ║   Sensor data  → QOS Biofield Engine          ║  ',
        '  ║                                               ║  ',
        '  ║   lot-systems.com  ·  brand.lot-systems.com   ║  ',
        '  ╚═══════════════════════════════════════════════╝  ',
    ]
    ay = PAGE_H / 2 + 50 * mm
    c.setFont('Courier', 9)
    c.setFillColor(SILVER)
    for line in art:
        c.drawCentredString(PAGE_W / 2, ay, line)
        ay -= 5.5 * mm

    c.setFont('Courier', 8)
    c.setFillColor(SUBTEXT)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 40 * mm,
        'Inventor: Vadik Marmeladov — COSMO® CIA')
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 48 * mm,
        'LOT Systems Corporation  ·  © 2026  ·  All rights reserved')

    c.setFont('Courier', 7)
    c.setFillColor(DIM)
    c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 60 * mm,
        'Generated by scripts/generate_cosmo_cia_pdf.py')

    footer(c, n)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    os.makedirs(os.path.dirname(os.path.abspath(OUT_PATH)), exist_ok=True)
    c = canvas.Canvas(os.path.abspath(OUT_PATH), pagesize=A4)
    c.setTitle('COSMO CIA Hardware Manual v1.0')
    c.setAuthor('LOT Systems — Vadik Marmeladov')
    c.setSubject('COSMO CIA Hardware Manual')

    pages = [
        ('Cover',                 page_cover),
        ('Physical Specification', page_physical),
        ('Bill of Materials',      page_bom),
        ('PCBWay Guide',           page_pcbway),
        ('Firmware & API',         page_firmware),
        ('Roadmap',                page_roadmap),
        ('Closing',                page_closing),
    ]

    print('  Generating COSMO CIA Hardware Manual PDF...')
    for i, (name, fn) in enumerate(pages, 1):
        fn(c, i)
        print(f'    [{i}/{len(pages)}] {name}')
        if i < len(pages):
            c.showPage()

    c.save()
    size = os.path.getsize(os.path.abspath(OUT_PATH))
    print(f'  Done → {OUT_PATH}  ({size:,} bytes, {size // 1024} KB)')


if __name__ == '__main__':
    main()
