#!/usr/bin/env bash
# Build and push the site straight to Netlify.
#
# WHY THIS EXISTS
# The Netlify site serving flowstate.net.nz has no repository connected — no
# repo, no branch, no build command. Pushing to GitHub does NOT deploy it.
# That was discovered on 2026-08-16, after both /private/p/* offer pages had
# silently gone missing from the live site while still sitting in the repo.
#
# Connecting the repo in the Netlify dashboard is the proper fix and makes
# this script redundant. Until then, this is the deploy.
#
# Usage:  npm run deploy
set -euo pipefail

SITE_ID="b6a7f614-3901-4f01-9080-c66ff07d1477"   # flowstate-nz
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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

echo "→ building"
cd "$ROOT"
npm run build >/dev/null

# Guard: the parked pages are unlisted URLs sitting in prospects' inboxes.
# If a build ever drops them, stop before it reaches production.
for page in \
  "out/private/p/21-day-head-start-8f3a1c92/index.html" \
  "out/private/p/flowstate-pricing-33f2c76b/index.html" \
  "out/audit/index.html" \
  "out/audit-full/index.html"
do
  [ -f "$page" ] || { echo "✗ ABORT: $page missing from the build"; exit 1; }
done
echo "→ parked pages present"

echo "→ zipping"
ZIP=$(mktemp -t fs-deploy-XXXX).zip
( cd out && zip -qr "$ZIP" . -x ".*" )

echo "→ deploying to flowstate.net.nz"
curl -sf -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary "@$ZIP" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('  deploy', d.get('id'), '—', d.get('state'))"

rm -f "$ZIP"
echo "✓ done — https://flowstate.net.nz"
