#!/bin/bash
set -euo pipefail

echo "+++ :jest: Running Jest"
npm run test-with-coverage --silent

echo "👌 Looks good to me!"

echo "+++ :compression: Packaging coverage report"
tar -c -v -z -f "coverage/lcov-report-${BUILDKITE_ORGANIZATION_SLUG}-${BUILDKITE_PIPELINE_SLUG}-${BUILDKITE_BUILD_NUMBER}.tgz" -C "coverage/lcov-report" "."

echo "📑 Done!"
