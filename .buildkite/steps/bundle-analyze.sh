#!/bin/bash
set -euo pipefail

mkdir -p bundle-analysis dist

export FRONTEND_HOST=https://example.com/
export EMOJI_HOST=https://example.com/
export NODE_ENV=production

echo "+++ :package::mag: Running webpack-bundle-analyzer on a production bundle"
yarn run bundle-analyze

echo "+++ :package::bar_chart: Analysis saved to tmp/bundle-analyzer-report.html"
echo "👍"
