#!/bin/bash
set -euo pipefail

mkdir -p bundle-analysis dist

# Remove anything already in dist. The Dockerfile builds the assets already,
# but not the production versions, so paths like app.js exist, and we don't
# want to deploy those to production.
rm dist/*

echo "--- :webpack: Building Webpack assets for production, and analysing bundle"
GENERATE_BUNDLE_REPORT=true yarn run build-production

echo "--- :javascript: Checking valid JS"
node --check dist/*.js && echo "👍 Javascript looks valid!"

echo "--- :docker: Copying to the host for artifact upload"
cp -a dist/* /host/dist
