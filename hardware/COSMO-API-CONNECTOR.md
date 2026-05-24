# COSMO NODE — LOT API Connector
**Purpose:** Server-side endpoints on lot-systems.com for COSMO NODE hardware devices  
**Stack:** Node.js + Fastify (existing LOT backend)  
**Date:** 2026-05-24  

---

## 1. Overview

The API Connector adds five new routes to the existing LOT Fastify server. Device tokens are JWTs signed with a separate `DEVICE_JWT_SECRET`. All device log entries appear in the user's Log tab tagged `source: cosmo_node`.

---

## 2. Device Token Issuance

Devices pair once via BLE. The mobile/web companion app calls this endpoint with the user's session cookie, binding the device to the user's account.

```typescript
// server/routes/device.ts

import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import { db } from '../db'

export async function deviceRoutes(app: FastifyInstance) {

  // POST /api/device/register
  // Called by companion app (web/mobile) during BLE pairing
  app.post('/api/device/register', {
    preHandler: [app.authenticate],  // user must be logged in
  }, async (req, reply) => {
    const { device_id, device_serial } = req.body as {
      device_id: string
      device_serial: string
    }

    // Store device → user binding
    await db.query(
      `INSERT INTO devices (device_id, serial, user_id, paired_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (device_id) DO UPDATE SET user_id = $3, paired_at = NOW()`,
      [device_id, device_serial, req.user.id]
    )

    // Issue device JWT (365-day TTL)
    const token = jwt.sign(
      { device_id, user_id: req.user.id, serial: device_serial },
      process.env.DEVICE_JWT_SECRET!,
      { expiresIn: '365d' }
    )

    reply.send({ status: 'ok', device_token: token })
  })
```

---

## 3. Copy Button → Log Tab

When the user presses Copy on the device, this endpoint writes a log entry to the existing LOT logs table, visible in the user's Log tab.

```typescript
  // POST /api/log  (extends existing log route with device support)
  // Device sends: Authorization: Bearer <device_token>
  app.post('/api/log', {
    preHandler: [authenticateDeviceOrUser],
  }, async (req, reply) => {
    const body = req.body as {
      source: string
      device_id: string
      action: string
      timestamp: string
      payload: {
        temp_c: number
        humidity_pct: number
        pressure_hpa: number
        iaq_index: number
        battery_pct: number
      }
    }

    // Build log entry text — appears in LOT Log tab as a log line
    const logText = [
      `[COSMO] Copy pressed.`,
      `Temp ${body.payload.temp_c}°C`,
      `Humidity ${body.payload.humidity_pct}%`,
      `Pressure ${body.payload.pressure_hpa} hPa`,
      `IAQ ${body.payload.iaq_index}`,
      `Battery ${body.payload.battery_pct}%`,
    ].join(' · ')

    const logId = await db.query(
      `INSERT INTO logs (user_id, content, source, device_id, created_at)
       VALUES ($1, $2, 'cosmo_node', $3, $4)
       RETURNING id`,
      [req.device.user_id, logText, body.device_id, new Date(body.timestamp)]
    )

    reply.send({ status: 'ok', log_id: logId.rows[0].id })
  })
```

---

## 4. Notification Delivery

The LOT site's AI engine (Quantum Intent Engine™) generates notifications. This endpoint queues them for device delivery.

```typescript
  // GET /api/notifications/device
  // Device polls every 60s
  app.get('/api/notifications/device', {
    preHandler: [authenticateDevice],
  }, async (req, reply) => {
    const rows = await db.query(
      `SELECT id, message, display_duration_ms, priority
       FROM device_notifications
       WHERE device_id = $1
         AND delivered = false
         AND created_at > NOW() - INTERVAL '1 hour'
       ORDER BY created_at ASC
       LIMIT 1`,
      [req.device.device_id]
    )

    if (rows.rowCount === 0) {
      reply.send({ status: 'empty' })
      return
    }

    const notif = rows.rows[0]

    // Mark as delivered
    await db.query(
      `UPDATE device_notifications SET delivered = true, delivered_at = NOW()
       WHERE id = $1`,
      [notif.id]
    )

    reply.send({
      status: 'ok',
      notification: {
        id: notif.id,
        message: notif.message,
        display_duration_ms: notif.display_duration_ms ?? 5000,
        priority: notif.priority ?? 1,
      },
    })
  })
```

---

## 5. Session Data Upload

Compressed session blobs from the device's external flash.

```typescript
  // POST /api/device/session
  // Body: raw deflate-compressed binary
  app.post('/api/device/session', {
    preHandler: [authenticateDevice],
    config: { rawBody: true },
  }, async (req, reply) => {
    const compressed = req.rawBody as Buffer
    const sessionJson = zlib.inflateSync(compressed).toString('utf8')
    const session = JSON.parse(sessionJson) as DeviceSession

    await db.query(
      `INSERT INTO device_sessions (device_id, user_id, session_data, recorded_at)
       VALUES ($1, $2, $3, NOW())`,
      [req.device.device_id, req.device.user_id, sessionJson]
    )

    reply.send({ status: 'ok', events_stored: session.events.length })
  })
}
```

---

## 6. Auth Middleware

```typescript
// server/middleware/deviceAuth.ts

import jwt from 'jsonwebtoken'

export async function authenticateDevice(req: any, reply: any) {
  const header = req.headers['authorization'] ?? ''
  if (!header.startsWith('Bearer ')) {
    reply.code(401).send({ error: 'Missing device token' })
    return
  }
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.DEVICE_JWT_SECRET!) as any
    req.device = { device_id: payload.device_id, user_id: payload.user_id }
  } catch {
    reply.code(401).send({ error: 'Invalid device token' })
  }
}

export async function authenticateDeviceOrUser(req: any, reply: any) {
  const header = req.headers['authorization'] ?? ''
  if (header.startsWith('Bearer ')) {
    return authenticateDevice(req, reply)
  }
  // Fall back to existing session cookie auth
  return req.server.authenticate(req, reply)
}
```

---

## 7. Database Schema

```sql
-- devices table
CREATE TABLE devices (
  device_id   VARCHAR(20) PRIMARY KEY,   -- "COSMO-0042"
  serial      VARCHAR(30) UNIQUE,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  paired_at   TIMESTAMPTZ DEFAULT NOW(),
  last_seen   TIMESTAMPTZ
);

-- device_notifications table (created by QIE or admin)
CREATE TABLE device_notifications (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id          VARCHAR(20) REFERENCES devices(device_id),
  message            TEXT NOT NULL,
  display_duration_ms INTEGER DEFAULT 5000,
  priority           SMALLINT DEFAULT 1,   -- 0=low 1=normal 2=urgent
  delivered          BOOLEAN DEFAULT false,
  delivered_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Add source + device_id columns to existing logs table
ALTER TABLE logs ADD COLUMN IF NOT EXISTS source     VARCHAR(30);
ALTER TABLE logs ADD COLUMN IF NOT EXISTS device_id  VARCHAR(20) REFERENCES devices(device_id);

-- device_sessions table
CREATE TABLE device_sessions (
  id           SERIAL PRIMARY KEY,
  device_id    VARCHAR(20) REFERENCES devices(device_id),
  user_id      INTEGER REFERENCES users(id),
  session_data JSONB,
  recorded_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_device_notifications_device_undelivered
  ON device_notifications (device_id, delivered, created_at)
  WHERE delivered = false;
```

---

## 8. WebSocket Push Channel (optional, replaces polling)

```typescript
// server/ws/devicePush.ts
// Upgrade GET /ws/device/:device_id → WebSocket

app.get('/ws/device/:device_id', { websocket: true }, async (conn, req) => {
  const { device_id } = req.params as { device_id: string }

  // Validate device token from query param or header
  const token = req.query.token as string
  let devicePayload: any
  try {
    devicePayload = jwt.verify(token, process.env.DEVICE_JWT_SECRET!)
  } catch {
    conn.socket.close(4001, 'Unauthorized')
    return
  }

  // Register connection in memory map
  deviceConnections.set(device_id, conn.socket)

  conn.socket.on('close', () => {
    deviceConnections.delete(device_id)
  })

  // Keep-alive ping every 30s
  const ping = setInterval(() => conn.socket.ping(), 30000)
  conn.socket.on('close', () => clearInterval(ping))
})

// Push notification to device (called from QIE when notification is created)
export function pushToDevice(device_id: string, notification: DeviceNotification) {
  const socket = deviceConnections.get(device_id)
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(notification))
  }
}
```

---

## 9. Notification Composer (Admin / QIE Integration)

```typescript
// Called by Quantum Intent Engine when a user-relevant notification fires
// Also callable from admin panel for broadcast messages

export async function sendDeviceNotification(
  user_id: number,
  message: string,
  options: { display_duration_ms?: number; priority?: number } = {}
) {
  // Find devices for this user
  const devices = await db.query(
    `SELECT device_id FROM devices WHERE user_id = $1`,
    [user_id]
  )

  for (const row of devices.rows) {
    // Insert into queue table (for polling)
    const inserted = await db.query(
      `INSERT INTO device_notifications
         (device_id, message, display_duration_ms, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING id, message, display_duration_ms, priority`,
      [
        row.device_id,
        message,
        options.display_duration_ms ?? 5000,
        options.priority ?? 1,
      ]
    )

    // Also push via WebSocket if device is connected live
    pushToDevice(row.device_id, inserted.rows[0])
  }
}
```

**Integration with QIE (Quantum Intent Engine):**  
In `src/server/routes/api.ts`, after any pattern match fires a widget recommendation, also call:  
```typescript
await sendDeviceNotification(userId, qie_message_for_pattern(pattern))
```

Example QIE → device messages:
- Anxiety pattern → `"Rest signal."`
- Flow potential → `"Deep work window."`
- Morning clarity → `"Set your intention."`
- Evening overwhelm → `"Slow down."`
- Custom (admin) → any text up to 128 chars

---

## 10. Environment Variables

Add to `.env`:

```bash
DEVICE_JWT_SECRET=<random 64-char hex string>
```

Add to DigitalOcean App Platform environment in `app.yaml`:
```yaml
envs:
  - key: DEVICE_JWT_SECRET
    scope: RUN_TIME
    type: SECRET
```

---

## 11. Migration File

```sql
-- migrations/device_tables.sql
-- Run: psql $DATABASE_URL < migrations/device_tables.sql

CREATE TABLE IF NOT EXISTS devices ( ... );          -- see Section 7
CREATE TABLE IF NOT EXISTS device_notifications ( ... );
ALTER TABLE logs ADD COLUMN IF NOT EXISTS source VARCHAR(30);
ALTER TABLE logs ADD COLUMN IF NOT EXISTS device_id VARCHAR(20);
CREATE TABLE IF NOT EXISTS device_sessions ( ... );
```
