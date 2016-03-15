#!/bin/bash
set -e

# Add the MD5 sum of the webpack file to the host path
WEBPACK_CONFIG_MD5=$(openssl md5 webpack/config.js | sed 's/^.* //')
FRONTEND_HOST="$FRONTEND_HOST$WEBPACK_CONFIG_MD5/"

echo "--- :information_desk_person: Appending MD5 mf webpack/config.js to FRONTEND_HOST"

echo "\$FRONTEND_HOST is now $FRONTEND_HOST"

echo "--- :wastebasket: Cleaning up.."
rm -rf dist; rm -rf node_modules;

echo "--- :npm: Installing npm packages"
npm-cache install npm

echo "--- :webpack: Building webpack assets"
./node_modules/.bin/webpack -p --config webpack/config.js --progress --bail

echo "--- :javascript: Checking valid JS"
node --check dist/* && echo "👍 Javascript looks valid!"
