#!/bin/bash
set -euo pipefail

echo "+++ :jest: Running Jest"
npm run test-with-coverage --silent

echo "👌 Looks good to me!"
