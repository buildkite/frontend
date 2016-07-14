#!/bin/bash
set -euo pipefail

# Add the SHA1 sum of the webpack file to the host path
WEBPACK_CONFIG_SHA1=$(openssl sha1 webpack/config.js | sed 's/^.* //')
FRONTEND_HOST="$FRONTEND_HOST$WEBPACK_CONFIG_SHA1/"

echo "--- :information_desk_person: Appending SHA1 of webpack/config.js to \$FRONTEND_HOST"

echo "\$FRONTEND_HOST is now $FRONTEND_HOST"

echo "--- :webpack: Building webpack assets for production"
npm run build-production

echo "--- :javascript: Checking valid JS"
node --check dist/* && echo "👍 Javascript looks valid!"
