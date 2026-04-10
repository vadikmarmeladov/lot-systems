#!/bin/bash
###############################################################################
# LOT Systems - Encrypted Database Backup to GitHub
#
# Creates an AES-256-encrypted database backup and pushes it to a private
# GitHub repository for off-site disaster recovery.
#
# SECURITY:
# - Backups are encrypted with AES-256-CBC before leaving the server
# - Encryption key is derived from BACKUP_ENCRYPTION_KEY env variable
# - Only encrypted data is stored in the GitHub repo
# - Backups are stored in a separate branch to avoid polluting main
#
# SETUP:
# 1. Create a PRIVATE GitHub repo for backups (e.g., lot-backups)
# 2. Set BACKUP_ENCRYPTION_KEY: openssl rand -hex 32
# 3. Set BACKUP_GITHUB_REPO: git@github.com:your-org/lot-backups.git
# 4. Ensure SSH key or GitHub token is configured for push access
#
# Usage:
#   ./scripts/backup-to-github.sh              # Full backup
#   ./scripts/backup-to-github.sh --db-only    # Database only
#   ./scripts/backup-to-github.sh --verify     # Verify latest backup
#   ./scripts/backup-to-github.sh --decrypt /path/to/file.enc  # Decrypt
#
# Cron (daily at 3 AM):
#   0 3 * * * cd /path/to/lot-systems && ./scripts/backup-to-github.sh >> logs/backup.log 2>&1
###############################################################################

set -euo pipefail

# Load environment
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="backups/encrypted"
BACKUP_BRANCH="backup/automated"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
DATE_FOLDER=$(date +%Y/%m)
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-90}

# Required environment variables
ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"
GITHUB_REPO="${BACKUP_GITHUB_REPO:-}"

# =============================================================================
# VALIDATION
# =============================================================================

validate_env() {
  local errors=0

  if [ -z "$ENCRYPTION_KEY" ]; then
    echo -e "${RED}ERROR: BACKUP_ENCRYPTION_KEY not set${NC}"
    echo "Generate one with: openssl rand -hex 32"
    errors=$((errors + 1))
  elif [ ${#ENCRYPTION_KEY} -lt 32 ]; then
    echo -e "${RED}ERROR: BACKUP_ENCRYPTION_KEY is too short (min 32 chars)${NC}"
    errors=$((errors + 1))
  fi

  if [ -z "$GITHUB_REPO" ]; then
    echo -e "${YELLOW}WARNING: BACKUP_GITHUB_REPO not set - backup will be local only${NC}"
  fi

  if [ -z "${DB_HOST:-}" ] || [ -z "${DB_USER:-}" ] || [ -z "${DB_PASSWORD:-}" ]; then
    echo -e "${RED}ERROR: Database credentials not configured (DB_HOST, DB_USER, DB_PASSWORD)${NC}"
    errors=$((errors + 1))
  fi

  if ! command -v openssl &> /dev/null; then
    echo -e "${RED}ERROR: openssl is required but not installed${NC}"
    errors=$((errors + 1))
  fi

  if [ $errors -gt 0 ]; then
    echo -e "${RED}Aborting: $errors configuration error(s)${NC}"
    exit 1
  fi
}

# =============================================================================
# ENCRYPTION / DECRYPTION
# =============================================================================

encrypt_file() {
  local input="$1"
  local output="$2"

  # Derive a proper key and IV from the password using PBKDF2
  openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 \
    -in "$input" -out "$output" -pass "pass:${ENCRYPTION_KEY}"

  echo -e "${GREEN}Encrypted: $(basename "$output")${NC}"
}

decrypt_file() {
  local input="$1"
  local output="${2:-${input%.enc}}"

  openssl enc -aes-256-cbc -d -salt -pbkdf2 -iter 100000 \
    -in "$input" -out "$output" -pass "pass:${ENCRYPTION_KEY}"

  echo -e "${GREEN}Decrypted: $(basename "$output")${NC}"
}

# =============================================================================
# DATABASE BACKUP
# =============================================================================

backup_database() {
  echo -e "${BLUE}[1/4] Creating database backup...${NC}"

  local db_backup="$BACKUP_DIR/lot-db-${TIMESTAMP}.sql"
  local db_compressed="${db_backup}.gz"
  local db_encrypted="${db_compressed}.enc"

  mkdir -p "$BACKUP_DIR"

  # Dump the database
  PGPASSWORD="${DB_PASSWORD}" pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT:-25060}" \
    -U "${DB_USER}" \
    -d "${DB_NAME:-defaultdb}" \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    -F p \
    -f "$db_backup" 2>/dev/null

  if [ ! -f "$db_backup" ] || [ ! -s "$db_backup" ]; then
    echo -e "${RED}Database backup failed or is empty${NC}"
    return 1
  fi

  local raw_size=$(du -h "$db_backup" | cut -f1)
  echo "  Raw dump: $raw_size"

  # Compress
  gzip "$db_backup"
  local compressed_size=$(du -h "$db_compressed" | cut -f1)
  echo "  Compressed: $compressed_size"

  # Encrypt
  encrypt_file "$db_compressed" "$db_encrypted"
  local encrypted_size=$(du -h "$db_encrypted" | cut -f1)
  echo "  Encrypted: $encrypted_size"

  # Remove unencrypted compressed file
  rm -f "$db_compressed"

  # Create checksum for integrity verification
  sha256sum "$db_encrypted" > "${db_encrypted}.sha256"

  echo -e "${GREEN}Database backup complete${NC}"
  echo "$db_encrypted"
}

# =============================================================================
# APPLICATION STATE BACKUP
# =============================================================================

backup_app_state() {
  echo -e "${BLUE}[2/4] Backing up application state...${NC}"

  local state_dir="$BACKUP_DIR/state-${TIMESTAMP}"
  mkdir -p "$state_dir"

  # Git state (safe metadata only - no secrets)
  git rev-parse HEAD > "$state_dir/git-commit.txt" 2>/dev/null || true
  git branch --show-current > "$state_dir/git-branch.txt" 2>/dev/null || true

  # Package manifest (dependency pinning for exact reproduction)
  cp package.json "$state_dir/package.json" 2>/dev/null || true
  cp yarn.lock "$state_dir/yarn.lock" 2>/dev/null || true

  # Schema/migration state
  cp -r migrations/ "$state_dir/migrations/" 2>/dev/null || true

  # Environment template (NOT actual .env)
  cp .env.example "$state_dir/.env.example" 2>/dev/null || true

  # Docker/deployment config templates
  cp Dockerfile "$state_dir/Dockerfile" 2>/dev/null || true
  cp tsconfig.json "$state_dir/tsconfig.json" 2>/dev/null || true
  cp tsconfig.server.json "$state_dir/tsconfig.server.json" 2>/dev/null || true

  # Create tarball, compress, encrypt
  local state_archive="$BACKUP_DIR/lot-state-${TIMESTAMP}.tar.gz"
  local state_encrypted="${state_archive}.enc"

  tar -czf "$state_archive" -C "$BACKUP_DIR" "state-${TIMESTAMP}" 2>/dev/null
  encrypt_file "$state_archive" "$state_encrypted"
  sha256sum "$state_encrypted" > "${state_encrypted}.sha256"

  # Clean up unencrypted files
  rm -rf "$state_dir" "$state_archive"

  echo -e "${GREEN}Application state backup complete${NC}"
}

# =============================================================================
# BACKUP MANIFEST
# =============================================================================

create_manifest() {
  echo -e "${BLUE}[3/4] Creating backup manifest...${NC}"

  local manifest="$BACKUP_DIR/MANIFEST-${TIMESTAMP}.json"

  cat > "$manifest" << EOF
{
  "timestamp": "${TIMESTAMP}",
  "version": "$(grep '"version"' package.json | head -1 | cut -d'"' -f4)",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "encryption": "AES-256-CBC with PBKDF2 (100000 iterations)",
  "files": [
    $(ls -1 "$BACKUP_DIR"/*-${TIMESTAMP}* 2>/dev/null | while read f; do
      echo "    {\"name\": \"$(basename "$f")\", \"size\": $(stat -c%s "$f" 2>/dev/null || stat -f%z "$f" 2>/dev/null || echo 0)}"
    done | paste -sd ',' -)
  ],
  "recovery": {
    "decrypt": "openssl enc -aes-256-cbc -d -salt -pbkdf2 -iter 100000 -in FILE.enc -out FILE -pass pass:YOUR_KEY",
    "restoreDb": "gunzip backup.sql.gz && psql -h HOST -p PORT -U USER -d DB < backup.sql",
    "restoreApp": "git checkout COMMIT && yarn install && yarn build && yarn start"
  }
}
EOF

  echo -e "${GREEN}Manifest created${NC}"
}

# =============================================================================
# PUSH TO GITHUB
# =============================================================================

push_to_github() {
  if [ -z "$GITHUB_REPO" ]; then
    echo -e "${YELLOW}[4/4] Skipping GitHub push (BACKUP_GITHUB_REPO not set)${NC}"
    return 0
  fi

  echo -e "${BLUE}[4/4] Pushing encrypted backup to GitHub...${NC}"

  local backup_repo_dir="/tmp/lot-backup-repo-$$"
  trap "rm -rf '$backup_repo_dir'" EXIT

  # Clone or init the backup repo
  if git clone --depth 1 --branch "$BACKUP_BRANCH" "$GITHUB_REPO" "$backup_repo_dir" 2>/dev/null; then
    echo "  Cloned existing backup branch"
  else
    mkdir -p "$backup_repo_dir"
    cd "$backup_repo_dir"
    git init
    git checkout -b "$BACKUP_BRANCH"
    git remote add origin "$GITHUB_REPO"
    cd - > /dev/null
  fi

  # Copy encrypted files into date-organized structure
  local target_dir="$backup_repo_dir/$DATE_FOLDER"
  mkdir -p "$target_dir"
  cp "$BACKUP_DIR"/*-${TIMESTAMP}* "$target_dir/"

  # Add a top-level latest reference
  cat > "$backup_repo_dir/LATEST.md" << EOF
# Latest Backup: ${TIMESTAMP}

**Date:** $(date '+%Y-%m-%d %H:%M:%S %Z')
**App Version:** $(grep '"version"' package.json | head -1 | cut -d'"' -f4)
**Git Commit:** $(git rev-parse HEAD 2>/dev/null || echo 'unknown')

## Recovery

1. Clone this repo and checkout \`${BACKUP_BRANCH}\`
2. Navigate to \`${DATE_FOLDER}/\`
3. Decrypt: \`openssl enc -aes-256-cbc -d -salt -pbkdf2 -iter 100000 -in FILE.enc -out FILE -pass pass:YOUR_KEY\`
4. For database: \`gunzip backup.sql.gz && psql < backup.sql\`
5. For app state: \`tar xzf state.tar.gz\`

**IMPORTANT:** The decryption key is stored separately from this repo.
Never commit the BACKUP_ENCRYPTION_KEY to any repository.
EOF

  # Commit and push
  cd "$backup_repo_dir"
  git add -A
  git commit -m "Automated backup: ${TIMESTAMP}" --allow-empty 2>/dev/null

  # Retry push with exponential backoff
  local max_retries=4
  local delay=2
  for i in $(seq 1 $max_retries); do
    if git push -u origin "$BACKUP_BRANCH" 2>/dev/null; then
      echo -e "${GREEN}Backup pushed to GitHub successfully${NC}"
      cd - > /dev/null
      return 0
    fi
    echo -e "${YELLOW}  Push attempt $i failed, retrying in ${delay}s...${NC}"
    sleep $delay
    delay=$((delay * 2))
  done

  echo -e "${RED}Failed to push to GitHub after $max_retries attempts${NC}"
  cd - > /dev/null
  return 1
}

# =============================================================================
# CLEANUP OLD LOCAL BACKUPS
# =============================================================================

cleanup_old_backups() {
  echo -e "${BLUE}Cleaning up local backups older than ${RETENTION_DAYS} days...${NC}"

  local count=0
  find "$BACKUP_DIR" -name "*.enc" -mtime +${RETENTION_DAYS} -type f 2>/dev/null | while read f; do
    rm -f "$f" "${f}.sha256"
    count=$((count + 1))
    echo "  Removed: $(basename "$f")"
  done

  # Also clean up old manifests
  find "$BACKUP_DIR" -name "MANIFEST-*.json" -mtime +${RETENTION_DAYS} -type f -delete 2>/dev/null

  echo -e "${GREEN}Cleanup complete${NC}"
}

# =============================================================================
# VERIFY BACKUP
# =============================================================================

verify_backup() {
  echo -e "${BLUE}Verifying latest backup...${NC}"

  local latest_db=$(ls -t "$BACKUP_DIR"/lot-db-*.enc 2>/dev/null | head -1)
  if [ -z "$latest_db" ]; then
    echo -e "${RED}No database backups found${NC}"
    return 1
  fi

  echo "  Latest backup: $(basename "$latest_db")"
  echo "  Size: $(du -h "$latest_db" | cut -f1)"
  echo "  Date: $(stat -c%y "$latest_db" 2>/dev/null || stat -f%Sm "$latest_db" 2>/dev/null)"

  # Verify checksum
  if [ -f "${latest_db}.sha256" ]; then
    if sha256sum -c "${latest_db}.sha256" &>/dev/null; then
      echo -e "  Checksum: ${GREEN}VALID${NC}"
    else
      echo -e "  Checksum: ${RED}INVALID${NC}"
      return 1
    fi
  fi

  # Test decryption (decrypt to /dev/null to verify key works)
  local test_output="/tmp/lot-backup-verify-$$.sql.gz"
  if decrypt_file "$latest_db" "$test_output" 2>/dev/null; then
    local test_size=$(du -h "$test_output" | cut -f1)
    echo -e "  Decryption: ${GREEN}OK${NC} ($test_size)"
    rm -f "$test_output"
  else
    echo -e "  Decryption: ${RED}FAILED${NC} (wrong key?)"
    rm -f "$test_output"
    return 1
  fi

  echo -e "${GREEN}Backup verification passed${NC}"
}

# =============================================================================
# MAIN
# =============================================================================

main() {
  echo "==========================================="
  echo " LOT Systems - Encrypted Backup"
  echo " $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo "==========================================="
  echo ""

  case "${1:-}" in
    --verify)
      validate_env
      verify_backup
      ;;
    --decrypt)
      if [ -z "${2:-}" ]; then
        echo -e "${RED}Usage: $0 --decrypt /path/to/file.enc${NC}"
        exit 1
      fi
      decrypt_file "$2" "${3:-}"
      ;;
    --db-only)
      validate_env
      backup_database
      create_manifest
      push_to_github
      cleanup_old_backups
      ;;
    *)
      validate_env
      backup_database
      backup_app_state
      create_manifest
      push_to_github
      cleanup_old_backups
      ;;
  esac

  echo ""
  echo "==========================================="
  echo -e " ${GREEN}Backup process complete!${NC}"
  echo "==========================================="
}

main "$@"
