#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_SCRIPT="$SCRIPT_DIR/install-workflow.sh"

if [[ ! -f "$TARGET_SCRIPT" ]]; then
  echo "Workflow installer not found: $TARGET_SCRIPT" >&2
  exit 1
fi

echo "[compat] install-codex.sh now forwards to install-workflow.sh. Please switch to the new name." >&2

exec bash "$TARGET_SCRIPT" "$@"
