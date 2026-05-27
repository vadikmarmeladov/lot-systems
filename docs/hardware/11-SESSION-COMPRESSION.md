# COSMO Computer — Session Data Compression Spec
**Document:** 11-SESSION-COMPRESSION  
**Revision:** A  
**Date:** 2026-05-27  

---

## 1. Overview

Each time the COSMO Computer is awake and connected, it accumulates a **session**. A session begins at boot and ends at shutdown (power off / sleep). During the session, the device logs:

- Notifications received + displayed
- COPY button presses
- Sensor readings (every 15 minutes)
- Wi-Fi RSSI samples
- System events (OTA updates, reboots, errors)

This data is compressed and stored in NVS, then uploaded to lot-systems.com at the end of each session (or at the next available Wi-Fi connection).

The goal: **compress 4–16 KB of session data to < 2 KB** to fit within NVS limits and minimise upload bandwidth.

---

## 2. Session Data Structure (Binary Format)

```c
// session.h

#define SESSION_MAGIC        0x434F534D  // "COSM"
#define SESSION_VERSION      0x01

typedef struct __attribute__((packed)) {
    uint32_t magic;           // SESSION_MAGIC
    uint8_t  version;         // SESSION_VERSION
    char     device_id[24];   // "CC-R1-20260601-0001"
    uint32_t session_id;      // monotonically increasing counter
    uint32_t start_ts;        // UNIX timestamp, session start
    uint32_t end_ts;          // UNIX timestamp, session end (0 if ongoing)
    uint16_t notification_count;
    uint16_t copy_count;
    uint16_t sensor_sample_count;
    uint16_t event_count;
    uint8_t  fw_version_major;
    uint8_t  fw_version_minor;
    uint8_t  fw_version_patch;
    uint8_t  reserved[3];
} session_header_t;  // 64 bytes

typedef struct __attribute__((packed)) {
    uint32_t timestamp;       // UNIX timestamp
    char     notif_id[16];    // "notif_xxxxxxxx"
    uint8_t  text_len;        // length of text (0–200)
    uint8_t  text[200];       // notification text (UTF-8)
    uint8_t  priority;        // 0=normal, 1=urgent
    uint8_t  copied;          // 1 if COPY was pressed for this notification
} session_notification_t;    // ~220 bytes each

typedef struct __attribute__((packed)) {
    uint32_t timestamp;
    int16_t  temperature_x10;  // °C × 10 (e.g., 224 = 22.4°C)
    uint16_t humidity_x10;     // % × 10 (e.g., 482 = 48.2%)
    uint32_t pressure_x10;     // hPa × 10 (e.g., 10132 = 1013.2 hPa)
    uint16_t iaq;              // 0–500
    uint16_t co2_eq_x10;       // ppm × 10
    uint16_t voc_eq_x100;      // ppm × 100
    uint16_t ambient_lux;      // 0–65535 lux
    uint8_t  battery_pct;      // 0–100
    int8_t   wifi_rssi;        // dBm (signed)
    uint8_t  charging;         // 0/1
    uint8_t  activity;         // 0=still, 1=walking, 2=carried
} session_sensor_t;           // 22 bytes each

typedef struct __attribute__((packed)) {
    uint32_t timestamp;
    uint8_t  type;             // EVENT_BOOT, EVENT_OTA, EVENT_ERROR, etc.
    uint8_t  data[8];          // event-specific payload
} session_event_t;            // 13 bytes each
```

---

## 3. Raw Session Size Estimate

Assumptions: 8-hour session, 60-second poll, 15-minute sensor sampling

| Component | Count | Bytes each | Total |
|-----------|-------|-----------|-------|
| Header | 1 | 64 | 64 |
| Notifications | 8 (typical 8-hr day) | 220 | 1,760 |
| Sensor samples | 32 (every 15 min × 8h) | 22 | 704 |
| Events | 10 | 13 | 130 |
| **Total raw** | | | **~2,658 bytes** |

Worst case (24h, 48 notifications): ~12 KB raw

---

## 4. Compression Algorithm: LZ4

**LZ4** is chosen for its:
- Very fast decompression (suitable for server-side decode)
- Reasonable compression ratio on structured binary data
- Small encoder footprint (< 4 KB code, no heap allocation needed)
- Available as MIT-licensed single-file C implementation

**Library:** `lz4.c` / `lz4.h` from https://github.com/lz4/lz4 (single-file version)

```c
// compression.c

#include "lz4.h"

#define SESSION_RAW_MAX      16384   // 16 KB max raw
#define SESSION_COMP_MAX     LZ4_COMPRESSBOUND(SESSION_RAW_MAX)

static uint8_t raw_buf[SESSION_RAW_MAX];
static uint8_t comp_buf[SESSION_COMP_MAX];

int session_compress(const uint8_t *raw, size_t raw_len,
                     uint8_t **out_comp, size_t *out_len) {
    if (raw_len > SESSION_RAW_MAX) return -1;

    int comp_len = LZ4_compress_default(
        (const char *)raw,
        (char *)comp_buf,
        (int)raw_len,
        (int)SESSION_COMP_MAX
    );

    if (comp_len <= 0) return -2;

    *out_comp = comp_buf;
    *out_len  = (size_t)comp_len;
    return 0;
}
```

**Expected compression ratios:**

| Data type | LZ4 ratio | Notes |
|-----------|-----------|-------|
| Notification text (English) | 2.5–3.5× | Text compresses well |
| Sensor data (binary structs) | 1.8–2.5× | Repeated fields help |
| Mixed session | ~2.5× | Typical |

For a typical 2,658-byte session: compressed to ~1,063 bytes.  
For worst-case 12 KB: compressed to ~4.8 KB.

---

## 5. NVS Storage Layout

The session partition (`session`, 512 KB) stores:

```
[0x000000] Session Index (4 KB)
           - session_count (uint32)
           - [session_0_offset, session_0_len]
           - [session_1_offset, session_1_len]
           - ... (up to 64 sessions)

[0x001000] Session Data Area (508 KB)
           - Circular buffer of compressed session blobs
           - Each session: 4-byte raw_len + N-byte LZ4 compressed data
```

```c
// session_store.c

void session_store_current(void) {
    uint8_t *comp;
    size_t comp_len;

    // Serialise session to raw_buf
    session_serialise(raw_buf, &raw_len);

    // Compress
    session_compress(raw_buf, raw_len, &comp, &comp_len);

    // Write to NVS partition
    nvs_handle_t handle;
    nvs_open_from_partition("session", "sess", NVS_READWRITE, &handle);

    char key[16];
    snprintf(key, sizeof(key), "s%06u", session_count);
    nvs_set_blob(handle, key, comp, comp_len);
    nvs_set_u32(handle, "count", ++session_count);
    nvs_commit(handle);
    nvs_close(handle);
}
```

---

## 6. Upload Protocol

After each session completes and Wi-Fi is available:

```c
// task_lot_api.c — session upload

void lot_api_upload_pending_sessions(void) {
    uint32_t count = nvs_get_session_count();
    uint32_t last_uploaded = nvs_get_last_uploaded_session();

    for (uint32_t i = last_uploaded + 1; i <= count; i++) {
        uint8_t *comp_data;
        size_t comp_len;
        uint32_t raw_len;

        nvs_load_session(i, &comp_data, &comp_len, &raw_len);

        // POST to /api/device/session-upload
        esp_http_client_config_t config = {
            .url = "https://lot-systems.com/api/device/session-upload",
            .method = HTTP_METHOD_POST,
        };
        esp_http_client_handle_t client = esp_http_client_init(&config);

        esp_http_client_set_header(client, "Authorization", auth_header);
        esp_http_client_set_header(client, "Content-Type", "application/octet-stream");
        esp_http_client_set_header(client, "X-Compression", "lz4");
        esp_http_client_set_header(client, "X-Uncompressed-Size",
                                   uint_to_str(raw_len));

        char session_id_str[32];
        snprintf(session_id_str, sizeof(session_id_str),
                 "session_%s_%06u", device_id, i);
        esp_http_client_set_header(client, "X-Session-ID", session_id_str);

        esp_http_client_set_post_field(client, (char*)comp_data, comp_len);
        esp_http_client_perform(client);

        int status = esp_http_client_get_status_code(client);
        if (status == 200 || status == 201) {
            nvs_set_last_uploaded_session(i);
        }

        esp_http_client_cleanup(client);
    }
}
```

---

## 7. Server-Side Decompression (TypeScript)

```typescript
// src/server/routes/device-api.ts

import * as lz4 from 'lz4'  // npm install lz4

export async function handleSessionUpload(req: Request, res: Response) {
  const compression = req.headers['x-compression'] as string
  const uncompressedSize = parseInt(req.headers['x-uncompressed-size'] as string)
  const sessionId = req.headers['x-session-id'] as string
  const deviceId = (req as any).device.id

  const compressedData = req.body as Buffer

  let rawData: Buffer
  if (compression === 'lz4') {
    rawData = Buffer.alloc(uncompressedSize)
    lz4.decodeBlock(compressedData, rawData)
  } else {
    rawData = compressedData
  }

  // Parse binary session format
  const session = parseSessionBinary(rawData)

  // Store in database
  await db.deviceSessions.create({
    data: {
      sessionId,
      deviceId,
      startTs: new Date(session.header.start_ts * 1000),
      endTs: new Date(session.header.end_ts * 1000),
      notifications: session.notifications,
      sensorReadings: session.sensor_samples,
      events: session.events,
      rawCompressedSize: compressedData.length,
      rawUncompressedSize: uncompressedSize
    }
  })

  res.json({ session_id: sessionId, received: true })
}
```

---

## 8. Compression Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| Compression ratio | ≥ 2.0× | Minimum acceptable |
| Encode time (ESP32-S3) | < 50 ms for 16 KB | Non-blocking |
| Compressed size per 8-hr session | < 1.5 KB | Fits easily in NVS |
| Upload time (typical Wi-Fi) | < 0.5 s | Minimal battery impact |
| NVS capacity (512 KB) | ≥ 30 days of sessions | Before upload required |

---

*Document: 11-SESSION-COMPRESSION.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
