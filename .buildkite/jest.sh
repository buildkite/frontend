#!/bin/bash
set -euo pipefail

echo "+++ :jest: Running Jest"
npm run test --silent | cat # remove 🐈 when this patch (https://github.com/facebook/jest/pull/1864) lands in Jest

echo "👌 Looks good to me!"
