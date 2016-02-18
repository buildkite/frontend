#!/bin/bash
set -e

echo "--- :npm: Installing npm packages"
rm -rf node_modules; npm-cache install npm

echo "--- :webpack: Building webpack assets"
./node_modules/.bin/webpack -p --config webpack/config.js --progress --bail
