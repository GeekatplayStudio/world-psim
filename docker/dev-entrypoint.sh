#!/bin/sh
set -eu

package_name="${1:?Package filter is required}"
script_name="${2:-dev}"
ready_file="/app/node_modules/.modules.yaml"
stamp_file="/app/node_modules/.balancesphere-deps-stamp"
lock_dir="/app/node_modules/.pnpm-install-lock"

compute_dependency_stamp() {
  sha256sum \
    /app/pnpm-lock.yaml \
    /app/package.json \
    /app/apps/web/package.json \
    /app/apps/api/package.json \
    /app/apps/worker/package.json \
    /app/packages/shared/package.json \
    /app/packages/database/package.json | sha256sum | awk '{print $1}'
}

dependencies_are_current() {
  [ -f "$ready_file" ] || return 1
  [ -f "$stamp_file" ] || return 1

  current_stamp="$(compute_dependency_stamp)"
  recorded_stamp="$(cat "$stamp_file" 2>/dev/null || true)"

  [ "$recorded_stamp" = "$current_stamp" ]
}

write_dependency_stamp() {
  compute_dependency_stamp > "$stamp_file"
}

ensure_workspace_dependencies() {
  mkdir -p /app/node_modules

  while ! dependencies_are_current; do
    if mkdir "$lock_dir" 2>/dev/null; then
      trap 'rmdir "$lock_dir" >/dev/null 2>&1 || true' EXIT INT TERM

      if ! dependencies_are_current; then
        CI=true pnpm install --frozen-lockfile --force
        write_dependency_stamp
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