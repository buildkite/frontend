#!/bin/bash
set -euo pipefail

mkdir -p bundle-analysis dist

echo "--- :webpack: Building Webpack assets for production, and analysing bundle"
GENERATE_BUNDLE_REPORT=true yarn run build-production

echo "--- :javascript: Checking valid JS"
node --check dist/*.js && echo "👍 Javascript looks valid!"

echo "--- :docker: Copying to the host for artifact upload"
cp -a dist/* /host/dist
