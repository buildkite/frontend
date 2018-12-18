#!/bin/bash
set -euo pipefail

echo "--- DEBUG: Environment outside Yarn"
env

echo "+++ :eslint: Running eslint"
yarn run lint

echo "👌 Looks good to me!"
