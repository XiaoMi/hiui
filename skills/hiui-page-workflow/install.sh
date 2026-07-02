#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALLER_PATH="$SCRIPT_DIR/scripts/install-workflow-bundle.mjs"

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: $command_name" >&2
    exit 1
  fi
}

require_command git
require_command node
require_command python3

if [[ ! -f "$INSTALLER_PATH" ]]; then
  echo "Bundle installer not found: $INSTALLER_PATH" >&2
  exit 1
fi

exec node "$INSTALLER_PATH" "$@"
