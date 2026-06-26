================================================================================
LOT SYSTEMS CORPORATION / SOFTWARE INTEGRATION DOCUMENT
DOCUMENT:   LOT-COMPUTER-SOFTWARE-v1
TITLE:      COSMO PAGER™ — Software & API Integration Reference
CLASS:      RESTRICTED // S-2 EYES
VERSION:    v1.0.0
DATE:       2026-06-26
COVERS:     LOT site API extensions, device connector, Log tab integration
================================================================================


--------------------------------------------------------------------------------
00 // OVERVIEW
--------------------------------------------------------------------------------

This document covers all software components required to connect the
COSMO PAGER™ hardware device to lot-systems.com:

  1. LOT API Connector — new device API endpoints on the LOT server
  2. Log Tab integration — COPY button events appear in the Log tab
  3. Notification engine — AI-generated autonomous messages to devices
  4. Sensor ingestion — BME688 weather/environment data stored + displayed
  5. Device management dashboard — admin view of registered devices
  6. Firmware OTA hosting — firmware binary hosting on LOT server
  7. Desktop configurator — one-time Wi-Fi provisioning app (Electron)
  8. PDF manual generation — automated PDF output of docs


--------------------------------------------------------------------------------
01 // LOT API CONNECTOR (Server-Side)
--------------------------------------------------------------------------------

  SOURCE FILE:  src/server/routes/device-api.ts    (NEW)
  REGISTERS AT: /api/device/*
  FRAMEWORK:    Fastify (existing LOT server)
  AUTH:         Bearer token (device_token from NVS, validated against DB)

  ── 01A  NEW DATABASE MODEL ───────────────────────────────────────────────

  TABLE: devices
    id              UUID          PK
    deviceId        UUID          UNIQUE (provisioned at factory)
    token           VARCHAR(64)   UNIQUE (hashed with bcrypt in DB)
    name            VARCHAR(64)   e.g. "COSMO Pager #001"
    firmwareVersion VARCHAR(16)
    batteryPercent  INTEGER
    lastSeenAt      TIMESTAMP
    registeredAt    TIMESTAMP
    userId          UUID          FK → users.id (owner association)
    metadata        JSONB         { serial, hwRevision, location, notes }

  TABLE: device_logs
    id          UUID          PK
    deviceId    UUID          FK → devices.id
    event       VARCHAR(64)   e.g. "COPY", "HEARTBEAT", "OTA_START"
    ts          TIMESTAMP
    payload     JSONB         Raw event payload
    createdAt   TIMESTAMP

  TABLE: device_notifications
    id          UUID          PK
    deviceId    UUID          FK → devices.id   (NULL = broadcast to all)
    text        VARCHAR(128)  Notification text
    priority    SMALLINT      0=normal, 1=urgent
    sentAt      TIMESTAMP     NULL until delivered
    createdAt   TIMESTAMP

  TABLE: device_sensors
    id              UUID          PK
    deviceId        UUID          FK → devices.id
    ts              TIMESTAMP
    temp            REAL
    humidity        REAL
    pressure        REAL
    iaq             REAL
    iaqAccuracy     SMALLINT
    co2Eq           REAL
    vocEq           REAL
    gasResistance   INTEGER
    createdAt       TIMESTAMP

  PRISMA MODELS to add (prisma/schema.prisma):

    model Device {
      id              String   @id @default(uuid())
      deviceId        String   @unique
      tokenHash       String   @unique
      name            String?
      firmwareVersion String?
      batteryPercent  Int?
      lastSeenAt      DateTime?
      registeredAt    DateTime @default(now())
      userId          String?
      metadata        Json     @default("{}")
      user            User?    @relation(fields: [userId], references: [id])
      logs            DeviceLog[]
      notifications   DeviceNotification[]
      sensors         DeviceSensor[]
    }

    model DeviceLog {
      id        String   @id @default(uuid())
      deviceId  String
      event     String
      ts        DateTime
      payload   Json     @default("{}")
      createdAt DateTime @default(now())
      device    Device   @relation(fields: [deviceId], references: [id])
    }

    model DeviceNotification {
      id        String   @id @default(uuid())
      deviceId  String?
      text      String
      priority  Int      @default(0)
      sentAt    DateTime?
      createdAt DateTime @default(now())
      device    Device?  @relation(fields: [deviceId], references: [id])
    }

    model DeviceSensor {
      id            String   @id @default(uuid())
      deviceId      String
      ts            DateTime
      temp          Float?
      humidity      Float?
      pressure      Float?
      iaq           Float?
      iaqAccuracy   Int?
      co2Eq         Float?
      vocEq         Float?
      gasResistance Int?
      createdAt     DateTime @default(now())
      device        Device   @relation(fields: [deviceId], references: [id])
    }

  ── 01B  API ENDPOINTS ────────────────────────────────────────────────────

  POST /api/device/register
    Purpose: Factory provisioning — register new device
    Auth:    Admin API key (server-to-server, not device token)
    Body:    { "deviceId": "<uuid>", "token": "<hex64>", "name": "..." }
    Returns: { "ok": true }
    Action:  Hash token, store Device row

  POST /api/device/heartbeat
    Purpose: 60s keepalive from device
    Auth:    Bearer <device_token>
    Body:    { "deviceId": "<uuid>", "battery": 78,
               "ts": "...", "firmwareVersion": "1.0.0" }
    Returns: 200 OK, { "ok": true }
    Action:  Update devices.lastSeenAt, batteryPercent, firmwareVersion
             Also check for pending commands (see GET /commands below)

  GET /api/device/notifications
    Purpose: Device polls for new notifications
    Auth:    Bearer <device_token>
    Query:   ?deviceId=<uuid>
    Returns: { "notifications": [{ "id","text","ts","priority" }] }
    Action:  Return unsent DeviceNotification rows for this device
             (deviceId match OR deviceId IS NULL = broadcast)
             Mark matching rows sentAt = now()

  POST /api/device/log
    Purpose: COPY button event → Log tab
    Auth:    Bearer <device_token>
    Body:    { "deviceId":"...","event":"COPY","ts":"...","sensor":{...} }
    Returns: 200 OK
    Action:
      1. Insert DeviceLog row
      2. INSERT into existing logs table as:
           event = "device_copy"
           text  = "[COSMO Pager] Copy pressed"
           metadata = { deviceId, ts, sensor }
           userId = devices.userId (owner)
      3. SSE push to Log tab live feed (if user online)

  POST /api/device/sensor
    Purpose: BME688 environmental data
    Auth:    Bearer <device_token>
    Body:    { "deviceId","ts","temp","humidity","pressure","iaq",
               "iaqAccuracy","co2Eq","vocEq","gasResistance" }
    Returns: 200 OK
    Action:  Insert DeviceSensor row
             Update weather widget data if user has device associated

  POST /api/device/sessions
    Purpose: Batch upload compressed session summaries
    Auth:    Bearer <device_token>
    Body:    CBOR or JSON array of SessionSummary objects
    Returns: 200 OK, { "received": N }
    Action:  Parse sessions, store analytics, clear on device side

  GET /api/device/commands
    Purpose: Server-push commands to device (polled)
    Auth:    Bearer <device_token>
    Query:   ?deviceId=<uuid>
    Returns: { "commands": [{ "cmd":"capture","uploadUrl":"..." }] }
             OR { "commands": [] }
    Action:  Check pending_commands table (or include in heartbeat response)

  GET /api/device/firmware/latest
    Purpose: OTA version check
    Auth:    Bearer <device_token>
    Returns: { "version":"1.0.0","url":"https://...","sha256":"..." }
    Action:  Return latest firmware entry from firmware table
             URL = presigned S3 URL or direct file URL

  POST /api/device/upload
    Purpose: Camera image upload
    Auth:    Bearer <device_token>
    Body:    multipart/form-data with "image" field (JPEG)
    Returns: { "ok": true, "imageId": "..." }
    Action:  Store image, associate with device + timestamp


--------------------------------------------------------------------------------
02 // LOG TAB INTEGRATION
--------------------------------------------------------------------------------

  The existing Log tab at lot-systems.com already displays logs from the
  logs table (LogModel). Device COPY events are inserted into this same
  table so they appear in the existing UI without new frontend code.

  EVENT FORMAT IN LOG TAB:
    Icon:      📟 (device icon, added to log renderer by event type)
    Text:      "[COSMO Pager] Copy pressed"
    Metadata:  Device ID, timestamp, temperature, humidity
    Style:     Distinct badge/color for "device_copy" event type

  FRONTEND CHANGES REQUIRED (minimal):
    src/client/components/LogFeed.tsx (or equivalent):
      - Add case for event === "device_copy" in event renderer
      - Show device icon + sensor mini-data inline
      - No structural changes; single new case in switch

  SSE LIVE FEED:
    Existing SSE /api/events stream should include device_copy events
    No changes if SSE already broadcasts all new log rows


--------------------------------------------------------------------------------
03 // NOTIFICATION ENGINE
--------------------------------------------------------------------------------

  The site generates autonomous notifications for devices using the existing
  AI/memory infrastructure.

  NOTIFICATION GENERATION (server-side cron or trigger):
    Source: lot-systems.com AI system (existing memory + cohort engine)
    Examples:
      - "Coffee time!" (based on user time-of-day patterns)
      - "Time for a walk." (energy state low)
      - "Weather: 22°C, clear skies." (from local weather API)
      - "Great work today." (end-of-day positive reinforcement)
      - "IAQ: Air quality excellent." (from device's own BME688 reading)

  ADMIN UI:
    New page: /admin/devices (authenticated admin only)
    Features:
      - List all registered devices (name, last seen, battery %)
      - "Send notification" form: text (128 char), priority, target device/all
      - View device logs (COPY events + heartbeats)
      - View sensor history (temp/humidity/IAQ timeline chart)
      - OTA: upload new firmware binary, trigger push

  SCHEDULED NOTIFICATIONS:
    CRON job (node-cron or existing LOT cron system):
      - Every morning 09:00 local time per user: "Good morning." + weather
      - Every hour: check device IAQ, if >150 send "Air quality alert."
      - Configurable by user in settings


--------------------------------------------------------------------------------
04 // SENSOR DATA — WEATHER WIDGET INTEGRATION
--------------------------------------------------------------------------------

  The existing LOT site has a weather widget (src/server/utils/weather.ts).
  Device BME688 data supplements or replaces the external weather API for
  users who own a COSMO PAGER™.

  INTEGRATION:
    - GET /api/weather route: if user has associated device with recent sensor
      reading (<30 min old), return device sensor data as "local" weather
    - Display: "22.1°C · 45% RH · AQ: Good · Your COSMO Pager"
    - External weather API remains fallback when device offline

  SENSOR DISPLAY ADDITIONS:
    Weather widget adds: IAQ badge (color: green/yellow/orange/red by level)
    CO₂-equivalent: displayed as "CO₂: 550 ppm equiv."
    VOC: displayed as "VOC: 0.45 mg/m³ equiv."


--------------------------------------------------------------------------------
05 // DESKTOP CONFIGURATOR (Electron App)
--------------------------------------------------------------------------------

  PURPOSE:
    One-time Wi-Fi setup + device pairing for end users.
    Production uses: mobile BLE provisioning via ESP BLE Provisioning SDK.
    Desktop app is backup / advanced users / factory workflow.

  TECH STACK:
    Electron 30 + Node.js (serialport module for USB provisioning)
    OR: React Native + BLE (mobile-first provisioning)

  FEATURES:
    1. Detect COSMO PAGER™ (USB serial or BLE scan)
    2. Enter Wi-Fi SSID + password
    3. Login to lot-systems.com → associate device to account
    4. Display device status: firmware version, battery, last seen
    5. Send test notification ("Hello from configurator!")
    6. Trigger firmware update

  COMMANDS SENT VIA SERIAL (115200 baud):
    AT+WIFI=SSID,PASS\r\n    → Wi-Fi credentials
    AT+TOKEN=<token>\r\n     → device token (from API)
    AT+STATUS\r\n            → returns JSON status
    AT+RESTART\r\n           → soft reset

  BUILD:
    npm run build:desktop    → electron-builder packages
    Output: .dmg (macOS), .exe (Windows), .AppImage (Linux)


--------------------------------------------------------------------------------
06 // FIRMWARE OTA HOSTING
--------------------------------------------------------------------------------

  STORAGE:
    LOT server hosts firmware binaries at:
      /firmware/<version>/cosmo_pager.bin  (main app binary)
      /firmware/<version>/cosmo_pager.bin.sha256  (hash file)
      /firmware/<version>/storage.bin      (SPIFFS image with CA cert)

  UPLOAD:
    Admin-only API:
    POST /api/admin/firmware/upload
      multipart: { "version": "1.1.0", "binary": <file> }
      → Stores binary, computes SHA256, inserts firmware table row
      → Sets as "latest" version (replaces previous latest)

  SECURITY:
    Firmware binaries signed with ESP32 Secure Boot V2 key (offline)
    LOT server serves HTTPS only (TLS 1.3)
    Device verifies: SHA256 + bootloader secure boot signature chain


--------------------------------------------------------------------------------
07 // PDF MANUAL GENERATION
--------------------------------------------------------------------------------

  TOOL:     Puppeteer (headless Chrome) → PDF
  SOURCE:   Markdown files (this docs/hardware/ directory)
            Rendered via marked.js to HTML, then PDF via Puppeteer
  SCRIPT:   scripts/generate-hardware-pdf.ts

  OUTPUTS:
    docs/hardware/pdf/COSMO-PAGER-QUICK-START.pdf     (user-facing, 4 pages)
    docs/hardware/pdf/COSMO-PAGER-FULL-MANUAL.pdf     (complete, ~20 pages)
    docs/hardware/pdf/COSMO-PAGER-FIRMWARE-REF.pdf    (dev reference)
    docs/hardware/pdf/COSMO-PAGER-BOM.pdf             (BOM export)

  QUICK START MANUAL CONTENT (4 pages, box insert):
    Page 1:  What's in the box + first-time setup QR code
    Page 2:  Download LOT app → scan QR on device → pair
    Page 3:  Button guide (COPY = sends signal to LOT Log tab)
             Charging (place on Qi pad, blue LED)
    Page 4:  Safety, regulatory, support: lot-systems.com/support

  SCRIPT USAGE:
    npx tsx scripts/generate-hardware-pdf.ts
    → Reads docs/hardware/*.md
    → Outputs to docs/hardware/pdf/

  STYLE:
    LOT terminal-grid aesthetic: black background, white/green text
    Monospace headers, clean sans-serif body (Arial)
    LOT® wordmark on every page footer
    COSMO® on cover page


--------------------------------------------------------------------------------
08 // IMPLEMENTATION ROADMAP (SOFTWARE)
--------------------------------------------------------------------------------

  PHASE 1 — Foundation (Week 1–2)
    [ ] Prisma schema additions (Device, DeviceLog, DeviceNotification,
        DeviceSensor models) + migration
    [ ] device-api.ts route file with all 9 endpoints
    [ ] Auth middleware for device Bearer tokens
    [ ] Factory registration tool (provisioning_tool.py)

  PHASE 2 — Log Tab Integration (Week 2)
    [ ] device_copy events inserted to existing logs table
    [ ] Frontend: add device_copy case to LogFeed renderer
    [ ] SSE: ensure device_copy events broadcast on existing SSE stream
    [ ] Test: press button on device → verify Log tab update in browser

  PHASE 3 — Notification Engine (Week 3)
    [ ] Admin UI: /admin/devices page (device list, send notification)
    [ ] Scheduled notifications (morning greeting, IAQ alerts)
    [ ] Notification delivery + sentAt tracking

  PHASE 4 — Sensor Integration (Week 3–4)
    [ ] Sensor data stored (DeviceSensor table)
    [ ] Weather widget updated to show device sensor data
    [ ] IAQ chart in device admin

  PHASE 5 — OTA Hosting (Week 4)
    [ ] Firmware upload admin endpoint
    [ ] GET /api/device/firmware/latest endpoint
    [ ] Version table + binary storage

  PHASE 6 — PDF Generation (Week 4)
    [ ] scripts/generate-hardware-pdf.ts
    [ ] Quick Start + Full Manual + Firmware Ref PDFs
    [ ] Include in GitHub release artifacts

  PHASE 7 — Desktop Configurator (Week 5–6, parallel)
    [ ] Electron app scaffold
    [ ] Serial provisioning (AT command protocol)
    [ ] BLE provisioning (optional, mobile-first alternative)
    [ ] Package for macOS + Windows


================================================================================
END OF DOCUMENT — LOT-COMPUTER-SOFTWARE-v1
CLASSIFICATION: RESTRICTED // S-2 EYES
LOT SYSTEMS CORPORATION | brand.lot-systems.com
================================================================================
