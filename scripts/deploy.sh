#!/usr/bin/env bash
# Deploy flowstate.net.nz by asking Netlify to build the connected repo.
#
# WHY THIS SHAPE
# The site is connected to IvanOnaMission/flowstate-web (since 2026-08-17), so
# every push to main deploys on its own. This script only exists for "deploy
# what's on main right now" without waiting for a push, and it must go through
# a Netlify build: an earlier version zipped out/ and uploaded it, which ships
# the pages but silently drops netlify/functions (lead alerts, CRM sync). That
# is how the Telegram lead alerts vanished on 2026-09-21 and two leads were
# missed. Never upload a zip of out/ again.
#
# Usage:  npm run deploy
set -euo pipefail

SITE_ID="b6a7f614-3901-4f01-9080-c66ff07d1477"   # flowstate-nz
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ -n "$(git status --porcelain)" ]; then
  echo "✗ Uncommitted changes. Netlify builds from GitHub, so commit and push first:"
  git status --short
  exit 1
fi
git fetch -q origin main
if [ -n "$(git log --oneline origin/main..HEAD)" ]; then
  echo "✗ Local commits not on origin/main yet. Push first (pushing to main deploys by itself):"
  git log --oneline origin/main..HEAD
  exit 1
fi

TOKEN=$(python3 -c "
import json, pathlib, sys
p = pathlib.Path.home() / 'Library/Preferences/netlify/config.json'
if not p.exists():
    sys.exit('No Netlify config found. Log in at app.netlify.com first.')
for u in json.loads(p.read_text()).get('users', {}).values():
    t = (u.get('auth') or {}).get('token')
    if t:
        print(t); break
else:
    sys.exit('No Netlify auth token found.')
")

echo "→ asking Netlify to build origin/main"
DEPLOY=$(curl -sf -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/builds" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['deploy_id'])")

for _ in $(seq 1 60); do
  sleep 10
  STATE=$(curl -sf "https://api.netlify.com/api/v1/deploys/$DEPLOY" -H "Authorization: Bearer $TOKEN" \
    | python3 -c "import json,sys; print(json.load(sys.stdin).get('state'))")
  echo "  deploy $DEPLOY — $STATE"
  case "$STATE" in
    ready) break ;;
    error|failed) echo "✗ build failed, see app.netlify.com"; exit 1 ;;
  esac
done
[ "$STATE" = "ready" ] || { echo "✗ timed out waiting for the build"; exit 1; }

# Guard: the lead alerts and the parked offer pages must be on the live site.
for path in \
  "/.netlify/functions/lead-alert" \
  "/private/p/21-day-head-start-8f3a1c92/" \
  "/private/p/flowstate-pricing-33f2c76b/"
do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://flowstate.net.nz$path")
  [ "$CODE" != "404" ] || { echo "✗ $path is 404 on the live site"; exit 1; }
done
echo "→ functions and parked pages present"
echo "✓ done — https://flowstate.net.nz"
