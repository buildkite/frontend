#!/bin/bash
set -euo pipefail

echo "+++ :eslint: Running eslint"
npm run lint --silent

echo "👌 Looks good to me!"
