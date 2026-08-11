#!/usr/bin/env python3
"""
COSMO Cube Hardware Manual — PDF Generator v2.0
Terminal Grid house style (matches generate_badges_v4.py conventions)
"""

import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

W, H = A4
M = 16 * mm
CW = W - 2 * M

BG   = HexColor("#0a0a0a")
FG   = HexColor("#e8e8e8")
FG2  = HexColor("#aaaaaa")
FG3  = HexColor("#555555")
ACC  = HexColor("#c8ffc8")
ACC2 = HexColor("#88ccff")
BRD  = HexColor("#2a2a2a")

SRC = "docs/corporate/LOT-COSMO-CUBE-HARDWARE-v2.md"
OUT = "docs/corporate/LOT-COSMO-CUBE-HARDWARE-v2.pdf"


class Doc:
    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=A4)
        self.c.setTitle("COSMO Cube — Hardware Computer v2.0 — Build Manual")
        self.c.setAuthor("LOT Systems / Vadik Marmeladov, Inventor, COSMO CIA")
        self.c.setSubject("Site-Connected Hardware Computer — Build Specification")
        self.page = 0
        self.y = H - M
        self._new_page()

    def _new_page(self):
        if self.page > 0:
            self._footer()
            self.c.showPage()
        self.page += 1
        self.c.setFillColor(BG)
        self.c.rect(0, 0, W, H, stroke=0, fill=1)
        self.c.setFillColor(ACC)
        self.c.rect(0, H - 2, W, 2, stroke=0, fill=1)
        self.y = H - M - 6

    def _footer(self):
        self.c.setFont("Courier", 7)
        self.c.setFillColor(FG3)
        self.c.drawString(M, 10, "COSMO Cube Hardware v2.0 — LOT Systems — RESTRICTED / S-2 EYES")
        self.c.drawRightString(W - M, 10, f"PAGE {self.page:02d}")
        self.c.setFillColor(HexColor("#1a3a1a"))
        self.c.rect(0, 0, W, 1.5, stroke=0, fill=1)

    def need(self, h):
        if self.y - h < M + 16:
            self._new_page()

    def hline(self):
        self.c.setStrokeColor(BRD)
        self.c.setLineWidth(0.4)
        self.c.line(M, self.y, W - M, self.y)
        self.y -= 5

    def h1(self, text):
        self.need(30)
        self.y -= 6
        self.c.setFillColor(HexColor("#111111"))
        self.c.rect(M - 3, self.y - 15, CW + 6, 21, stroke=0, fill=1)
        self.c.setFillColor(ACC)
        self.c.rect(M - 3, self.y - 15, 4, 21, stroke=0, fill=1)
        self.c.setFont("Courier-Bold", 11)
        self.c.setFillColor(ACC)
        self.c.drawString(M + 8, self.y - 9, text[:88])
        self.y -= 26

    def h2(self, text):
        self.need(16)
        self.y -= 4
        self.c.setFont("Courier-Bold", 9)
        self.c.setFillColor(ACC2)
        self.c.drawString(M, self.y, text[:100])
        self.y -= 12
        self.hline()

    def wrap(self, text, width_chars=98):
        out = []
        for para in text.split("\n"):
            if not para.strip():
                out.append("")
                continue
            words = para.split(" ")
            line = ""
            for w_ in words:
                if len(line) + len(w_) + 1 > width_chars:
                    out.append(line)
                    line = w_
                else:
                    line = (line + " " + w_).strip()
            out.append(line)
        return out

    def p(self, text, size=8, color=FG):
        for line in self.wrap(text):
            self.need(size + 3)
            self.c.setFont("Courier", size)
            self.c.setFillColor(color if line.strip() else FG)
            self.c.drawString(M, self.y, line)
            self.y -= size + 2.6

    def code(self, text, size=7.3):
        self.need(size + 6)
        for line in text.split("\n"):
            self.need(size + 3)
            self.c.setFont("Courier", size)
            self.c.setFillColor(FG2)
            self.c.drawString(M + 4, self.y, line[:120])
            self.y -= size + 2.2
        self.y -= 3

    def title_page(self):
        self.c.setFillColor(ACC)
        self.c.setFont("Courier-Bold", 22)
        self.c.drawCentredString(W / 2, H / 2 + 60, "COSMO® CUBE")
        self.c.setFont("Courier-Bold", 13)
        self.c.setFillColor(FG)
        self.c.drawCentredString(W / 2, H / 2 + 30, "Site-Connected Hardware Computer")
        self.c.setFont("Courier", 11)
        self.c.setFillColor(FG2)
        self.c.drawCentredString(W / 2, H / 2 + 10, "v2.0 — Full Build Specification")
        self.c.setFont("Courier", 9)
        self.c.setFillColor(FG3)
        self.c.drawCentredString(W / 2, H / 2 - 20, "CLASS: RESTRICTED // S-2 EYES")
        self.c.drawCentredString(W / 2, H / 2 - 34, "Inventor: Vadik Marmeladov — COSMO® CIA")
        self.c.drawCentredString(W / 2, H / 2 - 48, "LOT Systems Corporation — 2026-08-11")
        self.c.setStrokeColor(ACC)
        self.c.setLineWidth(0.8)
        self.c.line(W / 2 - 90, H / 2 - 60, W / 2 + 90, H / 2 - 60)


def strip_md_inline(s):
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"`(.+?)`", r"\1", s)
    return s


def main():
    with open(SRC, "r", encoding="utf-8") as f:
        raw = f.read()

    # Drop the leading HTML comment header
    raw = re.sub(r"^<!--.*?-->\s*", "", raw, flags=re.S)

    lines = raw.split("\n")
    doc = Doc(OUT)
    doc.title_page()
    doc._new_page()

    in_code = False
    code_buf = []
    for ln in lines:
        if ln.strip().startswith("```"):
            if in_code:
                doc.code("\n".join(code_buf))
                code_buf = []
            in_code = not in_code
            continue
        if in_code:
            code_buf.append(ln)
            continue

        stripped = ln.strip()
        if not stripped or set(stripped) <= {"="} or set(stripped) <= {"-"}:
            continue
        if stripped.startswith("DOCUMENT:") or stripped.startswith("TITLE:") or \
           stripped.startswith("CLASS:") or stripped.startswith("S-2:") or \
           stripped.startswith("INVENTOR:") or stripped.startswith("DATE:") or \
           stripped.startswith("VERSION:") or stripped.startswith("STATUS:") or \
           stripped.startswith("BRANCH:") or stripped.startswith("AUTHORIZED BY") or \
           stripped.startswith("END LOT-"):
            continue

        m1 = re.match(r"^\d{2} // (.+)$", stripped)
        if m1:
            doc.h1(m1.group(1))
            continue

        if re.match(r"^[A-Z0-9 ,()&/’'\"\-]+$", stripped) and len(stripped) > 3 and stripped.isupper():
            doc.h2(strip_md_inline(stripped))
            continue

        doc.p(strip_md_inline(stripped))

    doc._footer()
    doc.c.showPage()
    doc.c.save()
    print(f"Wrote {OUT} ({doc.page} pages)")


if __name__ == "__main__":
    main()
