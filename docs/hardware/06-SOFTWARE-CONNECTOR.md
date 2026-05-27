# COSMO Computer — Software Connector
**Document:** 06-SOFTWARE-CONNECTOR  
**Revision:** A  
**Date:** 2026-05-27  

---

## 1. Overview

The **LOT Companion** is desktop software that bridges the COSMO Computer firmware and the LOT Systems platform. It serves three functions:

1. **Firmware flashing** — Flash new firmware over USB-C
2. **Device configuration** — Set Wi-Fi credentials, API host, display brightness
3. **Live monitor** — View UART debug log, sensor data, notification history

It is a cross-platform **Electron** app (macOS, Windows, Linux) built on TypeScript + React, matching the LOT Systems web app design language.

---

## 2. Architecture

```
LOT Companion (Electron App)
├── Main Process (Node.js)
│   ├── serialport          — USB-CDC communication with device
│   ├── esptool-js          — Firmware flashing via WebAssembly esptool
│   ├── lot-api-client      — Communicates with lot-systems.com
│   └── ipcMain handlers    — IPC bridge to renderer
│
└── Renderer Process (React + TypeScript)
    ├── FlashPage           — Firmware select + flash progress
    ├── ConfigPage          — Device settings form
    ├── MonitorPage         — Live UART log + sensor dashboard
    └── NotificationsPage   — Preview notification history from device
```

---

## 3. Directory Structure

```
software/lot-companion/
├── package.json
├── electron.config.ts
├── src/
│   ├── main/
│   │   ├── index.ts              # Electron main process
│   │   ├── serial-manager.ts     # USB serial port management
│   │   ├── flash-manager.ts      # Firmware flash operations
│   │   ├── device-protocol.ts    # UART command/response protocol
│   │   └── lot-api.ts            # lot-systems.com API client
│   └── renderer/
│       ├── App.tsx
│       ├── pages/
│       │   ├── FlashPage.tsx
│       │   ├── ConfigPage.tsx
│       │   ├── MonitorPage.tsx
│       │   └── PairPage.tsx       # BLE pairing guide
│       ├── components/
│       │   ├── DeviceCard.tsx     # Connected device status
│       │   ├── SensorReadout.tsx  # Live sensor values
│       │   ├── LogViewer.tsx      # Scrolling UART log
│       │   └── FirmwareStatus.tsx # Current vs available version
│       └── styles/
│           └── lot-design.css     # LOT design system
└── firmware/
    └── latest/                    # Bundled firmware binary for offline flash
        ├── cosmo-firmware-1.0.0.bin
        └── cosmo-firmware-1.0.0.sha256
```

---

## 4. USB Connection

The COSMO Computer presents as a **USB CDC (Virtual COM Port)** device via the CP2102N bridge.

```typescript
// serial-manager.ts

import { SerialPort } from 'serialport'
import { DelimiterParser } from '@serialport/parser-delimiter'

export class SerialManager {
  private port: SerialPort | null = null
  private parser: DelimiterParser | null = null

  async connect(path: string): Promise<void> {
    this.port = new SerialPort({
      path,
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      autoOpen: false
    })

    this.parser = this.port.pipe(
      new DelimiterParser({ delimiter: '\n' })
    )

    this.parser.on('data', (line: string) => {
      this.handleLogLine(line.toString().trim())
    })

    await new Promise<void>((resolve, reject) => {
      this.port!.open((err) => err ? reject(err) : resolve())
    })
  }

  async sendCommand(cmd: string): Promise<void> {
    if (!this.port?.isOpen) throw new Error('Port not open')
    return new Promise((resolve, reject) => {
      this.port!.write(cmd + '\n', (err) => err ? reject(err) : resolve())
    })
  }

  // Auto-detect COSMO Computer USB devices
  static async listDevices(): Promise<DeviceInfo[]> {
    const ports = await SerialPort.list()
    return ports.filter(p =>
      p.vendorId === '10C4' &&   // Silicon Labs CP2102N
      p.productId === 'EA60'
    ).map(p => ({
      path: p.path,
      serialNumber: p.serialNumber,
      deviceId: 'Unknown'        // Will be read from device after connect
    }))
  }
}
```

---

## 5. Firmware Flash

Firmware flashing uses **esptool-js** (the official Espressif WebAssembly esptool port):

```typescript
// flash-manager.ts

import { ESPLoader, Transport } from 'esptool-js'

export class FlashManager {
  async flashFirmware(
    portPath: string,
    firmwarePath: string,
    onProgress: (percent: number) => void
  ): Promise<void> {

    // 1. Open port at flash baud rate
    const device = new SerialPort({ path: portPath, baudRate: 115200 })
    const transport = new Transport(device)

    // 2. Connect ESPLoader
    const loader = new ESPLoader({
      transport,
      baudrate: 921600,
      loggingEnabled: false
    })

    await loader.main()
    await loader.flashId()

    // 3. Read firmware binary
    const firmwareData = await fs.readFile(firmwarePath)

    // 4. Flash (erase + write)
    await loader.writeFlash({
      fileArray: [{
        data: firmwareData.toString('binary'),
        address: 0x0  // bootloader at 0x0, app at 0x20000, etc.
      }],
      flashSize: 'keep',
      flashMode: 'keep',
      flashFreq: 'keep',
      eraseAll: false,
      compress: true,
      reportProgress: (fileIndex, written, total) => {
        onProgress(Math.round((written / total) * 100))
      }
    })

    // 5. Reset device
    await loader.hardReset()
    await transport.disconnect()
  }
}
```

---

## 6. Device Configuration

The companion app can write device configuration to NVS via the UART debug protocol:

```typescript
// device-protocol.ts

export class DeviceProtocol {
  constructor(private serial: SerialManager) {}

  async getDeviceInfo(): Promise<DeviceInfo> {
    await this.serial.sendCommand('?')
    // Parse response from UART log
    const response = await this.waitForResponse('DEVICE_INFO:', 5000)
    return JSON.parse(response.substring('DEVICE_INFO:'.length))
  }

  async setWifiCredentials(ssid: string, password: string): Promise<void> {
    // Firmware must be in config mode (send 'p' for provisioning mode)
    await this.serial.sendCommand('p')
    await this.waitForResponse('CONFIG_MODE:READY', 3000)

    // Send config as JSON over UART
    const config = JSON.stringify({ wifi_ssid: ssid, wifi_pass: password })
    await this.serial.sendCommand(`CONFIG:${config}`)
    await this.waitForResponse('CONFIG:OK', 5000)
  }

  async triggerOtaUpdate(): Promise<void> {
    await this.serial.sendCommand('u')  // 'u' = trigger OTA check
    await this.waitForResponse('OTA:COMPLETE', 120000)
  }

  async readSensorSnapshot(): Promise<SensorSnapshot> {
    await this.serial.sendCommand('s')
    const response = await this.waitForResponse('SENSORS:', 3000)
    return JSON.parse(response.substring('SENSORS:'.length))
  }
}
```

---

## 7. Live Monitor UI (React)

```tsx
// MonitorPage.tsx

export function MonitorPage({ device }: { device: DeviceConnection }) {
  const [logLines, setLogLines] = useState<LogLine[]>([])
  const [sensors, setSensors] = useState<SensorSnapshot | null>(null)

  useEffect(() => {
    const unsubscribe = device.onLog((line) => {
      setLogLines(prev => [...prev.slice(-500), line])  // Keep last 500 lines

      // Parse sensor data from log lines
      if (line.message.startsWith('SENSORS:')) {
        setSensors(JSON.parse(line.message.substring(8)))
      }
    })
    return unsubscribe
  }, [device])

  return (
    <div className="monitor-layout">
      {/* Sensor Dashboard */}
      <div className="sensor-grid">
        <SensorCard label="Temperature" value={`${sensors?.temperature.toFixed(1)}°C`} />
        <SensorCard label="Humidity" value={`${sensors?.humidity.toFixed(0)}%`} />
        <SensorCard label="Pressure" value={`${sensors?.pressure.toFixed(0)} hPa`} />
        <SensorCard label="IAQ Index" value={`${sensors?.iaq}`}
          color={sensors?.iaq < 100 ? 'green' : sensors?.iaq < 200 ? 'yellow' : 'red'} />
        <SensorCard label="CO₂ eq." value={`${sensors?.co2_equivalent.toFixed(0)} ppm`} />
        <SensorCard label="Battery" value={`${sensors?.battery_percent}%`} />
      </div>

      {/* UART Log Viewer */}
      <LogViewer lines={logLines} />

      {/* Quick Actions */}
      <div className="actions">
        <button onClick={() => device.sendCommand('n')}>Force Poll</button>
        <button onClick={() => device.sendCommand('c')}>Simulate COPY</button>
        <button onClick={() => device.sendCommand('r')}>Restart</button>
      </div>
    </div>
  )
}
```

---

## 8. Design: LOT Companion UI

The companion app uses LOT Systems' design language:

```css
/* lot-design.css */

:root {
  --bg-primary: #0A0A0A;
  --bg-secondary: #141414;
  --bg-card: #1A1A1A;
  --text-primary: #F5F5F5;
  --text-secondary: #888888;
  --accent: #C8A96E;         /* LOT warm gold */
  --success: #4CAF50;
  --warning: #FFC107;
  --error: #FF4444;
  --font: 'Arial', system-ui, sans-serif;
  --mono: 'Courier New', monospace;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font);
}

.sensor-card {
  background: var(--bg-card);
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  padding: 16px;
  font-family: var(--mono);
}

.log-viewer {
  background: var(--bg-secondary);
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.5;
  color: #CCCCCC;
  overflow-y: auto;
  height: 300px;
}
```

---

## 9. Build & Distribution

```bash
# Install dependencies
cd software/lot-companion
npm install

# Run in development
npm run dev

# Build for macOS
npm run build:mac

# Build for Windows
npm run build:win

# Build for Linux
npm run build:linux
```

Distributables output to `dist/`:
- macOS: `LOT Companion-1.0.0.dmg`
- Windows: `LOT Companion Setup 1.0.0.exe`
- Linux: `LOT-Companion-1.0.0.AppImage`

---

## 10. package.json

```json
{
  "name": "lot-companion",
  "version": "1.0.0",
  "description": "COSMO Computer companion app",
  "main": "dist-electron/main/index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux"
  },
  "dependencies": {
    "serialport": "^12.0.0",
    "@serialport/parser-delimiter": "^12.0.0",
    "esptool-js": "^0.4.1",
    "electron": "^28.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "electron-builder": "^24.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "vite-plugin-electron": "^0.28.0"
  },
  "build": {
    "appId": "com.lot-systems.companion",
    "productName": "LOT Companion",
    "win": { "target": "nsis" },
    "mac": { "target": "dmg" },
    "linux": { "target": "AppImage" }
  }
}
```

---

*Document: 06-SOFTWARE-CONNECTOR.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
