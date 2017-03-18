#!/bin/bash
set -euo pipefail

mkdir -p tmp dist

export FRONTEND_HOST=https://example.com/
export EMOJI_HOST=https://example.com/
export NODE_ENV=production

echo "+++ :package::mag: Generating production bundle for analyzing"
yarn run build-production

echo "+++ :package::mag: Running webpack-bundle-analyzer"
yarn run bundle-analyze

echo "+++ :package::bar_chart: Analysis saved to tmp/bundle-analyzer-report.html"
echo "👍"
