#!/bin/bash
set -euo pipefail

echo "--- DEBUG: where is buildkite-agent?"
command -v buildkite-agent

echo "+++ :eslint: Running eslint"
yarn run lint

echo "👌 Looks good to me!"
