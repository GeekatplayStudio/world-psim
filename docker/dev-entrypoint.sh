#!/bin/sh
set -eu

package_name="${1:?Package filter is required}"
script_name="${2:-dev}"
ready_file="/app/node_modules/.modules.yaml"
lock_dir="/app/node_modules/.pnpm-install-lock"

ensure_workspace_dependencies() {
  mkdir -p /app/node_modules

  while [ ! -f "$ready_file" ]; do
    if mkdir "$lock_dir" 2>/dev/null; then
      trap 'rmdir "$lock_dir" >/dev/null 2>&1 || true' EXIT INT TERM

      if [ ! -f "$ready_file" ]; then
        pnpm install --frozen-lockfile
      fi

      rmdir "$lock_dir" >/dev/null 2>&1 || true
      trap - EXIT INT TERM
      break
    fi

    echo "Waiting for workspace dependencies..."
    sleep 2
  done
}

cd /app
ensure_workspace_dependencies

exec pnpm --filter "$package_name" "$script_name"