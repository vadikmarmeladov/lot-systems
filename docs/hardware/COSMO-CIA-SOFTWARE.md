# COSMO® CIA — Software & API Bridge Documentation

**Version:** 1.0
**Date:** 2026-05-26
**Stack:** TypeScript / Node.js / Express / Prisma (existing LOT Systems backend)

---

## 1. Overview

The COSMO® CIA software bridge is the server-side layer that connects the physical device to the LOT Systems platform. It extends the existing `lot-systems.com` backend with device-specific API routes, integrates hardware events into the LOT Log tab, and delivers AI-powered notifications from the LOT Memory Engine and QOS to the device display.

**New file:** `src/server/routes/device-api.ts`
**New Prisma model:** `Device`, `DeviceLog`, `DeviceNotification`
**Modified files:**
- `prisma/schema.prisma` — add Device models
- `src/server/routes/api.ts` — mount device router
- `src/client/components/Logs.tsx` — render device log entries with sensor panel

---

## 2. Database Schema

### Prisma additions (`prisma/schema.prisma`)

```prisma
model Device {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name         String   @default("COSMO® CIA")
  apiToken     String   @unique @default(cuid())
  firmwareVer  String?
  lastSeenAt   DateTime?
  registeredAt DateTime @default(now())
  logs         DeviceLog[]
  notifications DeviceNotification[]

  @@map("devices")
}

model DeviceLog {
  id             String   @id @default(uuid())
  deviceId       String
  device         Device   @relation(fields: [deviceId], references: [id], onDelete: Cascade)
  event          String   // "copy" | "photo_copy" | "sensor"
  notificationId String?
  timestamp      DateTime @default(now())
  temperature    Float?
  humidity       Float?
  pressure       Float?
  iaq            Float?
  iaqAccuracy    Int?
  photoUrl       String?  // S3/Spaces URL for camera captures
  compressedSession Bytes? // LZ4 session blob

  @@map("device_logs")
}

model DeviceNotification {
  id        String   @id @default(uuid())
  deviceId  String?  // null = broadcast to all devices of user
  userId    String
  text      String   @db.VarChar(128)
  source    String   // "lot_memory" | "qos" | "admin" | "weather" | "reminder"
  sentAt    DateTime @default(now())
  readAt    DateTime?

  @@map("device_notifications")
}
```

### Migration
```bash
yarn prisma migrate dev --name add_cosmo_device_tables
```

---

## 3. API Routes (`src/server/routes/device-api.ts`)

### Authentication middleware

All `/api/device/*` routes (except `/register`) use device token auth:

```typescript
const deviceAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const deviceId = req.headers['x-device-id'] as string;

  if (!token || !deviceId) {
    return res.status(401).json({ error: 'Missing device credentials' });
  }

  const device = await prisma.device.findFirst({
    where: { id: deviceId, apiToken: token }
  });

  if (!device) {
    return res.status(401).json({ error: 'Invalid device token' });
  }

  await prisma.device.update({
    where: { id: deviceId },
    data: { lastSeenAt: new Date(), firmwareVer: req.headers['x-firmware-version'] as string }
  });

  req.device = device;
  next();
};
```

---

### POST /api/device/register

Register a new device and receive an API token. Called once from provisioning flow (via LOT web app, authenticated as user).

**Auth:** User JWT (existing LOT auth)

**Request:**
```json
{
  "name": "Vadik's COSMO"
}
```

**Response 201:**
```json
{
  "deviceId": "550e8400-e29b-41d4-a716-446655440000",
  "apiToken": "cld_abc123...",
  "provisioningQr": "data:image/png;base64,..."
}
```

The `provisioningQr` is a base64 PNG QR code encoding:
```json
{
  "ssid": "",
  "psk": "",
  "token": "cld_abc123...",
  "deviceId": "550e8400-...",
  "endpoint": "https://lot-systems.com"
}
```
(WiFi credentials to be filled in by the LOT web app's BLE pairing flow.)

---

### GET /api/device/notifications

Poll for the latest notification(s) for this device.

**Auth:** Device token

**Response 200:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "text": "Coffee time!",
      "source": "lot_memory",
      "sentAt": "2026-05-26T10:00:00Z"
    }
  ],
  "deviceTime": "2026-05-26T10:00:00Z"
}
```

**Logic:**
1. Fetch latest unread `DeviceNotification` for this device's userId
2. Mark as read (`readAt = now()`)
3. Return max 1 notification (device displays one at a time)
4. If no unread: return last sent (repeat), with `"repeat": true` flag

**Notification generation sources:**
- **LOT Memory Engine:** generates prompts on schedule (daily question, follow-up)
- **QOS engine:** mode change notification ("QOS: peak mode — commit fully today")
- **Weather:** temperature-based ("22°C outside. Good walk conditions.")
- **Admin:** Vadik can push custom text from admin panel
- **Reminder:** scheduled notifications ("Coffee time!" at 10:00 AM)

---

### POST /api/device/log

Record a Copy button press in the user's Log tab.

**Auth:** Device token

**Request:**
```json
{
  "event": "copy",
  "notificationId": "uuid",
  "timestamp": "2026-05-26T10:00:30Z",
  "sensors": {
    "temperature": 22.4,
    "humidity": 45,
    "pressure": 1013.2,
    "iaq": 87,
    "iaqAccuracy": 3
  }
}
```

**Response 201:**
```json
{
  "logId": "uuid",
  "message": "Logged to LOT"
}
```

**Log tab rendering:** This creates a `DeviceLog` record. The Logs.tsx component renders device logs with a distinct COSMO® icon and an expandable sensor data panel showing temperature, humidity, pressure, IAQ.

---

### POST /api/device/log/photo

Record a long-press camera capture in the Log tab.

**Auth:** Device token

**Request:** `multipart/form-data`
- `event`: "photo_copy"
- `notificationId`: UUID string
- `sensors`: JSON string (same as above)
- `image`: JPEG file (max 200KB)

**Response 201:**
```json
{
  "logId": "uuid",
  "photoUrl": "https://cdn.lot-systems.com/device-photos/uuid.jpg"
}
```

**Storage:** Upload to DigitalOcean Spaces (existing LOT CDN). File path: `device-photos/<userId>/<logId>.jpg`.

---

### POST /api/device/session-sync

Receive a compressed session blob from device and store event history.

**Auth:** Device token

**Request:**
- `Content-Type: application/octet-stream`
- `Content-Encoding: lz4`
- Body: LZ4-compressed session events (see firmware §12)

**Response 200:**
```json
{ "synced": true, "eventsProcessed": 12 }
```

**Logic:** Decompress → parse session events → upsert DeviceLog records (deduplicate by timestamp). Any `COPY` events without a log record create one.

---

### GET /api/device/firmware/check

**Auth:** Device token

**Response 200:**
```json
{
  "currentVersion": "1.0.0",
  "latestVersion": "1.0.1",
  "updateAvailable": true,
  "releaseNotes": "Fix: partial refresh flicker on long text"
}
```

---

### GET /api/device/firmware/download

**Auth:** Device token

Streams the signed firmware binary for the latest version. File served from DigitalOcean Spaces CDN: `firmware/cosmo-cia-v1.0.1.bin`.

**Response:** `application/octet-stream` binary stream.

---

## 4. Notification Generation Engine

### Scheduled notification dispatcher (`src/server/jobs/device-notifier.ts`)

Runs on a cron schedule (every hour, implemented via existing LOT scheduler):

```typescript
// Sources tapped for notification text:
// 1. Memory Engine — next question for the user (existing memoryEngine.ts)
// 2. QOS — current mode if changed since last notification
// 3. Weather — from user's location weather data (existing geonames integration)
// 4. Reminder — time-based ("Coffee time!", "Hydration check")
// 5. Admin push — manual from admin panel

const REMINDER_SCHEDULE: Record<string, string> = {
  '08:00': 'Good morning. How did you rest?',
  '10:00': 'Coffee time!',
  '13:00': 'Midday check. Have you moved today?',
  '17:00': 'Wind-down begins. Intention complete?',
  '21:00': 'Evening. What would you remember from today?',
};
```

Each user's devices receive one notification per dispatch cycle. Priority: Memory Engine > QOS change > Reminder > Weather.

### Admin push notification UI

New section in LOT admin panel (`/admin`):

```
┌─────────────────────────────────────┐
│  Send Device Notification           │
│                                     │
│  Target: [All users ▾]              │
│  Text: [________________________]   │
│         128 char max                │
│  Source: Admin                      │
│                                     │
│  [Send to all active devices]       │
└─────────────────────────────────────┘
```

---

## 5. Log Tab Integration (`src/client/components/Logs.tsx`)

Device log entries are rendered with a distinct visual treatment:

```typescript
// Device log entry component
function DeviceLogEntry({ log }: { log: DeviceLog }) {
  return (
    <div className="log-entry log-entry--device">
      <div className="log-entry__icon">⬡</div>   {/* COSMO hexagon icon */}
      <div className="log-entry__body">
        <span className="log-entry__label">COSMO® Copy</span>
        <span className="log-entry__text">{log.notificationText}</span>
        <span className="log-entry__time">{formatTime(log.timestamp)}</span>
      </div>
      {log.sensors && (
        <details className="log-entry__sensors">
          <summary>Sensors</summary>
          <table>
            <tr><td>Temperature</td><td>{log.sensors.temperature}°C</td></tr>
            <tr><td>Humidity</td><td>{log.sensors.humidity}%</td></tr>
            <tr><td>Pressure</td><td>{log.sensors.pressure} hPa</td></tr>
            <tr><td>Air Quality</td><td>IAQ {log.sensors.iaq} ({iaqLabel(log.sensors.iaq)})</td></tr>
          </table>
        </details>
      )}
      {log.photoUrl && (
        <img className="log-entry__photo" src={log.photoUrl} alt="COSMO capture" />
      )}
    </div>
  );
}
```

---

## 6. Web Companion — BLE Provisioning UI

Add to LOT Settings tab: "Connect COSMO® CIA device"

```typescript
// src/client/components/CosmoProvision.tsx
// Uses Web Bluetooth API (navigator.bluetooth)

async function provisionDevice(deviceName: string) {
  // 1. Request BLE device
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: 'COSMO-CIA' }],
    optionalServices: ['a9a2-lot0-0001-...']
  });

  // 2. Connect + get service
  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService(COSMO_SERVICE_UUID);

  // 3. Register device in LOT backend → get token
  const { deviceId, apiToken } = await registerDevice(deviceName);

  // 4. Collect WiFi credentials from user (form)
  const { ssid, psk } = await promptWifiCredentials();

  // 5. Write credentials to device characteristics
  await writeCharacteristic(service, WIFI_SSID_UUID, ssid);
  await writeCharacteristic(service, WIFI_PSK_UUID, psk);
  await writeCharacteristic(service, API_TOKEN_UUID, apiToken);

  // 6. Wait for STATUS notification → SUCCESS
  await waitForProvisioningSuccess(service);

  // 7. Show success
  showToast('COSMO® CIA connected to LOT!');
}
```

---

## 7. Device Management UI

New section in LOT Settings → "My Devices":

```
┌──────────────────────────────────────────────┐
│  My Devices                            [+ Add]│
│                                              │
│  ◈ Vadik's COSMO                            │
│    Last seen: 2 minutes ago                  │
│    Firmware: v1.0.0  [Update available 1.0.1]│
│    Battery: not reported                     │
│    [Rename] [Send notification] [Remove]     │
└──────────────────────────────────────────────┘
```

Routes:
- `GET /api/devices` — list user's devices
- `PATCH /api/devices/:id` — rename
- `DELETE /api/devices/:id` — remove + revoke token
- `POST /api/devices/:id/notify` — push custom notification

---

## 8. Environment Variables

Add to `.env`:
```
# COSMO® CIA Device Configuration
DEVICE_FIRMWARE_BUCKET=cosmo-firmware     # DigitalOcean Spaces bucket
DEVICE_PHOTO_BUCKET=lot-device-photos     # DigitalOcean Spaces bucket
DEVICE_FIRMWARE_SIGNING_KEY_PATH=/etc/cosmo/firmware_sign.pem
```

---

## 9. Testing

### Unit tests
```bash
yarn jest src/server/routes/device-api.test.ts
```

Test cases:
- `POST /api/device/register` — creates device, returns token
- `GET /api/device/notifications` — returns latest notification
- `GET /api/device/notifications` — returns repeat if none unread
- `POST /api/device/log` — creates log entry, sensor data stored
- `POST /api/device/log/photo` — uploads to Spaces, returns URL
- `GET /api/device/firmware/check` — version comparison correct
- Device token auth — rejects invalid token
- Device token auth — updates lastSeenAt

### Integration test (with real device or simulator)
```bash
# Run the device API simulator
node scripts/device-simulator.js --device-uuid <uuid> --token <token>
# Simulates: poll → copy press → session sync → OTA check
```

---

*COSMO® CIA Software Bridge — LOT Systems. © 2026 All rights reserved.*
