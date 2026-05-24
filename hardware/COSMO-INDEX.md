# COSMO NODE — Document Index
**Project:** LOT Systems Physical Companion Device  
**Codename:** COSMO NODE  
**Inventor:** Vadik — COSMO® CIA  
**Version:** 1.0 · 2026-05-24  

---

## Document Set

| # | Document | File | Purpose |
|---|---|---|---|
| 1 | Device Plan | `COSMO-DEVICE-PLAN.md` | Industrial design, electronics architecture, PCB spec, 100-unit run plan |
| 2 | Bill of Materials | `COSMO-BOM.md` | Full component list, supplier links, PCBWay orders, cost summary |
| 3 | Development Roadmap | `COSMO-ROADMAP.md` | 10-week phase plan, milestones, risk register |
| 4 | Firmware Specification | `COSMO-FIRMWARE-SPEC.md` | ESP32-S3 firmware, task architecture, drivers, OTA |
| 5 | API Connector | `COSMO-API-CONNECTOR.md` | Server-side LOT API endpoints, database schema, WebSocket push |

---

## Device at a Glance

```
┌─────────────────────────────┐
│  COSMO NODE                 │
│  by LOT Systems             │
│  COSMO® CIA                 │
├──────────────┬──────────────┤
│ Form factor  │ 40×40×7.5 mm │
│ Body         │ 316L SS      │
│ Side A       │ Mirror #8    │
│ Side B       │ Camera +     │
│              │ OLED screen  │
│              │ Copy button  │
│ MCU          │ ESP32-S3     │
│ Display      │ 128×128 OLED │
│ Camera       │ OV2640 2MP   │
│ Sensor       │ BME688 AI    │
│ Charging     │ Qi 5W        │
│ Battery      │ 150 mAh      │
│ Battery life │ 5–7 days     │
│ Connectivity │ WiFi + BLE   │
│ Site link    │ lot-systems  │
└──────────────┴──────────────┘
```

---

## Key External Links

| Resource | URL |
|---|---|
| PCBWay — PCB Order | https://www.pcbway.com/orderonline.aspx |
| PCBWay — CNC Machining | https://www.pcbway.com/rapid-prototyping/CNC-Machining/ |
| PCBWay — SMT Assembly | https://www.pcbway.com/smt-assembly.html |
| Espressif ESP32-S3 Datasheet | https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf |
| Bosch BME688 + BSEC2 | https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme688/ |
| ESP-IDF Getting Started | https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/get-started/ |
| LOT Systems | https://lot-systems.com |
| LOT Institute | https://institute.lot-systems.com |
| LOT Brand | https://brand.lot-systems.com |

---

## Generate PDFs

All documents can be converted to PDF for printing and distribution.

```bash
# Install pandoc + wkhtmltopdf
sudo apt install pandoc wkhtmltopdf

# Generate all PDFs
cd hardware/
for f in COSMO-*.md; do
  pandoc "$f" \
    -o "${f%.md}.pdf" \
    --pdf-engine=wkhtmltopdf \
    --metadata title="$(head -1 $f | sed 's/# //')" \
    -V geometry:margin=2cm \
    -V fontsize=11pt \
    -V mainfont="Arial"
  echo "Generated: ${f%.md}.pdf"
done
```

Or use the provided script:
```bash
bash hardware/generate-pdfs.sh
```

---

## Separate Document Scope

Each document is self-contained and independently printable:

- **COSMO-DEVICE-PLAN.pdf** — Give to industrial designer, mechanical engineer, investor
- **COSMO-BOM.pdf** — Give to procurement, PCBWay, manufacturing partner
- **COSMO-ROADMAP.pdf** — Give to project manager, team leads
- **COSMO-FIRMWARE-SPEC.pdf** — Give to embedded firmware engineer
- **COSMO-API-CONNECTOR.pdf** — Give to backend / full-stack developer

---

## Production Status

| Phase | Status |
|---|---|
| Design (plan + BOM) | COMPLETE |
| PCB Gerbers | PENDING — schematic in KiCad |
| Firmware | PENDING — dev on ESP32-S3-DevKitC-1 |
| API Connector | PENDING — merge to main branch |
| CNC Enclosure STEP files | PENDING — CAD work |
| Rev A prototypes | NOT STARTED |
| 100-unit run | NOT STARTED |
