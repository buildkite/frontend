#!/bin/bash
set -euo pipefail

echo "+++ :jest: Running Jest"
npm run test-with-coverage --silent

echo "👌 Looks good to me!"

echo "+++ :compression: Creating coverage archive"
tar -c -v -z -f "coverage/coverage-${BUILDKITE_ORGANIZATION_SLUG}-${BUILDKITE_PIPELINE_SLUG}-${BUILDKITE_BUILD_NUMBER}.tgz" -C "coverage/lcov-report" "."
