#!/usr/bin/env bash
# Serve the showcase site locally.
cd "$(dirname "$0")/.." || exit 1
PORT="${1:-8000}"
echo "→ http://localhost:$PORT"
exec python3 -m http.server "$PORT" --directory web
