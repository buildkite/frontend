#!/bin/bash
set -euo pipefail

echo "+++ :eslint: Running eslint"
yarn run lint

echo "👌 Looks good to me!"
