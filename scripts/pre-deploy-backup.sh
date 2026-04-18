#!/bin/bash
###############################################################################
# LOT Systems - Pre-Deploy Backup
#
# Run this BEFORE deploying a new version to production.
# Creates a point-in-time snapshot for instant rollback if the deploy fails.
#
# Usage:
#   ./scripts/pre-deploy-backup.sh
#
# In your deploy workflow:
#   ./scripts/pre-deploy-backup.sh && yarn production:run
###############################################################################

set -euo pipefail

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
DEPLOY_BACKUP_DIR="backups/pre-deploy"

echo -e "${BLUE}Pre-deploy backup starting...${NC}"
echo "  Timestamp: $TIMESTAMP"
echo "  Git commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
echo ""

mkdir -p "$DEPLOY_BACKUP_DIR"

# 1. Quick database snapshot
if [ -n "${DB_HOST:-}" ] && [ -n "${DB_USER:-}" ] && [ -n "${DB_PASSWORD:-}" ] && command -v pg_dump &>/dev/null; then
  echo -e "${BLUE}Creating database snapshot...${NC}"
  PGPASSWORD="${DB_PASSWORD}" pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT:-25060}" \
    -U "${DB_USER}" \
    -d "${DB_NAME:-defaultdb}" \
    --no-owner --no-privileges --clean --if-exists \
    -F c \
    -f "$DEPLOY_BACKUP_DIR/pre-deploy-${TIMESTAMP}.dump" 2>/dev/null

  if [ -f "$DEPLOY_BACKUP_DIR/pre-deploy-${TIMESTAMP}.dump" ]; then
    SIZE=$(du -h "$DEPLOY_BACKUP_DIR/pre-deploy-${TIMESTAMP}.dump" | cut -f1)
    echo -e "${GREEN}Database snapshot created ($SIZE)${NC}"
  else
    echo -e "${RED}Database snapshot failed${NC}"
    exit 1
  fi
else
  echo -e "${RED}Cannot create database snapshot (missing pg_dump or credentials)${NC}"
  echo "  Continuing without database backup..."
fi

# 2. Record deploy metadata
cat > "$DEPLOY_BACKUP_DIR/pre-deploy-${TIMESTAMP}.json" << EOF
{
  "timestamp": "${TIMESTAMP}",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "version": "$(grep '"version"' package.json | head -1 | cut -d'"' -f4)",
  "type": "pre-deploy"
}
EOF

# 3. Keep only last 5 pre-deploy backups
ls -t "$DEPLOY_BACKUP_DIR"/pre-deploy-*.dump 2>/dev/null | tail -n +6 | while read f; do
  rm -f "$f"
  rm -f "${f%.dump}.json"
  echo "  Cleaned old: $(basename "$f")"
done

echo ""
echo -e "${GREEN}Pre-deploy backup complete.${NC}"
echo "  To rollback: pg_restore -h HOST -p PORT -U USER -d DB --clean $DEPLOY_BACKUP_DIR/pre-deploy-${TIMESTAMP}.dump"
