#!/bin/bash
set -euo pipefail

echo "+++ :flowtype: Checking types"
yarn run flow check

echo "👌 All our types check out! 😉"
