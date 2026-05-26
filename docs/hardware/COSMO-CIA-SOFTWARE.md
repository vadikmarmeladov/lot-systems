# COSMO® CIA — Software & API Connector
## Server-Side Software · LOT API Device Layer
**Version:** 1.0  
**Date:** 2026-05-26  
**Stack:** Node.js / Express / TypeScript (matches existing LOT Computer codebase)

---

## 1. Overview

The COSMO® CIA Software layer lives inside the existing LOT Computer Node.js server. It adds:

1. **Device registration + authentication** — devices identify with a UUID + secret
2. **WebSocket push server** — broadcasts notifications to connected devices
3. **Log endpoint** — receives Copy button events, writes to the user's Log tab
4. **Session upload endpoint** — receives compressed session bundles from devices
5. **OTA firmware endpoint** — serves signed firmware binaries
6. **Camera image endpoint** — receives + stores images from device camera
7. **Notification dispatch UI** — site-side UI to send notifications to devices

All endpoints live under `/api/device/*` and require valid device JWT authentication.

---

## 2. API Endpoints

### 2.1 Device Authentication

#### `POST /api/device/auth`

Called by device on first boot or token refresh.

**Request:**
```json
{
  "device_id": "COSMO_001",
  "device_secret": "<factory-provisioned-secret>",
  "firmware_version": "1.0.0"
}
```

**Response:**
```json
{
  "token": "<JWT>",
  "expires_at": "2026-06-26T10:00:00Z",
  "user_id": "user_abc123",
  "ws_url": "wss://lot-systems.com/device/ws"
}
```

**Implementation (server/routes/device-api.ts):**
```typescript
router.post('/api/device/auth', async (req, res) => {
  const { device_id, device_secret, firmware_version } = req.body;

  const device = await prisma.cosmoDevice.findUnique({
    where: { deviceId: device_id }
  });

  if (!device || !verifyDeviceSecret(device_secret, device.secretHash)) {
    return res.status(401).json({ error: 'Invalid device credentials' });
  }

  await prisma.cosmoDevice.update({
    where: { id: device.id },
    data: { firmwareVersion: firmware_version, lastSeen: new Date() }
  });

  const token = signDeviceJWT({ deviceId: device_id, userId: device.userId });
  return res.json({ token, expires_at: getExpiry(), ws_url: WS_URL });
});
```

---

### 2.2 WebSocket Push Server

#### `GET /device/ws` (WebSocket upgrade)

Devices connect here after auth. The server maintains one WebSocket connection per device.

**URL:** `wss://lot-systems.com/device/ws?device_id=COSMO_001&token=<JWT>`

**Server sends to device (notification):**
```json
{
  "type": "notification",
  "id": "notif_01HXYZ",
  "text": "Coffee time!",
  "priority": "normal",
  "sender": "lot-systems.com",
  "timestamp": "2026-05-26T10:00:00Z",
  "ttl": 300
}
```

**Implementation sketch:**
```typescript
// server/device-ws.ts
import { WebSocketServer } from 'ws';

const deviceConnections = new Map<string, WebSocket>(); // deviceId → ws

export function initDeviceWS(server: http.Server) {
  const wss = new WebSocketServer({ server, path: '/device/ws' });

  wss.on('connection', (ws, req) => {
    const { device_id, token } = parseQueryParams(req.url);
    const payload = verifyDeviceJWT(token);
    if (!payload) return ws.close(4001, 'Unauthorized');

    deviceConnections.set(device_id, ws);
    ws.on('message', handleDeviceMessage(device_id));
    ws.on('close', () => deviceConnections.delete(device_id));

    // Heartbeat
    const ping = setInterval(() => ws.ping(), 30_000);
    ws.on('close', () => clearInterval(ping));
  });
}

export function pushNotificationToDevice(deviceId: string, text: string) {
  const ws = deviceConnections.get(deviceId);
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'notification',
      id: `notif_${nanoid()}`,
      text,
      priority: 'normal',
      sender: 'lot-systems.com',
      timestamp: new Date().toISOString(),
      ttl: 300
    }));
  }
}
```

---

### 2.3 Copy Button Log Endpoint

#### `POST /api/device/log`

Receives Copy events. Writes to user's Log tab in the LOT system.

**Request:**
```json
{
  "device_id": "COSMO_001",
  "event": "copy",
  "notif_id": "notif_01HXYZ",
  "notif_text": "Coffee time!",
  "context": {
    "temp_c": 21.4,
    "humidity": 58.2,
    "iaq": 42
  },
  "timestamp": "2026-05-26T10:00:01Z"
}
```

**Server behavior:**
1. Verify device JWT
2. Look up `userId` from device record
3. Write a log entry to the existing `Log` table (same as user journal logs)
4. Tag it with source `"cosmo_device"` for Log tab filtering
5. Return HTTP 200

**Log tab display:**  
The user's Log tab shows the entry:
```
📟 [COSMO CIA] "Coffee time!" — copied · 21.4°C · AQI 42 · 10:00 AM
```

**Implementation:**
```typescript
router.post('/api/device/log', requireDeviceAuth, async (req, res) => {
  const { device_id, event, notif_text, context, timestamp } = req.body;
  const device = req.device; // attached by requireDeviceAuth middleware

  await prisma.log.create({
    data: {
      userId: device.userId,
      source: 'cosmo_device',
      deviceId: device_id,
      content: notif_text,
      metadata: JSON.stringify({ event, context }),
      createdAt: new Date(timestamp)
    }
  });

  // Emit real-time update to any open browser sessions for this user
  emitToUser(device.userId, 'log:new', { source: 'cosmo_device', content: notif_text });

  return res.json({ ok: true });
});
```

---

### 2.4 Session Upload Endpoint

#### `POST /api/device/session`

Receives gzip-compressed session bundles from the device.

**Request:**
- `Content-Type: application/octet-stream`
- `X-Device-ID: COSMO_001`
- Body: gzip-compressed JSON session bundle

**Server behavior:**
1. Decompress gzip body
2. Verify SHA256 checksum (appended 32 bytes)
3. Parse session JSON
4. Store to `CosmoSession` table
5. Run analytics (optional, queued async)

```typescript
router.post('/api/device/session',
  requireDeviceAuth,
  express.raw({ type: 'application/octet-stream', limit: '1mb' }),
  async (req, res) => {
    const compressed = req.body as Buffer;
    const checksum = compressed.slice(-32);
    const payload = compressed.slice(0, -32);

    if (!verifyChecksum(payload, checksum)) {
      return res.status(400).json({ error: 'Checksum mismatch' });
    }

    const session = JSON.parse(zlib.gunzipSync(payload).toString());

    await prisma.cosmoSession.create({
      data: {
        deviceId: req.device.id,
        userId: req.device.userId,
        sessionData: session,
        receivedAt: new Date()
      }
    });

    return res.json({ ok: true, session_id: session.id });
  }
);
```

---

### 2.5 OTA Firmware Endpoint

#### `GET /api/device/firmware/latest`

Returns latest available firmware version info.

**Response:**
```json
{
  "version": "1.0.3",
  "url": "https://lot-systems.com/api/device/firmware/download/1.0.3",
  "sha256": "abc123...",
  "size_bytes": 1245184,
  "release_notes": "Bug fix: WiFi reconnect on RSSI drop"
}
```

#### `GET /api/device/firmware/download/:version`

Streams signed firmware binary. Requires device JWT.

---

### 2.6 Camera Image Endpoint

#### `POST /api/device/camera`

Receives JPEG images from COSMO® CIA camera.

**Request:**
- `Content-Type: image/jpeg`
- `X-Device-ID: COSMO_001`
- `X-Capture-Timestamp: 2026-05-26T10:00:00Z`
- Body: JPEG binary

**Server behavior:**
1. Verify JWT
2. Store image to DigitalOcean Spaces (or local `/uploads/cosmo/`)
3. Create `CosmoCapture` record
4. Return image URL

---

## 3. Database Schema (Prisma additions)

```prisma
// Add to prisma/schema.prisma

model CosmoDevice {
  id              String    @id @default(cuid())
  deviceId        String    @unique  // "COSMO_001"
  secretHash      String              // bcrypt hash of factory secret
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  firmwareVersion String?
  lastSeen        DateTime?
  registeredAt    DateTime  @default(now())
  sessions        CosmoSession[]
  captures        CosmoCapture[]
}

model CosmoSession {
  id          String      @id @default(cuid())
  deviceId    String
  device      CosmoDevice @relation(fields: [deviceId], references: [id])
  userId      String
  sessionData Json
  receivedAt  DateTime    @default(now())
}

model CosmoCapture {
  id          String      @id @default(cuid())
  deviceId    String
  device      CosmoDevice @relation(fields: [deviceId], references: [id])
  userId      String
  imageUrl    String
  capturedAt  DateTime
  createdAt   DateTime    @default(now())
}
```

The existing `Log` model gains two fields:
```prisma
// Additions to existing Log model
source    String?   // "cosmo_device" | "manual" | etc.
deviceId  String?   // COSMO_001
```

---

## 4. Notification Dispatch (Site UI)

A new UI panel on lot-systems.com allows users to send notifications to their connected COSMO® CIA:

```
┌─────────────────────────────────────┐
│  📟 Send to COSMO                   │
│                                     │
│  [ Coffee time!              ]      │
│                    [Send →]         │
│                                     │
│  Connected: COSMO_001 · 2m ago      │
└─────────────────────────────────────┘
```

This calls `pushNotificationToDevice(deviceId, text)` from the server via a new React component and API endpoint:

```
POST /api/device/notify
Body: { "device_id": "COSMO_001", "text": "Coffee time!" }
```

The LOT site can also configure **automated notifications** via:
- Weather-triggered: "Umbrella today" (BME688 pressure drop)
- Time-triggered: "Coffee time!" at 10 AM
- AI-generated: Claude API generates contextual messages based on user's log history

---

## 5. Log Tab — Device Entry Rendering

Existing Log tab gains a filter + rendering for COSMO device entries.

```typescript
// src/client/components/Logs.tsx addition

{log.source === 'cosmo_device' && (
  <div className="flex items-center gap-2 text-xs text-zinc-400">
    <span>📟</span>
    <span className="font-mono">COSMO CIA</span>
    <span>"{log.content}"</span>
    {log.metadata?.context && (
      <span className="text-zinc-500">
        · {log.metadata.context.temp_c}°C
        · AQI {log.metadata.context.iaq}
      </span>
    )}
    <span className="ml-auto">{formatTime(log.createdAt)}</span>
  </div>
)}
```

---

## 6. Environment Variables (additions to .env)

```env
# COSMO CIA Device Layer
DEVICE_JWT_SECRET=<random-256-bit-hex>
DEVICE_JWT_EXPIRY=30d
COSMO_OTA_BUCKET=cosmo-firmware
COSMO_IMAGE_BUCKET=cosmo-captures
COSMO_MAX_DEVICES_PER_USER=5
```

---

## 7. Software File Map

```
src/server/routes/
├── device-api.ts          ← All /api/device/* REST endpoints
├── device-ws.ts           ← WebSocket push server

src/client/components/
├── CosmoPanel.tsx         ← Notification dispatch UI
├── Logs.tsx               ← (modified) device log entry renderer

prisma/
├── schema.prisma          ← (modified) CosmoDevice, CosmoSession, CosmoCapture

migrations/
├── YYYYMMDD_cosmo_device/ ← Prisma migration for new tables
```

---

## 8. Testing

### Unit Tests
```bash
# Test device auth
curl -X POST https://lot-systems.com/api/device/auth \
  -H "Content-Type: application/json" \
  -d '{"device_id":"COSMO_TEST","device_secret":"test_secret","firmware_version":"0.1.0"}'

# Test log endpoint (with valid JWT)
curl -X POST https://lot-systems.com/api/device/log \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"device_id":"COSMO_TEST","event":"copy","notif_text":"Coffee time!","context":{"temp_c":21.4},"timestamp":"2026-05-26T10:00:00Z"}'
```

### WebSocket Test
```bash
# Using wscat
wscat -c "wss://lot-systems.com/device/ws?device_id=COSMO_TEST&token=<JWT>"
# Then from the site, dispatch a notification — verify it arrives within 1 second
```

---

*Software spec v1.0 — implementation order: Auth → WebSocket → Log → Session → OTA → Camera*
