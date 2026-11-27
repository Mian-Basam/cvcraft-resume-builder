#!/usr/bin/env bash
# CVCraft launcher: installs dependencies when needed and runs the app.
#
#   ./run.sh [command] [--lan]
#
# Commands:
#   dev      (default) development server with hot reload
#   build    production build into .next/ (refuses while a dev server uses .next)
#   start    serve the production build (builds first if there is none)
#   install  install / update npm dependencies
#   clean    delete the .next build output
#   help     show this help
#
# Options / environment:
#   --lan        listen on all network interfaces so phones on the same Wi-Fi can open it
#   PORT=3010    port to use (default 3000)

set -euo pipefail

cd "$(dirname "$0")"
PROJECT_DIR="$(pwd -P)"
PORT="${PORT:-3000}"
HOST="localhost"
COMMAND="dev"
MIN_NODE_MAJOR=18
MIN_NODE_MINOR=17

for arg in "$@"; do
  case "$arg" in
    --lan) HOST="0.0.0.0" ;;
    dev|build|start|install|clean|help|-h|--help) COMMAND="$arg" ;;
    *) echo "Unknown argument: $arg (try ./run.sh help)" >&2; exit 1 ;;
  esac
done

info() { printf '\033[1;34m▸\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; exit 1; }

show_help() {
  sed -n '2,17p' "$0" | sed 's/^# \{0,1\}//'
}

check_node() {
  command -v node >/dev/null 2>&1 || fail "Node.js is not installed. Get version ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}+ from https://nodejs.org"
  command -v npm >/dev/null 2>&1 || fail "npm is not installed (it normally comes with Node.js)."
  local version major minor
  version="$(node -v | sed 's/^v//')"
  major="${version%%.*}"
  minor="$(echo "$version" | cut -d. -f2)"
  if (( major < MIN_NODE_MAJOR || (major == MIN_NODE_MAJOR && minor < MIN_NODE_MINOR) )); then
    fail "Node.js $version is too old; Next.js 14 needs ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR} or newer."
  fi
  info "Using Node.js $version"
}

# Installs packages when node_modules is missing or older than package.json / package-lock.json.
ensure_deps() {
  if [[ ! -d node_modules ]] || [[ package.json -nt node_modules ]] || { [[ -f package-lock.json ]] && [[ package-lock.json -nt node_modules ]]; }; then
    info "Installing dependencies…"
    if [[ -f package-lock.json ]]; then npm ci || npm install; else npm install; fi
    touch node_modules
  fi
}

# True when a `next dev` process is running from this project folder (it would share .next with a build).
dev_server_running() {
  local pid cwd
  for pid in $(pgrep -f "next dev" 2>/dev/null || true); do
    if command -v lsof >/dev/null 2>&1; then
      cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1)"
    elif [[ -e "/proc/$pid/cwd" ]]; then
      cwd="$(readlink "/proc/$pid/cwd")"
    else
      cwd=""
    fi
    [[ -n "$cwd" && "$(cd "$cwd" 2>/dev/null && pwd -P)" == "$PROJECT_DIR" ]] && return 0
  done
  return 1
}

port_in_use() {
  command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1
}

print_urls() {
  info "Open http://localhost:${PORT}"
  if [[ "$HOST" == "0.0.0.0" ]]; then
    local ip
    ip="$( (ipconfig getifaddr en0 || hostname -I | awk '{print $1}') 2>/dev/null || true)"
    [[ -n "$ip" ]] && info "On your network: http://${ip}:${PORT}"
  fi
}

case "$COMMAND" in
  help|-h|--help)
    show_help
    ;;
  install)
    check_node
    info "Installing dependencies…"
    npm install
    ;;
  clean)
    dev_server_running && fail "A dev server is running from this folder; stop it before deleting .next."
    rm -rf .next
    info "Removed .next"
    ;;
  dev)
    check_node
    ensure_deps
    port_in_use && fail "Port ${PORT} is already in use. Try: PORT=3001 ./run.sh"
    print_urls
    exec npx next dev -p "$PORT" -H "$HOST"
    ;;
  build)
    check_node
    ensure_deps
    dev_server_running && fail "A dev server is running from this folder and shares .next. Stop it first, then run ./run.sh build."
    info "Building for production…"
    npx next build
    ;;
  start)
    check_node
    ensure_deps
    if [[ ! -f .next/BUILD_ID ]]; then
      dev_server_running && fail "No production build yet, and a dev server is using .next. Stop it, then run ./run.sh start."
      info "No production build found; building first…"
      npx next build
    fi
    port_in_use && fail "Port ${PORT} is already in use. Try: PORT=3001 ./run.sh start"
    print_urls
    exec npx next start -p "$PORT" -H "$HOST"
    ;;
esac
