<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — Software / API Bridge

**Document:** SOFTWARE-API-BRIDGE.md
**Revision:** 1.0
**Date:** May 28, 2026
**Project:** COSMO® Computer CC-1
**Scope:** Server-side software changes required to support the COSMO® Computer hardware

---

## 1. Overview

The COSMO® Computer communicates with `lot-systems.com` over HTTPS. This document describes:

1. New API endpoints required on the LOT backend
2. Database schema additions
3. Server-Sent Events (SSE) notification delivery
4. Log tab integration for hardware events
5. Device management in the LOT user interface

The existing LOT stack (Node.js + Fastify + PostgreSQL) requires the following additions. All changes follow existing LOT patterns and do not break existing functionality.

---

## 2. Database Schema

### 2.1 New Table: `hardware_devices`

```sql
-- migrations/20260528000000_add-hardware-devices.cjs

CREATE TABLE hardware_devices (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id       VARCHAR(16) NOT NULL UNIQUE,  -- "CC1-XXXXXXXX"
    api_key_hash    VARCHAR(64) NOT NULL,           -- SHA-256 of device API key
    firmware_version VARCHAR(16) DEFAULT '1.0.0',
    registered_at   TIMESTAMP DEFAULT NOW(),
    last_seen_at    TIMESTAMP,
    battery_pct     SMALLINT,
    is_active       BOOLEAN DEFAULT true
);

CREATE INDEX idx_hardware_devices_user_id ON hardware_devices(user_id);
CREATE INDEX idx_hardware_devices_device_id ON hardware_devices(device_id);
```

### 2.2 New Table: `hardware_sessions`

```sql
CREATE TABLE hardware_sessions (
    id              SERIAL PRIMARY KEY,
    device_id       VARCHAR(16) REFERENCES hardware_devices(device_id),
    session_start   TIMESTAMP NOT NULL,
    reading_count   INTEGER DEFAULT 0,
    compressed_data BYTEA,                    -- zlib-compressed sensor JSON
    uploaded_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hardware_sessions_device_id ON hardware_sessions(device_id);
```

### 2.3 Existing Table: `logs` (no changes)

Hardware events use the existing `logs` table with `source: 'hardware'` in metadata:

```typescript
// Existing log structure — hardware extends with new metadata fields
{
  userId: number,
  text: "COSMO® Computer: Copy signal sent",
  event: "hardware_copy",          // New event type
  metadata: {
    source: "hardware",
    deviceId: "CC1-A1B2C3D4",
    temperature: 22.1,
    humidity: 48.2,
    pressure: 1013.25,
    iaq: 75,
    lux: 340,
    uvIndex: 0.8
  }
}
```

---

## 3. New API Endpoints

### 3.1 Device Registration

```
POST /api/device/register
Authorization: Bearer <device-api-key>
Content-Type: application/json

{
  "deviceId": "CC1-A1B2C3D4",
  "firmwareVersion": "1.0.0"
}

Response 200:
{
  "registered": true,
  "userId": 123,
  "deviceId": "CC1-A1B2C3D4",
  "notificationStream": "/api/notifications/stream"
}
```

Server-side implementation:
```typescript
// src/server/routes/device.ts

fastify.post('/api/device/register', async (request, reply) => {
  const apiKey = request.headers.authorization?.replace('Bearer ', '')
  if (!apiKey) return reply.status(401).send({ error: 'No API key' })

  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')
  const device = await db.hardwareDevices.findOne({ where: { apiKeyHash: keyHash } })

  if (!device) return reply.status(403).send({ error: 'Unknown device' })
  if (!device.isActive) return reply.status(403).send({ error: 'Device deactivated' })

  const { deviceId, firmwareVersion } = request.body as any
  await db.hardwareDevices.update(
    { lastSeenAt: new Date(), firmwareVersion },
    { where: { deviceId } }
  )

  return { registered: true, userId: device.userId, deviceId, notificationStream: '/api/notifications/stream' }
})
```

---

### 3.2 Notification Stream (SSE)

```
GET /api/notifications/stream
Authorization: Bearer <device-api-key>
Accept: text/event-stream
```

This is a persistent Server-Sent Events connection. The server pushes notifications to the device in real time.

```typescript
// src/server/routes/notifications.ts

fastify.get('/api/notifications/stream', async (request, reply) => {
  const device = await authenticateDevice(request)
  const userId = device.userId

  reply.raw.writeHead(200, {
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection':    'keep-alive',
    'X-Accel-Buffering': 'no',  // Disable nginx buffering
  })

  // Register this connection in the notification registry
  notificationRegistry.register(userId, reply.raw)

  // Send initial ping to confirm connection
  reply.raw.write('event: ping\ndata: {}\n\n')

  // Keep-alive ping every 30 seconds
  const keepAlive = setInterval(() => {
    reply.raw.write('event: ping\ndata: {}\n\n')
  }, 30000)

  request.raw.on('close', () => {
    clearInterval(keepAlive)
    notificationRegistry.unregister(userId, reply.raw)
    db.hardwareDevices.update({ lastSeenAt: new Date() }, { where: { deviceId: device.deviceId } })
  })
})

// Notification sender (called from other parts of the system)
export function pushNotificationToDevice(userId: number, notification: Notification) {
  const connections = notificationRegistry.get(userId)
  if (!connections?.length) return

  const payload = JSON.stringify(notification)
  const sseEvent = `event: notification\ndata: ${payload}\n\n`

  for (const conn of connections) {
    try {
      conn.write(sseEvent)
    } catch {
      notificationRegistry.unregister(userId, conn)
    }
  }
}
```

**Notification types pushed from the LOT system:**

```typescript
type NotificationType =
  | 'reminder'   // "Coffee time." from site settings
  | 'insight'    // Pattern insight from QIE
  | 'badge'      // Badge unlock
  | 'weather'    // Weather summary from weather engine
  | 'qos'        // Daily QoS score

type Notification = {
  type: NotificationType
  text?: string         // For 'reminder' type
  title?: string        // For 'insight', 'badge', 'qos'
  body?: string         // Optional detail
  duration: number      // Seconds to display on device
}
```

---

### 3.3 Session Data Upload

```
POST /api/device/sync
Authorization: Bearer <device-api-key>
Content-Type: application/json

{
  "deviceId": "CC1-A1B2C3D4",
  "sessionStart": 1748390400,
  "readingCount": 127,
  "compressionRatio": 7.4,
  "data": "<base64-encoded zlib-compressed JSON>"
}

Response 200:
{
  "accepted": true,
  "sessionId": 42
}
```

Server decompresses the payload and stores it in `hardware_sessions`. The sensor readings are also extracted and appended to the user's log stream as a `hardware_sensors` event for QIE analysis.

```typescript
fastify.post('/api/device/sync', async (request, reply) => {
  const device = await authenticateDevice(request)
  const { deviceId, sessionStart, readingCount, data } = request.body as any

  // Decompress
  const compressed = Buffer.from(data, 'base64')
  const json = zlib.inflateSync(compressed).toString('utf8')
  const readings = JSON.parse(json)

  // Store session
  const session = await db.hardwareSessions.create({
    deviceId,
    sessionStart: new Date(sessionStart * 1000),
    readingCount,
    compressedData: compressed,
  })

  // Append average readings to user logs for QIE correlation
  const avg = computeAverageReadings(readings)
  await db.logs.create({
    userId:   device.userId,
    text:     `Hardware session: ${readingCount} readings, avg temp ${avg.temp.toFixed(1)}°C`,
    event:    'hardware_sensors',
    metadata: { source: 'hardware', sessionId: session.id, ...avg },
  })

  return { accepted: true, sessionId: session.id }
})
```

---

### 3.4 Log Entry (Copy Button)

The Copy button uses the existing `/api/logs` POST endpoint. No new endpoint needed. The server recognizes `event: 'hardware_copy'` and:

1. Saves to the `logs` table (appears in the user's Log tab)
2. Triggers a visual notification in the LOT web app (existing live message system)

```typescript
// Existing logs route — add hardware_copy handling
// src/server/routes/logs.ts (existing file, minimal addition)

// In the log creation handler, after saving to DB:
if (log.event === 'hardware_copy') {
  // Broadcast to live message system (existing websocket)
  broadcastLiveMessage(log.userId, {
    text: log.text,
    icon: 'device',
    metadata: log.metadata,
  })
}
```

The Log tab on `lot-systems.com` already displays all log events. Hardware events appear with a device icon and show embedded sensor readings inline:

```
[device] COSMO® Computer: Copy signal sent
         22.1°C · 48% RH · IAQ 75 · 340 lux
         2026-05-28 14:23:01
```

---

### 3.5 Firmware Check

```
GET /api/firmware/cc1/latest
Authorization: Bearer <device-api-key>

Response 200:
{
  "version": "1.1.0",
  "releaseDate": "2026-06-01",
  "downloadUrl": "https://lot-systems.com/firmware/cc1/v1.1.0.bin",
  "sha256": "abc123...",
  "mandatory": false,
  "releaseNotes": "Improved Qi charging stability."
}
```

---

## 4. LOT Site UI Changes

### 4.1 Device Management (Settings Page)

A new "Devices:" block on the Settings page, using the existing `Block` component:

```tsx
// src/client/widgets/DevicesWidget.tsx

export function DevicesWidget() {
  const { data: devices = [] } = useDevices()

  if (devices.length === 0) return null

  return (
    <Block label="Devices:" blockView>
      <div className="inline-block w-full">
        {devices.map(device => (
          <div key={device.deviceId} className="mb-12">
            <div className="opacity-90">COSMO® Computer {device.deviceId}</div>
            <div className="opacity-60">
              v{device.firmwareVersion} ·{' '}
              {device.batteryPct !== null ? `${device.batteryPct}% battery · ` : ''}
              Last seen {formatRelative(device.lastSeenAt)}
            </div>
          </div>
        ))}
      </div>
    </Block>
  )
}
```

### 4.2 Log Tab — Hardware Events

No changes needed to the Log tab rendering. The existing log renderer already displays all log entries. Hardware events appear automatically with their metadata.

Add one small addition: display sensor data inline when `metadata.source === 'hardware'`:

```tsx
// src/client/components/LogEntry.tsx (existing file)
// Add after existing metadata rendering:

{log.metadata?.source === 'hardware' && (
  <div className="opacity-60 mt-4 text-[14px]">
    {log.metadata.temperature && `${log.metadata.temperature}°C`}
    {log.metadata.humidity && ` · ${log.metadata.humidity}% RH`}
    {log.metadata.iaq && ` · IAQ ${log.metadata.iaq}`}
    {log.metadata.lux && ` · ${Math.round(log.metadata.lux)} lux`}
  </div>
)}
```

### 4.3 Notification Composer (Admin / Settings)

A new UI section allows the user to send custom notifications to their COSMO® Computer:

```tsx
// src/client/widgets/DeviceNotifyWidget.tsx

export function DeviceNotifyWidget() {
  const [text, setText] = useState('')
  const [duration, setDuration] = useState(10)
  const { mutate: sendNotification } = useSendDeviceNotification()

  return (
    <Block label="Send to Device:" blockView>
      <div className="inline-block w-full">
        <input
          className="opacity-90 mb-12 border-acc/20 border px-8 py-4 w-full"
          placeholder="Coffee time."
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={60}
        />
        <div className="flex gap-8">
          <Button
            onClick={() => {
              sendNotification({ type: 'reminder', text, duration })
              setText('')
            }}
            disabled={!text.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </Block>
  )
}
```

---

## 5. QIE Integration

Hardware sensor data enriches the Quantum Intent Engine's `weather-mood` insight type. The existing QIE signal system is extended:

```typescript
// src/client/signals.ts (existing file)
// Add hardware sensor signal type:

export type SignalType =
  | 'mood_checkin'
  | 'planning'
  | 'memory_answer'
  | 'selfcare_complete'
  | 'intention_set'
  | 'journal_entry'
  | 'hardware_copy'     // NEW
  | 'hardware_sensors'  // NEW

// hardware_copy signal carries:
// { temperature, humidity, iaq, lux, uvIndex }
// Enables correlations like "You tend to press Copy when IAQ is low"
```

The existing `weather-mood` insight type is extended to include BME688 IAQ data:

```typescript
// Existing insight type, extended:
{
  type: "weather-mood",
  title: "Air quality affects focus",
  description: "75% of your Copy signals occur when IAQ < 100 (poor air).",
  confidence: 0.78,
  dataPoints: 22
}
```

---

## 6. Environment Variables

Add to `.env`:

```bash
# COSMO® Computer hardware support
DEVICE_API_SECRET=<generate-with-openssl-rand-hex-32>
FIRMWARE_CDN_URL=https://lot-systems.com/firmware
DEVICE_SSE_KEEPALIVE_MS=30000
```

---

## 7. Migration Sequence

```bash
# 1. Run database migrations
node migrations/20260528000000_add-hardware-devices.cjs

# 2. Provision first device (admin CLI)
node scripts/provision-device.ts \
  --userId 1 \
  --deviceId CC1-A1B2C3D4 \
  --generate-key

# Outputs:
# API Key: <32-char random key>  ← burn to device eFuse via tools/provision.py
# Key Hash: <sha256>             ← stored in hardware_devices table

# 3. Deploy updated server
git push origin main

# 4. Flash firmware with API key
cd firmware/
./tools/provision.py --port /dev/ttyUSB0 --api-key <key-from-step-2>
idf.py -p /dev/ttyUSB0 flash
```

---

*© 2026 LOT Systems, Inc. — Proprietary and Confidential*
*COSMO® Computer CC-1 — Software API Bridge v1.0*
