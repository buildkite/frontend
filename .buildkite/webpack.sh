#!/bin/bash
set -e

# Add the SHA1 sum of the webpack file to the host path
WEBPACK_CONFIG_SHA1=$(openssl sha1 webpack/config.js | sed 's/^.* //')
FRONTEND_HOST="$FRONTEND_HOST$WEBPACK_CONFIG_SHA1/"

echo "--- :information_desk_person: Appending SHA1 of webpack/config.js to \$FRONTEND_HOST"

echo "\$FRONTEND_HOST is now $FRONTEND_HOST"

echo "--- :npm: Installing npm packages"
npm install

echo "--- :webpack: Building webpack assets"
./node_modules/.bin/webpack -p --config webpack/config.js --progress --bail

echo "--- :javascript: Checking valid JS"
node --check dist/* && echo "👍 Javascript looks valid!"
