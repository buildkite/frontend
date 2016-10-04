#!/bin/bash
set -euo pipefail

echo "+++ :jest: Running Jest"
npm run test --silent

echo "👌 Looks good to me!"
