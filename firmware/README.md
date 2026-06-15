# COSMO® CIA — Firmware

**Platform:** ESP32-S3 / ESP-IDF v5.2 / FreeRTOS
**Version:** 1.0.0
**Repo path:** `/firmware/`

## Quick Start

```bash
# Install ESP-IDF v5.2
git clone --recursive https://github.com/espressif/esp-idf.git -b v5.2
cd esp-idf && ./install.sh esp32s3
. ./export.sh

# Build
cd /path/to/LOT-Computer/firmware
idf.py set-target esp32s3
idf.py build

# Flash (factory test jig)
idf.py -p /dev/ttyUSB0 flash monitor
```

## Structure

```
firmware/
  main/           — Application tasks and drivers
  components/
    lz4/          — LZ4 compression library
    bsec2/        — Bosch BSEC2 pre-compiled library
  CMakeLists.txt
  partitions.csv
  sdkconfig.defaults
```

## Full Firmware Documentation

See: `docs/hardware/firmware/COSMO-CIA-FIRMWARE-v1.md`
