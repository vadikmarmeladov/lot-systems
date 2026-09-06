# LOT Node — Manual Outline (source for the PDF manuals)

Two manuals are produced from this outline (brief item 7 — "Result in PDF
manuals"), kept separate on purpose (brief item 11):

1. **Quick Start Card** (1 page) — in the retail box
2. **Full Manual** (multi-page) — digital PDF, linked from the product page

Both live in [`manuals/`](./manuals/) once generated.

## §0 — Framing / voice

Opening language should draw on the tone already established at
`brand.lot-systems.com`, `lot-systems.com/about`, and the CQGS material at
`institute.lot-systems.com/cqgs.html` — self-care, proactive AI companion,
"your story, your data." These pages were not fetchable from this
non-interactive session (no browser/network fetch was run against them
here); before final copy is locked, pull actual phrasing from those three
pages rather than paraphrasing from memory.

## Quick Start Card — sections

1. What's in the box (LOT Node, Qi charging puck, USB-C cable)
2. Charge it (place on puck, wait for LED)
3. Pair it (button-press to enter pairing mode → scan QR with your phone →
   enter Wi-Fi)
4. What it does (screen shows short notifications from your LOT Memory
   Engine; press the button to log a moment to your Log tab)
5. Where to get help (support@lot-systems.com)

## Full Manual — sections

1. Welcome / what LOT Node is and how it relates to the Memory Engine & QOS
2. In the box / physical layout (front: camera, screen, button — rear:
   polished finish, wireless charging)
3. First-time setup (detailed pairing walkthrough, screenshots placeholder)
4. Using the screen (notification behavior, idle state, offline state)
5. Using the Copy button (what gets logged, where to see it — Log tab)
6. Weather sensing (what it measures, how it surfaces on your public profile)
7. Charging & battery care
8. Privacy (camera scope — no continuous capture, no cloud photo storage;
   what data leaves the device and where it goes — ties to `SOFTWARE-CONNECTOR.md`)
9. Troubleshooting (won't pair, won't charge, screen blank, button not logging)
10. Specifications table (from `HARDWARE-SPEC.md`)
11. Regulatory / safety notices (placeholder until certification, see
    `MANUFACTURING-ROADMAP.md` §5)
12. Support & contact

## Generation

The full manual is generated as `manuals/LOT-Node-Full-Manual-v1.pdf` and
the quick-start as `manuals/LOT-Node-Quick-Start-v1.pdf` for this session,
built directly from this outline. Both are placeholders for real
photography/diagrams once a physical unit exists (Phase 1+ in
`LOT-COMPUTER-PLAN.md` §4) — text content is accurate to the plan as of
this session; images will follow hardware.
