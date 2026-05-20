#!/bin/bash
# LOT Systems — Trigger DO App Platform rebuild
# Usage: ./scripts/rebuild.sh [reason]
# Requires: doctl authenticated (doctl auth init)

set -euo pipefail

REASON="${1:-Manual rebuild}"
APP_NAME="lot-systems"

echo "[LOT] Rebuild triggered: $REASON"
echo "[LOT] Time: $(date -u '+%Y-%m-%d %H:%M UTC')"

APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | grep "$APP_NAME" | awk '{print $1}')
if [ -z "$APP_ID" ]; then
  echo "[LOT] Error: Could not find $APP_NAME app"
  exit 1
fi
echo "[LOT] App ID: $APP_ID"

echo "[LOT] Creating deployment with force-rebuild..."
doctl apps create-deployment "$APP_ID" --force-rebuild

echo "[LOT] Deployment queued. Monitor at:"
echo "       https://cloud.digitalocean.com/apps/$APP_ID/deployments"
echo "[LOT] Or run: doctl apps list-deployments $APP_ID"
